const mysql = require("mysql2");

if (process.env.NODE_ENV === "test") {
  module.exports = {
    query: () => {},
  };
} else {
  const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    database: process.env.DB_NAME || "fridgemart",
    password: process.env.DB_PASSWORD || "",
  });

  db.connect((err) => {
    if (err) {
      console.log("Database connection failed:", err);
    } else {
      console.log("Connected to MySQL database");
    }
  });

  module.exports = db;
}
