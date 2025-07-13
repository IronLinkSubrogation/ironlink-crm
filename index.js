const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS) from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// Basic root route
app.get('/', (req, res) => {
  res.send('IronLink CRM is up and running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
