const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// --- Load JSON Data Helper ---
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, file), 'utf8'));
}

// --- ROUTES ---

// Root confirmation
app.get('/', (req, res) => {
  res.send('IronLink CRM backend is running.');
});


// --- EMPLOYEE PROFILE ROUTES ---

// Get single employee profile
app.get('/employee/:id', (req, res) => {
  const id = req.params.id;
  const employees = loadJSON('employees.json');
  const profile = employees.find(emp => emp.id === id);

  if (profile) {
    res.json(profile);
  } else {
    res.status(404).json({ error: 'Employee not found' });
  }
});

// Get employee dashboard overview
app.get('/employee/:id/dashboard', (req, res) => {
  const id = req.params.id;
  const employees = loadJSON('employees.json');
  const tasks = loadJSON('employeeTasks.json');

  const employee = employees.find(emp => emp.id === id);
  const taskList = tasks.find(t => t.employeeId === id);

  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  res.json({
    name: employee.name,
    role: employee.role,
    assignedClients: employee.assignedClients,
    active: employee.active,
    startDate: employee.startDate,
    tasks: taskList ? taskList.tasks : [],
  });
});

// Log new activity for employee
app.post('/employee/:id/activity', (req, res) => {
  const id = req.params.id;
  const logData = loadJSON('activityLog.json');
  const { action, claimId } = req.body;

  const entry = {
    employeeId: id,
    action,
    claimId,
    timestamp: new Date().toISOString()
  };

  logData.push(entry);
  fs.writeFileSync(path.join(__dirname, 'activityLog.json'), JSON.stringify(logData, null, 2));

  res.json({ status: 'Activity logged', entry });
});

// Mark onboarding checklist module complete
app.post('/employee/:id/onboarding', (req, res) => {
  const id = req.params.id;
  const { moduleId } = req.body;

  const checklist = loadJSON('trainingChecklist.json');
  const employeeChecklist = checklist.find(entry => entry.employeeId === id);

  if (!employeeChecklist) {
    checklist.push({ employeeId: id, completed: [moduleId] });
  } else {
    if (!employeeChecklist.completed.includes(moduleId)) {
      employeeChecklist.completed.push(moduleId);
    }
  }

  fs.writeFileSync(path.join(__dirname, 'trainingChecklist.json'), JSON.stringify(checklist, null, 2));

  res.json({ status: 'Checklist updated', employeeId: id, moduleId });
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`IronLink backend running on port ${PORT}`);
});
