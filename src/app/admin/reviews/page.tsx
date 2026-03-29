'use client';
import { useState, useEffect } from 'react';
import { PROPERTIES } from '@/lib/properties-data';
import {
  type Review,
  loadReviews,
  saveReviews,
  getReviewsBySlug,
  getAverageRating,
  generateId,
} from '@/lib/reviews-data';

const STAR_LABELS = ['', 'Péssimo', 'Ruim', 'Regular', 'Bom', 'Excelente'];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            fontSize: '1.6rem', color: s <= (hover || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.1s, transform 0.1s',
            transform: s <= (hover || value) ? 'scale(1.15)' : 'scale(1)',
          }}
        >★</button>
      ))}
      {(hover || value) > 0 && (
        <span style={{ alignSelf: 'center', fontSize: '0.82rem', color: '#64748b', marginLeft: 4 }}>
          {STAR_LABELS[hover || value]}
        </span>
      )}
    </div>
  );
}

const EMPTY_FORM = { guest: '', rating: 5, date: '', comment: '', propertySlug: '' };

export default function ReviewsPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [filterSlug, setFilterSlug] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Review | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM, propertySlug: PROPERTIES[0].slug });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setAllReviews(loadReviews()); }, []);

  const filtered = filterSlug === 'todos'
    ? allReviews
    : getReviewsBySlug(allReviews, filterSlug);

  const avg = allReviews.length
    ? (allReviews.reduce((a, r) => a + r.rating, 0) / allReviews.length).toFixed(1)
    : '0.0';

  const openAdd = () => {
    setEditTarget(null);
    const slug = filterSlug !== 'todos' ? filterSlug : PROPERTIES[0].slug;
    setForm({ guest: '', rating: 5, date: currentDateLabel(), comment: '', propertySlug: slug });
    setShowModal(true);
  };

  const openEdit = (r: Review) => {
    setEditTarget(r);
    setForm({ guest: r.guest, rating: r.rating, date: r.date, comment: r.comment, propertySlug: r.propertySlug });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.guest.trim() || !form.comment.trim() || !form.date.trim()) return;
    let updated: Review[];
    if (editTarget) {
      updated = allReviews.map(r => r.id === editTarget.id ? { ...r, ...form } : r);
    } else {
      const newReview: Review = { id: generateId(), ...form };
      updated = [newReview, ...allReviews];
    }
    saveReviews(updated);
    setAllReviews(updated);
    setShowModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = allReviews.filter(r => r.id !== id);
    saveReviews(updated);
    setAllReviews(updated);
    setDeleteConfirm(null);
  };

  const propName = (slug: string) => PROPERTIES.find(p => p.slug === slug)?.city ?? slug;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>Avaliações dos Hóspedes</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.88rem' }}>
            Média geral: <strong style={{ color: '#f59e0b' }}>{'★'.repeat(Math.round(Number(avg)))} {avg}/5</strong>
            {' '}· {allReviews.length} avaliação{allReviews.length !== 1 ? 'ões' : ''}
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
        >
          + Adicionar Review
        </button>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total', value: allReviews.length, color: '#2563eb' },
          { label: 'Nota Média', value: avg + ' ★', color: '#f59e0b' },
          { label: 'Nota 5 ★', value: allReviews.filter(r => r.rating === 5).length, color: '#10b981' },
          { label: 'Imóveis', value: new Set(allReviews.map(r => r.propertySlug)).size, color: '#7c3aed' },
        ].map((k, i) => (
          <div key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{k.label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* ── Filtros por imóvel ── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterSlug('todos')}
          style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: filterSlug === 'todos' ? '#2563eb' : '#e2e8f0', background: filterSlug === 'todos' ? '#eff6ff' : 'white', color: filterSlug === 'todos' ? '#2563eb' : '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
        >
          Todos ({allReviews.length})
        </button>
        {PROPERTIES.map(p => {
          const count = getReviewsBySlug(allReviews, p.slug).length;
          return (
            <button
              key={p.slug}
              onClick={() => setFilterSlug(p.slug)}
              style={{ padding: '7px 14px', borderRadius: 20, border: '1px solid', borderColor: filterSlug === p.slug ? '#2563eb' : '#e2e8f0', background: filterSlug === p.slug ? '#eff6ff' : 'white', color: filterSlug === p.slug ? '#2563eb' : '#475569', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              {p.city} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Notificação salvo ── */}
      {saved && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, padding: '10px 16px', marginBottom: 16, color: '#166534', fontWeight: 600, fontSize: '0.88rem' }}>
          ✅ Salvo com sucesso!
        </div>
      )}

      {/* ── Lista de reviews ── */}
      <div style={{ display: 'grid', gap: 14 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
            Nenhum review encontrado. Clique em &quot;+ Adicionar Review&quot;.
          </div>
        )}
        {filtered.map(r => (
          <div key={r.id} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            {/* Avatar */}
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
              {r.guest.charAt(0)}
            </div>
            {/* Conteúdo */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>{r.guest}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: 8 }}>{r.date}</span>
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                    📍 {propName(r.propertySlug)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 1 }}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= r.rating ? '#f59e0b' : '#e2e8f0', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
              </div>
              <p style={{ margin: '0 0 12px 0', color: '#334155', fontSize: '0.9rem', lineHeight: 1.65, fontStyle: 'italic' }}>
                &ldquo;{r.comment}&rdquo;
              </p>
              {/* Ações */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => openEdit(r)}
                  style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#2563eb', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}
                >
                  ✏️ Editar
                </button>
                {deleteConfirm === r.id ? (
                  <>
                    <button onClick={() => handleDelete(r.id)} style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                      Confirmar exclusão
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: 'white', color: '#64748b', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button onClick={() => setDeleteConfirm(r.id)} style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #fee2e2', background: 'white', color: '#ef4444', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
                    🗑️ Excluir
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Modal Adicionar/Editar ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 520, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 24px 0', fontWeight: 800, color: '#0f172a', fontSize: '1.2rem' }}>
              {editTarget ? '✏️ Editar Review' : '➕ Novo Review'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Imóvel */}
              <div>
                <label style={labelStyle}>Imóvel</label>
                <select
                  value={form.propertySlug}
                  onChange={e => setForm(f => ({ ...f, propertySlug: e.target.value }))}
                  style={inputStyle}
                >
                  {PROPERTIES.map(p => (
                    <option key={p.slug} value={p.slug}>{p.city} — {p.title.slice(0, 40)}...</option>
                  ))}
                </select>
              </div>

              {/* Nome do hóspede */}
              <div>
                <label style={labelStyle}>Nome do hóspede</label>
                <input
                  style={inputStyle}
                  placeholder="Ex: Maria S."
                  value={form.guest}
                  onChange={e => setForm(f => ({ ...f, guest: e.target.value }))}
                />
              </div>

              {/* Data */}
              <div>
                <label style={labelStyle}>Período da estadia</label>
                <input
                  style={inputStyle}
                  placeholder="Ex: Mar 2026"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>

              {/* Estrelas */}
              <div>
                <label style={labelStyle}>Avaliação</label>
                <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
              </div>

              {/* Comentário */}
              <div>
                <label style={labelStyle}>Comentário do hóspede</label>
                <textarea
                  style={{ ...inputStyle, height: 100, resize: 'vertical' }}
                  placeholder="O que o hóspede disse sobre a estadia..."
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.guest.trim() || !form.comment.trim() || !form.date.trim()}
                style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: !form.guest.trim() || !form.comment.trim() || !form.date.trim() ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: !form.guest.trim() || !form.comment.trim() || !form.date.trim() ? '#94a3b8' : 'white', fontWeight: 700, fontSize: '0.9rem', cursor: !form.guest.trim() || !form.comment.trim() || !form.date.trim() ? 'not-allowed' : 'pointer', boxShadow: !form.guest.trim() ? 'none' : '0 4px 12px rgba(37,99,235,0.3)' }}
              >
                {editTarget ? 'Salvar alterações' : 'Adicionar Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.8rem', fontWeight: 700,
  color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0',
  fontSize: '0.9rem', color: '#111', background: 'white', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit',
};

function currentDateLabel(): string {
  const d = new Date();
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
