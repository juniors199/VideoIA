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
import { novidade, compararVersoes, limparResposta, UM_DIA } from '../src/estudio/novidade.mjs';
import { estudio } from '../src/estudio/servidor.mjs';

/**
 * Aviso de versão nova no estúdio web: consulta GET /v1/versao no máximo uma vez por dia, em silêncio quando a rede
 * falha, sem mandar dado pessoal, e só avisa quando a versão do servidor é maior que a instalada.
 */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-nov-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
let n = 0;
const raiz = (versao = '0.3.0') => { const r = path.join(tmp, 'r' + n++); fs.mkdirSync(r); fs.writeFileSync(path.join(r, 'VERSAO'), versao + '\n'); return r; };
const SERV = 'https://licencas.exemplo.com';
const resposta = (j) => ({ versao: '0.4.0', data: '2026-10-20', resumo: '14 estilos de vídeo', areaMembros: 'https://dashboard.kiwify.com.br/', ...j });
function fetchFalso(corpo, { status = 200, falha = false } = {}) {
  const chamadas = [];
  const f = async (url, opc = {}) => { chamadas.push({ url, opc }); if (falha) throw new Error('sem rede'); return new Response(JSON.stringify(corpo), { status }); };
  return { f, chamadas };
}

test('versões: compara como números', () => {
  assert.equal(compararVersoes('0.10.0', '0.9.9'), 1);
  assert.equal(compararVersoes('0.4.0', '0.4.0'), 0);
  assert.equal(compararVersoes('0.3.9', '0.4.0'), -1);
  assert.equal(compararVersoes('1.0.0', '0.99.99'), 1);
});

test('novidade: avisa versão maior, com resumo e área de membros; só GET /v1/versao, sem dado pessoal', async () => {
  const r = raiz('0.3.0');
  const { f, chamadas } = fetchFalso(resposta());
  const x = await novidade({ raiz: r, servidorUrl: SERV + '/', fetch: f, agora: 1000 });
  assert.deepEqual(x, { nova: true, instalada: '0.3.0', versao: '0.4.0', data: '2026-10-20', resumo: '14 estilos de vídeo', areaMembros: 'https://dashboard.kiwify.com.br/' });
  assert.equal(chamadas.length, 1);
  assert.equal(chamadas[0].url, SERV + '/v1/versao', 'sem parâmetros: não manda a versão instalada nem nada da pessoa');
  assert.equal(chamadas[0].opc.method, undefined, 'GET');
  assert.ok(chamadas[0].opc.signal, 'com tempo limite');
  assert.deepEqual(Object.keys(chamadas[0].opc.headers), ['accept']);
});

test('novidade: mesma versão ou mais velha não avisa', async () => {
  for (const [inst, srv] of [['0.4.0', '0.4.0'], ['0.5.0', '0.4.0']]) {
    const { f } = fetchFalso(resposta({ versao: srv }));
    assert.equal((await novidade({ raiz: raiz(inst), servidorUrl: SERV, fetch: f })).nova, false);
  }
});

test('novidade: no máximo uma consulta por dia (cache em .atualizacao), inclusive quando a rede falha', async () => {
  const r = raiz('0.3.0');
  const rede = fetchFalso(null, { falha: true });
  assert.deepEqual(await novidade({ raiz: r, servidorUrl: SERV, fetch: rede.f, agora: 0 }), { nova: false, instalada: '0.3.0' });
  const ok = fetchFalso(resposta());
  assert.equal((await novidade({ raiz: r, servidorUrl: SERV, fetch: ok.f, agora: UM_DIA - 1 })).nova, false, 'falha fica guardada o dia todo');
  assert.equal(ok.chamadas.length, 0);
  assert.equal((await novidade({ raiz: r, servidorUrl: SERV, fetch: ok.f, agora: UM_DIA + 1 })).nova, true, 'no dia seguinte consulta de novo');
  assert.equal((await novidade({ raiz: r, servidorUrl: SERV, fetch: ok.f, agora: UM_DIA + 5000 })).versao, '0.4.0');
  assert.equal(ok.chamadas.length, 1);
  assert.ok(fs.existsSync(path.join(r, '.atualizacao', 'novidade.json')));
  // atualizou para a 0.4.0: o mesmo cache já não avisa
  fs.writeFileSync(path.join(r, 'VERSAO'), '0.4.0\n');
  assert.equal((await novidade({ raiz: r, servidorUrl: SERV, fetch: ok.f, agora: UM_DIA + 6000 })).nova, false);
});

test('novidade: servidor fora do ar, resposta estranha ou pacote sem servidor ficam em silêncio', async () => {
  assert.equal((await novidade({ raiz: raiz(), servidorUrl: SERV, fetch: fetchFalso({}, { status: 500 }).f })).nova, false);
  assert.equal((await novidade({ raiz: raiz(), servidorUrl: SERV, fetch: fetchFalso({ versao: '<b>9</b>' }).f })).nova, false);
  const sem = fetchFalso(resposta());
  assert.equal((await novidade({ raiz: raiz(), servidorUrl: null, fetch: sem.f })).nova, false);
  assert.equal(sem.chamadas.length, 0);
  // demora mais que o tempo limite: desiste
  // (o intervalo só mantém o processo do teste vivo; o timer do AbortSignal.timeout não segura o processo sozinho)
  const lento = (url, opc) => new Promise((_, falha) => { const vivo = setInterval(() => {}, 20); opc.signal.addEventListener('abort', () => { clearInterval(vivo); falha(new Error('tempo')); }); });
  const t0 = Date.now();
  assert.equal((await novidade({ raiz: raiz(), servidorUrl: SERV, fetch: lento, tempo: 50 })).nova, false);
  assert.ok(Date.now() - t0 < 2000);
  // link que não é https e resumo com HTML são limpos
  assert.deepEqual(limparResposta(resposta({ areaMembros: 'javascript:alert(1)', resumo: '<img src=x>novo' })), { versao: '0.4.0', data: '2026-10-20', resumo: 'img src=xnovo', areaMembros: null });
});

test('estúdio web: /api/novidade responde e nunca quebra; a página mostra o aviso e leva à aba Atualizar', async () => {
  const srvFalso = http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify(req.url === '/v1/versao' ? resposta() : {})); });
  await new Promise((ok) => srvFalso.listen(0, '127.0.0.1', ok));
  const r = raiz('0.3.0');
  const e = await estudio({ raiz: r, servidorNovidade: `http://127.0.0.1:${srvFalso.address().port}` });
  const e2 = await estudio({ raiz: raiz('0.3.0'), servidorNovidade: 'http://127.0.0.1:9' });
  try {
    const pedir = (porta, rota) => new Promise((ok, falha) => http.get({ host: '127.0.0.1', port: porta, path: rota, headers: { host: `127.0.0.1:${porta}` } }, (res) => { let t = ''; res.on('data', (c) => (t += c)); res.on('end', () => ok({ status: res.statusCode, t })); }).on('error', falha));
    const a = await pedir(e.porta, '/api/novidade');
    assert.equal(a.status, 200);
    assert.equal(JSON.parse(a.t).versao, '0.4.0');
    assert.equal(JSON.parse(a.t).nova, true);
    const b = await pedir(e2.porta, '/api/novidade');
    assert.equal(JSON.parse(b.t).nova, false, 'sem servidor: silêncio');
    const pg = (await pedir(e.porta, '/')).t;
    assert.match(pg, /id="novidade"[^>]*hidden/);
    assert.match(pg, /Nova versão <b id="novVersao"><\/b> disponível/);
    assert.match(pg, /id="novComo">Como atualizar</);
    assert.match(pg, /novComo'\)\.onclick = \(\) => \{ mostrar\('atualizar'\)/);
  } finally { e.fechar(); e2.fechar(); srvFalso.close(); }
});
