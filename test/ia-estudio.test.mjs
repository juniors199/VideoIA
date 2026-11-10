import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  listarOpcoes,
  situacao,
  gravarEscolha,
  gravarChaveCursor,
} from '../src/estudio/assistentes.mjs';
import { PERMITIDAS } from '../src/estudio/configlocal.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('ia: PERMITIDAS inclui CURSOR_API_KEY', () => {
  assert.ok(PERMITIDAS.includes('CURSOR_API_KEY'));
});

test('ia: listarOpcoes devolve claude, codex e cursor', () => {
  const ops = listarOpcoes({ raiz: RAIZ, env: {} });
  assert.deepEqual(ops.map((o) => o.id), ['claude', 'codex', 'cursor']);
  assert.equal(ops.every((o) => o.nome && o.dica), true);
});

test('ia: situacao sem escolha não está conectada', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-ia-'));
  try {
    fs.writeFileSync(path.join(tmp, 'ilustrando.config.json'), '{}\n');
    const s = situacao(tmp, {});
    assert.equal(s.escolhido, null);
    assert.equal(s.conectado, false);
    assert.equal(s.pronto, false);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('ia: gravarEscolha recusa id inexistente ou não instalado', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-ia-'));
  try {
    fs.writeFileSync(path.join(tmp, 'ilustrando.config.json'), '{}\n');
    const ruim = gravarEscolha('nada', tmp);
    assert.ok(ruim.erro);
    const sem = gravarEscolha('claude', tmp);
    // sem claude no PATH do ambiente hermético costuma falhar; se achar, só confirma ok
    if (sem.erro) assert.match(sem.erro.causa, /Não achei|desconhecido/i);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('ia: gravarChaveCursor marca presença e permite conectar cursor', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-ia-'));
  try {
    fs.writeFileSync(path.join(tmp, 'ilustrando.config.json'), '{}\n');
    const chave = 'cursor_test_key_' + 'abcdefghij';
    const r = gravarChaveCursor(chave, tmp);
    assert.equal(r.ok, true);
    const env = fs.readFileSync(path.join(tmp, '.env'), 'utf8');
    assert.match(env, /CURSOR_API_KEY=/);
    const conn = gravarEscolha('cursor', tmp);
    assert.equal(conn.ok, true);
    assert.equal(conn.escolhido, 'cursor');
    assert.equal(conn.conectado, true);
    const cfg = JSON.parse(fs.readFileSync(path.join(tmp, 'ilustrando.config.json'), 'utf8'));
    assert.equal(cfg.assistente, 'cursor');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
