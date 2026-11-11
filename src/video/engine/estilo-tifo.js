const PAPEL = '#eeeade';
const TINTA = '#142b29';
const CARTAO = '#fffdf5';
const LINHA = '#e2efdc';
const EQUIPE = '#aec6e8';
const rotulos = {
  cobranca: 'COBRANÇA DE PÊNALTI',
  impedimento: 'LINHA DE IMPEDIMENTO',
  jogada: 'MOVIMENTO NO CAMPO',
  resposta: 'PÊNALTI DOS PRESIDENTES',
  regra: 'A REGRA DO JOGO',
  placar: 'PLACAR',
  contexto: 'CONTEXTO',
};

const faixa = (n, a, b) => Math.max(a, Math.min(n, b));
const suave = n => n * n * (3 - 2 * n);

function caixa(ctx, x, y, w, h, cor, raio = 0) {
  ctx.fillStyle = cor;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, raio);
  ctx.fill();
}

function texto(ctx, valor, x, y, tamanho, largura, { cor = TINTA, forte = true, alinhar = 'left', mono = false } = {}) {
  ctx.fillStyle = cor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = alinhar;
  ctx.font = `${forte ? 700 : 600} ${tamanho}px ${mono ? 'ui-monospace, monospace' : 'IluD, Ilu, sans-serif'}`;
  ctx.fillText(valor, x, y, largura);
}

function linha(ctx, x, y, dx, dy, cor = LINHA, espessura = 3, tracejada = false) {
  ctx.beginPath();
  ctx.strokeStyle = cor;
  ctx.lineWidth = espessura;
  ctx.setLineDash(tracejada ? [11, 12] : []);
  ctx.moveTo(x, y);
  ctx.lineTo(dx, dy);
  ctx.stroke();
  ctx.setLineDash([]);
}

function disco(ctx, x, y, r, cor) {
  ctx.beginPath();
  ctx.fillStyle = cor;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function seta(ctx, x, y, dx, dy, cor) {
  linha(ctx, x, y, dx, dy, cor, 5, true);
  const ang = Math.atan2(dy - y, dx - x);
  linha(ctx, dx, dy, dx - 17 * Math.cos(ang - .5), dy - 17 * Math.sin(ang - .5), cor, 5);
  linha(ctx, dx, dy, dx - 17 * Math.cos(ang + .5), dy - 17 * Math.sin(ang + .5), cor, 5);
}

function campo(ctx, x, y, w, h, painel, progresso, destaque) {
  const cx = x + w / 2;
  const cy = y + h / 2;
  const penalti = painel.forma === 'cobranca';
  caixa(ctx, x, y, w, h, '#214b43', 10);
  for (let i = 0; i < 6; i += 2) caixa(ctx, x + i * w / 6, y, w / 6, h, '#27564a');
  ctx.strokeStyle = LINHA;
  ctx.lineWidth = 3;
  ctx.strokeRect(x + 13, y + 13, w - 26, h - 26);
  if (penalti) {
    const gol = y + 14;
    const marca = y + h * .69;
    ctx.strokeRect(cx - w * .30, gol, w * .60, h * .51);
    ctx.strokeRect(cx - w * .13, gol, w * .26, h * .23);
    caixa(ctx, cx - w * .08, gol - 8, w * .16, 14, LINHA, 2);
    disco(ctx, cx, marca, 5, LINHA);
    disco(ctx, cx, gol + h * .16, 17, EQUIPE);
    const fim = painel.resultado === 'gol' ? gol + 5 : gol + h * .19;
    if (progresso > 0) seta(ctx, cx, marca, cx, marca + (fim - marca) * progresso, LINHA);
    disco(ctx, cx, marca + (fim - marca) * progresso, 10, destaque);
    return;
  }
  linha(ctx, cx, y + 13, cx, y + h - 13);
  ctx.beginPath();
  ctx.arc(cx, cy, h * .17, 0, Math.PI * 2);
  ctx.stroke();
  for (const lado of [-1, 1]) {
    ctx.strokeRect(lado < 0 ? x + 13 : x + w * .83 - 13, cy - h * .26, w * .17, h * .52);
  }
  if (painel.forma === 'impedimento') {
    const limite = x + w * .65;
    const realce = faixa(progresso * 3, 0, 1);
    ctx.globalAlpha = realce;
    linha(ctx, limite, y + 13, limite, y + h - 13, LINHA, 5, true);
    ctx.globalAlpha = 1;
    disco(ctx, limite, cy + h * .19, 19, EQUIPE);
    disco(ctx, limite + w * .11, cy - h * .19, 19, destaque);
    disco(ctx, x + w * .31, cy + h * .10, 14, LINHA);
  } else {
    const origem = x + w * .25;
    const destino = x + w * .74;
    const sy = cy + h * .19;
    const dy = cy - h * .20;
    disco(ctx, origem, sy, 19, LINHA);
    disco(ctx, destino, dy, 19, LINHA);
    disco(ctx, cx + w * .12, cy + h * .24, 16, EQUIPE);
    if (progresso > 0) seta(ctx, origem, sy, destino, dy, LINHA);
    disco(ctx, origem + (destino - origem) * progresso, sy + (dy - sy) * progresso, 10, destaque);
  }
}

function contexto(ctx, spec, beat, x, y, w, h) {
  const [inicio, fim] = beat.palavras || [0, -1];
  const fala = (spec.palavras || []).slice(inicio, fim + 1).map(p => p.w).join(' ');
  const valor = (beat.titulo?.texto || fala || spec.tema || '').replace(/\*/g, '').trim();
  const tamanho = Math.min(66, h * .20);
  const linhas = [];
  let atual = '';
  ctx.font = `700 ${tamanho}px IluD, Ilu, sans-serif`;
  for (const palavra of valor.split(/\s+/)) {
    const junto = atual ? `${atual} ${palavra}` : palavra;
    if (atual && ctx.measureText(junto).width > w) { linhas.push(atual); atual = palavra; }
    else atual = junto;
  }
  if (atual) linhas.push(atual);
  const visiveis = linhas.slice(0, 3);
  if (linhas.length > 3) visiveis[2] += '…';
  visiveis.forEach((v, i) => texto(ctx, v, x, y + h / 2 + (i - (visiveis.length - 1) / 2) * tamanho * 1.04, tamanho, w));
}

function pintar(canvas, spec, beat, t) {
  const ctx = canvas.getContext('2d');
  const { width: W, height: H } = canvas;
  const horizontal = W > H;
  const x = horizontal ? 340 : 98;
  const y = horizontal ? 235 : 438;
  const w = horizontal ? 1240 : 808;
  const h = horizontal ? 522 : 758;
  const dx = horizontal ? 36 : 40;
  const marca = spec.marca?.destaque || '#ff7a2f';
  const painel = beat.tifo || { forma: 'contexto' };
  const foto = beat.elementos?.find(el => el.tipo === 'imagem' && el.src && t >= (el.t0 ?? beat.de));
  const gatilho = spec.palavras?.[painel.gatilho]?.t ?? beat.de;
  const desfecho = spec.palavras?.[painel.desfecho]?.t ?? gatilho + .85;
  const tempo = t - gatilho;
  const progresso = suave(faixa(tempo / Math.max(.22, desfecho - gatilho), 0, 1));

  caixa(ctx, 0, 0, W, H, PAPEL);
  for (let i = 0; i < H; i += 48) linha(ctx, 0, i, W, i, '#e5e1d3', 1);
  if (foto) {
    const classe = foto._classeVisual === 'registro' ? 'REGISTRO DO FATO' : 'IMAGEM DE CONTEXTO';
    const faixay = horizontal ? 748 : 1257;
    caixa(ctx, x + 8, faixay - 22, horizontal ? 342 : 380, 44, CARTAO, 8);
    caixa(ctx, x + 8, faixay - 22, 7, 44, marca, 3);
    texto(ctx, classe, x + 30, faixay, 22, 330, { mono: true });
    return null;
  }

  caixa(ctx, x + 12, y + 16, w, h, '#d5d4c6', 22);
  caixa(ctx, x, y, w, h, CARTAO, 22);
  caixa(ctx, x + dx, y + 39, 14, 40, marca, 5);
  texto(ctx, rotulos[painel.forma] || rotulos.contexto, x + dx + 28, y + 60, 25, w - 105, { mono: true });
  linha(ctx, x + dx, y + 103, x + w - dx, y + 103, '#d6dcd3', 2);

  const diagrama = ['cobranca', 'impedimento', 'jogada'].includes(painel.forma);
  if (diagrama) {
    const fx = x + dx;
    const fy = y + 126;
    const fw = w - dx * 2;
    const fh = h - 200;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(fx, fy, fw, fh, 10);
    ctx.clip();
    const movimento = beat.camera?.mov || 'nenhum';
    const curso = suave(faixa((t - beat.de) / Math.max(.3, beat.ate - beat.de), 0, 1));
    const forca = faixa(beat.camera?.forca ?? .45, 0, 2);
    const zoom = 1 + .10 * forca * (movimento === 'avanca' ? curso : movimento === 'recua' ? 1 - curso : 0);
    const pan = (movimento === 'panEsq' ? -1 : movimento === 'panDir' ? 1 : 0) * curso * forca;
    ctx.translate(fx + fw / 2 + pan * 12, fy + fh / 2);
    ctx.scale(zoom + Math.abs(pan) * .035, zoom + Math.abs(pan) * .035);
    campo(ctx, -fw / 2, -fh / 2, fw, fh, painel, progresso, marca);
    ctx.restore();
    const nota = t >= desfecho && painel.resultado === 'defesa' ? 'ESQUEMA · DEFESA' :
      t >= desfecho && painel.resultado === 'gol' ? 'ESQUEMA · GOL' : 'ESQUEMA DO LANCE';
    texto(ctx, nota, x + dx, y + h - 36, 24, fw, { mono: true });
  } else if (painel.forma === 'placar' && painel.placar) {
    const centro = y + h * .56;
    caixa(ctx, x + dx, centro - 116, w - dx * 2, 232, TINTA, 12);
    texto(ctx, tempo >= 0 ? painel.placar.join('  ×  ') : '·  ×  ·', x + w / 2, centro, 134, w - dx * 4, { cor: CARTAO, alinhar: 'center', mono: true });
  } else if (painel.forma === 'resposta') {
    const centro = y + h * .56;
    const largura = (w - dx * 2 - 68) / 2;
    caixa(ctx, x + dx, centro - 68, largura, 136, '#dce9df', 10);
    caixa(ctx, x + w - dx - largura, centro - 68, largura, 136, progresso > .12 ? '#dce9df' : '#efefe6', 10);
    texto(ctx, 'COBRANÇA', x + dx + largura / 2, centro, 31, largura - 22, { alinhar: 'center' });
    if (tempo >= 0) {
      texto(ctx, 'RESPOSTA', x + w - dx - largura / 2, centro, 31, largura - 22, { alinhar: 'center' });
      seta(ctx, x + w / 2 - 24, centro, x + w / 2 + 24, centro, TINTA);
    }
  } else {
    contexto(ctx, spec, beat, x + dx, y + 117, w - dx * 2, h - 172);
  }
  return {
    x0: x, y0: y, x1: x + w, y1: y + h,
    tipo: 'tifo', forma: painel.forma, texto: beat.id,
    valor: diagrama ? Math.round(progresso * 4) : ['resposta', 'placar'].includes(painel.forma) ? Number(tempo >= 0) : undefined,
  };
}

export function instalarTifo(ilu) {
  const { carregar, quadro, capa, medir } = ilu;
  let spec;
  let canvas;
  function desenhar(t) {
    if (!canvas || !spec) return null;
    const beat = spec.beats.find(b => t >= b.de && t < b.ate);
    const ativo = beat && (beat.estilo || spec.estilo) === 'tifo-football';
    canvas.hidden = !ativo;
    canvas.parentElement.classList.toggle('tifo-ativo', !!ativo);
    return ativo ? pintar(canvas, spec, beat, t) : null;
  }
  ilu.carregar = async (cena, opcoes) => {
    canvas?.remove();
    canvas = null;
    spec = cena;
    const info = await carregar(cena, opcoes);
    if (cena.estilo !== 'tifo-football' && !cena.beats?.some(beat => beat.estilo === 'tifo-football')) return info;
    const raiz = document.getElementById('raiz');
    const estilo = document.createElement('style');
    estilo.textContent = '.tifo-ativo #legenda div{background:#142b29;color:#fffdf5}.tifo-ativo #legenda span{color:#fffdf5}.tifo-ativo #legenda span.on{color:#fffdf5;text-decoration:underline;text-underline-offset:.15em}.tifo-ativo #capatxt{color:#142b29}';
    raiz.append(estilo);
    canvas = document.createElement('canvas');
    canvas.id = 'tifo-cena';
    canvas.width = raiz.clientWidth;
    canvas.height = raiz.clientHeight;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none';
    raiz.insertBefore(canvas, document.getElementById('traco'));
    desenhar(0);
    return info;
  };
  ilu.quadro = t => { const r = quadro(t); desenhar(t); return r; };
  ilu.capa = (t, ...args) => { const r = capa(t, ...args); desenhar(t); return r; };
  ilu.medir = (t, opcoes) => {
    const medida = medir(t, opcoes);
    const area = desenhar(t);
    if (area) medida.tifo = area;
    return medida;
  };
}
