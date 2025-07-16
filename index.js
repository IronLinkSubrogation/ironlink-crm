const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const clientsFile = path.join(__dirname, 'clients.json');

app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ IronLink CRM backend running at http://localhost:${PORT}`);
});

// List all clients
app.get('/clients/list', (req, res) => {
  if (!fs.existsSync(clientsFile)) return res.json([]);
  const data = fs.readFileSync(clientsFile);
  res.json(JSON.parse(data));
});

// Get single client by ID
app.get('/clients/:id', (req, res) => {
  const data = fs.readFileSync(clientsFile);
  const clients = JSON.parse(data);
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// Create new client
app.post('/clients/create', (req, res) => {
  const newClient = req.body;
  if (!newClient.id || !newClient.name) {
    return res.status(400).json({ error: 'Missing ID or name' });
  }

  const clients = fs.existsSync(clientsFile)
    ? JSON.parse(fs.readFileSync(clientsFile))
    : [];

  if (clients.find(c => c.id === newClient.id)) {
    return res.status(409).json({ error: 'Client ID already exists' });
  }

  newClient.claimsList = [];
  newClient.documents = [];
  newClient.notes = '';
  newClient.claims = 0;
  clients.push(newClient);

  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.status(201).json({ message: 'Client created' });
});

// Update client metadata
app.post('/clients/:id/update', (req, res) => {
  const updates = req.body;
  const clients = JSON.parse(fs.readFileSync(clientsFile));
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  Object.assign(client, updates);
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Client updated' });
});

// Add claim to client
app.post('/clients/:id/claims', (req, res) => {
  const { claimId } = req.body;
  const clients = JSON.parse(fs.readFileSync(clientsFile));
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  if (!client.claimsList) client.claimsList = [];
  client.claimsList.push({ id: claimId, status: 'Open' });
  client.claims = client.claimsList.length;

  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Claim added' });
});

// Update claim status
app.post('/clients/:id/claims/status', (req, res) => {
  const { claimId, status } = req.body;
  const clients = JSON.parse(fs.readFileSync(clientsFile));
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.claimsList = (client.claimsList || []).map(c =>
    typeof c === 'string' ? { id: c, status: 'Open' } : c
  );

  const claim = client.claimsList.find(c => c.id === claimId);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  claim.status = status;
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Claim status updated' });
});

// Add document to client
app.post('/clients/:id/documents', (req, res) => {
  const { docName } = req.body;
  const clients = JSON.parse(fs.readFileSync(clientsFile));
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.documents.push(docName);
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Document added' });
});

// Update client notes
app.post('/clients/:id/notes', (req, res) => {
  const { notes } = req.body;
  const clients = JSON.parse(fs.readFileSync(clientsFile));
  const client = clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  client.notes = notes;
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
  res.json({ message: 'Notes updated' });
});
