const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route: Client data for homepage tiles
app.get('/clients/list', (req, res) => {
  res.json([
    { name: 'Acme Auto', initials: 'AC', claims: 12 },
    { name: 'Star General', initials: 'SG', claims: 8 },
    { name: 'Rapid Repairs', initials: 'RR', claims: 5 }
    // Add more client objects here as needed
  ]);
});

// Health check (optional)
app.get('/ping', (req, res) => {
  res.send('IronLink CRM is live');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ IronLink backend running at http://localhost:${PORT}`);
});
