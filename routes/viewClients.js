const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_FILE = path.join(__dirname, '..', 'data', 'clients.json');

router.get('/', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

  // Generate basic HTML to display client data
  const html = `
    <html>
      <head>
        <title>View Clients</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <h1>Stored Clients</h1>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/clients">Intake Form</a>
        </nav>
        <ul>
          ${clients.map(client => `
            <li>
              <strong>${client.name}</strong> (${client.email})<br/>
              Tag: ${client.caseTag}<br/>
              Notes: ${client.notes}<br/>
              Submitted: ${new Date(client.timestamp).toLocaleString()}
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
