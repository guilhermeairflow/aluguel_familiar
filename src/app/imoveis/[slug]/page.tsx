'use client';

import { PROPERTIES } from '@/lib/properties-data';
import { notFound } from 'next/navigation';
import { useState } from 'react';
import { MapPin, Users, Bed, Bath, CheckCircle, ChevronLeft, Shield, X } from 'lucide-react';

export default function ImovelDetails({ params }: { params: { slug: string } }) {
  const prop = PROPERTIES.find((p) => p.slug === params.slug);
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  if (!prop) return notFound();
  const total = prop.images.length;

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>

      {/* ── STICKY TOP NAV ── */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={20} /> Voltar
        </a>
        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>Aluguel<span style={{ color: '#2563eb' }}>Familiar</span></span>
      </nav>

      {/* ── PHOTO HERO (full-width swipeable, Airbnb-style) ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#f1f5f9' }}>
        <img
          src={prop.images[activeImage]}
          alt={prop.title}
          loading="eager"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s' }}
        />
        {/* Left arrow */}
        <button
          onClick={() => setActiveImage(i => (i - 1 + total) % total)}
          aria-label="Foto anterior"
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '1.1rem', fontWeight: 'bold', color: '#222' }}
        >‹</button>
        {/* Right arrow */}
        <button
          onClick={() => setActiveImage(i => (i + 1) % total)}
          aria-label="Próxima foto"
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', fontSize: '1.1rem', fontWeight: 'bold', color: '#222' }}
        >›</button>
        {/* Counter badge */}
        <div style={{ position: 'absolute', bottom: 12, right: 14, background: 'rgba(0,0,0,0.55)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
          {activeImage + 1} / {total}
        </div>
        {/* Dot thumbnails — desktop only via CSS */}
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {prop.images.slice(0, Math.min(total, 7)).map((_, i) => (
            <button key={i} onClick={() => setActiveImage(i)} aria-label={`Foto ${i+1}`} style={{ width: activeImage === i ? 20 : 7, height: 7, borderRadius: 3.5, border: 'none', background: activeImage === i ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, transition: 'all 0.25s' }} />
          ))}
        </div>
      </div>

      {/* ── THUMBNAIL STRIP (desktop galleries) ── */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {prop.images.slice(0, 10).map((img, i) => (
          <div key={i} onClick={() => setActiveImage(i)} style={{ flexShrink: 0, width: 80, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: activeImage === i ? '2px solid #2563eb' : '2px solid transparent', transition: 'border 0.2s' }}>
            <img src={img} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ padding: '0 16px 120px', maxWidth: 960, margin: '0 auto' }}>

        {/* Title + location */}
        <div style={{ paddingTop: 20, paddingBottom: 16, borderBottom: '1px solid #e2e8f0' }}>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 700, color: '#111', lineHeight: 1.3, margin: '0 0 8px 0' }}>{prop.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#555', fontSize: '0.9rem' }}>
            <MapPin size={14} color="#2563eb" />
            {prop.city}, {prop.state}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 6, flexWrap: 'wrap', color: '#444', fontSize: '0.9rem' }}>
          <span>👥 {prop.maxGuests} hóspedes</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span>🛌 {prop.bedrooms} quartos</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span>🛏️ {prop.beds} camas</span>
          <span style={{ color: '#ccc' }}>·</span>
          <span>🚿 {prop.bathrooms} banheiros</span>
        </div>

        {/* Host badge */}
        <div style={{ paddingTop: 16, paddingBottom: 16, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={22} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>Anunciado por AluguelFamiliar</div>
            <div style={{ color: '#666', fontSize: '0.82rem' }}>✅ Parceiro verificado · Atendimento via WhatsApp</div>
          </div>
        </div>

        {/* Description */}
        <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
          <div style={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.75,
            color: '#333',
            fontSize: '0.95rem',
            maxHeight: descExpanded ? 'none' : '160px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {prop.description}
            {!descExpanded && (
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, white)' }} />
            )}
          </div>
          <button
            onClick={() => setDescExpanded(!descExpanded)}
            style={{ marginTop: 16, background: 'none', border: '1px solid #222', borderRadius: 8, padding: '10px 20px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', color: '#111', width: '100%' }}
          >
            {descExpanded ? 'Mostrar menos ▲' : 'Mostrar mais ▼'}
          </button>
        </div>

        {/* Features — "O que você vai encontrar" */}
        <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111', margin: '0 0 16px 0' }}>O que você vai encontrar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {prop.features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#333', fontSize: '0.9rem', fontWeight: 500 }}>
                <CheckCircle size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price block (desktop only — on mobile is sticky bar) */}
        <div style={{ paddingTop: 20, display: 'none' }} id="desktop-widget">
          <ReservationWidget prop={prop} inline />
        </div>

      </div>

      {/* ── STICKY BOTTOM BAR (Airbnb-style mobile) ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid #e2e8f0',
        padding: '12px 20px', zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#666', fontWeight: 500 }}>A partir de</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>
            R$ {prop.basePricePerNight.toLocaleString('pt-BR')}
            <span style={{ fontSize: '0.8rem', fontWeight: 400, color: '#666' }}> /noite</span>
          </div>
        </div>
        <button
          onClick={() => setShowWidget(true)}
          style={{
            background: 'linear-gradient(135deg, #FF385C, #E31C5F)',
            color: 'white', border: 'none', borderRadius: 10,
            padding: '14px 28px', fontWeight: 700, fontSize: '1rem',
            cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,56,92,0.35)',
          }}
        >
          Reservar
        </button>
      </div>

      {/* ── MODAL DE RESERVA (aparece ao clicar em Reservar) ── */}
      {showWidget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowWidget(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', maxHeight: '90vh', overflowY: 'auto', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#111' }}>Solicitar Reserva</span>
              <button onClick={() => setShowWidget(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444', padding: 4 }}>
                <X size={22} />
              </button>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: 20 }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>R$ {prop.basePricePerNight.toLocaleString('pt-BR')}</span> /noite · Taxa de limpeza: R$ {prop.cleaningFee.toLocaleString('pt-BR')}
            </div>
            <ReservationWidget prop={prop} inline={false} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationWidget({ prop, inline }: { prop: any; inline: boolean }) {
  const [adults, setAdults] = useState(2);
  const [minors, setMinors] = useState(0);
  const [minorAges, setMinorAges] = useState<string[]>([]);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  const handleMinors = (diff: number) => {
    const n = minors + diff;
    if (n < 0) return;
    setMinors(n);
    setMinorAges(prev => diff > 0 ? [...prev, ''] : prev.slice(0, n));
  };

  const updateAge = (i: number, age: string) => {
    setMinorAges(prev => prev.map((a, idx) => idx === i ? age : a));
  };

  const waLink = () => {
    const fmt = (d: string) => d ? d.split('-').reverse().join('/') : '';
    const dates = checkin && checkout ? `%0A📅 *Período:* ${fmt(checkin)} a ${fmt(checkout)}` : '';
    const agesStr = minorAges.filter(Boolean).length ? ` (Idades: ${minorAges.join(', ')})` : '';
    const guestsStr = `%0A👥 *Hóspedes:* ${adults} adulto(s)${minors > 0 ? `, ${minors} criança(s)${agesStr}` : ''}`;
    return `https://wa.me/5511945747572?text=Olá! Tenho interesse no imóvel *${encodeURIComponent(prop.title)}* em *${prop.city}*.${dates}${guestsStr}%0A%0APoderia me informar disponibilidade e valor?`;
  };

  const rowStyle: React.CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 0', borderBottom: '1px solid #f1f5f9',
  };

  const counterBtn: React.CSSProperties = {
    width: 34, height: 34, borderRadius: '50%', border: '1px solid #bbb',
    background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
    color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  return (
    <div>
      {/* Dates */}
      <div style={{ border: '1px solid #ccc', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ padding: '12px 14px', borderRight: '1px solid #ccc' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: 4 }}>Check-in</div>
            <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#222', background: 'transparent' }} />
          </div>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#111', textTransform: 'uppercase', marginBottom: 4 }}>Check-out</div>
            <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#222', background: 'transparent' }} />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div style={{ border: '1px solid #ccc', borderRadius: 12, padding: '0 16px', marginBottom: 20 }}>
        {/* Adults */}
        <div style={rowStyle}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>Adultos</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>13 anos ou mais</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={counterBtn} onClick={() => setAdults(Math.max(1, adults - 1))}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{adults}</span>
            <button style={counterBtn} onClick={() => setAdults(adults + 1)}>+</button>
          </div>
        </div>

        {/* Children */}
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#111' }}>Crianças / Bebês</div>
            <div style={{ fontSize: '0.8rem', color: '#666' }}>Até 12 anos</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button style={counterBtn} onClick={() => handleMinors(-1)}>−</button>
            <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{minors}</span>
            <button style={counterBtn} onClick={() => handleMinors(1)}>+</button>
          </div>
        </div>

        {/* Ages inputs */}
        {minors > 0 && (
          <div style={{ padding: '12px 0 16px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '0.82rem', color: '#555', fontWeight: 600, margin: '0 0 10px 0' }}>Idade de cada criança no check-in:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
              {minorAges.map((age, i) => (
                <div key={i}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#999', display: 'block', marginBottom: 3 }}>Criança {i + 1}</label>
                  <select value={age} onChange={e => updateAge(i, e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #ccc', fontSize: '0.88rem', color: '#111', background: 'white', cursor: 'pointer' }}>
                    <option value="" disabled>Idade...</option>
                    <option value="Menos de 1 ano">Menos de 1 ano</option>
                    {[...Array(12)].map((_, n) => <option key={n + 1} value={`${n + 1} anos`}>{n + 1} {n + 1 === 1 ? 'ano' : 'anos'}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waLink()}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'block', width: '100%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          color: 'white', textAlign: 'center', padding: '16px',
          borderRadius: 12, fontWeight: 700, textDecoration: 'none',
          fontSize: '1.05rem', boxShadow: '0 6px 16px rgba(37,211,102,0.35)',
        }}
      >
        📱 Confirmar pelo WhatsApp
      </a>
      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#aaa', marginTop: 10 }}>
        Você não será cobrado ainda. Nossa equipe vai confirmar disponibilidade.
      </p>
    </div>
  );
}
