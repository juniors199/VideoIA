/*
 * 
 * 
 */
/**
 * Teste seco do pontilhismo (WebGL, sem como rodar o compor no Node): confere a geometria PURA do estilo — o ajuste de posição e escala de qualquer
 * forma (grade de posições e de tamanhos naturais, inclusive a mais larga e a mais alta) e o retângulo da foto da obra — contra a área útil, e que o
 * vertical continua com os números de sempre (limites e o ajuste do vertical). A projeção dos pontos e o brilho não são vistos.
 */
import { arred } from './roteiros.mjs';

export async function medir({ formato, geo, mod }) {
  const P = await mod('src/video/engine/pontos.js');
  const saida = { geo: { W: geo.W, H: geo.H }, roteiros: {}, formas: P.FORMAS_PONTOS.length };
  if (formato === 'horizontal') {
    const exts = [{ w: 300, h: 300 }, { w: 1500, h: 200 }, { w: 200, h: 1500 }, { w: 2200, h: 2200 }, { w: 40, h: 40 }, { w: 900, h: 500 }];
    const pos = [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1], caixas = [], YT = geo.zona.cenaLivre[0], SY = Math.round((YT + 885) / 2);
    for (const ext of exts) for (const tam of [0.6, 1, 1.5]) for (const fx of pos) for (const fy of pos) {
      const a = P.ajusteHorizontal(ext, Math.min(tam, 1100 / ext.w, 620 / ext.h), fx, fy), w = ext.w * a.esc, h = ext.h * a.esc;
      caixas.push({ ext, tam, fx, fy, x0: 960 + a.ox - w / 2, x1: 960 + a.ox + w / 2, y0: SY + a.oy - h / 2, y1: SY + a.oy + h / 2, h, ox: a.ox, oy: a.oy });
    }
    saida.roteiros.ajuste = { excecao: null, caixas: caixas.length, pior: caixas.reduce((m, c) => Math.max(m, 217 - c.x0, c.x1 - 1702), -1e9), piorY: caixas.reduce((m, c) => Math.max(m, YT - c.y0, c.y1 - 885), -1e9), amostra: caixas.slice(0, 2) };
    saida.roteiros.obra = { excecao: null, retangulos: [[undefined, undefined, 0.75], [900, 1200], [1200, 800], [400, 300], [undefined, undefined, 1.5]].map(([l, al, asp]) => P.retanguloObraHorizontal(l, al, asp ?? 1)) };
  }
  return arred(saida);
}

export function conferir(assert, { h, hh, sl, estilo }) {
  for (const [rotulo, d] of [['sem @', h], ['com @', hh], ['sem legenda', sl]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    assert.ok(d.roteiros.ajuste.pior <= 0.5, `${estilo} ${rotulo}: forma sai da área útil em x (${d.roteiros.ajuste.pior})`);
    assert.ok(d.roteiros.ajuste.piorY <= 5, `${estilo} ${rotulo}: forma sai da área útil em y (${d.roteiros.ajuste.piorY})`);
    for (const r of d.roteiros.obra.retangulos) {
      assert.ok(r.x >= 217 && r.x + r.w <= 1702, `${estilo} ${rotulo}: foto da obra na largura útil (${JSON.stringify(r)})`);
      assert.ok(r.y >= (rotulo === 'com @' ? 246 : 190) + 20 && r.y + r.h + 130 <= 885 + 8, `${estilo} ${rotulo}: foto e crédito na altura útil (${JSON.stringify(r)})`);
    }
  }
}
