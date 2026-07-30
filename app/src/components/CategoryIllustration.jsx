import { useState } from 'react';
import { photoFor } from '../photos.js';

const PALETTE = {
  bg: '#F3EFE6',
  line: '#D8D2C4',
  accent: '#23456B',
  accentSoft: '#7C93AC',
  warn: '#B4772C',
  paper: '#FFFFFF'
};

function Base({ children }) {
  return (
    <svg viewBox="0 0 220 160" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="220" height="160" fill={PALETTE.bg} />
      {children}
    </svg>
  );
}

const ILLUSTRATIONS = {
  Banheiros: () => (
    <Base>
      <rect x="70" y="30" width="40" height="70" rx="4" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx="90" cy={38 + i * 13} rx="18" ry="6" fill="none" stroke={PALETTE.line} strokeWidth="2" />
      ))}
      <rect x="120" y="60" width="26" height="34" rx="3" fill={PALETTE.accent} opacity="0.15" />
      <path d="M126 60 v-10 a7 7 0 0 1 14 0 v10" fill="none" stroke={PALETTE.accent} strokeWidth="3" />
      <line x1="40" y1="120" x2="180" y2="120" stroke={PALETTE.line} strokeWidth="2" />
    </Base>
  ),
  Climatização: () => (
    <Base>
      <rect x="55" y="45" width="110" height="34" rx="6" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2" />
      <circle cx="72" cy="62" r="4" fill={PALETTE.accentSoft} />
      {[95, 115, 135, 150].map((x, i) => (
        <line key={i} x1={x} y1="79" x2={x - 6} y2="100" stroke={PALETTE.accentSoft} strokeWidth="3" strokeLinecap="round" />
      ))}
      <g transform="translate(110,110)" stroke={PALETTE.warn} strokeWidth="3" strokeLinecap="round">
        <line x1="-14" y1="0" x2="14" y2="0" />
        <line x1="-14" y1="-14" x2="14" y2="14" />
        <line x1="14" y1="-14" x2="-14" y2="14" />
      </g>
    </Base>
  ),
  Alimentação: () => (
    <Base>
      <ellipse cx="110" cy="95" rx="55" ry="14" fill={PALETTE.line} opacity="0.5" />
      <circle cx="110" cy="75" r="34" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2" />
      <circle cx="110" cy="75" r="20" fill={PALETTE.bg} stroke={PALETTE.line} strokeWidth="1.5" />
      <g stroke={PALETTE.accent} strokeWidth="3" strokeLinecap="round">
        <line x1="70" y1="50" x2="70" y2="72" />
        <line x1="64" y1="50" x2="64" y2="62" />
        <line x1="76" y1="50" x2="76" y2="62" />
        <path d="M150 50 v22" />
        <path d="M144 50 q0 12 12 12" />
      </g>
    </Base>
  ),
  'Salas de aula': () => (
    <Base>
      <rect x="45" y="35" width="130" height="70" rx="4" fill={PALETTE.accent} opacity="0.12" stroke={PALETTE.line} strokeWidth="2" />
      <line x1="60" y1="55" x2="120" y2="55" stroke={PALETTE.accentSoft} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="68" x2="150" y2="68" stroke={PALETTE.accentSoft} strokeWidth="3" strokeLinecap="round" />
      <line x1="60" y1="81" x2="100" y2="81" stroke={PALETTE.accentSoft} strokeWidth="3" strokeLinecap="round" />
      <rect x="90" y="115" width="40" height="6" rx="3" fill={PALETTE.line} />
      <rect x="100" y="105" width="20" height="14" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2" />
    </Base>
  ),
  Acessibilidade: () => (
    <Base>
      <circle cx="100" cy="45" r="9" fill={PALETTE.accent} />
      <path d="M100 58 v22 l-18 20" fill="none" stroke={PALETTE.accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M100 70 l24 6" fill="none" stroke={PALETTE.accent} strokeWidth="6" strokeLinecap="round" />
      <path d="M100 80 l20 20" fill="none" stroke={PALETTE.accent} strokeWidth="6" strokeLinecap="round" />
      <circle cx="95" cy="118" r="26" fill="none" stroke={PALETTE.warn} strokeWidth="6" />
      <line x1="80" y1="103" x2="150" y2="130" stroke={PALETTE.warn} strokeWidth="6" strokeLinecap="round" />
      <circle cx="150" cy="130" r="6" fill={PALETTE.warn} />
    </Base>
  ),
  Internet: () => (
    <Base>
      <g stroke={PALETTE.accentSoft} strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M55 85 a75 75 0 0 1 110 0" />
        <path d="M72 100 a50 50 0 0 1 76 0" />
        <path d="M89 115 a25 25 0 0 1 42 0" />
      </g>
      <circle cx="110" cy="128" r="6" fill={PALETTE.accent} />
      <line x1="45" y1="50" x2="175" y2="120" stroke={PALETTE.warn} strokeWidth="4" strokeLinecap="round" />
    </Base>
  ),
  Iluminação: () => (
    <Base>
      <line x1="110" y1="30" x2="110" y2="55" stroke={PALETTE.line} strokeWidth="3" />
      <circle cx="110" cy="70" r="22" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2" />
      <path d="M102 88 h16 l-4 12 h-8 z" fill={PALETTE.line} />
      <g stroke={PALETTE.warn} strokeWidth="3" strokeLinecap="round">
        <line x1="110" y1="112" x2="110" y2="128" />
        <line x1="95" y1="118" x2="88" y2="132" />
        <line x1="125" y1="118" x2="132" y2="132" />
      </g>
    </Base>
  ),
  Laboratórios: () => (
    <Base>
      <path d="M96 40 v28 l-24 42 a8 8 0 0 0 7 12 h62 a8 8 0 0 0 7 -12 l-24 -42 v-28" fill={PALETTE.paper} stroke={PALETTE.line} strokeWidth="2.5" />
      <path d="M84 88 h52" stroke={PALETTE.line} strokeWidth="2" />
      <path d="M88 92 l-14 24 a8 8 0 0 0 7 12 h62 a8 8 0 0 0 7 -12 l-14 -24 z" fill={PALETTE.accent} opacity="0.18" />
      <line x1="90" y1="38" x2="130" y2="38" stroke={PALETTE.line} strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="105" r="3" fill={PALETTE.accentSoft} />
      <circle cx="112" cy="115" r="2.4" fill={PALETTE.accentSoft} />
      <circle cx="122" cy="102" r="2" fill={PALETTE.accentSoft} />
    </Base>
  )
};

function DrawnIllustration({ cat }) {
  const Illustration = ILLUSTRATIONS[cat] || ILLUSTRATIONS['Salas de aula'];
  return <Illustration />;
}

export default function CategoryIllustration({ cat, className, style }) {
  const [failed, setFailed] = useState(false);
  const photo = photoFor(cat);

  return (
    <div className={className} style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }}>
      {!failed ? (
        <img
          src={photo.url}
          alt={photo.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <DrawnIllustration cat={cat} />
      )}
    </div>
  );
}
