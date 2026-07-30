import { useNavigate } from 'react-router-dom';
import { TRENDING_META } from '../data.js';
import { useApp } from '../AppContext.jsx';

export default function Trending() {
  const navigate = useNavigate();
  const { upsOf, allPosts } = useApp();

  const trending = TRENDING_META.map((t, i) => {
    const post = allPosts.find((p) => p.id === t.id);
    return { ...t, rank: String(i + 1).padStart(2, '0'), ups: post ? upsOf(post) : 0, cat: post ? post.cat : '', campus: post ? post.campus : '' };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        <button className="tab" onClick={() => navigate('/')}>Recentes</button>
        <button className="tab on">Em alta</button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>
        Tópicos com mais apoios e comentários nos últimos 7 dias. Relatos parecidos aparecem agrupados.
      </div>

      {trending.map((t) => (
        <div key={t.id} className="card clickable" style={{ flexDirection: 'row', gap: 14 }} onClick={() => navigate(`/relato/${t.id}`)}>
          <div className="trend-rank">{t.rank}</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge-cat">{t.cat}</span>
              <span className="mono" style={{ letterSpacing: 0 }}>{t.campus}</span>
            </div>
            <div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{t.titulo}</div>
            <div className="trend-reason">{t.motivo}</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }} className="mono">
              <span style={{ color: 'var(--warn-ink)', background: 'var(--warn-bg)', border: '1px solid var(--warn-border)', borderRadius: 8, padding: '4px 8px', letterSpacing: 0, textTransform: 'none' }}>
                {t.relatos}
              </span>
              <span style={{ letterSpacing: 0, textTransform: 'none' }}>▲ {t.ups}</span>
              <span style={{ letterSpacing: 0, textTransform: 'none' }}>💬 {t.coments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
