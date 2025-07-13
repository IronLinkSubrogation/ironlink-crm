const express = require('express');
const router = express.Router();

// Middleware to parse incoming form data
router.use(express.urlencoded({ extended: true }));

// POST route to handle client form submission
router.post('/', (req, res) => {
  const { name, email, caseTag, notes } = req.body;

  // For now, just log the received data
  console.log('New client submitted:', { name, email, caseTag, notes });

  // Redirect back to dashboard (or confirmation page later)
  res.redirect('/dashboard');
});

module.exports = router;
