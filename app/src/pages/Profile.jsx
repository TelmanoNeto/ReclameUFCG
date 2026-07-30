import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { initials } from '../time.js';

export default function Profile() {
  const { isLogged, currentUser, logout, myPosts, myComments, upsOf, commentsOf, editPost, deletePost, deleteComment } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState('relatos');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!isLogged) navigate('/');
  }, [isLogged, navigate]);

  if (!isLogged) return null;

  function startEdit(post) {
    setEditingId(post.id);
    setEditText(post.texto);
  }
  function saveEdit(id) {
    editPost(id, editText);
    setEditingId(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div className="avatar" style={{ width: 52, height: 52, fontSize: 18 }}>{initials(currentUser.nome)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>{currentUser.nome}</div>
          <div className="mono" style={{ letterSpacing: 0 }}>{currentUser.curso} · {currentUser.campus} · {currentUser.periodo}</div>
        </div>
        <span style={{ flex: 1 }} />
        <button className="btn secondary" style={{ height: 32, padding: '0 12px', fontSize: 12.5 }} onClick={() => { logout(); navigate('/'); }}>Sair</button>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        <button className={`tab ${tab === 'relatos' ? 'on' : ''}`} onClick={() => setTab('relatos')}>Meus relatos</button>
        <button className={`tab ${tab === 'comentarios' ? 'on' : ''}`} onClick={() => setTab('comentarios')}>Meus comentários</button>
      </div>

      {tab === 'relatos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myPosts.length === 0 && <div className="empty-state">Você ainda não publicou nenhum relato.</div>}
          {myPosts.map((p) => {
            const editando = editingId === p.id;
            return (
              <div key={p.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge-cat">{p.cat}</span>
                  <span className="mono" style={{ letterSpacing: 0 }}>{p.local}</span>
                  <span style={{ flex: 1 }} />
                  <span
                    className="mono"
                    style={{
                      letterSpacing: 0,
                      color: p.autor === 'Anônimo' ? 'var(--ink-mute)' : 'var(--label)',
                      background: p.autor === 'Anônimo' ? 'var(--bg)' : 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 999,
                      padding: '3px 8px'
                    }}
                  >
                    {p.autor === 'Anônimo' ? 'anônimo' : 'público'}
                  </span>
                </div>
                {editando ? (
                  <textarea className="input" value={editText} onChange={(e) => setEditText(e.target.value)} style={{ minHeight: 84 }} />
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.32 }}>{p.titulo}</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }} className="mono">
                  <span style={{ letterSpacing: 0 }}>▲ {upsOf(p)}</span>
                  <span style={{ letterSpacing: 0 }}>💬 {commentsOf(p.id).length}</span>
                  <span style={{ flex: 1 }} />
                  {editando ? (
                    <button className="btn" style={{ height: 30, padding: '0 12px', fontSize: 12 }} onClick={() => saveEdit(p.id)}>Salvar</button>
                  ) : (
                    <button className="btn secondary" style={{ height: 30, padding: '0 11px', fontSize: 12 }} onClick={() => startEdit(p)}>Editar</button>
                  )}
                  <button
                    className="btn secondary"
                    style={{ height: 30, padding: '0 11px', fontSize: 12, background: 'var(--danger-bg)', borderColor: 'var(--danger-border)', color: 'var(--danger-ink)' }}
                    onClick={() => deletePost(p.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'comentarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myComments.length === 0 && <div className="empty-state">Você ainda não comentou em nenhum relato.</div>}
          {myComments.map((mc) => (
            <div key={mc.id} className="card">
              <div className="mono" style={{ letterSpacing: 0 }}>em "{mc.em}"</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55, color: '#3D4753' }}>{mc.texto}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }} className="mono">
                <span style={{ letterSpacing: 0, color: 'var(--label-soft)' }}>{mc.quando}</span>
                <span style={{ flex: 1 }} />
                <button
                  className="btn secondary"
                  style={{ height: 30, padding: '0 11px', fontSize: 12, background: 'var(--danger-bg)', borderColor: 'var(--danger-border)', color: 'var(--danger-ink)' }}
                  onClick={() => deleteComment(mc.id)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
