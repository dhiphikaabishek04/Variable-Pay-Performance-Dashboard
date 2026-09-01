
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { fmt1, trendArrow, SparkSvg, BAND_COLOR } from '../../utils/helpers';

export default function EmployeeTab({ emp, searchState, setSearchState }) {
  const { data: DATA } = useData();
  const [selectedEmp, setSelectedEmp] = useState(null);

  return (
    <div className="tab-panel active">
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2>Employee Roster</h2>
            <div className="panel-desc">Individual performance records. Click a row to view deep dive.</div>
          </div>
          <div className="search-box">
            <span style={{ color: 'var(--ink-faint)' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Search Name or ID..." 
              value={searchState} 
              onChange={e => setSearchState(e.target.value.toLowerCase())} 
            />
          </div>
        </div>

        <div className="grid-list">
          <div className="list-col">
            <div className="table-scroll">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th className="num">Avg Score</th>
                    <th className="num">Trend</th>
                    <th>Band</th>
                  </tr>
                </thead>
                <tbody>
                  {emp.map(e => {
                    const latest = e.quarters[e.quarters.length - 1];
                    const prev = e.quarters[e.quarters.length - 2];
                    const delta = (latest !== null && prev !== null) ? latest - prev : null;
                    const isSelected = selectedEmp?.code === e.code;
                    return (
                      <tr key={e.code} className={isSelected ? 'selected' : ''} onClick={() => setSelectedEmp(e)}>
                        <td className="code-cell">{e.code}</td>
                        <td className="name-cell">{e.name}</td>
                        <td className="num" style={{ fontWeight: 600 }}>{fmt1(e.avg)}</td>
                        <td className="num" dangerouslySetInnerHTML={{ __html: trendArrow(delta) }}></td>
                        <td>
                          <span className="band-chip" style={{ background: BAND_COLOR[e.band], color: 'white' }}>{e.band}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-col">
            {selectedEmp ? (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>{selectedEmp.name}</h3>
                <div style={{ fontSize: '12px', color: 'var(--ink-faint)', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>{selectedEmp.code}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <span className="badge badge-ok">{selectedEmp.function}</span>
                  <span className="badge badge-warn">{selectedEmp.designation}</span>
                  <span className="badge">{selectedEmp.region}</span>
                </div>

                <h4>Performance Snapshot</h4>
                <table style={{ width: '100%', marginBottom: '24px' }}>
                  <tbody>
                    <tr><td className="code-cell" style={{ borderBottom: '1px solid var(--line)' }}>Overall Average</td><td className="num" style={{ borderBottom: '1px solid var(--line)' }}>{fmt1(selectedEmp.avg)}</td></tr>
                    <tr><td className="code-cell" style={{ borderBottom: '1px solid var(--line)' }}>vs Org avg</td><td className="num" style={{ borderBottom: '1px solid var(--line)' }}>
                      {selectedEmp.avg !== null ? ((selectedEmp.avg - DATA.kpis.overall_avg) >= 0 ? '+' : '') + (selectedEmp.avg - DATA.kpis.overall_avg).toFixed(1) : '—'}
                    </td></tr>
                    <tr><td className="code-cell" style={{ borderBottom: '1px solid var(--line)' }}>Standard Deviation</td><td className="num" style={{ borderBottom: '1px solid var(--line)' }}>{fmt1(selectedEmp.std)}</td></tr>
                    <tr><td className="code-cell" style={{ borderBottom: '1px solid var(--line)' }}>Net Trend (Q1→Q8)</td><td className="num" style={{ borderBottom: '1px solid var(--line)' }}>
                      {selectedEmp.trend !== null ? (selectedEmp.trend >= 0 ? '+' : '') + selectedEmp.trend.toFixed(1) : '—'}
                    </td></tr>
                  </tbody>
                </table>

                <h4>Quarterly Trajectory</h4>
                <div style={{ background: 'var(--surface-alt)', padding: '12px', borderRadius: '6px' }}>
                  <SparkSvg quarters={selectedEmp.quarters} w={240} h={60} />
                </div>
              </div>
            ) : (
              <div className="empty-state">Select an employee from the roster to view their detailed performance profile.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
