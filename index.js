const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// ✅ Wire backend route for client intake
const clientsRoute = require('./routes/clients');
app.use('/clients', clientsRoute);

// Test root route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
