// Route: /export/clients
// Generates and downloads client data as CSV

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');

router.get('/clients', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));

  const headers = ['Client Name', 'Email', 'Tag', 'Notes', 'Submitted At'];
  const rows = clients.map(client => [
    `"${client.clientName}"`,
    `"${client.clientEmail}"`,
    `"${client.clientTag}"`,
    `"${client.notes || ''}"`,
    `"${new Date(client.timestamp).toISOString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=clients_export.csv');
  res.send(csvContent);
});

module.exports = router;
