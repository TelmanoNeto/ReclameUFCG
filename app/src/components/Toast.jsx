import { useApp } from '../AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return (
    <div className="toast">
      <div className="toast-pill">{toast}</div>
    </div>
  );
}
