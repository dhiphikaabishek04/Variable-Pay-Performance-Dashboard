
import React from 'react';

export default function Tabs({ currentTab, setCurrentTab }) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'function', label: 'Function / Department‑wise' },
    { id: 'designation', label: 'Designation‑wise' },
    { id: 'employee', label: 'Employee‑wise' },
    { id: 'insights', label: 'Business Insights' }
  ];

  return (
    <div className="tabs">
      {tabs.map(t => (
        <button 
          key={t.id} 
          className={`tab-btn ${currentTab === t.id ? 'active' : ''}`} 
          onClick={() => setCurrentTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
