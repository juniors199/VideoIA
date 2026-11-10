/* Estudio de videos — upload de imagens de referência do projeto. */
import fs from "node:fs";
import path from "node:path";
import { NOME } from "./comum.mjs";

const PEDIDO = "PEDIDO-DO-ESTUDIO.md";
const MAX_BYTES = 15e6;
const MAX_POR_PROJETO = 12;
const EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function pastaRefs(raiz, nome) {
  return path.join(raiz, "projetos", nome, "assets", "referencias");
}

function listar(raiz, nome) {
  const dir = pastaRefs(raiz, nome);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((m) => EXT.has(path.extname(m).toLowerCase()))
    .sort()
    .map((m) => ({ arquivo: m, caminho: `assets/referencias/${m}` }));
}

function tipoPorCabecalho(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8) return ".jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return ".png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return ".gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return ".webp";
  return null;
}

function nomeSeguro(original, extFinal) {
  const base = path
    .basename(String(original || "referencia"), path.extname(String(original || "")))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "referencia";
  const ext = extFinal === ".jpeg" ? ".jpg" : extFinal;
  return `${base}${ext}`;
}

function nomeLivre(dir, desejado) {
  const ext = path.extname(desejado);
  const stem = path.basename(desejado, ext);
  if (!fs.existsSync(path.join(dir, desejado))) return desejado;
  for (let i = 2; i < 1000; i++) {
    const n = `${stem}-${i}${ext}`;
    if (!fs.existsSync(path.join(dir, n))) return n;
  }
  return `${stem}-${Date.now()}${ext}`;
}

function textoBlocoPedido(nome, arquivos) {
  const lista = arquivos.map((a) => `- \`${a}\``).join("\n");
  return `

## Imagens de referência
A pessoa anexou fotos em \`projetos/${nome}/assets/referencias/\`. Leia cada arquivo com Read e o índice \`projetos/${nome}/referencias.md\`. Na skill \`cena\`, encaixe cada foto no beat em que a fala combina com o que a imagem mostra (\`{"tipo":"imagem","arquivo":"assets/referencias/<arquivo>"}\`). Cada imagem entra **uma vez** no vídeo, salvo se a fala pedir de novo o mesmo assunto de forma clara. Não invente o que a foto não mostra. Crédito: "fornecida pela página" em \`fontes.md\`. Essas fotos já foram escolhidas pela pessoa: não peça aprovação de novo.
${lista}
`;
}

function atualizarPedido(raiz, nome, arquivo) {
  const arq = path.join(raiz, "projetos", nome, PEDIDO);
  let texto = fs.existsSync(arq) ? fs.readFileSync(arq, "utf8") : "";
  const marca = "`" + arquivo + "`";
  if (/## Imagens de referência/.test(texto)) {
    if (texto.includes(`- ${marca}`)) return;
    texto = `${texto.trimEnd()}\n- ${marca}\n`;
  } else {
    texto = `${texto.trimEnd()}${textoBlocoPedido(nome, [arquivo])}\n`;
  }
  fs.writeFileSync(arq, texto);
}

function atualizarIndice(raiz, nome, arquivo) {
  const arq = path.join(raiz, "projetos", nome, "referencias.md");
  let texto = fs.existsSync(arq) ? fs.readFileSync(arq, "utf8") : "# Imagens de referência\n\nFotos fornecidas pela pessoa para a IA encaixar no roteiro. Cada uma entra no máximo uma vez, salvo se a fala pedir de novo.\n";
  const linha = `- \`${arquivo}\` — fornecida pela página; encaixar uma vez no beat certo (\`assets/referencias/${arquivo}\`).`;
  if (!texto.includes("`" + arquivo + "`")) {
    texto = `${texto.trimEnd()}\n${linha}\n`;
    fs.writeFileSync(arq, texto);
  }
}

async function receberReferencia(ctx, req, res) {
  const { raiz, json } = ctx;
  const nome = String(req.headers["x-projeto"] || "").trim();
  if (!NOME.test(nome)) {
    return json(res, { erro: { causa: "Projeto inválido.", acao: "Abra o vídeo de novo e tente outra vez." } }, 400);
  }
  const pastaProj = path.join(raiz, "projetos", nome);
  if (!fs.existsSync(pastaProj) || !fs.statSync(pastaProj).isDirectory()) {
    return json(res, { erro: { causa: "Não achei esse vídeo.", acao: "Crie o vídeo primeiro e depois anexe a foto." } }, 404);
  }
  const dir = pastaRefs(raiz, nome);
  fs.mkdirSync(dir, { recursive: true });
  if (listar(raiz, nome).length >= MAX_POR_PROJETO) {
    return json(res, { erro: { causa: `Já tem ${MAX_POR_PROJETO} imagens de referência neste vídeo.`, acao: "Tire uma da pasta assets/referencias se quiser trocar." } }, 400);
  }
  const tmp = path.join(dir, `.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  let bytes = 0;
  let estourou = false;
  const stream = fs.createWriteStream(tmp);
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BYTES) {
      estourou = true;
      break;
    }
    stream.write(chunk);
  }
  await new Promise((r) => stream.end(r));
  if (estourou) {
    fs.rmSync(tmp, { force: true });
    return json(res, { erro: { causa: "Imagem grande demais (máximo 15 MB).", acao: "Mande uma foto menor ou em JPG." } }, 400);
  }
  const cab = Buffer.alloc(16);
  const fd = fs.openSync(tmp, "r");
  fs.readSync(fd, cab, 0, 16, 0);
  fs.closeSync(fd);
  const ext = tipoPorCabecalho(cab);
  if (!ext) {
    fs.rmSync(tmp, { force: true });
    return json(res, { erro: { causa: "Esse arquivo não é uma imagem JPG, PNG, WEBP ou GIF.", acao: "Escolha uma foto nesses formatos." } }, 400);
  }
  const final = nomeLivre(dir, nomeSeguro(req.headers["x-nome"], ext));
  fs.renameSync(tmp, path.join(dir, final));
  atualizarIndice(raiz, nome, final);
  atualizarPedido(raiz, nome, final);
  return json(res, {
    ok: true,
    arquivo: final,
    caminho: `assets/referencias/${final}`,
    mb: +(bytes / 1e6).toFixed(2),
    referencias: listar(raiz, nome),
  });
}

function servirReferencia(ctx, { req, res, m }) {
  const nome = m[1];
  const arquivo = path.basename(String(m[2] || ""));
  if (!NOME.test(nome) || !EXT.has(path.extname(arquivo).toLowerCase())) {
    res.writeHead(404);
    return res.end("não achei");
  }
  const alvo = ctx.dentro(pastaRefs(ctx.raiz, nome), arquivo);
  return ctx.arquivo(req, res, alvo);
}

export { listar as listarReferencias, receberReferencia, servirReferencia };
