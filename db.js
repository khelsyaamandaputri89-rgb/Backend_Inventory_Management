const { Sequelize } = require("sequelize")
const config = require("./src/config/config.json")
require("dotenv").config()

const isProduction = process.env.RAILWAY_ENVIRONMENT === "production" || process.env.NODE_ENV === "production"

let sequelize

if (isProduction) {

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, 
      },
    },
  })
} else {
    const config = require("./src/config/config.json")["development"]
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: "postgres",
        logging: true, 
      }
    )
  }

  sequelize.authenticate()
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection failed:", err));

module.exports = sequelize
