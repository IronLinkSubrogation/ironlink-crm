// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 👤 IronLink CRM | Admin User Controller
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let users = [
  { _id: "1", email: "admin@ironlink.com", role: "admin" },
  { _id: "2", email: "agent@ironlink.com", role: "employee" }
];

// GET /users
const getAllUsers = (req, res) => {
  res.status(200).json(users);
};

// POST /users
const createUser = (req, res) => {
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ message: "Email and role are required" });
  }

  const newUser = {
    _id: String(Date.now()),
    email,
    role,
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

// PUT /users/:id
const updateUser = (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;

  const index = users.findIndex(user => user._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { ...users[index], email, role };
  res.status(200).json(users[index]);
};

// DELETE /users/:id
const deleteUser = (req, res) => {
  const { id } = req.params;
  const index = users.findIndex(user => user._id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = users.splice(index, 1);
  res.status(200).json(deleted[0]);
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
};
