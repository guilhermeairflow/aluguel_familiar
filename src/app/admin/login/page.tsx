'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (
        email.trim() === 'admin@aluguelfamiliar.com' &&
        password === 'AluguelFamiliar@2026'
      ) {
        localStorage.setItem('af_admin_logged', '1');
        window.location.replace('/admin/');
      } else {
        setError('E-mail ou senha incorretos.');
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
      fontFamily: "'Inter', sans-serif", padding: '20px',
    }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
            Aluguel<span style={{ color: '#2563eb' }}>Familiar</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>Painel Administrativo</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@aluguelfamiliar.com"
              required
              autoComplete="email"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', color: '#0f172a' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', background: loading ? '#94a3b8' : '#0f172a',
              color: 'white', border: 'none', borderRadius: 10, fontWeight: 700,
              fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? '🔐 Verificando...' : 'Entrar no Painel'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8' }}>
          Acesso restrito a administradores
        </div>
      </div>
    </div>
  );
}
