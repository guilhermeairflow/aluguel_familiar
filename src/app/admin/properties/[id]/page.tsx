'use client';

import { useState, useEffect } from 'react';
import { PROPERTIES } from '@/lib/properties-data';

type Property = typeof PROPERTIES[0];

function saveProperty(updated: Property) {
  try {
    const saved = localStorage.getItem('af_properties');
    const all: Property[] = saved ? JSON.parse(saved) : PROPERTIES;
    const idx = all.findIndex(p => p.id === updated.id);
    if (idx >= 0) all[idx] = updated;
    else all.push(updated);
    localStorage.setItem('af_properties', JSON.stringify(all));
  } catch {}
}

export default function PropertyAdminPage({ params }: { params: { id: string } }) {
  const original = PROPERTIES.find(p => p.id === params.id);
  const [prop, setProp] = useState<Property | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'precos' | 'descricao' | 'fotos' | 'comodidades'>('info');
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('af_properties');
      if (savedData) {
        const all: Property[] = JSON.parse(savedData);
        const found = all.find(p => p.id === params.id);
        if (found) { setProp(found); return; }
      }
    } catch {}
    if (original) setProp({ ...original });
  }, [params.id]);

  if (!prop || !original) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: '3rem' }}>🏠</div>
      <h2 style={{ color: '#0f172a', marginTop: 12 }}>Imóvel não encontrado</h2>
      <a href="/admin/properties" style={{ color: '#2563eb', fontWeight: 600 }}>← Voltar</a>
    </div>
  );

  const update = (field: string, value: any) => setProp(prev => prev ? { ...prev, [field]: value } : prev);

  const handleSave = () => {
    saveProperty(prop);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Restaurar todos os dados originais deste imóvel?')) {
      setProp({ ...original });
      const saved = localStorage.getItem('af_properties');
      if (saved) {
        const all: Property[] = JSON.parse(saved);
        const idx = all.findIndex(p => p.id === params.id);
        if (idx >= 0) { all[idx] = original; localStorage.setItem('af_properties', JSON.stringify(all)); }
      }
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    update('features', [...prop.features, newFeature.trim()]);
    setNewFeature('');
  };

  const removeFeature = (i: number) => update('features', prop.features.filter((_, idx) => idx !== i));

  const addImage = () => {
    if (!newImage.trim()) return;
    update('images', [...prop.images, newImage.trim()]);
    setNewImage('');
  };

  const removeImage = (i: number) => update('images', prop.images.filter((_, idx) => idx !== i));

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= prop.images.length) return;
    const imgs = [...prop.images];
    [imgs[from], imgs[to]] = [imgs[to], imgs[from]];
    update('images', imgs);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1.5px solid #e2e8f0', fontSize: '0.92rem', color: '#0f172a',
    outline: 'none', boxSizing: 'border-box', background: 'white', fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontWeight: 700, fontSize: '0.8rem', color: '#374151', marginBottom: 6, marginTop: 16,
  };

  const tabs = [
    { id: 'info', label: '📍 Informações' },
    { id: 'precos', label: '💰 Preços' },
    { id: 'descricao', label: '📝 Descrição' },
    { id: 'comodidades', label: '✅ Comodidades' },
    { id: 'fotos', label: '📸 Fotos' },
  ] as const;

  return (
    <div style={{ maxWidth: 900 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <a href="/admin/properties" style={{ color: '#64748b', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>← Todos os imóveis</a>
          <h2 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', maxWidth: 540, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {prop.title}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleReset} style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            ↺ Restaurar
          </button>
          <a href={`/imoveis/${prop.slug}`} target="_blank" rel="noreferrer" style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#2563eb', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
            👁️ Ver ao vivo
          </a>
          <button onClick={handleSave} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: saved ? '#10b981' : '#0f172a', color: 'white', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'background 0.3s' }}>
            {saved ? '✅ Salvo!' : '💾 Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Preview cover */}
      <div style={{ position: 'relative', height: 160, borderRadius: 14, overflow: 'hidden', marginBottom: 24, background: '#e2e8f0' }}>
        <img src={prop.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <div>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>{prop.city}, {prop.state}</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 4 }}>
              {prop.maxGuests} hóspedes · {prop.bedrooms} quartos · {prop.bathrooms} banheiros · {prop.images.length} fotos
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e2e8f0', marginBottom: 24, overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: -2, fontSize: '0.88rem', whiteSpace: 'nowrap', transition: 'all 0.15s',
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* Tab: Informações */}
      {activeTab === 'info' && (
        <div style={{ display: 'grid', gap: 0 }}>
          <label style={labelStyle}>Título do Anúncio</label>
          <input style={inputStyle} value={prop.title} onChange={e => update('title', e.target.value)} placeholder="Título do imóvel" />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Cidade</label>
              <input style={inputStyle} value={prop.city} onChange={e => update('city', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Estado</label>
              <input style={inputStyle} value={prop.state} onChange={e => update('state', e.target.value)} maxLength={2} />
            </div>
          </div>

          <label style={labelStyle}>Slug (URL)</label>
          <div style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
            /imoveis/<strong style={{ color: '#475569' }}>{prop.slug}</strong>
          </div>

          <h3 style={{ margin: '24px 0 0', fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>👥 Capacidade</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 14, marginTop: 4 }}>
            {[
              { label: 'Máx. Hóspedes', field: 'maxGuests', value: prop.maxGuests },
              { label: 'Quartos', field: 'bedrooms', value: prop.bedrooms },
              { label: 'Camas', field: 'beds', value: prop.beds },
              { label: 'Banheiros', field: 'bathrooms', value: prop.bathrooms },
            ].map(f => (
              <div key={f.field}>
                <label style={labelStyle}>{f.label}</label>
                <input type="number" min={1} style={inputStyle} value={f.value}
                  onChange={e => update(f.field, parseInt(e.target.value) || 1)} />
              </div>
            ))}
          </div>

          <label style={{ ...labelStyle, marginTop: 24 }}>Imagem de Capa (URL ou /caminho)</label>
          <input style={inputStyle} value={prop.coverImage} onChange={e => update('coverImage', e.target.value)} placeholder="/nome-da-foto.jpeg" />
          {prop.coverImage && (
            <img src={prop.coverImage} alt="" style={{ height: 80, borderRadius: 8, objectFit: 'cover', marginTop: 8, maxWidth: 160 }} />
          )}
        </div>
      )}

      {/* Tab: Preços */}
      {activeTab === 'precos' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Diária Base (R$)</label>
              <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                <span style={{ padding: '10px 14px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>R$</span>
                <input type="number" style={{ ...inputStyle, border: 'none', borderRadius: 0 }} value={prop.basePricePerNight}
                  onChange={e => update('basePricePerNight', parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Taxa de Limpeza (R$)</label>
              <div style={{ display: 'flex', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                <span style={{ padding: '10px 14px', background: '#f8fafc', color: '#64748b', fontWeight: 700, borderRight: '1px solid #e2e8f0' }}>R$</span>
                <input type="number" style={{ ...inputStyle, border: 'none', borderRadius: 0 }} value={prop.cleaningFee}
                  onChange={e => update('cleaningFee', parseInt(e.target.value) || 0)} />
              </div>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '16px 20px', marginTop: 24, border: '1px solid #bbf7d0' }}>
            <div style={{ fontWeight: 700, color: '#15803d', marginBottom: 8 }}>📊 Simulação de Receita</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {[
                { label: '3 noites', nights: 3 },
                { label: '5 noites', nights: 5 },
                { label: '7 noites', nights: 7 },
                { label: '15 noites', nights: 15 },
              ].map(s => (
                <div key={s.nights} style={{ background: 'white', borderRadius: 8, padding: '12px 14px', border: '1px solid #d1fae5' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#15803d', marginTop: 2 }}>
                    R$ {(prop.basePricePerNight * s.nights + prop.cleaningFee).toLocaleString('pt-BR')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 1 }}>inclui limpeza</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24, padding: '16px 20px', background: '#eff6ff', borderRadius: 12, border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>🎯 Preços por Temporada</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { label: 'Normal', mult: 1 },
                { label: 'Alta (Verão/Julho)', mult: 1.5 },
                { label: 'Feriados (Natal/Réveillon)', mult: 2.2 },
              ].map(t => (
                <div key={t.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #dbeafe' }}>
                  <span style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: 500 }}>{t.label}</span>
                  <span style={{ fontWeight: 800, color: '#1e40af' }}>R$ {(prop.basePricePerNight * t.mult).toLocaleString('pt-BR')}/noite</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Descrição */}
      {activeTab === 'descricao' && (
        <div>
          <label style={labelStyle}>Descrição Completa do Imóvel</label>
          <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: 8 }}>Use emojis para destacar pontos especiais. A descrição aparece na página pública do imóvel.</p>
          <textarea
            value={prop.description}
            onChange={e => update('description', e.target.value)}
            rows={20}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.8, fontSize: '0.9rem' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.78rem', color: '#94a3b8' }}>
            <span>{prop.description.length} caracteres</span>
            <span>{prop.description.split('\n').length} linhas</span>
          </div>
        </div>
      )}

      {/* Tab: Comodidades */}
      {activeTab === 'comodidades' && (
        <div>
          <label style={labelStyle}>Comodidades & Diferenciais ({prop.features.length} itens)</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {prop.features.map((feat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '10px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                <span style={{ flex: 1, fontSize: '0.9rem', color: '#334155' }}>{feat}</span>
                <button
                  onClick={() => removeFeature(i)}
                  style={{ background: '#fef2f2', border: 'none', color: '#ef4444', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={newFeature}
              onChange={e => setNewFeature(e.target.value)}
              placeholder="Ex: Piscina Privativa, Churrasqueira, Wi-Fi..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && addFeature()}
            />
            <button onClick={addFeature} style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
              + Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Tab: Fotos */}
      {activeTab === 'fotos' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <label style={{ ...labelStyle, margin: 0 }}>Galeria de Fotos ({prop.images.length} imagens)</label>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>A 1ª foto é a capa do card</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {prop.images.map((img, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', padding: '8px 12px', borderRadius: 8, border: i === 0 ? '2px solid #2563eb' : '1px solid #e2e8f0' }}>
                <img src={img} alt="" style={{ width: 70, height: 50, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} loading="lazy" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 700, marginBottom: 2 }}>
                    {i === 0 ? '⭐ CAPA' : `Foto ${i + 1}`}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{img}</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => moveImage(i, i - 1)} disabled={i === 0} style={{ background: i === 0 ? '#f1f5f9' : '#e2e8f0', border: 'none', padding: '6px 8px', borderRadius: 6, cursor: i === 0 ? 'not-allowed' : 'pointer', color: '#475569', fontWeight: 700 }}>↑</button>
                  <button onClick={() => moveImage(i, i + 1)} disabled={i === prop.images.length - 1} style={{ background: i === prop.images.length - 1 ? '#f1f5f9' : '#e2e8f0', border: 'none', padding: '6px 8px', borderRadius: 6, cursor: i === prop.images.length - 1 ? 'not-allowed' : 'pointer', color: '#475569', fontWeight: 700 }}>↓</button>
                  <button onClick={() => removeImage(i)} style={{ background: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#ef4444', fontWeight: 700 }}>✕</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={newImage}
              onChange={e => setNewImage(e.target.value)}
              placeholder="/nome-da-foto.jpeg  ou  https://..."
              style={{ ...inputStyle, flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && addImage()}
            />
            <button onClick={addImage} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              + Adicionar Foto
            </button>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 8 }}>
            Para fotos locais, coloque o arquivo na pasta <code>/public</code> e use o caminho <code>/nome-do-arquivo.jpeg</code>
          </p>
        </div>
      )}

      {/* Salvar bottom */}
      <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <a href="/admin/properties" style={{ padding: '11px 20px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
          Cancelar
        </a>
        <button onClick={handleSave} style={{ padding: '11px 28px', borderRadius: 8, border: 'none', background: saved ? '#10b981' : '#0f172a', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.3s' }}>
          {saved ? '✅ Alterações Salvas!' : '💾 Salvar Todas as Alterações'}
        </button>
      </div>
    </div>
  );
}
