const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// 📁 Path to claims data file
const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

// 🛡️ Create claims.json if it doesn't exist
if (!fs.existsSync(CLAIMS_FILE)) {
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify([]));
}

// 📥 Handle claim intake POST request
router.post('/', (req, res) => {
  const { claimNumber, clientTag, lossDate, claimNotes } = req.body;

  const newClaim = {
    claimNumber,
    clientTag,
    lossDate,
    claimNotes,
    timestamp: Date.now()
  };

  // Read existing claims, append new, save updated list
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
  claims.push(newClaim);
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));

  console.log('✅ New claim stored:', newClaim);

  res.redirect('/dashboard');
});

module.exports = router;
