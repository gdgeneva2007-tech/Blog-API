// routes/auth.js
const express = require('express')
const router = express.Router()
const {
  signupValidation,
  loginValidation,
  signup,
  login,
} = require('../controllers/authController')

router.post('/signup', signupValidation, signup)
router.post('/login', loginValidation, login)

module.exports = router