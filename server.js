// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IronLink CRM | Backend Entry Point
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(cors());
app.use(express.json());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Route Modules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes   = require("./routes/auth");     // Login route
const userRoutes   = require("./routes/user");     // Identity check
const caseRoutes   = require("./routes/cases");    // Case management
const clientRoutes = require("./routes/clients");  // Client dashboard data
const adminRoutes  = require("./routes/users");    // Admin-only user control

app.use("/auth", authRoutes);         // POST /auth/login
app.use("/user", userRoutes);         // GET /user/me
app.use("/cases", caseRoutes);        // Case CRUD with role restrictions
app.use("/clients", clientRoutes);    // Client CRUD for admins
app.use("/users", adminRoutes);       // Admin user CRUD

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check Endpoint
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
