'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES as STATIC_PROPERTIES } from '@/lib/properties-data';
import { loadAllProperties, loadAllPricing } from '@/lib/data-persistence';

// â”€â”€â”€ TIPOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type Booking = {
  id: number;
  propId: string;
  guest: string;
  phone: string;
  email: string;
  checkin: string;
  checkout: string;
  guests: number;
  value: number;
  cleaningFee: number;
  status: 'Confirmado' | 'Pendente' | 'Cancelado';
  notes: string;
  createdAt: string;
};

// â”€â”€â”€ DADOS INICIAIS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INITIAL_BOOKINGS: Booking[] = [
  { id: 1,  propId: '1', guest: 'Ana Souza',      phone: '11988887777', email: '', checkin: '2026-01-03', checkout: '2026-01-10', guests: 25, value: 25400, cleaningFee: 500, status: 'Confirmado', notes: '', createdAt: '2025-11-10' },
  { id: 2,  propId: '7', guest: 'Carlos M.',       phone: '11977778888', email: '', checkin: '2026-01-15', checkout: '2026-01-20', guests: 16, value: 29700, cleaningFee: 700, status: 'Confirmado', notes: '', createdAt: '2025-11-15' },
  { id: 3,  propId: '2', guest: 'PatrÃ­cia Lima',   phone: '11966665555', email: '', checkin: '2026-02-01', checkout: '2026-02-08', guests: 35, value: 32100, cleaningFee: 600, status: 'Confirmado', notes: '', createdAt: '2025-12-01' },
  { id: 4,  propId: '3', guest: 'Fernando Silva',  phone: '11955556666', email: '', checkin: '2026-02-13', checkout: '2026-02-17', guests: 40, value: 20200, cleaningFee: 800, status: 'Confirmado', notes: '', createdAt: '2025-12-05' },
  { id: 5,  propId: '6', guest: 'Mariana Costa',   phone: '11944445555', email: '', checkin: '2026-02-13', checkout: '2026-02-17', guests: 12, value: 12600, cleaningFee: 450, status: 'Confirmado', notes: '', createdAt: '2025-12-06' },
  { id: 6,  propId: '1', guest: 'Ricardo N.',      phone: '11933334444', email: '', checkin: '2026-03-01', checkout: '2026-03-07', guests: 20, value: 19800, cleaningFee: 500, status: 'Confirmado', notes: '', createdAt: '2026-01-10' },
  { id: 7,  propId: '4', guest: 'Juliana M.',      phone: '11922223333', email: '', checkin: '2026-03-15', checkout: '2026-03-20', guests: 10, value:  9400, cleaningFee: 400, status: 'Confirmado', notes: '', createdAt: '2026-01-20' },
  { id: 8,  propId: '5', guest: 'Paulo Rocha',     phone: '11911112222', email: '', checkin: '2026-04-03', checkout: '2026-04-07', guests: 8,  value:  5300, cleaningFee: 350, status: 'Pendente',   notes: '', createdAt: '2026-02-01' },
  { id: 9,  propId: '7', guest: 'Beatriz A.',      phone: '11900001111', email: '', checkin: '2026-04-21', checkout: '2026-04-25', guests: 18, value: 24200, cleaningFee: 700, status: 'Confirmado', notes: '', createdAt: '2026-02-10' },
  { id: 10, propId: '2', guest: 'Grupo Estrela',   phone: '11988990000', email: '', checkin: '2026-06-28', checkout: '2026-07-05', guests: 38, value: 35000, cleaningFee: 600, status: 'Pendente',   notes: '', createdAt: '2026-03-01' },
  { id: 11, propId: '1', guest: 'FamÃ­lia Torres',  phone: '11977661111', email: '', checkin: '2026-07-04', checkout: '2026-07-12', guests: 28, value: 40000, cleaningFee: 500, status: 'Confirmado', notes: '', createdAt: '2026-03-05' },
  { id: 12, propId: '3', guest: 'Empresa X',       phone: '11966552222', email: '', checkin: '2026-07-04', checkout: '2026-07-11', guests: 35, value: 38000, cleaningFee: 800, status: 'Pendente',   notes: '', createdAt: '2026-03-06' },
  { id: 13, propId: '6', guest: 'Lucas Pinto',     phone: '11955443333', email: '', checkin: '2026-07-04', checkout: '2026-07-08', guests: 12, value: 13000, cleaningFee: 450, status: 'Confirmado', notes: '', createdAt: '2026-03-07' },
  { id: 14, propId: '7', guest: 'RÃ©veillon Group', phone: '11944334444', email: '', checkin: '2026-12-26', checkout: '2027-01-02', guests: 18, value: 46200, cleaningFee: 700, status: 'Pendente',   notes: '', createdAt: '2026-03-10' },
  { id: 15, propId: '1', guest: 'FamÃ­lia Alves',   phone: '11933225555', email: '', checkin: '2026-12-26', checkout: '2027-01-02', guests: 30, value: 57600, cleaningFee: 500, status: 'Pendente',   notes: '', createdAt: '2026-03-12' },
];

function loadBookings(): Booking[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const s = localStorage.getItem('af_bookings');
    if (s) return JSON.parse(s);
  } catch {}
  return INITIAL_BOOKINGS;
}
function saveBookings(b: Booking[]) {
  try { localStorage.setItem('af_bookings', JSON.stringify(b)); } catch {}
}

// â”€â”€â”€ CONSTANTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROP_COLORS: Record<string, string> = {
  '1': '#2563eb', '2': '#16a34a', '3': '#ea580c',
  '4': '#9333ea', '5': '#0891b2', '6': '#db2777', '7': '#d97706',
};
const MONTHS_FULL = ['Janeiro','Fevereiro','MarÃ§o','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','SÃ¡b'];

// â”€â”€â”€ HELPERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function nightsCount(ci: string, co: string) {
  if (!ci || !co) return 0;
  return Math.max(0, Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000));
}
function isInBooking(date: Date, ci: string, co: string) {
  return date.getTime() >= new Date(ci).getTime() && date.getTime() < new Date(co).getTime();
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtDate(s: string) {
  if (!s) return 'â€”';
  return new Date(s).toLocaleDateString('pt-BR');
}

// â”€â”€â”€ WORKFLOW STEPS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type NewBooking = {
  propId: string; guest: string; phone: string; email: string;
  checkin: string; checkout: string; guests: number;
  children: number; childrenAges: number[];
  dailyRate: number; cleaningFee: number; status: 'Confirmado' | 'Pendente'; notes: string;
};
const EMPTY_NEW: NewBooking = {
  propId: '', guest: '', phone: '', email: '',
  checkin: '', checkout: '', guests: 2,
  children: 0, childrenAges: [],
  dailyRate: 0, cleaningFee: 0, status: 'Pendente', notes: '',
};

function WorkflowModal({ properties, onClose, onSave }: { properties: any[]; onClose: () => void; onSave: (b: NewBooking) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<NewBooking>(EMPTY_NEW);
  const set = (field: keyof NewBooking, val: any) => setForm(prev => ({ ...prev, [field]: val }));

  const selectedProp = properties.find(p => p.id === form.propId);
  const nights = nightsCount(form.checkin, form.checkout);
  const total = form.dailyRate * nights + form.cleaningFee;

  const canNext = () => {
    if (step === 1) return !!form.propId;
    if (step === 2) return !!form.guest && !!form.phone && form.guests >= 1;
    if (step === 3) return !!form.checkin && !!form.checkout && nights > 0;
    if (step === 4) return form.dailyRate > 0;
    return true;
  };

  const inputCls: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0',
    fontSize: '0.92rem', color: '#0f172a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
  };

  const steps = ['ImÃ³vel', 'HÃ³spede', 'Datas', 'Financeiro', 'ConfirmaÃ§Ã£o'];

  // Auto-preenche preÃ§o base ao selecionar imÃ³vel
  useEffect(() => {
    if (form.propId) {
      const p = properties.find(p => p.id === form.propId);
      if (p) set('dailyRate', p.basePricePerNight), set('cleaningFee', p.cleaningFee);
    }
  }, [form.propId, properties]);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ padding: '22px 28px 0', borderBottom: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#0f172a' }}>Nova LocaÃ§Ã£o</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 2 }}>Passo {step} de {steps.length}</div>
            </div>
            <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>âœ•</button>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', paddingBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2px solid ${i + 1 <= step ? '#2563eb' : '#e2e8f0'}`, background: i + 1 < step ? '#2563eb' : i + 1 === step ? '#eff6ff' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 800, color: i + 1 < step ? 'white' : i + 1 === step ? '#2563eb' : '#cbd5e1', transition: 'all 0.2s' }}>
                    {i + 1 < step ? 'âœ“' : i + 1}
                  </div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 600, color: i + 1 === step ? '#2563eb' : '#94a3b8', display: 'none' }}>{s}</div>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', display: 'none' }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ height: 3, background: '#f1f5f9', borderRadius: 999, margin: '0 -28px', marginBottom: 0 }}>
            <div style={{ height: '100%', width: `${((step - 1) / (steps.length - 1)) * 100}%`, background: '#2563eb', borderRadius: 999, transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* STEP 1: Escolher imÃ³vel */}
          {step === 1 && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>ðŸ  Selecione o ImÃ³vel</div>
              <div style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 16 }}>Qual propriedade serÃ¡ locada?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {properties.map(p => {
                  const color = PROP_COLORS[p.id] || '#64748b';
                  const isSelected = form.propId === p.id;
                  return (
                    <button key={p.id} onClick={() => set('propId', p.id)} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 14px', borderRadius: 12, border: `2px solid ${isSelected ? color : '#e2e8f0'}`, background: isSelected ? `${color}10` : 'white', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                      <img src={p.coverImage} alt="" style={{ width: 56, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: isSelected ? color : '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title.split('|')[0].trim()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>ðŸ“ {p.city} Â· ðŸ‘¥ atÃ© {p.maxGuests} hÃ³sp. Â· ðŸ’° R$ {p.basePricePerNight.toLocaleString('pt-BR')}/noite</div>
                      </div>
                      {isSelected && <span style={{ color, fontSize: '1.2rem' }}>âœ“</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Dados do hÃ³spede */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>ðŸ‘¤ Dados do HÃ³spede</div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Nome Completo *</label>
                <input style={inputCls} placeholder="Ex: JoÃ£o da Silva" value={form.guest} onChange={e => set('guest', e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>WhatsApp *</label>
                <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                  <span style={{ padding: '10px 12px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e2e8f0', fontSize: '0.85rem' }}>ðŸ‡§ðŸ‡· +55</span>
                  <input style={{ ...inputCls, border: 'none', borderRadius: 0, flex: 1 }} placeholder="11 98888-7777" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} type="tel" maxLength={11} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>E-mail (opcional)</label>
                <input style={inputCls} placeholder="email@exemplo.com" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              {/* Adultos */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Adultos *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => set('guests', Math.max(1, form.guests - 1))} style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>âˆ’</button>
                  <input type="number" min={1} max={selectedProp?.maxGuests || 50} style={{ ...inputCls, width: 70, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }} value={form.guests} onChange={e => set('guests', parseInt(e.target.value) || 1)} />
                  <button onClick={() => set('guests', Math.min(selectedProp?.maxGuests || 50, form.guests + 1))} style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>+</button>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>mÃ¡x. {selectedProp?.maxGuests}</span>
                </div>
              </div>

              {/* CrianÃ§as */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 14 }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>CrianÃ§as (0-17 anos)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: form.children > 0 ? 14 : 0 }}>
                  <button
                    onClick={() => {
                      const n = Math.max(0, form.children - 1);
                      set('children', n);
                      set('childrenAges', form.childrenAges.slice(0, n));
                    }}
                    style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>âˆ’</button>
                  <div style={{ width: 70, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem', padding: '10px 0', border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', color: '#0f172a' }}>{form.children}</div>
                  <button
                    onClick={() => {
                      const n = form.children + 1;
                      set('children', n);
                      set('childrenAges', [...form.childrenAges, 0]);
                    }}
                    style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#475569' }}>+</button>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>crianÃ§a{form.children !== 1 ? 's' : ''}</span>
                </div>

                {/* Idades dinÃ¢micas */}
                {form.children > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
                    {form.childrenAges.map((age, i) => (
                      <div key={i}>
                        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 4 }}>CrianÃ§a {i + 1} â€” Idade</label>
                        <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                          <input
                            type="number" min={0} max={17}
                            value={age}
                            onChange={e => {
                              const ages = [...form.childrenAges];
                              ages[i] = parseInt(e.target.value) ?? 0;
                              set('childrenAges', ages);
                            }}
                            style={{ ...inputCls, border: 'none', borderRadius: 0, textAlign: 'center', fontWeight: 800, color: '#7c3aed', flex: 1 }}
                          />
                          <span style={{ padding: '10px 8px', background: '#f8fafc', color: '#94a3b8', fontSize: '0.75rem', borderLeft: '1px solid #e2e8f0' }}>anos</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {form.children > 0 && (
                  <div style={{ marginTop: 10, padding: '8px 12px', background: '#faf5ff', borderRadius: 8, border: '1px solid #e9d5ff', fontSize: '0.76rem', color: '#7c3aed', fontWeight: 600 }}>
                    ðŸ‘¶ {form.children} crianÃ§a{form.children !== 1 ? 's' : ''} Â· Idades: {form.childrenAges.map(a => `${a} ano${a !== 1 ? 's' : ''}`).join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Datas */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>ðŸ“… PerÃ­odo da LocaÃ§Ã£o</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Check-in *</label>
                  <input type="date" style={inputCls} value={form.checkin} min={new Date().toISOString().split('T')[0]} onChange={e => { set('checkin', e.target.value); if (form.checkout && e.target.value >= form.checkout) set('checkout', ''); }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Check-out *</label>
                  <input type="date" style={inputCls} value={form.checkout} min={form.checkin || new Date().toISOString().split('T')[0]} onChange={e => set('checkout', e.target.value)} />
                </div>
              </div>

              {nights > 0 && (
                <div style={{ background: '#eff6ff', borderRadius: 12, padding: '14px 18px', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e40af' }}>
                      {fmtDate(form.checkin)} â†’ {fmtDate(form.checkout)}
                    </div>
                    <div style={{ fontSize: '1.8rem' }}>ðŸ“…</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>ðŸŒ™ Pernoites</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', lineHeight: 1.1, marginTop: 4 }}>{nights}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>noite{nights !== 1 ? 's' : ''}</div>
                    </div>
                    <div style={{ background: 'white', borderRadius: 10, padding: '12px 14px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>â˜€ï¸ Dias de Uso</div>
                      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7c3aed', lineHeight: 1.1, marginTop: 4 }}>{nights + 1}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>dia{(nights + 1) !== 1 ? 's' : ''} (inc. chegada)</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Status da Reserva</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {(['Confirmado', 'Pendente'] as const).map(s => (
                    <button key={s} onClick={() => set('status', s)} style={{ flex: 1, padding: '10px', borderRadius: 8, border: `2px solid ${form.status === s ? (s === 'Confirmado' ? '#10b981' : '#f59e0b') : '#e2e8f0'}`, background: form.status === s ? (s === 'Confirmado' ? '#f0fdf4' : '#fffbeb') : 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', color: form.status === s ? (s === 'Confirmado' ? '#15803d' : '#d97706') : '#94a3b8', transition: 'all 0.15s' }}>
                      {s === 'Confirmado' ? 'âœ…' : 'â³'} {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Financeiro */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 4 }}>ðŸ’° Valores e Pagamento</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>DiÃ¡ria (R$) *</label>
                  <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <span style={{ padding: '10px 12px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e2e8f0', fontSize: '0.85rem' }}>R$</span>
                    <input type="number" style={{ ...inputCls, border: 'none', borderRadius: 0, flex: 1 }} value={form.dailyRate} min={0} step={50} onChange={e => set('dailyRate', parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 4 }}>Base: R$ {selectedProp?.basePricePerNight.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>Taxa de Limpeza (R$)</label>
                  <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                    <span style={{ padding: '10px 12px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e2e8f0', fontSize: '0.85rem' }}>R$</span>
                    <input type="number" style={{ ...inputCls, border: 'none', borderRadius: 0, flex: 1 }} value={form.cleaningFee} min={0} step={50} onChange={e => set('cleaningFee', parseInt(e.target.value) || 0)} />
                  </div>
                </div>
              </div>

              {/* Resumo financeiro */}
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '16px 18px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: 12, borderBottom: '1px solid #e2e8f0', paddingBottom: 10 }}>ðŸ“‹ Resumo Financeiro</div>
                {[
                  { label: `${nights} noite${nights !== 1 ? 's' : ''} Ã— R$ ${form.dailyRate.toLocaleString('pt-BR')}`, value: form.dailyRate * nights },
                  { label: 'Taxa de limpeza', value: form.cleaningFee },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem' }}>
                    <span style={{ color: '#475569' }}>{r.label}</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>R$ {r.value.toLocaleString('pt-BR')}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2px solid #e2e8f0' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>TOTAL</span>
                  <span style={{ fontWeight: 900, color: '#16a34a', fontSize: '1.2rem' }}>R$ {total.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>ObservaÃ§Ãµes / AnotaÃ§Ãµes</label>
                <textarea
                  style={{ ...inputCls, resize: 'vertical', lineHeight: 1.6 }}
                  rows={3}
                  placeholder="Pedidos especiais, sinal pago, contato adicional..."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 5: ConfirmaÃ§Ã£o */}
          {step === 5 && (
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: 16 }}>âœ… RevisÃ£o Final</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                {/* Propriedade */}
                <div style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    <img src={selectedProp?.coverImage} alt="" style={{ width: 80, height: 64, objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ padding: '10px 14px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{selectedProp?.city}, {selectedProp?.state}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>{selectedProp?.maxGuests} hÃ³sp. mÃ¡x.</div>
                    </div>
                  </div>
                </div>

                {[
                  { label: 'ðŸ‘¤ ResponsÃ¡vel', value: form.guest },
                  { label: 'ðŸ“± WhatsApp', value: `+55 ${form.phone}` },
                  { label: 'ðŸ§‘ Adultos', value: `${form.guests} pessoa${form.guests !== 1 ? 's' : ''}` },
                  { label: 'ðŸ‘¶ CrianÃ§as', value: form.children === 0 ? 'Nenhuma' : `${form.children} crianÃ§a${form.children !== 1 ? 's' : ''} Â· Idades: ${form.childrenAges.map(a => `${a}a`).join(', ')}` },
                  { label: 'ðŸ“… Check-in', value: fmtDate(form.checkin) },
                  { label: 'ðŸ“… Check-out', value: fmtDate(form.checkout) },
                  { label: 'ðŸŒ™ Pernoites', value: `${nights} noite${nights !== 1 ? 's' : ''}` },
                  { label: 'â˜€ï¸ Dias de Uso', value: `${nights + 1} dia${(nights + 1) !== 1 ? 's' : ''} (inclui dia de chegada)` },
                  { label: 'ðŸ’° Total', value: `R$ ${total.toLocaleString('pt-BR')}` },
                  { label: 'ðŸ“Œ Status', value: form.status },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>{r.label}</span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', textAlign: 'right', maxWidth: 240 }}>{r.value}</span>
                  </div>
                ))}

                {form.notes && (
                  <div style={{ background: '#fffbeb', borderRadius: 8, padding: '10px 14px', border: '1px solid #fde68a', fontSize: '0.82rem', color: '#92400e' }}>
                    ðŸ“ {form.notes}
                  </div>
                )}

                {/* WhatsApp preview */}
                <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '14px', border: '1px solid #bbf7d0', marginTop: 4 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', marginBottom: 8 }}>ðŸ“± Mensagem WhatsApp (gerada automaticamente ao salvar)</div>
                  <div style={{ fontSize: '0.78rem', color: '#166534', lineHeight: 1.6, background: 'white', borderRadius: 8, padding: '10px 12px', border: '1px solid #d1fae5' }}>
                    OlÃ¡ {form.guest.split(' ')[0]}! ðŸ˜Š Reserva confirmada em *{selectedProp?.city}* de *{fmtDate(form.checkin)}* a *{fmtDate(form.checkout)}* ({nights} noites, {form.guests} adulto{form.guests !== 1 ? 's' : ''}{form.children > 0 ? ` e ${form.children} crianÃ§a${form.children !== 1 ? 's' : ''}` : ''}). Valor total: *R$ {total.toLocaleString('pt-BR')}*. Qualquer dÃºvida estamos Ã  disposiÃ§Ã£o! â€” AluguelFamiliar.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NavegaÃ§Ã£o */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              {step === 1 ? 'Cancelar' : 'â† Voltar'}
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: canNext() ? '#0f172a' : '#cbd5e1', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: canNext() ? 'pointer' : 'not-allowed' }}
              >
                PrÃ³ximo â†’
              </button>
            ) : (
              <button
                onClick={() => onSave(form)}
                style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#10b981', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                âœ… Confirmar LocaÃ§Ã£o
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ PÃGINA PRINCIPAL DO CALENDÃRIO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function CalendarPage() {
  const today = new Date();
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [properties, setProperties] = useState(STATIC_PROPERTIES);
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(today.getMonth());
  const [selectedPropId, setSelectedPropId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showNewBooking, setShowNewBooking] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => { 
    setBookings(loadBookings()); 
    setProperties(loadAllProperties());
  }, []);

  const filtered = selectedPropId === 'all' ? bookings : bookings.filter(b => b.propId === selectedPropId);

  const monthBookings = filtered.filter(b => {
    const s = new Date(b.checkin), e = new Date(b.checkout);
    return s <= new Date(year, month + 1, 0) && e > new Date(year, month, 1);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calDays: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function bookingsOnDay(day: number) {
    const date = new Date(year, month, day);
    return filtered.filter(b => isInBooking(date, b.checkin, b.checkout));
  }

  function prevMonth() { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }
  function nextMonth() { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }

  function handleDayClick(day: number) {
    setSelectedDate(new Date(year, month, day));
    setShowDayModal(true);
  }

  const selectedBookings = selectedDate ? filtered.filter(b => isInBooking(selectedDate, b.checkin, b.checkout)) : [];

  function handleSaveBooking(form: NewBooking) {
    const newB: Booking = {
      id: Date.now(),
      propId: form.propId,
      guest: form.guest,
      phone: form.phone,
      email: form.email,
      checkin: form.checkin,
      checkout: form.checkout,
      guests: form.guests,
      value: form.dailyRate * nightsCount(form.checkin, form.checkout),
      cleaningFee: form.cleaningFee,
      status: form.status,
      notes: form.notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...bookings, newB];
    setBookings(updated);
    saveBookings(updated);
    setShowNewBooking(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
    // Ir para o mÃªs do check-in
    const ci = new Date(form.checkin);
    setMonth(ci.getMonth());
    setYear(ci.getFullYear());
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20 }}>

      {/* Toast */}
      {savedToast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#10b981', color: 'white', padding: '12px 20px', borderRadius: 12, fontWeight: 700, zIndex: 2000, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'none' }}>
          âœ… LocaÃ§Ã£o cadastrada com sucesso!
        </div>
      )}

      {/* â”€â”€ SIDEBAR â”€â”€ */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* BotÃ£o Nova LocaÃ§Ã£o */}
        <button
          onClick={() => setShowNewBooking(true)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 12px', borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginBottom: 8, transition: 'background 0.2s' }}
        >
          + Nova LocaÃ§Ã£o
        </button>

        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 6px', marginBottom: 2 }}>Filtrar ImÃ³vel</div>

        <button onClick={() => setSelectedPropId('all')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, border: `2px solid ${selectedPropId === 'all' ? '#0f172a' : 'transparent'}`, background: selectedPropId === 'all' ? '#0f172a' : '#f8fafc', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ fontSize: '1.1rem' }}>ðŸ </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem', color: selectedPropId === 'all' ? 'white' : '#0f172a' }}>Todos</div>
            <div style={{ fontSize: '0.65rem', color: selectedPropId === 'all' ? 'rgba(255,255,255,0.6)' : '#94a3b8' }}>{bookings.length} reservas</div>
          </div>
        </button>

        <div style={{ height: 1, background: '#e2e8f0', margin: '2px 0' }} />

        {properties.map(p => {
          const color = PROP_COLORS[p.id] || '#64748b';
          const isSelected = selectedPropId === p.id;
          const count = bookings.filter(b => b.propId === p.id).length;
          return (
            <button key={p.id} onClick={() => setSelectedPropId(p.id)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 10, border: `2px solid ${isSelected ? color : 'transparent'}`, background: isSelected ? `${color}12` : '#f8fafc', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: isSelected ? 700 : 600, fontSize: '0.78rem', color: isSelected ? color : '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.city}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>{count} reserva{count !== 1 ? 's' : ''}</div>
              </div>
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
          {[{ label: 'Confirmado', color: '#10b981' }, { label: 'Pendente', color: '#f59e0b' }, { label: 'Hoje', color: '#2563eb' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* â”€â”€ CALENDÃRIO â”€â”€ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>{MONTHS_FULL[month]} {year}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{monthBookings.length} reserva{monthBookings.length !== 1 ? 's' : ''} neste mÃªs</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setYear(2026); setMonth(today.getMonth()); }} style={{ padding: '7px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Hoje</button>
            <button onClick={prevMonth} style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>â€¹</button>
            <button onClick={nextMonth} style={{ width: 34, height: 34, borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>â€º</button>
          </div>
        </div>

        {/* Grade */}
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {WEEKDAYS.map(d => <div key={d} style={{ padding: '10px 4px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calDays.map((day, idx) => {
              if (!day) return <div key={`e-${idx}`} style={{ minHeight: 76, borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: '#fafafa' }} />;
              const date = new Date(year, month, day);
              const isToday = sameDay(date, today);
              const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const dayBkgs = bookingsOnDay(day);
              return (
                <div key={day} onClick={() => handleDayClick(day)} style={{ minHeight: 76, padding: '5px 6px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', background: isPast ? '#fafafa' : 'white', cursor: dayBkgs.length > 0 ? 'pointer' : 'default' }}
                  onMouseEnter={e => { if (dayBkgs.length > 0) (e.currentTarget as HTMLDivElement).style.background = '#f0f9ff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isPast ? '#fafafa' : 'white'; }}>
                  <div style={{ display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.78rem', fontWeight: isToday ? 800 : 400, background: isToday ? '#2563eb' : 'transparent', color: isToday ? 'white' : isPast ? '#cbd5e1' : '#0f172a' }}>{day}</div>
                  <div style={{ marginTop: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {dayBkgs.slice(0, 2).map(b => {
                      const color = b.status === 'Confirmado' ? (PROP_COLORS[b.propId] || '#2563eb') : '#f59e0b';
                      const isStart = sameDay(date, new Date(b.checkin));
                      const isEnd = sameDay(date, new Date(b.checkout));
                      const firstName = b.guest.split(' ')[0];
                      return (
                        <div key={b.id} style={{ background: `${color}22`, borderLeft: `2.5px solid ${color}`, borderRadius: '0 3px 3px 0', padding: '2px 4px', fontSize: '0.6rem', fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
                          {isStart && <span style={{ fontSize: '0.55rem' }}>â†˜</span>}
                          {isEnd && <span style={{ fontSize: '0.55rem' }}>â†—</span>}
                          <span>{firstName}</span>
                          <span style={{ opacity: 0.7, fontSize: '0.55rem' }}>Â· {b.guests}ðŸ‘¥</span>
                        </div>
                      );
                    })}
                    {dayBkgs.length > 2 && <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700 }}>+{dayBkgs.length - 2}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista do mÃªs */}
        {monthBookings.length > 0 && (
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '16px 20px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', marginBottom: 12 }}>ðŸ“‹ Reservas em {MONTHS_FULL[month]}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {monthBookings.sort((a, b) => a.checkin.localeCompare(b.checkin)).map(b => {
                const color = PROP_COLORS[b.propId] || '#64748b';
                const prop = properties.find(p => p.id === b.propId);
                const nights = nightsCount(b.checkin, b.checkout);
                return (
                  <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, borderLeft: `4px solid ${color}`, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 52, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>IN</div>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{new Date(b.checkin).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                    </div>
                    <div style={{ color: '#cbd5e1' }}>â†’</div>
                    <div style={{ minWidth: 52, textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8' }}>OUT</div>
                      <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f172a' }}>{new Date(b.checkout).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 100 }}>
                      <div style={{ fontWeight: 700, color, fontSize: '0.82rem' }}>{prop?.city}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{b.guest} Â· {b.guests} hÃ³sp. Â· {nights}n</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.85rem' }}>R$ {b.value.toLocaleString('pt-BR')}</div>
                      <span style={{ background: b.status === 'Confirmado' ? '#f0fdf4' : '#fffbeb', color: b.status === 'Confirmado' ? '#15803d' : '#d97706', padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700 }}>{b.status}</span>
                    </div>
                    <a href={`https://wa.me/55${b.phone}?text=OlÃ¡ ${b.guest.split(' ')[0]}! Aqui Ã© da equipe AluguelFamiliar.`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: 'white', padding: '5px 10px', borderRadius: 7, textDecoration: 'none', fontWeight: 700, fontSize: '0.72rem' }}>
                      WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Detalhes do dia */}
      {showDayModal && selectedDate && (
        <div onClick={() => setShowDayModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 16, padding: 26, width: '100%', maxWidth: 460, maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>{selectedBookings.length > 0 ? `${selectedBookings.length} reserva(s) ativa(s)` : 'Nenhuma reserva'}</div>
              </div>
              <button onClick={() => setShowDayModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>âœ•</button>
            </div>
            {selectedBookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0', color: '#94a3b8' }}>
                <div style={{ fontSize: '2.5rem' }}>ðŸ“­</div>
                <div style={{ fontWeight: 600, marginTop: 8 }}>Dia disponÃ­vel</div>
                <button onClick={() => { setShowDayModal(false); setShowNewBooking(true); }} style={{ marginTop: 14, background: '#0f172a', color: 'white', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>+ Cadastrar LocaÃ§Ã£o</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedBookings.map(b => {
                  const color = PROP_COLORS[b.propId] || '#64748b';
                  const prop = properties.find(p => p.id === b.propId);
                  const nights = nightsCount(b.checkin, b.checkout);
                  const isCheckin = sameDay(selectedDate!, new Date(b.checkin));
                  const isCheckout = sameDay(selectedDate!, new Date(b.checkout));
                  const totalPeople = b.guests + ((b as any).children || 0);
                  return (
                    <div key={b.id} style={{ borderRadius: 14, border: `2px solid ${color}33`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

                      {/* Header imÃ³vel */}
                      <div style={{ background: `${color}18`, borderBottom: `1px solid ${color}22` }}>
                        <div style={{ display: 'flex', gap: 0 }}>
                          {prop?.coverImage && <img src={prop.coverImage} alt="" style={{ width: 72, height: 56, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />}
                          <div style={{ padding: '10px 14px', flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontWeight: 800, color, fontSize: '0.88rem' }}>{prop?.city}, {prop?.state}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 1 }}>{prop?.title.split('|')[0].trim()}</div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                                {isCheckin && <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>âœˆï¸ CHECK-IN</span>}
                                {isCheckout && <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>ðŸ  CHECK-OUT</span>}
                                {!isCheckin && !isCheckout && <span style={{ background: color, color: 'white', padding: '2px 8px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700 }}>Em Hospedagem</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grid de dados */}
                      <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { icon: 'ðŸ‘¤', label: 'HÃ³spede Resp.', value: b.guest },
                          { icon: 'ðŸ“±', label: 'WhatsApp', value: `+55 ${b.phone}` },
                          { icon: 'ðŸ“…', label: 'Check-in', value: fmtDate(b.checkin) },
                          { icon: 'ðŸ“…', label: 'Check-out', value: fmtDate(b.checkout) },
                          { icon: 'ðŸŒ™', label: 'Pernoites', value: `${nights} noite${nights !== 1 ? 's' : ''}` },
                          { icon: 'â˜€ï¸', label: 'Dias de Uso', value: `${nights + 1} dia${(nights + 1) !== 1 ? 's' : ''}` },
                          { icon: 'ðŸ§‘', label: 'Adultos', value: `${b.guests} pessoa${b.guests !== 1 ? 's' : ''}` },
                          { icon: 'ðŸ‘¶', label: 'CrianÃ§as', value: (b as any).children > 0 ? `${(b as any).children} Â· ${((b as any).childrenAges || []).map((a: number) => `${a}a`).join(', ')}` : 'Nenhuma' },
                          { icon: 'ðŸ‘¥', label: 'Total Pessoas', value: `${totalPeople} no total` },
                          { icon: 'ðŸ’°', label: 'Valor Total', value: `R$ ${b.value.toLocaleString('pt-BR')}` },
                        ].map((row, i) => (
                          <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 10px' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 3 }}>{row.icon} {row.label}</div>
                            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: row.label === 'Valor Total' ? '#16a34a' : '#0f172a', wordBreak: 'break-word' }}>{row.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Status + obs */}
                      <div style={{ padding: '0 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <div style={{ flex: 1, textAlign: 'center', background: b.status === 'Confirmado' ? '#f0fdf4' : '#fffbeb', color: b.status === 'Confirmado' ? '#15803d' : '#d97706', padding: '8px', borderRadius: 8, fontWeight: 700, fontSize: '0.82rem', border: `1px solid ${b.status === 'Confirmado' ? '#bbf7d0' : '#fde68a'}` }}>
                            {b.status === 'Confirmado' ? 'âœ…' : 'â³'} {b.status}
                          </div>
                          <a href={`https://wa.me/55${b.phone}?text=OlÃ¡ ${b.guest.split(' ')[0]}! Aqui Ã© a equipe AluguelFamiliar. Sua reserva em *${prop?.city}* de *${fmtDate(b.checkin)}* a *${fmtDate(b.checkout)}* estÃ¡ confirmada! Qualquer dÃºvida estamos Ã  disposiÃ§Ã£o. ðŸ˜Š`} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', background: '#25D366', color: 'white', padding: '8px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                            ðŸ“± WhatsApp
                          </a>
                        </div>
                        {(b as any).notes && (
                          <div style={{ background: '#fffbeb', borderRadius: 8, padding: '8px 12px', border: '1px solid #fde68a', fontSize: '0.78rem', color: '#92400e' }}>
                            ðŸ“ {(b as any).notes}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Nova LocaÃ§Ã£o */}
      {showNewBooking && <WorkflowModal properties={properties} onClose={() => setShowNewBooking(false)} onSave={handleSaveBooking} />}
    </div>
  );
}

