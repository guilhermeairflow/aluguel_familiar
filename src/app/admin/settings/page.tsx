'use client';
import { useState } from 'react';

export default function SettingsPage() {
  const [whatsapp, setWhatsapp] = useState('5511945747572');
  const [siteTitle, setSiteTitle] = useState('AluguelFamiliar.');
  const [adminEmail, setAdminEmail] = useState('admin@aluguelfamiliar.com');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const field = (label: string, value: string, onChange: (v: string) => void, type = 'text') => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '0.95rem', color: '#0f172a', outline: 'none' }}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 720 }}>
      <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Configurações do Sistema</h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: '0.88rem' }}>Gerencie as configurações gerais da plataforma.</p>

      {/* General */}
      <div style={{ background: 'white', borderRadius: 14, padding: '24px 28px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>⚙️ Configurações Gerais</h3>
        {field('Nome do Site', siteTitle, setSiteTitle)}
        {field('E-mail do Administrador', adminEmail, setAdminEmail, 'email')}
      </div>

      {/* WhatsApp */}
      <div style={{ background: 'white', borderRadius: 14, padding: '24px 28px', border: '1px solid #e2e8f0', marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>📱 Configuração do WhatsApp</h3>
        {field('Número WhatsApp (com DDI, sem +)', whatsapp, setWhatsapp, 'tel')}
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', fontSize: '0.82rem', color: '#15803d' }}>
          ✅ Número atual: <strong>+{whatsapp.slice(0,2)} ({whatsapp.slice(2,4)}) {whatsapp.slice(4,9)}-{whatsapp.slice(9)}</strong>
        </div>
      </div>

      {/* Credentials */}
      <div style={{ background: 'white', borderRadius: 14, padding: '24px 28px', border: '1px solid #e2e8f0', marginBottom: 28 }}>
        <h3 style={{ margin: '0 0 20px', fontWeight: 700, color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>🔐 Credenciais de Acesso</h3>
        <div style={{ background: '#fafafa', borderRadius: 10, padding: '16px 20px', fontSize: '0.88rem', color: '#475569' }}>
          <div style={{ marginBottom: 8 }}>📧 <strong>Login:</strong> admin@aluguelfamiliar.com</div>
          <div>🔑 <strong>Senha:</strong> AluguelFamiliar@2026</div>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: 10 }}>Para alterar a senha, edite o arquivo <code>src/app/admin/login/page.tsx</code>.</p>
      </div>

      <button
        onClick={handleSave}
        style={{ background: saved ? '#10b981' : '#0f172a', color: 'white', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s' }}
      >
        {saved ? '✅ Salvo com sucesso!' : '💾 Salvar Configurações'}
      </button>
    </div>
  );
}
