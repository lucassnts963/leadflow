'use client';

import { useState } from 'react';
import { getSettings } from '../_lib/storage';
import { scrapeGoogleMaps } from '../_lib/apify';

const CATEGORY_QUERIES = [
  { label: '🏋️ Academias', query: 'academia' },
  { label: '💈 Barbearias', query: 'barbearia' },
  { label: '🍕 Pizzarias', query: 'pizzaria' },
  { label: '🥪 Lanchonetes', query: 'lanchonete' },
  { label: '🦷 Dentistas', query: 'dentista' },
  { label: '⚖️ Advocacia', query: 'advogado' },
  { label: '🏠 Imobiliárias', query: 'imobiliária' },
  { label: '🏥 Clínicas', query: 'clínica' },
  { label: '💅 Beleza', query: 'salão de beleza' },
  { label: '🏗️ Construção', query: 'construção' },
  { label: '🍽️ Restaurantes', query: 'restaurante' },
];

export default function LeadScraper({ onAddLeads }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Barcarena, PA');
  const [maxResults, setMaxResults] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleScrape = async () => {
    const settings = getSettings();
    if (!settings.apifyApiKey) {
      setError('Configure a chave Apify em Configurações primeiro.');
      return;
    }
    if (!query) {
      setError('Digite um termo de busca.');
      return;
    }

    setLoading(true);
    setError('');
    setStatus('Iniciando scraping...');

    try {
      setStatus('Buscando no Google Maps (isso pode levar 30-60s)...');
      const leads = await scrapeGoogleMaps(settings.apifyApiKey, query, location, maxResults);

      // Score leads
      const { rescoreAllLeads } = await import('../_lib/scoring');
      const scored = rescoreAllLeads(leads);

      onAddLeads(scored);
      setStatus(`✅ ${scored.length} leads importados!`);
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setError(err.message);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6 space-y-4">
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-1">🕷️ Buscar Leads no Google Maps</h3>
        <p className="text-xs text-gray-600">
          O scraper busca negócios locais e extrai nome, telefone, site, Instagram e avaliações.
        </p>
      </div>

      {/* Quick category buttons */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_QUERIES.map((cat) => (
          <button
            key={cat.query}
            onClick={() => setQuery(cat.query)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors ${
              query === cat.query
                ? 'bg-[#E69138] text-white'
                : 'bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#374151]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: dentista, academia, pizzaria..."
          className="flex-1 px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#E69138]"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Localização"
          className="w-full sm:w-40 px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 focus:outline-none focus:border-[#E69138]"
        />
        <select
          value={maxResults}
          onChange={(e) => setMaxResults(Number(e.target.value))}
          className="w-full sm:w-32 px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200"
        >
          <option value={5}>5 leads</option>
          <option value={10}>10 leads</option>
          <option value={20}>20 leads</option>
          <option value={30}>30 leads</option>
        </select>
        <button
          onClick={handleScrape}
          disabled={loading}
          className="px-4 py-2 bg-[#E69138] hover:bg-[#d4812e] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shrink-0"
        >
          {loading ? '⏳ Buscando...' : '🔍 Buscar'}
        </button>
      </div>

      {status && (
        <div className={`text-xs ${status.startsWith('✅') ? 'text-[#2EB873]' : 'text-gray-400'}`}>
          {status}
        </div>
      )}

      {error && (
        <div className="p-3 bg-[#E63E5F]/10 border border-[#E63E5F]/20 rounded-lg text-xs text-[#E63E5F]">
          {error}
        </div>
      )}

      <p className="text-[10px] text-gray-600">
        ⚠️ O scraping pode levar 30-60 segundos. O plano gratuito da Apify ($5/mês) permite ~100 buscas.
        Todos os dados ficam salvos no seu navegador.
      </p>
    </div>
  );
}
