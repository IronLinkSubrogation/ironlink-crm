// Route: /clients
// Handles POST form submissions and stores client data in /data/clients.json

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');

// Ensure storage file exists
if (!fs.existsSync(CLIENTS_FILE)) {
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify([]));
}

// Handle form submission
router.post('/', (req, res) => {
  const { clientName, clientEmail, clientTag, notes } = req.body;

  const newClient = {
    clientName,
    clientEmail,
    clientTag,
    notes,
    timestamp: Date.now()
  };

  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  clients.push(newClient);
  fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 2));

  console.log('✅ New client stored:', newClient);
  res.redirect('/dashboard');
});

module.exports = router;
