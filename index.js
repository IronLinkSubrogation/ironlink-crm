const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public folder (HTML, CSS, etc.)
app.use(express.static('public'));

// Enable parsing for form POST submissions
app.use(express.urlencoded({ extended: true }));

// Route: Dashboard page
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Route: Client intake form (submits to clients.json)
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// Route: View submitted clients
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// Route: Claim intake form (submits to claims.json)
const claimsRoute = require('./routes/claims');
app.use('/claims', claimsRoute);

// ✅ NEW: View submitted recovery claims
const viewClaimsRoute = require('./routes/viewClaims');
app.use('/view-claims', viewClaimsRoute);

// Root route sanity check
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
