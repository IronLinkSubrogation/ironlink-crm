// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🧠 IronLink CRM | Express Backend
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();
const app = express();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔧 Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
app.use(cors());
app.use(express.json());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔗 Routes
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const authRoutes   = require("./routes/auth");
const userRoutes   = require("./routes/user");     // GET /user/me
const caseRoutes   = require("./routes/cases");
const clientRoutes = require("./routes/clients");
const adminRoutes  = require("./routes/users");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/cases", caseRoutes);
app.use("/clients", clientRoutes);
app.use("/users", adminRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔍 Health Check
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
