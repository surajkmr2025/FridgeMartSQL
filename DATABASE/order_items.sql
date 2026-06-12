USE fridgemart;

CREATE TABLE order_items(
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2),

    FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

ALTER TABLE order_items DROP FOREIGN KEY order_items_ibfk_2;

ALTER TABLE order_items ADD CONSTRAINT order_items_ibfk_2 FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;


