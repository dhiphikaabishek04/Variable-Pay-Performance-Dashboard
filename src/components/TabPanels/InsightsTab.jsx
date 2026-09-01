
import React from 'react';
import { useData } from '../../context/DataContext';
import { mean, uniqueSorted } from '../../utils/helpers';

export default function InsightsTab({ emp }) {
  const { data: DATA } = useData();
  const generateInsights = () => {
    let out = [];
    const criticalEmp = emp.filter(e => e.band === 'Critical' || e.band === 'Below');
    if (criticalEmp.length > 0) {
      out.push({
        type: 'danger',
        title: 'At-Risk Cohort Detected',
        text: `${criticalEmp.length} employees (${(criticalEmp.length / emp.length * 100).toFixed(1)}%) in current filtered view are in 'Below' or 'Critical' bands.`
      });
    }

    const avgs = emp.map(e => e.avg).filter(v => v !== null);
    if (avgs.length > 0) {
      const cohortAvg = mean(avgs);
      const diff = cohortAvg - DATA.kpis.overall_avg;
      if (Math.abs(diff) > 2) {
        out.push({
          type: diff > 0 ? 'success' : 'danger',
          title: 'Cohort Deviation from Org Baseline',
          text: `This filtered group averages ${cohortAvg.toFixed(1)}, which is ${Math.abs(diff).toFixed(1)} points ${diff > 0 ? 'above' : 'below'} the organizational average of ${DATA.kpis.overall_avg.toFixed(1)}.`
        });
      }
    }

    const funcs = uniqueSorted(emp.map(e => e.function));
    funcs.forEach(f => {
      const fEmp = emp.filter(e => e.function === f);
      const q8 = fEmp.map(e => e.quarters[7]).filter(v => v !== null);
      const q7 = fEmp.map(e => e.quarters[6]).filter(v => v !== null);
      if (q8.length && q7.length) {
        const drop = mean(q7) - mean(q8);
        if (drop > 3) {
          out.push({
            type: 'warning',
            title: `Sharp Decline in ${f}`,
            text: `The ${f} function saw a collective score drop of ${drop.toFixed(1)} points between Q3 and Q4 of FY 25-26.`
          });
        }
      }
    });

    if (out.length === 0) {
      out.push({ type: 'info', title: 'Stable Operations', text: 'No critical anomalies or severe deviations detected in the current view.' });
    }
    return out;
  };

  const insights = generateInsights();

  return (
    <div className="tab-panel active">
      <div className="panel" style={{ maxWidth: '800px' }}>
        <h2>Automated Business Insights</h2>
        <div className="panel-desc" style={{ marginBottom: '24px' }}>AI-generated observations based on the currently filtered data context.</div>
        
        {insights.map((ins, i) => (
          <div key={i} className={`insight-card ic-${ins.type}`}>
            <div className="ic-title">{ins.title}</div>
            <div className="ic-text">{ins.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
