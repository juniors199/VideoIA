/*
 * 
 * 
 */
/**
 * Cenário "anel-astral" do estilo mindset3 (referências 04 e 07): um anel grande e apagado com 72 marcas, quatro graus
 * mono nos pontos cardeais e um ponto da cor da marca que corre devagar pela borda.
 */
export default {
  id: 'anel-astral',
  nome: 'Anel astral',
  temas: ['signo', 'astrologia', 'zodiaco', 'zodíaco', 'mapa astral', 'horoscopo', 'horóscopo'],
  ambiente: { fundo: ['#111113'] },
  luz: { tipo: 'nenhuma' },
  nevoa: null,
  particulas: { poeira: 0.12 },
  props: [{ tipo: 'anel', r: 0.44, marcas: 72 }, { tipo: 'graus' }],
  clima: 'solene',
  camera: 'orbita',
  acabamento: { pontos: 0.025, grao: 0.05, vinheta: 0.3, brilho: 1 },
};
