// Route: /dashboard
// Displays submitted clients, claims, and documents sorted by newest first

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

router.get('/', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8')).sort((a, b) => b.timestamp - a.timestamp);
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8')).sort((a, b) => b.timestamp - a.timestamp);
  const documents = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8')).sort((a, b) => b.timestamp - a.timestamp);

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
      <h1>📊 IronLink CRM Dashboard</h1>
      <nav>
        <a href="/clients">Submit Client</a>
        <a href="/claims">Submit Claim</a>
        <a href="/documents">Submit Document</a>
      </nav>
      <hr />

      <h2>📁 Clients</h2>
  `;

  clients.forEach((client, i) => {
    html += `
      <div>
        <strong>${i + 1}. ${client.clientName}</strong><br />
        Email: ${client.clientEmail}<br />
        Tag: ${client.clientTag}<br />
        Notes: ${client.notes || 'None'}<br />
        Submitted: ${new Date(client.timestamp).toLocaleString()}
      </div><hr />
    `;
  });

  html += `<h2>🧾 Claims</h2>`;
  claims.forEach((claim, i) => {
    html += `
      <div>
        <strong>${i + 1}. Claim #${claim.claimNumber}</strong><br />
        Client Tag: ${claim.clientTag}<br />
        Loss Date: ${claim.lossDate}<br />
        Notes: ${claim.claimNotes || 'None'}<br />
        Submitted: ${new Date(claim.timestamp).toLocaleString()}
      </div><hr />
    `;
  });

  html += `<h2>📎 Documents</h2>`;
  documents.forEach((doc, i) => {
    html += `
      <div>
        <strong>${i + 1}. ${doc.documentName}</strong><br />
        Claim #: ${doc.associatedClaim}<br />
        Type: ${doc.documentType}<br />
        Notes: ${doc.documentNotes || 'None'}<br />
        Submitted: ${new Date(doc.timestamp).toLocaleString()}
      </div><hr />
    `;
  });

  html += `</body></html>`;
  res.send(html);
});

module.exports = router;
