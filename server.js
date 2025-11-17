const app = require("./app")
const sequelize = require("./db")

const PORT = process.env.PORT || 8080

;(async () => {
  try {
    await sequelize.authenticate()
    console.log("🟢 Database connected")

    await sequelize.sync()
    console.log("🔄 Models synced")

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server berjalan di port ${PORT}`)
    })
  } catch (err) {
    console.error("❌ DB Error:", err.message)
  }
})()