/*
 * 
 * 
 */
/** Teste seco da família feltro e papel (paper-rocket, lighthouse-mouse, moon-path): planejador, layout, câmera e verificador, sem render. */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  const { compilar } = await mod('src/video/plano.mjs');
  const CF = await mod('src/video/engine/estilo-cartoon-feltro.js');
  const CAM = await mod('src/video/engine/cartoon-feltro-camera.js');
  const VER = await mod('src/video/verificadores/cartoon-feltro-verificar.mjs');
  const PL = await mod('src/video/autoplano-cartoon-feltro.mjs');
  const { caixaPersonagem } = await mod('src/video/engine/cartoon-feltro-personagens.js');
  const pers = CF.personagensCF(estilo), saida = { geo: { W: geo.W, H: geo.H }, roteiros: {} };
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const f = falado(txt), beats = porFrase(f.palavras);
    PL.planejarCartoonFeltro(estilo, beats, f.palavras);
    const cena = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
    const spec = compilar(cena, f), { partes, legenda: leg } = CF.partesCF(spec, estilo);
    const ver = VER.verificarCartoonFeltro(spec);
    const out = { beats: beats.length, falhas: ver.falhas.map((x) => `${x.tipo}: ${x.msg}`), partes: [], legenda: [] };
    for (const P of partes) {
      const lay = CF.layoutCF(P, pers), caixas = [];
      for (let k = 0; k <= 4; k++) {
        const pose = CAM.poseCamera(P, P.de + ((P.ate - P.de) * k) / 4);
        for (const L of lay) {
          if (P.e.chegam && L !== lay[0]) continue;
          const c = caixaPersonagem(L.d, L.x, L.y, L.s), a = CAM.projetar(pose, 1, [c.x0, c.y0], CF.focoCF(P.cenarioDef)), z = CAM.projetar(pose, 1, [c.x1, c.y1], CF.focoCF(P.cenarioDef));
          caixas.push({ id: L.id, x0: Math.min(a[0], z[0]), x1: Math.max(a[0], z[0]), y0: Math.min(a[1], z[1]), y1: Math.max(a[1], z[1]), voa: !!L.voando });
        }
      }
      out.partes.push({ forma: P.forma, cenario: P.cenario, camera: P.camera, enquadramento: P.enquadramento, chao: P.cenarioDef.chao?.y ?? null, lay: lay.map((L) => ({ id: L.id, x: L.x, y: L.y, s: L.s })), caixas });
    }
    for (const G of leg) out.legenda.push({ txt: G.ws.map((w) => w.w).join(' '), larg: CF.largFraunces(G.ws.map((w) => w.w).join(' '), CF.VARIANTES_CF[estilo].legenda.px) });
    saida.roteiros[nome] = out;
  }
  saida.legendaVariante = CF.VARIANTES_CF[estilo].legenda;
  saida.legendaLargMax = CF.REGRAS_CF.legenda.largMax;
  saida.centro = CF.REGRAS_CF.centro;
  if (CF.caixasTextoCF) saida.textoFixo = CF.caixasTextoCF();
  try { const HZM = await mod('src/video/engine/cartoon-feltro-horizontal.js'); saida.fundo = { mundo: HZM.MUNDO, sangria: HZM.SANGRIA, ks: HZM.KS }; } catch { /* base sem o módulo (vertical de antes) */ }
  return arred(saida);
}

const tipos = (l) => new Set(l.map((s) => s.split(':')[0]));
/** regras do horizontal para a família: tudo dentro da área, legenda e @ sem colisão, sem falha nova em relação ao vertical */
export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const lv = d.legendaVariante, topoLeg = lv.y - lv.px * 0.62, baseLeg = lv.y + lv.px * 0.6;
    assert.ok(topoLeg >= (handle ? 224 : 190) && baseLeg <= 885, `${estilo} ${rotulo}: legenda (y ${Math.round(topoLeg)} a ${Math.round(baseLeg)}) dentro da área útil e abaixo do @`);
    assert.ok(d.legendaLargMax <= 1485, `${estilo}: largura de texto até a área útil`);
    for (const [nome, r] of Object.entries(d.roteiros)) {
      assert.ok(r.beats > 0 && r.partes.length === r.beats, `${estilo}/${nome}: um plano por beat`);
      for (const l of r.legenda) assert.ok(l.larg <= d.legendaLargMax + 0.5, `${estilo}/${nome}: legenda "${l.txt}" cabe numa linha (${l.larg})`);
      for (const p of r.partes) for (const c of p.caixas) {
        if (c.voa) continue;
        assert.ok(c.x0 >= 108 && c.x1 <= 1810, `${estilo}/${nome}: bicho "${c.id}" na margem de segurança (x ${c.x0} a ${c.x1})`);
        assert.ok(c.y1 <= 885 && c.y0 >= baseLeg + 4, `${estilo}/${nome}: bicho "${c.id}" abaixo da legenda e dentro da área (y ${c.y0} a ${c.y1})`);
      }
      const vt = tipos(v.roteiros[nome].falhas);
      for (const t of tipos(r.falhas)) assert.ok(vt.has(t), `${estilo}/${nome} ${rotulo}: falha nova no horizontal (${t}): ${r.falhas.join(' | ')}`);
    }
    // fundo e cenário cobrem a sangria (x 55 a 1864, y 27 a 1050) com folga para a câmera: o mundo todo, em tela
    const fd = d.fundo, X = (x) => 960 - 540 * fd.ks + fd.ks * x, Y = (y) => fd.ks * y;
    assert.ok(X(fd.sangria.x0) <= 55 - 100 && X(fd.sangria.x1) >= 1864 + 100 && Y(fd.sangria.y0) <= 27 - 100 && Y(fd.sangria.y1) >= 1050 + 100, `${estilo}: o fundo cobre a sangria com folga de câmera`);
    const tf = d.textoFixo; assert.ok(tf, `${estilo}: caixasTextoCF`);
    for (const k of ['numero', 'letras']) assert.ok(tf[k].x0 >= 217 && tf[k].x1 <= 1702 && tf[k].y0 >= (handle ? 224 : 190) && tf[k].y1 <= 885, `${estilo}: ${k} na área útil ${JSON.stringify(tf[k])}`);
  }
}
