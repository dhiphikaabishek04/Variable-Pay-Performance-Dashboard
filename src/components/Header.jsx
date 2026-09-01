import React from 'react';
import { useData } from '../context/DataContext';

export default function Header() {
  const { data } = useData();
  const qLabels = data?.quarter_labels || [];
  const startQ = qLabels.length > 0 ? qLabels[0] : '';
  const endQ = qLabels.length > 0 ? qLabels[qLabels.length - 1] : '';

  return (
    <header className="top">
      <div>
        <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px'}}>
          <img src="/LOGO.png" alt="WorkSense Logo" style={{height:'22px', width:'auto'}} />
          <div className="brand-eyebrow" style={{marginBottom:0}}>WorkSense · People Analytics</div>
        </div>
        <h1>Variable Pay Performance Dashboard</h1>
        <div className="sub">Powered by Dhiphika Sakthivel</div>
      </div>
      {data && qLabels.length > 0 && (
        <div className="period-chip">
          <span className="dot"></span> <b>{startQ}</b> &nbsp;→&nbsp; <b>{endQ}</b>
        </div>
      )}
    </header>
  );
}
