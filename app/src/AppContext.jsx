import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onIdTokenChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  limit
} from 'firebase/firestore';
import {
  STATUS_PADRAO,
  MAX_FOTOS,
  MATRICULA_DIGITOS,
  statusInfo,
  chaveDoTopico,
  localBase,
  motivoInfo,
  limiarDenuncias
} from './data.js';
import { auth, db, firebaseConfigurado } from './firebase.js';
import { uploadFotos } from './image.js';
import { timeAgo, initials, courseAbbrev, somenteDigitos, isEmailUFCG } from './time.js';

// Quantos relatos o feed carrega. Serve de teto de leitura: no plano gratuito
// são 50 mil leituras por dia, e um listener recarrega este bloco a cada
// reabertura do app. Passando disso, o feed precisa de paginação.
const LIMITE_FEED = 300;

// Ações que só pedem conta, sem exigir e-mail confirmado — senão a pessoa fica
// presa do lado de fora do próprio perfil enquanto não clica no link.
const ACOES_SEM_VERIFICACAO = ['perfil'];

const AppContext = createContext(null);

/** Traduz os códigos de erro do Firebase Auth para o que a pessoa vê na tela. */
function erroAuth(e) {
  switch (e?.code) {
    case 'auth/email-already-in-use':
      return 'Já existe uma conta com esse e-mail. Tente entrar.';
    case 'auth/invalid-email':
      return 'Esse e-mail não parece válido.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos, ou conta inexistente.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.';
    case 'auth/network-request-failed':
      return 'Sem conexão com o servidor. Verifique a internet e tente de novo.';
    default:
      return 'Não foi possível concluir. Tente de novo em instantes.';
  }
}

/** Documento do Firestore → o formato que as telas já consomem. */
function normalizarRelato(snap) {
  const d = snap.data();
  // Enquanto o serverTimestamp não volta do servidor, criadoEm chega nulo no
  // primeiro snapshot local. Nesse instante o relato é, literalmente, de agora.
  const ms = d.criadoEm?.toMillis ? d.criadoEm.toMillis() : Date.now();
  return {
    id: snap.id,
    autorUid: d.autorUid,
    autor: d.autorNome || '',
    cat: d.cat,
    campus: d.campus,
    curso: d.curso,
    local: d.local,
    localBase: d.localBase || localBase(d.local),
    titulo: d.titulo,
    resumo: d.resumo,
    texto: d.texto,
    status: d.status || STATUS_PADRAO,
    fotos: d.fotos || [],
    createdAt: ms,
    quando: timeAgo(ms),
    ups: d.nApoios || 0,
    nComentarios: d.nComentarios || 0,
    nDenuncias: d.nDenuncias || 0,
    nDenunciasUrgentes: d.nDenunciasUrgentes || 0
  };
}

export function AppProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [emailVerificado, setEmailVerificado] = useState(false);
  const [authCarregando, setAuthCarregando] = useState(firebaseConfigurado);

  const [posts, setPosts] = useState([]);
  const [feedCarregando, setFeedCarregando] = useState(firebaseConfigurado);
  const [erroFeed, setErroFeed] = useState('');

  const [meusApoios, setMeusApoios] = useState(() => new Set());
  // Apoios com escrita em andamento: id do relato -> estado pretendido.
  // meusApoios só muda quando o snapshot da consulta volta, e nesse intervalo
  // um segundo clique leria o estado antigo e mandaria outro +1.
  const [apoiosEmVoo, setApoiosEmVoo] = useState(() => new Map());
  const [minhasDenuncias, setMinhasDenuncias] = useState(() => new Set());
  const [ehAdmin, setEhAdmin] = useState(false);

  const [gate, setGateState] = useState(null);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const uid = authUser?.uid || null;

  // ---- sessão -------------------------------------------------------------

  useEffect(() => {
    if (!firebaseConfigurado) return undefined;
    // onIdTokenChanged (e não onAuthStateChanged) para que o refresh forçado do
    // token, depois da confirmação de e-mail, chegue até aqui.
    return onIdTokenChanged(auth, (u) => {
      setAuthUser(u);
      setEmailVerificado(!!u?.emailVerified);
      setAuthCarregando(false);
    });
  }, []);

  // Perfil (nome, curso, campus…) — o que o Auth não guarda.
  useEffect(() => {
    if (!uid) {
      setPerfil(null);
      return undefined;
    }
    return onSnapshot(
      doc(db, 'usuarios', uid),
      (snap) => setPerfil(snap.exists() ? snap.data() : null),
      () => setPerfil(null)
    );
  }, [uid]);

  // A tela de moderação só aparece para quem tem documento em /admins.
  // A leitura falha para todo mundo que não é — daí o catch silencioso.
  useEffect(() => {
    if (!uid) {
      setEhAdmin(false);
      return undefined;
    }
    return onSnapshot(
      doc(db, 'admins', uid),
      (snap) => setEhAdmin(snap.exists()),
      () => setEhAdmin(false)
    );
  }, [uid]);

  const currentUser = useMemo(() => {
    if (!authUser) return null;
    return {
      uid: authUser.uid,
      email: authUser.email || '',
      emailVerificado: !!authUser.emailVerified,
      nome: perfil?.nome || (authUser.email || '').split('@')[0],
      matricula: perfil?.matricula || '',
      telefone: perfil?.telefone || '',
      curso: perfil?.curso || '',
      campus: perfil?.campus || '',
      periodo: perfil?.periodo || ''
    };
  }, [authUser, perfil]);

  const isLogged = !!currentUser;
  // Publicar, comentar, apoiar e denunciar. É a mesma condição que as Security
  // Rules aplicam do lado do servidor — aqui só evita a viagem perdida.
  const podeParticipar = isLogged && emailVerificado && isEmailUFCG(currentUser.email);

  // ---- feed ---------------------------------------------------------------

  useEffect(() => {
    if (!firebaseConfigurado) return undefined;
    const q = query(collection(db, 'relatos'), orderBy('criadoEm', 'desc'), limit(LIMITE_FEED));
    return onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map(normalizarRelato));
        setFeedCarregando(false);
        setErroFeed('');
      },
      (e) => {
        setFeedCarregando(false);
        setErroFeed(
          e.code === 'permission-denied'
            ? 'O servidor recusou a leitura dos relatos. As regras de segurança do Firestore provavelmente ainda não foram publicadas.'
            : 'Não foi possível carregar os relatos. Verifique sua conexão.'
        );
      }
    );
  }, []);

  // Em quais relatos eu já apoiei / já denunciei. Uma consulta por grupo de
  // coleção resolve tudo de uma vez, em vez de uma leitura por relato do feed.
  useEffect(() => {
    if (!uid) {
      setMeusApoios(new Set());
      return undefined;
    }
    const q = query(collectionGroup(db, 'apoios'), where('uid', '==', uid));
    return onSnapshot(
      q,
      (snap) => setMeusApoios(new Set(snap.docs.map((d) => d.ref.parent.parent.id))),
      () => setMeusApoios(new Set())
    );
  }, [uid]);

  useEffect(() => {
    if (!uid) {
      setMinhasDenuncias(new Set());
      return undefined;
    }
    const q = query(collectionGroup(db, 'denuncias'), where('uid', '==', uid));
    return onSnapshot(
      q,
      (snap) => setMinhasDenuncias(new Set(snap.docs.map((d) => d.ref.parent.parent.id))),
      () => setMinhasDenuncias(new Set())
    );
  }, [uid]);

  const allPosts = posts;

  // ---- avisos -------------------------------------------------------------

  function flash(text) {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2600);
  }

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /**
   * Devolve true quando a ação foi interrompida. Sem conta abre o convite de
   * cadastro; com conta não confirmada, o aviso de verificação.
   */
  function openGate(acao) {
    if (!isLogged) {
      setGateState(acao);
      return true;
    }
    if (ACOES_SEM_VERIFICACAO.includes(acao)) return false;
    if (!podeParticipar) {
      setGateState('verificar');
      return true;
    }
    return false;
  }
  function closeGate() {
    setGateState(null);
  }

  // ---- autenticação -------------------------------------------------------

  async function signup({ nome, email, senha, telefone, matricula, curso, campus, periodo }) {
    if (!firebaseConfigurado) return { ok: false, error: 'O servidor não está configurado neste ambiente.' };
    const emailNorm = email.trim().toLowerCase();
    if (!isEmailUFCG(emailNorm)) {
      return { ok: false, error: 'Use seu e-mail institucional da UFCG (o domínio precisa conter ".ufcg.").' };
    }
    if (somenteDigitos(matricula).length !== MATRICULA_DIGITOS) {
      return { ok: false, error: `A matrícula precisa ter exatamente ${MATRICULA_DIGITOS} dígitos.` };
    }

    let cred;
    try {
      cred = await createUserWithEmailAndPassword(auth, emailNorm, senha);
    } catch (e) {
      return { ok: false, error: erroAuth(e) };
    }

    // Perfil e reserva da matrícula na mesma escrita atômica. A reserva só é
    // aceita se ninguém tiver registrado essa matrícula antes (as regras
    // proíbem `update` em /matriculas), então é o banco garantindo a unicidade
    // — sem corrida entre duas pessoas cadastrando ao mesmo tempo.
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'usuarios', cred.user.uid), {
        nome: nome.trim(),
        email: emailNorm,
        matricula,
        telefone,
        curso,
        campus,
        periodo,
        criadoEm: serverTimestamp()
      });
      batch.set(doc(db, 'matriculas', matricula), {
        uid: cred.user.uid,
        criadoEm: serverTimestamp()
      });
      await batch.commit();
    } catch {
      // Sem perfil a conta não serve para nada, e uma conta órfã no Auth ainda
      // trava o e-mail para uma nova tentativa. Melhor desfazer.
      try {
        await deleteUser(cred.user);
      } catch {
        // Se nem apagar der, o cadastro falhou de todo jeito — a mensagem abaixo
        // continua sendo a informação útil.
      }
      return { ok: false, error: 'Já existe uma conta com essa matrícula, ou não foi possível salvar seu perfil.' };
    }

    try {
      await sendEmailVerification(cred.user);
    } catch {
      return { ok: true, avisoEmail: true };
    }
    return { ok: true };
  }

  async function login(email, senha) {
    if (!firebaseConfigurado) return { ok: false, error: 'O servidor não está configurado neste ambiente.' };
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), senha);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: erroAuth(e) };
    }
  }

  async function logout() {
    if (firebaseConfigurado) await signOut(auth);
  }

  async function reenviarVerificacao() {
    if (!auth?.currentUser) return { ok: false, error: 'Entre na sua conta primeiro.' };
    try {
      await sendEmailVerification(auth.currentUser);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: erroAuth(e) };
    }
  }

  /**
   * emailVerified mora no ID token, que vale 1 hora. Depois de clicar no link
   * de confirmação o token continua dizendo `false`, e as Security Rules
   * continuam bloqueando — por isso o refresh forçado, e não só o reload().
   */
  async function conferirVerificacao() {
    if (!auth?.currentUser) return false;
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      const ok = !!auth.currentUser.emailVerified;
      setEmailVerificado(ok);
      return ok;
    } catch {
      return false;
    }
  }

  // ---- tópicos ------------------------------------------------------------

  // O agrupamento continua sendo feito em memória, sobre o mesmo snapshot que
  // já alimenta o feed: uma consulta por tópico no Firestore custaria dezenas
  // de leituras por visita para produzir exatamente este resultado. O campo
  // `localBase` vai gravado no documento para o dia em que o volume passar de
  // LIMITE_FEED e o agrupamento precisar virar consulta de verdade.
  const topicos = useMemo(() => {
    const mapa = new Map();
    allPosts.forEach((p) => {
      const chave = chaveDoTopico(p);
      if (!mapa.has(chave)) mapa.set(chave, []);
      mapa.get(chave).push(p);
    });
    return mapa;
  }, [allPosts]);

  function upsOf(post) {
    return post?.ups || 0;
  }

  // Os outros relatos do mesmo tópico, dos mais apoiados para os menos.
  function similaresDe(post) {
    if (!post) return [];
    return (topicos.get(chaveDoTopico(post)) || [])
      .filter((p) => p.id !== post.id)
      .sort((a, b) => upsOf(b) - upsOf(a));
  }

  function tituloDoTopico(post) {
    return `${post.cat} · ${localBase(post.local)}`;
  }

  /**
   * Um relato entra em revisão quando recebe uma denúncia urgente (exposição de
   * dado pessoal, cujo dano não dá para desfazer) ou quando o número de
   * denúncias distintas alcança o limiar proporcional aos apoios.
   * Em revisão o relato continua legível — só ganha um aviso e sai do "Em alta".
   * Excluir é sempre decisão manual.
   */
  function revisaoDe(post) {
    if (!post || !post.nDenuncias) return null;
    const urgente = post.nDenunciasUrgentes > 0;
    const limiar = limiarDenuncias(upsOf(post));
    if (!urgente && post.nDenuncias < limiar) return null;
    return { total: post.nDenuncias, limiar, urgente };
  }

  // Tópicos com mais de um relato, ordenados por apoio total — alimenta o "Em alta".
  const topicosEmAlta = useMemo(() => {
    return Array.from(topicos.entries())
      .map(([chave, lista]) => [chave, lista.filter((p) => !revisaoDe(p))])
      .filter(([, lista]) => lista.length > 1)
      .map(([chave, lista]) => {
        const principal = lista.reduce((a, b) => (upsOf(b) > upsOf(a) ? b : a));
        return {
          chave,
          principal,
          relatos: lista.length,
          ups: lista.reduce((soma, p) => soma + upsOf(p), 0),
          comentarios: lista.reduce((soma, p) => soma + (p.nComentarios || 0), 0)
        };
      })
      .sort((a, b) => b.ups - a.ups);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicos]);

  // ---- relatos ------------------------------------------------------------

  async function createPost({ texto, cat, campus, bloco, sala, fotos }) {
    if (openGate('publicar')) return null;
    const t = texto.trim();
    if (!t) return null;

    let fotosEnviadas = [];
    try {
      fotosEnviadas = await uploadFotos((fotos || []).slice(0, MAX_FOTOS));
    } catch (e) {
      flash(e.message || 'Não foi possível enviar as fotos');
      return null;
    }

    const local = bloco + (sala ? ' · ' + sala : '');
    const ref = doc(collection(db, 'relatos'));
    try {
      await setDoc(ref, {
        autorUid: currentUser.uid,
        autorNome: `${currentUser.nome} · ${courseAbbrev(currentUser.curso)}`,
        cat: cat || 'Salas de aula',
        campus,
        curso: currentUser.curso,
        local,
        localBase: localBase(local),
        titulo: t.split('\n')[0].slice(0, 78),
        resumo: t.slice(0, 150),
        texto: t,
        status: STATUS_PADRAO,
        fotos: fotosEnviadas,
        criadoEm: serverTimestamp(),
        nApoios: 0,
        nComentarios: 0,
        nDenuncias: 0,
        nDenunciasUrgentes: 0
      });
    } catch {
      flash('Não foi possível publicar o relato. Tente de novo.');
      return null;
    }
    flash('Relato publicado');
    return ref.id;
  }

  async function editPost(id, novoTexto) {
    const t = (novoTexto || '').trim();
    if (!t) return;
    try {
      await updateDoc(doc(db, 'relatos', id), {
        texto: t,
        titulo: t.split('\n')[0].slice(0, 78),
        resumo: t.slice(0, 150)
      });
      flash('Relato atualizado');
    } catch {
      flash('Não foi possível atualizar o relato');
    }
  }

  async function deletePost(id) {
    try {
      await deleteDoc(doc(db, 'relatos', id));
      flash('Relato excluído');
    } catch {
      flash('Não foi possível excluir o relato');
    }
  }

  // Só o aluno que cadastrou o relato mexe na situação dele.
  function canChangeStatus(post) {
    return !!post && !!currentUser && !!post.autorUid && post.autorUid === currentUser.uid;
  }

  async function setPostStatus(post, novoStatus) {
    if (!canChangeStatus(post)) {
      flash('Só quem publicou o relato pode alterar a situação');
      return false;
    }
    if (statusInfo(novoStatus).id !== novoStatus) return false;
    try {
      await updateDoc(doc(db, 'relatos', post.id), { status: novoStatus });
      flash(`Situação atualizada para "${statusInfo(novoStatus).curto}"`);
      return true;
    } catch {
      flash('Não foi possível alterar a situação');
      return false;
    }
  }

  // ---- apoios -------------------------------------------------------------

  // Enquanto a escrita não confirma, vale o estado pretendido: o botão precisa
  // reagir no primeiro toque, não só quando o servidor responder.
  function isUpped(id) {
    if (apoiosEmVoo.has(id)) return apoiosEmVoo.get(id);
    return meusApoios.has(id);
  }

  /**
   * Apoiar é um documento por pessoa (o id é o uid), não um número editável:
   * é isso que impede alguém de apoiar cem vezes. O contador do relato anda
   * junto, na mesma escrita atômica — as regras recusam um sem o outro.
   *
   * O apoio já em andamento é ignorado. Sem isso, tocar duas vezes seguidas
   * mandava dois `+1`: o segundo clique ainda lia `meusApoios` sem o apoio do
   * primeiro, porque essa lista só chega pelo snapshot do servidor. O número
   * subia na tela e depois voltava, porque as regras recusam reescrever um
   * apoio que já existe.
   */
  async function toggleUp(id) {
    if (openGate('apoiar')) return;
    if (apoiosEmVoo.has(id)) return;

    const jaApoiou = isUpped(id);
    setApoiosEmVoo((atual) => new Map(atual).set(id, !jaApoiou));
    const batch = writeBatch(db);
    const relatoRef = doc(db, 'relatos', id);
    const apoioRef = doc(db, 'relatos', id, 'apoios', currentUser.uid);
    if (jaApoiou) {
      batch.delete(apoioRef);
      batch.update(relatoRef, { nApoios: increment(-1) });
    } else {
      batch.set(apoioRef, { uid: currentUser.uid, criadoEm: serverTimestamp() });
      batch.update(relatoRef, { nApoios: increment(1) });
    }
    try {
      await batch.commit();
    } catch {
      flash('Não foi possível registrar seu apoio');
    } finally {
      // Solta o estado pretendido: a essa altura a escrita já foi aplicada no
      // cache local e o snapshot da consulta traz o valor de verdade. Se a
      // escrita falhou, o botão volta sozinho ao que o servidor diz.
      setApoiosEmVoo((atual) => {
        const proximo = new Map(atual);
        proximo.delete(id);
        return proximo;
      });
    }
  }

  // ---- comentários --------------------------------------------------------

  async function postComment(postId, texto) {
    const t = (texto || '').trim();
    if (!t) return;
    if (openGate('comentar')) return;
    const post = allPosts.find((p) => p.id === postId);
    const batch = writeBatch(db);
    const comentarioRef = doc(collection(db, 'relatos', postId, 'comentarios'));
    batch.set(comentarioRef, {
      autorUid: currentUser.uid,
      autorNome: `${currentUser.nome} · ${courseAbbrev(currentUser.curso)}`,
      texto: t,
      criadoEm: serverTimestamp(),
      // Desnormalizado para a aba "meus comentários" não precisar carregar o
      // relato inteiro só para mostrar em qual deles o comentário está.
      relatoId: postId,
      relatoTitulo: post?.titulo || ''
    });
    batch.update(doc(db, 'relatos', postId), { nComentarios: increment(1) });
    try {
      await batch.commit();
      flash('Comentário publicado');
    } catch {
      flash('Não foi possível publicar o comentário');
    }
  }

  async function deleteComment(comentario) {
    const { id, relatoId } = comentario || {};
    if (!id || !relatoId) return;
    const batch = writeBatch(db);
    batch.delete(doc(db, 'relatos', relatoId, 'comentarios', id));
    batch.update(doc(db, 'relatos', relatoId), { nComentarios: increment(-1) });
    try {
      await batch.commit();
      flash('Comentário excluído');
    } catch {
      flash('Não foi possível excluir o comentário');
    }
  }

  // ---- denúncias ----------------------------------------------------------

  function jaDenunciou(postId) {
    return minhasDenuncias.has(postId);
  }

  async function denunciar(postId, motivoId) {
    if (openGate('comentar')) return false;
    const motivo = motivoInfo(motivoId);
    if (!motivo) return false;
    if (minhasDenuncias.has(postId)) {
      flash('Você já denunciou este relato');
      return false;
    }
    const batch = writeBatch(db);
    batch.set(doc(db, 'relatos', postId, 'denuncias', currentUser.uid), {
      uid: currentUser.uid,
      motivo: motivoId,
      criadoEm: serverTimestamp()
    });
    batch.update(doc(db, 'relatos', postId), {
      nDenuncias: increment(1),
      // O motivo em si é privado; só a existência de uma denúncia urgente é
      // pública, porque é o que coloca o relato em revisão na hora.
      ...(motivo.urgente ? { nDenunciasUrgentes: increment(1) } : {})
    });
    try {
      await batch.commit();
      flash('Denúncia registrada');
      return true;
    } catch {
      flash('Não foi possível registrar a denúncia');
      return false;
    }
  }

  // ---- meus dados ---------------------------------------------------------

  const myPosts = useMemo(
    () => (currentUser ? allPosts.filter((p) => p.autorUid === currentUser.uid) : []),
    [allPosts, currentUser]
  );

  const value = {
    firebaseConfigurado,
    isLogged,
    currentUser,
    emailVerificado,
    podeParticipar,
    ehAdmin,
    authCarregando,
    signup,
    login,
    logout,
    reenviarVerificacao,
    conferirVerificacao,
    allPosts,
    feedCarregando,
    erroFeed,
    upsOf,
    isUpped,
    toggleUp,
    postComment,
    deleteComment,
    createPost,
    editPost,
    deletePost,
    canChangeStatus,
    setPostStatus,
    similaresDe,
    tituloDoTopico,
    topicosEmAlta,
    denunciar,
    jaDenunciou,
    revisaoDe,
    myPosts,
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

/**
 * Comentários de um relato. É um hook, e não um campo do contexto, para que a
 * assinatura só exista enquanto a tela do relato está aberta: manter um
 * listener por relato do feed queimaria a cota de leitura à toa. A contagem
 * que aparece nos cards vem do espelho `nComentarios`.
 */
export function useComentarios(postId) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (!postId || !firebaseConfigurado) {
      setComentarios([]);
      return undefined;
    }
    const q = query(collection(db, 'relatos', postId, 'comentarios'), orderBy('criadoEm', 'asc'));
    return onSnapshot(
      q,
      (snap) =>
        setComentarios(
          snap.docs.map((s) => {
            const d = s.data();
            const ms = d.criadoEm?.toMillis ? d.criadoEm.toMillis() : Date.now();
            return {
              id: s.id,
              relatoId: postId,
              autorUid: d.autorUid,
              autor: d.autorNome || '',
              iniciais: initials(d.autorNome),
              texto: d.texto,
              createdAt: ms,
              quando: timeAgo(ms)
            };
          })
        ),
      () => setComentarios([])
    );
  }, [postId]);

  return comentarios;
}

/** Meus comentários, para a aba do perfil. Mesma lógica: só enquanto a tela vive. */
export function useMeusComentarios(uid) {
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    if (!uid || !firebaseConfigurado) {
      setComentarios([]);
      return undefined;
    }
    const q = query(
      collectionGroup(db, 'comentarios'),
      where('autorUid', '==', uid),
      orderBy('criadoEm', 'desc')
    );
    return onSnapshot(
      q,
      (snap) =>
        setComentarios(
          snap.docs.map((s) => {
            const d = s.data();
            const ms = d.criadoEm?.toMillis ? d.criadoEm.toMillis() : Date.now();
            return {
              id: s.id,
              relatoId: d.relatoId,
              em: d.relatoTitulo || 'relato removido',
              texto: d.texto,
              createdAt: ms,
              quando: timeAgo(ms)
            };
          })
        ),
      () => setComentarios([])
    );
  }, [uid]);

  return comentarios;
}
