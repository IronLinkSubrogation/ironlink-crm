const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (CSS, HTML forms) from /public
app.use(express.static('public'));

// Parse POST form data
app.use(express.urlencoded({ extended: true }));

// Route: Dashboard
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Route: Client Intake (POST logic)
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// ✅ Route: View Stored Clients (GET /view-clients)
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// Root sanity check
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
