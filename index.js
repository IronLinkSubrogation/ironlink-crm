const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer Setup for Document Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// 🔄 POST: Upload Document
app.post('/documents', upload.single('document'), (req, res) => {
  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    date: new Date().toISOString(),
    client: req.body.client || null
  };

  const dataFile = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });

  let documents = [];
  if (fs.existsSync(dataFile)) {
    documents = JSON.parse(fs.readFileSync(dataFile));
  }

  documents.push(fileData);
  fs.writeFileSync(dataFile, JSON.stringify(documents, null, 2));

  res.redirect('/dashboard.html');
});

// 📥 POST: Submit Claim with Stage
app.post('/claims', (req, res) => {
  const claimData = {
    client: req.body.client,
    claimNumber: req.body.claimNumber,
    description: req.body.description,
    stage: req.body.stage,
    submittedAt: new Date().toISOString()
  };

  const claimsFile = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsFile), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsFile)) {
    claims = JSON.parse(fs.readFileSync(claimsFile));
  }

  claims.push(claimData);
  fs.writeFileSync(claimsFile, JSON.stringify(claims, null, 2));

  res.send('Claim submitted successfully.');
});

// 👤 GET: All Clients
app.get('/clients', (req, res) => {
  const clientsFile = path.join(__dirname, 'data', 'clients.json');
  fs.mkdirSync(path.dirname(clientsFile), { recursive: true });

  let clients = [];
  if (fs.existsSync(clientsFile)) {
    clients = JSON.parse(fs.readFileSync(clientsFile));
  }

  res.json(clients);
});

// 📊 GET: Claims (Optional Filter by Client Name)
app.get('/claims', (req, res) => {
  const clientName = req.query.client;
  const claimsFile = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsFile), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsFile)) {
    claims = JSON.parse(fs.readFileSync(claimsFile));
  }

  if (!clientName) {
    return res.json(claims);
  }

  const filtered = claims.filter(c =>
    c.client.toLowerCase() === clientName.toLowerCase()
  );

  res.json(filtered);
});

// 📁 GET: Documents (Optional Filter by Client Name)
app.get('/documents', (req, res) => {
  const clientName = req.query.client;
  const documentsFile = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(documentsFile), { recursive: true });

  let documents = [];
  if (fs.existsSync(documentsFile)) {
    documents = JSON.parse(fs.readFileSync(documentsFile));
  }

  if (!clientName) {
    return res.json(documents);
  }

  const filtered = documents.filter(doc =>
    doc.client && doc.client.toLowerCase() === clientName.toLowerCase()
  );

  res.json(filtered);
});

// 🚀 Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
