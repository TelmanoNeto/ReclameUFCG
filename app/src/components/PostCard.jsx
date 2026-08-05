import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import PhotoGrid from './PhotoGrid.jsx';
import { StatusBadge } from './StatusBadge.jsx';

export default function PostCard({ post }) {
  const { upsOf, isUpped, toggleUp, similaresDe, revisaoDe } = useApp();
  const navigate = useNavigate();
  const ups = upsOf(post);
  const upped = isUpped(post.id);
  // Contagem vem do espelho no próprio relato: carregar os comentários de cada
  // card do feed custaria uma leitura por comentário exibido, à toa.
  const nComentarios = post.nComentarios || 0;
  const nSimilares = similaresDe(post).length;
  const emRevisao = !!revisaoDe(post);

  function open() {
    navigate(`/relato/${post.id}`);
  }

  return (
    <div className="card clickable" onClick={open}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span className="badge-cat">{post.cat}</span>
        <StatusBadge status={post.status} />
        {emRevisao && <span className="badge-revisao">⚑ em revisão</span>}
        <span className="mono" style={{ letterSpacing: 0 }}>{post.local}</span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ color: 'var(--label-soft)', letterSpacing: 0 }}>{post.quando}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.01em' }}>{post.titulo}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{post.resumo}</div>
      <PhotoGrid fotos={post.fotos} cat={post.cat} />
      {nSimilares > 0 && (
        <div className="similar-pill">
          + {nSimilares} {nSimilares === 1 ? 'relato semelhante' : 'relatos semelhantes'} neste bloco
        </div>
      )}
      <div className="post-footer">
        <button
          className={`up-btn ${upped ? 'on' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleUp(post.id);
          }}
        >
          ▲ {ups}
        </button>
        <button className="comment-btn" onClick={open}>💬 {nComentarios}</button>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: 'var(--label)' }}>{post.autor}</span>
      </div>
    </div>
  );
}
