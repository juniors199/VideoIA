/*
 * 
 * 
 */
/**
 * Cenário "palco" do estilo mindset: o palco grafite das referências 2D (vídeos 01 a 08 e 13): parede que escurece até o
 * rodapé, faixa de contato, chão polido mais claro que o pé da parede, reflexo dos bonecos e luz macia do alto.
 * Medidas (720 px): parede #363636 no alto, #191919 perto do chão, contato #0F0F0F, chão #313131, horizonte a 58%.
 * É também o MODELO para criar um cenário novo: copie este arquivo, troque o id e os campos, registre em index.js.
 */
export default {
  id: 'palco',
  nome: 'Palco grafite',
  temas: [],
  ambiente: {
    fundo: ['#363636', '#262626', '#161616'],
    tipo: 'parede',
    brilho: { cor: '#FFFFFF', x: 0, y: 3.2, raio: 7, forca: 0.05 },
  },
  luz: {
    tipo: 'estudio',
    chave: { cor: '#F6F6F6', intensidade: 2.4, pos: [3, 7, 6] },
    contra: { cor: '#FFE7B0', intensidade: 1.6, pos: [-3, 4, -5] },
    ambiente: { cor: '#8A8A96', intensidade: 0.55 },
    exposicao: 1,
  },
  nevoa: { cor: '#1A1A1A', alfa: 0.1, altura: 0, densidade: 0.012 },
  particulas: { poeira: 60 },
  props: [],
  clima: 'calmo',
  camera: 'push-in',
  chao: { tipo: 'liso', cor: '#2E2E2E', rugosidade: 0.42, reflexo: 0.32 },
};
