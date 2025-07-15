app.get('/claims', (req, res) => {
  const clientName = req.query.client;
  const claimsFile = path.join(__dirname, 'data', 'claims.json');
  fs.mkdirSync(path.dirname(claimsFile), { recursive: true });

  let allClaims = [];
  if (fs.existsSync(claimsFile)) {
    allClaims = JSON.parse(fs.readFileSync(claimsFile));
  }

  // If no client query param, return all claims
  if (!clientName) {
    return res.json(allClaims);
  }

  // Filter by client name (case-insensitive)
  const filtered = allClaims.filter(c =>
    c.client.toLowerCase() === clientName.toLowerCase()
  );

  res.json(filtered);
});
