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

// Aceita qualquer domínio da UFCG: os e-mails variam por curso/centro
// (@ccc.ufcg.edu.br, @ee.ufcg.edu.br, @estudante.ufcg.edu.br, @ufcg.edu.br…).
// A regra é ter ".ufcg." no domínio — ou o domínio começar com "ufcg.",
// que é o caso de @ufcg.edu.br, onde não existe o ponto da frente.
export function isEmailUFCG(email) {
  const partes = (email || '').trim().toLowerCase().split('@');
  if (partes.length !== 2 || !partes[0] || !partes[1]) return false;
  const dominio = partes[1];
  return dominio.includes('.ufcg.') || dominio.startsWith('ufcg.');
}

export function somenteDigitos(value, max) {
  const d = (value || '').replace(/\D/g, '');
  return max ? d.slice(0, max) : d;
}

// (83) 9 9999-9999 para celular, (83) 3333-3333 para fixo.
export function maskPhone(value) {
  const d = (value || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  const ddd = `(${d.slice(0, 2)}) `;
  if (d.length <= 6) return ddd + d.slice(2);
  if (d.length <= 10) return `${ddd}${d.slice(2, 6)}-${d.slice(6)}`;
  return `${ddd}${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
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
