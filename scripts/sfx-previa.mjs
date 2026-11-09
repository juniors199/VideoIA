/*
 * 
 * 
 */
// Prévia de todos os efeitos sonoros, um após o outro com 0,4 s de pausa, no mesmo barramento dos vídeos.
// Uso: npm run sfx-previa  (gera marca/saida/sfx-previa.wav e marca/saida/sfx-previa.txt com o índice)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modulo = process.argv[2] || '../src/video/sfx.mjs';
const { previa } = await import(new URL(modulo, import.meta.url));
const saida = path.join(RAIZ, 'marca', 'saida');
fs.mkdirSync(saida, { recursive: true });
const arq = path.join(saida, 'sfx-previa.wav');
const lista = previa(arq);
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const txt = ['Prévia dos efeitos sonoros do Ilustrando (síntese própria, sem amostras de terceiros)', '', ...lista.map((x, i) => `${String(i + 1).padStart(2)}. ${fmt(x.t)}  ${x.nome} (${x.som}, ${x.dur} s)`)].join('\n') + '\n';
fs.writeFileSync(path.join(saida, 'sfx-previa.txt'), txt);
console.log(txt);
console.log('prévia em', path.relative(RAIZ, arq));
