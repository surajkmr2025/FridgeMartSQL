# 🧊 FridgeMart SQL

A modern, full-stack e-commerce platform for refrigerator sales built with React, Node.js, Express, and MySQL. Features a sleek admin dashboard, user authentication, shopping cart, and order management.

![FridgeMart Banner](https://via.placeholder.com/800x200/118AB2/FFFFFF?text=FridgeMart+SQL)

## ✨ Features

### 🛒 Customer Features
- **User Authentication**: Secure login/signup with JWT tokens
- **Product Catalog**: Browse refrigerators by brand and price
- **Shopping Cart**: Add/remove items with persistent storage
- **Order Management**: Place orders and track order history
- **Profile Management**: Update personal information and password
- **Responsive Design**: Mobile-first design with Tailwind CSS

### 👨‍💼 Admin Features
- **Dashboard Overview**: User and order statistics
- **User Management**: View all users with role-based access
- **Product Management**: Add, edit, and manage inventory
- **Order Management**: View and update order statuses
- **Analytics**: Real-time stats and insights

### 🔧 Technical Features
- **RESTful API**: Well-structured backend with proper middleware
- **Database Integration**: MySQL with optimized queries
- **Security**: Password hashing, JWT authentication, admin middleware
- **Error Handling**: Comprehensive error handling and validation
- **Toast Notifications**: User-friendly feedback with react-hot-toast

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MySQL2** - MySQL database driver
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database
- **Tables**: users, products, orders, order_items, cart

## 📁 Project Structure

```
FridgeMartSQL/
├── FRONTEND/                 # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── admin/          # Admin dashboard components
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── BACKEND/                 # Node.js backend
│   ├── Config/             # Database configuration
│   ├── Controllers/        # Route controllers
│   ├── Middleware/         # Custom middleware
│   ├── Routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json
├── DATABASE/               # SQL schema files
│   ├── users.sql
│   ├── products.sql
│   ├── orders.sql
│   ├── order_items.sql
│   └── cart.sql
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/FridgeMartSQL.git
cd FridgeMartSQL
```

### 2. Database Setup
1. Create a MySQL database named `fridgemart`
2. Run the SQL files in the `DATABASE/` folder in order:
   ```sql
   -- Run these in MySQL Workbench or command line
   source DATABASE/users.sql;
   source DATABASE/products.sql;
   source DATABASE/orders.sql;
   source DATABASE/order_items.sql;
   source DATABASE/cart.sql;
   ```

### 3. Backend Setup
```bash
cd BACKEND
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials:
# DB_HOST=localhost
# DB_USER=your_mysql_user
# DB_PASSWORD=your_mysql_password
# DB_NAME=fridgemart
# JWT_SECRET=your_jwt_secret_key
# PORT=4000

npm start
```

### 4. Frontend Setup
```bash
cd ../FRONTEND
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000

## � Deploying to the Internet
You have two recommended deployment patterns:

1. Full-stack deploy on one host
   - Build the frontend: `cd FRONTEND && npm install && npm run build`
   - Deploy the backend and serve the frontend `dist` from `BACKEND/server.js`
   - Use a service like Render, Railway, Fly.io, or Heroku
   - Configure environment variables for the backend: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `PORT`

2. Separate frontend + backend hosting
   - Host the backend on Railway, Render, or Fly.io
   - Host the frontend on Vercel, Netlify, or Cloudflare Pages
   - Set `VITE_API_BASE_URL` in the frontend deployment to your backend URL
   - Example: `https://api.example.com/api`

### Recommended services
- Backend: Render, Railway, Fly.io, or Railway Postgres / MySQL add-on
- Frontend: Vercel, Netlify, Cloudflare Pages
- Database: PlanetScale, Railway MySQL, ClearDB, or any managed MySQL instance

### Production checklist
- Replace hard-coded DB values with environment variables in `BACKEND/Config/db.js`
- Set `JWT_SECRET` in backend configuration
- Run frontend build before deploying in production
- If using separate hosts, ensure CORS is allowed on your backend and `VITE_API_BASE_URL` is configured in frontend deployment

## �📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
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
```

### Products Table
```sql
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders & Cart Tables
- `orders`: Order headers with user and total information
- `order_items`: Individual items within orders
- `cart`: Shopping cart items for logged-in users

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### User Management
- `GET /api/user/get` - Get user profile
- `PUT /api/user/update` - Update user profile
- `PUT /api/user/change-password` - Change password
- `GET /api/user/all-users` - Get all users (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/add` - Add new product (Admin only)
- `PUT /api/products/update/:id` - Update product (Admin only)
- `DELETE /api/products/delete/:id` - Delete product (Admin only)

### Orders
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/all-orders` - Get all orders (Admin only)
- `PUT /api/orders/update/:id` - Update order status (Admin only)
- `POST /api/orders/place-order` - Place new order

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart

## 🎨 UI Components

### Key Components
- **Navbar**: Responsive navigation with admin/user modes
- **ProductCard**: Product display with add-to-cart functionality
- **CartSidebar**: Sliding cart with quantity controls
- **AdminOrders**: Order management dashboard
- **AdminUsers**: User management interface
- **ProfilePage**: User profile with tabs for info and security

### Design System
- **Colors**: Blue (#118AB2) and Caribbean Green (#06D6A0) theme
- **Typography**: Inter font family with proper hierarchy
- **Shadows**: Subtle shadows for depth and modern feel
- **Animations**: Smooth transitions and micro-interactions

## 🔐 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication with expiration
- **Admin Middleware**: Role-based access control
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized queries

## 🧪 Testing

### Backend Testing
```bash
cd BACKEND
npm test
```

### Frontend Testing
```bash
cd FRONTEND
npm run lint
```

## 🚀 Deployment

### Environment Variables

**Backend (.env in BACKEND folder):**
```env
PORT=4000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
MYSQLHOST=your-mysql-host
MYSQLPORT=3306
MYSQLUSER=your-mysql-user
MYSQLPASSWORD=your-mysql-password
MYSQLDATABASE=fridgemart
JWT_SECRET=your-secure-random-string
```

**Frontend (.env in FRONTEND folder):**
```env
# Leave empty if frontend and backend are on same domain
# Otherwise, set to your backend URL (e.g., https://api.yourdomain.com)
VITE_API_BASE_URL=
```

### Option 1: Single Host Deployment (Recommended)

Build and deploy everything from the backend:

```bash
# Build frontend first
cd FRONTEND
npm install
npm run build

# Start backend (serves frontend from ../FRONTEND/dist)
cd ../BACKEND
npm install
NODE_ENV=production npm start
```

### Option 2: Separate Hosting

Deploy frontend and backend separately:

**Frontend (Vercel/Netlify):**
```bash
cd FRONTEND
npm install
npm run build
# Set VITE_API_BASE_URL in your hosting platform to your backend URL
# Deploy the dist/ folder
```

**Backend (Railway/Render/Fly.io):**
```bash
cd BACKEND
npm install
# Set all environment variables in your hosting platform
NODE_ENV=production npm start
```

### Important Production Notes

1. **CORS**: Set `FRONTEND_URL` in backend .env to your frontend domain
2. **Database**: Ensure MySQL is accessible from your backend host
3. **JWT_SECRET**: Use a strong random string (min 32 characters)
4. **NODE_ENV**: Must be set to `production` for static file serving

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Use meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** and **Vite** for the amazing developer experience
- **Tailwind CSS** for the utility-first approach
- **MySQL** for reliable database operations
- **Express.js** for the robust backend framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ for modern e-commerce solutions**