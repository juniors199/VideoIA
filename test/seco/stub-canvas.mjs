/*
 * 
 * 
 */
/**
 * Canvas de mentira para o teste seco (sem Chromium): roda o `compor(t)` de um estilo de canvas 2D no Node. Acompanha a matriz
 * (save/restore, translate, scale, rotate, setTransform), mede texto de forma aproximada (0,46 em por letra) e registra cada
 * fillText e cada preenchimento (fillRect/arc/path) já em px do quadro, para conferir área útil e cobertura da sangria.
 */
const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
const ap = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

export function criarCtx(reg, nome = 'principal') {
  const est = { m: [1, 0, 0, 1, 0, 0], pilha: [], font: '16px sans-serif', textAlign: 'left', globalAlpha: 1, comp: 'source-over', ls: 0 };
  const base = {
    save() { est.pilha.push({ m: est.m.slice(), font: est.font, textAlign: est.textAlign, globalAlpha: est.globalAlpha, comp: est.comp, ls: est.ls }); },
    restore() { const s = est.pilha.pop(); if (s) Object.assign(est, s); },
    translate(x, y) { est.m = mul(est.m, [1, 0, 0, 1, x, y]); },
    scale(x, y) { est.m = mul(est.m, [x, 0, 0, y ?? x, 0, 0]); },
    rotate(a) { const c = Math.cos(a), s = Math.sin(a); est.m = mul(est.m, [c, s, -s, c, 0, 0]); },
    transform(a, b, c, d, e, f) { est.m = mul(est.m, [a, b, c, d, e, f]); },
    setTransform(a, b, c, d, e, f) { if (a && typeof a === 'object') est.m = [a.a, a.b, a.c, a.d, a.e, a.f]; else est.m = [a, b, c, d, e, f]; },
    resetTransform() { est.m = [1, 0, 0, 1, 0, 0]; },
    getTransform() { return { a: est.m[0], b: est.m[1], c: est.m[2], d: est.m[3], e: est.m[4], f: est.m[5] }; },
    measureText(txt) { const px = Number(/(\d+(?:\.\d+)?)px/.exec(est.font)?.[1] || 16); const w = String(txt).length * (px * 0.46 + est.ls); return { width: w, actualBoundingBoxAscent: px * 0.72, actualBoundingBoxDescent: px * 0.22 }; },
    fillText(txt, x, y) {
      const px = Number(/(\d+(?:\.\d+)?)px/.exec(est.font)?.[1] || 16), w = String(txt).length * (px * 0.46 + est.ls), esc = Math.hypot(est.m[0], est.m[1]);
      const x0 = est.textAlign === 'center' ? x - w / 2 : est.textAlign === 'right' || est.textAlign === 'end' ? x - w : x;
      const [ax, ay] = ap(est.m, x0, y - px * 0.75), [bx, by] = ap(est.m, x0 + w, y + px * 0.2);
      if (String(txt).trim() && est.globalAlpha > 0.05) reg.textos.push({ txt: String(txt), x0: Math.min(ax, bx), x1: Math.max(ax, bx), y0: Math.min(ay, by), y1: Math.max(ay, by), px: px * esc, canvas: nome });
    },
    fillRect(x, y, w, h) { const [ax, ay] = ap(est.m, x, y), [bx, by] = ap(est.m, x + w, y + h); if (est.globalAlpha > 0.05 && est.comp === 'source-over') reg.fills.push({ x0: Math.min(ax, bx), x1: Math.max(ax, bx), y0: Math.min(ay, by), y1: Math.max(ay, by), canvas: nome }); },
    drawImage(img, ...a) {
      if (a.length === 2 || a.length === 4 || a.length === 8) {
        const [dx, dy, dw, dh] = a.length === 8 ? a.slice(4) : a.length === 4 ? a : [a[0], a[1], img?.width || 0, img?.height || 0];
        const [ax, ay] = ap(est.m, dx, dy), [bx, by] = ap(est.m, dx + dw, dy + dh);
        reg.imagens.push({ x0: Math.min(ax, bx), x1: Math.max(ax, bx), y0: Math.min(ay, by), y1: Math.max(ay, by), de: img?.__nome || null });
      }
    },
    createLinearGradient() { return { addColorStop() {} }; }, createRadialGradient() { return { addColorStop() {} }; }, createConicGradient() { return { addColorStop() {} }; },
    createPattern() { return { setTransform() {} }; },
    createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
    getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; },
    isPointInPath() { return false; },
  };
  const prop = { font: (v) => { est.font = v; }, textAlign: (v) => { est.textAlign = v; }, globalAlpha: (v) => { est.globalAlpha = v; }, globalCompositeOperation: (v) => { est.comp = v; }, letterSpacing: (v) => { est.ls = parseFloat(v) || 0; } };
  return new Proxy({}, {
    get(_, k) { if (k in base) return base[k]; if (k === 'font') return est.font; if (k === 'textAlign') return est.textAlign; if (k === 'globalAlpha') return est.globalAlpha; if (k === 'globalCompositeOperation') return est.comp; if (k === 'canvas') return reg.canvasPrincipal; if (typeof k === 'symbol') return undefined; return (...a) => undefined; },
    set(_, k, v) { if (prop[k]) prop[k](v); return true; },
  });
}

/** Uma "B" (contexto do runtime) de mentira: ctx principal, canvases nomeados, beatEm */
export function criarB({ spec, S, W, H, esc = 1 }) {
  const reg = { textos: [], fills: [], imagens: [], canvasPrincipal: null };
  const canvases = new Map();
  const fazer = (nome, w = W, h = H) => { const c = { width: Math.round(w * esc), height: Math.round(h * esc), __nome: nome, style: {}, getContext: () => ctxs.get(nome) }; return c; };
  const ctxs = new Map();
  const principal = fazer('principal'); reg.canvasPrincipal = principal; ctxs.set('principal', criarCtx(reg, 'principal'));
  const B = {
    S, spec, esc, ctx: ctxs.get('principal'),
    canvas(nome, w = W, h = H) { if (!canvases.has(nome)) { const c = fazer(nome, w, h); ctxs.set(nome, criarCtx(reg, nome)); canvases.set(nome, c); } return canvases.get(nome); },
    beatEm(t) { const bs = spec.beats; for (let i = 0; i < bs.length; i++) if (t >= bs[i].de && t < bs[i].ate) return i; return t < 0 ? 0 : bs.length - 1; },
  };
  return { B, reg };
}
export function instalarDocumento() {
  if (!globalThis.Path2D) globalThis.Path2D = class { constructor() {} addPath() {} moveTo() {} lineTo() {} bezierCurveTo() {} quadraticCurveTo() {} arc() {} rect() {} closePath() {} ellipse() {} };
  if (!globalThis.DOMMatrix) globalThis.DOMMatrix = class { constructor(a) { this.a = a; } };
  if (!globalThis.Image) globalThis.Image = class { constructor() { this.width = 0; this.height = 0; } };
  if (!globalThis.OffscreenCanvas) globalThis.OffscreenCanvas = class { constructor(w, h) { this.width = w; this.height = h; } getContext() { return criarCtx({ textos: [], fills: [], imagens: [] }); } };
  globalThis.document = globalThis.document || { getElementById: () => null, createElement: () => ({ width: 0, height: 0, style: {}, getContext: () => criarCtx({ textos: [], fills: [], imagens: [] }) }), fonts: { add() {}, load: async () => [] }, head: { appendChild() {} }, body: { appendChild() {} } };
}
