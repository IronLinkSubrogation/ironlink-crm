const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    email: req.user.email,
    role: req.user.role,
  });
});

module.exports = router;
