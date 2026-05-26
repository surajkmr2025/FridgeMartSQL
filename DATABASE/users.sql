USE fridgemart;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    password VARCHAR(75) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
UPDATE users SET role = 'admin' WHERE email = 'surajkumar44727@gmail.com';

ALTER TABLE users 
ADD COLUMN reset_token VARCHAR(10) DEFAULT NULL,
ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;
SELECT * FROM users;