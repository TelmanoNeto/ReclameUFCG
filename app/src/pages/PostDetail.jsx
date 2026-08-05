import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, useComentarios } from '../AppContext.jsx';
import { initials } from '../time.js';
import { MOTIVOS_DENUNCIA } from '../data.js';
import PhotoGrid from '../components/PhotoGrid.jsx';
import { StatusBadge, StatusPicker } from '../components/StatusBadge.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    allPosts, feedCarregando, upsOf, isUpped, toggleUp, postComment, isLogged, openGate,
    canChangeStatus, setPostStatus, similaresDe, tituloDoTopico, denunciar, jaDenunciou, revisaoDe
  } = useApp();
  const [commentText, setCommentText] = useState('');
  const [formDenuncia, setFormDenuncia] = useState(false);
  const comments = useComentarios(id);

  const post = allPosts.find((p) => p.id === id);
  if (!post) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>
        <div className="empty-state">{feedCarregando ? 'Carregando relato…' : 'Esse relato não existe mais.'}</div>
      </div>
    );
  }

  const ups = upsOf(post);
  const upped = isUpped(post.id);
  const inic = initials(post.autor);
  const similares = similaresDe(post);
  const denunciado = jaDenunciou(post.id);
  const revisao = revisaoDe(post);

  async function handlePostComment() {
    if (openGate('comentar')) return;
    const texto = commentText;
    setCommentText('');
    await postComment(post.id, texto);
  }

  async function enviarDenuncia(motivoId) {
    if (await denunciar(post.id, motivoId)) setFormDenuncia(false);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>

      {revisao && (
        <div className="revisao-aviso" role="status">
          <strong>Este relato está em revisão.</strong>{' '}
          {revisao.urgente
            ? 'Alguém sinalizou que ele expõe dado pessoal de outra pessoa.'
            : `${revisao.total} pessoas sinalizaram este relato para revisão.`}{' '}
          Ele continua visível, mas saiu do “Em alta” até a equipe do projeto avaliar.{' '}
          <button className="link-inline" onClick={() => navigate('/regras')}>Ver as regras</button>
        </div>
      )}

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
        {similares.length > 0 && (
          <div className="topico-box">
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--warn-ink)' }}>
              {similares.length === 1
                ? 'Há outro relato do mesmo tipo neste bloco'
                : `Há outros ${similares.length} relatos do mesmo tipo neste bloco`}
            </div>
            <div className="mono" style={{ letterSpacing: 0 }}>{tituloDoTopico(post)}</div>
            {similares.map((s) => (
              <button key={s.id} type="button" className="topico-item" onClick={() => navigate(`/relato/${s.id}`)}>
                <span style={{ flex: 1 }}>{s.titulo}</span>
                <span className="mono" style={{ letterSpacing: 0 }}>▲ {upsOf(s)}</span>
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', borderTop: '1px solid #EDEAE2', paddingTop: 14 }}>
          <button className={`up-btn big ${upped ? 'on' : ''}`} onClick={() => toggleUp(post.id)}>▲ Apoiar · {ups}</button>
          <div className="mono" style={{ letterSpacing: 0 }}>{comments.length} comentários</div>
          <span style={{ flex: 1 }} />
          {isLogged && !denunciado && (
            <button
              className="btn secondary"
              style={{ height: 32, padding: '0 12px', fontSize: 12.5, color: 'var(--label)' }}
              onClick={() => setFormDenuncia((v) => !v)}
            >
              ⚑ Denunciar
            </button>
          )}
        </div>
        {formDenuncia && !denunciado && (
          <div className="denuncia-form">
            <div className="field-label">Por que este relato deve ser revisado?</div>
            {MOTIVOS_DENUNCIA.map((m) => (
              <button key={m.id} type="button" className="denuncia-opcao" onClick={() => enviarDenuncia(m.id)}>
                {m.label}
              </button>
            ))}
            <button className="btn ghost" style={{ height: 32, fontSize: 12.5 }} onClick={() => setFormDenuncia(false)}>
              Cancelar
            </button>
          </div>
        )}
        {denunciado && (
          <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', background: '#F5F2EB', borderRadius: 8, padding: '9px 11px' }}>
            Você denunciou este relato. Ele só entra em revisão quando outras pessoas denunciarem também —{' '}
            <button className="link-inline" onClick={() => navigate('/regras')}>veja como funciona</button>.
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
