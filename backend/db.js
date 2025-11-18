import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

const defaultData = {
  siteSettings: [
    {
      id: "settings-1",
      site_name: "Beauté Store",
      banner_title: "Équipements professionnels de beauté",
      banner_subtitle: "Découvrez une sélection premium pour votre salon",
      contact_phone: "+225 07 00 00 00 00",
      contact_email: "contact@beautestore.ci",
      contact_address: "Abidjan, Côte d'Ivoire",
      facebook_url: "https://facebook.com",
      instagram_url: "https://instagram.com",
      delivery_fee: 2000,
      free_delivery_threshold: 100000,
      about_text: "Beauté Store vous accompagne dans le développement de votre salon.",
      cgv_text: "Conditions générales de vente par défaut.",
      shipping_policy: "Livraison en 2 à 5 jours ouvrés.",
      return_policy: "Retours acceptés sous 7 jours.",
      primary_color: "#E8B4B8",
      secondary_color: "#D4AF37",
      created_date: new Date().toISOString(),
    },
  ],
  categories: [
    { id: "cat-1", name: "Coiffure", order: 1, created_date: new Date().toISOString() },
    { id: "cat-2", name: "Esthétique", order: 2, created_date: new Date().toISOString() },
    { id: "cat-3", name: "Équipement", order: 3, created_date: new Date().toISOString() },
  ],
  products: [
    {
      id: "prod-1",
      name: "Sèche-cheveux Pro Ionic",
      short_description: "Technologie ionique pour un séchage rapide",
      description: "Un sèche-cheveux professionnel léger avec 3 niveaux de température.",
      price: 45000,
      original_price: 55000,
      category_id: "cat-1",
      images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800"],
      is_new: true,
      is_promo: true,
      is_featured: true,
      stock: 12,
      is_available: true,
      technical_details: "Puissance 2200W, câble 2m",
      views: 120,
      created_date: new Date().toISOString(),
    },
    {
      id: "prod-2",
      name: "Fauteuil de coiffure Deluxe",
      short_description: "Confort ultime pour vos clientes",
      description: "Fauteuil réglable en hauteur avec revêtement anti-tâche.",
      price: 180000,
      original_price: 0,
      category_id: "cat-3",
      images: ["https://images.unsplash.com/photo-1507679622673-989605832e3d?w=800"],
      is_new: false,
      is_promo: false,
      is_featured: true,
      stock: 5,
      is_available: true,
      technical_details: "Structure acier, rotation 360°",
      views: 80,
      created_date: new Date().toISOString(),
    },
    {
      id: "prod-3",
      name: "Kit maquillage studio",
      short_description: "Palette complète pour artistes",
      description: "Comprend 48 teintes professionnelles avec pinceaux.",
      price: 65000,
      original_price: 75000,
      category_id: "cat-2",
      images: ["https://images.unsplash.com/photo-1505826759031-1f0a4b80a0b7?w=800"],
      is_new: false,
      is_promo: true,
      is_featured: false,
      stock: 20,
      is_available: true,
      technical_details: "Pigments haute tenue",
      views: 45,
      created_date: new Date().toISOString(),
    },
    {
      id: "prod-4",
      name: "Lave-tête ergonomique",
      short_description: "Conçu pour le confort des clients",
      description: "Bac inclinable avec repose-cou en silicone.",
      price: 220000,
      original_price: 0,
      category_id: "cat-3",
      images: ["https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800"],
      is_new: false,
      is_promo: false,
      is_featured: true,
      stock: 3,
      is_available: true,
      technical_details: "Raccordement standard, structure aluminium",
      views: 32,
      created_date: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: "order-1",
      order_number: "CMD-123456",
      client_name: "Awa Traoré",
      client_phone: "+225 05 00 00 00 00",
      client_email: "awa@example.com",
      client_address: "Cocody, Abidjan",
      items: [
        {
          product_id: "prod-1",
          product_name: "Sèche-cheveux Pro Ionic",
          product_image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
          quantity: 1,
          price: 45000,
          total: 45000,
        },
      ],
      subtotal: 45000,
      delivery_fee: 2000,
      total: 47000,
      notes: "",
      status: "pending",
      created_date: new Date().toISOString(),
    },
  ],
  users: [
    {
      id: "user-1",
      full_name: "Admin InceShop",
      email: "admin@inceshop.local",
      role: "admin",
    },
  ],
};

export const loadDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2), "utf-8");
  }

  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
};

export const saveDb = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

