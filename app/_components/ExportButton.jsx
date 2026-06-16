'use client';

import { useState } from 'react';
import { exportCSV, exportJSON } from '../_lib/csv';

export default function ExportButton({ leads }) {
  const [open, setOpen] = useState(false);

  const handleExport = (format) => {
    const content = format === 'csv' ? exportCSV(leads) : exportJSON(leads);
    const ext = format === 'csv' ? 'csv' : 'json';
    const mime = format === 'csv' ? 'text/csv' : 'application/json';
    const filename = `leadflow-${new Date().toISOString().slice(0, 10)}.${ext}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 bg-transparent border border-[#374151] text-gray-400 hover:text-gray-200 hover:border-gray-500"
      >
        📥 Exportar
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#1F2937] border border-[#374151] rounded-lg shadow-xl z-30 py-1 min-w-[140px]">
          <button
            onClick={() => handleExport('csv')}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
          >
            📄 CSV (Excel)
          </button>
          <button
            onClick={() => handleExport('json')}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 transition-colors"
          >
            📋 JSON (backup)
          </button>
        </div>
      )}
    </div>
  );
}
