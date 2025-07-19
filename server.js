// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IronLink CRM | Express Entry Point
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 Middleware Setup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(cors());                  // Enable Cross-Origin access
app.use(express.json());         // Parse incoming JSON payloads

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Route Modules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes = require("./routes/auth");   // Login route
const userRoutes = require("./routes/user");   // Authenticated identity check

app.use("/auth", authRoutes);    // POST /auth/login
app.use("/user", userRoutes);    // GET /user/me

// Optional: Future routes
// const caseRoutes = require("./routes/cases");
// const clientRoutes = require("./routes/clients");
// app.use("/cases", caseRoutes);
// app.use("/clients", clientRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check (for deployment & monitoring)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get("/health", (req, res) => {
  res.status(200).send("✅ IronLink backend is live");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 Server Startup
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚦 Server running on port ${PORT}`);
});
