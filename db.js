const { Sequelize } = require("sequelize")
const config = require("./src/config/config.json")
require("dotenv").config()

let sequelize

if (process.env.NODE_ENV === "production") {

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
    sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

module.exports = sequelize
