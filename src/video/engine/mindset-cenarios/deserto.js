/*
 * 
 * 
 */
/**
 * Cenário "deserto": a seca do vídeo 14 (segunda metade): chão rachado de terra seca, o calor do sol no céu (o disco do sol vem da cena "sol", que o faz nascer) e luz
 * quente vinda de cima, sem chuva. Câmera um pouco alta e quase parada.
 * Medidas (vídeo 14): sol #FFE14A com halo, chão #5A5040 a #3A342A com rachaduras #1E1A14, céu #2E2C28.
 */
export default {
  id: 'deserto',
  nome: 'Sol e seca',
  temas: ['seca', 'calor', 'sol', 'esforco', 'sede', 'deserto', 'sozinho', 'solidao', 'paciencia'],
  ambiente: {
    fundo: ['#262422', '#33302A', '#4A4234'],
    tipo: 'ceu'
  },
  luz: {
    tipo: 'sol',
    chave: { cor: '#FFE6A0', intensidade: 2.8, pos: [-1, 8, 3] },
    contra: { cor: '#FFD060', intensidade: 1.4, pos: [1, 4, -6] },
    ambiente: { cor: '#7A6A50', intensidade: 0.6 },
    exposicao: 1,
  },
  nevoa: { cor: '#2E2B26', alfa: 0.16, altura: 0, densidade: 0.02 },
  particulas: { poeira: 120 },
  props: [],
  clima: 'solene',
  camera: 'grua',
  chao: { tipo: 'rachado', cor: '#5A5040', rugosidade: 0.95, reflexo: 0 },
};
