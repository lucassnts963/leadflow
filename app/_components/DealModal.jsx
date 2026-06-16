'use client';

import { useState } from 'react';

export default function DealModal({ lead, onClose, onSave }) {
  const [value, setValue] = useState(lead.dealValue || '');
  const [result, setResult] = useState(lead.dealResult || 'won');
  const [notes, setNotes] = useState(lead.dealNotes || '');

  const handleSave = () => {
    onSave({
      dealValue: parseFloat(value) || 0,
      dealResult: result,
      dealNotes: notes,
      status: 'contatado',
    });
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && e.ctrlKey) handleSave();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#374151]">
          <h3 className="text-sm font-bold text-gray-100">
            💰 Fechar negócio
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 text-lg"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-sm text-gray-300">
            <span className="font-semibold">{lead.business || lead.name}</span>
            <span className="text-gray-500 ml-2">{lead.category}</span>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Valor (R$)
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ex: 800"
              className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Resultado
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setResult('won')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  result === 'won'
                    ? 'bg-[#2EB873] text-white'
                    : 'bg-[#2EB873]/10 text-[#2EB873] hover:bg-[#2EB873]/20'
                }`}
              >
                ✅ Ganho
              </button>
              <button
                onClick={() => setResult('lost')}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  result === 'lost'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
                }`}
              >
                ❌ Perdido
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Observações
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas sobre o fechamento..."
              rows={3}
              className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#2EB873] resize-y"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-4 border-t border-[#374151]">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-transparent border border-[#374151] text-gray-400 hover:text-gray-200 rounded-lg text-sm transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-[#2EB873] hover:bg-[#25a060] text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
