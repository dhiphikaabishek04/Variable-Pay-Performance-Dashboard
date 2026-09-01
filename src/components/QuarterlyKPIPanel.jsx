
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { uniqueSorted, mean, fmt1 } from '../utils/helpers';

export default function QuarterlyKPIPanel({ emp }) {
  const { data } = useData();
  const Q_LABELS = data.quarter_labels;
  const [qIdx, setQIdx] = useState(Q_LABELS.length - 1);
  const funcs = uniqueSorted(emp.map(e => e.function));
  const HIGH_THRESHOLD = 92;

  let rows = funcs.map(f => {
    const fEmp = emp.filter(e => e.function === f);
    const scores = fEmp.map(e => e.quarters[qIdx]).filter(v => v !== null);
    const avg = mean(scores);
    const highCount = scores.filter(v => v >= HIGH_THRESHOLD).length;
    const highPct = scores.length ? (highCount / scores.length * 100) : null;
    return { f, headcount: scores.length, avg, highPct };
  });

  rows.sort((a, b) => (b.avg || 0) - (a.avg || 0));

  return (
    <div className="panel" style={{marginBottom: '24px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px'}}>
        <h2 style={{margin:0}}>Quarterly Function-wise KPIs</h2>
        <select 
          value={qIdx} 
          onChange={e => setQIdx(parseInt(e.target.value))}
          style={{padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--line)', fontFamily:'inherit', fontSize:'13px'}}
        >
          {Q_LABELS.map((q, i) => <option key={i} value={i}>{q}</option>)}
        </select>
      </div>
      <div className="panel-desc">Average rating and % of employees with a higher rating (≥92, Exceeds/Outstanding) per function.</div>
      <div className="table-scroll" style={{maxHeight: '400px'}}>
        <table style={{width:'100%'}}>
          <thead>
            <tr>
              <th style={{textAlign:'left'}}>Function</th>
              <th style={{textAlign:'right'}}>Valid Scores</th>
              <th style={{textAlign:'right'}}>Average Rating</th>
              <th style={{textAlign:'right'}}>Higher Rating % (≥92)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.f}>
                <td className="name-cell">{r.f}</td>
                <td className="num" style={{textAlign:'right'}}>{r.headcount}</td>
                <td className="num" style={{textAlign:'right', fontWeight:700}}>{fmt1(r.avg)}</td>
                <td className="num" style={{textAlign:'right'}}>{r.highPct !== null ? r.highPct.toFixed(1) + '%' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
