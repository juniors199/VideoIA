/*
 *
 *
 */
import fs from 'node:fs';
import { spawnSyncSemShell } from '../src/video/node-versao.mjs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { conferir, infoPacote } from '../src/pacote/integridade.mjs';
import { PACOTE } from '../src/licenca/licenca.mjs';

/**
 * npm run verificar              confere se os arquivos do estúdio estão como saíram de fábrica
 * npm run verificar -- --completo   também roda o doctor (programas) e os testes rápidos
 * Mostra o que mudou em linguagem simples. Não muda nada.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const completo = process.argv.includes('--completo');
const ok = (m) => console.log(`ok    ${m}`);
const aviso = (m, d) => console.log(`aviso ${m}${d ? `\n      -> ${d}` : ''}`);
const erro = (m, d) => console.log(`ERRO  ${m}${d ? `\n      -> ${d}` : ''}`);
const info = (m) => console.log(`      ${m}`);
const nomes = (xs, n = 6) => xs.slice(0, n).map((x) => x.rel).join(', ') + (xs.length > n ? ` e mais ${xs.length - n}` : '');

const p = infoPacote(RAIZ);
console.log(`Estúdio Ilustrando ${p.versao || '(sem VERSAO)'} (open-source)\n`);
let grave = false;

const r = conferir(RAIZ, { so: 'tudo' });
if (!r.temManifesto) {
  if (PACOTE) { erro('Falta o MANIFESTO.json (a lista de fábrica dos arquivos).', 'Descompacte o zip de novo numa pasta nova e copie para ela as suas pastas projetos/ e marca/ e o arquivo .env.'); grave = true; }
  else aviso('Sem MANIFESTO.json: baixe o pacote completo ou ignore se estiver desenvolvendo localmente.');
} else {
  if (r.assinaturaOk) ok('Os arquivos vieram do pacote oficial (assinatura confere).');
  else { erro('A assinatura do manifesto não confere: o pacote foi alterado ou não é oficial.', 'Baixe o pacote de novo ou ignore se você mesmo alterou o código open-source.'); grave = true; }
  const sis = (xs, c) => xs.filter((x) => x.classe === c);
  const motor = [...sis(r.alterados, 'motor'), ...sis(r.faltando, 'motor')];
  if (!motor.length) ok(`Motor do estúdio íntegro (${Object.keys(JSON.parse(fs.readFileSync(path.join(RAIZ, 'MANIFESTO.json'), 'utf8')).arquivos).filter((f) => f.startsWith('src/')).length} arquivos conferidos).`);
  else aviso(`${motor.length} arquivo(s) do motor alterado(s) ou faltando: ${nomes(motor)}.`, 'No open-source isso é esperado se você editou o código.');
  const sAlt = sis(r.alterados, 'sistema'), sFal = sis(r.faltando, 'sistema');
  if (sAlt.length) aviso(`${sAlt.length} arquivo(s) do kit diferentes do original: ${nomes(sAlt)}.`, 'Se foi você (ou o assistente) que mudou, tudo bem.');
  if (sFal.length) aviso(`${sFal.length} arquivo(s) do kit faltando: ${nomes(sFal)}.`);
  if (!sAlt.length && !sFal.length) ok('Guias, skills, documentação e modelos como saíram de fábrica.');
  const seus = [...sis(r.alterados, 'seu')];
  if (seus.length) info(`Personalizados por você (normal): ${nomes(seus)}.`);
  const novosSrc = r.novos.filter((x) => x.classe === 'motor');
  if (novosSrc.length) info(`Arquivos novos dentro de src/: ${nomes(novosSrc)}.`);
  const outrosNovos = r.novos.filter((x) => x.classe !== 'motor');
  if (outrosNovos.length) info(`${outrosNovos.length} arquivo(s) criados por você ou pelo assistente (projetos, carrosséis, notas): normal.`);
}

ok('Modo único: produção open-source (sem licença de ativação).');

if (completo) {
  console.log('\nProgramas (doctor):');
  const d = spawnSync(process.execPath, ['src/video/cli.mjs', '--doctor'], { cwd: RAIZ, stdio: 'inherit' });
  if (d.status !== 0) grave = true;
  console.log('\nTestes rápidos:');
  const t = spawnSyncSemShell('npm', ['test', '--silent'], { cwd: RAIZ, encoding: 'utf8' });
  const res = (t.stdout || '').match(/# pass (\d+)[\s\S]*# fail (\d+)/);
  if (t.status === 0) ok(`testes passaram${res ? ` (${res[1]})` : ''}`);
  else { erro(`testes falharam${res ? ` (${res[2]} de ${+res[1] + +res[2]})` : ''}`, 'Rode npm test para ver o detalhe.'); grave = true; }
}
console.log(grave ? '\nResultado: há problema para resolver (veja os ERROs acima).' : '\nResultado: tudo certo.');
process.exitCode = grave ? 1 : 0;
