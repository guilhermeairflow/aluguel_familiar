'use client';
import { useState } from 'react';
import { PROPERTIES } from '@/lib/properties-data';

const MOCK_REVIEWS = [
  { id: 1, guest: 'Marcos S.', property: 'Pérola da Montanha', rating: 5, date: 'Mar 2026', comment: 'Espetacular! A vista é incrível, o SPA uma maravilha. Com certeza voltaremos nas próximas férias.' },
  { id: 2, guest: 'Tatiana G.', property: 'Mansão Guarujá', rating: 5, date: 'Fev 2026', comment: 'Pé na areia, estrutura impecável, caseira muito atenciosa. Melhor viagem da família!' },
  { id: 3, guest: 'Roberto A.', property: 'Casa Campo Itu', rating: 4, date: 'Jan 2026', comment: 'Espaço ótimo para o grupo grande. A piscina e o campo de futebol foram o destaque. Recomendo!' },
  { id: 4, guest: 'Carla D.', property: 'Cobertura Riviera', rating: 5, date: 'Jan 2026', comment: 'Localização perfeita, serviço de praia incluso foi incrível. Voltaremos no carnaval!' },
];

const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

export default function ReviewsPage() {
  const [filter, setFilter] = useState('Todos');
  const props = ['Todos', ...PROPERTIES.map(p => p.city)];
  const filtered = filter === 'Todos' ? MOCK_REVIEWS : MOCK_REVIEWS.filter(r => r.property.includes(filter));
  const avg = (MOCK_REVIEWS.reduce((a, r) => a + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Avaliações dos Hóspedes</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>Média geral: <strong style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(Number(avg)))} {avg}/5</strong></p>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Avaliações', value: MOCK_REVIEWS.length, color: '#2563eb' },
          { label: 'Nota Média', value: avg + ' ★', color: '#f59e0b' },
          { label: 'Nota 5 ★', value: MOCK_REVIEWS.filter(r => r.rating === 5).length, color: '#10b981' },
          { label: 'Recomendariam', value: '100%', color: '#0f172a' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {props.slice(0, 6).map(p => (
          <button key={p} onClick={() => setFilter(p)} style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: filter === p ? '#2563eb' : '#e2e8f0', background: filter === p ? '#eff6ff' : 'white', color: filter === p ? '#2563eb' : '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>
            {p}
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.guest}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{r.property} · {r.date}</div>
              </div>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.1rem' }}>{stars(r.rating)}</div>
            </div>
            <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}
