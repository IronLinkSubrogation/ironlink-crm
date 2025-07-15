const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 Multer Setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/*===========================
  POST: Submit a new claim
===========================*/
app.post('/claims', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsPath)) {
    claims = JSON.parse(fs.readFileSync(claimsPath));
  }

  const newClaim = {
    client: req.body.client,
    claimNumber: req.body.claimNumber,
    description: req.body.description,
    stage: req.body.stage,
    notes: req.body.notes || "",
    submittedAt: new Date().toISOString()
  };

  claims.push(newClaim);
  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));

  res.send('Claim submitted successfully.');
});

/*===========================
  POST: Update an existing claim
===========================*/
app.post('/claims/update', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsPath)) {
    claims = JSON.parse(fs.readFileSync(claimsPath));
  }

  const index = claims.findIndex(c => c.claimNumber === req.body.claimNumber);

  if (index === -1) {
    return res.status(404).send('Claim not found.');
  }

  claims[index].description = req.body.description;
  claims[index].stage = req.body.stage;
  claims[index].notes = req.body.notes;
  claims[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
  res.send('Claim updated successfully.');
});

/*===========================
  POST: Upload a document
===========================*/
app.post('/documents', upload.single('document'), (req, res) => {
  const documentsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(documentsPath), { recursive: true });

  let documents = [];
  if (fs.existsSync(documentsPath)) {
    documents = JSON.parse(fs.readFileSync(documentsPath));
  }

  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    date: new Date().toISOString(),
    client: req.body.client || null,
    claimNumber: req.body.claimNumber || null
  };

  documents.push(fileData);
  fs.writeFileSync(documentsPath, JSON.stringify(documents, null, 2));

  res.redirect('/dashboard.html');
});

/*===========================
  GET: All clients
===========================*/
app.get('/clients', (req, res) => {
  const clientsPath = path.join(__dirname, 'data', 'clients.json');
  fs.mkdirSync(path.dirname(clientsPath), { recursive: true });

  let clients = [];
  if (fs.existsSync(clientsPath)) {
    clients = JSON.parse(fs.readFileSync(clientsPath));
  }

  res.json(clients);
});

/*===========================
  GET: Claims (filtered by client and/or stage)
===========================*/
app.get('/claims', (req, res) => {
  const clientName = req.query.client;
  const stageFilter = req.query.stage;
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsPath)) {
    claims = JSON.parse(fs.readFileSync(claimsPath));
  }

  if (clientName) {
    claims = claims.filter(c =>
      c.client.toLowerCase() === clientName.toLowerCase()
    );
  }

  if (stageFilter) {
    claims = claims.filter(c =>
      c.stage.toLowerCase() === stageFilter.toLowerCase()
    );
  }

  res.json(claims);
});

/*===========================
  GET: Documents (filtered by client)
===========================*/
app.get('/documents', (req, res) => {
  const clientName = req.query.client;
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let documents = [];
  if (fs.existsSync(docsPath)) {
    documents = JSON.parse(fs.readFileSync(docsPath));
  }

  if (!clientName) return res.json(documents);

  const filteredDocs = documents.filter(doc =>
    doc.client && doc.client.toLowerCase() === clientName.toLowerCase()
  );

  res.json(filteredDocs);
});

/*===========================
  Start Server
===========================*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
