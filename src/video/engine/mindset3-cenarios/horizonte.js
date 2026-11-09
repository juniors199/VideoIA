/*
 * 
 * 
 */
/**
 * Cenário "horizonte" do estilo mindset3 (referência 06): linha do horizonte, floresta em silhueta de traço apagado e o
 * reflexo em hachura horizontal na água; a câmera desce do alto para o horizonte.
 */
export default {
  id: 'horizonte',
  nome: 'Horizonte com floresta e reflexo',
  temas: ['floresta', 'lago', 'rio', 'mata', 'paisagem', 'horizonte', 'por do sol', 'arvores', 'árvores'],
  ambiente: { fundo: ['#111113'] },
  luz: { tipo: 'lua' },
  nevoa: { cor: '#1A1820', alfa: 0.25, altura: 0.3 },
  particulas: { poeira: 0.15, estrelas: 40 },
  props: [{ tipo: 'horizonte', y: 0.62 }, { tipo: 'floresta', y: 0.62 }, { tipo: 'reflexo', y: 0.62 }, { tipo: 'estrelas', n: 40 }],
  clima: 'solene',
  camera: 'desce',
  acabamento: { pontos: 0.02, grao: 0.05, vinheta: 0.45, brilho: 1 },
};
