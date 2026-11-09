/*
 * 
 * 
 */
/** Teste seco da família cartoon de ilustração (prickles, little-light): planejador, elenco, câmera e verificador, sem render. */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  const { compilar } = await mod('src/video/plano.mjs');
  const PL = await mod('src/video/autoplano-cartoon-ilustracao.mjs');
  const CI = await mod('src/video/engine/cartoon-ilustracao.js');
  const pr = estilo === 'prickles';
  const E = await mod(pr ? 'src/video/engine/estilo-prickles.js' : 'src/video/engine/estilo-little-light.js');
  const partesFn = pr ? E.partesPrickles : E.partesLittleLight, verFn = pr ? E.verificarPrickles : E.verificarLittleLight, caixaFn = pr ? E.caixaGrupoPR : E.caixaGrupoLL, regras = pr ? E.REGRAS_PRICKLES : E.REGRAS_LITTLE_LIGHT;
  const saida = { geo: { W: geo.W, H: geo.H }, roteiros: {}, legendaVariante: { y: regras.legenda.y, px: regras.legenda.px } };
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const f = falado(txt), beats = porFrase(f.palavras).map((b) => ({ ...b, elementos: [] }));
    (pr ? PL.planejarPrickles : PL.planejarLittleLight)(beats, f.palavras);
    const cena = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
    const spec = compilar(cena, f), { partes, legenda: leg } = partesFn(spec);
    const ver = verFn(spec), dur = spec.duracao || 0;
    const out = { beats: beats.length, falhas: ver.falhas.map((x) => `${x.tipo}: ${x.msg}`), partes: [], legenda: [] };
    for (const P of partes) {
      const cx = caixaFn(P), caixas = [];
      if (cx) for (let k = 0; k <= 4; k++) {
        const t = P.de + ((P.ate - P.de) * k) / 4, cam = CI.cameraDaParte(P, t, dur);
        const [x0, y0] = CI.naTelaCI(cam, cx.x0, cx.y0), [x1, y1] = CI.naTelaCI(cam, cx.x1, cx.y1);
        caixas.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), y0: Math.min(y0, y1), y1: Math.max(y0, y1) });
      }
      out.partes.push({ forma: P.forma, cenario: P.cen?.id, camera: P.cam, plano: P.plano, grupo: cx, elenco: (P.elenco || []).map((c) => ({ id: c.id, x: c.x, y: c.base ?? c.y, s: c.s })), caixas, trava: P.trava });
    }
    for (const G of leg) out.legenda.push({ txt: G.ws.map((w) => w.w).join(' '), n: G.ws.length });
    saida.roteiros[nome] = out;
  }
  saida.area = CI.REGRAS_CI.area; saida.centro = CI.REGRAS_CI.centro;
  try { saida.mundo = { w: CI.W_CI, h: CI.H_CI, telaLarg: (CI.W_CI + 400) * CI.KS_CI, telaAlt: (CI.H_CI + 400) * CI.KS_CI, desvioEixo: CI.OFFX_CI + (CI.W_CI - 1080) / 2 }; } catch { /* base sem o mundo largo */ }
  return arred(saida);
}

const tipos = (l) => new Set(l.map((s) => s.split(':')[0]));
export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const lv = d.legendaVariante, topoLeg = lv.y - lv.px * 0.62, baseLeg = lv.y + lv.px * 0.62;
    assert.ok(topoLeg >= (handle ? 224 : 190) && baseLeg <= 885, `${estilo} ${rotulo}: legenda (y ${Math.round(topoLeg)} a ${Math.round(baseLeg)}) na área útil e abaixo do @`);
    const m = d.mundo; assert.ok(m && m.telaLarg >= 1920 + 200 && m.telaAlt >= 1080 + 200, `${estilo}: o mundo pintado cobre o quadro com folga (${JSON.stringify(m)})`);
    assert.ok(Math.abs(m.desvioEixo) < 1, `${estilo}: o eixo do mundo (x 540) cai no centro da camada pintada`);
    for (const [nome, r] of Object.entries(d.roteiros)) {
      assert.ok(r.beats > 0 && r.partes.length === r.beats, `${estilo}/${nome}: um plano por beat`);
      for (const p of r.partes) for (const c of p.caixas) {
        assert.ok(c.x0 >= 108 && c.x1 <= 1810, `${estilo}/${nome}: grupo na margem de segurança (x ${c.x0} a ${c.x1})`);
        assert.ok(c.y1 <= 845 && c.y0 >= baseLeg + 4, `${estilo}/${nome}: grupo abaixo da legenda e acima do fim da área (y ${c.y0} a ${c.y1})`);
      }
      const vt = tipos(v.roteiros[nome].falhas);
      for (const t of tipos(r.falhas)) assert.ok(vt.has(t), `${estilo}/${nome} ${rotulo}: falha nova no horizontal (${t}): ${r.falhas.join(' | ')}`);
    }
  }
}
