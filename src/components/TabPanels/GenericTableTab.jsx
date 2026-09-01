
import React from 'react';
import { useData } from '../../context/DataContext';
import { uniqueSorted, mean, fmt1, trendArrow, SparkSvg } from '../../utils/helpers';

export default function GenericTableTab({ emp, groupField, title, desc }) {
  const { data } = useData();
  const Q_SHORT = data.quarter_labels.map(l => l.replace('20', "'").replace(' ', ' '));
  const groups = uniqueSorted(emp.map(e => e[groupField]));
  const summary = groups.map(g => {
    const gEmp = emp.filter(e => e[groupField] === g);
    const avgs = gEmp.map(e => e.avg).filter(v => v !== null);
    const overall = mean(avgs);
    const below85 = gEmp.filter(e => e.avg !== null && e.avg < 85).length;
    const qAvgs = Q_SHORT.map((_, i) => mean(gEmp.map(e => e.quarters[i])));
    return { name: g, headcount: gEmp.length, avg: overall, below85, quarterly: qAvgs };
  });

  summary.sort((a, b) => b.avg - a.avg);

  return (
    <div className="tab-panel active">
      <div className="panel">
        <h2>{title}</h2>
        <div className="panel-desc">{desc}</div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>{groupField === 'function' ? 'Function' : 'Designation'}</th>
                <th className="num">Headcount</th>
                <th className="num">Overall Avg</th>
                <th className="num">Below 85%</th>
                <th className="num">Recent Trend</th>
                <th>Quarterly Trend (Q1 24-25 → Q4 25-26)</th>
              </tr>
            </thead>
            <tbody>
              {summary.map(s => {
                const latest = s.quarterly[s.quarterly.length - 1];
                const prev = s.quarterly[s.quarterly.length - 2];
                const delta = (latest !== null && prev !== null) ? latest - prev : null;
                return (
                  <tr key={s.name}>
                    <td className="name-cell">{s.name}</td>
                    <td className="num">{s.headcount}</td>
                    <td className="num"><span className={`badge ${s.avg >= 85 ? 'badge-ok' : 'badge-warn'}`}>{fmt1(s.avg)}</span></td>
                    <td className="num"><span style={{ color: s.below85 > 0 ? 'var(--below)' : 'inherit' }}>{s.below85}</span></td>
                    <td className="num" dangerouslySetInnerHTML={{ __html: trendArrow(delta) }}></td>
                    <td style={{ padding: '6px 12px' }}><SparkSvg quarters={s.quarterly} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
