const express = require('express');
const router = express.Router();

// ✅ Quick health check route
router.get('/', (req, res) => {
  res.status(200).send('✅ IronLink CRM is alive.');
});

module.exports = router;
