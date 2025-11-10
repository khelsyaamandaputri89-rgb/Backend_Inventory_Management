const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use DATABASE_URL (Railway) or DATABASE_PUBLIC_URL as fallback
const DATABASE_URL =
  process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;

let sequelize;

if (DATABASE_URL) {
  // Production / Railway
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
    }
  );
}

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Koneksi dengan database berhasil"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
