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
import { eventosEstilos } from '../src/video/sfx-estilos.mjs';
import { gerar as gerarSfx } from '../src/video/sfx.mjs';
import { autoPlano } from '../src/video/autoplano.mjs';
import { validarModelo } from '../src/modelos/validar.mjs';
import { planoDoModelo } from '../src/modelos/carregar.mjs';
import { CLIMAS_AUTO, escolherClima, resolverTrilha } from '../src/video/trilhas.mjs';
import { checarCena, faixaSemOverlay, bordaClara, cameraFluida } from '../src/video/qa.mjs';
import { spawnSync } from 'node:child_process';
import { abrir } from '../src/video/render.mjs';
import { FORMAS_ANTIGUIDADE, TONS_ANTIGUIDADE, TRANSICOES_ANTIGUIDADE, partesAntiguidade, problemasAntiguidade, unidade, trajetoMapa } from '../src/video/engine/estilo-antiguidade.js';

/**
 * Estilo "antiguidade" (História e antiguidades, docs/estilo-antiguidade.md): catálogo, validação, plano (base, destaques,
 * transições que cruzam, tom), som por evento, modelos, clima de trilha, um quadro no navegador e o QA da cena.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-antiguidade-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const falado = (() => {
  const txt = 'Em trezentos e quarenta e três antes de Cristo, Filipe chamou Aristóteles. Alexandre tinha treze anos. As aulas aconteciam em Mieza. Ao meu pai devo a vida; ao meu mestre, viver bem. Segue a página.';
  let t = 0.2;
  const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += 0.42 + (/[.]$/.test(w) ? 0.3 : 0); return o; });
  return { palavras, duracao: t + 0.8 };
})();
const A = (forma, extra = {}) => ({ tipo: 'antiguidade', forma, ...extra });
const CENA = { tema: 'ARISTÓTELES', estilo: 'antiguidade', tom: 'ouro', beats: [
  { id: 'ano', palavras: [0, 10], elementos: [A('quadro', { arquivo: 'assets/escola.jpg' }), A('data', { texto: '343 a.C.', regua: true, ano: -343, entra: 'trezentos' })] },
  { id: 'nome', palavras: [11, 15], elementos: [A('nome', { texto: 'Alexandre', entra: 'Alexandre' })] },
  { id: 'capitulo', palavras: [16, 19], transicao: 'rasgo', elementos: [A('capitulo', { numero: 2, titulo: 'A escola|de Mieza' })] },
  { id: 'citacao', palavras: [20, 29], elementos: [A('citacao', { texto: 'Ao meu pai devo a vida; ao meu mestre, viver bem.', autor: 'Alexandre, segundo Plutarco' })] },
  { id: 'fim', palavras: [30, 32], elementos: [A('dado', { titulo: 'Aluno', valor: 13, sufixo: ' anos', barra: 0.406, texto: 'de uma vida de 32 anos' }), A('rotulo', { texto: 'Segue a página', entra: 'Segue' })] } ] };

test('antiguidade: catálogo, tipo de elemento, as 10 formas, 3 tons e 4 transições', () => {
  assert.ok(ESTILOS_NOMES.includes('antiguidade') && ESTILOS_MOTION.includes('antiguidade') && TIPOS.includes('antiguidade'));
  assert.ok(ESTILOS.antiguidade, 'acabamento no plano');
  assert.deepEqual(FORMAS_ANTIGUIDADE, ['quadro', 'nome', 'nome-atras', 'data', 'dado', 'mapa', 'pilha', 'capitulo', 'citacao', 'rotulo', 'aberto']);
  assert.deepEqual(TONS_ANTIGUIDADE, ['ouro', 'vinho', 'escuro']);
  assert.deepEqual(TRANSICOES_ANTIGUIDADE, ['dissolve', 'rasgo', 'luz', 'desfoque', 'tinta', 'corte']);
});

test('antiguidade: o validador aceita a cena e recusa forma, tom, transição, campos e elemento fora do estilo, com sugestão', () => {
  assert.deepEqual(validarCena(CENA, falado.palavras.length).erros, []);
  const base = (els, extra = {}, cena = {}) => ({ tema: 'X', estilo: 'antiguidade', ...cena, beats: [{ id: 'a', palavras: [0, 3], elementos: els, ...extra }] });
  assert.match(validarCena(base([A('quadrro', { arquivo: 'assets/a.jpg' })]), 10).erros.join(' '), /quadro/);
  assert.match(validarCena(base([A('quadro')]), 10).erros.join(' '), /arquivo/);
  assert.match(validarCena(base([A('nome-atras', { texto: 'Platão' })]), 10).erros.join(' '), /arquivo/);
  assert.match(validarCena(base([A('data', { texto: '343 a.C.', regua: true })]), 10).erros.join(' '), /ano/);
  assert.match(validarCena(base([A('dado', { titulo: 'Ano 300' })]), 10).erros.join(' '), /valor/);
  assert.match(validarCena(base([A('mapa', { arquivo: 'assets/m.jpg', rota: [[0.1, 0.2]] })]), 10).erros.join(' '), /rota/);
  assert.match(validarCena(base([A('rotulo')]), 10).erros.join(' '), /texto/);
  assert.match(validarCena(base([], {}, { tom: 'sepia' }), 10).erros.join(' '), /ouro, vinho, escuro/);
  assert.match(validarCena(base([], { transicao: 'varredura' }), 10).erros.join(' '), /dissolve/);
  assert.match(validarCena({ tema: 'X', beats: [{ id: 'a', palavras: [0, 3], elementos: [A('nome', { texto: 'X' })] }] }, 10).erros.join(' '), /estilo antiguidade/);
  // avisos: dois destaques na mesma cena, nome comprido, cena sem imagem, a mesma transição 3 vezes seguidas
  const av = validarCena(base([A('nome', { texto: 'Alexandre' }), A('data', { texto: '343 a.C.' })]), 10).avisos.join(' ');
  assert.match(av, /no máximo um efeito de destaque/);
  assert.match(av, /sem imagem/);
  assert.match(problemasAntiguidade(A('nome', { texto: 'Constantinopolitano' })).avisos.join(' '), /13 letras/);
  const tres = { tema: 'X', estilo: 'antiguidade', beats: [0, 1, 2, 3].map((i) => ({ id: `b${i}`, palavras: [i, i], transicao: 'rasgo', elementos: [A('quadro', { arquivo: 'assets/a.jpg' })] })) };
  assert.match(validarCena(tres, 10).avisos.join(' '), /três vezes seguidas/);
  assert.equal(problemasAntiguidade(A('nome', { texto: 'Hércules', atras: true })).erros.length, 1, 'nome com atras vira nome-atras (pede o busto)');
});

test('antiguidade: plano com base, destaques, título, transição de entrada (ciclo do tom) e tom na spec', () => {
  const spec = compilar(CENA, falado);
  assert.equal(spec.estilo, 'antiguidade'); assert.equal(spec.tom, 'ouro');
  const P = partesAntiguidade(spec);
  assert.equal(P.length, 5);
  assert.equal(P[0].base.forma, 'quadro'); assert.deepEqual(P[0].sobre.map((s) => s.forma), ['data']);
  assert.equal(P[1].base, null, 'nome sem imagem: fundo liso');
  assert.equal(P[2].transicao, 'rasgo', 'a transição da cena vence');
  assert.equal(P[3].base.forma, 'citacao'); assert.ok(P[3].semLegenda, 'a citação não repete a legenda');
  assert.equal(P[3].citacao.ws.filter((w) => !w.quebra).length, 11);
  for (const p of P) assert.ok(TRANSICOES_ANTIGUIDADE.includes(p.transicao) && p.D >= 0 && p.D <= 0.8 && (p.transicao === 'corte') === (p.D === 0), `${p.b.id}: transição curta (${p.transicao}, ${p.D} s)`);
  // o ciclo automático nunca repete a mesma transição três vezes seguidas, em nenhum tom
  for (const tom of TONS_ANTIGUIDADE) {
    const c = { ...CENA, tom, beats: CENA.beats.map(({ transicao, ...b }) => b) };
    const tr = partesAntiguidade(compilar(c, falado)).slice(1).map((p) => p.transicao);
    for (let i = 2; i < tr.length; i++) assert.ok(!(tr[i] === tr[i - 1] && tr[i] === tr[i - 2]), `${tom}: ${tr.join(',')}`);
  }
  assert.ok(partesAntiguidade(compilar({ ...CENA, tom: 'vinho', beats: CENA.beats.map(({ transicao, ...b }) => b) }, falado)).some((p) => p.transicao === 'rasgo'), 'o vinho usa o papel rasgado');
  assert.ok(partesAntiguidade(compilar({ ...CENA, tom: 'escuro', beats: CENA.beats.map(({ transicao, ...b }) => b) }, falado)).some((p) => p.transicao === 'luz'), 'o escuro usa o vazamento de luz');
  // o último beat vai até o fim do vídeo (sem tela vazia no fim) e a data entra na palavra
  assert.ok(spec.beats.at(-1).ate >= falado.duracao - 1e-6);
  assert.equal(P[0].sobre[0].t0, falado.palavras[1].t);
  // contador e imagem do motor dentro do beat viram data e quadro do estilo
  const mista = partesAntiguidade(compilar({ tema: 'X', estilo: 'antiguidade', beats: [{ id: 'a', palavras: [0, 9], elementos: [{ tipo: 'imagem', arquivo: 'assets/a.jpg' }, { tipo: 'contador', valor: 343, formato: 'ano', legenda: 'antes de Cristo' }] }] }, falado));
  assert.equal(mista[0].base.forma, 'quadro'); assert.equal(mista[0].sobre[0].forma, 'data'); assert.equal(mista[0].sobre[0].e.texto, '343');
});

test('antiguidade: figura recortada da pintura, puxão de foco e ritmo (nenhuma cena longa sem acontecimento)', () => {
  const base = (els) => ({ tema: 'X', estilo: 'antiguidade', beats: [{ id: 'a', palavras: [0, 3], elementos: els }] });
  assert.deepEqual(validarCena(base([A('quadro', { arquivo: 'assets/a.jpg', figura: [[0.3, 0.1], [0.4, 0.1], [0.4, 0.5]] }), A('nome', { texto: 'Alexandre|o Grande', cores: ['ouro', 'branco'] })]), 10).erros, []);
  assert.match(validarCena(base([A('quadro', { arquivo: 'assets/a.jpg', figura: [[0.3, 0.1]] })]), 10).erros.join(' '), /figura/);
  assert.match(validarCena(base([A('quadro', { arquivo: 'assets/a.jpg', detalhe: { escala: 2 } })]), 10).erros.join(' '), /detalhe/);
  assert.match(validarCena(base([A('nome', { texto: 'X', cores: ['verde'] })]), 10).erros.join(' '), /cores/);
  assert.match(validarCena(base([A('mapa', { arquivo: 'assets/m.jpg', tratamento: 'neon' })]), 10).erros.join(' '), /relevo/);
  // cena longa só com a imagem: o motor põe um puxão de foco automático no meio do maior intervalo
  const longa = { tema: 'X', estilo: 'antiguidade', beats: [{ id: 'a', palavras: [0, 32], elementos: [A('quadro', { arquivo: 'assets/a.jpg', foco: [0.4, 0.3] })] }] };
  const P = partesAntiguidade(compilar(longa, falado))[0];
  assert.ok(P.quadros[0].detalhe?.auto, 'puxão de foco automático');
  const d = partesAntiguidade(compilar(base([A('quadro', { arquivo: 'assets/a.jpg', figura: [[0.3, 0.1], [0.4, 0.1], [0.4, 0.5]] })]), falado))[0];
  assert.ok(d.figura, 'a figura vira a camada da frente');
});

test('antiguidade: a unidade do dado concorda com o número (1 ano, 2 anos)', () => {
  assert.equal(unidade({ sufixo: ' anos' }, '1'), ' ano');
  assert.equal(unidade({ sufixo: ' anos' }, '2'), ' anos');
  assert.equal(unidade({ sufixo: ' milhões' }, '1'), ' milhão');
  assert.equal(unidade({ sufixo: ' meses' }, '1'), ' mês');
  assert.equal(unidade({ sufixo: ' reais', singular: ' real' }, '1'), ' real');
  assert.equal(unidade({ sufixo: '%' }, '1'), '%');
});

test('antiguidade: som por evento (whoosh grave no nome, tique e chiado na data, papel no rasgo, tambor no capítulo, riser nas viradas), audível e sem estourar', () => {
  const spec = compilar(CENA, falado), ev = eventosEstilos(spec).antiguidade;
  assert.ok(ev.some((e) => e.som === 'whooshGrave'), 'whoosh grave no nome');
  assert.ok(ev.filter((e) => e.som === 'tick').length >= 8, 'tique de máquina na data e na citação');
  assert.ok(ev.some((e) => e.som === 'chiado'), 'chiado de máquina na data');
  assert.ok(ev.some((e) => e.som === 'rasgo' || e.som === 'papel'), 'papel no rasgo ou no pergaminho');
  assert.ok(ev.some((e) => e.som === 'tambor'), 'tambor grave no capítulo');
  assert.ok(ev.some((e) => e.som === 'riserCurto'), 'riser curto antes das viradas');
  assert.ok(ev.every((e) => e.t >= 0), 'nada antes do quadro 0');
  const arq = path.join(tmp, 'ant.wav'); gerarSfx(spec, arq);
  const b = fs.readFileSync(arq); let pico = 0; for (let i = 44; i < b.length; i += 2) pico = Math.max(pico, Math.abs(b.readInt16LE(i)));
  assert.ok(pico > 1500 && pico < 32767, `pico ${pico}`);
});

test('antiguidade: modelos antiguidade e historia, plano automático (número vira data com régua) e trilha solene', () => {
  for (const id of ['antiguidade', 'historia']) {
    const m = JSON.parse(fs.readFileSync(path.join(RAIZ, 'modelos', `${id}.json`), 'utf8'));
    assert.equal(m.visual.estilo, 'antiguidade', `${id} usa o estilo antiguidade`);
    assert.deepEqual(validarModelo(m, { nomeArquivo: id }).erros, [], `modelos/${id}.json`);
  }
  const plano = planoDoModelo(JSON.parse(fs.readFileSync(path.join(RAIZ, 'modelos', 'historia.json'), 'utf8')));
  const fala = { palavras: 'Em 1500 os portugueses chegaram ao Brasil depois de muitos dias no mar.'.split(' ').map((w, i) => ({ w, t: 0.3 + i * 0.4, f: 0.6 + i * 0.4 })), duracao: 6 };
  const cena = autoPlano({ tema: 'BRASIL' }, fala, { plano });
  assert.equal(cena.estilo, 'antiguidade');
  const d = cena.beats.flatMap((b) => b.elementos || []).find((e) => e.tipo === 'antiguidade');
  assert.ok(d && d.forma === 'data' && d.regua && d.ano === 1500, JSON.stringify(d));
  assert.deepEqual(validarCena(cena, fala.palavras.length).erros, []);
  assert.ok(CLIMAS_AUTO.includes('antigo'), 'clima antigo (cordas graves e tambor lento)');
  assert.ok(escolherClima({ estilo: 'antiguidade', modelo: 'antiguidade', semente: 7 }).pontos.antigo > 0);
  assert.ok(resolverTrilha({ estilo: 'antiguidade', tema: 'ROMA' }, { nome: 'x', modelo: 'antiguidade' }), 'o estilo tem trilha (não fica mudo)');
});

test('navegador: quadros do antiguidade nos 3 tons, determinísticos, com o texto medido e a legenda fora do nome', { timeout: 300000 }, async () => {
  for (const tom of TONS_ANTIGUIDADE) {
    const spec = compilar({ ...CENA, tom }, falado);
    const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
    try {
      const p = paginas[0], b = spec.beats[1], t = b.de + 1.6;
      const hash = async (x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
      await hash(t); const a = await hash(t); await hash(0.4);
      assert.equal(await hash(t), a, `${tom}: mesmo t, mesmos pixels`);
      // no meio de uma transição as duas cenas se cruzam: o quadro nunca fica vazio
      await hash(spec.beats[2].de);
      const m = await p.evaluate((q) => window.ilu.medir(q), t);
      assert.equal(m.estilo, 'antiguidade');
      const nome = (m.textos || []).find((x) => x.forma === 'antiguidade:nome');
      assert.ok(nome, `${tom}: nome medido`);
      assert.ok(nome.x0 >= 64 && nome.x1 <= 1016, `${tom}: nome dentro das margens`);
      if (m.legenda) assert.ok(m.legenda.y0 > nome.y1, `${tom}: legenda abaixo do nome`);
      assert.equal(m.antiguidade.tom, tom);
    } finally { await fechar(); }
  }
});

test('QA: a cena de exemplo do antiguidade passa sem falha', { timeout: 600000 }, async () => {
  const q = await checarCena(compilar(CENA, falado));
  assert.deepEqual(q.falhas.map((f) => `${f.beat} ${f.t}: ${f.msg}`), []);
});

test('QA do arquivo: faixa sem overlay (degrau vertical reto que dura) e borda clara', () => {
  const gera = (nome, vf) => { const f = path.join(tmp, nome); const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x806040:s=1080x1920:r=30:d=1', '-vf', vf, '-pix_fmt', 'yuv420p', f]); assert.equal(r.status, 0, String(r.stderr)); return f; };
  const faixa = gera('faixa.mp4', 'drawbox=x=0:y=0:w=220:h=ih:color=black@0.35:t=fill');
  const liso = gera('liso.mp4', 'vignette=PI/5');
  const bf = faixaSemOverlay(faixa), bl = faixaSemOverlay(liso);
  assert.ok(bf.reprova && Math.abs(bf.x - 220) <= 6, `faixa achada em x ${bf.x}`);
  assert.ok(!bl.reprova, `vinheta suave não é faixa (sequência ${bl.piorSequencia})`);
  const borda = gera('borda.mp4', 'drawbox=x=0:y=0:w=2:h=ih:color=white:t=fill');
  assert.ok(bordaClara(borda).claros > 20, 'linha clara na beira reprova');
  assert.equal(bordaClara(liso).claros, 0);
});

test('mapa vetor: câmera num trajeto só, sem parar nem trancar, passando por cada cidade na palavra dela', () => {
  const ws = 'De Pela ele desceu ao Egito depois chegou à Babilônia e então foi até a Índia em poucos anos'.split(' ').map((w, i) => ({ w, t: 0.2 + i * 0.35, f: 0.5 + i * 0.35 }));
  const cena = { tema: 'X', estilo: 'antiguidade', beats: [{ id: 'm', palavras: [0, ws.length - 1], elementos: [A('mapa', { tratamento: 'vetor', rota: [[22.5, 40.8], [29.9, 31.2], [44.4, 32.5], [71.5, 31]], pontos: [{ nome: 'Pela', pos: [22.5, 40.8], em: 'Pela' }, { nome: 'Alexandria', pos: [29.9, 31.2], em: 'Egito' }, { nome: 'Babilônia', pos: [44.4, 32.5], em: 'Babilônia' }, { nome: 'Índia', pos: [71.5, 31], em: 'Índia' }] })] }] };
  const spec = compilar(cena, { palavras: ws, duracao: ws.at(-1).f + 0.3 }), P = partesAntiguidade(spec)[0];
  const kx = 62 * Math.cos((32 * Math.PI) / 180), F2 = ([lo, la]) => [(lo - 8) * kx, (60 - la) * 62], tr = trajetoMapa(P, P.mapa, F2);
  let pv = null, pior = 0, min = Infinity; const vs = [];
  const tA = P.mapa.pontos[0].t + 0.3, tZ = P.mapa.pontos.at(-1).t; // ease só antes da primeira cidade e depois da última
  for (let t = tA; t < tZ; t += 1 / 30) { const a = tr.camera(t), b = tr.camera(t + 1 / 30), v = [(b[0] - a[0]) * 0.78, (b[1] - a[1]) * 0.78]; vs.push(Math.hypot(...v)); if (pv) pior = Math.max(pior, Math.hypot(v[0] - pv[0], v[1] - pv[1])); pv = v; }
  const media = vs.reduce((x, y) => x + y, 0) / vs.length; min = Math.min(...vs);
  assert.ok(pior < 3, `aceleração ${pior.toFixed(2)} px/quadro²`);
  assert.ok(min > 0.3 * media, `velocidade mínima ${min.toFixed(1)} de média ${media.toFixed(1)} (nunca para entre a primeira e a última cidade)`);
  for (const pt of P.mapa.pontos.slice(1)) { const c = tr.camera(pt.t), q = F2(pt.pos); assert.ok(Math.hypot(c[0] - q[0], c[1] - q[1]) < 260, `${pt.nome} perto do centro quando é dita (${Math.hypot(c[0] - q[0], c[1] - q[1]).toFixed(0)} px)`); }
});

test('QA do arquivo: câmera fluida reprova o pulo e o quadro parado, e passa a panorâmica lisa', () => {
  const gera = (nome, expr) => { const f = path.join(tmp, nome); const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'testsrc2=s=1600x1920:r=30:d=0.04', '-vf', `loop=loop=59:size=1:start=0,setpts=N/30/TB,crop=1080:1920:'${expr}':0,format=yuv420p`, f]); assert.equal(r.status, 0, String(r.stderr)); return f; };
  const spec = { duracao: 2, beats: [{ de: 0 }] };
  const liso = cameraFluida(gera('liso.mp4', 'n*4'), spec), pulo = cameraFluida(gera('pulo.mp4', 'n*4+gte(n,30)*60'), spec), para = cameraFluida(gera('para.mp4', 'n*4-gte(n,30)*4*(n-30)*lt(n,31)-gte(n,31)*4'), spec);
  assert.ok(!liso.reprova, `panorâmica lisa passa (pior ${liso.piorAcel})`);
  assert.ok(pulo.reprova && pulo.piorAcel > 3, `pulo reprova (pior ${pulo.piorAcel})`);
  assert.ok(para.reprova && para.parados.length, `quadro parado reprova (${JSON.stringify(para.parados)})`);
});
