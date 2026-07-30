import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CATS, CAMPI, BLOCOS, ASSIST_STEPS, ASSIST_STARTERS, suggestCategory } from '../data.js';
import CategoryIllustration from '../components/CategoryIllustration.jsx';

export default function CreatePost() {
  const { createPost, isLogged, openGate } = useApp();
  const navigate = useNavigate();

  const [assist, setAssist] = useState(false);
  const [chat, setChat] = useState([]);
  const [assistStep, setAssistStep] = useState(-1);
  const [answers, setAnswers] = useState([]);

  const [texto, setTexto] = useState('');
  const [cat, setCat] = useState('');
  const [campus, setCampus] = useState('Campina Grande');
  const [bloco, setBloco] = useState(BLOCOS[0]);
  const [sala, setSala] = useState('');
  const [anon, setAnon] = useState(false);
  const [foto, setFoto] = useState(false);

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
    setChat([{ role: 'bot', text: 'Me conta em uma frase o que está acontecendo — eu completo o resto com você.' }]);
    setAnswers([]);
  }

  function pickStarter(label) {
    setChat((c) => c.concat({ role: 'me', text: label }, { role: 'bot', text: ASSIST_STEPS[0].q }));
    setAssistStep(1);
    setTexto(label);
  }

  function pickAnswer(label) {
    const nextStep = assistStep + 1;
    const newAnswers = answers.concat(label);
    if (nextStep <= 3) {
      setChat((c) => c.concat({ role: 'me', text: label }, { role: 'bot', text: ASSIST_STEPS[nextStep - 1].q }));
      setAssistStep(nextStep);
      setAnswers(newAnswers);
      return;
    }
    const base = chat.find((m) => m.role === 'me');
    const texto2 =
      (base ? base.text : 'Problema relatado') +
      ' em ' + newAnswers[0] + '.\n\nAcontece: ' + newAnswers[1].toLowerCase() + '. Afeta: ' + newAnswers[2].toLowerCase() + '.\n\n' +
      'O problema já foi comentado entre os alunos, mas segue sem solução. Registro aqui para juntar com outros relatos parecidos e mostrar o tamanho real da situação.';
    setChat((c) => c.concat({ role: 'me', text: label }, { role: 'bot', text: 'Montei uma descrição com o que você me disse e joguei no campo abaixo. Ajuste o que quiser antes de publicar.' }));
    setAssistStep(4);
    setAnswers(newAnswers);
    setTexto(texto2);
    setBloco(newAnswers[0]);
  }

  const chatChips = (() => {
    if (assistStep < 0 || assistStep > 3) return [];
    if (assistStep === 0) return ASSIST_STARTERS.map((label) => ({ label, go: () => pickStarter(label) }));
    const step = ASSIST_STEPS[assistStep - 1];
    return step.chips.map((label) => ({ label, go: () => pickAnswer(label) }));
  })();

  function publicar() {
    if (!texto.trim()) return;
    const id = createPost({ texto, cat: cat || sug, campus, bloco, sala, anon, foto });
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
          <div className="chat-box">
            {chat.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === 'bot' ? 'bot' : 'me'}`}>{m.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {chatChips.map((cc) => (
              <div key={cc.label} className="chat-chip" onClick={cc.go}>{cc.label}</div>
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
          <div className="field-label">Foto (opcional)</div>
          {foto ? (
            <div className="photo-box on" style={{ padding: 0, position: 'relative' }} onClick={() => setFoto(false)}>
              <CategoryIllustration cat={cat || sug} />
              <div className="photo-caption">foto anexada — toque para remover</div>
            </div>
          ) : (
            <div className="photo-box" onClick={() => setFoto(true)}>toque para anexar uma foto</div>
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
            <select className="input" style={{ flex: 1, minWidth: 120, height: 38 }} value={campus} onChange={(e) => setCampus(e.target.value)}>
              {CAMPI.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="input" style={{ flex: 1, minWidth: 120, height: 38 }} value={bloco} onChange={(e) => setBloco(e.target.value)}>
              {BLOCOS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <input className="input" style={{ flex: 1, minWidth: 110, height: 38 }} placeholder="Sala / ponto" value={sala} onChange={(e) => setSala(e.target.value)} />
          </div>
        </div>

        <button className="toggle-row" onClick={() => setAnon((a) => !a)} type="button">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Publicar como anônimo</div>
            <div style={{ fontSize: 12.5, color: 'var(--label)' }}>
              {anon ? 'Seu nome não aparece. O relato entra como "Anônimo".' : 'Seu relato aparece com seu nome e curso.'}
            </div>
          </div>
          <div className={`toggle-track ${anon ? 'on' : ''}`}>
            <div className={`toggle-knob ${anon ? 'on' : ''}`} />
          </div>
        </button>

        <button className="btn" style={{ height: 46, fontSize: 15 }} onClick={publicar}>Publicar relato</button>
      </div>
    </div>
  );
}
