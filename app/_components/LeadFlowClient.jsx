'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { loadData, updateLeads, updateLead, addLeads, deleteLead } from '../_lib/storage';
import { rescoreAllLeads, scoreLead } from '../_lib/scoring';
import StatsBar from './StatsBar';
import LeadsTable from './LeadsTable';
import Dashboard from './Dashboard';
import DealModal from './DealModal';
import ObjectionHandler from './ObjectionHandler';
import SettingsPanel from './SettingsPanel';
import LeadScraper from './LeadScraper';
import HelpPanel from './HelpPanel';
import LeadEditModal from './LeadEditModal';

const TABS = [
  { id: 'leads', label: '📋 Leads' },
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'scraper', label: '🕷️ Apify' },
  { id: 'settings', label: '⚙️ Config' },
  { id: 'help', label: '📖 Ajuda' },
];

export default function LeadFlowClient() {
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('leads');
  const [dealLead, setDealLead] = useState(null);
  const [objectionLead, setObjectionLead] = useState(null);
  const [editLead, setEditLead] = useState(null);

  // Load data
  useEffect(() => {
    const d = loadData();
    // Auto-score unscored leads
    if (d.leads.some((l) => !l.score)) {
      d.leads = rescoreAllLeads(d.leads);
      updateLeads(d.leads);
    }
    setData(d);

    // Listen for export-all event from settings
    const handler = () => {
      const current = loadData();
      const json = JSON.stringify({ leads: current.leads, settings: current.settings }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leadflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };
    window.addEventListener('leadflow-export-all', handler);
    return () => window.removeEventListener('leadflow-export-all', handler);
  }, []);

  const leads = data?.leads || [];

  const handleUpdateLead = useCallback((id, updates) => {
    const updated = updateLead(id, updates);
    setData((prev) => ({ ...prev, leads: updated }));
  }, []);

  const handleDeleteLead = useCallback((id) => {
    const updated = deleteLead(id);
    setData((prev) => ({ ...prev, leads: updated }));
  }, []);

  const handleAddLeads = useCallback((newLeads) => {
    const scored = rescoreAllLeads(newLeads);
    const updated = addLeads(scored);
    setData((prev) => ({ ...prev, leads: updated }));
  }, []);

  const handleDealSave = useCallback((updates) => {
    if (!dealLead) return;
    // If won, also auto-score to update status
    const finalUpdates = {
      ...updates,
      dealResult: updates.dealResult,
      dealValue: updates.dealValue,
      dealNotes: updates.dealNotes,
      status: 'contatado',
    };
    handleUpdateLead(dealLead.id, finalUpdates);
    setDealLead(null);
  }, [dealLead, handleUpdateLead]);

  const handleEditSave = useCallback((updates) => {
    if (!editLead) return;
    const leadForScoring = { ...editLead, ...updates };
    const { score, reasons, temperature } = scoreLead(leadForScoring);
    handleUpdateLead(editLead.id, {
      ...updates,
      score,
      scoreReasons: reasons,
      temperature,
    });
    setEditLead(null);
  }, [editLead, handleUpdateLead]);

  // Refresh settings
  useEffect(() => {
    const onFocus = () => {
      const d = loadData();
      setData(d);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0A0E1A] flex items-center justify-center">
        <div className="text-gray-500 text-sm">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-gray-200 font-sans">
      {/* Header */}
      <header className="bg-[#1F2937] border-b border-[#374151] sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-[#2EB873] tracking-tight">
              LeadFlow
            </h1>
            <span className="text-xs text-gray-600 hidden sm:inline">
              Gerenciador de Leads
            </span>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 bg-[#111827] rounded-lg p-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#2EB873] text-white'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        {/* Stats bar — always visible on leads tab */}
        {activeTab === 'leads' && <StatsBar leads={leads} />}

        {/* Tab content */}
        {activeTab === 'leads' && (
          <LeadsTable
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onDeleteLead={handleDeleteLead}
            onAddLeads={handleAddLeads}
            onOpenDeal={setDealLead}
            onOpenObjection={setObjectionLead}
            onEditLead={setEditLead}
          />
        )}

        {activeTab === 'dashboard' && <Dashboard leads={leads} />}

        {activeTab === 'scraper' && <LeadScraper onAddLeads={handleAddLeads} />}

        {activeTab === 'settings' && <SettingsPanel />}

        {activeTab === 'help' && <HelpPanel />}
      </main>

      {/* Modals */}
      {dealLead && (
        <DealModal
          lead={dealLead}
          onClose={() => setDealLead(null)}
          onSave={handleDealSave}
        />
      )}

      {objectionLead && (
        <ObjectionHandler
          lead={objectionLead}
          onClose={() => setObjectionLead(null)}
        />
      )}

      {editLead && (
        <LeadEditModal
          lead={editLead}
          onClose={() => setEditLead(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-[10px] text-gray-700 border-t border-[#1F2937]">
        LeadFlow — Dados salvos localmente no seu navegador •{' '}
        <a href="https://elucas.dev" className="hover:text-gray-500 transition-colors">elucas.dev</a>
      </footer>
    </div>
  );
}
