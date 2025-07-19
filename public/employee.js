const id = "e001"; // Replace with dynamic session logic once login module added

// Load employee profile
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

// Load dashboard with task list and role-based admin panel
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

      let adminPanel = "";
      if (data.role === "admin") {
        adminPanel = `
          <hr>
          <h4>📈 Admin Tools</h4>
          <button onclick="loadFilteredClaims()">📂 Filter Claims</button>
          <button onclick="loadKPI()">📊 KPI Dashboard</button>
        `;
      }

      document.getElementById("content").innerHTML = `
        <h3>Assigned Tasks</h3>
        <ul>${taskList}</ul>
        ${adminPanel}
      `;
    });
}

// Mark a task complete
function markTaskComplete(taskId) {
  fetch(`/employee/${id}/task/${taskId}/complete`, { method: "POST" })
    .then(res => res.json())
    .then(() => {
      alert("✔ Task Completed");
      loadDashboard();
    });
}

// Load training modules
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

      const list = modules.map(mod => `
        <li>
          ${mod.replace(/_/g, " ")} ${completed.includes(mod)
            ? "✔"
            : `<button onclick="completeModule('${mod}')">✅ Complete</button>`}
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Training Checklist</h3>
        <ul>${list}</ul>
      `;
    });
}

// Submit training module
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

// Log manual workspace activity
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

// Load claim panel with status tracker + ZIP export
function loadClaimBar(claimId) {
  fetch(`/claim/${claimId}`)
    .then(res => res.json())
    .then(claim => {
      const flow = ["received", "in_review", "zip_sent", "archived"];
      const bar = flow.map(status => {
        const active = claim.status === status;
        return `<span style="margin-right:20px; font-weight:${active ? 'bold' : 'normal'}">
          ${status.replace(/_/g, " ")} ${active ? "🟢" : ""}
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
        <button onclick="exportZIP('${claim.id}')">🗂️ Generate ZIP</button>
      `;

      loadNotes(claim.id);
    });
}

// Advance claim status forward through lifecycle
function advanceStatus(claimId, currentStatus) {
  const flow = ["received", "in_review", "zip_sent", "archived"];
  const nextIndex = flow.indexOf(currentStatus) + 1;
  const nextStatus = flow[nextIndex] || currentStatus;

  fetch(`/claim/${claimId}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStatus: nextStatus })
  })
    .then(res => res.json())
    .then(() => {
      loadClaimBar(claimId);
    });
}

// Trigger ZIP export and log event
function exportZIP(claimId) {
  fetch(`/claim/${claimId}/zip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ employeeId: id })
  })
    .then(res => res.json())
    .then(() => {
      alert(`📦 ZIP Export Logged for Claim ${claimId}`);
    });
}

// Load claim notes
function loadNotes(claimId) {
  fetch(`/claim/${claimId}/notes`)
    .then(res => res.json())
    .then(thread => {
      const list = thread.map(n => `
        <li><strong>${n.author}</strong>: ${n.message}
        <br><small>${new Date(n.timestamp).toLocaleString()}</small></li>
      `).join("");

      document.getElementById("content").innerHTML += `
        <h4>Claim Notes</h4>
        <ul>${list}</ul>
        <textarea id="newNote" rows="3" placeholder="Write a note..."></textarea><br>
        <button onclick="submitNote('${claimId}')">💾 Save Note</button>
      `;
    });
}

// Submit new note to claim
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

// Run filtered claim search
function loadFilteredClaims() {
  const status = document.getElementById("filterStatus").value;
  const client = document.getElementById("filterClient").value;
  const date = document.getElementById("filterDate").value;

  fetch(`/claims/filter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: status || null,
      client: client || null,
      date: date || null
    })
  })
    .then(res => res.json())
    .then(data => {
      const list = data.results.map(c => `
        <li>
          <strong>${c.id}</strong> — ${c.client} ($${c.amount.toFixed(2)})
          <br>Status: ${c.status}
          <br>Updated: ${c.lastUpdated}
          <br><button onclick="loadClaimBar('${c.id}')">📊 View Claim</button>
        </li>
      `).join("");

      document.getElementById("content").innerHTML = `
        <h3>Filtered Claims</h3>
        <ul>${list}</ul>
      `;
    });
}

// Load KPI dashboard for admins
function loadKPI() {
  fetch(`/admin/${id}/kpi`)
    .then(res => res.json())
    .then(metrics => {
      document.getElementById("content").inner
