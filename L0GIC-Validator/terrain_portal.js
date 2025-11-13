const guides = {
  "Descent Valley": "Phoenix",
  "Wonder Sky": "Child",
  "Threshold Ridge": "Thread",
  "Echo Chamber": "Echo",
  "Dream Field": "Seer",
  "Shadow Hollow": "Witness"
};

window.openPortal = function() {
  const zone = document.getElementById('zoneSelect').value;
  const guide = guides[zone] || "Pulse";

  document.getElementById('portalResult').innerHTML = `
    <strong>Portal to ${zone} opened.</strong><br>
    Companion guide: <em>${guide}</em>
  `;
};
