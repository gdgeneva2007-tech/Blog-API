// db/queries.js
const prisma = require('./prisma')

// ── REQUIRED FOR AUTH - do not remove ─────────────────

async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  })
}

async function createUser(data) {
  return await prisma.user.create({ data })
}

// ── ADD YOUR PROJECT QUERIES BELOW ────────────────────

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
}