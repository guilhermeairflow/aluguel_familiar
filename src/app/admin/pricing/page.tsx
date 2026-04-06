'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES as STATIC_PROPERTIES } from '@/lib/properties-data';
import { loadAllProperties, loadAllPricing as loadPersistencePricing, savePricing } from '@/lib/data-persistence';

// --- TIPOS ---
type PricingRule = { id: string; startDate: string; endDate: string; price: number; };
type PropertyPricing = { basePrice: number; cleaningFee: number; rules: PricingRule[]; };

const PROP_COLORS: Record<string, string> = {
  '1': '#2563eb', '2': '#16a34a', '3': '#ea580c',
  '4': '#9333ea', '5': '#0891b2', '6': '#db2777', '7': '#d97706',
};

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function isSameDay(d1: Date, d2: Date) {
  return d1.getUTCFullYear() === d2.getUTCFullYear() && d1.getUTCMonth() === d2.getUTCMonth() && d1.getUTCDate() === d2.getUTCDate();
}

function dateToISO(d: Date) {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function PricingPage() {
  const [allPricing, setAllPricing] = useState<Record<string, PropertyPricing>>({});
  const [properties, setProperties] = useState(STATIC_PROPERTIES);
  const [selectedId, setSelectedId] = useState(STATIC_PROPERTIES[0].id);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [inputPrice, setInputPrice] = useState<string>('');
  
  const [tempBasePrice, setTempBasePrice] = useState<string>('');
  const [tempCleaningFee, setTempCleaningFee] = useState<string>('');
  
  const [savedMsg, setSavedMsg] = useState(false);
  const [baseSavedMsg, setBaseSavedMsg] = useState(false);

  useEffect(() => {
    const loaded = loadPersistencePricing();
    const props = loadAllProperties();
    setProperties(props);
    setAllPricing(loaded);
    
    const current = loaded[selectedId];
    if (current) {
      setTempBasePrice(current.basePrice.toString());
      setTempCleaningFee(current.cleaningFee.toString());
    }
  }, []);

  useEffect(() => {
    const current = allPricing[selectedId];
    if (current) {
      setTempBasePrice(current.basePrice.toString());
      setTempCleaningFee(current.cleaningFee.toString());
    }
  }, [selectedId, allPricing]);

  const pricing = allPricing[selectedId];
  const prop = properties.find(p => p.id === selectedId);

  if (!pricing || !prop) return <div style={{ padding: 40 }}>Carregando...</div>;

  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(Date.UTC(year, month, i + 1)));

  const handleDayClick = (day: Date) => {
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(day);
      setSelectionEnd(null);
    } else {
      if (isSameDay(day, selectionStart)) {
        setSelectionEnd(day); 
      } else if (day < selectionStart) {
        setSelectionStart(day);
        setSelectionEnd(null);
      } else {
        setSelectionEnd(day);
      }
    }
  };

  const isInSelection = (day: Date) => {
    if (!selectionStart) return false;
    if (selectionStart && !selectionEnd) return isSameDay(day, selectionStart);
    return day >= selectionStart && day <= selectionEnd!;
  };

  const getPriceForDate = (day: Date) => {
    const iso = dateToISO(day);
    const rule = pricing.rules.find(r => iso >= r.startDate && iso <= r.endDate);
    return rule ? rule.price : null;
  };

  const handleApplyPrice = () => {
    if (!selectionStart || !inputPrice) return;
    const startValue = dateToISO(selectionStart);
    const endValue = dateToISO(selectionEnd || selectionStart);
    const price = parseFloat(inputPrice);

    const newRule: PricingRule = { id: Math.random().toString(36).substr(2, 9), startDate: startValue, endDate: endValue, price };
    const filteredRules = pricing.rules.filter(r => !(r.startDate >= startValue && r.endDate <= endValue));
    const updatedPricing = { ...pricing, rules: [...filteredRules, newRule] };
    const newAllData = { ...allPricing, [selectedId]: updatedPricing };
    setAllPricing(newAllData);
    savePricing(selectedId, updatedPricing);
    
    setSelectionStart(null); setSelectionEnd(null); setInputPrice(''); setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleSaveBase = () => {
    const bp = parseFloat(tempBasePrice) || 0;
    const cf = parseFloat(tempCleaningFee) || 0;
    const updatedPricing = { ...pricing, basePrice: bp, cleaningFee: cf };
    const newAllData = { ...allPricing, [selectedId]: updatedPricing };
    
    setAllPricing(newAllData);
    savePricing(selectedId, updatedPricing);

    try {
      const savedProps = localStorage.getItem('af_properties');
      const allProps = savedProps ? JSON.parse(savedProps) : [...STATIC_PROPERTIES];
      const idx = allProps.findIndex((p: any) => p.id === selectedId);
      if (idx >= 0) {
        allProps[idx].basePricePerNight = bp;
        allProps[idx].cleaningFee = cf;
        localStorage.setItem('af_properties', JSON.stringify(allProps));
      }
    } catch (err) {
      console.error("Erro ao sincronizar com af_properties:", err);
    }
    
    setBaseSavedMsg(true);
    setTimeout(() => setBaseSavedMsg(false), 2000);
  };

  const handleClearRules = () => {
    if (!confirm('Deseja limpar todos os preços personalizados deste imóvel?')) return;
    const updated = { ...pricing, rules: [] };
    const newAllData = { ...allPricing, [selectedId]: updated };
    setAllPricing(newAllData); savePricing(selectedId, updated);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 300px', gap: 20 }}>
      {/* Sidebar - Lista de Imóveis */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {properties.map(p => {
          const active = selectedId === p.id; const color = PROP_COLORS[p.id];
          const curr = allPricing[p.id] || { basePrice: p.basePricePerNight };
          return (
            <button key={p.id} onClick={() => { setSelectedId(p.id); setSelectionStart(null); setSelectionEnd(null); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px', borderRadius: 12, border: `2px solid ${active ? color : 'transparent'}`, background: active ? `${color}10` : '#f8fafc', cursor: 'pointer', textAlign: 'left' }}>
              <img src={p.coverImage} draggable={false} style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 6 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: active ? color : '#334155' }}>{p.city}</div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>R$ {curr.basePrice}/noite</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Meio - Calendário */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{MONTHS[month]} {year}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setCurrentDate(new Date(Date.UTC(year, month - 1, 1)))} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>‹</button>
            <button onClick={() => setCurrentDate(new Date())} style={{ padding: '0 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Hoje</button>
            <button onClick={() => setCurrentDate(new Date(Date.UTC(year, month + 1, 1)))} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>›</button>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            {WEEKDAYS.map(w => <div key={w} style={{ padding: '12px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{w}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: 480 }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} style={{ background: '#fafafa', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }} />)}
            {days.map(day => {
              const customPrice = getPriceForDate(day);
              const selected = isInSelection(day);
              const isStart = selectionStart && isSameDay(day, selectionStart);
              const isEnd = selectionEnd && isSameDay(day, selectionEnd);
              return (
                <div key={day.getTime()} onClick={() => handleDayClick(day)} style={{ padding: '12px', borderRight: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selected ? '#eff6ff' : 'white', position: 'relative' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: isSameDay(day, new Date()) ? 800 : 500, background: isStart || isEnd ? '#2563eb' : 'transparent', color: isStart || isEnd ? 'white' : '#0f172a' }}>{day.getDate()}</div>
                  {customPrice && <div style={{ marginTop: 8, fontSize: '0.7rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '4px 6px', borderRadius: 6, textAlign: 'center' }}>R$ {customPrice.toLocaleString('pt-BR')}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Direita - Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Preços Base Editor */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: '1rem' }}>Preços Base</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Diária Padrão (R$)</label>
              <input type="number" value={tempBasePrice} onChange={e => setTempBasePrice(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', outline: 'none', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 6, textTransform: 'uppercase' }}>Taxa de Limpeza (R$)</label>
              <input type="number" value={tempCleaningFee} onChange={e => setTempCleaningFee(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', outline: 'none', fontWeight: 700 }} />
            </div>
            <button onClick={handleSaveBase} style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#0f172a', color: 'white', fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
              {baseSavedMsg ? '✅ Valores Salvos!' : 'Salvar Preços Base'}
            </button>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.4 }}>* Estes valores são usados quando não há feriados configurados.</div>
          </div>
        </div>

        {/* Custom Price (Rule) Editor */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontWeight: 800, fontSize: '1rem' }}>Ajustar Preço (Feriados)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 700 }}>
              {!selectionStart ? 'Selecione datas' : (!selectionEnd ? `Um dia: ${selectionStart.toLocaleDateString('pt-BR')}` : `${selectionStart.toLocaleDateString('pt-BR')} até ${selectionEnd.toLocaleDateString('pt-BR')}`)}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>Novo Valor (R$)</label>
              <div style={{ display: 'flex', border: '2px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <span style={{ padding: '12px', background: '#f8fafc', fontWeight: 800 }}>R$</span>
                <input type="number" value={inputPrice} onChange={e => setInputPrice(e.target.value)} style={{ flex: 1, border: 'none', padding: '12px', fontSize: '1rem', fontWeight: 800, outline: 'none' }} />
              </div>
            </div>
            <button disabled={!selectionStart || !inputPrice} onClick={handleApplyPrice} style={{ padding: '14px', borderRadius: 12, border: 'none', background: !selectionStart || !inputPrice ? '#e2e8f0' : '#2563eb', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
              {savedMsg ? '✅ Aplicado!' : 'Salvar Diária Especial'}
            </button>
          </div>
        </div>

        {/* Reset */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px' }}>
          <button onClick={handleClearRules} style={{ width: '100%', background: '#fef2f2', color: '#dc2626', border: 'none', padding: '10px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>Resetar Calendário</button>
        </div>
      </div>
    </div>
  );
}