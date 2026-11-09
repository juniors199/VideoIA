/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Mantém o estúdio igual no Claude Code e no Codex, a partir de uma fonte só.
 *
 *   node scripts/sincronizar-skills.mjs              # copia e atualiza
 *   node scripts/sincronizar-skills.mjs --conferir   # só confere; sai com erro se algo divergir
 *
 * Fonte                         Cópia gerada (não edite à mão)
 * .claude/skills/<skill>/...    .agents/skills/<skill>/...   (o Codex procura skills em .agents/skills)
 * CLAUDE.md                     AGENTS.md, entre <!-- CLAUDE.md:inicio --> e <!-- CLAUDE.md:fim -->
 * as skills (nome e descrição)  AGENTS.md, entre <!-- skills:inicio --> e <!-- skills:fim -->
 *
 * Cópia e não link simbólico: link se perde quando o zip é aberto no Windows.
 * Também confere o formato das skills pelo padrão aberto (agentskills.io/specification, checado em 18/10/2026):
 * name igual ao nome da pasta, só [a-z0-9-] e até 64 caracteres; description de 1 a 1024 caracteres.
 */

export const RAIZ_ESTUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LIMITE_AGENTS = 16 * 1024; // metade dos 32 KiB que o Codex lê por padrão (project_doc_max_bytes)
const BLOCO_CLAUDE = ['<!-- CLAUDE.md:inicio -->', '<!-- CLAUDE.md:fim -->'];
const BLOCO_SKILLS = ['<!-- skills:inicio -->', '<!-- skills:fim -->'];

export const lerFrontmatter = (texto) => {
  const m = texto.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const l of m[1].split('\n')) {
    const k = l.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (k) fm[k[1]] = k[2].trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  return fm;
};

const listarArquivos = (dir, base = dir) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const f of fs.readdirSync(dir).sort()) {
    if (f === '.DS_Store') continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out.push(...listarArquivos(p, base));
    else out.push(path.relative(base, p).split(path.sep).join('/'));
  }
  return out;
};

export const lerSkills = (raiz) => {
  const dir = path.join(raiz, '.claude', 'skills');
  const skills = [];
  const problemas = [];
  if (!fs.existsSync(dir)) return { skills, problemas: ['não existe .claude/skills'] };
  for (const nome of fs.readdirSync(dir).sort()) {
    const pasta = path.join(dir, nome);
    if (!fs.statSync(pasta).isDirectory()) continue;
    const arq = path.join(pasta, 'SKILL.md');
    if (!fs.existsSync(arq)) { problemas.push(`${nome}: falta SKILL.md`); continue; }
    const texto = fs.readFileSync(arq, 'utf8');
    const fm = lerFrontmatter(texto);
    if (!fm) { problemas.push(`${nome}: SKILL.md sem cabeçalho (--- name / description ---)`); continue; }
    if (fm.name !== nome) problemas.push(`${nome}: o campo name ("${fm.name}") precisa ser igual ao nome da pasta`);
    if (!/^[a-z0-9-]{1,64}$/.test(nome)) problemas.push(`${nome}: nome de skill só com letras minúsculas, números e hífen, até 64`);
    if (!fm.description || fm.description.length > 1024) problemas.push(`${nome}: description precisa ter de 1 a 1024 caracteres (tem ${fm.description?.length || 0})`);
    if (/ \u2014 /.test(texto)) problemas.push(`${nome}: tem travessão longo com espaços`);
    skills.push({ nome, description: fm.description || '' });
  }
  return { skills, problemas };
};

const trocarBloco = (texto, [ini, fim], miolo, onde) => {
  const a = texto.indexOf(ini);
  const b = texto.indexOf(fim);
  if (a < 0 || b < a) throw new Error(`${onde}: faltam as marcas ${ini} e ${fim}`);
  return texto.slice(0, a + ini.length) + '\n' + miolo.trim() + '\n' + texto.slice(b);
};

// primeira frase da descrição, para a tabela de skills do AGENTS.md
const resumo = (d) => (d.match(/^.*?[.!?](\s|$)/)?.[0] || d).trim();

export const montarAgents = (raiz, skills) => {
  const arqAgents = path.join(raiz, 'AGENTS.md');
  const arqClaude = path.join(raiz, 'CLAUDE.md');
  if (!fs.existsSync(arqAgents)) throw new Error('não existe AGENTS.md');
  if (!fs.existsSync(arqClaude)) throw new Error('não existe CLAUDE.md');
  const claude = fs.readFileSync(arqClaude, 'utf8').replace(/\r\n/g, '\n');
  // o título do CLAUDE.md fica de fora: o AGENTS.md tem o seu
  const corpo = claude.replace(/^# .*\n+/, '');
  let t = fs.readFileSync(arqAgents, 'utf8').replace(/\r\n/g, '\n');
  t = trocarBloco(t, BLOCO_CLAUDE, corpo, 'AGENTS.md');
  const tabela = ['| Skill | No Codex | Para que serve |', '|---|---|---|', ...skills.map((s) => `| \`${s.nome}\` | \`$${s.nome}\` | ${resumo(s.description).replace(/\|/g, '/')} |`)].join('\n');
  t = trocarBloco(t, BLOCO_SKILLS, tabela, 'AGENTS.md');
  return t;
};

/**
 * Sincroniza (ou só confere, com conferir: true) as skills e o AGENTS.md de um estúdio.
 * Devolve { mudancas: [...], problemas: [...] }. Em modo conferir, mudancas é o que estaria diferente.
 */
export function sincronizar(raiz = RAIZ_ESTUDIO, { conferir = false } = {}) {
  const { skills, problemas } = lerSkills(raiz);
  const mudancas = [];
  const origem = path.join(raiz, '.claude', 'skills');
  const destino = path.join(raiz, '.agents', 'skills');

  const deOrigem = listarArquivos(origem);
  const deDestino = new Set(listarArquivos(destino));
  for (const rel of deOrigem) {
    const a = path.join(origem, rel);
    const b = path.join(destino, rel);
    const igual = deDestino.has(rel) && fs.readFileSync(a).equals(fs.readFileSync(b));
    deDestino.delete(rel);
    if (igual) continue;
    mudancas.push(`.agents/skills/${rel}`);
    if (!conferir) { fs.mkdirSync(path.dirname(b), { recursive: true }); fs.copyFileSync(a, b); }
  }
  for (const rel of deDestino) {
    mudancas.push(`.agents/skills/${rel} (sobrando)`);
    if (!conferir) fs.rmSync(path.join(destino, rel));
  }
  if (!conferir && fs.existsSync(destino)) {
    // pastas que ficaram vazias (skill apagada na origem)
    for (const d of fs.readdirSync(destino)) { const p = path.join(destino, d); if (fs.statSync(p).isDirectory() && !listarArquivos(p).length) fs.rmSync(p, { recursive: true }); }
  }

  try {
    const novo = montarAgents(raiz, skills);
    const arq = path.join(raiz, 'AGENTS.md');
    if (novo !== fs.readFileSync(arq, 'utf8').replace(/\r\n/g, '\n')) {
      mudancas.push('AGENTS.md');
      if (!conferir) fs.writeFileSync(arq, novo);
    }
    const bytes = Buffer.byteLength(novo);
    if (bytes > LIMITE_AGENTS) problemas.push(`AGENTS.md tem ${bytes} bytes; o limite que adotamos é ${LIMITE_AGENTS} (o Codex lê até 32 KiB somando o AGENTS.md pessoal da pessoa)`);
    if (/ \u2014 /.test(novo)) problemas.push('AGENTS.md tem travessão longo com espaços');
  } catch (e) {
    problemas.push(e.message);
  }
  return { mudancas, problemas, skills: skills.map((s) => s.nome) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const conferir = process.argv.includes('--conferir');
  const r = sincronizar(RAIZ_ESTUDIO, { conferir });
  if (r.problemas.length) console.error('Problemas:\n' + r.problemas.map((p) => '  - ' + p).join('\n'));
  if (conferir) {
    if (r.mudancas.length) console.error('Fora de sincronia (rode npm run sincronizar):\n' + r.mudancas.map((m) => '  - ' + m).join('\n'));
    else console.log(`Claude Code e Codex em sincronia: ${r.skills.length} skills (${r.skills.join(', ')}) e AGENTS.md.`);
    process.exit(r.problemas.length || r.mudancas.length ? 1 : 0);
  }
  console.log(r.mudancas.length ? `Atualizado:\n${r.mudancas.map((m) => '  - ' + m).join('\n')}` : 'Nada a atualizar.');
  console.log(`${r.skills.length} skills para o Claude Code (.claude/skills) e para o Codex (.agents/skills).`);
  process.exit(r.problemas.length ? 1 : 0);
}
