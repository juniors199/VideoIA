/*
 * 
 * 
 */
// 0.6.18: copia o estúdio para C:\ilustrando (Windows) quando a pasta está em Downloads, OneDrive ou outro lugar que trava.
// Pergunta antes (precisa digitar "sim"), nunca apaga nem muda a pasta atual. Uso: node scripts/copiar-estudio.mjs [--para=C:\ilustrando] [--sim]
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { avaliarPasta, copiarEstudio, fraseDaCopia, tamanhoDaPasta, textoTerminal, DESTINO_WINDOWS } from '../src/estudio/pasta-segura.mjs';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv.slice(2);
const av = avaliarPasta(STUDIO);
const destino = (arg.find((a) => a.startsWith('--para=')) || '').slice(7) || av.destino || DESTINO_WINDOWS;
if (!av.problema) { console.log('A pasta do estúdio está em um lugar adequado. Nada a copiar.'); process.exit(0); }
console.log(textoTerminal(av));
if (!av.ofereceCopia) process.exit(0);
const { bytes } = tamanhoDaPasta(STUDIO);
console.log(`\nVou copiar o estúdio (${(bytes / 1e9).toFixed(1)} GB) para ${destino}. A pasta atual não será apagada.`);
let ok = arg.includes('--sim');
if (!ok) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  ok = /^s(im)?$/i.test((await rl.question('Copiar agora? Digite "sim" para copiar: ')).trim());
  rl.close();
}
if (!ok) { console.log('Tudo bem, nada foi copiado.'); process.exit(0); }
const r = copiarEstudio({ origem: STUDIO, destino, aoAndar: (n) => process.stdout.write(`\r${n} arquivos...`) });
console.log('');
if (!r.ok) { console.error(`Não copiei: ${r.detalhe}`); process.exit(1); }
console.log(fraseDaCopia(r)); // 0.6.30: diz quando a pasta mudou (C:\\ilustrando-2) e por quê
