const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, etc.) from /public
app.use(express.static('public'));

// Enable form data parsing (for POST requests)
app.use(express.urlencoded({ extended: true }));

// 📂 Dashboard route
const dashboardRoute = require('./routes/dashboard');
app.use('/dashboard', dashboardRoute);

// 👤 Client intake
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// 👥 View client records
const viewClientsRoute = require('./routes/viewClients');
app.use('/view-clients', viewClientsRoute);

// 📄 Claim intake
const claimsRoute = require('./routes/claims');
app.use('/claims', claimsRoute);

// 📊 View recovery claims
const viewClaimsRoute = require('./routes/viewClaims');
app.use('/view-claims', viewClaimsRoute);

// 🧾 Document intake (Phase 4)
const documentsRoute = require('./routes/documents');
app.use('/documents', documentsRoute);

// 🗂️ View submitted documents (Step 3.5)
const viewDocumentsRoute = require('./routes/viewDocuments');
app.use('/view-documents', viewDocumentsRoute);

// 🧪 Root route sanity check
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// 🚀 Start Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
