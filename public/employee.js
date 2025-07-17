// === IronLink Employee Workspace Logic ===
const id = "e001"; // Replace with dynamic login/session logic later

// 🔹 Load profile info
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

// 🔹 Load task dashboard with claim buttons
function loadDashboard() {
  fetch(`/employee/${id}/dashboard`)
    .then(res => res.json())
    .then(data => {
      const tasks = data.tasks.map(task => `
        <li>
          <strong>${task.type}</strong> – Claim ${task.claimId} (${task.status})
          <br><small>Due: ${task.dueDate}</small>
          ${task.status !== "done"
            ? `<br><button onclick="markTaskComplete('${task.id}')">✅ Mark Complete</button>`
            : "<br><em>✔ Completed</em>"}
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Dashboard Overview</h3>
        <p><strong>Clients:</strong> ${data.assignedClients.join(", ")}</p>
        <ul>${tasks}</ul>
      `;
    });
}

// 🔹 Mark a task as complete via backend POST
function markTaskComplete(taskId) {
  fetch(`/employee/${id}/task/${taskId}/complete`, {
    method: "POST"
  })
    .then(res => res.json())
    .then(result => {
      alert("✔ Task Completed");
      loadDashboard(); // Refresh dashboard
    });
}

// 🔹 Load training checklist and render status
function loadTraining() {
  fetch(`/trainingChecklist.json`)
    .then(res => res.json())
    .then(checklist => {
      const entry = checklist.find(e => e.employeeId === id);
      const completed = entry ? entry.completed : [];

      const modules = [
        "intro_module",
        "client_handling",
        "upload_process",
        "zip_exporting",
        "analytics_intro"
      ];

      const checklistHTML = modules.map(mod => {
        const isDone = completed.includes(mod);
        return `
          <li>
            ${mod.replace(/_/g, " ")} 
            ${isDone ? "✔" : `<button onclick="completeModule('${mod}')">✅ Complete</button>`}
          </li>
        `;
      }).join("");

      document.getElementById("content").innerHTML = `
        <h3>Training Checklist</h3>
        <ul>${checklistHTML}</ul>
      `;
    });
}

// 🔹 POST training module completion
function completeModule(moduleId) {
  fetch(`/employee/${id}/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleId })
  })
    .then(res => res.json())
    .then(result => {
      alert(`✔ Module Completed: ${moduleId}`);
      loadTraining(); // Refresh checklist
    });
}

// 🔹 Log a generic activity
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
      alert("✅ Activity logged: " + result.entry.action);
    });
}
