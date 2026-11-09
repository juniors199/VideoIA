/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { estado, ativar, desativar, maquina, maquinaAntiga, lerChave, direitoAtualizacoes, cobre, textoAtualizacoes, somarMeses } from '../src/licenca/licenca.mjs';
import { hashEmail } from '../src/licenca/cripto.mjs';
import { marcarPngBuffer, textoPng, marcarJpegBuffer, comentarioJpeg } from '../src/licenca/metadados.mjs';
import { prepararSelo, selarVideo, textoSelo } from '../src/licenca/selo.mjs';
import { montarManifesto, mensagemAssinada, conferir, conferirMotor, classe, compararVersao } from '../src/pacote/integridade.mjs';
import { lerZip, extrairZip, crc32 } from '../src/pacote/zip.mjs';
import { atualizar, desfazer, mesclarConfig, mensagemForaDoPrazo } from '../src/pacote/atualizar.mjs';

/**
 * Licença, integridade, metadados e atualização. Usa um par de chaves de TESTE gerado aqui (a chave real do
 * servidor nunca entra nos testes) e um servidor falso (fetch simulado). Roda igual no repositório e no pacote.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-lic-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const pasta = (n) => { const d = path.join(tmp, n); fs.mkdirSync(d, { recursive: true }); return d; };

const { privateKey, publicKey } = crypto.generateKeyPairSync('ed25519');
const PUB = publicKey.export({ format: 'jwk' }).x;
const b64 = (x) => Buffer.from(x).toString('base64url');
const assinar = (dominio, prefixo, obj) => { const p = b64(JSON.stringify(obj)); return `${prefixo}${p}.${b64(crypto.sign(null, Buffer.from(dominio + p), privateKey))}`; };
const DIA = 864e5;
const EMAIL = 'compradora@exemplo.com';
const chave = assinar('ILU1-LIC.', 'ILU1-', { v: 1, id: 'L-TESTE', e: hashEmail(EMAIL).slice(0, 32), m: 2, p: 'metodo', c: '2026-10-18' });
const comprovante = (em, extra = {}) => assinar('ILU1-ATV.', 'ATV1-', { v: 1, id: 'L-TESTE', maq: maquina(), pac: 'C-x', em: new Date(em).toISOString(), rev: 7, tol: 14, n: 1, max: 2, ...extra });
const gravarLic = (raiz, dados) => { fs.mkdirSync(path.join(raiz, '.licenca'), { recursive: true }); fs.writeFileSync(path.join(raiz, '.licenca', 'licenca.json'), JSON.stringify(dados)); };
const semRede = async () => { throw new TypeError('fetch failed'); };
const servidorFalso = (resp, status = 200) => async () => new Response(JSON.stringify(resp), { status });
const base = (raiz, extra = {}) => ({ raiz, exigir: true, chavePublica: PUB, url: 'https://licencas.teste', fetch: semRede, ...extra });

test('licença: sem ativação, ativa, outra máquina, tolerância sem internet e expirada', async () => {
  const agora = Date.parse('2026-10-18T12:00:00Z');
  const r = pasta('lic1');
  assert.equal((await estado(base(r, { agora }))).situacao, 'nao-ativada');
  assert.equal((await estado({ ...base(r), exigir: false })).situacao, 'dev');

  gravarLic(r, { chave, comprovante: comprovante(agora - 2 * DIA) });
  const a = await estado(base(r, { agora }));
  assert.equal(a.situacao, 'ativa');
  assert.equal(a.ativa, true);
  assert.equal(a.dias, 5);

  gravarLic(r, { chave, comprovante: comprovante(agora - DIA, { maq: 'f'.repeat(32) }) });
  assert.equal((await estado(base(r, { agora }))).situacao, 'outra-maquina');

  gravarLic(r, { chave, comprovante: comprovante(agora - 10 * DIA) });
  const t = await estado(base(r, { agora }));
  assert.equal(t.situacao, 'tolerancia');
  assert.equal(t.ativa, true);
  assert.equal(t.dias, 11);

  gravarLic(r, { chave, comprovante: comprovante(agora - 22 * DIA) });
  const e = await estado(base(r, { agora }));
  assert.equal(e.situacao, 'expirada');
  assert.equal(e.ativa, false);

  // comprovante forjado (assinado por outra chave) não vale
  const outra = crypto.generateKeyPairSync('ed25519').privateKey;
  const p = b64(JSON.stringify({ v: 1, id: 'L-TESTE', maq: maquina(), em: new Date(agora).toISOString(), rev: 7, tol: 14 }));
  gravarLic(r, { chave, comprovante: `ATV1-${p}.${b64(crypto.sign(null, Buffer.from('ILU1-ATV.' + p), outra))}` });
  assert.equal((await estado(base(r, { agora }))).situacao, 'nao-ativada');
});

test('licença: revalida online, detecta revogação e relógio voltando', async () => {
  const agora = Date.parse('2026-10-18T12:00:00Z');
  const r = pasta('lic2');
  gravarLic(r, { chave, comprovante: comprovante(agora - 8 * DIA) });
  const v = await estado(base(r, { agora, fetch: servidorFalso({ ok: true, comprovante: comprovante(agora) }) }));
  assert.equal(v.situacao, 'ativa');
  assert.match(v.mensagem, /conferida agora/);
  assert.equal(lerChave(chave, PUB).id, 'L-TESTE');
  // a revalidação gravou o comprovante novo: sem rede continua ativa
  assert.equal((await estado(base(r, { agora: agora + DIA }))).situacao, 'ativa');

  // relógio voltou 3 dias: exige internet
  assert.equal((await estado(base(r, { agora: agora - 3 * DIA }))).situacao, 'expirada');

  // servidor diz que foi revogada: fica revogada mesmo sem internet depois
  gravarLic(r, { chave, comprovante: comprovante(agora - 8 * DIA) });
  const rv = await estado(base(r, { agora, fetch: servidorFalso({ ok: false, codigo: 'revogada', mensagem: 'cancelada' }, 403) }));
  assert.equal(rv.situacao, 'revogada');
  assert.equal((await estado(base(r, { agora }))).situacao, 'revogada');
  // reativada pelo suporte: a próxima conferência online libera
  assert.equal((await estado(base(r, { agora, fetch: servidorFalso({ ok: true, comprovante: comprovante(agora) }) }))).situacao, 'ativa');
});

test('ativar: confere a chave e o e-mail antes de ir ao servidor e grava o comprovante', async () => {
  const r = pasta('lic3');
  // 0.6.42: chave que não confere NÃO prende quem tem e-mail: cai no modo e-mail (aqui sem rede, então para na conexão)
  await assert.rejects(ativar({ ...base(r), chave: 'ILU1-lixo.lixo', email: EMAIL, aceiteTermos: true }), /Sem conexão/);
  await assert.rejects(ativar({ ...base(r), chave, email: 'outra@exemplo.com', aceiteTermos: true }), /Sem conexão/);
  // sem e-mail válido não há como cair no modo e-mail: a mensagem de sempre
  await assert.rejects(ativar({ ...base(r), chave: 'ILU1-lixo.lixo', email: 'sem-arroba', aceiteTermos: true }), /Chave inválida/);
  await assert.rejects(ativar({ ...base(r), chave, email: EMAIL, aceiteTermos: false }), /aceite os termos/);
  await assert.rejects(ativar({ ...base(r), chave, email: EMAIL, aceiteTermos: true }), /Sem conexão/);
  let pedido = null;
  const f = async (url, opc) => { pedido = { url, corpo: JSON.parse(opc.body) }; return new Response(JSON.stringify({ ok: true, comprovante: comprovante(Date.now()), licenca: { maquinas: 1, max: 2 } })); };
  const ok = await ativar({ ...base(r, { fetch: f }), chave: ` ${chave}\n`, email: ' Compradora@Exemplo.com ', aceiteTermos: true });
  assert.equal(ok.id, 'L-TESTE');
  assert.equal(pedido.url, 'https://licencas.teste/v1/ativar');
  assert.equal(pedido.corpo.maquina, maquina());
  assert.equal(pedido.corpo.email, EMAIL);
  assert.equal((await estado(base(r))).situacao, 'ativa');
  if (process.platform !== 'win32') assert.equal(fs.statSync(path.join(r, '.licenca', 'licenca.json')).mode & 0o077, 0, 'arquivo da licença só do dono');
});

/** PNG mínimo 2x2 válido. */
function pngMinimo() {
  const blocoPng = (t, d) => { const tam = Buffer.alloc(4); tam.writeUInt32BE(d.length); const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([Buffer.from(t), d]))); return Buffer.concat([tam, Buffer.from(t), d, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(2, 0); ihdr.writeUInt32BE(2, 4); ihdr[8] = 8; ihdr[9] = 2;
  const cru = Buffer.from([0, 255, 0, 0, 0, 255, 0, 0, 0, 0, 255, 255, 255, 255]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), blocoPng('IHDR', ihdr), blocoPng('IDAT', zlib.deflateSync(cru)), blocoPng('IEND', Buffer.alloc(0))]);
}

test('metadados: PNG (tEXt) e JPEG (COM) com o ID, sem acumular e sem mudar a imagem', () => {
  const png = pngMinimo();
  const texto = textoSelo({ versao: '0.2.0', licenca: 'L-ABC', comprador: 'C-123456789abc' });
  const m1 = marcarPngBuffer(png, texto);
  assert.deepEqual(textoPng(m1), [{ chave: 'Comment', texto }]);
  const m2 = marcarPngBuffer(m1, texto.replace('L-ABC', 'L-XYZ'));
  assert.equal(textoPng(m2).length, 1, 'regravar troca, não acumula');
  assert.match(textoPng(m2)[0].texto, /L-XYZ/);
  // os dados da imagem (IDAT) continuam os mesmos
  const idat = (b) => b.subarray(b.indexOf('IDAT') - 4, b.indexOf('IEND'));
  assert.deepEqual(idat(m2).subarray(0, 20), idat(png).subarray(0, 20));
  const ff = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=red:s=16x16', '-frames:v', '1', '-f', 'mjpeg', 'pipe:1']);
  if (ff.status === 0) {
    const j = marcarJpegBuffer(marcarJpegBuffer(ff.stdout, texto), texto);
    assert.equal(comentarioJpeg(j), texto);
    assert.equal(j.length - ff.stdout.length, texto.length + 4);
    const dec = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-f', 'framemd5', '-'], { input: j });
    const dec0 = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-f', 'framemd5', '-'], { input: ff.stdout });
    assert.equal(dec.status, 0);
    assert.equal(dec.stdout.toString().split('\n').pop(), dec0.stdout.toString().split('\n').pop());
  }
});

/** Zip mínimo (stored ou deflate) para testar o leitor sem depender de programa externo. */
function zipDe(arquivos) {
  const locais = [], centrais = [];
  let off = 0;
  for (const [nome, conteudo, deflate] of arquivos) {
    const dados = Buffer.from(conteudo);
    const comp = deflate ? zlib.deflateRawSync(dados) : dados;
    const n = Buffer.from(nome);
    const l = Buffer.alloc(30); l.writeUInt32LE(0x04034b50, 0); l.writeUInt16LE(20, 4); l.writeUInt16LE(deflate ? 8 : 0, 8); l.writeUInt32LE(crc32(dados), 14); l.writeUInt32LE(comp.length, 18); l.writeUInt32LE(dados.length, 22); l.writeUInt16LE(n.length, 26);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 6); c.writeUInt16LE(deflate ? 8 : 0, 10); c.writeUInt32LE(crc32(dados), 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(dados.length, 24); c.writeUInt16LE(n.length, 28); c.writeUInt32LE(off, 42);
    locais.push(l, n, comp); centrais.push(c, n);
    off += 30 + n.length + comp.length;
  }
  const cd = Buffer.concat(centrais);
  const fim = Buffer.alloc(22); fim.writeUInt32LE(0x06054b50, 0); fim.writeUInt16LE(arquivos.length, 8); fim.writeUInt16LE(arquivos.length, 10); fim.writeUInt32LE(cd.length, 12); fim.writeUInt32LE(off, 16);
  return Buffer.concat([...locais, cd, fim]);
}

test('zip: lê stored e deflate, confere CRC e recusa caminho perigoso', () => {
  const z = zipDe([['a/b.txt', 'olá mundo', false], ['a/c.json', JSON.stringify({ x: 'y'.repeat(500) }), true]]);
  const es = lerZip(z);
  assert.deepEqual(es.map((e) => e.nome), ['a/b.txt', 'a/c.json']);
  assert.equal(es[0].ler().toString(), 'olá mundo');
  assert.equal(JSON.parse(es[1].ler()).x.length, 500);
  const dest = pasta('zip');
  fs.writeFileSync(path.join(dest, 'p.zip'), z);
  assert.equal(extrairZip(path.join(dest, 'p.zip'), path.join(dest, 'x')), 2);
  assert.equal(fs.readFileSync(path.join(dest, 'x', 'a', 'b.txt'), 'utf8'), 'olá mundo');
  assert.throws(() => lerZip(zipDe([['../fora.txt', 'x', false]])), /perigoso/);
  assert.throws(() => lerZip(zipDe([['/etc/x', 'x', false]])), /perigoso/);
  const ruim = Buffer.from(z); ruim[32 + 7] ^= 0xff; // estraga um byte do conteúdo do primeiro arquivo
  assert.throws(() => lerZip(ruim)[0].ler(), /corrompido/);
  assert.throws(() => lerZip(Buffer.from('não é zip')), /inválido/);
});

/** Monta uma "instalação" com manifesto assinado pela chave de teste. */
function instalacao(nome, versao, arquivos, extraManifesto = {}) {
  const r = pasta(nome);
  for (const [rel, c] of Object.entries(arquivos)) { fs.mkdirSync(path.dirname(path.join(r, rel)), { recursive: true }); fs.writeFileSync(path.join(r, rel), c); }
  fs.writeFileSync(path.join(r, 'VERSAO'), versao + '\n');
  const texto = JSON.stringify(montarManifesto(r, { versao, comprador: 'C-aaaaaaaaaaaa', ...extraManifesto }), null, 1);
  fs.writeFileSync(path.join(r, 'MANIFESTO.json'), texto);
  fs.writeFileSync(path.join(r, 'MANIFESTO.assinatura'), b64(crypto.sign(null, Buffer.from(mensagemAssinada(texto)), privateKey)));
  return r;
}

const V1 = {
  'src/video/motor.mjs': 'export const v = 1;\n',
  'src/velho.mjs': 'export const sai = true;\n',
  'docs/guia.md': '# guia v1\n',
  'docs/alterado-por-mim.md': 'original\n',
  'docs/saiu-mas-alterei.md': 'original\n',
  'marca/tokens.json': '{"nome":"Sua Página"}\n',
  'projetos/exemplo/roteiro.md': 'roteiro de fábrica\n',
  'ilustrando.config.json': JSON.stringify({ voz: 'mock', cta: { texto: 'a' } }),
  'package.json': '{"name":"x","version":"0.2.0"}\n',
};

test('integridade: separa motor, kit e arquivos da pessoa; motor alterado é detectado', () => {
  assert.equal(classe('src/video/engine/runtime.js'), 'motor');
  assert.equal(classe('marca/tokens.json'), 'seu');
  assert.equal(classe('docs/formatos.md'), 'sistema');
  assert.ok(compararVersao('0.10.0', '0.9.9') > 0);
  assert.equal(compararVersao('1.2.3', '1.2.3'), 0);
  const r = instalacao('integ', '0.2.0', V1);
  assert.equal(conferirMotor({ raiz: r, exigir: true, chavePublica: PUB }).ok, true);
  fs.writeFileSync(path.join(r, 'marca/tokens.json'), '{"nome":"Minha"}');
  fs.writeFileSync(path.join(r, 'docs/guia.md'), 'mudei');
  fs.writeFileSync(path.join(r, 'projetos/novo.md'), 'meu');
  let c = conferir(r, { chavePublica: PUB });
  assert.equal(c.assinaturaOk, true);
  assert.deepEqual(c.alterados.map((x) => [x.rel, x.classe]), [['docs/guia.md', 'sistema'], ['marca/tokens.json', 'seu']]);
  assert.deepEqual(c.novos.map((x) => x.rel), ['projetos/novo.md']);
  assert.equal(c.motorOk, true);
  fs.writeFileSync(path.join(r, 'src/video/motor.mjs'), 'export const v = 2;\n');
  const m = conferirMotor({ raiz: r, exigir: true, chavePublica: PUB });
  assert.equal(m.ok, false);
  assert.deepEqual(m.alterados, ['src/video/motor.mjs']);
  // manifesto mexido à mão: a assinatura deixa de conferir
  fs.writeFileSync(path.join(r, 'src/video/motor.mjs'), 'export const v = 1;\n');
  fs.appendFileSync(path.join(r, 'MANIFESTO.json'), ' ');
  assert.equal(conferirMotor({ raiz: r, exigir: true, chavePublica: PUB }).ok, false);
  // sem manifesto: no pacote é problema; no repositório, não
  const vazio = pasta('sem-manifesto');
  assert.equal(conferirMotor({ raiz: vazio, exigir: true, chavePublica: PUB }).ok, false);
  assert.equal(conferirMotor({ raiz: vazio, exigir: false, chavePublica: PUB }).ok, true);
});

test('atualizar: preserva projetos, marca, .env e config; guarda backup; desfaz', async () => {
  const atual = instalacao('atual', '0.2.0', V1);
  // o que a pessoa fez depois de instalar
  fs.writeFileSync(path.join(atual, 'marca/tokens.json'), '{"nome":"Minha Página"}\n');
  fs.writeFileSync(path.join(atual, 'projetos/exemplo/roteiro.md'), 'meu roteiro\n');
  fs.mkdirSync(path.join(atual, 'projetos/meu-video'), { recursive: true });
  fs.writeFileSync(path.join(atual, 'projetos/meu-video/roteiro.md'), 'trabalho da pessoa\n');
  fs.writeFileSync(path.join(atual, '.env'), 'ILU_VOZ=fishaudio\n');
  fs.writeFileSync(path.join(atual, 'ilustrando.config.json'), JSON.stringify({ voz: 'fishaudio', cta: { texto: 'meu cta' } }));
  fs.writeFileSync(path.join(atual, 'docs/alterado-por-mim.md'), 'minha versão\n');
  fs.writeFileSync(path.join(atual, 'docs/saiu-mas-alterei.md'), 'minha versão\n');
  fs.writeFileSync(path.join(atual, 'notas.txt'), 'arquivo criado pela pessoa\n');

  const v2 = { ...V1, 'src/video/motor.mjs': 'export const v = 2;\n', 'src/novo.mjs': 'export const n = 1;\n', 'docs/guia.md': '# guia v2\n', 'docs/alterado-por-mim.md': 'fábrica v2\n', 'marca/tokens.json': '{"nome":"Fábrica v2"}\n', 'ilustrando.config.json': JSON.stringify({ voz: 'mock', cta: { texto: 'b', novo: 1 }, opcaoNova: true }), 'projetos/exemplo2/roteiro.md': 'exemplo novo\n' };
  delete v2['src/velho.mjs']; delete v2['docs/saiu-mas-alterei.md'];
  const novo = instalacao('novo/ilustrando-metodo-v0.3.0', '0.3.0', v2);
  const zip = path.join(tmp, 'novo.zip');
  const arqs = fs.readdirSync(novo, { recursive: true }).filter((f) => fs.statSync(path.join(novo, f)).isFile()).map((f) => ['ilustrando-metodo-v0.3.0/' + f.split(path.sep).join('/'), fs.readFileSync(path.join(novo, f)), true]);
  fs.writeFileSync(zip, zipDe(arqs));

  const sim = await atualizar({ raiz: atual, origem: zip, simular: true, exigirLicenca: false, chavePublica: PUB });
  assert.deepEqual(sim.plano.remover, ['src/velho.mjs']);
  assert.deepEqual(sim.plano.manterAlterados, ['docs/saiu-mas-alterei.md']);
  assert.ok(sim.plano.criar.includes('src/novo.mjs') && sim.plano.criar.includes('projetos/exemplo2/roteiro.md'));
  assert.equal(fs.readFileSync(path.join(atual, 'src/video/motor.mjs'), 'utf8'), 'export const v = 1;\n', 'simular não muda nada');

  // pacote não oficial é recusado
  const pirata = instalacao('pirata', '0.9.0', V1);
  fs.writeFileSync(path.join(pirata, 'MANIFESTO.assinatura'), b64(crypto.randomBytes(64)));
  await assert.rejects(atualizar({ raiz: atual, origem: pirata, exigirLicenca: false, chavePublica: PUB }), /não é oficial/);
  // versão igual ou mais velha: não muda nada
  await assert.rejects(atualizar({ raiz: atual, origem: instalacao('velho', '0.1.0', V1), exigirLicenca: false, chavePublica: PUB }), /mais antiga/);
  // licença exigida e ausente: não muda nada
  await assert.rejects(atualizar({ raiz: atual, origem: zip, exigirLicenca: true, chavePublica: PUB }), /licença ativa/);

  // falha no meio da cópia: desfaz sozinho
  const antes = conferir(atual, { chavePublica: PUB });
  await assert.rejects(atualizar({ raiz: atual, origem: zip, exigirLicenca: false, chavePublica: PUB, aoCopiar: (rel) => { if (rel === 'src/novo.mjs') throw new Error('disco cheio (simulado)'); } }), /foi desfeita/);
  assert.equal(fs.readFileSync(path.join(atual, 'src/video/motor.mjs'), 'utf8'), 'export const v = 1;\n');
  assert.ok(!fs.existsSync(path.join(atual, 'src/novo.mjs')));
  assert.deepEqual(conferir(atual, { chavePublica: PUB }).alterados, antes.alterados);

  const r = await atualizar({ raiz: atual, origem: zip, exigirLicenca: false, chavePublica: PUB });
  assert.equal(r.para, '0.3.0');
  const ler = (f) => fs.readFileSync(path.join(atual, f), 'utf8');
  assert.equal(ler('src/video/motor.mjs'), 'export const v = 2;\n');
  assert.equal(ler('src/novo.mjs'), 'export const n = 1;\n');
  assert.ok(!fs.existsSync(path.join(atual, 'src/velho.mjs')));
  assert.equal(ler('docs/saiu-mas-alterei.md'), 'minha versão\n', 'arquivo alterado pela pessoa que saiu do kit fica');
  assert.equal(ler('docs/alterado-por-mim.md'), 'fábrica v2\n');
  assert.deepEqual(r.alteradosPorVoce, ['docs/alterado-por-mim.md']);
  assert.equal(fs.readFileSync(path.join(atual, r.backup, 'arquivos', 'docs/alterado-por-mim.md'), 'utf8'), 'minha versão\n', 'a versão da pessoa fica no backup');
  assert.equal(ler('marca/tokens.json'), '{"nome":"Minha Página"}\n');
  assert.equal(ler('projetos/exemplo/roteiro.md'), 'meu roteiro\n');
  assert.equal(ler('projetos/meu-video/roteiro.md'), 'trabalho da pessoa\n');
  assert.equal(ler('projetos/exemplo2/roteiro.md'), 'exemplo novo\n');
  assert.equal(ler('.env'), 'ILU_VOZ=fishaudio\n');
  assert.equal(ler('notas.txt'), 'arquivo criado pela pessoa\n');
  assert.deepEqual(JSON.parse(ler('ilustrando.config.json')), { voz: 'fishaudio', cta: { texto: 'meu cta', novo: 1 }, opcaoNova: true });
  assert.equal(ler('VERSAO').trim(), '0.3.0');
  assert.equal(conferirMotor({ raiz: atual, exigir: true, chavePublica: PUB }).ok, true);

  const d = desfazer({ raiz: atual });
  assert.equal(d.para, '0.2.0');
  assert.equal(ler('src/video/motor.mjs'), 'export const v = 1;\n');
  assert.equal(ler('src/velho.mjs'), 'export const sai = true;\n');
  assert.ok(!fs.existsSync(path.join(atual, 'src/novo.mjs')));
  assert.equal(ler('docs/alterado-por-mim.md'), 'minha versão\n');
  assert.equal(JSON.parse(ler('ilustrando.config.json')).voz, 'fishaudio');
  assert.equal(ler('projetos/meu-video/roteiro.md'), 'trabalho da pessoa\n');
  assert.equal(ler('VERSAO').trim(), '0.2.0');
  assert.equal(conferirMotor({ raiz: atual, exigir: true, chavePublica: PUB }).ok, true);
  assert.throws(() => desfazer({ raiz: atual }), /Não há atualização/);
});

test('mesclarConfig: mantém o que a pessoa escolheu e acrescenta o novo', () => {
  assert.deepEqual(mesclarConfig({ a: 1, b: { c: 2 }, l: [1] }, { a: 9, b: { c: 9, d: 3 }, e: 4, l: [7, 8] }), { a: 1, b: { c: 2, d: 3 }, e: 4, l: [1] });
});

test('selo: sem licença só a voz de teste sai limpa; motor alterado sempre leva marca; metadados no MP4', async () => {
  const r = instalacao('selo', '0.2.0', V1);
  // a chave pública de teste não é a do pacote; a checagem real do manifesto usa a chave embutida, então aqui
  // o motor conta como "alterado" (assinatura não confere): exatamente o caso de um pacote adulterado
  const s0 = await prepararSelo({ raiz: r, voz: 'mock', exigir: true, rede: 'nunca' });
  assert.equal(s0.ativo, true);
  assert.equal(s0.marcaDagua, true);
  assert.match(s0.motivos[0], /assinatura/);
  const dev = await prepararSelo({ raiz: r, voz: 'fishaudio', exigir: false });
  assert.deepEqual([dev.ativo, dev.marcaDagua], [false, false]);
  assert.match(s0.texto, /^Ilustrando 0\.2\.0; licenca nao-ativada; pacote C-aaaaaaaaaaaa$/);

  const ff = spawnSync('ffmpeg', ['-version']);
  if (ff.status !== 0) return;
  const mp4 = path.join(r, 'v.mp4');
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', 'color=c=0x20202a:s=270x480:d=0.5', '-f', 'lavfi', '-i', 'sine=d=0.5', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', mp4]);
  const md5Quadros = (f) => spawnSync('ffmpeg', ['-loglevel', 'error', '-i', f, '-map', '0:v', '-f', 'framemd5', '-'], { encoding: 'utf8' }).stdout.split('\n').filter((l) => /^\d/.test(l)).map((l) => l.split(',').pop().trim());
  const comentario = (f) => JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format_tags=comment', '-of', 'json', f], { encoding: 'utf8' }).stdout).format?.tags?.comment;
  const antes = md5Quadros(mp4);
  // só metadados: imagem idêntica
  await selarVideo(mp4, { ativo: true, marcaDagua: false, texto: 'Ilustrando 0.2.0; licenca L-OK; pacote C-1' });
  assert.equal(comentario(mp4), 'Ilustrando 0.2.0; licenca L-OK; pacote C-1');
  assert.deepEqual(md5Quadros(mp4), antes);
  // marca d'água: a imagem muda, o áudio continua
  await selarVideo(mp4, { ativo: true, marcaDagua: true, texto: 'Ilustrando 0.2.0; licenca nao-ativada; pacote C-1' });
  assert.equal(comentario(mp4), 'Ilustrando 0.2.0; licenca nao-ativada; pacote C-1');
  const depois = md5Quadros(mp4);
  assert.equal(depois.length, antes.length);
  assert.notDeepEqual(depois, antes);
  const streams = JSON.parse(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type', '-of', 'json', mp4], { encoding: 'utf8' }).stdout).streams.map((s) => s.codec_type);
  assert.deepEqual(streams.sort(), ['audio', 'video']);
});

test('versão: VERSAO e package.json dizem a mesma coisa', () => {
  const v = fs.readFileSync(path.join(RAIZ, 'VERSAO'), 'utf8').trim();
  assert.match(v, /^\d+\.\d+\.\d+$/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(RAIZ, 'package.json'), 'utf8')).version, v);
});

test('atualizações: 12 meses da compra, vitalícias com o bump; fora do prazo não instala e o estúdio segue funcionando', async () => {
  // unidades: a chave da compradora é de 2026-10-18 (sem campo a: chave antiga) -> 12 meses = 2027-10-18
  assert.equal(somarMeses('2026-10-18', 12), '2027-10-18');
  const chaveCom = (extra) => assinar('ILU1-LIC.', 'ILU1-', { v: 1, id: 'L-TESTE', e: hashEmail(EMAIL).slice(0, 32), m: 2, p: 'metodo', c: '2026-10-18', ...extra });
  const prep = (nome, extraChave = {}, extraComp = {}) => { const r = instalacao(nome, '0.2.0', V1); gravarLic(r, { chave: chaveCom(extraChave), comprovante: comprovante(Date.now(), extraComp) }); return r; };
  const v3 = { ...V1, 'src/video/motor.mjs': 'export const v = 3;\n' };
  const dentro = instalacao('pub-dentro/ilustrando-metodo-v0.3.0', '0.3.0', v3, { publicado: '2027-06-01' });
  const fora = instalacao('pub-fora/ilustrando-metodo-v0.3.0', '0.3.0', v3, { publicado: '2028-01-10' });
  const opc = { exigirLicenca: true, chavePublica: PUB, urlLicenca: null };
  const motor = (r) => fs.readFileSync(path.join(r, 'src/video/motor.mjs'), 'utf8');

  const r12 = prep('atu-12m');
  assert.deepEqual(direitoAtualizacoes({ raiz: r12, chavePublica: PUB }), { tipo: 'ate', ate: '2027-10-18' });
  assert.ok(cobre({ tipo: 'ate', ate: '2027-10-18' }, '2027-10-18'));
  assert.ok(!cobre({ tipo: 'ate', ate: '2027-10-18' }, '2027-10-19'));
  assert.ok(cobre({ tipo: 'vitalicia', ate: null }, '2099-01-01'));
  assert.match(textoAtualizacoes({ tipo: 'ate', ate: '2027-10-18' }, Date.parse('2027-01-01')), /até 18\/10\/2027/);
  assert.match(textoAtualizacoes({ tipo: 'ate', ate: '2027-10-18' }, Date.parse('2028-01-01')), /terminou em 18\/10\/2027.*continua funcionando/);

  // pacote publicado dentro do prazo: instala
  assert.equal((await atualizar({ raiz: r12, origem: dentro, ...opc })).para, '0.3.0');
  assert.equal(motor(r12), 'export const v = 3;\n');

  // pacote publicado depois do prazo: explica, mostra onde comprar e não muda nada
  const r12b = prep('atu-12m-fora');
  await assert.rejects(atualizar({ raiz: r12b, origem: fora, ...opc }), (e) => {
    assert.equal(e.codigo, 'fora-do-prazo');
    assert.match(e.message, /publicada em 10\/01\/2028, depois do fim do seu período de atualizações \(18\/10\/2027\)/);
    assert.match(e.message, /continua funcionando normalmente/);
    assert.match(e.message, /Atualizações vitalícias/);
    assert.doesNotMatch(e.message, / — /);
    return true;
  });
  await assert.rejects(atualizar({ raiz: r12b, origem: fora, ...opc, simular: true }), /período de atualizações/);
  assert.equal(motor(r12b), 'export const v = 1;\n', 'nada foi mudado');
  assert.ok(!fs.existsSync(path.join(r12b, '.atualizacao')) || !fs.readdirSync(path.join(r12b, '.atualizacao')).some((d) => d.startsWith('backup-')));
  // o uso do estúdio nunca é bloqueado pelo prazo de atualizações
  assert.equal((await estado(base(r12b))).ativa, true);
  assert.match(mensagemForaDoPrazo({ para: '0.3.0', publicado: '2028-01-10', ate: '2027-10-18', link: 'https://pay.exemplo/atualizacoes' }), /https:\/\/pay\.exemplo\/atualizacoes/);

  // vitalícia (comprovante do servidor, por exemplo depois de um upgrade): instala qualquer versão nova
  const rv = prep('atu-vitalicia', {}, { atu: 'vitalicia' });
  assert.equal(direitoAtualizacoes({ raiz: rv, chavePublica: PUB }).tipo, 'vitalicia');
  assert.equal((await atualizar({ raiz: rv, origem: fora, ...opc })).para, '0.3.0');
  // a chave diz vitalícia, mas o comprovante mais novo diz 12 meses (bump reembolsado): vale o comprovante
  const rr = prep('atu-reembolso', { a: 'vitalicia' }, { atu: '2027-10-18' });
  await assert.rejects(atualizar({ raiz: rr, origem: fora, ...opc }), /período de atualizações/);
  // comprou as vitalícias agora: antes de recusar, o estúdio confere online e aceita
  const ru = prep('atu-upgrade', {}, { atu: '2027-10-18' });
  const servidor = servidorFalso({ ok: true, comprovante: comprovante(Date.now(), { atu: 'vitalicia' }) });
  assert.equal((await atualizar({ raiz: ru, origem: fora, ...opc, urlLicenca: 'https://licencas.teste', fetchLicenca: servidor })).para, '0.3.0');
  assert.equal(direitoAtualizacoes({ raiz: ru, chavePublica: PUB }).tipo, 'vitalicia');
});

test('licença 0.5.1: ativação antiga (id com hostname) migra para o id do hardware sem perder a licença', async () => {
  const agora = Date.parse('2026-10-22T12:00:00Z');
  const r = pasta('lic-migra');
  const velho = comprovante(agora - DIA, { maq: maquinaAntiga() });
  gravarLic(r, { chave, comprovante: velho });
  // sem internet: a mesma máquina pelo id antigo continua ativa
  assert.equal((await estado(base(r, { agora }))).situacao, 'ativa');
  // com internet: manda o comprovante antigo como prova e grava o comprovante novo, com o id do hardware
  let pedido = null;
  const f = async (url, opc) => { pedido = JSON.parse(opc.body); return new Response(JSON.stringify({ ok: true, comprovante: comprovante(agora) })); };
  const e = await estado(base(r, { agora: agora + 2 * 60 * 60 * 1000, fetch: f }));
  assert.equal(e.situacao, 'ativa');
  assert.equal(pedido.maquina, maquina());
  assert.equal(pedido.maquinaAnterior, maquinaAntiga());
  assert.equal(pedido.comprovanteAnterior, velho);
  const salvo = JSON.parse(fs.readFileSync(path.join(r, '.licenca', 'licenca.json'), 'utf8'));
  assert.notEqual(salvo.comprovante, velho);
  // pasta copiada de outro computador (nem id novo nem antigo batem) e o servidor não reconhece: outra máquina
  const r2 = pasta('lic-copiada');
  gravarLic(r2, { chave, comprovante: comprovante(agora - DIA, { maq: 'e'.repeat(32) }) });
  assert.equal((await estado(base(r2, { agora, fetch: servidorFalso({ ok: false, codigo: 'maquina-nao-ativada', mensagem: 'não' }, 404) }))).situacao, 'outra-maquina');
});

test('licença 0.5.1: servidor de reserva quando o primeiro não responde; resposta de verdade não pula para o próximo', async () => {
  const agora = Date.parse('2026-10-22T12:00:00Z');
  const r = pasta('lic-reserva');
  gravarLic(r, { chave, comprovante: comprovante(agora - 8 * DIA) });
  const chamados = [];
  const f = async (url) => { chamados.push(new URL(url).host); if (url.startsWith('https://novo.teste')) throw new TypeError('getaddrinfo ENOTFOUND'); return new Response(JSON.stringify({ ok: true, comprovante: comprovante(agora) })); };
  const e = await estado(base(r, { agora, fetch: f, url: ['https://novo.teste', 'https://antigo.teste'] }));
  assert.equal(e.situacao, 'ativa');
  assert.deepEqual(chamados, ['novo.teste', 'antigo.teste']);
  // 5xx também passa para o próximo
  chamados.length = 0;
  const f5 = async (url) => { chamados.push(new URL(url).host); return url.startsWith('https://novo.teste') ? new Response('{}', { status: 503 }) : new Response(JSON.stringify({ ok: true, comprovante: comprovante(agora) })); };
  assert.equal((await estado(base(r, { agora: agora + 8 * DIA, fetch: f5, url: ['https://novo.teste', 'https://antigo.teste'] }))).situacao, 'ativa');
  assert.deepEqual(chamados, ['novo.teste', 'antigo.teste']);
  // revogada no primeiro: vale, não pergunta ao segundo
  chamados.length = 0;
  const fr = async (url) => { chamados.push(new URL(url).host); return new Response(JSON.stringify({ ok: false, codigo: 'revogada', mensagem: 'cancelada' }), { status: 403 }); };
  assert.equal((await estado(base(r, { agora: agora + 30 * DIA, fetch: fr, url: ['https://novo.teste', 'https://antigo.teste'] }))).situacao, 'revogada');
  assert.deepEqual(chamados, ['novo.teste']);
});

test('licença 0.5.1: desativar numa pasta ainda com o id antigo manda a prova para liberar a vaga certa', async () => {
  const r = pasta('lic-desativa');
  const velho = comprovante(Date.now(), { maq: maquinaAntiga() });
  gravarLic(r, { chave, comprovante: velho });
  let pedido = null;
  const f = async (url, opc) => { pedido = JSON.parse(opc.body); return new Response(JSON.stringify({ ok: true, liberada: true, maquinas: 0, max: 2 })); };
  const d = await desativar({ raiz: r, fetch: f, url: 'https://licencas.teste', chavePublica: PUB });
  assert.equal(d.liberada, true);
  assert.equal(pedido.comprovanteAnterior, velho);
});
