'use client';
import { useState } from 'react';

const MOCK_CLIENTS = [
  { id: 1, name: 'Marcos Silveira', phone: '11999998888', totalSpent: 18500, nights: 14, trips: 3, lastStay: 'Riviera Módulo 7' },
  { id: 2, name: 'Tatiana Gouveia', phone: '11977776666', totalSpent: 12000, nights: 10, trips: 2, lastStay: 'Juquehy' },
  { id: 3, name: 'Roberto Almeida', phone: '11955554444', totalSpent: 28000, nights: 21, trips: 4, lastStay: 'Casa Campo Itu' },
  { id: 4, name: 'Carla Dias', phone: '11933332222', totalSpent: 6000, nights: 4, trips: 1, lastStay: 'Ilhabela Perequê' },
];

export default function ClientsCRMPage() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2>CRM de Clientes & Remarketing</h2>
        <div style={{ width: 300 }}><input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #CBD5E1' }} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0' }}><div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Total Clientes</div><div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>{MOCK_CLIENTS.length}</div></div>
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0' }}><div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Top Gastador</div><div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>R$ 28k</div></div>
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0' }}><div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Tíquete Médio</div><div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>R$ 16k</div></div>
        <div style={{ background: 'white', padding: 20, borderRadius: 12, border: '1px solid #E2E8F0' }}><div style={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>Hóspedes Recorrentes</div><div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6' }}>75%</div></div>
      </div>

      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '16px 20px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>CLIENTE / HISTÓRICO</th>
              <th style={{ padding: '16px 20px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>FREQUÊNCIA</th>
              <th style={{ padding: '16px 20px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>TOTAL INVESTIDO</th>
              <th style={{ padding: '16px 20px', color: '#64748B', fontWeight: 600, fontSize: '0.85rem' }}>AÇÕES (REMARKETING)</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(client => (
              <tr key={client.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px 20px' }}><div style={{ fontWeight: 600, color: '#0F172A' }}>{client.name}</div><div style={{ fontSize: '0.85rem', color: '#64748B' }}>Última vez: {client.lastStay}</div></td>
                <td style={{ padding: '16px 20px' }}><div style={{ fontWeight: 600 }}>{client.trips} viagens</div><div style={{ fontSize: '0.85rem', color: '#64748B' }}>{client.nights} noites</div></td>
                <td style={{ padding: '16px 20px', fontWeight: 700, color: '#10B981' }}>R$ {client.totalSpent.toLocaleString('pt-BR')}</td>
                <td style={{ padding: '16px 20px' }}>
                  <a href={`https://wa.me/55${client.phone}?text=Olá ${client.name.split(' ')[0]}, temos uma oferta especial na casa de ${client.lastStay}!`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '8px 16px', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Chamar no WhatsApp</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
