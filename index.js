const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const archiver = require('archiver');
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// Load clients
function loadClients() {
  const data = fs.readFileSync('clients.json', 'utf8');
  return JSON.parse(data);
}

// Save clients
function saveClients(clients) {
  fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2), 'utf8');
}

// GET all clients
app.get('/clients/list', (req, res) => {
  res.json(loadClients());
});

// POST update priority or role
app.post('/clients/:id/update', (req, res) => {
  const { id } = req.params;
  const { assignedRole, priority } = req.body;
  const clients = loadClients();
  const client = clients.find(c => c.id === id);

  if (!client) return res.status(404).json({ error: "Client not found" });

  client.auditLog = client.auditLog || [];

  if (assignedRole !== undefined) {
    client.assignedRole = assignedRole;
    client.auditLog.push({
      timestamp: new Date().toISOString(),
      action: `Assigned role ${assignedRole}`,
      actor: "Admin"
    });
  }

  if (priority !== undefined) {
    client.priority = priority;
    client.auditLog.push({
      timestamp: new Date().toISOString(),
      action: `Set priority to ${priority}`,
      actor: "Admin"
    });
  }

  saveClients(clients);
  res.json({ success: true });
});

// POST upload document
app.post('/clients/:id/upload', upload.single('document'), (req, res) => {
  const { id } = req.params;
  const clients = loadClients();
  const client = clients.find(c => c.id === id);

  if (!client || !req.file) {
    return res.status(400).json({ error: "Missing client or file" });
  }

  const filename = req.file.originalname;
  client.documents = client.documents || [];
  client.documents.push(filename);

  client.auditLog = client.auditLog || [];
  client.auditLog.push({
    timestamp: new Date().toISOString(),
    action: `Uploaded document ${filename}`,
    actor: "Admin"
  });

  saveClients(clients);
  res.json({ success: true, filename });
});

// POST update claim status
app.post('/clients/:clientId/claims/:claimId/update', (req, res) => {
  const { clientId, claimId } = req.params;
  const { status } = req.body;

  const clients = loadClients();
  const client = clients.find(c => c.id === clientId);
  if (!client) return res.status(404).json({ error: "Client not found" });

  const claim = client.claimsList.find(cl => cl.id === claimId);
  if (!claim) return res.status(404).json({ error: "Claim not found" });

  claim.status = status;
  claim.updatedAt = new Date().toISOString();

  client.auditLog = client.auditLog || [];
  client.auditLog.push({
    timestamp: new Date().toISOString(),
    action: `Updated claim ${claimId} status to ${status}`,
    actor: "Admin"
  });

  saveClients(clients);
  res.json({ success: true });
});

// GET ZIP export
app.get('/export/zip', (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  res.attachment('ironlink_bundle.zip');
  archive.pipe(res);

  archive.file('clients.json', { name: 'clients.json' });
  archive.directory('uploads/', 'uploads');

  if (fs.existsSync('screenshots/')) {
    archive.directory('screenshots/', 'screenshots');
  }

  archive.finalize();
});

// Start server
app.listen(PORT, () => {
  console.log(`IronLink CRM backend running at http://localhost:${PORT}`);
});
