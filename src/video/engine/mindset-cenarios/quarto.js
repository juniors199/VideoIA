/*
 * 
 * 
 */
/**
 * Cenário "quarto": o quarto dos vídeos 17 e 09: parede escura, janela com a cidade e a lua (noite) que vira nascer do sol
 * (dourado) na ação, duas camas com cabeceira e travesseiro, criado-mudo com abajur que acende. Câmera frontal um pouco
 * alta, quase parada. Medidas (vídeo 17): parede #2B2826, janela de noite #1A1E26 com lua #F2F2E8, de dia #F6D27A a #FFE9B0;
 * colchas #3A3734; luz quente lateral da janela que entra no quarto ao amanhecer.
 */
export default {
  id: 'quarto',
  nome: 'Quarto (noite e amanhecer)',
  temas: [
    'sono',
    'dorm',
    'cama',
    'noite',
    'acord',
    'madrugada',
    'rotina',
    'descans',
    'insonia',
    'celular',
  ],
  ambiente: {
    fundo: ['#2E2B28', '#24211F', '#1A1817'],
    tipo: 'parede',
    brilho: { cor: '#FFD890', x: 0, y: 3.4, raio: 5, forca: 0.12 },
  },
  luz: {
    tipo: 'janela',
    chave: { cor: '#FFE6C0', intensidade: 1.6, pos: [0, 5, 6] },
    contra: { cor: '#FFD27A', intensidade: 2, pos: [0, 3, -3] },
    ambiente: { cor: '#7A6F66', intensidade: 0.5 },
    exposicao: 1,
  },
  nevoa: { cor: '#1E1B19', alfa: 0.08, altura: 0, densidade: 0.01 },
  particulas: { poeira: 40 },
  props: [
    { tipo: 'janela', x: 0, y: 2.05, z: -3.9, largura: 2.3, altura: 1.25, ceu: 'noite', viraNaAcao: 'amanhecer' },
    { tipo: 'cama', x: -1.3, z: -2.4 },
    { tipo: 'cama', x: 1.3, z: -2.4 },
    { tipo: 'luminaria', x: 0, z: -3.3 },
  ],
  clima: 'calmo',
  camera: 'fixa',
  enquadra: { altura: 3.4, dist: 15 },
  chao: { tipo: 'liso', cor: '#26221F', rugosidade: 0.6, reflexo: 0.06 },
};
