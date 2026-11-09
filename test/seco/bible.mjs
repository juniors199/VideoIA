/*
 * 
 * 
 */
/** Teste seco do estilo bible: planejador + o compor() do estilo rodando num canvas de mentira (texto em coluna, palco na outra). */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { criarB, instalarDocumento } from './stub-canvas.mjs';

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  instalarDocumento();
  const { compilar } = await mod('src/video/plano.mjs');
  const PL = await mod('src/video/autoplano-bible.mjs');
  const E = await mod('src/video/engine/estilo-bible.js');
  const AS = await mod('src/video/engine/area-segura.js');
  const VER = await mod('src/video/verificadores/estilo-bible-verificar.mjs');
  const saida = { geo: { W: geo.W, H: geo.H }, roteiros: {}, layout: E.LAYOUT_BIBLE };
  const medirSpec = (nome, spec, extras = {}) => {
    const ver = VER.verificarBible(spec), beats = spec.beats;
    const out = { beats: beats.length, falhas: ver.falhas.map((x) => `${x.tipo}: ${x.msg}`), formas: [], textos: [], caixas: [], palco: null, excecao: null, cobre: true };
    const S = { m: { destaque: spec.marca?.destaque || '#F26A1B', serie: handle || formato === 'vertical' ? '@teste' : '' }, beats: spec.beats.map((b, i) => ({ els: extras.fotos?.[i] ? [{ tipo: 'imagem', e: { _img: { naturalWidth: 600, naturalHeight: 700 }, largura: 560, altura: 640 } }] : [] })), dur: spec.duracao, legenda: [] };
    const { B, reg } = criarB({ spec, S, W: geo.W, H: geo.H });
    let C; try { C = E.criarBible(B); } catch (e) { out.excecao = `criar: ${e.message}`; return out; }
    const L = C.linha, tempos = new Set();
    for (const it of L.itens) { for (const q of [0.1, 0.5, 0.9]) tempos.add(+(it.b.de + (it.b.ate - it.b.de) * q).toFixed(3)); out.formas.push(it.forma); }
    for (const t of [...tempos].sort((a, b) => a - b)) {
      reg.textos.length = 0; reg.fills.length = 0; reg.imagens.length = 0; AS.tirarCaixas();
      try { C.compor(t); } catch (e) { out.excecao = `compor t=${t}: ${e.message}`; break; }
      const caixas = AS.tirarCaixas(), med = { out: { pecas: [], textos: [] } }; C.medir(t, med.out);
      const palco = med.out.pecas[0] || null;
      const vistos = new Set();
      for (const x of reg.textos) { if (x.canvas !== 'principal') continue; const c = { t, txt: x.txt.slice(0, 24), x0: x.x0, x1: x.x1, y0: x.y0, y1: x.y1, px: x.px }, k = JSON.stringify(arred(c)); if (!vistos.has(k)) { vistos.add(k); out.textos.push(c); } }
      for (const c of caixas) out.caixas.push({ t, forma: c.forma, x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 });
      for (const im of reg.imagens) if (im.de == null && im.x1 - im.x0 > 150) out.caixas.push({ t, forma: 'foto', x0: im.x0, x1: im.x1, y0: im.y0, y1: im.y1 });
      if (palco) out.palco = { x0: palco.x0, x1: palco.x1, y0: palco.y0, y1: palco.y1 };
    }
    reg.fills.length = 0; try { C.compor(L.itens[0].b.de + 0.2); out.cobre = reg.fills.some((x) => x.canvas === 'principal' && x.x0 <= geo.sangria.x0 + 0.5 && x.x1 >= geo.sangria.x1 - 0.5 && x.y0 <= geo.sangria.y0 + 0.5 && x.y1 >= geo.sangria.y1 - 0.5); } catch { /* já reportado */ }
    return out;
  };
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const f = falado(txt), beats = porFrase(f.palavras).map((b) => ({ ...b, elementos: [] }));
    PL.planejarBible(beats, f.palavras);
    const cena = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
    saida.roteiros[nome] = medirSpec(nome, compilar(cena, f));
  }
  // todos os palcos do estilo, com kicker, número, sub e fio do tempo (e foto de pessoa em um a cada três): cada forma roda o compor() inteiro
  const formas = E.FORMAS_BIBLE;
  const palavras = formas.map((fm, i) => ({ w: `p${i}`, t: i * 3 + 0.2, f: i * 3 + 2.6 }));
  const beats = formas.map((fm, i) => ({ id: `b${i + 1}`, palavras: [i, i], elementos: [fm === 'fecho' ? { tipo: 'bible', forma: 'fecho', rotulo: 'AGORA É COM VOCÊ', pergunta: ['Qual palavra', 'você leva dessa história?'], botao: 'Comenta ILUSTRANDO ↓' } : { tipo: 'bible', forma: fm, cena: `${fm}#${i}`, dados: {}, fio: i % 4 === 0 ? { de: 0.1, pos: 0.7 } : undefined, blocos: [{ em: 0, ate: 2.8, hook: i === 0, kicker: 'GÊNESIS 6:15', numero: i % 2 ? { valor: 150, sufixo: ' dias', em: 0.1, dur: 0.6 } : undefined, linhas: [{ texto: 'Uma frase longa com a *palavra* em destaque', em: 0.1 }, { texto: 'e a segunda linha do mesmo bloco aqui', em: 0.2 }, { texto: 'mais uma linha para encher o bloco', em: 0.3 }] }] }] }));
  const cenaT = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
  saida.roteiros.todasAsFormas = medirSpec('todasAsFormas', compilar(cenaT, { palavras, duracao: formas.length * 3 + 1.2 }), { fotos: formas.map((_, i) => i % 3 === 1) });
  return arred(saida);
}

const tipos = (l) => new Set(l.map((s) => s.split(':')[0]));
export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    for (const [nome, r] of Object.entries(d.roteiros)) {
      assert.equal(r.excecao, null, `${estilo}/${nome} ${rotulo}: exceção ${r.excecao}`);
      assert.ok(r.cobre, `${estilo}/${nome} ${rotulo}: o fundo cobre a sangria (x 55 a 1864, y 27 a 1050)`);
      for (const x of r.textos) {
        assert.ok(x.x0 >= 216 && x.x1 <= 1703 && x.y0 >= 189 && x.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${x.t}: "${x.txt}" fora da área útil (x ${x.x0} a ${x.x1}, y ${x.y0} a ${x.y1})`);
        if (handle && !/^@/.test(x.txt)) assert.ok(x.y0 >= 232, `${estilo}/${nome} com @: "${x.txt}" encosta no @ (y ${x.y0})`);
      }
      for (const c of r.caixas) assert.ok(c.x0 >= 216 && c.x1 <= 1703 && c.y0 >= 189 && c.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${c.t}: caixa ${c.forma} fora da área útil (x ${c.x0} a ${c.x1}, y ${c.y0} a ${c.y1})`);
      if (r.palco) assert.ok(r.palco.x0 >= 108 && r.palco.x1 <= 1810 && r.palco.y1 <= 993 && r.palco.y0 >= 82, `${estilo}/${nome}: palco na margem de segurança ${JSON.stringify(r.palco)}`);
      const vt = tipos(v.roteiros[nome].falhas);
      for (const t of tipos(r.falhas)) assert.ok(vt.has(t), `${estilo}/${nome} ${rotulo}: falha nova no horizontal (${t}): ${r.falhas.join(' | ')}`);
    }
  }
}
