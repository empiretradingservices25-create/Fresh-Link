import React, { useState } from "react";

const workflows = [
  { name: "HR/Payroll", key: "hr_workflow" },
  { name: "Inventory", key: "inventory_workflow" },
  { name: "Procurement", key: "procurement_workflow" },
  // Add more...
];

export default function ProcessManagement() {
  const [settings, setSettings] = useState<{ [key: string]: boolean }>({});

  const handleToggle = key => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
    // TODO: persist setting to backend
  };

  return (
    <div>
      <h2>Process Management</h2>
      <ul>
        {workflows.map(wf => (
          <li key={wf.key}>
            <span>{wf.name}</span>
            <input
              type="checkbox"
              checked={!!settings[wf.key]}
              onChange={() => handleToggle(wf.key)}
            />
            <span>{settings[wf.key] ? "AI-Controlled" : "Manual"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}