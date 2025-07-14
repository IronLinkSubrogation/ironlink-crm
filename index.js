// Main Express server for IronLink CRM

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static HTML files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Wire backend routes
const clientsRoute = require('./routes/clients');
const claimsRoute = require('./routes/claims');
const documentsRoute = require('./routes/documents');

app.use('/clients', clientsRoute);     // Handles client form submissions
app.use('/claims', claimsRoute);       // Handles claim form submissions
app.use('/documents', documentsRoute); // Handles document form submissions

// Health check route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Launch server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
