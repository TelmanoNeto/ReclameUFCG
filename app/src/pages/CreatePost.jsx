import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CATS, CAMPI, LOCAIS_POR_CAMPUS, locaisDoCampus, MAX_FOTOS, ASSIST_STEPS, ASSIST_TEMAS, suggestCategory } from '../data.js';
import { prepararFoto, descartarFoto, cloudinaryConfigurado } from '../image.js';

// Quantos locais o passo do assistido mostra por vez. Acima disso a lista
// volta a ser uma parede de chips, que é o que a busca veio resolver.
const LIMITE_SUGESTOES_LOCAL = 8;

export default function CreatePost() {
  const { createPost, isLogged, podeParticipar, authCarregando, openGate, flash } = useApp();
  const navigate = useNavigate();
  const [publicando, setPublicando] = useState(false);

  const [assist, setAssist] = useState(false);
  const [chat, setChat] = useState([]);
  const [assistStep, setAssistStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [tema, setTema] = useState(null);
  // Só a etapa do local: o campus da sede tem mais de cem prédios, e mostrar
  // todos como chip vira uma parede. Digitar filtra; a escolha continua saindo
  // da lista oficial, senão 'CAA', 'caa' e 'bloco CAA' virariam tópicos
  // diferentes no agrupamento (localBase em data.js).
  const [buscaLocal, setBuscaLocal] = useState('');

  const [texto, setTexto] = useState('');
  const [cat, setCat] = useState('');
  const [campus, setCampus] = useState('');
  const [bloco, setBloco] = useState('');
  const [sala, setSala] = useState('');
  const [fotos, setFotos] = useState([]);
  const fileInput = useRef(null);

  // A sessão do Firebase chega de forma assíncrona: sem esta espera, abrir
  // /novo direto na barra de endereços expulsaria quem já está logado.
  if (authCarregando) return <div className="empty-state">Carregando…</div>;

  // Sem conta ou sem e-mail confirmado o servidor recusaria a publicação de
  // qualquer jeito; openGate mostra qual dos dois é o caso.
  if (!isLogged || !podeParticipar) {
    openGate('publicar');
    navigate('/');
    return null;
  }

  const sug = suggestCategory(texto);
  const temSugestao = !!sug && sug !== cat;

  function startAssist() {
    setAssist(true);
    setAssistStep(0);
    setTema(null);
    setAnswers({});
    setBuscaLocal('');
    setChat([{ role: 'bot', text: ASSIST_STEPS[0].q }]);
  }

  // "CAA", "caa" e "Cáa" precisam achar o mesmo bloco.
  function normalizar(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  /**
   * Casa a busca com um local. Não é "contém": procurar "CO" por substring
   * casaria com todo mundo, porque a palavra "Bloco" tem "co" dentro; e "RU"
   * acharia "crustáceos" antes do Restaurante Universitário. Então valem três
   * caminhos: início de palavra, a sigla do bloco, e a inicial das palavras do
   * nome — que é como as pessoas chamam RU, HUAC, LSD.
   */
  function combina(local, busca) {
    const q = normalizar(busca).trim();
    if (!q) return false;

    const semPrefixo = normalizar(local).replace(/^bloco /, '');
    const palavras = semPrefixo.split(/[^a-z0-9]+/).filter(Boolean);
    if (palavras.some((p) => p.startsWith(q))) return true;

    // Sigla: 'ca 1' também responde por 'ca1'.
    const sigla = palavras.slice(0, 2).join('');
    if (sigla.startsWith(q.replace(/\s+/g, ''))) return true;

    // Nos itens sem sigla ('Hospital Universitário Alcides Carneiro') as
    // iniciais saem do nome inteiro — é como se acha HUAC.
    const partes = normalizar(local).split(' · ');
    const nome = partes.length > 1 ? partes.slice(1).join(' ') : semPrefixo;
    const iniciais = nome
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .map((p) => p[0])
      .join('');
    return iniciais.startsWith(q);
  }

  // Troca de campus zera o local: as opções de um campus não valem no outro.
  function trocarCampus(novoCampus) {
    setCampus(novoCampus);
    setBloco('');
  }

  // A etapa "detalhe" pergunta o que o tema escolhido define; as demais são fixas.
  function perguntaDoPasso(indice, temaAtual) {
    const step = ASSIST_STEPS[indice];
    if (step.key === 'detalhe') return temaAtual ? temaAtual.q : 'O que exatamente está acontecendo?';
    return step.q;
  }

  function opcoesDoPasso(indice, temaAtual) {
    const step = ASSIST_STEPS[indice];
    if (step.key === 'tema') return ASSIST_TEMAS.map((t) => t.label);
    if (step.key === 'detalhe') return temaAtual ? temaAtual.opcoes : [];
    if (step.key === 'campus') return CAMPI;
    if (step.key === 'local') return locaisDoCampus(campus);
    return step.chips;
  }

  function montarTexto(resp, temaAtual) {
    const { detalhe, campus: campusResp, local, frequencia, impacto } = resp;
    return (
      `${detalhe} — ${temaAtual.label.toLowerCase()} — em ${local}, campus ${campusResp}.\n\n` +
      `Acontece: ${frequencia.toLowerCase()}. Impacto: ${impacto.toLowerCase()}.\n\n` +
      'Registro aqui para juntar com outros relatos parecidos e mostrar o tamanho real da situação.'
    );
  }

  function pickAnswer(label) {
    const step = ASSIST_STEPS[assistStep];
    const novasRespostas = { ...answers, [step.key]: label };
    let temaAtual = tema;

    if (step.key === 'tema') {
      temaAtual = ASSIST_TEMAS.find((t) => t.label === label) || null;
      setTema(temaAtual);
      if (temaAtual) setCat(temaAtual.cat);
    }
    if (step.key === 'campus') trocarCampus(label);
    if (step.key === 'local') setBloco(label);

    setAnswers(novasRespostas);

    const proximo = assistStep + 1;
    if (proximo < ASSIST_STEPS.length) {
      setChat((c) => c.concat({ role: 'me', text: label }, { role: 'bot', text: perguntaDoPasso(proximo, temaAtual) }));
      setAssistStep(proximo);
      return;
    }

    setChat((c) =>
      c.concat(
        { role: 'me', text: label },
        { role: 'bot', text: 'Montei uma descrição com o que você me disse e joguei no campo abaixo. Ajuste o que quiser antes de publicar.' }
      )
    );
    setAssistStep(ASSIST_STEPS.length);
    setTexto(montarTexto(novasRespostas, temaAtual));
  }

  const passoAtual = assistStep >= 0 && assistStep < ASSIST_STEPS.length ? ASSIST_STEPS[assistStep] : null;
  const buscandoLocal = passoAtual?.key === 'local';

  // No passo do local a lista só aparece filtrada — com o campus da sede, são
  // 116 opções. Nos outros passos são até 8 chips, que cabem na tela.
  const chatChips = (() => {
    if (!passoAtual) return [];
    let opcoes = opcoesDoPasso(assistStep, tema);
    if (buscandoLocal) {
      opcoes = buscaLocal.trim()
        ? opcoes.filter((o) => combina(o, buscaLocal)).slice(0, LIMITE_SUGESTOES_LOCAL)
        : [];
    }
    return opcoes.map((label) => ({ label, go: () => pickAnswer(label) }));
  })();

  // As fotos ficam só no navegador até a publicação — nada sobe para o
  // Cloudinary enquanto a pessoa ainda está montando o relato, senão uma foto
  // escolhida e removida viraria arquivo órfão lá.
  async function addFotos(fileList) {
    const arquivos = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (arquivos.length === 0) return;
    if (!cloudinaryConfigurado) {
      flash('O envio de fotos não está configurado neste ambiente');
      return;
    }
    const espaco = MAX_FOTOS - fotos.length;
    if (espaco <= 0) {
      flash(`Máximo de ${MAX_FOTOS} fotos por relato`);
      return;
    }
    if (arquivos.length > espaco) flash(`Só cabem mais ${espaco} foto(s) neste relato`);
    try {
      const novas = await Promise.all(arquivos.slice(0, espaco).map((f) => prepararFoto(f)));
      setFotos((atual) => atual.concat(novas).slice(0, MAX_FOTOS));
    } catch {
      flash('Não foi possível carregar alguma das imagens');
    }
  }

  function removerFoto(index) {
    setFotos((atual) => {
      descartarFoto(atual[index]);
      return atual.filter((_, i) => i !== index);
    });
  }

  async function publicar() {
    if (publicando) return;
    if (!texto.trim()) {
      flash('Descreva o que aconteceu antes de publicar');
      return;
    }
    if (!campus) {
      flash('Selecione o campus do relato');
      return;
    }
    if (!bloco) {
      flash('Selecione o local dentro do campus');
      return;
    }
    setPublicando(true);
    const id = await createPost({ texto, cat: cat || sug, campus, bloco, sala, fotos });
    setPublicando(false);
    if (id) navigate(`/relato/${id}`);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button className="back-link" onClick={() => navigate('/')}>← cancelar</button>
      <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: '-0.02em' }}>Novo relato</div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button className={`chip ${!assist ? 'on' : ''}`} onClick={() => setAssist(false)}>Escrever</button>
        <button className={`chip ${assist ? 'on' : ''}`} onClick={startAssist}>Modo assistido</button>
      </div>

      {assist && (
        <div className="card">
          <div className="mono" style={{ letterSpacing: 0 }}>
            {assistStep < ASSIST_STEPS.length
              ? `etapa ${assistStep + 1} de ${ASSIST_STEPS.length}`
              : 'rascunho pronto — revise abaixo'}
          </div>
          <div className="chat-box">
            {chat.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`chat-bubble ${m.role === 'bot' ? 'bot' : 'me'}`}>{m.text}</div>
            ))}
          </div>
          {buscandoLocal && (
            <input
              className="input"
              style={{ height: 38 }}
              autoFocus
              value={buscaLocal}
              onChange={(e) => setBuscaLocal(e.target.value)}
              placeholder="Digite o bloco ou o lugar — ex.: CAA, biblioteca, RU"
              aria-label="Buscar o local dentro do campus"
            />
          )}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {chatChips.map((cc) => (
              <button type="button" key={cc.label} className="chat-chip" onClick={cc.go}>{cc.label}</button>
            ))}
          </div>
          {buscandoLocal && chatChips.length === 0 && (
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>
              {buscaLocal.trim()
                ? 'Nenhum local com esse nome. Tente a sigla do bloco (CAA, BG, CO) ou parte do nome.'
                : 'Comece a digitar para achar o local.'}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ padding: 16, gap: 16 }}>
        <div className="field-group">
          <div className="field-label">O que aconteceu</div>
          <textarea
            className="input"
            style={{ minHeight: 120, fontSize: 14 }}
            placeholder="Descreva o problema: o que é, onde fica, desde quando…"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          {temSugestao && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--ink-soft)' }}>
              <span>Categoria sugerida:</span>
              <span className="badge-cat">{sug}</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => setCat(sug)}>usar</span>
            </div>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">Fotos (opcional) — até {MAX_FOTOS}</div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              addFotos(e.target.files);
              e.target.value = '';
            }}
          />
          {fotos.length > 0 && (
            <div className={`photo-grid n${fotos.length} editable`}>
              {fotos.map((f, i) => (
                <div key={f.preview} className="photo-cell">
                  <img className="photo-cell-img" src={f.preview} alt={`Foto ${i + 1} do relato`} />
                  <button type="button" className="photo-remove" onClick={() => removerFoto(i)} aria-label={`Remover foto ${i + 1}`}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          {fotos.length < MAX_FOTOS && (
            <button type="button" className="photo-box" onClick={() => fileInput.current?.click()}>
              {fotos.length === 0
                ? 'toque para anexar fotos'
                : `adicionar mais fotos · ${fotos.length}/${MAX_FOTOS}`}
            </button>
          )}
        </div>

        <div className="field-group">
          <div className="field-label">Categoria</div>
          <div className="filters-row">
            {CATS.map((c) => (
              <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="field-group">
          <div className="field-label">Onde</div>
          <div className="filters-row">
            <select className="input" style={{ flex: 1, minWidth: 120, height: 38 }} value={campus} onChange={(e) => trocarCampus(e.target.value)}>
              <option value="">Selecione o campus…</option>
              {CAMPI.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select
              className="input"
              style={{ flex: 1, minWidth: 120, height: 38 }}
              value={bloco}
              disabled={!campus}
              onChange={(e) => setBloco(e.target.value)}
            >
              <option value="">{campus ? 'Selecione o local…' : 'Escolha o campus primeiro'}</option>
              {(LOCAIS_POR_CAMPUS[campus] || []).map((g) => (
                <optgroup key={g.grupo} label={g.grupo}>
                  {g.locais.map((o) => <option key={o} value={o}>{o}</option>)}
                </optgroup>
              ))}
            </select>
            <input className="input" style={{ flex: 1, minWidth: 110, height: 38 }} placeholder="Sala / ponto" value={sala} onChange={(e) => setSala(e.target.value)} />
          </div>
        </div>

        <div className="identidade-aviso">
          O relato é publicado com seu nome e curso. Não existe publicação anônima.{' '}
          <button type="button" className="link-inline" onClick={() => navigate('/regras')}>
            Ler as regras da comunidade
          </button>
        </div>

        <button className="btn" style={{ height: 46, fontSize: 15 }} onClick={publicar} disabled={publicando}>
          {!publicando && 'Publicar relato'}
          {publicando && (fotos.length > 0 ? 'Enviando fotos…' : 'Publicando…')}
        </button>
      </div>
    </div>
  );
}
