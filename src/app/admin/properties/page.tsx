'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES } from '@/lib/properties-data';

// Carrega propriedades do localStorage (edições salvas) ou usa os dados originais
function loadProperties() {
  if (typeof window === 'undefined') return PROPERTIES;
  try {
    const saved = localStorage.getItem('af_properties');
    if (saved) return JSON.parse(saved);
  } catch {}
  return PROPERTIES;
}

export default function PropertiesPage() {
  const [props, setProps] = useState(PROPERTIES);

  useEffect(() => {
    setProps(loadProperties());
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Gerenciar Imóveis</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>{props.length} imóveis no portfólio · Clique em "Gerenciar" para editar</p>
        </div>
        <a href="/" target="_blank" rel="noreferrer" style={{ background: '#0f172a', color: 'white', padding: '10px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem' }}>
          🌐 Ver Site Público
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {props.map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            {/* Foto */}
            <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
              <img src={p.coverImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                  {p.images.length} fotos
                </span>
                <span style={{ background: '#10b981', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                  ● Ativo
                </span>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 10 }}>📍 {p.city}, {p.state}</div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>👥 {p.maxGuests} hósp.</span>
                <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>🛌 {p.bedrooms} qts</span>
                <span style={{ background: '#fef9c3', color: '#a16207', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>💰 R$ {p.basePricePerNight.toLocaleString('pt-BR')}/noite</span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={`/imoveis/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ flex: 1, textAlign: 'center', background: '#f1f5f9', color: '#475569', padding: '9px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  👁️ Ver Página
                </a>
                <a
                  href={`/admin/properties/${p.id}`}
                  style={{ flex: 2, textAlign: 'center', background: '#2563eb', color: 'white', padding: '9px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  ⚙️ Gerenciar Imóvel
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
