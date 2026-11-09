/*
 * 
 * 
 */
/**
 * Cenários e câmeras do estilo mindset3, registrados no MECANISMO COMUM dos estilos (cenarios-estilo.js). Cada cenário é um
 * arquivo desta pasta, só com dados, no contrato comum (nome, temas, ambiente, luz, nevoa, particulas, props, clima, camera)
 * mais `acabamento` { pontos, grao, vinheta, brilho } (0 a 1). No cena.json: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`.
 * Projeto: `export const cenariosEstilo = { mindset3: { 'meu-id': { ... } } }` no pecas.js. Sem DOM (o Node importa).
 */
import { registrarCenarios, registrarCameras, cenariosDo, validarCenario, escolherCenario } from '../cenarios-estilo.js';
import breu from './breu.js';
import painelPontos from './painel-pontos.js';
import ceuEstrelado from './ceu-estrelado.js';
import horizonte from './horizonte.js';
import quarto from './quarto.js';
import anelAstral from './anel-astral.js';
import portal from './portal.js';
import gradeChao from './grade-chao.js';

const LISTA = [breu, painelPontos, ceuEstrelado, horizonte, quarto, anelAstral, portal, gradeChao];
export const CENARIOS_M3 = Object.fromEntries(LISTA.map((c) => [c.id, c]));
export const IDS_CENARIOS_M3 = LISTA.map((c) => c.id);
export const LUZES_M3 = ['nenhuma', 'painel', 'lua', 'janela', 'portal'];
export const PROPS_M3 = ['painel', 'fio', 'chao', 'rodape', 'estrelas', 'meteoro', 'horizonte', 'floresta', 'reflexo', 'janela', 'anel', 'graus', 'colunas', 'degraus', 'grade-chao'];

/**
 * Câmeras nomeadas (medidas nas referências: deriva de 2 a 29 px/s, picos de até 71 px/s, empurrão ~1%/s, recuo que revela,
 * descida ao horizonte, perspectiva 3D em 2 referências). Pose pura: tb = segundos desde o começo do beat, dur = duração do
 * beat; devolve { x, y } (deslocamento em px de tela), s (escala), rx e ry (giro 3D em radianos, com perspectiva).
 * Todas começam e terminam com velocidade contínua (smootherstep ou senoide): o verificador mede velocidade, aceleração e jerk.
 */
const G = Math.PI / 180;
const sm = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (6 * x - 15) + 10); }; // smootherstep: velocidade e aceleração nulas nas pontas
// deriva de base (05/11, QA do render: trechos parados acima de 1,5 s): x até 12 px (o eixo tolera 24), y até 18 px e um respiro de escala de 1%
const der = (tb, k = 1) => ({ x: Math.min(12, 8 * k) * Math.sin(tb * 0.47 + 0.6), y: 12 * k * Math.sin(tb * 0.39 + 1.9), s: 0.006 * k * Math.sin(tb * 0.33 + 0.4) });
export const MOVIMENTOS_M3 = {
  // deriva lenta (todas: 0,1 a 1 %L/s): a câmera boia, nunca para
  deriva: (tb) => { const d = der(tb, 1.5); return { x: d.x, y: d.y, s: 1.02 + d.s, rx: 0, ry: 0 }; },
  // empurrão lento (01: 0,94%/s): 1,5%/s, com rampa de 0,8 s na entrada
  aproxima: (tb) => { const d = der(tb), a = tb < 0.8 ? (tb * tb) / 1.6 : tb - 0.4; return { x: d.x, y: d.y, s: 1 + 0.022 * a + d.s, rx: 0, ry: 0 }; },
  // recuo que revela (05: os círculos que se multiplicam): começa 12% mais perto e abre em 2,4 s com smootherstep
  recua: (tb) => { const d = der(tb); return { x: d.x, y: d.y, s: 1.12 - 0.12 * sm(tb / 2.4) + d.s, rx: 0, ry: 0 }; },
  // panorâmica (02, 08): desliza 70 px de lado em 3 s, suave nas pontas
  panoramica: (tb) => { const k = sm(tb / 3), d = der(tb); return { x: 18 - 36 * k, y: d.y, s: 1.03 + d.s, rx: 0, ry: 0 }; },
  // descida do céu ao horizonte (06): o alvo começa 110 px acima e assenta em 1,8 s
  desce: (tb) => { const k = sm(tb / 1.8), d = der(tb); return { x: d.x * k, y: -110 * (1 - k) + d.y * k, s: 1.02 + 0.03 * k + d.s * k, rx: 0, ry: 0 }; },
  // 3D: o plano do desenho começa inclinado 19 graus para trás e fica quase de frente (01: a grade em perspectiva)
  inclina: (tb) => { const k = sm(tb / 2.2), d = der(tb); return { x: d.x, y: d.y + 20 * (1 - k), s: 1.0 + 0.02 * k + d.s, rx: (16 * (1 - k) + 3 + 1.5 * Math.sin(tb * 0.6)) * G, ry: 0 }; },
  // 3D: órbita curta de -9 a +9 graus em volta do eixo vertical, em 4 s (17: a fechadura que gira)
  orbita: (tb) => { const k = sm(tb / 4), d = der(tb); return { x: d.x * 0.5, y: d.y, s: 1.02 + d.s, rx: 4 * G, ry: (-9 + 18 * k) * G }; },
};
export const IDS_MOVIMENTOS_M3 = Object.keys(MOVIMENTOS_M3);
export const CAMERAS_M3 = {
  deriva: { nome: 'Deriva', descricao: 'boia devagar (até 1 %L/s, com respiro de escala), nunca para (todas as referências)', dur: 8, curva: 'linear', tipo: '2D' },
  aproxima: { nome: 'Aproxima', descricao: 'empurrão contínuo de 2,2%/s com rampa de entrada (01)', dur: 4, curva: 'linear', tipo: '2D' },
  recua: { nome: 'Recua e revela', descricao: 'começa 12% mais perto e abre em 2,4 s (05)', dur: 2.4, curva: 'io', tipo: '2D' },
  panoramica: { nome: 'Panorâmica', descricao: 'desliza 36 px de lado em 3 s, sem tirar o protagonista do eixo (02, 08)', dur: 3, curva: 'io', tipo: '2D' },
  desce: { nome: 'Desce ao horizonte', descricao: 'o alvo desce 110 px em 1,8 s (06)', dur: 1.8, curva: 'saida', tipo: '2D' },
  inclina: { nome: 'Inclina (3D)', descricao: 'o plano do desenho sai de 19 graus inclinado para quase de frente em 2,2 s, com perspectiva (01)', dur: 2.2, curva: 'saida', tipo: '3D' },
  orbita: { nome: 'Órbita (3D)', descricao: 'gira de -9 a +9 graus em volta do eixo vertical em 4 s, com perspectiva (17)', dur: 4, curva: 'io', tipo: '3D' },
};
registrarCameras('mindset3', CAMERAS_M3);
registrarCenarios('mindset3', CENARIOS_M3, { luzes: LUZES_M3, props: PROPS_M3 });

const n01 = (v) => v == null || (Number.isFinite(v) && v >= 0 && v <= 1);
/** problemas de um cenário: o contrato comum mais o acabamento do estilo */
export function validarCenarioM3(c, id = c?.id || 'cenario') {
  const e = validarCenario('mindset3', id, c), nome = `cenário mindset3.${id}`;
  if (!c || typeof c !== 'object') return e;
  for (const k of ['pontos', 'grao', 'vinheta', 'brilho']) if (!n01(c.acabamento?.[k])) e.push(`${nome}: acabamento.${k} de 0 a 1`);
  if (!MOVIMENTOS_M3[c.camera]) e.push(`${nome}: camera "${c.camera}" não é um movimento (${IDS_MOVIMENTOS_M3.join(', ')})`);
  try { JSON.stringify(c); } catch { e.push(`${nome}: só dados (sem função nem ciclo)`); }
  return e;
}
export const cenarioPelaFalaM3 = (fala, { padrao = 'breu', evitar = null, spec = null } = {}) => escolherCenario('mindset3', fala, { padrao, evitar, spec });
export const cenarioM3 = (id, spec = null) => { const t = cenariosDo('mindset3', spec); return t[id] ? { id, ...t[id] } : { ...CENARIOS_M3.breu }; };
