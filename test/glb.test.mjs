/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { abrir, baseGlobal } from '../src/video/render.mjs';
import { embutirModelos, modelosDoProjeto, nomesBiblioteca, BIBLIOTECA, DIR_BIBLIOTECA, lerGlb } from '../src/video/modelos3d.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { FORMAS, GRUPOS_FORMAS } from '../src/video/catalogo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(RAIZ, '.teste-glb-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
const marca = { fundo: '#0E0E13', frente: '#FFFFFF', sombra: '#3C3B4A', destaque: '#FF7A2F', apoio: '#FFC9A3', serie: '@x' };
const specCom = (elementos, dur = 4) => ({ perfil: 'curiosidades', marca, duracao: dur, palavras: [], efeitos: { bloom: 0.5, grao: 0.6 }, avisos: [], beats: [{ id: 'a', de: 0, ate: dur, camera: { plano: 'normal', mov: 'deriva' }, transicao: 'corte', elementos }] });

test('glb: biblioteca íntegra (arquivo existe, é GLB, licença registrada, nome com prefixo, catálogo e léxico em dia)', () => {
  const nomes = nomesBiblioteca();
  assert.ok(nomes.length >= 40 && nomes.length <= 220, `${nomes.length} modelos`);
  const licencas = fs.readFileSync(path.join(DIR_BIBLIOTECA, 'LICENCAS.md'), 'utf8');
  const lexico = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/video/lexico/glb.json'), 'utf8'));
  let total = 0;
  for (const n of nomes) {
    assert.match(n, /^glb-[a-z0-9-]+$/);
    const arq = path.join(DIR_BIBLIOTECA, BIBLIOTECA[n].arquivo);
    assert.ok(fs.existsSync(arq), `${n}: falta ${BIBLIOTECA[n].arquivo}`);
    total += lerGlb(arq).bytes;
    assert.ok(licencas.includes(`\`${n}\``) && new RegExp(`\`${n}\`[^\\n]*CC0`).test(licencas), `${n}: sem linha CC0 em LICENCAS.md`);
    assert.ok(FORMAS.includes(n), `${n}: fora do formas.json (rode npm run catalogo)`);
    assert.ok(lexico[n]?.length, `${n}: sem palavras no léxico glb.json`);
  }
  assert.ok(total < 40e6, `biblioteca com ${(total / 1e6).toFixed(1)} MB`);
  assert.deepEqual([...GRUPOS_FORMAS.glb].sort(), nomes);
  // nenhum nome da biblioteca colide com peça procedural
  const outras = Object.entries(GRUPOS_FORMAS).filter(([g]) => g !== 'glb').flatMap(([, l]) => l);
  assert.deepEqual(nomes.filter((n) => outras.includes(n)), []);
});

test('glb: modelos do projeto (assets/*.glb), embutir na spec, hash no cache e validação', () => {
  const p = path.join(tmp, 'proj'); fs.mkdirSync(path.join(p, 'assets'), { recursive: true });
  fs.copyFileSync(path.join(DIR_BIBLIOTECA, BIBLIOTECA['glb-maca'].arquivo), path.join(p, 'assets', 'fruta-teste.glb'));
  assert.deepEqual(modelosDoProjeto(p).map((m) => m.nome), ['glb-fruta-teste']);
  const spec = specCom([{ tipo: 'peca', forma: 'glb-fruta-teste', t0: 0.1 }, { tipo: 'peca', forma: 'glb-vaca', t0: 0.2 }]);
  embutirModelos(spec, p);
  assert.deepEqual(Object.keys(spec.modelos).sort(), ['glb-fruta-teste', 'glb-vaca']);
  assert.equal(spec.modelos['glb-vaca'].meta.anim, BIBLIOTECA['glb-vaca'].anim, 'meta da biblioteca vai junto');
  assert.ok(spec.modelosDados[spec.modelos['glb-vaca'].hash].length > 1000);
  // de novo sem a pasta (como o render faz): mantém o do projeto
  embutirModelos(spec);
  assert.ok(spec.modelos['glb-fruta-teste']);
  // trocar o arquivo muda o hash e a chave do cache
  const b1 = baseGlobal(spec);
  const s2 = specCom(spec.beats[0].elementos); fs.copyFileSync(path.join(DIR_BIBLIOTECA, BIBLIOTECA['glb-laranja'].arquivo), path.join(p, 'assets', 'fruta-teste.glb'));
  fs.utimesSync(path.join(p, 'assets', 'fruta-teste.glb'), new Date(), new Date(Date.now() + 5000));
  embutirModelos(s2, p);
  assert.notEqual(baseGlobal(s2), b1);
  // sem modelos: spec limpa e hash de sempre
  const s3 = specCom([{ tipo: 'peca', forma: 'cubo', t0: 0.1 }]); const b0 = baseGlobal(s3);
  assert.equal(baseGlobal(embutirModelos(s3)), b0);
  // erros claros
  assert.throws(() => embutirModelos(specCom([{ tipo: 'peca', forma: 'glb-nao-existe' }]), p), /não existe/);
  fs.copyFileSync(path.join(p, 'assets', 'fruta-teste.glb'), path.join(p, 'assets', 'vaca.glb'));
  assert.throws(() => modelosDoProjeto(p), /já existe na biblioteca/);
  fs.rmSync(path.join(p, 'assets', 'vaca.glb'));
  fs.writeFileSync(path.join(p, 'assets', 'Feio Nome.glb'), 'x');
  assert.throws(() => modelosDoProjeto(p), /letras minúsculas/);
  fs.rmSync(path.join(p, 'assets', 'Feio Nome.glb'));
  fs.writeFileSync(path.join(p, 'assets', 'falso.glb'), 'não sou glb');
  assert.throws(() => embutirModelos(specCom([{ tipo: 'peca', forma: 'glb-falso' }]), p), /não é um GLB válido/);
  fs.rmSync(path.join(p, 'assets', 'falso.glb'));
  // validador: aceita biblioteca e projeto, confere dados, sugere o parecido
  const cena = (forma, dados) => ({ tema: 'X', beats: [{ id: 'a', palavras: [0, 3], elementos: [{ tipo: 'peca', forma, dados }] }] });
  assert.deepEqual(validarCena(cena('glb-vaca', { material: 'clay', anim: 'Walk', partes: { White: 'destaque' } }), 10).erros, []);
  assert.deepEqual(validarCena(cena('glb-fruta-teste'), 10, { pecas: ['glb-fruta-teste'] }).erros, []);
  assert.ok(validarCena(cena('glb-vaca', { material: 'metal' }), 10).erros.some((e) => /material "metal"/.test(e)));
  assert.ok(validarCena(cena('glb-vaka'), 10).erros.some((e) => /"glb-vaca"/.test(e) && /assets\/vaka\.glb/.test(e)));
});

test('navegador: GLB carrega sem rede, harmoniza e o quadro é determinístico (2 renders, outra aba, animação por t)', { timeout: 180000 }, async () => {
  const spec = specCom([
    { tipo: 'peca', id: 'v', forma: 'glb-vaca', pos: [-1.2, 0, 0], t0: 0.1, dados: { anim: 'Walk' } },
    { tipo: 'peca', id: 'p', forma: 'glb-pizza', papel: 'destaque', pos: [1.2, 0, 0], t0: 0.3, dados: { material: 'clay' } },
    { tipo: 'peca', id: 'h', forma: 'glb-mulher', pos: [0, 0, 0], t0: 0.5 },
    { tipo: 'rotulo', em: 'v', texto: 'vaca', t0: 0.4 },
  ], 6);
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const p = paginas[0];
    // nada além do servidor local: o modelo veio embutido na spec (sem fetch de .glb, sem rede)
    const recursos = await p.evaluate(() => performance.getEntriesByType('resource').map((r) => r.name));
    assert.ok(recursos.every((u) => u.startsWith('http://127.0.0.1:') || u.startsWith('data:') || u.startsWith('blob:')), recursos.filter((u) => !u.startsWith('http://127.0.0.1:')).join(', '));
    assert.ok(!recursos.some((u) => /\.glb/.test(u)), 'nenhum .glb buscado por URL');
    const hash = async (pg, t) => { await pg.evaluate((x) => window.ilu.quadro(x), t); return crypto.createHash('sha1').update(await pg.screenshot({ type: 'png' })).digest('hex'); };
    const a = await hash(p, 3.3);
    const outroT = await hash(p, 1.7); // desvia: o quadro não pode depender do anterior
    assert.notEqual(outroT, a, 'a cena muda com o tempo');
    assert.equal(await hash(p, 3.3), a, 'mesmo t, mesmos pixels (2 renders)');
    const outra = await novaAba();
    assert.equal(await hash(outra, 3.3), a, 'outra aba, mesmos pixels');
    // medidas: as 3 peças aparecem, dentro da tela, e o rótulo acompanha
    const m = await p.evaluate((x) => window.ilu.medir(x), 3.3);
    assert.equal(m.pecas.length, 3);
    for (const c of m.pecas) assert.ok(c.x0 >= 0 && c.x1 <= 1080 && c.y1 > c.y0 + 40, JSON.stringify(c));
    assert.equal(m.rotulos.length, 1);
  } finally { await fechar(); }
});
