const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 Multer Setup for Uploads
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

/*===========================
  POST: Upload Document
===========================*/
app.post('/documents', upload.single('document'), (req, res) => {
  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    date: new Date().toISOString(),
    client: req.body.client || null,
    claimNumber: req.body.claimNumber || null
  };

  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let docs = [];
  if (fs.existsSync(docsPath)) {
    docs = JSON.parse(fs.readFileSync(docsPath));
  }

  docs.push(fileData);
  fs.writeFileSync(docsPath, JSON.stringify(docs, null, 2));

  res.redirect('/dashboard.html');
});

/*===========================
  POST: Submit Claim
===========================*/
app.post('/claims', (req, res) => {
  const claimData = {
    client: req.body.client,
    claimNumber: req.body.claimNumber,
    description: req.body.description,
    stage: req.body.stage,
    notes: req.body.notes || "",
    submittedAt: new Date().toISOString()
  };

  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = [];
  if (fs.existsSync(claimsPath)) {
    claims = JSON.parse(fs.readFileSync(claimsPath));
  }

  claims.push(claimData);
  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));

  res.send('Claim submitted successfully.');
});

/*===========================
  GET: All Clients
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
  GET: Claims — Filter by client and/or stage
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
  GET: Documents — Filter by client
===========================*/
app.get('/documents', (req, res) => {
  const clientName = req.query.client;
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let docs = [];
  if (fs.existsSync(docsPath)) {
    docs = JSON.parse(fs.readFileSync(docsPath));
  }

  if (!clientName) return res.json(docs);

  const filtered = docs.filter(doc =>
    doc.client && doc.client.toLowerCase() === clientName.toLowerCase()
  );

  res.json(filtered);
});

/*===========================
  Start Server
===========================*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
