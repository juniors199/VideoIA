/*
 * 
 * 
 */
/**
 * Cenários 3D e movimentos de câmera do estilo mindset, registrados no MECANISMO COMUM dos estilos (cenarios-estilo.js), o
 * mesmo do mindset2: cada cenário é um arquivo desta pasta com um objeto de dados no contrato comum (nome, temas, ambiente,
 * luz, nevoa, particulas, props, clima, camera), mais o que o palco 3D precisa (chao, luz.chave/contra/ambiente, enquadra,
 * palcoY, frenteZ). No cena.json: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }` no beat. O projeto traz cenário
 * próprio em pecas.js: `export const cenariosEstilo = { mindset: { 'meu-id': { ... } } }`.
 *
 * Campos 3D (além do contrato comum):
 *   ambiente { fundo: [topo, meio, base], tipo: parede | ceu | foco, brilho { cor, x, y, raio, forca } }
 *   chao { tipo: liso | molhado | rachado | agua | nenhum, cor, rugosidade, reflexo (0 a 0,8) }
 *   luz { tipo (vocabulário LUZES_MS), chave, contra, ambiente: { cor, intensidade, pos }, exposicao }
 *   nevoa { cor, alfa, altura, densidade }  particulas { chuva, poeira, fagulhas, fogo, fumaca, bolhas, ondas, apagaNaAcao }
 *   props [{ tipo (TIPOS_PROP), ...dados }]  camera: '<movimento>'  enquadra { dist, altura, fov }  palcoY  frenteZ
 * Sem DOM: o Node importa para validar, planejar e testar.
 */
import { registrarCenarios, registrarCameras, cenariosDo, validarCenario, escolherCenario } from '../cenarios-estilo.js';
import palco from './palco.js';
import vazio from './vazio.js';
import cidade from './cidade.js';
import quarto from './quarto.js';
import escritorio from './escritorio.js';
import chuva from './chuva.js';
import deserto from './deserto.js';
import cais from './cais.js';
import agua from './agua.js';
import penhasco from './penhasco.js';
import estadio from './estadio.js';
import fogo from './fogo.js';

const LISTA = [palco, vazio, cidade, quarto, escritorio, chuva, deserto, cais, agua, penhasco, estadio, fogo];
export const CENARIOS_MS = Object.fromEntries(LISTA.map((c) => [c.id, c]));
export const IDS_CENARIOS_MS = LISTA.map((c) => c.id);
/** vocabulário do palco 3D (o validador comum recusa o resto) */
export const TIPOS_PROP = ['skyline', 'janela', 'cama', 'mesa', 'luminaria', 'pier', 'agua', 'penhasco', 'arquibancada', 'holofote', 'sol', 'lua', 'nuvem', 'pocas'];
export const LUZES_MS = ['estudio', 'contraluz', 'janela', 'sol', 'nublado', 'agua', 'arena', 'fogo', 'foco'];
const FUNDOS = ['parede', 'ceu', 'foco'], CHAOS = ['liso', 'molhado', 'rachado', 'agua', 'nenhum'];
const PARTICULAS = ['chuva', 'poeira', 'fagulhas', 'fogo', 'fumaca', 'bolhas', 'ondas', 'apagaNaAcao'];
const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Movimentos de câmera nomeados, medidos nas referências (seção "Rodada 2" de MINDSET-REFERENCIAS). Cada um recebe a base do
 * enquadramento { alvo: [x, y, z], dist, altura, fov }, o progresso u do beat (0 a 1), o tempo t, o instante da ação (a: s
 * desde a ação, ou null) e o herói ([x, y, z]); devolve { pos, alvo, fov }. Função pura: o mesmo t dá a mesma câmera.
 */
const io = (x) => { x = Math.min(1, Math.max(0, x)); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
const eo = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
const pos = (b, { dx = 0, dy = 0, dz = 1, az = 0 } = {}) => {
  const d = b.dist * dz, a = (az * Math.PI) / 180;
  return [b.alvo[0] + dx + Math.sin(a) * d, b.altura + dy, b.alvo[2] + Math.cos(a) * d];
};
const deriva = (t) => ({ dx: 0.06 * Math.sin(t * 0.7), dy: 0.04 * Math.sin(t * 0.5 + 1) });
export const MOVIMENTOS_MS = {
  // quase parado (vídeos 16 e 17): deriva de ~6 cm, para o quadro respirar
  fixa: (b, u, t) => { const d = deriva(t); return { pos: pos(b, d), alvo: [b.alvo[0] + d.dx * 0.5, b.alvo[1], b.alvo[2]], fov: b.fov }; },
  // empurrão (vídeos 15 e 18): aproxima 14% ao longo do beat, ease in-out
  'push-in': (b, u, t) => { const d = deriva(t); return { pos: pos(b, { ...d, dz: 1 - 0.14 * io(u) }), alvo: b.alvo, fov: b.fov }; },
  // recuo que revela (vídeos 12 e 18): começa 14% mais perto, abre até 12% mais longe e sobe um pouco
  'pull-out': (b, u, t) => { const d = deriva(t); const k = io(u); return { pos: pos(b, { ...d, dz: 0.86 + 0.26 * k, dy: 0.5 * k }), alvo: [b.alvo[0], b.alvo[1] + 0.15 * k, b.alvo[2]], fov: b.fov }; },
  // órbita (vídeo 12, câmera que gira em volta da ação): de -14 a +14 graus de azimute
  orbita: (b, u) => ({ pos: pos(b, { az: -14 + 28 * io(u) }), alvo: b.alvo, fov: b.fov }),
  // travelling lateral (vídeos 09 e 13): 1,4 m de lado a lado, o olhar acompanha 30% (o boneco quase não sai do lugar e o fundo distante corre: parallax de verdade)
  travelling: (b, u) => { const x = -0.7 + 1.4 * io(u); return { pos: pos(b, { dx: x }), alvo: [b.alvo[0] + x * 0.3, b.alvo[1], b.alvo[2]], fov: b.fov }; },
  // parallax 2D (vídeo 14: camadas de chuva, cidade e céu em velocidades diferentes): deslize curto e leve aproximação
  parallax: (b, u, t) => { const x = 0.5 * Math.sin((u - 0.5) * Math.PI); return { pos: pos(b, { dx: x, dz: 1 - 0.06 * u, dy: 0.03 * Math.sin(t) }), alvo: [b.alvo[0] + x * 0.2, b.alvo[1], b.alvo[2]], fov: b.fov }; },
  // grua (vídeo 12, fim): a câmera sobe 1,8 m olhando para o mesmo ponto
  grua: (b, u) => { const k = io(u); return { pos: pos(b, { dy: -0.4 + 1.8 * k, dz: 1.02 - 0.06 * k }), alvo: b.alvo, fov: b.fov }; },
  // tilt da encosta (vídeo 07): o olhar sobe pela encosta (0,6 m) enquanto a câmera recua 25% e sobe, e volta; o boneco
  // fica no quadro (a referência deixa a figura sair; aqui o QA pede o protagonista sempre visível)
  tilt: (b, u) => { const k = Math.sin(Math.PI * io(u)); return { pos: pos(b, { dy: 0.8 * k, dz: 1 + 0.25 * k }), alvo: [b.alvo[0], b.alvo[1] + 0.48 * k, b.alvo[2]], fov: b.fov }; },
  // segue o boneco dourado (vídeo 09: câmera acompanha a caminhada): o alvo vai para o x do herói
  segue: (b, u, t, a, heroi) => { const x = heroi ? heroi[0] : b.alvo[0]; return { pos: pos({ ...b, alvo: [x * 0.8, b.alvo[1], b.alvo[2]] }, { dz: 0.92 }), alvo: [x * 0.8, b.alvo[1], b.alvo[2]], fov: b.fov }; },
  // close (vídeo 18: do corpo inteiro ao rosto): aproxima 30% e sobe o olhar para o rosto, ease out (o pé não entra na legenda)
  close: (b, u) => { const k = eo(u * 1.4); return { pos: pos(b, { dz: 1 - 0.26 * k, dy: 0.4 * k }), alvo: [b.alvo[0], b.alvo[1] + 0.5 * k, b.alvo[2]], fov: b.fov }; },
  // tremor de impacto (vídeos 11 e 12: respingo, batida): sacode 6 cm e acalma em 0,6 s depois da ação
  tremor: (b, u, t, a) => { const s = a == null || a < 0 ? 0 : Math.exp(-a * 5) * 0.06; return { pos: pos(b, { dx: s * Math.sin(t * 61), dy: s * Math.sin(t * 47 + 1) }), alvo: b.alvo, fov: b.fov }; },
};
export const IDS_MOVIMENTOS_MS = Object.keys(MOVIMENTOS_MS);
/** as câmeras no contrato comum (nome, descrição, duração do movimento principal, curva) */
export const CAMERAS_MS = {
  fixa: { nome: 'Fixa com deriva', descricao: 'quase parada, deriva de 6 cm (vídeos 16 e 17)', dur: 8, curva: 'linear' },
  'push-in': { nome: 'Empurrão', descricao: 'aproxima 14% no beat (vídeos 15 e 18)', dur: 4, curva: 'io' },
  'pull-out': { nome: 'Recuo que revela', descricao: 'começa 14% mais perto e abre subindo (vídeos 12 e 18)', dur: 4, curva: 'io' },
  orbita: { nome: 'Órbita', descricao: 'gira de -14 a +14 graus em volta da ação (vídeo 12)', dur: 5, curva: 'io' },
  travelling: { nome: 'Travelling lateral', descricao: '1,4 m de lado a lado, fundo distante em parallax (vídeos 09 e 13)', dur: 5, curva: 'io' },
  parallax: { nome: 'Parallax', descricao: 'deslize curto com camadas em velocidades diferentes (vídeo 14)', dur: 5, curva: 'io' },
  grua: { nome: 'Grua', descricao: 'sobe 1,8 m olhando o mesmo ponto (vídeo 12, fim)', dur: 4, curva: 'io' },
  tilt: { nome: 'Tilt da encosta', descricao: 'o olhar sobe pela encosta enquanto a câmera recua e volta (vídeo 07)', dur: 5, curva: 'io' },
  segue: { nome: 'Segue o herói', descricao: 'o alvo acompanha o boneco dourado (vídeo 09)', dur: 4, curva: 'linear' },
  close: { nome: 'Close no rosto', descricao: 'do corpo inteiro ao rosto, aproxima 30% (vídeo 18)', dur: 3, curva: 'saida' },
  tremor: { nome: 'Tremor de impacto', descricao: 'sacode 6 cm e acalma em 0,6 s depois da ação (vídeos 11 e 12)', dur: 0.6, curva: 'saida' },
};
registrarCameras('mindset', CAMERAS_MS);
registrarCenarios('mindset', CENARIOS_MS, { luzes: LUZES_MS, props: TIPOS_PROP });

/** problemas de um cenário: o contrato comum (validarCenario) mais o que o palco 3D precisa */
export function validarCenarioMs(c, id = c?.id || 'cenario') {
  const e = validarCenario('mindset', id, c), nome = `cenário mindset.${id}`;
  if (!c || typeof c !== 'object') return e;
  if (!FUNDOS.includes(c.ambiente?.tipo)) e.push(`${nome}: ambiente.tipo é ${FUNDOS.join(', ')}`);
  if (!Array.isArray(c.ambiente?.fundo) || c.ambiente.fundo.length !== 3) e.push(`${nome}: ambiente.fundo são 3 cores (topo, meio, base)`);
  if (!c.chao || !CHAOS.includes(c.chao.tipo) || !HEX.test(c.chao.cor || '') || !(c.chao.reflexo >= 0 && c.chao.reflexo <= 0.8)) e.push(`${nome}: chao { tipo: ${CHAOS.join(' | ')}, cor hex, reflexo 0 a 0,8 }`);
  for (const k of ['chave', 'contra', 'ambiente']) { const l = c.luz?.[k]; if (!l || !HEX.test(l.cor || '') || !(l.intensidade >= 0 && l.intensidade <= 6)) e.push(`${nome}: luz.${k} precisa de cor hex e intensidade de 0 a 6`); }
  if (!(c.nevoa?.densidade >= 0 && c.nevoa.densidade <= 0.08)) e.push(`${nome}: nevoa.densidade de 0 a 0,08`);
  for (const k of Object.keys(c.particulas || {})) if (!PARTICULAS.includes(k)) e.push(`${nome}: partícula "${k}" não existe (${PARTICULAS.join(', ')})`);
  if (c.particulas?.chuva > 2000 || c.particulas?.poeira > 400) e.push(`${nome}: partículas demais (chuva até 2000, poeira até 400): o fundo pisca`);
  if (!MOVIMENTOS_MS[c.camera]) e.push(`${nome}: camera "${c.camera}" não é um movimento (${IDS_MOVIMENTOS_MS.join(', ')})`);
  try { JSON.stringify(c); } catch { e.push(`${nome}: só dados (sem função nem ciclo)`); }
  return e;
}
/** cenário pelo assunto da fala (o mecanismo comum, com os do projeto); sem tema, null */
export const cenarioPelaFala = (fala, spec = null) => escolherCenario('mindset', fala, { padrao: null, spec });
/** o cenário pelo id (os do projeto incluídos); o desconhecido cai no palco */
export const cenarioMs = (id, spec = null) => { const t = cenariosDo('mindset', spec); return t[id] ? { id, ...t[id] } : CENARIOS_MS.palco; };
export const cenariosMs = (spec = null) => cenariosDo('mindset', spec);
