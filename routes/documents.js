const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DOCUMENTS_FILE = path.join(__dirname, '..', 'data', 'documents.json');
const UPLOAD_FOLDER = path.join(__dirname, '..', 'public', 'uploads');

// ✅ Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.get('/', (req, res) => {
  res.send(`
    <h1>📎 Submit Document</h1>
    <form method="POST" enctype="multipart/form-data">
      <label>Document Name:</label><br />
      <input name="documentName" required /><br /><br />

      <label>Associated Claim #:</label><br />
      <input name="associatedClaim" required /><br /><br />

      <label>Document Type:</label><br />
      <input name="documentType" /><br /><br />

      <label>Notes:</label><br />
      <textarea name="documentNotes"></textarea><br /><br />

      <label>Upload File:</label><br />
      <input type="file" name="uploadedFile" /><br /><br />

      <button type="submit">Submit Document</button>
    </form>
  `);
});

router.post('/', upload.single('uploadedFile'), (req, res) => {
  const allDocs = fs.existsSync(DOCUMENTS_FILE)
    ? JSON.parse(fs.readFileSync(DOCUMENTS_FILE, 'utf-8'))
    : [];

  const newDoc = {
    documentName: req.body.documentName,
    associatedClaim: req.body.associatedClaim,
    documentType: req.body.documentType,
    documentNotes: req.body.documentNotes,
    timestamp: Date.now(),
    uploadedFile: req.file ? `/uploads/${req.file.filename}` : null
  };

  allDocs.push(newDoc);
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(allDocs, null, 2));
  res.redirect('/dashboard');
});

module.exports = router;
