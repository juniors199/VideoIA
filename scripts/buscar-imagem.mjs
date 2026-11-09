/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Busca foto ou logo real de licença livre, baixa para a pasta do projeto e registra autor, licença e endereço no fontes.md.
 *   node scripts/buscar-imagem.mjs <projeto> "<termo>" [--logo] [--fonte=commons|agenciabrasil|senado|camara|planalto]
 *        [--listar] [--escolha=N] [--largura=1280] [--nome=arquivo] [--carrossel]
 *  - foto: Wikimedia Commons (API de busca, só licenças livres: domínio público, CC0, CC BY, CC BY-SA). --fonte restringe
 *    às fotos das agências públicas publicadas no Commons (Agência Brasil, Agência Senado, Câmara, Planalto).
 *  - logo (--logo): Wikidata, propriedade P154 (logotipo) do item mais próximo do termo; o arquivo vem do Commons.
 *  - salva em projetos/<projeto>/assets/<nome>.<ext> (miniatura do Commons na largura pedida; SVG vira PNG) e acrescenta
 *    a linha da fonte em fontes.md, seção "## Imagens". O crédito vai na legenda do post, nunca na tela.
 * Educado com os servidores: um pedido por vez, intervalo mínimo entre pedidos, espera crescente em 429/503 (respeita
 * Retry-After) e um User-Agent genérico do estúdio, sem dado pessoal.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSAO = (() => { try { return fs.readFileSync(path.join(RAIZ, 'VERSAO'), 'utf8').trim(); } catch { return '0'; } })();
export const USER_AGENT = `IlustrandoStudio/${VERSAO} (buscar-imagem; ferramenta editorial local)`;
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const WIKIDATA = 'https://www.wikidata.org/w/api.php';
export const FONTES = {
  commons: '',
  agenciabrasil: 'insource:"Agência Brasil"',
  senado: 'insource:"Agência Senado"',
  camara: 'insource:"Câmara dos Deputados"',
  planalto: 'insource:"Palácio do Planalto"',
};

const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** cliente HTTP educado: serial, intervalo mínimo, backoff exponencial em 429/5xx e falha de rede */
export function clienteEducado({ fetch: f = globalThis.fetch, intervaloMs = 1100, tentativas = 5, esperaMs = 2000 } = {}) {
  let ultimo = 0;
  return async function pedir(url, { binario = false, headers = {} } = {}) {
    for (let i = 1; ; i++) {
      const falta = ultimo + intervaloMs - Date.now();
      if (falta > 0) await dormir(falta);
      ultimo = Date.now();
      let r, erroRede = null;
      try { r = await f(url, { headers: { 'user-agent': USER_AGENT, 'api-user-agent': USER_AGENT, accept: binario ? '*/*' : 'application/json', ...headers } }); }
      catch (e) { erroRede = e; }
      let apiErro = null;
      if (r?.ok) {
        if (binario) return Buffer.from(await r.arrayBuffer());
        const j = await r.json().catch(() => null);
        if (j && !j.error) return j;
        apiErro = j?.error || { code: 'resposta', info: 'resposta inválida' };
        // maxlag e ratelimited vêm com 200: o servidor pede para esperar
        if (!/maxlag|ratelimited/.test(apiErro.code) || i >= tentativas) throw new Error(`${new URL(url).host}: ${apiErro.info || apiErro.code}`);
        await dormir(esperaMs * 2 ** (i - 1));
        continue;
      }
      const repetir = erroRede || r.status === 429 || r.status >= 500;
      if (!repetir || i >= tentativas) throw new Error(erroRede ? `sem conexão com ${new URL(url).host} (${erroRede.cause?.code || erroRede.message})` : `${new URL(url).host} respondeu ${r.status}`);
      const ra = Number(r?.headers?.get?.('retry-after'));
      await dormir(Number.isFinite(ra) && ra > 0 ? Math.min(60, ra) * 1000 : esperaMs * 2 ** (i - 1));
    }
  };
}

export const limparHtml = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
export const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'imagem';

/** licença livre o bastante para usar num vídeo comercial com crédito (domínio público, CC0, CC BY, CC BY-SA) */
export function licencaLivre(meta = {}) {
  const curta = limparHtml(meta.LicenseShortName?.value), cod = String(meta.License?.value || '').toLowerCase();
  if (/\b(nc|nd)\b|non-?commercial|no ?deriv|fair use|copyrighted/i.test(curta + ' ' + cod)) return false;
  return /^(pd|cc0|cc-by(-sa)?(-\d|$)|cc-pd)/.test(cod) || /^(public domain|domínio público|cc0|cc[ -]by(-sa)?\b)/i.test(curta) || /^pd[- ]/i.test(curta);
}

/** resume a página do Commons num registro de fonte */
export function registroDe(pagina) {
  const ii = pagina.imageinfo?.[0] || {}, m = ii.extmetadata || {};
  return {
    titulo: String(pagina.title || '').replace(/^File:|^Arquivo:/, ''),
    autor: limparHtml(m.Artist?.value) || 'autor não informado',
    credito: limparHtml(m.Credit?.value),
    licenca: limparHtml(m.LicenseShortName?.value) || 'licença não informada',
    licencaUrl: m.LicenseUrl?.value || '',
    restricoes: limparHtml(m.Restrictions?.value),
    pagina: ii.descriptionurl || '',
    original: ii.thumburl && ii.url && ii.mime === (ii.thumbmime || ii.mime) ? ii.url : '', // arquivo original, se a miniatura não baixar
    larguraReal: ii.width, alturaReal: ii.height, // tamanho do ARQUIVO original (largura/altura abaixo são as da miniatura pedida)
    url: ii.thumburl || ii.url, mime: ii.thumbmime || ii.mime || '', largura: ii.thumbwidth || ii.width, altura: ii.thumbheight || ii.height,
    livre: licencaLivre(m),
  };
}

/** linha para o fontes.md */
export function linhaFonte(arquivo, r, { tipo = 'foto', data = new Date().toISOString().slice(0, 10) } = {}) {
  const lic = r.licencaUrl ? `${r.licenca} (${r.licencaUrl})` : r.licenca;
  const restr = r.restricoes ? ` Restrições: ${r.restricoes}.` : '';
  const marca = tipo === 'logo' ? ' Logo é marca registrada: use só para identificar o assunto, sem sugerir parceria.' : '';
  return `- ${arquivo}: ${tipo} "${r.titulo}", autor ${r.autor}, licença ${lic}, via Wikimedia Commons ${r.pagina}.${restr}${marca} Crédito para a legenda do post: "${tipo === 'logo' ? 'Logo' : 'Foto'}: ${r.autor} (${r.licenca})". Baixada em ${data} por scripts/buscar-imagem.mjs.`;
}

/** acrescenta a linha em fontes.md, na seção pedida ("## Imagens" por padrão; o b-roll usa "## Vídeos"). Cria o arquivo e a seção se faltar; não duplica o mesmo arquivo. */
export function registrarFonte(pastaProjeto, linha, arquivo, secao = 'Imagens') {
  const f = path.join(pastaProjeto, 'fontes.md');
  let t = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : `# Fontes: ${path.basename(pastaProjeto)}\n`;
  t = t.split('\n').filter((l) => !l.startsWith(`- ${arquivo}:`)).join('\n');
  const titulo = new RegExp(`^## ${secao}\\s*$`, 'm');
  if (!titulo.test(t)) t = t.replace(/\s*$/, `\n\n## ${secao}\n`);
  const i = t.search(titulo), fimSecao = t.slice(i + 1).search(/^## /m);
  const corte = fimSecao < 0 ? t.length : i + 1 + fimSecao;
  t = t.slice(0, corte).replace(/\s*$/, '\n') + linha + '\n' + (fimSecao < 0 ? '' : '\n' + t.slice(corte));
  fs.writeFileSync(f, t.replace(/\n{3,}/g, '\n\n'));
}

const paramsInfo = (largura) => ({ prop: 'imageinfo', iiprop: 'url|extmetadata|mime|size', iiurlwidth: String(largura), iiextmetadatafilter: 'LicenseShortName|License|LicenseUrl|Artist|Credit|Restrictions', iiextmetadatalanguage: 'pt' });
const urlApi = (base, p) => `${base}?${new URLSearchParams({ format: 'json', formatversion: '2', maxlag: '5', origin: '*', ...p })}`;

/** candidatos de foto no Commons, na ordem da busca */
export async function buscarFotos(pedir, termo, { fonte = 'commons', largura = 1280, limite = 12 } = {}) {
  if (!(fonte in FONTES)) throw new Error(`fonte "${fonte}" não existe. Use ${Object.keys(FONTES).join(', ')}.`);
  const q = `${termo} filetype:bitmap ${FONTES[fonte]}`.trim();
  const j = await pedir(urlApi(COMMONS, { action: 'query', generator: 'search', gsrsearch: q, gsrnamespace: '6', gsrlimit: String(limite), ...paramsInfo(largura) }));
  return (j.query?.pages || []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map(registroDe);
}

/** logo pelo Wikidata (P154) dos itens mais próximos do termo */
export async function buscarLogos(pedir, termo, { largura = 1000 } = {}) {
  const s = await pedir(urlApi(WIKIDATA, { action: 'wbsearchentities', search: termo, language: 'pt', uselang: 'pt', type: 'item', limit: '5' }));
  const ids = (s.search || []).map((x) => x.id);
  if (!ids.length) return [];
  const e = await pedir(urlApi(WIKIDATA, { action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels|descriptions', languages: 'pt|en' }));
  const arquivos = [];
  for (const id of ids) {
    const ent = e.entities?.[id]; const cl = ent?.claims?.P154 || [];
    const melhor = cl.find((c) => c.rank === 'preferred') || cl.filter((c) => c.rank !== 'deprecated').at(-1);
    const nome = melhor?.mainsnak?.datavalue?.value;
    if (nome) arquivos.push({ id, nome, rotulo: ent.labels?.pt?.value || ent.labels?.en?.value || id, desc: ent.descriptions?.pt?.value || '' });
  }
  if (!arquivos.length) return [];
  const j = await pedir(urlApi(COMMONS, { action: 'query', titles: arquivos.map((a) => `File:${a.nome}`).join('|'), ...paramsInfo(largura) }));
  const porTitulo = new Map((j.query?.pages || []).map((p) => [String(p.title).replace(/^File:/, '').replace(/_/g, ' '), p]));
  return arquivos.map((a) => { const p = porTitulo.get(a.nome.replace(/_/g, ' ')); return p ? { ...registroDe(p), item: `${a.rotulo} (${a.id}${a.desc ? ', ' + a.desc : ''})` } : null; }).filter(Boolean);
}

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/svg+xml': '.svg' };

export async function buscarImagem({ projeto, termo, logo = false, fonte = 'commons', listar = false, escolha = null, largura = logo ? 1000 : 1280, nome = null, carrossel = false, fetch: f } = {}) {
  if (!projeto || !termo) throw new Error('Uso: node scripts/buscar-imagem.mjs <projeto> "<termo>" [--logo] [--fonte=commons|agenciabrasil|senado|camara|planalto] [--listar] [--escolha=N] [--carrossel]');
  // --carrossel: vai direto para carrosseis/<nome> (um vídeo com o mesmo nome não rouba a foto do carrossel)
  const pasta = (carrossel ? [path.join(RAIZ, 'carrosseis', projeto)] : [path.join(RAIZ, 'projetos', projeto), path.join(RAIZ, 'carrosseis', projeto)]).find((p) => fs.existsSync(p));
  if (!pasta) throw new Error(carrossel ? `Não achei carrosseis/${projeto}. Crie a pasta do carrossel antes.` : `Não achei projetos/${projeto} (nem carrosseis/${projeto}). Crie o projeto antes.`);
  const pedir = clienteEducado({ fetch: f });
  const todos = logo ? await buscarLogos(pedir, termo, { largura }) : await buscarFotos(pedir, termo, { fonte, largura });
  const livres = todos.filter((r) => r.livre && r.url && EXT[r.mime]);
  if (listar) return { pasta, candidatos: livres, descartados: todos.length - livres.length };
  if (!livres.length) throw new Error(`Nada de licença livre para "${termo}"${logo ? ' (logo no Wikidata)' : ` (${fonte})`}. ${todos.length ? `${todos.length} resultado(s) descartado(s) pela licença.` : 'Tente outro termo.'} Não use imagem sem licença: peça o arquivo à pessoa ou use uma peça 3D.`);
  const r = livres[Math.max(0, Math.min(livres.length - 1, (escolha ?? 1) - 1))];
  const bin = await pedir(r.url, { binario: true });
  fs.mkdirSync(path.join(pasta, 'assets'), { recursive: true });
  const rel = `assets/${slug(nome || termo)}${logo ? '-logo' : ''}${EXT[r.mime]}`;
  fs.writeFileSync(path.join(pasta, rel), bin);
  registrarFonte(pasta, linhaFonte(rel, r, { tipo: logo ? 'logo' : 'foto' }), rel);
  return { pasta, arquivo: rel, registro: r, bytes: bin.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // atrás de um proxy (empresa, nuvem), o fetch do Node só usa HTTPS_PROXY com NODE_USE_ENV_PROXY=1
  if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
    const r = spawnSync(process.execPath, ['--no-warnings', ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1' } });
    process.exit(r.status ?? 1);
  }
  const args = process.argv.slice(2), pos = args.filter((a) => !a.startsWith('--'));
  const opc = (k) => (args.find((a) => a.startsWith(`--${k}=`)) || '').split('=').slice(1).join('=');
  try {
    const r = await buscarImagem({ projeto: pos[0], termo: pos.slice(1).join(' '), logo: args.includes('--logo'), fonte: opc('fonte') || 'commons', listar: args.includes('--listar'), escolha: opc('escolha') ? +opc('escolha') : null, largura: opc('largura') ? +opc('largura') : undefined, nome: opc('nome') || null, carrossel: args.includes('--carrossel') });
    if (r.candidatos) {
      r.candidatos.forEach((c, i) => console.log(`${i + 1}. ${c.titulo}${c.item ? ` [${c.item}]` : ''}\n   ${c.licenca}, ${c.autor}, arquivo ${c.larguraReal || c.largura}x${c.alturaReal || c.altura}${c.larguraReal && c.larguraReal !== c.largura ? ` (miniatura pedida ${c.largura}x${c.altura})` : ''}\n   ${c.pagina}`));
      console.log(`${r.candidatos.length} com licença livre${r.descartados ? `, ${r.descartados} descartado(s)` : ''}. Baixe com --escolha=N.`);
    } else {
      console.log(`• ${path.relative(RAIZ, path.join(r.pasta, r.arquivo))} (${Math.round(r.bytes / 1024)} KB, ${r.registro.largura}x${r.registro.altura})\n• ${r.registro.titulo}: ${r.registro.autor}, ${r.registro.licenca}\n• registrado em fontes.md (seção Imagens)\n• na cena: { "tipo": "imagem", "arquivo": "${r.arquivo}", "credito": ${JSON.stringify(`${r.registro.autor} (${r.registro.licenca})`)} }`);
      if (r.registro.restricoes) console.log(`• atenção, restrições: ${r.registro.restricoes}`);
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
