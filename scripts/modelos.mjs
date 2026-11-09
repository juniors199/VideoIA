/*
 * 
 * 
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAIZ, traduzirModelo, tipoDaFicha } from '../src/estilo-objetivo/carregar.mjs';
import * as eo from './estilo-objetivo.mjs';

/**
 * Compatibilidade (0.6.13): "npm run modelos" continua funcionando, mas o modelo virou Estilo + Objetivo.
 * Os comandos novos são npm run estilos e npm run objetivos (scripts/estilo-objetivo.mjs).
 *   npm run modelos                              # lista os estilos e os objetivos
 *   npm run modelos -- --ver <id>                # mostra um (estilo ou objetivo)
 *   npm run modelos -- --padrao <id>             # grava o padrão da página (estiloPadrao ou objetivoPadrao)
 *   npm run modelos -- --novo <id> --base <id>   # copia para objetivos/meus ou estilos/meus, conforme a base
 *   npm run modelos -- --validar                 # confere todas as fichas
 */
const AVISO = 'Dica: "modelo" agora se chama Estilo (a aparência) + Objetivo (o que o vídeo quer ser). Use npm run estilos e npm run objetivos.';

export const listar = (raiz = RAIZ) => [eo.listar('objetivo', raiz), '', eo.listar('estilo', raiz)].join('\n');
export const descrever = (m) => eo.descrever(m, tipoDaFicha(m));
export const validarTodos = (raiz = RAIZ) => eo.validarTodos(raiz);

/** O nome antigo vira o padrão novo: tipo de página -> objetivoPadrao; nome de estilo -> estiloPadrao. */
export function gravarPadrao(nome, raiz = RAIZ) {
  const t = traduzirModelo(nome, raiz);
  return t.estilo === '@sugerido' ? eo.gravarPadrao('objetivo', t.objetivo, raiz) : eo.gravarPadrao('estilo', t.estilo, raiz);
}

export function novo(id, base, raiz = RAIZ) {
  const t = traduzirModelo(base || 'curiosidades', raiz);
  return t.estilo === '@sugerido' ? eo.novo('objetivo', id, t.objetivo, raiz) : eo.novo('estilo', id, t.estilo, raiz);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  console.log(AVISO + '\n');
  const val = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : null; };
  try {
    if (args.includes('--ver') && val('ver')) { const t = traduzirModelo(val('ver')); process.argv.splice(2, Infinity, '--ver', t.estilo === '@sugerido' ? t.objetivo : t.estilo); eo.rodar(t.estilo === '@sugerido' ? 'objetivo' : 'estilo'); }
    else if (args.includes('--padrao') && val('padrao')) { const m = gravarPadrao(val('padrao')); console.log(`• padrão da página: ${m.id} (${m.nome}), gravado em ilustrando.config.json.`); }
    else if (args.includes('--novo')) console.log(`• criado em ${novo(val('novo'), val('base'))}.`);
    else if (args.some((a) => a.startsWith('--'))) eo.rodar('objetivo');
    else console.log(listar());
  } catch (e) { console.error(e.message); process.exit(1); }
}
