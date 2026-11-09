/*
 * 
 * 
 */
/**
 * Cenários e câmeras da base "cartoon-feltro", registrados no mecanismo comum (cenarios-estilo.js) para os TRÊS estilos da
 * família feltro e papel: paper-rocket, lighthouse-mouse e moon-path. Todo cenário vale nos três (o material e a luz mudam
 * pelo estilo); cada estilo tem a sua família preferida, que o planejador usa primeiro.
 *
 * Cenário novo em 4 passos (docs/estilo-paper-rocket.md, "Como criar um cenário"):
 *  1. copie quintal.js para <id>.js (ou declare no projeto: pecas.js `export const cenariosEstilo = { 'moon-path': { '<id>': {...} } }`);
 *  2. troque os dados: nome, temas, ambiente.fundo (3 cores de cima para baixo), luz.tipo, chao.y (ou null para quem flutua
 *     ou nada), texto ('claro' ou 'escuro', a cor da legenda sobre o céu), painel (cor do papel da transição), props;
 *  3. uma linha de import e o nome na lista abaixo;
 *  4. rode node --test test/estilo-cartoon-feltro.test.mjs (valida todo cenário registrado contra o contrato).
 */
import { registrarCenarios, registrarCameras, validarCenario, cenariosDo } from '../cenarios-estilo.js';
import { CAMERAS_CF, IDS_CAMERAS_CF } from '../cartoon-feltro-camera.js';
import { TIPOS_PROPS } from '../cartoon-feltro-props.js';
import { cenariosHZ } from '../cartoon-feltro-horizontal.js';
import quintal from './quintal.js';
import ceuNuvens from './ceu-nuvens.js';
import espaco from './espaco.js';
import luaPouso from './lua-pouso.js';
import oficina from './oficina.js';
import salaFarol from './sala-farol.js';
import farolMar from './farol-mar.js';
import quartoNoite from './quarto-noite.js';
import tempestade from './tempestade.js';
import praiaLua from './praia-lua.js';
import caisNoite from './cais-noite.js';
import marAberto from './mar-aberto.js';
import florestaNoite from './floresta-noite.js';
import colinasTarde from './colinas-tarde.js';

export const ESTILOS_CF = ['paper-rocket', 'lighthouse-mouse', 'moon-path'];
export const CENARIOS_CF = {
  quintal, 'ceu-nuvens': ceuNuvens, espaco, 'lua-pouso': luaPouso, oficina, 'sala-farol': salaFarol, 'farol-mar': farolMar, 'quarto-noite': quartoNoite,
  tempestade, 'praia-lua': praiaLua, 'cais-noite': caisNoite, 'mar-aberto': marAberto, 'floresta-noite': florestaNoite, 'colinas-tarde': colinasTarde,
};
export const LUZES_CF = ['dia', 'noite', 'lua', 'lampada', 'tarde'];
/** família de cada estilo (o planejador procura primeiro nela) e o cenário principal */
export const FAMILIA_CF = {
  'paper-rocket': { principal: 'quintal', lista: ['quintal', 'oficina', 'ceu-nuvens', 'espaco', 'lua-pouso', 'colinas-tarde'] },
  'lighthouse-mouse': { principal: 'sala-farol', lista: ['sala-farol', 'farol-mar', 'tempestade', 'quarto-noite', 'floresta-noite'] },
  'moon-path': { principal: 'praia-lua', lista: ['praia-lua', 'cais-noite', 'mar-aberto', 'floresta-noite'] },
};
for (const e of ESTILOS_CF) {
  registrarCameras(e, CAMERAS_CF);
  registrarCenarios(e, CENARIOS_CF, { luzes: LUZES_CF, props: TIPOS_PROPS, climas: ['calmo', 'vivo', 'solene'] });
}
export { CAMERAS_CF, IDS_CAMERAS_CF };
/** no horizontal os cenários vêm recompostos para o mundo largo (cartoon-feltro-horizontal.js); no vertical, os de sempre */
export const cenariosCF = (estilo, spec = null) => cenariosHZ(cenariosDo(estilo, spec));

/** problemas de um cenário da base (contrato comum + campos próprios: chao, texto, painel, camada dos props) */
export function validarCenarioCF(estilo, id, mod) {
  const e = validarCenario(estilo, id, mod);
  if (mod && typeof mod === 'object') {
    if (mod.chao != null && !(Number.isFinite(mod.chao.y) && mod.chao.y >= 1300 && mod.chao.y <= 1600)) e.push(`cenário ${estilo}.${id}: "chao" é null (quem está nele flutua ou nada) ou { y: 1300 a 1600 } (os pés acima da faixa dos botões do app)`);
    if (!['claro', 'escuro'].includes(mod.texto)) e.push(`cenário ${estilo}.${id}: "texto" é "claro" (céu escuro) ou "escuro" (céu claro)`);
    if (!/^#[0-9a-fA-F]{6}$/.test(mod.painel || '')) e.push(`cenário ${estilo}.${id}: "painel" é a cor "#rrggbb" do papel da transição`);
    for (const p of mod.props || []) if (p?.camada && !['fundo', 'meio', 'frente'].includes(p.camada)) e.push(`cenário ${estilo}.${id}: camada "${p.camada}" (fundo, meio ou frente)`);
  }
  return e;
}
