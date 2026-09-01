
import React from 'react';
import { useData } from '../context/DataContext';
import { mean, fmt1, uniqueSorted } from '../utils/helpers';

export default function KPIGrid({ emp }) {
  const { data: DATA } = useData();
  const avgs = emp.map(e => e.avg).filter(v => v !== null);
  const overallAvg = mean(avgs);
  
  const sorted = [...emp].filter(e => e.avg !== null).sort((a,b) => b.avg - a.avg);
  const top = sorted[0], bottom = sorted[sorted.length-1];
  
  const below85 = emp.filter(e => e.avg !== null && e.avg < 85).length;
  const critical = emp.filter(e => e.band === 'Critical').length;
  
  const fy2425Scores = emp.flatMap(e => e.quarters.slice(0,4)).filter(v => v !== null);
  const fy2526Scores = emp.flatMap(e => e.quarters.slice(4,8)).filter(v => v !== null);
  const fy2425Avg = mean(fy2425Scores);
  const fy2526Avg = mean(fy2526Scores);
  const fyDiff = (fy2425Avg !== null && fy2526Avg !== null) ? fy2526Avg - fy2425Avg : null;

  const funcs = uniqueSorted(emp.map(e => e.function));
  const fy2425FuncAvgs = funcs.map(f => {
    const scores = emp.filter(e => e.function === f).flatMap(e => e.quarters.slice(0,4)).filter(v => v !== null);
    return { f, avg: mean(scores) };
  }).filter(x => x.avg !== null).sort((a,b) => b.avg - a.avg);

  const fy2526FuncAvgs = funcs.map(f => {
    const scores = emp.filter(e => e.function === f).flatMap(e => e.quarters.slice(4,8)).filter(v => v !== null);
    return { f, avg: mean(scores) };
  }).filter(x => x.avg !== null).sort((a,b) => b.avg - a.avg);

  const topFunc2425 = fy2425FuncAvgs[0];
  const botFunc2425 = fy2425FuncAvgs[fy2425FuncAvgs.length - 1];
  const topFunc2526 = fy2526FuncAvgs[0];
  const botFunc2526 = fy2526FuncAvgs[fy2526FuncAvgs.length - 1];

  const cards = [
    {label:'Headcount (filtered)', val: emp.length, sub: `of ${DATA.employees.length} total employees`, cls:'accentbar'},
    {label:'Overall Average', val: fmt1(overallAvg), sub: '8-quarter mean score', cls:'accentbar'},
    {label:'FY 2024-25 Average', val: fmt1(fy2425Avg), sub: 'Q1-Q4 2024-25', cls:'accentbar'},
    {label:'FY 2025-26 Average', val: fmt1(fy2526Avg), sub: 'Q1-Q4 2025-26', cls:'accentbar'},
    {label:'FY YoY Movement', val: (fyDiff===null?'—':(fyDiff>=0?'+':'')+fyDiff.toFixed(1)), sub: 'FY 25-26 vs FY 24-25', cls: fyDiff>=0?'okbar':'warnbar'},
    {label:'Top Performer', val: top? top.avg.toFixed(1): '—', sub: top? top.name : '—', cls:'okbar'},
    {label:'Lowest Performer', val: bottom? bottom.avg.toFixed(1): '—', sub: bottom? bottom.name : '—', cls:'warnbar'},
    {label:'Below 85% Score', val: below85, sub: `${critical} in Critical band`, cls: below85>0?'warnbar':'okbar'},
    {label:'FY 24-25 Top Function', val: topFunc2425 ? fmt1(topFunc2425.avg) : '—', sub: topFunc2425 ? topFunc2425.f : '—', cls:'okbar'},
    {label:'FY 24-25 Bottom Function', val: botFunc2425 ? fmt1(botFunc2425.avg) : '—', sub: botFunc2425 ? botFunc2425.f : '—', cls:'warnbar'},
    {label:'FY 25-26 Top Function', val: topFunc2526 ? fmt1(topFunc2526.avg) : '—', sub: topFunc2526 ? topFunc2526.f : '—', cls:'okbar'},
    {label:'FY 25-26 Bottom Function', val: botFunc2526 ? fmt1(botFunc2526.avg) : '—', sub: botFunc2526 ? botFunc2526.f : '—', cls:'warnbar'}
  ];

  return (
    <div className="kpi-grid">
      {cards.map((c, i) => (
        <div key={i} className={`kpi ${c.cls}`}>
          <div className="klabel">{c.label}</div>
          <div className="kval num">{c.val}</div>
          <div className="ksub">{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
