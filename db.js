const { Sequelize } = require("sequelize")
require("dotenv").config()

const isProduction = !!process.env.DATABASE_URL

let sequelize

if (isProduction) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
    logging: false,
  })
  console.log("🟢 Mode: Production (DATABASE_URL digunakan)");
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || "inventory_dev",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    }
  )
  console.log("🟠 Mode: Local Development");
}

sequelize.authenticate()
  .then(() => console.log("✅ Koneksi ke PostgreSQL berhasil!"))
  .catch((err) => console.error("❌ Gagal konek ke PostgreSQL:", err))

module.exports = sequelize
