const id = "e001"; // Replace with dynamic login/session later

// 🔹 Load Profile
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

// 🔹 Load Dashboard (Tasks)
function loadDashboard() {
  fetch(`/employee/${id}/dashboard`)
    .then(res => res.json())
    .then(data => {
      const list = data.tasks.map(task => `
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
        <ul>${list}</ul>
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

// 🔹 Load Training Checklist
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

// 🔹 Log Activity
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

// 🔹 Load Claim Panel + Status
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
      `;

      loadNotes(claim.id);
    });
}

// 🔹 Advance Claim Status
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

// 🔹 Load Claim Notes
function loadNotes(claimId) {
  fetch(`/claim/${claimId}/notes`)
    .then(res => res.json())
    .then(thread => {
      const list = thread.map(n => `
        <li>
          <strong>${n.author}</strong>: ${n.message}
          <br><small>${new Date(n.timestamp).toLocaleString()}</small>
        </li>
      `).join("");

      document.getElementById("content").innerHTML += `
        <h4>Claim Notes</h4>
        <ul>${list}</ul>
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

// 🔹 Load Filtered Claims
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
