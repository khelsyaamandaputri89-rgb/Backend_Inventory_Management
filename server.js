const app = require("./app")
const db = require("./src/Models")

const PORT = process.env.PORT || 3000

console.log("PORT dari Railway:", process.env.PORT);

;(async () => {
  try {
    await db.sequelize.authenticate()
    console.log("🟢 Database connected")

    await db.sequelize.sync({ alter: true })
    console.log("🔄 Models synced (tabel otomatis diperbarui)")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server berjalan di port ${PORT}`)
    })
  } catch (err) {
    console.error("❌ DB Error:", err.message)
  }
})()