/*
 * 
 * 
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { sincronizar, lerSkills, LIMITE_AGENTS } from '../scripts/sincronizar-skills.mjs';
import { checarAssistentes, assistenteAtual } from '../src/video/ambiente.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('assistentes: skills seguem o padrão aberto (name = pasta, [a-z0-9-], description até 1024)', () => {
  const { skills, problemas } = lerSkills(RAIZ);
  assert.deepEqual(problemas, []);
  assert.ok(skills.some((s) => s.nome === 'comece'), 'falta a skill de primeira execução');
});

test('assistentes: Claude Code e Codex em sincronia (.agents/skills e AGENTS.md)', () => {
  const r = sincronizar(RAIZ, { conferir: true });
  assert.deepEqual(r.problemas, []);
  assert.deepEqual(r.mudancas, [], 'rode npm run sincronizar');
});

test('assistentes: AGENTS.md cabe no limite e carrega as mesmas regras do CLAUDE.md', () => {
  const agents = fs.readFileSync(path.join(RAIZ, 'AGENTS.md'), 'utf8');
  const claude = fs.readFileSync(path.join(RAIZ, 'CLAUDE.md'), 'utf8');
  assert.ok(Buffer.byteLength(agents) <= LIMITE_AGENTS);
  for (const sec of claude.match(/^## .+$/gm)) assert.ok(agents.includes(sec), `AGENTS.md sem a seção ${sec}`);
  assert.ok(agents.includes('.agents/skills'));
  assert.doesNotMatch(agents, / — /);
});

test('assistentes: sincronizar copia, apaga sobra e atualiza o AGENTS.md numa pasta qualquer', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-sinc-'));
  try {
    fs.mkdirSync(path.join(tmp, '.claude/skills/teste'), { recursive: true });
    fs.writeFileSync(path.join(tmp, '.claude/skills/teste/SKILL.md'), '---\nname: teste\ndescription: Uma skill de teste. Segunda frase.\n---\n\nCorpo.\n');
    fs.mkdirSync(path.join(tmp, '.agents/skills/velha'), { recursive: true });
    fs.writeFileSync(path.join(tmp, '.agents/skills/velha/SKILL.md'), 'x');
    fs.writeFileSync(path.join(tmp, 'CLAUDE.md'), '# Título\n\nRegra um.\n\n## Seção\nTexto.\n');
    fs.writeFileSync(path.join(tmp, 'AGENTS.md'), '# A\n\n<!-- CLAUDE.md:inicio -->\n<!-- CLAUDE.md:fim -->\n\n<!-- skills:inicio -->\n<!-- skills:fim -->\n');
    assert.ok(sincronizar(tmp, { conferir: true }).mudancas.length > 0);
    const r = sincronizar(tmp);
    assert.deepEqual(r.problemas, []);
    assert.equal(fs.readFileSync(path.join(tmp, '.agents/skills/teste/SKILL.md'), 'utf8'), fs.readFileSync(path.join(tmp, '.claude/skills/teste/SKILL.md'), 'utf8'));
    assert.ok(!fs.existsSync(path.join(tmp, '.agents/skills/velha')));
    const a = fs.readFileSync(path.join(tmp, 'AGENTS.md'), 'utf8');
    assert.match(a, /Regra um\.\n\n## Seção\nTexto\./);
    assert.doesNotMatch(a, /# Título/);
    assert.match(a, /\| `teste` \| `\$teste` \| Uma skill de teste\. \|/);
    assert.deepEqual(sincronizar(tmp, { conferir: true }).mudancas, []);
    // nome errado no cabeçalho é apontado
    fs.writeFileSync(path.join(tmp, '.claude/skills/teste/SKILL.md'), '---\nname: Outro\ndescription: x\n---\n');
    assert.ok(sincronizar(tmp, { conferir: true }).problemas.some((p) => /igual ao nome da pasta/.test(p)));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('assistentes: doctor reconhece Claude Code, Codex ou nenhum, sem exigir um deles', async (t) => {
  assert.equal(assistenteAtual({ CLAUDECODE: '1' }), 'claude');
  assert.equal(assistenteAtual({ CODEX_THREAD_ID: 'abc' }), 'codex');
  assert.equal(assistenteAtual({}), null);
  // hermético: uma pasta temporária com CLAUDE.md, uma skill e o AGENTS.md sincronizado (o estado do repositório não conta;
  // a sincronia do repositório real é o teste "Claude Code e Codex em sincronia")
  const raiz = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-doctor-'));
  t.after(() => fs.rmSync(raiz, { recursive: true, force: true }));
  fs.mkdirSync(path.join(raiz, '.claude/skills/teste'), { recursive: true });
  fs.writeFileSync(path.join(raiz, '.claude/skills/teste/SKILL.md'), '---\nname: teste\ndescription: Uma skill de teste.\n---\n\nCorpo.\n');
  fs.writeFileSync(path.join(raiz, 'CLAUDE.md'), '# Título\n\nRegra um.\n');
  fs.writeFileSync(path.join(raiz, 'AGENTS.md'), '# A\n\n<!-- CLAUDE.md:inicio -->\n<!-- CLAUDE.md:fim -->\n\n<!-- skills:inicio -->\n<!-- skills:fim -->\n');
  fs.mkdirSync(path.join(raiz, 'scripts'));
  fs.copyFileSync(path.join(RAIZ, 'scripts', 'sincronizar-skills.mjs'), path.join(raiz, 'scripts', 'sincronizar-skills.mjs'));
  assert.deepEqual(sincronizar(raiz).problemas, []);
  const nenhum = await checarAssistentes({ env: {}, versao: () => null, raiz });
  const a = nenhum.find((i) => i.id === 'assistente');
  assert.equal(a.ok, false);
  assert.match(a.dica, /app/);
  const codex = await checarAssistentes({ voz: 'fishaudio', env: { CODEX_THREAD_ID: 'x', CODEX_SANDBOX_NETWORK_DISABLED: '1' }, versao: () => null, raiz });
  assert.equal(codex.find((i) => i.id === 'assistente').ok, true);
  assert.equal(codex.find((i) => i.id === 'codex:internet').ok, false);
  const claude = await checarAssistentes({ voz: 'fishaudio', env: { CLAUDECODE: '1' }, versao: () => '2.1.0', raiz });
  assert.ok(!claude.some((i) => i.id === 'codex:internet'));
  assert.ok(claude.every((i) => i.ok), JSON.stringify(claude));
});
