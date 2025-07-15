const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer setup
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

// Handle document upload
app.post('/documents', upload.single('document'), (req, res) => {
  const fileData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    date: new Date().toISOString()
  };

  const dataFile = path.join(__dirname, 'data', 'documents.json');
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });

  let data = [];
  if (fs.existsSync(dataFile)) {
    data = JSON.parse(fs.readFileSync(dataFile));
  }

  data.push(fileData);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

  res.redirect('/dashboard.html');
});

// Handle claim intake
app.post('/claims', (req, res) => {
  const claimData = {
    client: req.body.client,
    claimNumber: req.body.claimNumber,
    description: req.body.description,
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
