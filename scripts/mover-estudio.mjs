/*
 * 
 * 
 */
// 0.6.23: o "Abrir Estúdio (Windows)" chama este script ANTES de ligar o servidor. Pasta em OneDrive, Downloads ou outro lugar
// sincronizado derrubava o Node no Windows 11 novo (0xC0000409, 4 de 4 quedas da telemetria de 01/11/2026), então o estúdio
// passa a rodar de C:\ilustrando, sem a pessoa precisar entender nada. Nunca apaga nem muda a pasta de origem.
// Uso: node scripts/mover-estudio.mjs --checar   (saída 0 = precisa mudar, 3 = a pasta está boa)
//      node scripts/mover-estudio.mjs --mover    (copia e imprime "DESTINO=<pasta>" na última linha; saída 0 = ok)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { avaliarPasta, copiarEstudio, tamanhoDaPasta, DESTINO_WINDOWS } from '../src/estudio/pasta-segura.mjs';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv.slice(2);
const versao = (d) => { try { return fs.readFileSync(path.join(d, 'VERSAO'), 'utf8').trim(); } catch { return null; } };
const cmp = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) - (y[i] || 0); return 0; };

const av = avaliarPasta(STUDIO);
const destino = (arg.find((a) => a.startsWith('--para=')) || '').slice(7) || av.destino || DESTINO_WINDOWS;
if (!av.problema || !av.ofereceCopia) process.exit(3);
if (arg.includes('--checar')) { console.log(av.motivo); process.exit(0); }

// já existe um estúdio no destino: abre ele (a atualização é a da página, Atualizar). Pasta vazia ou ausente: copia.
const vDest = versao(destino);
if (vDest && fs.existsSync(path.join(destino, 'src', 'estudio', 'servidor.mjs'))) {
  console.log(`Já existe um estúdio em ${destino} (versão ${vDest}); vou abrir esse.`);
  if (cmp(vDest, versao(STUDIO) || '0.0.0') < 0) console.log('Ele é de uma versão mais antiga. Depois de abrir, use "Atualizar" na página do estúdio.');
  console.log(`DESTINO=${destino}`);
  process.exit(0);
}
const { bytes } = tamanhoDaPasta(STUDIO);
console.log(`Copiando o estúdio (${(bytes / 1e9).toFixed(1)} GB) para ${destino}. Pode levar alguns minutos.`);
const r = copiarEstudio({ origem: STUDIO, destino, aoAndar: (n) => process.stdout.write(`\r  ${n} arquivos...`) });
console.log('');
if (!r.ok) { console.error(`Não consegui copiar: ${r.detalhe}`); process.exit(1); }
if (r.trocouDestino) console.log(`A pasta ${r.pedido} já tinha outros arquivos, então copiei para ${r.destino} (nada foi apagado).`);
console.log(`DESTINO=${r.destino}`);
