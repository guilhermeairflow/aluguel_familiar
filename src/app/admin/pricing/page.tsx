'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES } from '@/lib/properties-data';

type PriceData = {
  basePrice: number;       // diária temporada normal
  highSeasonPrice: number; // diária alta temporada (valor direto)
  holidayPrice: number;    // diária feriados especiais (valor direto)
  cleaningFee: number;
  minNights: number;
  minNightsHigh: number;
};

const DEFAULT_PRICES: Record<string, PriceData> = Object.fromEntries(
  PROPERTIES.map(p => [p.id, {
    basePrice: p.basePricePerNight,
    highSeasonPrice: Math.round(p.basePricePerNight * 1.5),
    holidayPrice: Math.round(p.basePricePerNight * 2.2),
    cleaningFee: p.cleaningFee,
    minNights: 2,
    minNightsHigh: 3,
  }])
);

function loadPrices(): Record<string, PriceData> {
  if (typeof window === 'undefined') return DEFAULT_PRICES;
  try {
    const saved = localStorage.getItem('af_prices');
    if (saved) return { ...DEFAULT_PRICES, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_PRICES;
}

function savePrices(prices: Record<string, PriceData>) {
  try { localStorage.setItem('af_prices', JSON.stringify(prices)); } catch {}
}

const SEASONS = [
  { id: 'base',      label: 'Temporada Normal',                   mult: 1,    icon: '🔵', color: '#2563eb' },
  { id: 'high',      label: 'Alta (Verão / Julho)',               mult: 1.5,  icon: '🟡', color: '#d97706' },
  { id: 'holiday',   label: 'Feriados (Natal / Réveillon)',       mult: 2.2,  icon: '🔴', color: '#dc2626' },
];

const PROP_COLORS: Record<string, string> = {
  '1': '#2563eb', '2': '#16a34a', '3': '#ea580c',
  '4': '#9333ea', '5': '#0891b2', '6': '#db2777', '7': '#d97706',
};

export default function PricingPage() {
  const [prices, setPrices] = useState<Record<string, PriceData>>(DEFAULT_PRICES);
  const [selectedId, setSelectedId] = useState(PROPERTIES[0].id);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => { setPrices(loadPrices()); }, []);

  const prop = PROPERTIES.find(p => p.id === selectedId)!;
  const data = prices[selectedId];

  const update = (field: keyof PriceData, val: number) => {
    setPrices(prev => ({ ...prev, [selectedId]: { ...prev[selectedId], [field]: val } }));
  };

  const handleSave = () => {
    savePrices(prices);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const projected = (mult: number) => Math.round(data.basePrice * mult);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: '0.95rem', color: '#0f172a',
    outline: 'none', fontWeight: 700, background: 'white', boxSizing: 'border-box',
  };

  const rowInput = (label: string, field: keyof PriceData, prefix = 'R$', step = 50, min = 0) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
        {prefix && <span style={{ padding: '10px 12px', background: '#f8fafc', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #e2e8f0', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{prefix}</span>}
        <input
          type="number"
          value={data[field]}
          min={min}
          step={step}
          onChange={e => update(field, parseFloat(e.target.value) || 0)}
          style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1 }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

      {/* ── SIDEBAR: lista de imóveis ── */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 8px', marginBottom: 4 }}>
          Selecionar Imóvel
        </div>
        {PROPERTIES.map(p => {
          const color = PROP_COLORS[p.id] || '#64748b';
          const isSelected = selectedId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10,
                border: `2px solid ${isSelected ? color : 'transparent'}`,
                background: isSelected ? `${color}12` : '#f8fafc',
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <img src={p.coverImage} alt="" style={{ width: 36, height: 28, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: isSelected ? 800 : 600, fontSize: '0.78rem', color: isSelected ? color : '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.city}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>R$ {p.basePricePerNight.toLocaleString('pt-BR')}/noite</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── PAINEL DE PREÇOS ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
              💰 {prop.city} — Gestão de Preços
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              {prop.title.split('|')[0].trim()} · {prop.maxGuests} hóspedes · {prop.bedrooms} quartos
            </p>
          </div>
          <button
            onClick={handleSave}
            style={{ padding: '10px 22px', borderRadius: 9, border: 'none', background: savedMsg ? '#10b981' : '#0f172a', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.3s' }}
          >
            {savedMsg ? '✅ Salvo!' : '💾 Salvar Preços'}
          </button>
        </div>

        {/* Preços base + taxas */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 18px', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            📋 Valores Base
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {rowInput('Diária Base', 'basePrice', 'R$', 100, 100)}
            {rowInput('Taxa de Limpeza', 'cleaningFee', 'R$', 50, 0)}
            {rowInput('Mín. Diárias (Normal)', 'minNights', '', 1, 1)}
            {rowInput('Mín. Diárias (Alta)', 'minNightsHigh', '', 1, 1)}
          </div>
        </div>

        {/* Preços por temporada — valores diretos */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
            🎯 Preços por Temporada
          </h3>
          <p style={{ margin: '0 0 18px', fontSize: '0.78rem', color: '#94a3b8', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            Defina o valor exato da diária para cada período
          </p>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { label: '🟡 Alta Temporada', field: 'highSeasonPrice' as keyof PriceData, color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Janeiro, Fevereiro, Julho' },
              { label: '🔴 Feriados Especiais', field: 'holidayPrice' as keyof PriceData, color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Natal, Réveillon, Carnaval, Páscoa' },
            ].map(s => (
              <div key={s.field} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'center', background: s.bg, borderRadius: 12, padding: '16px 18px', border: `1px solid ${s.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>{s.desc}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 6 }}>
                    Normal: R$ {data.basePrice.toLocaleString('pt-BR')} &nbsp;·&nbsp;
                    <span style={{ fontWeight: 700, color: s.color }}>
                      +{Math.round(((data[s.field] as number) / data.basePrice - 1) * 100)}% acima
                    </span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Diária (R$)</label>
                  <div style={{ display: 'flex', border: `2px solid ${s.border}`, borderRadius: 8, overflow: 'hidden', background: 'white' }}>
                    <span style={{ padding: '10px 12px', background: '#f8fafc', color: '#94a3b8', fontWeight: 700, borderRight: '1px solid #e2e8f0', fontSize: '0.85rem' }}>R$</span>
                    <input
                      type="number"
                      value={data[s.field] as number}
                      min={data.basePrice}
                      step={50}
                      onChange={e => update(s.field, parseInt(e.target.value) || data.basePrice)}
                      style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1, fontWeight: 800, fontSize: '1.05rem', color: s.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Simulador de receita */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 18px', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            📊 Simulador de Receita
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  {['Temporada', '2 noites', '3 noites', '5 noites', '7 noites', 'Mês cheio (30n)'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Temporada' ? 'left' : 'right', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: '🔵 Normal',           price: data.basePrice,         color: '#2563eb' },
                  { label: '🟡 Alta Temporada',   price: data.highSeasonPrice,   color: '#d97706' },
                  { label: '🔴 Feriados',          price: data.holidayPrice,      color: '#dc2626' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: '0.85rem', color: row.color }}>{row.label}</td>
                    {[2, 3, 5, 7, 30].map(nights => {
                      const total = (row as any).price * nights + data.cleaningFee;
                      return (
                        <td key={nights} style={{ padding: '12px', textAlign: 'right', fontWeight: nights === 30 ? 900 : 600, color: nights === 30 ? row.color : '#0f172a', fontSize: nights === 30 ? '0.95rem' : '0.88rem', whiteSpace: 'nowrap' }}>
                          R$ {total.toLocaleString('pt-BR')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.73rem', color: '#94a3b8', marginTop: 12 }}>* Valores incluem taxa de limpeza (R$ {data.cleaningFee.toLocaleString('pt-BR')})</p>
        </div>

        {/* Comparativo com outros imóveis */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 18px', fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: 12 }}>
            🏠 Comparativo do Portfólio
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROPERTIES.map(p => {
              const pData = prices[p.id];
              const isSelected = p.id === selectedId;
              const color = PROP_COLORS[p.id] || '#64748b';
              const maxBase = Math.max(...PROPERTIES.map(pp => prices[pp.id]?.basePrice || pp.basePricePerNight));
              const pct = Math.round((pData.basePrice / maxBase) * 100);
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: isSelected ? `${color}08` : '#f8fafc', border: `1.5px solid ${isSelected ? color : 'transparent'}`, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  <img src={p.coverImage} alt="" style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isSelected ? color : '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.city}</div>
                    <div style={{ background: '#e2e8f0', borderRadius: 999, height: 5, marginTop: 4 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: isSelected ? color : '#0f172a', fontSize: '0.9rem' }}>R$ {pData.basePrice.toLocaleString('pt-BR')}</div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>/noite base</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Botão salvar bottom */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 20 }}>
          <button
            onClick={handleSave}
            style={{ padding: '12px 32px', borderRadius: 10, border: 'none', background: savedMsg ? '#10b981' : '#0f172a', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s' }}
          >
            {savedMsg ? '✅ Preços Salvos!' : '💾 Salvar Todas as Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}
