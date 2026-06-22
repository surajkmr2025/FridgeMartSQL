const mysql = require("mysql2");
require("dotenv").config();

if (process.env.NODE_ENV === "test") {
  module.exports = {
    query: () => {},
  };
} else {
  const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT),
    user: process.env.MYSQLUSER ,
    database: process.env.MYSQLDATABASE,
    password: process.env.MYSQLPASSWORD,
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
