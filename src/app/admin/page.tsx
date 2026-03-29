'use client';

import { useState } from 'react';
import { PROPERTIES } from '@/lib/properties-data';

// ─── DADOS MOCK DE RESERVAS ──────────────────────────────────────────────────
const BOOKINGS = [
  { id: 1,  propId: '1', propName: 'Pérola da Montanha',       checkin: '2026-01-03', checkout: '2026-01-10', guests: 25, value: 25400, status: 'Confirmado' },
  { id: 2,  propId: '7', propName: 'Mansão Guarujá',           checkin: '2026-01-15', checkout: '2026-01-20', guests: 16, value: 29700, status: 'Confirmado' },
  { id: 3,  propId: '2', propName: 'Ilhabela (Santa Tereza)',  checkin: '2026-02-01', checkout: '2026-02-08', guests: 35, value: 32100, status: 'Confirmado' },
  { id: 4,  propId: '3', propName: 'Casa Campo Itu',           checkin: '2026-02-13', checkout: '2026-02-17', guests: 40, value: 20200, status: 'Confirmado' },
  { id: 5,  propId: '6', propName: 'Cobertura Riviera',        checkin: '2026-02-13', checkout: '2026-02-17', guests: 12, value: 12600, status: 'Confirmado' },
  { id: 6,  propId: '1', propName: 'Pérola da Montanha',       checkin: '2026-03-01', checkout: '2026-03-07', guests: 20, value: 19800, status: 'Confirmado' },
  { id: 7,  propId: '4', propName: 'Ilhabela (Perequê)',       checkin: '2026-03-15', checkout: '2026-03-20', guests: 10, value:  9400, status: 'Confirmado' },
  { id: 8,  propId: '5', propName: 'Juquehy',                  checkin: '2026-04-03', checkout: '2026-04-07', guests: 8,  value:  5300, status: 'Pendente'   },
  { id: 9,  propId: '7', propName: 'Mansão Guarujá',           checkin: '2026-04-21', checkout: '2026-04-25', guests: 18, value: 24200, status: 'Confirmado' },
  { id: 10, propId: '2', propName: 'Ilhabela (Santa Tereza)',  checkin: '2026-06-28', checkout: '2026-07-05', guests: 38, value: 35000, status: 'Pendente'   },
  { id: 11, propId: '1', propName: 'Pérola da Montanha',       checkin: '2026-07-04', checkout: '2026-07-12', guests: 28, value: 40000, status: 'Confirmado' },
  { id: 12, propId: '3', propName: 'Casa Campo Itu',           checkin: '2026-07-04', checkout: '2026-07-11', guests: 35, value: 38000, status: 'Pendente'   },
  { id: 13, propId: '6', propName: 'Cobertura Riviera',        checkin: '2026-07-04', checkout: '2026-07-08', guests: 12, value: 13000, status: 'Confirmado' },
  { id: 14, propId: '7', propName: 'Mansão Guarujá',           checkin: '2026-12-26', checkout: '2027-01-02', guests: 18, value: 46200, status: 'Pendente'   },
  { id: 15, propId: '1', propName: 'Pérola da Montanha',       checkin: '2026-12-26', checkout: '2027-01-02', guests: 30, value: 57600, status: 'Pendente'   },
];

const HOLIDAYS_2026 = [
  { date: '2026-01-01', name: 'Ano Novo',             season: 'Alta',  tip: 'Período mais cobiçado do ano — preços em pico' },
  { date: '2026-02-14', name: 'Carnaval (Sábado)',    season: 'Alta',  tip: 'Feriado prolongado (4 dias) — lotação garantida' },
  { date: '2026-02-17', name: 'Carnaval (Terça)',     season: 'Alta',  tip: 'Encerramento do feriado — preços máximos' },
  { date: '2026-04-03', name: 'Sexta-Feira Santa',    season: 'Alta',  tip: 'Feriado religioso nacional — alta procura' },
  { date: '2026-04-05', name: 'Páscoa',               season: 'Alta',  tip: 'Semana Santa completa — reservas com antecedência' },
  { date: '2026-04-21', name: 'Tiradentes',           season: 'Média', tip: 'Feriado prolongado (+Páscoa em alguns anos)' },
  { date: '2026-05-01', name: 'Dia do Trabalho',      season: 'Média', tip: 'Feriado em sexta ou segunda = feriado prolongado' },
  { date: '2026-06-04', name: 'Corpus Christi',       season: 'Alta',  tip: 'Semana de alta procura — perto do inverno' },
  { date: '2026-07-01', name: 'Férias de Julho',      season: 'Alta',  tip: 'Mês inteiro de alta temporada escolar' },
  { date: '2026-09-07', name: 'Independência do Brasil', season: 'Média', tip: 'Feriado longo em setembro' },
  { date: '2026-10-12', name: 'N. Sra. Aparecida',   season: 'Média', tip: 'Feriado + proximidade do Dia das Crianças' },
  { date: '2026-11-02', name: 'Finados',              season: 'Baixa', tip: 'Feriado de baixa sazonalidade' },
  { date: '2026-11-15', name: 'Proclamação República',season: 'Baixa', tip: 'Feriado de baixa sazonalidade' },
  { date: '2026-12-25', name: 'Natal',                season: 'Alta',  tip: 'Pico máximo do ano — agendar com 6+ meses' },
  { date: '2026-12-31', name: 'Réveillon 2027',       season: 'Alta',  tip: 'Reservas se esgotam em agosto/setembro' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function nightsBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function totalByMonth() {
  const m: Record<number, number> = {};
  BOOKINGS.filter(b => b.status === 'Confirmado').forEach(b => {
    const month = new Date(b.checkin).getMonth();
    m[month] = (m[month] || 0) + b.value;
  });
  return m;
}

function nightsByProp() {
  const n: Record<string, number> = {};
  BOOKINGS.forEach(b => { n[b.propId] = (n[b.propId] || 0) + nightsBetween(b.checkin, b.checkout); });
  return n;
}

// Retorna dias ocupados por propriedade no mês atual
function occupancyForMonth(propId: string, month: number, year = 2026) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let bookedDays = 0;
  BOOKINGS.forEach(b => {
    if (b.propId !== propId) return;
    const ci = new Date(b.checkin);
    const co = new Date(b.checkout);
    for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) {
      if (d.getMonth() === month && d.getFullYear() === year) bookedDays++;
    }
  });
  return Math.round((bookedDays / daysInMonth) * 100);
}

// ─── COMPONENTES ─────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color = '#0f172a' }: any) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color, lineHeight: 1.1, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BarChart({ data, maxVal, color = '#2563eb' }: { data: { label: string; value: number; highlight?: boolean }[]; maxVal: number; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140 }}>
      {data.map((d, i) => {
        const h = maxVal > 0 ? Math.max(4, Math.round((d.value / maxVal) * 130)) : 4;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {d.value > 0 && <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#475569' }}>
              {d.value >= 1000 ? `R$${(d.value/1000).toFixed(0)}k` : d.value}
            </div>}
            <div style={{ width: '100%', height: h, background: d.highlight ? '#f59e0b' : color, borderRadius: '4px 4px 0 0', transition: 'height 0.5s', position: 'relative' }} />
            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function OccupancyBar({ pct, label }: { pct: number; label: string }) {
  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontSize: '0.82rem', fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div style={{ background: '#f1f5f9', borderRadius: 999, height: 8 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

// ─── TABS ─────────────────────────────────────────────────────────────────────
const DASHBOARD_TABS = [
  { id: 'overview',    label: '📊 Visão Geral' },
  { id: 'imoveis',    label: '🏠 Por Imóvel' },
  { id: 'reservas',   label: '📅 Reservas' },
  { id: 'sazonalidade', label: '🗓️ Sazonalidade' },
] as const;

type Tab = typeof DASHBOARD_TABS[number]['id'];

// ─── DASHBOARD PRINCIPAL ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const confirmed = BOOKINGS.filter(b => b.status === 'Confirmado');
  const totalRevenue = confirmed.reduce((s, b) => s + b.value, 0);
  const totalNights = confirmed.reduce((s, b) => s + nightsBetween(b.checkin, b.checkout), 0);
  const avgTicket = Math.round(totalRevenue / confirmed.length);
  const byMonth = totalByMonth();
  const byPropNights = nightsByProp();
  const maxRevenue = Math.max(...Object.values(byMonth));

  const revenueData = MONTHS.map((label, i) => ({
    label,
    value: byMonth[i] || 0,
    highlight: [5, 6, 11].includes(i), // Jun, Jul, Dez = alta temporada
  }));

  const upcomingHolidays = HOLIDAYS_2026.filter(h => new Date(h.date) > new Date()).slice(0, 5);

  return (
    <div>

      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Dashboard BI</h1>
        <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 4 }}>Inteligência de negócio para gerenciar seu portfólio com eficiência</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: 28, overflowX: 'auto', gap: 0 }}>
        {DASHBOARD_TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
            fontWeight: tab === t.id ? 700 : 500, fontSize: '0.9rem',
            color: tab === t.id ? '#2563eb' : '#64748b',
            borderBottom: tab === t.id ? '2px solid #2563eb' : '2px solid transparent',
            marginBottom: -2, transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── TAB: VISÃO GERAL ── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: 24 }}>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            <KpiCard icon="💰" label="Receita Total (confirmado)" value={`R$ ${(totalRevenue/1000).toFixed(0)}k`} sub="↑ 18% vs. ano anterior" color="#16a34a" />
            <KpiCard icon="🏠" label="Imóveis Ativos" value={PROPERTIES.length} color="#2563eb" />
            <KpiCard icon="📅" label="Reservas Confirmadas" value={confirmed.length} sub={`+ ${BOOKINGS.length - confirmed.length} pendentes`} color="#0f172a" />
            <KpiCard icon="🌙" label="Total de Diárias" value={totalNights} sub="em todas as reservas" color="#7c3aed" />
            <KpiCard icon="💳" label="Ticket Médio" value={`R$ ${(avgTicket/1000).toFixed(1)}k`} sub="por reserva confirmada" color="#ea580c" />
            <KpiCard icon="📲" label="Feriados Restantes" value={upcomingHolidays.length} sub="com alta sazonalidade" color="#0891b2" />
          </div>

          {/* Revenue chart + upcoming holidays */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: 8 }}>📈 Receita por Mês</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 20, display: 'flex', gap: 12 }}>
                <span>🔵 Período normal</span>
                <span>🟡 Alta temporada</span>
              </div>
              <BarChart data={revenueData} maxVal={maxRevenue} />
            </div>

            <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: 16 }}>📅 Próximas Datas Quentes</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {upcomingHolidays.map((h, i) => {
                  const color = h.season === 'Alta' ? '#ef4444' : h.season === 'Média' ? '#f59e0b' : '#10b981';
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ background: '#f8fafc', borderRadius: 8, padding: '5px 8px', fontSize: '0.7rem', fontWeight: 800, color: '#475569', minWidth: 44, textAlign: 'center' }}>
                        {new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{h.name}</div>
                        <div style={{ fontSize: '0.7rem', color }}>{h.season} procura</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Occupancy this month */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>📊 Ocupação por Imóvel — {MONTHS[selectedMonth]}/2026</div>
              <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', color: '#0f172a', fontWeight: 600, fontSize: '0.85rem' }}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            {PROPERTIES.map(p => (
              <OccupancyBar key={p.id} label={p.title.split('|')[0].trim()} pct={occupancyForMonth(p.id, selectedMonth)} />
            ))}
            <div style={{ marginTop: 12, display: 'flex', gap: 12, fontSize: '0.75rem', color: '#94a3b8' }}>
              <span>🟢 ≥70% Ótimo</span><span>🟡 40-69% Regular</span><span>🔴 &lt;40% Baixo</span>
            </div>
          </div>

          {/* Top properties by revenue */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: 16 }}>🏆 Ranking de Imóveis por Receita</div>
            {PROPERTIES.map((p, i) => {
              const propRevenue = BOOKINGS.filter(b => b.propId === p.id && b.status === 'Confirmado').reduce((s, b) => s + b.value, 0);
              const nights = byPropNights[p.id] || 0;
              const pct = totalRevenue > 0 ? Math.round((propRevenue / totalRevenue) * 100) : 0;
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, padding: '12px 14px', background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#d97706' : '#94a3b8', minWidth: 28 }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                  </div>
                  <img src={p.coverImage} alt="" style={{ width: 46, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title.split('|')[0].trim()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{nights} diárias · {pct}% da receita total</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.95rem' }}>R$ {(propRevenue/1000).toFixed(0)}k</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB: POR IMÓVEL ── */}
      {tab === 'imoveis' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {PROPERTIES.map(p => {
            const propBookings = BOOKINGS.filter(b => b.propId === p.id);
            const propRevenue = propBookings.filter(b => b.status === 'Confirmado').reduce((s, b) => s + b.value, 0);
            const propNights = propBookings.reduce((s, b) => s + nightsBetween(b.checkin, b.checkout), 0);
            const occupancy = occupancyForMonth(p.id, selectedMonth);

            return (
              <div key={p.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', minHeight: 120 }}>
                  <img src={p.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{p.title.split('|')[0].trim()}</div>
                        <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 2 }}>📍 {p.city} · {p.maxGuests} hósp. · R$ {p.basePricePerNight.toLocaleString('pt-BR')}/noite</div>
                      </div>
                      <a href={`/admin/properties/${p.id}`} style={{ padding: '6px 14px', borderRadius: 8, background: '#eff6ff', color: '#2563eb', textDecoration: 'none', fontWeight: 700, fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        ⚙️ Gerenciar
                      </a>
                    </div>

                    <div style={{ display: 'flex', gap: 14, marginTop: 14, flexWrap: 'wrap' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Receita</div>
                        <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1rem' }}>R$ {(propRevenue/1000).toFixed(0)}k</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Diárias</div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{propNights}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Reservas</div>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem' }}>{propBookings.length}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Ocupação ({MONTHS[selectedMonth]})</div>
                        <div style={{ fontWeight: 800, color: occupancy >= 70 ? '#10b981' : occupancy >= 40 ? '#f59e0b' : '#ef4444', fontSize: '1rem' }}>{occupancy}%</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <div style={{ background: '#f1f5f9', borderRadius: 999, height: 6 }}>
                        <div style={{ height: '100%', width: `${occupancy}%`, background: occupancy >= 70 ? '#10b981' : occupancy >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 999 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Mês de ocupação:</span>
            <select value={selectedMonth} onChange={e => setSelectedMonth(+e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}/2026</option>)}
            </select>
          </div>
        </div>
      )}

      {/* ── TAB: RESERVAS ── */}
      {tab === 'reservas' && (
        <div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Confirmadas', value: confirmed.length, color: '#10b981', bg: '#f0fdf4' },
              { label: 'Pendentes', value: BOOKINGS.length - confirmed.length, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Total de Reservas', value: BOOKINGS.length, color: '#2563eb', bg: '#eff6ff' },
            ].map((k, i) => (
              <div key={i} style={{ background: k.bg, borderRadius: 12, padding: '14px 20px', border: `1px solid ${k.color}33` }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: k.color, textTransform: 'uppercase' }}>{k.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['IMÓVEL', 'CHECK-IN', 'CHECK-OUT', 'DIÁRIAS', 'HÓSPEDES', 'VALOR', 'STATUS'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...BOOKINGS].sort((a, b) => a.checkin.localeCompare(b.checkin)).map(b => {
                    const nights = nightsBetween(b.checkin, b.checkout);
                    const isConfirmed = b.status === 'Confirmado';
                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem', color: '#0f172a', maxWidth: 180 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.propName}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {new Date(b.checkin).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {new Date(b.checkout).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'center', color: '#0f172a' }}>{nights}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', color: '#0f172a' }}>{b.guests}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#16a34a', whiteSpace: 'nowrap' }}>R$ {b.value.toLocaleString('pt-BR')}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: isConfirmed ? '#f0fdf4' : '#fffbeb', color: isConfirmed ? '#15803d' : '#d97706', padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: SAZONALIDADE ── */}
      {tab === 'sazonalidade' && (
        <div style={{ display: 'grid', gap: 20 }}>

          {/* Legenda */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { season: 'Alta', color: '#ef4444', bg: '#fef2f2', desc: 'Pico máximo — preços em topo' },
              { season: 'Média', color: '#f59e0b', bg: '#fffbeb', desc: 'Boa demanda — ajuste de 30-50%' },
              { season: 'Baixa', color: '#10b981', bg: '#f0fdf4', desc: 'Demanda normal — preços base' },
            ].map(s => (
              <div key={s.season} style={{ background: s.bg, border: `1px solid ${s.color}44`, borderRadius: 10, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: s.color, flexShrink: 0, display: 'inline-block' }} />
                <div>
                  <span style={{ fontWeight: 700, color: s.color, fontSize: '0.85rem' }}>{s.season}</span>
                  <span style={{ color: '#64748b', fontSize: '0.78rem', marginLeft: 6 }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabela de feriados */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>🗓️ Calendário de Sazonalidade 2026</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>Planeje preços e disponibilidade com antecedência</div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['DATA', 'FERIADO / PERÍODO', 'SAZONALIDADE', 'ESTRATÉGIA RECOMENDADA'].map(h => (
                      <th key={h} style={{ padding: '11px 16px', color: '#64748b', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', textAlign: 'left', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HOLIDAYS_2026.map((h, i) => {
                    const isPast = new Date(h.date) < new Date();
                    const color = h.season === 'Alta' ? '#ef4444' : h.season === 'Média' ? '#d97706' : '#16a34a';
                    const bg = h.season === 'Alta' ? '#fef2f2' : h.season === 'Média' ? '#fffbeb' : '#f0fdf4';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', opacity: isPast ? 0.5 : 1 }}>
                        <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
                          {new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          {isPast && <span style={{ marginLeft: 6, fontSize: '0.7rem', color: '#94a3b8' }}>passado</span>}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.88rem', color: '#334155' }}>{h.name}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: bg, color, padding: '4px 12px', borderRadius: 20, fontWeight: 800, fontSize: '0.75rem' }}>
                            {h.season}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#475569' }}>{h.tip}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráfico de meses quentes */}
          <div style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a', marginBottom: 8 }}>🌡️ Temperatura de Demanda por Mês</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 20 }}>Baseado em feriados, férias escolares e histórico de reservas</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { m: 'Jan', heat: 95, label: 'Verão/Réveillon' },
                { m: 'Fev', heat: 85, label: 'Carnaval' },
                { m: 'Mar', heat: 50, label: 'Normal' },
                { m: 'Abr', heat: 65, label: 'Páscoa/Tiradentes' },
                { m: 'Mai', heat: 40, label: 'Normal' },
                { m: 'Jun', heat: 60, label: 'Corpus Christi' },
                { m: 'Jul', heat: 90, label: 'Férias Escolares' },
                { m: 'Ago', heat: 35, label: 'Normal' },
                { m: 'Set', heat: 45, label: 'Ind. Brasil' },
                { m: 'Out', heat: 40, label: 'Normal' },
                { m: 'Nov', heat: 35, label: 'Baixa' },
                { m: 'Dez', heat: 95, label: 'Natal/Réveillon' },
              ].map((item) => {
                const color = item.heat >= 80 ? '#ef4444' : item.heat >= 60 ? '#f59e0b' : item.heat >= 45 ? '#3b82f6' : '#94a3b8';
                return (
                  <div key={item.m} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color, marginBottom: 4 }}>{item.heat}%</div>
                    <div style={{ height: Math.max(6, item.heat * 1.3), background: color, borderRadius: '4px 4px 0 0', transition: 'height 0.5s' }} />
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>{item.m}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, padding: '12px 16px', background: '#fffbeb', borderRadius: 10, fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>
              💡 <strong>Dica:</strong> Atualize os preços em <a href="/admin/pricing" style={{ color: '#d97706' }}>Gestão de Preços</a> antes de janeiro e junho para maximizar receita nas altas temporadas.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
