const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

router.get('/', (req, res) => {
  const searchQuery = req.query.q?.toLowerCase() || '';
  const selectedTag = req.query.tag || '';

  const highlight = (text) => {
    if (!searchQuery || typeof text !== 'string') return text;
    return text.replace(new RegExp(`(${searchQuery})`, 'gi'), '<mark>$1</mark>');
  };

  const allClients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  const filteredClients = allClients.filter(c =>
    (selectedTag === '' || c.clientTag === selectedTag) &&
    (
      c.clientName.toLowerCase().includes(searchQuery) ||
      c.clientEmail.toLowerCase().includes(searchQuery) ||
      c.clientTag.toLowerCase().includes(searchQuery) ||
      (c.notes || '').toLowerCase().includes(searchQuery)
    )
  ).sort((a, b) => b.timestamp - a.timestamp);

  const allClaims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
  const filteredClaims = allClaims.filter(c =>
    (selectedTag === '' || c.clientTag === selectedTag) &&
    (
      c.claimNumber.toLowerCase().includes(searchQuery) ||
      c.clientTag.toLowerCase().includes(searchQuery) ||
      c.lossDate.toLowerCase().includes(searchQuery) ||
      (c.claimNotes || '').toLowerCase().includes(searchQuery)
    )
  ).sort((a, b) => b.timestamp - a.timestamp);

  const allDocs = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'));
  const filteredDocs = allDocs.filter(d =>
    (
      d.documentName.toLowerCase().includes(searchQuery) ||
      d.associatedClaim.toLowerCase().includes(searchQuery) ||
      d.documentType.toLowerCase().includes(searchQuery) ||
      (d.documentNotes || '').toLowerCase().includes(searchQuery)
    )
  ).sort((a, b) => b.timestamp - a.timestamp);

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

      <form method="GET" action="/dashboard" style="margin-top:20px;">
        <label for="search">🔍 Search All Entries:</label>
        <input type="text" id="search" name="q" value="${searchQuery}" placeholder="Search by name, email, tag..." />

        <label for="tag" style="margin-left:20px;">🏷️ Filter by Tag:</label>
        <select name="tag" id="tag">
          <option value="">All Tags</option>
          <option value="StateFarm"${selectedTag === 'StateFarm' ? ' selected' : ''}>StateFarm</option>
          <option value="Allianz"${selectedTag === 'Allianz' ? ' selected' : ''}>Allianz</option>
          <option value="LibertyMutual"${selectedTag === 'LibertyMutual' ? ' selected' : ''}>LibertyMutual</option>
          <option value="Geico"${selectedTag === 'Geico' ? ' selected' : ''}>Geico</option>
          <!-- Add other tags here if needed -->
        </select>

        <button type="submit" style="margin-left:20px;">Apply</button>
      </form>

      <h2>📁 Clients</h2>
      <div class="entry-list">
  `;

  filteredClients.forEach((client, i) => {
    html += `
      <div class="entry">
        <strong>${i + 1}. ${highlight(client.clientName)}</strong><br />
        Email: ${highlight(client.clientEmail)}<br />
        Tag: ${highlight(client.clientTag)}<br />
        Notes: ${highlight(client.notes || 'None')}<br />
        Submitted: ${new Date(client.timestamp).toLocaleString()}
      </div>
    `;
  });

  html += `
      </div>
      <h2>🧾 Claims</h2>
      <div class="entry-list">
  `;

  filteredClaims.forEach((claim, i) => {
    html += `
      <div class="entry">
        <strong>${i + 1}. Claim #${highlight(claim.claimNumber)}</strong><br />
        Client Tag: ${highlight(claim.clientTag)}<br />
        Loss Date: ${highlight(claim.lossDate)}<br />
        Notes: ${highlight(claim.claimNotes || 'None')}<br />
        Submitted: ${new Date(claim.timestamp).toLocaleString()}
      </div>
    `;
  });

  html += `
      </div>
      <h2>📎 Documents</h2>
      <div class="entry-list">
  `;

  filteredDocs.forEach((doc, i) => {
    html += `
      <div class="entry">
        <strong>${i + 1}. ${highlight(doc.documentName)}</strong><br />
        Claim #: ${highlight(doc.associatedClaim)}<br />
        Type: ${highlight(doc.documentType)}<br />
        Notes: ${highlight(doc.documentNotes || 'None')}<br />
        Submitted: ${new Date(doc.timestamp).toLocaleString()}
      </div>
    `;
  });

  html += `
      </div>
    </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;
