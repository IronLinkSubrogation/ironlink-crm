const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const clientsFile = path.join(__dirname, 'clients.json');

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Route: List all clients (for homepage tiles)
app.get('/clients/list', (req, res) => {
  if (!fs.existsSync(clientsFile)) return res.json([]);
  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const summary = clients.map(({ id, name, initials, claims, claimsType }) => ({
    id, name, initials, claims, claimsType
  }));
  res.json(summary);
});

// Route: Get full details for a client
app.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  if (!fs.existsSync(clientsFile)) return res.status(404).json({ error: 'Client data missing' });
  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });
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
  if (exists) return res.status(409).json({ error: 'Client ID already exists' });

  newClient.documents = [];
  newClient.notes = "";
  clients.push(newClient);

  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.status(201).json({ message: 'Client created successfully' });
});

// Route: Update client notes
app.post('/clients/:id/notes', (req, res) => {
  const clientId = req.params.id;
  const { notes } = req.body;
  if (!fs.existsSync(clientsFile)) return res.status(404).json({ error: 'Client file missing' });

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.notes = notes;
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Notes updated' });
});

// Route: Add a document name to client
app.post('/clients/:id/documents', (req, res) => {
  const clientId = req.params.id;
  const { document } = req.body;
  if (!document || typeof document !== 'string') {
    return res.status(400).json({ error: 'Invalid document name' });
  }
  if (!fs.existsSync(clientsFile)) return res.status(404).json({ error: 'Client file missing' });

  const rawData = fs.readFileSync(clientsFile);
  const clients = JSON.parse(rawData);
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.documents.push(document);
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Document added' });
});

// Launch server
app.listen(PORT, () => {
  console.log(`✅ IronLink CRM backend running at http://localhost:${PORT}`);
});
