import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { CAMPI, CURSOS, PERIODOS, MATRICULA_DIGITOS } from '../data.js';
import { maskPhone, somenteDigitos, isEmailUFCG } from '../time.js';

const FIELDS = [
  { key: 'nome', label: 'Nome completo', placeholder: 'Seu nome' },
  {
    key: 'email',
    label: 'E-mail institucional',
    placeholder: 'seu.nome@ccc.ufcg.edu.br',
    type: 'email',
    hint: 'Qualquer domínio da UFCG serve — @ccc, @ee, @estudante, @ufcg.edu.br…'
  },
  { key: 'senha', label: 'Senha', placeholder: '••••••••', type: 'password' },
  { key: 'senha2', label: 'Confirmar senha', placeholder: 'digite a senha de novo', type: 'password' },
  { key: 'telefone', label: 'Telefone', placeholder: '(83) 9 9999-9999', type: 'tel', mask: maskPhone, maxLength: 16, inputMode: 'numeric' },
  {
    key: 'matricula',
    label: 'Matrícula',
    placeholder: `${MATRICULA_DIGITOS} dígitos`,
    mask: (v) => somenteDigitos(v, MATRICULA_DIGITOS),
    maxLength: MATRICULA_DIGITOS,
    inputMode: 'numeric',
    hint: `Exatamente ${MATRICULA_DIGITOS} dígitos, sem pontos ou traços.`
  }
];

export default function Signup() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', senha2: '', telefone: '', matricula: '',
    curso: CURSOS[0], campus: CAMPI[0], periodo: PERIODOS[0]
  });
  const [error, setError] = useState('');

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isEmailUFCG(form.email)) {
      setError('O cadastro é só para alunos da UFCG — use seu e-mail institucional.');
      return;
    }
    if (form.matricula.length !== MATRICULA_DIGITOS) {
      setError(`A matrícula precisa ter exatamente ${MATRICULA_DIGITOS} dígitos.`);
      return;
    }
    if (form.senha !== form.senha2) {
      setError('As duas senhas não são iguais.');
      return;
    }
    const dados = { ...form };
    delete dados.senha2;
    const res = signup(dados);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    navigate('/');
  }

  const senhasDiferem = form.senha2.length > 0 && form.senha !== form.senha2;
  // Só acusa erro quando o e-mail já parece completo, para não piscar em vermelho a cada tecla.
  const emailInvalido = form.email.includes('@') && form.email.includes('.') && !isEmailUFCG(form.email);

  return (
    <div className="auth-page" style={{ maxWidth: 480 }}>
      <button className="back-link" onClick={() => navigate('/')}>← continuar navegando sem conta</button>
      <div className="auth-title">Criar conta</div>
      <div className="auth-sub">
        A conta é só para alunos da UFCG, com e-mail institucional. Você só precisa de conta para publicar, comentar e apoiar — ler é livre.
      </div>
      <form className="card" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}
        {FIELDS.map((f) => {
          const erroCampo =
            (f.key === 'email' && emailInvalido && 'Precisa ser um e-mail da UFCG (com ".ufcg." no domínio).') ||
            (f.key === 'senha2' && senhasDiferem && 'As senhas não coincidem.') ||
            (f.key === 'matricula' && form.matricula.length > 0 && form.matricula.length < MATRICULA_DIGITOS &&
              `Faltam ${MATRICULA_DIGITOS - form.matricula.length} dígito(s).`) ||
            '';
          return (
            <div className="field-group" key={f.key}>
              <div className="field-label">{f.label}</div>
              <input
                className="input"
                type={f.type || 'text'}
                inputMode={f.inputMode}
                maxLength={f.maxLength}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => setField(f.key, f.mask ? f.mask(e.target.value) : e.target.value)}
                aria-invalid={!!erroCampo}
                required
              />
              {(erroCampo || f.hint) && (
                <div className={`field-hint ${erroCampo ? 'erro' : ''}`}>{erroCampo || f.hint}</div>
              )}
            </div>
          );
        })}
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
