const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const {
  getAllCases,
  createCase,
  updateCase,
  deleteCase,
} = require("../controllers/caseController");

// 🧑‍💼 All roles can list cases
router.get("/", verifyToken, getAllCases);

// 🛠️ Only employees and admins can create cases
router.post("/", verifyToken, (req, res, next) => {
  const { role } = req.user;
  if (role === "employee" || role === "admin") {
    return createCase(req, res);
  }
  return res.status(403).json({ message: "Access denied" });
});

// 📝 Admin-only updates
router.put("/:id", verifyToken, checkRole("admin"), updateCase);

// ❌ Admin-only deletes
router.delete("/:id", verifyToken, checkRole("admin"), deleteCase);

module.exports = router;
