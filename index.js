const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔧 JSON loader
function loadJSON(fileName) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', fileName), 'utf8'));
}

// 🔹 Health check
app.get('/', (req, res) => {
  res.send('✅ IronLink backend is running.');
});

// 🔹 Get employee profile
app.get('/employee/:id', (req, res) => {
  const employees = loadJSON('employees.json');
  const profile = employees.find(e => e.id === req.params.id);
  profile
    ? res.json(profile)
    : res.status(404).json({ error: 'Employee not found' });
});

// 🔹 Get employee dashboard
app.get('/employee/:id/dashboard', (req, res) => {
  const employees = loadJSON('employees.json');
  const tasks = loadJSON('employeeTasks.json');

  const employee = employees.find(e => e.id === req.params.id);
  const taskBlock = tasks.find(t => t.employeeId === req.params.id);

  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  res.json({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    email: employee.email,
    startDate: employee.startDate,
    assignedClients: employee.assignedClients,
    active: employee.active,
    tasks: taskBlock ? taskBlock.tasks : []
  });
});

// 🔹 Mark a task complete
app.post('/employee/:id/task/:taskId/complete', (req, res) => {
  const tasksPath = path.join(__dirname, 'data', 'employeeTasks.json');
  const logPath = path.join(__dirname, 'data', 'activityLog.json');

  const tasks = loadJSON('employeeTasks.json');
  const log = loadJSON('activityLog.json');

  const block = tasks.find(e => e.employeeId === req.params.id);
  const task = block?.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.status = 'done';

  const entry = {
    employeeId: req.params.id,
    action: `Completed task ${task.type}`,
    claimId: task.claimId,
    timestamp: new Date().toISOString()
  };

  log.push(entry);
  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));

  res.json({ status: 'Task marked complete', task });
});

// 🔹 Log activity
app.post('/employee/:id/activity', (req, res) => {
  const logPath = path.join(__dirname, 'data', 'activityLog.json');
  const log = loadJSON('activityLog.json');

  const { action, claimId } = req.body;
  if (!action || !claimId)
    return res.status(400).json({ error: 'Missing action or claimId' });

  const entry = {
    employeeId: req.params.id,
    action,
    claimId,
    timestamp: new Date().toISOString()
  };

  log.push(entry);
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  res.json({ status: 'Activity logged', entry });
});

// 🔹 Submit training module
app.post('/employee/:id/onboarding', (req, res) => {
  const checklistPath = path.join(__dirname, 'data', 'trainingChecklist.json');
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

  fs.writeFileSync(checklistPath, JSON.stringify(checklist, null, 2));
  res.json({ status: 'Training module completed', employeeId: req.params.id, moduleId });
});

// 🔹 Get claim data
app.get('/claim/:id', (req, res) => {
  const claims = loadJSON('claims.json');
  const claim = claims.find(c => c.id === req.params.id);
  claim
    ? res.json(claim)
    : res.status(404).json({ error: 'Claim not found' });
});

// 🔹 Update claim status
app.post('/claim/:id/status', (req, res) => {
  const claimsPath = path.join(__dirname, 'data', 'claims.json');
  const claims = loadJSON('claims.json');

  const claim = claims.find(c => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  const { newStatus } = req.body;
  if (!newStatus)
    return res.status(400).json({ error: 'Missing newStatus' });

  claim.status = newStatus;
  claim.lastUpdated = new Date().toISOString().split("T")[0];

  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
  res.json({ status: 'Claim updated', claim });
});

// 🔹 Get claim notes
app.get('/claim/:id/notes', (req, res) => {
  const notes = loadJSON('claimNotes.json');
  const thread = notes.filter(n => n.claimId === req.params.id);
  res.json(thread);
});

// 🔹 Add claim note
app.post('/claim/:id/notes', (req, res) => {
  const notesPath = path.join(__dirname, 'data', 'claimNotes.json');
  const notes = loadJSON('claimNotes.json');

  const { author, message } = req.body;
  if (!author || !message) {
    return res.status(400).json({ error: 'Missing author or message' });
  }

  const entry = {
    claimId: req.params.id,
    author,
    message,
    timestamp: new Date().toISOString()
  };

  notes.push(entry);
  fs.writeFileSync(notesPath, JSON.stringify(notes, null, 2));
  res.json({ status: 'Note added', entry });
});

// 🔹 Filter claims by status, client, and/or date
app.post('/claims/filter', (req, res) => {
  const claims = loadJSON('claims.json');
  const { status, client, date } = req.body;

  let filtered = claims;

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }

  if (client) {
    filtered = filtered.filter(c => c.client === client);
  }

  if (date) {
    filtered = filtered.filter(c => c.lastUpdated === date);
  }

  res.json({ results: filtered });
});

// 🔹 Start server
app.listen(PORT, () => {
  console.log(`🚀 IronLink backend live on port ${PORT}`);
});
