const app = require("./app.js")
const sequelize = require("./db.js")

const PORT = process.env.PORT || 3000

console.log("PORT dari Railway:", process.env.PORT);

(async () => {
  try {
    await sequelize.authenticate()
    console.log("🟢 Database connected")

    await sequelize.sync()
    console.log("🔄 Models synced (tabel otomatis diperbarui)")

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di port ${PORT}`)
    })
  } catch (err) {
    console.error("❌ DB Error:", err)
  }
})()