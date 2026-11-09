/*
 * 
 * 
 */
/**
 * Navegador falso para o teste seco dos estilos de canvas 2D (lote A3 do formato horizontal, 0.6.43): sem Chromium, sem FFmpeg, sem quadros.
 * Um `document` mínimo cria canvases cujo contexto 2D só GRAVA o que o estilo manda desenhar: guarda a matriz de transformação (save, restore,
 * translate, scale, rotate, setTransform), mede o texto (largura por caractere, por família) e registra cada texto e cada imagem com a caixa
 * em px de TELA. Assim o estilo roda inteiro (criar, compor, medir) e o teste confere o que foi desenhado de verdade:
 *  - `textos`: caixa na tela de cada fillText (texto, tamanho da letra, caixa); `imagens`: retângulo de cada drawImage / fillRect grande;
 *  - `hash`: impressão digital de TODA a sequência de comandos de desenho (método e argumentos arredondados, com o canvas de origem), que no
 *    vertical tem de ser idêntica à do motor da base (prova de que o vertical não mudou).
 * Não cobre: aparência, cor, textura, som (ver HORIZONTAL-LOTE-A3.md).
 */

const FAMILIAS = [[/mono|maquina|courier/i, 0.6], [/serif|titulo|lora|garamond|cinzel/i, 0.58], [/.*/, 0.55]];
const fator = (fonte) => FAMILIAS.find(([re]) => re.test(fonte))[1];
const r3 = (n) => Math.round(n * 1000) / 1000;

export function criarGravador() {
  const log = []; let hash = 2166136261, n = 0, idCanvas = 0;
  const mistura = (s) => { for (let i = 0; i < s.length; i++) { hash ^= s.charCodeAt(i); hash = Math.imul(hash, 16777619) >>> 0; } n++; };
  const textos = [], imagens = [];
  const argStr = (a) => (typeof a === 'number' ? String(r3(a)) : typeof a === 'string' ? a : a && a.__canvas != null ? `cv${a.__canvas}` : a && a.naturalWidth != null ? `img${a.naturalWidth}x${a.naturalHeight}` : Array.isArray(a) ? `[${a.map(argStr).join(',')}]` : a == null ? 'nulo' : typeof a);

  function criarCtx(canvas) {
    const est = { M: [1, 0, 0, 1, 0, 0], font: '10px sans-serif', fillStyle: '#000', strokeStyle: '#000', globalAlpha: 1, textAlign: 'left', textBaseline: 'alphabetic', letterSpacing: '0px', filter: 'none', globalCompositeOperation: 'source-over', lineWidth: 1, shadowBlur: 0, shadowColor: 'rgba(0,0,0,0)', shadowOffsetX: 0, shadowOffsetY: 0 };
    const pilha = [];
    const reg = (m, a) => { if (canvas.__medidor) return; mistura(`${canvas.__canvas}:${m}(${a.map(argStr).join(',')})`); };
    const mul = (a, b, c, d, e, f) => { const [A, B, C, D, E, F] = est.M; est.M = [A * a + C * b, B * a + D * b, A * c + C * d, B * c + D * d, A * e + C * f + E, B * e + D * f + F]; };
    const pt = (x, y) => [est.M[0] * x + est.M[2] * y + est.M[4], est.M[1] * x + est.M[3] * y + est.M[5]];
    const caixa = (pts) => ({ x0: Math.min(...pts.map((p) => p[0])), x1: Math.max(...pts.map((p) => p[0])), y0: Math.min(...pts.map((p) => p[1])), y1: Math.max(...pts.map((p) => p[1])) });
    const px = () => parseFloat((/(\d+(?:\.\d+)?)px/.exec(est.font) || [0, 10])[1]);
    const larg = (s) => { const ls = parseFloat(est.letterSpacing) || 0; return String(s).length * (px() * fator(est.font) + ls); };
    const metodos = {
      save() { pilha.push({ ...est, M: [...est.M] }); },
      restore() { const p = pilha.pop(); if (p) Object.assign(est, p); },
      setTransform(a, b, c, d, e, f) { if (a && typeof a === 'object') est.M = [a.a, a.b, a.c, a.d, a.e, a.f]; else est.M = [a, b, c, d, e, f]; },
      resetTransform() { est.M = [1, 0, 0, 1, 0, 0]; },
      transform(a, b, c, d, e, f) { mul(a, b, c, d, e, f); },
      translate(x, y) { mul(1, 0, 0, 1, x, y); },
      scale(x, y) { mul(x, 0, 0, y, 0, 0); },
      rotate(r) { mul(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0); },
      getTransform() { const [a, b, c, d, e, f] = est.M; return { a, b, c, d, e, f }; },
      measureText(s) { const w = larg(s), p = px(); return { width: w, actualBoundingBoxAscent: p * 0.75, actualBoundingBoxDescent: p * 0.2, actualBoundingBoxLeft: 0, actualBoundingBoxRight: w }; },
      createLinearGradient() { return { addColorStop() {} }; },
      createRadialGradient() { return { addColorStop() {} }; },
      createConicGradient() { return { addColorStop() {} }; },
      createPattern() { return { setTransform() {} }; },
      getImageData(x, y, w, h) { const W = Math.max(1, Math.round(w)), H = Math.max(1, Math.round(h)); return { width: W, height: H, data: new Uint8ClampedArray(W * H * 4) }; },
      createImageData(w, h) { if (w && w.width) { h = w.height; w = w.width; } const W = Math.max(1, Math.round(w)), H = Math.max(1, Math.round(h)); return { width: W, height: H, data: new Uint8ClampedArray(W * H * 4) }; },
      isPointInPath() { return false; },
      fillText(s, x, y) { gravaTexto(s, x, y); },
      strokeText(s, x, y) { gravaTexto(s, x, y, true); },
      drawImage(img, ...a) {
        const iw = img.width ?? img.naturalWidth ?? 0, ih = img.height ?? img.naturalHeight ?? 0;
        let dx, dy, dw, dh;
        if (a.length === 2) [dx, dy, dw, dh] = [a[0], a[1], iw, ih]; else if (a.length === 4) [dx, dy, dw, dh] = a; else [dx, dy, dw, dh] = a.slice(4, 8);
        imagens.push({ canvas: canvas.__canvas, tipo: 'drawImage', ...caixa([pt(dx, dy), pt(dx + dw, dy), pt(dx, dy + dh), pt(dx + dw, dy + dh)]), alfa: est.globalAlpha });
      },
      fillRect(x, y, w, h) { imagens.push({ canvas: canvas.__canvas, tipo: 'fillRect', ...caixa([pt(x, y), pt(x + w, y), pt(x, y + h), pt(x + w, y + h)]), alfa: est.globalAlpha }); },
    };
    function gravaTexto(s, x, y, borda = false) {
      const p = px(), w = larg(s), al = est.textAlign;
      const x0 = al === 'center' ? x - w / 2 : al === 'right' || al === 'end' ? x - w : x;
      const bl = est.textBaseline, topo = bl === 'top' || bl === 'hanging' ? y : bl === 'middle' ? y - p * 0.5 : bl === 'bottom' ? y - p : y - p * 0.8, base = topo + p;
      if (!borda) textos.push({ canvas: canvas.__canvas, txt: String(s), px: p, alfa: est.globalAlpha, ...caixa([pt(x0, topo), pt(x0 + w, topo), pt(x0, base), pt(x0 + w, base)]) });
    }
    const alvo = { ...est };
    return new Proxy(alvo, {
      get(_, nome) {
        if (nome === 'canvas') return canvas;
        if (nome in metodos) return (...a) => { reg(nome, a); return metodos[nome](...a); };
        if (nome in est) return est[nome];
        if (typeof nome === 'symbol') return undefined;
        return (...a) => { reg(nome, a); };
      },
      set(_, nome, v) { est[nome] = v; if (!canvas.__medidor && (nome === 'font' || nome === 'fillStyle' || nome === 'letterSpacing' || nome === 'globalAlpha' || nome === 'filter')) mistura(`${canvas.__canvas}:${nome}=${argStr(v)}`); return true; },
    });
  }
  function novoCanvas(w, h) {
    const medidor = w == null && h == null; w ??= 300; h ??= 150;
    const c = { __medidor: medidor, __canvas: idCanvas++, width: w, height: h, style: {}, getContext() { return (c._ctx ||= criarCtx(c)); }, toDataURL() { return 'data:image/png;base64,'; }, addEventListener() {}, getBoundingClientRect() { return { left: 0, top: 0, width: c.width, height: c.height }; } };
    return c;
  }
  return { novoCanvas, textos, imagens, resultado: () => ({ hash: (hash >>> 0).toString(16), comandos: n, log }) , zerar() { textos.length = 0; imagens.length = 0; } };
}

/** instala `document`, `Image`, `DOMMatrix` e `OffscreenCanvas` mínimos; devolve o gravador */
export function instalarNavegadorFalso() {
  const gr = criarGravador();
  class Imagem { constructor() { this.naturalWidth = 0; this.naturalHeight = 0; this.complete = true; } set src(v) { this._src = v; } get src() { return this._src; } }
  class Matriz { constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; } translate(x, y) { this.e += x; this.f += y; return this; } scale(x, y = x) { this.a *= x; this.d *= y; return this; } rotate() { return this; } }
  const el = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, querySelectorAll: () => [], firstElementChild: null, getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }) });
  globalThis.document = {
    createElement: (tag) => (tag === 'canvas' ? gr.novoCanvas() : el()),
    getElementById: () => null, head: { appendChild() {} }, body: { appendChild() {} },
    fonts: { load: async () => null, check: () => true, add() {} },
  };
  globalThis.Image = Imagem; globalThis.DOMMatrix = Matriz; globalThis.OffscreenCanvas = class { constructor(w, h) { return gr.novoCanvas(w, h); } };
  return { ...gr, Imagem };
}

/** o B que o runtime entrega a cada estilo (estilos.js), com canvas, contexto e linha do tempo falsos */
export function criarB({ gr, spec, S, esc = 1 }) {
  const tela = gr.novoCanvas(Math.round(spec.W * esc), Math.round(spec.H * esc));
  const canvases = new Map();
  return {
    S, spec, esc, W: spec.W, H: spec.H, tela, ctx: tela.getContext('2d'),
    canvas: (nome, w = spec.W, h = spec.H, e2 = esc) => { if (!canvases.has(nome)) canvases.set(nome, gr.novoCanvas(Math.round(w * e2), Math.round(h * e2))); return canvases.get(nome); },
    beatEm: (t) => { let i = 0; for (let k = 0; k < spec.beats.length; k++) if (t >= spec.beats[k].de - 1e-6) i = k; return i; },
    estiloDoBeat: (b) => b.estilo || spec.estilo,
  };
}
