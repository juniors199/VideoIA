/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compilar, ESTILOS } from '../src/video/plano.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { ESTILOS_NOMES, ESTILOS_MOTION, TIPOS } from '../src/video/catalogo.mjs';
import { NOVOS } from '../src/video/engine/estilos-comum.js';
import { eventosEstilos } from '../src/video/sfx-estilos.mjs';
import { cenariosDo, camerasDo } from '../src/video/engine/cenarios-estilo-todos.js';
import { FORMAS_MINDSET3, DIAGRAMAS_M3, TRANSICOES_M3, REGRAS_M3, validarMindset3, partesMindset3, cameraM3, caixaProtagonistaM3, gruposLegendaM3, eventosVisuaisM3, estadoParte } from '../src/video/engine/estilo-mindset3-layout.js';
import { CENARIOS_M3, CAMERAS_M3, MOVIMENTOS_M3, validarCenarioM3 } from '../src/video/engine/mindset3-cenarios/index.js';
import { FIGURAS_M3, validarFigura, figuraPelaFala } from '../src/video/engine/estilo-mindset3-figuras.js';
import { caminhoPolilinhas, compPoli } from '../src/video/engine/estilo-mindset3-desenho.js';
import { verificarMindset3, suavidadeMindset3, centralizacaoMindset3, caixaPilulaM3, colisaoPilulaM3 } from '../src/video/verificadores/estilo-mindset3-verificar.mjs';
import { paletaM3, eventosMindset3 } from '../src/video/engine/estilo-mindset3.js';
import { planejarMindset3, dividirBeatsLongos, numeroM3, palavraCta, ehPessoa } from '../src/video/autoplano-mindset3.mjs';
import { lerEstilos } from '../src/estilo-objetivo/carregar.mjs';

/**
 * Estilo mindset3 (Mindset 3, porte de 04/11/2026): registro em todo lugar, cenários e câmeras (2D e 3D) no mecanismo comum,
 * biblioteca de figuras válida, cor de destaque lida da marca, legenda de uma linha, câmera sem pico, centralização, fecho,
 * transição sem clarão, plano automático pela fala e som discreto. O quadro no navegador está em estilo-mindset3-quadros.
 */
import { falar, falado, M, CENA_M3 } from './fixtures/mindset3-cena.mjs';

test('mindset3: registrado no catálogo, no motor, na ficha do estúdio, na validação e em todos os pontos comuns', () => {
  for (const l of [ESTILOS_NOMES, ESTILOS_MOTION, TIPOS, NOVOS]) assert.ok(l.includes('mindset3'));
  assert.ok(ESTILOS.mindset3 && !ESTILOS.mindset3.destaque, 'a paleta do plano não fixa destaque (a cor é a da página)');
  assert.ok(lerEstilos(new URL('..', import.meta.url).pathname).mindset3, 'o estúdio web e o npm run estilos listam o estilo');
  for (const f of ['src/video/engine/estilos.js', 'src/video/qa.mjs', 'src/video/sfx-estilos.mjs', 'src/video/trilhas.mjs', 'src/video/autoplano-estilos.mjs', 'src/video/relevancia.mjs', 'src/video/qa-verificadores.mjs', 'src/video/engine/camera.js', 'src/video/validar.mjs', 'src/video/locais.mjs', 'src/video/engine/cenarios-estilo-todos.js']) assert.match(fs.readFileSync(new URL(`../${f}`, import.meta.url), 'utf8'), /[mM]indset3/, f);
  assert.ok(fs.existsSync(new URL('../docs/estilo-mindset3.md', import.meta.url)), 'guia do estilo');
  assert.ok(fs.existsSync(new URL('../projetos/teste-estilo-mindset3/cena.json', import.meta.url)), 'exemplo do estilo para o kit (empacotar.mjs copia teste-estilo-<id>)');
  assert.notEqual('mindset3', 'mindset'); assert.ok(!['mindset', 'mindset2'].includes('mindset3'));
});

test('mindset3: 8 cenários e 7 câmeras nomeadas (5 em 2D, 2 em 3D) no mecanismo comum, todos válidos; o projeto traz o próprio', () => {
  assert.equal(Object.keys(CENARIOS_M3).length, 8);
  for (const [id, c] of Object.entries(CENARIOS_M3)) assert.deepEqual(validarCenarioM3(c, id), [], id);
  const cams = camerasDo('mindset3');
  assert.deepEqual(Object.keys(cams).sort(), Object.keys(MOVIMENTOS_M3).sort());
  assert.equal(Object.values(CAMERAS_M3).filter((c) => c.tipo === '3D').length, 2);
  assert.equal(Object.values(CAMERAS_M3).filter((c) => c.tipo === '2D').length, 5);
  const meu = { nome: 'Mesa', temas: ['mesa'], ambiente: { fundo: ['#111113'] }, luz: { tipo: 'nenhuma' }, nevoa: null, props: [{ tipo: 'chao', y: 0.6 }], camera: 'deriva', acabamento: { pontos: 0.03, grao: 0.05, vinheta: 0.3, brilho: 1 } };
  assert.deepEqual(validarCenarioM3(meu, 'mesa'), []);
  assert.ok(cenariosDo('mindset3', { objetosLocais: { cenariosEstilo: { mindset3: { mesa: meu } } } }).mesa, 'cenário do pecas.js entra');
  assert.ok(validarCenarioM3({ ...meu, props: [{ tipo: 'nave' }] }, 'x').length, 'prop desconhecido é recusado');
});

test('mindset3: biblioteca de 57 figuras (35 + 8 de ação + 14 da fila de misticismo) em linha, todas válidas; o caminho SVG vira polilinhas com o comprimento certo', () => {
  assert.equal(Object.keys(FIGURAS_M3).length, 57);
  for (const [id, f] of Object.entries(FIGURAS_M3)) { assert.deepEqual(validarFigura(id, f), [], id); for (const t of f.tracos) assert.ok(caminhoPolilinhas(t.d).length, `${id}: traço vazio`); }
  const c = caminhoPolilinhas('M0 100 A100 100 0 1 1 200 100 A100 100 0 1 1 0 100 Z');
  assert.ok(Math.abs(c.reduce((s, p) => s + compPoli(p.pts), 0) - 2 * Math.PI * 100) < 8, 'círculo de raio 100 tem ~628 de comprimento');
  assert.equal(figuraPelaFala('o celular na mão antes de dormir'), 'celular');
  assert.equal(figuraPelaFala('seu cérebro decide'), 'cerebro');
});

test('mindset3: cor de destaque lida da marca (o frio e o alerta derivados dela), nunca fixa', () => {
  const a = paletaM3('#FF7A2F'), b = paletaM3('#2F7BFF');
  assert.equal(a.quente, '#FF7A2F'); assert.equal(b.quente, '#2F7BFF');
  assert.notEqual(a.frio, b.frio); assert.notEqual(a.alerta, b.alerta); assert.notEqual(a.etiqueta, b.etiqueta);
  const src = fs.readFileSync(new URL('../src/video/engine/estilo-mindset3.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /#(F7D21A|FFC800|D9B660|F0E1AE)/i, 'sem o ouro das referências como cor fixa');
});

test('mindset3: validação do elemento (formas, diagramas, transições sem clarão) e da cena', () => {
  assert.deepEqual(FORMAS_MINDSET3, ['figura', 'dupla', 'pessoa', 'foto', 'numero', 'titulo', 'diagrama', 'cartao', 'cta']);
  assert.equal(DIAGRAMAS_M3.length, 11);
  assert.ok(!TRANSICOES_M3.some((x) => /flash|luz|branco|clarao/.test(x)), 'nenhuma transição clareia');
  assert.match(validarMindset3({ forma: 'nada' }).join(), /não existe/);
  assert.match(validarMindset3({ forma: 'figura', figura: 'dragao' }).join(), /não existe/);
  assert.match(validarMindset3({ forma: 'figura', figura: 'corpo', transicao: 'flash' }).join(), /nenhuma clareia/);
  assert.deepEqual(validarMindset3({ forma: 'figura', figura: 'dragao' }, { figurasMindset3: { dragao: { nome: 'D', temas: [], tracos: [{ d: 'M0 0 L10 10' }] } } }), [], 'figura do pecas.js vale');
  const r = validarCena(structuredClone(CENA_M3), falado.palavras);
  assert.deepEqual(r.erros, [], r.erros.join('\n'));
});

test('mindset3: legenda em UMA linha a 75% da altura, sem terminar em palavra fraca, com a chave marcada', () => {
  const spec = compilar(structuredClone(CENA_M3), falado), { legenda } = partesMindset3(spec);
  assert.ok(legenda.length >= 8);
  for (const G of legenda) { const txt = G.ws.map((w) => w.w).join(' '); assert.ok(txt.length <= REGRAS_M3.legenda.maxC, txt); assert.ok(G.ws.some((w) => w.chave), `chave em "${txt}"`); assert.ok(G.t1 >= G.ws.at(-1).t, 'fica na tela até a última palavra ser dita'); }
  for (let i = 1; i < legenda.length; i++) assert.ok(legenda[i].t0 >= legenda[i - 1].t1 - 1e-6, 'uma frase por vez');
  // área segura (dono, 05/11): a base da legenda em 1417 (antes y 1440, base em 1463), mantendo os 45 px do estilo
  assert.equal(REGRAS_M3.legenda.y, 1394); assert.equal(REGRAS_M3.legenda.px, 45, 'decisão do dono (05/11): 45 px, como a referência (42 a 45)');
});

test('mindset3: câmera sem pico brusco (velocidade, aceleração e jerk) em toda câmera, inclusive na mistura entre beats', () => {
  for (const cam of Object.keys(MOVIMENTOS_M3)) {
    const cena = structuredClone(CENA_M3); for (const b of cena.beats) b.camera = { mov: cam };
    const spec = compilar(cena, falado), S = suavidadeMindset3(partesMindset3(spec).partes);
    assert.ok(S.vel <= REGRAS_M3.camera.velMax && S.acel <= REGRAS_M3.camera.acelMax && S.jerk <= REGRAS_M3.camera.jerkMax, `${cam}: ${JSON.stringify(S)}`);
  }
  const spec = compilar(structuredClone(CENA_M3), falado), S = suavidadeMindset3(partesMindset3(spec).partes);
  assert.ok(S.vel > 0.3, `a câmera nunca fica parada (${S.vel} %L/s)`);
  // a 3D muda a perspectiva de verdade: a caixa do protagonista deforma na inclinação
  const P = partesMindset3(spec).partes.find((x) => x.cam === 'inclina'), c0 = caixaProtagonistaM3(P, P.de + 0.5), c1 = caixaProtagonistaM3(P, P.ate - 0.05);
  assert.ok(Math.abs((c0.y1 - c0.y0) - (c1.y1 - c1.y0)) > 4, 'inclina muda a altura projetada');
  assert.ok(Math.abs(cameraM3(P, P.de + 1.3).rx) > 0.1, 'a inclinação 3D existe depois da mistura com a câmera anterior');
});

test('mindset3: verificador do QA sem falhas na cena boa, protagonista no eixo e fecho com as pílulas do CTA acima da legenda; reprova transição de fora do estilo', () => {
  const spec = compilar(structuredClone(CENA_M3), falado), r = verificarMindset3(spec);
  assert.deepEqual(r.falhas, [], JSON.stringify(r.falhas));
  for (const c of centralizacaoMindset3(partesMindset3(spec).partes)) assert.ok(c.desvio <= REGRAS_M3.centro.tol, `${c.id}: ${c.desvio} px`);
  const ruim = structuredClone(CENA_M3); ruim.beats[1].elementos[0].transicao = 'flash';
  assert.ok(verificarMindset3(compilar(ruim, falado)).falhas.some((f) => f.tipo === 'transicao-clarao'), 'transição com clarão reprovada');
  const semPilula = compilar(structuredClone(CENA_M3), falado); const { partes } = partesMindset3(semPilula);
  assert.ok(partes.at(-1).itens.pilulas[0].seq.some((s) => /COMENTA ILUSTRANDO/.test(s.texto)), 'pílula com a palavra do CTA');
  assert.ok(partes.at(-1).itens.pilulas[0].seq.some((s) => /SEGUE A PÁGINA/.test(s.texto)), 'pílula de seguir (CTA padrão)');
  // área segura (dono, 05/11): a referência põe a pílula a 85,4% da altura; a área vence e ela fica o mais perto possível,
  // encostada na base da área (y1 <= 1418); no fecho a legenda sobe para cima dela (yFecho), sem encostar
  const pl = partes.at(-1).itens.pilulas[0], cx = caixaPilulaM3(pl), legY1 = REGRAS_M3.legenda.yFecho + REGRAS_M3.legenda.px * 0.52;
  assert.ok(cx.y1 <= 1418 && cx.y1 > 1410, `pílula encostada na base da área segura (${JSON.stringify(cx)})`);
  assert.ok(cx.y0 >= legY1 + REGRAS_M3.pilula.folgaLegenda && cx.y1 <= REGRAS_M3.pilula.pe && cx.x0 >= 72 && cx.x1 <= 928, JSON.stringify(cx));
  const legFecho = { x0: 300, x1: 780, y0: REGRAS_M3.legenda.yFecho - 32, y1: legY1 };
  assert.deepEqual(colisaoPilulaM3(cx, legFecho), [], 'sem colisão com a legenda do fecho');
  assert.ok(colisaoPilulaM3(cx, { x0: 300, x1: 780, y0: REGRAS_M3.legenda.y - 32, y1: REGRAS_M3.legenda.y + 23 }).length, 'o verificador reprova a pílula em cima da legenda na altura comum');
  assert.ok(colisaoPilulaM3(cx, null, [{ x0: 400, x1: 700, y0: pl.y - 20, y1: pl.y + 20, forma: 'x' }]).length, 'e em cima de texto');
});

test('mindset3: transições sem clarão (o anterior sai no escuro) e a dupla centrada como conjunto', () => {
  const spec = compilar(structuredClone(CENA_M3), falado), { partes } = partesMindset3(spec);
  for (const P of partes) for (let t = P.de; t < P.ate + 1; t += 0.05) { const E = estadoParte(P, t); assert.ok(E.alfa >= 0 && E.alfa <= 1); }
  const src = fs.readFileSync(new URL('../src/video/engine/estilo-mindset3.js', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /fillStyle = '#FFFFFF'; g\.fillRect\(0, 0, W, H\)/, 'nenhum flash branco de tela cheia');
  const D = partes.find((p) => p.forma === 'dupla'), c = caixaProtagonistaM3(D, D.ate - 0.08);
  assert.ok(Math.abs((c.x0 + c.x1) / 2 - 540) <= 24 && c.x0 >= 72 && c.x1 <= 1008, JSON.stringify(c)); // o desenho do par pode sangrar
});

test('mindset3: plano automático pela fala (número, porcentagem, dupla, foto, fecho com a palavra) e beat longo dividido', () => {
  const f = falar('Seu cérebro decide antes de você perceber, mesmo quando acha que pensou bastante antes. Em 2008, foram 7 segundos. O celular acende a mente enquanto o livro desacelera. Quase metade dorme mal, 45% numa pesquisa. Albert Einstein dormia dez horas. Segue a página e comenta ILUSTRANDO.');
  const ws = f.palavras;
  const beats = [{ id: 'a', palavras: [0, 14] }, { id: 'b', palavras: [15, 19], elementos: [{ tipo: 'contador', valor: 7 }] }, { id: 'c', palavras: [20, 27] }, { id: 'd', palavras: [28, 34] }, { id: 'e', palavras: [35, 39], elementos: [{ tipo: 'imagem', busca: 'Albert Einstein' }] }, { id: 'f', palavras: [40, 45] }];
  assert.ok(ehPessoa('Albert Einstein') && !ehPessoa('Torre Eiffel') && !ehPessoa('Nova York'));
  assert.ok(dividirBeatsLongos(structuredClone(beats), ws) >= 1, 'o beat de mais de 4,2 s vira dois');
  planejarMindset3(beats, ws);
  const el = (id) => beats.find((b) => b.id === id).elementos.find((e) => e.tipo === 'mindset3');
  assert.equal(el('b').forma, 'numero'); assert.equal(el('b').texto, '7');
  assert.equal(el('c').forma, 'dupla'); assert.deepEqual(el('c').figuras, ['celular', 'livro']);
  assert.equal(el('d').forma, 'diagrama'); assert.equal(el('d').diagrama, 'grade'); assert.equal(el('d').grupos[0].n, 45);
  // pessoa citada (decisão do dono, 05/11): ilustração em linha com o nome na etiqueta; a foto não é buscada
  assert.equal(el('e').forma, 'pessoa'); assert.equal(el('e').rotulo, 'ALBERT EINSTEIN'); assert.ok(!beats.find((b) => b.id === 'e').elementos.some((x) => x.tipo === 'imagem'), 'sem foto por padrão');
  assert.equal(el('f').forma, 'cta'); assert.equal(el('f').chave, 'ILUSTRANDO');
  for (let i = 1; i < beats.length; i++) assert.notEqual(beats[i].camera.mov === beats[i - 1].camera.mov && beats[i].camera.mov, true, 'câmera não repete a do vizinho');
  assert.equal(numeroM3({ valor: 1999 }, ['Em', '1999,']).texto, '1999', 'ano sem ponto de milhar');
  assert.equal(numeroM3({ valor: 2500 }, ['2500', 'pessoas']).texto, '2.500');
  assert.equal(palavraCta(['comenta', 'ILUSTRANDO.']), 'ILUSTRANDO');
});

test('mindset3: som discreto (traço, tiques, ping, pílula) e eventos visuais novos dentro do beat', () => {
  const spec = compilar(structuredClone(CENA_M3), falado), E = eventosMindset3(spec);
  assert.ok(E.length >= 10); assert.ok(E.every((e) => e.g == null || e.g < 0.1), 'efeitos baixos (bem abaixo da voz)');
  assert.ok(E.some((e) => e.som === 'draw') && E.some((e) => e.som === 'tick') && E.some((e) => e.som === 'pop'));
  const ev = eventosVisuaisM3(spec); assert.ok(ev.f.length >= 2, 'o fecho tem as pílulas como eventos novos');
  assert.ok(ev.c.length >= 1, 'a dupla conta a chegada da segunda figura');
  const mix = eventosEstilos(spec); assert.ok(mix == null || typeof mix === 'object');
});

test('mindset3 (dono, 05/11): pessoa citada vira ilustração em linha centrada, com o nome na etiqueta, sem foto', () => {
  const cena = structuredClone(CENA_M3); cena.beats[0].elementos = [M({ forma: 'pessoa', rotulo: 'ALBERT EINSTEIN' })];
  const spec = compilar(cena, falado), P = partesMindset3(spec).partes[0];
  assert.equal(P.forma, 'pessoa'); assert.ok(P.itens.tracos.length >= 3, 'o busto em traço');
  assert.ok(P.itens.textos.some((x) => x.tipo === 'rot' && x.texto === 'ALBERT EINSTEIN' && x.x === 540), 'nome centrado embaixo');
  assert.ok(!P.itens.textos.some((x) => x.tipo === 'fotoPontos'), 'sem foto');
  const c = caixaProtagonistaM3(P, P.ate - 0.08); assert.ok(Math.abs((c.x0 + c.x1) / 2 - 540) <= 24, JSON.stringify(c));
  assert.deepEqual(verificarMindset3(spec).falhas, []);
});

test('mindset3 (reanálise 05/11): número no anel cabe com margem, no eixo, rótulo colado embaixo; o verificador reprova o que vaza', async () => {
  const { geometriaNumero, larguraPoppinsLight } = await import('../src/video/engine/estilo-mindset3-layout.js');
  const { conferirNumeroAnel } = await import('../src/video/verificadores/estilo-mindset3-verificar.mjs');
  for (const txt of ['7', '72', '1999', '06:00', '04:30', '8,3', '2.500', '+2.730.000']) {
    const G = geometriaNumero(txt, { rotulo: 'ROTULO' }), w = larguraPoppinsLight(txt) * G.px;
    assert.ok(w <= 0.62 * 2 * G.r + 1, `${txt}: largura ${Math.round(w)} cabe em 62% do diâmetro`);
    assert.deepEqual(conferirNumeroAnel({ x0: 540 - w / 2, x1: 540 + w / 2, y0: G.base - G.cap, y1: G.base }, { cx: 540, cy: G.cy, r: G.r }), [], txt);
    assert.ok(Math.abs((G.topo + G.fundo) / 2 - G.cy) < 2, `${txt}: o grupo número + rótulo centrado no anel`);
    assert.ok(G.yRotulo - G.base < 0.06 * 2 * G.r, `${txt}: rótulo colado embaixo do número`);
  }
  // o 06:00 do feedback (240 px de Poppins Regular, 700 de largura num anel de 720) é reprovado
  assert.ok(conferirNumeroAnel({ x0: 190, x1: 890, y0: 620, y1: 790 }, { cx: 540, cy: 790, r: 360 }).some((m) => /vaza|largo/.test(m)));
  assert.ok(conferirNumeroAnel({ x0: 400, x1: 700, y0: 700, y1: 820 }, { cx: 540, cy: 790, r: 337 }).some((m) => /eixo/.test(m)), 'desvio de 10 px reprova');
  // número com o cenário de anel e graus em volta (competem) é reprovado
  const cena = structuredClone(CENA_M3); cena.beats[1].cenario = 'anel-astral';
  assert.ok(verificarMindset3(compilar(cena, falado)).falhas.some((f) => f.tipo === 'numero-anel'));
});

test('mindset3 (reanálise 05/11): a câmera nomeada no cena.json é a que o estilo usa (o compilador a guarda em cameraEstilo)', () => {
  const spec = compilar(structuredClone(CENA_M3), falado), { partes } = partesMindset3(spec);
  assert.deepEqual(partes.map((P) => P.cam), CENA_M3.beats.map((b) => b.camera.mov));
});

test('mindset3 (porte completo 05/11): as 4 formas que faltavam (ficha e cartão duplo, hélice e fechadura 3D, anéis com multiplicador) centradas, dentro das caixas e verificadas', async () => {
  const { geometriaAneis, larguraPoppinsLight } = await import('../src/video/engine/estilo-mindset3-layout.js');
  const { conferirNumeroAnel, conferirVezes, conferirCaixasTexto } = await import('../src/video/verificadores/estilo-mindset3-verificar.mjs');
  // anéis (ref04): o número cabe no anel interno, no eixo, até 70% do diâmetro; o multiplicador fica fora; nunca passa de 340
  for (const txt of ['0', '7', '15', '72', '3×', '1.000', '+2.730.000']) {
    const A = geometriaAneis(txt, { aneis: 5, vezes: '×10' }), w = larguraPoppinsLight(txt) * A.px;
    assert.deepEqual(conferirNumeroAnel({ x0: 540 - w / 2, x1: 540 + w / 2, y0: A.base - A.cap, y1: A.base }, { cx: 540, cy: A.cy, r: A.r0 }), [], txt);
    assert.deepEqual(conferirVezes({ x0: A.xV - A.wV / 2 }, { cx: 540, r0: A.r0 }), [], `${txt}: multiplicador fora do anel`);
    assert.ok(A.raios.at(-1) <= REGRAS_M3.aneis.rMax && A.raios.length >= 2, txt);
  }
  assert.ok(conferirVezes({ x0: 600 }, { cx: 540, r0: 115 }).length, 'multiplicador dentro do anel reprova');
  // cartões: texto que passa do painel reprova (mono exato: 0,64 em por caractere)
  assert.ok(conferirCaixasTexto([{ tipo: 'mono', texto: '01  um item comprido demais pro painel', x: 580, px: 28, caixaMax: { x0: 560, x1: 1000 } }]).length);
  const formas = [
    { forma: 'cartao', variante: 'duplo', titulo: 'O COMBINADO', itens: ['noite 1: às seis', 'noite 2: às nove', 'noite 3: às nove'] },
    { forma: 'cartao', variante: 'ficha', titulo: 'ESTUDO', campos: ['ANO|1999', 'LOCAL|LÜBECK', 'MEDIDA|ACTH NO SANGUE', 'QUANDO|A NOITE TODA'], destaque: 2 },
    { forma: 'diagrama', diagrama: 'helice', itens: ['0h', '1h', '2h', '3h', '4h', '5h', '6h'], centro: '06:00', rotulos: ['A HORA'] },
    { forma: 'diagrama', diagrama: 'fechadura', titulo: '06:00', pinos: 5 },
    { forma: 'numero', texto: '15', aneis: 3, vezes: '×3', rotulo: 'NOITES' },
  ];
  for (const f of formas) {
    const nome = f.variante || f.diagrama || f.forma;
    assert.deepEqual(validarMindset3(f), [], nome);
    const cena = structuredClone(CENA_M3); cena.beats[0].elementos = [M(f)]; cena.beats[0].cenario = 'breu';
    const spec = compilar(cena, falado), P = partesMindset3(spec).partes[0], c = caixaProtagonistaM3(P, P.ate - 0.08, { comCamera: false });
    assert.ok(Math.abs((c.x0 + c.x1) / 2 - 540) <= 24, `${nome} centrado: ${JSON.stringify(c)}`);
    assert.ok(c.y1 <= 1280, `${nome} acima da legenda: ${Math.round(c.y1)}`);
    assert.deepEqual(conferirCaixasTexto(P.itens.textos), [], nome);
    assert.deepEqual(verificarMindset3(spec).falhas.filter((x) => x.beat === cena.beats[0].id), [], nome);
  }
  assert.ok(validarMindset3({ forma: 'cartao', variante: 'duplo', itens: ['um item com mais de dezoito'] }).length, 'item longo no duplo reprova');
  assert.ok(validarMindset3({ forma: 'cartao', variante: 'ficha', campos: ['SEM BARRA'] }).length, 'campo sem RÓTULO|valor reprova');
  // plano automático: "N vezes" vira anéis, fechadura e hélice pela fala, enumeração curta vira o cartão duplo
  const pl = (txt) => {
    const ws = txt.split(' ').map((w, i) => ({ w, t: i * 0.3, d: 0.25 })), n = ws.length;
    const ws3 = [...ws, { w: 'depois', t: n * 0.3 + 2, d: 0.3 }, { w: 'comenta', t: n * 0.3 + 4, d: 0.3 }];
    const bs = [{ id: 'b01', palavras: [0, n - 1], elementos: /\d/.test(txt) ? [{ tipo: 'contador', valor: Number(txt.match(/\d+/)[0]) }] : [] }, { id: 'b02', palavras: [n, n], elementos: [] }, { id: 'b03', palavras: [n + 1, n + 1], elementos: [] }];
    planejarMindset3(bs, ws3); return bs[0].elementos.find((e) => e.tipo === 'mindset3');
  };
  assert.equal(pl('O risco sobe 3 vezes à noite').aneis, 3);
  assert.equal(pl('A senha destrava a porta').diagrama, 'fechadura');
  assert.equal(pl('Em décadas de pesquisa').diagrama, 'helice');
  assert.equal(pl('pão, leite, café, ovos').variante, 'duplo');
});

test('mindset3 (dono, 05/11): fundo liso por padrão; cenário só quando a frase diz o lugar; sem janela no canto nem linha de chão solta; legenda de 45 px', async () => {
  const { gatilhoCenarioM3 } = await import('../src/video/verificadores/estilo-mindset3-verificar.mjs');
  assert.equal(REGRAS_M3.legenda.px, 45);
  assert.deepEqual(CENARIOS_M3.quarto.props, [], 'o quarto não desenha a janela 2x2 nem o chão');
  for (const [id, c] of Object.entries(CENARIOS_M3)) assert.ok(!(c.props || []).some((p) => ['chao', 'rodape'].includes(p.tipo) && p.y > 0.6), `${id}: nenhuma linha de chão solta perto da legenda`);
  assert.ok(gatilhoCenarioM3('breu', 'qualquer coisa'));
  assert.ok(!gatilhoCenarioM3('quarto', 'Seu corpo começa a acordar antes do despertador'), 'acordar não é lugar');
  assert.ok(gatilhoCenarioM3('quarto', 'Ele deitou na cama às dez'));
  assert.ok(!gatilhoCenarioM3('anel-astral', 'Lá pelas quatro horas da manhã'));
  // cenário sem gatilho reprova no verificador
  const cena = structuredClone(CENA_M3); cena.beats[0].cenario = 'quarto';
  assert.ok(verificarMindset3(compilar(cena, falado)).falhas.some((f) => f.tipo === 'cenario-sem-gatilho' && f.beat === 'a'));
  // o plano automático deixa o vídeo de sono inteiro em fundo liso (nenhuma frase diz o lugar)
  const txt = 'Seu corpo começa a acordar antes do despertador. O cérebro marca a hora dormindo. Segue a página e comenta ILUSTRANDO.';
  const ws = txt.split(' ').map((w, i) => ({ w, t: i * 0.35, d: 0.3 }));
  const bs = [{ id: 'b01', palavras: [0, 6], elementos: [] }, { id: 'b02', palavras: [7, 12], elementos: [] }, { id: 'b03', palavras: [13, ws.length - 1], elementos: [] }];
  planejarMindset3(bs, ws);
  assert.deepEqual(bs.map((b) => b.cenario), ['breu', 'breu', 'breu']);
});

test('mindset3 (dono, 05/11): tamanho medido nas referências e desenho que ilustra a ação da fala (soneca, susto, dormir, hormônio, voluntários)', async () => {
  const { conferirTamanhoM3, correspondenciaM3 } = await import('../src/video/verificadores/estilo-mindset3-verificar.mjs');
  // a carta de 830 px (77% da largura) do retorno do dono é reprovada; uma figura de 600 px (56%) passa
  assert.ok(conferirTamanhoM3('figura', { x0: 125, x1: 955, y0: 500, y1: 1050 }).some((m) => /largura/.test(m)));
  assert.deepEqual(conferirTamanhoM3('figura', { x0: 240, x1: 840, y0: 490, y1: 1110 }), []);
  assert.ok(conferirTamanhoM3('figura', { x0: 500, x1: 580, y0: 760, y1: 840 }).some((m) => /pequena/.test(m)));
  // toda figura da biblioteca, no tamanho padrão do estilo, fica dentro da faixa da referência
  for (const id of Object.keys(FIGURAS_M3)) {
    const cena = structuredClone(CENA_M3); cena.beats[0].elementos = [M({ forma: 'figura', figura: id })];
    const P = partesMindset3(compilar(cena, falado)).partes[0], c = P.itens.figs[0].F.caixa;
    assert.deepEqual(conferirTamanhoM3('figura', c), [], `${id}: ${Math.round(c.x1 - c.x0)} x ${Math.round(c.y1 - c.y0)}`);
  }
  // correspondência fala -> desenho
  assert.ok(correspondenciaM3('Manda pra quem vive apertando a soneca.', ['envelope']).length, 'soneca com envelope reprova');
  assert.deepEqual(correspondenciaM3('Manda pra quem vive apertando a soneca.', ['soneca']), []);
  assert.ok(correspondenciaM3('O corpo levou o susto junto com o alarme.', ['raio']).length);
  assert.deepEqual(correspondenciaM3('Uma frase sem pista nenhuma.', ['lupa']), []);
  // o plano escolhe a figura pela AÇÃO da frase
  for (const [fala, fig] of [['Manda pra quem vive apertando a soneca.', 'soneca'], ['O corpo levou o susto junto com o alarme.', 'susto'], ['puseram quinze voluntários pra dormir à meia-noite.', 'dormitorio'], ['entra no sono com você.', 'dormindo'], ['O cérebro marcou a hora dormindo.', 'cabeca-relogio'], ['quem esperava começou a soltar o hormônio', 'hormonio'], ['Da próxima vez que você acordar antes do alarme,', 'acordando']]) assert.equal(figuraPelaFala(fala), fig, fala);
  // a cena da prévia não tem desenho fora da fala nem fora do tamanho
  const cenaP = JSON.parse(fs.readFileSync(new URL('../projetos/mindset3-previa/cena.json', import.meta.url), 'utf8'));
  const palP = JSON.parse(fs.readFileSync(new URL('../projetos/mindset3-previa/palavras.json', import.meta.url), 'utf8'));
  assert.deepEqual(verificarMindset3(compilar(cenaP, palP)).falhas.filter((f) => ['tamanho-ref', 'fala-desenho'].includes(f.tipo)), []);
});

test('camada comum fala -> forma (dono, 05/11): qualquer estilo liga o seu repertório; o mindset3 já usa; sem desenho que represente, fundo liso com texto', async () => {
  const FF = await import('../src/video/engine/fala-forma.js');
  assert.ok(FF.estilosComRepertorio().includes('mindset3'));
  FF.registrarRepertorio('_teste', { itens: { bolo: { temas: ['bolo', 'aniversario'] }, apagar: { temas: ['apaga', 'apagar', 'sopra'], peso: 3 } }, pistas: [[/\bsopr/, ['apagar']]] });
  assert.equal(FF.escolherNoEstilo('_teste', 'Ela sopra as velas no aniversário'), 'apagar', 'a ação dita vence o assunto');
  assert.equal(FF.escolherNoEstilo('_teste', 'O bolo de aniversário'), 'bolo');
  assert.equal(FF.escolherNoEstilo('_teste', 'Nada a ver'), null);
  assert.ok(FF.conferirNoEstilo('_teste', 'Ela sopra as velas', ['bolo']).length);
  assert.deepEqual(FF.conferirNoEstilo('_teste', 'Ela sopra as velas', ['apagar']), []);
  // o mindset3 não sorteia figura: frase sem objeto nem ação desenhável vira título em fundo liso
  const ws = 'Isso muda tudo pra sempre. Segue a página e comenta ILUSTRANDO.'.split(' ').map((w, i) => ({ w, t: i * 0.4, d: 0.3 }));
  const bs = [{ id: 'b01', palavras: [0, 4], elementos: [] }, { id: 'b02', palavras: [5, 6], elementos: [] }, { id: 'b03', palavras: [7, ws.length - 1], elementos: [] }];
  planejarMindset3(bs, ws);
  const el = bs[0].elementos.find((e) => e.tipo === 'mindset3');
  assert.equal(el.forma, 'titulo'); assert.equal(bs[0].cenario, 'breu');
});

// fila de misticismo do dono (05/11/2026): título na área segura, etiqueta presa na área e figuras novas pela fala
test('mindset3: título quebra pela largura da área segura (nunca passa de 776 px) e acusa texto que sobraria', async () => {
  const { linhasTituloM3, larguraPoppinsBold } = await import('../src/video/engine/estilo-mindset3-layout.js');
  for (const t of ['detectar bases soviéticas secretas', 'Os cientistas e físicos que', 'impressionante', 'Remote viewing', 'Só misticismo?']) {
    for (const l of linhasTituloM3(t)) if (l.includes(' ')) assert.ok(larguraPoppinsBold(l) * REGRAS_M3.titulo.px <= REGRAS_M3.titulo.largMax, `${l} cabe`);
  }
  assert.deepEqual(validarMindset3({ tipo: 'mindset3', forma: 'titulo', texto: 'Só misticismo?' }), []);
  assert.ok(validarMindset3({ tipo: 'mindset3', forma: 'titulo', texto: 'detectar bases soviéticas secretas' }).some((e) => /linhas/.test(e)));
});
test('mindset3: figuras novas da fila (documento, fones, holograma, alvo, submarino, coordenadas, carro, multidão, tempo, espelho, bússola, concha, girassol, coelho) válidas e escolhidas pela fala', () => {
  const casos = { 'submarinos em construções': 'submarino', 'frequências de som': 'fones', 'o universo funciona como um holograma gigante': 'holograma', 'coordenadas geográficas exatas': 'mapa-coordenadas', 'na forma de uma concha': 'concha', 'crescimento de coelhos': 'coelho', 'quando você pensa em um carro': 'carro', 'escondido na multidão': 'multidao' };
  for (const id of ['documento', 'fones', 'holograma', 'alvo', 'submarino', 'mapa-coordenadas', 'carro', 'multidao', 'linha-tempo', 'espelho', 'bussola', 'concha', 'girassol', 'coelho']) assert.deepEqual(validarFigura(id, FIGURAS_M3[id]), [], id);
  for (const [fala, id] of Object.entries(casos)) assert.equal(figuraPelaFala(fala), id, fala);
});
