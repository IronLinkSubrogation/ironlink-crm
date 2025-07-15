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

// Routes
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

  res.redirect('/dashboard');
});

app.get('/dashboard', (req, res) => {
  res.send('Dashboard placeholder — will show uploaded docs.');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IronLink CRM running at http://localhost:${PORT}`);
});
