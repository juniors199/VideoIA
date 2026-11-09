/*
 * 
 * 
 */
/**
 * Ajuda dos testes de cor da marca: decodifica um PNG (8 bits, RGB ou RGBA, sem entrelaçamento: o que o screenshot do
 * Chromium devolve) e mede quantos pixels cromáticos caem em cada faixa de matiz. Sem dependências.
 */
import zlib from 'node:zlib';

export function lerPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('não é PNG');
  let pos = 8, w = 0, h = 0, tipo = 0; const idat = [];
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos), nome = buf.toString('ascii', pos + 4, pos + 8), dado = buf.subarray(pos + 8, pos + 8 + len);
    if (nome === 'IHDR') { w = dado.readUInt32BE(0); h = dado.readUInt32BE(4); tipo = dado[9]; if (dado[8] !== 8 || dado[12] !== 0) throw new Error('PNG não suportado (só 8 bits sem entrelaçamento)'); }
    if (nome === 'IDAT') idat.push(dado);
    pos += 12 + len;
  }
  const bpp = tipo === 6 ? 4 : tipo === 2 ? 3 : 0; if (!bpp) throw new Error('tipo de PNG não suportado: ' + tipo);
  const raw = zlib.inflateSync(Buffer.concat(idat)), linha = w * bpp, px = Buffer.alloc(w * h * 4);
  let ant = Buffer.alloc(linha);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (linha + 1)], atual = Buffer.from(raw.subarray(y * (linha + 1) + 1, (y + 1) * (linha + 1)));
    for (let i = 0; i < linha; i++) {
      const a = i >= bpp ? atual[i - bpp] : 0, b = ant[i], c = i >= bpp ? ant[i - bpp] : 0;
      let v = atual[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      atual[i] = v & 255;
    }
    for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; px[o] = atual[x * bpp]; px[o + 1] = atual[x * bpp + 1]; px[o + 2] = atual[x * bpp + 2]; px[o + 3] = bpp === 4 ? atual[x * bpp + 3] : 255; }
    ant = atual;
  }
  return { w, h, px };
}

/** matiz (0 a 360), saturação e valor de um pixel */
export function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (!d) return { h: 0, s: 0, v: mx / 255 };
  const h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s: d / mx, v: mx / 255 };
}
const distH = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };

/**
 * Pixels "de cor" (saturação >= smin e brilho >= vmin) e quantos deles estão a até `tol` graus de cada matiz pedido.
 * Devolve { total, cor, por: { <nome>: pixels } }.
 */
export function medirMatizes({ w, h, px }, matizes, { tol = 14, smin = 0.35, vmin = 0.25 } = {}) {
  const por = Object.fromEntries(Object.keys(matizes).map((k) => [k, 0])); let cor = 0;
  for (let i = 0; i < w * h; i++) {
    const o = i * 4, q = hsv(px[o], px[o + 1], px[o + 2]);
    if (q.s < smin || q.v < vmin) continue;
    cor++;
    for (const [k, mz] of Object.entries(matizes)) if (distH(q.h, mz) <= tol) por[k]++;
  }
  return { total: w * h, cor, por };
}
/** histograma de matiz em faixas de 20 graus (para a auditoria) */
export function histogramaMatiz({ w, h, px }, { smin = 0.35, vmin = 0.25 } = {}) {
  const bins = new Array(18).fill(0);
  for (let i = 0; i < w * h; i++) { const o = i * 4, q = hsv(px[o], px[o + 1], px[o + 2]); if (q.s >= smin && q.v >= vmin) bins[Math.floor(q.h / 20) % 18]++; }
  return bins;
}
