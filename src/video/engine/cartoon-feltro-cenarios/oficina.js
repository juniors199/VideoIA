/*
 * 
 * 
 */
/** Oficina de papelão em tarde laranja (Paper Rocket, cenas 4 e 5): caixas, fita e tinta. */
export default {
  nome: 'Oficina de papelão', temas: ['construiu', 'construir', 'caixa', 'caixas', 'fita', 'tinta', 'oficina', 'fabricou', 'montou', 'pintou', 'consertar'],
  ambiente: { fundo: ['#FFD98A', '#FFCB7C', '#FFBF69'], tipo: 'sala' }, luz: { tipo: 'dia' }, nevoa: null, particulas: {},
  chao: { y: 1580 }, texto: 'escuro', painel: '#C98B52', clima: 'vivo', camera: 'empurra',
  props: [{ tipo: 'piso-madeira', y: 1330, cor: '#C98B52', fuga: 540 }, { tipo: 'caixas', x: 120, y: 1420, s: 0.9, enfeite: true }, { tipo: 'caixas', x: 960, y: 1400, s: 0.75, n: 2, enfeite: true }],
};
