const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const mockUsers = {
    "admin@ironlink.com": { role: "admin" },
    "employee@ironlink.com": { role: "employee" },
    "client@ironlink.com": { role: "client" },
  };

  const user = mockUsers[email];
  if (!user || password !== "password123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
};
