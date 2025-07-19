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
app.use(cors());                  // Enable cross-origin access
app.use(express.json());         // Parse JSON payloads

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Route Modules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes   = require("./routes/auth");     // Login
const userRoutes   = require("./routes/user");     // Identity check
const caseRoutes   = require("./routes/cases");    // Case management
const clientRoutes = require("./routes/clients");  // Client CRUD
const adminRoutes  = require("./routes/users");    // Admin: manage users

app.use("/auth", authRoutes);         // POST /auth/login
app.use("/user", userRoutes);         // GET /user/me
app.use("/cases", caseRoutes);        // /cases endpoints
app.use("/clients", clientRoutes);    // /clients endpoints
app.use("/users", adminRoutes);       // /users endpoints

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get("/health", (req, res) => {
  res.status(200).send("✅ IronLink backend is live");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 Start Express Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚦 Server running on port ${PORT}`);
});
