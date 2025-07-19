// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IronLink CRM | Express Entry Point
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
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
const authRoutes = require("./routes/auth");     // Handles /auth/login
const userRoutes = require("./routes/user");     // Handles /user/me
const caseRoutes = require("./routes/cases");    // Handles case management

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cases", caseRoutes);

// Future Routes (to be added as we scaffold them)
// const clientRoutes = require("./routes/clients");
// const adminRoutes = require("./routes/users");
// app.use("/clients", clientRoutes);
// app.use("/users", adminRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ Health Check (for Render & monitoring)
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
