/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { lerLocais, embutirLocais } from '../src/video/locais.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { lintarRoteiro } from '../src/video/lint-roteiro.mjs';
import { abrir, baseGlobal } from '../src/video/render.mjs';
import { lerLinha, gravarLinha } from '../scripts/linha-editorial.mjs';
import { licencaLivre, registroDe, linhaFonte, registrarFonte, buscarFotos, buscarLogos, clienteEducado, slug, USER_AGENT } from '../scripts/buscar-imagem.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(RAIZ, '.teste-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

const PECAS = `export const pecas = {
  'caixa-local': (kit, d) => {
    const { THREE, Ms, P, placaBisel, cil, centra } = kit;
    const g = new THREE.Group();
    g.add(placaBisel(1.2, 0.8, 0.5, P, 0.1));
    g.add(cil(0.08, 0.08, 0.04, Ms.destaque, 0.3, 0.2, 0.26).rotateX(Math.PI / 2));
    centra(g);
    g.userData.anima = (ent) => { g.rotation.z = 0.05 * Math.sin(ent * 2); };
    return g;
  },
};
export const cenarios = {
  'galpao-local': (kit, d) => {
    const { THREE, fosco, mix, marca } = kit;
    const g = new THREE.Group();
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), fosco(mix(marca.sombra, marca.fundo, 0.3)));
    piso.rotation.x = -Math.PI / 2; g.add(piso);
    g.userData.atm = { fundo: d.fundo || '#202030' }; g.userData.piso = 'proprio';
    return g;
  },
};
`;
const projeto = (nome, codigo) => { const p = path.join(tmp, nome); fs.mkdirSync(p, { recursive: true }); if (codigo != null) fs.writeFileSync(path.join(p, 'pecas.js'), codigo); return p; };

test('locais: lê nomes do pecas.js, recusa colisão com o repertório e projeto sem arquivo fica vazio', async () => {
  const l = await lerLocais(projeto('ok', PECAS));
  assert.deepEqual(l.pecas, ['caixa-local']);
  assert.deepEqual(l.cenarios, ['galpao-local']);
  assert.match(l.hash, /^[0-9a-f]{16}$/);
  assert.deepEqual((await lerLocais(projeto('sem'))).pecas, []);
  await assert.rejects(lerLocais(projeto('colide', "export const pecas = { cubo: (kit) => new kit.THREE.Group() };\n")), /mesmo nome de uma peça do repertório/);
  await assert.rejects(lerLocais(projeto('colide-cen', "export const cenarios = { rua: (kit) => new kit.THREE.Group() };\n")), /mesmo nome de um cenário/);
  await assert.rejects(lerLocais(projeto('vazio', 'export const x = 1;\n')), /não exporta nada/);
  await assert.rejects(lerLocais(projeto('quebrado', 'export const pecas = {\n')), /não carrega/);
});

test('locais: validador aceita peça e cenário do projeto (dados livres) e sugere criar quando não existe', async () => {
  const l = await lerLocais(path.join(tmp, 'ok'));
  const cena = { tema: 'X', beats: [{ id: 'a', palavras: [0, 3], cenario: { tipo: 'galpao-local', qualquer: 1 }, elementos: [{ tipo: 'peca', forma: 'caixa-local' }] }] };
  assert.deepEqual(validarCena(cena, 10, l).erros, []);
  assert.ok(!validarCena(cena, 10, l).avisos.some((a) => /não usa o dado/.test(a)));
  const sem = validarCena(cena, 10);
  assert.ok(sem.erros.some((e) => /forma "caixa-local" não existe.*pecas\.js/.test(e)));
  assert.ok(sem.erros.some((e) => /cenário "galpao-local" não existe/.test(e)));
});

test('locais: o conteúdo do pecas.js entra no hash do cache de quadros', async () => {
  const spec = { marca: {}, duracao: 1, palavras: [], beats: [] };
  const b0 = baseGlobal(spec);
  const l = await lerLocais(path.join(tmp, 'ok'));
  const s1 = embutirLocais({ ...spec }, l);
  assert.notEqual(baseGlobal(s1), b0);
  const p2 = projeto('ok2', PECAS.replace('0.05 *', '0.06 *'));
  assert.notEqual(baseGlobal(embutirLocais({ ...spec }, await lerLocais(p2))), baseGlobal(s1), 'mudar a peça muda o hash');
  assert.equal(baseGlobal(embutirLocais({ ...spec }, { codigo: null })), b0, 'sem pecas.js o hash não muda');
});

test('navegador: peça e cenário do projeto renderizam, contam como peça e o quadro é determinístico', { timeout: 180000 }, async () => {
  const l = await lerLocais(path.join(tmp, 'ok'));
  const marca = { fundo: '#0E0E13', frente: '#FFFFFF', sombra: '#3C3B4A', destaque: '#FF7A2F', apoio: '#FFC9A3', serie: '@x' };
  const spec = embutirLocais({ perfil: 'curiosidades', marca, duracao: 6, palavras: [], efeitos: { bloom: 0.5, grao: 0.6 }, avisos: [], beats: [
    { id: 'a', de: 0, ate: 3, cenario: 'galpao-local', camera: { plano: 'normal', mov: 'deriva' }, transicao: 'corte', elementos: [{ tipo: 'peca', id: 'c', forma: 'caixa-local', papel: 'destaque', t0: 0.1, pos: [0, 0, 0] }] },
    { id: 'b', de: 3, ate: 6, camera: { plano: 'normal', mov: 'nenhum' }, transicao: 'corte', elementos: [{ tipo: 'peca', forma: 'cubo', t0: 3.1, pos: [0, 0, 0] }] },
  ] }, l);
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const m = await paginas[0].evaluate((x) => window.ilu.medir(x), 1.8);
    assert.equal(m.pecas.length, 1, 'a peça local é medida pelo QA; o cenário não conta como peça');
    const hash = async (p, x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
    const a = await hash(paginas[0], 1.8);
    await hash(paginas[0], 4.5);
    assert.equal(await hash(paginas[0], 1.8), a, 'mesmo t, mesmos pixels');
    assert.equal(await hash(await novaAba(), 1.8), a, 'outra aba, mesmos pixels');
    // colisão também é recusada no navegador (se o pecas.js mudar depois da leitura)
    const ruim = { ...spec, locais: { codigo: "export const pecas = { cubo: (kit) => new kit.THREE.Group() };", hash: 'x1' } };
    await assert.rejects(paginas[0].evaluate((s) => window.ilu.carregar(s, { escala: 0.25 }), ruim), /mesmo nome de uma peça do repertório/);
  } finally { await fechar(); }
});

test('promover: move a peça para o grupo do repertório, adaptada, e tira do pecas.js', { timeout: 60000 }, async (t) => {
  const arq = path.join(RAIZ, 'scripts', 'promover.mjs');
  if (!fs.existsSync(arq)) return t.skip('promover só existe no repositório do mantenedor');
  const { promover, tirarEntrada } = await import(pathToFileURL(arq).href);
  // estúdio de mentira: cópia do motor, catálogo e o three.js do estúdio
  const r = path.join(tmp, 'estudio');
  fs.cpSync(path.join(RAIZ, 'src', 'video', 'engine'), path.join(r, 'src', 'video', 'engine'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, 'src', 'video', 'formas.json'), path.join(r, 'src', 'video', 'formas.json'));
  fs.symlinkSync(path.join(RAIZ, 'node_modules'), path.join(r, 'node_modules'), 'dir');
  fs.mkdirSync(path.join(r, 'projetos', 'p'), { recursive: true });
  fs.writeFileSync(path.join(r, 'projetos', 'p', 'pecas.js'), PECAS);
  await assert.rejects(promover({ raiz: r, projeto: 'p', peca: 'nao-tem', catalogo: false }), /não tem a peça/);
  await assert.rejects(promover({ raiz: r, projeto: 'p', peca: 'caixa-local', grupo: 'inexistente', catalogo: false }), /Grupo "inexistente" não existe/);
  const res = await promover({ raiz: r, projeto: 'p', peca: 'caixa-local', grupo: 'geral', catalogo: false });
  assert.ok(res.removida);
  const local = fs.readFileSync(path.join(r, 'projetos', 'p', 'pecas.js'), 'utf8');
  assert.doesNotMatch(local, /caixa-local/);
  assert.match(local, /galpao-local/, 'o cenário continua no projeto');
  const { REPERTORIO } = await import(pathToFileURL(path.join(r, 'src', 'video', 'engine', 'repertorio', 'index.js')).href);
  assert.equal(typeof REPERTORIO['caixa-local'], 'function');
  const THREE = await import('three');
  const mat = () => new THREE.MeshStandardMaterial();
  const g = REPERTORIO['caixa-local']({ frente: mat(), sombra: mat(), destaque: mat(), apoio: mat(), ativo: mat(), apagado: mat() }, {}, mat());
  assert.ok(g.isGroup && g.children.length >= 2 && typeof g.userData.anima === 'function');
  await assert.rejects(promover({ raiz: r, projeto: 'p', peca: 'caixa-local', catalogo: false }), /não tem a peça/);
  // peça que depende de helper do topo do arquivo não é promovida
  fs.writeFileSync(path.join(r, 'projetos', 'p', 'pecas.js'), "const ajuda = (k) => new k.THREE.Group();\nexport const pecas = { 'dep-local': (kit) => ajuda(kit) };\n");
  await assert.rejects(promover({ raiz: r, projeto: 'p', peca: 'dep-local', catalogo: false }), /não funciona fora do pecas\.js/);
  // tirarEntrada: arrow com nome entre aspas e método abreviado
  assert.equal(tirarEntrada("export const pecas = {\n  'a-b': (k) => 1,\n  c: (k) => 2,\n};\n", 'a-b', '(k) => 1'), 'export const pecas = {\n  c: (k) => 2,\n};\n');
  assert.equal(tirarEntrada("export const pecas = {\n  c(k) { return 2; },\n  d: (k) => 3,\n};\n", 'c', 'c(k) { return 2; }'), 'export const pecas = {\n  d: (k) => 3,\n};\n');
});

test('lint: roteiro político sem atribuição ganha aviso (sem mudar a nota); com atribuição, não', () => {
  const sem = 'O presidente e o Congresso brigam pela PEC. São 513 deputados e 81 senadores. Mas o governo perdeu.';
  const com = 'Segundo a Câmara, o presidente e o Congresso brigam pela PEC. São 513 deputados e 81 senadores. Mas o governo perdeu.';
  const a = lintarRoteiro(sem), b = lintarRoteiro(com);
  assert.ok(a.avisos.some((x) => /tema político.*sem atribuição/.test(x)));
  assert.ok(!b.avisos.some((x) => /tema político/.test(x)));
  assert.ok(!a.problemas.some((x) => /político/.test(x)), 'só avisa, não reprova');
  assert.ok(!lintarRoteiro('Um bueiro quadrado pode engolir a tampa. São 40 por cento.').avisos.some((x) => /político/.test(x)));
});

test('linha editorial: padrão neutra e pergunta; grava, lê e recusa valor inválido', () => {
  const r = path.join(tmp, 'linha'); fs.mkdirSync(r, { recursive: true });
  assert.deepEqual(lerLinha(r), { politica: 'neutra', intensidade: 'leve', perguntar: true });
  fs.writeFileSync(path.join(r, 'ilustrando.config.json'), JSON.stringify({ voz: 'mock', linhaEditorial: { politica: 'neutra', intensidade: 'leve', perguntar: true } }));
  assert.equal(lerLinha(r).perguntar, true);
  gravarLinha('Direita', 'leve', r);
  const c = JSON.parse(fs.readFileSync(path.join(r, 'ilustrando.config.json'), 'utf8'));
  assert.deepEqual(c.linhaEditorial, { politica: 'direita', intensidade: 'leve' });
  assert.equal(c.voz, 'mock', 'o resto do config fica');
  assert.deepEqual(lerLinha(r), { politica: 'direita', intensidade: 'leve', perguntar: false });
  assert.throws(() => gravarLinha('extrema', 'leve', r), /não existe/);
  assert.throws(() => gravarLinha('centro', 'forte', r), /Intensidade/);
  const nossa = lerLinha(RAIZ);
  assert.ok(['neutra', 'esquerda', 'centro', 'direita'].includes(nossa.politica));
});

test('buscar-imagem: só licença livre, fonte registrada sem duplicar, backoff em 429 e User-Agent sem dado pessoal', async () => {
  const meta = (curta, cod) => ({ LicenseShortName: { value: curta }, License: { value: cod } });
  assert.ok(licencaLivre(meta('CC BY-SA 4.0', 'cc-by-sa-4.0')));
  assert.ok(licencaLivre(meta('Public domain', 'pd')));
  assert.ok(licencaLivre(meta('CC0', 'cc0')));
  assert.ok(!licencaLivre(meta('CC BY-NC 2.0', 'cc-by-nc-2.0')));
  assert.ok(!licencaLivre(meta('', '')));
  assert.doesNotMatch(USER_AGENT, /@/);
  assert.equal(slug('Urna Eletrônica 2022!'), 'urna-eletronica-2022');

  const pagina = { title: 'File:Urna.jpg', index: 1, imageinfo: [{ thumburl: 'https://upload.example/u.jpg', thumbmime: 'image/jpeg', thumbwidth: 1280, thumbheight: 853, descriptionurl: 'https://commons.wikimedia.org/wiki/File:Urna.jpg', extmetadata: { ...meta('Public domain', 'pd'), Artist: { value: '<a href="x">TSE</a>' } } }] };
  let chamadas = 0;
  const falso = async (url, op) => {
    chamadas++;
    assert.equal(op.headers['user-agent'], USER_AGENT);
    if (chamadas === 1) return { ok: false, status: 429, headers: { get: () => '0' } };
    if (/wbsearchentities/.test(url)) return { ok: true, json: async () => ({ search: [{ id: 'Q1' }] }) };
    if (/wbgetentities/.test(url)) return { ok: true, json: async () => ({ entities: { Q1: { labels: { pt: { value: 'Órgão' } }, claims: { P154: [{ rank: 'normal', mainsnak: { datavalue: { value: 'Urna.jpg' } } }] } } } }) };
    return { ok: true, json: async () => ({ query: { pages: [pagina] } }) };
  };
  const pedir = clienteEducado({ fetch: falso, intervaloMs: 1, esperaMs: 1 });
  const fotos = await buscarFotos(pedir, 'urna', { fonte: 'agenciabrasil' });
  assert.equal(chamadas, 2, 'repetiu depois do 429');
  assert.equal(fotos[0].autor, 'TSE');
  assert.ok(fotos[0].livre);
  const logos = await buscarLogos(pedir, 'órgão');
  assert.equal(logos[0].titulo, 'Urna.jpg');
  await assert.rejects(buscarFotos(pedir, 'x', { fonte: 'outra' }), /não existe/);
  // erro 404 não insiste
  let n404 = 0;
  await assert.rejects(clienteEducado({ fetch: async () => { n404++; return { ok: false, status: 404, headers: { get: () => null } }; }, intervaloMs: 1, esperaMs: 1 })('https://x.org/a'), /404/);
  assert.equal(n404, 1);

  const p = path.join(tmp, 'img'); fs.mkdirSync(p, { recursive: true });
  fs.writeFileSync(path.join(p, 'fontes.md'), '# Fontes: x\n- Número: fonte A.\n\n## Outra\n- y\n');
  const reg = registroDe(pagina);
  registrarFonte(p, linhaFonte('assets/urna.jpg', reg, { data: '2026-10-18' }), 'assets/urna.jpg');
  registrarFonte(p, linhaFonte('assets/urna.jpg', reg, { data: '2026-10-18' }), 'assets/urna.jpg');
  const f = fs.readFileSync(path.join(p, 'fontes.md'), 'utf8');
  assert.equal(f.match(/assets\/urna\.jpg:/g).length, 1, 'não duplica');
  assert.match(f, /## Imagens\n- assets\/urna\.jpg: foto "Urna\.jpg", autor TSE, licença Public domain/);
  assert.match(f, /- Número: fonte A\./, 'o resto do fontes.md fica');
  assert.doesNotMatch(f, / — /);
});
