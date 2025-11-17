const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {User} = require("../Models") 
const nodemailer = require("nodemailer")

require("dotenv").config()

const register = async (req, res) => {
    try {
        const { username, email, password} = req.body

        if (!username || !email || !password) {
            return res.status(400).json({message : "Semua field wajib di isi!"})
        }

        const name = await User.findOne({where : {username}})
        if (name) {
            return res.status(409).json({message : "Username telah di gunakan"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username, email, password : hashedPassword, role : 'user'
        })

        const {password : pwd, ...userWithoutPassword} = user.toJSON()

        res.status(201).json({message : "Registrasi berhasil!", user : userWithoutPassword})

    } catch (error) {

        console.error(error)

        res.status(500).json({error : error.message})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({where : {email}})
        if (!user) return res.status(404).json({message : "User tidak ditemukan"})

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({message : "Password salah"})

        const {password : pwd, ...userWithoutPassword} = user.toJSON()

        const token = jwt.sign({id: user.id,username: user.username,email: user.email,role: user.role}, 
        process.env.SECRET_KEY, {expiresIn : '1d'} )

        console.log("Secret key:", process.env.SECRET_KEY);
        console.log("Login request body:", req.body);
        console.log("Found user:", user);
        console.log("Secret key:", process.env.SECRET_KEY);
        res.status(200).json({message : "Login berhasil", user : userWithoutPassword , token})
    } catch (error) {

        console.error(error)
        
        res.status(500).json({message : "Terjadi kesalahan!", error : error.message})
    }
}

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "ADA ✅" : "KOSONG ❌");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
})

const forgottenPassword = async (req, res) => {
    try {
        const {email} = req.body

        const users = await User.findOne({where : {email}})
        if (!users) return res.status(400).json({message : "Email  tidak di temukan"})

        const token = jwt.sign({id : users.id}, process.env.SECRET_KEY, {expiresIn : '1d'})

        
        const resetLink = `http://localhost:5173/reset-password?token=${token}`
        // const resetLink = `https://k-smart.vercel.app/reset-password?token=${token}`

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password K-SmartInventory",
            html: `
                <h3>Halo ${users.username},</h3>
                    <p>Kami menerima permintaan untuk mereset password akun Anda.</p>
                    <p>Klik link di bawah ini untuk mengatur ulang password Anda:</p>
                        <a href="${resetLink}" target="_blank" style="color:#b91c1c;">Reset Password</a>
                    <br><br>
                    <p>Link ini hanya berlaku selama 24 jam.</p>
            `
        }

        await transporter.sendMail(mailOptions)

        console.log("Reset link :", resetLink)

        res.json({message : "Link reset password sudah di kirim ke email"})

    } catch (error) {
        console.error(error)
        res.status(500).json({error : error.message})
    }
}

const resetPassword = async (req, res) => {
    try {
        const {token, password} = req.body

        if (!token || !password) {
            return res.status(400).json({message : "Token atau password tidak boleh kosong"})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const userId = decoded.id

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.update(
            {password : hashedPassword},
            {where : {id : userId}}
        )

        res.status(201).json({message : "Berhasil mengubah password"})
        
    } catch (error) {
        console.error(error)
        res.status(401).json({message : "Token tidak cocok atau kadaluwarsa"})
    }
}

module.exports = {register, login, forgottenPassword, resetPassword}