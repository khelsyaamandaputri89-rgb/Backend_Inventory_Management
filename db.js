const { Sequelize } = require("sequelize");
require("dotenv").config();

const isProduction = !!process.env.DATABASE_URL;

let sequelize;

if (isProduction) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });

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
  );
  console.log("🟠 Mode: Local Development");
}

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Koneksi ke PostgreSQL berhasil!");
    await sequelize.sync({ alter: true });
    console.log("🔄 Semua model berhasil disinkronkan ke database!");
  } catch (err) {
    console.error("❌ Gagal konek ke PostgreSQL:", err.message);
  }
})();

module.exports = sequelize;