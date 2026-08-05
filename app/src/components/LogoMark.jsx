// Marca do ReclameUFCG: balão de fala com um "!" dentro.
// O traço herda a cor do texto ao redor (currentColor), então acompanha o
// .brand sem precisar de ajuste em cada lugar onde é usado.
export default function LogoMark({ className = '' }) {
  return (
    <svg
      className={`logo-mark ${className}`}
      viewBox="0 0 33 32"
      role="img"
      aria-label="ReclameUFCG"
      focusable="false"
    >
      <path
        d="M8 3 H24 A5 5 0 0 1 29 8 V17 A5 5 0 0 1 24 22 H16 L9 29 V22 A5 5 0 0 1 4 17 V8 A5 5 0 0 1 8 3 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect x="15.2" y="7" width="2.6" height="7.5" rx="1.3" fill="var(--accent)" />
      <circle cx="16.5" cy="18" r="1.5" fill="var(--accent)" />
    </svg>
  );
}
