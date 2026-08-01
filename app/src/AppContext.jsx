import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { POSTS, STATUS_PADRAO, MAX_FOTOS, MATRICULA_DIGITOS, statusInfo } from './data.js';
import { loadState, saveState } from './storage.js';
import { timeAgo, initials, courseAbbrev, somenteDigitos, isEmailUFCG } from './time.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [gate, setGateState] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const currentUser = useMemo(
    () => state.users.find((u) => u.email === state.sessionEmail) || null,
    [state.users, state.sessionEmail]
  );
  const isLogged = !!currentUser;

  function flash(text) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }

  function openGate(action) {
    if (isLogged) return false;
    setGateState(action);
    return true;
  }
  function closeGate() {
    setGateState(null);
  }

  function signup({ nome, email, senha, telefone, matricula, curso, campus, periodo }) {
    const emailNorm = email.trim().toLowerCase();
    if (!isEmailUFCG(emailNorm)) {
      return { ok: false, error: 'Use seu e-mail institucional da UFCG (o domínio precisa conter ".ufcg.").' };
    }
    if (somenteDigitos(matricula).length !== MATRICULA_DIGITOS) {
      return { ok: false, error: `A matrícula precisa ter exatamente ${MATRICULA_DIGITOS} dígitos.` };
    }
    if (state.users.some((u) => u.email === emailNorm)) {
      return { ok: false, error: 'Já existe uma conta com esse e-mail. Tente entrar.' };
    }
    if (state.users.some((u) => u.matricula === matricula)) {
      return { ok: false, error: 'Já existe uma conta com essa matrícula.' };
    }
    const user = { nome: nome.trim(), email: emailNorm, senha, telefone, matricula, curso, campus, periodo };
    setState((s) => ({ ...s, users: s.users.concat(user), sessionEmail: emailNorm }));
    return { ok: true };
  }

  function login(email, senha) {
    const emailNorm = email.trim().toLowerCase();
    const user = state.users.find((u) => u.email === emailNorm);
    if (!user || user.senha !== senha) {
      return { ok: false, error: 'E-mail ou senha incorretos, ou conta inexistente.' };
    }
    setState((s) => ({ ...s, sessionEmail: emailNorm }));
    return { ok: true };
  }

  function logout() {
    setState((s) => ({ ...s, sessionEmail: null }));
  }

  const allPosts = useMemo(
    () =>
      state.createdPosts
        .concat(POSTS)
        .filter((p) => !state.deletedPosts.includes(p.id))
        .map((p) => ({
          ...p,
          // Relatos salvos antes da galeria guardavam só o par foto/fotoLabel.
          fotos: p.fotos || (p.foto ? [{ cat: p.cat, label: p.fotoLabel }] : []),
          status: state.postStatus[p.id] || p.status || STATUS_PADRAO
        })),
    [state.createdPosts, state.deletedPosts, state.postStatus]
  );

  // Só o aluno que cadastrou o relato mexe na situação dele.
  function canChangeStatus(post) {
    return !!post && !!currentUser && !!post.authorEmail && post.authorEmail === currentUser.email;
  }

  function setPostStatus(post, novoStatus) {
    if (!canChangeStatus(post)) {
      flash('Só quem publicou o relato pode alterar a situação');
      return false;
    }
    if (!statusInfo(novoStatus) || statusInfo(novoStatus).id !== novoStatus) {
      return false;
    }
    setState((s) => ({ ...s, postStatus: { ...s.postStatus, [post.id]: novoStatus } }));
    flash(`Situação atualizada para "${statusInfo(novoStatus).curto}"`);
    return true;
  }

  function upsOf(post) {
    return post.ups + (state.ups[post.id] || 0);
  }
  function isUpped(id) {
    return !!state.upset[id];
  }
  function toggleUp(id) {
    if (openGate('apoiar')) return;
    setState((s) => {
      const on = !!s.upset[id];
      return {
        ...s,
        upset: { ...s.upset, [id]: !on },
        ups: { ...s.ups, [id]: (s.ups[id] || 0) + (on ? -1 : 1) }
      };
    });
  }

  function commentsOf(id) {
    const base = (allPosts.find((p) => p.id === id) || {}).comentarios || [];
    const baseWithIds = base.map((c, i) => ({ ...c, id: `${id}-b${i}` }));
    const extra = (state.extraComments[id] || []).map((c) => ({
      ...c,
      quando: timeAgo(c.createdAt)
    }));
    return baseWithIds.concat(extra).filter((c) => !state.deletedComments.includes(c.id));
  }

  function postComment(postId, texto) {
    const t = texto.trim();
    if (!t) return;
    if (openGate('comentar')) return;
    const comment = {
      id: `${postId}-${Date.now()}`,
      autor: `${currentUser.nome} · ${courseAbbrev(currentUser.curso)}`,
      authorEmail: currentUser.email,
      iniciais: initials(currentUser.nome),
      texto: t,
      createdAt: Date.now()
    };
    setState((s) => ({
      ...s,
      extraComments: { ...s.extraComments, [postId]: (s.extraComments[postId] || []).concat(comment) }
    }));
    flash('Comentário publicado');
  }

  function deleteComment(commentId) {
    setState((s) => ({ ...s, deletedComments: s.deletedComments.concat(commentId) }));
    flash('Comentário excluído');
  }

  function createPost({ texto, cat, campus, bloco, sala, fotos }) {
    if (openGate('publicar')) return null;
    const t = texto.trim();
    if (!t) return null;
    const id = 'novo-' + Date.now();
    const titulo = t.split('\n')[0].slice(0, 78);
    const post = {
      id,
      cat: cat || 'Salas de aula',
      campus,
      curso: currentUser.curso,
      local: bloco + (sala ? ' · ' + sala : ''),
      createdAt: Date.now(),
      quando: 'agora',
      ups: 0,
      status: STATUS_PADRAO,
      fotos: (fotos || []).slice(0, MAX_FOTOS),
      similares: 0,
      autor: `${currentUser.nome} · ${courseAbbrev(currentUser.curso)}`,
      authorEmail: currentUser.email,
      titulo,
      resumo: t.slice(0, 150),
      texto: t,
      comentarios: []
    };
    setState((s) => ({ ...s, createdPosts: [post].concat(s.createdPosts) }));
    flash('Relato publicado');
    return id;
  }

  function editPost(id, novoTexto) {
    setState((s) => ({
      ...s,
      createdPosts: s.createdPosts.map((p) =>
        p.id === id
          ? { ...p, texto: novoTexto, titulo: novoTexto.split('\n')[0].slice(0, 78), resumo: novoTexto.slice(0, 150) }
          : p
      )
    }));
    flash('Relato atualizado');
  }

  function deletePost(id) {
    setState((s) => ({ ...s, deletedPosts: s.deletedPosts.concat(id) }));
    flash('Relato excluído');
  }

  const myPosts = useMemo(
    () => (currentUser ? allPosts.filter((p) => p.authorEmail === currentUser.email) : []),
    [allPosts, currentUser]
  );

  const myComments = useMemo(() => {
    if (!currentUser) return [];
    const out = [];
    Object.entries(state.extraComments).forEach(([postId, comments]) => {
      comments.forEach((c) => {
        if (c.authorEmail === currentUser.email && !state.deletedComments.includes(c.id)) {
          const post = allPosts.find((p) => p.id === postId);
          out.push({ ...c, quando: timeAgo(c.createdAt), em: post ? post.titulo : 'relato removido', postId });
        }
      });
    });
    return out.sort((a, b) => b.createdAt - a.createdAt);
  }, [state.extraComments, state.deletedComments, currentUser, allPosts]);

  const value = {
    isLogged,
    currentUser,
    signup,
    login,
    logout,
    allPosts,
    upsOf,
    isUpped,
    toggleUp,
    commentsOf,
    postComment,
    deleteComment,
    createPost,
    editPost,
    deletePost,
    canChangeStatus,
    setPostStatus,
    myPosts,
    myComments,
    gate,
    openGate,
    closeGate,
    toast,
    flash
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp precisa estar dentro de <AppProvider>');
  return ctx;
}
