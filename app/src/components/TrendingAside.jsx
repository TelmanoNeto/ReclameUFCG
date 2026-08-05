import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';

export default function TrendingAside() {
  const navigate = useNavigate();
  const { isLogged, topicosEmAlta, tituloDoTopico } = useApp();

  return (
    <div className="aside">
      <div className="mono">Em alta</div>
      {topicosEmAlta.length === 0 && (
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--ink-mute)' }}>
          Nenhum tópico agrupado ainda.
        </div>
      )}
      {topicosEmAlta.slice(0, 4).map((t) => (
        <div
          key={t.chave}
          className="card clickable"
          style={{ padding: 12, gap: 6 }}
          onClick={() => navigate(`/relato/${t.principal.id}`)}
        >
          <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>{tituloDoTopico(t.principal)}</div>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--ink-mute)' }}>{t.principal.titulo}</div>
          <div className="mono" style={{ color: 'var(--warn-ink)', letterSpacing: 0 }}>
            {t.relatos} relatos · ▲ {t.ups}
          </div>
        </div>
      ))}
      {!isLogged && (
        <div className="cta-card">
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>Viu um problema no seu bloco?</div>
          <div style={{ fontSize: 12.5, lineHeight: 1.5, color: '#B7BEC7' }}>Criar conta leva um minuto e serve para publicar, apoiar e comentar.</div>
          <button className="btn" onClick={() => navigate('/cadastro')}>Criar conta</button>
        </div>
      )}
    </div>
  );
}
