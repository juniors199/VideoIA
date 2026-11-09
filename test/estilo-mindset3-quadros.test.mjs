/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { compilar } from '../src/video/plano.mjs';
import { abrir } from '../src/video/render.mjs';
import { CENA_M3, falado } from './fixtures/mindset3-cena.mjs';

/**
 * Estilo mindset3 no navegador: quadro determinístico, protagonista medido e centrado, legenda numa linha com a base no fim da área segura (y 1418),
 * e nenhuma transição clareia o quadro (luz média da troca nunca passa da dos dois lados).
 */
test('navegador: mindset3 determinístico, protagonista centrado, legenda numa linha e troca de beat sem clarão', { timeout: 300000 }, async () => {
  const spec = compilar(structuredClone(CENA_M3), falado);
  const { paginas, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const p = paginas[0];
    const foto = async (x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return p.screenshot({ type: 'png' }); };
    const hash = async (x) => crypto.createHash('sha1').update(await foto(x)).digest('hex');
    const t = spec.beats[0].ate - 0.3;
    await hash(t); const a = await hash(t); await hash(0.5);
    assert.equal(await hash(t), a, 'mesmo t, mesmos pixels');
    const m = await p.evaluate((q) => window.ilu.medir(q), t);
    assert.equal(m.estilo, 'mindset3');
    const pc = (m.imagens || []).find((c) => String(c.forma).startsWith('mindset3:'));
    assert.ok(pc, 'o desenho é medido como protagonista');
    assert.ok(Math.abs((pc.x0 + pc.x1) / 2 - 540) <= 24, `centrado (${Math.round((pc.x0 + pc.x1) / 2)})`);
    assert.ok(m.legenda && m.legenda.linhas === 1 && m.legenda.x0 >= 152 && m.legenda.x1 <= 928 && m.legenda.y0 > 1340 && m.legenda.y1 <= 1418, `legenda numa linha com a base na área segura (${JSON.stringify(m.legenda)})`);
    // nenhuma transição clareia: a luz média dos quadros da troca fica abaixo da maior das duas pontas (+ folga do desenho)
    const luz = async (x) => { const png = await foto(x); const b64 = png.toString('base64'); return p.evaluate(async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode(); const c = document.createElement('canvas'); c.width = 40; c.height = 70; const g = c.getContext('2d'); g.drawImage(im, 0, 0, 40, 70); const d = g.getImageData(0, 0, 40, 70).data; let L = 0; for (let i = 0; i < d.length; i += 4) L += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; return L / (d.length / 4); }, b64); };
    for (const b of spec.beats.slice(1, 4)) {
      const antes = await luz(b.de - 0.25), depois = await luz(b.de + 0.9), teto = Math.max(antes, depois) + 6;
      for (const dt of [0.03, 0.1, 0.2, 0.3, 0.45]) { const l = await luz(b.de + dt); assert.ok(l <= teto, `${b.id}: clarão na troca (${l.toFixed(1)} contra ${teto.toFixed(1)})`); }
    }
  } finally { await fechar(); }
});
