// Routes: /export/clients, /export/claims, /export/documents
// Generates CSV exports for stored data

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

// 🔹 Helper to escape quotes
const escape = (text) => `"${(text || '').replace(/"/g, '""')}"`;

// ✅ Export Clients
router.get('/clients', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));

  const headers = ['Client Name', 'Email', 'Tag', 'Notes', 'Submitted At'];
  const rows = clients.map(c => [
    escape(c.clientName),
    escape(c.clientEmail),
    escape(c.clientTag),
    escape(c.notes),
    escape(new Date(c.timestamp).toISOString())
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=clients_export.csv');
  res.send(csv);
});

// ✅ Export Claims
router.get('/claims', (req, res) => {
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));

  const headers = ['Claim Number', 'Client Tag', 'Loss Date', 'Notes', 'Submitted At'];
  const rows = claims.map(c => [
    escape(c.claimNumber),
    escape(c.clientTag),
    escape(c.lossDate),
    escape(c.claimNotes),
    escape(new Date(c.timestamp).toISOString())
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=claims_export.csv');
  res.send(csv);
});

// ✅ Export Documents
router.get('/documents', (req, res) => {
  const documents = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'));

  const headers = ['Document Name', 'Associated Claim', 'Type', 'Notes', 'Submitted At'];
  const rows = documents.map(d => [
    escape(d.documentName),
    escape(d.associatedClaim),
    escape(d.documentType),
    escape(d.documentNotes),
    escape(new Date(d.timestamp).toISOString())
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=documents_export.csv');
  res.send(csv);
});

module.exports = router;
