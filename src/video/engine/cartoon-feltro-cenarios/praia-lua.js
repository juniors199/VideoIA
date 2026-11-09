/*
 * 
 * 
 */
/** Praia de papel sob a lua cheia (Moon Path, o quadro da referência): estrelas por fio, ondas costuradas, o caminho de luz da lua, dunas e capim. */
export default {
  nome: 'Praia de lua', temas: ['praia', 'areia', 'lua', 'luar', 'tartaruga', 'ovo', 'nasceu', 'casca', 'concha', 'conchas', 'prateada'],
  ambiente: { fundo: ['#0E1A40', '#16285A', '#1F3A78'], tipo: 'ceu' }, luz: { tipo: 'lua' }, nevoa: null, particulas: { estrelas: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#16285A', clima: 'calmo', camera: 'deriva',
  props: [
    { tipo: 'estrelas', n: 70, ate: 1150, seed: 51 }, { tipo: 'estrelas-fio', pontos: [[90, 330], [230, 280], [850, 300], [980, 250]] }, { tipo: 'lua', x: 540, y: 760, r: 160 },
    { tipo: 'cais', x: 760, y: 1010, w: 300, camada: 'fundo', postes: [70, 230], acesas: 0.5 },
    { tipo: 'ondas', y: 1010, linhas: 8, cor: '#2F63C2', escuro: '#132F6E', larg: 140, passo: 68 }, { tipo: 'caminho-lua', x: 540, y0: 1030, y1: 1560 },
    { tipo: 'dunas', y: 1600, cor: '#5A6A92', escuro: '#3B4870' }, { tipo: 'grama', pontos: [[860, 1590], [120, 1640]], cor: '#3E4C74', camada: 'frente' },
    { tipo: 'pedras', pontos: [[650, 1860, 52], [740, 1876, 38]], cor: '#C9CED8', camada: 'frente' },
  ],
};
