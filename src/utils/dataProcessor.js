export function processExcelData(rawRows) {
  if (!rawRows || rawRows.length === 0) throw new Error("Excel file is empty.");

  // 1. Identify Quarter Labels
  const sampleRow = rawRows[0];
  const quarter_labels = Object.keys(sampleRow).filter(k => k.trim().startsWith('Q'));
  
  if (quarter_labels.length === 0) throw new Error("Could not find any Quarter columns (e.g., 'Q1 -2024-2025').");

  // Helper for mean
  const calcMean = (arr) => {
    const valid = arr.filter(x => typeof x === 'number' && !isNaN(x));
    return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  };
  
  // Helper for standard deviation
  const calcStd = (arr) => {
    const valid = arr.filter(x => typeof x === 'number' && !isNaN(x));
    if (valid.length < 2) return 0;
    const m = calcMean(valid);
    const variance = valid.reduce((acc, val) => acc + Math.pow(val - m, 2), 0) / valid.length;
    return Math.sqrt(variance);
  };
  
  // Helper for band
  const getBand = (avg) => {
    if (avg === null) return 'No Data';
    if (avg >= 97) return 'Outstanding';
    if (avg >= 92) return 'Exceeds';
    if (avg >= 85) return 'Meets';
    if (avg >= 70) return 'Below';
    return 'Critical';
  };

  // 2. Process Employees
  const employees = rawRows.map(row => {
    const code = row['Employee Code'] || row['Employee Code '] || '';
    if (!code) return null; // Skip invalid rows
    
    const location = row['Work Location '] || row['Work Location'] || '';
    const region = location.substring(0, 2).toUpperCase() || 'Unknown';
    
    const quarters = quarter_labels.map(lbl => {
      const val = row[lbl];
      return (typeof val === 'number') ? val : null;
    });

    const validScores = quarters.filter(x => x !== null);
    const avg = calcMean(validScores);
    const min = validScores.length ? Math.min(...validScores) : null;
    const max = validScores.length ? Math.max(...validScores) : null;
    const std = calcStd(validScores);
    
    // Trend calculation (simplified: Difference between recent half and previous half)
    let trend = null;
    if (validScores.length >= 2) {
      const mid = Math.floor(validScores.length / 2);
      const firstHalf = validScores.slice(0, mid);
      const secondHalf = validScores.slice(mid);
      const fhMean = calcMean(firstHalf);
      const shMean = calcMean(secondHalf);
      if (fhMean !== null && shMean !== null) {
        trend = shMean - fhMean;
      }
    }
    
    return {
      code,
      name: row['Emp Name'] || row['Emp Name '] || 'Unknown',
      status: row['Status '] || row['Status'] || 'LIVE',
      function: row['Function'] || row['Function '] || 'Unknown',
      designation: row['Employee Designation'] || row['Employee Designation '] || 'Unknown',
      location,
      region,
      quarters,
      avg, min, max, std, trend,
      band: getBand(avg)
    };
  }).filter(e => e !== null);

  // 3. Compute KPI metrics
  const allAvgs = employees.map(e => e.avg).filter(x => x !== null);
  const overall_avg = calcMean(allAvgs);
  const overall_std = calcStd(allAvgs);
  
  const sortedByAvg = [...employees].filter(e => e.avg !== null).sort((a,b) => b.avg - a.avg);
  const top_employee = sortedByAvg.length > 0 ? sortedByAvg[0].name : '—';
  const top_score = sortedByAvg.length > 0 ? sortedByAvg[0].avg : null;
  const bottom_employee = sortedByAvg.length > 0 ? sortedByAvg[sortedByAvg.length-1].name : '—';
  const bottom_score = sortedByAvg.length > 0 ? sortedByAvg[sortedByAvg.length-1].avg : null;
  
  const functions_count = new Set(employees.map(e => e.function)).size;
  const below85_count = employees.filter(e => e.avg !== null && e.avg < 85).length;
  const critical_count = employees.filter(e => e.band === 'Critical').length;
  
  const kpis = {
    headcount: employees.length,
    overall_avg, overall_std,
    top_employee, top_score, bottom_employee, bottom_score,
    functions_count, below85_count, critical_count
  };

  return {
    quarter_labels,
    employees,
    kpis
  };
}
