const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

router.get('/', (req, res) => {
  const searchQuery = req.query.q?.toLowerCase() || '';

  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'))
    .filter(c =>
      c.clientName.toLowerCase().includes(searchQuery) ||
      c.clientEmail.toLowerCase().includes(searchQuery) ||
      c.clientTag.toLowerCase().includes(searchQuery)
    )
    .sort((a, b) => b.timestamp - a.timestamp);

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

      <form method="GET" action="/dashboard" style="margin-top:20px;">
        <label for="search">🔍 Search Clients:</label>
        <input type="text" id="search" name="q" value="${searchQuery}" placeholder="Name, Email, or Tag" />
        <button type="submit">Search</button>
      </form>

      <h2>📁 Clients</h2>
      <div class="entry-list">
  `;

  clients.forEach((client, i) => {
    html += `
      <div class="entry">
        <strong>${i + 1}. ${client.clientName}</strong><br />
        Email: ${client.clientEmail}<br />
        Tag: ${client.clientTag}<br />
        Notes: ${client.notes || 'None'}<br />
        Submitted: ${new Date(client.timestamp).toLocaleString()}
      </div>
    `;
  });

  html += `<h2>🧾 Claims</h2><div class="entry-list">`;
  claims.forEach((claim, i) => {
    html += `
      <div class="entry">
       
