/*
 * 
 * 
 */
import '../src/programas.mjs'; // antes do playwright: PATH dos programas e a pasta do navegador (.programas)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { abrirNavegador } from '../src/navegador.mjs'; // 0.6.2: Chromium do estúdio ou, sem ele, o Chrome ou o Edge do computador

/**
 * Folha de contato dos carrosséis: todos os slides lado a lado, numa imagem só, para conferir de uma vez
 * a leitura no tamanho do celular, a ordem da história e a força da capa.
 *   node scripts/folha-carrossel.mjs <nome> [<nome>...] [--saida=arquivo.png] [--largura=360] [--colunas=0]
 *   node scripts/folha-carrossel.mjs --todos [--saida=...]      (todos os carrosséis com slides/)
 * Sem --saida, grava carrosseis/<nome>/folha.png (um carrossel) ou carrosseis/folha.png (vários).
 * --largura: largura de cada slide na folha. 360 px é o tamanho de um slide na tela de um celular comum:
 * se dá para ler ali, dá para ler no feed. --colunas: 0 põe um carrossel por linha.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opc = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
let nomes = args.filter((a) => !a.startsWith('--'));
if (args.includes('--todos')) nomes = fs.readdirSync(path.join(RAIZ, 'carrosseis')).filter((n) => fs.existsSync(path.join(RAIZ, 'carrosseis', n, 'slides'))).sort();
if (!nomes.length) { console.error('Uso: node scripts/folha-carrossel.mjs <nome> [<nome>...] [--saida=arquivo.png] [--largura=360]'); process.exit(1); }
const L = Number(opc('largura', 360)), A = Math.round(L * 1350 / 1080), colunas = Number(opc('colunas', 0));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const linhas = nomes.map((n) => {
  const dir = path.join(RAIZ, 'carrosseis', n, 'slides');
  if (!fs.existsSync(dir)) { console.error(`sem slides: carrosseis/${n} (rode node src/carrossel.mjs ${n})`); process.exit(1); }
  const pngs = fs.readdirSync(dir).filter((f) => /^\d+\.png$/.test(f)).sort();
  let tipos = [];
  try { tipos = JSON.parse(fs.readFileSync(path.join(RAIZ, 'carrosseis', n, 'carrossel.json'), 'utf8')).slides.map((s) => s.tipo); } catch { /* sem json */ }
  return { n, itens: pngs.map((f, i) => ({ src: `data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}`, rot: `${i + 1} · ${tipos[i] || ''}` })) };
});
const maxCols = colunas || Math.max(...linhas.map((l) => l.itens.length));
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#2A2A33;font-family:system-ui,sans-serif;color:#fff;padding:28px;width:max-content}
.c{margin-bottom:34px}.c h3{margin:0 0 12px;font-size:22px;font-weight:700;letter-spacing:.01em}
.g{display:grid;grid-template-columns:repeat(${maxCols},${L}px);gap:14px}
figure{margin:0}img{display:block;width:${L}px;height:${A}px;border-radius:10px}
figcaption{font-size:15px;color:#FFFFFFA6;margin-top:6px}
</style>${linhas.map((l) => `<div class="c"><h3>${esc(l.n)}</h3><div class="g">${l.itens.map((it) => `<figure><img src="${it.src}"><figcaption>${esc(it.rot)}</figcaption></figure>`).join('')}</div></div>`).join('')}`;
const nav = (await abrirNavegador(chromium)).nav;
const aba = await nav.newPage({ viewport: { width: 800, height: 600 } });
await aba.setContent(html, { waitUntil: 'load' });
const saida = path.resolve(RAIZ, opc('saida', nomes.length === 1 ? path.join('carrosseis', nomes[0], 'folha.png') : path.join('carrosseis', 'folha.png')));
fs.mkdirSync(path.dirname(saida), { recursive: true });
await aba.screenshot({ path: saida, fullPage: true });
await nav.close();
console.log(`folha de contato: ${path.relative(RAIZ, saida)} (${linhas.reduce((a, l) => a + l.itens.length, 0)} slides, ${L} px cada)`);
