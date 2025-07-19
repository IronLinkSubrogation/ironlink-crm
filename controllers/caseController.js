// Mock data store (replace with database logic later)
let cases = [
  { id: 1, client: "Client A", status: "Open", notes: "Pending review" },
  { id: 2, client: "Client B", status: "Closed", notes: "Resolved" },
];

exports.getAllCases = (req, res) => {
  res.status(200).json(cases);
};

exports.createCase = (req, res) => {
  const newCase = {
    id: cases.length + 1,
    client: req.body.client,
    status: req.body.status || "Open",
    notes: req.body.notes || "",
  };
  cases.push(newCase);
  res.status(201).json(newCase);
};

exports.updateCase = (req, res) => {
  const caseId = parseInt(req.params.id);
  const existing = cases.find((c) => c.id === caseId);
  if (!existing) {
    return res.status(404).json({ message: "Case not found" });
  }
  existing.status = req.body.status || existing.status;
  existing.notes = req.body.notes || existing.notes;
  res.status(200).json(existing);
};

exports.deleteCase = (req, res) => {
  const caseId = parseInt(req.params.id);
  const before = cases.length;
  cases = cases.filter((c) => c.id !== caseId);
  if (cases.length === before) {
    return res.status(404).json({ message: "Case not found" });
  }
  res.status(200).json({ message: "Case deleted successfully" });
};
