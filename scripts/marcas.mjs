/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerIndice, buscarMarcas } from '../src/marcas.mjs';

/**
 * Procura na biblioteca de marcas e bandeiras (marcas/indice.json).
 *   node scripts/marcas.mjs <termo>          ids, nome, área e licença do que bate com o termo (nome, id ou apelido)
 *   node scripts/marcas.mjs --area=<área>    tudo de uma área (tecnologia, ia, redes, midia, politica, internacional, financas, consumo, esporte, bandeiras)
 *   node scripts/marcas.mjs --resumo         quantos itens por área
 *   node scripts/marcas.mjs --doc            reescreve a lista de docs/marcas.md (entre <!-- lista:inicio --> e <!-- lista:fim -->)
 * Na cena: { "tipo": "logo", "marca": "<id>" } ou { "tipo": "bandeira", "marca": "<id>" } (docs/marcas.md).
 */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), area = (args.find((a) => a.startsWith('--area=')) || '').slice(7) || null;
  const { itens } = lerIndice();
  if (args.includes('--doc')) {
    const NOMES = { tecnologia: 'Tecnologia', ia: 'Inteligência artificial', redes: 'Redes sociais e apps', midia: 'Mídia', politica: 'Política e instituições do Brasil', internacional: 'Instituições internacionais', financas: 'Bancos e finanças', consumo: 'Varejo e consumo', esporte: 'Esporte', bandeiras: 'Bandeiras' };
    const TIPOS = { pais: 'Países', estado: 'Estados do Brasil', capital: 'Capitais' };
    const linha = (xs) => xs.map((x) => `\`${x.id}\` ${x.nome}`).join(' · ');
    let md = '';
    for (const [a, n] of Object.entries(NOMES)) {
      const xs = itens.filter((x) => x.area === a); if (!xs.length) continue;
      if (a !== 'bandeiras') { md += `\n### ${n} (${xs.length})\n${linha(xs)}\n`; continue; }
      for (const [t, nt] of Object.entries(TIPOS)) { const ys = xs.filter((x) => x.tipo === t); if (ys.length) md += `\n### ${n}: ${nt} (${ys.length})\n${linha(ys)}\n`; }
    }
    const f = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'marcas.md');
    const t = fs.readFileSync(f, 'utf8');
    fs.writeFileSync(f, t.replace(/<!-- lista:inicio -->[\s\S]*<!-- lista:fim -->/, `<!-- lista:inicio -->\n_Gerada por \`node scripts/marcas.mjs --doc\` a partir de marcas/indice.json (${itens.length} itens)._\n${md}\n<!-- lista:fim -->`));
    console.log(`docs/marcas.md: ${itens.length} itens`);
  } else if (args.includes('--resumo')) {
    const c = itens.reduce((a, x) => ((a[x.area] = (a[x.area] || 0) + 1), a), {});
    for (const [k, v] of Object.entries(c)) console.log(`${k.padEnd(14)} ${v}`);
    console.log(`${'total'.padEnd(14)} ${itens.length}`);
  } else {
    const termo = args.filter((a) => !a.startsWith('--')).join(' ');
    const r = termo ? buscarMarcas(termo, { area }) : itens.filter((x) => !area || x.area === area);
    if (!r.length) { console.log(`Nada para "${termo}". A lista completa está em docs/marcas.md.`); process.exit(1); }
    for (const x of r) console.log(`${x.id.padEnd(22)} ${x.nome} [${x.area}${x.tipo ? ' ' + x.tipo : ''}] ${x.formato}${x.glifo ? ' + ícone' : ''}, ${x.licenca}`);
  }
}
