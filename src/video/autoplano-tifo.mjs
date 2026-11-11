const NORMALIZAR = texto => String(texto ?? '').normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const FORMAS = new Set(['cobranca', 'impedimento', 'jogada', 'resposta', 'regra', 'placar', 'contexto']);
const RESULTADOS = new Set(['defesa', 'gol']);
const PLACAR = /\b\d{1,2}\s*(?:a|x|×)\s*\d{1,2}\b/i;
const PARTIDA = /\b(placar|venceu|ganhou|derrotou|terminou|perdeu|empatou)\b/;
const RESPOSTA = /\b(responder|respondeu|resposta|outro presidente|proprio presidente)\b/;
const PENALTI = /\b(penaltis?|marca da cal|disputa de penais)\b/;
const COBRANCA = /\b(penaltis?|cobranca|cobra|cobrou|bateu|chutou|goleiro)\b/;
const OUTRA_JOGADA = /\b(falta|tiro livre|fora da area|cruzou|cruzamento|escanteio)\b/;
const ACAO = /\b(bateu|chutou|cobra|cobrou|chute)\b/;
const IMPEDIMENTO = /\b(impedimento|impedido|impedida)\b/;
const JOGADA = /\b(passe|passou a bola|cruzamento|cruzou|drible|driblou|contra-ataque|escanteio|pressionou|marcacao)\b/;
const REGRA = /\b(regra|regulamento|permitia|permitiu|autorizava|direito de)\b/;

function classificar(fala, tema) {
  const placar = PARTIDA.test(fala) && fala.match(PLACAR);
  if (placar) return { forma: 'placar', placar: placar[0].match(/\d+/g).map(Number), pista: /\d/ };
  const penalti = PENALTI.test(fala) || PENALTI.test(tema) && !OUTRA_JOGADA.test(fala);
  if (penalti && /\bpresidentes?\b/.test(fala) && RESPOSTA.test(fala)) return { forma: 'resposta', pista: RESPOSTA };
  if (IMPEDIMENTO.test(fala)) return { forma: 'impedimento', pista: IMPEDIMENTO };
  if (penalti && COBRANCA.test(fala) && !/\bbateu (?:o |um )?recorde\b/.test(fala)) {
    const afirmativo = !/\b(nao|quase|se|poderia|tentou|seria)\b/.test(fala);
    const defesa = /\b(goleiro\s+(?:pegou|defendeu|espalmou)|defendeu\s+(?:o|a)\s+(?:chute|penalti|cobranca))\b/.test(fala);
    const gol = /\b(fez\s+(?:o|um)\s+gol|marcou|converteu|bola\s+entrou)\b/.test(fala);
    return {
      forma: 'cobranca', pista: ACAO.test(fala) ? ACAO : COBRANCA,
      ...(afirmativo && defesa ? { resultado: 'defesa', pistaDesfecho: /\b(pegou|defendeu|espalmou)\b/ } :
        afirmativo && gol ? { resultado: 'gol', pistaDesfecho: /\b(gol|marcou|converteu|entrou)\b/ } : {}),
    };
  }
  if (JOGADA.test(fala)) return { forma: 'jogada', pista: JOGADA };
  if (REGRA.test(fala)) return { forma: 'regra', pista: REGRA };
  return { forma: 'contexto' };
}

export function relevanciaTifo(painel, fala, tema) {
  if (painel.forma === 'contexto') return fala.trim() ? 2 : 1;
  const esperado = classificar(NORMALIZAR(fala), NORMALIZAR(tema));
  if (painel.forma !== esperado.forma) return 1;
  if (painel.forma === 'placar') return painel.placar?.join() === esperado.placar?.join() ? 3 : 0;
  if (painel.resultado && painel.resultado !== esperado.resultado) return 1;
  return 3;
}

export function planejarTifo(beats, palavras, tema) {
  for (const beat of beats) {
    const [inicio, fim] = beat.palavras;
    const trecho = palavras.slice(inicio, fim + 1).map(p => p.w);
    const { pista, pistaDesfecho, ...painel } = classificar(NORMALIZAR(trecho.join(' ')), NORMALIZAR(tema));
    const indice = pista ? trecho.findIndex(p => pista.test(NORMALIZAR(p))) : -1;
    const desfecho = pistaDesfecho ? trecho.findIndex((p, i) => i >= indice && pistaDesfecho.test(NORMALIZAR(p))) : -1;
    beat.tifo = { ...painel, gatilho: indice < 0 ? inicio : inicio + indice, ...(desfecho >= 0 ? { desfecho: inicio + desfecho } : {}) };
    // O arquivo já escolhido tem prioridade. A busca por nome só compete com o painel de contexto.
    const fotos = (beat.elementos || []).filter(el => el.tipo === 'imagem' &&
      (el.arquivo || (painel.forma === 'contexto' && el.busca && el.contexto)));
    beat.elementos = fotos.slice(0, 1).map(({ reserva, reservaBeat, dupla, ...foto }) => ({
      ...foto, entra: 0, forma: 'card', largura: 680,
    }));
    delete beat.titulo;
    delete beat.cenario;
    delete beat.modelo;
    delete beat._ff;
    beat.camera = { plano: 'normal', mov: painel.forma === 'contexto' ? 'nenhum' : 'avanca', forca: 0.45 };
    beat.transicao = 'corte';
  }
  return true;
}

export function validarTifo(beat) {
  const painel = beat.tifo;
  if (!painel || typeof painel !== 'object' || !FORMAS.has(painel.forma)) {
    return ['"tifo.forma" precisa ser ' + [...FORMAS].join(', ') + '.'];
  }
  const erros = [];
  if (painel.forma === 'placar' && (!Array.isArray(painel.placar) || painel.placar.length !== 2 ||
      !painel.placar.every(n => Number.isInteger(n) && n >= 0 && n <= 99))) erros.push('"tifo.placar" precisa ter dois números inteiros de 0 a 99.');
  if (painel.resultado != null && (painel.forma !== 'cobranca' || !RESULTADOS.has(painel.resultado))) erros.push('"tifo.resultado" aceita defesa ou gol em cobrança.');
  for (const chave of ['gatilho', 'desfecho']) {
    const indice = painel[chave];
    if (indice != null && (!Number.isInteger(indice) || indice < 0 ||
        (beat.palavras && (indice < beat.palavras[0] || indice > beat.palavras[1])))) erros.push('"tifo.' + chave + '" precisa ser o índice de uma palavra do beat.');
  }
  if (painel.desfecho != null && (!painel.resultado || painel.desfecho < painel.gatilho)) erros.push('"tifo.desfecho" requer resultado e uma palavra a partir do gatilho.');
  return erros;
}
