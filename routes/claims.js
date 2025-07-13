const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

const CLAIMS_FILE = path.join(__dirname, '..', 'data', 'claims.json');

// Ensure file exists
if (!fs.existsSync(CLAIMS_FILE)) {
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify([]));
}

router.post('/', (req, res) => {
  const { clientIdentifier, claimType, amount, status, notes } = req.body;
  const newClaim = {
    clientIdentifier,
    claimType,
    amount: parseFloat(amount),
    status,
    notes,
    timestamp: Date.now()
  };

  // Save to file
  const claims = JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'));
  claims.push(newClaim);
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));

  console.log('New claim submitted:', newClaim);
  res.redirect('/dashboard');
});

module.exports = router;
