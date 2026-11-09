/*
 * 
 * 
 */
/**
 * Cenário "chuva": a chuva do vídeo 14 (primeira metade): céu cinza-chumbo, chão molhado com poças escuras que refletem,
 * riscos de chuva finos e inclinados, cidade apagada ao fundo na névoa. Câmera um pouco alta, com leve deriva.
 * Medidas (vídeo 14): céu #3A3A3A a #2A2A2A, chão #4A4A4A molhado com poças #1E1E1E, chuva #B8B8B8 a 25% de opacidade,
 * riscos de ~40 px a 720, inclinação de ~8 graus.
 */
export default {
  id: 'chuva',
  nome: 'Chuva',
  temas: [
    'chuva',
    'tempestade',
    'crise',
    'problema',
    'dificil',
    'obstacul',
    'tristeza',
    'triste',
    'frio',
    'critica',
    'rir',
    'zomb',
  ],
  ambiente: { fundo: ['#2C2C2E', '#3A3A3C', '#4A4A4C'], tipo: 'ceu' },
  luz: {
    tipo: 'nublado',
    chave: { cor: '#D8DEE8', intensidade: 1.6, pos: [-2, 7, 6] },
    contra: { cor: '#C8D0DA', intensidade: 1.2, pos: [2, 4, -6] },
    ambiente: { cor: '#7C828C', intensidade: 0.7 },
    exposicao: 1,
  },
  nevoa: { cor: '#3A3A3C', alfa: 0.28, altura: 0, densidade: 0.035 },
  particulas: { chuva: 900 },
  props: [
    { tipo: 'skyline', z: -40, altura: [3, 9], largura: 70, janelas: 0.03, cor: '#2E2E30' },
    { tipo: 'pocas', n: 9 },
  ],
  clima: 'solene',
  camera: 'parallax',
  chao: { tipo: 'molhado', cor: '#3E3E3F', rugosidade: 0.2, reflexo: 0.3 },
};
