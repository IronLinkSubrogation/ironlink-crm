const express = require('express');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const router = express.Router();

const CLIENTS_FILE = path.join(__dirname, '..', 'data', 'clients.json');
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

function generatePDF(res, title, fields) {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title.replace(/\s+/g, '_')}.pdf`);
  doc.pipe(res);

  doc.fontSize(20).text(title, { underline: true });
  doc.moveDown();

  fields.forEach(([label, value]) => {
    doc.font('Helvetica-Bold').fontSize(12).text(label + ':', { continued: true });
    doc.font('Helvetica').text(' ' + (value || 'N/A'));
    doc.moveDown(0.5);
  });

  doc.end();
}

// ✅ Route: /generate-pdf/client/:id
router.get('/client/:id', (req, res) => {
  const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
  const entry = clients.find(c => String(c.timestamp) === req.params.id);
  if (!entry) return res.status(404).send('Client not found');

  generatePDF(res, `Client Summary — ${entry.clientName}`, [
    ['Name', entry.clientName],
    ['Email', entry.clientEmail],
    ['Tag', entry.clientTag],
    ['Notes', entry.notes],
    ['Submitted At', new Date(entry.timestamp).toLocaleString()]
  ]);
});

// ✅ Route: /generate-pdf/claim/:id
router.get('/claim/:id', (req, res) => {
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
  const entry = claims.find(c => String(c.timestamp) === req.params.id);
  if (!entry) return res.status(404).send('Claim not found');

  generatePDF(res, `Claim Packet — #${entry.claimNumber}`, [
    ['Claim Number', entry.claimNumber],
    ['Client Tag', entry.clientTag],
    ['Loss Date', entry.lossDate],
    ['Notes', entry.claimNotes],
    ['Submitted At', new Date(entry.timestamp).toLocaleString()]
  ]);
});

module.exports = router;
