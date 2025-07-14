// Routes: /export/clients, /export/claims, /export/documents
// Generates filtered CSV exports for IronLink data

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

const escape = (text) => `"${(text || '').replace(/"/g, '""')}"`;

const filterByTag = (records, tagKey, tagValue) => {
  if (!tagValue) return records;
  return records.filter(r => r[tagKey] === tagValue);
};

// ✅ Export Clients CSV
router.get('/clients', (req, res) => {
  const tag = req.query.tag || '';
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  const filtered = filterByTag(clients, 'clientTag', tag);

  const headers = ['Client Name', 'Email', 'Tag', 'Notes', 'Submitted At'];
  const rows = filtered.map(c => [
    escape(c.clientName),
    escape(c.clientEmail),
    escape(c.clientTag),
    escape(c.notes),
    escape(new Date(c.timestamp).toISOString())
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=clients_${tag || 'all'}_export.csv`);
  res.send(csv);
});

// ✅ Export Claims CSV
router.get('/claims', (req, res) => {
  const tag = req.query.tag || '';
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
  const filtered = filterByTag(claims, 'clientTag', tag);

  const headers = ['Claim Number', 'Client Tag', 'Loss Date', 'Notes', 'Submitted At'];
  const rows = filtered.map(c => [
    escape(c.claimNumber),
    escape(c.clientTag),
    escape(c.lossDate),
    escape(c.claimNotes),
    escape(new Date(c.timestamp).toISOString())
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=claims_${tag || 'all'}_export.csv`);
  res.send(csv);
});

// ✅ Export Documents CSV
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
