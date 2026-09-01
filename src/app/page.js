
"use client";

import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import FilterBar from '../components/FilterBar';
import KPIGrid from '../components/KPIGrid';
import QuarterlyKPIPanel from '../components/QuarterlyKPIPanel';
import Tabs from '../components/Tabs';
import OverviewTab from '../components/TabPanels/OverviewTab';
import GenericTableTab from '../components/TabPanels/GenericTableTab';
import EmployeeTab from '../components/TabPanels/EmployeeTab';
import InsightsTab from '../components/TabPanels/InsightsTab';
import UploadPage from '../components/UploadPage';
import { useData } from '../context/DataContext';

export default function Dashboard() {
  const { data } = useData();
  const [state, setState] = useState({ function: '', designation: '', region: '', band: '', search: '' });
  const [currentTab, setCurrentTab] = useState('overview');

  const filteredEmployees = useMemo(() => {
    if (!data) return [];
    return data.employees.filter(e =>
      (!state.function || e.function === state.function) &&
      (!state.designation || e.designation === state.designation) &&
      (!state.region || e.region === state.region) &&
      (!state.band || e.band === state.band) &&
      (!state.search || e.name.toLowerCase().includes(state.search) || e.code.toLowerCase().includes(state.search))
    );
  }, [state, data]);

  if (!data) {
    return <UploadPage />;
  }

  return (
    <div className="wrap">
      <Header />
      <FilterBar state={state} setState={setState} />
      
      <KPIGrid emp={filteredEmployees} />
      <QuarterlyKPIPanel emp={filteredEmployees} />
      
      <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {currentTab === 'overview' && <OverviewTab emp={filteredEmployees} />}
      {currentTab === 'function' && <GenericTableTab emp={filteredEmployees} groupField="function" title="Function Performance Roster" desc="Aggregated performance metrics segmented by function/department." />}
      {currentTab === 'designation' && <GenericTableTab emp={filteredEmployees} groupField="designation" title="Designation Performance Roster" desc="Aggregated performance metrics segmented by job designation." />}
      {currentTab === 'employee' && <EmployeeTab emp={filteredEmployees} searchState={state.search} setSearchState={val => setState(s => ({ ...s, search: val }))} />}
      {currentTab === 'insights' && <InsightsTab emp={filteredEmployees} />}
      
      <footer id="footer-note">Bands: Outstanding ≥97 · Exceeds ≥92 · Meets ≥85 · Below ≥70 · Critical &lt;70 <br/> Data reflects Variable Pay performance scores out of 100 max points.</footer>
    </div>
  );
}
