/*
 * 
 * 
 */
/** Mar aberto de noite: muitas fileiras de ondas costuradas, o caminho da lua e um barco de papel (Moon Path, cena 7). */
export default {
  nome: 'Mar aberto', temas: ['oceano', 'nadar', 'nadou', 'nadando', 'ondas', 'onda', 'trilha', 'casa'],
  ambiente: { fundo: ['#0E1A40', '#16285A', '#1F3A78'], tipo: 'ceu' }, luz: { tipo: 'lua' }, nevoa: null, particulas: { estrelas: true },
  chao: null, texto: 'claro', painel: '#16285A', clima: 'calmo', camera: 'balanco',
  props: [
    { tipo: 'estrelas', n: 70, ate: 1000, seed: 71 }, { tipo: 'estrelas-fio', pontos: [[140, 280], [240, 330], [930, 320]] }, { tipo: 'lua', x: 540, y: 760, r: 160 },
    { tipo: 'ondas', y: 1000, linhas: 10, cor: '#3069CC', escuro: '#163A84', larg: 150, passo: 90 }, { tipo: 'caminho-lua', x: 540, y0: 1010, y1: 1900 }, { tipo: 'barco', x: 880, y: 1170, s: 0.55 },
  ],
};
