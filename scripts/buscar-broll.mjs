/*
 * 
 * 
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clienteEducado, licencaLivre, limparHtml, slug, registrarFonte, USER_AGENT } from './buscar-imagem.mjs';

/**
 * Busca b-roll em vídeo de licença livre, corta o trecho, tira o áudio e registra autor, licença e origem em fontes.md.
 *   node scripts/buscar-broll.mjs <projeto> "<termo>" [--fonte=commons|nasa|pexels|pixabay|todas] [--listar] [--escolha=N]
 *        [--trecho=INI-FIM] [--duracao=6] [--orientacao=vertical|horizontal|qualquer] [--nome=arquivo] [--aceitar-verificar] [--aceitar-sa]
 *  - Só fontes de licença livre, pela API oficial de cada uma. YouTube, Instagram e TikTok não são fonte de vídeo do estúdio:
 *    o material de lá costuma ser "todos os direitos reservados" e baixar contraria os termos dessas plataformas.
 *  - Commons e NASA não pedem chave. Pexels e Pixabay pedem PEXELS_API_KEY / PIXABAY_API_KEY no .env do estúdio; a chave
 *    nunca é impressa nem entra em mensagem de erro (as mensagens citam só o host).
 *  - Ranking: palavras do termo no título, tags e descrição; orientação, resolução e duração. Repetidos saem da lista
 *    (mesmo id, mesmo título em duas fontes, ou arquivo já usado neste projeto).
 *  - Salva projetos/<projeto>/assets/broll-<nome>.mp4 (H.264, sem áudio, no máximo 1080x1920), a ficha de origem
 *    assets/broll-<nome>.origem.json e a linha em fontes.md, seção "## Vídeos". O crédito vai na legenda do post.
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const FONTES_VIDEO = ['commons', 'nasa', 'pexels', 'pixabay'];
const CHAVES = { pexels: 'PEXELS_API_KEY', pixabay: 'PIXABAY_API_KEY' };
// hosts de onde o arquivo pode vir (redirecionamento para fora da lista é recusado antes do pedido)
export const HOSTS_ARQUIVO = ['upload.wikimedia.org', 'images-assets.nasa.gov', 'videos.pexels.com', 'player.vimeo.com', 'vod-progressive.akamaized.net', 'cdn.pixabay.com'];
// fontes que o estúdio nunca usa para vídeo, nem por URL
export const HOSTS_PROIBIDOS = /(^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com|instagram\.com|cdninstagram\.com|tiktok\.com|tiktokcdn\.com|fbcdn\.net|facebook\.com|x\.com|twitter\.com|twimg\.com|kwai\.com)$/i;
const MAX_BYTES = 400 * 1024 * 1024;

/** lê só as chaves de banco do .env do estúdio (sem imprimir nada); o ambiente do processo vence */
export function chavesDoEnv(raiz = RAIZ, env = process.env) {
  const out = {};
  const f = path.join(raiz, '.env');
  let linhas = [];
  try { linhas = fs.readFileSync(f, 'utf8').split('\n'); } catch { /* sem .env: só Commons e NASA */ }
  for (const [fonte, nome] of Object.entries(CHAVES)) {
    if (env[nome]) { out[fonte] = env[nome]; continue; }
    const l = linhas.map((x) => x.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).find((m) => m && m[1] === nome);
    const v = l ? l[2].replace(/^["']|["']$/g, '') : '';
    if (v) out[fonte] = v;
  }
  return out;
}

// palavras que não ajudam a achar o assunto
const VAZIAS = new Set('a o as os um uma de da do das dos e em no na nos nas para por com sem que the of and in on at to for with from by an is are'.split(' '));
export const tokens = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !VAZIAS.has(w));

/**
 * Nota de 0 a 1: quanto do termo aparece no texto do item (60%), orientação (15%), resolução (15%) e duração (10%).
 * Sem mágica: é a mesma ideia do "inspect" do get-brolls (fração das palavras pedidas que aparecem), aplicada aos metadados.
 */
export function pontuar(c, termo, { orientacao = 'vertical', duracao = 6 } = {}) {
  const quer = new Set(tokens(termo));
  const tem = new Set(tokens(`${c.titulo} ${c.tags || ''} ${c.descricao || ''}`));
  const texto = quer.size ? [...quer].filter((w) => tem.has(w)).length / quer.size : 0;
  const w = c.largura || 0, h = c.altura || 0;
  const vertical = h > w, horizontal = w > h;
  const ori = orientacao === 'qualquer' ? 1 : orientacao === 'vertical' ? (vertical ? 1 : h === w ? 0.6 : 0.3) : (horizontal ? 1 : 0.3);
  const menor = Math.min(w, h) || 0;
  const res = menor >= 1080 ? 1 : menor >= 720 ? 0.7 : menor >= 480 ? 0.35 : 0.1;
  const d = c.duracao || 0;
  const dur = !d ? 0.5 : d < duracao ? Math.max(0, d / duracao) * 0.8 : d <= 120 ? 1 : 0.6; // vídeo longo: achar o trecho dá trabalho
  return Math.round((0.6 * texto + 0.15 * ori + 0.15 * res + 0.1 * dur) * 1000) / 1000;
}

/** tira repetidos: mesmo fonte:id, ou o mesmo vídeo publicado em duas fontes (títulos quase iguais e duração parecida) */
export function deduplicar(lista) {
  const out = [];
  const jac = (a, b) => { const A = new Set(tokens(a)), B = new Set(tokens(b)); const i = [...A].filter((x) => B.has(x)).length; return i / Math.max(1, new Set([...A, ...B]).size); };
  for (const c of [...lista].sort((a, b) => b.nota - a.nota)) {
    const igual = out.find((o) => `${o.fonte}:${o.id}` === `${c.fonte}:${c.id}` || (jac(o.titulo, c.titulo) >= 0.8 && Math.abs((o.duracao || 0) - (c.duracao || 0)) <= 1.5));
    if (!igual) out.push(c);
  }
  return out;
}

/* ------------------------------ fontes ------------------------------ */

const urlApi = (base, p) => `${base}?${new URLSearchParams(p)}`;

/**
 * CC BY-SA (compartilha igual): o trecho editado dentro do Reel vira obra adaptada, e a adaptação teria de sair sob a mesma
 * licença. Para vídeo comercial o padrão é recusar; --aceitar-sa libera quando a pessoa decidir.
 */
export const compartilhaIgual = (m = {}) => /\bsa\b|share-?alike|compartilha/i.test(`${limparHtml(m.LicenseShortName?.value)} ${m.License?.value || ''}`);

/** Wikimedia Commons: vídeo (WebM/Ogg) com licença livre; prefere a versão transcodificada de até 1080p */
export async function buscarCommons(pedir, termo, { limite = 12 } = {}) {
  const j = await pedir(urlApi('https://commons.wikimedia.org/w/api.php', {
    action: 'query', format: 'json', formatversion: '2', maxlag: '5', origin: '*', generator: 'search', gsrsearch: `${termo} filetype:video`, gsrnamespace: '6', gsrlimit: String(limite),
    prop: 'imageinfo|videoinfo', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '640', iiextmetadatafilter: 'LicenseShortName|License|LicenseUrl|Artist|Credit|Restrictions|ImageDescription', iiextmetadatalanguage: 'pt', viprop: 'derivatives',
  }));
  return (j.query?.pages || []).sort((a, b) => (a.index ?? 0) - (b.index ?? 0)).map((p) => {
    const ii = p.imageinfo?.[0] || {}, m = ii.extmetadata || {}, der = p.videoinfo?.[0]?.derivatives || [];
    if (!String(ii.mime || '').startsWith('video/')) return null;
    // versão de até 1080 no lado menor, a maior que couber; sem ela, o original
    const ok = der.filter((d) => /webm|mp4/.test(d.type || '') && Math.min(d.width || 0, d.height || 0) <= 1080).sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const arq = ok[0] || { src: ii.url, width: ii.width, height: ii.height };
    return {
      fonte: 'commons', id: String(p.pageid), titulo: String(p.title || '').replace(/^File:|^Arquivo:/, ''), descricao: limparHtml(m.ImageDescription?.value).slice(0, 400),
      autor: limparHtml(m.Artist?.value) || 'autor não informado', licenca: limparHtml(m.LicenseShortName?.value) || 'licença não informada', licencaUrl: m.LicenseUrl?.value || '',
      restricoes: limparHtml(m.Restrictions?.value), pagina: ii.descriptionurl || '', arquivo: arq.src, largura: arq.width, altura: arq.height, duracao: ii.duration || null,
      miniatura: ii.thumburl || '', livre: licencaLivre(m), sa: compartilhaIgual(m), via: 'Wikimedia Commons',
    };
  }).filter(Boolean);
}

/**
 * NASA Image and Video Library. Material da NASA em geral não tem copyright nos EUA, mas não pode sugerir endosso da NASA,
 * logotipos e insígnias têm regra própria e há item de terceiros: crédito que não é da NASA vira "verificar".
 */
export async function buscarNasa(pedir, termo, { limite = 12 } = {}) {
  const j = await pedir(urlApi('https://images-api.nasa.gov/search', { q: termo, media_type: 'video', page_size: String(Math.min(limite, 50)) }));
  const out = [];
  for (const it of (j.collection?.items || []).slice(0, limite)) {
    const d = it.data?.[0] || {};
    if (!d.nasa_id || d.media_type !== 'video') continue;
    const credito = [d.secondary_creator, d.photographer].filter(Boolean).join(', ');
    // conservador: crédito que não cita a NASA, ou menção de copyright e de agência ou empresa, pede conferência humana
    const terceiro = (credito && !/nasa/i.test(credito)) || /©|copyright|courtesy|cortesia|getty|reuters|associated press|\bap photo|afp|spacex|boeing|blue origin|rocket lab|\besa\b|jaxa|roscosmos/i.test(`${credito} ${d.description || ''}`);
    let arquivos = [];
    try { arquivos = ((await pedir(`https://images-api.nasa.gov/asset/${encodeURIComponent(d.nasa_id)}`)).collection?.items || []).map((x) => x.href).filter((u) => /\.mp4$/i.test(u || '')); } catch { arquivos = []; }
    // versão grande primeiro; a original pode ter vários GB
    const ordem = (u) => (/~large\.mp4$/i.test(u) ? 0 : /~orig\.mp4$/i.test(u) ? 2 : /~medium\.mp4$/i.test(u) ? 1 : 3);
    const arq = arquivos.map((u) => u.replace(/^http:/, 'https:').replace(/ /g, '%20')).sort((a, b) => ordem(a) - ordem(b))[0];
    if (!arq) continue;
    out.push({
      fonte: 'nasa', id: d.nasa_id, titulo: d.title || d.nasa_id, descricao: limparHtml(d.description).slice(0, 400), tags: (d.keywords || []).join(' '),
      autor: credito ? `NASA (${credito})` : `NASA${d.center ? ' ' + d.center : ''}`, licenca: 'NASA, sem copyright nos EUA (diretrizes de uso de mídia da NASA)', licencaUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/',
      restricoes: 'Não sugerir endosso da NASA; logotipo e insígnias da NASA têm regra própria; pessoas identificáveis exigem cuidado.' + (terceiro ? ' Crédito ou menção de terceiro na ficha: confira a página antes de usar.' : ''),
      pagina: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}`, arquivo: arq, largura: null, altura: null, duracao: null, livre: !terceiro, verificar: terceiro, via: 'NASA Image and Video Library',
    });
  }
  return out;
}

/** Pexels (chave própria): licença Pexels, crédito não obrigatório, mas a API pede link para o Pexels e crédito ao autor */
export async function buscarPexels(pedir, termo, { chave, limite = 12, orientacao = 'vertical' } = {}) {
  if (!chave) throw new Error('Pexels precisa de PEXELS_API_KEY no .env do estúdio (grátis em pexels.com/api). Sem ela, use --fonte=commons ou --fonte=nasa.');
  const p = { query: termo, per_page: String(Math.min(limite, 40)) };
  if (orientacao !== 'qualquer') p.orientation = orientacao === 'vertical' ? 'portrait' : 'landscape';
  const j = await pedir(urlApi('https://api.pexels.com/videos/search', p), { headers: { authorization: chave } });
  return (j.videos || []).map((v) => {
    const fs_ = (v.video_files || []).filter((f) => f.file_type === 'video/mp4' && f.link && Math.min(f.width || 0, f.height || 0) <= 1080).sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const f = fs_[0];
    if (!f) return null;
    return {
      fonte: 'pexels', id: String(v.id), titulo: (String(v.url || '').match(/video\/([^/]+?)-?\d*\/?$/)?.[1] || `Pexels ${v.id}`).replace(/-/g, ' '), autor: v.user?.name || 'autor não informado', autorUrl: v.user?.url || '',
      licenca: 'Licença Pexels', licencaUrl: 'https://www.pexels.com/license/', restricoes: 'Não revender o arquivo sem alteração; pessoas e marcas identificáveis sem sugerir endosso nem em contexto ofensivo.',
      pagina: v.url || '', arquivo: f.link, largura: f.width, altura: f.height, duracao: v.duration || null, miniatura: v.image || '', livre: true, via: 'Pexels',
    };
  }).filter(Boolean);
}

/** Pixabay (chave própria): Pixabay Content License; a API pede mostrar a origem dos resultados e guardar as respostas por 24 h */
export async function buscarPixabay(pedir, termo, { chave, limite = 12 } = {}) {
  if (!chave) throw new Error('Pixabay precisa de PIXABAY_API_KEY no .env do estúdio (grátis em pixabay.com/api/docs). Sem ela, use --fonte=commons ou --fonte=nasa.');
  const j = await pedir(urlApi('https://pixabay.com/api/videos/', { key: chave, q: termo, per_page: String(Math.max(3, Math.min(limite, 50))), safesearch: 'true' }));
  return (j.hits || []).map((h) => {
    const v = ['large', 'medium', 'small'].map((k) => h.videos?.[k]).find((x) => x?.url && Math.min(x.width || 0, x.height || 0) <= 1080 && x.width > 0);
    if (!v) return null;
    return {
      fonte: 'pixabay', id: String(h.id), titulo: h.tags || `Pixabay ${h.id}`, tags: h.tags || '', autor: h.user || 'autor não informado', licenca: 'Pixabay Content License', licencaUrl: 'https://pixabay.com/service/license-summary/',
      restricoes: 'Não redistribuir o arquivo sem alteração; pessoas, marcas e obras identificáveis podem ter direitos próprios.', pagina: h.pageURL || '', arquivo: v.url, largura: v.width, altura: v.height, duracao: h.duration || null,
      miniatura: v.thumbnail || '', livre: true, via: 'Pixabay',
    };
  }).filter(Boolean);
}

/* ------------------------------ download e corte ------------------------------ */

/** confere que o endereço do arquivo é HTTPS, de um host conhecido e nunca de rede social */
export function urlPermitida(u) {
  let x; try { x = new URL(u); } catch { return false; }
  if (x.protocol !== 'https:' || x.username || x.password) return false;
  if (HOSTS_PROIBIDOS.test(x.hostname)) return false;
  return HOSTS_ARQUIVO.includes(x.hostname.toLowerCase());
}

/** baixa o arquivo com teto de tamanho, seguindo no máximo 3 redirecionamentos e só para hosts da lista */
export async function baixar(url, destino, { fetch: f = globalThis.fetch, maxBytes = MAX_BYTES } = {}) {
  let atual = url;
  for (let salto = 0; salto <= 3; salto++) {
    if (!urlPermitida(atual)) throw new Error(`endereço de arquivo recusado (${(() => { try { return new URL(atual).hostname; } catch { return 'inválido'; } })()}): só HTTPS de Commons, NASA, Pexels ou Pixabay`);
    const r = await f(atual, { redirect: 'manual', headers: { 'user-agent': USER_AGENT, accept: 'video/*,*/*' } });
    if (r.status >= 300 && r.status < 400 && r.headers?.get?.('location')) { atual = new URL(r.headers.get('location'), atual).href; continue; }
    if (!r.ok) throw new Error(`${new URL(atual).host} respondeu ${r.status}`);
    const tam = Number(r.headers?.get?.('content-length') || 0);
    if (tam > maxBytes) throw new Error(`arquivo de ${Math.round(tam / 2 ** 20)} MB passa do teto de ${Math.round(maxBytes / 2 ** 20)} MB; escolha outro ou um trecho de outra versão`);
    fs.mkdirSync(path.dirname(destino), { recursive: true });
    const h = crypto.createHash('sha256');
    const out = fs.createWriteStream(destino);
    let n = 0;
    try {
      for await (const parte of r.body) {
        n += parte.length;
        if (n > maxBytes) throw new Error(`arquivo passou do teto de ${Math.round(maxBytes / 2 ** 20)} MB`);
        h.update(parte); if (!out.write(parte)) await new Promise((ok) => out.once('drain', ok));
      }
    } catch (e) { out.destroy(); fs.rmSync(destino, { force: true }); throw e; }
    await new Promise((ok, erro) => out.end((e) => (e ? erro(e) : ok())));
    return { bytes: n, sha256: h.digest('hex') };
  }
  throw new Error('redirecionamentos demais');
}

export const sha256Arquivo = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');

/** dados do vídeo pelo ffprobe (duração, largura, altura) */
export function sondar(arq) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', arq], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffprobe não leu o vídeo (${(r.stderr || '').trim().slice(0, 160)})`);
  const j = JSON.parse(r.stdout || '{}');
  return { largura: j.streams?.[0]?.width || 0, altura: j.streams?.[0]?.height || 0, duracao: Number(j.format?.duration) || 0 };
}

/** "2-7" ou "1.5-6" vira [2, 7] */
export function lerTrecho(s) {
  if (!s) return null;
  const m = String(s).replace(',', '.').match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
  if (!m || +m[2] <= +m[1]) throw new Error(`--trecho "${s}" inválido: use INI-FIM em segundos, por exemplo --trecho=2-7`);
  if (+m[2] - +m[1] > 20) throw new Error('trecho de no máximo 20 s: b-roll é inserto curto');
  return [+m[1], +m[2]];
}

/** corta o trecho, tira o áudio (o som do b-roll costuma trazer música de terceiros) e normaliza para H.264 de até 1080x1920 */
export function cortar(origem, destino, [ini, fim]) {
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  const vf = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))',scale=trunc(iw/2)*2:trunc(ih/2)*2,fps=30";
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(ini), '-i', origem, '-t', String(fim - ini), '-an', '-vf', vf, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg não cortou o vídeo (${(r.stderr || '').trim().slice(0, 200)})`);
  return sondar(destino);
}

/* ------------------------------ registro ------------------------------ */

export function creditoDe(c) {
  if (c.fonte === 'nasa') return 'Vídeo: NASA';
  if (c.fonte === 'pexels') return `Vídeo: ${c.autor} no Pexels`;
  if (c.fonte === 'pixabay') return `Vídeo: ${c.autor} no Pixabay`;
  return `Vídeo: ${c.autor} (${c.licenca}), Wikimedia Commons`;
}

/** linha para o fontes.md, seção "## Vídeos" */
export function linhaFonteVideo(rel, c, ficha, data = new Date().toISOString().slice(0, 10)) {
  const lic = c.licencaUrl ? `${c.licenca} (${c.licencaUrl})` : c.licenca;
  const restr = c.restricoes ? ` Restrições: ${c.restricoes}` : '';
  const pend = c.verificar ? ' PENDENTE: confira na página se o vídeo é da NASA e não de terceiro.' : '';
  const sa = c.sa ? ' Licença compartilha igual: o Reel que usa este trecho fica sujeito à mesma licença; decisão registrada com --aceitar-sa.' : '';
  return `- ${rel}: vídeo "${c.titulo}", autor ${c.autor}, licença ${lic}, via ${c.via} ${c.pagina}. Trecho ${ficha.trecho[0]} a ${ficha.trecho[1]} s do original (sha256 ${ficha.original.sha256.slice(0, 16)}), sem áudio.${restr}${sa}${pend} Crédito para a legenda do post: "${creditoDe(c)}". Baixado em ${data} por scripts/buscar-broll.mjs.`;
}

/** páginas de origem já registradas no fontes.md do projeto (para não usar o mesmo vídeo duas vezes sem querer) */
export function jaUsados(pasta) {
  const f = path.join(pasta, 'fontes.md');
  if (!fs.existsSync(f)) return new Set();
  return new Set([...fs.readFileSync(f, 'utf8').matchAll(/https:\/\/\S+?(?=[\s,)]|\.\s|$)/g)].map((m) => m[0]));
}

/* ------------------------------ fluxo ------------------------------ */

export async function buscarCandidatos(pedir, termo, { fonte = 'todas', chaves = {}, limite = 12, orientacao = 'vertical', duracao = 6, avisos = [] } = {}) {
  const fontes = fonte === 'todas' ? FONTES_VIDEO.filter((x) => !CHAVES[x] || chaves[x]) : [fonte];
  if (!fontes.every((x) => FONTES_VIDEO.includes(x))) throw new Error(`fonte "${fonte}" não existe. Use ${FONTES_VIDEO.join(', ')} ou todas. YouTube, Instagram e TikTok não são fonte de vídeo do estúdio.`);
  if (fonte === 'todas') for (const x of FONTES_VIDEO) if (CHAVES[x] && !chaves[x]) avisos.push(`${x} fora da busca: falta ${CHAVES[x]} no .env`);
  const todos = [];
  for (const x of fontes) {
    try {
      const fn = { commons: buscarCommons, nasa: buscarNasa, pexels: buscarPexels, pixabay: buscarPixabay }[x];
      todos.push(...await fn(pedir, termo, { chave: chaves[x], limite, orientacao }));
    } catch (e) { if (fonte !== 'todas') throw e; avisos.push(`${x}: ${e.message}`); }
  }
  for (const c of todos) c.nota = pontuar(c, termo, { orientacao, duracao });
  return deduplicar(todos);
}

export async function buscarBroll({ projeto, termo, fonte = 'todas', listar = false, escolha = null, trecho = null, duracao = 6, orientacao = 'vertical', nome = null, aceitarVerificar = false, aceitarSa = false, fetch: f, raiz = RAIZ, env = process.env } = {}) {
  if (!projeto || !termo) throw new Error('Uso: node scripts/buscar-broll.mjs <projeto> "<termo>" [--fonte=commons|nasa|pexels|pixabay|todas] [--listar] [--escolha=N] [--trecho=INI-FIM]');
  if (/^https?:\/\//i.test(termo)) throw new Error('Passe um termo de busca, não um link. O estúdio não baixa vídeo por URL (YouTube, Instagram e TikTok ficam de fora).');
  const pasta = path.join(raiz, 'projetos', projeto);
  if (!fs.existsSync(pasta)) throw new Error(`Não achei projetos/${projeto}. Crie o projeto antes.`);
  const chaves = chavesDoEnv(raiz, env);
  const pedir = clienteEducado({ fetch: f });
  const avisos = [];
  const todos = await buscarCandidatos(pedir, termo, { fonte, chaves, orientacao, duracao, avisos });
  const usados = jaUsados(pasta);
  const livres = todos.filter((c) => (c.livre || (aceitarVerificar && c.verificar)) && (!c.sa || aceitarSa) && c.arquivo && urlPermitida(c.arquivo)).map((c) => ({ ...c, usado: usados.has(c.pagina) }));
  const descartados = todos.length - livres.length;
  if (listar) return { pasta, candidatos: livres, descartados, avisos };
  if (!livres.length) throw new Error(`Nada de licença livre para "${termo}". ${descartados ? `${descartados} resultado(s) descartado(s) pela licença (CC BY-SA só com --aceitar-sa) ou por precisar de conferência (--aceitar-verificar registra como PENDENTE).` : 'Tente outro termo, de preferência em inglês.'} Não use vídeo sem licença: peça o arquivo à pessoa ou resolva a cena com peça 3D.`);
  const disponiveis = escolha ? livres : livres.filter((c) => !c.usado);
  if (!disponiveis.length) throw new Error('Todos os candidatos já estão em fontes.md deste projeto. Use --escolha=N para repetir de propósito.');
  const c = disponiveis[Math.max(0, Math.min(disponiveis.length - 1, (escolha ?? 1) - 1))];

  // original no cache do projeto (fora de assets/: não vai para o vídeo nem para o pacote)
  const ext = (new URL(c.arquivo).pathname.match(/\.(mp4|webm|ogv|mov)$/i)?.[1] || 'mp4').toLowerCase();
  const orig = path.join(pasta, 'cache', 'broll-originais', `${c.fonte}-${slug(c.id)}.${ext}`);
  let original;
  if (fs.existsSync(orig)) original = { bytes: fs.statSync(orig).size, sha256: sha256Arquivo(orig) };
  else original = await baixar(c.arquivo, orig, { fetch: f });
  const info = sondar(orig);
  const t = trecho || [0, Math.min(duracao, info.duracao || duracao)];
  if (info.duracao && t[1] > info.duracao + 0.05) throw new Error(`o trecho ${t[0]}-${t[1]} s passa da duração do vídeo (${info.duracao.toFixed(1)} s)`);
  const base = `broll-${slug(nome || termo)}`;
  const rel = `assets/${base}.mp4`;
  const destino = path.join(pasta, rel);
  const final = cortar(orig, destino, t);
  const ficha = {
    arquivo: rel, sha256: sha256Arquivo(destino), largura: final.largura, altura: final.altura, duracao: Math.round(final.duracao * 100) / 100, audio: false,
    trecho: t, original: { url: c.arquivo, sha256: original.sha256, bytes: original.bytes, largura: info.largura, altura: info.altura, duracao: info.duracao },
    fonte: c.fonte, via: c.via, id: c.id, titulo: c.titulo, autor: c.autor, licenca: c.licenca, licencaUrl: c.licencaUrl, restricoes: c.restricoes || '', pagina: c.pagina,
    credito: creditoDe(c), pendente: !!c.verificar, termo, nota: c.nota, baixadoEm: new Date().toISOString(), ferramenta: 'scripts/buscar-broll.mjs',
  };
  // mesmo arquivo final que outro b-roll do projeto: avisa (não duplica o registro)
  const outro = fs.readdirSync(path.join(pasta, 'assets')).filter((x) => x.endsWith('.origem.json') && x !== `${base}.origem.json`).map((x) => { try { return JSON.parse(fs.readFileSync(path.join(pasta, 'assets', x), 'utf8')); } catch { return null; } }).find((o) => o?.sha256 === ficha.sha256 || (o?.original?.sha256 === ficha.original.sha256 && String(o?.trecho) === String(t)));
  if (outro) avisos.push(`mesmo vídeo e trecho de ${outro.arquivo}; use aquele arquivo na cena`);
  fs.writeFileSync(path.join(pasta, 'assets', `${base}.origem.json`), JSON.stringify(ficha, null, 1) + '\n');
  registrarFonte(pasta, linhaFonteVideo(rel, c, ficha), rel, 'Vídeos');
  const menor = Math.min(final.largura, final.altura);
  if (menor < 1080) avisos.push(`resolução ${final.largura}x${final.altura}: como fundo de tela cheia vai ser ampliado; prefira card (modo "card") ou outra fonte`);
  return { pasta, arquivo: rel, ficha, candidato: c, avisos };
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
    const r = await buscarBroll({
      projeto: pos[0], termo: pos.slice(1).join(' '), fonte: opc('fonte') || 'todas', listar: args.includes('--listar'), escolha: opc('escolha') ? +opc('escolha') : null,
      trecho: lerTrecho(opc('trecho')), duracao: opc('duracao') ? +opc('duracao') : 6, orientacao: opc('orientacao') || 'vertical', nome: opc('nome') || null, aceitarVerificar: args.includes('--aceitar-verificar'), aceitarSa: args.includes('--aceitar-sa'),
    });
    if (r.candidatos) {
      r.candidatos.forEach((c, i) => console.log(`${i + 1}. [${c.nota.toFixed(2)}] ${c.titulo}${c.usado ? ' (já usado neste projeto)' : ''}${c.verificar ? ' (conferir crédito)' : ''}\n   ${c.via}, ${c.licenca}, ${c.autor}${c.largura ? `, ${c.largura}x${c.altura}` : ''}${c.duracao ? `, ${Math.round(c.duracao)} s` : ''}\n   ${c.pagina}`));
      console.log(`${r.candidatos.length} com licença livre${r.descartados ? `, ${r.descartados} descartado(s)` : ''}. Baixe com --escolha=N [--trecho=INI-FIM].`);
    } else {
      const fi = r.ficha;
      console.log(`• ${path.relative(RAIZ, path.join(r.pasta, r.arquivo))} (${fi.largura}x${fi.altura}, ${fi.duracao} s, sem áudio)\n• ${fi.titulo}: ${fi.autor}, ${fi.licenca}\n• ficha de origem: ${fi.arquivo.replace(/\.mp4$/, '.origem.json')}\n• registrado em fontes.md (seção Vídeos)\n• na cena: { "tipo": "video", "arquivo": "${r.arquivo}", "modo": "fundo", "credito": ${JSON.stringify(fi.credito)} }`);
    }
    for (const a of r.avisos || []) console.log(`• atenção: ${a}`);
  } catch (e) { console.error(e.message); process.exit(1); }
}
