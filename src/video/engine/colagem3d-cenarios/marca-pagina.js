/*
 * 
 * 
 */
/**
 * Cenário "marca-pagina" (rodada 4, pedido do dono): o fecho e qualquer plano na IDENTIDADE DA PÁGINA. Com `ambiente.marca`,
 * o palco troca o fundo pela cor de fundo da marca (marca/tokens.json; no Estudio de videos, preto azulado) e os acentos pela cor
 * de destaque (laranja), então o aluno que troca a marca troca o fecho junto. As cores abaixo são só a reserva sem marca.
 */
import { tonsDaMarca } from '../marca-tons.js';
export default {
  id: 'marca-pagina',
  nome: 'Identidade da página',
  temas: ['comenta', 'segue', 'pagina', 'ilustrando'],
  ambiente: { fundo: ['#1B2230', '#0F141C'], papel: 'escuro', marca: true },
  luz: { tipo: 'estudio', cor: '#FFF1E2', forca: 1.0 },
  nevoa: null,
  particulas: { poeira: 0.4 },
  props: [{ tipo: 'fita', x: 0.86, y: 0.16 }, { tipo: 'papel-solto', x: 0.08, y: 0.84 }],
  clima: 'vivo',
  camera: 'recua',
  foto: { tratamento: 'pb', borda: 'branca' },
  texto: { tinta: '#F4F1EA', realce: 'caixa', corRealce: tonsDaMarca().forte },
  acabamento: { grao: 0.5, vinheta: 0.35, fibra: 0.15, cromatica: 0, riscos: 0.1 },
};
