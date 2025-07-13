const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

router.get('/', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));

  const html = `
    <html>
      <head>
        <title>IronLink Dashboard</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>IronLink CRM — Dashboard</h1>
        <nav>
          <a href="/clients">Add Client</a>
          <a href="/view-clients">View Clients (${clients.length})</a>
          <a href="/claims">Submit Claim</a>
          <a href="/view-claims">View Claims (${claims.length})</a>
        </nav>
        <p>Total Clients: ${clients.length}</p>
        <p>Total Claims: ${claims.length}</p>
      </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
