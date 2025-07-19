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

router.get("/", verifyToken, checkRole("admin"), getAllUsers);
router.post("/", verifyToken, checkRole("admin"), createUser);
router.put("/:id", verifyToken, checkRole("admin"), updateUser);
router.delete("/:id", verifyToken, checkRole("admin"), deleteUser);

module.exports = router;
