/*
 * 
 * 
 */
/** Teste seco do stop-motion: compor() com canvas de mentira (placa, etiqueta, número, setas, fitas, foto e legenda de uma palavra); o 3D e o shader ficam fora (THREE de mentira). */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { criarB, instalarDocumento } from './stub-canvas.mjs';

/** objeto que aceita qualquer chamada e vira o número 1 em conta: serve de THREE e de cena 3D para o compor() rodar sem WebGL */
const magico = () => { const f = function () {}; const p = new Proxy(f, { get: (_, k) => (k === Symbol.toPrimitive ? () => 1 : k === 'isEmpty' ? () => true : k === 'length' ? 0 : k === Symbol.iterator ? function* () {} : p), apply: () => p, construct: () => p, set: () => true }); return p; };

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  instalarDocumento();
  const { compilar } = await mod('src/video/plano.mjs');
  const E = await mod('src/video/engine/estilo-stop-motion.js');
  const AS = await mod('src/video/engine/area-segura.js');
  const CAM = await mod('src/video/engine/camera.js');
  const saida = { geo: { W: geo.W, H: geo.H }, roteiros: {}, leg: E.LEG_SM };
  const medirSpec = (spec, extras = {}) => {
    const out = { beats: spec.beats.length, falhas: [], formas: [], textos: [], caixas: [], excecao: null, cobre: true };
    const M = magico();
    const S = { m: { destaque: spec.marca?.destaque || '#F26A1B', serie: handle || formato === 'vertical' ? '@teste' : '' }, beats: spec.beats.map(() => ({ els: [], grupo: { visible: true } })), dur: spec.duracao, legenda: extras.legenda || [], camera: M, scene: M, renderer: M, gl: { width: geo.W, height: geo.H }, luz: { apoios: [] } };
    try { S.cam = CAM.planoCamera(spec); } catch { S.cam = null; }
    const { B, reg } = criarB({ spec, S, W: geo.W, H: geo.H });
    Object.assign(B, { THREE: M, atualizaEm() {}, posRender() {}, renderizar() {}, fx: null, fxc: null });
    let C; try { C = E.criarStopMotion(B); } catch (e) { out.excecao = `criar: ${e.message}`; return out; }
    const tempos = new Set(); for (const b of spec.beats) for (const q of [0.3, 0.6, 0.95]) tempos.add(+(b.de + (b.ate - b.de) * q).toFixed(3));
    for (const t of [...tempos].sort((a, b) => a - b)) {
      reg.textos.length = 0; reg.fills.length = 0; reg.imagens.length = 0; AS.tirarCaixas();
      try { C.compor(t); C.soltos?.(t, spec.beats[B.beatEm(t)]); } catch (e) { out.excecao = `compor t=${t}: ${e.stack?.split('\n').slice(0, 2).join(' | ')}`; break; }
      const m = { pecas: [], titulos: [], textos: [], imagens: [], legenda: null }; C.medir(t, m);
      for (const nome of ['pecas', 'titulos', 'textos']) for (const c of m[nome]) out.caixas.push({ t, tipo: nome, forma: c.forma || 'titulo', x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 });
      if (m.legenda) out.caixas.push({ t, tipo: 'legenda', forma: 'legenda', ...m.legenda });
    }
    reg.fills.length = 0;
    return out;
  };
  const paraBeats = (txt) => {
    const f = falado(txt), bs = porFrase(f.palavras);
    const beats = bs.map((b, i) => { const ws = f.palavras.slice(b.palavras[0], b.palavras[1] + 1), maior = [...ws].sort((a, c) => c.w.length - a.w.length)[0].w.replace(/[^\p{L}\p{N}]/gu, '') || 'X', num = ws.find((w) => /^\d+$/.test(w.w.replace(/[.,!?]/g, '')));
      const els = []; if (i % 3 === 1) els.push({ tipo: 'stop-motion', forma: 'etiqueta', texto: 'mais uma curiosidade' }); if (num) els.push({ tipo: 'contador', valor: Number(num.w.replace(/[.,!?]/g, '')), t0: ws[0].t });
      return { id: `b${i + 1}`, palavras: b.palavras, titulo: { texto: maior }, elementos: els }; });
    return { f, beats };
  };
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const { f, beats } = paraBeats(txt);
    const cena = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
    const leg = legenda === false ? [] : [{ ws: f.palavras }];
    saida.roteiros[nome] = medirSpec(compilar(cena, f), { legenda: leg });
  }
  // todas as formas 2D do estilo, com título de uma e de duas linhas, setas em quatro direções, fitas, foto e número com legenda
  const EL = [
    [{ tipo: 'stop-motion', forma: 'placa', texto: 'Placa solta', pos: [0.15, 0.3] }], [{ tipo: 'stop-motion', forma: 'placa', texto: 'Direita', pos: [0.9, 0.7], tamanho: 120 }],
    [{ tipo: 'stop-motion', forma: 'seta', n: 3, dir: 'baixo', pos: [0.5, 0.3] }], [{ tipo: 'stop-motion', forma: 'seta', n: 4, dir: 'direita', pos: [0.1, 0.5] }], [{ tipo: 'stop-motion', forma: 'seta', n: 3, dir: 'esquerda', pos: [0.95, 0.6] }],
    [{ tipo: 'stop-motion', forma: 'fita', n: 3 }], [{ tipo: 'contador', valor: 1500000, sufixo: ' mil', t0: 0 }], [{ tipo: 'contador', valor: 87, sufixo: '%', legenda: 'das pessoas', t0: 0 }],
    [{ tipo: 'imagem', arquivo: 'a.jpg', largura: 800, t0: 0 }], [{ tipo: 'imagem', arquivo: 'a.jpg', largura: 900, altura: 700, pos: [0.15, 0.5], t0: 0 }], [{ tipo: 'imagem', arquivo: 'a.jpg', largura: 900, altura: 700, pos: [0.9, 0.9], t0: 0 }],
    [{ tipo: 'stop-motion', forma: 'etiqueta', texto: 'Etiqueta bem comprida para testar a largura' }],
  ];
  const TIT = ['Sol', 'Motor elétrico gigante da cidade', 'Mar', 'Dois nomes grandes', 'Pão', 'Fim', 'Mil', 'Oitenta', 'Foto um', 'Foto dois', 'Foto três', 'Etiqueta'];
  const palavras = EL.map((e, i) => ({ w: `p${i}`, t: i * 3 + 0.2, f: i * 3 + 2.4 }));
  const beats = EL.map((es, i) => ({ id: `b${i + 1}`, palavras: [i, i], titulo: { texto: TIT[i], estilo: ['fios', 'balao', 'solto'][i % 3] }, elementos: es }));
  const specT = compilar({ tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) }, { palavras, duracao: EL.length * 3 + 1.2 });
  for (const b of specT.beats) for (const e of b.elementos || []) if (e.tipo === 'imagem') e._img = { naturalWidth: 800, naturalHeight: 600, width: 800, height: 600 };
  saida.roteiros.todasAsFormas = medirSpec(specT, { legenda: legenda === false ? [] : [{ ws: palavras }] });
  return arred(saida);
}

export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    const topoMin = handle ? 232 : 189;
    for (const [nome, r] of Object.entries(d.roteiros)) {
      assert.equal(r.excecao, null, `${estilo}/${nome} ${rotulo}: exceção ${r.excecao}`);
      for (const x of r.textos) {
        assert.ok(x.x0 >= 216 && x.x1 <= 1703 && x.y0 >= (/^@/.test(x.txt) ? 185 : topoMin - 3) && x.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${x.t}: "${x.txt}" fora da área útil (x ${x.x0} a ${x.x1}, y ${x.y0} a ${x.y1})`);
      }
      for (const c of r.caixas) {
        if (c.tipo === 'pecas' && /cena/.test(c.forma)) continue;
        assert.ok(c.x0 >= 108 && c.x1 <= 1810 && c.y1 <= 993, `${estilo}/${nome} ${rotulo} t=${c.t}: ${c.tipo} ${c.forma} fora da margem de segurança (x ${c.x0} a ${c.x1}, y ${c.y0} a ${c.y1})`);
        if (c.tipo === 'titulos' || c.tipo === 'textos' || c.tipo === 'legenda') assert.ok(c.x0 >= 216 && c.x1 <= 1703 && c.y0 >= topoMin - 3 && c.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${c.t}: ${c.tipo} ${c.forma} fora da área útil (x ${c.x0} a ${c.x1}, y ${c.y0} a ${c.y1})`);
      }
    }
  }
}
