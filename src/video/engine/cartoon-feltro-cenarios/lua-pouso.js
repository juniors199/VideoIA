/*
 * 
 * 
 */
/** Solo da lua com crateras e a Terra no céu (Paper Rocket, cenas 13 e 14). */
export default {
  nome: 'Pouso na lua', temas: ['pousou', 'pouso', 'pousar', 'aterrissou', 'cratera', 'terra'],
  ambiente: { fundo: ['#141A45', '#1E2459', '#2B2F6B'], tipo: 'ceu' }, luz: { tipo: 'noite' }, nevoa: null, particulas: { estrelas: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#D9A15A', clima: 'vivo', camera: 'tremor',
  props: [{ tipo: 'estrelas', n: 70, ate: 1300, seed: 31 }, { tipo: 'terra', x: 540, y: 740, r: 150 }, { tipo: 'solo-lunar', y: 1420 }],
};
