export const CATS = ['Banheiros', 'Salas de aula', 'Estrutura', 'Acessibilidade', 'Climatização', 'Alimentação', 'Laboratórios', 'Iluminação', 'Internet'];
export const CAMPI = ['Campina Grande', 'Cajazeiras', 'Cuité', 'Patos', 'Pombal', 'Sousa', 'Sumé'];

// Locais de reclamação por campus, agrupados pelo centro a que pertencem.
// Os centros de cada campus estão corretos; a lista de blocos dentro de cada
// centro é a base para o protótipo e deve ser conferida com a planta oficial
// da UFCG antes de ir para produção.
export const LOCAIS_POR_CAMPUS = {
  'Campina Grande': [
    {
      grupo: 'CCT · Centro de Ciências e Tecnologia',
      locais: [
        'CCT · Bloco CA', 'CCT · Bloco CB', 'CCT · Bloco CC', 'CCT · Bloco CD',
        'CCT · Bloco CE', 'CCT · Bloco CF', 'CCT · Bloco CG', 'CCT · Bloco CN',
        'CCT · Pavilhões de Aulas', 'CCT · Estacionamento norte', 'CCT · Estacionamento sul'
      ]
    },
    {
      grupo: 'CEEI · Centro de Engenharia Elétrica e Informática',
      locais: [
        'CEEI · Bloco CO', 'CEEI · Bloco CN', 'CEEI · Laboratórios de Computação',
        'CEEI · Laboratório LIEC', 'CEEI · Auditório'
      ]
    },
    {
      grupo: 'CH · Centro de Humanidades',
      locais: ['CH · Bloco BC', 'CH · Bloco BB', 'CH · Bloco BS', 'CH · Auditório']
    },
    {
      grupo: 'CCBS · Centro de Ciências Biológicas e da Saúde',
      locais: ['CCBS · Bloco BJ', 'CCBS · Laboratórios', 'Hospital Universitário Alcides Carneiro']
    },
    {
      grupo: 'CTRN · Centro de Tecnologia e Recursos Naturais',
      locais: ['CTRN · Bloco CJ', 'CTRN · Bloco CM', 'CTRN · Laboratórios']
    },
    {
      grupo: 'Áreas comuns',
      locais: [
        'RU · Restaurante Universitário', 'Biblioteca Central', 'Setor de Aulas',
        'Ginásio de Esportes', 'Reitoria', 'Praça central', 'Portaria principal'
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
export const CURSOS = ['Ciência da Computação', 'Engenharia Elétrica', 'Engenharia Civil', 'Medicina', 'Direito', 'Letras', 'Engenharia de Materiais'];
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

export const POSTS = [
  {
    id: 'cn302', cat: 'Climatização', campus: 'Campina Grande', curso: 'Engenharia Elétrica',
    local: 'CCT · Bloco CN · Sala 302', quando: 'há 2 h', ups: 214, status: 'parcial',
    fotos: [
      { cat: 'Climatização', label: 'termômetro na CN 302' },
      { cat: 'Salas de aula', label: 'a sala às 14h' }
    ],
    similares: 4,
    autor: 'Rafael Beltrão · Eng. Elétrica',
    titulo: 'Ar-condicionado da CN 302 parado há três semanas',
    resumo: 'Sala com 60 alunos sem climatização desde o fim de junho; dois chamados abertos, nenhum retorno.',
    texto: 'O ar da 302 parou na última semana de junho e até hoje ninguém apareceu.\n\nÀs 14h a sala tem 60 pessoas em aula de Circuitos, janela que não abre e projetor ligado. Medi 34°C com o termômetro do laboratório. Metade da turma sai antes do intervalo, e quem fica não consegue prestar atenção em nada.\n\nJá abrimos chamado duas vezes pelo formulário do centro. Nenhuma resposta.',
    comentarios: [
      { autor: 'Juliana Prado', iniciais: 'JP', quando: 'há 1 h', texto: 'Mesma coisa na 304. A gente trocou de sala por conta própria semana passada.' },
      { autor: 'Débora Lins · Eng. Elétrica', iniciais: 'DL', quando: 'há 48 min', texto: 'Levei ventilador de casa. Isso não deveria ser normal.' },
      { autor: 'Caio Ferreira · Eng. Materiais', iniciais: 'CF', quando: 'há 20 min', texto: 'Se todo mundo do CN relatar, dá pra mostrar que é o bloco inteiro e não uma sala.' }
    ]
  },
  {
    id: 'ru-fila', cat: 'Alimentação', campus: 'Campina Grande', curso: 'Ciência da Computação',
    local: 'RU · Campus Campina Grande', quando: 'há 5 h', ups: 341, status: 'nao_resolvida',
    fotos: [{ cat: 'Alimentação', label: 'fila do RU às 11h50' }],
    similares: 6,
    autor: 'Camila Serrano · CC',
    titulo: 'Fila do RU passa de 40 minutos no almoço',
    resumo: 'Fila dobra o corredor entre 11h30 e 12h30; quem tem aula às 13h come em pé ou desiste.',
    texto: 'Cheguei 11h40 e saí com a bandeja 12h27. A fila dobra o corredor inteiro e não tem cobertura, então em dia de sol é castigo.\n\nQuem tem aula às 13h no CCT simplesmente não consegue almoçar. Duas catracas para o campus inteiro não fecha a conta.',
    comentarios: [
      { autor: 'Marina Vasconcelos · CC', iniciais: 'MV', quando: 'há 3 h', texto: 'Segunda e quinta é pior. Parece que o cardápio desses dias puxa mais gente.' },
      { autor: 'Igor Wanderley · CC', iniciais: 'IW', quando: 'há 2 h', texto: 'Abrir a segunda entrada resolveria metade do problema.' }
    ]
  },
  {
    id: 'papel-cg', cat: 'Banheiros', campus: 'Campina Grande', curso: 'Engenharia Civil',
    local: 'CCT · Bloco CG · Térreo', quando: 'há 7 h', ups: 186, status: 'nao_resolvida',
    fotos: [], similares: 12,
    autor: 'Otávio Duarte · Eng. Civil',
    titulo: 'Banheiro masculino do CG está sem papel desde segunda',
    resumo: 'Sem papel higiênico e sem sabão a semana inteira; é o único banheiro do térreo do bloco.',
    texto: 'Segunda de manhã já não tinha. Hoje é quinta e continua igual: sem papel, sem sabão, e a torneira do meio pinga sem parar.\n\nÉ o único banheiro do térreo do CG, usado por todo mundo que tem aula no bloco.',
    comentarios: [
      { autor: 'Pedro Aquino · Eng. Civil', iniciais: 'PA', quando: 'há 5 h', texto: 'No CN é a mesma história. Já virei rotina levar papel na mochila.' }
    ]
  },
  {
    id: 'rampa-bc', cat: 'Acessibilidade', campus: 'Campina Grande', curso: 'Direito',
    local: 'CH · Bloco BC · Entrada lateral', quando: 'há 1 d', ups: 97, status: 'nao_resolvida',
    fotos: [
      { cat: 'Acessibilidade', label: 'degrau no fim da rampa' },
      { cat: 'Salas de aula', label: 'corredor logo depois da rampa' },
      { cat: 'Iluminação', label: 'mesma entrada à noite' }
    ],
    similares: 3,
    autor: 'Lúcia Peixoto · Direito',
    titulo: 'A rampa do BC termina em um degrau de 12 cm',
    resumo: 'A única rampa da entrada lateral desemboca num degrau — cadeirante não completa o percurso sozinho.',
    texto: 'A rampa foi feita, está lá, com corrimão e tudo. Só que no fim dela tem um degrau de uns 12 cm até o piso do corredor.\n\nNa prática, quem usa cadeira de rodas precisa de ajuda justamente no último metro. Uma colega da turma depende de alguém empurrar todo dia.',
    comentarios: [
      { autor: 'Lívia Nunes · Letras', iniciais: 'LN', quando: 'há 22 h', texto: 'Já vi gente quase capotar ali. É perigoso, não só incômodo.' },
      { autor: 'Rafaela Cunha · Direito', iniciais: 'RC', quando: 'há 18 h', texto: 'Uma rampinha de concreto de meio metro resolveria.' }
    ]
  },
  {
    id: 'wifi-cj', cat: 'Internet', campus: 'Campina Grande', curso: 'Engenharia de Materiais',
    local: 'CTRN · Bloco CJ', quando: 'há 1 d', ups: 128, status: 'resolvida',
    fotos: [], similares: 0,
    autor: 'Thiago Melo · Eng. de Materiais',
    titulo: 'Wi-Fi do CJ cai todo dia depois das 15h',
    resumo: 'Queda diária no turno da tarde; laboratório com aula prática dependente de acesso remoto fica parado.',
    texto: 'Todo dia por volta das 15h a rede do CJ some por 20 a 40 minutos. Acontece de segunda a sexta.\n\nA aula prática de simulação depende de acessar o servidor do laboratório. Quando cai, a aula acaba ali.',
    comentarios: [
      { autor: 'Newton Barros · Eng. Materiais', iniciais: 'NB', quando: 'há 20 h', texto: 'Uso dados do celular pra conseguir entregar as coisas. Sai caro.' }
    ]
  },
  {
    id: 'luz-estac', cat: 'Iluminação', campus: 'Campina Grande', curso: 'Medicina',
    local: 'CCT · Estacionamento norte', quando: 'há 2 d', ups: 154, status: 'parcial',
    fotos: [
      { cat: 'Iluminação', label: 'estacionamento às 19h' },
      { cat: 'Acessibilidade', label: 'trajeto até o portão' },
      { cat: 'Salas de aula', label: 'saída da aula das 22h' },
      { cat: 'Internet', label: 'poste sem lâmpada' }
    ],
    similares: 0,
    autor: 'Vitor Hugo Alencar · Medicina',
    titulo: 'Estacionamento norte do CCT está no escuro desde o recesso',
    resumo: 'Seis postes apagados na saída das aulas da noite; alunas relatam evitar o trajeto sozinhas.',
    texto: 'Contei seis postes apagados. Quem sai da aula às 22h atravessa o estacionamento inteiro no escuro até o portão.\n\nVárias meninas da turma passaram a esperar em grupo pra sair. Não deveria ser assim.',
    comentarios: [
      { autor: 'Bianca Rocha · Medicina', iniciais: 'BR', quando: 'há 1 d', texto: 'Peço carona até o portão todo dia. É constrangedor ter que fazer isso.' }
    ]
  },
  {
    id: 'bebedouro', cat: 'Salas de aula', campus: 'Campina Grande', curso: 'Ciência da Computação',
    local: 'Setor de Aulas · Corredor B', quando: 'há 3 d', ups: 63, status: 'resolvida',
    fotos: [], similares: 0,
    autor: 'Marina Vasconcelos · CC',
    titulo: 'Bebedouro do corredor B só solta água quente',
    resumo: 'Único bebedouro do corredor sem refrigeração há um mês.',
    texto: 'O bebedouro do corredor B está sem refrigerar há mais de um mês. Sai água quente, no calor de Campina.\n\nÉ o único do corredor. O de baixo está interditado desde o semestre passado.',
    comentarios: []
  },
  {
    id: 'capela-quimica', cat: 'Laboratórios', campus: 'Cuité', curso: 'Medicina',
    local: 'CES · Laboratório de Química II', quando: 'há 4 d', ups: 74, status: 'nao_resolvida',
    fotos: [{ cat: 'Laboratórios', label: 'capela de exaustão desligada' }],
    similares: 0,
    autor: 'Sofia Rangel · Medicina',
    titulo: 'Capela de exaustão do Química II não liga',
    resumo: 'Prática com solventes acontece sem exaustão funcionando; turma faz o experimento com as janelas abertas.',
    texto: 'A capela não liga desde o começo do período. A prática de solventes foi feita com as janelas abertas e um ventilador de pé.\n\nAlém do risco, metade da turma saiu com dor de cabeça.',
    comentarios: [
      { autor: 'Helena Braga · Medicina', iniciais: 'HB', quando: 'há 3 d', texto: 'Isso é questão de segurança, não de conforto.' }
    ]
  }
];

export const TRENDING_META = [
  { id: 'papel-cg', titulo: 'Falta de papel e sabão nos banheiros do CCT', motivo: '12 relatos parecidos nos últimos 7 dias, concentrados nos blocos CG e CN — todos no térreo.', relatos: '12 relatos semelhantes', coments: 88 },
  { id: 'ru-fila', titulo: 'Fila e capacidade do RU no almoço', motivo: '341 apoios em 72 h, com picos toda segunda e quinta entre 11h30 e 12h30.', relatos: '6 relatos semelhantes', coments: 64 },
  { id: 'cn302', titulo: 'Climatização das salas do Bloco CN', motivo: '4 salas diferentes relatadas na mesma semana; a 302 concentra a maior parte dos comentários.', relatos: '4 relatos semelhantes', coments: 51 },
  { id: 'rampa-bc', titulo: 'Acessibilidade das entradas do CH', motivo: 'Menos relatos que os outros tópicos, mas taxa de comentários 3× acima da média do feed.', relatos: '3 relatos semelhantes', coments: 37 }
];

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
