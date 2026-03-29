'use client';
import { useState } from 'react';

const MOCK_LEADS = [
  { id: 1, name: 'Ana Souza', date: '28/03/2026', phone: '11988887777', property: 'Pérola da Montanha', status: 'Novo', priority: 'Alta', notes: 'Quer fechar para o feriado de Corpus Christi. Grupo com 20 pessoas.' },
  { id: 2, name: 'Carlos Mendes', date: '27/03/2026', phone: '11977778888', property: 'Riviera Módulo 7', status: 'Negociando', priority: 'Média', notes: 'Oferecemos 5% desconto. Ficou de confirmar amanhã após falar com a esposa.' },
  { id: 3, name: 'Patrícia Lima', date: '25/03/2026', phone: '11966665555', property: 'Juquehy', status: 'Em contato', priority: 'Baixa', notes: 'Apenas cotando para dezembro. Enviar link promocional no meio do ano.' },
  { id: 4, name: 'Fernando Silva', date: '24/03/2026', phone: '11955556666', property: 'Casa Campo Itu', status: 'Convertido', priority: 'Baixa', notes: 'Fechou o pacote de 4 noites. Sinal de 50% já pago.' },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case 'Novo': return { bg: '#DBEAFE', text: '#1D4ED8' };
    case 'Em contato': return { bg: '#FEF3C7', text: '#D97706' };
    case 'Negociando': return { bg: '#FCE7F3', text: '#BE185D' };
    case 'Convertido': return { bg: '#D1FAE5', text: '#047857' };
    case 'Perdido': return { bg: '#FEE2E2', text: '#B91C1C' };
    default: return { bg: '#F1F5F9', text: '#475569' };
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority) {
    case 'Alta': return { text: '#DC2626', icon: '🔴' };
    case 'Média': return { text: '#D97706', icon: '🟡' };
    case 'Baixa': return { text: '#059669', icon: '🟢' };
    default: return { text: '#475569', icon: '⚪' };
  }
};

export default function LeadsInquiriesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <div>
          <h2 style={{ marginBottom: 5 }}>Follow-up de Consultas (Leads)</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>Gerencie interessados, agende retornos e acompanhe negociações em aberto.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: '#0F172A', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>+ Novo Atendimento</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        {[
          { title: 'Novas Consultas', value: '1', color: '#1D4ED8' },
          { title: 'Em Negociação', value: '2', color: '#BE185D' },
          { title: 'Fechados no Mês', value: '1', color: '#047857' },
          { title: 'Taxa de Conversão', value: '25%', color: '#0F172A' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>{k.title}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              {['CLIENTE/DATA', 'IMÓVEL INTERESSE', 'STATUS', 'PRIORIDADE', 'NOTAS', 'AÇÃO'].map((h, i) => (
                <th key={i} style={{ padding: '16px 20px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_LEADS.map(lead => {
              const statusA = getStatusColor(lead.status);
              const { text: priorityText, icon: priorityIcon } = getPriorityColor(lead.priority);
              return (
                <tr key={lead.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{lead.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{lead.date} • {lead.phone}</div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 500 }}>{lead.property}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ background: statusA.bg, color: statusA.text, padding: '4px 8px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 }}>{lead.status}</span>
                  </td>
                  <td style={{ padding: '16px 20px', color: priorityText, fontWeight: 600 }}>{priorityIcon} {lead.priority}</td>
                  <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#475569', maxWidth: 200, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{lead.notes}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <a href={`https://wa.me/55${lead.phone}?text=Olá ${lead.name.split(' ')[0]}, aqui é da equipe Aluguel Familiar. Tudo bem?`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>WhatsApp</a>
                    <button style={{ background: 'white', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, color: '#475569', cursor: 'pointer', marginLeft: 8 }}>Editar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: 'white', padding: 30, borderRadius: 12, width: 450 }}>
            <h3 style={{ margin: '0 0 20px 0' }}>Novo Atendimento</h3>
            <p>Formulário de criação de lead voltará em breve.</p>
            <button onClick={() => setShowModal(false)} style={{ background: '#E2E8F0', padding: '10px 15px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, width: '100%' }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
