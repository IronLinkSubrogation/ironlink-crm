// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 IronLink CRM | JWT Verification Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const jwt = require("jsonwebtoken");

// Protects routes by validating JWT and attaching user data to req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("⛔ JWT verification failed:", err);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
