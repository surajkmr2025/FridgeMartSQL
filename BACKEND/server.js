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

const app = express();

//allow request from frontend
// app.use(cors());

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

// parse json body
app.use(express.json());

app.use(cookieParser());
// Routes
app.get("/test", (req, res) => {
  res.status(200).json({
    msg: "You are on test route",
  });
});

//auth route
app.use("/api/auth", authRoutes);

//Product route
app.use("/api/products", productsRoute);
//user route
app.use("/api/user", userRoute);
//cart route
app.use("/api/cart", cartRoute);
//checkout route
app.use("/api/orders", checkoutRoute);

// Test Route (only in development)
if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.send("FridgeMart Backend Running ");
  });
}

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../FRONTEND/dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API route not found" });
    }
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
