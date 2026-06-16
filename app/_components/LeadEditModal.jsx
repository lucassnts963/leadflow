'use client';

import { useState } from 'react';

const CATEGORIES = [
  'Advocacia', 'Academias', 'Barbearias', 'Beleza', 'Clínicas',
  'Construção', 'Dentistas', 'Imobiliárias', 'Lanchonetes',
  'Pizzarias', 'Restaurantes', 'Outros',
];

export default function LeadEditModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState({
    name: lead.name || '',
    business: lead.business || '',
    category: lead.category || 'Outros',
    phone: lead.phone || '',
    instagram: lead.instagram || '',
    website: lead.website || '',
    address: lead.address || '',
    reviews: lead.reviews || 0,
    notes: lead.notes || '',
    websiteQuality: lead.websiteQuality || '',
  });

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Re-score after edit
    onSave({
      name: form.name,
      business: form.business,
      category: form.category,
      phone: form.phone,
      instagram: form.instagram,
      website: form.website,
      address: form.address,
      reviews: form.reviews,
      notes: form.notes,
      websiteQuality: form.websiteQuality || null,
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
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-[#374151]">
          <h3 className="text-sm font-bold text-gray-100">
            ✏️ Editar Lead
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-lg">×</button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Business name */}
            <div className="col-span-2">
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Negócio *
              </label>
              <input
                type="text"
                value={form.business}
                onChange={handleChange('business')}
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>

            {/* Contact name */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Contato
              </label>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Categoria
              </label>
              <select
                value={form.category}
                onChange={handleChange('category')}
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#2EB873]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone + Instagram */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Telefone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="(91) 99999-0000"
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Instagram
              </label>
              <input
                type="text"
                value={form.instagram}
                onChange={handleChange('instagram')}
                placeholder="@usuario"
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Website */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Site
            </label>
            <input
              type="text"
              value={form.website}
              onChange={handleChange('website')}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
              onKeyDown={handleKeyDown}
            />
            <p className="text-[9px] text-gray-600 mt-1">
              Corrija o site se o Apify trouxe errado, ou adicione depois de criar o site pro cliente.
            </p>
          </div>

          {/* Website Quality */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Qualidade do site atual
            </label>
            <div className="flex gap-2">
              {[
                { value: '', label: 'Desconhecida' },
                { value: 'bad', label: 'Ruim' },
                { value: 'medium', label: 'Mediano' },
                { value: 'good', label: 'Bom' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setForm((prev) => ({ ...prev, websiteQuality: opt.value }))}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
                    form.websiteQuality === opt.value
                      ? 'bg-[#2EB873] text-white'
                      : 'bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#374151]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Address + Reviews */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
                Avaliações (Google)
              </label>
              <input
                type="number"
                value={form.reviews}
                onChange={handleChange('reviews')}
                min={0}
                className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#2EB873]"
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Observações
            </label>
            <textarea
              value={form.notes}
              onChange={handleChange('notes')}
              rows={2}
              className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873] resize-y"
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Status info */}
          <div className="flex gap-3 text-[10px] text-gray-600 bg-[#111827] rounded-lg p-3">
            <div>Score: <span className="text-gray-300 font-bold">{lead.score || 0}</span></div>
            <div>Status: <span className="text-gray-300">{lead.status || 'novo'}</span></div>
            <div>Origem: <span className="text-gray-300">{lead.source || 'manual'}</span></div>
            {lead.dealResult && (
              <div>
                Fechado: <span className={lead.dealResult === 'won' ? 'text-[#2EB873]' : 'text-gray-500'}>
                  {lead.dealResult === 'won' ? '✅ Ganho' : '❌ Perdido'}
                </span>
              </div>
            )}
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
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
