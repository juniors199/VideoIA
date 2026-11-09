/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerModelos, carregarModelo, modeloDoStatus, modeloDoProjeto, planoDoModelo, MODELO_ESTUDIO } from '../src/modelos/carregar.mjs';
import { validarModelo, FORMATOS } from '../src/modelos/validar.mjs';
import { lintarRoteiro, lintarProjeto, lerGanchos } from '../src/video/lint-roteiro.mjs';
import { lerRoteiro } from '../src/video/narracao/texto.mjs';
import { autoPlano } from '../src/video/autoplano.mjs';
import { compilar } from '../src/video/plano.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { lerLocais } from '../src/video/locais.mjs';
import { listar, descrever, gravarPadrao, novo, validarTodos } from '../scripts/modelos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const semModelo = ({ modelo, ...r }) => r;

// narração falsa (tempos regulares) para o plano automático
const falar = (txt) => { let t = 0; const palavras = txt.split(/\s+/).map((w) => { const o = { w, t, f: t + 0.3 }; t += 0.36; return o; }); return { palavras, duracao: t + 0.5 }; };
const FALA = falar('Por que o pão murcha? Primeiro, o fermento solta gás. Depois, o calor do forno a 180 graus segura a massa. No fim, o miolo fica firme. Mas se a porta abre cedo, a massa cai. Por isso espere 20 minutos. Salva para fazer no fim de semana.');

test('modelos: os 8 da especificação (e os extras) existem e passam no validador', () => {
  const todos = lerModelos(RAIZ);
  for (const id of ['curiosidades', 'aula', 'noticia', 'financas', 'fe', 'negocio', 'receita', 'esporte']) assert.ok(todos[id], `falta modelos/${id}.json`);
  for (const r of validarTodos(RAIZ)) assert.deepEqual(r.erros, [], `${r.arquivo}: ${r.erros.join('; ')}`);
  for (const m of Object.values(todos)) assert.doesNotMatch(JSON.stringify(m), / \u2014 /, m.id);
});

test('modelos: o validador recusa campo, peça, cenário, formato e estilo desconhecidos, com sugestão', () => {
  const base = JSON.parse(fs.readFileSync(path.join(RAIZ, 'modelos', 'aula.json'), 'utf8'));
  const v = validarModelo({ ...base, ritmoo: {}, formato: { padrao: 'passo-a-pass' }, visual: { ...base.visual, estilo: 'papell', cenarios: ['sal'], pecasBase: ['lapiss'] } }, { nomeArquivo: 'aula' });
  const t = v.erros.join(' | ');
  for (const re of [/"ritmoo".*"ritmo"/, /passo-a-passo/, /"papel"/, /"sala"/, /"lapis"/]) assert.match(t, re);
  assert.match(validarModelo({ ...base, roteiro: { ...base.roteiro, palavras: [130, 190], alvoSegundos: [20, 30] } }).erros.join(' '), /incoerente/);
  assert.match(validarModelo({ ...base, id: 'outro' }, { nomeArquivo: 'aula' }).erros.join(' '), /nome do arquivo/);
  assert.match(validarModelo({ ...base, cta: { tipo: 'curtir' } }).erros.join(' '), /cta\.tipo/);
  assert.equal(FORMATOS.length, 8);
});

test('modelos: nome por id ou apelido; nome desconhecido explica e sugere', () => {
  assert.equal(carregarModelo('negocio-local', RAIZ).id, 'negocio');
  assert.equal(carregarModelo('Aula', RAIZ).id, 'aula');
  assert.throws(() => carregarModelo('aulla', RAIZ), /Será que é "aula"/);
});

test('modelos: "Modelo: <id>" no STATUS, com precedência comando > STATUS > config > estúdio', () => {
  assert.equal(modeloDoStatus('STATUS: v1. Modelo: aula. Formato: passo a passo.\nTexto.'), 'aula');
  assert.equal(modeloDoStatus('STATUS: modelo: negocio-local\nTexto.'), 'negocio-local');
  assert.equal(modeloDoStatus('STATUS: método v4, formato revelação.\nO modelo: aula é dito no texto.'), null);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-mod-'));
  try {
    fs.writeFileSync(path.join(tmp, 'roteiro.md'), 'STATUS: rascunho.\nTexto.');
    assert.equal(modeloDoProjeto(tmp, { config: {} }).id, MODELO_ESTUDIO);
    assert.equal(modeloDoProjeto(tmp, { config: {} })._fonte, 'estudio');
    assert.equal(modeloDoProjeto(tmp, { config: { modeloPadrao: 'receita' } }).id, 'receita');
    fs.writeFileSync(path.join(tmp, 'roteiro.md'), 'STATUS: rascunho. Modelo: aula.\nTexto.');
    assert.equal(modeloDoProjeto(tmp, { config: { modeloPadrao: 'receita' } }).id, 'aula');
    assert.equal(modeloDoProjeto(tmp, { config: { modeloPadrao: 'receita' }, modelo: 'fe' }).id, 'fe');
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

// 0.6.12: curiosidades (e noticia) ligam o pacote de melhorias dos Reels (efeitos.reels0612) e passam a lista de cenários
// para a escolha por tema; tirando o pacote, o plano continua o estúdio de sempre
const semReels = (p) => { const { efeitos, cenario, cenarios, ...resto } = p; const ef = { ...(efeitos || {}) }; delete ef.reels0612; return { ...resto, ...(Object.keys(ef).length ? { efeitos: ef } : {}) }; };
test('modelos: curiosidades é o estúdio de sempre (linter e plano idênticos aos de sem modelo, fora o pacote 0.6.12)', () => {
  const cur = carregarModelo('curiosidades', RAIZ);
  assert.deepEqual(planoDoModelo(cur), { efeitos: { reels0612: true }, cenario: 'sala', cenarios: ['sala', 'cidade', 'rua-dia', 'laboratorio'] });
  assert.deepEqual(semReels(planoDoModelo(cur)), {});
  const txt = 'Faltar no turno custa R$ 3,51. Parece barato. Não é. Eu te ilustro isso em um minuto. E no final, a regra que caiu. ' + 'A multa parou em 1990. Mas a burocracia cresceu. Agora são 60 dias para justificar, segundo o TSE. '.repeat(8) + 'Comenta ILUSTRANDO.';
  const cta = { comentar: true, palavra: 'ILUSTRANDO' };
  assert.deepEqual(semModelo(lintarRoteiro(txt, { cta, modelo: cur })), lintarRoteiro(txt, { cta }));
  assert.deepEqual(semModelo(lintarRoteiro('Curto. Só 3 números: 1, 2.', { modelo: cur })), lintarRoteiro('Curto. Só 3 números: 1, 2.'));
  assert.deepEqual(autoPlano({ tema: 'X' }, FALA, { plano: semReels(planoDoModelo(cur)) }), autoPlano({ tema: 'X' }, FALA));
});

test('modelos: projeto legado mantém equivalência e recebe as regras editoriais atuais', async () => {
  const pasta = path.join(RAIZ, 'projetos', 'multa-nao-votar');
  if (!fs.existsSync(path.join(pasta, 'roteiro.md'))) return; // pacote do comprador: o projeto não vai junto
  const cfg = JSON.parse(fs.readFileSync(path.join(RAIZ, 'ilustrando.config.json'), 'utf8'));
  const l = lintarProjeto(pasta);
  assert.equal(l.modelo, 'curiosidades');
  // pelo caminho do modelo = pelo caminho antigo (sem modelo)
  // (ganchos: a linha GANCHOS do roteiro, que lintarProjeto lê; sem a linha, só um aviso sem nota)
  const antigo = lintarRoteiro(lerRoteiro(path.join(pasta, 'roteiro.md')), { fontes: fs.readFileSync(path.join(pasta, 'fontes.md'), 'utf8'), cta: cfg.cta, ganchos: lerGanchos(fs.readFileSync(path.join(pasta, 'roteiro.md'), 'utf8')) });
  assert.deepEqual(semModelo(l), antigo);
  // O roteiro legado continua intacto, mas não fica isento das regras novas.
  assert.equal(l.aprovado, false);
  assert.equal(l.metricas.palavras, 249);
  assert.equal(l.problemas.length, 1); // 0.6.42: duração política virou nota, não reprova
  assert.ok(l.avisos.some((p) => /roteiro político com/.test(p)) && !l.problemas.some((p) => /roteiro político/.test(p)), 'duração política só vira nota');
  assert.ok(l.problemas.some((p) => /abertura com "Eu te ilustro/.test(p)), 'reprova a abertura retirada pelo dono');
  // a cena valida e compila igual com o plano do modelo
  const falado = JSON.parse(fs.readFileSync(path.join(pasta, 'palavras.json'), 'utf8'));
  const cena = JSON.parse(fs.readFileSync(path.join(pasta, 'cena.json'), 'utf8'));
  const plano = semReels(planoDoModelo(modeloDoProjeto(pasta))); // sem o pacote 0.6.12 (que muda o layout de propósito)
  const locais = await lerLocais(pasta);
  const v = validarCena(cena, falado.palavras.length, locais, { plano });
  assert.deepEqual(v, validarCena(cena, falado.palavras.length, locais));
  assert.deepEqual(v.erros, []);
  assert.deepEqual(compilar(structuredClone(cena), falado, { plano }), compilar(structuredClone(cena), falado));
});

test('modelos: o linter aplica a faixa, a abertura, o CTA e as expressões proibidas do modelo', () => {
  const neg = carregarModelo('negocio', RAIZ), aula = carregarModelo('aula', RAIZ);
  const curto = 'Por que o nosso pão leva 24 horas? A massa descansa a noite toda. O fermento natural trabalha devagar. Mas é aí que nasce o sabor. São 3 farinhas e 2 dias de cuidado, segundo o padeiro. ' + 'A casca fica crocante e o miolo leve. '.repeat(6) + 'Passa aqui na Rua das Flores, 120. A gente abre às 6.';
  const semM = lintarRoteiro(curto), comM = lintarRoteiro(curto, { modelo: neg });
  assert.ok(semM.problemas.some((p) => /curto demais/.test(p)), 'sem modelo, ~100 palavras é curto');
  assert.ok(!comM.problemas.some((p) => /curto demais/.test(p)), 'no negócio local, ~100 palavras está na faixa');
  for (const resultado of [semM, comM]) {
    assert.ok(![...resultado.problemas, ...resultado.avisos].some((a) => /promessa da marca|loop aberto/.test(a)), 'nenhum caminho exige promessa de marca ou loop aberto');
  }
  const aberturaAntiga = lintarRoteiro(curto.replace('A massa descansa', 'Eu te ilustro isso em um minuto. A massa descansa'));
  assert.ok(aberturaAntiga.problemas.some((p) => /abertura com "Eu te ilustro/.test(p)), 'a frase antiga continua reprovada');
  assert.ok(!comM.avisos.some((a) => /convite do modelo/.test(a)), '"Passa aqui" cumpre o CTA visitar');
  const semCta = lintarRoteiro(curto.replace(/Passa aqui.*$/, 'Fica a dica.'), { modelo: neg });
  assert.ok(semCta.avisos.some((a) => /convite do modelo negocio \(visitar\)/.test(a)));
  assert.ok(lintarRoteiro(curto + ' O melhor da cidade.', { modelo: neg }).problemas.some((p) => /proíbe: "o melhor da cidade"/.test(p)));
  // aula: promessa própria e sem loop aberto
  const a = lintarRoteiro('Por que a folha é verde? Em um minuto você entende. Primeiro, a luz chega. Depois, a clorofila absorve 2 cores. ' + 'No fim, sobra o verde, segundo a biologia. '.repeat(14) + 'Salva para revisar.', { modelo: aula });
  assert.ok(!a.avisos.some((x) => /promessa|loop aberto|convite/.test(x)), a.avisos.join(' | '));
  assert.ok(a.avisos.some((x) => /abaixo da faixa do modelo aula|acima da faixa do modelo aula/.test(x)) || (a.metricas.palavras >= 130 && a.metricas.palavras <= 190));
  // "CTA: simples" no STATUS (lintarProjeto troca o tipo para simples) dispensa o convite do modelo
  assert.ok(!lintarRoteiro(curto.replace(/Passa aqui.*$/, 'Fica a dica.'), { modelo: { ...neg, cta: { tipo: 'simples' } } }).avisos.some((x) => /convite/.test(x)));
});

test('modelos: o plano automático e o compilador usam estilo, cenário, peças de reserva, títulos e ritmo do modelo', () => {
  const aula = carregarModelo('aula', RAIZ);
  const plano = planoDoModelo(aula);
  assert.equal(plano.estilo, 'papel');
  assert.equal(plano.cenario, 'papel');
  const cena = autoPlano({ tema: 'PÃO' }, FALA, { plano });
  assert.equal(cena.estilo, 'papel');
  assert.ok(cena.beats.every((b) => b.cenario === 'papel'));
  assert.ok(cena.beats.every((b) => b.camera.plano !== 'baixo'));
  assert.ok(cena.beats.some((b) => /^Passo \*\d\*$/.test(b.titulo?.texto || '')), JSON.stringify(cena.beats.map((b) => b.titulo)));
  assert.deepEqual(validarCena(cena, FALA.palavras.length, {}, { plano }).erros, []);
  const spec = compilar(cena, FALA, { plano });
  assert.equal(spec.estilo, 'papel');
  // a cena vence o modelo
  const spec2 = compilar({ ...cena, estilo: 'editorial' }, FALA, { plano });
  assert.equal(spec2.estilo, 'editorial');
  assert.equal(spec2.transicaoPadrao, 'varredura');
  // sem nenhuma peça sugerida pela frase, a reserva do modelo entra no lugar das formas geométricas
  const neutra = falar('Ok, beleza. Sim, tá bom. Hum, tudo certo.');
  const formas = autoPlano({ tema: 'X' }, neutra, { plano }).beats.flatMap((b) => (b.elementos || []).map((e) => e.forma)).filter(Boolean);
  assert.ok(formas.length && formas.every((f) => aula.visual.reserva.includes(f)), formas.join(','));
  // beatsMax só avisa
  assert.match(validarCena({ tema: 'X', beats: Array.from({ length: 16 }, (_, i) => ({ id: `b${i}`, palavras: [i, i] })) }, 20, {}, { plano }).avisos.join(' '), /no máximo 14/);
});

test('modelos: npm run modelos (apelido) lista, mostra, grava o padrão com o nome novo e copia para objetivos/meus', () => {
  assert.match(listar(RAIZ), /\* curiosidade /);
  assert.match(descrever(carregarModelo('aula', RAIZ)), /130 a 190 palavras/);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-mod-'));
  try {
    fs.cpSync(path.join(RAIZ, 'modelos'), path.join(tmp, 'modelos'), { recursive: true, filter: (f) => !f.includes(`${path.sep}meus`) });
    fs.writeFileSync(path.join(tmp, 'ilustrando.config.json'), JSON.stringify({ voz: 'mock', modeloPadrao: 'curiosidades', perguntarModelo: true }));
    assert.equal(gravarPadrao('loja', tmp).id, 'negocio');
    const c = JSON.parse(fs.readFileSync(path.join(tmp, 'ilustrando.config.json'), 'utf8'));
    assert.equal(c.objetivoPadrao, 'negocio');
    assert.equal(c.modeloPadrao, undefined);
    assert.deepEqual(c._legado, { modeloPadrao: 'curiosidades', perguntarModelo: true }, 'o valor antigo fica guardado');
    assert.equal(c.perguntarModelo, undefined);
    assert.equal(c.perguntarObjetivo, undefined);
    assert.equal(c.voz, 'mock');
    assert.equal(novo('clinica', 'negocio', tmp), path.join('objetivos', 'meus', 'clinica.json'));
    const m = JSON.parse(fs.readFileSync(path.join(tmp, 'objetivos', 'meus', 'clinica.json'), 'utf8'));
    assert.equal(modeloDoProjeto(null, { objetivo: 'clinica', raiz: tmp, config: {} })._origem, 'meu');
    assert.deepEqual(validarModelo(m, { nomeArquivo: 'clinica' }).erros, []);
    assert.throws(() => novo('clinica', 'negocio', tmp), /Já existe/);
    assert.throws(() => gravarPadrao('nada-disso', tmp), /não existe/);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});
