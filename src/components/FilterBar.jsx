
import React from 'react';
import { useData } from '../context/DataContext';
import { uniqueSorted, BAND_ORDER } from '../utils/helpers';

export default function FilterBar({ state, setState }) {
  const { data: DATA } = useData();
  const functions = uniqueSorted(DATA.employees.map(e => e.function));
  const designations = uniqueSorted(DATA.employees.map(e => e.designation));
  const regions = uniqueSorted(DATA.employees.map(e => e.region));

  const handleChange = (k, v) => setState(s => ({ ...s, [k]: v }));
  
  return (
    <div className="filterbar">
      <span className="flabel">Filter</span>
      <select value={state.function} onChange={e => handleChange('function', e.target.value)}>
        <option value="">All Functions</option>
        {functions.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      
      <select value={state.designation} onChange={e => handleChange('designation', e.target.value)}>
        <option value="">All Designations</option>
        {designations.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      
      <select value={state.region} onChange={e => handleChange('region', e.target.value)}>
        <option value="">All Regions</option>
        {regions.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      
      <select value={state.band} onChange={e => handleChange('band', e.target.value)}>
        <option value="">All Bands</option>
        {BAND_ORDER.map(v => <option key={v} value={v}>{v}</option>)}
      </select>
      
      <button className="reset-btn" onClick={() => setState({ function: '', designation: '', region: '', band: '', search: '' })}>
        Reset filters
      </button>
    </div>
  );
}
