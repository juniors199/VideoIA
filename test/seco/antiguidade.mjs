/*
 * 
 * 
 */
/** Teste seco da antiguidade (lote A3): roda o estilo inteiro num navegador falso (ctx-falso.mjs) e mede o que foi desenhado. */
import fs from 'node:fs';
import path from 'node:path';
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { instalarNavegadorFalso, criarB } from './ctx-falso.mjs';

const A = (forma, extra = {}) => ({ tipo: 'antiguidade', forma, ...extra });
const IMG = (gr, w = 1600, h = 1000) => { const i = new gr.Imagem(); i.naturalWidth = w; i.naturalHeight = h; i.width = w; i.height = h; return i; };
const CONJUNTOS = [
  () => [A('quadro', { arquivo: 'assets/a.jpg', foco: [0.38, 0.3], detalhe: false, movimento: 'dolly' }), A('nome', { texto: 'Alexandre|o Grande', cores: ['ouro', 'branco'] })],
  () => [A('nome-atras', { texto: 'Aristóteles', arquivo: 'assets/b.png', sub: 'o filósofo' })],
  () => [A('quadro', { arquivo: 'assets/a.jpg', foco: [0.5, 0.42] }), A('data', { texto: '343 a.C.', regua: true, ano: -343, reguaDe: -430 })],
  () => [A('quadro', { arquivo: 'assets/a.jpg', modo: 'cartao' }), A('dado', { titulo: 'Alexandre, aluno', valor: 13, sufixo: ' anos', barra: 0.406, texto: 'de uma vida de 32 anos' })],
  () => [A('quadro', { arquivo: 'assets/a.jpg' }), A('rotulo', { texto: 'Estagira', datas: 'Calcídica, Grécia' })],
  () => [A('quadro', { arquivo: 'assets/c.jpg', recorte: 'circulo', raio: 0.425, largura: 820 })],
  () => [A('quadro', { arquivo: 'assets/a.jpg' }), A('capitulo', { numero: 2, titulo: 'A escola|de Mieza', sub: 'Macedônia' })],
  () => [A('citacao', { texto: 'Ao meu pai devo a vida; ao meu mestre, viver bem.', autor: 'Alexandre, segundo Plutarco' })],
  () => [A('mapa', { tratamento: 'vetor', foco: [22.5, 40.8], rota: [[22.52, 40.76], [26.4, 40.1], [30.5, 38.4], [36.2, 36.8], [44.42, 32.54], [52.89, 29.93], [71.5, 31.0]], rotaEm: 'trinta', rotaDur: 5.2, pontos: [{ nome: 'Pela', pos: [22.52, 40.76], em: 'Aos' }, { nome: 'Babilônia', pos: [44.42, 32.54], em: 'Babilônia,' }, { nome: 'Índia', pos: [71.5, 31.0], em: 'Índia.', lado: 'esq' }], regioes: [{ texto: 'Macedônia', pos: [22, 42.6], em: 'trinta' }] })],
  () => [A('pilha', { arquivo: 'assets/a.jpg', atras: ['assets/b.png', 'assets/c.jpg'], trocas: [{ arquivo: 'assets/c.jpg', em: 'tempestade' }] }), A('rotulo', { texto: 'Arquivo', datas: '1822 a 1889' })],
  () => [A('quadro', { arquivo: 'assets/a.jpg', figura: [[0.2, 0.2], [0.8, 0.2], [0.8, 0.9], [0.2, 0.9]] }), A('nome', { texto: 'Dom Pedro' })],
];

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  const gr = instalarNavegadorFalso();
  const { compilar } = await mod('src/video/plano.mjs');
  const { usarGeoNode } = await mod('src/video/engine/geo.js').catch(() => ({}));
  if (usarGeoNode) usarGeoNode(geo);
  const E = await mod('src/video/engine/estilo-antiguidade.js');
  const raiz = path.dirname(new URL(await import('node:url').then((u) => u.pathToFileURL(path.join(process.env.ILU_RAIZ || process.cwd(), 'src/video/engine/estilo-antiguidade.js')).href)).pathname);
  const geojson = JSON.parse(fs.readFileSync(path.join(raiz, 'assets-antiguidade/mapa-mediterraneo-india.geojson'), 'utf8'));
  const extra = formato === 'horizontal' ? { formato, handle, legenda } : {};
  const saida = { geo: { W: geo.W, H: geo.H }, casos: {} };
  const f = falado(`${BATERIA.longo} ${BATERIA.numeroGrande} ${BATERIA.lista} ${BATERIA.marca} ${BATERIA.pessoaSemFoto}`);
  const casos = [];
  for (const tom of ['ouro', 'vinho', 'escuro']) {
    const beats = porFrase(f.palavras).map((b, i) => ({ ...b, ...(i % 5 === 1 ? { titulo: { texto: 'A escola de Mieza e a longa viagem de Alexandre' } } : {}), elementos: CONJUNTOS[(i + (tom === 'ouro' ? 0 : tom === 'vinho' ? 3 : 6)) % CONJUNTOS.length]() }));
    casos.push([`manual-${tom}`, tom, f, beats]);
  }
  for (const [nome, tom, fala, bts] of casos) {
    const cena = { tema: 'X', estilo, tom, beats: bts, ...extra };
    const spec = compilar(cena, fala); spec.W = geo.W; spec.H = geo.H;
    spec.__geoAnt = geojson; spec.__texAnt = { perg: IMG(gr, 1200, 1600), papel: IMG(gr, 1200, 1600) };
    for (const b of spec.beats) for (const e of b.elementos || []) { if (e.tipo !== 'antiguidade') continue; e._img = IMG(gr, e.arquivo === 'assets/b.png' ? 900 : 1600, e.arquivo === 'assets/b.png' ? 1300 : 1000); e._imgs = [IMG(gr), IMG(gr)]; for (const x of e.trocas || []) x._img = IMG(gr); }
    const paginas = legenda === false ? [] : (() => { const r = []; for (let i = 0; i < fala.palavras.length; i += 4) { const ws = fala.palavras.slice(i, i + 4); r.push({ ini: ws[0].t, fim: ws.at(-1).f + 0.2, ws }); } return r; })();
    const S = { spec, dur: fala.duracao, esc: 1, legenda: paginas, m: { destaque: '#FF7A1A', serie: handle ? '@kaueajure' : '' } };
    const B = criarB({ gr, spec, S }), est = E.criarAntiguidade(B), amostras = [];
    for (const b of spec.beats) for (const u of [0.2, 0.55, 0.95]) {
      const t = b.de + (b.ate - b.de) * u; gr.zerar(); const out = { titulos: [], pecas: [], imagens: [] };
      est.compor(t); est.medir(t, out);
      const mainId = B.tela.__canvas;
      amostras.push({
        beat: b.id, t: +t.toFixed(2), passagem: t < b.de + 0.7, hash: gr.resultado().hash,
        textos: gr.textos.filter((x) => x.canvas === mainId).map(({ txt, px, x0, x1, y0, y1 }) => ({ txt, px, x0, x1, y0, y1 })),
        cartoes: [...(out.textos || []), ...(out.titulos || []).map((x) => ({ ...x, forma: 'titulo' }))].map(({ forma, x0, x1, y0, y1 }) => ({ forma, x0, x1, y0, y1 })),
        imagens: gr.imagens.filter((x) => x.canvas === mainId).map(({ tipo, x0, x1, y0, y1 }) => ({ tipo, x0, x1, y0, y1 })).filter((x) => x.x1 - x.x0 > 1500 || x.y1 - x.y0 > 1000).slice(0, 3),
      });
    }
    saida.casos[nome] = { beats: spec.beats.length, amostras };
  }
  return arred(saida);
}

export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const topo = handle ? 246 : 190, tol = 2; let n = 0;
    for (const [nome, c] of Object.entries(d.casos)) for (const a of c.amostras) {
      if (!a.passagem) for (const x of a.textos) {
        n++;
        if (x.txt.startsWith('@')) { assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= 190 - tol && x.y1 <= 225, `${estilo}/${nome}: @ no alto da área útil ${JSON.stringify(x)}`); continue; }
        assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol, `${estilo} ${rotulo}/${nome} ${a.beat}: texto "${x.txt}" fora da área útil ${JSON.stringify(x)}`);
      }
      if (!a.passagem) assert.ok(a.imagens.some((x) => x.x0 <= 55 && x.x1 >= 1864 && x.y0 <= 27 && x.y1 >= 1050), `${estilo} ${rotulo}/${nome} ${a.beat}: o fundo cobre a sangria`);
    }
    assert.ok(n > 20, `${estilo}: houve texto desenhado (${n})`);
    for (const [nome, c] of Object.entries(d.casos)) for (const a of c.amostras) if (!a.passagem) for (const x of a.cartoes) assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol, `${estilo} ${rotulo}/${nome} ${a.beat}: caixa ${x.forma} fora da área útil ${JSON.stringify(x)}`);
  }
}
