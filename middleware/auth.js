// middleware/auth.js
const jwt = require('jsonwebtoken')
const db = require('../db/queries')

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided.' })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid token format.' })
    }

    const token = parts[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await db.getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ message: 'User not found.' })
    }

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' })
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' })
    }
    next(err)
  }
}

const optionalToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      req.user = null
      return next()
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      req.user = null
      return next()
    }

    const token = parts[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await db.getUserById(decoded.userId)
    req.user = user || null
    next()
  } catch {
    req.user = null
    next()
  }
}

// Add more role-based middleware here per project:
// const verifyAdmin = (req, res, next) => { ... }

module.exports = { verifyToken, optionalToken }