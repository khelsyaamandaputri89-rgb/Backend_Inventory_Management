const { Sequelize } = require("sequelize")
require("dotenv").config()

const isProduction = process.env.DATABASE_URL

let sequelize

if (isProduction) {
   sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
         ssl: {
            require: true, 
            rejectUnauthorized: false 
         }
      }
   })
} else {
   const config = require("./src/config/config.json") ["development"]
   sequelize = new Sequelize (
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
         host : process.env.DB_HOST,
         port : process.env.DB_PORT,
         dialect : "postgres",
         logging : false
      }
   )
}

sequelize.authenticate()
   .then(() => console.log('koneksi dengan database berhasil'))
   .catch(err => console.log('Error:' + err))

module.exports = sequelize;