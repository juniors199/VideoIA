/*
 * 
 * 
 */
/**
 * Cenário "ceu-estrelado" do estilo mindset3 (referências 04 e 15): estrelas de 1 a 2 px que piscam devagar, um meteoro
 * fino a cada ~6 s e vinheta média.
 */
export default {
  id: 'ceu-estrelado',
  nome: 'Céu estrelado',
  temas: ['estrela', 'estrelas', 'universo', 'espaco', 'espaço', 'cosmos', 'galaxia', 'galáxia', 'astronomia', 'meteoro', 'ceu', 'céu'],
  ambiente: { fundo: ['#0F0F14', '#111113'] },
  luz: { tipo: 'nenhuma' },
  nevoa: null,
  particulas: { estrelas: 150, poeira: 0.1 },
  props: [{ tipo: 'estrelas', n: 150 }, { tipo: 'meteoro', cada: 6 }],
  clima: 'solene',
  camera: 'desce',
  acabamento: { pontos: 0.02, grao: 0.05, vinheta: 0.45, brilho: 1 },
};
