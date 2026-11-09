/*
 * 
 * 
 */
/**
 * Cenários (ambientes de papel) e câmeras 3D do estilo colagem3d, registrados no MECANISMO COMUM dos estilos
 * (cenarios-estilo.js), o mesmo do mindset e do mindset2. Cada cenário é um arquivo desta pasta, só com dados, no contrato
 * comum (nome, temas, ambiente, luz, nevoa, particulas, props, clima, camera) mais o que o palco de colagem usa:
 *   ambiente.papel: textura do fundo (PAPEIS)       foto { tratamento (TRATAMENTOS), borda (BORDAS) }
 *   texto { tinta, realce (REALCES), corRealce }     acabamento { grao, vinheta, fibra, cromatica, riscos } (0 a 1)
 * No cena.json: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }` no beat. O projeto traz cenário próprio em pecas.js:
 * `export const cenariosEstilo = { colagem3d: { 'meu-id': { ... } } }`. Sem DOM: o Node importa para validar, planejar e testar.
 */
import { registrarCenarios, registrarCameras, cenariosDo, validarCenario, escolherCenario } from '../cenarios-estilo.js';
import papelCreme from './papel-creme.js';
import papelCinza from './papel-cinza.js';
import jornal from './jornal.js';
import muralEscuro from './mural-escuro.js';
import mesaMadeira from './mesa-madeira.js';
import toalhaXadrez from './toalha-xadrez.js';
import ceuSepia from './ceu-sepia.js';
import tapeteCorte from './tapete-corte.js';
import gravura from './gravura.js';
import estudioBranco from './estudio-branco.js';
import arquivoAmbar from './arquivo-ambar.js';
import oficinaMadeira from './oficina-madeira.js';
import marcaPagina from './marca-pagina.js';
import './personagens.js';

const LISTA = [papelCreme, papelCinza, jornal, muralEscuro, mesaMadeira, toalhaXadrez, ceuSepia, tapeteCorte, gravura, estudioBranco, arquivoAmbar, oficinaMadeira, marcaPagina];
export const CENARIOS_C3 = Object.fromEntries(LISTA.map((c) => [c.id, c]));
export const IDS_CENARIOS_C3 = LISTA.map((c) => c.id);

/** vocabulário do palco de colagem (o validador recusa o resto) */
export const PAPEIS = ['creme', 'cinza', 'jornal', 'escuro', 'madeira', 'xadrez', 'ceu', 'corte', 'gravura', 'branco'];
export const LUZES_C3 = ['janela', 'estudio', 'topo', 'lateral'];
/** props: os de textura vão pintados no papel; os de objeto são 3D de verdade (sombra no papel) */
export const PROPS_TEXTURA = ['arquitetura', 'coluna', 'texto-jornal', 'manchete', 'grade-corte', 'mancha', 'carimbo', 'luz-diagonal'];
export const PROPS_3D = ['nuvens', 'fita', 'moeda', 'clipe', 'selo', 'papel-solto', 'regua'];
export const TIPOS_PROP_C3 = [...PROPS_TEXTURA, ...PROPS_3D];
export const TRATAMENTOS = ['cor', 'pb', 'sepia', 'reticula', 'gravura', 'ambar'];
export const BORDAS = ['sem', 'branca', 'polaroide', 'rasgada', 'selo', 'circulo', 'tela'];
export const REALCES = ['caixa', 'italico', 'caixa-escura']; // rodada 4: a palavra-chave é sempre a caixa na cor da marca; nada de azul
const HEX = /^#[0-9a-fA-F]{6}$/;

/**
 * Câmeras nomeadas (medidas nas referências; seção "Câmera" de COLAGEM3D-REFERENCIAS). Pose pura: recebe o progresso do beat
 * u (0 a 1), os segundos desde o início (tb) e desde a palavra-chave (ta, ou null), e devolve o alvo (x, y em px da tela),
 * o zoom (distância = D / z) e os giros (rx inclina para a frente, ry gira para o lado, rz rola), em radianos.
 * `corte: true` marca o instante de um corte seco DENTRO do beat (o QA não conta como tranco).
 */
const io = (x) => { x = Math.min(1, Math.max(0, x)); return x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
const eo = (x) => 1 - (1 - Math.min(1, Math.max(0, x))) ** 3;
const G = Math.PI / 180;
const deriva = (tb) => ({ x: 4 * Math.sin(tb * 0.9), y: 3 * Math.sin(tb * 0.7 + 1) });
export const MOVIMENTOS_C3 = {
  // empurrão lento contínuo (todas as referências): 1,00 a 1,09 no beat
  // rodada 4 (varredura dos 15): empurrão mediano de 9%/s por plano (7 a 16%/s), constante, sem easing longo
  empurra: (u, tb) => { const d = deriva(tb); return { x: d.x, y: d.y, z: 1 + 0.09 * Math.min(tb, 2.4), rx: 0, ry: 0, rz: 0 }; },
  // recuo que revela (01 "What if", 13 a peça inteira): começa 16% mais perto e abre em 1,6 s
  // recuo medido (pull-out, quase tão comum quanto o empurrão): 9%/s a partir de 14% mais perto
  recua: (u, tb) => { const d = deriva(tb); return { x: d.x, y: d.y, z: Math.max(1, 1.14 - 0.09 * tb), rx: 0, ry: 0, rz: 0 }; },
  // paralaxe (05, 04): a câmera anda de lado olhando o centro; o papel corre atrás e as fotos na frente andam menos
  paralaxe: (u) => { const k = io(u); return { x: -70 + 140 * k, y: 0, z: 1.04, rx: 0, ry: (-4 + 8 * k) * G, rz: 0 }; },
  // órbita curta (02, a pilha de fotos no mural): gira de -8 a +8 graus e inclina 5 (as camadas de papel se separam)
  orbita: (u) => { const k = io(u); return { x: 0, y: 0, z: 1.03, rx: 5 * G, ry: (-8 + 16 * k) * G, rz: (-1 + 2 * k) * G }; },
  // desce do céu (01, o planador; 06, os aviões): o alvo começa 260 px acima e desce em 1,4 s com saída suave
  desce: (u, tb) => { const k = eo(tb / 1.4); return { x: 0, y: -260 * (1 - k), z: 1.02 + 0.05 * io(u), rx: -4 * G * (1 - k), ry: 0, rz: 0 }; },
  // mergulho (02 os cardápios, 03 a mesa, 12 a moeda): começa inclinada 24 graus sobre a mesa e assenta de frente
  mergulho: (u, tb) => { const k = eo(tb / 1.3); return { x: 0, y: 30 * (1 - k), z: 1.05 + 0.04 * io(u), rx: 24 * G * (1 - k), ry: 0, rz: -2 * G * (1 - k) }; },
  // corte para o close (01: do grupo ao pulso; 05: do retrato ao nome): plano geral até a palavra-chave, corte seco para
  // 1,5 vez mais perto no foco, e empurra devagar dali
  'corte-close': (u, tb, ta, foco) => {
    const d = deriva(tb);
    if (ta == null || ta < 0) return { x: d.x, y: d.y, z: 1 + 0.04 * io(u), rx: 0, ry: 0, rz: 0 };
    const f = foco || [540, 800], k = Math.min(1, ta / 3);
    return { x: (f[0] - 540) * 0.75, y: (f[1] - 800) * 0.75, z: 1.5 + 0.06 * k, rx: 0, ry: 0, rz: 0, corte: ta < 1 / 30 };
  },
  // chicote (02 e 07, entrada do assunto novo): chega de lado com rastro em 0,28 s e assenta
  chicote: (u, tb) => { const k = eo(tb / 0.28), d = deriva(tb); return { x: d.x + 520 * (1 - k), y: d.y, z: 1.04 + 0.04 * io(u), rx: 0, ry: -6 * G * (1 - k), rz: 0, borrao: 1 - k }; },
  // fixa (09: gravura parada, só o grão e a poeira andam): deriva de 4 px
  fixa: (u, tb) => { const d = deriva(tb); return { x: d.x, y: d.y, z: 1.02, rx: 0, ry: 0, rz: 0 }; },
  // rodada 2: dolly com aceleração (04, 13): começa devagar e acelera para dentro (curva expo), subindo 30 px
  dolly: (u) => { const k = u * u * u; return { x: 0, y: -30 * k, z: 1 + 0.2 * k, rx: -2 * G * k, ry: 0, rz: 0 }; },
  // foco que muda (03, 04, 13): o papel e o fundo nítidos no começo; na palavra-chave o foco puxa para o recorte em 0,5 s
  // rodada 8: o foco do FUNDO anda de verdade (nítido no corte, 22 px de desfoque em 0,9 s; a foto e o recorte nunca desfocam)
  rack: (u, tb, ta) => { const d = deriva(tb), f = eo((tb - 0.1) / 0.9); return { x: d.x, y: d.y, z: 1.02 + 0.06 * io(u), rx: 0, ry: 0, rz: 0, foco: f }; },
  // zoom rápido na palavra (01 "1904", 07): parado até a chave, então 18% para dentro em 0,35 s com borrão de movimento
  // rodada 7: a ênfase entra e assenta com curva (smootherstep em 1 s, 10%: aceleração nula nas pontas), sem arranco nem borrão
  'zoom-rapido': (u, tb, ta) => { const d = deriva(tb), s7 = ta == null || ta < 0 ? 0 : Math.min(1, ta / 1.0), k = s7 ** 3 * (s7 * (6 * s7 - 15) + 10); return { x: d.x, y: d.y, z: 1 + 0.03 * io(u) + 0.10 * k, rx: 0, ry: 0, rz: 0 }; },
  // whip pan de saída (02, 07): empurra o beat inteiro e nos últimos 0,25 s chicoteia para o lado com rastro (o corte vem no meio do borrão)
  whip: (u, tb, ta, foco, dur = 3) => { const d = deriva(tb), fim = dur - tb, k = fim < 0.25 ? (1 - fim / 0.25) ** 2 : 0; return { x: d.x - 620 * k, y: d.y, z: 1 + 0.06 * io(u), rx: 0, ry: 7 * G * k, rz: 0, borrao: k, borraoDir: 'x', sangraSaida: k > 0 }; },
};
export const IDS_MOVIMENTOS_C3 = Object.keys(MOVIMENTOS_C3);
/** as câmeras no contrato comum (nome, descrição, duração do movimento principal, curva) */
export const CAMERAS_C3 = {
  empurra: { nome: 'Empurrão lento', descricao: 'aproxima 9% ao longo do beat (todas as referências)', dur: 4, curva: 'io' },
  recua: { nome: 'Recuo que revela', descricao: 'começa 16% mais perto e abre em 1,6 s (01, 13)', dur: 1.6, curva: 'saida' },
  paralaxe: { nome: 'Paralaxe lateral', descricao: 'anda 140 px de lado com 8 graus de giro; o papel corre atrás das fotos (04, 05)', dur: 4, curva: 'io' },
  orbita: { nome: 'Órbita curta', descricao: 'gira de -8 a +8 graus e inclina 5; as camadas de papel se separam (02)', dur: 4, curva: 'io' },
  desce: { nome: 'Desce do céu', descricao: 'o alvo desce 260 px em 1,4 s (01, 06)', dur: 1.4, curva: 'saida' },
  mergulho: { nome: 'Mergulho sobre a mesa', descricao: 'começa inclinada 24 graus sobre a mesa e assenta de frente em 1,3 s (02, 03, 12)', dur: 1.3, curva: 'saida' },
  'corte-close': { nome: 'Corte para o close', descricao: 'plano geral até a palavra-chave e corte seco para 1,5 vez no foco (01, 05)', dur: 3, curva: 'linear' },
  chicote: { nome: 'Chicote', descricao: 'chega de lado com rastro em 0,28 s (02, 07)', dur: 0.28, curva: 'saida' },
  fixa: { nome: 'Fixa com deriva', descricao: 'parada, deriva de 4 px; só o grão e a poeira andam (09)', dur: 8, curva: 'linear' },
  dolly: { nome: 'Dolly que acelera', descricao: 'entra 20% acelerando (curva cúbica) e sobe 30 px (04, 13)', dur: 4, curva: 'io' },
  rack: { nome: 'Foco que muda', descricao: 'fundo nítido e recorte desfocado; na palavra-chave o foco puxa para o recorte em 0,5 s (03, 04, 13)', dur: 0.5, curva: 'saida' },
  'zoom-rapido': { nome: 'Zoom rápido na palavra', descricao: '18% para dentro em 0,35 s na palavra-chave, com borrão (01, 07)', dur: 0.35, curva: 'saida' },
  whip: { nome: 'Whip pan de saída', descricao: 'nos últimos 0,25 s chicoteia de lado com rastro; o corte cai no borrão (02, 07)', dur: 0.25, curva: 'io' },
};
registrarCameras('colagem3d', CAMERAS_C3);
registrarCenarios('colagem3d', CENARIOS_C3, { luzes: LUZES_C3, props: TIPOS_PROP_C3 });

const n01 = (v) => v == null || (Number.isFinite(v) && v >= 0 && v <= 1);
/** problemas de um cenário: o contrato comum mais o que o palco de colagem precisa */
export function validarCenarioC3(c, id = c?.id || 'cenario') {
  const e = validarCenario('colagem3d', id, c), nome = `cenário colagem3d.${id}`;
  if (!c || typeof c !== 'object') return e;
  if (!PAPEIS.includes(c.ambiente?.papel)) e.push(`${nome}: ambiente.papel é ${PAPEIS.join(', ')}`);
  if (c.foto && (!TRATAMENTOS.includes(c.foto.tratamento) || !BORDAS.includes(c.foto.borda))) e.push(`${nome}: foto { tratamento: ${TRATAMENTOS.join(' | ')}, borda: ${BORDAS.join(' | ')} }`);
  if (!c.texto || !HEX.test(c.texto.tinta || '') || !REALCES.includes(c.texto.realce) || !HEX.test(c.texto.corRealce || '')) e.push(`${nome}: texto { tinta: hex, realce: ${REALCES.join(' | ')}, corRealce: hex }`);
  for (const k of ['grao', 'vinheta', 'fibra', 'cromatica', 'riscos']) if (!n01(c.acabamento?.[k])) e.push(`${nome}: acabamento.${k} de 0 a 1`);
  if (!MOVIMENTOS_C3[c.camera]) e.push(`${nome}: camera "${c.camera}" não é um movimento (${IDS_MOVIMENTOS_C3.join(', ')})`);
  for (const p of c.props || []) if (p && !(p.x == null || (p.x >= -0.2 && p.x <= 1.2)) ) e.push(`${nome}: prop ${p.tipo} com x fora de -0,2 a 1,2`);
  try { JSON.stringify(c); } catch { e.push(`${nome}: só dados (sem função nem ciclo)`); }
  return e;
}
/** cenário pelo assunto da fala (com os do projeto); sem tema, o padrão */
export const cenarioPelaFalaC3 = (fala, { padrao = 'papel-creme', evitar = null, spec = null } = {}) => escolherCenario('colagem3d', fala, { padrao, evitar, spec });
/** o cenário pelo id (os do projeto incluídos); o desconhecido cai no papel creme */
export const cenarioC3 = (id, spec = null) => { const t = cenariosDo('colagem3d', spec); return t[id] ? { id, ...t[id] } : { ...CENARIOS_C3['papel-creme'] }; };
