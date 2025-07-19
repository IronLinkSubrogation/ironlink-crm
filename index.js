require('dotenv').config();

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY;
const DATA_DIR = process.env.DATA_DIR || './data';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔐 Middleware for admin protection
function verifyAdmin(req, res, next) {
  const sentKey = req.headers['x-admin-key'];
  if (sentKey !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Unauthorized: Invalid admin key' });
  }
  next();
}

// 🧠 Helper to load JSON data
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
}

// 🏠 Optional: Serve frontend from root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'employee.html'));
});

// 🔹 Employee Profile
app.get('/employee/:id', (req, res) => {
  const employees = loadJSON('employees.json');
  const profile = employees.find(e => e.id === req.params.id);
  profile ? res.json(profile) : res.status(404).json({ error: 'Employee not found' });
});

// 🔹 Dashboard
app.get('/employee/:id/dashboard', (req, res) => {
  const employees = loadJSON('employees.json');
  const tasks = loadJSON('employeeTasks.json');
  const employee = employees.find(e => e.id === req.params.id);
  const taskBlock = tasks.find(t => t.employeeId === req.params.id);

  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  res.json({
    ...employee,
    tasks: taskBlock ? taskBlock.tasks : []
  });
});

// 🔹 Mark Task Complete
app.post('/employee/:id/task/:taskId/complete', (req, res) => {
  const tasksPath = path.join(DATA_DIR, 'employeeTasks.json');
  const logPath = path.join(DATA_DIR, 'activityLog.json');
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

  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  res.json({ status: 'Task marked complete', task });
});

// 🔹 Manual Activity Log
app.post('/employee/:id/activity', (req, res) => {
  const logPath = path.join(DATA_DIR, 'activityLog.json');
  const log = loadJSON('activityLog.json');
  const { action, claimId } = req.body;

  if (!action || !claimId) return res.status(400).json({ error: 'Missing action or claimId' });

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

// 🔹 Training Module Completion
app.post('/employee/:id/onboarding', (req, res) => {
  const checklistPath = path.join(DATA_DIR, 'trainingChecklist.json');
  const checklist = loadJSON('trainingChecklist.json');
  const { moduleId } = req.body;

  if (!moduleId) return res.status(400).json({ error: 'Missing moduleId' });

  let entry = checklist.find(e => e.employeeId === req.params.id);
  if (!entry) {
    checklist.push({ employeeId: req.params.id, completed: [moduleId] });
  } else if (!entry.completed.includes(moduleId)) {
    entry.completed.push(moduleId);
  }

  fs.writeFileSync(checklistPath, JSON.stringify(checklist, null, 2));
  res.json({ status: 'Training module logged', moduleId });
});

// 🔹 Get Claim
app.get('/claim/:id', (req, res) => {
  const claims = loadJSON('claims.json');
  const claim = claims.find(c => c.id === req.params.id);
  claim ? res.json(claim) : res.status(404).json({ error: 'Claim not found' });
});

// 🔹 Update Claim Status
app.post('/claim/:id/status', (req, res) => {
  const claimsPath = path.join(DATA_DIR, 'claims.json');
  const claims = loadJSON('claims.json');
  const { newStatus } = req.body;

  const claim = claims.find(c => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });
  if (!newStatus) return res.status(400).json({ error: 'Missing newStatus' });

  claim.status = newStatus;
  claim.lastUpdated = new Date().toISOString().split("T")[0];

  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2));
  res.json({ status: 'Claim status updated', claim });
});

// 🔹 Claim Notes
app.get('/claim/:id/notes', (req, res) => {
  const notes = loadJSON('claimNotes.json');
  const thread = notes.filter(n => n.claimId === req.params.id);
  res.json(thread);
});

app.post('/claim/:id/notes', (req, res) => {
  const notesPath = path.join(DATA_DIR, 'claimNotes.json');
  const notes = loadJSON('claimNotes.json');
  const { author, message } = req.body;

  if (!author || !message) return res.status(400).json({ error: 'Missing author or message' });

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

// 🔹 Claim Filtering
app.post('/claims/filter', (req, res) => {
  const claims = loadJSON('claims.json');
  const { status, client, date } = req.body;

  let filtered = claims;
  if (status) filtered = filtered.filter(c => c.status === status);
  if (client) filtered = filtered.filter(c => c.client === client);
  if (date) filtered = filtered.filter(c => c.lastUpdated === date);

  res.json({ results: filtered });
});

// 🔹 ZIP Export Simulation
app.post('/claim/:id/zip', (req, res) => {
  const logPath = path.join(DATA_DIR, 'activityLog.json');
  const log = loadJSON('activityLog.json');
  const { employeeId } = req.body;

  if (!employeeId) return res.status(400).json({ error: 'Missing employeeId' });

  log.push({
    employeeId,
    action: "Exported ZIP for claim",
    claimId: req.params.id,
    timestamp: new Date().toISOString()
  });

  fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  res.json({ status: "ZIP export logged" });
});

// 🔹 KPI Dashboard (Protected)
app.get('/admin/:id/kpi', verifyAdmin, (req, res) => {
  const log = loadJSON('activityLog.json');
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recent = log.filter(entry => new Date(entry.timestamp) > sevenDaysAgo);
  const metrics = {
    tasksCompleted: recent.filter(e => e.action.startsWith("Completed task")).length,
    notesLogged: recent.filter(e => e.action === "Added claim note").length,
    zipExports: recent.filter(e => e.action === "Exported ZIP for claim").length,
    totalActivities: recent.length
  };

  res.json(metrics);
});

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 IronLink CRM backend live on port ${PORT}`);
});
