/*
 * 
 * 
 */
/** Céu com nuvens que passam e um bando de pássaros (Paper Rocket, cenas 8 e 9): para quem voa. */
export default {
  nome: 'Céu de nuvens', temas: ['nuvem', 'nuvens', 'ceu', 'voar', 'voou', 'voando', 'subiu', 'alto', 'passaros', 'decolou', 'decolar'],
  ambiente: { fundo: ['#4FA5E8', '#7FC4F2', '#BFE6FB'], tipo: 'ceu' }, luz: { tipo: 'dia' }, nevoa: null, particulas: {},
  chao: null, texto: 'escuro', painel: '#4F8FC9', clima: 'vivo', camera: 'sobe',
  props: [
    { tipo: 'nuvem', x: -60, y: 640, w: 380, h: 120, vel: 30 }, { tipo: 'nuvem', x: 640, y: 1080, w: 420, h: 130, vel: -24 }, { tipo: 'nuvem', x: 120, y: 1520, w: 460, h: 140, vel: 18, camada: 'frente' },
    { tipo: 'passaros', y: 620, n: 4 },
  ],
};
