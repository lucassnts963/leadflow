'use client';

import { useRef, useState } from 'react';
import { parseCSV } from '../_lib/csv';
import { rescoreAllLeads } from '../_lib/scoring';

const CSV_COLUMNS = [
  { col: 'Nome', required: false, example: 'João Silva', desc: 'Nome do contato' },
  { col: 'Negócio', required: true, example: 'Barbearia RH13', desc: 'Nome do estabelecimento' },
  { col: 'Categoria', required: false, example: 'Barbearias', desc: 'Advocacia, Dentistas, Pizzarias...' },
  { col: 'Telefone', required: false, example: '(91) 99999-0000', desc: 'WhatsApp ou fixo' },
  { col: 'Instagram', required: false, example: '@barbeariarh13', desc: 'Com ou sem @' },
  { col: 'Site', required: false, example: 'instagram.com/barbearia', desc: 'URL do site atual (se tiver)' },
  { col: 'Avaliações', required: false, example: '45', desc: 'Número de reviews no Google' },
  { col: 'Endereço', required: false, example: 'Rua X, 123, Barcarena', desc: 'Endereço completo' },
  { col: 'Observações', required: false, example: 'Já falei com o dono', desc: 'Notas livres' },
];

const CSV_TEMPLATE = CSV_COLUMNS.map((c) => `"${c.example}"`).join(';');
const CSV_HEADER = CSV_COLUMNS.map((c) => c.col).join(';');

export default function CSVImport({ onImport }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState('');
  const [showFormat, setShowFormat] = useState(false);

  const processFile = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setStatus('⚠️ Apenas arquivos .csv');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const leads = parseCSV(e.target.result);
        if (leads.length === 0) {
          setStatus('⚠️ Nenhum lead encontrado no CSV');
          return;
        }
        const scored = rescoreAllLeads(leads);
        onImport(scored);
        setStatus(`✅ ${scored.length} leads importados!`);
        setTimeout(() => setStatus(''), 3000);
      } catch (err) {
        setStatus(`❌ Erro: ${err.message}`);
      }
    };
    reader.onerror = () => setStatus('❌ Erro ao ler arquivo');
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const downloadTemplate = () => {
    const content = CSV_HEADER + '\n' + CSV_TEMPLATE;
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leadflow-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <button
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            dragOver
              ? 'bg-[#2EB873]/20 border-2 border-dashed border-[#2EB873] text-[#2EB873]'
              : 'bg-transparent border border-[#374151] text-gray-400 hover:text-gray-200 hover:border-gray-500'
          }`}
        >
          📄 CSV
        </button>
        <button
          onClick={() => setShowFormat(!showFormat)}
          className="px-2 py-2 rounded-lg text-xs text-gray-600 hover:text-gray-400 transition-colors"
          title="Ver formato do CSV"
        >
          {showFormat ? '▲' : '?'}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
      />

      {/* Format helper */}
      {showFormat && (
        <div className="absolute top-full mt-2 right-0 z-30 bg-[#1F2937] border border-[#374151] rounded-xl p-4 w-[380px] max-w-[90vw] shadow-2xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-gray-200">📋 Formato do CSV</h4>
            <button
              onClick={() => setShowFormat(false)}
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              ×
            </button>
          </div>

          <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">
            O separador pode ser <code className="text-gray-400">;</code> (vírgula) ou <code className="text-gray-400">;</code> (ponto e vírgula).
            A primeira linha deve ter os nomes das colunas.
          </p>

          {/* Column list */}
          <div className="space-y-1.5 mb-3 max-h-[280px] overflow-y-auto">
            {CSV_COLUMNS.map((c) => (
              <div key={c.col} className="flex items-start gap-2 text-[10px]">
                <span className={`shrink-0 mt-0.5 ${c.required ? 'text-[#E63E5F]' : 'text-gray-600'}`}>
                  {c.required ? '●' : '○'}
                </span>
                <div className="min-w-0">
                  <span className="text-gray-300 font-semibold">{c.col}</span>
                  <span className="text-gray-600 ml-2">{c.desc}</span>
                  <div className="text-gray-500 mt-0.5 italic">
                    Ex: {c.example}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 text-[9px] text-gray-600 mb-3">
            <span className="text-[#E63E5F]">●</span> obrigatório
            <span className="text-gray-600 ml-2">○</span> opcional
          </div>

          {/* Template download */}
          <button
            onClick={downloadTemplate}
            className="w-full py-2 bg-[#265FCC]/20 hover:bg-[#265FCC]/40 text-[#265FCC] rounded-lg text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            📥 Baixar template CSV
          </button>

          {/* Example preview */}
          <div className="mt-3 p-2 bg-[#111827] rounded-lg overflow-x-auto">
            <pre className="text-[9px] text-gray-500 leading-relaxed font-mono">
              {CSV_HEADER}{'\n'}{CSV_TEMPLATE}
            </pre>
          </div>
        </div>
      )}
      {status && (
        <div className={`absolute top-full mt-1 right-0 text-[10px] whitespace-nowrap ${
          status.startsWith('✅') ? 'text-[#2EB873]' : status.startsWith('⚠️') ? 'text-[#E69138]' : 'text-[#E63E5F]'
        }`}>
          {status}
        </div>
      )}
    </div>
  );
}
