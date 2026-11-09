/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Linha editorial da página em política: para onde ela tende, e com que força. Fica em ilustrando.config.json:
 *   "linhaEditorial": { "politica": "neutra" | "esquerda" | "centro" | "direita", "intensidade": "leve" | "moderada" }
 *   npm run linha -- --ver                 # mostra a linha atual (e se ainda falta perguntar)
 *   npm run linha -- direita leve          # grava (a skill comece ou a pauta pergunta e roda isto)
 * A linha muda ângulo, ordem e tom. Nunca muda fato, número, atribuição nem o fato central do outro lado
 * (docs/identidade-e-voz.md, seção "Linha editorial").
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LINHAS = ['neutra', 'esquerda', 'centro', 'direita'];
export const INTENSIDADES = ['leve', 'moderada'];

/** lê a linha do config; `perguntar` diz se a pessoa ainda não escolheu (campo ausente ou marcado no pacote) */
export function lerLinha(raiz = RAIZ) {
  let c = {};
  try { c = JSON.parse(fs.readFileSync(path.join(raiz, 'ilustrando.config.json'), 'utf8').replace(/^\uFEFF/, '')); } catch { /* sem config */ }
  const l = c.linhaEditorial;
  if (!l || !LINHAS.includes(l.politica)) return { politica: 'neutra', intensidade: 'leve', perguntar: true };
  return { politica: l.politica, intensidade: INTENSIDADES.includes(l.intensidade) ? l.intensidade : 'leve', perguntar: !!l.perguntar };
}

export function gravarLinha(politica, intensidade = 'leve', raiz = RAIZ) {
  politica = String(politica || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (!LINHAS.includes(politica)) throw new Error(`Linha "${politica}" não existe. Use ${LINHAS.join(', ')}.`);
  if (!INTENSIDADES.includes(intensidade)) throw new Error(`Intensidade "${intensidade}" não existe. Use ${INTENSIDADES.join(' ou ')}.`);
  const f = path.join(raiz, 'ilustrando.config.json');
  const c = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\uFEFF/, '')) : {};
  c.linhaEditorial = { politica, intensidade };
  fs.writeFileSync(f, JSON.stringify(c, null, 2) + '\n');
  return c.linhaEditorial;
}

export const descrever = (l) => (l.politica === 'neutra' ? 'neutra (sem lado; o padrão)' : `${l.politica}, ${l.intensidade}`);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  try {
    if (!args.length || process.argv.includes('--ver')) {
      const l = lerLinha();
      console.log(`linha editorial em política: ${descrever(l)}${l.perguntar ? '\nainda não foi escolhida pela pessoa: pergunte (skill comece ou pauta) e grave com npm run linha -- <neutra|esquerda|centro|direita> [leve|moderada]' : ''}`);
    } else {
      const l = gravarLinha(args[0], args[1] || 'leve');
      console.log(`• linha editorial gravada: ${descrever(l)} (ilustrando.config.json). Fatos, números e atribuição não mudam com a linha.`);
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
