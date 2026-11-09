/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { curva, janela, lerp } from '../src/video/engine/tempo.js';
import { compilar, frasesDe } from '../src/video/plano.mjs';
import { autoPlano, acharNumero } from '../src/video/autoplano.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { lintarRoteiro, avaliarGancho, lerGanchos } from '../src/video/lint-roteiro.mjs';
import { validarCarrossel } from '../src/validar-carrossel.mjs';
import { casar } from '../src/video/narracao/whisper.mjs';
import { narrar as eleven } from '../src/video/narracao/elevenlabs.mjs';
import { narrar as fish } from '../src/video/narracao/fishaudio.mjs';
import { fetchComRetry } from '../src/video/http.mjs';
import { FORMAS as CAT_FORMAS, ICONES as CAT_ICONES, CENARIOS as CAT_CENARIOS } from '../src/video/catalogo.mjs';
import { abrir } from '../src/video/render.mjs';
import { checarVideo, checarCena, sobreposicoes, sombraNosCortes, corrigir } from '../src/video/qa.mjs';
import { spawnSync } from 'node:child_process';
import { traduzir } from '../src/video/erros.mjs';
import { planejarCortes, mapearTempo, compactar } from '../src/video/narracao/compactar.mjs';
import { duracaoDe } from '../src/video/narracao/alinhar.mjs';
import { porExtenso } from '../src/video/narracao/whisper.mjs';
import { gerar, eventos as eventosSfx, catalogo as catalogoSfx, SONS as SONS_SFX, SONS_NOVOS } from '../src/video/sfx.mjs';
import { lerRoteiro } from '../src/video/narracao/texto.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(RAIZ, '.teste-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const falado = (() => {
  const txt = 'Um bueiro quadrado pode engolir a tampa. Nove formam a base. Só 40 por cento disso é verdade. Já o círculo não cai. Por isso a tampa é redonda.';
  let t = 0;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += 0.35; return o; });
  return { palavras, duracao: t + 0.5 };
})();

test('curvas e janela ficam em [0,1] e nas pontas', () => {
  for (const k of Object.keys(curva)) {
    if (typeof curva[k] !== 'function') continue;
    assert.ok(Math.abs(curva[k](0)) < 1e-6, `${k}(0)`);
    assert.ok(Math.abs(curva[k](1) - 1) < 1e-3, `${k}(1)`);
  }
  assert.equal(janela(-1, 0, 1), 0);
  assert.equal(janela(5, 0, 1), 1);
  assert.equal(lerp(0, 10, 0.5), 5);
});

test('frasesDe cobre todas as palavras sem sobrepor', () => {
  const fr = frasesDe(falado.palavras);
  assert.equal(fr[0][0], 0);
  assert.equal(fr.at(-1)[1], falado.palavras.length - 1);
  fr.slice(1).forEach((f, i) => assert.equal(f[0], fr[i][1] + 1));
});

test('acharNumero entende numerais por extenso e dígitos', () => {
  const ws = (s) => s.split(' ');
  assert.equal(acharNumero(ws('são quinze milhões de graus'))?.valor, 15000000);
  assert.equal(acharNumero(ws('tem 40 por cento'))?.valor, 40);
});

test('autoplano gera cena válida que compila com beats crescentes', () => {
  const cena = autoPlano({ tema: 'TAMPA' }, falado);
  const v = validarCena(cena, falado.palavras.length);
  assert.deepEqual(v.erros, []);
  const spec = compilar(cena, falado);
  spec.beats.forEach((b, i) => { assert.ok(b.ate > b.de, `beat ${i}`); if (i) assert.ok(b.de >= spec.beats[i - 1].de); });
});

test('validar recusa forma inexistente e sugere a mais próxima', () => {
  const v = validarCena({ tema: 'X', beats: [{ id: 'a', frases: [0, 1], elementos: [{ tipo: 'peca', forma: 'espher', papel: 'destaque' }] }] });
  assert.ok(v.erros.length);
  assert.match(v.erros.join(' '), /esfera/);
});

test('validar: cenario do beat aceita nome ou objeto e explica o que está errado', () => {
  const base = (cenario, camera) => validarCena({ tema: 'X', beats: [{ id: 'a', frases: [0, 1], cenario, camera, elementos: [] }] });
  assert.deepEqual(base('rua').erros, []);
  assert.deepEqual(base({ tipo: 'sala', cor: '#4a413a', densidade: 1.5 }).erros, []);
  assert.match(base('ruaa').erros.join(' '), /não existe.*"rua"/);
  assert.match(base({ cor: '#fff' }).erros.join(' '), /precisa ser o nome/);
  assert.match(base({ tipo: 'rua', cor: 'vermelho' }).erros.join(' '), /hexadecimal/);
  assert.match(base({ tipo: 'rua', faixas: 9 }).erros.join(' '), /faixas/);
  assert.match(base({ tipo: 'sala', foo: 1 }).avisos.join(' '), /não usa o dado "foo"/);
  assert.match(base('sala', { plano: 'baixo' }).avisos.join(' '), /abaixo do chão/);
  assert.deepEqual(base('espaco', { plano: 'baixo' }).avisos, []);
  assert.deepEqual(base(undefined).erros, []);
});

test('lint reprova roteiro curto e sem números', () => {
  const r = lintarRoteiro('Você sabia disso? Pois é.');
  assert.equal(r.aprovado, false);
  assert.ok(r.nota < 70);
});

// gancho pelas regras da aula (docs/ganchos.md, "O que a aula ensina")
const CORPO = ' Eu te ilustro isso em um minuto. E no final, a regra que caiu. ' + 'A multa parou em 1990. Mas a burocracia cresceu. Agora são 60 dias para justificar, segundo o TSE. '.repeat(8) + 'Comenta ILUSTRANDO.';

test('gancho: abertura morna reprova com a dica de como melhorar', () => {
  for (const g of ['Hoje vamos falar sobre a multa de quem não vota.', 'Neste vídeo eu explico a multa de quem não vota.', 'Vou te contar uma coisa sobre a multa eleitoral.', 'Bom dia, galera, a multa de quem não vota é baixa.', 'Nós criamos um jeito novo de explicar a multa.']) {
    const r = lintarRoteiro(g + CORPO);
    assert.ok(r.problemas.some((p) => /gancho morno/.test(p) && /Comece pelo fato/.test(p)), g + ' => ' + r.problemas.join(' | '));
    assert.equal(r.aprovado, false, g);
  }
});

test('gancho: forte (curto, número e contraste nos 3 primeiros segundos) não perde nota; fraco perde e diz o que fazer', () => {
  const forte = lintarRoteiro('Faltar no turno custa R$ 3,51. Parece barato. Não é.' + CORPO);
  const fraco = lintarRoteiro('A justiça eleitoral tem uma regra antiga para quem deixa de comparecer às urnas no dia marcado.' + CORPO);
  assert.deepEqual(avaliarGancho('Faltar no turno custa R$ 3,51. Parece barato. Não é.').penas, []);
  assert.ok(forte.metricas.gancho.forca >= 2);
  assert.ok(fraco.nota < forte.nota, `${fraco.nota} < ${forte.nota}`);
  assert.ok(fraco.avisos.some((a) => /primeira frase com \d+ palavras/.test(a)));
  assert.ok(fraco.avisos.some((a) => /primeiros 3 s/.test(a) && /dado que choca/.test(a)));
  assert.ok(fraco.avisos.some((a) => /ingrediente/.test(a) && /junte dois/.test(a)));
});

test('gancho: reconhece número, pergunta, contraste, tensão, nome e "você" com acento', () => {
  assert.deepEqual(avaliarGancho('A Bahia é o único estado com 1 milhão de analfabetos.').sinais, ['número', 'contraste', 'nome']);
  assert.ok(avaliarGancho('Você abre a aba anônima e ninguém vê?').sinais.includes('você'));
  assert.ok(avaliarGancho('Os Correios perderam R$ 8 bilhões.').sinais.includes('tensão'));
  assert.ok(avaliarGancho('Quem decide a eleição no Brasil?').sinais.includes('pergunta'));
  // adjetivo vazio e fonte antes do fato só avisam
  assert.ok(avaliarGancho('Uma coisa incrível sobre o polvo.').penas.some((p) => /incrível/.test(p.msg)));
  assert.ok(avaliarGancho('Segundo a PF, o BRB pagou R$ 12 bilhões ao Master.').penas.some((p) => /abre pela fonte/.test(p.msg) && p.tipo === 'aviso'));
});

test('gancho: linha GANCHOS com as 3 opções (não é narrada, avisa se faltar ou se a abertura não for uma delas)', () => {
  const bruto = 'STATUS: v1.\nGANCHOS: A) Faltar no turno custa R$ 3,51. | B) Quem não vota paga quanto? | C) A multa parou em 1990. | escolhido: A (número que parece errado)\n[calm, clear] Faltar no turno custa R$ 3,51. Parece barato.';
  assert.deepEqual(lerGanchos(bruto), ['Faltar no turno custa R$ 3,51.', 'Quem não vota paga quanto?', 'A multa parou em 1990.']);
  assert.deepEqual(lerGanchos('STATUS: v1.\nTexto.'), []);
  const f = path.join(tmp, 'ganchos.md');
  fs.writeFileSync(f, bruto);
  assert.ok(!/GANCHOS|escolhido/.test(lerRoteiro(f)), 'a linha GANCHOS não vai para a voz nem para a legenda');
  const txt = 'Faltar no turno custa R$ 3,51. Parece barato. Não é.' + CORPO;
  assert.ok(!lintarRoteiro(txt, { ganchos: lerGanchos(bruto) }).avisos.some((a) => /GANCHOS|opç/.test(a)));
  assert.ok(lintarRoteiro(txt, { ganchos: [] }).avisos.some((a) => /nenhuma opção de gancho/.test(a)));
  assert.ok(lintarRoteiro(txt, { ganchos: ['Outro gancho qualquer aqui.', 'Mais um gancho.', 'E o terceiro.'] }).avisos.some((a) => /não é nenhuma das opções/.test(a)));
  // sem a opção ganchos (chamada direta), nada muda
  assert.ok(!lintarRoteiro(txt).avisos.some((a) => /GANCHOS|opção de gancho/.test(a)));
  assert.equal(lintarRoteiro(txt, { ganchos: [] }).nota, lintarRoteiro(txt).nota, 'a falta da linha só avisa');
});

test('lerRoteiro ignora comentários de uma ou várias linhas', () => {
  const f = path.join(tmp, 'r.md');
  fs.writeFileSync(f, '# Título\n<!-- nota\nmultilinha -->\nTexto falado aqui.\n');
  const t = lerRoteiro(f);
  assert.ok(!/nota|multilinha/.test(t));
  assert.match(t, /Texto falado/);
});

test('SFX é determinístico e sem clipping', () => {
  const spec = { duracao: 3, beats: [{ id: 'a', de: 0, ate: 3, elementos: [{ tipo: 'peca', t0: 0.5, papel: 'destaque' }, { tipo: 'contador', t0: 1.5, papel: 'destaque' }] }] };
  const sha = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
  gerar(spec, path.join(tmp, 'a.wav')); gerar(spec, path.join(tmp, 'b.wav'));
  assert.equal(sha(path.join(tmp, 'a.wav')), sha(path.join(tmp, 'b.wav')));
  const buf = fs.readFileSync(path.join(tmp, 'a.wav'));
  let pico = 0;
  for (let i = 44; i + 1 < buf.length; i += 2) pico = Math.max(pico, Math.abs(buf.readInt16LE(i)));
  assert.ok(pico < 32767 * 0.99, 'clipping');
});

test('SFX v3: cada som é finito, audível, sem clipping e sempre igual', () => {
  for (const c of catalogoSfx()) {
    const a = SONS_SFX[c.som](c.arg), b = SONS_SFX[c.som](c.arg);
    for (const [x, y] of a.L ? [[a.L, b.L], [a.R, b.R]] : [[a, b]]) {
      let pico = 0;
      for (let i = 0; i < x.length; i++) { assert.ok(Number.isFinite(x[i]), `${c.nome}: amostra inválida`); assert.equal(x[i], y[i], `${c.nome}: não determinístico`); pico = Math.max(pico, Math.abs(x[i])); }
      assert.ok(pico > 0.05 && pico <= (SONS_NOVOS.includes(c.som) ? 1 : 4), `${c.nome}: pico ${pico}`); // os da v2 saem crus; o barramento normaliza
    }
  }
});

test('SFX v3: som pela forma, sem exagero, e o corte padrão continua o clique', () => {
  const b = (id, de, elementos, extra = {}) => ({ id, de, ate: de + 3, elementos, ...extra });
  const spec = { duracao: 12, beats: [
    b('a', 0, [{ tipo: 'peca', forma: 'moeda', t0: 0.5, papel: 'destaque' }, { tipo: 'peca', forma: 'moeda', t0: 1, papel: 'apoio' }, { tipo: 'peca', forma: 'cubo', t0: 1.5 }]),
    b('b', 3, [{ tipo: 'peca', forma: 'carro', t0: 3.5, som: 'nenhum' }, { tipo: 'peca', forma: 'celular', t0: 4, papel: 'apoio' }]),
    b('c', 6, [{ tipo: 'peca', forma: 'cubo', t0: 6.5, som: 'sino' }], { transicao: 'varredura' }),
    b('d', 9, [], { som: 'virada' }),
  ] };
  const ev = eventosSfx(spec), em = (som) => ev.filter((e) => e.som === som);
  assert.equal(em('moeda').length, 1, 'a segunda moeda em menos de 4 s volta ao pop');
  assert.equal(em('pop').length, 3, 'moeda repetida, cubo e celular de apoio levam o pop');
  assert.equal(em('carro').length, 0, 'som "nenhum" silencia o elemento');
  assert.equal(em('notificacao').length, 0, 'celular só notifica quando é o destaque');
  assert.equal(em('sino').length, 1);
  assert.deepEqual(ev.filter((e) => e.som === 'clique').map((e) => e.t), [3], 'corte padrão com clique seco');
  assert.equal(em('swoosh').length, 1); assert.equal(em('impacto').length, 1); assert.equal(em('riserCinema').length, 1);
  assert.deepEqual(eventosSfx(spec), ev, 'mesma cena, mesmos eventos');
});

test('nenhum texto do estúdio usa travessão longo com espaços', () => {
  const alvos = ['CLAUDE.md', 'LEIA-ME.md', 'docs', '.claude/skills', 'src', 'marca'];
  const achados = [];
  const varre = (p) => {
    const abs = path.join(RAIZ, p);
    if (!fs.existsSync(abs)) return;
    if (fs.statSync(abs).isDirectory()) return fs.readdirSync(abs).forEach((n) => varre(path.join(p, n)));
    if (!/\.(md|mjs|js|json|html)$/.test(abs)) return;
    if (fs.readFileSync(abs, 'utf8').includes(' — ')) achados.push(p);
  };
  alvos.forEach(varre);
  assert.deepEqual(achados, []);
});

test('carrossel: valida tipos, limites e campos ausentes', () => {
  const ok = JSON.parse(fs.readFileSync(path.join(RAIZ, 'carrosseis/exemplo-formatos/carrossel.json'), 'utf8'));
  assert.deepEqual(validarCarrossel(ok).erros, []);
  const ruim = { slides: [{ tipo: 'ranking', titulo: 'x', itens: [{ nome: 'a' }] }, { tipo: 'inventado' }, { tipo: 'capa' }] };
  assert.ok(validarCarrossel(ruim).erros.length >= 3);
  const longo = { slides: [{ tipo: 'texto', titulo: 'a'.repeat(80) }] };
  assert.ok(validarCarrossel(longo).avisos.some((a) => /máximo/.test(a)));
  assert.ok(validarCarrossel({ slides: Array(21).fill({ tipo: 'texto', titulo: 'a' }) }).erros.some((e) => /20/.test(e)));
});

test('whisper: casa roteiro com reconhecimento mantendo grafia, ordem e folga de 60 ms', () => {
  const roteiro = ['O', 'bueiro', 'quadrado,', 'pode', 'engolir', 'a', 'tampa.'];
  const rec = [{ w: 'o', t: 0.1, f: 0.2 }, { w: 'bueiro', t: 0.2, f: 0.6 }, { w: 'quadrado', t: 0.65, f: 1.1 }, { w: 'pode', t: 1.3, f: 1.5 }, { w: 'engolir', t: 1.5, f: 2.0 }, { w: 'tampa', t: 2.2, f: 2.6 }];
  const r = casar(roteiro, rec, 3);
  assert.deepEqual(r.palavras.map((p) => p.w), roteiro);
  assert.ok(r.confianca > 0.8);
  r.palavras.forEach((p, i) => { assert.ok(p.f > p.t); if (i) assert.ok(p.t >= r.palavras[i - 1].f + 0.0599, `folga ${i}`); });
  assert.ok(r.palavras[2].t > 0.6 && r.palavras[2].t < 0.7);
});

const comFetch = async (impl, fn) => { const o = globalThis.fetch; globalThis.fetch = impl; try { return await fn(); } finally { globalThis.fetch = o; } };
const resp = (status, corpo = '') => new Response(corpo, { status });

test('vozes: 401, 402 e 429 viram mensagem em português sem vazar a chave', async () => {
  process.env.ELEVENLABS_API_KEY = 'segredo-xyz'; process.env.ELEVENLABS_VOICE_ID = 'v1'; process.env.FISH_API_KEY = 'segredo-fish';
  for (const [status, trecho] of [[401, /recusou a chave/], [402, /créditos/], [429, /limite de uso/]]) {
    const e = await comFetch(async () => resp(status, 'x'), () => fetchComRetry('http://x', {}, { servico: 'Teste', tentativas: 2, esperaMs: 1 }).then(() => null, (er) => er));
    assert.match(e.message, trecho);
    assert.ok(!/segredo/.test(e.message));
  }
  const chamadas = []; // 401 não repete; 500 repete
  await comFetch(async () => { chamadas.push(1); return resp(401); }, () => fetchComRetry('http://x', {}, { tentativas: 4, esperaMs: 1 }).catch(() => {}));
  assert.equal(chamadas.length, 1);
  let n = 0;
  const r = await comFetch(async () => (++n < 3 ? resp(503) : resp(200, 'ok')), () => fetchComRetry('http://x', {}, { tentativas: 4, esperaMs: 1 }));
  assert.equal(await r.text(), 'ok'); assert.equal(n, 3);
});

test('elevenlabs: junta caracteres em palavras e só manda language_code nos modelos v2.5', async () => {
  process.env.ELEVENLABS_API_KEY = 'k'; process.env.ELEVENLABS_VOICE_ID = 'v1';
  const texto = 'Olá mundo.';
  const chars = [...texto];
  const al = { characters: chars, character_start_times_seconds: chars.map((_, i) => i * 0.1), character_end_times_seconds: chars.map((_, i) => i * 0.1 + 0.09) };
  let corpo;
  const stub = async (url, o) => { corpo = JSON.parse(o.body); return new Response(JSON.stringify({ audio_base64: Buffer.from('x').toString('base64'), alignment: al }), { status: 200 }); };
  const r = await comFetch(stub, () => eleven({ texto, saida: path.join(tmp, 'e.mp3'), config: {} }));
  assert.deepEqual(r.palavras.map((p) => p.w), ['Olá', 'mundo.']);
  assert.equal(r.tempos, 'exatos');
  assert.equal(corpo.language_code, undefined);
  await comFetch(stub, () => eleven({ texto, saida: path.join(tmp, 'e.mp3'), config: { modelId: 'eleven_flash_v2_5' } }));
  assert.equal(corpo.language_code, 'pt');
});

test('fish audio: manda modelo no cabeçalho e devolve áudio para alinhar', async () => {
  process.env.FISH_API_KEY = 'k'; delete process.env.FISH_MODEL; process.env.FISH_VOICE_ID = 'ref1';
  let cab, corpo;
  const r = await comFetch(async (u, o) => { cab = o.headers; corpo = JSON.parse(o.body); return new Response(new Uint8Array([1, 2, 3]), { status: 200 }); }, () => fish({ texto: 'Oi *mundo*.', saida: path.join(tmp, 'f.mp3'), config: {} }));
  assert.equal(cab.model, 's2.1-pro');
  assert.equal(corpo.reference_id, 'ref1');
  assert.equal(corpo.text, 'Oi mundo.');
  assert.equal(r.palavras, null);
});

test('navegador: catálogo do motor bate com catalogo.mjs e o quadro é determinístico', { timeout: 120000 }, async (t) => {
  const f = path.join(RAIZ, 'projetos/tampa-de-bueiro');
  if (!fs.existsSync(path.join(f, 'palavras.json')) || !fs.existsSync(path.join(f, 'cena.json'))) return t.skip('projeto de referência sem palavras.json');
  const spec = compilar(JSON.parse(fs.readFileSync(path.join(f, 'cena.json'), 'utf8')), JSON.parse(fs.readFileSync(path.join(f, 'palavras.json'), 'utf8')));
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const cat = await paginas[0].evaluate(() => window.ilu.catalogo());
    assert.deepEqual(cat.cenarios, [...CAT_CENARIOS].sort(), 'cenários do motor batem com catalogo.mjs');
    assert.deepEqual(cat.formas, [...CAT_FORMAS].sort());
    assert.deepEqual(cat.icones, [...CAT_ICONES].sort());
    const hash = async (p, x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
    const a = await hash(paginas[0], 20.5);
    await hash(paginas[0], 3.1); // desvia: o quadro não pode depender do que foi desenhado antes
    const b = await hash(paginas[0], 20.5);
    assert.equal(a, b, 'mesmo t, mesmos pixels');
    const outra = await novaAba();
    assert.equal(await hash(outra, 20.5), a, 'outra aba, mesmos pixels');
  } finally { await fechar(); }
});

test('navegador: cenários por beat são determinísticos, não contam como peça e a atmosfera troca com suavidade', { timeout: 180000 }, async () => {
  const mk = (id, de, cenario, forma) => ({ id, de, ate: de + 3, cenario, camera: { plano: 'normal', mov: 'deriva' }, transicao: 'desfoque', elementos: [{ tipo: 'peca', forma, t0: de + 0.1, pos: [0, 0, 0] }] });
  const beats = [mk('a', 0, undefined, 'cubo'), mk('b', 3, 'rua', 'carro'), mk('c', 6, { tipo: 'agua', cor: '#2a6a86' }, 'cubo'), mk('d', 9, 'papel', 'lupa'), mk('e', 12, 'espaco', 'esfera'), mk('f', 15, 'cidade', 'predio')];
  const spec = { perfil: 'curiosidades', marca: { fundo: '#0E0E13', frente: '#FFFFFF', sombra: '#3C3B4A', destaque: '#FF7A2F', apoio: '#FFC9A3', serie: '@x' }, duracao: 18, palavras: [], efeitos: { bloom: 0.5, grao: 0.6 }, avisos: [], beats };
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const hash = async (p, x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
    const outra = await novaAba();
    for (const t of [4.5, 7.3, 10.2, 13.1, 16.4]) { // rua e água animam; papel troca a tinta; espaço gira as estrelas
      const a = await hash(paginas[0], t);
      await hash(paginas[0], 1.0); await hash(paginas[0], 16.9); // desvia: o quadro não pode depender do que veio antes
      assert.equal(await hash(paginas[0], t), a, `t=${t}: mesmo t, mesmos pixels`);
      assert.equal(await hash(outra, t), a, `t=${t}: outra aba, mesmos pixels`);
    }
    const m = await paginas[0].evaluate((x) => window.ilu.medir(x), 4.5);
    assert.equal(m.pecas.length, 1, 'o cenário não conta como peça');
    // fundo puro (cenário "vazio" com dados.fundo) de um beat para o outro: o brilho sobe aos poucos, sem salto
    const atm = { ...spec, duracao: 6, beats: [{ id: 'a', de: 0, ate: 3, cenario: { tipo: 'vazio', fundo: '#101820' }, transicao: 'corte', elementos: [] }, { id: 'b', de: 3, ate: 6, cenario: { tipo: 'vazio', fundo: '#e0a060' }, transicao: 'corte', elementos: [] }] };
    const ab = await abrir(atm, { escala: 0.25, workers: 1, gpu: false });
    try {
      const luz = async (t) => { await ab.paginas[0].evaluate((q) => window.ilu.quadro(q), t); return ab.paginas[0].evaluate(() => { const x = document.createElement('canvas'); x.width = x.height = 4; const k = x.getContext('2d'); k.drawImage(document.querySelector('#gl'), 0, 0, 4, 4); const d = k.getImageData(0, 0, 4, 4).data; return (d[0] + d[1] + d[2]) / 3; }); };
      const l = []; for (const dt of [-0.1, 0.02, 0.15, 0.3, 0.45, 0.7]) l.push(await luz(3 + dt));
      assert.ok(l[1] - l[0] < 12, `sem salto na virada (${l.map((v) => v.toFixed(0)).join(', ')})`);
      for (let i = 1; i < l.length; i++) assert.ok(l[i] >= l[i - 1], `brilho cresce com o tempo (${l.map((v) => v.toFixed(0)).join(', ')})`);
      assert.ok(l[5] - l[0] > 100, 'termina no fundo novo');
    } finally { await ab.fechar(); }
  } finally { await fechar(); }
});

test('QA do arquivo: lê o resumo do ebur128 (não a primeira linha de progresso) e acha o volume real', () => {
  const f = path.join(tmp, 'tom.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x222233:s=540x960:d=4:r=24', '-f', 'lavfi', '-i', 'sine=f=440:d=4', '-af', 'volume=-14dB', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', f]);
  assert.equal(r.status, 0);
  const q = checarVideo(f, { duracao: 4, palavras: [] }, { vozReal: true });
  assert.ok(q.info.lufs.integrado > -45 && q.info.lufs.integrado < -25, `lufs ${q.info.lufs.integrado}`);
  assert.ok(q.falhas.some((x) => /volume/.test(x.msg)), 'volume fora da meta deve reprovar');
});

const lum = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('marca: contraste do destaque no fundo e da tinta no destaque passa em 4,5:1', () => {
  const t = JSON.parse(fs.readFileSync(path.join(RAIZ, 'marca/tokens.json'), 'utf8'));
  for (const [nome, p] of Object.entries(t.paginas)) {
    assert.ok(contraste(p.destaque, t.base.fundo) >= 4.5, `${nome}: destaque sobre fundo`);
    assert.ok(contraste(p.tinta, p.destaque) >= 4.5, `${nome}: tinta sobre destaque`);
  }
});

test('erros: traduz falhas comuns e ignora o resto', () => {
  assert.match(traduzir(new Error('ffmpeg falhou: x')), /FFmpeg/);
  assert.match(traduzir(new Error('Falta FISH_API_KEY (veja)')), /chave/);
  assert.equal(traduzir(new Error('algo inesperado')), null);
});

test('servidor local: não entrega arquivos fora das pastas do motor (path traversal)', async () => {
  const { servir } = await import('../src/video/servidor.mjs');
  const srv = await servir({});
  try {
    for (const caminho of ['/engine/..%2f..%2f..%2fpackage.json', '/engine/../../../package.json', '/fonts/..%2f.env', '/vendor/addons/..%2f..%2f..%2f..%2fpackage.json', '/engine/%00x']) {
      const r = await fetch(`http://127.0.0.1:${srv.porta}${caminho}`);
      assert.equal(r.status, 404, caminho);
    }
    assert.equal((await fetch(`http://127.0.0.1:${srv.porta}/engine/runtime.js`)).status, 200);
  } finally { srv.fechar(); }
});

test('QA do arquivo: reprova luz estroboscópica (mais de 3 flashes por segundo)', () => {
  const f = path.join(tmp, 'strobe.mp4');
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', "color=c=black:s=540x960:d=4:r=30,geq=lum='if(lt(mod(floor(T*12),2),1),230,20)':cb=128:cr=128", '-f', 'lavfi', '-i', 'sine=f=440:d=4', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', f]);
  assert.equal(r.status, 0);
  assert.ok(checarVideo(f, { duracao: 4, palavras: [] }, { vozReal: false }).falhas.some((x) => /piscada/.test(x.msg)));
});

test('QA: sobreposição de peças e de rótulo é reprovada (caixa real, margem de 2 px; "sobre" fica de fora)', () => {
  const p = (x0, x1, extra = {}) => ({ id: 'b', forma: 'f' + x0, x0, x1, y0: 800, y1: 1000, ...extra });
  assert.deepEqual(sobreposicoes({ pecas: [p(200, 500), p(520, 700)], rotulos: [], titulos: [] }), [], 'peças separadas passam');
  assert.ok(sobreposicoes({ pecas: [p(200, 500), p(470, 700)], rotulos: [], titulos: [] }).some((f) => f.tipo === 'peca-peca'), 'peças que se atravessam reprovam');
  assert.deepEqual(sobreposicoes({ pecas: [p(200, 500), p(470, 700, { sobre: true })], rotulos: [], titulos: [] }), [], '"sobre": true é de propósito');
  // rótulo que entra 6 px na peça: a margem antiga (14 px) deixava passar
  const rot = { x0: 300, x1: 540, y0: 994, y1: 1066 };
  assert.ok(sobreposicoes({ pecas: [p(200, 500)], rotulos: [rot], titulos: [] }).some((f) => f.tipo === 'rotulo-peca'));
  assert.ok(sobreposicoes({ pecas: [], rotulos: [{ x0: 300, x1: 540, y0: 500, y1: 560 }], titulos: [{ x0: 130, x1: 950, y0: 410, y1: 510 }] }).some((f) => /título/.test(f.msg)));
  // correção: afasta, depois reduz e afasta mais
  const cena = { beats: [{ id: 'b', palavras: [0, 3], elementos: [] }] };
  assert.ok(corrigir(cena, [{ beat: 'b', tipo: 'peca-peca' }])); assert.equal(cena.beats[0].respiro, 1.6);
  assert.ok(corrigir(cena, [{ beat: 'b', tipo: 'rotulo-peca' }])); assert.ok(cena.beats[0].respiro > 1.6 && cena.beats[0].fator < 1);
});

test('QA: quebra o beat na palavra da última peça quando afastar e reduzir não bastam', () => {
  const ws = 'um dois tres quatro cinco seis sete oito nove dez'.split(' ').map((w, i) => ({ w, t: i * 0.5, f: i * 0.5 + 0.4 }));
  const cena = { beats: [{ id: 'b', palavras: [0, 9], respiro: 2, fator: 0.7, elementos: [{ tipo: 'peca', forma: 'cubo', entra: 0.1 }, { tipo: 'peca', id: 'x', forma: 'esfera', entra: 'cinco' }, { tipo: 'rotulo', em: 'x', texto: 'X', entra: 'cinco' }] }] };
  assert.ok(corrigir(cena, [{ beat: 'b', tipo: 'peca-peca' }], { palavras: ws, duracao: 5.2 }));
  assert.equal(cena.beats.length, 2);
  assert.deepEqual(cena.beats[0].palavras, [0, 3]); assert.deepEqual(cena.beats[1].palavras, [4, 9]);
  assert.deepEqual(cena.beats[1].elementos.map((e) => e.tipo), ['peca', 'rotulo'], 'a peça e o rótulo dela vão juntos');
});

test('QA do arquivo: sombra que aparece e some nas laterais do chão logo depois do corte é reprovada', () => {
  const spec = { duracao: 3, palavras: [], beats: [{ id: 'a', de: 0, ate: 1.5 }, { id: 'b', de: 1.5, ate: 3 }] };
  const gera = (nome, cond) => {
    const f = path.join(tmp, nome);
    const geq = `geq=lum='if(between(Y,H*0.60,H*0.66)*(lt(X,W*0.2)+gt(X,W*0.8))*(${cond}),14,30)':cb=128:cr=128`;
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=black:s=540x960:d=3:r=30,${geq}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '12', f]);
    assert.equal(r.status, 0, String(r.stderr));
    return f;
  };
  const some = sombraNosCortes(gera('sombra-some.mp4', 'between(T,1.6,1.85)'), spec);
  assert.equal(some.length, 1, 'faixa escura que some reprova'); assert.equal(some[0].beat, 'b');
  assert.deepEqual(sombraNosCortes(gera('sombra-fica.mp4', 'gte(T,1.6)'), spec), [], 'sombra que chega e fica (com a peça) passa');
  assert.deepEqual(sombraNosCortes(gera('sem-sombra.mp4', '0'), spec), [], 'sem sombra passa');
});

test('QA do arquivo: lateral clara que cai até o tom do fundo no corte não é sombra (falso positivo dos 4 vídeos)', () => {
  const spec = { duracao: 3, palavras: [], beats: [{ id: 'a', de: 0, ate: 1.5 }, { id: 'b', de: 1.5, ate: 3 }] };
  // fundo 30; peça ou chão claro (90) nas laterais antes e depois do corte; logo depois do corte a lateral vale `v`
  const gera = (nome, v) => {
    const f = path.join(tmp, nome);
    const geq = `geq=lum='if(between(Y,H*0.53,H*0.64)*(lt(X,W*0.2)+gt(X,W*0.8))*gt(X,W*0.04)*lt(X,W*0.96),if(between(T,1.53,1.8),${v},90),30)':cb=128:cr=128`;
    const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=black:s=540x960:d=3:r=30,${geq}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '12', f]);
    assert.equal(r.status, 0, String(r.stderr));
    return f;
  };
  assert.deepEqual(sombraNosCortes(gera('cai-no-fundo.mp4', 30), spec), [], 'cair até o fundo passa');
  const abaixo = sombraNosCortes(gera('abaixo-do-fundo.mp4', 18), spec);
  assert.equal(abaixo.length, 1, 'ficar mais escuro que o fundo reprova'); assert.equal(abaixo[0].beat, 'b');
});

test('navegador: peças do beat (com rótulo e entrada tardia) não se atravessam e a sombra do chão nunca aparece sem peça', { timeout: 180000 }, async () => {
  const marca = { fundo: '#0E0E13', frente: '#FFFFFF', sombra: '#3C3B4A', destaque: '#FF7A2F', apoio: '#FFC9A3', serie: '@x' };
  const beats = [
    { id: 'a', de: 0, ate: 3, camera: { plano: 'normal', mov: 'nenhum' }, transicao: 'desfoque', elementos: [{ tipo: 'peca', forma: 'barras', dados: { valores: [9.5, 4.9] }, t0: 0.1 }] },
    // o caso do bilhete na Bahia: multidão larga que gira, documento que entra perto do fim do beat, rótulo embaixo dele
    { id: 'b', de: 3, ate: 8.4, camera: { plano: 'normal', mov: 'deriva' }, transicao: 'desfoque', titulo: { texto: '1,1 milhão de baianos', t0: 3.1 }, elementos: [
      { tipo: 'peca', forma: 'multidao', papel: 'frente', escala: 1.3, t0: 3.1 },
      { tipo: 'peca', forma: 'documento', id: 'bilhete', papel: 'destaque', escala: 0.9, dados: { linhas: 3 }, t0: 7.9 },
      { tipo: 'rotulo', em: 'bilhete', texto: 'Um bilhete', lado: 'abaixo', papel: 'frente', t0: 7.9 }] },
    { id: 'c', de: 8.4, ate: 11, camera: { plano: 'normal', mov: 'nenhum' }, transicao: 'desfoque', elementos: [{ tipo: 'peca', forma: 'pilha', dados: { n: 7 }, t0: 8.5 }] },
  ];
  const spec = { perfil: 'curiosidades', marca, duracao: 11, palavras: [], efeitos: {}, avisos: [], beats };
  const { paginas, fechar } = await abrir(spec, { escala: 0.5, workers: 1, gpu: false });
  try {
    for (const t of [7.95, 8.1, 8.2, 8.3]) {
      const m = await paginas[0].evaluate((x) => window.ilu.medir(x), t);
      if (t === 8.1) assert.equal(m.pecas.length, 2, 'as duas peças estão na tela');
      assert.deepEqual(sobreposicoes(m), [], `t=${t}: sem sobreposição (${JSON.stringify(m.pecas.map((p) => [p.forma, Math.round(p.x0), Math.round(p.x1)]))} rótulo ${JSON.stringify(m.rotulos)})`);
    }
    for (const t of [3.0, 3.05, 3.15, 3.25, 8.4, 8.45, 8.55, 8.65]) { // logo depois de cada corte: o piso do beat anterior já saiu
      const m = await paginas[0].evaluate((x) => window.ilu.medir(x), t);
      for (const ps of m.pisos) assert.ok(!ps.visivel || ps.pecas > 0, `t=${t}: piso do beat ${ps.id} visível sem peça`);
    }
  } finally { await fechar(); }
  const qa = await checarCena(spec);
  assert.deepEqual(qa.falhas.filter((f) => ['peca-peca', 'rotulo-peca', 'sombra-sozinha'].includes(f.tipo)), [], 'QA da cena passa');
});

test('marca: texto fraco e suave têm contraste de leitura (4,5:1) sobre o fundo', () => {
  const t = JSON.parse(fs.readFileSync(path.join(RAIZ, 'marca/tokens.json'), 'utf8')).base;
  const mistura = (hexA) => { const a = parseInt(hexA.slice(7, 9) || 'ff', 16) / 255; const f = (i) => Math.round(parseInt(hexA.slice(i, i + 2), 16) * a + parseInt(t.fundo.slice(i, i + 2), 16) * (1 - a)); return '#' + [1, 3, 5].map((i) => f(i).toString(16).padStart(2, '0')).join(''); };
  for (const k of ['textoSuave', 'textoFraco']) assert.ok(contraste(mistura(t[k]), t.fundo) >= 4.5, `${k}: ${contraste(mistura(t[k]), t.fundo).toFixed(2)}`);
});

test('áudio: pausas longas são cortadas e os tempos remapeados', () => {
  const cortes = planejarCortes([{ s: 0, e: 0.5 }, { s: 2.0, e: 3.0 }, { s: 5.0, e: 5.2 }, { s: 8.0, e: 9.0 }], 9.0, { maxPausa: 0.34, pausa: 0.2, inicio: 0.06, fim: 0.3 });
  assert.equal(cortes.length, 3); // abertura, pausa de 1 s e silêncio final (a de 0,2 s fica)
  assert.ok(Math.abs(mapearTempo(3.0, cortes) - (3.0 - 0.44 - 0.8)) < 1e-6);
  assert.equal(mapearTempo(1.0, cortes), 1.0 - 0.44);
});

test('áudio: compactar encurta de verdade e mantém o conteúdo', () => {
  const f = path.join(tmp, 'pausas.mp3'), o = path.join(tmp, 'pausas-c.mp3');
  // 3 rajadas de tom de 0,5 s separadas por 1,2 s de silêncio
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', "aevalsrc='if(lt(mod(t,1.7),0.5),0.5*sin(2*PI*440*t),0)':d=5.1:s=44100", '-b:a', '128k', f]);
  assert.equal(r.status, 0);
  const antes = duracaoDe(f), c = compactar(f, o);
  assert.ok(c.mudou && c.duracao < antes - 1.0, `antes ${antes}, depois ${c.duracao}`);
});

test('whisper: números por extenso em português (49, 140, 2025)', () => {
  assert.equal(porExtenso(49).join(' '), 'quarenta e nove');
  assert.equal(porExtenso(140).join(' '), 'cento e quarenta');
  assert.equal(porExtenso(2025).join(' '), 'dois mil e vinte e cinco');
  assert.equal(porExtenso(15000000).join(' '), 'quinze milhões');
});

test('autoplano: beats curtos (no máximo 5,5 s) e câmera em todos', () => {
  const ws = []; let t = 0;
  const txt = 'Um banco quebrou hoje. A conta passou de muito dinheiro, e ninguém esperava. O fundo pagou tudo, mas faltou caixa. Depois veio a investigação, que durou meses e meses sem parar.';
  for (const w of txt.split(' ')) { ws.push({ w, t, f: t + 0.3 }); t += 0.34; }
  const cena = autoPlano({ tema: 'T' }, { palavras: ws, duracao: t });
  const spec = compilar(cena, { palavras: ws, duracao: t });
  assert.ok(spec.beats.every((b) => b.ate - b.de <= 5.5), spec.beats.map((b) => b.ate - b.de).join(','));
  assert.ok(spec.beats.every((b) => b.camera));
  assert.ok(spec.beats.length >= 3);
});

test('roteiro: marcações de voz entre colchetes saem da legenda e ficam para a voz', async () => {
  const { lerRoteiro, lerRoteiroComTags } = await import('../src/video/narracao/texto.mjs');
  const fs = await import('node:fs'); const os = await import('node:os'); const path = await import('node:path');
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-')), 'roteiro.md');
  fs.writeFileSync(f, 'STATUS: x\n[confident, calm]\nUm banco quebrou.\n\n[warm] Segue aqui.\n');
  assert.equal(lerRoteiro(f), 'Um banco quebrou.\n\nSegue aqui.');
  assert.match(lerRoteiroComTags(f), /\[confident, calm\]/);
  assert.match(lerRoteiroComTags(f), /\[warm\] Segue aqui/);
});

test('fala: R$, horas, porcentagem, escala e datas viram palavras para a voz (ElevenLabs e Fish)', async () => {
  const { prepararFala, fundirPalavras, cardinal } = await import('../src/video/narracao/fala.mjs');
  const f = (t) => prepararFala(t).falado;
  assert.equal(f('R$ 100'), 'cem reais');
  assert.equal(f('R$ 21.188,87'), 'vinte e um mil cento e oitenta e oito reais e oitenta e sete centavos');
  assert.equal(f('R$ 49,5 bilhões'), 'quarenta e nove bilhões e meio de reais');
  assert.equal(f('R$ 267 bi'), 'duzentos e sessenta e sete bilhões de reais');
  assert.equal(f('R$ 1,5 milhão'), 'um milhão e meio de reais');
  assert.equal(f('40h semanais, 8h24 e 1h'), 'quarenta horas semanais, oito horas e vinte e quatro minutos e uma hora');
  assert.equal(f('71%'), 'setenta e um por cento');
  assert.equal(f('a escala 6x1'), 'a escala seis por um');
  assert.equal(f('17/10/2026'), 'dezessete de outubro de dois mil e vinte e seis');
  assert.equal(f('2 folgas e 200 pessoas'), 'duas folgas e duzentas pessoas');
  assert.equal(f('100 km/h'), 'cem quilômetros por hora');
  assert.equal(f('[warm] Segue aqui, R$ 5.'), '[warm] Segue aqui, cinco reais.');
  assert.equal(cardinal(2026).join(' '), 'dois mil e vinte e seis');
  assert.equal(cardinal(1200).join(' '), 'mil e duzentos');
  // as palavras do roteiro continuam as originais, com o tempo certo
  const p = prepararFala('Pague R$ 100, agora. Em 40h.');
  assert.deepEqual(p.tokens, ['Pague', 'R$', '100,', 'agora.', 'Em', '40h.']);
  const faladas = p.falado.replace(/[.,]/g, '').split(/\s+/).map((w, i) => ({ w, t: i * 0.3, f: i * 0.3 + 0.25 }));
  const fu = fundirPalavras(faladas, p);
  assert.equal(fu.palavras.length, 6);
  assert.equal(fu.palavras[2].w, '100,');
  assert.ok(fu.palavras.every((w, i, a) => i === 0 || w.t >= a[i - 1].t));
  // pronúncia por projeto
  assert.equal(prepararFala('A CNI diz', { pronuncia: { CNI: 'cê ene i' } }).falado, 'A cê ene i diz');
});

// no pacote o motor vai num arquivo só (scripts/proteger.mjs) e sdf.js não existe: o teste é do repositório
test('sdf: malha orgânica fechada, determinística, com cache e normais unitárias', { skip: !fs.existsSync(path.join(RAIZ, 'src/video/engine/sdf.js')) }, async () => {
  const { geoSDF, cacheSDF } = await import('../src/video/engine/sdf.js');
  const { formaMao, GESTOS_MAO } = await import('../src/video/engine/repertorio/organicos.js');
  assert.deepEqual(GESTOS_MAO.sort(), ['L', 'aberta', 'aponta', 'joinha', 'paz', 'punho']);
  const a = geoSDF(formaMao('punho')), n0 = cacheSDF();
  const b = geoSDF(formaMao('punho'));
  assert.equal(a, b, 'mesma forma reaproveita a malha do cache');
  assert.equal(cacheSDF(), n0);
  // fechada: nenhuma aresta de borda (cada aresta em 2 triângulos; 4 só onde duas folhas se tocam numa célula)
  const ix = a.index.array, ar = new Map();
  for (let t = 0; t < ix.length; t += 3) for (let k = 0; k < 3; k++) { const u = ix[t + k], v = ix[t + ((k + 1) % 3)], ch = u < v ? `${u},${v}` : `${v},${u}`; ar.set(ch, (ar.get(ch) || 0) + 1); }
  assert.ok([...ar.values()].every((n) => n % 2 === 0), 'superfície fechada (sem buracos)');
  const nr = a.attributes.normal.array;
  for (let i = 0; i < nr.length; i += 3) assert.ok(Math.abs(Math.hypot(nr[i], nr[i + 1], nr[i + 2]) - 1) < 1e-3);
  const c = geoSDF(formaMao('punho'), { passo: 0.0121 });
  assert.notEqual(c, a);
});

test('contador: casas decimais do valor final ("2,2 milhões" não vira "2 milhões")', async () => {
  const { numeroBR, casasDe } = await import('../src/video/engine/numero.js');
  assert.equal(numeroBR(2.2, { valor: 2.2 }), '2,2');
  assert.equal(numeroBR(1.1, { valor: 2.2 }), '1,1', 'na contagem usa as mesmas casas');
  assert.equal(numeroBR(0, { valor: 2.2 }), '0,0');
  assert.equal(numeroBR(1500, { valor: 1500 }), '1.500');
  assert.equal(numeroBR(749.6, { valor: 1500 }), '750', 'inteiro continua arredondado na contagem');
  assert.equal(numeroBR(12.345, { valor: 12.345 }), '12,35', 'no máximo 2 casas');
  assert.equal(numeroBR(3, { valor: 3, casas: 1 }), '3,0', '"casas" no elemento manda');
  assert.equal(casasDe({ valor: 1e21 }), 0);
});

test('plano: fator abaixo do piso (cena.json antiga, 0,142) vira 0,6 com aviso; fator válido fica', () => {
  const falado = { duracao: 4, palavras: 'um dois três quatro cinco seis'.split(' ').map((w, i) => ({ w, t: i * 0.6, f: i * 0.6 + 0.5 })) };
  const cena = { beats: [{ id: 'a', palavras: [0, 2], fator: 0.142, elementos: [{ tipo: 'peca', forma: 'cubo' }] }, { id: 'b', palavras: [3, 5], fator: 0.8, elementos: [{ tipo: 'peca', forma: 'cubo' }] }] };
  const s = compilar(cena, falado);
  assert.equal(s.beats[0].fator, 0.6);
  assert.equal(s.beats[1].fator, 0.8);
  assert.ok(s.avisos.some((a) => /a: fator 0.142/.test(a)));
});

// scripts/proteger.mjs é do mantenedor (não vai no pacote): o teste só roda no repositório
test('pacote: o motor protegido mantém os módulos de engine/ que o Node importa (QA, validação, efeitos sonoros)', { skip: !fs.existsSync(path.join(RAIZ, 'scripts/proteger.mjs')) }, async () => {
  const { modulosDoNode } = await import('../scripts/proteger.mjs');
  const ficam = modulosDoNode(RAIZ);
  for (const f of ['tempo.js', 'zona.js', 'estilos-comum.js', 'estilo-impresso.js', 'estilo-linhas.js', 'estilo-tubo.js', 'estilo-cartoes.js', 'numero.js', 'assets3d']) assert.ok(ficam.includes(f), `${f} precisa ficar no pacote`);
  assert.ok(!ficam.includes('runtime.js') && !ficam.includes('pecas.js'), 'o resto do motor vai só no runtime.js empacotado');
  // tudo que um .mjs de src/ importa de engine/ está na lista (antes o cli.mjs do pacote quebrava com ERR_MODULE_NOT_FOUND)
  const engine = path.join(RAIZ, 'src/video/engine');
  const andar = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (path.join(d, e.name) === engine ? [] : andar(path.join(d, e.name))) : /\.mjs$/.test(e.name) ? [path.join(d, e.name)] : []));
  for (const f of andar(path.join(RAIZ, 'src'))) for (const m of fs.readFileSync(f, 'utf8').matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
    const alvo = path.resolve(path.dirname(f), m[1]);
    if (alvo.startsWith(engine + path.sep)) assert.ok(ficam.includes(path.relative(engine, alvo).split(path.sep)[0]), `${path.relative(RAIZ, f)} importa ${m[1]}`);
  }
});

test('travessão longo com espaços reprova na cena e no carrossel (regra que não se quebra)', () => {
  const cena = { tema: 'T', beats: [{ id: 'a', palavras: [0, 1], titulo: { texto: 'Um teste \u2014 com travessão' }, elementos: [] }] };
  assert.ok(validarCena(cena, 5).erros.some((x) => /travessão/.test(x) && /titulo/.test(x)));
  cena.beats[0].titulo.texto = 'Um teste, sem travessão';
  assert.ok(!validarCena(cena, 5).erros.some((x) => /travessão/.test(x)));
  const ok = JSON.parse(fs.readFileSync(path.join(RAIZ, 'carrosseis/exemplo-formatos/carrossel.json'), 'utf8'));
  const ruim = JSON.parse(JSON.stringify(ok).replace(/"titulo":"([^"]+)"/, '"titulo":"$1 \u2014 x"'));
  assert.ok(validarCarrossel(ruim).erros.some((x) => /travessão/.test(x)));
});
