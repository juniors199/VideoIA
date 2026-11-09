/*
 * 
 * 
 */
/**
 * Cenário "ceu-sepia" (referências 01 e 06: o planador, o dirigível e os aviões): céu sépia com nuvens em camadas que andam
 * em velocidades diferentes (paralaxe de verdade, três planos de nuvem a profundidades diferentes), sol morno estourado no
 * alto e o objeto 3D voando no meio. Câmera que desce do céu. Cores medidas: #DCD3C3 no alto, #B5A995 no pé; tinta #1E1A16.
 */
export default {
  id: 'ceu-sepia',
  nome: 'Céu sépia com nuvens',
  temas: ['aviao', 'voo', 'voar', 'ceu', 'piloto', 'dirigivel', 'balao', 'nuvem', 'guerra', 'viagem', 'aeroporto', 'pais'],
  ambiente: { fundo: ['#DCD3C3', '#B5A995'], papel: 'ceu' },
  luz: { tipo: 'janela', cor: '#FFF0D6', forca: 1.05 },
  nevoa: { cor: '#F6EEDF', alfa: 0.2, altura: 0.5 },
  particulas: { poeira: 0.2 },
  props: [{ tipo: 'nuvens', x: 0.5, y: 0.5, n: 7 }],
  clima: 'calmo',
  camera: 'desce',
  foto: { tratamento: 'sepia', borda: 'sem' },
  texto: { tinta: '#1E1A16', realce: 'italico', corRealce: '#1E1A16' },
  acabamento: { grao: 0.5, vinheta: 0.28, fibra: 0.2, cromatica: 0, riscos: 0.25 },
};
