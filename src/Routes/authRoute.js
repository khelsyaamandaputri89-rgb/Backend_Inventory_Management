const express = require("express")
const router = express.Router()
const {register, login, forgottenPassword, resetPassword } = require("../Controllers/authController")

router.post("/register", register)

router.post("/login", login)

router.post("/forgot-password", forgottenPassword)

router.post("/reset-password", resetPassword)

module.exports = router