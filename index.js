const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Route: Return list of all clients for homepage
app.get('/clients/list', (req, res) => {
  res.json([
    {
      id: 'acme-auto',
      name: 'Acme Auto',
      initials: 'AC',
      claims: 12,
      claimsType: 'active'
    },
    {
      id: 'liberty-mutual',
      name: 'Liberty Mutual',
      initials: 'LM',
      claims: 15,
      claimsType: 'active'
    },
    {
      id: 'rapid-repairs',
      name: 'Rapid Repairs',
      initials: 'RR',
      claims: 5,
      claimsType: 'recovered'
    }
  ]);
});

// Route: Return detailed info for one client
app.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;

  const clients = [
    {
      id: 'acme-auto',
      name: 'Acme Auto',
      initials: 'AC',
      claims: 12,
      claimsType: 'active',
      documents: ['Insurance Agreement.pdf', 'Police Report.jpg'],
      notes: 'Follow-up pending with adjuster.'
    },
    {
      id: 'liberty-mutual',
      name: 'Liberty Mutual',
      initials: 'LM',
      claims: 15,
      claimsType: 'active',
      documents: ['Client Onboarding.pdf'],
      notes: 'Payment schedule verified.'
    },
    {
      id: 'rapid-repairs',
      name: 'Rapid Repairs',
      initials: 'RR',
      claims: 5,
      claimsType: 'recovered',
      documents: ['Recovery Report.pdf'],
      notes: 'Case closed on 06/12.'
    }
  ];

  const client = clients.find(c => c.id === clientId);
  if (!client) {
    return res.status(404).json({ error: 'Client not found' });
  }

  res.json(client);
});

// Optional health check route
app.get('/ping', (req, res) => {
  res.send('IronLink CRM backend is live');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ IronLink backend running at http://localhost:${PORT}`);
});
