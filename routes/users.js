const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// GET /users
// Admin-only: Returns list of all users
router.get("/", verifyToken, checkRole("admin"), getAllUsers);

// POST /users
// Admin-only: Creates a new user
router.post("/", verifyToken, checkRole("admin"), createUser);

// PUT /users/:id
// Admin-only: Updates user by ID
router.put("/:id", verifyToken, checkRole("admin"), updateUser);

// DELETE /users/:id
// Admin-only: Deletes user by ID
router.delete("/:id", verifyToken, checkRole("admin"), deleteUser);

module.exports = router;
