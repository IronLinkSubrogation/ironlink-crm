require('dotenv').config(); // Load adminKey from .env

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { stringify } = require('csv-stringify/sync');

const app = express();

// 🛡️ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Admin key protection
function checkAdminKey(req, res, next) {
  const key = req.query.adminKey;
  if (key !== process.env.ADMIN_KEY) {
    return res.status(403).send('Access denied.');
  }
  next();
}

// 📦 Multer setup (uploads)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

/*===========================
  SUBMIT NEW CLAIM
===========================*/
app.post('/claims', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsPath), { recursive: true });

  const claims = fs.existsSync(claimsPath)
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

/*===========================
  UPDATE CLAIM (admin only)
===========================*/
app.post('/claims/update', checkAdminKey, (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  const claims = fs.existsSync(claimsPath)
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

/*===========================
  UPLOAD DOCUMENT
===========================*/
app.post('/documents', upload.single('document'), (req, res) => {
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  const documents = fs.existsSync(docsPath)
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

/*===========================
  GET CLIENTS
===========================*/
app.get('/clients', (req, res) => {
  const clientsPath = path.join(__dirname, 'data', 'clients.json');
  const clients = fs.existsSync(clientsPath)
    ? JSON.parse(fs.readFileSync(clientsPath))
    : [];

  res.json(clients);
});

/*===========================
  GET FILTERED CLAIMS
===========================*/
app.get('/claims', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  const client = req.query.client?.toLowerCase();
  const stage = req.query.stage?.toLowerCase();

  if (client) claims = claims.filter(c => c.client?.toLowerCase() === client);
  if (stage) claims = claims.filter(c => c.stage?.toLowerCase() === stage);

  res.json(claims);
});

/*===========================
  GET FILTERED DOCUMENTS
===========================*/
app.get('/documents', (req, res) => {
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  let documents = fs.existsSync(docsPath)
    ? JSON.parse(fs.readFileSync(docsPath))
    : [];

  const client = req.query.client?.toLowerCase();
  if (client) documents = documents.filter(doc => doc.client?.toLowerCase() === client);

  res.json(documents);
});

/*===========================
  EXPORT CLAIMS (CSV)
===========================*/
app.get('/claims/export', checkAdminKey, (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  const client = req.query.client?.toLowerCase();
  if (client) claims = claims.filter(c => c.client?.toLowerCase() === client);

  const csv = stringify(claims, { header: true });
  res.setHeader('Content-Disposition', 'attachment; filename=claims.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

/*===========================
  EXPORT DOCUMENTS (CSV)
===========================*/
app.get('/documents/export', checkAdminKey, (req, res) => {
  const docsPath = path.join(__dirname, 'data', 'documents.json');
  let documents = fs.existsSync(docsPath)
    ? JSON.parse(fs.readFileSync(docsPath))
    : [];

  const client = req.query.client?.toLowerCase();
  if (client) documents = documents.filter(doc => doc.client?.toLowerCase() === client);

  const csv = stringify(documents, { header: true });
  res.setHeader('Content-Disposition', 'attachment; filename=documents.csv');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});

/*===========================
  ARCHIVE RECOVERED CLAIMS
===========================*/
app.get('/claims/archive', checkAdminKey, (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  const archivePath = path.join(__dirname, 'data', 'archived-claims.json');

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

/*===========================
  ANALYTICS ROUTE
===========================*/
app.get('/analytics', checkAdminKey, (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  let claims = fs.existsSync(claimsPath)
    ? JSON.parse(fs.readFileSync(claimsPath))
    : [];

  const stats = {
    totalClaims: claims.length,
    byStage: {},
    byClient: {},
    byWeek: {}
  };

  for (const claim of claims) {
    const stage = claim.stage || 'Unknown';
    const client = claim.client || 'Unassigned';
    const date = new Date(claim.submittedAt);
    const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;

    stats.byStage[stage] = (stats.byStage[stage] || 0) + 1;
    stats.byClient[client] = (stats.byClient[client] || 0) + 1;
    stats.byWeek[weekKey] = (stats.byWeek[weekKey] || 0) + 1;
  }

  res.json(stats);
});

/*===========================
  START SERVER
===========================*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
