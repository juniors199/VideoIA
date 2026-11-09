/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { compilar } from '../src/video/plano.mjs';
import { planoCamera, cameraEm, zoomMaximo, camadaTexto, checarCamera, quint, suave5, mola, seguir } from '../src/video/engine/camera.js';

const falado = (() => {
  const txt = 'Um pote de mel dura muitos anos. O segredo é a falta de água. As bactérias secam antes de crescer. Mas o mel não apodrece. Segue a página.';
  let t = 0; const palavras = txt.split(' ').map((w) => { const p = { w, t, f: t + 0.28 }; t += 0.34; return p; });
  return { palavras, duracao: t + 0.5 };
})();
const cena = (estilo) => ({ tema: 'MEL', estilo, beats: [
  { id: 'a', palavras: [0, 6], titulo: { texto: 'Um pote de *mel* dura muitos anos' }, elementos: [{ tipo: 'peca', forma: 'cubo' }] },
  { id: 'b', palavras: [7, 12], elementos: [{ tipo: 'peca', forma: 'gota' }, { tipo: 'peca', forma: 'cubo' }] },
  { id: 'c', palavras: [13, 19], som: 'virada', elementos: [{ tipo: 'contador', valor: 20, entra: 'bactérias' }] },
  { id: 'd', palavras: [20, 26], elementos: [{ tipo: 'peca', forma: 'esfera' }] } ] });

test('câmera: curvas sem tranco nas pontas e mola que assenta em 1', () => {
  for (const f of [quint, suave5]) { assert.equal(f(0), 0); assert.equal(f(1), 1); assert.ok(Math.abs(f(0.01) - f(0)) < 1e-4 && Math.abs(f(1) - f(0.99)) < 1e-4); }
  assert.ok(Math.abs(mola(3) - 1) < 0.01);
});

test('câmera: motivada pela fala (ênfase, revelação, tensão), determinística e contínua', () => {
  const spec = compilar(cena('padrao'), falado), pl = planoCamera(spec);
  assert.ok(pl.beats[0].te != null, 'o destaque do título marca a ênfase');
  assert.ok(pl.beats[1].revela, 'duas peças: pull-out');
  assert.ok(pl.beats[2].tensao, 'virada: tensão');
  const b0 = spec.beats[0];
  assert.ok(cameraEm(pl, b0.ate - 0.05).z > cameraEm(pl, pl.beats[0].te).z + 0.08, 'push-in presente depois da palavra de destaque');
  assert.deepEqual(cameraEm(pl, 3.3), cameraEm(pl, 3.3), 'função pura do tempo');
  // fora dos cortes (que são transições de propósito: deslize, zoom-through, match) nada passa de 25%/s nem de 5°/s
  const perto = (t) => pl.beats.some((b) => Math.abs(t - b.de) < 0.7);
  for (let t = 0.05; t < spec.duracao; t += 0.05) { if (perto(t)) continue; const a = cameraEm(pl, t - 0.05), c = cameraEm(pl, t); assert.ok(Math.abs(c.z - a.z) < 0.0126 && Math.abs(c.rot - a.rot) < 0.25, `sem salto em ${t.toFixed(2)} s`); }
  for (let i = 0; i < pl.beats.length; i++) assert.ok(zoomMaximo(pl, i) < 1.3);
  assert.ok(new Set(pl.beats.slice(1).map((b) => b.corte)).size >= 2, 'os cortes variam (nem sempre continuidade)');
  for (let t = 0; t < spec.duracao; t += 0.05) { const c = cameraEm(pl, t); if (c.corte) continue; let bi = 0; pl.beats.forEach((b, i) => { if (t >= b.de) bi = i; }); assert.ok(c.z <= zoomMaximo(pl, bi) + 0.005, `zoom dentro do encaixe em ${t.toFixed(2)} s`); }
  // 0.6.19: o aviso passou de 25%/s para 8%/s de zoom e vale para todo beat (um por beat); nada passa de 25%/s
  const rapidas = checarCamera(pl, spec).filter((a) => /rápida/.test(a.msg));
  assert.equal(new Set(rapidas.map((a) => a.beat)).size, rapidas.length, 'um aviso por beat');
  for (const a of rapidas) assert.ok(Number(/zoom (\d+)%/.exec(a.msg)[1]) < 25, a.msg);
});

test('câmera 0.6.19: aviso para todo beat acima de 8%/s de zoom (antes só avisava 1)', () => {
  const spec = compilar(cena('padrao'), falado), pl = planoCamera(spec);
  const rap = checarCamera(pl, spec).filter((a) => a.tipo === 'camera-rapida');
  const perto = (t) => pl.beats.some((b) => Math.abs(t - b.de) < 0.65);
  const esperados = new Set();
  for (let t = 0.2; t < pl.dur - 0.3; t += 0.1) {
    if (perto(t)) continue;
    const bi = pl.beats.reduce((k, b, i) => (t >= b.de ? i : k), 0), bb = pl.beats[bi], punch = bb.P.brusco && bb.te != null && t >= bb.te && t < bb.te + 0.6;
    if (!punch && Math.abs(cameraEm(pl, t).z - cameraEm(pl, t - 0.1).z) / 0.1 > 0.08) esperados.add(spec.beats[bi].id);
  }
  assert.deepEqual(new Set(rap.map((a) => a.beat)), esperados);
  assert.ok(esperados.size >= 2, 'o exemplo tem mais de um beat com push-in forte');
});

test('câmera: texto acompanha no máximo 24 px, sem zoom; chicote do tubo com desfoque só no corte', () => {
  assert.deepEqual(camadaTexto({ z: 1.08, x: 900, y: -900, rot: 2 }), { z: 1, rot: 0, x: 24, y: -24, desfoque: 0, foco: 1, corte: null });
  const spec = compilar(cena('tubo'), falado), pl = planoCamera(spec), c1 = spec.beats[1].de;
  assert.ok(cameraEm(pl, c1 - 0.05).desfoque > 1 && cameraEm(pl, c1 + 0.6).desfoque === 0);
  const p = seguir((t) => [t * 100, 0], 2, { atraso: 0.5 });
  assert.ok(p[0] < 200 && p[0] > 150, 'travelling atrasado e suave');
});

test('câmera: o deslize atravessa o corte numa direção só (sem vai e volta nem salto) e a mola padrão não oscila', () => {
  const spec = compilar(cena('cartoes'), falado), pl = planoCamera(spec);
  for (const b of pl.beats.slice(1).filter((x) => x.corte === 'deslize')) {
    const xs = []; for (let t = b.de - 0.6; t <= b.de + 0.8; t += 1 / 30) xs.push(cameraEm(pl, t).x);
    for (let i = 1; i < xs.length; i++) assert.ok(Math.abs(xs[i] - xs[i - 1]) < 4, `sem salto no deslize em ${b.de.toFixed(2)} s`);
  }
  for (let u = 0.02; u <= 1.5; u += 0.02) assert.ok(mola(u) >= mola(u - 0.02) - 1e-9 && mola(u) <= 1 + 1e-9, 'mola criticamente amortecida: monotônica, sem overshoot');
});
