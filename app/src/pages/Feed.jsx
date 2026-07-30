import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CATS, CAMPI, CURSOS } from '../data.js';
import PostCard from '../components/PostCard.jsx';

export default function Feed() {
  const { allPosts } = useApp();
  const navigate = useNavigate();
  const { query } = useOutletContext();
  const [cat, setCat] = useState('Todas');
  const [campus, setCampus] = useState('Todos os campi');
  const [curso, setCurso] = useState('Todos os cursos');

  const feed = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPosts.filter(
      (c) =>
        (cat === 'Todas' || c.cat === cat) &&
        (campus === 'Todos os campi' || c.campus === campus) &&
        (curso === 'Todos os cursos' || c.curso === curso) &&
        (!q || (c.titulo + ' ' + c.texto + ' ' + c.local + ' ' + c.cat).toLowerCase().includes(q))
    );
  }, [allPosts, cat, campus, curso, query]);

  const feedCount =
    feed.length + (feed.length === 1 ? ' relato' : ' relatos') + (cat === 'Todas' && !query ? ' · mais recentes primeiro' : ' · filtrado');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        <button className="tab on">Recentes</button>
        <button className="tab" onClick={() => navigate('/em-alta')}>Em alta</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="mono">Filtros</div>
        <div className="filters-row">
          {['Todas'].concat(CATS).map((c) => (
            <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="filters-row">
          <select className="select-inline" value={campus} onChange={(e) => setCampus(e.target.value)}>
            {['Todos os campi'].concat(CAMPI).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <select className="select-inline" value={curso} onChange={(e) => setCurso(e.target.value)}>
            {['Todos os cursos'].concat(CURSOS).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mono" style={{ letterSpacing: 0 }}>{feedCount}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {feed.map((c) => (
          <PostCard key={c.id} post={c} />
        ))}
        {feed.length === 0 && <div className="empty-state">Nenhum relato encontrado com esses filtros.</div>}
      </div>
    </div>
  );
}
