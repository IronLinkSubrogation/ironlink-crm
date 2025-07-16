const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const clientsFile = path.join(__dirname, 'clients.json');

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Enable JSON body parsing for POST
app.use(express.json());

// Route: Get list of all clients
app.get('/clients/list', (req, res) => {
  if (!fs.existsSync(clientsFile)) {
    return res.json([]); // No clients yet
  }

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);

  // Only return essentials for homepage tiles
  const summary = clients.map(({ id, name, initials, claims, claimsType }) => ({
    id, name, initials, claims, claimsType
  }));

  res.json(summary);
});

// Route: Get full details for one client
app.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;

  if (!fs.existsSync(clientsFile)) {
    return res.status(404).json({ error: 'No client data found' });
  }

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  res.json(client);
});

// Route: Add new client (already completed earlier)
app.post('/clients/create', (req, res) => {
  const newClient = req.body;

  let clients = [];
  if (fs.existsSync(clientsFile)) {
    const rawData = fs.readFileSync(clientsFile);
    clients = JSON.parse(rawData);
  }

  const exists = clients.some(c => c.id === newClient.id);
  if (exists) {
    return res.status(409).json({ error: 'Client ID already exists' });
  }

  newClient.documents = [];
  newClient.notes = "";

  clients.push(newClient);
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.status(201).json({ message: 'Client created successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ IronLink backend running at http://localhost:${PORT}`);
});
