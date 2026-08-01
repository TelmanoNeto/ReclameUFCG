// Fotos ilustrativas (mock) via Wikimedia Commons — licenças livres (CC/PD).
// Usadas apenas para dar contexto visual às categorias; não são fotos dos relatos reais.
export const CATEGORY_PHOTOS = {
  Banheiros: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Nasty_public_restroom.jpg/960px-Nasty_public_restroom.jpg',
    alt: 'Banheiro público em más condições',
    credit: 'Wikimedia Commons'
  },
  Climatização: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/A_broken_air_conditioning_unit_hanging_from_the_ceiling_in_New_Concord_Air_Force_Base.jpg/960px-A_broken_air_conditioning_unit_hanging_from_the_ceiling_in_New_Concord_Air_Force_Base.jpg',
    alt: 'Ar-condicionado de teto quebrado',
    credit: 'Wikimedia Commons'
  },
  Alimentação: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Students_eating_at_the_college_canteen%2C_University_of_Science_and_Technology_of_China%2C_Hefei.jpg/960px-Students_eating_at_the_college_canteen%2C_University_of_Science_and_Technology_of_China%2C_Hefei.jpg',
    alt: 'Refeitório universitário cheio',
    credit: 'Wikimedia Commons'
  },
  'Salas de aula': {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Classroom_with_chairs_and_blackboard_at_Cornell_University.jpg/960px-Classroom_with_chairs_and_blackboard_at_Cornell_University.jpg',
    alt: 'Sala de aula com cadeiras e quadro',
    credit: 'Wikimedia Commons'
  },
  Acessibilidade: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Rampa_peatonal_inaccesible_en_Maldonado_01.jpg/960px-Rampa_peatonal_inaccesible_en_Maldonado_01.jpg',
    alt: 'Rampa de acessibilidade inadequada',
    credit: 'Wikimedia Commons'
  },
  Internet: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Cable_closet_bh.jpg/960px-Cable_closet_bh.jpg',
    alt: 'Armário de cabos de rede desorganizado',
    credit: 'Wikimedia Commons'
  },
  Iluminação: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Streetlights.JPG/960px-Streetlights.JPG',
    alt: 'Postes de iluminação externa',
    credit: 'Wikimedia Commons'
  },
  Laboratórios: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Fume-hood.jpg/960px-Fume-hood.jpg',
    alt: 'Capela de exaustão de laboratório',
    credit: 'Wikimedia Commons'
  }
};

// Categorias sem foto própria reaproveitam a imagem mais próxima, em vez de
// cair no fallback genérico sem querer.
const ALIAS = { Estrutura: 'Salas de aula' };

export function photoFor(cat) {
  return CATEGORY_PHOTOS[cat] || CATEGORY_PHOTOS[ALIAS[cat]] || CATEGORY_PHOTOS['Salas de aula'];
}
