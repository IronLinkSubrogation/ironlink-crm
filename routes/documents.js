const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

// Create empty file if missing
if (!fs.existsSync(DOCUMENTS_FILE)) {
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify([]));
}

router.post('/', (req, res) => {
  const { clientIdentifier, documentTitle, documentType, notes } = req.body;

  const newDocument = {
    clientIdentifier,
    documentTitle,
    documentType,
    notes,
    timestamp: Date.now()
  };

  const documents = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'));
  documents.push(newDocument);
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));

  console.log('New document stored:', newDocument);
  res.redirect('/dashboard');
});

module.exports = router;
