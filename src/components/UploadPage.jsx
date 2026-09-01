"use client";
import React, { useState } from 'react';
import * as xlsx from 'xlsx';
import { processExcelData } from '../utils/dataProcessor';
import { useData } from '../context/DataContext';

export default function UploadPage() {
  const { setData } = useData();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = xlsx.read(bstr, { type: 'binary' });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        
        // Convert to JSON
        const rawRows = xlsx.utils.sheet_to_json(ws);
        
        if (rawRows.length === 0) {
          throw new Error("The uploaded Excel sheet is empty.");
        }

        // Process data
        const processedData = processExcelData(rawRows);
        setData(processedData);
        
      } catch (err) {
        console.error(err);
        setError("Failed to parse the Excel file. Please ensure it matches the standard format. Error: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Error reading the file.");
      setIsLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '24px' }}>
      <div style={{ background: 'var(--surface)', padding: '40px', borderRadius: '16px', boxShadow: 'var(--shadow)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
        <img src="/LOGO.png" alt="WorkSense Logo" style={{ height: '36px', marginBottom: '24px' }} />
        <h1 style={{ fontSize: '24px', margin: '0 0 12px 0', fontFamily: 'var(--font-heading)' }}>Upload Performance Data</h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: '32px', fontSize: '15px' }}>Please upload your Variable Pay performance Excel sheet to generate the dashboard.</p>
        
        {error && (
          <div style={{ background: 'var(--critical-soft)', color: 'var(--critical)', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'left' }}>
            {error}
          </div>
        )}

        <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
          <button style={{
            background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', 
            borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1
          }}>
            {isLoading ? 'Processing...' : 'Select Excel File'}
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload} 
            disabled={isLoading}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
          />
        </div>
      </div>
    </div>
  );
}
