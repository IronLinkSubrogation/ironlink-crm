const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  getAllCases,
  createCase,
  updateCase,
  deleteCase,
} = require("../controllers/casesController");

// GET /cases
router.get("/", verifyToken, getAllCases);

// POST /cases
router.post("/", verifyToken, createCase);

// PUT /cases/:id
router.put("/:id", verifyToken, updateCase);

// DELETE /cases/:id
router.delete("/:id", verifyToken, deleteCase);

module.exports = router;
