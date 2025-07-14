// Routes: /export/clients, /export/claims, /export/documents
// Adds optional filtering by ?tag=Carrier and ?start=Date&end=Date

const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

// 🔧 Utility: Escape quotes and wrap in CSV-safe string
const escape = (text) => `"${(text || '').replace(/"/g, '""')}"`;

// 🔧 Utility: Filter by tag field
const filterByTag = (records, tagKey, tagValue) => {
  if (!tagValue) return records;
  return records.filter(r => r[tagKey] === tagValue);
};

// 🔧 Utility: Filter by date range (timestamp field)
const filterByDate = (records, start, end) => {
  const startTime = start ? Date.parse(start) : null;
  const endTime = end ? Date.parse(end) : null;

  return records.filter(r => {
    const ts = r.timestamp;
    return (!startTime || ts >= startTime) && (!endTime || ts <= endTime);
  });
};

// ✅ Clients Export
router.get('/clients', (req, res) => {
  const { tag, start, end } = req.query;
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));

  const filtered = filterByDate(filterByTag(clients, 'clientTag', tag), start, end);

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
  res.setHeader('Content-Disposition', `attachment; filename=clients_export.csv`);
  res.send(csv);
});

// ✅ Claims Export
router.get('/claims', (req, res) => {
  const { tag, start, end } = req.query;
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));

  const filtered = filterByDate(filterByTag(claims, 'clientTag', tag), start, end);

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
  res.setHeader('Content-Disposition', `attachment; filename=claims_export.csv`);
  res.send(csv);
});

// ✅ Documents Export
router.get('/documents', (req, res) => {
  const { start, end } = req.query;
  const documents = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'));
  const filtered = filterByDate(documents, start, end);

  const headers = ['Document Name', 'Associated Claim', 'Type', 'Notes', 'Submitted At'];
  const rows = filtered.map(d => [
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
