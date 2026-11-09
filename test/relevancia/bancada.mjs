/*
 * 
 * 
 */
// Bancada de relevância (0.6.12): roda o plano automático real (com o modelo de vídeo) sobre os roteiros de roteiros.json, com
// tempos sintéticos (sem voz, sem render, sem crédito), resolve as fotos automáticas (rede de verdade; cache em .estudio/fotos)
// e dá a nota "fala x imagem" de cada beat (src/video/relevancia.mjs, relatorioRelevancia).
//   node test/relevancia/bancada.mjs [--antes] [--sem-fotos] [--modelos=curiosidades,colagem,noticia] [--saida=arquivo.json]
//   --antes: ILU_RELEVANCIA=0 (o casamento antigo por pedaço de palavra, para comparar)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const S = path.resolve(AQUI, '..', '..');
const args = process.argv.slice(2);
const opc = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
if (args.includes('--antes')) process.env.ILU_RELEVANCIA = '0';
const { autoPlano } = await import(pathToFileURL(path.join(S, 'src/video/autoplano.mjs')).href);
const { carregarModelo, planoDoModelo } = await import(pathToFileURL(path.join(S, 'src/modelos/carregar.mjs')).href);
const { relatorioRelevancia } = await import(pathToFileURL(path.join(S, 'src/video/relevancia.mjs')).href);
const { resolverFotos } = await import(pathToFileURL(path.join(S, 'src/video/fotos-auto.mjs')).href);
const ROTEIROS = JSON.parse(fs.readFileSync(path.join(AQUI, 'roteiros.json'), 'utf8'));
export function falado(texto) {
  const ws = texto.replace(/\s+/g, ' ').trim().split(' ');
  let t = 0;
  const palavras = ws.map((w) => { const p = { w, t, f: t + 0.3 }; t += /[.!?]$/.test(w) ? 0.6 : /[,;:]$/.test(w) ? 0.45 : 0.36; return p; });
  return { palavras, duracao: t };
}
const modelos = (opc('modelos') || 'curiosidades,colagem,noticia').split(',');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'relev-'));
const out = [];
for (const m of modelos) {
  const plano = planoDoModelo(carregarModelo(m));
  for (const r of ROTEIROS) {
    const f = falado(r.texto);
    const cena = autoPlano({ tema: r.id.toUpperCase() }, f, { plano });
    const pasta = path.join(tmp, `${m}-${r.id}`); fs.mkdirSync(pasta, { recursive: true });
    const fotos = args.includes('--sem-fotos') ? { pedidas: 0, obtidas: [], falhas: [] } : await resolverFotos(cena, pasta, { raiz: S, projeto: r.id });
    const rel = relatorioRelevancia(cena, f.palavras);
    out.push({ modelo: m, roteiro: r.id, categoria: r.categoria, media: rel.media, semRelacao: rel.semRelacao, apoio: rel.apoio, beats: rel.beats, fotos: { pedidas: fotos.pedidas, obtidas: fotos.obtidas.map((x) => x.termo), falhas: fotos.falhas.map((x) => `${x.termo}: ${x.motivo}`) } });
    console.log(`${m.padEnd(13)} ${r.id.padEnd(16)} média ${rel.media.toFixed(2)}  sem relação ${rel.semRelacao}/${rel.beats.length}  fotos ${fotos.obtidas.length}/${fotos.pedidas}`);
  }
}
const total = out.reduce((s, x) => s + x.beats.length, 0), sem = out.reduce((s, x) => s + x.semRelacao, 0);
console.log(`TOTAL: ${sem} de ${total} beats sem relação (${((100 * sem) / total).toFixed(1)}%), média ${(out.reduce((s, x) => s + x.media * x.beats.length, 0) / total).toFixed(2)}`);
if (opc('saida')) fs.writeFileSync(opc('saida'), JSON.stringify(out, null, 1));
fs.rmSync(tmp, { recursive: true, force: true });
