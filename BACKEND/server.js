const express = require("express");
const path = require("path");
const db = require("./Config/db");
const authRoutes = require("./Routes/auth");
const productsRoute = require("./Routes/product");
const cookieParser = require("cookie-parser");
const userRoute = require("./Routes/user");
const cartRoute = require("./Routes/cart");
const checkoutRoute = require("./Routes/orders");
const cors = require("cors");
require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = ["MYSQLHOST", "MYSQLUSER", "MYSQLDATABASE", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://fridge-mart-sql.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", checkoutRoute);

// Development test route
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("FridgeMart Backend Running (Development)");
  });
}

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../FRONTEND/dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

const PORT = process.env.PORT || 4000;

module.exports = app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
