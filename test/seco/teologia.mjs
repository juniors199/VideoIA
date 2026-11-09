/*
 * 
 * 
 */
/** Teste seco da teologia (lote A3): roda o estilo inteiro (todas as formas) num navegador falso (ctx-falso.mjs) e mede o que foi desenhado. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { instalarNavegadorFalso, criarB } from './ctx-falso.mjs';

const T = (forma, extra = {}) => ({ tipo: 'teologia', forma, ...extra });
const ARQ = { arquivo: 'assets/obra.jpg' };
/** um conjunto por beat, em ciclo: cobre as 26 formas do estilo */
const CONJUNTOS = [
  () => [T('frase', { kicker: 'dessa frase', regua: true, linhas: [{ texto: 'Eu e o Pai *somos um*', tam: 'g' }, { texto: 'e isso muda tudo', tam: 'p' }] })],
  () => [T('abertura', { ...ARQ, halo: 'raios', moldura: 'ouro', linhas: [{ texto: 'O Cristo *Pantocrator*', tam: 'g' }], credito: 'Cristo Pantocrator, Sinai, séc. VI' })],
  () => [T('arte', { ...ARQ, tratamento: 'sepia', moldura: 'gotico', kicker: 'séculos depois', titulo: 'uma tradição *diferente*', linhas: [{ texto: 'e uma ideia intrigante', tam: 'p' }], credito: 'Giovanni di Stefano, Hermes Trismegisto, Siena, 1488' })],
  () => [T('arte-dupla', { a: { ...ARQ, moldura: 'ouro' }, b: { ...ARQ, tratamento: 'sepia' }, rotulos: [{ texto: 'Jó perde *tudo*' }, { texto: 'três amigos' }], linhas: [{ texto: 'você *pecou*', tam: 'gg' }] })],
  () => [T('arte-cheia', { ...ARQ, borda: 'rasgada', kicker: 'pense em', titulo: 'uma *onda* no oceano', credito: 'Hokusai, A grande onda de Kanagawa, c. 1831' })],
  () => [T('medalhao', { ...ARQ, titulo: 'quando *Jesus* diz', zoom: 1.8, foco: [0.5, 0.28], linhas: [{ texto: '“Eu e o Pai *somos um*”', tam: 'm' }] })],
  () => [T('medalhoes', { kicker: 'Jó perde', titulo: 'os bens, os filhos, a saúde', itens: [{ nome: 'os filhos', ...ARQ }, { nome: 'a saúde', ...ARQ }, { nome: 'os bens', manto: 'azul' }], credito: 'William Blake, 1826' })],
  () => [T('fichas', { kicker: 'três acusações', itens: [{ texto: 'Ele blasfemou', carimbo: 'NÃO' }, { texto: 'Ele enganou o povo', risca: true }, 'Ele se disse rei'], fim: 'FALSO' })],
  () => [T('lista', { kicker: 'os três', titulo: 'passos', itens: ['Arrepender-se', 'Crer', 'Ser batizado'], marcador: 'numero' })],
  () => [T('citacao', { capitular: 'T', texto: 'Tudo está no Todo e o ==Todo está em tudo.==', referencia: 'ideia hermética' })],
  () => [T('inscricao', { palavra: 'O Todo', traducao: 'o universo', pronuncia: 'to pan', material: 'ouro', kicker: 'para os hermetistas' })],
  () => [T('comparacao', { lados: [{ texto: 'Mito', sub: 'a lenda', marca: 'x', tom: 'noite' }, { texto: 'Fato', sub: 'o registro', marca: 'ok', tom: 'creme' }] })],
  () => [T('numero', { valor: 40, linhas: [{ texto: 'anos no deserto', tam: 'p' }] })],
  () => [T('numero', { valor: 1054, formato: 'ano', kicker: 'em', linhas: [{ texto: 'o grande cisma', tam: 'm' }] })],
  () => [T('carimbo', { texto: 'ILUSTRANDO', y: 0.6 }), T('frase', { linhas: [{ texto: 'Fim da história', tam: 'g' }] })],
  () => [T('fecho', { palavra: 'ILUSTRANDO', linhas: [{ texto: 'compartilha no story', tam: 'p' }, { texto: 'segue a página e comenta', tam: 'p' }] })],
  () => [T('linha-do-tempo', { kicker: 'entre', titulo: 'o trabalho de *quinze anos*', itens: [{ data: '390', nome: 'começa' }, { data: '405', nome: 'termina' }, { data: '420', nome: 'morre' }] })],
  () => [T('causa', { kicker: 'mas uma unidade', ligacao: 'unidade', itens: [{ texto: 'a origem' }, { texto: 'o que nasce dela' }, { texto: '?' }] })],
  () => [T('mapa', { pontos: [{ lugar: 'Roma' }, { lugar: 'Belém' }], rota: ['Roma', 'Belém'], kicker: 'Jerônimo foi viver em', titulo: '*Belém*' })],
  () => [T('circulos', { modo: 'lado', kicker: 'mas como pode', itens: [{ texto: 'dentro do todo' }, { texto: 'o todo em si' }] })],
  () => [T('balanca', { kicker: 'o mundo foi feito', lados: [{ texto: 'com', sub: 'o tempo', peso: 2, marca: 'ok' }, { texto: 'dentro', sub: 'do tempo', peso: 1, marca: 'x' }] })],
  () => [T('relogio', { kicker: 'no ano', arco: [0, 3], mes: 3, linhas: [{ texto: 'março', tam: 'g' }] })],
  () => [T('caminho', { modo: 'bifurcacao', kicker: 'a história', marcos: [{ texto: 'Roma' }, { texto: 'Cisma' }, { texto: 'Reforma' }] })],
  () => [T('simbolo', { simbolo: 'onda', kicker: 'você consegue', linhas: [{ texto: 'acompanhar o *movimento*', tam: 'g' }, { texto: 'e dizer onde ela começa', tam: 'p' }] })],
  () => [T('dossie', { cabecalho: 'CASO 07', titulo: 'O processo', linhas: [{ texto: 'acusado de *blasfêmia*', tam: 'm' }], selo: 'ARQUIVADO' })],
  () => [T('recortes', { itens: ['quem', 'disse', 'isso'], destaque: 'isso' })],
  () => [T('anotacoes', { ...ARQ, notas: [{ x: 0.3, y: 0.4, texto: 'a auréola' }, { x: 0.7, y: 0.6, texto: 'o livro' }] })],
];

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  const gr = instalarNavegadorFalso();
  const { compilar } = await mod('src/video/plano.mjs');
  const { usarGeoNode } = await mod('src/video/engine/geo.js').catch(() => ({}));
  if (usarGeoNode) usarGeoNode(geo);
  const E = await mod('src/video/engine/estilo-teologia.js');
  const ARTE = await mod('src/video/engine/estilo-teologia-arte.js');
  const raiz = path.resolve(process.env.ILU_RAIZ || process.cwd());
  const IMG = (w = 1400, h = 1000) => { const i = new gr.Imagem(); i.naturalWidth = w; i.naturalHeight = h; i.width = w; i.height = h; return i; };
  ARTE.TEX.perg = IMG(1200, 1600); ARTE.TEX.papel = IMG(1200, 1600);
  try { ARTE.TEX.geo = JSON.parse(fs.readFileSync(path.join(raiz, 'src/video/engine/assets-antiguidade/mapa-mediterraneo-india.geojson'), 'utf8')); } catch { /* sem mapa */ }
  const extra = formato === 'horizontal' ? { formato, handle, legenda } : {};
  const saida = { geo: { W: geo.W, H: geo.H }, casos: {} };
  const f = falado(`${BATERIA.longo} ${BATERIA.numeroGrande} ${BATERIA.lista} ${BATERIA.marca} ${BATERIA.pessoaSemFoto} ${BATERIA.curto} ${BATERIA.soNumeros}`);
  const casos = [];
  const base = porFrase(f.palavras);
  for (const [tom, off] of [['noite', 0], ['creme', 9], ['dossie', 18]]) {
    const beats = base.map((b, i) => ({ ...b, virar: ['corte', 'folha', 'fusao', 'iris', 'luz'][i % 5], elementos: CONJUNTOS[(i + off) % CONJUNTOS.length]() }));
    casos.push([`todas-as-formas-${tom}`, tom, beats]);
  }
  for (const [nome, tom, bts] of casos) {
    const cena = { tema: 'X', estilo, tom, beats: bts, ...extra };
    const spec = compilar(cena, f); spec.W = geo.W; spec.H = geo.H;
    for (const b of spec.beats) for (const e of b.elementos || []) if (e.tipo === 'teologia') for (const o of E.objetosComArquivo(e)) o._img = IMG();
    const S = { spec, dur: f.duracao, esc: 1, m: { destaque: '#FF7A1A', serie: handle ? '@ilustrandocuriosidades' : '' } };
    const B = criarB({ gr, spec, S }), est = E.criarTeologia(B), amostras = [];
    for (const b of spec.beats) for (const u of [0.2, 0.55, 0.95]) {
      const t = b.de + (b.ate - b.de) * u; gr.zerar(); const out = { titulos: [], pecas: [], imagens: [] };
      est.compor(t); est.medir(t, out);
      const mainId = B.tela.__canvas;
      amostras.push({
        beat: b.id, forma: (b.elementos || [])[0]?.forma, t: +t.toFixed(2), passagem: t < b.de + 0.6, hash: gr.resultado().hash,
        textos: gr.textos.filter((x) => x.canvas === mainId).map(({ txt, px, x0, x1, y0, y1 }) => ({ txt, px, x0, x1, y0, y1 })),
        cartoes: (out.titulos || []).map(({ forma, x0, x1, y0, y1 }) => ({ forma, x0, x1, y0, y1 })),
        pecas: (out.pecas || []).map(({ forma, x0, x1, y0, y1 }) => ({ forma, x0, x1, y0, y1 })),
        imagens: gr.imagens.filter((x) => x.canvas === mainId).map(({ tipo, x0, x1, y0, y1 }) => ({ tipo, x0, x1, y0, y1 })).filter((x) => x.x1 - x.x0 > 1500 || x.y1 - x.y0 > 1000).slice(0, 3),
      });
    }
    saida.casos[nome] = { beats: spec.beats.length, amostras };
  }
  return arred(saida);
}

/** horizontal: todo texto na área útil, peças na margem de segurança, fundo cobrindo a sangria, sem exceção */
export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const topo = handle ? 246 : 190, tol = 2; let n = 0;
    for (const [nome, c] of Object.entries(d.casos)) for (const a of c.amostras) {
      if (a.passagem) continue;
      for (const x of a.textos) {
        n++;
        if (x.txt.startsWith('@')) { assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= 190 - tol && x.y1 <= 225, `${estilo}/${nome}: @ no alto da área útil ${JSON.stringify(x)}`); continue; }
        assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol, `${estilo} ${rotulo}/${nome} ${a.beat} (${a.forma}): texto "${x.txt}" fora da área útil ${JSON.stringify(x)}`);
      }
      for (const x of a.cartoes) assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol, `${estilo} ${rotulo}/${nome} ${a.beat} (${a.forma}): caixa de texto ${x.forma} fora da área útil ${JSON.stringify(x)}`);
      for (const x of a.pecas) assert.ok(x.x0 >= 108 - tol && x.x1 <= 1810 + tol && x.y0 >= 82 - tol && x.y1 <= 993 + tol, `${estilo} ${rotulo}/${nome} ${a.beat} (${a.forma}): peça ${x.forma} fora da margem de segurança ${JSON.stringify(x)}`);
      assert.ok(a.imagens.some((x) => x.x0 <= 55 && x.x1 >= 1864 && x.y0 <= 27 && x.y1 >= 1050), `${estilo} ${rotulo}/${nome} ${a.beat}: o fundo cobre a sangria`);
    }
    assert.ok(n > 40, `${estilo}: houve texto desenhado (${n})`);
  }
}
