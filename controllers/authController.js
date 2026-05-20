// controllers/authController.js
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db/queries')
const { body, validationResult } = require('express-validator')

const signupValidation = [
  body('firstName').trim().notEmpty().withMessage('First name required.'),
  body('lastName').trim().notEmpty().withMessage('Last name required.'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),
]

const loginValidation = [
  body('email').trim().isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password required.'),
]

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const existing = await db.getUserByEmail(req.body.email)
    if (existing) {
      return res.status(400).json({ message: 'Email already in use.' })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const user = await db.createUser({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    })

    res.status(201).json({
      message: 'Account created.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const user = await db.getUserByEmail(req.body.email)
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(401).json({ message: 'Incorrect email or password.' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { signupValidation, loginValidation, signup, login }