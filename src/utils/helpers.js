

export const BAND_COLOR = {
  Outstanding: '#0E9F6E', Exceeds: '#1F8A70', Meets: '#C08A00',
  Below: '#DB6B1F', Critical: '#D3402F', 'No Data': '#C7CCD6'
};
export const BAND_ORDER = ['Outstanding','Exceeds','Meets','Below','Critical','No Data'];

export function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b));
}

export const fmt1 = v => (v === null || v === undefined || isNaN(v)) ? '—' : v.toFixed(1);

export const mean = arr => {
  const v = arr.filter(x => x !== null && x !== undefined && !isNaN(x));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};

export function trendArrow(delta) {
  if (delta === null || delta === undefined) return '<span class="trend-flat">—</span>';
  if (delta > 1.5) return `<span class="trend-up">▲ ${delta.toFixed(1)}</span>`;
  if (delta < -1.5) return `<span class="trend-down">▼ ${Math.abs(delta).toFixed(1)}</span>`;
  return `<span class="trend-flat">■ ${delta.toFixed(1)}</span>`;
}

// Sparkline SVG helper (used dynamically in some places if needed, though Next.js can render JSX)
export function SparkSvg({ quarters, w = 110, h = 30 }) {
  const vals = quarters.map(v => v === null ? null : v);
  const valid = vals.filter(v => v !== null);
  if (valid.length < 2) return <svg className="spark" width={w} height={h}></svg>;
  
  const min = Math.min(...valid), max = Math.max(...valid);
  const range = (max - min) || 1;
  const stepX = w / (vals.length - 1);
  let pts = [];
  
  vals.forEach((v, i) => {
    if (v === null) return;
    const x = i * stepX;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    pts.push([x, y]);
  });
  
  const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const last = pts[pts.length - 1];
  const lastVal = valid[valid.length - 1];
  const color = lastVal >= mean(valid) ? '#1F8A70' : '#DB6B1F';
  
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path d={path} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
    </svg>
  );
}
