'use client';

import { useMemo, useState } from 'react';
import { getSettings } from '../_lib/storage';
import { generateFollowUp } from '../_lib/llm';

const META = 5000;

export default function Dashboard({ leads }) {
  const [followUpLead, setFollowUpLead] = useState(null);
  const [followUpMsg, setFollowUpMsg] = useState('');
  const [generating, setGenerating] = useState(false);

  const stats = useMemo(() => {
    const won = leads.filter((l) => l.dealResult === 'won');
    const lost = leads.filter((l) => l.dealResult === 'lost');
    const contacted = leads.filter((l) => l.status === 'contatado' && !l.dealResult);
    const newLeads = leads.filter((l) => l.status === 'novo' && !l.dealResult);
    const revenue = won.reduce((s, l) => s + (l.dealValue || 0), 0);
    const progress = Math.min(100, Math.round((revenue / META) * 100));

    // Leads without contact for 3+ days
    const now = new Date();
    const stale = contacted.filter((l) => {
      if (!l.contactedAt) return false;
      const days = (now - new Date(l.contactedAt)) / (1000 * 60 * 60 * 24);
      return days > 3;
    });

    // Recent closings
    const recentWon = [...won].sort(
      (a, b) => new Date(b.contactedAt || 0) - new Date(a.contactedAt || 0)
    ).slice(0, 5);

    return {
      won: won.length,
      lost: lost.length,
      contacted: contacted.length,
      newLeads: newLeads.length,
      revenue,
      progress,
      stale,
      recentWon,
      conversionRate: leads.length ? Math.round((won.length / (won.length + lost.length)) * 100) : 0,
    };
  }, [leads]);

  const handleFollowUp = async (lead) => {
    setFollowUpLead(lead);
    setGenerating(true);
    try {
      const settings = getSettings();
      const msg = await generateFollowUp(settings, lead, lead.dealValue || 0);
      setFollowUpMsg(msg);
    } catch (err) {
      setFollowUpMsg(`Erro: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Pipeline</h3>
          <div className="space-y-4">
            {[
              { label: 'Novos', count: stats.newLeads, pct: stats.newLeads / Math.max(1, leads.length) * 100, color: 'bg-[#265FCC]' },
              { label: 'Contatados', count: stats.contacted, pct: stats.contacted / Math.max(1, leads.length) * 100, color: 'bg-[#E69138]' },
              { label: 'Fechados', count: stats.won, pct: stats.won / Math.max(1, leads.length) * 100, color: 'bg-[#2EB873]' },
              { label: 'Perdidos', count: stats.lost, pct: stats.lost / Math.max(1, leads.length) * 100, color: 'bg-gray-500' },
            ].map((stage) => (
              <div key={stage.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{stage.label}</span>
                  <span className="text-gray-300 font-semibold">{stage.count}</span>
                </div>
                <div className="h-2 bg-[#111827] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${stage.color}`}
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">Receita</h3>
          <div className="text-center mb-4">
            <div className="text-3xl sm:text-4xl font-bold text-[#2EB873] tracking-tight">
              R$ {stats.revenue.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Meta: R$ {META.toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="h-3 bg-[#111827] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2EB873] to-[#C9A84C] rounded-full transition-all"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {stats.progress}% da meta
            {stats.won > 0 && (
              <span className="ml-2">• {stats.won} vendas • R$ {(stats.revenue / Math.max(1, stats.won)).toLocaleString('pt-BR')} ticket médio</span>
            )}
          </div>
          {stats.conversionRate > 0 && (
            <div className="text-xs text-gray-500 mt-1 text-center">
              Taxa de conversão: {stats.conversionRate}%
            </div>
          )}
        </div>
      </div>

      {/* Recent closings + Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent closings */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Fechamentos Recentes</h3>
          {stats.recentWon.length === 0 ? (
            <p className="text-sm text-gray-600">Nenhum fechamento ainda.</p>
          ) : (
            <div className="space-y-2">
              {stats.recentWon.map((lead) => (
                <div key={lead.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 truncate flex-1">{lead.business || lead.name}</span>
                  <span className="text-[#2EB873] font-semibold ml-2">
                    R$ {lead.dealValue?.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Follow-up alerts */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
            ⚠️ Sem contato há 3+ dias ({stats.stale.length})
          </h3>
          {stats.stale.length === 0 ? (
            <p className="text-sm text-gray-600">Todos em dia!</p>
          ) : (
            <div className="space-y-2">
              {stats.stale.slice(0, 8).map((lead) => (
                <div key={lead.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-300 truncate flex-1">{lead.business || lead.name}</span>
                  <span className="text-[#E63E5F] text-xs ml-2">
                    {Math.floor((new Date() - new Date(lead.contactedAt)) / (1000 * 60 * 60 * 24))}d
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pós-venda */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">
          🎯 Pós-venda — Manter cliente aquecido
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Selecione um cliente que fechou para gerar mensagem de acompanhamento
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={followUpLead?.id || ''}
            onChange={(e) => {
              const lead = leads.find((l) => l.id === e.target.value);
              setFollowUpLead(lead);
              setFollowUpMsg('');
            }}
            className="flex-1 px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200"
          >
            <option value="">Selecionar cliente...</option>
            {leads.filter((l) => l.dealResult === 'won').map((l) => (
              <option key={l.id} value={l.id}>{l.business || l.name} — R$ {l.dealValue?.toLocaleString('pt-BR')}</option>
            ))}
          </select>
          <button
            onClick={() => followUpLead && handleFollowUp(followUpLead)}
            disabled={!followUpLead || generating}
            className="px-4 py-2 bg-[#265FCC] hover:bg-[#1e4ea8] text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 shrink-0"
          >
            {generating ? 'Gerando...' : 'Gerar Follow-up'}
          </button>
        </div>
        {followUpMsg && (
          <div className="mt-3 p-3 bg-[#111827] rounded-lg text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {followUpMsg}
          </div>
        )}
      </div>
    </div>
  );
}
