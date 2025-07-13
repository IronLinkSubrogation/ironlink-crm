const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

router.get('/', (req, res) => {
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));

  const html = `
    <html>
      <head>
        <title>View Claims</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Recovery Claims</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/clients">Clients</a>
          <a href="/claims">Submit Claim</a>
        </nav>
        <ul>
          ${claims.map(claim => `
            <li>
              <strong>${claim.claimType}</strong> — $${claim.amount.toFixed(2)}<br/>
              Linked to: ${claim.clientIdentifier}<br/>
              Status: ${claim.status}<br/>
              Notes: ${claim.notes || '—'}<br/>
              Submitted: ${new Date(claim.timestamp).toLocaleString()}
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
