const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serves HTML/CSS/JS from frontend

function loadJSON(filename) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, filename), 'utf8'));
}

// 🔹 Confirm backend is live
app.get('/', (req, res) => {
  res.send('✅ IronLink backend is running.');
});


// 🔹 Employee Profile
app.get('/employee/:id', (req, res) => {
  const employees = loadJSON('employees.json');
  const profile = employees.find(e => e.id === req.params.id);
  profile
    ? res.json(profile)
    : res.status(404).json({ error: 'Employee not found' });
});


// 🔹 Employee Task Dashboard
app.get('/employee/:id/dashboard', (req, res) => {
  const employees = loadJSON('employees.json');
  const tasks = loadJSON('employeeTasks.json');

  const employee = employees.find(e => e.id === req.params.id);
  const block = tasks.find(t => t.employeeId === req.params.id);

  if (!employee) return res.status(404).json({ error: 'Not found' });

  res.json({
    name: employee.name,
    role: employee.role,
    assignedClients: employee.assignedClients,
    active: employee.active,
    startDate: employee.startDate,
    tasks: block ? block.tasks : []
  });
});


// 🔹 Mark Task Complete
app.post('/employee/:id/task/:taskId/complete', (req, res) => {
  const tasks = loadJSON('employeeTasks.json');
  const log = loadJSON('activityLog.json');

  const block = tasks.find(e => e.employeeId === req.params.id);
  const task = block?.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.status = 'done';
  log.push({
    employeeId: req.params.id,
    action: `Completed task ${task.type}`,
    claimId: task.claimId,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(path.join(__dirname, 'employeeTasks.json'), JSON.stringify(tasks, null, 2));
  fs.writeFileSync(path.join(__dirname, 'activityLog.json'), JSON.stringify(log, null, 2));

  res.json({ status: 'Task marked complete', task });
});


// 🔹 Log Activity
app.post('/employee/:id/activity', (req, res) => {
  const log = loadJSON('activityLog.json');
  const { action, claimId } = req.body;

  if (!action || !claimId)
    return res.status(400).json({ error: 'Missing data' });

  const entry = {
    employeeId: req.params.id,
    action,
    claimId,
    timestamp: new Date().toISOString()
  };

  log.push(entry);
  fs.writeFileSync(path.join(__dirname, 'activityLog.json'), JSON.stringify(log, null, 2));
  res.json({ status: 'Activity logged', entry });
});


// 🔹 Submit Training Module Completion
app.post('/employee/:id/onboarding', (req, res) => {
  const checklist = loadJSON('trainingChecklist.json');
  const { moduleId } = req.body;

  if (!moduleId)
    return res.status(400).json({ error: 'Missing moduleId' });

  let entry = checklist.find(e => e.employeeId === req.params.id);

  if (!entry) {
    checklist.push({ employeeId: req.params.id, completed: [moduleId] });
  } else if (!entry.completed.includes(moduleId)) {
    entry.completed.push(moduleId);
  }

  fs.writeFileSync(path.join(__dirname, 'trainingChecklist.json'), JSON.stringify(checklist, null, 2));
  res.json({ status: 'Training module completed', moduleId });
});


// 🔹 Claim Status Panel
app.get('/claim/:id', (req, res) => {
  const claims = loadJSON('claims.json');
  const claim = claims.find(c => c.id === req.params.id);
  claim
    ? res.json(claim)
    : res.status(404).json({ error: 'Claim not found' });
});


// 🔹 Advance Claim Status
app.post('/claim/:id/status', (req, res) => {
  const claims = loadJSON('claims.json');
  const claim = claims.find(c => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  const { newStatus } = req.body;
  if (!newStatus) return res.status(400).json({ error: 'Missing newStatus' });

  claim.status = newStatus;
  claim.lastUpdated = new Date().toISOString().split("T")[0];

  fs.writeFileSync(path.join(__dirname, 'claims.json'), JSON.stringify(claims, null, 2));
  res.json({ status: 'Claim updated', claim });
});


// 🟩 Start server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend live on port ${PORT}`);
});
