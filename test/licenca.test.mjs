/*
 * Open-source: a ativação comercial foi removida.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { estado, ativar, desativar, PACOTE, direitoAtualizacoes, cobre, textoAtualizacoes, somarMeses } from '../src/licenca/licenca.mjs';
import { prepararSelo, textoSelo, selarVideo, avisoSelo } from '../src/licenca/selo.mjs';
import { classe, compararVersao } from '../src/pacote/integridade.mjs';

test('open-source: produção única, sempre ativo, sem licença', async () => {
  assert.equal(PACOTE, true);
  const e = await estado();
  assert.equal(e.ativa, true);
  assert.equal(e.situacao, 'open-source');
  assert.equal((await ativar()).id, 'open-source');
  assert.equal((await desativar()).liberada, true);
  assert.equal(cobre(direitoAtualizacoes()), true);
  assert.match(textoAtualizacoes(), /open-source/);
  assert.equal(somarMeses('2026-01-15', 12), '2027-01-15');
});

test('selo: nunca aplica marca d\'água de ativação', async () => {
  const s = await prepararSelo({ voz: 'elevenlabs', exigir: true });
  assert.equal(s.ativo, false);
  assert.equal(s.marcaDagua, false);
  assert.equal(textoSelo({ versao: '1.0.0', licenca: 'x', comprador: 'y' }), null);
  assert.equal(avisoSelo(s), null);
  assert.deepEqual(await selarVideo('/tmp/nao-existe.mp4', s), { selado: false });
});

test('integridade: classes e compararVersao', () => {
  assert.equal(classe('src/video/cli.mjs'), 'motor');
  assert.equal(classe('projetos/x/roteiro.md'), 'seu');
  assert.equal(compararVersao('0.6.45', '0.6.44'), 1);
  assert.equal(compararVersao('0.6.45', '0.6.45'), 0);
});
