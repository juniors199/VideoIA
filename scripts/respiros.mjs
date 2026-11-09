/*
 * 
 * 
 */
import '../src/programas.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { achaSilencios, planejarCortes, mapearTempo } from '../src/video/narracao/compactar.mjs';
import { duracaoDe } from '../src/video/narracao/alinhar.mjs';

/**
 * Respiros na voz: deixa a narração mais calma inserindo pausas depois da pontuação, sem acelerar nem distorcer a voz.
 *   node scripts/respiros.mjs <projeto> [--refazer] [--simular] [--trilha]
 * --naturais: refaz a compactação a partir da resposta CRUA do provedor (narracao.elevenlabs.mp3 ou narracao.bruto.mp3) e
 * MANTÉM de 3 a 5 pausas que a própria voz fez em finais de frase (até 0,55 s), em vez de inserir silêncio: soa natural e
 * não gasta crédito de voz. Precisa de palavras-original.json (os tempos da narração compactada). Sem --gravar só mostra a
 * tabela de candidatos e o plano. --em=i,j,k escolhe as palavras (índice em palavras-original.json) onde a pausa fica;
 * --gravar escreve narracao.mp3 e palavras.json (guarda a anterior em narracao-sem-naturais.mp3).
 * (com --naturais o --em usa índices; com --trilha, o --em abaixo usa palavras)
 * --em=quê.,pecou.: com --trilha, escolhe os respiros nessas palavras finais de frase (as que fecham uma ideia), em vez de espalhar (0.6.19).
 * --trilha: só 3 a 5 respiros de ~0,5 s depois de ponto final (o que o motor faz sozinho nos modelos curiosidades e
 * noticia desde a 0.6.12, para a trilha subir nas pausas).
 * Regra de ouro: só corta onde há silêncio real (o trecho mais silencioso entre o fim de uma palavra e o começo da
 * próxima, com pelo menos 0,07 s abaixo de -44, -40 ou -37 dB), com micro-fades de 10 a 15 ms; sem silêncio seguro, a pausa
 * daquele ponto é pulada (nunca "voz picotada"). Pausas: 0,45 s em . ! ?, 0,55 s em reticências, 0,35 s em dois-pontos e
 * 0,2 s em vírgula. Atualiza narracao.mp3 e os tempos de palavras.json (o resto do pipeline segue igual) e guarda os
 * originais em narracao-original.mp3 e palavras-original.json. --refazer volta aos originais e aplica de novo.
 * Adaptado do script inserir-respiros.mjs do pacote brabo-minimalista-pontilhismo, de Fernando Araújo (MIT; ver
 * AVISOS-TERCEIROS.md).
 */
/**
 * Respiros naturais (ver o cabeçalho): devolve { candidatos, escolhidos, cortes, mp3, palavras } e, com gravar, escreve os arquivos.
 * Antes ficava como script solto dentro de projetos/maps-99-celulares-v7 (respiros-naturais.mjs).
 */
export function respirosNaturais(pasta, { em = null, gravar = false, max = 5, espaco = 6, maxPausa = 0.34, pausaMax = 0.55 } = {}) {
  const bruto = ['narracao.elevenlabs.mp3', 'narracao.bruto.mp3'].map((f) => path.join(pasta, f)).find((f) => fs.existsSync(f));
  const fOrig = path.join(pasta, 'palavras-original.json');
  if (!bruto || !fs.existsSync(fOrig)) throw new Error('--naturais precisa de narracao.elevenlabs.mp3 (ou narracao.bruto.mp3) e palavras-original.json na pasta do projeto.');
  const orig = JSON.parse(fs.readFileSync(fOrig, 'utf8')), total = duracaoDe(bruto), sil = achaSilencios(bruto);
  const cortes0 = planejarCortes(sil, total, { maxPausa, pausa: 0.2 });
  const inv = (t) => { let r = t; for (const c of cortes0) { if (r > c.de + 1e-6) r += c.ate - c.de; else break; } return r; }; // compactado -> bruto
  const ws = orig.palavras.map((w) => ({ ...w, tr: inv(w.t), fr: inv(w.f) }));
  const fins = ws.map((w, i) => (/[.!?]$/.test(w.w) && ws[i + 1] ? i : -1)).filter((i) => i >= 0), validos = new Set(fins.slice(1, -2));
  const silDe = (i) => sil.filter((x) => x.e && x.e >= ws[i].fr - 0.6 && x.s <= ws[i + 1].tr + 0.2 && x.e - x.s > 0.25).sort((p, q) => (q.e - q.s) - (p.e - p.s))[0];
  const candidatos = [...validos].map((i) => { const s = silDe(i); return { i, palavra: ws[i].w, t: +ws[i].fr.toFixed(2), silencio: s ? +(s.e - s.s).toFixed(2) : 0 }; });
  let escolhidos = em;
  if (!escolhidos) { // os de silêncio mais longo, espaçados de `espaco` s, no máximo `max`, em ordem do vídeo
    const out = []; for (const c of [...candidatos].filter((x) => x.silencio >= 0.3).sort((a, b) => b.silencio - a.silencio)) if (out.length < max && out.every((o) => Math.abs(o.t - c.t) >= espaco)) out.push(c);
    escolhidos = out.sort((a, b) => a.t - b.t).map((c) => c.i);
  }
  const manter = new Set(); for (const i of escolhidos) { const s = silDe(i); if (s) manter.add(s); }
  const cortes = planejarCortes(sil.filter((x) => !manter.has(x)), total, { maxPausa, pausa: 0.2 });
  for (const s of manter) if (s.e - s.s > pausaMax) cortes.push({ de: s.s + pausaMax, ate: s.e });
  cortes.sort((x, y) => x.de - y.de);
  const mantem = []; let cur = 0;
  for (const c of cortes) { if (c.de > cur) mantem.push([cur, c.de]); cur = c.ate; }
  if (cur < total) mantem.push([cur, total]);
  const novoPal = { ...orig, palavras: ws.map(({ tr, fr, ...w }) => ({ ...w, t: +mapearTempo(tr, cortes).toFixed(3), f: +mapearTempo(fr, cortes).toFixed(3) })) };
  const plano = { candidatos, escolhidos, mantidas: [...manter].map((s) => ({ t: +s.s.toFixed(2), dur: +Math.min(pausaMax, s.e - s.s).toFixed(2) })), duracaoBruta: total };
  if (!gravar) return plano;
  const filtro = mantem.map(([a, b], k) => `[0:a]atrim=start=${a.toFixed(4)}:end=${b.toFixed(4)},asetpts=PTS-STARTPTS[p${k}]`).join(';') + ';' + mantem.map((_, k) => `[p${k}]`).join('') + `concat=n=${mantem.length}:v=0:a=1[o]`;
  const tmp = path.join(pasta, '.narracao-naturais.mp3'), r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', bruto, '-filter_complex', filtro, '-map', '[o]', '-b:a', '192k', tmp], { encoding: 'utf8' });
  if (r.status) throw new Error('ffmpeg não montou a narração: ' + r.stderr);
  const dur = duracaoDe(tmp);
  novoPal.duracao = dur; novoPal.compactado = { removido: +(total - dur).toFixed(2) }; novoPal.respiros = { naturais: plano.mantidas };
  const mp3 = path.join(pasta, 'narracao.mp3');
  if (fs.existsSync(mp3)) fs.copyFileSync(mp3, path.join(pasta, 'narracao-sem-naturais.mp3'));
  fs.renameSync(tmp, mp3);
  fs.writeFileSync(path.join(pasta, 'palavras.json'), JSON.stringify(novoPal, null, 1));
  return { ...plano, duracao: dur, gravado: true };
}

export const PAUSA = { '.': 0.45, '!': 0.45, '?': 0.45, '…': 0.55, ':': 0.35, ',': 0.2 };
const SR = 44100;

/** onde cortar: [[instante, pausa], ...] e avisos das pausas puladas */
export function planejarRespiros(x, palavras, pausa = PAUSA) {
  const db = (t) => { const s = Math.round(t * SR), w = Math.round(SR * 0.01); let a = 0; for (let i = s; i < s + w; i++) a += (x[i] || 0) ** 2; return 20 * Math.log10(Math.sqrt(a / w) + 1e-9); };
  const cortes = [], avisos = [];
  palavras.forEach((w, i) => {
    const prox = palavras[i + 1]; if (!prox) return;
    const fim = w.w.endsWith('...') ? '…' : w.w.slice(-1), p = pausa[fim];
    if (!p) return;
    let melhor = null;
    for (const lim of [-44, -40, -37]) {
      let corrida = 0, ini = 0;
      for (let t = Math.max(w.f - 0.05, prox.t - 0.45); t <= prox.t + 0.06; t += 0.005) {
        if (db(t) < lim) { if (!corrida) ini = t; corrida += 0.005; if (!melhor || corrida > melhor.len) melhor = { len: corrida, c: ini + corrida / 2 }; } else corrida = 0;
      }
      if (melhor && melhor.len >= 0.08) break;
    }
    if (melhor && melhor.len >= 0.07) cortes.push([+melhor.c.toFixed(3), p]);
    else avisos.push(`sem silêncio seguro antes de "${prox.w}" (${prox.t.toFixed(2)} s): pausa pulada`);
  });
  return { cortes, avisos };
}

/**
 * Modo "trilha" (0.6.12, decisão do dono de 29/10): só 3 a 5 respiros por vídeo, de 0,4 a 0,6 s no total (pausa que já
 * existe mais a inserida), depois de ponto final, para a trilha subir nas pausas (a narração compactada não tinha
 * nenhuma pausa de 0,4 s e o ducking nunca soltava). Fora a primeira frase (gancho) e as duas últimas (CTA, que já têm
 * a cauda da trilha); espaçados de pelo menos 8 s (5 s se não der 3). Recebe os cortes possíveis de planejarRespiros
 * (com a pausa de ponto final) e devolve os escolhidos, com a pausa ajustada ao vão que já existe.
 */
export function escolherRespirosTrilha(cortes, palavras, { min = 3, max = 5, alvo = 0.5, alvos = null } = {}) {
  const fins = palavras.map((w, i) => (/[.!?]$/.test(w.w) && palavras[i + 1] ? i : -1)).filter((i) => i >= 0);
  if (fins.length < 4) return [];
  // 0.6.19: `alvos` (palavras finais de frase escolhidas por quem conhece o texto, ex. as que fecham uma ideia) manda sobre a distribuição automática
  const validos = alvos && alvos.length ? new Set(fins.filter((i) => alvos.some((a) => palavras[i].w.toLowerCase() === String(a).toLowerCase()))) : new Set(fins.slice(1, -2));
  const cand = cortes.map(([c]) => {
    const i = palavras.findIndex((w, k) => palavras[k + 1] && c >= w.f - 0.06 && c <= palavras[k + 1].t + 0.07);
    return i >= 0 && validos.has(i) ? { c, vao: Math.max(0, palavras[i + 1].t - palavras[i].f) } : null;
  }).filter(Boolean);
  const escolher = (esp) => { const out = []; for (const x of cand) if (x.c >= 4 && (!out.length || x.c - out.at(-1).c >= esp)) out.push(x); return out; };
  let ok = escolher(8);
  if (ok.length < min) ok = escolher(5);
  if (ok.length > max) { const passo = ok.length / max; ok = Array.from({ length: max }, (_, k) => ok[Math.floor(k * passo)]); }
  return ok.map((x) => [x.c, +Math.max(0.2, Math.min(0.5, alvo + 0.05 - x.vao)).toFixed(3)]);
}

/** desloca um instante pelos cortes anteriores a ele */
export const deslocar = (t, cortes) => t + cortes.reduce((a, [c, s]) => a + (t > c ? s : 0), 0);

export function aplicarRespiros(pasta, { refazer = false, simular = false, modo = 'todos', alvos = null } = {}) {
  const fPal = path.join(pasta, 'palavras.json'), fMp3 = path.join(pasta, 'narracao.mp3');
  const oPal = path.join(pasta, 'palavras-original.json'), oMp3 = path.join(pasta, 'narracao-original.mp3');
  if (!fs.existsSync(fPal) || !fs.existsSync(fMp3)) throw new Error('falta narracao.mp3 ou palavras.json: rode o vídeo uma vez (pode ser com --sem-render).');
  let pal = JSON.parse(fs.readFileSync(fPal, 'utf8'));
  if (pal.respiros && !refazer) return { ja: true, cortes: pal.respiros.cortes || [] };
  if (pal.respiros && refazer) { if (!fs.existsSync(oPal) || !fs.existsSync(oMp3)) throw new Error('não achei os originais para refazer.'); pal = JSON.parse(fs.readFileSync(oPal, 'utf8')); }
  // a voz sempre sai da gravação original (narracao-original.mp3), guardada na primeira vez
  // narração ainda sem respiros (inclusive uma narração nova, refeita pelo pipeline): ela é o original
  const fonte = refazer ? oMp3 : fMp3;
  const raw = path.join(os.tmpdir(), `ilu-respiros-${process.pid}-${Date.now()}.f32`);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', fonte, '-ac', '1', '-ar', String(SR), '-f', 'f32le', raw], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error('ffmpeg não leu a narração: ' + r.stderr);
  const buf = fs.readFileSync(raw); fs.rmSync(raw, { force: true });
  const x = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.length / 4));
  const plan = planejarRespiros(x, pal.palavras);
  const cortes = modo === 'trilha' ? escolherRespirosTrilha(plan.cortes, pal.palavras, { alvos }) : plan.cortes, avisos = modo === 'trilha' ? [] : plan.avisos;
  if (!cortes.length && !simular) return { cortes, avisos, total: 0, duracao: pal.duracao, nenhum: true };
  if (simular) return { cortes, avisos, simulado: true };
  if (!refazer) { fs.copyFileSync(fMp3, oMp3); fs.writeFileSync(oPal, JSON.stringify(pal, null, 1)); }
  // monta: trechos + silêncio, com micro-fades para não estalar
  const partes = []; let ant = 0;
  cortes.forEach(([c, s], i) => {
    partes.push(`[0:a]atrim=${ant}:${c},asetpts=N/SR/TB${i ? ',afade=t=in:d=0.01' : ''},afade=t=out:st=${Math.max(0, c - ant - 0.015).toFixed(3)}:d=0.015[a${i}]`);
    partes.push(`anullsrc=r=${SR}:cl=mono,atrim=0:${s}[s${i}]`);
    ant = c;
  });
  partes.push(`[0:a]atrim=${ant},asetpts=N/SR/TB${cortes.length ? ',afade=t=in:d=0.01' : ''}[a${cortes.length}]`);
  partes.push(`${cortes.map((_, k) => `[a${k}][s${k}]`).join('')}[a${cortes.length}]concat=n=${2 * cortes.length + 1}:v=0:a=1[out]`);
  const script = path.join(os.tmpdir(), `ilu-respiros-${process.pid}-${Date.now()}.txt`);
  fs.writeFileSync(script, partes.join(';'));
  const tmpOut = path.join(pasta, '.narracao-respiros.mp3');
  const m = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', oMp3, '-filter_complex_script', script, '-map', '[out]', '-ar', String(SR), '-ac', '1', '-b:a', '192k', tmpOut], { encoding: 'utf8' });
  fs.rmSync(script, { force: true });
  if (m.status !== 0) throw new Error('ffmpeg não montou a narração: ' + m.stderr);
  fs.renameSync(tmpOut, fMp3);
  const total = cortes.reduce((a, [, s]) => a + s, 0);
  const novo = { ...pal, palavras: pal.palavras.map((w) => ({ ...w, t: +deslocar(w.t, cortes).toFixed(3), f: +deslocar(w.f, cortes).toFixed(3) })), duracao: +(pal.duracao + total).toFixed(3), respiros: { cortes, total: +total.toFixed(2), modo } };
  fs.writeFileSync(fPal, JSON.stringify(novo, null, 1));
  return { cortes, avisos, total, duracao: novo.duracao };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), nome = args.find((a) => !a.startsWith('--'));
  if (!nome) { console.error('Uso: node scripts/respiros.mjs <projeto> [--refazer] [--simular] [--trilha [--em=palavra.,outra?]] [--naturais [--em=i,j] [--gravar]]'); process.exit(1); }
  const pasta = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'projetos', nome);
  if (args.includes('--naturais')) {
    try {
      const em = (args.find((a) => a.startsWith('--em=')) || '').split('=')[1];
      const r = respirosNaturais(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'projetos', nome), { em: em ? em.split(',').map(Number) : null, gravar: args.includes('--gravar') });
      console.table(r.candidatos); console.log('escolhidos (índices):', r.escolhidos.join(','), '| pausas mantidas:', JSON.stringify(r.mantidas), r.gravado ? `| gravado, ${r.duracao.toFixed(2)} s` : '| simulação (use --gravar)');
    } catch (e) { console.error(e.message); process.exit(1); }
    process.exit(0);
  }
  try {
    const r = aplicarRespiros(pasta, { refazer: args.includes('--refazer'), simular: args.includes('--simular'), modo: args.includes('--trilha') || args.some((a) => a.startsWith('--em=')) ? 'trilha' : 'todos', alvos: (args.find((a) => a.startsWith('--em=')) || '').slice(5).split(',').filter(Boolean) });
    if (r.ja) console.log(`a narração já tem respiros (${r.cortes.length}). Use --refazer para aplicar de novo a partir do original.`);
    else { (r.avisos || []).forEach((a) => console.warn('aviso: ' + a)); console.log(`${r.cortes.length} respiros${r.simulado ? ' (simulação, nada gravado)' : `, +${r.total.toFixed(2)} s, narração com ${r.duracao.toFixed(2)} s`}. Ouça as emendas antes de publicar.`); }
  } catch (e) { console.error(e.message); process.exit(1); }
}
