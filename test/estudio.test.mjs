/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { lerEnv, gravarEnv, validarValor, vozPronta } from '../src/estudio/configlocal.mjs';
import { estudio, listarVideos, acharZips } from '../src/estudio/servidor.mjs';
import { traduzirErro, traduzir } from '../src/video/erros.mjs';

/**
 * Estúdio web como painel sem Terminal: chaves entram e nunca saem, só o endereço local fala com ele, cada POST
 * exige o token, e os erros chegam em português com o que fazer. Usa uma pasta temporária como raiz (nada do
 * estúdio de verdade é alterado).
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-est-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const CHAVE = 'ilutestechave' + '0a1b2c3d4e'.repeat(3);

function raizFalsa(nome) {
  const r = path.join(tmp, nome);
  fs.mkdirSync(path.join(r, 'marca'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, '.env.exemplo'), path.join(r, '.env.exemplo'));
  fs.copyFileSync(path.join(RAIZ, 'marca', 'tokens.json'), path.join(r, 'marca', 'tokens.json'));
  fs.cpSync(path.join(RAIZ, 'modelos'), path.join(r, 'modelos'), { recursive: true, filter: (f) => !f.includes(`${path.sep}meus`) });
  fs.mkdirSync(path.join(r, 'templates', 'identidades'), { recursive: true });
  fs.copyFileSync(path.join(RAIZ, 'templates', 'identidades', 'presets.json'), path.join(r, 'templates', 'identidades', 'presets.json'));
  fs.writeFileSync(path.join(r, 'ilustrando.config.json'), JSON.stringify({ voz: 'mock', modeloPadrao: 'curiosidades', perguntarModelo: true, linhaEditorial: { politica: 'neutra', intensidade: 'leve', perguntar: true } }, null, 2));
  fs.writeFileSync(path.join(r, 'VERSAO'), '9.9.9\n');
  fs.writeFileSync(path.join(r, 'LICENCA.md'), 'Termos de teste.\n');
  return r;
}

function pedir(porta, rota, { metodo = 'GET', corpo = null, token = null, host = `127.0.0.1:${porta}` } = {}) {
  return new Promise((ok, falha) => {
    const dados = corpo == null ? null : Buffer.from(JSON.stringify(corpo));
    const req = http.request({ host: '127.0.0.1', port: porta, path: rota, method: metodo, headers: { host, ...(token ? { 'x-token': token } : {}), ...(dados ? { 'content-type': 'application/json', 'content-length': dados.length } : {}) } }, (res) => {
      let t = ''; res.on('data', (c) => (t += c)); res.on('end', () => ok({ status: res.statusCode, texto: t, json: (() => { try { return JSON.parse(t); } catch { return null; } })() }));
    });
    req.on('error', falha);
    if (dados) req.write(dados);
    req.end();
  });
}

test('.env: grava a chave sem nunca devolver o valor; valida o que foi colado', () => {
  const r = raizFalsa('env');
  assert.deepEqual(lerEnv(r).definidas, {});
  const g = gravarEnv({ ILU_VOZ: 'elevenlabs', ELEVENLABS_API_KEY: CHAVE, ELEVENLABS_VOICE_ID: 'abcDEF123456' }, r);
  assert.deepEqual(g, ['ILU_VOZ', 'ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID']);
  const e = lerEnv(r);
  assert.equal(e.voz, 'elevenlabs');
  assert.equal(e.definidas.ELEVENLABS_API_KEY, true);
  assert.ok(!JSON.stringify(e).includes(CHAVE), 'lerEnv nunca devolve o valor');
  const txt = fs.readFileSync(path.join(r, '.env'), 'utf8');
  assert.ok(txt.includes(`ELEVENLABS_API_KEY=${CHAVE}`) && txt.includes('Nunca envie este arquivo'), 'mantém os comentários do modelo');
  if (process.platform !== 'win32') assert.equal(fs.statSync(path.join(r, '.env')).mode & 0o777, 0o600);
  // campo vazio não apaga a chave que já existe
  gravarEnv({ ELEVENLABS_API_KEY: '' }, r);
  assert.ok(fs.readFileSync(path.join(r, '.env'), 'utf8').includes(CHAVE));
  assert.ok(vozPronta('elevenlabs', lerEnv(r)));
  assert.ok(!vozPronta('fishaudio', lerEnv(r)));
  assert.throws(() => validarValor('ELEVENLABS_API_KEY', 'curta'), /não parece uma chave/);
  assert.throws(() => validarValor('FISH_API_KEY', 'abc\nOUTRA=1'), /quebra de linha/);
  assert.throws(() => validarValor('PATH', '/bin'), /não grava/);
  assert.throws(() => validarValor('ILU_VOZ', 'qualquer'), /desconhecida/);
});

test('estúdio web: só o endereço local, token em todo POST, chave entra e não volta', async () => {
  const r = raizFalsa('srv');
  const e = await estudio({ raiz: r });
  try {
    const pg = await pedir(e.porta, '/');
    assert.equal(pg.status, 200);
    const token = /const TOKEN = '([0-9a-f]{32})'/.exec(pg.texto)[1];
    assert.equal((await pedir(e.porta, '/api/configuracao', { host: 'site-malicioso.com' })).status, 403, 'Host diferente é recusado');
    // proxy/navegador às vezes manda Host sem a porta: continua local, e a resposta é JSON (senão a página achava que o estúdio fechou)
    const localSemPorta = await pedir(e.porta, '/api/ping', { host: 'localhost' });
    assert.equal(localSemPorta.status, 200, 'Host localhost sem porta é o endereço local');
    assert.equal(localSemPorta.json?.ilustrando, true);
    const foraJson = await pedir(e.porta, '/api/ping', { host: 'evil.example' });
    assert.equal(foraJson.status, 403);
    assert.ok(foraJson.json && foraJson.json.erro, '403 de Host vem em JSON para a página não confundir com queda');
    assert.equal((await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'mock' } })).status, 403, 'POST sem token é recusado');
    assert.equal((await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'mock' }, token: 'f'.repeat(32) })).status, 403);

    const c0 = (await pedir(e.porta, '/api/configuracao')).json;
    assert.equal(c0.voz.escolhida, false);
    assert.equal(c0.pronto.pagina, false);
    assert.equal(c0.tudoPronto, false);

    const v = await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'fishaudio', chave: CHAVE, gratis: true }, token });
    assert.equal(v.status, 200, v.texto);
    assert.equal(v.json.ok, true);
    assert.ok(!v.texto.includes(CHAVE));
    const c1 = await pedir(e.porta, '/api/configuracao');
    assert.ok(!c1.texto.includes(CHAVE), 'a configuração nunca traz a chave');
    assert.equal(c1.json.voz.atual, 'fishaudio');
    assert.equal(c1.json.voz.definidas.FISH_API_KEY, true);
    assert.equal(c1.json.voz.fishGratis, true);
    assert.equal(c1.json.pronto.voz, true);
    assert.equal(JSON.parse(fs.readFileSync(path.join(r, 'ilustrando.config.json'), 'utf8')).voz, 'fishaudio');

    const ruim = await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'elevenlabs', chave: 'curta' }, token });
    assert.equal(ruim.status, 400);
    assert.match(ruim.json.erro.causa, /não parece uma chave/);
    const falta = await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'elevenlabs', chave: CHAVE }, token });
    assert.equal(falta.json.ok, false);
    assert.deepEqual(falta.json.falta, ['o ID da voz (Voice ID)']);

    const m = await pedir(e.porta, '/api/modelo', { metodo: 'POST', corpo: { id: 'financas' }, token });
    assert.equal(m.json.id, 'financas');
    const l = await pedir(e.porta, '/api/linha', { metodo: 'POST', corpo: { politica: 'centro', intensidade: 'leve' }, token });
    assert.equal(l.json.politica, 'centro');
    const c2 = (await pedir(e.porta, '/api/configuracao')).json;
    assert.equal(c2.modelo.padrao, 'financas');
    assert.equal(c2.pronto.pagina, true);

    const mods = (await pedir(e.porta, '/api/modelos')).json;
    assert.ok(mods.length >= 12 && mods.every((x) => x.id && x.nome));
    assert.ok(Object.keys((await pedir(e.porta, '/api/presets')).json).length >= 8);
    assert.equal((await pedir(e.porta, '/api/marca', { metodo: 'POST', corpo: { nome: 'X', handle: '@x x!', cor: '#FF0000' }, token })).status, 400);
    assert.equal((await pedir(e.porta, '/api/marca', { metodo: 'POST', corpo: { nome: 'Pílula', handle: '@pilula', cor: 'vermelho' }, token })).status, 400);
    assert.equal((await pedir(e.porta, '/api/testar', { metodo: 'POST', corpo: {}, token })).status, 400, 'sem projetos/exemplo, explica');
    assert.equal((await pedir(e.porta, '/api/atualizar', { metodo: 'POST', corpo: { id: 'naoexiste' }, token })).status, 400);
    assert.equal((await pedir(e.porta, '/baixar/..%2F..%2Fetc')).status, 404);
    assert.equal((await pedir(e.porta, '/marca-img/saida/..%2F.env')).status, 404);
    assert.match((await pedir(e.porta, '/licenca.txt')).texto, /open-source/i);
    const lic = await pedir(e.porta, '/api/licenca/ativar', { metodo: 'POST', corpo: { email: 'a@b.com', chave: 'x', aceito: false }, token });
    assert.equal(lic.status, 200);
    assert.equal(lic.json.ok, true);
    assert.equal(lic.json.openSource, true);
  } finally { e.fechar(); }
});

test('meus vídeos: lista o mp4 final antes da prévia, com capa, legenda e se é teste', () => {
  const r = path.join(tmp, 'vids');
  const s = path.join(r, 'projetos', 'meu-video', 'saida');
  fs.mkdirSync(s, { recursive: true });
  fs.writeFileSync(path.join(s, 'previa.mp4'), 'x');
  fs.writeFileSync(path.join(s, 'meu-video.mp4'), 'xx');
  fs.writeFileSync(path.join(s, 'entrega.json'), JSON.stringify({ voz: 'elevenlabs', aprovado: true }));
  fs.writeFileSync(path.join(r, 'projetos', 'meu-video', 'post.md'), 'legenda');
  fs.mkdirSync(path.join(r, 'projetos', 'sem-video'), { recursive: true });
  const vs = listarVideos(r);
  assert.equal(vs.length, 1);
  assert.equal(vs[0].arquivo, 'meu-video.mp4');
  assert.equal(vs[0].legenda, true);
  assert.equal(vs[0].teste, false);
  assert.equal(vs[0].titulo, 'Meu video');
});

test('atualizar: acha o .zip baixado em Downloads e ao lado da pasta', () => {
  const casa = path.join(tmp, 'casa');
  fs.mkdirSync(path.join(casa, 'Downloads'), { recursive: true });
  fs.writeFileSync(path.join(casa, 'Downloads', 'ilustrando-metodo-v0.3.0-C-abc.zip'), 'PK');
  fs.writeFileSync(path.join(casa, 'Downloads', 'outra-coisa.zip'), 'PK');
  const studio = path.join(casa, 'ilustrando'); fs.mkdirSync(studio);
  fs.writeFileSync(path.join(casa, 'ilustrando-metodo-v0.2.1.zip'), 'PK');
  const zs = acharZips({ casa, raiz: studio });
  assert.deepEqual(zs.map((z) => z.versao).sort(), ['0.2.1', '0.3.0']);
  assert.ok(zs.every((z) => /^[0-9a-f]{16}$/.test(z.id)));
});

test('erros traduzidos: causa e o que fazer, sem mandar abrir o Terminal', () => {
  const casos = [
    ['Fish Audio recusou a chave (401). Confira a chave no .env', /recusou a chave/],
    ['Error: spawnSync ffmpeg ENOENT', /FFmpeg/],
    ["browserType.launch: Executable doesn't exist at /x/chrome", /navegador/],
    ['Faltam ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID (veja .env.exemplo).', /chave da voz/],
    ['ENOSPC: no space left on device', /disco/],
    ['Sem conexão com o servidor de licenças.', /internet/],
    ['Esta licença já está ativa em 2 computador(es), o limite: a, b.', /máximo de computadores/],
    ['O pacote de atualização não é oficial ou foi alterado (a assinatura não confere).', /oficial/],
    ['Roteiro com nota 52', /corretor/],
  ];
  for (const [t, re] of casos) {
    const r = traduzirErro(t);
    assert.ok(r, `não traduziu: ${t}`);
    assert.match(r.causa, re, t);
    assert.ok(!/\bnpm |npx |brew |winget |pip install/.test(r.acao), `ação técnica demais para: ${t} -> ${r.acao}`);
  }
  assert.equal(traduzirErro('algo totalmente novo'), null);
  assert.match(traduzir(new Error('spawn ffmpeg ENOENT')), /O que fazer: /);
});

test('estúdio web: pedaço de vídeo fora do arquivo responde 416 e o estúdio continua de pé', async () => {
  const r = raizFalsa('range');
  const saida = path.join(r, 'projetos', 'teste', 'saida');
  fs.mkdirSync(saida, { recursive: true });
  fs.writeFileSync(path.join(r, 'projetos', 'teste', 'roteiro.md'), '# teste\n');
  fs.writeFileSync(path.join(saida, 'teste.mp4'), Buffer.alloc(1000, 7));
  const e = await estudio({ raiz: r });
  try {
    const pedaco = (range) => new Promise((ok, falha) => {
      const req = http.request({ host: '127.0.0.1', port: e.porta, path: '/midia/teste/video', headers: { host: `127.0.0.1:${e.porta}`, range } }, (res) => { let n = 0; res.on('data', (c) => (n += c.length)); res.on('end', () => ok({ status: res.statusCode, cr: res.headers['content-range'], n })); res.on('error', () => ok({ status: res.statusCode, erro: true })); });
      req.on('error', falha); req.end();
    });
    // vídeo refeito menor com o player aberto: antes o 206 saía, o stream falhava e o processo caía (ERR_HTTP_HEADERS_SENT)
    assert.equal((await pedaco('bytes=5000-')).status, 416);
    assert.equal((await pedaco('bytes=999-998')).status, 416);
    const fim = await pedaco('bytes=-100');
    assert.equal(fim.status, 206); assert.equal(fim.cr, 'bytes 900-999/1000', '"bytes=-N" são os últimos N bytes'); assert.equal(fim.n, 100);
    const meio = await pedaco('bytes=10-19');
    assert.equal(meio.status, 206); assert.equal(meio.n, 10);
    assert.equal((await pedir(e.porta, '/api/ping')).status, 200, 'o estúdio continua respondendo');
    assert.equal((await pedir(e.porta, '/fonts/%E0%A4%A')).status, 400, 'endereço malformado: 400, sem texto técnico em inglês');
  } finally { e.fechar(); }
});

test('servidor do motor (prévia e render): endereço malformado não derruba o processo e Host de fora é recusado', async () => {
  const { servir } = await import('../src/video/servidor.mjs');
  const s = await servir({ beats: [] });
  try {
    const bruto = (rota, host = `127.0.0.1:${s.porta}`) => new Promise((ok, falha) => { const req = http.request({ host: '127.0.0.1', port: s.porta, path: rota, headers: { host } }, (res) => { res.resume(); res.on('end', () => ok(res.statusCode)); }); req.on('error', falha); req.end(); });
    assert.equal(await bruto('/%E0%A4%A'), 400);
    assert.equal(await bruto('/spec.json', 'evil.example'), 403, 'DNS rebinding: só o endereço local');
    assert.equal(await bruto('/spec.json'), 200, 'continua de pé');
  } finally { s.fechar(); }
});

test('estúdio web: salvar a voz sem a chave não troca a voz padrão; chave colada com espaço é limpa', async () => {
  const r = raizFalsa('voz');
  const e = await estudio({ raiz: r });
  try {
    const pg = await pedir(e.porta, '/');
    const token = /const TOKEN = '([0-9a-f]{32})'/.exec(pg.texto)?.[1] || /([0-9a-f]{32})/.exec(pg.texto)[1];
    const v = await pedir(e.porta, '/api/voz', { metodo: 'POST', corpo: { voz: 'elevenlabs', chave: '', vozId: '' }, token });
    assert.equal(v.json.ok, false);
    assert.equal(JSON.parse(fs.readFileSync(path.join(r, 'ilustrando.config.json'), 'utf8')).voz, 'mock', 'continua na voz que funcionava');
    assert.notEqual(lerEnv(r).voz, 'elevenlabs');
  } finally { e.fechar(); }
  assert.equal(validarValor('ELEVENLABS_API_KEY', 'chave teste\u200b0123456789'), 'chaveteste0123456789');
  assert.equal(validarValor('ELEVENLABS_VOICE_ID', 'abcDEF 123456'), 'abcDEF123456');
});

test('configuração com BOM (Bloco de Notas do Windows) é lida; JSON quebrado explica em português', async () => {
  const { lerConfig, gravarVozConfig } = await import('../src/estudio/configlocal.mjs');
  const r = raizFalsa('bom');
  const f = path.join(r, 'ilustrando.config.json');
  fs.writeFileSync(f, '\uFEFF' + JSON.stringify({ voz: 'mock', extra: 1 }));
  assert.equal(lerConfig(f).extra, 1);
  gravarVozConfig('elevenlabs', r);
  assert.equal(lerConfig(f).voz, 'elevenlabs');
  fs.writeFileSync(f, '{ quebrado');
  assert.throws(() => lerConfig(f), /configurações do estúdio.*com defeito/);
});
