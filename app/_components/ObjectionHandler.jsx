'use client';

import { useState } from 'react';
import { getSettings } from '../_lib/storage';
import { handleObjection } from '../_lib/llm';

export default function ObjectionHandler({ lead, onClose }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const settings = getSettings();
      const analysis = await handleObjection(settings, lead, text);
      setResult(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleAnalyze();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#374151]">
          <h3 className="text-sm font-bold text-gray-100">
            🧠 Quebrar Objeção — IA
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">×</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold">{lead.business || lead.name}</span>
            <span className="text-gray-500 ml-2">{lead.category}</span>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Cole a mensagem do lead
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='"Tá muito caro" / "Vou pensar" / "Já tenho site"...'
              rows={4}
              className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#E69138] resize-y"
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full py-2.5 bg-[#E69138] hover:bg-[#d4812e] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Analisando com IA...' : '🧠 Analisar Objeção'}
          </button>

          <p className="text-[10px] text-gray-600 text-center">
            A IA vai diagnosticar a objeção, sugerir estratégia e gerar uma resposta pronta.
          </p>

          {error && (
            <div className="p-3 bg-[#E63E5F]/10 border border-[#E63E5F]/20 rounded-lg text-xs text-[#E63E5F]">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-3">
              {/* Diagnóstico */}
              <div className="p-3 bg-[#111827] rounded-lg">
                <div className="text-[10px] text-[#265FCC] uppercase tracking-wider mb-1">
                  🔍 Diagnóstico
                </div>
                <p className="text-sm text-gray-300">{result.diagnostico}</p>
              </div>

              {/* Técnica */}
              <div className="text-[10px] text-gray-500">
                Técnica: <span className="text-[#E69138] font-semibold">{result.tecnica}</span>
              </div>

              {/* Estratégia */}
              <div className="p-3 bg-[#111827] rounded-lg">
                <div className="text-[10px] text-[#2EB873] uppercase tracking-wider mb-1">
                  🎯 Estratégia
                </div>
                <p className="text-sm text-gray-300 whitespace-pre-wrap">{result.estrategia}</p>
              </div>

              {/* Resposta pronta */}
              {result.resposta_pronta && (
                <div className="p-3 bg-[#111827] rounded-lg border border-[#2EB873]/20">
                  <div className="text-[10px] text-[#2EB873] uppercase tracking-wider mb-2">
                    ✉️ Resposta Pronta
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {result.resposta_pronta}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.resposta_pronta)}
                    className="mt-2 px-2 py-1 bg-[#2EB873]/20 hover:bg-[#2EB873]/40 text-[#2EB873] rounded text-[10px] transition-colors"
                  >
                    📋 Copiar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
