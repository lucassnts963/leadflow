'use client';

import { useState, useMemo } from 'react';
import LeadRow from './LeadRow';
import CSVImport from './CSVImport';
import ExportButton from './ExportButton';

export default function LeadsTable({
  leads,
  onDeleteLead,
  onUpdateLead,
  onOpenDeal,
  onOpenObjection,
  onAddLeads,
  onEditLead,
}) {
  const [search, setSearch] = useState('');
  const [filterTemp, setFilterTemp] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortDir, setSortDir] = useState('desc');

  const categories = useMemo(() => {
    const cats = new Set(leads.map((l) => l.category));
    return ['all', ...Array.from(cats).filter(Boolean).sort()];
  }, [leads]);

  const filtered = useMemo(() => {
    let result = [...leads];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.business?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.phone?.includes(q)
      );
    }

    if (filterTemp !== 'all') {
      result = result.filter((l) => l.temperature === filterTemp);
    }

    if (filterStatus !== 'all') {
      result = result.filter((l) => l.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      result = result.filter((l) => l.category === filterCategory);
    }

    result.sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case 'name':
          aVal = (a.business || a.name || '').toLowerCase();
          bVal = (b.business || b.name || '').toLowerCase();
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        case 'score':
          aVal = a.score || 0;
          bVal = b.score || 0;
          break;
        case 'reviews':
          aVal = a.reviews || 0;
          bVal = b.reviews || 0;
          break;
        default:
          aVal = a.score || 0;
          bVal = b.score || 0;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return result;
  }, [leads, search, filterTemp, filterStatus, filterCategory, sortBy, sortDir]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Buscar por nome, negócio, telefone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] max-w-full sm:max-w-xs px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
        />
        <select
          value={filterTemp}
          onChange={(e) => setFilterTemp(e.target.value)}
          className="px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200"
        >
          <option value="all">Todos os scores</option>
          <option value="hot">🔥 Quentes</option>
          <option value="warm">🟡 Mornos</option>
          <option value="cold">🔵 Frios</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200"
        >
          <option value="all">Todos status</option>
          <option value="novo">Novo</option>
          <option value="contatado">Contatado</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas categorias' : cat}
            </option>
          ))}
        </select>
        <div className="flex gap-2 ml-auto">
          <CSVImport onImport={onAddLeads} />
          <ExportButton leads={leads} />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600 bg-[#1F2937] border border-[#374151] rounded-xl">
          <div className="text-3xl mb-3">📋</div>
          <p className="text-sm">Nenhum lead encontrado</p>
          <p className="text-xs mt-1">Importe um CSV ou use o Apify para buscar negócios locais</p>
        </div>
      ) : (
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#374151]">
                  <th
                    onClick={() => toggleSort('score')}
                    className="text-left px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 select-none"
                  >
                    Score {sortBy === 'score' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    onClick={() => toggleSort('name')}
                    className="text-left px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-300 select-none"
                  >
                    Negócio {sortBy === 'name' && (sortDir === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="hidden md:table-cell text-left px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="hidden lg:table-cell text-left px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Site
                  </th>
                  <th className="hidden sm:table-cell text-left px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="text-right px-3 py-2.5 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <LeadRow
                    key={lead.id}
                    lead={lead}
                    onUpdate={(updates) => onUpdateLead(lead.id, updates)}
                    onDelete={() => onDeleteLead(lead.id)}
                    onOpenDeal={() => onOpenDeal(lead)}
                    onOpenObjection={() => onOpenObjection(lead)}
                    onEdit={() => onEditLead(lead)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-[#374151] text-xs text-gray-600">
            {filtered.length} de {leads.length} leads
          </div>
        </div>
      )}
    </div>
  );
}
