/*
 * 
 * 
 */
/** Espaço roxo com estrelas e o planeta de feltro com anel (Paper Rocket, cena 12; o quadro da referência). */
export default {
  nome: 'Espaço com planeta', temas: ['espaco', 'estrela', 'estrelas', 'planeta', 'saturno', 'astronauta', 'galaxia', 'universo', 'orbita'],
  ambiente: { fundo: ['#24255C', '#302D74', '#45398A'], tipo: 'ceu' }, luz: { tipo: 'noite' }, nevoa: null, particulas: { estrelas: true },
  chao: null, texto: 'claro', painel: '#4A3F8C', clima: 'vivo', camera: 'deriva',
  props: [
    { tipo: 'estrelas', n: 90, ate: 1920, seed: 21 }, { tipo: 'planeta', x: 720, y: 720, r: 230, cor: '#FFB38A', faixa: '#FF9A76', anel: '#FFE3C2' },
    { tipo: 'terra', x: 230, y: 1330, r: 95, camada: 'fundo' },
  ],
};
