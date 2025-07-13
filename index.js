const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from /public
app.use(express.static('public'));

// Parse form data globally (useful for POST routes)
app.use(express.urlencoded({ extended: true }));

// Dashboard route
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Clients intake route (POST handling)
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// View stored clients (GET rendering)
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// Root route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
