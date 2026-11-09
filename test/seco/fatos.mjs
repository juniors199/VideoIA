/*
 * 
 * 
 */
/** Teste seco do estilo fatos: planejador + compor() do estilo num canvas de mentira (texto, cartões, mapa em foco e fecho; 3D fora). */
import { BATERIA, falado, porFrase, arred } from './roteiros.mjs';
import { criarB, instalarDocumento } from './stub-canvas.mjs';

export async function medir({ estilo, formato, handle, legenda, geo, mod }) {
  instalarDocumento();
  const { compilar } = await mod('src/video/plano.mjs');
  const PL = await mod('src/video/autoplano-fatos.mjs');
  const E = await mod('src/video/engine/estilo-fatos.js');
  const AS = await mod('src/video/engine/area-segura.js');
  const saida = { geo: { W: geo.W, H: geo.H }, roteiros: {}, regras: { texto: E.REGRAS_FATOS.texto.larg, num: E.REGRAS_FATOS.numero.px } };
  const medirSpec = (spec, extras = {}) => {
    const out = { beats: spec.beats.length, falhas: [], formas: [], textos: [], caixas: [], excecao: null, cobre: true };
    spec.__terraFatos = { width: 4, height: 2, naturalWidth: 4, naturalHeight: 2, __nome: 'terra' };
    const S = { m: { destaque: spec.marca?.destaque || '#F26A1B', serie: handle || formato === 'vertical' ? '@teste' : '' }, beats: spec.beats.map(() => ({ els: [] })), dur: spec.duracao, legenda: [] };
    const { B, reg } = criarB({ spec, S, W: geo.W, H: geo.H });
    let C; try { C = E.criarFatos(B); } catch (e) { out.excecao = `criar: ${e.message}`; return out; }
    const tempos = new Set();
    for (const P of C.partes) { out.formas.push(P.forma); for (const q of [0.15, 0.5, 0.92]) tempos.add(+(P.b.de + (P.b.ate - P.b.de) * q).toFixed(3)); }
    for (const t of [...tempos].sort((a, b) => a - b)) {
      reg.textos.length = 0; reg.fills.length = 0; reg.imagens.length = 0; AS.tirarCaixas();
      try { C.compor(t); } catch (e) { out.excecao = `compor t=${t}: ${e.stack?.split('\n').slice(0, 2).join(' | ')}`; break; }
      const m = { pecas: [], textos: [], imagens: [], textosFatos: [] }; C.medir(t, m);
      const vistos = new Set();
      for (const x of reg.textos) { if (x.canvas !== 'principal') continue; const c = { t, txt: x.txt.slice(0, 24), x0: x.x0, x1: x.x1, y0: x.y0, y1: x.y1, px: x.px }, k = JSON.stringify(arred(c)); if (!vistos.has(k)) { vistos.add(k); out.textos.push(c); } }
      for (const [nome, lista] of Object.entries(m)) for (const c of lista) out.caixas.push({ t, tipo: nome, forma: c.forma, x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 });
    }
    reg.fills.length = 0; try { C.compor(C.partes[0].b.de + 0.3); out.cobre = reg.fills.some((x) => x.canvas === 'principal' && x.x0 <= geo.sangria.x0 + 0.5 && x.x1 >= geo.sangria.x1 - 0.5 && x.y0 <= geo.sangria.y0 + 0.5 && x.y1 >= geo.sangria.y1 - 0.5); } catch { /* já reportado */ }
    return out;
  };
  for (const [nome, txt] of Object.entries(BATERIA)) {
    const f = falado(txt), beats = porFrase(f.palavras).map((b) => ({ ...b, elementos: [] }));
    PL.planejarFatos(beats, f.palavras);
    const cena = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
    saida.roteiros[nome] = medirSpec(compilar(cena, f));
  }
  // todas as formas do estilo (e as variações que mudam o layout: com ícone, com selo, etiqueta, palco com personagem, mapa com número)
  const itens = [{ forma: 'LISTA' }];
  const EL = [
    { forma: 'frase' }, { forma: 'numero', valor: 150, sufixo: ' dias' }, { forma: 'mapa', foco: 'BR', rotuloAlvo: 'BRASIL' }, { forma: 'globo', foco: 'BR' },
    { forma: 'lista', titulo: 'O que mudou', itens: [{ texto: 'Água potável', valor: '3 L' }, { texto: 'Energia', valor: '24 h' }, { texto: 'Internet' }] },
    { forma: 'barras', itens: [{ rotulo: 'A', valor: 40 }, { rotulo: 'B', valor: 75 }, { rotulo: 'C', valor: 20 }] },
    { forma: 'grafico', pontos: [3, 5, 4, 9, 12], rotulo: '+300%' }, { forma: 'busca', texto: 'quanto custa um carro', sugestoes: ['carro novo', 'carro usado'] },
    { forma: 'pessoas', total: 20, destaque: 7, legenda: '7 em 20' }, { forma: 'linhatempo', marcos: [{ data: '1990', rotulo: 'Início' }, { data: '2005', rotulo: 'Virada' }, { data: '2024', rotulo: 'Hoje' }] },
    { forma: 'foto' }, { forma: 'foto', dupla: true }, { forma: 'documento', titulo: 'CONTRATO', carimbo: 'SEM DATA' }, { forma: 'cta' },
    { forma: 'numero', valor: 33, sufixo: ' países', foco: 'BR' }, { forma: 'frase', etiqueta: 'ATENÇÃO', selo: 'FONTE: IBGE' }, { forma: 'cta', cenario: 'palco-curioso' },
    { forma: 'numero', valor: 90, sufixo: '%', icone: E.ICONES_FATOS[0] }, { forma: 'frase', italico: true },
  ];
  const palavras = EL.map((e, i) => ({ w: i % 2 ? 'Quando o preço subiu' : 'Isso mudou tudo', t: i * 3 + 0.2, f: i * 3 + 2.4 }));
  const beats = EL.map((e, i) => {
    const { cenario, dupla, ...resto } = e, imgs = resto.forma === 'foto' ? Array.from({ length: dupla ? 2 : 1 }, (_, k) => ({ tipo: 'imagem', arquivo: `x${k}.jpg`, nome: 'Fulano de Tal' })) : [];
    return { id: `b${i + 1}`, palavras: [i, i], elementos: [{ tipo: 'fatos', entra: 0, ...resto }, ...imgs], ...(cenario ? { cenario } : {}) };
  });
  const cenaT = { tema: 'X', estilo, beats, ...(formato === 'horizontal' ? { formato, handle, legenda } : {}) };
  const specT = compilar(cenaT, { palavras, duracao: EL.length * 3 + 1.2 });
  for (const b of specT.beats) for (const e of b.elementos || []) if (e.tipo === 'imagem') e._img = { naturalWidth: 600, naturalHeight: 800, width: 600, height: 800 };
  saida.roteiros.todasAsFormas = medirSpec(specT);
  return arred(saida);
}

export function conferir(assert, { h, hh, sl, v, estilo }) {
  for (const [rotulo, d, handle] of [['sem @', h, false], ['com @', hh, true], ['sem legenda', sl, false]]) {
    assert.deepEqual(d.geo, { W: 1920, H: 1080 }, `${estilo} ${rotulo}: quadro 1920 x 1080`);
    for (const [nome, r] of Object.entries(d.roteiros)) {
      assert.equal(r.excecao, null, `${estilo}/${nome} ${rotulo}: exceção ${r.excecao}`);
      assert.ok(r.cobre, `${estilo}/${nome} ${rotulo}: o fundo cobre a sangria`);
      for (const x of r.textos) {
        assert.ok(x.x0 >= 216 && x.x1 <= 1703 && x.y0 >= (/^@/.test(x.txt) ? 185 : 189) && x.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${x.t}: "${x.txt}" fora da área útil (x ${x.x0} a ${x.x1}, y ${x.y0} a ${x.y1})`);
        if (handle && !/^@/.test(x.txt)) assert.ok(x.y0 >= 232, `${estilo}/${nome} com @: "${x.txt}" encosta no @ (y ${x.y0})`);
      }
      for (const c of r.caixas) {
        if (c.tipo === 'textos' || c.tipo === 'textosFatos') assert.ok(c.x0 >= 216 && c.x1 <= 1703 && c.y0 >= 189 && c.y1 <= 886, `${estilo}/${nome} ${rotulo} t=${c.t}: ${c.tipo} ${c.forma} fora da área útil (x ${c.x0} a ${c.x1}, y ${c.y0} a ${c.y1})`);
        else assert.ok(c.x0 >= 108 && c.x1 <= 1810 && c.y0 >= 82 && c.y1 <= 993, `${estilo}/${nome} ${rotulo} t=${c.t}: ${c.tipo} ${c.forma} fora da margem de segurança (x ${c.x0} a ${c.x1}, y ${c.y0} a ${c.y1})`);
      }
      // o texto (coluna da esquerda) nunca cruza o visual (coluna da direita)
      const porT = {}; for (const c of r.caixas) (porT[c.t] ||= []).push(c);
      for (const [t, cs] of Object.entries(porT)) for (const a of cs.filter((c) => c.tipo === 'textos' && c.forma === 'fatos:texto')) for (const b of cs.filter((c) => c.tipo === 'pecas' || c.tipo === 'imagens')) assert.ok(!(a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0), `${estilo}/${nome} ${rotulo} t=${t}: o texto cruza ${b.forma}`);
    }
  }
}
