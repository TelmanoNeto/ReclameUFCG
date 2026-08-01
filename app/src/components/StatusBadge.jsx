import { statusInfo, STATUS_LIST } from '../data.js';

export function StatusBadge({ status }) {
  const info = statusInfo(status);
  return <span className={`status-badge ${info.id}`}>{info.label}</span>;
}

export function StatusPicker({ status, onChange }) {
  const atual = statusInfo(status).id;
  return (
    <div className="status-picker">
      <div className="field-label">Situação do relato — só você pode alterar</div>
      <div className="filters-row">
        {STATUS_LIST.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`status-option ${s.id} ${atual === s.id ? 'on' : ''}`}
            onClick={() => onChange(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
