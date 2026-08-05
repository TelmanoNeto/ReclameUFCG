export const CATS = ['Banheiros', 'Salas de aula', 'Estrutura', 'Acessibilidade', 'Climatização', 'Alimentação', 'Laboratórios', 'Iluminação', 'Internet'];
export const CAMPI = ['Campina Grande', 'Cajazeiras', 'Cuité', 'Patos', 'Pombal', 'Sousa', 'Sumé'];

// Locais de reclamação por campus.
//
// Campina Grande (sede) segue a legenda do mapa oficial da Prefeitura
// Universitária (prefeitura.ufcg.edu.br/mapas, arquivo Campina_Grande_Horizontal.pdf,
// conferido em 04/08/2026): todos os blocos com sigla, na íntegra.
//
// O agrupamento é por SETOR (A, B, C), como no mapa — não por centro. Boa parte
// dos prédios não pertence a centro nenhum (CAA, CK, CL, CM, os laboratórios do
// setor C), então agrupar por centro obrigaria a inventar vínculos que a planta
// não afirma. Blocos sem nome na legenda ficam só com a sigla, de propósito.
//
// Os demais campi ainda seguem a estrutura por centro do protótipo e continuam
// pendentes de conferência com a planta de cada um.
export const LOCAIS_POR_CAMPUS = {
  'Campina Grande': [
    {
      grupo: 'Setor A · Administração e convivência',
      locais: [
        'Bloco AA · Reitoria',
        'Bloco AB · Administrativo',
        'Bloco AC · Restaurante Universitário',
        'Bloco AD · Biblioteca Central',
        'Bloco AE · Ginásio de Esportes',
        'Bloco AF · Smart Campus',
        'Bloco AF 1 · Caixa Econômica',
        'Bloco AG · Engenharia (PU)',
        'Bloco AH · Posto Médico',
        'Bloco AI · Banco do Brasil',
        'Bloco AJ · Prefeitura Universitária',
        'Bloco AJ 1 · Apoio',
        'Bloco AK · CredUni',
        'Bloco AL · Centro de Extensão',
        'Bloco AL 1 · Centro de Eventos Rosa Tânia',
        'Bloco AO · Licitação',
        'Bloco AO 1 · Cabine de Medição',
        'Arquivo Setorial',
        'SIASS'
      ]
    },
    {
      grupo: 'Setor B · Humanidades, engenharias e laboratórios',
      locais: [
        'Bloco BA · Centro de Humanidades / Central de Línguas / DART',
        'Bloco BB · Controle Acadêmico',
        'Bloco BC · Central de Aulas',
        'Bloco BC 1 · Ambiente de Professor CH',
        'Bloco BD · Central de Aulas',
        'Bloco BE · Creche Pré-Escola',
        'Bloco BF · Centro Gemológico do Nordeste',
        'Bloco BF 1 · Unidade Acadêmica de Música',
        'Bloco BF 2 · Mineralogia',
        'Bloco BG · Central de Aulas',
        'Bloco BH · História e Geografia',
        'Bloco BI · Laboratório de Solos',
        'Bloco BJ · Engenharia Mecânica',
        'Bloco BK · Espaço de Ensaios',
        'Bloco BK 1 · Engenharia de Produção',
        'Bloco BL · Oficinas Mecânicas',
        'Bloco BM · Almoxarifado',
        'Bloco BN · Engenharia Elétrica',
        'Bloco BO · Unidade Acadêmica de Design',
        'Bloco BP · ATECEL',
        'Bloco BQ · Pró-Reitorias',
        'Bloco BR · Laboratório de Máquinas e Motores',
        'Bloco BS · Mineralogia',
        'Bloco BT · Ecologia',
        'Bloco BU · Hidráulica',
        'Bloco BV · SINTESP-PB',
        'Bloco BV 1 · ADUFCG',
        'Bloco BW · SINTESU UFCG',
        'Bloco BW 1 · LAM · Análise de Minerais',
        'Bloco BX · Laboratório de Crustáceos',
        'Bloco BZ · Central de Aulas',
        'Apicultura',
        'Design (anexo)',
        'LabInf',
        'Museu do Semiárido'
      ]
    },
    {
      grupo: 'Setor C · CCT, CEEI e laboratórios',
      locais: [
        'Bloco CA · Central de Aulas',
        'Bloco CA 1 · Petróleo',
        'Bloco CAA · Central de Aulas',
        'Bloco CB · REENGE · Central de Aulas',
        'Bloco CD · Central de Aulas / Estatística',
        'Bloco CE · Central Telefônica',
        'Bloco CF · Grupos de Sistemas Elétricos',
        'Bloco CG · Laboratório de Elétrica',
        'Bloco CH · Laboratório de Elétrica',
        'Bloco CH 1 · LARCA',
        'Bloco CJ 1 · Metrologia (anexo)',
        'Bloco CK',
        'Bloco CL',
        'Bloco CM',
        'Bloco CN',
        'Bloco CO · LSD',
        'Bloco CP · Laboratório de Informática / Agroambiental',
        'Bloco CQ · Diretoria do CCT',
        'Bloco CR · Laboratório de Hidráulica',
        'Bloco CS · Laboratório de Irrigação e Salinidade',
        'Bloco CT · Laboratório de Engenharia Civil',
        'Bloco CV · Laboratório de Saneamento',
        'Bloco CV 1 · Laboratório de Caracterização',
        'Bloco CV 2',
        'Bloco CW · Arquitetura',
        'Bloco CW 2 · Química',
        'Bloco CX · Laboratório de Química',
        'Bloco CX 1 · Matemática',
        'Bloco CY · Laboratório de Física',
        'Bloco CY 1 · Física',
        'Bloco CZ · Engenharia Agrícola',
        'Bloco CZ 1 · Laboratório de Beneficiamento de Sementes',
        'Agroindustrial',
        'CEEI',
        'CERNE',
        'Embedded · Nokia',
        'Engenharia de Alimentos',
        'Engenharia de Produção',
        'Estufa',
        'Fontes Renováveis',
        'IECOM',
        'IQUANTA',
        'LabDes',
        'Laboratório de Criogenia',
        'Laboratório Multiusuário',
        'LabPetri',
        'Laboratórios CEEI',
        'Metrologia',
        'Resíduos Sólidos',
        'Sistema de Potência',
        'Subestação'
      ]
    },
    {
      grupo: 'Áreas comuns e setor esportivo',
      locais: [
        'Bancos',
        'Campo de futebol',
        'Centro Esportivo',
        'Coreto',
        'Estacionamento',
        'Guarita',
        'Praça das Engenharias',
        'Quadra de areia',
        'Quadra de tênis',
        'Quiosques',
        'Hospital Universitário Alcides Carneiro'
      ]
    }
  ],
  Cajazeiras: [
    {
      grupo: 'CFP · Centro de Formação de Professores',
      locais: [
        'CFP · Bloco de Salas I', 'CFP · Bloco de Salas II', 'CFP · Laboratórios',
        'CFP · Auditório', 'CFP · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ],
  Cuité: [
    {
      grupo: 'CES · Centro de Educação e Saúde',
      locais: [
        'CES · Bloco de Salas I', 'CES · Bloco de Salas II', 'CES · Laboratório de Química',
        'CES · Laboratórios de Saúde', 'CES · Auditório', 'CES · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ],
  Patos: [
    {
      grupo: 'CSTR · Centro de Saúde e Tecnologia Rural',
      locais: [
        'CSTR · Bloco de Salas I', 'CSTR · Bloco de Salas II', 'CSTR · Hospital Veterinário',
        'CSTR · Laboratórios', 'CSTR · Auditório', 'CSTR · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ],
  Pombal: [
    {
      grupo: 'CCTA · Centro de Ciências e Tecnologia Agroalimentar',
      locais: [
        'CCTA · Bloco de Salas I', 'CCTA · Bloco de Salas II', 'CCTA · Laboratórios',
        'CCTA · Auditório', 'CCTA · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ],
  Sousa: [
    {
      grupo: 'CCJS · Centro de Ciências Jurídicas e Sociais',
      locais: [
        'CCJS · Bloco de Salas I', 'CCJS · Bloco de Salas II', 'CCJS · Núcleo de Práticas Jurídicas',
        'CCJS · Auditório', 'CCJS · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ],
  Sumé: [
    {
      grupo: 'CDSA · Centro de Desenvolvimento Sustentável do Semiárido',
      locais: [
        'CDSA · Bloco de Salas I', 'CDSA · Bloco de Salas II', 'CDSA · Laboratórios',
        'CDSA · Auditório', 'CDSA · Biblioteca Setorial'
      ]
    },
    { grupo: 'Áreas comuns', locais: ['RU · Restaurante Universitário', 'Quadra poliesportiva', 'Portaria principal', 'Estacionamento'] }
  ]
};

// Lista plana dos locais de um campus — vazia enquanto nenhum campus é escolhido.
export function locaisDoCampus(campus) {
  const grupos = LOCAIS_POR_CAMPUS[campus] || [];
  return grupos.flatMap((g) => g.locais);
}

export const MATRICULA_DIGITOS = 9;

// Cursos de graduação por campus. Confira com o catálogo oficial da UFCG antes
// de ir para produção: a oferta muda a cada ano e alguns cursos têm
// habilitações separadas (licenciatura/bacharelado, diurno/noturno).
export const CURSOS_POR_CAMPUS = {
  'Campina Grande': [
    'Administração',
    'Arquivologia',
    'Arte e Mídia',
    'Ciência da Computação',
    'Ciências Biológicas',
    'Ciências Econômicas',
    'Ciências Sociais',
    'Comunicação Social — Jornalismo',
    'Design',
    'Direito',
    'Enfermagem',
    'Engenharia Agrícola',
    'Engenharia Civil',
    'Engenharia de Alimentos',
    'Engenharia de Biotecnologia e Bioprocessos',
    'Engenharia de Materiais',
    'Engenharia de Minas',
    'Engenharia de Petróleo',
    'Engenharia de Produção',
    'Engenharia Elétrica',
    'Engenharia Mecânica',
    'Engenharia Química',
    'Estatística',
    'Farmácia',
    'Filosofia',
    'Física',
    'Geografia',
    'História',
    'Letras — Língua Inglesa',
    'Letras — Língua Portuguesa',
    'Matemática',
    'Medicina',
    'Meteorologia',
    'Música',
    'Nutrição',
    'Odontologia',
    'Pedagogia',
    'Psicologia',
    'Química',
    'Serviço Social'
  ],
  Cajazeiras: [
    'Ciências Biológicas',
    'Enfermagem',
    'Física',
    'Geografia',
    'História',
    'Letras — Língua Inglesa',
    'Letras — Língua Portuguesa',
    'Matemática',
    'Medicina',
    'Pedagogia'
  ],
  Cuité: [
    'Ciências Biológicas',
    'Enfermagem',
    'Farmácia',
    'Física',
    'Matemática',
    'Nutrição',
    'Química'
  ],
  Patos: [
    'Engenharia Florestal',
    'Medicina Veterinária'
  ],
  Pombal: [
    'Agronomia',
    'Engenharia Ambiental',
    'Engenharia de Alimentos',
    'Engenharia de Biossistemas',
    'Engenharia Civil'
  ],
  Sousa: [
    'Administração',
    'Ciências Contábeis',
    'Direito',
    'Serviço Social'
  ],
  Sumé: [
    'Agroecologia',
    'Ciências Sociais',
    'Engenharia de Biossistemas',
    'Engenharia de Produção',
    'Gestão Pública',
    'Licenciatura em Ciências Sociais',
    'Tecnologia em Agroecologia'
  ]
};

export function cursosDoCampus(campus) {
  return CURSOS_POR_CAMPUS[campus] || [];
}

// Lista plana, sem repetições — usada nos filtros do feed.
export const CURSOS = [...new Set(Object.values(CURSOS_POR_CAMPUS).flat())].sort((a, b) =>
  a.localeCompare(b, 'pt-BR')
);
// Do período mais recente (2026.2) até 2017.1, em ordem decrescente.
export const PERIODOS = (() => {
  const out = [];
  for (let ano = 2026; ano >= 2017; ano--) {
    out.push(`${ano}.2`, `${ano}.1`);
  }
  return out;
})();

export const STATUS_LIST = [
  { id: 'nao_resolvida', label: 'Não resolvida', curto: 'não resolvida' },
  { id: 'parcial', label: 'Parcialmente resolvida', curto: 'parcialmente resolvida' },
  { id: 'resolvida', label: 'Resolvida', curto: 'resolvida' }
];

export const STATUS_PADRAO = 'nao_resolvida';

export function statusInfo(id) {
  return STATUS_LIST.find((s) => s.id === id) || STATUS_LIST[0];
}

export const MAX_FOTOS = 4;

export const REGRAS = [
  {
    titulo: 'Acusação precisa de fato verificável',
    texto: 'Descreva o que aconteceu, onde e quando. Relato é sobre o problema — não sobre opinião a respeito de uma pessoa.'
  },
  {
    titulo: 'Nada de dado pessoal de terceiros',
    texto: 'Não publique nome de servidor, foto de rosto, telefone, matrícula ou endereço de outra pessoa. Descreva o cargo ou o setor, não o indivíduo.'
  },
  {
    titulo: 'Sem ofensa pessoal',
    texto: 'Criticar a estrutura, a gestão e o serviço é o objetivo do app. Xingar, humilhar ou ameaçar alguém, não.'
  },
  {
    titulo: 'Só problemas da UFCG',
    texto: 'O relato precisa ser sobre um campus, um bloco ou um serviço da universidade.'
  }
];

// Motivos de denúncia. `urgente` = o dano não dá para desfazer depois, então
// uma única denúncia já coloca o relato em revisão.
export const MOTIVOS_DENUNCIA = [
  { id: 'dado_pessoal', label: 'Expõe dado pessoal de alguém', urgente: true },
  { id: 'ofensa', label: 'Ofensa, ameaça ou discurso de ódio', urgente: false },
  { id: 'falso', label: 'Informação falsa ou de má-fé', urgente: false },
  { id: 'fora_do_escopo', label: 'Não é sobre a UFCG', urgente: false }
];

export function motivoInfo(id) {
  return MOTIVOS_DENUNCIA.find((m) => m.id === id) || null;
}

// Quantas denúncias colocam um relato em revisão.
// Até 30 apoios vale o mínimo fixo; a partir daí, 10% dos apoios.
// A parte proporcional é o que protege contra denúncia em massa: um relato com
// 300 apoios tem apoio real da comunidade e precisa de 30 denúncias, não de 3.
export const DENUNCIA_MINIMO = 3;
export const DENUNCIA_PERCENTUAL = 0.1;

export function limiarDenuncias(apoios) {
  return Math.max(DENUNCIA_MINIMO, Math.ceil((apoios || 0) * DENUNCIA_PERCENTUAL));
}

// Dois relatos são "semelhantes" quando são da mesma categoria, no mesmo campus
// e no mesmo bloco. O número da sala é descartado: 'CCT · Bloco CN · Sala 302'
// e 'CCT · Bloco CN · Sala 304' são o mesmo tópico.
export function localBase(local) {
  return (local || '').split(' · ').slice(0, 2).join(' · ');
}

export function chaveDoTopico(post) {
  return `${post.cat}|${post.campus}|${localBase(post.local)}`;
}

// Os 8 temas do modo assistido saem da contagem das respostas do formulário de
// validação (41 respostas): banheiro 24, equipamento de sala 16, estrutura 14,
// acesso 13, climatização 10, alimentação 9, laboratório 5, energia/luz 4.
// Internet (2 citações) ficou de fora do fluxo guiado e segue como categoria manual.
export const ASSIST_TEMAS = [
  {
    id: 'banheiro',
    label: 'Banheiro',
    cat: 'Banheiros',
    q: 'O que está faltando ou quebrado no banheiro?',
    opcoes: [
      'Sem papel higiênico',
      'Sem sabão',
      'Sem água',
      'Descarga ou torneira quebrada',
      'Sujo, sem limpeza',
      'Porta ou tranca quebrada'
    ]
  },
  {
    id: 'sala',
    label: 'Equipamento da sala',
    cat: 'Salas de aula',
    q: 'O que está faltando ou quebrado na sala?',
    opcoes: [
      'Projetor / datashow não funciona',
      'Quadro em mau estado',
      'Sem pincel ou apagador',
      'Cadeiras quebradas',
      'Cadeiras insuficientes para a turma',
      'Sala suja'
    ]
  },
  {
    id: 'estrutura',
    label: 'Estrutura do prédio',
    cat: 'Estrutura',
    q: 'Qual é o problema na estrutura?',
    opcoes: [
      'Mofo nas paredes',
      'Infiltração ou vazamento',
      'Bloco interditado por risco',
      'Prédio sem manutenção há muito tempo',
      'Obra parada ou mal feita'
    ]
  },
  {
    id: 'acesso',
    label: 'Caminhos e acesso',
    cat: 'Acessibilidade',
    q: 'O que dificulta chegar ou circular?',
    opcoes: [
      'Caminho alaga quando chove',
      'Lama ou terra no percurso',
      'Calçada irregular ou inexistente',
      'Sem rampa para cadeirante',
      'Elevador quebrado',
      'Sem cobertura entre os blocos'
    ]
  },
  {
    id: 'clima',
    label: 'Ar-condicionado e calor',
    cat: 'Climatização',
    q: 'O que está acontecendo com a climatização?',
    opcoes: [
      'Ar-condicionado quebrado',
      'Sala não tem ar-condicionado',
      'Ar faz barulho e atrapalha a aula',
      'Sala abafada, sem ventilação'
    ]
  },
  {
    id: 'comida',
    label: 'Comida: RU e cantina',
    cat: 'Alimentação',
    q: 'Qual é o problema com a alimentação?',
    opcoes: [
      'Centro sem RU',
      'Centro sem cantina ou lanchonete',
      'Fila muito longa no almoço',
      'Qualidade ou higiene da comida',
      'Sem espaço para sentar e comer'
    ]
  },
  {
    id: 'lab',
    label: 'Laboratório e computadores',
    cat: 'Laboratórios',
    q: 'O que está errado no laboratório?',
    opcoes: [
      'Computadores quebrados',
      'Computadores insuficientes no horário de pico',
      'Equipamento desatualizado',
      'Falta equipamento de segurança',
      'Laboratório fechado ou sem acesso'
    ]
  },
  {
    id: 'energia',
    label: 'Energia e iluminação',
    cat: 'Iluminação',
    q: 'Qual é o problema com energia ou luz?',
    opcoes: [
      'Sala sem energia',
      'Lâmpadas queimadas',
      'Queda de energia frequente',
      'Área externa escura à noite'
    ]
  }
];

export const ASSIST_FREQUENCIA = [
  'Quase todo dia',
  'Quase toda semana',
  'Algumas vezes no semestre',
  'Aconteceu 1 ou 2 vezes'
];

export const ASSIST_IMPACTO = [
  'Já deixei de assistir aula ou usar o espaço',
  'Atrapalha, mas dou um jeito',
  'Afeta a turma inteira',
  'Afeta qualquer pessoa que passa ali'
];

// tema e detalhe têm chips dinâmicos (o tema define as opções de detalhe);
// campus define os locais. Frequência e impacto usam as listas acima.
export const ASSIST_STEPS = [
  { key: 'tema', q: 'Qual desses casos é o mais parecido com o seu?' },
  { key: 'detalhe', q: '' },
  { key: 'campus', q: 'Em qual campus isso acontece?' },
  { key: 'local', q: 'E onde exatamente, dentro do campus?' },
  { key: 'frequencia', q: 'Com que frequência isso acontece?', chips: ASSIST_FREQUENCIA },
  { key: 'impacto', q: 'O quanto isso atrapalha?', chips: ASSIST_IMPACTO }
];

export function suggestCategory(text) {
  const t = text.toLowerCase();
  if (/banheiro|papel higi|sab[aã]o|sabonete|torneira|descarga|mict[óo]rio/.test(t)) return 'Banheiros';
  if (/ar[- ]condicionado|calor|clima|quente na sala|abafad|ventila/.test(t)) return 'Climatização';
  if (/\bru\b|fila|almo[çc]o|cantina|lanchonete|comida|refeit|alimenta/.test(t)) return 'Alimentação';
  if (/mofo|infiltra|vazamento|rachadura|interditad|sem manuten[çc]|obra parada|parede/.test(t)) return 'Estrutura';
  if (/rampa|cadeira de rodas|acessib|elevador|degrau|cal[çc]ada|alaga|lama|barro|desn[íi]vel/.test(t)) return 'Acessibilidade';
  if (/wi-?fi|internet|eduroam|\brede\b/.test(t)) return 'Internet';
  if (/\bluz\b|l[aâ]mpada|escuro|poste|ilumin|falta de energia|queda de energia/.test(t)) return 'Iluminação';
  if (/laborat|capela|reagente|bancada|computador|\blcc\b/.test(t)) return 'Laboratórios';
  if (/projetor|datashow|data show|quadro|pincel|apagador|cadeira|carteira/.test(t)) return 'Salas de aula';
  if (t.length > 24) return 'Salas de aula';
  return '';
}
