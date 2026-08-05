import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';

const COPY = {
  apoiar: ['Entre para apoiar', 'Apoios mostram quantas pessoas passam pelo mesmo problema. Para dar o seu, é preciso ter conta — ler e buscar continua livre.'],
  comentar: ['Entre para comentar', 'Comentários são a forma de a comunidade responder a um relato. Para escrever o seu, crie uma conta em um minuto.'],
  publicar: ['Entre para publicar', 'Só quem tem conta publica relatos, e todo relato aparece com o nome e o curso de quem publicou. Ler e buscar continua livre.'],
  perfil: ['Entre para ver seu perfil', 'O perfil reúne os relatos e comentários que você publicou.']
};

export default function GateModal() {
  const { gate, closeGate } = useApp();
  const navigate = useNavigate();
  if (!gate) return null;

  function go(path) {
    closeGate();
    navigate(path);
  }

  // Conta existe, mas o e-mail ainda não foi confirmado: o caminho não é
  // criar outra conta, é abrir o link que já foi enviado.
  if (gate === 'verificar') {
    return (
      <div className="gate-overlay" onClick={closeGate}>
        <div className="gate-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="gate-handle" />
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 4 }}>Confirme seu e-mail</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-mute)' }}>
            Sua conta existe, mas ainda não foi confirmada. Clique no link que mandamos para o seu e-mail institucional
            para liberar publicar, comentar e apoiar.
          </div>
          <button className="btn" style={{ height: 46 }} onClick={() => go('/verificar')}>Abrir a confirmação</button>
          <button className="btn ghost" style={{ height: 38 }} onClick={closeGate}>Agora não</button>
        </div>
      </div>
    );
  }

  const [title, body] = COPY[gate] || ['', ''];

  return (
    <div className="gate-overlay" onClick={closeGate}>
      <div className="gate-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="gate-handle" />
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginTop: 4 }}>{title}</div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink-mute)' }}>{body}</div>
        <button className="btn" style={{ height: 46 }} onClick={() => go('/entrar')}>Entrar</button>
        <button className="btn secondary" style={{ height: 46 }} onClick={() => go('/cadastro')}>Criar conta</button>
        <button className="btn ghost" style={{ height: 38 }} onClick={closeGate}>Continuar sem conta</button>
      </div>
    </div>
  );
}
