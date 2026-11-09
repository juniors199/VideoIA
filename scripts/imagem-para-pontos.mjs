/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { imagemParaPontos, previaPontos } from '../src/video/pontos.mjs';

/**
 * Foto -> pontos (JSON) para o elemento "pontos" e o estilo pontilhismo, com prévia em JPG para conferir.
 *   node scripts/imagem-para-pontos.mjs <imagem> <saida.json> [--colunas 84] [--corte x,y,larg,alt] [--limiar 0.14]
 *        [--faixa 0.62] [--fundo auto|claro|escuro|nenhum] [--tolerancia 0.11] [--protege cx,cy,rx,ry] [--inverter]
 *        [--sem-contorno] [--base 0.18] [--vinheta 0.7] [--max 5200]
 * Grava <saida>.json ({ w, h, pts }) e <saida>.jpg (os pontos sobre o preto). Na cena:
 *   { "tipo": "pontos", "forma": "retrato", "arquivo": "assets/<saida>.json" }
 * (ou aponte "arquivo" direto para a foto e passe as mesmas opções em "dados": o motor converte na hora).
 * Dicas: fundo liso sai sozinho; fundo texturizado pede --fundo nenhum com --limiar maior (0,3), --vinheta 0,7 e um
 * corte só na cabeça; rosto do mesmo tom da parede pede --protege no centro do rosto.
 * Técnica adaptada do pacote brabo-minimalista-pontilhismo, de Fernando Araújo (MIT; ver AVISOS-TERCEIROS.md).
 */
const args = process.argv.slice(2);
const SEM_VALOR = new Set(['--inverter', '--sem-contorno']);
const [entrada, saida] = args.filter((a, i) => !a.startsWith('--') && !(args[i - 1]?.startsWith('--') && !SEM_VALOR.has(args[i - 1])));
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const lista = (v) => (v == null ? undefined : v.split(',').map(Number));
const num = (v) => (v == null ? undefined : Number(v));
if (!entrada || !saida) {
  console.error('Uso: node scripts/imagem-para-pontos.mjs <imagem> <saida.json> [--corte x,y,larg,alt] [--limiar 0.14] [--fundo auto|claro|escuro|nenhum] [--protege cx,cy,rx,ry] [--colunas 84] [--inverter]');
  process.exit(1);
}
if (!fs.existsSync(entrada)) { console.error(`não achei ${entrada}`); process.exit(1); }
const d = imagemParaPontos(entrada, {
  colunas: num(opt('colunas')), corte: lista(opt('corte')), limiar: num(opt('limiar')), faixa: num(opt('faixa')), fundo: opt('fundo'),
  tolerancia: num(opt('tolerancia')), protege: lista(opt('protege')), inverter: args.includes('--inverter') || undefined,
  contorno: args.includes('--sem-contorno') ? false : undefined, base: num(opt('base')), vinheta: num(opt('vinheta')), max: num(opt('max')),
});
const json = saida.endsWith('.json') ? saida : `${saida}.json`;
fs.mkdirSync(path.dirname(path.resolve(json)), { recursive: true });
fs.writeFileSync(json, JSON.stringify({ w: d.w, h: d.h, pts: d.pts }));
const jpg = json.replace(/\.json$/, '.jpg');
previaPontos(d, jpg);
console.log(`${d.pts.length} pontos (grade ${d.w}x${d.h}${d.removeuFundo ? ', fundo removido' : ''}) -> ${json}`);
console.log(`prévia: ${jpg} (abra e confira se o rosto se lê)`);
if (d.aviso) console.warn('atenção: ' + d.aviso);
