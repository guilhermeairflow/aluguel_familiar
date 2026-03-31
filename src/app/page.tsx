'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { PROPERTIES } from '@/lib/properties-data';
import { calculateStayTotal, type PropertyPricing } from '@/lib/pricing-engine';

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
  useEffect(() => { const t = setInterval(() => setCurrent(i => (i + 1) % HERO_IMAGES.length), 5000); return () => clearInterval(t); }, []);
  return HERO_IMAGES.map((src, i) => (
    <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === current ? 1 : 0, transition: 'opacity 1.4s', zIndex: 0 }}>
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(15,23,42,0.3), rgba(15,23,42,0.65))' }} />
    </div>
  ));
}

function PropertyCard({ prop, dates, guests, allPricing }: { prop: typeof PROPERTIES[0], dates: { start: string, end: string } | null, guests: number, allPricing: Record<string, PropertyPricing> | null }) {
  const pricing = allPricing ? allPricing[prop.id] : null;
  const currentBase = pricing?.basePrice ?? prop.basePricePerNight;
  const res = dates ? calculateStayTotal(prop.id, dates.start, dates.end, allPricing || undefined) : null;

  const query = dates ? `?checkin=${dates.start}&checkout=${dates.end}&guests=${guests}` : '';

  return (
    <a href={`/imoveis/${prop.slug}${query}`} className={styles.card} style={{ display: 'block', textDecoration: 'none' }}>
      <div className={styles.cardImgWrap} style={{ position: 'relative' }}>
        <img src={prop.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {pricing && pricing.rules?.some((r:any) => { const t = new Date().toISOString().split('T')[0]; return t >= r.startDate && t <= r.endDate; }) && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '4px 8px', borderRadius: 6 }}>ESPECIAL</div>
        )}
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardLocation}>{prop.city}</div>
        <div className={styles.cardDesc} style={{ fontWeight: 700, marginTop: 6 }}>{prop.title}</div>
        <div style={{ display: 'flex', gap: 6, color: '#64748B', fontSize: '0.8rem', marginTop: 6 }}><span>👥 {prop.maxGuests}</span> · <span>🛌 {prop.bedrooms}</span></div>
        <div style={{ marginTop: 14 }}>
          {res ? (
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>R$ {res.total.toLocaleString('pt-BR')} <span style={{ fontSize: '0.7rem', color: '#64748b' }}>total</span></div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>R$ {res.average.toLocaleString('pt-BR')} / noite</div>
            </div>
          ) : (
            <div style={{ fontWeight: 800 }}>R$ {currentBase.toLocaleString('pt-BR')} <span style={{ fontWeight: 400, color: '#64748b', fontSize: '0.8rem' }}>/ noite</span></div>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [type, setType] = useState('');
  const [guests, setGuests] = useState(1);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [allPricing, setAllPricing] = useState<Record<string, PropertyPricing>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('af_dynamic_pricing');
      if (saved) setAllPricing(JSON.parse(saved));
    }
  }, []);

  const [today, setToday] = useState('');
  useEffect(() => {
    const d = new Date();
    setToday(d.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (start && end && guests > 0) {
      const results = document.getElementById('results');
      if (results) {
        setTimeout(() => results.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, [start, end, guests]);

  const filtered = PROPERTIES.filter(p => {
    const isCampo = p.city.toLowerCase().includes('itu') || p.city.toLowerCase().includes('campos');
    const typeMatch = type === '' ? true : (type === 'campo' ? isCampo : !isCampo);
    return typeMatch && p.maxGuests >= guests;
  });

  return (
    <main>
      <header className={styles.header}><div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}><a href="/" style={{ color: 'white', fontWeight: 800, textDecoration: 'none' }}>AluguelFamiliar.</a><a href="/admin" style={{ color: 'white', fontSize: '0.9rem', textDecoration: 'none' }}>Admin</a></div></header>
      <section className={styles.hero}><HeroCarousel />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className={styles.title}>Viva o extraordinário.</h1>
          <div className={styles.searchContainer}>
            <div className={styles.typeToggle}>
              <button className={`${styles.toggleBtn} ${type === 'campo' ? styles.activeBtn : ''}`} onClick={() => setType('campo')}>Campo</button>
              <button className={`${styles.toggleBtn} ${type === 'praia' ? styles.activeBtn : ''}`} onClick={() => setType('praia')}>Praia</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, background: 'white', padding: '12px 20px', borderRadius: 20, width: '100%', maxWidth: 650 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>HÓSPEDES</span><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><button onClick={() => setGuests(Math.max(1, guests-1))} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer' }}>-</button><span>{guests}</span><button onClick={() => setGuests(guests+1)} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ddd', cursor: 'pointer' }}>+</button></div></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>ENTRADA</span><input type="date" min={today} value={start} onChange={e => { setStart(e.target.value); if(end && e.target.value >= end) setEnd(''); }} style={{ border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }} /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b' }}>SAÍDA</span><input type="date" min={start || today} value={end} onChange={e => setEnd(e.target.value)} style={{ border: 'none', fontWeight: 700, outline: 'none', cursor: 'pointer' }} /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="container" id="results" style={{ padding: '60px 0' }}>
        <h2 style={{ marginBottom: 30 }}>{start && end ? filtered.length + ' encontrados' : 'Explorar'}</h2>
        <div className={styles.grid}>{filtered.map(p => <PropertyCard key={p.id} prop={p} dates={start && end ? { start, end } : null} guests={guests} allPricing={allPricing} />)}</div>
      </section>
    </main>
  );
}
