import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

export default function Trending() {
  const navigate = useNavigate();
  const { topicosEmAlta, tituloDoTopico } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        <button className="tab" onClick={() => navigate('/')}>Recentes</button>
        <button className="tab on">Em alta</button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>
        Tópicos com mais de um relato do mesmo tipo, no mesmo bloco. Ordenados pelo total de apoios.
      </div>

      {topicosEmAlta.length === 0 && (
        <div className="empty-state">
          Ainda não há tópicos em alta. Um tópico aparece aqui quando dois ou mais relatos da mesma categoria
          são publicados no mesmo bloco.
        </div>
      )}

      {topicosEmAlta.map((t, i) => (
        <div
          key={t.chave}
          className="card clickable"
          style={{ flexDirection: 'row', gap: 14 }}
          onClick={() => navigate(`/relato/${t.principal.id}`)}
        >
          <div className="trend-rank">{String(i + 1).padStart(2, '0')}</div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge-cat">{t.principal.cat}</span>
              <StatusBadge status={t.principal.status} />
              <span className="mono" style={{ letterSpacing: 0 }}>{t.principal.campus}</span>
            </div>
            <div style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
              {tituloDoTopico(t.principal)}
            </div>
            <div className="trend-reason">
              Relato mais apoiado do tópico: “{t.principal.titulo}”.
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }} className="mono">
              <span style={{ color: 'var(--warn-ink)', background: 'var(--warn-bg)', border: '1px solid var(--warn-border)', borderRadius: 8, padding: '4px 8px', letterSpacing: 0, textTransform: 'none' }}>
                {t.relatos} relatos agrupados
              </span>
              <span style={{ letterSpacing: 0, textTransform: 'none' }}>▲ {t.ups}</span>
              <span style={{ letterSpacing: 0, textTransform: 'none' }}>💬 {t.comentarios}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
