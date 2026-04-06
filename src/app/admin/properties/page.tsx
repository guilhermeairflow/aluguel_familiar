'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES } from '@/lib/properties-data';
import { loadAllProperties, loadAllPricing } from '@/lib/data-persistence';

export default function PropertiesPage() {
  const [props, setProps] = useState(PROPERTIES);
  const [allPricing, setAllPricing] = useState<Record<string, any>>({});

  useEffect(() => { 
    setProps(loadAllProperties());
    setAllPricing(loadAllPricing());
  }, []);

  return (
    <div>
      {/* ── Cabeçalho ── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 24, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: 800, color: '#0f172a' }}>
            Gerenciar Imóveis
          </h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            {props.length} imóveis no portfólio · Clique em "Gerenciar" para editar
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            background: '#0f172a', color: 'white', padding: '10px 16px',
            borderRadius: 8, textDecoration: 'none', fontWeight: 600,
            fontSize: '0.85rem', whiteSpace: 'nowrap',
          }}
        >
          🌐 Ver Site Público
        </a>
      </div>

      {/* ── Grid de imóveis ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: 16,
      }}>
        {props.map(p => {
          const pricing = allPricing[p.id];
          const currentPrice = pricing?.basePrice ?? p.basePricePerNight;
          
          return (
            <div
              key={p.id}
              style={{
                background: 'white', borderRadius: 14, overflow: 'hidden',
                border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Foto */}
              <div style={{ position: 'relative', height: 170, overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={p.coverImage} alt={p.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)', color: 'white', padding: '3px 9px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                    {p.images.length} fotos
                  </span>
                  <span style={{ background: '#10b981', color: 'white', padding: '3px 9px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                    ● Ativo
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.title}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>
                    📍 {p.city}, {p.state}
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                    👥 {p.maxGuests} hósp.
                  </span>
                  <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                    🛌 {p.bedrooms} qts
                  </span>
                  <span style={{ background: '#fef9c3', color: '#a16207', padding: '3px 8px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700 }}>
                    💰 R$ {currentPrice.toLocaleString('pt-BR')}/noite
                  </span>
                </div>

                {/* Botões */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
                  <a
                    href={`/imoveis/${p.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: '1 1 80px', textAlign: 'center', background: '#f1f5f9',
                      color: '#475569', padding: '9px 6px', borderRadius: 8,
                      textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    👁️ Ver Página
                  </a>
                  <a
                    href={`/admin/properties/${p.id}`}
                    style={{
                      flex: '2 1 120px', textAlign: 'center', background: '#2563eb',
                      color: 'white', padding: '9px 6px', borderRadius: 8,
                      textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ⚙️ Gerenciar Imóvel
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}