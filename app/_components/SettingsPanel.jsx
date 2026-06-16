'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../_lib/storage';

const PRESET_MODELS = [
  { label: 'DeepSeek V3', provider: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { label: 'OpenAI GPT-4o', provider: 'https://api.openai.com/v1', model: 'gpt-4o' },
  { label: 'OpenAI GPT-4o-mini', provider: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { label: 'Groq Llama 3', provider: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  { label: 'Groq Mixtral', provider: 'https://api.groq.com/openai/v1', model: 'mixtral-8x7b-32768' },
  { label: 'Together Llama', provider: 'https://api.together.xyz/v1', model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
  { label: 'Anthropic (via OpenRouter)', provider: 'https://openrouter.ai/api/v1', model: 'anthropic/claude-sonnet-4' },
  { label: 'Personalizado', provider: '', model: '' },
];

export default function SettingsPanel() {
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handlePreset = (preset) => {
    if (preset.label === 'Personalizado') {
      setSettings({ ...settings, llmProvider: '', llmModel: '' });
    } else {
      setSettings({ ...settings, llmProvider: preset.provider, llmModel: preset.model });
    }
  };

  const handleSave = () => {
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportAllData = () => {
    const data = getSettings();
    // Current leads come from parent via full data, but for export we just trigger event
    window.dispatchEvent(new CustomEvent('leadflow-export-all'));
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* LLM Configuration */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">🤖 Modelo LLM</h3>

        {/* Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {PRESET_MODELS.slice(0, -1).map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePreset(preset)}
              className={`px-3 py-2 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors ${
                settings.llmProvider === preset.provider && settings.llmModel === preset.model
                  ? 'bg-[#265FCC] text-white'
                  : 'bg-[#111827] text-gray-400 hover:text-gray-200 border border-[#374151]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Custom provider */}
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Provider URL (OpenAI-compatible)
            </label>
            <input
              type="text"
              value={settings.llmProvider}
              onChange={(e) => setSettings({ ...settings, llmProvider: e.target.value })}
              placeholder="https://api.deepseek.com/v1"
              className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#265FCC]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.llmApiKey}
                onChange={(e) => setSettings({ ...settings, llmApiKey: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 pr-10 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#265FCC]"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
              Modelo
            </label>
            <input
              type="text"
              value={settings.llmModel}
              onChange={(e) => setSettings({ ...settings, llmModel: e.target.value })}
              placeholder="deepseek-chat"
              className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#265FCC]"
            />
          </div>
        </div>
      </div>

      {/* Apify Configuration */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">🕷️ Apify (Google Maps Scraper)</h3>
        <p className="text-xs text-gray-600 mb-3">
          Use sua chave da Apify para buscar negócios locais no Google Maps. Crie uma conta gratuita em{' '}
          <a href="https://apify.com" target="_blank" rel="noopener noreferrer" className="text-[#265FCC] hover:underline">
            apify.com
          </a>
          {' '}— o plano gratuito dá $5/mês (~100 leads).
        </p>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Apify API Key
          </label>
          <input
            type="password"
            value={settings.apifyApiKey}
            onChange={(e) => setSettings({ ...settings, apifyApiKey: e.target.value })}
            placeholder="apify_api_..."
            className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#E69138]"
          />
        </div>
      </div>

      {/* Portfolio URL */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">🔗 Portfólio</h3>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            URL do portfólio (usado nas mensagens)
          </label>
          <input
            type="text"
            value={settings.portfolioUrl}
            onChange={(e) => setSettings({ ...settings, portfolioUrl: e.target.value })}
            placeholder="https://elucas.dev"
            className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
          />
        </div>
      </div>

      {/* Password */}
      <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-4 sm:p-6">
        <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-4">🔐 Alterar Senha</h3>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Nova senha de acesso
          </label>
          <input
            type="password"
            value={settings.authPassword}
            onChange={(e) => setSettings({ ...settings, authPassword: e.target.value })}
            placeholder="••••"
            className="w-full px-3 py-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2EB873]"
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 bg-[#2EB873] hover:bg-[#25a060] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          {saved ? '✓ Salvo!' : 'Salvar Configurações'}
        </button>
        <button
          onClick={handleExportAllData}
          className="px-4 py-2.5 bg-transparent border border-[#374151] text-gray-400 hover:text-gray-200 rounded-lg text-sm transition-colors"
        >
          📦 Exportar Dados
        </button>
      </div>
    </div>
  );
}
