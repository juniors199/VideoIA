/*
 * 
 * 
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIAS, FAMILIAS_NOMES, TIPOS_REF, TIPOS_REF_OK, META_REF, corDoSlide, baseDaFamilia, vestirSlide, estiloFamilias } from '../src/carrossel/familias.mjs';
import { validarCarrossel, TIPOS_OK, VISUAIS_TODOS } from '../src/validar-carrossel.mjs';
import { selo3d } from '../src/carrossel/elementos.mjs';
import { contraste } from '../src/carrossel/visuais.mjs';
import { pularSemMidia, erroDeMidiaAusente } from './helpers/midia-fora-do-git.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTRA = { handle: '@paginadeteste', nome: 'Página de Teste', curto: 'Teste', destaque: '#2F9BFF', apoio: '#BFE0FF', tinta: '#04121F', assinatura: 'só um teste' };
const FOTO = 'data:image/png;base64,iVBORw0KGgo=';
const AMOSTRA = {
  notificacao: { imagem: FOTO, notificacoes: [{ titulo: 'Título' }, { texto: 'Texto' }] },
  painel: { titulo: 'Painel', cards: [{ rotulo: 'a', numero: '1', texto: 'x' }, { rotulo: 'b', numero: '2', texto: 'y' }] },
  dialogo: { pergunta: 'E aí?', sim: 'Sim', nao: 'Não' },
  fototopo: { imagem: FOTO, texto: ['Um.', 'Dois.'] },
  fotobloco: { imagem: FOTO, titulo: 'Bloco', texto: 'Texto.', numero: '7' },
  errocerto: { errado: { texto: 'Errado.' }, certo: { texto: 'Certo.' } },
  versus: { a: 'Isto', b: 'Aquilo' },
  celular: { imagem: FOTO, titulo: 'Celular', texto: 'Texto.' },
  marcados: { titulo: 'Lista', itens: [{ texto: 'a', marca: 'sim' }, { texto: 'b', marca: 'nao' }] },
  recorte: { imagem: FOTO, titulo: 'Recorte', texto: 'Texto.' },
};

test('famílias: 8 visuais de referência, cada um com paletas legíveis e ritmo válido', () => {
  assert.ok(FAMILIAS_NOMES.length >= 8);
  for (const [n, F] of Object.entries(FAMILIAS)) {
    assert.ok(VISUAIS_TODOS.includes(n), `${n} aceito no validador`);
    for (const c of F.ritmo) assert.ok(F.paletas[c], `${n}: ritmo usa a cor ${c}`);
    for (const c of Object.keys(F.paletas)) {
      const b = baseDaFamilia(n, c, OUTRA);
      assert.ok(contraste(b.texto.slice(0, 7), b.fundo.slice(0, 7)) >= 4.5, `${n}/${c}: texto legível`);
    }
  }
  assert.equal(corDoSlide('editorial', { cor: 'destaque' }, 0), 'destaque');
  assert.equal(corDoSlide('editorial', {}, 1), FAMILIAS.editorial.ritmo[1]);
});

test('famílias: tipos novos validam, usam a marca dos tokens e mantêm a moldura medida', () => {
  for (const t of TIPOS_REF_OK) {
    assert.ok(META_REF[t]?.uso && TIPOS_OK.includes(t), `catálogo de ${t}`);
    const r = validarCarrossel({ fontes: ['x'], legenda: 'x', slides: [{ tipo: t, ...AMOSTRA[t] }] });
    assert.deepEqual(r.erros, [], `${t}: ${r.erros.join('; ')}`);
    for (const fam of FAMILIAS_NOMES) {
      const pos = { i: 0, total: 3 };
      const html = vestirSlide(TIPOS_REF[t]({ tipo: t, ...AMOSTRA[t] }, OUTRA, pos, 'TEMA', { hoje: new Date('2026-10-20T12:00:00') }), fam, corDoSlide(fam, {}, 0), OUTRA, pos, 'TEMA');
      assert.ok(!/ilustrando/i.test(html) && html.includes('@paginadeteste'), `${t}/${fam}: sem marca cravada, com o @ da página`);
      assert.ok(html.includes('class="rodape"') && html.includes(`fam-${fam}`), `${t}/${fam}: moldura`);
    }
  }
  const css = estiloFamilias(baseDaFamilia('interface', 'escuro', OUTRA), OUTRA, {});
  for (const f of ['familias.mjs', 'elementos.mjs']) assert.ok(!/@exemplo|#FF7A2F/i.test(fs.readFileSync(path.join(RAIZ, 'src/carrossel', f), 'utf8')), `${f} sem marca cravada`);
  assert.ok(css.length > 1000);
});

test('famílias: validador pega cor, ordem, marca e foto faltando', () => {
  const v = (s) => validarCarrossel({ fontes: ['x'], legenda: 'x', slides: [s] });
  assert.ok(v({ tipo: 'texto', titulo: 'x', cor: 'neon' }).erros.some((e) => /cor/.test(e)));
  assert.ok(v({ tipo: 'fotobloco', imagem: FOTO, titulo: 'x', ordem: 'lado' }).erros.some((e) => /ordem/.test(e)));
  assert.ok(v({ tipo: 'marcados', titulo: 'x', itens: [{ texto: 'a', marca: 'talvez' }, 'b'] }).erros.some((e) => /marca/.test(e)));
  assert.ok(v({ tipo: 'notificacao', notificacoes: [{ titulo: 'x' }] }).erros.some((e) => /foto/.test(e)));
  assert.ok(v({ tipo: 'texto', titulo: 'x', modo: 'inventado' }).erros.some((e) => /modo/.test(e)));
  assert.ok(v({ tipo: 'texto', titulo: 'x', fotoFundo: 'http://x/foto.jpg' }).erros.some((e) => /fotoFundo/.test(e)));
  assert.deepEqual(validarCarrossel({ visual: 'grao', fontes: ['x'], legenda: 'x', slides: [{ tipo: 'capa', titulo: 'x' }] }).erros, []);
});

test('famílias: selo em relevo (gradiente, brilho e sombra), nunca chapado', () => {
  for (const t of ['sim', 'nao', 'seta']) {
    const s = selo3d(t);
    assert.ok(/linearGradient/.test(s) && /radialGradient/.test(s) && /feDropShadow/.test(s), t);
  }
  assert.notEqual(selo3d('sim').match(/id="(s3d\d+)g"/)[1], selo3d('sim').match(/id="(s3d\d+)g"/)[1], 'ids únicos por selo');
});

test('famílias: há um carrossel de exemplo por família, válido e com fontes', () => {
  const pasta = path.join(RAIZ, 'carrosseis');
  const vistos = new Set();
  for (const n of fs.readdirSync(pasta)) {
    let d; try { d = JSON.parse(fs.readFileSync(path.join(pasta, n, 'carrossel.json'), 'utf8')); } catch { continue; }
    if (!FAMILIAS[d.visual]) continue;
    vistos.add(d.visual);
    const r = validarCarrossel(d, { pasta: path.join(pasta, n) });
    // S-04: foto de exemplo fora do git (clone limpo) não reprova; na pasta do mantenedor ela existe e é conferida
    r.erros = r.erros.filter((e) => !erroDeMidiaAusente(e, path.join(pasta, n)));
    assert.deepEqual(r.erros, [], `${n}: ${r.erros.join('; ')}`);
    assert.deepEqual(r.avisos.filter((a) => !/ritmo ideal/.test(a)), [], `${n}: ${r.avisos.join('; ')}`);
    assert.ok(d.fontes.length >= 2, `${n}: fontes`);
  }
  if (vistos.size) for (const f of FAMILIAS_NOMES) assert.ok(vistos.has(f), `exemplo da família ${f}`);
});
