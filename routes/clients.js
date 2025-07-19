const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientsController");

// GET /clients
router.get("/", verifyToken, checkRole("admin"), getAllClients);

// POST /clients
router.post("/", verifyToken, checkRole("admin"), createClient);

// PUT /clients/:id
router.put("/:id", verifyToken, checkRole("admin"), updateClient);

// DELETE /clients/:id
router.delete("/:id", verifyToken, checkRole("admin"), deleteClient);

module.exports = router;
