// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🏢 IronLink CRM | Client Controller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let clients = [
  {
    _id: "1",
    name: "Acme Insurance",
    contactEmail: "acme@insurance.com",
    status: "active",
  },
];

// GET /clients
const getAllClients = (req, res) => {
  res.status(200).json(clients);
};

// POST /clients
const createClient = (req, res) => {
  const { name, contactEmail, status } = req.body;

  if (!name || !contactEmail) {
    return res.status(400).json({ message: "Client name and contact email required" });
  }

  const newClient = {
    _id: String(Date.now()),
    name,
    contactEmail,
    status: status || "active",
  };

  clients.push(newClient);
  res.status(201).json(newClient);
};

// PUT /clients/:id
const updateClient = (req, res) => {
  const { id } = req.params;
  const { name, contactEmail, status } = req.body;

  const index = clients.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Client not found" });
  }

  clients[index] = {
    ...clients[index],
    name,
    contactEmail,
    status,
  };

  res.status(200).json(clients[index]);
};

// DELETE /clients/:id
const deleteClient = (req, res) => {
  const { id } = req.params;
  const index = clients.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Client not found" });
  }

  const deleted = clients.splice(index, 1);
  res.status(200).json(deleted[0]);
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
