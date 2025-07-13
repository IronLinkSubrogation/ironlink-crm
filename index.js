const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets from /public (e.g., HTML, CSS)
app.use(express.static('public'));

// Enable form data parsing for POST requests
app.use(express.urlencoded({ extended: true }));

// Route: Dashboard
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Route: Client intake form
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// Route: View stored clients
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// ✅ Route: Claim intake form (new in Step 2.5)
const claimsRoute = require('./routes/claims');
app.use('/claims', claimsRoute);

// Root route sanity check
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
