const { Sequelize } = require("sequelize")
require("dotenv").config()

const DATABASE_URL = process.env.DATABASE_URL

let sequelize

if (DATABASE_URL) {
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      }
    }
  })
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === "true" ? { require: true, rejectUnauthorized: false } : false,
      }
    }
  )
}

sequelize
  .authenticate()
  .then(() => console.log("✅ Koneksi database berhasil"))
  .catch((err) => console.error("❌ Gagal konek database:", err.message))

module.exports = sequelize