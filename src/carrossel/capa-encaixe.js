/*
 * 
 * 
 */
/**
 * Capa em "encaixe por silhueta" (0.6.16, aprovado pelo dono em 30/10/2026; ideia vista na auditoria do repositório
 * subtitles_studio, reescrita do zero). A palavra principal é grande; as palavras antes e depois entram nos vãos reais das letras:
 * o programa rasteriza a palavra, mede o topo e a base da tinta coluna a coluna e posiciona cada linha de apoio até encostar
 * (folga mínima), como no protótipo scripts/prototipo-lockup.mjs. Nenhum arquivo ou código do repositório é usado.
 *
 * lockupCapa(palavras, { largura, altura }) devolve o layout ou null (o motor então usa a capa de sempre): gancho curto
 * (2 a 10 palavras), palavra principal de 4+ letras e linhas de apoio que cabem na largura da principal.
 * Sem DOM no topo do módulo; o canvas de medida nasce na primeira chamada.
 */
export const FRACAS = new Set(['a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'e', 'ou', 'que', 'com', 'por', 'para', 'pra', 'ao', 'aos', 'se', 'mas', 'como', 'mais', 'te', 'me', 'seu', 'sua', 'seus', 'suas', 'ele', 'ela', 'eu', 'você', 'the', 'of', 'to', 'in', 'and', 'for', 'el', 'la', 'los', 'las']);
const TRACK = -0.035;
const FAMILIA = "'IluD','Ilu',sans-serif";
let cv = null, cg = null;
const ctx = () => { if (!cg) { cv = document.createElement('canvas'); cg = cv.getContext('2d', { willReadFrequently: true }); } return cg; };
const fonte = (g, px) => { g.font = `800 ${px}px ${FAMILIA}`; g.letterSpacing = `${(TRACK * px).toFixed(2)}px`; };
const largura = (txt, px) => { const g = ctx(); fonte(g, px); return g.measureText(txt).width; };

/** tinta do texto: topo e base (px, relativos à linha de base) de cada coluna; null onde não há tinta */
function tinta(txt, px) {
  const g = ctx(), larg = Math.ceil(largura(txt, px)) + Math.ceil(px * 0.6), alt = Math.ceil(px * 2.2), pad = Math.ceil(px * 0.3), base = Math.ceil(px * 1.5);
  cv.width = larg; cv.height = alt; fonte(g, px);
  g.clearRect(0, 0, larg, alt); g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.fillText(txt, pad, base);
  const d = g.getImageData(0, 0, larg, alt).data, top = new Array(larg).fill(null), bot = new Array(larg).fill(null);
  for (let x = 0; x < larg; x++) {
    for (let y = 0; y < alt; y++) if (d[(y * larg + x) * 4 + 3] > 96) { top[x] = y - base; break; }
    if (top[x] != null) for (let y = alt - 1; y >= 0; y--) if (d[(y * larg + x) * 4 + 3] > 96) { bot[x] = y + 1 - base; break; }
  }
  return { top, bot, pad, larg, w: largura(txt, px) };
}
const alturaX = (px) => { const t = tinta('x', px), i = t.top.findIndex((v) => v != null); return -t.top[i]; };
const fontAsc = (px) => { const g = ctx(); fonte(g, px); const m = g.measureText('x'); return { asc: m.fontBoundingBoxAscent, desc: m.fontBoundingBoxDescent }; };

/** a palavra principal: a mais longa e com ascendentes ou descendentes (b d f h k l t g j p q y), longe de artigo e preposição */
export function escolherPrincipal(ws) {
  let melhor = -1, nota = -Infinity;
  ws.forEach((p, i) => {
    const limpa = p.w.replace(/[^\p{L}\p{N}]/gu, ''), baixa = limpa.toLowerCase();
    if (limpa.length < 4) return;
    const n = limpa.length + (p.d ? 3 : 0) + 1.5 * (baixa.match(/[bdfhklgjpqyt]/g) || []).length - (FRACAS.has(baixa) ? 20 : 0) - (limpa.length > 12 ? 8 : 0);
    if (n > nota) { nota = n; melhor = i; }
  });
  return melhor;
}

/** melhor encaixe da linha de apoio ('acima' ou 'abaixo') contra o perfil da principal; y é a linha de base, relativa à da principal */
function encaixe(mp, mpx, wm, txt, spx, papel, folga, xh) {
  const si = tinta(txt, spx), ws = si.w, ov = 0.02 * wm;
  const lo = Math.min(ws / 2 - ov, wm / 2), hi = Math.max(wm - ws / 2 + ov, wm / 2);
  const cols = []; for (let x = 0; x < si.larg; x++) if (si.top[x] != null) cols.push(x);
  const solta = papel === 'acima' ? mp.minTop - folga - Math.max(...cols.map((x) => si.bot[x])) : mp.maxBot + folga - Math.min(...cols.map((x) => si.top[x]));
  let melhor = null;
  for (let cx = Math.floor(lo); cx <= Math.ceil(hi); cx += 2) {
    const x0 = cx - ws / 2;
    let y = papel === 'acima' ? Infinity : -Infinity;
    for (const c of cols) {
      const col = Math.round(x0 + c - si.pad) + mp.pad;
      if (col < 0 || col >= mp.topD.length) continue;
      if (papel === 'acima' && mp.topD[col] != null) y = Math.min(y, mp.topD[col] - si.bot[c] - folga);
      if (papel === 'abaixo' && mp.botD[col] != null) y = Math.max(y, mp.botD[col] - si.top[c] + folga);
    }
    if (!Number.isFinite(y)) y = solta;
    if (papel === 'acima') y = Math.min(y, -xh - folga); // a de cima nunca entra no corpo da principal
    else y = Math.max(y, folga - Math.min(...cols.map((x) => si.top[x])));
    const ganho = papel === 'acima' ? y - solta : solta - y, nota = ganho - 0.08 * Math.abs(cx - wm / 2);
    if (!melhor || nota > melhor.nota) melhor = { cx, y, ganho, nota };
  }
  const q = melhor.ganho >= 0.08 * mpx ? 'tucked' : melhor.ganho >= 0.03 * mpx ? 'tight' : 'loose';
  return { ...melhor, q, ws, si };
}

/**
 * palavras: [{ w, d }] (d = destaque). Devolve { w, h, itens: [{ partes, px, x, base, asc, desc, papel }], qual } com x e base
 * relativos ao canto superior esquerdo da caixa, ou null quando o gancho não serve para o encaixe.
 */
export function lockupCapa(palavras, { largura: L = 880, altura: A = 800, minPx = 150, maxPx = 300, principal: forcada = -1 } = {}) {
  if (!Array.isArray(palavras) || palavras.length < 2 || palavras.length > 10) return null;
  const im = forcada >= 0 && forcada < palavras.length ? forcada : escolherPrincipal(palavras);
  if (im < 0) return null;
  const principal = palavras[im], acima = palavras.slice(0, im), abaixo = palavras.slice(im + 1);
  const txtPrin = principal.w, wUnit = largura(txtPrin, 100);
  let teto = Math.min(maxPx, (L / wUnit) * 100);
  for (let tent = 0; tent < 8 && teto >= minPx; tent++, teto *= 0.93) {
    const mpx = teto, mt = tinta(txtPrin, mpx), idx = mt.top.map((v, i) => (v != null ? i : -1)).filter((i) => i >= 0);
    const folga = Math.max(6, 0.03 * mpx), d = Math.ceil(folga), xh = alturaX(mpx);
    const dil = (arr, f) => arr.map((_, i) => { let v = null; for (let k = Math.max(0, i - d); k <= Math.min(arr.length - 1, i + d); k++) if (arr[k] != null) v = v == null ? arr[k] : f(v, arr[k]); return v; });
    const mp = { pad: mt.pad, topD: dil(mt.top, Math.min), botD: dil(mt.bot, Math.max), minTop: Math.min(...idx.map((i) => mt.top[i])), maxBot: Math.max(...idx.map((i) => mt.bot[i])) };
    const wm = mt.w, itens = [], qual = {};
    let falhou = false;
    for (const [papel, ws] of [['acima', acima], ['abaixo', abaixo]]) {
      if (!ws.length) continue;
      const txt = ws.map((p) => p.w).join(' '), spx0 = Math.max(56, mpx * 0.42);
      let melhor = null;
      for (const f of [1, 0.9, 0.8, 0.72, 0.64, 0.56]) {
        let px = spx0 * f; const w = largura(txt, px); if (w > wm * 0.85) px *= (wm * 0.85) / w;
        if (px < 40) { falhou = true; break; }
        const r = encaixe(mp, mpx, wm, txt, px, papel, folga, xh), prof = papel === 'abaixo' ? mp.maxBot : -mp.minTop - xh;
        const util = 0.65 * Math.min(1, r.ganho / Math.max(1, prof)) + 0.35 * (px / spx0);
        if (!melhor || util > melhor.util) melhor = { util, px, r };
        if (r.ganho / Math.max(1, prof) >= 0.85 && f === 1) break;
      }
      if (falhou || !melhor) { falhou = true; break; }
      qual[papel] = melhor.r.q;
      itens.push({ papel, partes: ws, px: melhor.px, cx: melhor.r.cx, y: melhor.r.y, ws: melhor.r.ws, si: melhor.r.si });
    }
    if (falhou) return null;
    // caixa total
    let y0 = mp.minTop, y1 = mp.maxBot, x0 = 0, x1 = wm;
    for (const it of itens) {
      const idx2 = it.si.top.map((v, i) => (v != null ? i : -1)).filter((i) => i >= 0);
      y0 = Math.min(y0, it.y + Math.min(...idx2.map((i) => it.si.top[i]))); y1 = Math.max(y1, it.y + Math.max(...idx2.map((i) => it.si.bot[i])));
      x0 = Math.min(x0, it.cx - it.ws / 2); x1 = Math.max(x1, it.cx + it.ws / 2);
    }
    if (y1 - y0 > A || x1 - x0 > L + 4) continue; // não cabe: tenta com a principal menor
    const todos = [{ papel: 'principal', partes: [principal], px: mpx, x: 0, y: 0 }, ...itens.map((it) => ({ papel: it.papel, partes: it.partes, px: it.px, x: it.cx - it.ws / 2, y: it.y }))];
    return { w: x1 - x0, h: y1 - y0, qual, mpx: Math.round(mpx), itens: todos.map((it) => ({ ...it, x: it.x - x0, base: it.y - y0, ...fontAsc(it.px) })) };
  }
  return null;
}

/** DOM da capa: um div absoluto por linha, com a linha de base exata (line-height = ascent + descent da fonte) */
export function montarLockupDOM(res, { frente, destaque }) {
  const caixa = document.createElement('div');
  caixa.style.cssText = `position:relative;flex:none;width:${res.w.toFixed(1)}px;height:${res.h.toFixed(1)}px`;
  for (const it of res.itens) {
    const d = document.createElement('div');
    d.style.cssText = `position:absolute;left:${it.x.toFixed(1)}px;top:${(it.base - it.asc).toFixed(1)}px;white-space:pre;text-align:left;font:800 ${it.px.toFixed(1)}px/${(it.asc + it.desc).toFixed(1)}px ${FAMILIA};font-variation-settings:normal;font-optical-sizing:auto;letter-spacing:${(TRACK * it.px).toFixed(2)}px`;
    it.partes.forEach((p, i) => {
      const s = document.createElement('span');
      s.textContent = p.w + (i < it.partes.length - 1 ? ' ' : '');
      s.style.color = p.d ? destaque : frente;
      d.appendChild(s);
    });
    caixa.appendChild(d);
  }
  return caixa;
}
