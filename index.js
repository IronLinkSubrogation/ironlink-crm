const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { stringify } = require('csv-stringify/sync');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/* ===========================
   POST: Submit New Claim
=========================== */
app.post('/claims', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  claims.push({
    client: req.body.client,
    claimNumber: req.body.claimNumber,
    description: req.body.description,
    stage: req.body.stage,
    notes: req.body.notes || "",
    submittedAt: new Date().toISOString()
  });

  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
  res.send('Claim submitted successfully.');
});

/* ===========================
   POST: Update Existing Claim
=========================== */
app.post('/claims/update', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  const index = claims.findIndex(c => c.claimNumber === req.body.claimNumber);
  if (index === -1) return res.status(404).send('Claim not found.');

  claims[index].description = req.body.description;
  claims[index].stage = req.body.stage;
  claims[index].notes = req.body.notes;
  claims[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
  res.send('Claim updated successfully.');
});

/* ===========================
   POST: Upload Document
=========================== */
app.post('/documents', upload.single('document'), (req, res) => {
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let documents = fs.existsSync(docsPath)
    ? JSON.parse(fs.readFileSync(docsPath))
    : [];

  documents.push({
    filename: req.file.filename,
    originalName: req.file.originalname,
    date: new Date().toISOString(),
    client: req.body.client || null,
    claimNumber: req.body.claimNumber || null
  });

  fs.writeFileSync(docsPath, JSON.stringify(documents, null, 2));
  res.redirect('/dashboard.html');
});

/* ===========================
   GET: All Clients
=========================== */
app.get('/clients', (req, res) => {
  const clientsPath = path.join(__dirname, 'data', 'clients.json');
  fs.mkdirSync(path.dirname(clientsPath), { recursive: true });

  const clients = fs.existsSync(clientsPath)
    ? JSON.parse(fs.readFileSync(clientsPath))
    : [];

  res.json(clients);
});

/* ===========================
   GET: Claims (Filtered)
=========================== */
app.get('/claims', (req, res) => {
  const client = req.query.client?.toLowerCase();
  const stage = req.query.stage?.toLowerCase();
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  if (client) {
    claims = claims.filter(c => c.client?.toLowerCase() === client);
  }

  if (stage) {
    claims = claims.filter(c => c.stage?.toLowerCase() === stage);
  }

  res.json(claims);
});

/* ===========================
   GET: Documents (Filtered)
=========================== */
app.get('/documents', (req, res) => {
  const client = req.query.client?.toLowerCase();
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let documents = fs.existsSync(docsPath)
    ? JSON.parse(fs.readFileSync(docsPath))
    : [];

  if (client) {
    documents = documents.filter(doc => doc.client?.toLowerCase() === client);
  }

  res.json(documents);
});

/* ===========================
   GET: Export Claims as CSV
=========================== */
app.get('/claims/export', (req, res) => {
  const client = req.query.client?.toLowerCase();
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  if (client) {
    claims = claims.filter(c => c.client?.toLowerCase() === client);
  }

  const csv = stringify(claims, { header: true });
  res.setHeader('Content-Disposition', 'attachment; filename=claims.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

/* ===========================
   GET: Export Documents as CSV
=========================== */
app.get('/documents/export', (req, res) => {
  const client = req.query.client?.toLowerCase();
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(docsPath), { recursive: true });

  let documents = fs.existsSync(docsPath)
    ? JSON.parse(fs.readFileSync(docsPath))
    : [];

  if (client) {
    documents = documents.filter(doc => doc.client?.toLowerCase() === client);
  }

  const csv = stringify(documents, { header: true });
  res.setHeader('Content-Disposition', 'attachment; filename=documents.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

/* ===========================
   GET: Archive Recovered Claims
=========================== */
app.get('/claims/archive', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  const archivePath = path.join(__dirname, 'data', 'archived-claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  let archived = fs.existsSync(archivePath)
    ? JSON.parse(fs.readFileSync(archivePath))
    : [];

  const active = [];
  const toArchive = [];

  for (const claim of claims) {
    if (claim.stage === 'Recovered') {
      toArchive.push({ ...claim, archivedAt: new Date().toISOString() });
    } else {
      active.push(claim);
    }
  }

  fs.writeFileSync(claimsPath, JSON.stringify(active, null, 2));
  fs.writeFileSync(archivePath, JSON.stringify([...archived, ...toArchive], null, 2));

  res.send(`Archived ${toArchive.length} recovered claim(s).`);
});

/* ===========================
   Start Server
=========================== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
