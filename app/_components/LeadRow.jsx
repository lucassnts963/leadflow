'use client';

import { useState } from 'react';
import { getSettings } from '../_lib/storage';
import { generateLeadMessage } from '../_lib/llm';

const TEMP_CONFIG = {
  hot: { dot: 'bg-[#E63E5F] shadow-[0_0_8px_#E63E5F]', pill: 'bg-[#E63E5F]/10 text-[#E63E5F]', label: 'Quente' },
  warm: { dot: 'bg-[#E69138] shadow-[0_0_6px_#E69138]', pill: 'bg-[#E69138]/10 text-[#E69138]', label: 'Morno' },
  cold: { dot: 'bg-[#265FCC]', pill: 'bg-[#265FCC]/10 text-[#265FCC]', label: 'Frio' },
};

function getDefaultMessage(lead) {
  const settings = getSettings();
  const portfolioUrl = settings.portfolioUrl || 'https://elucas.dev';
  return `Olá! Vi ${lead.business} aqui em Barcarena e criei uma demonstração de site. Posso te mostrar? ${portfolioUrl}`;
}

function sendWhatsApp(phone, message) {
  const clean = phone?.replace(/\D/g, '');
  const url = clean
    ? `https://wa.me/55${clean}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export default function LeadRow({ lead, onUpdate, onDelete, onOpenDeal, onOpenObjection, onEdit }) {
  const [generating, setGenerating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [msgModal, setMsgModal] = useState(null); // { message: string, loading: bool }
  const [msgDraft, setMsgDraft] = useState('');
  const tc = TEMP_CONFIG[lead.temperature] || TEMP_CONFIG.cold;

  // Open modal with default message
  const openDefaultMsg = () => {
    const msg = getDefaultMessage(lead);
    setMsgDraft(msg);
    setMsgModal({ loading: false });
  };

  // Generate AI message → show in modal
  const openAIMsg = async () => {
    setMsgDraft('');
    setMsgModal({ loading: true });
    try {
      const settings = getSettings();
      const message = await generateLeadMessage(settings, lead);
      setMsgDraft(message);
      setMsgModal({ loading: false });
    } catch (err) {
      alert(`Erro ao gerar mensagem: ${err.message}`);
      setMsgModal(null);
    }
  };

  // Send from modal
  const handleSend = () => {
    sendWhatsApp(lead.phone, msgDraft);
    setMsgModal(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(msgDraft);
  };

  const handleContacted = () => {
    onUpdate({ status: 'contatado', contactedAt: new Date().toISOString() });
  };

  const statusPill = lead.dealResult === 'won'
    ? 'bg-[#2EB873]/10 text-[#2EB873]'
    : lead.dealResult === 'lost'
    ? 'bg-gray-500/10 text-gray-500'
    : lead.status === 'contatado'
    ? 'bg-[#265FCC]/10 text-[#265FCC]'
    : '';

  const statusLabel = lead.dealResult === 'won'
    ? 'Fechado ✓'
    : lead.dealResult === 'lost'
    ? 'Perdido'
    : lead.status === 'contatado'
    ? 'Contatado'
    : 'Novo';

  return (
    <>
      <tr className="border-b border-[#1F2937] hover:bg-white/[0.02] transition-colors">
        {/* Score */}
        <td className="px-3 py-2.5 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${tc.dot}`} />
            <span className="text-sm font-bold text-gray-200">{lead.score || '-'}</span>
          </div>
        </td>

        {/* Business info */}
        <td className="px-3 py-2.5">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-left hover:text-[#2EB873] transition-colors"
          >
            <div className="text-sm font-medium text-gray-100 truncate max-w-[160px] sm:max-w-[200px]">
              {lead.business || lead.name}
            </div>
            {lead.website && (
              <a
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] text-[#265FCC] hover:underline truncate block max-w-[160px] sm:max-w-[200px]"
              >
                {lead.website.length > 35 ? lead.website.slice(0, 35) + '...' : lead.website}
              </a>
            )}
            {!lead.website && (
              <span className="text-[10px] text-gray-600">sem site</span>
            )}
          </button>
        </td>

        {/* Category */}
        <td className="hidden md:table-cell px-3 py-2.5">
          <span className="text-xs text-gray-400">{lead.category}</span>
        </td>

        {/* Website link */}
        <td className="hidden lg:table-cell px-3 py-2.5">
          {lead.website ? (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#265FCC] hover:underline truncate block max-w-[150px]"
            >
              {lead.website.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 25)}
              {lead.website.length > 25 ? '...' : ''}
            </a>
          ) : (
            <span className="text-xs text-gray-600">—</span>
          )}
        </td>

        {/* Contact info */}
        <td className="hidden sm:table-cell px-3 py-2.5">
          <div className="flex flex-col gap-0.5 text-[10px]">
            {lead.phone && <span className="text-gray-500">{lead.phone}</span>}
            {lead.instagram && <span className="text-gray-600">@{lead.instagram.replace('@', '')}</span>}
            {lead.reviews > 0 && (
              <span className="text-[#C9A84C]">★ {lead.reviews} avaliações</span>
            )}
          </div>
        </td>

        {/* Actions */}
        <td className="px-3 py-2.5">
          <div className="flex items-center justify-end gap-1 flex-wrap">
            {statusPill && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${statusPill}`}>
                {statusLabel}
              </span>
            )}

            <span className={`hidden sm:inline text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${tc.pill}`}>
              {tc.label}
            </span>

            {/* WhatsApp — now opens modal */}
            {lead.phone && (
              <button
                onClick={openDefaultMsg}
                className="px-2 py-1 bg-[#25D366] hover:bg-[#20b954] text-white rounded-md text-[10px] font-semibold transition-colors flex items-center gap-1"
                title="WhatsApp (editar antes de enviar)"
              >
                💬
              </button>
            )}

            {/* AI Message — now opens modal */}
            <button
              onClick={openAIMsg}
              disabled={generating}
              className="px-2 py-1 bg-[#265FCC]/20 hover:bg-[#265FCC]/40 text-[#265FCC] rounded-md text-[10px] font-semibold transition-colors disabled:opacity-50"
              title="Gerar mensagem com IA"
            >
              {generating ? '⏳' : '🤖'}
            </button>

            {/* Contacted */}
            {lead.status !== 'contatado' && !lead.dealResult && (
              <button
                onClick={handleContacted}
                className="hidden sm:inline px-2 py-1 bg-transparent hover:bg-white/5 border border-[#374151] text-gray-500 rounded-md text-[10px] transition-colors"
              >
                ✓
              </button>
            )}

            {/* Close deal */}
            {!lead.dealResult && (
              <button
                onClick={onOpenDeal}
                className="px-2 py-1 bg-[#2EB873]/20 hover:bg-[#2EB873]/40 text-[#2EB873] rounded-md text-[10px] font-semibold transition-colors"
                title="Fechar negócio"
              >
                💰
              </button>
            )}

            {/* Objection */}
            <button
              onClick={onOpenObjection}
              className="hidden sm:inline px-2 py-1 bg-[#E69138]/20 hover:bg-[#E69138]/40 text-[#E69138] rounded-md text-[10px] font-semibold transition-colors"
              title="Quebrar objeção"
            >
              🧠
            </button>

            {/* Delete */}
            <button
              onClick={() => { if (confirm('Remover este lead?')) onDelete(); }}
              className="px-2 py-1 bg-transparent hover:bg-[#E63E5F]/20 text-gray-600 hover:text-[#E63E5F] rounded-md text-[10px] transition-colors"
              title="Remover"
            >
              ×
            </button>

            {/* Edit */}
            <button
              onClick={onEdit}
              className="px-2 py-1 bg-transparent hover:bg-white/5 border border-[#374151] text-gray-500 hover:text-gray-300 rounded-md text-[10px] transition-colors"
              title="Editar lead"
            >
              ✎
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded details (mobile) */}
      {showDetails && (
        <tr className="bg-[#111827] sm:hidden">
          <td colSpan={6} className="px-4 py-3">
            <div className="text-xs space-y-1.5 text-gray-400">
              <div><span className="text-gray-600">Categoria:</span> {lead.category}</div>
              {lead.phone && <div><span className="text-gray-600">Tel:</span> {lead.phone}</div>}
              {lead.instagram && <div><span className="text-gray-600">IG:</span> @{lead.instagram.replace('@', '')}</div>}
              {lead.reviews > 0 && <div><span className="text-gray-600">Avaliações:</span> {lead.reviews}</div>}
              {lead.notes && <div><span className="text-gray-600">Notas:</span> {lead.notes}</div>}
              {lead.dealResult && (
                <div>
                  <span className="text-gray-600">Fechado:</span>{' '}
                  {lead.dealResult === 'won' ? '✅ Ganho' : '❌ Perdido'}
                  {lead.dealValue > 0 && ` • R$ ${lead.dealValue.toLocaleString('pt-BR')}`}
                </div>
              )}
              <div className="flex gap-1 pt-1 flex-wrap">
                {lead.status !== 'contatado' && !lead.dealResult && (
                  <button onClick={handleContacted} className="px-2 py-1 bg-[#265FCC]/20 text-[#265FCC] rounded text-[10px]">
                    Marcar contatado
                  </button>
                )}
                <button onClick={onOpenObjection} className="px-2 py-1 bg-[#E69138]/20 text-[#E69138] rounded text-[10px]">
                  🧠 Objeções
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}

      {/* Message Preview Modal */}
      {msgModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setMsgModal(null); }}
          onKeyDown={(e) => { if (e.key === 'Escape') setMsgModal(null); }}
        >
          <div className="bg-[#1F2937] border border-[#374151] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-3 border-b border-[#374151]">
              <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                {msgModal.loading ? '⏳ Gerando mensagem...' : '✏️ Mensagem'}
              </h3>
              <button
                onClick={() => setMsgModal(null)}
                className="text-gray-500 hover:text-gray-300 text-lg"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-3">
              <div className="text-xs text-gray-500">
                Para: <span className="text-gray-300 font-semibold">{lead.business || lead.name}</span>
                {lead.phone && <span className="ml-2 text-gray-600">{lead.phone}</span>}
              </div>

              {msgModal.loading ? (
                <div className="flex items-center justify-center py-8 text-gray-500">
                  <span className="animate-pulse">Gerando mensagem personalizada com IA...</span>
                </div>
              ) : (
                <textarea
                  value={msgDraft}
                  onChange={(e) => setMsgDraft(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#25D366] resize-y leading-relaxed"
                  autoFocus
                />
              )}

              <p className="text-[10px] text-gray-600">
                Edite a mensagem antes de enviar. O link do portfólio já está incluído.
              </p>
            </div>

            {/* Footer */}
            {!msgModal.loading && (
              <div className="flex gap-2 px-5 py-3 border-t border-[#374151]">
                <button
                  onClick={() => setMsgModal(null)}
                  className="flex-1 py-2 bg-transparent border border-[#374151] text-gray-400 hover:text-gray-200 rounded-lg text-xs transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 bg-[#1F2937] border border-[#374151] text-gray-300 hover:text-white rounded-lg text-xs transition-colors flex items-center gap-1"
                  title="Copiar"
                >
                  📋 Copiar
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 py-2 bg-[#25D366] hover:bg-[#20b954] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  💬 Enviar WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
