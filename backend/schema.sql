CREATE DATABASE IF NOT EXISTS `inceshop` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `inceshop`;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` CHAR(36) NOT NULL,
  `site_name` VARCHAR(255) DEFAULT NULL,
  `logo_url` TEXT,
  `banner_image` TEXT,
  `banner_title` VARCHAR(255) DEFAULT NULL,
  `banner_subtitle` VARCHAR(255) DEFAULT NULL,
  `contact_phone` VARCHAR(100) DEFAULT NULL,
  `contact_whatsapp` VARCHAR(100) DEFAULT NULL,
  `contact_email` VARCHAR(255) DEFAULT NULL,
  `contact_address` TEXT,
  `facebook_url` VARCHAR(255) DEFAULT NULL,
  `instagram_url` VARCHAR(255) DEFAULT NULL,
  `delivery_fee` INT DEFAULT 0,
  `free_delivery_threshold` INT DEFAULT 0,
  `about_text` TEXT,
  `cgv_text` TEXT,
  `shipping_policy` TEXT,
  `return_policy` TEXT,
  `primary_color` VARCHAR(20) DEFAULT '#E8B4B8',
  `secondary_color` VARCHAR(20) DEFAULT '#D4AF37',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `categories` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `order_index` INT DEFAULT 0,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
  `id` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `short_description` TEXT,
  `description` TEXT,
  `price` INT NOT NULL,
  `original_price` INT DEFAULT 0,
  `category_id` CHAR(36) NOT NULL,
  `images` JSON,
  `is_new` TINYINT(1) DEFAULT 0,
  `is_promo` TINYINT(1) DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `stock` INT DEFAULT 0,
  `is_available` TINYINT(1) DEFAULT 1,
  `technical_details` TEXT,
  `views` INT DEFAULT 0,
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_idx` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` CHAR(36) NOT NULL,
  `order_number` VARCHAR(50) NOT NULL,
  `client_name` VARCHAR(255) NOT NULL,
  `client_phone` VARCHAR(100) NOT NULL,
  `client_email` VARCHAR(255),
  `client_address` TEXT NOT NULL,
  `notes` TEXT,
  `items` JSON NOT NULL,
  `subtotal` INT NOT NULL,
  `delivery_fee` INT NOT NULL,
  `total` INT NOT NULL,
  `status` VARCHAR(50) DEFAULT 'pending',
  `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `site_settings` (`id`, `site_name`, `banner_title`, `banner_subtitle`, `contact_phone`, `contact_email`, `contact_address`, `delivery_fee`, `free_delivery_threshold`)
VALUES
  ('settings-1', 'Ince Shop', 'Équipements professionnels de beauté', 'Découvrez une sélection premium pour votre salon', '+237 655-669-407/658-288-757', 'jcnawe@gmail.com', 'Yaoundé, Cameroun', 2000, 100000)
ON DUPLICATE KEY UPDATE `site_name`=VALUES(`site_name`);

INSERT INTO `categories` (`id`, `name`, `order_index`)
VALUES
  ('cat-1', 'Coiffure', 1),
  ('cat-2', 'Esthétique', 2),
  ('cat-3', 'Équipement', 3)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `products` (`id`, `name`, `short_description`, `description`, `price`, `original_price`, `category_id`, `images`, `is_new`, `is_promo`, `is_featured`, `stock`, `is_available`, `technical_details`, `views`)
VALUES
  ('prod-1', 'Sèche-cheveux Pro Ionic', 'Technologie ionique pour un séchage rapide', 'Un sèche-cheveux professionnel léger avec 3 niveaux de température.', 45000, 55000, 'cat-1', JSON_ARRAY('https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800'), 1, 1, 1, 12, 1, 'Puissance 2200W, câble 2m', 120),
  ('prod-2', 'Fauteuil de coiffure Deluxe', 'Confort ultime pour vos clientes', 'Fauteuil réglable en hauteur avec revêtement anti-tâche.', 180000, 0, 'cat-3', JSON_ARRAY('https://images.unsplash.com/photo-1507679622673-989605832e3d?w=800'), 0, 0, 1, 5, 1, 'Structure acier, rotation 360°', 80),
  ('prod-3', 'Kit maquillage studio', 'Palette complète pour artistes', 'Comprend 48 teintes professionnelles avec pinceaux.', 65000, 75000, 'cat-2', JSON_ARRAY('https://images.unsplash.com/photo-1505826759031-1f0a4b80a0b7?w=800'), 0, 1, 0, 20, 1, 'Pigments haute tenue', 45),
  ('prod-4', 'Lave-tête ergonomique', 'Conçu pour le confort des clients', 'Bac inclinable avec repose-cou en silicone.', 220000, 0, 'cat-3', JSON_ARRAY('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800'), 0, 0, 1, 3, 1, 'Raccordement standard, structure aluminium', 32)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

INSERT INTO `orders` (`id`, `order_number`, `client_name`, `client_phone`, `client_email`, `client_address`, `items`, `subtotal`, `delivery_fee`, `total`, `status`)
VALUES (
  'order-1',
  'CMD-123456',
  'Awa Traoré',
  '+225 05 00 00 00 00',
  'awa@example.com',
  'Cocody, Abidjan',
  JSON_ARRAY(JSON_OBJECT(
    'product_id', 'prod-1',
    'product_name', 'Sèche-cheveux Pro Ionic',
    'product_image', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
    'quantity', 1,
    'price', 45000,
    'total', 45000
  )),
  45000,
  2000,
  47000,
  'pending'
) ON DUPLICATE KEY UPDATE `order_number`=`order_number`;

INSERT INTO `users` (`id`, `full_name`, `email`, `role`)
VALUES ('user-1', 'Admin InceShop', 'jcnawe@gmail.com', 'admin')
ON DUPLICATE KEY UPDATE `full_name`=VALUES(`full_name`);

