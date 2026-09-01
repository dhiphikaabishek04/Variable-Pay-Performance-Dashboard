
import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useData } from '../../context/DataContext';
import { mean, BAND_ORDER, BAND_COLOR } from '../../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function OverviewTab({ emp }) {
  const { data } = useData();
  const Q_LABELS = data.quarter_labels;
  const Q_SHORT = Q_LABELS.map(l => l.replace('20', "'").replace(' ', ' '));
  const qAvgs = Q_LABELS.map((_, i) => mean(emp.map(e => e.quarters[i])));
  const bandCounts = {};
  BAND_ORDER.forEach(b => bandCounts[b] = 0);
  emp.forEach(e => bandCounts[e.band]++);

  const trendData = {
    labels: Q_SHORT,
    datasets: [
      {
        label: 'Mean Score',
        data: qAvgs,
        borderColor: '#2F4BE0',
        backgroundColor: '#2F4BE0',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 4,
        pointBackgroundColor: '#FFFFFF',
        pointBorderWidth: 2
      },
      {
        label: 'Acceptable Floor (85%)',
        data: Array(8).fill(85),
        borderColor: '#E3E7EF',
        borderWidth: 1.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false
      }
    ]
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 24, right: 16, left: 16 } },
    plugins: { 
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      datalabels: {
        display: (ctx) => ctx.datasetIndex === 0,
        align: 'top',
        anchor: 'end',
        color: '#2F4BE0',
        font: { size: 11, weight: 'bold' },
        formatter: (val) => val ? val.toFixed(1) : ''
      }
    },
    scales: {
      y: { min: 0, max: 100, grid: { color: '#EEF1F7' } },
      x: { grid: { display: false } }
    }
  };

  const donutData = {
    labels: BAND_ORDER,
    datasets: [{
      data: BAND_ORDER.map(b => bandCounts[b]),
      backgroundColor: BAND_ORDER.map(b => BAND_COLOR[b]),
      borderWidth: 0
    }]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    layout: { padding: 30 },
    plugins: { 
      legend: { display: false },
      datalabels: {
        display: (ctx) => ctx.dataset.data[ctx.dataIndex] > 0,
        anchor: 'end',
        align: 'end',
        offset: 4,
        color: (ctx) => BAND_COLOR[ctx.chart.data.labels[ctx.dataIndex]],
        font: { size: 13, weight: 'bold' },
        formatter: (val) => val
      }
    }
  };

  return (
    <div className="tab-panel active">
      <div className="grid-2">
        <div className="panel">
          <h2>Organisation-wide Quarterly Trend</h2>
          <div className="panel-desc">Mean achievement score across the filtered population, by quarter. Reference line marks the 85% floor.</div>
          <div style={{ position: 'relative', height: '320px' }}>
            <Line data={trendData} options={trendOptions} plugins={[ChartDataLabels]} />
          </div>
        </div>
        <div className="panel">
          <h2>Performance Band Distribution</h2>
          <div className="panel-desc">Share of employees per performance band (8‑quarter average).</div>
          <div style={{ position: 'relative', height: '320px' }}>
            <Doughnut data={donutData} options={donutOptions} plugins={[ChartDataLabels]} />
          </div>
          <div className="legend-row">
            {BAND_ORDER.map(b => {
              const pct = emp.length ? ((bandCounts[b] / emp.length) * 100).toFixed(1) + '%' : '0%';
              return (
                <span key={b} className="legend-item">
                  <span className="legend-dot" style={{ background: BAND_COLOR[b] }}></span>
                  {b} ({pct})
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
