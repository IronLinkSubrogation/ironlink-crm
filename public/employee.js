// === IronLink Employee Workspace Logic ===
const id = "e001"; // Replace later with dynamic login/session handling

function loadProfile() {
  fetch(`/employee/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("content").innerHTML = `
        <h3>${data.name} (${data.role})</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Start Date:</strong> ${data.startDate}</p>
        <p><strong>Status:</strong> ${data.active ? "Active" : "Inactive"}</p>
      `;
    });
}

function loadDashboard() {
  fetch(`/employee/${id}/dashboard`)
    .then(res => res.json())
    .then(data => {
      const taskList = data.tasks && data.tasks.length > 0
        ? data.tasks.map(task => `
            <li>
              <strong>${task.type}</strong> – Claim ${task.claimId} (${task.status})
              <br><small>Due: ${task.dueDate}</small>
            </li>
          `).join("")
        : "<li>No tasks assigned</li>";

      document.getElementById("content").innerHTML = `
        <h3>Dashboard Overview</h3>
        <p><strong>Clients:</strong> ${data.assignedClients.join(", ")}</p>
        <ul>${taskList}</ul>
      `;
    });
}

function loadTraining() {
  fetch(`/trainingChecklist.json`)
    .then(res => res.json())
    .then(checklist => {
      const entry = checklist.find(e => e.employeeId === id);
      const completed = entry ? entry.completed : [];

      const modules = completed.length > 0
        ? completed.map(mod => `<li>${mod}</li>`).join("")
        : "<li>No modules completed</li>";

      document.getElementById("content").innerHTML = `
        <h3>Training Progress</h3>
        <ul>${modules}</ul>
      `;
    });
}

function logActivity() {
  fetch(`/employee/${id}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "Accessed Workspace",
      claimId: "CL-Demo"
    })
  })
  .then(res => res.json())
  .then(result => {
    alert("✅ Activity Logged: " + result.entry.action);
  });
}
