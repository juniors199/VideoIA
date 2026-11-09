/*
 * 
 * 
 */
/**
 * Cenário "agua": o corte de água do vídeo 04: superfície ondulada, volume azul-petróleo em degradê, fundo de areia escura,
 * bolhas que sobem. Câmera frontal parada, um pouco abaixo da superfície.
 * Medidas (vídeo 04): água #1E4A50 na superfície a #0F2A2E no fundo, linha da superfície #2E6A70, bolhas #8FC7C9 a 50%.
 */
export default {
  id: 'agua',
  nome: 'Debaixo da água',
  temas: ['afund', 'desist', 'peso', 'corrente', 'boiar', 'flutu', 'respira', 'sufoc', 'superf', 'mar', 'oceano'],
  ambiente: { fundo: ['#262626', '#1F3E44', '#0E2428'], tipo: 'ceu' },
  luz: {
    tipo: 'agua',
    chave: { cor: '#D0F0F0', intensidade: 1.8, pos: [0, 8, 4] },
    contra: { cor: '#80D0D0', intensidade: 1, pos: [0, 4, -6] },
    ambiente: { cor: '#3A7076', intensidade: 0.8 },
    exposicao: 1,
  },
  nevoa: { cor: '#123236', alfa: 0.4, altura: 0, densidade: 0.05 },
  particulas: { bolhas: 60 },
  props: [{ tipo: 'agua', nivel: 3.1 }],
  clima: 'calmo',
  camera: 'fixa',
  chao: { tipo: 'nenhum', cor: '#12292C', rugosidade: 0.9, reflexo: 0 },
};
