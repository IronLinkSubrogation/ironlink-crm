// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🔐 IronLink CRM | Login Controller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const jwt = require("jsonwebtoken");

// Temp login credentials until DB integration
const staticUsers = [
  { email: "admin@ironlink.com", password: "admin123", role: "admin" },
  { email: "agent@ironlink.com", password: "agent123", role: "employee" }
];

// POST /auth/login
const login = (req, res) => {
  const { email, password } = req.body;

  const user = staticUsers.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payload = {
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });

  res.status(200).json({ token });
};

module.exports = { login };
