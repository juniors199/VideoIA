/*
 * 
 * 
 */
/** A sala da lâmpada do farol (Lighthouse Mouse, o quadro da referência): parede azul-ardósia, lâmpada em camadas que brilha, janela de noite com mar e lua, piso de tábuas. */
export default {
  nome: 'Sala do farol', temas: ['lampada', 'luz', 'lente', 'acender', 'acendeu', 'polir', 'polia', 'brilho', 'brilhar', 'brilhava', 'piscadas', 'cuidava'],
  ambiente: { fundo: ['#2B3352', '#262D49', '#1F253C'], tipo: 'sala' }, luz: { tipo: 'lampada' }, nevoa: null, particulas: {},
  chao: { y: 1580 }, texto: 'claro', painel: '#2B3352', clima: 'calmo', camera: 'empurra',
  props: [
    { tipo: 'janela', x: 330, y: 520, w: 420, h: 470 }, { tipo: 'piso-madeira', y: 1290, cor: '#6B5260', fuga: 540 },
    { tipo: 'lampada', x: 175, y: 1470, s: 1.12, acesa: 1 }, { tipo: 'caixas', x: 940, y: 1430, s: 0.8, n: 2, enfeite: true },
  ],
};
