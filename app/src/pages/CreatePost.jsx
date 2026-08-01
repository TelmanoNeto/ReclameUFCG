import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CATS, CAMPI, LOCAIS_POR_CAMPUS, locaisDoCampus, MAX_FOTOS, ASSIST_STEPS, ASSIST_TEMAS, suggestCategory } from '../data.js';
import { fileToCompressedDataURL } from '../image.js';

export default function CreatePost() {
  const { createPost, isLogged, openGate, flash } = useApp();
  const navigate = useNavigate();

  const [assist, setAssist] = useState(false);
  const [chat, setChat] = useState([]);
  const [assistStep, setAssistStep] = useState(-1);
  const [answers, setAnswers] = useState({});
  const [tema, setTema] = useState(null);

  const [texto, setTexto] = useState('');
  const [cat, setCat] = useState('');
  const [campus, setCampus] = useState('');
  const [bloco, setBloco] = useState('');
  const [sala, setSala] = useState('');
  const [fotos, setFotos] = useState([]);
  const fileInput = useRef(null);

  if (!isLogged) {
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
    setChat([{ role: 'bot', text: ASSIST_STEPS[0].q }]);
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

  const chatChips = (() => {
    if (assistStep < 0 || assistStep >= ASSIST_STEPS.length) return [];
    return opcoesDoPasso(assistStep, tema).map((label) => ({ label, go: () => pickAnswer(label) }));
  })();

  async function addFotos(fileList) {
    const arquivos = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (arquivos.length === 0) return;
    const espaco = MAX_FOTOS - fotos.length;
    if (espaco <= 0) {
      flash(`Máximo de ${MAX_FOTOS} fotos por relato`);
      return;
    }
    if (arquivos.length > espaco) flash(`Só cabem mais ${espaco} foto(s) neste relato`);
    try {
      const novas = await Promise.all(arquivos.slice(0, espaco).map(fileToCompressedDataURL));
      setFotos((atual) => atual.concat(novas.map((src) => ({ src, label: '' }))).slice(0, MAX_FOTOS));
    } catch {
      flash('Não foi possível carregar alguma das imagens');
    }
  }

  function removerFoto(index) {
    setFotos((atual) => atual.filter((_, i) => i !== index));
  }

  function publicar() {
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
    const id = createPost({ texto, cat: cat || sug, campus, bloco, sala, fotos });
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
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {chatChips.map((cc) => (
              <button type="button" key={cc.label} className="chat-chip" onClick={cc.go}>{cc.label}</button>
            ))}
          </div>
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
                <div key={f.src.slice(-32) + i} className="photo-cell">
                  <img className="photo-cell-img" src={f.src} alt={`Foto ${i + 1} do relato`} />
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
          O relato é publicado com seu nome e curso. Não existe publicação anônima.
        </div>

        <button className="btn" style={{ height: 46, fontSize: 15 }} onClick={publicar}>Publicar relato</button>
      </div>
    </div>
  );
}
