/*
 * 
 * 
 */
/**
 * Cenário "penhasco": o monólito do vídeo 07 ("o que as pessoas veem / não veem") e a borda do vídeo 10: rocha escura em
 * degraus com aresta clara, a encosta que desce em diagonal, sol no alto. A câmera desce pela encosta e volta (tilt).
 * Medidas (vídeo 07): rocha #222 a #2E2E2E com aresta #4A4A4A, céu #2A2A2A, sol #FFE01A com halo; o percurso da câmera
 * cobre ~1,8 alturas de quadro em ~2,5 s e volta, com ease in-out.
 */
export default {
  id: 'penhasco',
  nome: 'Penhasco e encosta',
  temas: [
    'montanha',
    'subida',
    'escalar',
    'topo',
    'ninguem ve',
    'nao veem',
    'bastidor',
    'sacrifici',
    'caminho',
    'jornada',
    'queda',
    'cair',
    'abismo',
    'borda',
  ],
  ambiente: {
    fundo: ['#242424', '#2A2A2A', '#303030'],
    tipo: 'ceu',
    brilho: { cor: '#FFE01A', x: -6, y: 20, raio: 26, forca: 0.25 },
  },
  luz: {
    tipo: 'sol',
    chave: { cor: '#FFF0C8', intensidade: 2.4, pos: [-3, 9, 5] },
    contra: { cor: '#FFE08A', intensidade: 1.6, pos: [-2, 6, -6] },
    ambiente: { cor: '#707070', intensidade: 0.5 },
    exposicao: 1,
  },
  nevoa: { cor: '#202020', alfa: 0.16, altura: 0, densidade: 0.02 },
  particulas: { poeira: 50 },
  props: [{ tipo: 'penhasco', x: -0.5, altura: 4, degraus: 9 }, { tipo: 'sol', x: -1.6, y: 6.4, z: -7, raio: 0.45 }],
  clima: 'solene',
  camera: 'tilt',
  chao: { tipo: 'liso', cor: '#262626', rugosidade: 0.85, reflexo: 0.05 },
};
