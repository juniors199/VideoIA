/*
 * 
 * 
 */
// Auditoria 08/11/2026 (S-04): fotos, vídeos e áudios de exemplo ficam fora do git (.gitignore da raiz: *.jpg em projetos/
// e carrosseis/, *.mp4). Na pasta de trabalho do mantenedor eles existem; num clone limpo, worktree ou CI, não. O teste que
// depende de um deles pula com o nome do arquivo em vez de falhar com ENOENT. Onde o arquivo existe, o teste roda inteiro.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ_STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** os arquivos (relativos a studio/) que faltam no disco */
export const faltando = (...rel) => rel.filter((r) => !fs.existsSync(path.join(RAIZ_STUDIO, r)));

/** mensagem do skip; null quando nada falta */
export function pularSemMidia(...rel) {
  const f = faltando(...rel);
  return f.length ? `falta ${f.join(', ')} (mídia fora do git)` : null;
}

/** a imagem "assets/x.jpg" citada por um erro de validação não está no disco (logo o erro vem da mídia fora do git) */
export function erroDeMidiaAusente(erro, pasta) {
  const m = /(?:a imagem|imagem) "?(assets\/[^\s"]+\.(?:jpe?g|png|webp|mp4))"? não existe/.exec(String(erro));
  return !!m && !fs.existsSync(path.join(pasta, m[1]));
}
