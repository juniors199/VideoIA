/*
 * 
 * 
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/**
 * Projeto de teste fora do repositório: cria uma pasta de projetos em os.tmpdir() (ilu-teste-*), com o projeto
 * <nome> dentro, e devolve o env com ILU_PROJETOS apontando para ela. O motor (cli.mjs, video.mjs) e os scripts
 * leem ILU_PROJETOS no lugar de studio/projetos. Se o processo morrer antes do t.after, o lixo fica no tmp do
 * sistema, nunca em studio/projetos.
 *
 *   const { pasta, nome, env } = projetoTemp(t, 'json-incompleto');
 *   spawnSync(process.execPath, ['src/video/cli.mjs', nome, ...], { cwd: raiz, env: { ...env, ILU_TELEMETRIA: '0' } });
 *
 * Sem t (teste síncrono com try/finally), chame limpar() no fim.
 */
export function projetoTemp(t, nome = 'projeto') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ilu-teste-'));
  const pasta = path.join(dir, nome);
  fs.mkdirSync(pasta, { recursive: true });
  const limpar = () => fs.rmSync(dir, { recursive: true, force: true });
  if (t && typeof t.after === 'function') t.after(limpar);
  return { dir, pasta, nome, env: { ...process.env, ILU_PROJETOS: dir }, limpar };
}
