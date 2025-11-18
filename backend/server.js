import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { loadDb, saveDb } from "./db.js";

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

let db = loadDb();
const persist = () => saveDb(db);

const parseFilterValue = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  const numberValue = Number(value);
  if (!Number.isNaN(numberValue) && value !== "") {
    return numberValue;
  }
  return value;
};

const sortItems = (items, sort) => {
  if (!sort) return items;

  const sortKeyMap = {
    "price_asc": { key: "price", direction: "asc" },
    "price_desc": { key: "price", direction: "desc" },
    "-views": { key: "views", direction: "desc" },
  };

  const config =
    sortKeyMap[sort] || {
      key: sort.replace(/^-/, ""),
      direction: sort.startsWith("-") ? "desc" : "asc",
    };

  return [...items].sort((a, b) => {
    const aValue = a[config.key] ?? 0;
    const bValue = b[config.key] ?? 0;
    if (aValue === bValue) return 0;
    return config.direction === "asc"
      ? aValue > bValue ? 1 : -1
      : aValue < bValue ? 1 : -1;
  });
};

const filterItems = (items, filters = {}) => {
  const { sort, limit, ...rest } = filters;
  const filterKeys = Object.keys(rest);
  if (filterKeys.length === 0) {
    return items;
  }

  return items.filter((item) =>
    filterKeys.every((key) => {
      const expected = parseFilterValue(rest[key]);
      if (expected === undefined || expected === "") {
        return true;
      }
      return String(item[key]) === String(expected);
    })
  );
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Settings
app.get("/api/settings", (_req, res) => {
  res.json(db.siteSettings ?? []);
});

app.post("/api/settings", (req, res) => {
  const newSettings = {
    ...req.body,
    id: randomUUID(),
    created_date: new Date().toISOString(),
  };
  db.siteSettings = [newSettings];
  persist();
  res.status(201).json(newSettings);
});

app.put("/api/settings/:id", (req, res) => {
  const index = db.siteSettings.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Paramètres introuvables" });
  }
  db.siteSettings[index] = {
    ...db.siteSettings[index],
    ...req.body,
  };
  persist();
  res.json(db.siteSettings[index]);
});

// Categories
app.get("/api/categories", (req, res) => {
  const { sort = "order" } = req.query;
  const categories = sortItems(db.categories ?? [], sort);
  res.json(categories);
});

app.post("/api/categories", (req, res) => {
  const category = {
    ...req.body,
    id: randomUUID(),
    created_date: new Date().toISOString(),
  };
  db.categories.push(category);
  persist();
  res.status(201).json(category);
});

app.put("/api/categories/:id", (req, res) => {
  const index = db.categories.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Catégorie introuvable" });
  }
  db.categories[index] = {
    ...db.categories[index],
    ...req.body,
  };
  persist();
  res.json(db.categories[index]);
});

app.delete("/api/categories/:id", (req, res) => {
  db.categories = db.categories.filter((item) => item.id !== req.params.id);
  persist();
  res.status(204).end();
});

// Products
app.get("/api/products", (req, res) => {
  let products = filterItems(db.products ?? [], req.query);
  products = sortItems(products, req.query.sort);

  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  if (limit) {
    products = products.slice(0, limit);
  }

  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = db.products.find((item) => item.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const product = {
    ...req.body,
    id: randomUUID(),
    created_date: new Date().toISOString(),
  };
  db.products.push(product);
  persist();
  res.status(201).json(product);
});

app.put("/api/products/:id", (req, res) => {
  const index = db.products.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Produit introuvable" });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
  };
  persist();
  res.json(db.products[index]);
});

app.delete("/api/products/:id", (req, res) => {
  db.products = db.products.filter((item) => item.id !== req.params.id);
  persist();
  res.status(204).end();
});

// Orders
app.get("/api/orders", (req, res) => {
  let orders = filterItems(db.orders ?? [], req.query);
  orders = sortItems(orders, req.query.sort || "-created_date");
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  if (limit) {
    orders = orders.slice(0, limit);
  }
  res.json(orders);
});

app.get("/api/orders/:id", (req, res) => {
  const order = db.orders.find((item) => item.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Commande introuvable" });
  }
  res.json(order);
});

app.post("/api/orders", (req, res) => {
  const order = {
    ...req.body,
    id: randomUUID(),
    created_date: new Date().toISOString(),
  };
  db.orders.unshift(order);
  persist();
  res.status(201).json(order);
});

app.put("/api/orders/:id", (req, res) => {
  const index = db.orders.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Commande introuvable" });
  }
  db.orders[index] = {
    ...db.orders[index],
    ...req.body,
  };
  persist();
  res.json(db.orders[index]);
});

// Auth
app.get("/api/auth/me", (_req, res) => {
  const user = db.users?.[0];
  if (!user) {
    return res.status(404).json({ message: "Utilisateur introuvable" });
  }
  res.json(user);
});

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

app.listen(PORT, () => {
  console.log(`Backend API démarrée sur http://localhost:${PORT}`);
});

