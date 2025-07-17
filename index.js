const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves employee.html and assets

// Utility function to load a JSON file
function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
}

// ✅ Confirm server is live
app.get('/', (req, res) => {
  res.send('✅ IronLink backend is running.');
});

// 🔹 Get employee profile
app.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const employees = loadJSON('employees.json');
  const profile = employees.find(e => e.id === id);

  if (profile) {
    res.json(profile);
  } else {
    res.status(404).json({ error: 'Employee not found.' });
  }
});

// 🔹 Get employee dashboard (tasks + clients)
app.get('/employee/:id/dashboard', (req, res) => {
  const id = req.params.id;
  const employees = loadJSON('employees.json');
  const tasks = loadJSON('employeeTasks.json');

  const employee = employees.find(e => e.id === id);
  const taskBlock = tasks.find(t => t.employeeId === id);

  if (!employee) return res.status(404).json({ error: 'Employee not found.' });

  res.json({
    name: employee.name,
    role: employee.role,
    assignedClients: employee.assignedClients,
    active: employee.active,
    startDate: employee.startDate,
    tasks: taskBlock ? taskBlock.tasks : []
  });
});

// 🔹 Log activity (POST)
app.post('/employee/:id/activity', (req, res) => {
  const id = req.params.id;
  const { action, claimId } = req.body;

  if (!action || !claimId) {
    return res.status(400).json({ error: 'Missing action or claimId.' });
  }

  const logData = loadJSON('activityLog.json');
  const newEntry = {
    employeeId: id,
    action,
    claimId,
    timestamp: new Date().toISOString()
  };

  logData.push(newEntry);
  fs.writeFileSync(path.join(__dirname, 'activityLog.json'), JSON.stringify(logData, null, 2));
  res.json({ status: 'Activity logged', entry: newEntry });
});

// 🔹 Update training checklist (POST)
app.post('/employee/:id/onboarding', (req, res) => {
  const id = req.params.id;
  const { moduleId } = req.body;

  if (!moduleId) return res.status(400).json({ error: 'Missing moduleId.' });

  const checklist = loadJSON('trainingChecklist.json');
  let entry = checklist.find(e => e.employeeId === id);

  if (!entry) {
    checklist.push({ employeeId: id, completed: [moduleId] });
  } else {
    if (!entry.completed.includes(moduleId)) {
      entry.completed.push(moduleId);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'trainingChecklist.json'), JSON.stringify(checklist, null, 2));
  res.json({ status: 'Training module marked complete', employeeId: id, moduleId });
});

// 🟩 Start the server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend live on port ${PORT}`);
});
