/*
 * 
 * 
 */
/** Tempestade no mar: chuva em riscos, ondas altas, relâmpago na ação e o farol que se apaga (Lighthouse Mouse, cena 4). */
export default {
  nome: 'Tempestade', temas: ['tempestade', 'chuva', 'trovao', 'raio', 'relampago', 'vento', 'temporal', 'escureceu', 'apagou', 'apagada'],
  ambiente: { fundo: ['#0A0F22', '#121A36', '#1A2647'], tipo: 'ceu' }, luz: { tipo: 'noite' }, nevoa: { cor: '#1A2647', alfa: 0.25, altura: 900 }, particulas: { chuva: true },
  chao: { y: 1580 }, texto: 'claro', painel: '#1A2647', clima: 'solene', camera: 'tremor',
  props: [
    { tipo: 'farol', x: 760, y: 1250, s: 1.05, apagado: true }, { tipo: 'ondas', y: 1210, linhas: 7, cor: '#24447F', escuro: '#0F2050', larg: 200, passo: 80 },
    { tipo: 'colinas', y: 1565, amp: 22, fase: 120, cor: '#3A3F52', camada: 'meio' }, { tipo: 'chuva', n: 150, relampago: true },
  ],
};
