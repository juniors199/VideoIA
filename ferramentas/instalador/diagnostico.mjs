/*
 * 
 * 
 */
/**
 * Diagnóstico SEM o estúdio aberto (0.6.19). Quem chama: "Diagnóstico (Windows).bat" e "Diagnóstico (Mac).command", com dois cliques.
 * Lê direto da pasta: versão, sistema, Node, o doctor (pelo mesmo comando do estúdio), a voz (só "definida" ou "ausente"), os ajustes
 * automáticos e o fim dos registros .estudio/instalacao.log e .estudio/estudio.log. Tudo passa pela mesma limpeza de chave, e-mail e
 * pasta pessoal do "Copiar diagnóstico". Grava em .estudio/diagnostico.txt, copia para a área de transferência e imprime na tela.
 * Funciona mesmo com a instalação pela metade: se o motor não carregar, monta uma versão mínima só com os registros.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Linhas do doctor ("ok ...", "aviso ...", "ERRO ...", "-> dica") viram itens. */
export function itensDeLinhas(linhas = []) {
  const out = [];
  for (const l of linhas) {
    const m = /^(ok|aviso|ERRO)\s+(.+)$/.exec(String(l).trim());
    if (m) out.push({ id: '', ok: m[1] === 'ok', grave: m[1] === 'ERRO', msg: m[2], dica: '' });
  }
  return out;
}

function rodarDoctor(raiz) {
  const cli = path.join(raiz, 'src', 'video', 'cli.mjs');
  if (!fs.existsSync(cli)) return { itens: [], nota: 'o motor do estúdio não está nesta pasta (src\\video\\cli.mjs)' };
  try {
    const r = spawnSync(process.execPath, [cli, '--doctor'], { cwd: raiz, encoding: 'utf8', timeout: 90000, env: { ...process.env, ILU_TELEMETRIA_PAI: '1' } });
    const linhas = String(r.stdout || '').split(/\r?\n/);
    const itens = itensDeLinhas(linhas);
    if (!itens.length) return { itens, nota: `o doctor não respondeu (código ${r.status ?? 'sem código'}${r.error ? ', ' + r.error.code : ''})` };
    return { itens };
  } catch (e) { return { itens: [], nota: `o doctor falhou (${e?.code || e?.message})` }; }
}

function mensagemMinima(raiz, motivo) {
  const ler = (a, n) => { try { return fs.readFileSync(path.join(raiz, '.estudio', a), 'utf8').split(/\r?\n/).filter(Boolean).slice(-n); } catch { return []; } };
  let ver = '?'; try { ver = fs.readFileSync(path.join(raiz, 'VERSAO'), 'utf8').trim(); } catch { /* sem versão */ }
  return ['Diagnóstico do Estudio de videos (versão mínima)', `Versão do estúdio: ${ver}`, `Sistema: ${os.type()} ${os.release()} (${process.arch})`, `Node: ${process.version}`, `Caminho da pasta: ${raiz.length} caracteres`, `Motivo da versão mínima: ${motivo}`,
    '', 'Registro da instalação:', ...(ler('instalacao.log', 25).length ? ler('instalacao.log', 25) : ['(sem registro)']), '', 'Registro do estúdio:', ...(ler('estudio.log', 20).length ? ler('estudio.log', 20) : ['(sem registro)'])].join('\n');
}

/** Monta o texto. `doctor` pode ser injetado nos testes. */
export async function montar({ raiz = STUDIO, doctor = null } = {}) {
  try {
    const { textoDiagnostico, limparTexto, segredosDaPasta } = await import(pathToFileURL(path.join(raiz, 'src', 'estudio', 'diagnostico.mjs')).href);
    const d = doctor || rodarDoctor(raiz);
    let t = textoDiagnostico({ raiz, doctor: d.itens, etapa: null, erro: d.nota ? { causa: d.nota } : null });
    t = limparTexto(t, { segredos: segredosDaPasta(raiz) });
    return t;
  } catch (e) {
    const { limparTextoMinimo } = { limparTextoMinimo: (x) => String(x).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[e-mail]').split(os.homedir()).join('~') };
    return limparTextoMinimo(mensagemMinima(raiz, `o motor não carregou (${e?.code || String(e?.message || e).split('\n')[0].slice(0, 120)})`));
  }
}

function copiar(texto) {
  try {
    const [cmd, args] = process.platform === 'win32' ? ['clip.exe', []] : process.platform === 'darwin' ? ['pbcopy', []] : ['xclip', ['-selection', 'clipboard']];
    const r = spawnSync(cmd, args, { input: process.platform === 'win32' ? Buffer.from('﻿' + texto, 'utf16le') : texto });
    return r.status === 0;
  } catch { return false; }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log('\n  Montando o diagnóstico (leva até 1 minuto)...\n');
  const texto = await montar({});
  let arq = null;
  try { fs.mkdirSync(path.join(STUDIO, '.estudio'), { recursive: true }); arq = path.join(STUDIO, '.estudio', 'diagnostico.txt'); fs.writeFileSync(arq, texto + '\n'); } catch { arq = null; }
  console.log(texto + '\n');
  console.log('  ---------------------------------------------------------------');
  console.log(copiar(texto) ? '  Pronto: o diagnóstico já está copiado. Cole no direct do Instagram @kaueajure (Ctrl+V no Windows, Cmd+V no Mac).' : '  Copie o texto acima (ou abra o arquivo salvo) e cole no direct do Instagram @kaueajure.');
  if (arq) console.log(`  Também salvei em: ${arq.replace(os.homedir(), '~')}`);
  console.log('  Ele não leva chave, e-mail nem o nome do seu computador.\n');
}
