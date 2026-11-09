/*
 * 
 * 
 */
/** Quarto de noite com cama de feltro, vela e a janela da lua (hora de dormir). */
export default {
  nome: 'Quarto de noite', temas: ['cama', 'dormir', 'dormiu', 'sono', 'quarto', 'sonho', 'sonhou', 'travesseiro', 'deitou', 'ninar'],
  ambiente: { fundo: ['#3A3358', '#30294A', '#28223D'], tipo: 'sala' }, luz: { tipo: 'lampada' }, nevoa: null, particulas: {},
  chao: { y: 1580 }, texto: 'claro', painel: '#3A3358', clima: 'calmo', camera: 'empurra',
  props: [{ tipo: 'janela', x: 330, y: 600, w: 420, h: 480 }, { tipo: 'piso-madeira', y: 1420, cor: '#5E4A5C', fuga: 540 }, { tipo: 'cama', x: 640, y: 1560 }, { tipo: 'vela', x: 150, y: 1420, s: 0.9 }],
};
