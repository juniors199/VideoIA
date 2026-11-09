/*
 * 
 * 
 */
/** Colinas de feltro no fim da tarde (o caminho de volta, a estrada, o campo). */
export default {
  nome: 'Colinas ao entardecer', temas: ['tarde', 'colina', 'colinas', 'morro', 'campo', 'caminho', 'estrada', 'longe', 'viagem', 'entardecer'],
  ambiente: { fundo: ['#F2A25E', '#F7C58C', '#FCE2BC'], tipo: 'ceu' }, luz: { tipo: 'tarde' }, nevoa: null, particulas: {},
  chao: { y: 1580 }, texto: 'escuro', painel: '#C98B52', clima: 'calmo', camera: 'paralaxe',
  props: [
    { tipo: 'sol', x: 540, y: 820, r: 120, cor: '#FFC24A', raios: '#FFA43A' }, { tipo: 'nuvem', x: 40, y: 600, w: 300, h: 90, vel: 6, cor: '#FFF4E4' }, { tipo: 'arvore', x: 150, y: 1330, s: 0.6, cor: '#6E9A4C' },
    { tipo: 'colinas', y: 1260, amp: 50, fase: 0, cor: '#B9C46E' }, { tipo: 'arvore', x: 860, y: 1300, s: 0.55, cor: '#5E8A4E' }, { tipo: 'colinas', y: 1440, amp: 36, fase: 500, cor: '#8FB15E' },
    { tipo: 'colinas', y: 1620, amp: 24, fase: 900, cor: '#6E9A4C', camada: 'frente' },
  ],
};
