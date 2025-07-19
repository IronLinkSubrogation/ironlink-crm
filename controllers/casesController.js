// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 IronLink CRM | Case Management Controller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let cases = [
  {
    _id: "1",
    caseNumber: "IRN-001",
    client: "Acme Insurance",
    status: "open",
    assignedTo: "agent@ironlink.com",
  }
];

// GET /cases
const getAllCases = (req, res) => {
  res.status(200).json(cases);
};

// POST /cases
const createCase = (req, res) => {
  const { caseNumber, client, status, assignedTo } = req.body;

  if (!caseNumber || !client || !assignedTo) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newCase = {
    _id: String(Date.now()),
    caseNumber,
    client,
    status: status || "open",
    assignedTo,
  };

  cases.push(newCase);
  res.status(201).json(newCase);
};

// PUT /cases/:id
const updateCase = (req, res) => {
  const { id } = req.params;
  const { caseNumber, client, status, assignedTo } = req.body;

  const index = cases.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Case not found" });
  }

  cases[index] = {
    ...cases[index],
    caseNumber,
    client,
    status,
    assignedTo,
  };

  res.status(200).json(cases[index]);
};

// DELETE /cases/:id
const deleteCase = (req, res) => {
  const { id } = req.params;
  const index = cases.findIndex(c => c._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Case not found" });
  }

  const deleted = cases.splice(index, 1);
  res.status(200).json(deleted[0]);
};

module.exports = {
  getAllCases,
  createCase,
  updateCase,
  deleteCase,
};
