/*
 * 
 * 
 */
/**
 * Tar simples em Node puro (0.6.40), para as peças embutidas do estúdio (ferramentas/instalador/pecas/pecas.tgz).
 *  - escreverTarGz: o mantenedor gera o pacote das peças (scripts/pecas-embutidas.mjs). Formato ustar com cabeçalho pax
 *    para caminho comprido, data fixa e sem atributos do Mac: o mesmo conteúdo dá sempre o mesmo arquivo.
 *  - extrairTarGz: o instalador usa quando o tar do sistema falha (Windows antigo, tar de outro programa na frente).
 *    Lê arquivo, pasta, cabeçalho pax (path) e nome longo do GNU (L); ignora o resto. Nunca grava fora da pasta de destino.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BLOCO = 512;
const octal = (n, tam) => n.toString(8).padStart(tam - 1, '0') + '\0';

function cabecalho({ nome, tamanho, modo, tipo }) {
  const h = Buffer.alloc(BLOCO);
  h.write(nome, 0, 100, 'utf8');
  h.write(octal(modo, 8), 100, 'ascii');
  h.write(octal(0, 8), 108, 'ascii');
  h.write(octal(0, 8), 116, 'ascii');
  h.write(octal(tamanho, 12), 124, 'ascii');
  h.write(octal(1700000000, 12), 136, 'ascii');
  h.fill(0x20, 148, 156);
  h.write(tipo, 156, 'ascii');
  h.write('ustar\0', 257, 'ascii');
  h.write('00', 263, 'ascii');
  let soma = 0;
  for (const b of h) soma += b;
  h.write(soma.toString(8).padStart(6, '0') + '\0 ', 148, 'ascii');
  return h;
}
const preencher = (n) => Buffer.alloc((BLOCO - (n % BLOCO)) % BLOCO);

/** Registro pax "N path=...\n" (o N conta o próprio tamanho). */
function pax(caminho) {
  const corpo = ` path=${caminho}\n`;
  let n = Buffer.byteLength(corpo) + 1;
  while (String(n).length + Buffer.byteLength(corpo) !== n) n = String(n).length + Buffer.byteLength(corpo);
  return Buffer.from(n + corpo, 'utf8');
}

/** Monta o .tar.gz de `entradas` ([{ nome: 'node_modules/x/a.js', arquivo: '/caminho/real' }]), na ordem dada. */
export function escreverTarGz(entradas, destino) {
  const partes = [];
  const pastas = new Set();
  const addPasta = (d) => {
    if (!d || d === '.' || pastas.has(d)) return;
    addPasta(path.posix.dirname(d));
    pastas.add(d);
    partes.push(...registro(d + '/', 0, 0o755, '5'));
  };
  function registro(nome, tamanho, modo, tipo) {
    if (Buffer.byteLength(nome) <= 100) return [cabecalho({ nome, tamanho, modo, tipo })];
    const p = pax(nome);
    return [cabecalho({ nome: 'PaxHeader/' + nome.slice(-80), tamanho: p.length, modo: 0o644, tipo: 'x' }), p, preencher(p.length), cabecalho({ nome: nome.slice(-100), tamanho, modo, tipo })];
  }
  for (const e of entradas) {
    const nome = e.nome.split(path.sep).join('/');
    addPasta(path.posix.dirname(nome));
    const dados = fs.readFileSync(e.arquivo);
    const modo = fs.statSync(e.arquivo).mode & 0o111 ? 0o755 : 0o644;
    partes.push(...registro(nome, dados.length, modo, '0'), dados, preencher(dados.length));
  }
  partes.push(Buffer.alloc(BLOCO * 2));
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, zlib.gzipSync(Buffer.concat(partes), { level: 9 }));
  return destino;
}

const texto = (b, ini, tam) => { const s = b.subarray(ini, ini + tam); const z = s.indexOf(0); return (z >= 0 ? s.subarray(0, z) : s).toString('utf8'); };
const numero = (b, ini, tam) => parseInt(texto(b, ini, tam).trim() || '0', 8) || 0;

/** Extrai um .tar.gz em `destino`. Devolve o número de arquivos gravados. Lança se o arquivo estiver estragado. */
export function extrairTarGz(arquivo, destino) {
  const buf = zlib.gunzipSync(fs.readFileSync(arquivo));
  const raiz = path.resolve(destino);
  fs.mkdirSync(raiz, { recursive: true });
  let pos = 0, n = 0, proximoNome = null;
  while (pos + BLOCO <= buf.length) {
    const h = buf.subarray(pos, pos + BLOCO);
    if (h.every((b) => b === 0)) break;
    let soma = 0;
    for (let i = 0; i < BLOCO; i++) soma += i >= 148 && i < 156 ? 0x20 : h[i];
    if (soma !== numero(h, 148, 8)) throw new Error('arquivo de peças estragado (cabeçalho do tar não confere)');
    const tipo = String.fromCharCode(h[156] || 0x30);
    const tamanho = numero(h, 124, 12);
    const modo = numero(h, 100, 8);
    const prefixo = texto(h, 345, 155);
    let nome = (prefixo ? prefixo + '/' : '') + texto(h, 0, 100);
    const dados = buf.subarray(pos + BLOCO, pos + BLOCO + tamanho);
    if (dados.length < tamanho) throw new Error('arquivo de peças cortado no meio');
    pos += BLOCO + Math.ceil(tamanho / BLOCO) * BLOCO;
    if (tipo === 'x') { const m = /(?:^|\n)\d+ path=([^\n]*)\n/.exec(dados.toString('utf8')); if (m) proximoNome = m[1]; continue; }
    if (tipo === 'L') { proximoNome = dados.toString('utf8').replace(/\0+$/, ''); continue; }
    if (tipo === 'g') continue;
    if (proximoNome) { nome = proximoNome; proximoNome = null; }
    const alvo = path.resolve(raiz, nome);
    if (alvo !== raiz && !alvo.startsWith(raiz + path.sep)) throw new Error(`caminho fora da pasta no arquivo de peças: ${nome}`);
    if (tipo === '5') { fs.mkdirSync(alvo, { recursive: true }); continue; }
    if (tipo !== '0' && tipo !== '7') continue; // links e especiais: as peças não têm
    fs.mkdirSync(path.dirname(alvo), { recursive: true });
    fs.writeFileSync(alvo, dados, { mode: modo & 0o111 ? 0o755 : 0o644 });
    n++;
  }
  return n;
}
