'use client';

import { useState } from 'react';
import { MapPin, ChevronLeft, Shield, CheckCircle, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Helper WhatsApp Link
function generateWaLink(prop: any, checkin: string, checkout: string, guests: string, adults: number, kids: number, total: number) {
  let msg = `Olá! Tenho interesse na casa: *${prop.title}*.\n\n`;
  if (checkin && checkout) msg += `📅 Datas: ${checkin} a ${checkout}\n`;
  if (guests) msg += `👥 Hóspedes: ${guests} (Adultos: ${adults}, Crianças: ${kids})\n`;
  if (total > 0) msg += `💰 Valor estimado: R$ ${total.toLocaleString('pt-BR')}\n`;
  msg += `\nGostaria de verificar a disponibilidade e fechar a reserva.`;
  return `https://wa.me/5567996293176?text=${encodeURIComponent(msg)}`;
}

export default function PropertyClient({ prop }: { prop: any }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number>(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);

  // Widget States
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);

  const imgs = prop.images || [];

  // Calcular total (simplificado para o MVP)
  let total = 0;
  if (checkin && checkout) {
    const start = new Date(checkin);
    const end = new Date(checkout);
    const nNights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
    total = (prop.basePricePerNight * nNights) + prop.cleaningFee;
  }

  // --- WIDGET DE RESERVA ---
  const ReservationWidget = () => (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, paddingBottom: 28, border: '1px solid #e2e8f0', boxShadow: '0 12px 28px rgba(0,0,0,0.12)', position: 'sticky', top: 120 }}>
      {/* Preço base */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 16px 0', color: '#111' }}>
        R$ {prop.basePricePerNight.toLocaleString('pt-BR')} <span style={{ fontSize: '1rem', fontWeight: 400, color: '#64748b' }}>/noite</span>
      </h2>

      {/* Inputs Datas */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #cbd5e1' }}>
          <div style={{ flex: 1, padding: 12, borderRight: '1px solid #cbd5e1' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#111', marginBottom: 4 }}>Check-in</label>
            <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#111' }} />
          </div>
          <div style={{ flex: 1, padding: 12 }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#111', marginBottom: 4 }}>Checkout</label>
            <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#111' }} />
          </div>
        </div>
        {/* Hóspedes */}
        <div style={{ padding: 12 }}>
          <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#111', marginBottom: 6 }}>Hóspedes</label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 500 }}>Adultos</span>
              <input type="number" min="1" value={adults} onChange={e => setAdults(parseInt(e.target.value)||1)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', color: '#111', fontWeight: 500 }}>Crianças</span>
              <input type="number" min="0" value={kids} onChange={e => setKids(parseInt(e.target.value)||0)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Botão Reservar */}
      <a
        href={generateWaLink(prop, checkin, checkout, `${adults+kids} hóspedes`, adults, kids, total)}
        target="_blank" rel="noreferrer"
        style={{ display: 'block', background: '#e11d48', color: '#fff', textAlign: 'center', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', marginBottom: 12, transition: 'background 0.2s' }}
        onMouseOver={e => e.currentTarget.style.background = '#be123c'}
        onMouseOut={e => e.currentTarget.style.background = '#e11d48'}
      >
        Reservar
      </a>
      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Você não será cobrado ainda</p>

      {/* Resumo Valores */}
      {total > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#475569', fontSize: '0.95rem' }}>
            <span>Diárias</span>
            <span>R$ {(total - prop.cleaningFee).toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, color: '#475569', fontSize: '0.95rem' }}>
            <span>Taxa de limpeza</span>
            <span>R$ {prop.cleaningFee.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111', fontSize: '1.1rem', paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
            <span>Total</span>
            <span>R$ {total.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* HEADER MINIMALISTA */}
      <header style={{ borderBottom: '1px solid #e2e8f0', background: 'white', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontWeight: 500 }}>
            <ChevronLeft size={20} />
            Módulos
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 1120, margin: '0 auto', padding: '24px', minHeight: '100vh', paddingBottom: 100 }}>
        
        {/* TÍTULO E LOCAL */}
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 700, color: '#0f172a', marginBottom: 10, lineHeight: 1.1 }}>
          {prop.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontWeight: 500, marginBottom: 24, fontSize: '0.95rem' }}>
          <MapPin size={16} />
          {prop.city}, {prop.state}
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
            {imgs.map((img: string, i: number) => (
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start' }}>
          
          {/* COLUNA ESQUERDA (INFOS) */}
          <div style={{ flex: '1 1 500px' }}>
            {/* Highlights Airbnb style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 32, borderBottom: '1px solid #e2e8f0', marginBottom: 32 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <Shield size={26} color="#475569" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 4px', color: '#111' }}>Espaço de alto padrão</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.4 }}>Selecionadas cuidadosamente para a melhor experiência familiar.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <CheckCircle size={26} color="#475569" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 4px', color: '#111' }}>Assistência 24h</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.4 }}>Suporte completo desde a reserva até o checkout.</p>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <div style={{ paddingBottom: 32, borderBottom: '1px solid #e2e8f0', marginBottom: 32 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 600, margin: '0 0 16px', color: '#111' }}>Sobre este espaço</h2>
              <div 
                style={{
                  fontSize: '1rem', color: '#334155', lineHeight: 1.6,
                  maxHeight: descExpanded ? 'none' : 100, overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {prop.description.split('\n').map((line: string, i: number) => (
                  <p key={i} style={{ margin: '0 0 10px 0' }}>{line}</p>
                ))}
                {!descExpanded && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: 'linear-gradient(transparent, white)' }} />
                )}
              </div>
              <button 
                onClick={() => setDescExpanded(!descExpanded)}
                style={{ background: 'none', border: 'none', color: '#111', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0, marginTop: 8, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {descExpanded ? 'Mostrar menos' : 'Mostrar mais'} {descExpanded ? '▲' : '▼'}
              </button>
            </div>

            {/* Comodidades (Features) */}
            <div style={{ paddingBottom: 32 }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 600, margin: '0 0 20px', color: '#111' }}>O que você vai encontrar</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {prop.features.map((feat: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '1rem', color: '#334155' }}>
                    <CheckCircle size={20} color="#64748b" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA (WIDGET DE RESERVA - DESKTOP) */}
          <div style={{ width: 340, display: 'none' }} className="desktop-reserva">
            <ReservationWidget />
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @media (min-width: 900px) {
              .desktop-reserva { display: block !important; }
            }
          `}} />
        </div>
      </main>

      {/* FOOTER WIDGET (MOBILE) */}
      <div 
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white',
          borderTop: '1px solid #e2e8f0', padding: '16px 24px', zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.05)'
        }}
        className="mobile-reserva"
      >
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111' }}>
            R$ {prop.basePricePerNight.toLocaleString('pt-BR')} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>/noite</span>
          </div>
          <button 
            onClick={() => setShowWidget(true)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#0f172a', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600, marginTop: 2 }}
          >
            Ver datas
          </button>
        </div>
        <button 
          onClick={() => setShowWidget(true)}
          style={{ background: '#e11d48', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, fontSize: '1rem' }}
        >
          Reservar
        </button>

        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 900px) {
            .mobile-reserva { display: none !important; }
          }
        `}} />
      </div>

      {/* MODAL RESERVA MOBILE */}
      {showWidget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 500, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setShowWidget(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', padding: 8, cursor: 'pointer' }}>
              <X size={24} color="#111" />
            </button>
            <div style={{ marginTop: 24 }}>
              <ReservationWidget />
            </div>
          </div>
        </div>
      )}

      {/* GALERIA FULLSCREEN LIGHTBOX */}
      {showAllPhotos && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
            <button
              onClick={() => setShowAllPhotos(false)}
              style={{ background: 'none', border: 'none', borderRadius: '50%', padding: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} color="#111" />
            </button>
            <div style={{ fontWeight: 600, fontSize: '1rem' }}>
              {imgs.length} fotos
            </div>
            <div style={{ width: 40 }}></div>
          </div>

          {/* Imagens (Grid scrolável) */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gap: 16, gridTemplateColumns: 'minmax(0, 1fr)' }}>
              {imgs.map((img: string, i: number) => (
                <div key={i}>
                  <img
                    src={img}
                    alt=""
                    style={{ width: '100%', borderRadius: 12, objectFit: 'contain', background: '#f8fafc', maxHeight: '80vh' }}
                    loading={i < 3 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
