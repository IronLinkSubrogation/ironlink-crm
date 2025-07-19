// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IronLink CRM | Express Backend
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
app.use(cors());               // Enable CORS for frontend access
app.use(express.json());       // Parse JSON request bodies

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Route Modules
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes   = require("./routes/auth");     // Login, token generation
const userRoutes   = require("./routes/user");     // Identity: GET /user/me
const caseRoutes   = require("./routes/cases");    // Role-gated case data
const clientRoutes = require("./routes/clients");  // Admin-only client control
const adminRoutes  = require("./routes/users");    // Admin-only user management

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cases", caseRoutes);
app.use("/clients", clientRoutes);
app.use("/users", adminRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check Route
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.get("/health", (req, res) => {
  res.status(200).send("✅ IronLink backend is live");
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧼 Central Error Handler Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use((err, req, res, next) => {
  console.error("🔥 Error caught:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🚀 Start Server
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚦 Server running on port ${PORT}`);
});
