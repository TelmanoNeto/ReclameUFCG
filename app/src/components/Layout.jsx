import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../AppContext.jsx';
import { initials } from '../time.js';
import GateModal from './GateModal.jsx';
import Toast from './Toast.jsx';
import TrendingAside from './TrendingAside.jsx';

const SIDE_ITEMS = [
  { label: 'Feed', path: '/', gated: false },
  { label: 'Em alta', path: '/em-alta', gated: false },
  { label: 'Novo relato', path: '/novo', gated: 'publicar' },
  { label: 'Perfil', path: '/perfil', gated: 'comentar' }
];

const BOTTOM_ITEMS = [
  { label: 'Feed', path: '/', icon: '▤', gated: false },
  { label: 'Em alta', path: '/em-alta', icon: '▲', gated: false },
  { label: 'Publicar', path: '/novo', icon: '＋', gated: 'publicar' },
  { label: 'Perfil', path: '/perfil', icon: '◍', gated: 'comentar' }
];

export default function Layout() {
  const { isLogged, currentUser, openGate } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');

  function go(path, gated) {
    if (gated && openGate(gated)) return;
    navigate(path);
  }

  function onSearchChange(e) {
    setQuery(e.target.value);
    if (location.pathname !== '/') navigate('/');
  }

  return (
    <div className="app-shell">
      <div className="topbar">
        <button className="brand" onClick={() => go('/')}>
          Reclame<span>UFCG</span>
        </button>
        <div className="searchbox">
          <span className="mono" style={{ marginRight: 0 }}>/</span>
          <input placeholder="Buscar relatos, blocos, categorias…" value={query} onChange={onSearchChange} />
        </div>
        <div className="topbar-actions">
          {!isLogged && (
            <>
              <button className="btn secondary" style={{ height: 36 }} onClick={() => go('/entrar')}>Entrar</button>
              <button className="btn" style={{ height: 36 }} onClick={() => go('/cadastro')}>Criar conta</button>
            </>
          )}
          {isLogged && (
            <>
              <button className="btn" style={{ height: 36 }} onClick={() => go('/novo')}>Novo relato</button>
              <button
                onClick={() => go('/perfil')}
                style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <span className="avatar" style={{ width: 32, height: 32, fontSize: 12.5 }}>{initials(currentUser.nome)}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{currentUser.nome.split(' ')[0]}</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mobile-topbar">
        <div className="mobile-topbar-row">
          <button className="brand" style={{ fontSize: 17 }} onClick={() => go('/')}>
            Reclame<span>UFCG</span>
          </button>
          {!isLogged && (
            <button className="btn secondary" style={{ height: 30, padding: '0 13px', fontSize: 12.5 }} onClick={() => go('/entrar')}>Entrar</button>
          )}
          {isLogged && (
            <button onClick={() => go('/perfil')} className="avatar" style={{ width: 30, height: 30, fontSize: 11.5, border: 'none', cursor: 'pointer' }}>
              {initials(currentUser.nome)}
            </button>
          )}
        </div>
        <div className="searchbox" style={{ height: 34 }}>
          <span className="mono">/</span>
          <input placeholder="Buscar relatos, blocos…" value={query} onChange={onSearchChange} style={{ fontSize: 13 }} />
        </div>
      </div>

      <div className="body-row">
        <div className="sidebar">
          {SIDE_ITEMS.map((it) => (
            <button
              key={it.path}
              className={`sidebar-item ${location.pathname === it.path ? 'on' : ''}`}
              onClick={() => go(it.path, it.gated)}
            >
              {it.label}
            </button>
          ))}
          <div className="sidebar-hint">Navegar é livre. Apoiar, comentar e publicar pedem conta.</div>
        </div>

        <div className="main-col">
          <Outlet context={{ query }} />
        </div>

        <TrendingAside />
      </div>

      <div className="bottom-nav">
        {BOTTOM_ITEMS.map((it) => (
          <button
            key={it.path}
            className={`bottom-nav-item ${location.pathname === it.path ? 'on' : ''}`}
            onClick={() => go(it.path, it.gated)}
          >
            <span className="icon">{it.icon}</span>
            <span className="label">{it.label}</span>
          </button>
        ))}
      </div>

      <GateModal />
      <Toast />
    </div>
  );
}
