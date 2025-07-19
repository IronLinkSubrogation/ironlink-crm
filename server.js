const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load .env variables

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// 🔗 Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

app.use("/auth", authRoutes);   // POST /auth/login
app.use("/user", userRoutes);   // GET /user/me

// ✅ Health check for deployment platforms
app.get("/health", (req, res) => {
  res.status(200).send("IronLink backend is live");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔌 Server running on port ${PORT}`);
});
