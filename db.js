const { Sequelize } = require("sequelize");
require("dotenv").config();

const { DATABASE_URL } = process.env;

const db = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: false
  }
});

module.exports = db;