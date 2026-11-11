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
  atualizarPathProcesso,
  autoConectar,
  montarPrompt,
  depsFaltandoPara,
  prepararAssistentes,
  invalidarCacheIa,
  lerCacheIa,
} from '../src/estudio/assistentes.mjs';
import { POST } from '../src/estudio/rotas/ia.mjs';
import { PERMITIDAS } from '../src/estudio/configlocal.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('ia: PERMITIDAS inclui CURSOR_API_KEY', () => {
  assert.ok(PERMITIDAS.includes('CURSOR_API_KEY'));
});

test('ia: atualizarPathProcesso não quebra o PATH', () => {
  const env = { PATH: '/usr/bin', Path: undefined };
  atualizarPathProcesso(RAIZ, env);
  const chave = Object.keys(env).find((k) => k.toUpperCase() === 'PATH');
  assert.ok(env[chave].length > 0);
});

test('ia: listarOpcoes devolve claude, codex e cursor', () => {
  const ops = listarOpcoes({ raiz: RAIZ, env: { ...process.env } });
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
    // sem CLI/SDK o cursor ainda não "instala"; a chave sozinha não conecta
    const st = situacao(tmp);
    const cur = st.opcoes.find((o) => o.id === 'cursor');
    assert.equal(cur.temChave, true);
    if (cur.instalado) {
      const conn = gravarEscolha('cursor', tmp);
      assert.equal(conn.ok, true);
      assert.equal(conn.escolhido, 'cursor');
      assert.equal(autoConectar(tmp).conectado, true);
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('ia: pedido de ajuste aponta para o vídeo e os arquivos da tarefa', () => {
  const youtube = montarPrompt('Mude o título 2.', RAIZ, { projeto: 'exemplo', alvo: 'youtube' });
  assert.match(youtube, /projetos\/exemplo\//);
  assert.match(youtube, /O alvo é youtube\.json/);
  assert.match(youtube, /roteiro\.md e fontes\.md/);
  assert.ok(youtube.endsWith('Mude o título 2.'));

  const video = montarPrompt('Ajuste a primeira cena.', RAIZ, { projeto: 'exemplo', alvo: 'video' });
  assert.match(video, /cena\.json para visual/);
  assert.doesNotMatch(montarPrompt('Faça um vídeo novo.', RAIZ), /Vídeo selecionado|projetos\/exemplo\//);
});

test('ia: rejeita contexto com caminho, alvo inválido ou projeto ausente', async () => {
  const enviar = POST['/api/ia/chat'];
  const ctx = { raiz: RAIZ };
  for (const contexto of [
    { projeto: '../exemplo', alvo: 'youtube' },
    { projeto: 'exemplo', alvo: '.env' },
    { projeto: 'projeto-inexistente-teste-chat', alvo: 'video' },
  ]) {
    const [resposta, status] = await enviar(ctx, { mensagem: 'Ajuste o vídeo.', contexto });
    assert.equal(status, 400);
    assert.match(resposta.erro.causa, /vídeo deste pedido/);
  }
});

test('ia: rota cursor-login existe', () => {
  assert.equal(typeof POST['/api/ia/cursor-login'], 'function');
});

test('ia: rota instalar existe', () => {
  assert.equal(typeof POST['/api/ia/instalar'], 'function');
});

test('ia: depsFaltandoPara do cursor devolve lista', () => {
  const deps = depsFaltandoPara('cursor');
  assert.ok(Array.isArray(deps));
  for (const d of deps) {
    assert.ok(d.id && d.nome && d.motivo);
  }
  assert.deepEqual(depsFaltandoPara('claude'), []);
});

test('ia: prepararAssistentes grava e reusa cache', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-ia-cache-'));
  try {
    fs.writeFileSync(path.join(tmp, 'ilustrando.config.json'), '{}\n');
    invalidarCacheIa(tmp);
    const a = await prepararAssistentes(tmp, { onLinha: () => {}, forcar: true });
    assert.equal(a.cache, false);
    assert.ok(lerCacheIa(tmp));
    const b = await prepararAssistentes(tmp, { onLinha: () => {}, forcar: false });
    assert.equal(b.cache, true);
    assert.equal(b.opcoes.length, a.opcoes.length);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
