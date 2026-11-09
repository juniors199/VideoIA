/*
 * 
 * 
 */
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { compilar, ESTILOS } from '../src/video/plano.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { ESTILOS_NOMES, ESTILOS_MOTION, TIPOS } from '../src/video/catalogo.mjs';
import { gerar as gerarSfx, eventos as eventosBase } from '../src/video/sfx.mjs';
import { eventosEstilos } from '../src/video/sfx-estilos.mjs';
import { checarCena } from '../src/video/qa.mjs';
import { abrir } from '../src/video/render.mjs';
import { validarModelo } from '../src/modelos/validar.mjs';
import { atosLinhas } from '../src/video/engine/estilo-linhas.js';
import { partesTubo } from '../src/video/engine/estilo-tubo.js';
import { linhaImpresso } from '../src/video/engine/estilo-impresso.js';
import { partesCartoes } from '../src/video/engine/estilo-cartoes.js';

/**
 * Os quatro estilos de motion (impresso, cartoes, tubo, linhas): catálogo e validação, compilação, som de cada pacote,
 * um quadro de cada no navegador (swiftshader, determinístico), mistura num vídeo padrão e o QA da cena.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-estilos-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const falado = (() => {
  const txt = 'Um pote de mel dura muitos anos. O segredo é a falta de água. As bactérias secam antes de crescer. Por isso o mel não apodrece. Segue a página.';
  let t = 0.2;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += 0.42 + (/[.]$/.test(w) ? 0.3 : 0); return o; });
  return { palavras, duracao: t + 0.8 };
})();
const CENAS = {
  linhas: { tema: 'MEL', estilo: 'linhas', beats: [
    { id: 'a', palavras: [0, 6], elementos: [{ tipo: 'linhas', forma: 'ponto', entra: 0 }] },
    { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'linhas', forma: 'quadro', entra: 'segredo' }] },
    { id: 'c', palavras: [13, 19], elementos: [{ tipo: 'linhas', forma: 'grafo', entra: 'bactérias' }] },
    { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'linhas', forma: 'explosao', entra: 'mel' }] } ] },
  tubo: { tema: 'MEL', estilo: 'tubo', beats: [
    { id: 'a', palavras: [0, 6], titulo: { texto: 'Um pote de mel dura *muitos anos*' } },
    { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'tubo', forma: 'gigante', texto: 'ÁGUA', acima: 'falta de', entra: 'água.' }] },
    { id: 'c', palavras: [13, 19], elementos: [{ tipo: 'tubo', forma: 'chave', texto: 'antes de *crescer*', entra: 'antes' }] },
    { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'peca', forma: 'cubo', entra: 'mel' }, { tipo: 'tubo', forma: 'fogo', entra: 'apodrece.' }] } ] },
  impresso: { tema: 'MEL', estilo: 'impresso', beats: [
    { id: 'a', palavras: [0, 6], titulo: { texto: 'um pote de *mel* dura muitos anos' }, elementos: [{ tipo: 'impresso', forma: 'cartao', lateral: 'mel · água · tempo', entra: 0.2, pos: [0.55, 0.62] }] },
    { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'impresso', forma: 'palavra', texto: 'o segredo é a falta de *água*', entra: 0.1 }] },
    { id: 'c', palavras: [13, 19], elementos: [{ tipo: 'impresso', forma: 'objeto', objeto: 'cronometro', entra: 'bactérias', pos: [0.6, 0.6], tamanho: 0.8 }] },
    { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'impresso', forma: 'manuscrita', texto: 'o mel não apodrece.', entra: 'mel' }] } ] },
  cartoes: { tema: 'MEL', estilo: 'cartoes', beats: [
    { id: 'a', palavras: [0, 6], titulo: { texto: 'Um pote de mel dura *muitos* anos' }, elementos: [{ tipo: 'cartoes', forma: 'grade', entra: 0, pos: [0.5, 0.6], tamanho: 0.6 }] },
    { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'cartoes', forma: 'janela', texto: 'falta de água', entra: 'segredo', pos: [0.5, 0.4] }] },
    { id: 'c', palavras: [13, 19], som: 'virada', elementos: [{ tipo: 'cartoes', forma: 'token', entra: 'bactérias', tamanho: 0.7, pos: [0.5, 0.68] }] },
    { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'cartoes', forma: 'etapas', entra: 'mel', itens: [{ titulo: 'Pouca água', sub: 'menos de 20%' }, { titulo: 'Ácido', sub: 'pH baixo' }] }] } ] },
};

test('estilos de motion: quatro estilos novos depois dos de antes, tipos de elemento e marca de cada um', () => {
  assert.deepEqual(ESTILOS_NOMES.slice(0, 5), ['padrao', 'editorial', 'minimalista', 'papel', 'pontilhismo'], 'os estilos de antes continuam iguais e na mesma ordem');
  assert.deepEqual(ESTILOS_MOTION.slice(0, 4), ['impresso', 'cartoes', 'tubo', 'linhas'], 'os quatro de antes, na mesma ordem');
  assert.deepEqual(ESTILOS_MOTION.slice(4, 6), ['anatomia', 'fino']);
  assert.deepEqual(ESTILOS_MOTION.slice(6, 9), ['letreiro', 'interface', 'colagem'], 'os estilos da marca');
  assert.deepEqual(ESTILOS_MOTION.slice(9, 11), ['ribalta', 'mundos'], 'os estilos do Clube do Motion');
  assert.deepEqual(ESTILOS_MOTION.slice(11, 12), ['antiguidade'], 'História e antiguidades depois do Clube');
  assert.ok(ESTILOS_MOTION.indexOf('moderno') > 11, 'moderno depois do antiguidade');
  for (const n of ESTILOS_MOTION) { assert.ok(ESTILOS_NOMES.includes(n)); assert.ok(TIPOS.includes(n), `tipo de elemento ${n}`); assert.ok(ESTILOS[n], `marca do estilo ${n}`); }
  assert.equal(ESTILOS.linhas.marca.fundo, '#000000');
  assert.equal(ESTILOS.tubo.marca.destaque, undefined, 'o vermelho do tubo é a cor da marca da página (0.6.29)');
  assert.equal(ESTILOS.cartoes.marca.destaque, undefined, 'o roxo dos cartões é a cor da marca da página (0.6.29)');
  assert.equal(ESTILOS.cartoes.marca.fundo, '#E8E4DE');
  assert.equal(ESTILOS.impresso.marca.fundo, '#F2ECE1');
});

test('estilos de motion: o validador aceita as cenas e recusa forma, ícone, objeto e estilo de beat inválidos, com sugestão', () => {
  for (const [n, c] of Object.entries(CENAS)) assert.deepEqual(validarCena(c, falado.palavras.length).erros, [], `cena ${n} válida`);
  const base = (els, extra = {}) => ({ tema: 'X', beats: [{ id: 'a', palavras: [0, 3], elementos: els, ...extra }] });
  assert.match(validarCena(base([{ tipo: 'tubo', forma: 'gigantee', texto: 'X' }]), 10).erros.join(' '), /gigante/);
  assert.match(validarCena(base([{ tipo: 'cartoes', forma: 'tile', icone: 'chartt' }]), 10).erros.join(' '), /chart/);
  assert.match(validarCena(base([{ tipo: 'impresso', forma: 'objeto', objeto: 'carro' }]), 10).erros.join(' '), /rolo/);
  assert.match(validarCena(base([{ tipo: 'tubo', forma: 'frase' }]), 10).erros.join(' '), /texto/);
  assert.match(validarCena(base([], { estilo: 'papel' }), 10).erros.join(' '), /estilos de motion/);
  assert.deepEqual(validarCena(base([{ tipo: 'linhas', forma: 'anel' }], { estilo: 'tubo' }), 10).erros, [], 'beat em outro estilo (mistura) é válido');
  assert.match(validarCena({ ...base([]), estilo: 'brutalista' }, 10).erros.join(' '), /estilo/);
});

test('estilos de motion: compilação e linha do tempo de cada estilo (atos do ponto, partes, cortes)', () => {
  const sl = compilar(CENAS.linhas, falado);
  assert.equal(sl.estilo, 'linhas');
  const atos = atosLinhas(sl);
  assert.equal(atos.length, 4);
  for (const a of atos.slice(1)) { assert.ok(a.viagem, `${a.forma}: o ponto viaja até a forma`); assert.ok(a.viagem.tv1 === a.t0 && a.viagem.tv0 < a.t0); }
  for (const a of atos.slice(0, -1)) assert.ok(a.colapso && a.colapso[1] <= atos[a.i + 1].t0, `${a.forma}: a forma se recolhe no ponto antes da próxima`);
  // no linhas a forma nasce na palavra pedida (o ponto está sempre na tela: sem antecipar)
  const exp = sl.beats[3].elementos[0]; assert.equal(exp.t0, falado.palavras.find((w) => w.w === 'mel' && w.t > sl.beats[3].de).t);
  const st = compilar(CENAS.tubo, falado), pt = partesTubo(st);
  assert.deepEqual(pt.map((p) => p.tipo).sort(), ['chave', 'fogo', 'frase', 'gigante', 'objeto'].sort());
  const si = compilar(CENAS.impresso, falado), li = linhaImpresso(si);
  assert.deepEqual(li.cortes.map((c) => c.tipo), ['baixo', 'cima', 'chicote'], 'transições medidas em ciclo');
  const sc = compilar(CENAS.cartoes, falado);
  assert.equal(partesCartoes(sc).length, 4);
});

test('estilos de motion: som de cada pacote, sem trilha, e beats de outros estilos com o som do motor', () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const spec = compilar(c, falado), ev = eventosEstilos(spec)[n];
    assert.ok(ev && ev.length >= 6, `${n}: eventos de som do estilo`);
    assert.ok(ev.every((e) => Number.isFinite(e.t) && e.t >= 0 && typeof e.som === 'string'));
    const arq = path.join(tmp, `${n}.wav`); gerarSfx(spec, arq);
    const b = fs.readFileSync(arq); assert.equal(b.toString('ascii', 0, 4), 'RIFF');
    let pico = 0; for (let i = 44; i < b.length; i += 2) pico = Math.max(pico, Math.abs(b.readInt16LE(i)));
    assert.ok(pico > 3000 && pico < 32767, `${n}: som audível e sem estourar (pico ${pico})`);
  }
  assert.ok(eventosEstilos(compilar(CENAS.linhas, falado)).linhas.some((e) => e.som === 'whoosh'), 'linhas: whoosh na viagem do ponto');
  assert.ok(eventosEstilos(compilar(CENAS.impresso, falado)).impresso.some((e) => e.som === 'cama'), 'impresso: cama ambiente grave');
  // mistura: o beat padrão continua com o clique do motor
  const mista = compilar({ tema: 'X', beats: [{ id: 'a', palavras: [0, 6], elementos: [{ tipo: 'peca', forma: 'cubo' }] }, { id: 'b', palavras: [7, 12], estilo: 'tubo', elementos: [{ tipo: 'tubo', forma: 'gigante', texto: 'ÁGUA' }] }] }, falado);
  assert.equal(mista.beats[1].estilo, 'tubo');
  assert.ok(eventosBase(mista).some((e) => e.som === 'pop' && e.t < mista.beats[1].de), 'beat padrão com o pop da peça');
  assert.ok(eventosEstilos(mista).tubo.length > 0, 'beat em tubo com os sons do tubo');
});

test('estilos de motion: os quatro modelos de vídeo novos passam no validador', () => {
  for (const id of ESTILOS_MOTION) {
    const m = JSON.parse(fs.readFileSync(path.join(RAIZ, 'modelos', `${id}.json`), 'utf8'));
    assert.equal(m.visual.estilo, id);
    assert.deepEqual(validarModelo(m, { nomeArquivo: id }).erros, [], `modelos/${id}.json`);
  }
});

test('navegador: um quadro de cada estilo, determinístico, com a camada do estilo e o DOM do motor escondido', { timeout: 300000 }, async () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const spec = compilar(c, falado);
    const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
    try {
      const p = paginas[0], t = spec.beats[1].de + 0.9;
      const hash = async (x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
      await hash(t);
      const a = await hash(t); await hash(0.4);
      assert.equal(await hash(t), a, `${n}: mesmo t, mesmos pixels`);
      const est = await p.evaluate(() => ({ on: document.querySelector('#raiz').classList.contains('mot-on'), tela: !!document.querySelector('#mot') }));
      assert.ok(est.on && est.tela, `${n}: a camada do estilo está ativa`);
      const m = await p.evaluate((q) => window.ilu.medir(q), t);
      assert.equal(m.estilo, n);
      // o quadro não é uma tela lisa: o estilo desenhou alguma coisa
      const amostra = await p.evaluate(() => { const c = document.querySelector('#motfx').style.display === 'block' ? document.querySelector('#motfx') : document.querySelector('#mot'); const x = document.createElement('canvas'); x.width = 54; x.height = 96; const g = x.getContext('2d'); g.drawImage(c, 0, 0, 54, 96); const d = g.getImageData(0, 0, 54, 96).data; let mn = 255, mx = 0; for (let i = 0; i < d.length; i += 4) { mn = Math.min(mn, d[i]); mx = Math.max(mx, d[i]); } return mx - mn; });
      assert.ok(amostra > 40, `${n}: o quadro tem contraste (${amostra})`);
    } finally { await fechar(); }
  }
});

test('navegador: mistura num vídeo padrão (um beat em tubo e uma forma linhas solta) e o padrão sem estilo continua sem a camada', { timeout: 240000 }, async () => {
  const cena = { tema: 'X', beats: [
    { id: 'a', palavras: [0, 6], elementos: [{ tipo: 'peca', forma: 'cubo', entra: 0 }, { tipo: 'linhas', forma: 'anel', entra: 'mel', pos: [0.5, 0.2] }] },
    { id: 'b', palavras: [7, 12], estilo: 'tubo', elementos: [{ tipo: 'tubo', forma: 'gigante', texto: 'ÁGUA', entra: 'segredo' }] },
    { id: 'c', palavras: [13, 27], elementos: [{ tipo: 'peca', forma: 'esfera' }] } ] };
  const spec = compilar(cena, falado);
  const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const p = paginas[0];
    const on = async (t) => { await p.evaluate((q) => window.ilu.quadro(q), t); return p.evaluate(() => document.querySelector('#raiz').classList.contains('mot-on')); };
    assert.equal(await on(spec.beats[0].de + 1.5), false, 'beat padrão: o quadro do motor');
    assert.equal(await on(spec.beats[1].de + 1), true, 'beat em tubo: o quadro do estilo');
    assert.equal(await on(spec.beats[2].de + 1), false);
    const m = await p.evaluate((q) => window.ilu.medir(q), spec.beats[0].ate - 0.4);
    assert.ok(m.pecas.some((c) => c.forma === 'linhas:anel'), 'a forma solta é medida pelo QA');
  } finally { await fechar(); }
  const semEstilo = compilar({ tema: 'X', beats: [{ id: 'a', palavras: [0, 27], elementos: [{ tipo: 'peca', forma: 'cubo' }] }] }, falado);
  const s2 = await abrir(semEstilo, { escala: 0.25, workers: 1, gpu: false });
  try { assert.equal(await s2.paginas[0].evaluate(() => !!document.querySelector('#mot')), false, 'sem estilo de motion, nenhuma camada nova'); } finally { await s2.fechar(); }
});

test('QA: as cenas de exemplo dos quatro estilos passam sem falha (textos do estilo, caixas das formas, peças em voo)', { timeout: 600000 }, async () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const q = await checarCena(compilar(c, falado));
    assert.deepEqual(q.falhas.map((f) => `${f.beat} ${f.t}: ${f.msg}`), [], `${n} sem falhas`);
  }
});

// ───────────── leitura e composição dos quatro estilos de motion ─────────────
import { frasesDeLeitura } from '../src/video/engine/estilos-comum.js';
import { blocosCartoes } from '../src/video/engine/estilo-cartoes.js';

test('leitura: frases do lettering ficam até a próxima entrar, juntam as curtas e nunca atravessam o beat', () => {
  const spec = compilar(CENAS.cartoes, falado);
  const fr = frasesDeLeitura(spec, 'cartoes');
  assert.ok(fr.length >= 4);
  for (let i = 0; i < fr.length; i++) {
    const f = fr[i], b = spec.beats[f.bi], prox = fr[i + 1];
    assert.ok(f.ws.every((w) => w.t >= b.de - 0.01 && w.t < b.ate), 'a frase fica dentro do beat');
    if (prox && prox.bi === f.bi) assert.ok(Math.abs(f.t1 - (prox.ini - 0.02)) < 1e-6, 'sai só quando a próxima entra');
    else assert.ok(f.t1 >= b.ate - 1e-6, 'a última do beat fica até o corte');
    assert.ok(f.t1 - f.ini >= Math.min(1.2, f.fimFala - f.ini) - 0.05 || f.chars > 34, 'tempo de leitura');
  }
  const bl = blocosCartoes(spec);
  assert.ok(bl.every((x) => x.tOut > x.vis0), 'cada bloco aparece antes de sair');
});

test('composição: o último beat dos estilos de motion vai até o fim do vídeo', () => {
  const spec = compilar(CENAS.impresso, falado);
  assert.ok(spec.beats.at(-1).ate >= spec.duracao - 1e-6);
  const normal = compilar({ tema: 'X', beats: [{ id: 'a', palavras: [0, 27], elementos: [{ tipo: 'peca', forma: 'cubo' }] }] }, falado);
  assert.ok(normal.beats.at(-1).ate <= normal.duracao, 'os outros estilos não mudam');
});

// ───────────── anatomia e fino (pacotes anatomy e hairline) ─────────────
import { linhaAnatomia, cursoAnatomia, eventosAnatomia, COR as COR_ANAT } from '../src/video/engine/estilo-anatomia.js';
import { linhaFino, estadoFino, pinosFino, eventosFino, PALETAS } from '../src/video/engine/estilo-fino.js';
import { frasesDeFala, COLUNA } from '../src/video/engine/legenda-frase.js';
import { camera, prisma, anelRet, casco } from '../src/video/engine/axono.js';

const CENA_ANAT = { tema: 'TECLA', estilo: 'anatomia', beats: [
  { id: 'a', palavras: [0, 6], elementos: [{ tipo: 'anatomia', forma: 'montado', objeto: 'interruptor', entra: 0 }, { tipo: 'anatomia', forma: 'explodido', entra: 'mel' }] },
  { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'anatomia', forma: 'peca', peca: 'haste', entra: 'segredo' }, { tipo: 'anatomia', forma: 'peca', peca: 'mola', entra: 'água.' }] },
  { id: 'c', palavras: [13, 19], elementos: [{ tipo: 'anatomia', forma: 'montado', entra: 'bactérias' }, { tipo: 'anatomia', forma: 'acao', acao: 'apertar', curso: 2, entra: 'antes' }] },
  { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'anatomia', forma: 'numero', valor: 100, unidade: 'mi', rotulo: 'vida útil', entra: 'mel' }] } ] };
const CENA_FINO = { tema: 'FECHADURA', estilo: 'fino', beats: [
  { id: 'a', palavras: [0, 6], elementos: [{ tipo: 'fino', forma: 'repouso', objeto: 'fechadura', entra: 0 }, { tipo: 'fino', forma: 'parada', alvo: 'pinos', entra: 'mel' }] },
  { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'fino', forma: 'explode', alvo: 'coluna', entra: 'segredo' }, { tipo: 'fino', forma: 'junta', entra: 'água.' }] },
  { id: 'c', palavras: [13, 19], elementos: [{ tipo: 'fino', forma: 'acao', acao: 'chave-entra', duracao: 1.2, entra: 'bactérias' }, { tipo: 'fino', forma: 'acao', acao: 'gira', entra: 'crescer.' }] },
  { id: 'd', palavras: [20, 27], elementos: [{ tipo: 'fino', forma: 'acao', acao: 'chave-errada', entra: 'mel' }] } ] };

test('anatomia: tokens do pacote, validação do objeto real, vista explodida por molas com escalonamento e curso do mecanismo', () => {
  assert.equal(COR_ANAT.papel, '#fbfbfa'); assert.deepEqual(COR_ANAT.sombras, ['#dcdcd9', '#e5e5e2', '#ededea', '#f4f4f1']); assert.equal(COR_ANAT.lit, '#000000');
  assert.deepEqual(validarCena(CENA_ANAT, falado.palavras.length).erros, []);
  const base = (e) => ({ tema: 'X', estilo: 'anatomia', beats: [{ id: 'a', palavras: [0, 3], elementos: [e] }] });
  assert.match(validarCena(base({ tipo: 'anatomia', forma: 'montado', objeto: 'interruptr' }), 10).erros.join(' '), /interruptor/, 'objeto inexistente sugere o mais próximo');
  assert.match(validarCena(base({ tipo: 'anatomia', forma: 'peca', objeto: 'interruptor', peca: 'hast' }), 10).erros.join(' '), /haste/, 'conjunto inexistente sugere o real');
  const spec = compilar(CENA_ANAT, falado), L = linhaAnatomia(spec);
  assert.equal(L.obj.id, 'interruptor');
  // abre de fora para dentro com 35 ms entre conjuntos (motion.md:110); quem fica (placa, base, contatos) não sai
  const abre = L.ordem.map((id) => L.molas[id].find((a) => a.alvo === 1).t);
  for (let i = 1; i < abre.length; i++) assert.ok(Math.abs(abre[i] - abre[i - 1] - 0.035) < 1e-9);
  assert.deepEqual(L.ordem, ['tecla', 'carcaca', 'haste', 'mola']);
  // fecha na ordem inversa
  const fecha = L.ordem.map((id) => L.molas[id].filter((a) => a.alvo === 0).at(-1).t);
  for (let i = 1; i < fecha.length; i++) assert.ok(fecha[i] < fecha[i - 1]);
  // curso: 0 antes de apertar, 2,0 mm segurando (pré-curso, contato fecha)
  const tA = spec.beats[2].elementos[1].t0;
  assert.equal(cursoAnatomia(L, tA - 0.1), 0);
  assert.ok(Math.abs(cursoAnatomia(L, tA + 1) - 2) < 1e-6);
  const ev = eventosAnatomia(spec);
  assert.ok(ev.some((e) => e.som === 'click' && Math.abs(e.t - tA - 0.42) < 0.05), 'estalo quando o contato fecha');
});

test('fino: paleta do pacote, mola k100/c18 nos pinos, chave certa alinha os 5 pinos na linha de corte e a errada não', () => {
  assert.equal(PALETAS.escuro.plate, '#08090a'); assert.deepEqual(PALETAS.claro, { plate: '#ffffff', hi: '#232327', edge: '#a4a4ac', mid: '#c3c3c9', lo: '#e0e0e4', texto: '#6f6f78' });
  assert.deepEqual(validarCena(CENA_FINO, falado.palavras.length).erros, []);
  assert.match(validarCena({ tema: 'X', estilo: 'fino', beats: [{ id: 'a', palavras: [0, 3], elementos: [{ tipo: 'fino', forma: 'parada', alvo: 'pinoss' }] }] }, 10).erros.join(' '), /pinos/);
  const spec = compilar(CENA_FINO, falado), L = linhaFino(spec);
  const tGira = spec.beats[2].elementos[1].t0, tErr = spec.beats[3].elementos[0].t0;
  // pouco antes de girar a chave certa está inteira: o topo de cada pino de baixo está na linha de corte (16 mm)
  const certa = pinosFino(L, tGira - 0.05), BASE = [6.5, 8.2, 5.4, 7.6, 6.1];
  certa.forEach((b, i) => assert.ok(Math.abs(b + BASE[i] - 16) < 0.05, `pino ${i + 1} na linha de corte`));
  assert.ok(estadoFino(L, tGira + 1.2).rot > 20, 'o miolo gira');
  const errada = pinosFino(L, Math.min(spec.duracao, tErr + 3));
  assert.ok(errada.some((b, i) => Math.abs(b + BASE[i] - 16) > 0.5), 'chave errada deixa ao menos um pino fora da linha');
  assert.ok(eventosFino(spec).length >= 6);
});

test('legenda por frase: fica até o fim da fala mais 0,3 s (mínimo 1,2 s), 54 px numa coluna fixa', () => {
  const fr = frasesDeFala(falado.palavras);
  assert.equal(COLUNA.px, 54);
  for (const [i, f] of fr.entries()) { const prox = fr[i + 1]?.ini ?? Infinity; assert.ok(f.fim >= Math.min(f.ws.at(-1).f + 0.3, prox - 0.02) - 1e-9); assert.ok(f.fim - f.ini >= Math.min(1.2, prox - f.ini - 0.02) - 1e-9); }
});

test('axonometria: prisma tem casco, quatro faixas de sombra e vinco só nas faces que olham para quem vê', () => {
  const C = camera({ az: 45, el: 30, escala: 2, origem: [500, 500] });
  const s = prisma(C, anelRet(-10, -10, 10, 10, 2), 0, 8, { bisel: 0.5 });
  assert.ok(s.casco.length >= 6 && s.vinco.length === 1 && s.contorno.length >= 2);
  assert.ok(s.faces.flat().length > 0);
  assert.equal(casco([[0, 0], [1, 0], [0.5, 0.2], [1, 1], [0, 1]]).length, 4);
});

test('navegador: anatomia e fino desenham um quadro determinístico e o QA passa sem falha', { timeout: 600000 }, async () => {
  for (const c of [CENA_ANAT, CENA_FINO]) {
    const spec = compilar(c, falado);
    const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
    try {
      const p = paginas[0], t = spec.beats[1].de + 0.6;
      const hash = async (x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
      await hash(t); const a = await hash(t); await hash(0.3);
      assert.equal(await hash(t), a, `${c.estilo}: mesmo t, mesmos pixels`);
      assert.equal((await p.evaluate((q) => window.ilu.medir(q), t)).estilo, c.estilo);
    } finally { await fechar(); }
    const r = await checarCena(spec);
    assert.deepEqual(r.falhas, [], `${c.estilo}: QA sem falha`);
  }
});
