const id = "e001"; // Future: replace with dynamic user session

// 🔹 Load Profile Panel
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

// 🔹 Load Dashboard Panel
function loadDashboard() {
  fetch(`/employee/${id}/dashboard`)
    .then(res => res.json())
    .then(data => {
      const taskList = data.tasks.map(task => `
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
        <ul>${taskList}</ul>
      `;
    });
}

// 🔹 Mark Task Complete
function markTaskComplete(taskId) {
  fetch(`/employee/${id}/task/${taskId}/complete`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      alert("✔ Task Completed");
      loadDashboard();
    });
}

// 🔹 Load Training Module Panel
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

      const moduleList = modules.map(mod => `
        <li>
          ${mod.replace(/_/g, " ")} ${completed.includes(mod)
            ? "✔"
            : `<button onclick="completeModule('${mod}')">✅ Complete</button>`}
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Training Checklist</h3>
        <ul>${moduleList}</ul>
      `;
    });
}

// 🔹 Submit Training Module
function completeModule(moduleId) {
  fetch(`/employee/${id}/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ moduleId })
  })
    .then(res => res.json())
    .then(() => {
      alert("✔ Module Completed");
      loadTraining();
    });
}

// 🔹 Log Workspace Activity
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
      alert(`✅ Logged: ${result.entry.action}`);
    });
}

// 🔹 Load Claim Panel + Status Bar
function loadClaimBar(claimId) {
  fetch(`/claim/${claimId}`)
    .then(res => res.json())
    .then(claim => {
      const steps = ["received", "in_review", "zip_sent", "archived"];
      const bar = steps.map(status => {
        const isActive = claim.status === status;
        return `<span style="margin-right:20px; font-weight:${isActive ? 'bold' : 'normal'}">
          ${status.replace(/_/g, " ")} ${isActive ? "🟢" : ""}
        </span>`;
      }).join("");

      document.getElementById("content").innerHTML = `
        <h3>Claim ${claim.id}</h3>
        <p><strong>Client:</strong> ${claim.client}</p>
        <p><strong>Amount:</strong> $${claim.amount.toFixed(2)}</p>
        <p><strong>Last Updated:</strong> ${claim.lastUpdated}</p>
        <div style="padding:10px; background:#f0f0f0; border-radius:6px;">
          ${bar}
        </div>
        <br>
        <button onclick="advanceStatus('${claim.id}', '${claim.status}')">Advance Status</button>
      `;

      loadNotes(claim.id); // 🔹 Load notes after claim panel
    });
}

// 🔹 Advance Claim Status
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

// 🔹 Load Claim Notes Panel
function loadNotes(claimId) {
  fetch(`/claim/${claimId}/notes`)
    .then(res => res.json())
    .then(thread => {
      const notesHTML = thread.map(n => `
        <li>
          <strong>${n.author}</strong>: ${n.message}
          <br><small>${new Date(n.timestamp).toLocaleString()}</small>
        </li>
      `).join("");

      document.getElementById("content").innerHTML += `
        <h4>Claim Notes</h4>
        <ul>${notesHTML}</ul>
        <textarea id="newNote" rows="3" placeholder="Write a note..."></textarea><br>
        <button onclick="submitNote('${claimId}')">💾 Save Note</button>
      `;
    });
}

// 🔹 Submit Claim Note
function submitNote(claimId) {
  const msg = document.getElementById("newNote").value.trim();
  if (!msg) return alert("Note cannot be empty.");

  fetch(`/claim/${claimId}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ author: id, message: msg })
  })
    .then(res => res.json())
    .then(() => {
      alert("📝 Note saved");
      loadClaimBar(claimId);
    });
}
