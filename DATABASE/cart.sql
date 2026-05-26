USE fridgemart;
CREATE TABLE cart(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, product_id),

    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, 
    FOREIGN KEY(product_id) REFERENCES products(id)
);

ALTER TABLE cart DROP FOREIGN KEY cart_ibfk_2;

ALTER TABLE cart ADD CONSTRAINT cart_ibfk_2 FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE;

SELECT * FROM products;
SELECT * FROM cart;
SELECT * FROM users;