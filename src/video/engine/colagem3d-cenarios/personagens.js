/*
 * 
 * 
 */
/**
 * Personagens 3D posados do estilo colagem3d (referência 11: gente de época em volume, posada no cenário), só com dados,
 * registrados no mecanismo comum (registrarPersonagens em cenarios-estilo.js). O desenho em three.js é o de
 * estilo-colagem3d-personagem.js (roupa em tecido com brilho de fibra, botões de metal, chapéu, barba, sombra no papel).
 * Personagem sem nome, para pessoa sem nome (a pessoa citada pelo nome entra com foto real, regra da casa).
 * Juntas em graus: tronco [inclina frente, inclina lado], cabeca [baixa, gira], braço [frente, abre, cotovelo], perna [frente, joelho].
 */
import { registrarPersonagens } from '../cenarios-estilo.js';

export const POSES_C3 = {
  'de-pe': { nome: 'De pé', juntas: { tronco: [0, 0], cabeca: [0, 0], bracoE: [4, 8, 10], bracoD: [4, 8, 10], pernaE: [0, 0], pernaD: [0, 0] } },
  apontando: { nome: 'Apontando', juntas: { tronco: [2, -3], cabeca: [-4, 18], bracoE: [4, 8, 12], bracoD: [80, 30, 8], pernaE: [-6, 4], pernaD: [8, 0] } },
  pensativo: { nome: 'Pensativo', juntas: { tronco: [6, 0], cabeca: [10, -10], bracoE: [40, 18, 120], bracoD: [8, 10, 95], pernaE: [0, 0], pernaD: [6, 6] } },
  'bracos-cruzados': { nome: 'Braços cruzados', juntas: { tronco: [-3, 0], cabeca: [-5, 6], bracoE: [28, 4, 110, 62], bracoD: [24, 4, 104, 58], pernaE: [-4, 0], pernaD: [4, 0] } },
  acenando: { nome: 'Acenando', juntas: { tronco: [0, 2], cabeca: [-6, -8], bracoE: [4, 8, 12], bracoD: [10, 150, 40], pernaE: [0, 0], pernaD: [0, 0] } },
  caminhando: { nome: 'Caminhando', juntas: { tronco: [4, 0], cabeca: [0, 0], bracoE: [-22, 6, 18], bracoD: [24, 6, 22], pernaE: [24, 10], pernaD: [-20, 22] } },
  sentado: { nome: 'Sentado', sentado: true, juntas: { tronco: [-4, 0], cabeca: [6, 8], bracoE: [30, 10, 70], bracoD: [30, 10, 70], pernaE: [88, 90], pernaD: [84, 92] } },
  'maos-no-bolso': { nome: 'Mãos no bolso', juntas: { tronco: [-2, 0], cabeca: [-3, -12], bracoE: [-6, 14, 36], bracoD: [-6, 14, 36], pernaE: [0, 0], pernaD: [6, 2] } },
};
export const PERSONAGENS_C3 = {
  cavalheiro: { nome: 'Cavalheiro de cartola', temas: ['seculo xix', 'nobre', 'empresario', 'banqueiro', 'politico'], roupa: '#2B2B33', calca: '#3A3A40', pele: '#E2B38F', cabelo: '#3B2A1E', chapeu: 'cartola', barba: 'bigode', gravata: 'borboleta', pose: 'de-pe' },
  inventor: { nome: 'Inventor de barba', temas: ['inventor', 'invencao', 'cientista', 'engenheiro', 'oficina'], roupa: '#2F3B52', calca: '#2E2A26', pele: '#DDAA84', cabelo: '#4A3526', chapeu: 'nenhum', barba: 'cheia', gravata: 'longa', pose: 'pensativo' },
  operario: { nome: 'Operário de boina', temas: ['fabrica', 'operario', 'trabalhador', 'obra', 'trem', 'porto'], roupa: '#6B5236', calca: '#3F3A33', pele: '#C98F66', cabelo: '#2A2018', chapeu: 'boina', barba: 'nenhuma', gravata: 'nenhuma', pose: 'maos-no-bolso' },
  dama: { nome: 'Dama de época', temas: ['dama', 'mulher', 'rainha', 'moda', 'baile'], roupa: '#5C2E3A', calca: '#5C2E3A', pele: '#E8BC98', cabelo: '#5A3A22', chapeu: 'coco', barba: 'nenhuma', gravata: 'nenhuma', saia: true, pose: 'de-pe' },
  reporter: { nome: 'Repórter de chapéu coco', temas: ['jornal', 'noticia', 'reporter', 'cidade'], roupa: '#474038', calca: '#2E2B28', pele: '#E0B08C', cabelo: '#1E1A16', chapeu: 'coco', barba: 'bigode', gravata: 'longa', pose: 'caminhando' },
};
registrarPersonagens('colagem3d', PERSONAGENS_C3, POSES_C3);
