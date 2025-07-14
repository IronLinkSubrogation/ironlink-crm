// Route: /dashboard
// Displays submitted clients, sorted by most recent first

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');

router.get('/', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));

  // 🔽 Sort clients by timestamp (newest first)
  const sortedClients = clients.sort((a, b) => b.timestamp - a.timestamp);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>IronLink CRM — Dashboard</title>
      <link rel="stylesheet" href="styles.css" />
    </head>
    <body>
      <h1>📋 Submitted Clients</h1>
      <nav>
        <a href="/clients">Submit New Client</a>
        <a href="/claims">Submit Claim</a>
        <a href="/documents">Submit Document</a>
      </nav>
      <hr />
  `;

  sortedClients.forEach((client, index) => {
    html += `
      <div style="margin-bottom: 20px;">
        <strong>${index + 1}. ${client.clientName}</strong><br />
        Email: ${client.clientEmail}<br />
        Tag: ${client.clientTag}<br />
        Notes: ${client.notes || 'None'}<br />
        Submitted: ${new Date(client.timestamp).toLocaleString()}
      </div>
    `;
  });

  html += `</body></html>`;
  res.send(html);
});

module.exports = router;
