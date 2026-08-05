import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';

// O Firebase limita reenvios seguidos; o cooldown evita que a pessoa esbarre
// nesse limite clicando várias vezes achando que não funcionou.
const COOLDOWN = 60;

export default function VerificarEmail() {
  const { isLogged, currentUser, emailVerificado, authCarregando, reenviarVerificacao, conferirVerificacao, logout } = useApp();
  const navigate = useNavigate();
  const [espera, setEspera] = useState(0);
  const [aviso, setAviso] = useState('');
  const [conferindo, setConferindo] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!authCarregando && !isLogged) navigate('/entrar');
  }, [authCarregando, isLogged, navigate]);

  useEffect(() => {
    if (espera <= 0) return undefined;
    timer.current = setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => clearTimeout(timer.current);
  }, [espera]);

  if (authCarregando) return <div className="empty-state">Carregando…</div>;
  if (!isLogged) return null;

  async function reenviar() {
    if (espera > 0) return;
    const res = await reenviarVerificacao();
    setEspera(COOLDOWN);
    setAviso(res.ok ? 'E-mail reenviado. Confira também a caixa de spam.' : res.error);
  }

  async function conferir() {
    setConferindo(true);
    const ok = await conferirVerificacao();
    setConferindo(false);
    if (ok) {
      navigate('/');
      return;
    }
    setAviso('Ainda não consta como confirmado. Clique no link do e-mail e tente de novo.');
  }

  if (emailVerificado) {
    return (
      <div className="auth-page">
        <div className="auth-title">E-mail confirmado</div>
        <div className="auth-sub">Sua conta está liberada para publicar, comentar e apoiar relatos.</div>
        <button className="btn" style={{ height: 46 }} onClick={() => navigate('/')}>Ir para o feed</button>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <button className="back-link" onClick={() => navigate('/')}>← continuar navegando</button>
      <div className="auth-title">Confirme seu e-mail</div>
      <div className="auth-sub">
        Mandamos um link de confirmação para <strong>{currentUser.email}</strong>. Enquanto você não clicar nele, dá para
        ler o feed normalmente — mas publicar, comentar e apoiar ficam bloqueados.
      </div>

      <div className="card">
        {aviso && <div className="auth-error">{aviso}</div>}

        {/* O remetente padrão do Firebase é um subdomínio compartilhado, sem
            reputação própria: nos testes com o e-mail da UFCG a mensagem caiu
            no spam. Enquanto for assim, este aviso vem antes do passo a passo,
            senão metade dos testadores trava aqui achando que não chegou. */}
        <div className="aviso-senha">
          <strong>Olhe primeiro na caixa de spam.</strong> É lá que a mensagem costuma cair no e-mail da UFCG. Ao achar,
          marque como “não é spam” — isso ajuda a entrega dos próximos.
        </div>

        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
          <li>Abra seu e-mail institucional.</li>
          <li>Procure a mensagem do ReclameUFCG, na entrada e no spam.</li>
          <li>Clique no link e volte aqui.</li>
        </ol>

        <button className="btn" style={{ height: 46 }} onClick={conferir} disabled={conferindo}>
          {conferindo ? 'Conferindo…' : 'Já confirmei, liberar minha conta'}
        </button>

        <button className="btn secondary" style={{ height: 42 }} onClick={reenviar} disabled={espera > 0}>
          {espera > 0 ? `Reenviar em ${espera}s` : 'Reenviar o e-mail'}
        </button>

        <div style={{ fontSize: 12.5, lineHeight: 1.55, color: 'var(--ink-mute)' }}>
          O e-mail não chegou de jeito nenhum? Pode ser o filtro do servidor da UFCG. Avise a equipe do projeto — sem esse
          link não há como liberar a conta.
        </div>

        <button className="btn ghost" style={{ height: 38 }} onClick={() => { logout(); navigate('/'); }}>
          Sair desta conta
        </button>
      </div>
    </div>
  );
}
