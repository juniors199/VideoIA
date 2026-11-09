/*
 * 
 * 
 */
/** Quintal de dia (Paper Rocket, cenas 1 e 2): céu azul, sol de feltro, nuvens, cerca, colinas e flores. */
export default {
  nome: 'Quintal de dia', temas: ['quintal', 'jardim', 'casa', 'grama', 'flor', 'flores', 'manha', 'dia', 'brincar', 'brincava'],
  ambiente: { fundo: ['#7FD0F5', '#BDE6F7', '#FFE2B8'], tipo: 'ceu' }, luz: { tipo: 'dia' }, nevoa: null, particulas: {},
  chao: { y: 1580 }, texto: 'escuro', painel: '#D9A15A', clima: 'vivo', camera: 'empurra',
  props: [
    { tipo: 'sol', x: 540, y: 700, r: 105 }, { tipo: 'nuvem', x: 20, y: 560, w: 300, h: 100, vel: 8 }, { tipo: 'nuvem', x: 760, y: 860, w: 300, h: 96, vel: -7 },
    { tipo: 'colinas', y: 1160, amp: 40, fase: 640, cor: '#A8DD8A', camada: 'fundo' }, { tipo: 'arvore', x: 120, y: 1330, s: 0.8, cor: '#4E9A4A' }, { tipo: 'arvore', x: 960, y: 1300, s: 0.7, cor: '#57A852' },
    { tipo: 'cerca', y: 1300, cor: '#FFF1D6' }, { tipo: 'colinas', y: 1420, amp: 30, fase: 300, cor: '#7FCF6E' }, { tipo: 'colinas', y: 1560, amp: 24, fase: 900, cor: '#5CB85C' },
    { tipo: 'flores', pontos: [[110, 1800, '#FF8FAB'], [960, 1820, '#EF5B5B'], [860, 1770, '#9B7BD8']], camada: 'frente' }, { tipo: 'grama', pontos: [[220, 1880], [700, 1890]], cor: '#46A24F' },
  ],
};
