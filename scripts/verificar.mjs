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
import { estado, PACOTE } from '../src/licenca/licenca.mjs';

/**
 * npm run verificar              confere se os arquivos do estúdio estão como saíram de fábrica e a licença
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
console.log(`Estúdio Ilustrando ${p.versao || '(sem VERSAO)'}${p.comprador ? `, pacote ${p.comprador}` : ''}\n`);
let grave = false;

const r = conferir(RAIZ, { so: 'tudo' });
if (!r.temManifesto) {
  if (PACOTE) { erro('Falta o MANIFESTO.json (a lista de fábrica dos arquivos).', 'Descompacte o zip de novo numa pasta nova e copie para ela as suas pastas projetos/ e marca/ e o arquivo .env.'); grave = true; }
  else aviso('Sem MANIFESTO.json: este é o repositório de desenvolvimento (o manifesto só existe no pacote).');
} else {
  if (r.assinaturaOk) ok('Os arquivos vieram do pacote oficial (assinatura confere).');
  else { erro('A assinatura do manifesto não confere: o pacote foi alterado ou não é oficial.', 'Baixe o pacote de novo pela área de membros.'); grave = true; }
  const sis = (xs, c) => xs.filter((x) => x.classe === c);
  const motor = [...sis(r.alterados, 'motor'), ...sis(r.faltando, 'motor')];
  if (!motor.length) ok(`Motor do estúdio íntegro (${Object.keys(JSON.parse(fs.readFileSync(path.join(RAIZ, 'MANIFESTO.json'), 'utf8')).arquivos).filter((f) => f.startsWith('src/')).length} arquivos conferidos).`);
  else { erro(`${motor.length} arquivo(s) do motor alterado(s) ou faltando: ${nomes(motor)}.`, 'Enquanto o motor estiver alterado, o vídeo final sai com marca d\'água. Para consertar: npm run atualizar -- <o zip mais recente> --reinstalar (seus projetos e sua marca não são tocados).'); grave = true; }
  const sAlt = sis(r.alterados, 'sistema'), sFal = sis(r.faltando, 'sistema');
  if (sAlt.length) aviso(`${sAlt.length} arquivo(s) do kit diferentes do original: ${nomes(sAlt)}.`, 'Se foi você (ou o assistente) que mudou, tudo bem. Se não, reinstale com npm run atualizar -- <zip> --reinstalar.');
  if (sFal.length) aviso(`${sFal.length} arquivo(s) do kit faltando: ${nomes(sFal)}.`, 'Descompacte o zip de novo ou reinstale com npm run atualizar -- <zip> --reinstalar.');
  if (!sAlt.length && !sFal.length) ok('Guias, skills, documentação e modelos como saíram de fábrica.');
  const seus = [...sis(r.alterados, 'seu')];
  if (seus.length) info(`Personalizados por você (normal): ${nomes(seus)}.`);
  const novosSrc = r.novos.filter((x) => x.classe === 'motor');
  if (novosSrc.length) aviso(`Arquivos novos dentro de src/ (não vieram no pacote): ${nomes(novosSrc)}.`, 'Não fazem parte do estúdio. Se não foi você, apague.');
  const outrosNovos = r.novos.filter((x) => x.classe !== 'motor');
  if (outrosNovos.length) info(`${outrosNovos.length} arquivo(s) criados por você ou pelo assistente (projetos, carrosséis, notas): normal.`);
}

const lic = await estado({ raiz: RAIZ, rede: 'auto', pacote: p.comprador, versao: p.versao });
if (lic.situacao === 'dev') info('Licença: não exigida no repositório de desenvolvimento.');
else if (lic.ativa) ok(lic.mensagem.replace(/^l/, 'L') + (lic.dias ? ` (próxima conferência online em até ${lic.dias} dia(s))` : ''));
else aviso(`Licença: ${lic.mensagem}.`, 'O estúdio funciona igual, mas o vídeo final sai com a marca d\'água "versão não ativada". Para ativar: npm run ativar.');

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
