let clients = [
  { id: 1, name: "Jane Doe", status: "Active", email: "jane@client.com" },
  { id: 2, name: "John Smith", status: "Pending", email: "john@client.com" },
];

exports.getAllClients = (req, res) => {
  res.status(200).json(clients);
};

exports.createClient = (req, res) => {
  const newClient = {
    id: clients.length + 1,
    name: req.body.name,
    status: req.body.status || "Active",
    email: req.body.email,
  };
  clients.push(newClient);
  res.status(201).json(newClient);
};

exports.updateClient = (req, res) => {
  const clientId = parseInt(req.params.id);
  const client = clients.find((c) => c.id === clientId);
  if (!client) return res.status(404).json({ message: "Client not found" });

  client.name = req.body.name || client.name;
  client.status = req.body.status || client.status;
  client.email = req.body.email || client.email;

  res.status(200).json(client);
};

exports.deleteClient = (req, res) => {
  const clientId = parseInt(req.params.id);
  const before = clients.length;
  clients = clients.filter((c) => c.id !== clientId);

  if (clients.length === before) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json({ message: "Client deleted successfully" });
};
