/*
 * 
 * 
 */
// Bancada de relevância, fase 2 (0.6.12): 20 roteiros de tipos variados (fase2/roteiros.json) distribuídos entre os 31 modelos
// por amostragem estratificada (cada roteiro em 4 modelos; cada modelo recebe 2 ou 3 roteiros; cada tipo de conteúdo passa
// por pelo menos 3 modelos). Plano automático real com tempos sintéticos (sem voz, sem render, sem crédito), fotos
// resolvidas pela rede (cache em .estudio/fotos) e a nota "fala x imagem" de cada beat (relatorioRelevancia).
//   node test/relevancia/fase2/bancada.mjs [--saida=arquivo.json] [--sem-fotos] [--por-roteiro=4] [--so=modelo1,modelo2]
// Mede também os nomes próprios da fala (pessoa, lugar, obra, marca) que ficaram sem foto ou logo na tela.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const S = path.resolve(AQUI, '..', '..', '..');
const args = process.argv.slice(2);
const opc = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
const { autoPlano } = await import(pathToFileURL(path.join(S, 'src/video/autoplano.mjs')).href);
const { carregarModelo, planoDoModelo } = await import(pathToFileURL(path.join(S, 'src/modelos/carregar.mjs')).href);
const { relatorioRelevancia, entidades } = await import(pathToFileURL(path.join(S, 'src/video/relevancia.mjs')).href);
const { resolverFotos } = await import(pathToFileURL(path.join(S, 'src/video/fotos-auto.mjs')).href);
const ROTEIROS = JSON.parse(fs.readFileSync(path.join(AQUI, 'roteiros.json'), 'utf8'));

export function falado(texto) {
  const ws = texto.replace(/\s+/g, ' ').trim().split(' ');
  let t = 0;
  const palavras = ws.map((w) => { const p = { w, t, f: t + 0.3 }; t += /[.!?]$/.test(w) ? 0.6 : /[,;:]$/.test(w) ? 0.45 : 0.36; return p; });
  return { palavras, duracao: t };
}
/** amostragem estratificada: roteiro r recebe os modelos (k*r + j) mod M, j = 0..k-1 (cobre todos os modelos de forma equilibrada) */
export function distribuir(nRot, modelos, k = 4) {
  return Array.from({ length: nRot }, (_, r) => Array.from({ length: k }, (_, j) => modelos[(k * r + j) % modelos.length]));
}
/** nomes próprios citados sem foto, logo ou obra na tela (o que o dono chama de "foto de nome próprio faltando") */
export function nomesSemFoto(cena, palavras) {
  const ws = palavras.map((w) => w.w);
  const ents = entidades(ws, { familias: cena.relevancia?.familias || [] });
  const mostrados = new Set();
  for (const b of cena.beats || []) for (const e of b.elementos || []) {
    if (e._foto && e.arquivo) mostrados.add(e._foto);
    for (const it of e.itens || []) if (it?._foto && it.arquivo) mostrados.add(it._foto);
    // foto, logo ou obra sem marca de origem (código antes da fase 2): vale para o nome citado no próprio beat
    if ((e.tipo === 'imagem' && e.arquivo && !e._foto) || e.tipo === 'logo' || e.tipo === 'bandeira' || /^marca-/.test(e.forma || '')) for (const x of ents) if (x.i >= b.palavras[0] && x.i <= b.palavras[1]) mostrados.add(x.nome);
  }
  const logos = (cena.relevancia?.beats || []).filter((r) => /logo|bandeira/.test(r.motivo || '')).map((r) => r.foto);
  const vistos = new Set();
  return ents.filter((x) => { if (vistos.has(x.nome)) return false; vistos.add(x.nome); return !mostrados.has(x.nome) && !logos.includes(x.nome); }).map((x) => x.nome);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const todos = fs.readdirSync(path.join(S, 'modelos')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')).sort();
  const k = +(opc('por-roteiro') || 4);
  const dist = distribuir(ROTEIROS.length, todos, k);
  const so = opc('so') ? opc('so').split(',') : null;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'relev2-'));
  const out = [];
  for (const [ri, r] of ROTEIROS.entries()) for (const m of dist[ri]) {
    if (so && !so.includes(m)) continue;
    const plano = planoDoModelo(carregarModelo(m));
    const f = falado(r.texto);
    const cena = autoPlano({ tema: r.id.toUpperCase() }, f, { plano });
    const pasta = path.join(tmp, `${m}-${r.id}`); fs.mkdirSync(pasta, { recursive: true });
    const fotos = args.includes('--sem-fotos') ? { pedidas: 0, obtidas: [], falhas: [] } : await resolverFotos(cena, pasta, { raiz: S, projeto: r.id });
    const rel = relatorioRelevancia(cena, f.palavras);
    const semFoto = nomesSemFoto(cena, f.palavras);
    out.push({ modelo: m, estilo: cena.estilo || 'padrao', roteiro: r.id, categoria: r.categoria, media: rel.media, semRelacao: rel.semRelacao, apoio: rel.apoio, nomesSemFoto: semFoto, beats: rel.beats, fotos: { pedidas: fotos.pedidas, obtidas: fotos.obtidas.map((x) => x.termo), falhas: fotos.falhas.map((x) => `${x.termo}: ${x.motivo}`) } });
    console.log(`${m.padEnd(13)} ${r.id.padEnd(22)} média ${rel.media.toFixed(2)}  sem relação ${rel.semRelacao}/${rel.beats.length}  fotos ${fotos.obtidas.length}/${fotos.pedidas}${semFoto.length ? `  sem foto: ${semFoto.join(', ')}` : ''}`);
  }
  const total = out.reduce((s, x) => s + x.beats.length, 0), sem = out.reduce((s, x) => s + x.semRelacao, 0);
  const nsf = out.reduce((s, x) => s + x.nomesSemFoto.length, 0);
  const porModelo = Object.fromEntries(todos.map((m) => [m, out.filter((x) => x.modelo === m).length]));
  const porTipo = {}; for (const x of out) (porTipo[x.categoria.split('/')[0]] ||= new Set()).add(x.modelo);
  console.log(`TOTAL: ${out.length} casos, ${sem} de ${total} beats sem relação (${((100 * sem) / total).toFixed(1)}%), média ${(out.reduce((s, x) => s + x.media * x.beats.length, 0) / total).toFixed(2)}, nomes próprios sem foto ${nsf}`);
  console.log(`cobertura: modelo com menos roteiros ${Math.min(...Object.values(porModelo))}; tipo com menos modelos ${Math.min(...Object.values(porTipo).map((s) => s.size))}`);
  if (opc('saida')) fs.writeFileSync(opc('saida'), JSON.stringify({ distribuicao: Object.fromEntries(ROTEIROS.map((r, i) => [r.id, dist[i]])), casos: out }, null, 1));
  fs.rmSync(tmp, { recursive: true, force: true });
}
