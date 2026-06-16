'use client';

import { useState } from 'react';
import { getSettings, updateSettings } from '../_lib/storage';

export default function AuthGate({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const settings = getSettings();

  // Se não tem senha configurada, é primeiro acesso — mostrar setup
  const needsSetup = !settings.authPassword;

  const handleSetup = () => {
    if (password.length < 4) {
      setError('Senha muito curta. Mínimo 4 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Senhas não conferem.');
      return;
    }
    updateSettings({ authPassword: password });
    setError('');
    onAuth(true);
  };

  const handleLogin = () => {
    if (password === settings.authPassword) {
      setError('');
      onAuth(true);
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      needsSetup ? handleSetup() : handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0E1A] p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🔐</div>
          <h1 className="text-2xl font-bold text-[#2EB873] tracking-tight">
            LeadFlow
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {needsSetup ? 'Configure sua senha de acesso' : 'Acesso restrito'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-[#1F2937] border border-[#374151] rounded-xl p-6 space-y-4">
          {needsSetup ? (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">
                  Crie uma senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#2EB873] transition-colors"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">
                  Confirme a senha
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Repita a senha"
                  className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#2EB873] transition-colors"
                />
              </div>
              <button
                onClick={handleSetup}
                className="w-full py-2.5 bg-[#2EB873] hover:bg-[#25a060] text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Criar Acesso
              </button>
              <p className="text-xs text-gray-500 text-center">
                Esta senha protege seus dados localmente no navegador.
              </p>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">
                  Senha de acesso
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite a senha"
                  className="w-full px-3 py-2.5 bg-[#111827] border border-[#374151] rounded-lg text-gray-200 text-sm placeholder-gray-600 focus:outline-none focus:border-[#2EB873] transition-colors"
                  autoFocus
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-2.5 bg-[#2EB873] hover:bg-[#25a060] text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Entrar
              </button>
            </>
          )}

          {error && (
            <p className="text-xs text-[#E63E5F] text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
