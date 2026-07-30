export function timeAgo(timestamp) {
  const diffMs = Date.now() - timestamp;
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return `há ${d} d`;
}

export function initials(name) {
  if (!name || name === 'Anônimo') return 'AN';
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export function courseAbbrev(curso) {
  const map = {
    'Ciência da Computação': 'CC',
    'Engenharia Elétrica': 'Eng. Elétrica',
    'Engenharia Civil': 'Eng. Civil',
    Medicina: 'Medicina',
    Direito: 'Direito',
    Letras: 'Letras',
    'Engenharia de Materiais': 'Eng. Materiais'
  };
  return map[curso] || curso || '';
}
