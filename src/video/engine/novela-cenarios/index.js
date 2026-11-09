/*
 * 
 * 
 */
/**
 * Cenários, câmeras, personagens e poses do estilo "novela", registrados no MECANISMO COMUM dos estilos (cenarios-estilo.js),
 * o mesmo do mindset, do fatos e do colagem3d. Cenários são só dados (classico.js, serie.js ou um arquivo por cenário nesta
 * pasta): nome, tom, temas, ambiente, luz, nevoa, particulas, props (camadas com profundidade `p`), palco, clima, camera,
 * acabamento. No cena.json: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }` no beat. O projeto traz o próprio em
 * pecas.js: `export const cenariosEstilo = { novela: { 'meu-id': { ... } } }`. Sem DOM: o Node importa para validar e planejar.
 */
import { registrarCenarios, registrarCameras, cenariosDo, validarCenario, validarPersonagem, validarPose, personagensDo, posesDo } from '../cenarios-estilo.js';
import { TIPOS_PROP_NOVELA } from '../estilo-novela-props.js';
import CLASSICO from './classico.js';
import SERIE from './serie.js';
import { PERSONAGENS_NOVELA, POSES_NOVELA, CORPOS, PENTEADOS, BARBAS } from './personagens.js';

/** o fecho na IDENTIDADE da página (fundo e acentos da marca, personalizáveis): arco sobre o fundo da marca, como as referências 01 a 04 */
const FECHO = {
  'marca-pagina': {
    nome: 'Identidade da página (fecho)', tom: 'ambos', temas: ['comenta', 'segue', 'pagina', 'ilustrando'],
    ambiente: { fundo: ['#1B2230', '#0E0E13'], marca: true }, luz: { tipo: 'interior', cor: '#FFF1E2', forca: 1 }, nevoa: null, particulas: { petalas: 0.6, poeira: 0.3 },
    props: [], palco: { chao: 1500, escala: 0.6, xs: [540] }, clima: 'calmo', camera: 'recua', acabamento: { manchas: 0.15, vinheta: 0.4, bloom: 0.3, dof: 0 },
  },
};

export const CENARIOS_NOVELA = { ...CLASSICO, ...SERIE, ...FECHO };
export const IDS_CENARIOS_NOVELA = Object.keys(CENARIOS_NOVELA);
export const LUZES_NOVELA = ['dia', 'tarde', 'amanhecer', 'interior', 'janela', 'vela', 'noite'];
export const PARTICULAS_NOVELA = ['poeira', 'faiscas', 'neve', 'petalas', 'penas', 'chuva', 'folhas'];
export const TONS_NOVELA = ['classico', 'serie'];

/**
 * Câmeras nomeadas (2D e 3D multiplano: as camadas do cenário estão em profundidades diferentes, então empurrar, andar de
 * lado ou girar separa os planos como uma câmera de verdade). Medidas nas 6 referências pelo video-sharingan: empurrão
 * dominante de 1 a 6%/s (picos de 22%/s no golpe), travelling e pedestal de 3 a 5% da largura por segundo, órbita curta,
 * câmera que nunca para (p5 da velocidade acima de 0,5 px/s). `dur` é o tempo do movimento principal; `curva` é io, saida
 * ou linear (contrato comum). A pose em si é calculada em estilo-novela-layout.js (`movimentoNovela`).
 */
export const CAMERAS_NOVELA = {
  empurra: { nome: 'Empurrão lento (push-in)', descricao: 'aproxima 3 a 6%/s do foco, sem parar (o movimento dominante das 6 referências)', dur: 4, curva: 'saida' },
  recua: { nome: 'Recuo que revela (pull-out)', descricao: 'começa mais perto e abre devagar (referências 01, 03, 04)', dur: 4, curva: 'saida' },
  pan: { nome: 'Panorâmica', descricao: 'gira de lado com um empurrão leve (referências 02 e 03)', dur: 3, curva: 'io' },
  travelling: { nome: 'Travelling lateral (3D)', descricao: 'anda de lado; o fundo corre menos que o primeiro plano (paralaxe das camadas)', dur: 4, curva: 'linear' },
  pedestal: { nome: 'Pedestal (sobe ou desce)', descricao: 'sobe ou desce mantendo a mira (referências 01, 03, 04)', dur: 3, curva: 'io' },
  tilt: { nome: 'Tilt', descricao: 'inclina para cima ou para baixo com empurrão leve (referências 03 e 06)', dur: 3, curva: 'io' },
  orbita: { nome: 'Órbita (3D)', descricao: 'gira em volta do foco: o fundo desliza para um lado e o primeiro plano para o outro (referências 02 e 05)', dur: 3, curva: 'io' },
  close: { nome: 'Close no rosto', descricao: 'enquadra o rosto do personagem de foco e empurra devagar (referências 02, 05, 06)', dur: 3, curva: 'saida' },
  deriva: { nome: 'Deriva', descricao: 'quase parada: desliza poucos pixels e respira (referências 05 e 06)', dur: 4, curva: 'linear' },
  segue: { nome: 'Acompanha quem anda', descricao: 'a mira segue o personagem que caminha (referência 01, os monges na trilha)', dur: 4, curva: 'linear' },
  'zoom-rapido': { nome: 'Golpe de zoom', descricao: 'abre ou fecha o quadro em 0,35 s com borrão de movimento e assenta (referência 02, 0:02)', dur: 0.6, curva: 'io' },
};

/** vocabulário (o validador recusa o resto) */
registrarCenarios('novela', CENARIOS_NOVELA, { luzes: LUZES_NOVELA, props: TIPOS_PROP_NOVELA, climas: ['calmo', 'vivo', 'solene'] });
registrarCameras('novela', CAMERAS_NOVELA);

const HEX = /^#[0-9a-fA-F]{6}$/;
/** problemas de um cenário da novela (fábrica ou projeto): o contrato comum mais o palco, o tom e o acabamento */
export function validarCenarioNovela(mod, id = '?') {
  const e = validarCenario('novela', id, mod);
  if (!mod || typeof mod !== 'object') return e;
  if (mod.tom != null && !['classico', 'serie', 'ambos'].includes(mod.tom)) e.push(`cenário novela.${id}: "tom" é classico, serie ou ambos`);
  const pl = mod.palco;
  if (!pl || !(pl.chao >= 600 && pl.chao <= 2000) || !(pl.escala > 0.1 && pl.escala <= 1.6)) e.push(`cenário novela.${id}: "palco" é { chao: y do chão (600 a 2000), escala (0,1 a 1,6), xs: [posições] }`);
  if (!LUZES_NOVELA.includes(mod.luz?.tipo)) e.push(`cenário novela.${id}: "luz.tipo" é um de ${LUZES_NOVELA.join(', ')}`);
  for (const k of Object.keys(mod.particulas || {})) if (!PARTICULAS_NOVELA.includes(k)) e.push(`cenário novela.${id}: partícula "${k}" não existe (${PARTICULAS_NOVELA.join(', ')})`);
  for (const p of mod.props || []) { if (p && p.p != null && !(p.p >= 0 && p.p <= 1.4)) e.push(`cenário novela.${id}: prop "${p.tipo}" com profundidade "p" fora de 0 a 1,4`); if (p && p.cor != null && !HEX.test(p.cor)) e.push(`cenário novela.${id}: prop "${p.tipo}" com cor que não é "#rrggbb"`); }
  for (const [k, v] of Object.entries(mod.acabamento || {})) if (!(v >= 0 && v <= 1)) e.push(`cenário novela.${id}: acabamento "${k}" de 0 a 1`);
  return e;
}
/** problemas de um personagem da novela: o contrato comum (com a calça da roupa longa preenchida) e o vocabulário de corpo */
export function validarPersonagemNovela(id, mod, spec = null) {
  const e = validarPersonagem('novela', id, { calca: mod?.roupa2 || mod?.roupa, ...mod }, spec);
  if (mod && !CORPOS.includes(mod.corpo)) e.push(`personagem novela.${id}: "corpo" é um de ${CORPOS.join(', ')}`);
  if (mod && !PENTEADOS.includes(mod.penteado)) e.push(`personagem novela.${id}: "penteado" é um de ${PENTEADOS.join(', ')}`);
  if (mod && mod.barba != null && !BARBAS.includes(mod.barba)) e.push(`personagem novela.${id}: "barba" é uma de ${BARBAS.join(', ')}`);
  return e;
}
export const validarPoseNovela = validarPose;
export const cenariosNovela = (spec = null) => cenariosDo('novela', spec);
export const personagensNovela = (spec = null) => personagensDo('novela', spec);
export const posesNovela = (spec = null) => posesDo('novela', spec);
export { PERSONAGENS_NOVELA, POSES_NOVELA };
