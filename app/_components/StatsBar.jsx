'use client';

import { useMemo } from 'react';

export default function StatsBar({ leads }) {
  const stats = useMemo(() => {
    const total = leads.length;
    const hot = leads.filter((l) => l.temperature === 'hot').length;
    const warm = leads.filter((l) => l.temperature === 'warm').length;
    const cold = leads.filter((l) => l.temperature === 'cold').length;
    const won = leads.filter((l) => l.dealResult === 'won');
    const revenue = won.reduce((sum, l) => sum + (l.dealValue || 0), 0);
    const contacted = leads.filter((l) => l.contactedAt).length;
    const noContact = leads.filter((l) => !l.contactedAt && l.status === 'novo').length;

    return { total, hot, warm, cold, revenue, won: won.length, contacted, noContact };
  }, [leads]);

  const cards = [
    { label: 'Total Leads', value: stats.total, color: 'text-gray-200' },
    { label: 'Quentes 🔥', value: stats.hot, color: 'text-[#E63E5F]' },
    { label: 'Mornos 🟡', value: stats.warm, color: 'text-[#E69138]' },
    { label: 'Fechados 💰', value: stats.won, color: 'text-[#2EB873]' },
    { label: 'Receita', value: `R$ ${stats.revenue.toLocaleString('pt-BR')}`, color: 'text-[#C9A84C]' },
    { label: 'Sem Contato', value: stats.noContact, color: 'text-[#9CA3AF]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#1F2937] border border-[#374151] rounded-xl p-3 sm:p-4"
        >
          <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">
            {card.label}
          </div>
          <div className={`text-lg sm:text-xl font-bold tracking-tight ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}
