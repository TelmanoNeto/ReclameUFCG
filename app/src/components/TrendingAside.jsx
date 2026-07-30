import { useNavigate } from 'react-router-dom';
import { TRENDING_META } from '../data.js';
import { useApp } from '../AppContext.jsx';

export default function TrendingAside() {
  const navigate = useNavigate();
  const { isLogged } = useApp();

  return (
    <div className="aside">
      <div className="mono">Em alta esta semana</div>
      {TRENDING_META.map((t) => (
        <div key={t.id} className="card clickable" style={{ padding: 12, gap: 6 }} onClick={() => navigate(`/relato/${t.id}`)}>
          <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>{t.titulo}</div>
          <div style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--ink-mute)' }}>{t.motivo}</div>
          <div className="mono" style={{ color: 'var(--warn-ink)', letterSpacing: 0 }}>{t.relatos}</div>
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
