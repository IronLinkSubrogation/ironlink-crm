const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

// All logged-in users can view client list
router.get("/", verifyToken, getAllClients);

// Admin-only: create client
router.post("/", verifyToken, checkRole("admin"), createClient);

// Admin-only: update client
router.put("/:id", verifyToken, checkRole("admin"), updateClient);

// Admin-only: delete client
router.delete("/:id", verifyToken, checkRole("admin"), deleteClient);

module.exports = router;
