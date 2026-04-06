'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import { PROPERTIES } from '@/lib/properties-data';
import { loadAllProperties, loadAllPricing } from '@/lib/data-persistence';
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

function PropertyCard({ prop, dates, adults, minors, minorAges, allPricing }: { prop: any, dates: { start: string, end: string } | null, adults: number, minors: number, minorAges: string[], allPricing: Record<string, PropertyPricing> | null }) {
  const pricing = allPricing ? allPricing[prop.id] : null;
  const currentBase = pricing?.basePrice ?? prop.basePricePerNight;
  const res = dates ? calculateStayTotal(prop.id, dates.start, dates.end, allPricing || undefined) : null;

  const agesParam = minorAges.length > 0 ? `&minorAges=${minorAges.join(',')}` : '';
  const query = dates ? `?checkin=${dates.start}&checkout=${dates.end}&adults=${adults}&minors=${minors}${agesParam}` : '';

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
  const [displayProperties, setDisplayProperties] = useState<any[]>(PROPERTIES);
  const [type, setType] = useState('');
  const [adults, setAdults] = useState(2);
  const [minors, setMinors] = useState(0);
  const [minorAges, setMinorAges] = useState<string[]>([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [allPricing, setAllPricing] = useState<Record<string, PropertyPricing>>({});

  useEffect(() => {
    setAllPricing(loadAllPricing());
    setDisplayProperties(loadAllProperties());
  }, []);

  const [today, setToday] = useState('');
  useEffect(() => {
    const d = new Date();
    setToday(d.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (start && end && adults > 0) {
      const results = document.getElementById('results');
      if (results) {
        setTimeout(() => results.scrollIntoView({ behavior: 'smooth' }), 300);
      }
    }
  }, [start, end, adults, minors]);

  const handleMinors = (val: number) => {
    const n = Math.max(0, Math.min(10, val));
    setMinors(n);
    setMinorAges(prev => {
      if (n > prev.length) return [...prev, ...Array(n - prev.length).fill('0')];
      return prev.slice(0, n);
    });
  };

  const updateMinorAge = (idx: number, age: string) => {
    setMinorAges(prev => {
      const copy = [...prev];
      copy[idx] = age;
      return copy;
    });
  };

  const filtered = displayProperties.filter(p => {
    const isCampo = p.city.toLowerCase().includes('itu') || p.city.toLowerCase().includes('campos');
    const typeMatch = type === '' ? true : (type === 'campo' ? isCampo : !isCampo);
    const totalGuests = adults + minors;
    return typeMatch && p.maxGuests >= totalGuests;
  });

  return (
    <main>
      <header className={styles.header}><div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}><a href="/" style={{ color: 'white', fontWeight: 800, textDecoration: 'none' }}>AluguelFamiliar.</a><a href="/admin" style={{ color: 'white', fontSize: '0.9rem', textDecoration: 'none' }}>Admin</a></div></header>
      <section className={styles.hero}><HeroCarousel />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 className={styles.title}>Viva o extraordinário.</h1>
          <div className={styles.searchContainer} style={{ width: '100%', maxWidth: '950px', margin: '0 auto' }}>
            <div className={styles.typeToggle}>
              <button className={`${styles.toggleBtn} ${type === 'campo' ? styles.activeBtn : ''}`} onClick={() => setType('campo')}>Campo</button>
              <button className={`${styles.toggleBtn} ${type === 'praia' ? styles.activeBtn : ''}`} onClick={() => setType('praia')}>Praia</button>
            </div>
            
            <div style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: 32, 
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              width: '100%'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: 20,
                alignItems: 'start'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>ADULTOS (13+)</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 16px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <button onClick={() => setAdults(Math.max(1, adults-1))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white', fontWeight: 'bold' }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', minWidth: 20, textAlign: 'center' }}>{adults}</span>
                    <button onClick={() => setAdults(adults+1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>MENORES (ATÉ 12)</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 16px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <button onClick={() => handleMinors(minors-1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white', fontWeight: 'bold' }}>-</button>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a', minWidth: 20, textAlign: 'center' }}>{minors}</span>
                    <button onClick={() => handleMinors(minors+1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white', fontWeight: 'bold' }}>+</button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>ENTRADA</span>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <input type="date" min={today} value={start} onChange={e => { setStart(e.target.value); if(end && e.target.value >= end) setEnd(''); }} style={{ border: 'none', background: 'transparent', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.95rem', width: '100%', color: '#0f172a' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 8px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>SAÍDA</span>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 16, border: '1px solid #f1f5f9' }}>
                    <input type="date" min={start || today} value={end} onChange={e => setEnd(e.target.value)} style={{ border: 'none', background: 'transparent', fontWeight: 700, outline: 'none', cursor: 'pointer', fontSize: '0.95rem', width: '100%', color: '#0f172a' }} />
                  </div>
                </div>
              </div>

              {minors > 0 && (
                <div style={{ 
                  marginTop: 24, 
                  padding: '20px 8px 8px', 
                  borderTop: '1px solid #f1f5f9',
                  animation: 'fadeIn 0.3s ease-out'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'block', marginBottom: 12 }}>IDADE DOS MENORES</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 12 }}>
                    {Array.from({ length: minors }).map((_, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 4,
                        background: '#ffffff', 
                        padding: '10px 14px', 
                        borderRadius: 14, 
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}>
                        <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>{i+1}ª Criança</span>
                        <select 
                          value={minorAges[i] || '0'} 
                          onChange={e => updateMinorAge(i, e.target.value)}
                          style={{ 
                            border: 'none', 
                            background: 'transparent', 
                            fontWeight: 700, 
                            outline: 'none', 
                            fontSize: '0.95rem',
                            color: '#0f172a',
                            cursor: 'pointer'
                          }}
                        >
                          {Array.from({ length: 13 }).map((_, age) => (
                            <option key={age} value={age}>{age} {age === 1 ? 'ano' : 'anos'}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
      <section className="container" id="results" style={{ padding: '60px 0' }}>
        <h2 style={{ marginBottom: 30, fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{start && end ? filtered.length + ' imóveis perfeitos encontrados' : 'Explorar imóveis'}</h2>
        <div className={styles.grid}>{filtered.map(p => <PropertyCard key={p.id} prop={p} dates={start && end ? { start, end } : null} adults={adults} minors={minors} minorAges={minorAges} allPricing={allPricing} />)}</div>
      </section>
    </main>
  );
}