# What is inside:

✓ Express + Prisma + JWT + CORS
✓ ESLint + Prettier configured
✓ authController (signup + login with JWT)
✓ verifyToken + optionalToken middleware
✓ User model in schema
✓ All queries starter
✓ app.js with CORS and JSON middleware
Change per project:
→ Add your models to schema.prisma
→ Add your queries to queries.js
→ Add your routes and controllers
→ Update CORS origin list

# What to maintian,what to configure, what the actual work is

MAINTAIN (copy as-is, never edit):
middleware/auth.js ← verifyToken, optionalToken never change
controllers/authController.js ← signup/login logic never changes
routes/auth.js ← /auth/signup, /auth/login never change
db/prisma.js ← one line, never changes

CONFIGURE ONCE PER PROJECT (edit during setup only):
app.js ← add your routers, update CORS origins
.env ← your database URL, JWT secret
prisma/schema.prisma ← add your models

ADD NEW FILES PER PROJECT (your actual work):
controllers/[resource].js ← your business logic
routes/[resource].js ← your routes
db/queries.js ← add your queries below the template ones
