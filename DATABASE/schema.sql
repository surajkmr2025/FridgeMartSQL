CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(75) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    reset_token VARCHAR(10) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    brand VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2),
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

INSERT INTO products (name, brand, description, price, image_url)
VALUES
    ('Samsung 324L Double Door Refrigerator', 'Samsung', 'Convertible double-door refrigerator with digital inverter cooling and spacious storage.', 38990.00, '/assets/images/samsung 324.webp'),
    ('LG 687L Side-by-Side Refrigerator', 'LG', 'Premium side-by-side refrigerator with large capacity, multi-air flow, and smart inverter compressor.', 89990.00, '/assets/images/LG 687.webp'),
    ('Haier 310L Frost Free Refrigerator', 'Haier', 'Energy-efficient frost-free refrigerator with stabilizer-free operation and rapid cooling.', 32990.00, '/assets/images/haier 310.webp'),
    ('Whirlpool 280L Triple Door Refrigerator', 'Whirlpool', 'Triple-door refrigerator with active fresh zone and advanced moisture retention.', 34990.00, '/assets/images/whirlpool 280.webp'),
    ('Godrej 270L Double Door Refrigerator', 'Godrej', 'Reliable double-door refrigerator with toughened glass shelves and efficient cooling.', 28490.00, '/assets/images/godrej-270.webp'),
    ('Samsung 260L Double Door Refrigerator', 'Samsung', 'Compact double-door refrigerator with all-around cooling and digital inverter technology.', 29990.00, '/assets/images/samsung260.webp'),
    ('LG 190L Single Door Refrigerator', 'LG', 'Single-door refrigerator with direct cool technology and smart inverter compressor.', 16990.00, '/assets/images/LG 190.webp'),
    ('Haier 190L Single Door Refrigerator', 'Haier', 'Affordable single-door refrigerator with quick ice making and efficient storage.', 14990.00, '/assets/images/haier 190.webp'),
    ('Whirlpool 265L Double Door Refrigerator', 'Whirlpool', 'Frost-free double-door refrigerator with adaptive intelligence and fresh flow air tower.', 31990.00, '/assets/images/whirlpool 265.webp'),
    ('Godrej 190L Single Door Refrigerator', 'Godrej', 'Durable single-door refrigerator with large vegetable tray and efficient cooling.', 15490.00, '/assets/images/Godrej-190.webp')
ON DUPLICATE KEY UPDATE
    brand = VALUES(brand),
    description = VALUES(description),
    price = VALUES(price),
    image_url = VALUES(image_url);
