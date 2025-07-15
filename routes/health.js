const express = require('express');
const router = express.Router();

// ✅ Simple health check — returns 200 OK
router.get('/', (req, res) => {
  res.status(200).send('✅ IronLink CRM is alive.');
});

module.exports = router;
