// === IronLink Employee Workspace Frontend Logic ===
const id = "e001"; // Replace with dynamic login/session ID later

// 🔹 Load employee profile
function loadProfile() {
  fetch(`/employee/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("content").innerHTML = `
        <h3>${data.name} (${data.role})</h3>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Start Date:</strong> ${data.startDate}</p>
        <p><strong>Status:</strong> ${data.active ? "Active" : "Inactive"}</p>
        <p><strong>Clients:</strong> ${data.assignedClients.join(", ")}</p>
      `;
    });
}

// 🔹 Load dashboard (tasks and claim links)
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
          <br><button onclick="loadClaimBar('${task.claimId}')">📊 View Claim</button>
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Assigned Tasks</h3>
        <ul>${tasks}</ul>
      `;
    });
}

// 🔹 Mark task complete
function markTaskComplete(taskId) {
  fetch(`/employee/${id}/task/${taskId}/complete`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      alert("✔ Task Completed");
      loadDashboard();
    });
}

// 🔹 Load training checklist
function loadTraining() {
  fetch(`/data/trainingChecklist.json`)
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

      const list = modules.map(mod => {
        return `<li>
          ${mod.replace(/_/g, " ")} ${completed.includes(mod)
            ? "✔"
            : `<button onclick="completeModule('${mod}')">✅ Complete</button>`}
        </li>`;
      }).join("");

      document.getElementById("content").innerHTML = `
        <h3>Training Checklist</h3>
        <ul>${list}</ul>
      `;
    });
}

// 🔹 Complete training module
function completeModule(moduleId) {
  fetch(`/employee/${id}/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleId })
  })
    .then(res => res.json())
    .then(() => {
      alert("✔ Training module updated");
      loadTraining();
    });
}

// 🔹 Log activity (generic POST)
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
      alert(`✅ ${result.entry.action}`);
    });
}

// 🔹 Load claim status dashboard bar
function loadClaimBar(claimId) {
  fetch(`/claim/${claimId}`)
    .then(res => res.json())
    .then(claim => {
      const steps = ["received", "in_review", "zip_sent", "archived"];
      const progress = steps.map(step => {
        const isActive = claim.status === step;
        return `<span style="margin-right:20px; font-weight:${isActive ? 'bold' : 'normal'}">
          ${step.replace(/_/g, " ")} ${isActive ? "🟢" : ""}
        </span>`;
      }).join("");

      document.getElementById("content").innerHTML = `
        <h3>Claim ${claim.id}</h3>
        <p><strong>Client:</strong> ${claim.client}</p>
        <p><strong>Amount:</strong> $${claim.amount.toFixed(2)}</p>
        <p><strong>Last Updated:</strong> ${claim.lastUpdated}</p>
        <div style="padding:10px; background:#f0f0f0; border-radius:6px; margin-bottom:10px;">
          ${progress}
        </div>
        <button onclick="advanceStatus('${claim.id}', '${claim.status}')">Advance Status</button>
      `;
    });
}

// 🔹 Advance claim status
function advanceStatus(claimId, currentStatus) {
  const flow = ["received", "in_review", "zip_sent", "archived"];
  const nextIndex = flow.indexOf(currentStatus) + 1;
  const newStatus = flow[nextIndex] || currentStatus;

  fetch(`/claim/${claimId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStatus })
  })
    .then(res => res.json())
    .then(() => {
      loadClaimBar(claimId);
    });
}
