/*
 * 
 * 
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { atualizar, desfazer } from '../src/pacote/atualizar.mjs';

/**
 * npm run atualizar -- caminho/do/ilustrando-metodo-vX.Y.Z.zip     aplica a versão nova
 * npm run atualizar -- <pacote> --simular                          só mostra o que mudaria
 * npm run atualizar -- --desfazer                                  volta a última atualização
 * Só entram versões publicadas dentro do seu período de atualizações (12 meses da compra, ou sempre com as
 * Atualizações vitalícias). Fora dele, nada muda e o estúdio continua funcionando na versão instalada.
 * Seus projetos, sua marca, o .env e o que você criou nunca são tocados. Tudo que for trocado fica guardado
 * em .atualizacao/ antes, e se algo falhar no meio a atualização é desfeita sozinha.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const origem = args.find((a) => !a.startsWith('--'));
const lista = (t, xs, n = 8) => (xs.length ? `${t}: ${xs.length}\n${xs.slice(0, n).map((x) => '    ' + x).join('\n')}${xs.length > n ? `\n    … e mais ${xs.length - n}` : ''}` : null);

try {
  if (args.includes('--desfazer')) {
    const r = desfazer({ raiz: RAIZ });
    console.log(`ok   atualização desfeita: o estúdio voltou para a versão ${r.para} (backup usado: ${r.backup}).`);
  } else {
    const r = await atualizar({ raiz: RAIZ, origem: origem && path.resolve(origem), simular: args.includes('--simular'), reinstalar: args.includes('--reinstalar'), log: (m) => console.log('•', m) });
    console.log(`${r.simulado ? 'Simulação' : 'ok   Atualizado'}: ${r.de} -> ${r.para}`);
    for (const l of [lista('  arquivos trocados', r.plano.trocar), lista('  arquivos novos', r.plano.criar), lista('  arquivos que saíram do kit', r.plano.remover), lista('  arquivos do kit que você alterou e ficaram como estavam (não existem mais na versão nova)', r.plano.manterAlterados)]) if (l) console.log(l);
    if (r.alteradosPorVoce.length) console.log(`  aviso: ${r.alteradosPorVoce.length} arquivo(s) do kit que você tinha alterado foram trocados pela versão nova; a sua versão ficou guardada em ${r.backup || '.atualizacao/'}.`);
    if (r.plano.config) console.log('  ilustrando.config.json: suas escolhas foram mantidas; opções novas foram acrescentadas.');
    for (const n of r.migracao || []) console.log(`  estilo e objetivo: ${n}`);
    console.log('  Não foram tocados: projetos/, marca/, carrosseis/, .env e a sua licença.');
    if (!r.simulado) {
      console.log(`  Backup da versão anterior: ${r.backup} (para voltar: npm run atualizar -- --desfazer)`);
      if (r.precisaInstalar) console.log('  Próximo passo: rode npm install (as peças do estúdio mudaram) e depois npm run verificar.');
      else console.log('  Próximo passo: npm run verificar.');
    }
  }
} catch (e) {
  // fora do período de atualizações não é defeito: o estúdio segue como está, só esta versão nova não entra
  // 0.6.24: os prefixos "aviso " e "ERRO " são o formato do diagnóstico (doctor), e o tradutor de erros descarta essas linhas:
  // por isso "A versão X já está instalada" chegava à telemetria como "sem-traducao-c1". Aqui as mensagens levam outro prefixo.
  if (e.codigo === 'fora-do-prazo') console.log(`Aviso: ${e.message.split('\n').join('\n       ')}`);
  else if (e.codigo === 'ja-instalada') console.log(`Nada a trocar: ${e.message}`);
  else console.error(`Não deu para atualizar: ${e.message}`);
  process.exitCode = 1;
}
