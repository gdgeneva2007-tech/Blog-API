// app.js
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const authRouter = require('./routes/auth')
// import your project routers below:
// const articlesRouter = require('./routes/articles')
const blogsRouter=require("./routes/blogs")
const myBlogsRouter=require("./routes/myBlogs")

const app = express()
const PORT = process.env.PORT || 5000

// ── CORS ──────────────────────────────────────────────
// Update origin array with your frontend URLs
app.use(
  cors({
    origin: [
      'http://localhost:5173', // Vite default port
      'http://localhost:5175',
      'http://localhost:3000', // fallback
      // add deployed frontend URL here
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── MIDDLEWARE ────────────────────────────────────────
app.use(express.json())

// ── ROUTES ────────────────────────────────────────────
app.use('/auth', authRouter)
// app.use('/your-resource', yourRouter)
app.use("/blogs",blogsRouter)
app.use("/myBlogs",myBlogsRouter)

// ── 404 ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── ERROR HANDLER ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong.' })
})

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`)
})