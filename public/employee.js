function loadClaimBar(claimId) {
  fetch(`/claim/${claimId}`)
    .then(res => res.json())
    .then(claim => {
      const statusFlow = ["received", "in_review", "zip_sent", "archived"];
      const bar = statusFlow.map(status => {
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

      // ✅ This loads notes after the claim bar
      loadNotes(claim.id);
    });
}
