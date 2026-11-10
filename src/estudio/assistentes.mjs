/* Estudio de videos: detecção e execução dos assistentes (Claude, Codex, Cursor). */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { spawnSyncSemShell } from '../video/node-versao.mjs';
import { lerEnv, gravarEnv, lerConfig } from './configlocal.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const IDS = ['claude', 'codex', 'cursor'];
const NOMES = { claude: 'Claude Code', codex: 'Codex', cursor: 'Cursor' };

function versaoCli(cmd, args = ['--version']) {
  try {
    const r = spawnSyncSemShell(cmd, args, { encoding: 'utf8', timeout: 8000, windowsHide: true });
    if (r.status !== 0) return null;
    const linha = String(r.stdout || r.stderr || '').trim().split(/\r?\n/)[0] || '';
    return linha.replace(/\s*\(Claude Code\)/, '').replace(/^codex-cli\s*/, '') || cmd;
  } catch {
    return null;
  }
}

function chaveCursor(raiz = RAIZ, env = process.env) {
  const doEnv = String(env.CURSOR_API_KEY || '').trim();
  if (doEnv) return true;
  const local = lerEnv(raiz);
  return !!local.definidas?.CURSOR_API_KEY;
}

function detectarOpcao(id, { raiz = RAIZ, env = process.env } = {}) {
  if (id === 'claude') {
    const versao = versaoCli('claude');
    return {
      id,
      nome: NOMES.claude,
      instalado: !!versao,
      versao: versao || null,
      dica: versao
        ? 'Encontrei o Claude Code neste computador.'
        : 'Instale o Claude Code (app Claude, aba Code) e deixe o comando `claude` no PATH. Guia 01, seção 07.',
    };
  }
  if (id === 'codex') {
    const versao = versaoCli('codex');
    return {
      id,
      nome: NOMES.codex,
      instalado: !!versao,
      versao: versao || null,
      dica: versao
        ? 'Encontrei o Codex neste computador.'
        : 'Instale o Codex (app ChatGPT) e deixe o comando `codex` no PATH. Guia 01, seção 08.',
    };
  }
  const temChave = chaveCursor(raiz, env);
  const agent = versaoCli('agent') || versaoCli('cursor-agent');
  const instalado = temChave || !!agent;
  return {
    id: 'cursor',
    nome: NOMES.cursor,
    instalado,
    versao: agent || (temChave ? 'chave no .env' : null),
    temChave,
    dica: instalado
      ? (temChave ? 'Chave do Cursor encontrada no .env.' : 'Encontrei o CLI do Cursor; ainda falta a chave CURSOR_API_KEY.')
      : 'Cole a chave CURSOR_API_KEY em Configurar IA (ela vai só para o .env), ou instale o Cursor Agent.',
  };
}

function listarOpcoes(opts = {}) {
  return IDS.map((id) => detectarOpcao(id, opts));
}

function escolhido(raiz = RAIZ) {
  const cfg = lerConfig(path.join(raiz, 'ilustrando.config.json'));
  const id = String(cfg.assistente || '').trim();
  return IDS.includes(id) ? id : null;
}

function situacao(raiz = RAIZ, env = process.env) {
  const opcoes = listarOpcoes({ raiz, env });
  const id = escolhido(raiz);
  const atual = id ? opcoes.find((o) => o.id === id) : null;
  const pronto = !!(atual && atual.instalado && (atual.id !== 'cursor' || atual.temChave || atual.versao));
  // Cursor: precisa chave para o SDK; CLI agent sozinho não basta para o chat embutido com API
  const cursorOk = atual?.id === 'cursor' ? !!atual.temChave : true;
  const conectado = !!(atual && atual.instalado && (atual.id !== 'cursor' || cursorOk));
  return {
    opcoes,
    escolhido: id,
    nome: id ? NOMES[id] : null,
    conectado,
    pronto: conectado,
  };
}

function gravarEscolha(id, raiz = RAIZ) {
  if (!IDS.includes(id)) {
    return { erro: { causa: 'Assistente desconhecido.', acao: 'Escolha Claude Code, Codex ou Cursor.' } };
  }
  const op = detectarOpcao(id, { raiz });
  if (!op.instalado) {
    return { erro: { causa: `Não achei o ${op.nome} neste computador.`, acao: op.dica } };
  }
  if (id === 'cursor' && !op.temChave) {
    return { erro: { causa: 'Falta a chave do Cursor.', acao: 'Cole a CURSOR_API_KEY no campo abaixo e salve. Ela fica só neste computador.' } };
  }
  const arq = path.join(raiz, 'ilustrando.config.json');
  const cfg = lerConfig(arq);
  cfg.assistente = id;
  fs.writeFileSync(arq, `${JSON.stringify(cfg, null, 2)}\n`);
  return { ok: true, ...situacao(raiz) };
}

function gravarChaveCursor(chave, raiz = RAIZ) {
  const v = String(chave ?? '').trim();
  try {
    gravarEnv({ CURSOR_API_KEY: v }, raiz);
  } catch (e) {
    return { erro: { causa: e.message || 'Não gravou a chave.', acao: 'Cole de novo só a chave, sem espaços a mais.' } };
  }
  if (v) process.env.CURSOR_API_KEY = v;
  else delete process.env.CURSOR_API_KEY;
  return { ok: true, ...situacao(raiz) };
}

function contextoCurto(raiz) {
  return [
    'Você está no Estudio de videos (pasta local).',
    `Pasta: ${raiz}`,
    'Siga CLAUDE.md / AGENTS.md e as skills (pauta, roteiro, video, carrossel, publicar, marca, comece).',
    'Não peça chave de voz no chat. Não abra nem controle o navegador.',
    'Grave arquivos em projetos/ e carrosseis/ quando for o caso.',
  ].join(' ');
}

function montarPrompt(mensagem, raiz) {
  const txt = String(mensagem || '').trim();
  return `${contextoCurto(raiz)}\n\nPedido da pessoa:\n${txt}`;
}

function spawnLinhas(cmd, args, { cwd, env, onLinha, sinal }) {
  return new Promise((resolve) => {
    const filho = spawn(cmd, args, {
      cwd,
      env: { ...process.env, ...env },
      windowsHide: true,
      shell: false,
    });
    if (sinal) sinal.proc = filho;
    let buf = '';
    const flush = (chunk, forcar = false) => {
      buf += chunk.toString();
      const partes = buf.split(/\r?\n/);
      buf = forcar ? '' : partes.pop() || '';
      for (const linha of partes) {
        const t = linha.trimEnd();
        if (t) onLinha(t);
      }
      if (forcar && buf.trim()) {
        onLinha(buf.trimEnd());
        buf = '';
      }
    };
    filho.stdout?.on('data', (c) => flush(c));
    filho.stderr?.on('data', (c) => flush(c));
    filho.on('error', (e) => {
      onLinha(String(e.message || e));
      resolve(1);
    });
    filho.on('close', (code) => {
      flush('', true);
      resolve(code ?? 1);
    });
  });
}

async function rodarClaude(mensagem, { raiz, onLinha, sinal }) {
  const prompt = montarPrompt(mensagem, raiz);
  onLinha('Claude Code: começando…');
  return spawnLinhas(
    'claude',
    ['-p', prompt, '--output-format', 'text', '--dangerously-skip-permissions'],
    { cwd: raiz, onLinha, sinal },
  );
}

async function rodarCodex(mensagem, { raiz, onLinha, sinal }) {
  const prompt = montarPrompt(mensagem, raiz);
  onLinha('Codex: começando…');
  return spawnLinhas(
    'codex',
    ['exec', '--sandbox', 'workspace-write', prompt],
    { cwd: raiz, onLinha, sinal },
  );
}

function textoDoEventoCursor(ev) {
  if (!ev || typeof ev !== 'object') return '';
  if (typeof ev.text === 'string') return ev.text;
  if (typeof ev.message === 'string') return ev.message;
  const t = ev.type || ev.event || '';
  if (t === 'assistant' || t === 'assistant_message' || t === 'message') {
    const c = ev.message?.content || ev.content || ev.text;
    if (typeof c === 'string') return c;
    if (Array.isArray(c)) return c.map((p) => (typeof p === 'string' ? p : p?.text || '')).filter(Boolean).join('');
  }
  if (t === 'tool_call' || t === 'tool') {
    const nome = ev.name || ev.tool || ev.toolCall?.name || 'ferramenta';
    return `→ ${nome}`;
  }
  if (t === 'error') return String(ev.error || ev.message || 'erro do Cursor');
  return '';
}

function lerChaveCursorArquivo(raiz) {
  try {
    for (const linha of fs.readFileSync(path.join(raiz, '.env'), 'utf8').split(/\r?\n/)) {
      const m = /^\s*CURSOR_API_KEY\s*=\s*(.*?)\s*$/.exec(linha);
      if (m) return m[1].replace(/^["']|["']$/g, '').trim();
    }
  } catch { /* sem .env */ }
  return '';
}

async function rodarCursor(mensagem, { raiz, onLinha, sinal }) {
  const prompt = montarPrompt(mensagem, raiz);
  const apiKey = String(process.env.CURSOR_API_KEY || lerChaveCursorArquivo(raiz) || '').trim();
  if (!apiKey) {
    onLinha('Falta CURSOR_API_KEY no .env.');
    return 1;
  }

  try {
    const mod = await import('@cursor/sdk');
    const Agent = mod.Agent || mod.default?.Agent;
    if (!Agent?.create) throw new Error('SDK sem Agent.create');
    onLinha('Cursor: começando…');
    const agent = await Agent.create({
      apiKey,
      model: { id: 'composer-2.5' },
      local: { cwd: raiz },
    });
    if (sinal) sinal.agent = agent;
    const run = await agent.send(prompt);
    if (sinal) sinal.run = run;
    for await (const ev of run.stream()) {
      if (sinal?.cancelado) {
        try { await run.cancel?.(); } catch { /* ok */ }
        onLinha('(cancelado)');
        return 1;
      }
      const txt = textoDoEventoCursor(ev);
      if (txt) onLinha(txt);
    }
    try { await agent[Symbol.asyncDispose]?.(); } catch { /* ok */ }
    try { await agent.dispose?.(); } catch { /* ok */ }
    return 0;
  } catch (e) {
    const msg = String(e?.message || e);
    if (/Cannot find package|Cannot find module|ERR_MODULE_NOT_FOUND/i.test(msg)) {
      onLinha('Pacote @cursor/sdk não instalado. Tentando o CLI agent…');
      const cli = versaoCli('agent') ? 'agent' : (versaoCli('cursor-agent') ? 'cursor-agent' : null);
      if (!cli) {
        onLinha('Não achei o @cursor/sdk nem o CLI agent. Instale o SDK ou o Cursor Agent.');
        return 1;
      }
      return spawnLinhas(cli, ['-p', prompt], { cwd: raiz, env: { CURSOR_API_KEY: apiKey }, onLinha, sinal });
    }
    onLinha(msg);
    return 1;
  }
}

async function rodarChat(id, mensagem, ctx) {
  const onLinha = (l) => ctx.log?.(String(l).slice(0, 500));
  const sinal = ctx.sinal || {};
  if (id === 'claude') return rodarClaude(mensagem, { raiz: ctx.raiz, onLinha, sinal });
  if (id === 'codex') return rodarCodex(mensagem, { raiz: ctx.raiz, onLinha, sinal });
  if (id === 'cursor') return rodarCursor(mensagem, { raiz: ctx.raiz, onLinha, sinal });
  onLinha('Assistente não configurado.');
  return 1;
}

function cancelarChat(sinal) {
  if (!sinal) return false;
  sinal.cancelado = true;
  try { sinal.run?.cancel?.(); } catch { /* ok */ }
  try {
    if (sinal.proc && !sinal.proc.killed) {
      sinal.proc.kill('SIGTERM');
      setTimeout(() => { try { sinal.proc.kill('SIGKILL'); } catch { /* ok */ } }, 2000).unref?.();
    }
  } catch { /* ok */ }
  return true;
}

export {
  IDS,
  NOMES,
  listarOpcoes,
  detectarOpcao,
  escolhido,
  situacao,
  gravarEscolha,
  gravarChaveCursor,
  rodarChat,
  cancelarChat,
  montarPrompt,
  chaveCursor,
};
