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
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { NODE, NODE_VERSAO, FFMPEG, plataforma } from '../ferramentas/instalador/fontes.mjs';
import { baixar, npmCli, pastaSincronizada, dentroDoZip, criarAtalho, ffmpegServe } from '../ferramentas/instalador/instalar.mjs';
import { escreverZip, lerZip, extrairZip } from '../src/pacote/zip.mjs';
import { prepararProgramas, pastasDeProgramas } from '../src/programas.mjs';

/**
 * Instalador de um clique e atalhos (sem Terminal para o comprador). Roda no Linux; o que é só do Mac ou do
 * Windows é conferido pelo formato dos arquivos (permissão, fim de linha, codificação, hashes iguais).
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-inst-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const WIN = process.platform === 'win32';

test('fontes: Node e FFmpeg travados por versão e SHA-256 para Mac, Windows e Linux', () => {
  for (const p of ['darwin-arm64', 'darwin-x64', 'win32-x64', 'linux-x64']) {
    assert.match(NODE[p].url, new RegExp(`^https://nodejs\\.org/dist/${NODE_VERSAO}/`), p);
    assert.match(NODE[p].sha256, /^[0-9a-f]{64}$/, p);
    for (const n of ['ffmpeg', 'ffprobe']) { assert.match(FFMPEG[p][n].url, /^https:\/\/github\.com\/eugeneware\/ffmpeg-static\/releases\/download\/b6\.1\.1\//); assert.match(FFMPEG[p][n].sha256, /^[0-9a-f]{64}$/); }
  }
  assert.equal(plataforma('darwin', 'arm64'), 'darwin-arm64');
});

test('instalar.sh e instalar.ps1 baixam o mesmo Node, com os mesmos hashes de fontes.mjs', () => {
  const sh = fs.readFileSync(path.join(RAIZ, 'ferramentas/instalador/instalar.sh'), 'utf8');
  const ps = fs.readFileSync(path.join(RAIZ, 'ferramentas/instalador/instalar.ps1'), 'utf8');
  assert.ok(sh.includes(`NODE_VERSAO="${NODE_VERSAO}"`) && ps.includes(`$nodeVersao = '${NODE_VERSAO}'`));
  for (const p of ['darwin-arm64', 'darwin-x64', 'linux-x64']) assert.ok(sh.includes(NODE[p].sha256), `instalar.sh sem o hash de ${p}`);
  for (const p of ['win32-x64', 'win32-arm64']) assert.ok(ps.includes(NODE[p].sha256), `instalar.ps1 sem o hash de ${p}`);
});

test('atalhos na raiz: .command executável com LF; .bat ASCII com CRLF; .ps1 UTF-8 com BOM', () => {
  for (const f of ['Instalar (Mac).command', 'Abrir Estúdio (Mac).command', 'ferramentas/rodar', 'ferramentas/instalador/instalar.sh', 'ferramentas/instalador/abrir.sh']) {
    const p = path.join(RAIZ, f), t = fs.readFileSync(p, 'utf8');
    assert.ok(t.startsWith('#!/'), f);
    assert.ok(!t.includes('\r'), `${f} com CRLF`);
    if (WIN) continue; // no Windows não há permissão Unix nem bash
    assert.ok(fs.statSync(p).mode & 0o100, `${f} sem permissão de execução`);
    assert.equal(spawnSync('bash', ['-n', p]).status, 0, `${f}: erro de sintaxe no bash`);
  }
  for (const f of ['Instalar (Windows).bat', 'Abrir Estúdio (Windows).bat', 'ferramentas/rodar.cmd']) {
    const b = fs.readFileSync(path.join(RAIZ, f)).toString('latin1');
    assert.ok(!/[^\x00-\x7f]/.test(b), `${f} não é só ASCII`);
    assert.ok(!/(^|[^\r])\n/.test(b), `${f} sem CRLF`);
    assert.match(b, /^@echo off/);
  }
  for (const f of ['ferramentas/instalador/instalar.ps1', 'ferramentas/instalador/abrir.ps1']) {
    const b = fs.readFileSync(path.join(RAIZ, f));
    assert.deepEqual([...b.subarray(0, 3)], [0xef, 0xbb, 0xbf], `${f} sem BOM`);
    assert.ok(!/(^|[^\r])\n/.test(b.toString('utf8')), `${f} sem CRLF`);
  }
  // nenhum texto para a pessoa com travessão longo com espaços
  for (const f of ['ferramentas/instalador/instalar.mjs', 'ferramentas/instalador/instalar.sh', 'ferramentas/instalador/instalar.ps1', 'src/estudio/pagina.html', 'src/video/erros.mjs']) assert.ok(!fs.readFileSync(path.join(RAIZ, f), 'utf8').includes(' — '), f);
});

test('instalador em modo simulação: mostra os passos e não baixa nem grava nada', () => {
  const prog = path.join(tmp, 'prog-sim');
  const r = spawnSync(process.execPath, [path.join(RAIZ, 'ferramentas/instalador/instalar.mjs'), '--simular', '--forcar'], { encoding: 'utf8', env: { ...process.env, ILU_PROGRAMAS: prog }, timeout: 120000 });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  for (const t of ['MODO SIMULAÇÃO', 'Passo 1 de 7', 'FFmpeg', 'SHA-256', 'npm ci', 'Alinhador de voz', 'Simulação concluída']) assert.ok(r.stdout.includes(t), `faltou "${t}" na saída:\n${r.stdout}`);
  // 0.6.13: o instalador não baixa Python nem voz local (o Piper foi removido)
  assert.ok(!/python|piper|onnxruntime|pip install/i.test(r.stdout.replace(/sem Python/gi, '')), `a saída ainda cita Python ou Piper:\n${r.stdout}`);
  assert.ok(!/Passo \d+ de (?!7)\d+/.test(r.stdout), 'o total de passos continua 7');
  assert.ok(!r.stdout.includes(' — '));
  // só a pasta vazia de teste de gravação; nenhum download
  assert.deepEqual(fs.existsSync(prog) ? fs.readdirSync(prog) : [], []);
});

test('instalar.sh --simular roda no bash (Mac e Linux) sem baixar nada', { skip: WIN && 'só no Mac e no Linux' }, () => {
  const r = spawnSync('bash', [path.join(RAIZ, 'ferramentas/instalador/instalar.sh'), '--simular', '--sem-alinhador'], { encoding: 'utf8', env: { ...process.env, ILU_PROGRAMAS: path.join(tmp, 'prog-sh') }, timeout: 120000 });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /Simulação concluída|simulação para aqui/);
});

test('baixar: confere o SHA-256, recusa arquivo diferente e mostra progresso', async () => {
  const dados = crypto.randomBytes(300000);
  const srv = http.createServer((req, res) => { res.writeHead(200, { 'content-length': dados.length }); res.end(dados); });
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const url = `http://127.0.0.1:${srv.address().port}/arquivo.gz`;
  try {
    const ok = await baixar(url, path.join(tmp, 'b', 'ok.bin'), { sha256: sha(dados), rotulo: 'teste', tentativas: 1 });
    assert.ok(fs.readFileSync(ok).equals(dados));
    await assert.rejects(baixar(url, path.join(tmp, 'b', 'ruim.bin'), { sha256: '0'.repeat(64), tentativas: 1 }), /impressão digital/);
    assert.ok(!fs.existsSync(path.join(tmp, 'b', 'ruim.bin')) && !fs.existsSync(path.join(tmp, 'b', 'ruim.bin.baixando')));
  } finally { srv.close(); }
});

test('detecções: pasta sincronizada, zip aberto sem extrair, npm do próprio Node, FFmpeg utilizável', () => {
  assert.ok(pastaSincronizada('C:\\Users\\Ana\\OneDrive\\Documentos\\ilustrando'));
  assert.ok(pastaSincronizada('/Users/ana/Library/Mobile Documents/com~apple~CloudDocs/ilustrando'));
  assert.ok(!pastaSincronizada('/Users/ana/ilustrando'));
  assert.ok(dentroDoZip('C:\\Users\\Ana\\AppData\\Local\\Temp\\Temp1_ilustrando-metodo.zip\\ilustrando'));
  assert.ok(!dentroDoZip('C:\\Users\\Ana\\ilustrando'));
  const cli = npmCli();
  assert.ok(cli && fs.existsSync(cli), 'npm-cli.js do Node atual');
  assert.equal(npmCli('C:\\nao\\existe\\node.exe', true), null);
  assert.equal(typeof ffmpegServe(), 'boolean');
});

test('atalho do Mac na Mesa aponta para o "Abrir Estúdio" da pasta, mesmo com espaço e acento no caminho', { skip: WIN && 'só no Mac e no Linux' }, () => {
  const casa = path.join(tmp, 'casa'); fs.mkdirSync(path.join(casa, 'Desktop'), { recursive: true });
  const studio = path.join(tmp, 'Minha Pasta', 'ilustrando "José"');
  fs.mkdirSync(studio, { recursive: true });
  fs.writeFileSync(path.join(studio, 'Abrir Estúdio (Mac).command'), '#!/bin/bash\necho ABRIU "$0"\n', { mode: 0o755 });
  const r = criarAtalho({ studio, casa, plataforma: 'darwin' });
  assert.match(r, /Mesa/);
  const atalho = path.join(casa, 'Desktop', 'Abrir Estúdio Ilustrando.command');
  assert.ok(fs.statSync(atalho).mode & 0o100);
  const s = spawnSync('bash', [atalho], { encoding: 'utf8' });
  assert.equal(s.status, 0, s.stderr);
  assert.match(s.stdout, /ABRIU .*Abrir Estúdio \(Mac\)\.command/);
  assert.equal(criarAtalho({ studio, casa, plataforma: 'linux' }), null);
});

test('zip do pacote: nomes UTF-8 marcados (Windows) e .command continua executável depois de extrair', () => {
  const pasta = path.join(tmp, 'ilustrando-metodo-v9.9.9');
  fs.mkdirSync(path.join(pasta, 'ferramentas'), { recursive: true });
  fs.writeFileSync(path.join(pasta, 'Abrir Estúdio (Mac).command'), '#!/bin/bash\necho oi\n', { mode: 0o755 });
  fs.writeFileSync(path.join(pasta, 'Instalar (Windows).bat'), '@echo off\r\n');
  fs.writeFileSync(path.join(pasta, 'ferramentas', 'texto.md'), 'ação '.repeat(1000));
  const z = path.join(tmp, 'p.zip');
  escreverZip(pasta, z);
  const buf = fs.readFileSync(z);
  const ent = lerZip(buf);
  const cmd = ent.find((e) => e.nome === 'ilustrando-metodo-v9.9.9/Abrir Estúdio (Mac).command');
  if (!WIN) assert.ok(cmd && cmd.modo & 0o100);
  assert.equal(ent.find((e) => e.nome.endsWith('.bat')).modo & 0o111, 0);
  // marca UTF-8 (0x800) em todas as entradas do diretório central
  let p = buf.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02])), n = 0;
  while (p >= 0) { assert.equal(buf.readUInt16LE(p + 8) & 0x800, 0x800); n++; p = buf.indexOf(Buffer.from([0x50, 0x4b, 0x01, 0x02]), p + 4); }
  assert.equal(n, ent.length);
  const fora = path.join(tmp, 'extraido');
  extrairZip(z, fora);
  if (!WIN) assert.ok(fs.statSync(path.join(fora, 'ilustrando-metodo-v9.9.9', 'Abrir Estúdio (Mac).command')).mode & 0o100);
  assert.equal(fs.readFileSync(path.join(fora, 'ilustrando-metodo-v9.9.9', 'ferramentas', 'texto.md'), 'utf8'), 'ação '.repeat(1000));
  // o unzip do sistema (quando existe) também lê
  const u = spawnSync('unzip', ['-t', z], { encoding: 'utf8' });
  if (!u.error) assert.equal(u.status, 0, u.stdout);
});

test('programas portáteis entram na frente do PATH; nenhum Python entra no ambiente', () => {
  const base = path.join(tmp, 'progs');
  for (const d of ['node/bin', 'ffmpeg', 'python/bin']) fs.mkdirSync(path.join(base, d), { recursive: true });
  fs.writeFileSync(path.join(base, 'python', 'bin', 'piper'), ''); // sobra de uma instalação antiga: é ignorada
  const env = { PATH: '/usr/bin' };
  const novas = prepararProgramas(env, base);
  assert.deepEqual(novas, [path.join(base, 'node', 'bin'), path.join(base, 'node'), path.join(base, 'ffmpeg')].filter((d) => fs.existsSync(d)));
  assert.ok(env.PATH.startsWith(path.join(base, 'node', 'bin')));
  assert.ok(env.PATH.endsWith('/usr/bin'));
  assert.equal(env.PIPER_BIN, undefined, 'a pasta antiga do Piper é ignorada');
  prepararProgramas(env, base);
  assert.equal(env.PATH.split(path.delimiter).length, novas.length + 1, 'idempotente');
  assert.deepEqual(pastasDeProgramas(path.join(tmp, 'nada')), []);
});

test('ferramentas/rodar: roda o comando na pasta do estúdio com o Node portátil na frente', { skip: WIN && 'só no Mac e no Linux' }, () => {
  const r = spawnSync(path.join(RAIZ, 'ferramentas', 'rodar'), ['node', '-p', 'process.cwd()'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim(), RAIZ);
  assert.notEqual(spawnSync(path.join(RAIZ, 'ferramentas', 'rodar'), [], { encoding: 'utf8' }).status, 0);
});

test('caminhos com espaço e acento: o motor nunca usa URL.pathname (vira %20 e quebra em "Minha Pasta" ou "João")', () => {
  const ruins = [];
  const andar = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'engine') andar(p); } else if (/\.mjs$/.test(e.name) && /new URL\(import\.meta\.url\)\.pathname/.test(fs.readFileSync(p, 'utf8'))) ruins.push(path.relative(RAIZ, p)); } };
  andar(path.join(RAIZ, 'src')); andar(path.join(RAIZ, 'scripts')); andar(path.join(RAIZ, 'ferramentas')); andar(path.join(RAIZ, 'test'));
  assert.deepEqual(ruins, []);
});

test('Windows: .bat aberto de dentro do .zip avisa (não pisca e fecha); .ps1 explica erro inesperado e espera o Enter', () => {
  for (const [f, ps] of [['Instalar (Windows).bat', 'instalar.ps1'], ['Abrir Estúdio (Windows).bat', 'abrir.ps1']]) {
    const t = fs.readFileSync(path.join(RAIZ, f), 'latin1');
    assert.match(t, new RegExp(`if not exist "%~dp0ferramentas\\\\instalador\\\\${ps.replace('.', '\\.')}" goto zip`), `${f}: confere se a pasta foi extraída`);
    assert.match(t, /Extrair tudo/, `${f}: diz o que fazer`);
    assert.match(t, /pause/, `${f}: espera antes de fechar`);
    const p = fs.readFileSync(path.join(RAIZ, 'ferramentas/instalador', ps), 'utf8');
    assert.match(p, /^trap \{/m, `${ps}: trap para erro inesperado`);
    assert.ok(!/\(Resolve-Path /.test(p), `${ps}: Resolve-Path trata [ ] como curinga`);
  }
});

test('auditoria S-03: instalar.ps1 tenta o tar 3 vezes e cai para o Expand-Archive antes de parar', () => {
  const ps = fs.readFileSync(path.join(RAIZ, 'ferramentas/instalador/instalar.ps1'), 'utf8');
  const i = ps.indexOf('$aberto = $false'), fim = ps.indexOf("Parar 'não consegui abrir o arquivo do Node.'", i);
  assert.ok(i > 0 && fim > i, 'bloco de extração com nova tentativa');
  const bloco = ps.slice(i, fim);
  assert.match(bloco, /for \(\$t = 1; \$t -le 3 -and \$tar/);
  assert.match(bloco, /Expand-Archive[^\n]*-ErrorAction Stop/);
  assert.ok(bloco.indexOf('Expand-Archive') > bloco.indexOf('tar.Source'), 'o Expand-Archive vem depois do tar, como plano B');
});
