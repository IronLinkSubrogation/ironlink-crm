// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🛡️ IronLink CRM | Role-Based Access Middleware
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Usage: checkRole("admin") → only allows users with role === "admin"
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = checkRole;
