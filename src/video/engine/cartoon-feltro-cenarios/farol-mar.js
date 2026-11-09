/*
 * 
 * 
 */
/** O farol de fora, na rocha, com o facho que varre o céu, o mar de papel e as estrelas penduradas (Lighthouse Mouse, cenas 1 e 3). */
export default {
  nome: 'Farol no mar', temas: ['farol', 'mar', 'barco', 'barcos', 'navio', 'porto', 'costa', 'beira', 'marinheiro', 'pescador'],
  ambiente: { fundo: ['#0B1230', '#14204A', '#1E3266'], tipo: 'ceu' }, luz: { tipo: 'lua' }, nevoa: null, particulas: { estrelas: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#1E3266', clima: 'calmo', camera: 'balanco',
  props: [
    { tipo: 'estrelas', n: 60, ate: 1100, seed: 41 }, { tipo: 'estrelas-fio', pontos: [[120, 300], [250, 230], [980, 260]] }, { tipo: 'lua', x: 250, y: 680, r: 105 },
    { tipo: 'farol', x: 830, y: 1180, s: 1.15 }, { tipo: 'ondas', y: 1150, linhas: 7, cor: '#2E5FB8', escuro: '#132F6E', larg: 150, passo: 66 }, { tipo: 'caminho-lua', x: 250, y0: 1170, y1: 1560, forca: 0.7 },
    { tipo: 'barco', x: 160, y: 1240, s: 0.6, vel: 14 }, { tipo: 'colinas', y: 1565, amp: 22, fase: 120, cor: '#4A4F63', camada: 'meio' },
  ],
};
