require("dotenv").config()
const express = require("express")
const cors = require("cors")

const sequelize = require("./db")
const authRouter = require("./src/Routes/authRoute")
const userRouter = require("./src/Routes/userRoute")
const productRouter = require("./src/Routes/productRoute")
const orderRouter = require("./src/Routes/orderRoute")
const orderItemRouter = require("./src/Routes/orderItemRoute")
const categoryRouter = require("./src/Routes/categoryRoute")
const reportRouter = require("./src/Routes/reportRoute")
const stockRouter = require("./src/Routes/stockRoute")
const dashboardRouter = require("./src/Routes/dashboardRoute")
const searchRouter = require("./src/Routes/searchRoute")

const app = express()
const PORT = process.env.PORT || 8080

const corsOptions = {
  origin: [
            "https://frontendinventory-management.vercel.app",
            "http://localhost:5173"
  ], 
  methods: ["GET","HEAD","PUT","PATCH","POST","DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}

app.use(cors(corsOptions))

app.options(/.*/, cors(corsOptions))

app.use(express.json())

app.get("/", (req, res) => {
  res.send("Backend API is running");
})

app.use("/api/auth", authRouter)

app.use("/api/dashboard", dashboardRouter)

app.use("/api/users", userRouter)

app.use("/api/products", productRouter)

app.use("/api/orders", orderRouter)

app.use("/api/order-items", orderItemRouter)

app.use("/api/categories", categoryRouter)

app.use("/api/reports", reportRouter)

app.use("/api/stocks", stockRouter)

app.use("/api/search", searchRouter)

sequelize.authenticate()
  .then(async () => {
    console.log("✅ Koneksi ke PostgreSQL berhasil!");
    await sequelize.sync()
    console.log("🔄 Semua model berhasil disinkronkan ke database!");

    app.listen(PORT,"0.0.0.0", () => {
      console.log(`🚀 Server berjalan di port ${PORT} (listening on 0.0.0.0)`);
    })

    process.on("unhandledRejection", (reason) => {
      console.error("❌ Unhandled Rejection:", reason);
    })

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
    })

    setInterval(() => {
      console.log("⏳ Keep-alive ping...");
    }, 15000)
  })
  .catch((err) => {
    console.error("❌ Gagal konek ke PostgreSQL:", err.message);
  })