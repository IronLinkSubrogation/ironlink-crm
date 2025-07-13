const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, '..', 'data', 'clients.json');

// Ensure data folder exists
const ensureDataFile = () => {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

ensureDataFile();

router.post('/', (req, res) => {
  const { name, email, caseTag, notes } = req.body;
  const newClient = { name, email, caseTag, notes, timestamp: Date.now() };

  // Read current data
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  data.push(newClient);

  // Write updated data
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  console.log('Client stored:', newClient);
  res.redirect('/dashboard');
});

module.exports = router;
