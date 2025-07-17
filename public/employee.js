const id = "e001"; // Replace later with dynamic user authentication

function loadProfile() {
  fetch(`/employee/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("content").innerHTML = `
        <h3>${data.name} (${data.role})</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Started:</strong> ${data.startDate}</p>
        <p><strong>Status:</strong> ${data.active ? "Active" : "Inactive"}</p>
      `;
    });
}

function loadDashboard() {
  fetch(`/employee/${id}/dashboard`)
    .then(res => res.json())
    .then(data => {
      const tasks = data.tasks.map(task => `
        <li>
          <strong>${task.type}</strong> – Claim ${task.claimId} (${task.status})
          <br><small>Due: ${task.dueDate}</small>
          ${task.status !== "done" ? 
            `<br><button onclick="markTaskComplete('${task.id}')">✅ Mark Complete</button>` 
            : "<br><em>✔ Completed</em>"}
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Task Dashboard</h3>
        <p><strong>Clients:</strong> ${data.assignedClients.join(", ")}</p>
        <ul>${tasks}</ul>
      `;
    });
}

function loadTraining() {
  fetch(`/trainingChecklist.json`)
    .then(res => res.json())
    .then(checklist => {
      const entry = checklist.find(e => e.employeeId === id);
      const completed = entry ? entry.completed : [];

      document.getElementById("content").innerHTML = `
        <h3>Training Modules Completed</h3>
        <ul>${completed.map(m => `<li>${m}</li>`).join("")}</ul>
      `;
    });
}

function logActivity() {
  fetch(`/employee/${id}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "Accessed Employee Workspace",
      claimId: "CL-Demo"
    })
  })
  .then(res => res.json())
  .then(result => {
    alert("✅ Activity logged: " + result.entry.action);
  });
}

function markTaskComplete(taskId) {
  fetch(`/employee/${id}/task/${taskId}/complete`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(result => {
    alert("✔ Task Completed");
    loadDashboard(); // Refresh updated task list
  });
}
