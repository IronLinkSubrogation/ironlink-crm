const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// 📁 Path to document data file
const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');

// 🛡️ Create documents.json if it doesn't exist
if (!fs.existsSync(DOCUMENTS_FILE)) {
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify([]));
}

// 📥 Handle document intake POST request
router.post('/', (req, res) => {
  const { documentName, associatedClaim, documentType, documentNotes } = req.body;

  const newDocument = {
    documentName,
    associatedClaim,
    documentType,
    documentNotes,
    timestamp: Date.now()
  };

  const documents = JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'));
  documents.push(newDocument);
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(documents, null, 2));

  console.log('✅ New document stored:', newDocument);

  res.redirect('/dashboard');
});

module.exports = router;
