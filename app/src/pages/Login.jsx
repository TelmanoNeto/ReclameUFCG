import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    const res = await login(email, senha);
    setEnviando(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/');
  }

  return (
    <div className="auth-page">
      <button className="back-link" onClick={() => navigate('/')}>← continuar navegando sem conta</button>
      <div className="auth-title">Entrar</div>
      <div className="auth-sub">A conta serve só para publicar, comentar e apoiar. Ler o feed, buscar e filtrar não exige login.</div>
      <form className="card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        <div className="field-group">
          <div className="field-label">E-mail</div>
          <input className="input" type="email" placeholder="seu.nome@ccc.ufcg.edu.br" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field-group">
          <div className="field-label">Senha</div>
          <input className="input" type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button className="btn" style={{ height: 46, marginTop: 4 }} type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <div style={{ fontSize: 13, color: 'var(--ink-mute)', textAlign: 'center' }}>
          Não tem conta?{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/cadastro')}>
            Cadastre-se
          </span>
        </div>
      </form>
    </div>
  );
}
