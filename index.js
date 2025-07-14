const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ✅ Backend Routes
const clientsRoute = require('./routes/clients');
const claimsRoute = require('./routes/claims');
const documentsRoute = require('./routes/documents');
const dashboardRoute = require('./routes/dashboard'); // 🔹 new addition

app.use('/clients', clientsRoute);
app.use('/claims', claimsRoute);
app.use('/documents', documentsRoute);
app.use('/dashboard', dashboardRoute); // 🔹 connect dynamic view

// Health check route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
