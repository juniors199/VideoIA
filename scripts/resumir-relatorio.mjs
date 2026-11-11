import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const uso = 'Uso: node scripts/resumir-relatorio.mjs <projeto> [--campo=<campo>] [--filtro=<texto>]';

function lerRelatorio(projeto) {
  const arquivo = path.join(raiz, 'projetos', projeto, 'saida', 'relatorio.json');
  let texto;
  try {
    const real = fs.realpathSync(arquivo);
    const projetos = fs.realpathSync(path.join(raiz, 'projetos'));
    const esperado = path.join(projetos, projeto, 'saida', 'relatorio.json');
    if (path.relative(esperado, real)) throw new Error('O relatório precisa estar na pasta de saída do projeto.');
    texto = fs.readFileSync(real, 'utf8');
  } catch (erro) {
    if (erro.code === 'ENOENT') throw new Error('Relatório indisponível. Confira a saída da tentativa atual.');
    throw erro;
  }

  let relatorio;
  try {
    relatorio = JSON.parse(texto.replace(/^\uFEFF/, ''));
  } catch {
    throw new Error('Relatório com JSON inválido. Confira a saída da tentativa atual.');
  }
  if (!relatorio || typeof relatorio !== 'object' || Array.isArray(relatorio)) {
    throw new Error('O relatório precisa conter um objeto JSON.');
  }
  return relatorio;
}

function amostraFalha(falha) {
  const texto = typeof falha === 'string' ? falha : JSON.stringify(falha);
  return texto.length > 180 ? texto.slice(0, 179) + '…' : texto;
}

function resumir(relatorio) {
  const { etapas, nota, formato, estilo, falhas, avisos, ajustes } = relatorio;
  const contar = valor => Array.isArray(valor) ? valor.length : null;
  return {
    etapas,
    nota,
    formato,
    estilo,
    falhas: contar(falhas),
    amostraFalhas: Array.isArray(falhas) && falhas.length ? falhas.slice(0, 3).map(amostraFalha) : undefined,
    avisos: contar(avisos),
    ajustes: contar(ajustes),
  };
}

function selecionar(relatorio, campo, filtro) {
  let valor = relatorio;
  for (const chave of campo.split('.')) {
    if (!valor || typeof valor !== 'object' || !Object.hasOwn(valor, chave)) {
      throw new Error('Campo ausente no relatório: ' + campo);
    }
    valor = valor[chave];
  }
  if (!filtro) return valor;
  if (!Array.isArray(valor)) throw new Error('O filtro só se aplica a listas, como avisos e falhas.');
  const termo = filtro.toLocaleLowerCase('pt-BR');
  return valor.filter(item => JSON.stringify(item).toLocaleLowerCase('pt-BR').includes(termo));
}

function executar([projeto, ...opcoes]) {
  if (projeto === '--help' || projeto === '--ajuda') {
    console.log(uso);
    return;
  }
  if (!projeto || !/^[a-z0-9][a-z0-9_-]*$/i.test(projeto)) throw new Error(uso);
  const argumentos = new Map();
  for (const opcao of opcoes) {
    const partes = opcao.match(/^--(campo|filtro)=(.+)$/);
    if (!partes || argumentos.has(partes[1])) throw new Error(uso);
    argumentos.set(partes[1], partes[2]);
  }
  const campo = argumentos.get('campo');
  const filtro = argumentos.get('filtro');
  if ((campo && !/^\w+(?:\.\w+)*$/.test(campo)) || (filtro && !campo)) throw new Error(uso);

  const relatorio = lerRelatorio(projeto);
  const resultado = campo ? selecionar(relatorio, campo, filtro) : resumir(relatorio);
  console.log(JSON.stringify(resultado));
}

try {
  executar(process.argv.slice(2));
} catch (erro) {
  console.error(erro.message);
  process.exitCode = 1;
}
