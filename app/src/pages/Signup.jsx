import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CAMPI, CURSOS, PERIODOS } from '../data.js';

const FIELDS = [
  { key: 'nome', label: 'Nome completo', placeholder: 'Seu nome' },
  { key: 'email', label: 'E-mail', placeholder: 'qualquer e-mail — não precisa ser institucional' },
  { key: 'senha', label: 'Senha', placeholder: '••••••••', type: 'password' },
  { key: 'telefone', label: 'Telefone', placeholder: '(83) 9 9999-9999' },
  { key: 'matricula', label: 'Matrícula', placeholder: 'Seu número de matrícula' }
];

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', telefone: '', matricula: '',
    curso: CURSOS[0], campus: CAMPI[0], periodo: PERIODOS[0]
  });
  const [error, setError] = useState('');

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const res = signup(form);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/');
  }

  return (
    <div className="auth-page" style={{ maxWidth: 480 }}>
      <button className="back-link" onClick={() => navigate('/')}>← continuar navegando sem conta</button>
      <div className="auth-title">Criar conta</div>
      <div className="auth-sub">
        Qualquer e-mail é aceito — não precisa ser institucional. Você só precisa de conta para publicar, comentar e apoiar.
      </div>
      <form className="card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {FIELDS.map((f) => (
          <div className="field-group" key={f.key}>
            <div className="field-label">{f.label}</div>
            <input
              className="input"
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
              required
            />
          </div>
        ))}
        <div className="field-group">
          <div className="field-label">Curso</div>
          <select className="input" value={form.curso} onChange={(e) => setField('curso', e.target.value)}>
            {CURSOS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className="two-col">
          <div className="field-group" style={{ flex: 1 }}>
            <div className="field-label">Campus</div>
            <select className="input" value={form.campus} onChange={(e) => setField('campus', e.target.value)}>
              {CAMPI.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="field-group" style={{ flex: 1 }}>
            <div className="field-label">Período</div>
            <select className="input" value={form.periodo} onChange={(e) => setField('periodo', e.target.value)}>
              {PERIODOS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>
        <button className="btn" style={{ height: 46, marginTop: 4 }} type="submit">Criar conta</button>
        <div style={{ fontSize: 13, color: 'var(--ink-mute)', textAlign: 'center' }}>
          Já tem conta?{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/entrar')}>
            Entrar
          </span>
        </div>
      </form>
    </div>
  );
}
