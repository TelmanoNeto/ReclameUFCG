import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { initials } from '../time.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import { StatusBadge, StatusPicker } from '../components/StatusBadge.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allPosts, upsOf, isUpped, toggleUp, commentsOf, postComment, isLogged, openGate, flash, canChangeStatus, setPostStatus } = useApp();
  const [commentText, setCommentText] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const post = allPosts.find((p) => p.id === id);
  if (!post) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>
        <div className="empty-state">Esse relato não existe mais.</div>
      </div>
    );
  }

  const ups = upsOf(post);
  const upped = isUpped(post.id);
  const comments = commentsOf(post.id);
  const inic = initials(post.autor);

  function handlePostComment() {
    if (!isLogged) {
      openGate('comentar');
      return;
    }
    postComment(post.id, commentText);
    setCommentText('');
  }

  function denunciar() {
    setReportDone(true);
    flash('Denúncia registrada');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>

      <div className="card" style={{ padding: 18, gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge-cat">{post.cat}</span>
          <StatusBadge status={post.status} />
          <span className="mono" style={{ letterSpacing: 0 }}>{post.local}</span>
          <span style={{ flex: 1 }} />
          <span className="mono" style={{ color: 'var(--label-soft)', letterSpacing: 0 }}>{post.quando}</span>
        </div>
        <div style={{ fontSize: 23, fontWeight: 700, lineHeight: 1.22, letterSpacing: '-0.02em' }}>{post.titulo}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div className="mini-avatar">{inic}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{post.autor}</div>
        </div>
        <PhotoGrid fotos={post.fotos} cat={post.cat} detail />
        <div style={{ fontSize: 15, lineHeight: 1.65, color: '#2E3742', whiteSpace: 'pre-line' }}>{post.texto}</div>
        {canChangeStatus(post) && (
          <div className="status-owner-box">
            <StatusPicker status={post.status} onChange={(s) => setPostStatus(post, s)} />
          </div>
        )}
        {post.similares > 0 && (
          <div className="similar-pill" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }} onClick={() => navigate('/em-alta')}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--warn-ink)' }}>
              {post.similares} relatos semelhantes foram agrupados aqui
            </div>
            <div style={{ fontSize: 12.5, color: '#9A6E2A' }}>Ver os relatos agrupados neste tópico →</div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #EDEAE2', paddingTop: 14 }}>
          <button className={`up-btn big ${upped ? 'on' : ''}`} onClick={() => toggleUp(post.id)}>▲ Apoiar · {ups}</button>
          <div className="mono" style={{ letterSpacing: 0 }}>{comments.length} comentários</div>
          <span style={{ flex: 1 }} />
          {isLogged && (
            <button className="btn secondary" style={{ height: 32, padding: '0 12px', fontSize: 12.5, color: 'var(--label)' }} onClick={denunciar}>
              ⚑ Denunciar
            </button>
          )}
        </div>
        {reportDone && (
          <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', background: '#F5F2EB', borderRadius: 8, padding: '9px 11px' }}>
            Denúncia enviada para revisão da comunidade.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="mono">Comentários</div>

        {isLogged ? (
          <div className="card" style={{ padding: 12 }}>
            <textarea
              className="input"
              style={{ border: 0, minHeight: 58 }}
              placeholder="Escreva um comentário…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn" style={{ height: 34, fontSize: 13 }} onClick={handlePostComment}>Comentar</button>
            </div>
          </div>
        ) : (
          <div
            className="card"
            style={{ border: '1px dashed #D5D0C4', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => openGate('comentar')}
          >
            <div style={{ fontSize: 13.5, color: 'var(--ink-mute)' }}>Entre para comentar. Ler é livre.</div>
            <div className="btn" style={{ height: 32, padding: '0 14px', borderRadius: 999, background: 'var(--ink)', border: 'none', fontSize: 12.5, whiteSpace: 'nowrap' }}>
              Entrar
            </div>
          </div>
        )}

        {comments.map((k) => (
          <div key={k.id} style={{ display: 'flex', gap: 11, padding: '2px 0' }}>
            <div className="mini-avatar">{k.iniciais}</div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{k.autor}</span>
                <span className="mono" style={{ letterSpacing: 0 }}>{k.quando}</span>
              </div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3D4753' }}>{k.texto}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
