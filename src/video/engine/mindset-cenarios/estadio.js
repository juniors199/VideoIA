/*
 * 
 * 
 */
/**
 * Cenário "estadio": a arena do vídeo 12: arquibancadas em degraus cheias de público (pontos claros), holofotes com cone de
 * luz, fumaça baixa no chão e névoa. A câmera acompanha a ação e depois recua para mostrar a multidão (grua e pull-out).
 * Medidas (vídeo 12): arquibancada #1A1A1A com público #9A9A90 a #D8D8CC, cones #FFFFFF a 8%, fumaça #C8C8C8, chão #141414.
 */
export default {
  id: 'estadio',
  nome: 'Estádio e plateia',
  temas: [
    'plateia',
    'publico',
    'aplaus',
    'todos viram',
    'fama',
    'palco',
    'apresent',
    'tentativa',
    'tentou',
    'testes',
    'vitoria',
    'venceu',
    'campeao',
    'resultado',
  ],
  ambiente: { fundo: ['#0E0E0E', '#161616', '#1E1E1E'], tipo: 'ceu' },
  luz: {
    tipo: 'arena',
    chave: { cor: '#FFFFFF', intensidade: 2.2, pos: [0, 10, 6] },
    contra: { cor: '#FFF2D8', intensidade: 2, pos: [0, 6, -8] },
    ambiente: { cor: '#606060', intensidade: 0.4 },
    exposicao: 1.05,
  },
  nevoa: { cor: '#202020', alfa: 0.24, altura: 0, densidade: 0.03 },
  particulas: { fumaca: 1, poeira: 60 },
  props: [
    { tipo: 'arquibancada', z: -9, largura: 30, fileiras: 9 },
    { tipo: 'holofote', x: -4, z: -6 },
    { tipo: 'holofote', x: 4, z: -6 },
  ],
  clima: 'vivo',
  camera: 'pull-out',
  chao: { tipo: 'liso', cor: '#161616', rugosidade: 0.3, reflexo: 0.35 },
};
