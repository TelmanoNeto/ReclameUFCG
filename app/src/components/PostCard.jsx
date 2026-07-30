import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import CategoryIllustration from './CategoryIllustration.jsx';

export default function PostCard({ post }) {
  const { upsOf, isUpped, toggleUp, commentsOf } = useApp();
  const navigate = useNavigate();
  const ups = upsOf(post);
  const upped = isUpped(post.id);
  const nComentarios = commentsOf(post.id).length;

  function open() {
    navigate(`/relato/${post.id}`);
  }

  return (
    <div className="card clickable" onClick={open}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span className="badge-cat">{post.cat}</span>
        <span className="mono" style={{ letterSpacing: 0 }}>{post.local}</span>
        <span style={{ flex: 1 }} />
        <span className="mono" style={{ color: 'var(--label-soft)', letterSpacing: 0 }}>{post.quando}</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.32, letterSpacing: '-0.01em' }}>{post.titulo}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{post.resumo}</div>
      {post.foto && (
        <div className="post-photo" style={{ position: 'relative', padding: 0 }}>
          <CategoryIllustration cat={post.cat} />
          {post.fotoLabel && <div className="photo-caption">{post.fotoLabel}</div>}
        </div>
      )}
      {post.similares > 0 && (
        <div className="similar-pill">{post.similares} relatos semelhantes agrupados neste tópico</div>
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
