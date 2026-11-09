/*
 * 
 * 
 */
/**
 * Cenário "vazio": a família sem chão dos vídeos 01, 02 e 18: só o foco radial (#333333 no miolo a #101010 na borda), sem
 * horizonte nem reflexo, para as cenas de gráfico (zonas, círculos) e a frase de impacto. No vídeo 18 a câmera recua até
 * revelar a multidão (pull-out de ~3 vezes em ~4 s).
 */
export default {
  id: 'vazio',
  nome: 'Foco no escuro (sem chão)',
  temas: [],
  ambiente: { fundo: ['#333333', '#222222', '#101010'], tipo: 'foco' },
  luz: {
    tipo: 'foco',
    chave: { cor: '#FFF4E0', intensidade: 2.2, pos: [2, 6, 7] },
    contra: { cor: '#FFE7B0', intensidade: 1.6, pos: [-2, 4, -5] },
    ambiente: { cor: '#808080', intensidade: 0.6 },
    exposicao: 1,
  },
  nevoa: { cor: '#141414', alfa: 0.16, altura: 0, densidade: 0.02 },
  particulas: { poeira: 40 },
  props: [],
  clima: 'calmo',
  camera: 'push-in',
  chao: { tipo: 'nenhum', cor: '#151515', rugosidade: 1, reflexo: 0 },
};
