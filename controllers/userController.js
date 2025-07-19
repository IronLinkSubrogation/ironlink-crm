let users = [
  { id: 1, name: "Alice Admin", email: "admin@ironlink.com", role: "admin" },
  { id: 2, name: "Ethan Employee", email: "ethan@ironlink.com", role: "employee" },
  { id: 3, name: "Cindy Client", email: "cindy@ironlink.com", role: "client" },
];

exports.getAllUsers = (req, res) => {
  res.status(200).json(users);
};

exports.createUser = (req, res) => {
  const { name, email, role } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || "client",
  };
  users.push(newUser);
  res.status(201).json(newUser);
};

exports.updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;

  res.status(200).json(user);
};

exports.deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const before = users.length;
  users = users.filter((u) => u.id !== userId);

  if (users.length === before) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ message: "User deleted successfully" });
};
