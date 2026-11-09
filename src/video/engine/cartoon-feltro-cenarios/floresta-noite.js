/*
 * 
 * 
 */
/** Floresta de feltro de noite, com lua e vaga-lumes (os amigos que chegam com uma luzinha). */
export default {
  nome: 'Floresta de noite', temas: ['floresta', 'arvore', 'arvores', 'mata', 'bosque', 'vaga-lume', 'vagalume', 'vaga-lumes'],
  ambiente: { fundo: ['#0D1A2A', '#13263A', '#1B3348'], tipo: 'ceu' }, luz: { tipo: 'lua' }, nevoa: { cor: '#22405A', alfa: 0.2, altura: 700 }, particulas: { estrelas: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#1B3348', clima: 'calmo', camera: 'deriva',
  props: [
    { tipo: 'estrelas', n: 50, ate: 900, seed: 81 }, { tipo: 'lua', x: 540, y: 660, r: 110 },
    { tipo: 'arvore', x: 120, y: 1500, s: 1.1, cor: '#2F5A44' }, { tipo: 'arvore', x: 960, y: 1480, s: 1.0, cor: '#2A5240' }, { tipo: 'arvore', x: 560, y: 1380, s: 0.7, cor: '#244A3A' },
    { tipo: 'colinas', y: 1500, amp: 22, fase: 200, cor: '#264534' }, { tipo: 'vagalumes', x: 540, y: 1150, n: 16, sempre: true, camada: 'frente' },
  ],
};
