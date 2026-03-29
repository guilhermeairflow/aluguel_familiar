'use client';

import { PROPERTIES } from '@/lib/properties-data';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { MapPin, ChevronLeft, Shield, CheckCircle, X, ChevronRight } from 'lucide-react';

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ slug: p.slug }));
}

export default function ImovelDetails({ params }: { params: { slug: string } }) {
  const prop = PROPERTIES.find((p) => p.slug === params.slug);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  if (!prop) return notFound();
  const imgs = prop.images;

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={20} /> Voltar
        </a>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
          Aluguel<span style={{ color: '#2563eb' }}>Familiar</span>
        </span>
      </nav>

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>

        {/* ── TÍTULO ── */}
        <div style={{ padding: '24px 0 16px' }}>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 800, color: '#111', lineHeight: 1.3, margin: '0 0 8px 0' }}>
            {prop.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#555', fontSize: '0.9rem' }}>
              <MapPin size={14} color="#2563eb" />
              {prop.city}, {prop.state}
            </div>
          </div>
        </div>

        {/* ── FOTO PRINCIPAL + THUMBNAILS ── */}
        <div style={{ marginBottom: 32 }}>

          {/* Foto principal */}
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', background: '#f1f5f9' }}>
            <img
              src={imgs[lightboxIdx ?? 0]}
              alt={prop.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.25s' }}
              loading="eager"
            />
            {/* Seta esquerda */}
            <button
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i ?? 0) - 1 + imgs.length) % imgs.length); }}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >‹</button>
            {/* Seta direita */}
            <button
              onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i ?? 0) + 1) % imgs.length); }}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >›</button>
            {/* Contador */}
            <div style={{ position: 'absolute', bottom: 14, right: 16, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
              {(lightboxIdx ?? 0) + 1} / {imgs.length}
            </div>
            {/* Botão abrir galeria */}
            <button
              onClick={e => { e.stopPropagation(); setShowAllPhotos(true); }}
              style={{ position: 'absolute', bottom: 14, left: 16, background: 'white', border: '1.5px solid #111', borderRadius: 8, padding: '7px 14px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              ⊞ Ver todas as {imgs.length} fotos
            </button>
          </div>

          {/* Thumbnails clicáveis */}
          <div style={{ display: 'flex', gap: 8, marginTop: 10, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'thin' }}>
            {imgs.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIdx(i)}
                style={{
                  flexShrink: 0, width: 90, height: 66, borderRadius: 10, overflow: 'hidden',
                  cursor: 'pointer', border: `2.5px solid ${(lightboxIdx ?? 0) === i ? '#2563eb' : 'transparent'}`,
                  transition: 'border 0.15s, transform 0.15s', transform: (lightboxIdx ?? 0) === i ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: (lightboxIdx ?? 0) === i ? '0 0 0 2px #2563eb44' : 'none',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* ── LAYOUT 2 COLUNAS: Infos + Widget ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 64, alignItems: 'start', paddingBottom: 80 }}>

          {/* ── COLUNA ESQUERDA ── */}
          <div>
            {/* Stats */}
            <div style={{ paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111', marginBottom: 6 }}>
                Espaço inteiro · Casa em {prop.city}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', color: '#555', fontSize: '0.9rem' }}>
                <span>👥 {prop.maxGuests} hóspedes</span>
                <span style={{ color: '#ccc' }}>·</span>
                <span>🛌 {prop.bedrooms} quartos</span>
                <span style={{ color: '#ccc' }}>·</span>
                <span>🛏️ {prop.beds} camas</span>
                <span style={{ color: '#ccc' }}>·</span>
                <span>🚿 {prop.bathrooms} banheiros</span>
              </div>
            </div>

            {/* Host badge */}
            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Shield size={24} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#111', fontSize: '1rem' }}>Anunciado por AluguelFamiliar</div>
                <div style={{ color: '#666', fontSize: '0.85rem', marginTop: 2 }}>✅ Parceiro verificado · Atendimento via WhatsApp</div>
              </div>
            </div>

            {/* Destaques */}
            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: '🏡', title: 'Espaço inteiro', desc: 'Você terá o imóvel inteiro para seu grupo' },
                { icon: '✨', title: 'Limpeza exemplar', desc: 'Uma piscina de hóspedes recentes deu nota 5 à limpeza' },
                { icon: '🔑', title: 'Check-in self service', desc: 'Faça o check-in no seu horário' },
              ].map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{h.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>{h.title}</div>
                    <div style={{ color: '#666', fontSize: '0.85rem', marginTop: 2 }}>{h.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: '#333', fontSize: '0.95rem', maxHeight: descExpanded ? 'none' : '160px', overflow: 'hidden', position: 'relative' }}>
                {prop.description}
                {!descExpanded && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, white)' }} />}
              </div>
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                style={{ marginTop: 16, background: 'none', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', color: '#111', textDecoration: 'underline', padding: 0 }}
              >
                {descExpanded ? 'Mostrar menos' : 'Mostrar mais ▼'}
              </button>
            </div>

            {/* Features */}
            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 20px 0' }}>O que você vai encontrar</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {prop.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#333', fontSize: '0.92rem' }}>
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0 }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUNA DIREITA: Widget (sticky no desktop) ── */}
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 6px 40px rgba(0,0,0,0.10)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>R$ {prop.basePricePerNight.toLocaleString('pt-BR')}</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/noite</span>
              </div>
              <ReservationWidget prop={prop} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: sticky bottom bar ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', padding: '12px 20px', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>A partir de</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>
            R$ {prop.basePricePerNight.toLocaleString('pt-BR')}
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#666' }}> /noite</span>
          </div>
        </div>
        <button
          onClick={() => setShowWidget(true)}
          style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)', color: 'white', border: 'none', borderRadius: 10, padding: '14px 28px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,56,92,0.35)' }}
        >
          Reservar
        </button>
      </div>

      {/* ── MODAL RESERVA mobile ── */}
      {showWidget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowWidget(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', maxHeight: '90vh', overflowY: 'auto', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Solicitar Reserva</span>
              <button onClick={() => setShowWidget(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><X size={22} /></button>
            </div>
            <ReservationWidget prop={prop} />
          </div>
        </div>
      )}

      {/* ── LIGHTBOX ── */}
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={() => setLightboxIdx(null)} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
          <button onClick={() => setLightboxIdx(i => ((i ?? 0) - 1 + imgs.length) % imgs.length)} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <img src={imgs[lightboxIdx]} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={() => setLightboxIdx(i => ((i ?? 0) + 1) % imgs.length)} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <div style={{ position: 'absolute', bottom: 16, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{lightboxIdx + 1} / {imgs.length}</div>
        </div>
      )}

      {/* ── MODAL TODAS AS FOTOS ── */}
      {showAllPhotos && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 900, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <button onClick={() => setShowAllPhotos(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', marginBottom: 24, color: '#111' }}>
              <ChevronLeft size={20} /> Fechar galeria
            </button>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 20 }}>Fotos de {prop.city}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {imgs.map((img, i) => (
                <div key={i} onClick={() => { setLightboxIdx(i); setShowAllPhotos(false); }} style={{ aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', cursor: 'pointer' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── WIDGET DE RESERVA ─────────────────────────────────────────────────────────
function ReservationWidget({ prop }: { prop: any }) {
  const [adults, setAdults] = useState(2);
  const [minors, setMinors] = useState(0);
  const [minorAges, setMinorAges] = useState<string[]>([]);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  const nights = checkin && checkout
    ? Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
    : 0;
  const total = nights > 0 ? prop.basePricePerNight * nights + prop.cleaningFee : 0;

  const handleMinors = (diff: number) => {
    const n = minors + diff;
    if (n < 0) return;
    setMinors(n);
    setMinorAges(prev => diff > 0 ? [...prev, ''] : prev.slice(0, n));
  };

  const waLink = () => {
    const fmt = (d: string) => d ? d.split('-').reverse().join('/') : '';
    const dates = checkin && checkout ? `%0A📅 *Período:* ${fmt(checkin)} a ${fmt(checkout)} (${nights} noite${nights !== 1 ? 's' : ''})` : '';
    const agesStr = minorAges.filter(Boolean).length ? ` (Idades: ${minorAges.join(', ')})` : '';
    const guestsStr = `%0A👥 *Hóspedes:* ${adults} adulto(s)${minors > 0 ? `, ${minors} criança(s)${agesStr}` : ''}`;
    return `https://wa.me/5511945747572?text=Olá! Tenho interesse no imóvel *${encodeURIComponent(prop.title)}* em *${prop.city}*.${dates}${guestsStr}%0A%0APoderia me informar disponibilidade e valor?`;
  };

  const counterBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: '50%', border: '1px solid #bbb', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div>
      {/* Datas */}
      <div style={{ border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '12px 14px', borderRight: '1px solid #ccc' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', marginBottom: 4 }}>Check-in</div>
            <input type="date" value={checkin} min={new Date().toISOString().split('T')[0]} onChange={e => { setCheckin(e.target.value); if (checkout && e.target.value >= checkout) setCheckout(''); }} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#222', background: 'transparent', cursor: 'pointer' }} />
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#111', textTransform: 'uppercase', marginBottom: 4 }}>Check-out</div>
            <input type="date" value={checkout} min={checkin || new Date().toISOString().split('T')[0]} onChange={e => setCheckout(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#222', background: 'transparent', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      {/* Hóspedes */}
      <div style={{ border: '1px solid #ccc', borderRadius: 10, padding: '0 16px', marginBottom: 16 }}>
        {[
          { label: 'Adultos', sub: '13 anos ou mais', val: adults, set: (v: number) => setAdults(Math.max(1, v)) },
          { label: 'Crianças', sub: 'Até 12 anos', val: minors, set: (v: number) => handleMinors(v - minors) },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i === 0 ? '1px solid #f1f5f9' : 'none' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>{row.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#666' }}>{row.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button style={counterBtn} onClick={() => row.set(row.val - 1)}>−</button>
              <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{row.val}</span>
              <button style={counterBtn} onClick={() => row.set(row.val + 1)}>+</button>
            </div>
          </div>
        ))}
        {minors > 0 && (
          <div style={{ paddingBottom: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600, margin: '0 0 8px 0' }}>Idade de cada criança:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 6 }}>
              {minorAges.map((age, i) => (
                <select key={i} value={age} onChange={e => setMinorAges(prev => prev.map((a, idx) => idx === i ? e.target.value : a))} style={{ padding: '7px 8px', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.82rem', color: '#111', background: 'white' }}>
                  <option value="" disabled>Idade...</option>
                  <option value="0">Menos de 1</option>
                  {[...Array(12)].map((_, n) => <option key={n+1} value={`${n+1}`}>{n+1} {n+1 === 1 ? 'ano' : 'anos'}</option>)}
                </select>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resumo de preço */}
      {nights > 0 && (
        <div style={{ marginBottom: 16, padding: '14px 0', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333', marginBottom: 8 }}>
            <span>R$ {prop.basePricePerNight.toLocaleString('pt-BR')} × {nights} noite{nights !== 1 ? 's' : ''}</span>
            <span>R$ {(prop.basePricePerNight * nights).toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#333', marginBottom: 12 }}>
            <span>Taxa de limpeza</span>
            <span>R$ {prop.cleaningFee.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: '#111', borderTop: '1px solid #e2e8f0', paddingTop: 12 }}>
            <span>Total</span>
            <span>R$ {total.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}

      {/* CTA WhatsApp */}
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: 'white', textAlign: 'center', padding: '16px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', boxShadow: '0 6px 16px rgba(37,211,102,0.35)', boxSizing: 'border-box' }}
      >
        📱 Confirmar pelo WhatsApp
      </a>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: 10 }}>
        Você não será cobrado ainda. Nossa equipe confirma a disponibilidade.
      </p>
    </div>
  );
}
