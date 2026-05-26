const mysql = require("mysql2");

if (process.env.NODE_ENV === "test") {
  module.exports = {
    query: () => {},
  };
} else {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "fridgemart",
    password: "Suraj@123",
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