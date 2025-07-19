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
// 🔧 Global Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(cors());
app.use(express.json());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Route Modules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes = require("./routes/auth");         // POST /auth/login
const userRoutes = require("./routes/user");         // GET /user/me
const caseRoutes = require("./routes/cases");        // Full case management
const clientRoutes = require("./routes/clients");    // Full client management

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cases", caseRoutes);
app.use("/clients", clientRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check (for Render & uptime tools)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get("/health", (req, res) => {
  res.status(200).send("✅ IronLink backend is live");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 Start Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚦 Server running on port ${PORT}`);
});
