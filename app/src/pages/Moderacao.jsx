import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { useApp } from '../AppContext.jsx';
import { db, firebaseConfigurado } from '../firebase.js';
import { motivoInfo, MOTIVOS_DENUNCIA } from '../data.js';

/**
 * Lista dos relatos denunciados, para quem tem documento em /admins.
 *
 * Os motivos são lidos aqui com getDocs, e não com um listener: a tela é
 * consultada de vez em quando, por uma ou duas pessoas, e um listener sobre
 * todas as denúncias do banco ficaria aberto à toa.
 */
export default function Moderacao() {
  const { ehAdmin, isLogged, authCarregando, allPosts, revisaoDe, deletePost, upsOf } = useApp();
  const navigate = useNavigate();
  const [motivosPorRelato, setMotivosPorRelato] = useState({});
  const [carregando, setCarregando] = useState(true);

  const denunciados = allPosts
    .filter((p) => p.nDenuncias > 0)
    .sort((a, b) => b.nDenuncias - a.nDenuncias);

  useEffect(() => {
    if (!ehAdmin || !firebaseConfigurado) return;
    let vivo = true;
    (async () => {
      try {
        const snap = await getDocs(collectionGroup(db, 'denuncias'));
        if (!vivo) return;
        const mapa = {};
        snap.docs.forEach((d) => {
          const relatoId = d.ref.parent.parent.id;
          (mapa[relatoId] = mapa[relatoId] || []).push(d.data().motivo);
        });
        setMotivosPorRelato(mapa);
      } finally {
        if (vivo) setCarregando(false);
      }
    })();
    return () => {
      vivo = false;
    };
  }, [ehAdmin]);

  if (authCarregando) return <div className="empty-state">Carregando…</div>;

  if (!isLogged || !ehAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>
        <div className="empty-state">Esta tela é restrita à equipe do projeto.</div>
      </div>
    );
  }

  function contarMotivos(relatoId) {
    const lista = motivosPorRelato[relatoId] || [];
    return MOTIVOS_DENUNCIA.map((m) => ({
      ...m,
      total: lista.filter((x) => x === m.id).length
    })).filter((m) => m.total > 0);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button className="back-link" onClick={() => navigate('/')}>← voltar ao feed</button>
      <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em' }}>Moderação</div>
      <div style={{ fontSize: 13, color: 'var(--ink-mute)' }}>
        Relatos que receberam pelo menos uma denúncia. Entrar em revisão é automático; excluir é sempre decisão manual.
      </div>

      {denunciados.length === 0 && <div className="empty-state">Nenhum relato denunciado até agora.</div>}

      {denunciados.map((p) => {
        const revisao = revisaoDe(p);
        const motivos = contarMotivos(p.id);
        return (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge-cat">{p.cat}</span>
              {revisao && <span className="badge-revisao">⚑ em revisão</span>}
              <span className="mono" style={{ letterSpacing: 0 }}>{p.local}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.32 }}>{p.titulo}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{p.autor}</div>

            <div className="mono" style={{ letterSpacing: 0 }}>
              {p.nDenuncias} denúncia(s) · limiar {revisao ? revisao.limiar : '—'} · ▲ {upsOf(p)}
            </div>

            <div style={{ fontSize: 12.5, color: 'var(--ink-mute)', lineHeight: 1.6 }}>
              {carregando && 'carregando motivos…'}
              {!carregando && motivos.length === 0 && 'motivos indisponíveis'}
              {!carregando &&
                motivos.map((m) => (
                  <div key={m.id}>
                    {m.total}× {motivoInfo(m.id).label}
                    {m.urgente ? ' (urgente)' : ''}
                  </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn secondary"
                style={{ height: 32, padding: '0 12px', fontSize: 12.5 }}
                onClick={() => navigate(`/relato/${p.id}`)}
              >
                Abrir relato
              </button>
              <button
                className="btn secondary"
                style={{
                  height: 32,
                  padding: '0 12px',
                  fontSize: 12.5,
                  background: 'var(--danger-bg)',
                  borderColor: 'var(--danger-border)',
                  color: 'var(--danger-ink)'
                }}
                onClick={() => {
                  if (window.confirm(`Excluir definitivamente o relato "${p.titulo}"?`)) deletePost(p.id);
                }}
              >
                Excluir relato
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
