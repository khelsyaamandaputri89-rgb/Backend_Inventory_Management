const { Sequelize } = require("sequelize")
require("dotenv").config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined!")
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
});

sequelize.authenticate()
  .then(() => console.log("✅ Koneksi dengan database berhasil"))
  .catch(err => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
