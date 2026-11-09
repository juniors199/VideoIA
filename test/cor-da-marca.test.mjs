/*
 * 
 * 
 */
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ESTILOS } from '../src/video/plano.mjs';
import { varrerArquivo, cromatica } from './helpers/cor-varredura.mjs';
import { tonsDaMarca, legivelSobre, contraste, matizDe, corSobre } from '../src/video/engine/marca-tons.js';

/**
 * Regra do dono (02/11/2026, reforçada em 03/11/2026): nos estilos de vídeo a cor de destaque (marca-texto, halo, etiqueta,
 * fita, sublinhado, número, ícone ativo, barra, botão) é a da identidade da página (marca/tokens.json; o aluno personaliza com
 * `npm run marca`), nunca cor fixa. Tons mais claros, escuros ou translúcidos são derivados dela (engine/marca-tons.js).
 *
 * Este teste é o verificador estático: varre os arquivos dos estilos de vídeo e dos visuais de carrossel atrás de cor cromática
 * fixa e reprova a que não estiver na lista de exceções justificadas (test/fixtures/cor-da-marca-excecoes.json; a tabela
 * legível está em docs/cor-da-marca.md). Quadros de verdade de cada estilo corrigido: test/cor-da-marca-quadros.test.mjs.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(RAIZ, 'src');
const EXC = JSON.parse(fs.readFileSync(path.join(RAIZ, 'test/fixtures/cor-da-marca-excecoes.json'), 'utf8'));

const andar = (d) => { const r = []; for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!/assets|node_modules/.test(f)) r.push(...andar(p)); } else if (/\.(js|mjs)$/.test(f)) r.push(p); } return r; };
const ARQUIVOS = [...andar(path.join(SRC, 'video/engine')), ...fs.readdirSync(path.join(SRC, 'carrossel')).filter((f) => f.endsWith('.mjs')).map((f) => path.join(SRC, 'carrossel', f))];
const rel = (p) => path.relative(SRC, p).split(path.sep).join('/');

test('cor da marca: nenhum arquivo de estilo tem cor cromática fixa fora da lista de exceções', () => {
  const novas = [];
  for (const p of ARQUIVOS) {
    const achadas = varrerArquivo(p), ok = new Set(EXC.arquivos[rel(p)]?.cores || []);
    const fora = achadas.filter((c) => !ok.has(c));
    if (fora.length) novas.push(`${rel(p)}: ${fora.join(' ')}`);
  }
  assert.deepEqual(novas, [], 'Cor fixa nova num estilo. Se é destaque (marca-texto, halo, etiqueta, fita, número, botão), derive da marca com tonsDaMarca(spec.marca.destaque) em engine/marca-tons.js. Se é mesmo material, cenário ou estado, registre em test/fixtures/cor-da-marca-excecoes.json e em docs/cor-da-marca.md, com o motivo.');
});

test('cor da marca: a lista de exceções não tem arquivo nem cor que já saiu do código (a linha de base não afrouxa)', () => {
  const velhas = [];
  for (const [arq, e] of Object.entries(EXC.arquivos)) {
    const p = path.join(SRC, arq);
    if (!fs.existsSync(p)) { velhas.push(`${arq}: arquivo não existe mais`); continue; }
    const achadas = new Set(varrerArquivo(p)), sobra = e.cores.filter((c) => !achadas.has(c));
    if (sobra.length) velhas.push(`${arq}: ${sobra.join(' ')} já não está no arquivo (tire da lista)`);
    if (!EXC.categorias[e.categoria]) velhas.push(`${arq}: categoria "${e.categoria}" não existe`);
  }
  assert.deepEqual(velhas, []);
});

// Arquivos cujo DESTAQUE já foi corrigido: só aceitam as cores abaixo (estado, cenário ou paleta secundária do estilo), com o motivo.
// Não dá para esconder um destaque fixo novo na lista geral: estas listas valem sozinhas.
const SEGUE_A_MARCA = {
  'video/engine/estilo-cartoes.js': { cores: ['#E2574C'], motivo: 'coral de alerta e REC (semântico)' },
  'video/engine/f2-peles.js': { cores: ['#E2574C'], motivo: 'coral de alerta (papel h da pele dos cartões)' },
  'video/engine/estilo-tubo.js': { cores: [], motivo: 'o vermelho e o rosa do tubo são a cor da marca e um tom dela' },
  'video/engine/estilo-mindset.js': { cores: [], motivo: 'o ouro do boneco, do brilho e da palavra-chave é a cor da marca' },
  'video/engine/estilo-mindset2.js': { cores: ['rgb(95,208,192)'], motivo: 'franja turquesa do traço (identidade secundária)' },
  'video/engine/estilo-mindset2-glifos.js': { cores: ['#3E8090', '#4FB3A2', '#A57E55', '#C98A4B'], motivo: 'turquesa e cobre: franja cromática e hachura do estilo' },
  'video/engine/estilo-stop-motion.js': { cores: ['#D6E4FF', '#FFC247', '#FFD7A6', '#FFF0D0', 'rgb(255,230,190)', 'rgb(255,236,200)'], motivo: 'luz quente de estúdio da massinha (cenário); a fita e o destaque seguem a marca' },
  'video/engine/estilo-moderno.js': { cores: ['#28C840', '#FEBC2E', '#FF5F57', '#FF7A2F'], motivo: 'semáforo da janela e fallback do acento' },
};
test('cor da marca: os estilos corrigidos não aceitam destaque fixo de volta', () => {
  const erros = [];
  for (const [arq, regra] of Object.entries(SEGUE_A_MARCA)) {
    const p = path.join(SRC, arq), achadas = varrerArquivo(p), permitidas = new Set(regra.cores);
    const fora = achadas.filter((c) => !permitidas.has(c));
    if (fora.length) erros.push(`${arq}: ${fora.join(' ')} (só vale: ${regra.motivo})`);
  }
  assert.deepEqual(erros, []);
});

test('cor da marca: as cores de destaque antigas (roxo, vermelho e rosa do tubo, ouro do mindset, lime) não existem mais como destaque', () => {
  const PROIBIDAS = {
    'video/engine/estilo-cartoes.js': ['#7B4DFF', '#A98BFF', '#9270FF', '#6A3EF0', '#9672FF', '#6B3FF0', '#CDBDFF'],
    'video/engine/f2-peles.js': ['#7B4DFF', '#A98BFF', '#EB1628', '#FF7896'],
    'video/engine/estilo-tubo.js': ['#EB1628', '#FF7896'],
    'video/engine/estilo-mindset-bonecos.js': ['#FFC800', '#FFE58A', '#B58300', '#FFD21F', '#E2C46A'],
    'video/engine/estilo-mindset2-glifos.js': ['#D2C25E', '#F7D21A', '#C9B65A', '#D9C46E'],
    'video/engine/estilo-mindset2.js': ['#D9C46E', '#F7D21A'],
    'video/engine/estilo-mindset2-cenarios.js': ['#D9C46E', '#E6C76A', '#C9B65A'],
    'video/plano.mjs': ['#7B4DFF', '#EB1628', '#FFC800', '#F7D21A', '#F4FA7C', '#E0892B', '#E4BE5F', '#B3262B', '#D9B44A', '#FBD90A'],
  };
  const erros = [];
  for (const [arq, lista] of Object.entries(PROIBIDAS)) {
    const t = fs.readFileSync(path.join(SRC, arq), 'utf8').toUpperCase();
    for (const h of lista) if (t.includes(h)) erros.push(`${arq} ainda tem ${h}`);
  }
  assert.deepEqual(erros, []);
});

// ─────────── os estilos não sobrescrevem o destaque da página ───────────
// Estilos cuja IDENTIDADE é monocromática (preto, branco e cinza): o destaque deles é neutro por desenho, não é cor de marca.
const NEUTROS = { pontilhismo: 'pontos brancos sobre preto', linhas: 'traço branco sobre preto', anatomia: 'desenho técnico preto sobre papel claro', fino: 'traço aceso branco azulado sobre escuro', 'preto-branco': 'tinta e papel' };
// `apoio` (tom secundário, de papel, couro, massa, menta, turquesa) cromático que o estilo pode manter, com o motivo
const APOIO_OK = {
  'stop-motion': 'tom de massinha (barro) das peças', 'quadro-antigo': 'tom de couro e papel do quadro', fatos: 'menta do dado positivo no mapa', mindset2: 'turquesa da franja do traço', antiguidade: 'tom de pergaminho do acervo',
};
test('cor da marca: nenhum estilo sobrescreve o destaque da página (só os monocromáticos, que são neutros)', () => {
  const erros = [];
  for (const [id, est] of Object.entries(ESTILOS)) {
    const m = est.marca || {};
    if (m.destaque !== undefined) {
      if (!NEUTROS[id]) erros.push(`${id}: define marca.destaque (${m.destaque}); apague e leia spec.marca.destaque no motor`);
      else { const n = parseInt(m.destaque.slice(1), 16); if (cromatica(n >> 16, (n >> 8) & 255, n & 255)) erros.push(`${id}: o destaque do estilo neutro (${m.destaque}) tem cor`); }
    }
    if (m.apoio !== undefined) { const n = parseInt(m.apoio.slice(1), 16); if (cromatica(n >> 16, (n >> 8) & 255, n & 255) && !APOIO_OK[id]) erros.push(`${id}: apoio ${m.apoio} tem cor e não está justificado`); }
  }
  assert.deepEqual(erros, []);
  for (const id of ['cartoes', 'tubo', 'alternativo', 'mindset', 'mindset2', 'stop-motion', 'teologia', 'quadro-antigo', 'antiguidade', 'fatos']) assert.equal(ESTILOS[id].marca.destaque, undefined, `${id} segue a marca da página`);
});

// ─────────── derivações de tom (o ponto único) ───────────
test('marca-tons: tons por função a partir de uma cor só, texto legível sobre o destaque e matiz preservado', () => {
  for (const cor of ['#FF7A2F', '#2F6BFF', '#FFD400', '#7B4DFF', '#0A1A80']) {
    const T = tonsDaMarca(cor);
    assert.equal(T.forte, cor.toUpperCase());
    assert.ok(contraste(T.forte, T.sobre) >= 3, `${cor}: texto sobre o destaque (${T.sobre}) tem contraste`);
    assert.ok(matizDe(T.claro).l > matizDe(T.forte).l && matizDe(T.escuro).l < matizDe(T.forte).l, `${cor}: claro mais claro, escuro mais escuro`);
    assert.ok(Math.abs(matizDe(T.claro).h - matizDe(T.forte).h) < 12 || matizDe(T.forte).s < 0.2, `${cor}: o tom claro mantém o matiz`);
    for (const fundo of ['#060607', '#FFFFFF', '#E8E4DE']) assert.ok(contraste(T.sobreFundo(fundo, 3), fundo) >= 3, `${cor} legível sobre ${fundo}`);
    assert.match(T.a(0.3), /^rgba\(\d+,\d+,\d+,0\.3\)$/);
  }
  assert.equal(tonsDaMarca(null).forte, '#FF7A2F', 'sem marca vale o fallback do Ilustrando');
  assert.equal(tonsDaMarca('lixo').forte, '#FF7A2F');
  assert.equal(corSobre('#FFD400'), '#14110D', 'amarelo leva texto escuro');
  assert.equal(legivelSobre('#FFD400', '#FFFFFF', 3) !== '#FFD400', true, 'amarelo sobre branco escurece');
});
