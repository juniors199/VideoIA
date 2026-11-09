/*
 * 
 * 
 */
/** O cais de madeira e os lampiões âmbar do calçadão sobre o mar de papel (Moon Path, cena 4: a "luz errada"). */
export default {
  nome: 'Cais de noite', temas: ['cais', 'lampiao', 'lampioes', 'calcadao', 'poste', 'postes', 'luzes', 'errado', 'errada', 'perdida', 'perdido'],
  ambiente: { fundo: ['#0E1A40', '#16285A', '#1F3A78'], tipo: 'ceu' }, luz: { tipo: 'lua' }, nevoa: null, particulas: { estrelas: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#16285A', clima: 'calmo', camera: 'paralaxe',
  props: [
    { tipo: 'estrelas', n: 60, ate: 1100, seed: 61 }, { tipo: 'estrelas-fio', pontos: [[160, 260], [260, 320], [900, 250]] }, { tipo: 'lua', x: 540, y: 760, r: 160 },
    { tipo: 'ondas', y: 1080, linhas: 6, cor: '#2F63C2', escuro: '#132F6E', larg: 150, passo: 66 }, { tipo: 'caminho-lua', x: 540, y0: 1100, y1: 1400, forca: 0.6 }, { tipo: 'cais', x: 240, y: 1260, w: 600 }, { tipo: 'lampioes', y: 1500, xs: [130, 950] },
    { tipo: 'dunas', y: 1620, cor: '#5A6A92', escuro: '#3B4870' },
  ],
};
