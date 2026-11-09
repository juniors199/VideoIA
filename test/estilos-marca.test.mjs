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
import { ESTILOS_MARCA, ESTILOS_MOTION, TIPOS } from '../src/video/catalogo.mjs';
import { gerar as gerarSfx } from '../src/video/sfx.mjs';
import { eventosEstilos } from '../src/video/sfx-estilos.mjs';
import { checarCena, sombraNosCortes } from '../src/video/qa.mjs';
import { spawnSync } from 'node:child_process';
import { abrir } from '../src/video/render.mjs';
import { embutirModelos } from '../src/video/modelos3d.mjs';
import { validarModelo } from '../src/modelos/validar.mjs';
import { partesLetreiro, tomCores } from '../src/video/engine/estilo-letreiro.js';
import { partesInterface } from '../src/video/engine/estilo-interface.js';
import { partesColagem } from '../src/video/engine/estilo-colagem.js';
import { palavrasComTempo, compor, parcial, COLUNA } from '../src/video/engine/estilos-kit.js';

/**
 * Os três estilos da marca (letreiro, interface, colagem), portados das auditorias do pacote BRABO e do estúdio
 * PRODUÇÃO DE VÍDEOS: catálogo, validação, linha do tempo presa à fala, regras do dono (coluna fixa, texto de apoio de
 * 54 px, nada vazio no corte, quadro 0 sem capa), som, um quadro de cada no navegador e o QA da cena.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-marca-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const falado = (() => {
  const txt = 'Para a botânica o morango não é fruto. A parte vermelha vem da base da flor. Os pontinhos são frutos chamados aquênios. São uns duzentos por morango. Segue a página.';
  let t = 0.2;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += 0.42 + (/[.]$/.test(w) ? 0.3 : 0); return o; });
  return { palavras, duracao: t + 0.8 };
})();
const CENAS = {
  letreiro: { tema: 'MORANGO', estilo: 'letreiro', beats: [
    // fator 0,85: o que a correção automática do QA grava quando a câmera aproxima a peça grande (protagonista até y 1440)
    { id: 'a', palavras: [0, 7], fator: 0.85, titulo: { texto: 'O morango *não é* fruto' }, elementos: [{ tipo: 'peca', forma: 'glb-morango', entra: 0 }] },
    { id: 'b', palavras: [8, 15], tom: 'claro', camera: { plano: 'aberto', mov: 'nenhum' }, titulo: { texto: 'Vem da *base* da flor' }, elementos: [{ tipo: 'peca', forma: 'cubo', entra: 'parte' }] },
    // beat c (área segura, 05/11/2026): a legenda do kit subiu para dentro da área (centro ~y 1364) e cruzava o morango grande,
    // que desce até y ~1440 antes de o risco entrar; fator 0,85, como no beat a
    { id: 'c', palavras: [16, 21], fator: 0.85, elementos: [{ tipo: 'letreiro', forma: 'risco', texto: 'sementes', troca: 'frutos', entra: 'pontinhos', em: 'frutos' }, { tipo: 'peca', forma: 'glb-morango', entra: 0 }] },
    { id: 'd', palavras: [22, 26], som: 'virada', elementos: [{ tipo: 'contador', valor: 200, prefixo: '~', legenda: 'frutos por morango', entra: 'São' }] },
    { id: 'e', palavras: [27, 29], titulo: { texto: 'Segue a *página*' }, elementos: [{ tipo: 'letreiro', forma: 'lista', itens: [{ texto: 'Segue', em: 'Segue' }, { texto: 'Página', em: 'página.' }] }, { tipo: 'letreiro', forma: 'desliga' }] } ] },
  interface: { tema: 'ABA', estilo: 'interface', beats: [
    { id: 'a', palavras: [0, 7], titulo: { texto: 'O morango *é* fruto?' }, elementos: [{ tipo: 'interface', forma: 'busca', texto: 'o morango é fruto?', clique: 'fruto.', resposta: 'Para a botânica, não' }] },
    { id: 'b', palavras: [8, 15], titulo: { texto: 'A *base* da flor' }, elementos: [{ tipo: 'interface', forma: 'lista', itens: [{ texto: 'Parte vermelha', em: 'vermelha' }, { texto: 'Base da flor', em: 'base' }] }] },
    { id: 'c', palavras: [16, 21], tom: 'claro', titulo: { texto: 'Pontinhos: *frutos*' }, elementos: [{ tipo: 'interface', forma: 'escolha', opcoes: ['Sementes', 'Frutos'], certa: 1, em: 'frutos' }] },
    { id: 'd', palavras: [22, 29], titulo: { texto: 'Uns *duzentos*' }, elementos: [{ tipo: 'interface', forma: 'notificacao', itens: [{ titulo: 'Morango', texto: 'uns duzentos frutos', em: 'duzentos' }] }] } ] },
  colagem: { tema: 'MORANGO', estilo: 'colagem', camera: { auto: false }, beats: [
    { id: 'a', palavras: [0, 7], fator: 0.85, titulo: { texto: 'O morango *não é* fruto' }, elementos: [{ tipo: 'peca', forma: 'glb-morango', entra: 0 }] },
    { id: 'b', palavras: [8, 15], fator: 0.85, camera: { plano: 'aberto', mov: 'nenhum' }, titulo: { texto: 'Vem da *base* da flor' }, elementos: [{ tipo: 'peca', forma: 'moeda', entra: 0, escala: 0.6 }, { tipo: 'colagem', forma: 'carimbo', texto: 'base', entra: 'base', pos: [0.85, 0.08] }] },
    { id: 'c', palavras: [16, 21], titulo: { texto: 'Os pontinhos são *frutos*' }, elementos: [{ tipo: 'colagem', forma: 'nota', texto: 'aquênios', entra: 0.1 }] },
    { id: 'd', palavras: [22, 29], titulo: { texto: 'Uns *duzentos* frutos' }, elementos: [{ tipo: 'peca', forma: 'glb-morango', entra: 0 }] } ] },
};

test('estilos da marca: catálogo, tipos e marca da página (não a paleta de um pacote)', () => {
  assert.deepEqual(ESTILOS_MARCA, ['letreiro', 'interface', 'colagem']);
  for (const n of ESTILOS_MARCA) { assert.ok(ESTILOS_MOTION.includes(n)); assert.ok(TIPOS.includes(n)); assert.deepEqual(ESTILOS[n].marca, {}, `${n} usa a marca da página`); }
  const c = tomCores('claro', { fundo: '#0E0E13', destaque: '#FF7A2F' });
  assert.equal(c.marca, '#FF7A2F', 'no fundo claro o destaque vira marca-texto');
});

test('estilos da marca: o validador aceita as cenas e recusa forma, campos e tom inválidos', () => {
  for (const [n, c] of Object.entries(CENAS)) assert.deepEqual(validarCena(c, falado.palavras.length).erros, [], `cena ${n}`);
  const base = (els, extra = {}) => ({ tema: 'X', beats: [{ id: 'a', palavras: [0, 3], elementos: els, ...extra }] });
  assert.match(validarCena(base([{ tipo: 'interface', forma: 'buscaa', texto: 'x' }]), 10).erros.join(' '), /busca/);
  assert.match(validarCena(base([{ tipo: 'interface', forma: 'grafico' }]), 10).erros.join(' '), /valores/);
  assert.match(validarCena(base([{ tipo: 'letreiro', forma: 'lista' }]), 10).erros.join(' '), /itens/);
  assert.match(validarCena(base([{ tipo: 'colagem', forma: 'carimbo' }]), 10).erros.join(' '), /texto/);
  assert.match(validarCena(base([], { tom: 'roxo' }), 10).erros.join(' '), /tom/);
  assert.match(validarCena({ ...base([]), estilo: 'letreiro' }, 10).avisos.join(' '), /sem objeto/, 'letreiro sem objeto real avisa');
});

test('estilos da marca: tempo preso à fala, coluna fixa e protagonista no corte', () => {
  const sl = compilar(CENAS.letreiro, falado), pl = partesLetreiro(sl);
  assert.equal(pl.length, 5);
  assert.equal(pl[3].tom, 'destaque', 'a virada vira o fundo de destaque');
  assert.equal(pl[1].tom, 'claro');
  const fala = sl.palavras, f0 = pl[0].frases[0];
  const morango = f0.ws.find((w) => w.w === 'morango'); assert.equal(morango.t, fala.find((w) => w.w === 'morango').t, 'a palavra entra quando é dita');
  assert.ok(f0.ws[0].t <= sl.beats[0].de + 0.05, 'a primeira palavra já está na tela no corte');
  const R = pl[2].riscos[0]; assert.equal(R.tr, fala.find((w) => w.w === 'frutos').t, 'o risco acontece na palavra');
  assert.ok(pl[4].desliga >= sl.beats[4].ate - 0.6, 'o desligar fica no fim');
  // o protagonista de cada beat entra no corte (nenhum quadro vazio) e no beat 0 já está no quadro 0
  assert.ok(sl.beats[0].elementos[0].t0 < 0, 'quadro 0 já tem a peça');
  assert.ok(Math.abs(sl.beats[1].elementos[0].t0 - sl.beats[1].de) < 0.05, 'a peça do beat b entra no corte');
  assert.ok(COLUNA.x >= 72 && COLUNA.base > 330 && COLUNA.base < 590, 'coluna fixa dentro da faixa do título');
  // número longo na fala aparece ao longo da pronúncia; palavra comum aparece inteira
  assert.equal(parcial({ w: '1831', t: 0, f: 2 }, 1), '18'); assert.equal(parcial({ w: 'Constituição', t: 0, f: 2 }, 1), 'Constituição');
  const si = compilar(CENAS.interface, falado), pi = partesInterface(si);
  const busca = pi.find((p) => p.forma === 'busca');
  assert.equal(busca.tClique, fala.find((w) => w.w === 'fruto.').t, 'o clique cai na palavra');
  assert.ok(busca.tDig[1] <= busca.tClique - 0.29, 'a digitação termina antes do clique');
  assert.ok(busca.resposta.every((w) => w.t >= busca.tClique), 'a resposta nasce do clique');
  const pc = partesColagem(compilar(CENAS.colagem, falado));
  assert.deepEqual(pc.map((p) => p.tipo).sort(), ['carimbo', 'nota']);
});

test('estilos da marca: quebra equilibrada com posições finais (a frase não pula)', () => {
  const g = { font: '', letterSpacing: '0px', measureText: (s) => ({ width: String(s).length * (parseFloat(g.font.split(' ')[1]) || 50) * 0.55 }) };
  const ws = palavrasComTempo({ palavras: [] }, { de: 0, ate: 5 }, 'Para a botânica, o morango *não é* fruto', 0);
  const L = compor(g, ws, { fonte: (px) => `800 ${px}px IluD`, tamanhos: [96, 88, 80], largMax: 896, maxLinhas: 2 });
  assert.ok(L.linhas.length <= 2 && L.linhas.every((l) => l.larg <= 896));
  assert.equal(L.linhas.flatMap((l) => l.ws).length, ws.length, 'todas as palavras têm posição');
});

test('estilos da marca: modelos de vídeo passam no validador', () => {
  for (const id of ESTILOS_MARCA) {
    const m = JSON.parse(fs.readFileSync(path.join(RAIZ, 'modelos', `${id}.json`), 'utf8'));
    assert.equal(m.visual.estilo, id);
    assert.deepEqual(validarModelo(m, { nomeArquivo: id }).erros, [], `modelos/${id}.json`);
  }
});

test('estilos da marca: som por evento, audível e sem estourar', () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const spec = compilar(c, falado), ev = eventosEstilos(spec)[n];
    assert.ok(ev && ev.length >= 4, `${n}: eventos de som`);
    const arq = path.join(tmp, `${n}.wav`); gerarSfx(spec, arq);
    const b = fs.readFileSync(arq); let pico = 0; for (let i = 44; i < b.length; i += 2) pico = Math.max(pico, Math.abs(b.readInt16LE(i)));
    assert.ok(pico > 2000 && pico < 32767, `${n}: pico ${pico}`);
  }
  assert.ok(eventosEstilos(compilar(CENAS.interface, falado)).interface.some((e) => e.som === 'click'), 'interface: clique no clique');
});

test('navegador: um quadro de cada estilo da marca, determinístico e com a camada ativa', { timeout: 300000 }, async () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const spec = compilar(c, falado);
    const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
    try {
      const p = paginas[0], t = spec.beats[1].de + 0.9;
      const hash = async (x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
      await hash(t); const a = await hash(t); await hash(0.4);
      assert.equal(await hash(t), a, `${n}: mesmo t, mesmos pixels`);
      const m = await p.evaluate((q) => window.ilu.medir(q), t);
      assert.equal(m.estilo, n);
      assert.ok(m.titulos.some((x) => x.estilo) || (m.textos || []).length || m.legenda, `${n}: texto medido pelo QA`);
    } finally { await fechar(); }
  }
});

test('QA: as cenas de exemplo dos estilos da marca passam sem falha', { timeout: 600000 }, async () => {
  for (const [n, c] of Object.entries(CENAS)) {
    const q = await checarCena(compilar(c, falado));
    assert.deepEqual(q.falhas.map((f) => `${f.beat} ${f.t}: ${f.msg}`), [], `${n} sem falhas`);
  }
});

// ───────────── melhorias do QA que vieram com os estilos da marca ─────────────
test('QA do arquivo: sem peça 3D dos dois lados do corte não há chão, então a queda nas laterais não é sombra', () => {
  const f = path.join(tmp, 'lateral-cai.mp4');
  const geq = "geq=lum='if(between(Y,H*0.60,H*0.66)*(lt(X,W*0.2)+gt(X,W*0.8))*between(T,1.6,1.85),14,30)':cb=128:cr=128";
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=black:s=540x960:d=3:r=30,${geq}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '12', f]);
  assert.equal(r.status, 0, String(r.stderr));
  const beats = (els) => [{ id: 'a', de: 0, ate: 1.5, elementos: els }, { id: 'b', de: 1.5, ate: 3, elementos: els }];
  assert.deepEqual(sombraNosCortes(f, { duracao: 3, palavras: [], beats: beats([{ tipo: 'imagem' }]) }), [], 'foto ou painel entrando: sem chão, não reprova');
  assert.equal(sombraNosCortes(f, { duracao: 3, palavras: [], beats: beats([{ tipo: 'peca' }]) }).length, 1, 'com peça 3D continua reprovando');
  assert.equal(sombraNosCortes(f, { duracao: 3, palavras: [], beats: [{ id: 'a', de: 0, ate: 1.5 }, { id: 'b', de: 1.5, ate: 3 }] }).length, 1, 'beat sem a lista de elementos: confere como antes');
});

test('QA: aviso de composição quando o conteúdo fica pequeno ou no alto por mais de 2 s', { timeout: 300000 }, async () => {
  const alto = compilar({ tema: 'X', estilo: 'minimalista', beats: [{ id: 'a', palavras: [0, 27], elementos: [{ tipo: 'contador', valor: 200, entra: 0, pos: [0.5, 0.05] }] }] }, falado);
  const q = await checarCena(alto);
  assert.ok(q.avisos.some((a) => a.tipo === 'composicao'), 'número sozinho no alto da tela: avisa');
  // os projetos de exemplo (protagonista no centro, 55 a 70% da altura útil) passam sem o aviso
  for (const n of ['letreiro', 'interface']) {
    const pasta = path.join(RAIZ, 'projetos', `teste-estilo-${n}`);
    if (!fs.existsSync(path.join(pasta, 'cena.json'))) continue;
    const ler = (f) => JSON.parse(fs.readFileSync(path.join(pasta, f), 'utf8'));
    const spec = compilar(ler('cena.json'), ler('palavras.json')); embutirModelos(spec, pasta);
    assert.ok(!(await checarCena(spec)).avisos.some((a) => a.tipo === 'composicao'), `teste-estilo-${n}: sem aviso de composição`);
  }
});

test('QA: ILU_QA_DETALHE lista cada falha de cada rodada do QA da cena', (t) => {
  const src = fs.readFileSync(path.join(RAIZ, 'src/video/video.mjs'), 'utf8');
  // no pacote o motor vai minificado (scripts/proteger.mjs): o texto-fonte que este teste procura não existe lá
  if (/^\/\* Ilustrando Studio .*Pacote /.test(src)) return t.skip('motor minificado (pacote do comprador)');
  assert.match(src, /if \(process\.env\.ILU_QA_DETALHE\) qa\.falhas\.forEach\(\(f\) => log\(/);
  const i = src.indexOf('process.env.ILU_QA_DETALHE'), laco = src.lastIndexOf('for (let i = 0; i < 6; i++)', i);
  assert.ok(laco > 0 && i - laco < 800, 'dentro do laço das rodadas do QA');
});

// ───────────── gramática de transição dos pacotes do Clube do Motion (estilos-kit.js) ─────────────
import { entradaDesfoque, respiroCor, reboteUnico, molaF, chegada, partida } from '../src/video/engine/estilos-kit.js';
test('kit: entrada pelo desfoque é monotônica (nítida no fim, sem rebote) e a chegada é longa', () => {
  let ant = entradaDesfoque(0, 0);
  for (let t = 0.01; t <= 0.4; t += 0.01) { const e = entradaDesfoque(t, 0); assert.ok(e.k >= ant.k - 1e-9 && e.desfoque <= ant.desfoque + 1e-9 && e.s <= 1 + 1e-9, `t=${t}`); ant = e; }
  assert.ok(entradaDesfoque(0.26, 0).desfoque < 0.01 && entradaDesfoque(0.03, 0).desfoque < 24 * 0.7, 'o borrão cai rápido e a cauda é longa');
  assert.ok(chegada(0.2) > 0.5 && partida(0.2) < 0.05, 'chegada (5/90) e partida (90) são assimétricas');
});
test('kit: respiro de cor entra rápido, segura e sai devagar; rebote único tem um só pico', () => {
  assert.equal(respiroCor(0.8, 1), 0); assert.equal(respiroCor(1, 1), 1); assert.equal(respiroCor(1.6, 1), 0);
  assert.ok(respiroCor(0.94, 1) > 0.4 && respiroCor(1.2, 1) > respiroCor(1.3, 1), 'subida em ~4 quadros, descida desacelerando');
  const v = Array.from({ length: 101 }, (_, i) => reboteUnico(i / 100)); const max = Math.max(...v), i = v.indexOf(max);
  assert.ok(Math.abs(max - 1.044) < 1e-3 && v.slice(0, i).every((x, k) => k === 0 || x >= v[k - 1] - 1e-9) && v.slice(i).every((x, k, a) => k === 0 || x <= a[k - 1] + 1e-9), 'sobe até 1,044 e assenta sem segundo rebote');
  assert.ok(Math.abs(v[100] - 1) < 1e-9);
  for (let t = 0.02; t < 1; t += 0.02) assert.ok(molaF(t, 1, 12) >= molaF(t - 0.02, 1, 12) - 1e-9, 'mola criticamente amortecida não passa do alvo');
});
