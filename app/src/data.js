export const CATS = ['Banheiros', 'Climatização', 'Alimentação', 'Salas de aula', 'Acessibilidade', 'Internet', 'Iluminação', 'Laboratórios'];
export const CAMPI = ['Campina Grande', 'Cuité', 'Sumé', 'Patos', 'Pombal', 'Cajazeiras'];
export const BLOCOS = ['CCT · Bloco CN', 'CCT · Bloco CG', 'CH · Bloco BC', 'CTRN · Bloco CJ', 'RU', 'Setor de Aulas', 'Biblioteca Central'];
export const CURSOS = ['Ciência da Computação', 'Engenharia Elétrica', 'Engenharia Civil', 'Medicina', 'Direito', 'Letras', 'Engenharia de Materiais'];
export const PERIODOS = ['2026.2', '2026.1', '2025.2', '2025.1'];

export const POSTS = [
  {
    id: 'cn302', cat: 'Climatização', campus: 'Campina Grande', curso: 'Engenharia Elétrica',
    local: 'CCT · Bloco CN · Sala 302', quando: 'há 2 h', ups: 214, foto: true,
    fotoLabel: 'foto — termômetro na CN 302', similares: 4,
    autor: 'Rafael Beltrão · Eng. Elétrica',
    titulo: 'Ar-condicionado da CN 302 parado há três semanas',
    resumo: 'Sala com 60 alunos sem climatização desde o fim de junho; dois chamados abertos, nenhum retorno.',
    texto: 'O ar da 302 parou na última semana de junho e até hoje ninguém apareceu.\n\nÀs 14h a sala tem 60 pessoas em aula de Circuitos, janela que não abre e projetor ligado. Medi 34°C com o termômetro do laboratório. Metade da turma sai antes do intervalo, e quem fica não consegue prestar atenção em nada.\n\nJá abrimos chamado duas vezes pelo formulário do centro. Nenhuma resposta.',
    comentarios: [
      { autor: 'Juliana Prado', iniciais: 'JP', quando: 'há 1 h', texto: 'Mesma coisa na 304. A gente trocou de sala por conta própria semana passada.' },
      { autor: 'Anônimo', iniciais: 'AN', quando: 'há 48 min', texto: 'Levei ventilador de casa. Isso não deveria ser normal.' },
      { autor: 'Caio Ferreira · Eng. Materiais', iniciais: 'CF', quando: 'há 20 min', texto: 'Se todo mundo do CN relatar, dá pra mostrar que é o bloco inteiro e não uma sala.' }
    ]
  },
  {
    id: 'ru-fila', cat: 'Alimentação', campus: 'Campina Grande', curso: 'Ciência da Computação',
    local: 'RU · Campus Campina Grande', quando: 'há 5 h', ups: 341, foto: true,
    fotoLabel: 'foto — fila do RU às 11h50', similares: 6,
    autor: 'Anônimo',
    titulo: 'Fila do RU passa de 40 minutos no almoço',
    resumo: 'Fila dobra o corredor entre 11h30 e 12h30; quem tem aula às 13h come em pé ou desiste.',
    texto: 'Cheguei 11h40 e saí com a bandeja 12h27. A fila dobra o corredor inteiro e não tem cobertura, então em dia de sol é castigo.\n\nQuem tem aula às 13h no CCT simplesmente não consegue almoçar. Duas catracas para o campus inteiro não fecha a conta.',
    comentarios: [
      { autor: 'Marina Vasconcelos · CC', iniciais: 'MV', quando: 'há 3 h', texto: 'Segunda e quinta é pior. Parece que o cardápio desses dias puxa mais gente.' },
      { autor: 'Anônimo', iniciais: 'AN', quando: 'há 2 h', texto: 'Abrir a segunda entrada resolveria metade do problema.' }
    ]
  },
  {
    id: 'papel-cg', cat: 'Banheiros', campus: 'Campina Grande', curso: 'Engenharia Civil',
    local: 'CCT · Bloco CG · Térreo', quando: 'há 7 h', ups: 186, foto: false,
    fotoLabel: '', similares: 12,
    autor: 'Anônimo',
    titulo: 'Banheiro masculino do CG está sem papel desde segunda',
    resumo: 'Sem papel higiênico e sem sabão a semana inteira; é o único banheiro do térreo do bloco.',
    texto: 'Segunda de manhã já não tinha. Hoje é quinta e continua igual: sem papel, sem sabão, e a torneira do meio pinga sem parar.\n\nÉ o único banheiro do térreo do CG, usado por todo mundo que tem aula no bloco.',
    comentarios: [
      { autor: 'Pedro Aquino · Eng. Civil', iniciais: 'PA', quando: 'há 5 h', texto: 'No CN é a mesma história. Já virei rotina levar papel na mochila.' }
    ]
  },
  {
    id: 'rampa-bc', cat: 'Acessibilidade', campus: 'Campina Grande', curso: 'Direito',
    local: 'CH · Bloco BC · Entrada lateral', quando: 'há 1 d', ups: 97, foto: true,
    fotoLabel: 'foto — degrau no fim da rampa', similares: 3,
    autor: 'Anônimo',
    titulo: 'A rampa do BC termina em um degrau de 12 cm',
    resumo: 'A única rampa da entrada lateral desemboca num degrau — cadeirante não completa o percurso sozinho.',
    texto: 'A rampa foi feita, está lá, com corrimão e tudo. Só que no fim dela tem um degrau de uns 12 cm até o piso do corredor.\n\nNa prática, quem usa cadeira de rodas precisa de ajuda justamente no último metro. Uma colega da turma depende de alguém empurrar todo dia.',
    comentarios: [
      { autor: 'Lívia Nunes · Letras', iniciais: 'LN', quando: 'há 22 h', texto: 'Já vi gente quase capotar ali. É perigoso, não só incômodo.' },
      { autor: 'Anônimo', iniciais: 'AN', quando: 'há 18 h', texto: 'Uma rampinha de concreto de meio metro resolveria.' }
    ]
  },
  {
    id: 'wifi-cj', cat: 'Internet', campus: 'Campina Grande', curso: 'Engenharia de Materiais',
    local: 'CTRN · Bloco CJ', quando: 'há 1 d', ups: 128, foto: false,
    fotoLabel: '', similares: 0,
    autor: 'Thiago Melo · Eng. de Materiais',
    titulo: 'Wi-Fi do CJ cai todo dia depois das 15h',
    resumo: 'Queda diária no turno da tarde; laboratório com aula prática dependente de acesso remoto fica parado.',
    texto: 'Todo dia por volta das 15h a rede do CJ some por 20 a 40 minutos. Acontece de segunda a sexta.\n\nA aula prática de simulação depende de acessar o servidor do laboratório. Quando cai, a aula acaba ali.',
    comentarios: [
      { autor: 'Anônimo', iniciais: 'AN', quando: 'há 20 h', texto: 'Uso dados do celular pra conseguir entregar as coisas. Sai caro.' }
    ]
  },
  {
    id: 'luz-estac', cat: 'Iluminação', campus: 'Campina Grande', curso: 'Medicina',
    local: 'CCT · Estacionamento norte', quando: 'há 2 d', ups: 154, foto: true,
    fotoLabel: 'foto — estacionamento às 19h', similares: 0,
    autor: 'Anônimo',
    titulo: 'Estacionamento norte do CCT está no escuro desde o recesso',
    resumo: 'Seis postes apagados na saída das aulas da noite; alunas relatam evitar o trajeto sozinhas.',
    texto: 'Contei seis postes apagados. Quem sai da aula às 22h atravessa o estacionamento inteiro no escuro até o portão.\n\nVárias meninas da turma passaram a esperar em grupo pra sair. Não deveria ser assim.',
    comentarios: [
      { autor: 'Bianca Rocha · Medicina', iniciais: 'BR', quando: 'há 1 d', texto: 'Peço carona até o portão todo dia. É constrangedor ter que fazer isso.' }
    ]
  },
  {
    id: 'bebedouro', cat: 'Salas de aula', campus: 'Campina Grande', curso: 'Ciência da Computação',
    local: 'Setor de Aulas · Corredor B', quando: 'há 3 d', ups: 63, foto: false,
    fotoLabel: '', similares: 0,
    autor: 'Marina Vasconcelos · CC',
    titulo: 'Bebedouro do corredor B só solta água quente',
    resumo: 'Único bebedouro do corredor sem refrigeração há um mês.',
    texto: 'O bebedouro do corredor B está sem refrigerar há mais de um mês. Sai água quente, no calor de Campina.\n\nÉ o único do corredor. O de baixo está interditado desde o semestre passado.',
    comentarios: []
  },
  {
    id: 'capela-quimica', cat: 'Laboratórios', campus: 'Cuité', curso: 'Medicina',
    local: 'CES · Laboratório de Química II', quando: 'há 4 d', ups: 74, foto: true,
    fotoLabel: 'foto — capela de exaustão desligada', similares: 0,
    autor: 'Anônimo',
    titulo: 'Capela de exaustão do Química II não liga',
    resumo: 'Prática com solventes acontece sem exaustão funcionando; turma faz o experimento com as janelas abertas.',
    texto: 'A capela não liga desde o começo do período. A prática de solventes foi feita com as janelas abertas e um ventilador de pé.\n\nAlém do risco, metade da turma saiu com dor de cabeça.',
    comentarios: [
      { autor: 'Anônimo', iniciais: 'AN', quando: 'há 3 d', texto: 'Isso é questão de segurança, não de conforto.' }
    ]
  }
];

export const TRENDING_META = [
  { id: 'papel-cg', titulo: 'Falta de papel e sabão nos banheiros do CCT', motivo: '12 relatos parecidos nos últimos 7 dias, concentrados nos blocos CG e CN — todos no térreo.', relatos: '12 relatos semelhantes', coments: 88 },
  { id: 'ru-fila', titulo: 'Fila e capacidade do RU no almoço', motivo: '341 apoios em 72 h, com picos toda segunda e quinta entre 11h30 e 12h30.', relatos: '6 relatos semelhantes', coments: 64 },
  { id: 'cn302', titulo: 'Climatização das salas do Bloco CN', motivo: '4 salas diferentes relatadas na mesma semana; a 302 concentra a maior parte dos comentários.', relatos: '4 relatos semelhantes', coments: 51 },
  { id: 'rampa-bc', titulo: 'Acessibilidade das entradas do CH', motivo: 'Menos relatos que os outros tópicos, mas taxa de comentários 3× acima da média do feed.', relatos: '3 relatos semelhantes', coments: 37 }
];

export const ASSIST_STEPS = [
  { q: 'Certo. Onde exatamente isso acontece?', chips: ['CCT · Bloco CN', 'CH · Bloco BC', 'RU', 'Setor de Aulas'] },
  { q: 'Com que frequência?', chips: ['Todo dia', 'Algumas vezes por semana', 'Desde o início do período'] },
  { q: 'Quem é afetado?', chips: ['Só a minha turma', 'O bloco inteiro', 'Qualquer pessoa que passa ali'] }
];

export const ASSIST_STARTERS = ['Ar parado na sala', 'Banheiro sem papel', 'Fila do RU', 'Rampa com degrau'];

export function suggestCategory(text) {
  const t = text.toLowerCase();
  if (/ar[- ]condicionado|calor|clima|quente na sala|ventila/.test(t)) return 'Climatização';
  if (/banheiro|papel|sab[aã]o|torneira|descarga/.test(t)) return 'Banheiros';
  if (/\bru\b|fila|almo[çc]o|cantina|comida|refeit/.test(t)) return 'Alimentação';
  if (/rampa|cadeira de rodas|acessib|elevador|degrau/.test(t)) return 'Acessibilidade';
  if (/wi-?fi|internet|eduroam|rede/.test(t)) return 'Internet';
  if (/luz|l[aâ]mpada|escuro|poste|ilumin/.test(t)) return 'Iluminação';
  if (/laborat|capela|reagente|bancada/.test(t)) return 'Laboratórios';
  if (t.length > 24) return 'Salas de aula';
  return '';
}
