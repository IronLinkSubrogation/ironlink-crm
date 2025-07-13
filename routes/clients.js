const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// 📁 Path to client data file
const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');

// 🛡️ Ensure clients.json exists
if (!fs.existsSync(CLIENTS_FILE)) {
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify([]));
}

// 📨 Handle POST from clients.html
router.post('/', (req, res) => {
  const { clientName, clientEmail, clientTag, notes } = req.body;

  const newClient = {
    clientName,
    clientEmail,
    clientTag,
    notes,
    timestamp: Date.now()
  };

  // Load current list, add new client, then save
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  clients.push(newClient);
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2));

  console.log('✅ New client stored:', newClient);

  // Redirect to dashboard (or confirmation page later)
  res.redirect('/dashboard');
});

module.exports = router;
