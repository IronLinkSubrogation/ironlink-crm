const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔧 Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// 🧩 Route Imports
const clientsRoute = require('./routes/clients');
const claimsRoute = require('./routes/claims');
const documentsRoute = require('./routes/documents');
const dashboardRoute = require('./routes/dashboard');
const exportRoute = require('./routes/export');           // ✅ CSV export
const pdfRoute = require('./routes/generate-pdf');        // ✅ Step 33 — PDF summaries

// 🔌 Register Routes
app.use('/clients', clientsRoute);
app.use('/claims', claimsRoute);
app.use('/documents', documentsRoute);
app.use('/dashboard', dashboardRoute);
app.use('/export', exportRoute);
app.use('/generate-pdf', pdfRoute);                       // ✅ Added for PDF packets

// 🩺 Basic Health Check
app.get('/', (req, res) => {
  res.send('🚀 IronLink CRM is live and running!');
});

// ▶️ Start Server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
