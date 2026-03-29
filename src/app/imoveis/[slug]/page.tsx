'use client';

import { PROPERTIES } from '@/lib/properties-data';
import { loadReviews, getReviewsBySlug, getAverageRating, type Review } from '@/lib/reviews-data';
import { notFound } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronLeft, Shield, CheckCircle, X, ChevronRight, Star } from 'lucide-react';

export default function ImovelDetails({ params }: { params: { slug: string } }) {
  const prop = PROPERTIES.find((p) => p.slug === params.slug);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);   // foto ativa no carrossel da página
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null); // null = fechado
  const [descExpanded, setDescExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);

  useEffect(() => {
    if (!prop) return;
    const all = loadReviews();
    setReviews(getReviewsBySlug(all, prop.slug));
  }, [prop?.slug]);

  useEffect(() => {
    if (isReviewsHovered || reviews.length <= 1) return;
    const interval = setInterval(() => {
      if (reviewScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = reviewScrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          reviewScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          reviewScrollRef.current.scrollBy({ left: 336, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isReviewsHovered, reviews.length]);

  if (!prop) return notFound();
  const imgs = prop.images;
  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>

      {/* ── Responsive Styles ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .desktop-widget { display: block; }
        .mobile-bottom-bar { display: none; }
        .photo-hero { height: 420px; border-radius: 16px; }
        .page-container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
        .content-grid { display: grid; grid-template-columns: minmax(0,1fr) 380px; gap: 64px; align-items: start; padding-bottom: 80px; margin-top: 12px; }
        .thumbnails-row { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
        .review-carousel::-webkit-scrollbar { display: none; }
        .page-title { font-size: clamp(1.3rem, 3vw, 1.8rem); font-weight: 800; color: #111; line-height: 1.3; margin: 0 0 8px 0; padding: 24px 0 0 0; }
        .page-subtitle { display: flex; align-items: center; gap: 4px; color: #555; font-size: 0.9rem; margin-bottom: 4px; }
        .photo-section { margin-bottom: 16px; }
        .content-left { padding: 0; }
        @media (max-width: 768px) {
          .desktop-widget { display: none !important; }
          .mobile-bottom-bar { display: flex !important; }
          .photo-hero { height: 260px; border-radius: 0; }
          .page-container { padding: 0; max-width: 100vw; }
          .content-grid { grid-template-columns: minmax(0, 1fr) !important; gap: 0; padding: 0 0 100px 0; margin-top: 0; }
          .thumbnails-row { padding: 6px 20px 8px 20px; scrollbar-width: none; }
          .thumbnails-row::-webkit-scrollbar { display: none; }
          .page-title { font-size: 1.35rem; padding: 20px 20px 0 20px; }
          .page-subtitle { padding: 6px 20px 0 20px; margin-bottom: 0; }
          .review-row { padding: 0 20px !important; }
          .photo-section { margin-bottom: 0; }
          .content-left { padding: 0 20px; min-width: 0; overflow: hidden; }
          .features-grid { grid-template-columns: 1fr !important; }
          .reviews-title { font-size: 1.25rem !important; }
        }
      `}} />

      {/* ── NAV ── */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={20} /> Voltar
        </a>
        <a href="/" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', textDecoration: 'none' }}>
          Aluguel<span style={{ color: '#2563eb' }}>Familiar</span>
        </a>
      </nav>

      <div className="page-container">

        {/* ── FOTO HERO (mobile: full-width, desktop: rounded) ── */}
        <div className="photo-section">
          <div
            className="photo-hero"
            style={{ position: 'relative', overflow: 'hidden', background: '#f1f5f9', cursor: 'pointer', width: '100%' }}
            onClick={() => setLightboxIdx(carouselIdx)}
          >
            <img
              src={imgs[carouselIdx]}
              alt={prop.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="eager"
            />
            {/* Seta esquerda */}
            <button
              onClick={e => { e.stopPropagation(); setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); }}
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >‹</button>
            {/* Seta direita */}
            <button
              onClick={e => { e.stopPropagation(); setCarouselIdx(i => (i + 1) % imgs.length); }}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >›</button>
            {/* Contador */}
            <div style={{ position: 'absolute', bottom: 14, right: 16, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>
              {carouselIdx + 1} / {imgs.length}
            </div>
            {/* Ícone de lupa — indica que clica para ampliar */}
            <div style={{ position: 'absolute', top: 14, left: 16, background: 'rgba(0,0,0,0.45)', color: 'white', padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
              🔍 Clique para ampliar
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
          <div className="thumbnails-row">
            {imgs.slice(0, 12).map((img, i) => (
              <div
                key={i}
                onClick={() => setCarouselIdx(i)}
                style={{
                  flexShrink: 0, width: 80, height: 60, borderRadius: 8, overflow: 'hidden',
                  cursor: 'pointer', border: `2.5px solid ${carouselIdx === i ? '#2563eb' : 'transparent'}`,
                  transition: 'border 0.15s', boxShadow: carouselIdx === i ? '0 0 0 2px #2563eb33' : 'none',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* TÍTULO */}
        <h1 className="page-title">{prop.title}</h1>
        <div className="page-subtitle">
          <MapPin size={14} color="#2563eb" />
          {prop.city}, {prop.state}
        </div>

        {/* ── REVIEW SUMMARY ROW (abaixo da cidade, clicável) ── */}
        {reviews.length > 0 && (
          <div
            className="review-row"
            onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 14px 0', cursor: 'pointer', flexWrap: 'wrap' }}
          >
            {/* Nota */}
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111', whiteSpace: 'nowrap' }}>{getAverageRating(reviews).toFixed(2)}</span>
            {/* Estrelas */}
            <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={13} fill={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : 'none'} color={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : '#d1d5db'} />
              ))}
            </div>
            {/* Badge preferido */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8f4ff', border: '1px solid #e9d5ff', borderRadius: 20, padding: '3px 10px', flexShrink: 0 }}>
              <span style={{ fontSize: '0.75rem' }}>🏆</span>
              <span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#6d28d9', whiteSpace: 'nowrap' }}>Preferido dos hóspedes</span>
            </div>
            {/* Quantidade */}
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2563eb', textDecoration: 'underline', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {reviews.length} avalia{reviews.length !== 1 ? 'ções' : 'ção'}
            </span>
          </div>
        )}

        {/* LAYOUT GRID RESPONSIVO */}
        <div className="content-grid">

          {/* ── COLUNA ESQUERDA ── */}
          <div className="content-left">

            {/* Stats */}
            <div style={{ paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111', marginBottom: 8 }}>
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
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {prop.features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#333', fontSize: '0.92rem' }}>
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ wordBreak: 'break-word', lineHeight: 1.4 }}>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MAPA DE LOCALIZAÇÃO ── */}
            <div style={{ paddingTop: 32, paddingBottom: 32, borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 16px 0' }}>Onde você vai estar</h2>
              <div style={{ color: '#555', fontSize: '0.95rem', marginBottom: 20 }}>
                {prop.city}, {prop.state}, Brasil
                <div style={{ fontSize: '0.85rem', marginTop: 4 }}>A localização exata é fornecida após a confirmação da reserva.</div>
              </div>
              <div style={{ width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', background: '#e2e8f0' }}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent((prop as any).mapLocation || (prop.city + ', ' + prop.state + ', Brasil'))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
            </div>

            {/* ── AVALIAÇÕES ── */}
            {reviews.length > 0 && (
              <div id="reviews" style={{ paddingTop: 32, paddingBottom: 32 }}>
                {/* Cabeçalho com nota média */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', borderRadius: 16, padding: '16px 24px', minWidth: 90, flexShrink: 0 }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>{getAverageRating(reviews).toFixed(1)}</span>
                    <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} fill={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : 'none'} color={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : '#ffffff55'} />
                      ))}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 className="reviews-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 4px 0', wordBreak: 'break-word', lineHeight: 1.25 }}>
                      Avaliações dos hóspedes
                    </h2>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', wordBreak: 'break-word' }}>
                      {reviews.length} avalia{reviews.length !== 1 ? 'ções' : 'ção'} · Nota {getAverageRating(reviews).toFixed(1)}/5 ⭐
                    </p>
                  </div>
                </div>

                {/* Carrossel de Reviews */}
                <div
                  onMouseEnter={() => setIsReviewsHovered(true)}
                  onMouseLeave={() => setIsReviewsHovered(false)}
                  onTouchStart={() => setIsReviewsHovered(true)}
                  onTouchEnd={() => setTimeout(() => setIsReviewsHovered(false), 300)}
                  style={{ width: '100%', overflow: 'hidden', position: 'relative' }}
                >
                  {/* Setas de navegação — acima do carrossel, sem sobrepor cards */}
                  {reviews.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
                      <button
                        onClick={() => {
                          const el = reviewScrollRef.current;
                          if (!el) return;
                          const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 320;
                          el.scrollBy({ left: -cardW, behavior: 'smooth' });
                        }}
                        aria-label="Avaliação anterior"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flexShrink: 0 }}
                      >
                        <ChevronLeft size={18} color="#0f172a" />
                      </button>
                      <button
                        onClick={() => {
                          const el = reviewScrollRef.current;
                          if (!el) return;
                          const cardW = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 320;
                          el.scrollBy({ left: cardW, behavior: 'smooth' });
                        }}
                        aria-label="Próxima avaliação"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: 'white', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flexShrink: 0 }}
                      >
                        <ChevronRight size={18} color="#0f172a" />
                      </button>
                    </div>
                  )}

                  {/* Cards — largura 100% para mostrar um por vez */}
                  <style dangerouslySetInnerHTML={{ __html: `.review-carousel::-webkit-scrollbar { display: none; }` }} />
                  <div
                    ref={reviewScrollRef}
                    className="review-carousel"
                    style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: 4 }}
                  >
                    {reviews.map(r => (
                      <div
                        key={r.id}
                        style={{
                          background: '#f8fafc',
                          borderRadius: 16,
                          padding: '22px',
                          border: '1px solid #e2e8f0',
                          flex: '0 0 100%',
                          minWidth: '100%',
                          maxWidth: '100%',
                          scrollSnapAlign: 'start',
                          display: 'flex',
                          flexDirection: 'column',
                          boxSizing: 'border-box'
                        }}
                      >
                        {/* Estrelas */}
                        <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={16} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#d1d5db'} />
                          ))}
                        </div>
                        {/* Comentário */}
                        <p style={{ margin: '0 0 18px 0', color: '#334155', fontSize: '0.95rem', lineHeight: 1.65, fontStyle: 'italic', flex: 1, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          &ldquo;{r.comment}&rdquo;
                        </p>
                        {/* Hóspede */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1.05rem', flexShrink: 0 }}>
                            {r.guest.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#111', fontSize: '0.9rem' }}>{r.guest}</div>
                            <div style={{ color: '#94a3b8', fontSize: '0.82rem', marginTop: 2 }}>{r.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* ── COLUNA DIREITA: Widget (só desktop) ── */}
          <div className="desktop-widget" style={{ position: 'sticky', top: 80 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>R$ {prop.basePricePerNight.toLocaleString('pt-BR')}</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/noite</span>
              </div>
              <ReservationWidget prop={prop} />
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: barra inferior fixa ── */}
      <div className="mobile-bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', padding: '12px 20px', zIndex: 200, alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)' }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: '#888' }}>A partir de</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>
            R$ {prop.basePricePerNight.toLocaleString('pt-BR')}
            <span style={{ fontSize: '0.78rem', fontWeight: 400, color: '#666' }}> /noite</span>
          </div>
        </div>
        <button
          onClick={() => setShowWidget(true)}
          style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)', color: 'white', border: 'none', borderRadius: 50, padding: '14px 32px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,56,92,0.35)' }}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(null); }} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i ?? 0) - 1 + imgs.length) % imgs.length); }} style={{ position: 'absolute', left: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <img src={imgs[lightboxIdx]} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }} />
          <button onClick={e => { e.stopPropagation(); setLightboxIdx(i => ((i ?? 0) + 1) % imgs.length); }} style={{ position: 'absolute', right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 44, height: 44, cursor: 'pointer', color: 'white', fontSize: '1.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
          <div style={{ position: 'absolute', bottom: 16, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{(lightboxIdx ?? 0) + 1} / {imgs.length}</div>
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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [adults, setAdults] = useState(2);
  const [minors, setMinors] = useState(0);
  const [minorAges, setMinorAges] = useState<string[]>([]);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    return `https://wa.me/5511945747572?text=Olá! Me chamo ${firstName}. Tenho interesse no imóvel *${encodeURIComponent(prop.title)}* em *${prop.city}*.${dates}${guestsStr}%0A%0APoderia me informar disponibilidade e valor?`;
  };

  const handleBooking = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert('Por favor, preencha seu nome, sobrenome e e-mail antes de consultar.');
      return;
    }
    if (minors > 0 && minorAges.some(a => !a)) {
      alert('Por favor, informe a idade de todas as crianças.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 1. Send silent notification mail
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          propertyTitle: prop.title,
          checkin, checkout, adults, minors, minorAges
        })
      });
      // 2. Open WA
      window.open(waLink(), '_blank');
    } catch(e) {
      console.error(e);
      window.open(waLink(), '_blank'); // fallback to WA anyway
    } finally {
      setIsSubmitting(false);
    }
  };

  const counterBtn: React.CSSProperties = { width: 32, height: 32, borderRadius: '50%', border: '1px solid #bbb', background: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' };

  return (
    <div>
      {/* Dados do Cliente */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', marginBottom: 12 }}>Seus Dados</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <input type="text" placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc', outline: 'none', fontSize: '0.9rem' }} />
          <input type="text" placeholder="Sobrenome" value={lastName} onChange={e=>setLastName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc', outline: 'none', fontSize: '0.9rem' }} />
        </div>
        <input type="email" placeholder="Seu melhor e-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid #ccc', outline: 'none', fontSize: '0.9rem' }} />
      </div>

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
      <button
        onClick={handleBooking}
        disabled={isSubmitting}
        style={{ display: 'block', width: '100%', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: 'white', textAlign: 'center', padding: '16px', borderRadius: 12, fontWeight: 700, textDecoration: 'none', fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(37,211,102,0.35)', boxSizing: 'border-box', opacity: isSubmitting ? 0.7 : 1 }}
      >
        📱 {isSubmitting ? 'Processando envio...' : 'Confirmar pelo WhatsApp'}
      </button>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginTop: 10 }}>
        Você não será cobrado ainda. Nossa equipe confirma a disponibilidade.
      </p>
    </div>
  );
}
