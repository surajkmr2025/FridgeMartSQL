# 🧊 FridgeMart SQL - Complete Setup Guide

## Quick Start

This is a full-stack e-commerce platform with React frontend, Node.js/Express backend, and MySQL database.

### Prerequisites
- Node.js v16+ 
- MySQL 8.0+
- npm or yarn

---

## 1. Database Setup

### Create MySQL Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE fridgemart;
USE fridgemart;
```

### Run SQL Schema Files
Execute the SQL files in order:
```bash
source DATABASE/users.sql;
source DATABASE/products.sql;
source DATABASE/orders.sql;
source DATABASE/order_items.sql;
source DATABASE/cart.sql;
```

**Note:** Update the admin email in `DATABASE/users.sql` if needed:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_admin_email@example.com';
```

---

## 2. Backend Setup

### Navigate to Backend Directory
```bash
cd BACKEND
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Suraj@123        # Your MySQL password
DB_NAME=fridgemart
PORT=4000
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Start Backend Server
```bash
npm start
```

**Server runs at:** `http://localhost:4000`

Test the server:
```bash
curl http://localhost:4000/test
```

---

## 3. Frontend Setup

### Navigate to Frontend Directory (New Terminal)
```bash
cd FRONTEND
```

### Install Dependencies
```bash
npm install
```

### Configure Environment (Optional)
The frontend automatically proxies `/api` requests to the backend.

### Start Frontend Dev Server
```bash
npm run dev
```

**Application opens at:** `http://localhost:5173`

---

## Application Structure

### Backend Routes

#### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/add` - Add product (Admin only)
- `PUT /api/products/update/:id` - Update product (Admin only)
- `DELETE /api/products/delete/:id` - Delete product (Admin only)

#### Cart
- `GET /api/cart/get` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart

#### Orders
- `POST /api/orders/checkout` - Place order
- `GET /api/orders/get-orders` - Get user's orders
- `GET /api/orders/get-order/:orderId` - Get order details
- `PATCH /api/orders/cancel/:orderId` - Cancel order
- `PUT /api/orders/update/:orderId` - Update order status (Admin)
- `GET /api/orders/all-orders` - Get all orders (Admin)

#### User
- `GET /api/user/get` - Get user profile
- `PUT /api/user/update` - Update profile
- `PUT /api/user/change-password` - Change password
- `GET /api/user/all-users` - Get all users (Admin)

---

## Frontend Pages

### Public Routes
- `/login` - User login
- `/signup` - User registration
- `/forgot-password` - Password recovery
- `/reset-password` - Reset password

### User Routes (Protected)
- `/` - Home/Product catalog
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/my-orders` - Order history
- `/my-orders/:orderId` - Order details
- `/profile` - User profile

### Admin Routes (Protected)
- `/add-products` - Add new product
- `/update-products` - Manage products
- `/all-orders` - View all orders
- `/all-users` - View all users

---

## Test Credentials

After running database setup, create a test admin user:

```sql
INSERT INTO users (name, email, password, phone_number, address, role) 
VALUES ('Admin', 'admin@example.com', 'hashed_password', '1234567890', '123 Admin St', 'admin');
```

Or use the signup page to create accounts.

---

## Running Both Frontend and Backend Together

From the `FRONTEND` directory, use the combined dev script:
```bash
npm run dev
```

This starts both frontend (5173) and backend (4000) simultaneously.

---

## Troubleshooting

### Backend Won't Connect to MySQL
- Check MySQL is running: `mysql -u root -p` (then `exit`)
- Verify credentials in `.env` file
- Ensure database `fridgemart` exists: `SHOW DATABASES;`

### Frontend Can't Reach Backend
- Verify backend is running on port 4000
- Check vite proxy configuration in `vite.config.js`
- Clear browser cache and restart dev server

### Port Already in Use
```bash
# Kill process on port 4000 (backend)
kill -9 $(lsof -ti:4000)

# Kill process on port 5173 (frontend)
kill -9 $(lsof -ti:5173)
```

---

## Production Build

### Frontend
```bash
cd FRONTEND
npm run build
# Deploy the `dist/` folder
```

### Backend
Set `NODE_ENV=production` in `.env` and deploy the entire BACKEND folder.

---

## Support & Debugging

- Check server console for backend errors
- Open browser DevTools (F12) for frontend errors
- Enable verbose logging by adding `console.log()` statements
- Check MySQL query logs if data isn't persisting

---

**Happy coding! 🚀**