const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from /public
app.use(express.static('public'));

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Dashboard route
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Clients intake route
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// View stored clients
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// Claims intake route (newly added in Step 2.5)
const claimsRoute = require('./routes/claims');
app.use('/claims', claimsRoute);

// Root route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
