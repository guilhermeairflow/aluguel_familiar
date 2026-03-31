'use client';

import React, { useState, useEffect, useRef, MouseEvent, UIEvent } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './page.module.css';
import { PROPERTIES } from '@/lib/properties-data';

const HERO_IMAGES = [
  '/WhatsApp Image 2026-03-28 at 17.42.42.jpeg',
  '/WhatsApp Image 2026-03-28 at 17.42.53 (1).jpeg',
  '/guaruja (2).jpeg',
  '/rivieira (1).jpeg',
  '/ilhabela (2).jpeg',
  '/itu (2).jpeg',
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {HERO_IMAGES.map((src, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1.4s ease-in-out',
            zIndex: 0,
          }}
        >
          <img
            src={src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(15,23,42,0.3), rgba(15,23,42,0.65))' }} />
        </div>
      ))}
      {/* Dots */}
      <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 5 }}>
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para foto ${i + 1}`}
            style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === current ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease' }}
          />
        ))}
      </div>
    </>
  );
}

function PropertyCard({ prop }: { prop: typeof PROPERTIES[0] }) {
  const [idx, setIdx] = useState(0);
  // FIX PERFORMANCE: mostrar só as 5 primeiras fotos nos cards
  const images = prop.images.slice(0, 5);
  const total = images.length;

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: +scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const goTo = (e: React.MouseEvent, n: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: n * scrollRef.current.offsetWidth, behavior: 'smooth' });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    if (index !== idx && index >= 0 && index < total) {
      setIdx(index);
    }
  };

  return (
    <a
      href={`/imoveis/${prop.slug}`}
      className={styles.card}
      style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
    >
      <div className={styles.cardImgWrap} style={{ position: 'relative' }}>
        <style dangerouslySetInnerHTML={{ __html: `.hide-scroll::-webkit-scrollbar { display: none; }` }} />
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="hide-scroll"
          style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', width: '100%', height: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((src, i) => (
            <div key={i} style={{ flex: '0 0 100%', scrollSnapAlign: 'start', position: 'relative', height: '100%' }}>
              <img
                src={src}
                alt={i === 0 ? prop.title : ''}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <button onClick={prev} aria-label="Foto anterior" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#0F172A', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 10 }} className={styles.carouselBtn}>‹</button>
        )}
        {total > 1 && (
          <button onClick={next} aria-label="Próxima foto" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#0F172A', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', zIndex: 10 }} className={styles.carouselBtn}>›</button>
        )}

        {total > 1 && (
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 10 }}>
            {images.map((_, i) => (
              <button key={i} onClick={(e) => goTo(e, i)} aria-label={`Foto ${i + 1}`} style={{ width: idx === i ? 16 : 6, height: 6, borderRadius: 3, background: idx === i ? 'white' : 'rgba(255,255,255,0.55)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.25s ease' }} />
            ))}
          </div>
        )}

        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 20, zIndex: 10, backdropFilter: 'blur(4px)' }}>
          {idx + 1}/{total}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardLocation}>{prop.city}, {prop.state}</div>
        <div className={styles.cardDesc} style={{ fontWeight: 700, color: '#0F172A', marginTop: '6px', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {prop.title}
        </div>
        <div style={{ display: 'flex', gap: '6px', color: '#64748B', fontSize: '0.82rem', marginTop: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>👥 {prop.maxGuests} hóspedes</span>
          <span>·</span>
          <span>🛌 {prop.bedrooms} quartos</span>
          <span>·</span>
          <span>🚿 {prop.bathrooms} banheiros</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
          {prop.features.slice(0, 2).map((feature: string, i: number) => (
            <span key={i} style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
              {feature}
            </span>
          ))}
          {prop.features.length > 2 && (
            <span style={{ background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
              +{prop.features.length - 2} mais
            </span>
          )}
        </div>
        <div className={styles.cardPrice} style={{ marginTop: '14px' }}>
          R$ {prop.basePricePerNight.toLocaleString('pt-BR')} <span>/ noite</span>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [searchType, setSearchType] = useState('');
  const [searchGuests, setSearchGuests] = useState('');

  const filtered = PROPERTIES.filter(p => {
    let typeMatch = true;
    const c = p.city.toLowerCase();
    const isCampo = c.includes('itu') || c.includes('campos');
    if (searchType === 'campo') typeMatch = isCampo;
    if (searchType === 'praia') typeMatch = !isCampo;

    const guestsNum = parseInt(searchGuests);
    const guestsMatch = !searchGuests || isNaN(guestsNum) || p.maxGuests >= guestsNum;
    return typeMatch && guestsMatch;
  });

  return (
    <main>
      <header className={styles.header}>
        <div className={`container ${styles.headerNav}`}>
          <a href="/" className={styles.logo} style={{ textDecoration: 'none', color: 'inherit' }}>AluguelFamiliar.</a>
          <nav>
            <a href="/admin" style={{ fontSize: '0.9rem', fontWeight: 600, color: 'white', opacity: 0.9 }}>Admin</a>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <HeroCarousel />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className={styles.title}>Fuja do óbvio. Viva o extraordinário.</h1>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className={styles.searchGlass}>
              <div className={styles.searchBlock}>
                <span className={styles.searchLabel}>Onde</span>
                <select
                  className={styles.searchVal}
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  style={{ cursor: 'pointer', border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#111', background: 'transparent' }}
                >
                  <option value="">Para onde?</option>
                  <option value="praia">🏖️ Praia (Litoral)</option>
                  <option value="campo">🌲 Campo (Interior)</option>
                </select>
              </div>
              <div className={styles.searchDivider}></div>
              <div className={styles.searchBlock}>
                <span className={styles.searchLabel}>Hóspedes</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Quantas pessoas?"
                  className={styles.searchVal}
                  value={searchGuests}
                  onChange={e => setSearchGuests(e.target.value)}
                />
              </div>
              <button
                className={styles.searchBtn}
                onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="results" className={`container ${styles.propertiesSection}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: 12 }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
            {searchType || searchGuests ? `${filtered.length} imóvel(is) encontrado(s)` : 'Descobertas Incríveis'}
          </h2>
          {(searchType || searchGuests) && (
            <button
              onClick={() => { setSearchType(''); setSearchGuests(''); }}
              style={{ background: 'transparent', border: '1px solid currentColor', borderRadius: 20, padding: '6px 14px', fontSize: '0.85rem', fontWeight: 600, color: '#3b82f6', cursor: 'pointer' }}
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94A3B8' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Nenhum imóvel encontrado</p>
            <p style={{ fontSize: '0.95rem', marginTop: 8 }}>
              Tente outro destino ou{' '}
              <button onClick={() => { setSearchType(''); setSearchGuests(''); }} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                ver todos os imóveis
              </button>.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(prop => (
              <PropertyCard key={prop.id} prop={prop} />
            ))}
          </div>
        )}
      </section>

      <footer style={{ background: '#0F172A', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '32px 24px', marginTop: '60px', fontSize: '0.9rem' }}>
        <div style={{ fontWeight: 700, color: 'white', fontSize: '1.1rem', marginBottom: 8 }}>AluguelFamiliar.</div>
        <div>© {new Date().getFullYear()} · Todos os direitos reservados</div>
        <div style={{ marginTop: 8 }}>
          <a href="https://wa.me/5511945747572" target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>
            📱 WhatsApp: (11) 94574-7572
          </a>
        </div>
      </footer>
    </main>
  );
}
