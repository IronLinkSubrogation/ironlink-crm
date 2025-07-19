const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

// GET /user/me
// Returns the email and role of the authenticated user
router.get("/me", verifyToken, (req, res) => {
  if (!req.user || !req.user.email || !req.user.role) {
    return res.status(401).json({ message: "Invalid or missing token payload" });
  }

  res.status(200).json({
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;
