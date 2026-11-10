/*
 * 
 * 
 */
/** Teste seco do quadro-antigo (lote A3): roda o estilo inteiro num navegador falso (ctx-falso.mjs) e mede o que foi desenhado. */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { instalarNavegadorFalso, criarB } from './ctx-falso.mjs';

const Q = (forma, extra = {}) => ({ tipo: 'quadro-antigo', forma, ...extra });
const IMG = (gr) => { const i = new gr.Imagem(); i.naturalWidth = 1600; i.naturalHeight = 1000; i.width = 1600; i.height = 1000; return i; };
/** conjuntos de elementos que cobrem TODAS as formas (bases e sobras), um por beat, em ciclo */
const CONJUNTOS = (gr) => [
  () => [Q('pintura', { _img: IMG(gr), foco: [0.5, 0.45], movimento: 'empurra' }), Q('texto', { texto: 'O mel *nunca* estraga e dura milênios', zona: 'topo' }), Q('texto', { texto: 'Arqueólogos acharam potes comestíveis no Egito', zona: 'baixo' })],
  () => [Q('pintura', { _img: IMG(gr), moldura: 'pagina', movimento: 'esquerda' }), Q('titulo', { texto: 'EGITO' }), Q('numero', { valor: '3000', rotulo: 'anos', layout: 'inline' })],
  () => [Q('pintura', { _img: IMG(gr), moldura: 'dourada', placa: 'Mel de tumba, c. 1300 a.C.', craquele: true }), Q('etiqueta', { texto: 'pote lacrado', aponta: [0.5, 0.4], ordem: 1 }), Q('carimbo', { texto: 'VERDADE', cor: 'vermelho' })],
  () => [Q('painel', { numero: '1839', rotulo: 'o ano da primeira foto', emNumero: 0.3 }), Q('fonte', { texto: 'Fonte: Museu Britânico' })],
  () => [Q('folha', { texto: 'Quando a tempestade apagou a lâmpada do farol, ninguém imaginava que uma vela bastaria para guiar todos os barcos de volta para casa naquela noite escura e longa do inverno', corpo: 62, cabecalho: 'Diário de bordo' })],
  () => [Q('mapa', { lugares: [{ nome: 'Lisboa', lon: -9.1, lat: 38.7 }, { nome: 'Goa', lon: 73.8, lat: 15.5 }, { nome: 'Macau', lon: 113.5, lat: 22.2 }], rota: true })],
  () => [Q('linha', { eventos: [{ rotulo: '1822', texto: 'Independência' }, { rotulo: '1889', texto: 'República proclamada' }, { rotulo: '1930', texto: 'Revolução' }, { rotulo: '1964', texto: 'Golpe militar' }, { rotulo: '1988', texto: 'Constituição', destaque: true }], ponte: '166 anos' }), Q('texto', { texto: 'Do império à democracia em 166 anos', zona: 'baixo' })],
  () => [Q('medalhao', { _img: IMG(gr), nome: 'Dom Pedro Primeiro de Bragança', funcao: 'Imperador do Brasil' }), Q('citacao', { texto: 'Independência ou morte', lado: 'dir', zona: 'baixo' })],
  () => [Q('comparacao', { esq: { titulo: 'Mito', texto: 'usamos dez por cento' }, dir: { titulo: 'Fato', texto: 'usamos tudo' }, risca: 'esq', circula: 'dir' })],
  () => [Q('logo', { marca: 'claude', _img: IMG(gr), texto: 'O Claude escreve código sozinho' })],
  () => [Q('painel', { numero: '86 bilhões', rotulo: 'neurônios' }), Q('lista', { itens: ['Luz fraca à noite', 'Quarto fresco', 'Horário fixo'] })],
  () => [Q('pintura', { _img: IMG(gr), foco: [0.3, 0.5] }), Q('numero', { valor: '2026', rotulo: 'hoje', layout: 'grande' }), Q('marca', { marca: 'circulo', pos: [0.4, 0.4] }), Q('texto', { texto: 'Fim da história e começo da conversa', zona: 'meio', lado: 'centro' })],
];

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  const gr = instalarNavegadorFalso();
  const { compilar } = await mod('src/video/plano.mjs');
  const { usarGeoNode } = await mod('src/video/engine/geo.js').catch(() => ({}));
  if (usarGeoNode) usarGeoNode(geo);
  const AP = await mod('src/video/autoplano-quadro-antigo.mjs');
  const E = await mod('src/video/engine/estilo-quadro-antigo.js');
  const extra = formato === 'horizontal' ? { formato, handle, legenda } : {};
  const saida = { geo: { W: geo.W, H: geo.H }, casos: {} };
  const casos = [];
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const f = falado(txt), beats = porFrase(f.palavras).map((b) => ({ ...b, elementos: [] }));
    AP.planejarQuadroAntigo(beats, f.palavras);
    casos.push([`auto-${nome}`, f, beats]);
  }
  const f = falado(`${BATERIA.longo} ${BATERIA.numeroGrande} ${BATERIA.lista} ${BATERIA.marca}`), cj = CONJUNTOS(gr);
  const beats = porFrase(f.palavras).map((b, i) => ({ ...b, passagem: ['desfoque', 'desliza', 'rasgo', 'corte'][i % 4], elementos: cj[i % cj.length]() }));
  casos.push(['manual-todas-as-formas', f, beats]);
  for (const [nome, fala, bts] of casos) {
    const cena = { tema: 'X', estilo, tom: 'sepia', textura: 'leve', beats: bts, ...extra };
    for (const b of cena.beats) for (const e of b.elementos || []) if (e.tipo === 'quadro-antigo' && (e.forma === 'pintura' || e.forma === 'medalhao') && !e._img) e._img = IMG(gr);
    const spec = compilar(cena, fala); spec.W = geo.W; spec.H = geo.H; spec.dur = fala.duracao;
    const S = { spec, dur: fala.duracao, esc: 1, m: { destaque: '#FF7A1A', serie: handle ? '@kaueajure' : '' } };
    const B = criarB({ gr, spec, S }), est = E.criarQuadroAntigo(B), amostras = [];
    for (const b of spec.beats) for (const u of [0.15, 0.5, 0.97]) {
      const t = b.de + (b.ate - b.de) * u; gr.zerar(); const out = { titulos: [], pecas: [], imagens: [] };
      est.compor(t); est.medir(t, out);
      const mainId = B.tela.__canvas;
      amostras.push({
        beat: b.id, t: +t.toFixed(2), passagem: t < b.de + 0.62, hash: gr.resultado().hash,
        textos: gr.textos.filter((x) => x.canvas === mainId).map(({ txt, px, x0, x1, y0, y1 }) => ({ txt, px, x0, x1, y0, y1 })),
        cartoes: (out.textos || []).map(({ forma, x0, x1, y0, y1 }) => ({ forma, x0, x1, y0, y1 })),
        imagens: gr.imagens.filter((x) => x.canvas === mainId).map(({ tipo, x0, x1, y0, y1 }) => ({ tipo, x0, x1, y0, y1 })).filter((x) => x.x1 - x.x0 > 1500 || x.y1 - x.y0 > 1000).slice(0, 3),
      });
    }
    saida.casos[nome] = { beats: spec.beats.length, amostras };
  }
  return arred(saida);
}

/** horizontal: todo texto desenhado na área útil, @ no alto, fundo cobrindo a sangria, sem exceção; vertical: ver o hash no fixture */
export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const topo = handle ? 246 : 190, tol = 2;
    let n = 0;
    for (const [nome, c] of Object.entries(d.casos)) for (const a of c.amostras) {
      for (const x of a.textos) {
        n++;
        if (x.txt.startsWith('@')) { assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= 190 - tol && x.y1 <= 225, `${estilo}/${nome}: @ no alto da área útil ${JSON.stringify(x)}`); continue; }
        assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol, `${estilo} ${rotulo}/${nome} ${a.beat}: texto "${x.txt}" fora da área útil ${JSON.stringify(x)}`);
      }
      for (const x of a.cartoes) assert.ok(x.x0 >= 217 - tol && x.x1 <= 1702 + tol && x.y0 >= topo - tol && x.y1 <= 885 + tol || /pintura|painel|folha|mapa|linha|medalhao|comparacao|logo|aberto/.test(x.forma), `${estilo} ${rotulo}/${nome}: cartão ${x.forma} fora da área útil ${JSON.stringify(x)}`);
      if (!a.passagem) assert.ok(a.imagens.some((x) => x.x0 <= 55 && x.x1 >= 1864 && x.y0 <= 27 && x.y1 >= 1050), `${estilo} ${rotulo}/${nome} ${a.beat}: o fundo cobre a sangria`);
    }
    assert.ok(n > 20, `${estilo}: houve texto desenhado (${n})`);
  }
}
