const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from /public
app.use(express.static('public'));

// Enable form data parsing for POST requests
app.use(express.urlencoded({ extended: true }));

// Route: Dashboard
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// Route: Client intake
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// Route: View submitted clients
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// Route: Claim intake
const claimsRoute = require('./routes/claims');
app.use('/claims', claimsRoute);

// Route: View submitted claims
const viewClaimsRoute = require('./routes/viewClaims');
app.use('/view-claims', viewClaimsRoute);

// ✅ NEW: Document intake (Phase 4)
const documentsRoute = require('./routes/documents');
app.use('/documents', documentsRoute);

// (Coming soon) View submitted documents
// const viewDocumentsRoute = require('./routes/viewDocuments');
// app.use('/view-documents', viewDocumentsRoute);

// Root sanity check
app.get('/', (req, res) => {
  res.send('IronLink CRM is
