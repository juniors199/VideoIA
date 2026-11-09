/*
 * 
 * 
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TIPOS_VIRAIS, TIPOS_VIRAIS_OK, META, visualDoSlide, corDoCodigo, estiloVirais } from '../src/carrossel/virais.mjs';
import { validarCarrossel, TIPOS_OK } from '../src/validar-carrossel.mjs';
import { destaqueTexto, contraste, baseDoVisual, VISUAIS_NOMES } from '../src/carrossel/visuais.mjs';
import { conferirImagens, embutirImagens, imagensDoSlide } from '../src/carrossel/imagens.mjs';
import { ICONES_NOMES, ROSTOS_NOMES } from '../src/carrossel/elementos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokens = JSON.parse(fs.readFileSync(path.join(RAIZ, 'marca/tokens.json'), 'utf8'));
const OUTRA = { handle: '@paginadeteste', nome: 'Página de Teste', curto: 'Teste', destaque: '#2F9BFF', apoio: '#BFE0FF', tinta: '#04121F', assinatura: 'só um teste' };
const FOTO = 'data:image/png;base64,iVBORw0KGgo=';

/** um slide mínimo e válido de cada tipo novo */
export const AMOSTRA = {
  tweet: { texto: 'Um post *curto*.' },
  thread: { posts: [{ texto: 'Primeiro.' }, { texto: 'Segundo.' }] },
  manchete: { titulo: 'Manchete *forte*', chapeu: 'Ciência', linhafina: 'Linha fina.' },
  plantao: { titulo: 'Notícia agora', hora: '10h' },
  chat: { mensagens: [{ de: 'eu', texto: 'Oi?' }, { de: 'pagina', texto: 'Oi!' }] },
  nota: { titulo: 'Lista', itens: ['um', { texto: 'dois', feito: true }] },
  podio: { titulo: 'Pódio', itens: [{ nome: 'A', valor: '3' }, { nome: 'B', valor: '2' }, { nome: 'C', valor: '1' }] },
  veredito: { afirmacao: 'Algo.', veredito: 'mito', explicacao: 'Não é.' },
  grafico: { titulo: 'Dados', forma: 'linha', dados: [{ rotulo: '1', valor: 1 }, { rotulo: '2', valor: 3 }], fonte: 'teste' },
  reacao: { topo: 'Quando...', rosto: 'choque' },
  citacao: { frase: 'Frase.', autor: 'Autor' },
  passo: { titulo: 'Passo', texto: 'Faça.', icone: 'check' },
  tabela: { titulo: 'Tabela', colunas: ['A', 'B'], linhas: [{ rotulo: 'x', valores: [true, false] }, { rotulo: 'y', valores: ['1', '2'] }] },
  vocesabia: { imagem: FOTO, titulo: 'Você sabia?' },
  capafoto: { imagem: FOTO, titulo: 'Capa' },
  revista: { titulo: 'Revista', texto: 'Texto corrido.' },
  colagem: { fotos: [{ imagem: FOTO, legenda: 'oi' }], nota: 'nota' },
  tipografico: { texto: 'Frase *gigante*' },
  definicao: { palavra: 'palavra', definicao: 'Significado.' },
  linhatempo: { titulo: 'Tempo', marcos: [{ ano: '1', texto: 'a' }, { ano: '2', texto: 'b' }, { ano: '3', texto: 'c' }] },
  quiz: { pergunta: 'Qual?', opcoes: ['a', 'b'], resposta: 1, revelar: true },
  receita: { titulo: 'Receita', ingredientes: ['a', 'b'] },
  placar: { casa: { nome: 'Casa', gols: 1 }, fora: { nome: 'Fora', gols: 0 } },
  codigo: { codigo: 'print("<oi>")' },
  versiculo: { texto: 'Texto.', referencia: 'Livro 1:1', versao: 'Versão' },
  informativo: { titulo: 'Info', linhas: [{ icone: 'relogio', rotulo: 'a' }, { icone: 'local', rotulo: 'b' }] },
  numeros: { titulo: 'Números', itens: [{ numero: '1', legenda: 'a' }, { numero: '2', legenda: 'b' }] },
  anotada: { imagem: FOTO, marcas: [{ x: 50, y: 50, texto: 'aqui' }] },
  divisao: { antes: { imagem: FOTO, rotulo: '1' }, depois: { imagem: FOTO, rotulo: '2' } },
};

test('carrossel virais: todo tipo novo tem catálogo, amostra válida e entra na lista do validador', () => {
  assert.ok(TIPOS_VIRAIS_OK.length >= 25, `${TIPOS_VIRAIS_OK.length} tipos novos`);
  for (const t of TIPOS_VIRAIS_OK) {
    assert.ok(META[t]?.uso && META[t]?.campos && META[t]?.paginas?.length, `META de ${t}`);
    assert.ok(TIPOS_OK.includes(t), `${t} no validador`);
    assert.ok(AMOSTRA[t], `amostra de ${t}`);
    const r = validarCarrossel({ fontes: ['x'], legenda: 'x', slides: [{ tipo: t, ...AMOSTRA[t] }] });
    assert.deepEqual(r.erros, [], `${t}: ${r.erros.join('; ')}`);
  }
  // os tipos clássicos continuam lá
  for (const t of ['capa', 'texto', 'dado', 'lista', 'comparacao', 'ranking', 'passos', 'mitofato', 'antesdepois', 'fecho']) assert.ok(TIPOS_OK.includes(t));
});

test('carrossel virais: a marca vem dos tokens (nome, @ e cor da página), nunca cravada', () => {
  for (const t of TIPOS_VIRAIS_OK) {
    const html = TIPOS_VIRAIS[t]({ tipo: t, ...AMOSTRA[t] }, OUTRA, { i: 0, total: 3 }, 'TEMA', { hoje: new Date('2026-10-20T12:00:00'), ordem: 1, totalDoTipo: 1 });
    assert.ok(!/ilustrando/i.test(html), `${t} não pode citar a marca de fábrica`);
    assert.ok(html.includes('@paginadeteste'), `${t} mostra o @ da página`);
    assert.ok(html.includes('class="rodape"') && html.includes('class="cab'), `${t} mantém a moldura medida pelo gerador`);
  }
  const tw = TIPOS_VIRAIS.tweet({ texto: 'oi' }, OUTRA, { i: 0, total: 2 }, 'T', {});
  assert.ok(tw.includes('Página de Teste') && tw.includes('@paginadeteste'), 'post com nome e @ da própria página');
  assert.ok(!/twitter|x\.com|verified/i.test(tw), 'post sem a marca da rede');
  const css = estiloVirais(baseDoVisual(tokens, 'claro'), OUTRA, {}, 'claro', tokens);
  assert.ok(css.includes('#2F9BFF'), 'CSS usa o destaque da página');
  for (const f of fs.readdirSync(path.join(RAIZ, 'src/carrossel'))) assert.ok(!/@ilustrandocuriosidadesbr|#FF7A2F/i.test(fs.readFileSync(path.join(RAIZ, 'src/carrossel', f), 'utf8')), `${f} sem marca cravada`);
});

test('carrossel virais: destaque legível como texto nos visuais claro e papel', () => {
  for (const v of VISUAIS_NOMES) {
    const b = baseDoVisual(tokens, v);
    for (const cor of [tokens.paginas.curiosidades.destaque, '#FFC83D', '#2F9BFF', '#00C853']) assert.ok(contraste(destaqueTexto(cor, b.fundo), b.fundo) >= 3.2, `${cor} em ${v}`);
    assert.ok(contraste(b.texto.slice(0, 7), b.fundo) >= 7, `texto em ${v}`);
  }
  assert.equal(visualDoSlide({ tipo: 'manchete' }, 'escuro'), 'papel');
  assert.equal(visualDoSlide({ tipo: 'manchete', modo: 'escuro' }, 'claro'), 'escuro');
  assert.equal(visualDoSlide({ tipo: 'tweet' }, 'claro'), 'claro');
  assert.equal(visualDoSlide({ tipo: 'capa' }, 'inventado'), 'escuro');
});

test('carrossel virais: validador pega campo faltando, tipo de gráfico, rosto, ícone e visual (resultado prometido não é defeito)', () => {
  const v = (slides, extra = {}) => validarCarrossel({ fontes: ['x'], legenda: 'x', slides, ...extra });
  assert.ok(v([{ tipo: 'tweet' }]).erros.some((e) => /texto/.test(e)));
  assert.ok(v([{ tipo: 'veredito', afirmacao: 'a', veredito: 'talvez' }]).erros.some((e) => /mito, verdade ou meia/.test(e)));
  assert.ok(v([{ tipo: 'grafico', forma: 'radar', dados: [{ rotulo: 'a', valor: 1 }, { rotulo: 'b', valor: 2 }] }]).erros.some((e) => /radar/.test(e)));
  assert.ok(v([{ tipo: 'grafico', dados: [{ rotulo: 'a', valor: 1 }, { rotulo: 'b', valor: 2 }] }]).avisos.some((a) => /fonte/.test(a)));
  assert.ok(v([{ tipo: 'reacao', topo: 'x', rosto: 'meme-famoso' }]).erros.some((e) => /rosto/.test(e)));
  assert.ok(v([{ tipo: 'passo', titulo: 'x', icone: 'nada' }]).erros.some((e) => /ícone/.test(e)));
  assert.ok(v([{ tipo: 'vocesabia', titulo: 'x' }]).erros.some((e) => /foto/.test(e)));
  assert.ok(v([{ tipo: 'tweet', texto: 'a'.repeat(300) }]).avisos.some((a) => /máximo 280/.test(a)));
  assert.ok(v([{ tipo: 'quiz', pergunta: 'q', opcoes: ['a', 'b'], revelar: true }]).erros.some((e) => /resposta/.test(e)));
  assert.ok(v([{ tipo: 'capa', titulo: 'x' }], { visual: 'neon' }).erros.some((e) => /visual/.test(e)));
  // 0.6.2: falar de seguidores, visualizações ou vendas não vira aviso nem erro (decisão do dono, 26/10/2026)
  const resultado = v([{ tipo: 'tweet', texto: 'Ganhe 10 mil seguidores em 7 dias e mais vendas' }]);
  assert.ok(![...resultado.erros, ...resultado.avisos].some((a) => /promet|promessa|seguidores|renda/i.test(a)), [...resultado.erros, ...resultado.avisos].join(' | '));
  assert.ok(v([{ tipo: 'fecho', titulo: 'x' }]).avisos.some((a) => /capa/.test(a)));
  assert.ok(v([{ tipo: 'tweet', texto: '*um* e ~dois~' }]).avisos.some((a) => /destaques/.test(a)));
  assert.ok(ICONES_NOMES.length >= 25 && ROSTOS_NOMES.length >= 8);
});

test('carrossel virais: fotos de assets/ viram data URI e precisam de licença em fontes.md', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'carr-'));
  fs.mkdirSync(path.join(tmp, 'assets'));
  fs.writeFileSync(path.join(tmp, 'assets/a.jpg'), Buffer.from([0xff, 0xd8, 0xff]));
  const d = { slides: [{ tipo: 'colagem', fotos: [{ imagem: 'assets/a.jpg' }, { imagem: 'assets/b.jpg' }] }] };
  assert.deepEqual(imagensDoSlide(d.slides[0]), ['assets/a.jpg', 'assets/b.jpg']);
  let r = conferirImagens(d, tmp);
  assert.ok(r.erros.some((e) => /b\.jpg não existe/.test(e)));
  assert.ok(r.avisos.some((a) => /a\.jpg sem licença/.test(a)));
  fs.writeFileSync(path.join(tmp, 'fontes.md'), '## Imagens\n- assets/a.jpg: foto, autor X, CC BY 4.0\n');
  r = conferirImagens(d, tmp);
  assert.equal(r.avisos.length, 0);
  const s = embutirImagens(d.slides[0], tmp);
  assert.match(s.fotos[0].imagem, /^data:image\/jpeg;base64,/);
  assert.equal(s.fotos[1].imagem, '');
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('carrossel virais: código escapa HTML e colore só o básico', () => {
  const h = corDoCodigo('print("<b>oi</b>") # comenta\nx = 42');
  assert.ok(!h.includes('<b>oi'), 'escapa o HTML do código');
  assert.ok(h.includes('k-s') && h.includes('k-c') && h.includes('k-x') && h.includes('k-n'));
});

test('carrossel virais: os carrosséis de exemplo passam no validador, com fontes e fotos licenciadas', () => {
  const pasta = path.join(RAIZ, 'carrosseis');
  const exemplos = fs.readdirSync(pasta).filter((n) => { try { return JSON.parse(fs.readFileSync(path.join(pasta, n, 'carrossel.json'), 'utf8')).slides.some((s) => TIPOS_VIRAIS[s.tipo]); } catch { return false; } });
  const usados = new Set();
  for (const n of exemplos) {
    const d = JSON.parse(fs.readFileSync(path.join(pasta, n, 'carrossel.json'), 'utf8'));
    const r = validarCarrossel(d, { pasta: path.join(pasta, n) });
    // S-04: foto de exemplo fora do git (clone limpo) não reprova; na pasta do mantenedor ela existe e é conferida
    r.erros = r.erros.filter((e) => !erroDeMidiaAusente(e, path.join(pasta, n)));
    assert.deepEqual(r.erros, [], `${n}: ${r.erros.join('; ')}`);
    assert.deepEqual(r.avisos.filter((a) => !/ritmo ideal/.test(a)), [], `${n}: ${r.avisos.join('; ')}`);
    assert.ok(d.fontes.length >= 2, `${n} com 2 fontes ou mais`);
    d.slides.forEach((s) => usados.add(s.tipo));
  }
  if (exemplos.length) for (const t of TIPOS_VIRAIS_OK) assert.ok(usados.has(t), `há um carrossel de exemplo com ${t}`);
});

// as famílias de estilo (visuais de referência) rodam junto, sem mexer na lista de testes do package.json
import './carrossel-familias.test.mjs';
import { pularSemMidia, erroDeMidiaAusente } from './helpers/midia-fora-do-git.mjs';
