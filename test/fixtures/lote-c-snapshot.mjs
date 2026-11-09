/**
 * Fotografia numérica do VERTICAL dos estilos do lote C (0.6.42): constantes de layout e o plano de cada estilo (hash do cena.json) com o
 * roteiro "misto", e, no Smooth, o HTML e as caixas de cada cena (todas as coordenadas do mundo). Sem navegador e sem render.
 *   node test/fixtures/lote-c-snapshot.mjs <pasta-do-estudio> <saida.json>
 * O golden (test/fixtures/lote-c-vertical.json) foi gerado na base do horizontal (baa65aec), ANTES das mudanças do lote C.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const [raiz, saida] = process.argv.slice(2);
const R = path.resolve(raiz);
const sha = (x) => crypto.createHash('sha1').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex').slice(0, 16);
const imp = (rel) => import(pathToFileURL(path.join(R, rel)).href);
const ROTEIRO = (estilo) => `STATUS: fotografia vertical. Estilo: ${estilo}. CTA: simples.\nO Brasil tem 215 milhões de pessoas.\n\nUm: escolha o tema.\n\nDois: escreva o roteiro curto.\n\nSão 4 em cada 10 brasileiros sem reserva de emergência.\n\nPasso a passo para ganhar tempo, todos os dias da semana.\n\nO preço caiu para R$ 47 e o prazo é de 7 dias.\n\nComenta ILUSTRANDO.\n`;
const ESTILOS = (process.env.ILU_SNAP_ESTILOS || 'smooth,smooth-estrategia,smooth-historia,smooth-produto,smooth-tipografia,smooth-vinheta,anatomia,fino,linhas,moderno,tubo,alternativo').split(',');
const out = { constantes: {}, planos: {} };

// constantes de layout do vertical (as mesmas exportações existem na base e depois do lote C)
{
  const t = await imp('src/video/engine/estilo-tubo.js'), f = await imp('src/video/engine/estilo-fino.js'), a = await imp('src/video/engine/estilo-anatomia.js');
  const m = await imp('src/video/engine/estilo-moderno.js'), l = await imp('src/video/engine/estilo-linhas.js'), lf = await imp('src/video/engine/legenda-frase.js');
  const al = await imp('src/video/engine/estilo-alternativo.js'), s = await imp('src/video/engine/estilo-smooth.js'), k = await imp('src/video/engine/estilo-smooth-kit.js'), d = await imp('src/video/engine/estilo-smooth-diretor.js');
  out.constantes = {
    alternativo: { LEG: al.LEG, LEG_PH: al.LEG_PH, XD: al.XD },
    tubo: { AREA_TUBO: t.AREA_TUBO, BASE_TXT_TUBO: t.BASE_TXT_TUBO }, fino: { AREA_FINO: f.AREA_FINO }, anatomia: { AREA_ANATOMIA: a.AREA_ANATOMIA },
    moderno: { FAIXA_MODERNO: m.FAIXA_MODERNO }, linhas: { CAP_Y: l.CAP_Y, CAP_PX: l.CAP_PX }, legendaFrase: { COLUNA: lf.COLUNA, TOPO_LEGENDA: lf.TOPO_LEGENDA },
    smooth: { REGRAS: JSON.parse(JSON.stringify(s.REGRAS_SMOOTH)), CAMERA: d.CAMERA_SMOOTH, FALA_Y_MAX: k.FALA_Y_MAX, FALA_Y: k.FALA_Y, TOPO_FALA: k.TOPO_FALA, cam: d.camDe ? d.camDe({ horizontal: false }) : null },
  };
}

for (const estilo of ESTILOS) {
  const nome = `_hzc-snap-${estilo}`, pasta = path.join(R, 'projetos', nome);
  fs.rmSync(pasta, { recursive: true, force: true }); fs.mkdirSync(pasta, { recursive: true });
  fs.writeFileSync(path.join(pasta, 'roteiro.md'), ROTEIRO(estilo)); fs.writeFileSync(path.join(pasta, 'fontes.md'), '- fotografia (nada a publicar)\n');
  const r = spawnSync(process.execPath, [path.join(R, 'src/video/cli.mjs'), nome, '--voz=mock', '--sem-render', '--sem-lint', '--sem-musica', '--vertical'], { cwd: R, encoding: 'utf8', timeout: 600000, env: { ...process.env, ILU_QA_SECO: '1', ILU_TELEMETRIA: '0', ILU_TELEMETRIA_PAI: '1' } });
  if (!fs.existsSync(path.join(pasta, 'cena.json'))) throw new Error(`${estilo}: o plano não gerou cena.json\n${r.stdout}\n${r.stderr}`);
  const cena = JSON.parse(fs.readFileSync(path.join(pasta, 'cena.json'), 'utf8'));
  // 0.6.44: estiloPlano é anotação do plano automático (para qual estilo a cena foi feita), não muda o desenho: fica fora da fotografia
  // 0.6.45: nPalavras também é anotação (quantas palavras a cena cobre, para decidir manter ou refazer quando a narração muda)
  const { estiloPlano: _anotacao, nPalavras: _nPal, ...cenaPlano } = cena;
  const e = { cena: sha(cenaPlano) };
  if (estilo.startsWith('smooth')) {
    const { compilar } = await imp('src/video/plano.mjs'), { montarSmooth } = await imp('src/video/engine/estilo-smooth.js');
    const falado = JSON.parse(fs.readFileSync(path.join(pasta, 'palavras.json'), 'utf8'));
    const spec = compilar(cena, falado, { plano: {} });
    const M = montarSmooth(spec);
    e.cenas = M.cenas.map(({ P, k }) => ({ b: P.b.id, forma: P.forma, html: sha(k.html.join('')), qa: sha(k.qa.map((q) => [q.id, q.tipo, q.forma, q.caixa])) }));
  }
  if (estilo.startsWith('smooth')) {
    // uma cena por forma do Smooth (dados genéricos), para fotografar o HTML e as caixas de TODAS as formas no vertical
    const { compilar } = await imp('src/video/plano.mjs'), { montarSmooth, FORMAS_SMOOTH } = await imp('src/video/engine/estilo-smooth.js');
    const falado = JSON.parse(fs.readFileSync(path.join(pasta, 'palavras.json'), 'utf8'));
    const DADOS = { itens: [{ texto: 'Primeiro passo', em: 'Brasil' }, { texto: 'Segundo passo', em: 'tema' }, { texto: 'Terceiro passo', em: 'roteiro' }], valor: 47, prefixo: 'R$ ', titulo: 'Título curto', texto: '7 em 20', total: 20, acesos: 7, rotulo: 'Rótulo', botao: 'Comenta', chave: 'passo', chip: 'Lembrete', celulas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], valores: [5, 8, 14, 30, 60, 100], a: { rotulo: 'Antes', valor: 10, texto: 'sem método' }, b: { rotulo: 'Depois', valor: 90, texto: 'com método' }, resultado: { valor: 100, rotulo: 'no fim' }, item: { texto: 'Pedido', valor: 47 }, extra: { texto: 'Extra', valor: 17 }, chips: [{ texto: 'um' }, { texto: 'dois' }], fonte: 'IBGE', gigante: 'MÉTODO' };
    e.formas = {};
    for (const forma of FORMAS_SMOOTH) {
      if (forma === 'foto') continue;
      try {
        const c2 = JSON.parse(JSON.stringify(cena)); c2.estilo = estilo;
        for (const b of c2.beats) b.elementos = [{ tipo: 'smooth', entra: 0, forma, ...DADOS }];
        const M = montarSmooth(compilar(c2, falado, { plano: {} }));
        e.formas[forma] = M.cenas.map(({ P, k }) => sha([k.html.join(''), k.qa.map((q) => [q.id, q.tipo, q.forma, q.caixa])]));
      } catch (err) { e.formas[forma] = 'erro: ' + String(err.message).slice(0, 80); }
    }
  }
  out.planos[estilo] = e;
  fs.rmSync(pasta, { recursive: true, force: true });
}
fs.writeFileSync(saida, JSON.stringify(out, null, 1));
console.log('fotografia gravada:', saida, Object.keys(out.planos).length, 'estilos');
