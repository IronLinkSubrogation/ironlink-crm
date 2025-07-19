const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Add your auth route
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Health check (optional for Render)
app.get("/health", (req, res) => res.send("IronLink backend is live"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
