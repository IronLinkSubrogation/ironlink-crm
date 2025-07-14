const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// 📁 Path to client data file
const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');

// 🛡️ Create clients.json if it doesn't exist
if (!fs.existsSync(CLIENTS_FILE)) {
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify([]));
}

// 📥 Handle client intake POST request
router.post('/', (req, res) => {
  const { clientName, clientEmail, clientTag, notes } = req.body;

  const newClient = {
    clientName,
    clientEmail,
    clientTag,
    notes,
    timestamp: Date.now()
  };

  // Read existing clients, append new, save updated list
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  clients.push(newClient);
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2));

  console.log('✅ New client stored:', newClient);

  // Redirect to dashboard (we’ll build it later)
  res.redirect('/dashboard');
});

module.exports = router;
