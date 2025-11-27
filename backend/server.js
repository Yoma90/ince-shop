import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { query } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(uploadDir));

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const toBoolean = (value) => value === true || value === 1 || value === "1" || value === "true";
const parseJSON = (value, fallback) => {
  if (!value) return fallback;
  try {
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return fallback;
  }
};

const normalizeProduct = (row) => ({
  ...row,
  price: Number(row.price ?? 0),
  original_price: Number(row.original_price ?? 0),
  stock: Number(row.stock ?? 0),
  views: Number(row.views ?? 0),
  is_new: Boolean(row.is_new),
  is_promo: Boolean(row.is_promo),
  is_featured: Boolean(row.is_featured),
  is_available: Boolean(row.is_available),
  images: parseJSON(row.images, []),
});

const normalizeCategory = (row) => ({
  ...row,
  order: Number(row.order_index ?? 0),
});

const normalizeSetting = (row) => ({
  ...row,
  delivery_fee: Number(row.delivery_fee ?? 0),
  free_delivery_threshold: Number(row.free_delivery_threshold ?? 0),
});

const normalizeOrder = (row) => ({
  ...row,
  subtotal: Number(row.subtotal ?? 0),
  delivery_fee: Number(row.delivery_fee ?? 0),
  total: Number(row.total ?? 0),
  items: parseJSON(row.items, []),
});

const pick = (payload, fields) =>
  fields.reduce((acc, field) => {
    if (payload[field] !== undefined) {
      acc[field] = payload[field];
    }
    return acc;
  }, {});

const createInsert = (table, data) => {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => "?");
  return {
    sql: `INSERT INTO ${table} (${columns.map((c) => `\`${c}\``).join(", ")}) VALUES (${placeholders.join(", ")})`,
    values: columns.map((col) => data[col]),
  };
};

const createUpdate = (table, data, id) => {
  const columns = Object.keys(data);
  const assignments = columns.map((c) => `\`${c}\` = ?`);
  return {
    sql: `UPDATE ${table} SET ${assignments.join(", ")} WHERE id = ?`,
    values: [...columns.map((col) => data[col]), id],
  };
};

const parseLimit = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const buildFilters = (filters, allowed) => {
  const clauses = [];
  const values = [];
  Object.entries(filters).forEach(([key, value]) => {
    if (!(key in allowed)) return;
    if (value === undefined || value === "") return;
    const column = allowed[key];
    let parsedValue = value;
    if (value === "true" || value === "false") {
      parsedValue = value === "true" ? 1 : 0;
    }
    clauses.push(`${column} = ?`);
    values.push(parsedValue);
  });
  return {
    clause: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
};

const productSortMap = {
  "-created_date": "created_date DESC",
  "price_asc": "price ASC",
  "price_desc": "price DESC",
  "-views": "views DESC",
  default: "created_date DESC",
};

const orderSortMap = {
  "-created_date": "created_date DESC",
  "created_date": "created_date ASC",
};

const categorySortMap = {
  order: "order_index ASC",
  "-created_date": "created_date DESC",
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Settings
app.get("/api/settings", asyncHandler(async (_req, res) => {
  const rows = await query("SELECT * FROM site_settings ORDER BY created_date DESC");
  res.json(rows.map(normalizeSetting));
}));

app.post("/api/settings", asyncHandler(async (req, res) => {
  const id = randomUUID();
  const payload = pick(req.body, [
    "site_name",
    "logo_url",
    "banner_image",
    "banner_title",
    "banner_subtitle",
    "contact_phone",
    "contact_whatsapp",
    "contact_email",
    "contact_address",
    "facebook_url",
    "instagram_url",
    "delivery_fee",
    "free_delivery_threshold",
    "about_text",
    "cgv_text",
    "shipping_policy",
    "return_policy",
    "primary_color",
    "secondary_color",
  ]);
  const insert = createInsert("site_settings", { id, ...payload, created_date: new Date() });
  await query(insert.sql, insert.values);
  const [row] = await query("SELECT * FROM site_settings WHERE id = ?", [id]);
  res.status(201).json(normalizeSetting(row));
}));

app.put("/api/settings/:id", asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payload = pick(req.body, [
    "site_name",
    "logo_url",
    "banner_image",
    "banner_title",
    "banner_subtitle",
    "contact_phone",
    "contact_whatsapp",
    "contact_email",
    "contact_address",
    "facebook_url",
    "instagram_url",
    "delivery_fee",
    "free_delivery_threshold",
    "about_text",
    "cgv_text",
    "shipping_policy",
    "return_policy",
    "primary_color",
    "secondary_color",
  ]);
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }
  const update = createUpdate("site_settings", payload, id);
  const result = await query(update.sql, update.values);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Paramètres introuvables" });
  }
  const [row] = await query("SELECT * FROM site_settings WHERE id = ?", [id]);
  res.json(normalizeSetting(row));
}));

// Categories
app.get("/api/categories", asyncHandler(async (req, res) => {
  const sortKey = req.query.sort && categorySortMap[req.query.sort]
    ? categorySortMap[req.query.sort]
    : categorySortMap.order;
  const rows = await query(`SELECT * FROM categories ORDER BY ${sortKey}`);
  res.json(rows.map(normalizeCategory));
}));

app.post("/api/categories", asyncHandler(async (req, res) => {
  const id = randomUUID();
  const payload = pick(req.body, ["name", "description", "order_index"]);
  const insert = createInsert("categories", { id, ...payload, created_date: new Date() });
  await query(insert.sql, insert.values);
  const [row] = await query("SELECT * FROM categories WHERE id = ?", [id]);
  res.status(201).json(normalizeCategory(row));
}));

app.put("/api/categories/:id", asyncHandler(async (req, res) => {
  const id = req.params.id;
  const payload = pick(req.body, ["name", "description", "order_index"]);
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }
  const update = createUpdate("categories", payload, id);
  const result = await query(update.sql, update.values);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Catégorie introuvable" });
  }
  const [row] = await query("SELECT * FROM categories WHERE id = ?", [id]);
  res.json(normalizeCategory(row));
}));

app.delete("/api/categories/:id", asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM categories WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Catégorie introuvable" });
  }
  res.status(204).end();
}));

// Products
const productFields = [
  "name",
  "short_description",
  "description",
  "price",
  "original_price",
  "category_id",
  "images",
  "is_new",
  "is_promo",
  "is_featured",
  "stock",
  "is_available",
  "technical_details",
  "views",
];

const prepareProductPayload = (body) => {
  const payload = pick(body, productFields);
  ["is_new", "is_promo", "is_featured", "is_available"].forEach((key) => {
    if (payload[key] !== undefined) {
      payload[key] = toBoolean(payload[key]) ? 1 : 0;
    }
  });
  if (payload.images !== undefined) {
    payload.images = JSON.stringify(payload.images || []);
  }
  return payload;
};

app.get("/api/products", asyncHandler(async (req, res) => {
  const { sort, limit, ...filters } = req.query;
  const { clause, values } = buildFilters(filters, {
    id: "id",
    category_id: "category_id",
    is_available: "is_available",
  });
  const sortSql = sort && productSortMap[sort] ? productSortMap[sort] : productSortMap.default;
  const limitValue = parseLimit(limit);
  const sql = `SELECT * FROM products ${clause} ORDER BY ${sortSql}${limitValue ? " LIMIT ?" : ""}`;
  const rows = await query(sql, limitValue ? [...values, limitValue] : values);
  res.json(rows.map(normalizeProduct));
}));

app.get("/api/products/:id", asyncHandler(async (req, res) => {
  const [row] = await query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  if (!row) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  res.json(normalizeProduct(row));
}));

app.post("/api/products", asyncHandler(async (req, res) => {
  const id = randomUUID();
  const payload = prepareProductPayload(req.body);
  const insert = createInsert("products", { id, ...payload, created_date: new Date() });
  await query(insert.sql, insert.values);
  const [row] = await query("SELECT * FROM products WHERE id = ?", [id]);
  res.status(201).json(normalizeProduct(row));
}));

app.put("/api/products/:id", asyncHandler(async (req, res) => {
  const payload = prepareProductPayload(req.body);
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }
  const update = createUpdate("products", payload, req.params.id);
  const result = await query(update.sql, update.values);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  const [row] = await query("SELECT * FROM products WHERE id = ?", [req.params.id]);
  res.json(normalizeProduct(row));
}));

app.delete("/api/products/:id", asyncHandler(async (req, res) => {
  const result = await query("DELETE FROM products WHERE id = ?", [req.params.id]);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  res.status(204).end();
}));

// Orders
const orderFields = [
  "order_number",
  "client_name",
  "client_phone",
  "client_email",
  "client_address",
  "notes",
  "items",
  "subtotal",
  "delivery_fee",
  "total",
  "status",
];

const prepareOrderPayload = (body) => {
  const payload = pick(body, orderFields);
  if (payload.items !== undefined) {
    payload.items = JSON.stringify(payload.items || []);
  }
  return payload;
};

app.get("/api/orders", asyncHandler(async (req, res) => {
  const { sort = "-created_date", limit, ...filters } = req.query;
  const { clause, values } = buildFilters(filters, { status: "status" });
  const sortSql = orderSortMap[sort] || orderSortMap["-created_date"];
  const limitValue = parseLimit(limit);
  const sql = `SELECT * FROM orders ${clause} ORDER BY ${sortSql}${limitValue ? " LIMIT ?" : ""}`;
  const rows = await query(sql, limitValue ? [...values, limitValue] : values);
  res.json(rows.map(normalizeOrder));
}));

app.get("/api/orders/:id", asyncHandler(async (req, res) => {
  const [row] = await query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  if (!row) {
    return res.status(404).json({ message: "Commande introuvable" });
  }
  res.json(normalizeOrder(row));
}));

app.post("/api/orders", asyncHandler(async (req, res) => {
  const id = randomUUID();
  const payload = prepareOrderPayload(req.body);
  const insert = createInsert("orders", { id, ...payload, created_date: new Date() });
  await query(insert.sql, insert.values);
  const [row] = await query("SELECT * FROM orders WHERE id = ?", [id]);
  res.status(201).json(normalizeOrder(row));
}));

app.put("/api/orders/:id", asyncHandler(async (req, res) => {
  const payload = prepareOrderPayload(req.body);
  if (!Object.keys(payload).length) {
    return res.status(400).json({ message: "Aucune donnée à mettre à jour" });
  }
  const update = createUpdate("orders", payload, req.params.id);
  const result = await query(update.sql, update.values);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: "Commande introuvable" });
  }
  const [row] = await query("SELECT * FROM orders WHERE id = ?", [req.params.id]);
  res.json(normalizeOrder(row));
}));

// Auth
app.get("/api/auth/me", asyncHandler(async (_req, res) => {
  const rows = await query("SELECT * FROM users LIMIT 1");
  if (!rows.length) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
  res.json(rows[0]);
}));

app.post("/api/auth/logout", (_req, res) => {
  res.json({ success: true });
});

// Integrations
app.post("/api/integrations/email", (req, res) => {
  const messagesPath = path.join(__dirname, "messages.log");
  const payload = {
    ...req.body,
    created_date: new Date().toISOString(),
  };
  fs.appendFileSync(messagesPath, JSON.stringify(payload) + "\n", "utf-8");
  res.json({ success: true });
});

app.post("/api/uploads", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Fichier manquant" });
  }
  const file_url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(201).json({ file_url });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Erreur serveur" });
});

app.listen(PORT, () => {
  console.log(`Backend API démarrée sur http://localhost:${PORT}`);
});

