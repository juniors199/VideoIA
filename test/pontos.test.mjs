/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compilar, ESTILOS } from '../src/video/plano.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { ESTILOS_NOMES, TIPOS, FORMAS_PONTOS } from '../src/video/catalogo.mjs';
import { eventos as eventosSfx } from '../src/video/sfx.mjs';
import { imagemParaPontos, embutirPontos, usaPontos, MAX_PONTOS } from '../src/video/pontos.mjs';
import { embutirModelos } from '../src/video/modelos3d.mjs';
import { abrir } from '../src/video/render.mjs';
import { ZONA } from '../src/video/engine/zona.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(RAIZ, '.teste-pontos-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const falado = (() => {
  const txt = 'Nikola Tesla imaginava máquinas inteiras. Em 1888 ele patenteou um motor. A corrente vai e volta. Hoje toda tomada repete esse giro. Segue a página.';
  let t = 0.2;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.28 }; t += 0.4; return o; });
  return { palavras, duracao: t + 0.8 };
})();
const cenaPont = () => ({ tema: 'TESLA', estilo: 'pontilhismo', beats: [
  { id: 'a', palavras: [0, 4], elementos: [{ tipo: 'pontos', forma: 'esfera', entra: 0 }] },
  { id: 'b', palavras: [5, 10], elementos: [{ tipo: 'pontos', forma: 'texto', texto: '1888', entra: '1888' }, { tipo: 'peca', forma: 'cubo', entra: 'motor.' }] },
  { id: 'c', palavras: [11, 15], elementos: [{ tipo: 'pontos', forma: 'onda', entra: 'corrente' }] },
  { id: 'd', palavras: [16, 24], elementos: [{ tipo: 'pontos', forma: 'icone', icone: 'lampada', entra: 'tomada' }] },
] });

/** imagem de teste: fundo claro liso com um rosto (elipse) mais escuro no meio e um brilho dentro */
function imagemTeste(arq) {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0xe8e4dc:s=300x400', '-vf', "geq=lum='if(lt(pow((X-150)/90,2)+pow((Y-190)/120,2),1),if(lt(pow((X-150)/40,2)+pow((Y-170)/40,2),1),235,90),228)':cb=128:cr=128", '-frames:v', '1', arq], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return arq;
}

test('pontilhismo: quinto estilo, preto e branco, corte seco, sem antecipar a entrada e com o elemento pontos no catálogo', () => {
  assert.ok(ESTILOS_NOMES.includes('pontilhismo'));
  assert.deepEqual(ESTILOS_NOMES.slice(0, 4), ['padrao', 'editorial', 'minimalista', 'papel'], 'os estilos de antes continuam na mesma ordem');
  assert.ok(TIPOS.includes('pontos'));
  assert.equal(ESTILOS.pontilhismo.marca.fundo, '#050505');
  assert.equal(ESTILOS.pontilhismo.marca.frente, '#EDEBE6');
  const spec = compilar(cenaPont(), falado);
  assert.equal(spec.estilo, 'pontilhismo');
  assert.equal(spec.transicaoPadrao, 'corte');
  assert.equal(spec.marca.fundo, '#050505');
  // no pontilhismo a forma anterior continua: a palavra pedida vale, mesmo longe do início do beat
  const tomada = spec.beats[3].elementos[0];
  assert.ok(Math.abs(tomada.t0 - falado.palavras.find((w) => w.w === 'tomada').t) < 1e-9);
  assert.ok(usaPontos(cenaPont()) && !usaPontos({ beats: [{ elementos: [{ tipo: 'peca' }] }] }));
  // o estilo padrão não mudou
  const padrao = compilar({ ...cenaPont(), estilo: undefined }, falado);
  assert.equal(padrao.transicaoPadrao, 'desfoque');
});

test('pontos: o validador aceita formas próprias e peças do repertório, recusa o resto com sugestão e cobra os campos', () => {
  const base = (els, estilo) => ({ tema: 'X', ...(estilo ? { estilo } : {}), beats: [{ id: 'a', palavras: [0, 3], elementos: els }] });
  assert.deepEqual(validarCena(base([{ tipo: 'pontos', forma: 'esfera' }, { tipo: 'pontos', forma: 'lampada3d' }, { tipo: 'pontos', forma: 'texto', texto: '1888' }], 'pontilhismo'), 10).erros, []);
  const v = validarCena(base([{ tipo: 'pontos', forma: 'retrat' }]), 10);
  assert.match(v.erros.join(' '), /"retrato"/);
  assert.match(validarCena(base([{ tipo: 'pontos', forma: 'retrato' }]), 10).erros.join(' '), /arquivo/);
  assert.match(validarCena(base([{ tipo: 'pontos', forma: 'texto' }]), 10).erros.join(' '), /texto/);
  assert.match(validarCena(base([{ tipo: 'pontos', forma: 'icone', icone: 'lampda' }]), 10).erros.join(' '), /lampada/);
  assert.match(validarCena(base([{ tipo: 'pontos', forma: 'esfera', morph: 5 }]), 10).erros.join(' '), /morph/);
  assert.match(validarCena(base([{ tipo: 'pontos', forma: 'esfera' }, { tipo: 'peca', forma: 'cubo' }]), 10).avisos.join(' '), /mesmo beat/);
  assert.match(validarCena({ ...base([]), estilo: 'pontilismo' }, 10).erros.join(' '), /pontilhismo/);
});

test('som: pontilhismo sai só com a narração (a não ser que a cena peça) e pontos no estilo padrão ganham um brilho leve', () => {
  const spec = compilar(cenaPont(), falado);
  assert.deepEqual(eventosSfx(spec), []);
  assert.ok(eventosSfx({ ...spec, efeitos: { ...spec.efeitos, sfx: true } }).length > 0);
  const padrao = compilar({ ...cenaPont(), estilo: undefined }, falado);
  assert.ok(eventosSfx(padrao).some((e) => e.som === 'shimmer'));
});

test('imagem para pontos: tira o fundo liso, cabe nas partículas, é determinístico e embute na spec', () => {
  const arq = imagemTeste(path.join(tmp, 'rosto.png'));
  const a = imagemParaPontos(arq, { colunas: 60 });
  assert.ok(a.removeuFundo, 'fundo claro e liso sai');
  assert.ok(a.pts.length > 300 && a.pts.length <= MAX_PONTOS, `${a.pts.length} pontos`);
  // nenhum ponto nos cantos (era fundo) e todos dentro de 0..1
  assert.ok(a.pts.every(([x, y, v]) => x >= 0 && x <= 1 && y >= 0 && y <= 1 && v > 0 && v <= 1));
  assert.ok(!a.pts.some(([x, y]) => x < 0.08 && y < 0.08), 'canto superior esquerdo vazio');
  assert.deepEqual(imagemParaPontos(arq, { colunas: 60 }).pts, a.pts, 'mesma foto, mesmos pontos');
  const pouco = imagemParaPontos(arq, { colunas: 200, max: 800 });
  assert.ok(pouco.pts.length <= 800, 'a grade encolhe até caber');
  const spec = { beats: [{ id: 'r', elementos: [{ tipo: 'pontos', forma: 'retrato', arquivo: 'rosto.png', dados: { colunas: 50 } }, { tipo: 'peca', forma: 'cubo' }] }] };
  embutirPontos(spec, tmp);
  assert.ok(spec.beats[0].elementos[0].pts.pts.length > 100);
  assert.equal(spec.beats[0].elementos[1].pts, undefined);
  assert.throws(() => embutirPontos({ beats: [{ id: 'x', elementos: [{ tipo: 'pontos', forma: 'imagem', arquivo: '../fora.png' }] }] }, tmp), /arquivo/);
  // modelos GLB também viram pontos: entram na spec como as peças
  const g = embutirModelos({ beats: [{ elementos: [{ tipo: 'pontos', forma: 'glb-vaca' }] }] });
  assert.ok(g.modelos?.['glb-vaca']);
});

test('script imagem-para-pontos: grava o JSON e a prévia', () => {
  const arq = imagemTeste(path.join(tmp, 'rosto2.png'));
  const r = spawnSync(process.execPath, [path.join(RAIZ, 'scripts/imagem-para-pontos.mjs'), arq, path.join(tmp, 'saida.json'), '--colunas', '50'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const j = JSON.parse(fs.readFileSync(path.join(tmp, 'saida.json'), 'utf8'));
  assert.ok(j.w === 50 && j.h > 0 && j.pts.length > 100);
  assert.ok(fs.statSync(path.join(tmp, 'saida.jpg')).size > 1000);
});

test('navegador: pontilhismo determinístico, formas batem com o catálogo, pontos dentro da tela, legenda própria e 3D escondido', { timeout: 240000 }, async () => {
  const spec = compilar(cenaPont(), falado);
  // gpu: false, como os outros testes de determinismo (na GPU o hash exato do quadro pode variar de uma passada para outra)
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const p = paginas[0];
    assert.deepEqual((await p.evaluate(() => window.ilu.pontos.formas())).sort(), [...FORMAS_PONTOS].sort());
    const chaves = await p.evaluate(() => window.ilu.pontos.chaves());
    assert.equal(chaves.length, 5, 'uma forma por elemento (a peça vira pontos)');
    const hash = async (pg, x) => { await pg.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await pg.screenshot({ type: 'png' })).digest('hex'); };
    await hash(p, chaves[1]); // aquecimento: o primeiro quadro de uma aba recém-aberta pode sair antes do compositor assentar (máquina carregada)
    const a = await hash(p, chaves[1]);
    await hash(p, 0.3); await hash(p, chaves[3]);
    assert.equal(await hash(p, chaves[1]), a, 'mesmo t, mesmos pixels');
    const outra = await novaAba(); await hash(outra, chaves[1]);
    assert.equal(await hash(outra, chaves[1]), a, 'outra aba, mesmos pixels');
    for (const t of chaves.slice(0, 4)) {
      const m = await p.evaluate((q) => window.ilu.medir(q), t);
      assert.equal(m.pecas.length, 0, `t=${t}: a peça 3D não aparece no pontilhismo`);
      assert.equal(m.pontos.length, 1, `t=${t}: a forma em pontos é medida`);
      const c = m.pontos[0];
      if (!c.sangra) assert.ok(c.x0 > ZONA.lados - 8 && c.x1 < 1080 - ZONA.lados + 8, `t=${t}: pontos dentro das margens (${c.x0}..${c.x1})`);
      assert.ok(m.legenda, `t=${t}: legenda visível`);
    }
    const leg = await p.evaluate(() => document.querySelector('#legenda').className);
    assert.match(leg, /pont/);
  } finally { await fechar(); }
});

test('navegador: no estilo padrão, os pontos entram, saem e não deixam nada quando não há elemento pontos', { timeout: 240000 }, async () => {
  const cena = { tema: 'X', beats: [
    { id: 'a', palavras: [0, 4], elementos: [{ tipo: 'peca', forma: 'cubo', entra: 0.1 }] },
    { id: 'b', palavras: [5, 10], elementos: [{ tipo: 'pontos', forma: 'esfera', papel: 'destaque', entra: 0.1 }] },
    { id: 'c', palavras: [11, 24], elementos: [{ tipo: 'peca', forma: 'cubo', entra: 0.1 }] },
  ] };
  const spec = compilar(cena, falado);
  const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1 });
  try {
    const p = paginas[0];
    const b = spec.beats[1];
    const meio = await p.evaluate((q) => window.ilu.medir(q), (b.de + b.ate) / 2 + 0.4);
    assert.equal(meio.pontos.length, 1, 'beat de pontos: a forma aparece');
    assert.ok(meio.pontos[0].y1 < ZONA.legenda[0], 'acima da faixa da legenda');
    const depois = await p.evaluate((q) => window.ilu.medir(q), spec.beats[2].de + 1.2);
    assert.equal(depois.pontos.length, 0, 'beat seguinte sem pontos: eles saíram');
    assert.equal(depois.pecas.length, 1);
  } finally { await fechar(); }
  // sem pontos na cena, o sistema nem é criado
  const sem = compilar({ tema: 'X', beats: [{ id: 'a', palavras: [0, 24], elementos: [{ tipo: 'peca', forma: 'cubo' }] }] }, falado);
  const s2 = await abrir(sem, { escala: 0.25, workers: 1 });
  try {
    assert.deepEqual(await s2.paginas[0].evaluate(() => window.ilu.pontos.chaves()), []);
    const m = await s2.paginas[0].evaluate(() => window.ilu.medir(2));
    assert.equal(m.pontos, undefined, 'medir igual ao de antes');
  } finally { await s2.fechar(); }
});

test('retrato em meio-tom (padrão): grade regular sem tremor, tom com mediana controlada e modo pontilhado opcional', () => {
  const arq = imagemTeste(path.join(tmp, 'rosto3.png'));
  const g = imagemParaPontos(arq, { colunas: 60, recorte: 'cor' });
  assert.equal(g.modo, 'grade');
  const xs = [...new Set(g.pts.map((p) => p[0]))];
  assert.ok(xs.every((x) => Math.abs(((x * g.w - 0.5) % 1)) < 0.01 || Math.abs(((x * g.w - 0.5) % 1) - 1) < 0.01), 'pontos no centro das células (sem tremor)');
  assert.ok(g.gama >= 1.0 && g.gama <= 1.8, `gama ${g.gama}`);
  const p = imagemParaPontos(arq, { modo: 'pontilhado', pontos: 3000, iteracoes: 4, recorte: 'cor' });
  assert.equal(p.modo, 'pontilhado');
  assert.ok(p.esp > 0 && p.pts.length > 2000 && p.pts.length <= 3000);
});

test('validador: estados, composição, caminho e câmera do elemento', () => {
  const base = (el) => ({ tema: 'X', estilo: 'pontilhismo', beats: [{ id: 'a', palavras: [0, 3], elementos: [el] }] });
  assert.deepEqual(validarCena(base({ tipo: 'pontos', forma: 'motor', estados: [{ em: 'motor', estado: 'explode', camera: { yaw: 1, dist: 1800 } }, { em: 2, estado: 'monta' }] }), 10).erros, []);
  assert.match(validarCena(base({ tipo: 'pontos', forma: 'motor', estados: [{ em: 'x', estado: 'explodir' }] }), 10).erros.join(' '), /explodir/);
  assert.match(validarCena(base({ tipo: 'pontos', forma: 'motor', camera: { dist: 9000 } }), 10).erros.join(' '), /dist/);
  assert.deepEqual(validarCena(base({ tipo: 'pontos', compor: [{ forma: 'cabeca', opac: 0.4 }, { forma: 'motor', estado: 'pequeno' }] }), 10).erros, []);
  assert.match(validarCena(base({ tipo: 'pontos', compor: [{ forma: 'cabesa' }] }), 10).erros.join(' '), /cabeca/);
  assert.match(validarCena(base({ tipo: 'pontos', forma: 'caminho' }), 10).erros.join(' '), /caminho/);
  assert.deepEqual(validarCena(base({ tipo: 'pontos', forma: 'caminho', dados: { d: ['M10 10 L90 90'] } }), 10).erros, []);
});

test('navegador: motor por partes com estados, composição, caminho, SVG e forma de pontos do projeto', { timeout: 240000 }, async () => {
  const codigo = "export const pontos = { 'espiral-dupla': (kit, d) => ({ n: 3000, fn: (i, t, lt, o) => { if (i >= 3000) return false; const u = i / 3000, a = u * 12 * kit.TAU; o[0] = Math.cos(a) * 200 * u; o[1] = Math.sin(a) * 200 * u; o[2] = 0; o[3] = 1.5; o[4] = 0.9; return true; } }) };";
  const els = (b) => b;
  const cena = { tema: 'X', estilo: 'pontilhismo', beats: [
    { id: 'a', palavras: [0, 4], elementos: els([{ tipo: 'pontos', forma: 'motor', entra: 0, estados: [{ em: 'imaginava', estado: 'explode', camera: { yaw: 1.0, pitch: 0.25, dist: 1850 } }] }]) },
    { id: 'b', palavras: [5, 10], elementos: [{ tipo: 'pontos', compor: [{ forma: 'cabeca', opac: 0.45 }, { forma: 'motor', estado: 'pequeno' }], entra: 0.1 }] },
    { id: 'c', palavras: [11, 15], elementos: [{ tipo: 'pontos', forma: 'caminho', dados: { d: ['M10 50 Q50 0 90 50 T170 50'], viewBox: [180, 100] }, entra: 0.1 }, { tipo: 'pontos', forma: 'svg', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#fff"/></svg>', entra: 'vai' }] },
    { id: 'd', palavras: [16, 24], elementos: [{ tipo: 'pontos', forma: 'espiral-dupla', entra: 0.1 }] },
  ] };
  const spec = compilar(cena, falado);
  spec.locais = { codigo, hash: 'teste-espiral' };
  const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1 });
  try {
    const p = paginas[0];
    const chaves = await p.evaluate(() => window.ilu.pontos.chaves());
    assert.equal(chaves.length, 6, 'motor + estado, composição, caminho, svg e a forma do projeto');
    // o motor explodido é mais largo que o montado
    const larg = async (t) => { const m = await p.evaluate((q) => window.ilu.medir(q), t); return m.pontos[0] ? m.pontos[0].x1 - m.pontos[0].x0 : 0; };
    const explodido = await larg(chaves[1]);
    assert.ok(explodido > 300, `motor explodido medido (${explodido} px)`);
    for (const t of chaves.slice(2)) { const m = await p.evaluate((q) => window.ilu.medir(q), t); assert.ok(m.pontos.length === 1 && m.pontos[0].n > 200, `t=${t}: forma desenhada (${m.pontos[0]?.n})`); }
  } finally { await fechar(); }
});

test('respiros: pausa só no silêncio real, tempos deslocados e original guardado', async () => {
  const { planejarRespiros, aplicarRespiros, deslocar } = await import('../scripts/respiros.mjs');
  // três "palavras" (tons) separadas por silêncio; a do meio termina com vírgula, a primeira com ponto
  const pasta = path.join(tmp, 'voz'); fs.mkdirSync(pasta, { recursive: true });
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', "aevalsrc='if(lt(mod(t,1),0.6),0.3*sin(2*PI*220*t),0)':s=44100:d=3", '-ac', '1', path.join(pasta, 'narracao.mp3')], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const pal = { hash: 'x', duracao: 3, palavras: [{ w: 'Um.', t: 0.02, f: 0.58 }, { w: 'dois,', t: 1.02, f: 1.58 }, { w: 'três', t: 2.02, f: 2.58 }] };
  fs.writeFileSync(path.join(pasta, 'palavras.json'), JSON.stringify(pal));
  const sim = aplicarRespiros(pasta, { simular: true });
  assert.equal(sim.cortes.length, 2, 'ponto e vírgula');
  assert.ok(sim.cortes[0][0] > 0.6 && sim.cortes[0][0] < 1.0 && sim.cortes[0][1] === 0.45);
  const feito = aplicarRespiros(pasta);
  const novo = JSON.parse(fs.readFileSync(path.join(pasta, 'palavras.json'), 'utf8'));
  assert.ok(Math.abs(novo.palavras[2].t - (2.02 + 0.45 + 0.2)) < 0.01, 'a terceira palavra anda o total das pausas');
  assert.equal(novo.hash, 'x', 'o hash da fala continua (o pipeline não refaz a voz)');
  assert.ok(fs.existsSync(path.join(pasta, 'narracao-original.mp3')));
  assert.ok(aplicarRespiros(pasta).ja, 'não aplica duas vezes');
  assert.equal(deslocar(1.5, feito.cortes), 1.5 + 0.45);
  void planejarRespiros;
});

test('validador: rótulos 3D, prompt e Terra', () => {
  const base = (el) => ({ tema: 'X', estilo: 'pontilhismo', beats: [{ id: 'a', palavras: [0, 3], elementos: [el] }] });
  assert.deepEqual(validarCena(base({ tipo: 'pontos', forma: 'motor', rotulos: [{ texto: 'ESTATOR', ancora: [0, -345, -120], dx: -150, dy: -90 }] }), 10).erros, []);
  assert.match(validarCena(base({ tipo: 'pontos', forma: 'motor', rotulos: [{ texto: 'ESTATOR', ancora: [0, 1] }] }), 10).erros.join(' '), /ancora/);
  assert.match(validarCena(base({ tipo: 'pontos', forma: 'prompt' }), 10).erros.join(' '), /prompt/);
  assert.deepEqual(validarCena(base({ tipo: 'pontos', forma: 'terra', arquivo: 'assets/terra.jpg' }), 10).erros, []);
});
