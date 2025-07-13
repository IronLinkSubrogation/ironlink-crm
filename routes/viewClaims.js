const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

router.get('/', (req, res) => {
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));

  // Group claims by status for optional summary
  const statusCounts = claims.reduce((acc, claim) => {
    acc[claim.status] = (acc[claim.status] || 0) + 1;
    return acc;
  }, {});

  const html = `
    <html>
      <head>
        <title>View Recovery Claims</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Recovery Claims Overview</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/claims">Submit Claim</a>
        </nav>
        <section>
          <p>Total Claims: ${claims.length}</p>
          <p>Open: ${statusCounts.Open || 0} | Pending: ${statusCounts.Pending || 0} | Closed: ${statusCounts.Closed || 0}</p>
        </section>
        <ul>
          ${claims.map(claim => `
            <li>
              <strong>${claim.claimType}</strong> — <span style="color: green;">$${claim.amount.toFixed(2)}</span><br/>
              <em>Client:</em> ${claim.clientIdentifier}<br/>
              <em>Status:</em> <span style="font-weight:bold;">${claim.status}</span><br/>
              <em>Notes:</em> ${claim.notes || '—'}<br/>
              <em>Submitted:</em> ${new Date(claim.timestamp).toLocaleString()}
              <hr/>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
