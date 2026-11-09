/*
 * 
 * 
 */
/**
 * Cenário "cais": o vídeo 11: duas plataformas de salto sobre água escura à noite, com torres de treliça metálica,
 * a cidade em contraluz dourado no horizonte e a água que espelha e faz ondas (respingos quando alguém mergulha).
 * Medidas (vídeo 11): água #0E0E0E a #1A1814 com brilho dourado do horizonte, treliça #9A9A9A fina, plataforma #C8C8C8.
 */
export default {
  id: 'cais',
  nome: 'Cais à noite',
  temas: [
    'pular',
    'salt',
    'mergulh',
    'coragem',
    'medo',
    'agir',
    'arrisc',
    'risco',
    'decid',
    'primeiro passo',
    'comecar',
  ],
  ambiente: {
    fundo: ['#121212', '#2A2418', '#A88A50'],
    tipo: 'ceu',
    brilho: { cor: '#FFC060', x: 0, y: 3, raio: 34, forca: 0.28 },
  },
  luz: {
    tipo: 'contraluz',
    chave: { cor: '#FFE8C0', intensidade: 1.8, pos: [2, 8, 7] },
    contra: { cor: '#FFBE5A', intensidade: 3, pos: [0, 3, -12] },
    ambiente: { cor: '#5E5442', intensidade: 0.45 },
    exposicao: 1.05,
  },
  nevoa: { cor: '#1A160F', alfa: 0.13, altura: 0, densidade: 0.016 },
  particulas: { ondas: 1, poeira: 30 },
  props: [
    { tipo: 'skyline', z: -45, altura: [2.5, 7], largura: 80, janelas: 0.08, cor: '#121212', base: 0 },
    { tipo: 'pier', x: -1.5, altura: 2.2, largura: 2.2 },
    { tipo: 'pier', x: 1.5, altura: 2.2, largura: 2.2 },
  ],
  clima: 'vivo',
  camera: 'pull-out',
  chao: { tipo: 'agua', cor: '#0E0E0D', rugosidade: 0.12, reflexo: 0.32 },
  palcoY: 2.2,
};
