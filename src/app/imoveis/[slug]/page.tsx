'use client';

import { PROPERTIES } from '@/lib/properties-data';
import { loadReviews, getReviewsBySlug, getAverageRating, type Review } from '@/lib/reviews-data';
import { calculateStayTotal, type PropertyPricing } from '@/lib/pricing-engine';
import { notFound, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronLeft, Shield, CheckCircle, X, ChevronRight, Star } from 'lucide-react';

export default function ImovelDetails({ params }: { params: { slug: string } }) {
  const prop = PROPERTIES.find((p) => p.slug === params.slug);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [isReviewsHovered, setIsReviewsHovered] = useState(false);

  // Dynamic Pricing State
  const [allPricing, setAllPricing] = useState<Record<string, PropertyPricing>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('af_dynamic_pricing');
      if (saved) setAllPricing(JSON.parse(saved));
    }
  }, []);

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

  const pricing = allPricing[prop.id];
  const basePrice = pricing?.basePrice ?? prop.basePricePerNight;
  const cleaningFee = pricing?.cleaningFee ?? prop.cleaningFee;
  const imgs = prop.images;

  return (
    <div style={{ background: 'white', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>

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

      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#222', fontWeight: 600, fontSize: '0.9rem' }}>
          <ChevronLeft size={20} /> Voltar
        </a>
        <a href="/" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', textDecoration: 'none' }}>
          Aluguel<span style={{ color: '#2563eb' }}>Familiar</span>
        </a>
      </nav>

      <div className="page-container">
        <div className="photo-section">
          <div className="photo-hero" style={{ position: 'relative', overflow: 'hidden', background: '#f1f5f9', cursor: 'pointer', width: '100%' }} onClick={() => setLightboxIdx(carouselIdx)}>
            <img src={imgs[carouselIdx]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="eager" />
            <button onClick={e => { e.stopPropagation(); setCarouselIdx(i => (i - 1 + imgs.length) % imgs.length); }} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>‹</button>
            <button onClick={e => { e.stopPropagation(); setCarouselIdx(i => (i + 1) % imgs.length); }} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>›</button>
            <div style={{ position: 'absolute', bottom: 14, right: 16, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{carouselIdx + 1} / {imgs.length}</div>
            <div style={{ position: 'absolute', top: 14, left: 16, background: 'rgba(0,0,0,0.45)', color: 'white', padding: '5px 10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>🔍 Clique para ampliar</div>
            <button onClick={e => { e.stopPropagation(); setShowAllPhotos(true); }} style={{ position: 'absolute', bottom: 14, left: 16, background: 'white', border: '1.5px solid #111', borderRadius: 8, padding: '7px 14px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', color: '#111', display: 'flex', alignItems: 'center', gap: 6 }}>⊞ Ver todas as {imgs.length} fotos</button>
          </div>
          <div className="thumbnails-row">
            {imgs.slice(0, 12).map((img, i) => (
              <div key={i} onClick={() => setCarouselIdx(i)} style={{ flexShrink: 0, width: 80, height: 60, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2.5px solid ${carouselIdx === i ? '#2563eb' : 'transparent'}`, transition: 'border 0.15s', boxShadow: carouselIdx === i ? '0 0 0 2px #2563eb33' : 'none' }}><img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /></div>
            ))}
          </div>
        </div>

        <h1 className="page-title">{prop.title}</h1>
        <div className="page-subtitle"><MapPin size={14} color="#2563eb" />{prop.city}, {prop.state}</div>

        {reviews.length > 0 && (
          <div className="review-row" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0 14px 0', cursor: 'pointer', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111' }}>{getAverageRating(reviews).toFixed(2)}</span>
            <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => (<Star key={s} size={13} fill={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : 'none'} color={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : '#d1d5db'} />))}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#f8f4ff', border: '1px solid #e9d5ff', borderRadius: 20, padding: '3px 10px' }}><span style={{ fontSize: '0.75rem' }}>🏆</span><span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#6d28d9' }}>Preferido dos hóspedes</span></div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2563eb', textDecoration: 'underline' }}>{reviews.length} avalia{reviews.length !== 1 ? 'ções' : 'ção'}</span>
          </div>
        )}

        <div className="content-grid">
          <div className="content-left">
            <div style={{ paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#111', marginBottom: 8 }}>Espaço inteiro · Casa em {prop.city}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', color: '#555', fontSize: '0.9rem' }}>
                <span>👥 {prop.maxGuests} hóspedes</span> <span style={{ color: '#ccc' }}>·</span> <span>🛌 {prop.bedrooms} quartos</span> <span style={{ color: '#ccc' }}>·</span> <span>🛏️ {prop.beds} camas</span> <span style={{ color: '#ccc' }}>·</span> <span>🚿 {prop.bathrooms} banheiros</span>
              </div>
            </div>

            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={24} color="white" /></div>
              <div><div style={{ fontWeight: 700, color: '#111' }}>Anunciado por AluguelFamiliar</div><div style={{ color: '#666', fontSize: '0.85rem' }}>✅ Parceiro verificado · Atendimento via WhatsApp</div></div>
            </div>

            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{ icon: '🏡', title: 'Espaço inteiro', desc: 'Você terá o imóvel inteiro para seu grupo' }, { icon: '✨', title: 'Limpeza exemplar', desc: 'Uma piscina de hóspedes recentes deu nota 5 à limpeza' }, { icon: '🔑', title: 'Check-in self service', desc: 'Faça o check-in no seu horário' }].map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}><span style={{ fontSize: '1.4rem' }}>{h.icon}</span><div><div style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>{h.title}</div><div style={{ color: '#666', fontSize: '0.85rem' }}>{h.desc}</div></div></div>
              ))}
            </div>

            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.75, color: '#333', fontSize: '0.95rem', maxHeight: descExpanded ? 'none' : '160px', overflow: 'hidden', position: 'relative' }}>{prop.description}{!descExpanded && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(transparent, white)' }} />}</div>
              <button onClick={() => setDescExpanded(!descExpanded)} style={{ marginTop: 16, background: 'none', border: 'none', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', color: '#111', textDecoration: 'underline' }}>{descExpanded ? 'Mostrar menos' : 'Mostrar mais ▼'}</button>
            </div>

            <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 20px 0' }}>O que você vai encontrar</h2>
              <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{prop.features.map((feat, i) => (<div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#333', fontSize: '0.92rem' }}><CheckCircle size={20} color="#10b981" /><span>{feat}</span></div>))}</div>
            </div>

            <div style={{ paddingTop: 32, paddingBottom: 32, borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', margin: '0 0 16px 0' }}>Onde você vai estar</h2>
              <div style={{ color: '#555', marginBottom: 20 }}>{prop.city}, {prop.state}, Brasil<div style={{ fontSize: '0.85rem', marginTop: 4 }}>A localização exata é fornecida após a confirmação da reserva.</div></div>
              <div style={{ width: '100%', height: 320, borderRadius: 16, overflow: 'hidden', background: '#e2e8f0' }}><iframe width="100%" height="100%" frameBorder="0" style={{ border: 0 }} loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent((prop as any).mapLocation || (prop.city + ', ' + prop.state + ', Brasil'))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}></iframe></div>
            </div>

            {reviews.length > 0 && (
              <div id="reviews" style={{ paddingTop: 32, paddingBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', borderRadius: 16, padding: '16px 24px', minWidth: 90 }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900 }}>{getAverageRating(reviews).toFixed(1)}</span>
                    <div style={{ display: 'flex', gap: 2 }}>{[1,2,3,4,5].map(s => (<Star key={s} size={12} fill={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : 'none'} color={s <= Math.round(getAverageRating(reviews)) ? '#f59e0b' : '#ffffff55'} />))}</div>
                  </div>
                  <div><h2 className="reviews-title" style={{ fontSize: '1.4rem', fontWeight: 800 }}>Avaliações dos hóspedes</h2><p style={{ margin: 0, color: '#666' }}>{reviews.length} avaliações · Nota {getAverageRating(reviews).toFixed(1)}/5 ⭐</p></div>
                </div>
                <div onMouseEnter={() => setIsReviewsHovered(true)} onMouseLeave={() => setIsReviewsHovered(false)} style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                  {reviews.length > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
                      <button onClick={() => { const el = reviewScrollRef.current; if (!el) return; el.scrollBy({ left: -(el.clientWidth), behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: 'white', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
                      <button onClick={() => { const el = reviewScrollRef.current; if (!el) return; el.scrollBy({ left: el.clientWidth, behavior: 'smooth' }); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #cbd5e1', background: 'white', cursor: 'pointer' }}><ChevronRight size={18} /></button>
                    </div>
                  )}
                  <div ref={reviewScrollRef} className="review-carousel" style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory' }}>
                    {reviews.map(r => (
                      <div key={r.id} style={{ background: '#f8fafc', borderRadius: 16, padding: '22px', border: '1px solid #e2e8f0', flex: '0 0 100%', scrollSnapAlign: 'start' }}>
                        <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>{[1,2,3,4,5].map(s => (<Star key={s} size={16} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#d1d5db'} />))}</div>
                        <p style={{ fontStyle: 'italic', color: '#334155', lineHeight: 1.65 }}>&ldquo;{r.comment}&rdquo;</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{r.guest.charAt(0)}</div><div><div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.guest}</div><div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{r.date}</div></div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="desktop-widget" style={{ position: 'sticky', top: 80 }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 20 }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>R$ {basePrice.toLocaleString('pt-BR')}</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/noite</span>
              </div>
              <ReservationWidget prop={prop} allPricing={allPricing} />
            </div>
          </div>
        </div>
      </div>

      <div className="mobile-bottom-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e2e8f0', padding: '12px 20px', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontSize: '0.72rem', color: '#888' }}>A partir de</div><div style={{ fontSize: '1.2rem', fontWeight: 800 }}>R$ {basePrice.toLocaleString('pt-BR')}<span style={{ fontSize: '0.78rem', fontWeight: 400 }}> /noite</span></div></div>
        <button onClick={() => setShowWidget(true)} style={{ background: 'linear-gradient(135deg,#FF385C,#E31C5F)', color: 'white', border: 'none', borderRadius: 50, padding: '14px 32px', fontWeight: 700, fontSize: '1rem' }}>Reservar</button>
      </div>

      {showWidget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowWidget(false)} />
          <div style={{ position: 'relative', background: 'white', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}><span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Solicitar Reserva</span><button onClick={() => setShowWidget(false)} style={{ background: 'none', border: 'none' }}><X size={22} /></button></div>
            <ReservationWidget prop={prop} allPricing={allPricing} />
          </div>
        </div>
      )}

      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setLightboxIdx(null)}>
          <button style={{ position: 'absolute', top: 16, right: 20, color: 'white', background: 'none', border: 'none', fontSize: '1.5rem' }}>✕</button>
          <img src={imgs[lightboxIdx]} alt="" style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain' }} />
          <div style={{ position: 'absolute', bottom: 16, color: 'white' }}>{lightboxIdx + 1} / {imgs.length}</div>
        </div>
      )}

      {showAllPhotos && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 900, overflowY: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <button onClick={() => setShowAllPhotos(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', fontWeight: 700, marginBottom: 24 }}><ChevronLeft size={20} /> Fechar galeria</button>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>{imgs.map((img, i) => (<div key={i} onClick={() => { setLightboxIdx(i); setShowAllPhotos(false); }} style={{ aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden' }}><img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>))}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReservationWidget({ prop, allPricing }: { prop: any, allPricing: any }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Advanced Init from SearchParams
  const [adults, setAdults] = useState(() => {
    const s = searchParams.get('adults');
    return s ? Math.max(1, parseInt(s)) : 2;
  });
  const [minors, setMinors] = useState(() => {
    const s = searchParams.get('minors');
    return s ? Math.max(0, parseInt(s)) : 0;
  });
  const [minorAges, setMinorAges] = useState<string[]>(() => {
    const s = searchParams.get('minorAges');
    if (s) return s.split(',');
    // Fallback if minors > 0 but no ages provided
    const n = parseInt(searchParams.get('minors') || '0');
    return Array(n).fill('');
  });

  const [checkin, setCheckin] = useState(searchParams.get('checkin') || '');
  const [checkout, setCheckout] = useState(searchParams.get('checkout') || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the engine for calculation
  const res = (checkin && checkout) ? calculateStayTotal(prop.id, checkin, checkout, allPricing) : null;
  const pricingOverride = allPricing[prop.id];
  const currentBasePrice = pricingOverride?.basePrice ?? prop.basePricePerNight;

  const handleMinors = (val: number) => {
    const n = Math.max(0, val);
    setMinors(n);
    setMinorAges(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill('')];
      return prev.slice(0, n);
    });
  };

  const updateMinorAge = (idx: number, age: string) => {
    const val = parseInt(age);
    if (val > 12) {
      alert("Hóspedes a partir de 13 anos devem ser incluídos como 'Adultos'.");
      return;
    }
    setMinorAges(prev => {
      const copy = [...prev];
      copy[idx] = age;
      return copy;
    });
  };

  const handleBooking = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) { alert('Preencha seus dados.'); return; }
    setIsSubmitting(true);
    const fmt = (d: string) => d.split('-').reverse().join('/');
    const datesText = `%0A📅 *Período:* ${fmt(checkin)} a ${fmt(checkout)} (${res?.nights} noites)`;
    const guestsText = `%0A👥 *Hóspedes:* ${adults} adultos${minors > 0 ? `, ${minors} crianças` : ''}`;
    
    // Add child ages to message
    let agesText = "";
    if (minors > 0 && minorAges.length > 0) {
      const filteredAges = minorAges.filter(a => a.trim() !== "");
      if (filteredAges.length > 0) {
        agesText = `%0A👶 *Idades das crianças:* ${filteredAges.join(', ')} anos`;
      }
    }

    const valueText = `%0A💰 *Valor Total:* R$ ${res?.total.toLocaleString('pt-BR')}`;
    const wa = `https://wa.me/5511945747572?text=Olá! Me chamo *${firstName} ${lastName}* (${email}).%0A%0AGostaria de reservar *${encodeURIComponent(prop.title)}*.${datesText}${guestsText}${agesText}${valueText}`;
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, propertyTitle: prop.title, checkin, checkout, adults, minors, minorAges, total: res?.total })
      });
      window.location.href = wa;
    } catch { window.location.href = wa; }
    finally { setTimeout(() => setIsSubmitting(false), 5000); }
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <div style={{ border: '1px solid #ccc', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div style={{ padding: '12px 14px', borderRight: '1px solid #ccc' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800 }}>Check-in</div>
                <input type="date" value={checkin} min={new Date().toISOString().split('T')[0]} onChange={e => setCheckin(e.target.value)} style={{ border: 'none', width: '100%', background: 'transparent' }} />
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800 }}>Check-out</div>
                <input type="date" value={checkout} min={checkin || new Date().toISOString().split('T')[0]} onChange={e => setCheckout(e.target.value)} style={{ border: 'none', width: '100%', background: 'transparent' }} />
              </div>
            </div>
          </div>
          <div style={{ border: '1px solid #ccc', borderRadius: 10, padding: '0 16px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div><div style={{ fontWeight: 600 }}>Adultos</div><div style={{ fontSize: '0.78rem' }}>13+ anos</div></div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={() => setAdults(Math.max(1, adults-1))} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                <input type="number" value={adults} onChange={e => setAdults(Math.max(1, parseInt(e.target.value) || 0))} style={{ width: 30, border: 'none', textAlign: 'center', fontWeight: 600, outline: 'none' }} />
                <button onClick={() => setAdults(adults+1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0' }}>
              <div><div style={{ fontWeight: 600 }}>Crianças</div><div style={{ fontSize: '0.78rem' }}>Até 12 anos</div></div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button onClick={() => handleMinors(minors-1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>-</button>
                <input type="number" value={minors} onChange={e => handleMinors(parseInt(e.target.value) || 0)} style={{ width: 30, border: 'none', textAlign: 'center', fontWeight: 600, outline: 'none' }} />
                <button onClick={() => handleMinors(minors+1)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            
            {/* Child Ages Section */}
            {minors > 0 && (
              <div style={{ padding: '0 0 16px 0', borderTop: '1px solid #f1f5f9', marginTop: 8 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', marginBottom: 10, textTransform: 'uppercase' }}>Idade das crianças:</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {Array.from({ length: minors }).map((_, i) => (
                    <input key={i} type="number" placeholder={`${i+1}ª`} min="0" max="12" value={minorAges[i] || ''} onChange={e => updateMinorAge(i, e.target.value)} style={{ width: 50, padding: '8px', borderRadius: 8, border: '1px solid #ddd', outline: 'none', textAlign: 'center', fontSize: '0.85rem' }} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={() => { if(!checkin || !checkout) return alert('Escolha datas.'); setStep(2); }} style={{ width: '100%', background: 'linear-gradient(135deg,#FF385C,#E31C5F)', color: 'white', padding: '16px', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Reservar via WhatsApp</button>
        </>
      ) : (
        <>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 14, marginBottom: 16 }}>
            <input type="text" placeholder="Nome" value={firstName} onChange={e=>setFirstName(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
            <input type="text" placeholder="Sobrenome" value={lastName} onChange={e=>setLastName(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
            <input type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <button onClick={handleBooking} disabled={isSubmitting} style={{ width: '100%', background: 'linear-gradient(135deg,#25D366,#128C7E)', color: 'white', padding: '16px', borderRadius: 12, border: 'none', fontWeight: 700, cursor: 'pointer' }}>{isSubmitting ? 'Confirmando...' : 'Confirmar pelo WhatsApp'}</button>
          <button onClick={() => setStep(1)} style={{ width: '100%', marginTop: 8, background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', cursor: 'pointer' }}>Voltar</button>
        </>
      )}

      {res && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span>Estadia ({res.nights} noites)</span>
            <span>R$ {res.subtotal.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: 4 }}>
            <span>Taxa de limpeza</span>
            <span>R$ {res.cleaningFee.toLocaleString('pt-BR')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, marginTop: 8 }}>
            <span>Total estimado</span>
            <span>R$ {res.total.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}
    </div>
  );
}
