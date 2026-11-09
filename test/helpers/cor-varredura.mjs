/*
 * 
 * 
 */
/**
 * Varredura estática de cores fixas: lê um arquivo de estilo e devolve as cores CROMÁTICAS (com cor de verdade, não cinza,
 * branco, preto nem creme) escritas como literal: #RRGGBB, 0xRRGGBB, rgb()/rgba() e hsl()/hsla(). Comentários não contam.
 * Usada por test/cor-da-marca.test.mjs e pelo gerador da linha de base (docs/cor-da-marca.md).
 */
import fs from 'node:fs';

/** cromática: saturação HSL >= 0,30 e luminosidade entre 0,12 e 0,92 */
export function cromatica(r, g, b) {
  const mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255, l = (mx + mn) / 2, d = mx - mn;
  if (!d) return false;
  return d / (1 - Math.abs(2 * l - 1)) >= 0.3 && l > 0.12 && l < 0.92;
}
const semComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[\s;,{}()])\/\/.*$/gm, '$1');

export function coresDoTexto(texto) {
  const t = semComentarios(texto), achadas = new Set();
  for (const m of t.matchAll(/#([0-9a-fA-F]{6})\b|0x([0-9a-fA-F]{6})\b/g)) {
    const h = (m[1] || m[2]).toUpperCase(), n = parseInt(h, 16);
    if (cromatica(n >> 16, (n >> 8) & 255, n & 255)) achadas.add('#' + h);
  }
  for (const m of t.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) if (cromatica(+m[1], +m[2], +m[3])) achadas.add(`rgb(${m[1]},${m[2]},${m[3]})`);
  for (const m of t.matchAll(/hsla?\(\s*(\d+)/g)) achadas.add(`hsl(${m[1]})`);
  return [...achadas].sort();
}
export const varrerArquivo = (arq) => coresDoTexto(fs.readFileSync(arq, 'utf8'));
