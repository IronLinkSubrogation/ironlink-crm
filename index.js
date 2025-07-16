const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const clientsFile = path.join(__dirname, 'clients.json');

// Serve static assets from /public
app.use(express.static(path.join(__dirname, 'public')));

// Enable JSON body parsing
app.use(express.json());

// Route: Get list of all clients for homepage
app.get('/clients/list', (req, res) => {
  if (!fs.existsSync(clientsFile)) {
    return res.json([]); // No data yet
  }

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);

  const summary = clients.map(({ id, name, initials, claims, claimsType }) => ({
    id, name, initials, claims, claimsType
  }));

  res.json(summary);
});

// Route: Get full details for one client
app.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;

  if (!fs.existsSync(clientsFile)) {
    return res.status(404).json({ error: 'Client data missing' });
  }

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  res.json(client);
});

// Route: Create a new client
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

// Route: Update notes for a client
app.post('/clients/:id/notes', (req, res) => {
  const clientId = req.params.id;
  const { notes } = req.body;

  if (!fs.existsSync(clientsFile)) {
    return res.status(404).json({ error: 'Client file missing' });
  }

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);

  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  client.notes = notes;
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Notes updated' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ IronLink CRM backend running at http://localhost:${PORT}`);
});
