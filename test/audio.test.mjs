/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { gerarTrilha, variacaoDe, escolherClima, resolverTrilha, CLIMAS, CLIMAS_AUTO, NOMES_CLIMAS, sementeDe, ALVO_LUFS } from '../src/video/trilhas.mjs';
import { limitarDensidade, classificar, contexto, disciplinar, MODOS_SFX } from '../src/video/sfx-mix.mjs';
import { gerar as gerarSfx } from '../src/video/sfx.mjs';
import { compilar } from '../src/video/plano.mjs';
import { NOVOS } from '../src/video/engine/estilos-comum.js';
import { lufs, lerWav, gravarWav } from '../src/video/lufs.mjs';
import { mixarAudio } from '../src/video/mixagem.mjs';
import { checarAudio, registrarTrilha } from '../src/video/qa.mjs';

/**
 * Áudio da 0.4.2: trilha que varia de vídeo para vídeo (e dentro do vídeo), escolha automática do clima, limite de
 * densidade dos efeitos em todos os estilos e os níveis da mixagem (voz -16, trilha 14 LU ou mais abaixo sob a fala,
 * efeitos 10 LU ou mais abaixo da voz).
 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-audio-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const sha = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const fala = (dur, { ini = 0.4, fim = dur - 0.8 } = {}) => { const p = []; for (let t = ini; t < fim; t += 0.38) p.push({ w: 'x', t, f: t + 0.3 }); return p; };

test('trilha: sementes diferentes geram WAVs diferentes; a mesma semente gera o mesmo', () => {
  for (const c of ['curiosidade', 'groove', 'misterio']) {
    const a = gerarTrilha(10, c, path.join(tmp, `${c}-1a.wav`), { semente: 1 }), b = gerarTrilha(10, c, path.join(tmp, `${c}-1b.wav`), { semente: 1 });
    const d = gerarTrilha(10, c, path.join(tmp, `${c}-2.wav`), { semente: 2 });
    assert.equal(sha(a), sha(b), `${c}: a mesma semente mudou`);
    assert.notEqual(sha(a), sha(d), `${c}: sementes diferentes deram o mesmo arquivo`);
  }
  // nomes de projeto diferentes, sementes diferentes; o mesmo nome, a mesma
  assert.equal(sementeDe('venus-dia-ano-voz-nova'), sementeDe('venus-dia-ano-voz-nova'));
  assert.notEqual(sementeDe('venus-dia-ano-voz-nova'), sementeDe('netflix-ps5-horas'));
});

test('trilha: a variação cobre tom, andamento, progressão, instrumentos, padrão e timbre', () => {
  assert.ok(CLIMAS_AUTO.length >= 9, `${CLIMAS_AUTO.length} climas automáticos`);
  assert.ok(NOMES_CLIMAS.includes('pad') && !CLIMAS_AUTO.includes('pad'), 'a cama antiga só por escolha manual');
  for (const c of CLIMAS_AUTO) {
    const C = CLIMAS[c];
    assert.ok(C.progs.length >= 3, `${c}: ${C.progs.length} progressões`);
    const vs = Array.from({ length: 60 }, (_, i) => variacaoDe(c, sementeDe(`projeto-${i}`)));
    for (const v of vs) {
      assert.ok(v.transp >= -5 && v.transp <= 6, `${c}: transposição ${v.transp}`);
      assert.ok(Math.abs(v.bpm / C.bpm - 1) <= 0.0801, `${c}: bpm ${v.bpm}`);
      assert.ok(v.prog >= 0 && v.prog < C.progs.length);
      assert.ok(v.filtro >= C.filtro[0] && v.filtro <= C.filtro[1]);
    }
    const uniq = (f) => new Set(vs.map(f)).size;
    assert.ok(uniq((v) => v.transp) >= 8, `${c}: poucos tons`);
    assert.ok(uniq((v) => v.prog) >= 3, `${c}: poucas progressões`);
    assert.ok(uniq((v) => JSON.stringify(v.padroes)) >= 20, `${c}: poucos padrões`);
    assert.ok(uniq((v) => Object.keys(v.inst).join()) >= 2, `${c}: instrumentos sempre iguais`);
    assert.ok(uniq((v) => v.assinatura) >= 58, `${c}: trilhas repetidas entre 60 projetos`);
    assert.deepEqual(variacaoDe(c, 99), variacaoDe(c, 99));
  }
});

test('trilha: nada de loop idêntico, a seção muda a cada 8 compassos', () => {
  for (const c of ['curiosidade', 'pulso', 'ambiente']) {
    const v = variacaoDe(c, 4242), comp = (60 / v.bpm) * 4, dur = comp * 8 * 4 + 3;
    const { canais: [L] } = lerWav(gerarTrilha(dur, c, path.join(tmp, `${c}-sec.wav`), { semente: 4242, semDucking: true }));
    const n = Math.floor(comp * 8 * 44100), sec = (s) => L.subarray(s * n, (s + 1) * n);
    for (let s = 1; s < 3; s++) {
      const a = sec(s), b = sec(s + 1); let dif = 0, en = 0;
      for (let i = 0; i < n; i++) { dif += (a[i] - b[i]) ** 2; en += a[i] ** 2 + b[i] ** 2; }
      assert.ok(dif / en > 0.05, `${c}: seção ${s} e ${s + 1} quase iguais (${(dif / en).toFixed(3)})`);
    }
  }
});

test('trilha: nível do alvo (ALVO_LUFS) sem fala, e o JS mede como o FFmpeg', () => {
  const f = gerarTrilha(20, 'inspirador', path.join(tmp, 'insp.wav'), { semente: 5, semDucking: true });
  const { canais } = lerWav(f);
  assert.ok(Math.abs(lufs(canais) - ALVO_LUFS) < 0.3, `nível ${lufs(canais)}`);
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], { encoding: 'utf8' });
  if (r.status === 0) { const i = +r.stderr.slice(r.stderr.lastIndexOf('Summary')).match(/I:\s*(-?[\d.]+)/)[1]; assert.ok(Math.abs(i - lufs(canais)) < 0.3, `JS ${lufs(canais).toFixed(2)} x FFmpeg ${i}`); }
});

test('clima automático pelo conteúdo, determinístico e variado', () => {
  const casos = [
    [{ tema: 'ESCÂNDALO NO CONGRESSO', texto: 'a PF investiga o deputado e a polêmica cresce no governo' }, ['tensao', 'misterio']],
    [{ tema: 'SALÁRIO MÍNIMO E INFLAÇÃO', texto: 'o preço subiu e o dinheiro rende menos, o reajuste foi anunciado hoje' }, ['noticia', 'pulso']],
    [{ tema: 'VÊNUS', texto: 'o planeta gira tão devagar que o dia dura mais que o ano, diz a ciência' }, ['curiosidade', 'ambiente', 'leve']],
    [{ tema: 'O IMPÉRIO ROMANO', texto: 'no século primeiro o império dominava o mediterrâneo' }, ['epico', 'misterio']],
    [{ tema: 'ORAÇÃO E SAÚDE', texto: 'a fé e o sono ajudam a saúde do coração' }, ['leve', 'inspirador']],
    [{ tema: 'X', modelo: 'financas' }, ['pulso', 'noticia']],
    [{ tema: 'X', modelo: 'historia' }, ['antigo', 'epico', 'misterio']], // o modelo historia usa o estilo antiguidade (clima antigo)
  ];
  for (const [ent, ok] of casos) for (let s = 0; s < 12; s++) {
    const e = escolherClima({ ...ent, semente: s * 7919 });
    assert.ok(ok.includes(e.clima), `${ent.tema}/${ent.modelo}: ${e.clima} (${e.motivo})`);
    assert.deepEqual(escolherClima({ ...ent, semente: s * 7919 }), e);
  }
  const vistos = new Set(Array.from({ length: 30 }, (_, s) => escolherClima({ tema: 'VÊNUS', texto: 'o planeta e a ciência', semente: s * 104729 }).clima));
  assert.ok(vistos.size >= 2, 'o mesmo assunto sempre no mesmo clima');
});

test('resolverTrilha: manual vence o auto, os interruptores desligam e o padrão é auto', () => {
  const spec = { tema: 'VÊNUS', efeitos: {} };
  assert.equal(resolverTrilha(spec, { nome: 'a' }).modo, 'auto');
  assert.ok(CLIMAS_AUTO.includes(resolverTrilha(spec, { nome: 'a' }).clima));
  assert.deepEqual(resolverTrilha(spec, { nome: 'a' }), resolverTrilha(spec, { nome: 'a' }));
  const m = resolverTrilha({ ...spec, efeitos: { trilha: 'epico' } }, { nome: 'a' });
  assert.equal(m.clima, 'epico'); assert.equal(m.modo, 'manual');
  assert.equal(resolverTrilha({ ...spec, efeitos: { trilha: { clima: 'pad', volume: 0.5 } } }, { nome: 'a' }).clima, 'pad');
  assert.equal(resolverTrilha({ ...spec, efeitos: { trilha: { clima: 'leve', semente: 7 } } }, { nome: 'a' }).semente, 7);
  assert.equal(resolverTrilha({ ...spec, efeitos: { trilha: 'auto' } }, { nome: 'a' }).modo, 'auto');
  assert.equal(resolverTrilha(spec, { nome: 'a', semMusica: true }), null);
  assert.equal(resolverTrilha(spec, { nome: 'a', config: { musica: false } }), null);
  assert.equal(resolverTrilha(spec, { nome: 'a', config: { trilha: 'nenhuma' } }), null);
  assert.equal(resolverTrilha(spec, { nome: 'a', config: { trilha: 'groove' } }).clima, 'groove');
  // 0.6.13: os 15 estilos que saíam mudos agora têm trilha, com o clima do estilo; efeitos.musica = false ainda desliga
  for (const estilo of ['pontilhismo', 'impresso', 'cartoes', 'tubo', 'linhas', 'anatomia', 'fino', 'letreiro', 'interface', 'colagem', 'ribalta', 'mundos', 'moderno', 'alternativo']) {
    const t = resolverTrilha({ ...spec, estilo }, { nome: 'a' });
    assert.ok(t && CLIMAS_AUTO.includes(t.clima), `${estilo}: tem trilha automática`);
  }
  assert.equal(resolverTrilha({ ...spec, estilo: 'linhas', efeitos: { musica: false } }, { nome: 'a' }), null, 'a cena ainda pode desligar');
  assert.equal(resolverTrilha({ ...spec, estilo: 'linhas', efeitos: { trilha: 'leve' } }, { nome: 'a' }).clima, 'leve', 'pedido da cena vence o estilo');
});

// cena densa: peça a cada 0,3 s, rótulos, contadores e corte a cada 2 s
const densa = (dur = 30) => {
  const beats = [];
  for (let de = 0, i = 0; de < dur; de += 2, i++) {
    const elementos = [];
    for (let t = de + 0.1; t < de + 2; t += 0.3) elementos.push({ tipo: 'peca', t0: t, forma: i % 3 ? 'cubo' : 'moeda' });
    elementos.push({ tipo: 'rotulo', t0: de + 0.6 });
    if (i % 4 === 1) elementos.push({ tipo: 'contador', t0: de + 0.2, papel: 'destaque' });
    beats.push({ id: `b${i}`, de, ate: Math.min(dur, de + 2), titulo: { t0: de + 0.05 }, som: i === 6 ? 'virada' : undefined, transicao: i % 2 ? 'varredura' : undefined, elementos });
  }
  return { duracao: dur, palavras: fala(dur), beats };
};
const confereDensidade = (tempos, { intervalo = 1.5, max10 = 4 } = {}, nome = '') => {
  for (let i = 1; i < tempos.length; i++) assert.ok(tempos[i] - tempos[i - 1] >= intervalo - 1e-6, `${nome}: efeitos a ${(tempos[i] - tempos[i - 1]).toFixed(2)} s`);
  for (const s of tempos) assert.ok(tempos.filter((x) => x >= s && x < s + 10).length <= max10, `${nome}: mais de ${max10} efeitos em 10 s a partir de ${s}`);
};

test('suave mantém todos os efeitos; espacado limita a 1 a cada 1,5 s e 4 a cada 10 s, corte e número antes de pop e tique', () => {
  const spec = densa();
  const rs = {}; gerarSfx(spec, path.join(tmp, 'densa-s.wav'), { resumo: rs });
  assert.equal(rs.cortados, 0, 'suave não corta efeito'); assert.equal(rs.efeitos, rs.candidatos);
  const r = {}; gerarSfx(spec, path.join(tmp, 'densa.wav'), { modo: 'espacado', resumo: r });
  assert.ok(r.candidatos > 100 && r.efeitos <= 12, `${r.efeitos} de ${r.candidatos}`);
  confereDensidade(r.tempos, MODOS_SFX.espacado, 'motor');
  const ctx = contexto(spec);
  // todo pouso de contador que cabe fica (número vence pop)
  for (const tn of ctx.numeros) assert.ok(r.tempos.some((t) => Math.abs(t - tn) < 0.2), `número em ${tn} cortado`);
  // prioridades
  const p = (ev) => classificar(ev, spec, ctx).prio;
  assert.ok(p({ som: 'impacto', t: 12 }) > p({ som: 'clique', t: 2 }));
  assert.ok(p({ som: 'clique', t: 2 }) > p({ som: 'pop', t: 2.7 }));
  assert.ok(p({ som: 'swoosh', t: 1.5, tAlvo: 2 }) > p({ som: 'swoosh', t: 2.7 }), 'whoosh fora do corte vale menos');
  // impacto de destaque isento do ducking: no máximo 1 a cada 8 s
  const cands = [0, 3, 6, 9, 17, 20].map((t) => ({ ev: { som: 'impacto', t }, tk: t, prio: 5, destaque: true }));
  const { manter } = limitarDensidade(cands, { intervalo: 1.5, max10: 4 });
  const isentos = manter.filter((c) => c.isento).map((c) => c.tk);
  for (let i = 1; i < isentos.length; i++) assert.ok(isentos[i] - isentos[i - 1] >= 8);
  // modo "normal" também mantém todos, "nenhum" deixa nada
  const rn = {}; gerarSfx(spec, path.join(tmp, 'densa-n.wav'), { modo: 'normal', resumo: rn });
  assert.equal(rn.cortados, 0);
  const r0 = {}; gerarSfx(spec, path.join(tmp, 'densa-0.wav'), { modo: 'nenhum', resumo: r0 }); assert.equal(r0.efeitos, 0);
});

test('densidade: vale nos 14 estilos (padrão, pontilhismo e os 12 com biblioteca própria)', () => {
  const falado = { palavras: fala(24, { ini: 0.2, fim: 23 }), duracao: 24 };
  falado.palavras.forEach((w, i) => { w.w = `palavra${i}`; });
  const beats = Array.from({ length: 8 }, (_, i) => ({ id: `b${i}`, palavras: [i * 7, i * 7 + 6], titulo: { texto: 'TÍTULO' }, elementos: [{ tipo: 'peca', forma: 'cubo' }, { tipo: 'peca', forma: 'moeda' }, { tipo: 'rotulo', texto: 'rótulo' }] }));
  for (const estilo of ['padrao', 'pontilhismo', ...NOVOS]) {
    const sujeito = ['anatomia', 'fino'].includes(estilo) ? { conceito: 'objeto de teste', tipo: 'objeto', partes: ['base', 'corpo', 'tampa'], dados: { nome: 'Objeto de teste', pecas: [
      { id: 'base', conj: 'base', forma: 'caixa', em: [0, 0, 0], tam: [20, 20, 4] },
      { id: 'corpo', conj: 'corpo', forma: 'cilindro', em: [0, 0, 4], tam: [12, 12, 16], raio: 6 },
      { id: 'tampa', conj: 'tampa', forma: 'caixa', em: [0, 0, 20], tam: [16, 16, 3] },
    ] } } : null;
    const spec = compilar({ tema: 'TESTE', ...(estilo === 'padrao' ? {} : { estilo }), ...(sujeito ? { sujeito } : {}), efeitos: { sfx: true }, beats }, falado);
    const r = {}; gerarSfx(spec, path.join(tmp, `est-${estilo}.wav`), { modo: 'espacado', resumo: r });
    confereDensidade(r.tempos, MODOS_SFX.espacado, estilo);
    const rs = {}; gerarSfx(spec, path.join(tmp, `est-${estilo}-s.wav`), { resumo: rs });
    assert.equal(rs.cortados, 0, `${estilo}: suave não corta efeito`);
  }
});

test('níveis: voz em -16, efeitos 10 LU ou mais abaixo, trilha 5 a 12 LU abaixo sob a fala (alvo 7 a 8, tarde de 29/10), pico sob a voz', () => {
  const dur = 24, sr = 44100, n = dur * sr, palavras = fala(dur, { ini: 0.5, fim: 22 });
  // "voz" sintética: rajadas de ruído em banda (1 a 3 kHz) nas palavras, num WAV que o FFmpeg lê como a narração
  const v = new Float32Array(n); let s = 1, a1 = 0, a2 = 0;
  for (const w of palavras) for (let i = Math.floor(w.t * sr); i < Math.floor(w.f * sr); i++) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const x = s / 4294967296 - 0.5; a1 += 0.3 * (x - a1); a2 += 0.05 * (a1 - a2); v[i] = (a1 - a2) * 0.9 * Math.sin((Math.PI * (i / sr - w.t)) / (w.f - w.t)); }
  const narr = gravarWav(path.join(tmp, 'narr.wav'), v, v);
  const spec = densa(dur); spec.palavras = palavras;
  const sfx = gerarSfx(spec, path.join(tmp, 'sfx.wav'));
  const info = {}, trilha = gerarTrilha(dur, 'pulso', path.join(tmp, 'trilha.wav'), { palavras, semente: 3, info });
  const med = mixarAudio({ narracao: narr, sfx, trilha, duracao: dur, palavras, saida: tmp, audio: path.join(tmp, 'audio.m4a'), trilhaSemFala: info.lufsSemFala });
  assert.ok(Math.abs(med.voz - -16) <= 0.5, `voz ${med.voz}`);
  assert.ok(med.sfx <= med.voz - 10, `efeitos ${med.sfx}`);
  assert.ok(med.trilha.sobFala <= med.voz - 5 && med.trilha.sobFala >= med.voz - 12, `trilha sob a fala ${med.trilha.sobFala}`);
  assert.ok(Math.abs(med.trilha.semFala - ALVO_LUFS) <= 1, `trilha sem fala ${med.trilha.semFala} (alvo ${ALVO_LUFS})`); // -20 desde a tarde de 29/10 (era -22, e -26 antes de 22/10)
  assert.ok(med.sfxPicoAcimaVoz == null || med.sfxPicoAcimaVoz <= 0.5, `pico dos efeitos ${med.sfxPicoAcimaVoz} dB acima da voz`);
  assert.deepEqual(checarAudio(med).falhas, []);
  assert.ok(fs.existsSync(path.join(tmp, 'audio.m4a')));
  // o QA reprova o que passa do limite
  assert.equal(checarAudio({ voz: -16, sfx: -24 }).falhas.length, 1);
  assert.equal(checarAudio({ voz: -16, trilha: { sobFala: -18 } }).falhas.length, 1, 'a menos de 3 LU da voz reprova (disputa a fala)');
  assert.equal(checarAudio({ voz: -16, trilha: { sobFala: -24 } }).falhas.length, 0, '8 LU passa (era falha até a manhã de 29/10)');
  assert.equal(checarAudio({ voz: -16, trilha: { sobFala: -24 } }).avisos.length, 0, '8 LU: o alvo, sem aviso');
});

test('QA: avisa trilha idêntica à de outro projeto entre os 10 últimos', () => {
  const arq = path.join(tmp, 'hist.json');
  const v = variacaoDe('leve', 11);
  assert.deepEqual(registrarTrilha(arq, { projeto: 'a', clima: 'leve', semente: 11, assinatura: v.assinatura }), []);
  for (let i = 0; i < 3; i++) registrarTrilha(arq, { projeto: `x${i}`, clima: 'leve', semente: i, assinatura: variacaoDe('leve', i).assinatura });
  const rep = registrarTrilha(arq, { projeto: 'b', clima: 'leve', semente: 11, assinatura: v.assinatura });
  assert.equal(rep.length, 1); assert.equal(rep[0].projeto, 'a');
  assert.equal(registrarTrilha(arq, { projeto: 'a', clima: 'leve', semente: 11, assinatura: v.assinatura }).length, 1, 'o mesmo projeto de novo não conta a si mesmo');
  const q = checarAudio({ voz: -16 }, { trilha: { clima: 'leve', semente: 11 }, repetidas: rep });
  assert.ok(q.avisos.some((x) => /idêntica/.test(x.msg)));
  for (let i = 0; i < 11; i++) registrarTrilha(arq, { projeto: `y${i}`, clima: 'tensao', semente: i, assinatura: `t${i}` });
  assert.deepEqual(registrarTrilha(arq, { projeto: 'c', clima: 'leve', semente: 11, assinatura: v.assinatura }), [], 'só os 10 últimos contam');
});
