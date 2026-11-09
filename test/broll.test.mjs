/*
 * 
 * 
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  tokens, pontuar, deduplicar, urlPermitida, chavesDoEnv, lerTrecho, buscarCommons, buscarNasa, buscarPexels, buscarPixabay,
  linhaFonteVideo, creditoDe, buscarBroll, compartilhaIgual, baixar,
} from '../scripts/buscar-broll.mjs';
import { clienteEducado } from '../scripts/buscar-imagem.mjs';
import { embutirVideos, EXTRAS, FPS_QUADROS } from '../src/video/broll.mjs';
import { validarCena } from '../src/video/validar.mjs';
import { abrir } from '../src/video/render.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tmp = fs.mkdtempSync(path.join(RAIZ, '.teste-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

/** vídeo de teste com contador de quadros (cada quadro é diferente) e uma faixa de áudio, para provar que o corte tira o som */
function videoTeste(arq, { s = '640x360', d = 4 } = {}) {
  fs.mkdirSync(path.dirname(arq), { recursive: true });
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `testsrc=size=${s}:rate=30:duration=${d}`, '-f', 'lavfi', '-i', `sine=f=330:d=${d}`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest', arq], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return arq;
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
const semEspera = (f) => clienteEducado({ fetch: f, intervaloMs: 0, esperaMs: 1, tentativas: 2 });
const paginaCommons = (pageid, title, lic, cod, extra = {}) => ({
  pageid, title, index: pageid,
  imageinfo: [{ mime: 'video/webm', url: `https://upload.wikimedia.org/wikipedia/commons/x/${pageid}.webm`, width: 1920, height: 1080, duration: 20, descriptionurl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`, extmetadata: { LicenseShortName: { value: lic }, License: { value: cod }, Artist: { value: '<a href="x">Fulana</a>' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by/4.0' } } }],
  videoinfo: [{ derivatives: [{ src: `https://upload.wikimedia.org/wikipedia/commons/transcoded/x/${pageid}.webm.1080p.vp9.webm`, type: 'video/webm; codecs="vp9"', width: 1920, height: 1080 }, { src: `https://upload.wikimedia.org/wikipedia/commons/transcoded/x/${pageid}.webm.2160p.vp9.webm`, type: 'video/webm', width: 3840, height: 2160 }] }],
  ...extra,
});

test('b-roll: ranking pelas palavras do termo, orientação, resolução e duração', () => {
  assert.deepEqual(tokens('O lançamento do Foguete, em 2024!'), ['lancamento', 'foguete', '2024']);
  const base = { largura: 1080, altura: 1920, duracao: 20 };
  const tudo = pontuar({ ...base, titulo: 'water rocket liftoff' }, 'water rocket liftoff');
  const meio = pontuar({ ...base, titulo: 'rocket on a table' }, 'water rocket liftoff');
  assert.ok(tudo > meio, `todas as palavras (${tudo}) acima de uma só (${meio})`);
  const deitado = pontuar({ ...base, largura: 1920, altura: 1080, titulo: 'water rocket liftoff' }, 'water rocket liftoff', { orientacao: 'vertical' });
  assert.ok(tudo > deitado, 'vertical ganha do horizontal quando o vídeo é 9:16');
  const baixa = pontuar({ ...base, largura: 360, altura: 640, titulo: 'water rocket liftoff' }, 'water rocket liftoff');
  assert.ok(tudo > baixa, 'resolução conta');
  assert.ok(tudo <= 1 && baixa >= 0);
});

test('b-roll: tira repetidos (mesmo id e o mesmo vídeo publicado em duas fontes)', () => {
  const l = deduplicar([
    { fonte: 'commons', id: '1', titulo: 'NASA SpaceX Crew-4 Isolated Launch Views', duracao: 476, nota: 0.8 },
    { fonte: 'commons', id: '1', titulo: 'NASA SpaceX Crew-4 Isolated Launch Views', duracao: 476, nota: 0.8 },
    { fonte: 'nasa', id: 'crew4', titulo: 'NASA’s SpaceX Crew-4 Isolated Launch Views', duracao: 475.6, nota: 0.7 },
    { fonte: 'nasa', id: 'outro', titulo: 'Artemis I rollout', duracao: 60, nota: 0.6 },
  ]);
  assert.deepEqual(l.map((c) => `${c.fonte}:${c.id}`), ['commons:1', 'nasa:outro']);
});

test('b-roll: só HTTPS de host conhecido; YouTube, Instagram e TikTok nunca', () => {
  assert.ok(urlPermitida('https://upload.wikimedia.org/a.webm'));
  assert.ok(urlPermitida('https://images-assets.nasa.gov/video/x/x~large.mp4'));
  for (const u of ['http://upload.wikimedia.org/a.webm', 'https://www.youtube.com/watch?v=abc', 'https://youtu.be/abc', 'https://www.instagram.com/reel/x/', 'https://v16-webapp.tiktokcdn.com/x.mp4', 'https://evil.example/upload.wikimedia.org.mp4', 'https://user:senha@upload.wikimedia.org/a.webm', 'nada']) assert.equal(urlPermitida(u), false, u);
});

test('b-roll: Commons só com licença livre, versão de até 1080p e CC BY-SA marcada', async () => {
  const f = async () => json({ query: { pages: [paginaCommons(1, 'File:A.webm', 'Public domain', 'pd'), paginaCommons(2, 'File:B.webm', 'CC BY-SA 4.0', 'cc-by-sa-4.0'), paginaCommons(3, 'File:C.webm', 'CC BY-NC 4.0', 'cc-by-nc-4.0')] } });
  const r = await buscarCommons(semEspera(f), 'teste');
  assert.equal(r.length, 3);
  assert.equal(r[0].livre, true); assert.equal(r[0].sa, false);
  assert.match(r[0].arquivo, /1080p/, 'escolhe a versão de 1080p, não a de 4K');
  assert.equal(r[0].autor, 'Fulana', 'autor sem HTML');
  assert.equal(r[1].livre, true); assert.equal(r[1].sa, true, 'compartilha igual detectado');
  assert.equal(r[2].livre, false, 'não comercial fica de fora');
  assert.equal(compartilhaIgual({ LicenseShortName: { value: 'CC BY 4.0' } }), false);
});

test('b-roll: NASA com crédito de terceiro pede conferência; Pexels e Pixabay exigem chave e nunca mostram a chave', async () => {
  const f = async (url) => (url.includes('/asset/')
    ? json({ collection: { items: [{ href: 'http://images-assets.nasa.gov/video/a/a~orig.mp4' }, { href: 'http://images-assets.nasa.gov/video/a/a~large.mp4' }] } })
    : json({ collection: { items: [
      { data: [{ nasa_id: 'a', media_type: 'video', title: 'Launch', center: 'KSC' }] },
      { data: [{ nasa_id: 'b', media_type: 'video', title: 'Rocket Lab launch', secondary_creator: 'Rocket Lab' }] },
      { data: [{ nasa_id: 'c', media_type: 'video', title: 'Artemis', secondary_creator: 'NASA/Joel Kowsky' }] },
    ] } }));
  const r = await buscarNasa(semEspera(f), 'launch');
  assert.equal(r.length, 3);
  assert.match(r[0].arquivo, /^https:\/\/.*~large\.mp4$/, 'versão grande em HTTPS antes da original');
  assert.equal(r[0].livre, true);
  assert.equal(r[1].livre, false); assert.equal(r[1].verificar, true, 'crédito de empresa: conferir');
  assert.equal(r[2].livre, true, 'fotógrafo da NASA: ok');
  await assert.rejects(buscarPexels(semEspera(f), 'x', {}), /PEXELS_API_KEY/);
  await assert.rejects(buscarPixabay(semEspera(f), 'x', {}), /PIXABAY_API_KEY/);
  const chave = 'CHAVE-SECRETA-123';
  const recusa = async () => new Response('erro', { status: 403 });
  for (const fn of [buscarPexels, buscarPixabay]) {
    const e = await fn(semEspera(recusa), 'x', { chave }).catch((x) => x);
    assert.ok(e instanceof Error);
    assert.ok(!e.message.includes(chave), `a chave não aparece no erro: ${e.message}`);
  }
  let cabecalho = null;
  const ok = async (url, o) => { cabecalho = o.headers.authorization; return json({ videos: [{ id: 7, url: 'https://www.pexels.com/video/ondas-7/', user: { name: 'Beltrano' }, duration: 12, video_files: [{ file_type: 'video/mp4', link: 'https://videos.pexels.com/video-files/7/a.mp4', width: 1080, height: 1920 }, { file_type: 'video/mp4', link: 'https://videos.pexels.com/video-files/7/b.mp4', width: 2160, height: 3840 }] }] }); };
  const p = await buscarPexels(semEspera(ok), 'ondas', { chave });
  assert.equal(cabecalho, chave, 'a chave do Pexels vai só no cabeçalho');
  assert.equal(p[0].largura, 1080, 'até 1080 no lado menor');
  assert.equal(creditoDe(p[0]), 'Vídeo: Beltrano no Pexels');
});

test('b-roll: chaves do .env sem imprimir, trecho validado e linha do fontes.md sem travessão', () => {
  const r = path.join(tmp, 'raiz-env');
  fs.mkdirSync(r, { recursive: true });
  fs.writeFileSync(path.join(r, '.env'), 'ELEVENLABS_API_KEY=x\nPEXELS_API_KEY="abc"\n');
  const log = console.log; const saidas = []; console.log = (...a) => saidas.push(a.join(' '));
  try { assert.deepEqual(chavesDoEnv(r, {}), { pexels: 'abc' }); } finally { console.log = log; }
  assert.equal(saidas.length, 0, 'nada impresso');
  assert.deepEqual(chavesDoEnv(path.join(tmp, 'sem-env'), {}), {});
  assert.deepEqual(lerTrecho('1,5-6'), [1.5, 6]);
  assert.throws(() => lerTrecho('6-2'), /inválido/);
  assert.throws(() => lerTrecho('0-30'), /20 s/);
  const l = linhaFonteVideo('assets/broll-x.mp4', { fonte: 'commons', titulo: 'X', autor: 'Fulana', licenca: 'CC BY 4.0', licencaUrl: 'https://cc', via: 'Wikimedia Commons', pagina: 'https://commons.wikimedia.org/wiki/File:X.webm' }, { trecho: [1, 3], original: { sha256: 'a'.repeat(64) } }, '2026-10-20');
  assert.match(l, /^- assets\/broll-x\.mp4: vídeo "X", autor Fulana, licença CC BY 4\.0/);
  assert.match(l, /Crédito para a legenda do post: "Vídeo: Fulana \(CC BY 4\.0\), Wikimedia Commons"/);
  assert.ok(!l.includes(' \u2014 '), 'sem travessão longo com espaços');
});

test('b-roll: download segue redirecionamento só para host da lista e respeita o teto', async () => {
  const destino = path.join(tmp, 'dl', 'a.bin');
  const fora = async () => new Response(null, { status: 302, headers: { location: 'https://evil.example/x.mp4' } });
  await assert.rejects(baixar('https://upload.wikimedia.org/a.webm', destino, { fetch: fora }), /recusado \(evil\.example\)/);
  const grande = async () => new Response(Buffer.alloc(10), { status: 200, headers: { 'content-length': '999999999' } });
  await assert.rejects(baixar('https://upload.wikimedia.org/a.webm', destino, { fetch: grande, maxBytes: 1000 }), /teto/);
  await assert.rejects(baixar('https://www.youtube.com/watch?v=x', destino, { fetch: grande }), /recusado/);
});

test('b-roll: fluxo completo sem rede (Commons de mentira): corta, tira o áudio, grava ficha e fontes.md, não repete', { timeout: 120000 }, async () => {
  const raiz = path.join(tmp, 'estudio');
  fs.mkdirSync(path.join(raiz, 'projetos', 'foguete'), { recursive: true });
  const bin = fs.readFileSync(videoTeste(path.join(tmp, 'fonte.mp4')));
  const pedidos = [];
  const f = async (url) => {
    pedidos.push(new URL(url).host);
    if (url.startsWith('https://commons.wikimedia.org/w/api.php')) return json({ query: { pages: [paginaCommons(10, 'File:Water rocket.webm', 'CC BY 4.0', 'cc-by-4.0'), paginaCommons(11, 'File:Water rocket SA.webm', 'CC BY-SA 4.0', 'cc-by-sa-4.0')] } });
    if (url.startsWith('https://upload.wikimedia.org/')) return new Response(bin, { status: 200, headers: { 'content-length': String(bin.length) } });
    return new Response('nao', { status: 404 });
  };
  const lista = await buscarBroll({ projeto: 'foguete', termo: 'water rocket', fonte: 'commons', listar: true, fetch: f, raiz, env: {} });
  assert.equal(lista.candidatos.length, 1, 'CC BY-SA fica de fora sem --aceitar-sa');
  assert.equal((await buscarBroll({ projeto: 'foguete', termo: 'water rocket', fonte: 'commons', listar: true, aceitarSa: true, fetch: f, raiz, env: {} })).candidatos.length, 2);
  await assert.rejects(buscarBroll({ projeto: 'foguete', termo: 'https://www.youtube.com/watch?v=x', fetch: f, raiz, env: {} }), /não um link/);
  const r = await buscarBroll({ projeto: 'foguete', termo: 'water rocket', fonte: 'commons', trecho: [1, 3], nome: 'foguete', fetch: f, raiz, env: {} });
  const pasta = path.join(raiz, 'projetos', 'foguete');
  assert.equal(r.arquivo, 'assets/broll-foguete.mp4');
  const pr = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,codec_name:format=duration', '-of', 'json', path.join(pasta, r.arquivo)], { encoding: 'utf8' });
  const info = JSON.parse(pr.stdout);
  assert.deepEqual(info.streams.map((s) => s.codec_type), ['video'], 'sem faixa de áudio');
  assert.equal(info.streams[0].codec_name, 'h264');
  assert.ok(Math.abs(Number(info.format.duration) - 2) < 0.15, `trecho de 2 s (${info.format.duration})`);
  const ficha = JSON.parse(fs.readFileSync(path.join(pasta, 'assets', 'broll-foguete.origem.json'), 'utf8'));
  assert.equal(ficha.licenca, 'CC BY 4.0'); assert.equal(ficha.autor, 'Fulana'); assert.deepEqual(ficha.trecho, [1, 3]);
  assert.equal(ficha.original.sha256, crypto.createHash('sha256').update(bin).digest('hex'), 'sha256 do original confere');
  assert.equal(ficha.sha256, crypto.createHash('sha256').update(fs.readFileSync(path.join(pasta, r.arquivo))).digest('hex'));
  const fontes = fs.readFileSync(path.join(pasta, 'fontes.md'), 'utf8');
  assert.match(fontes, /## Vídeos\n- assets\/broll-foguete\.mp4: vídeo "Water rocket\.webm", autor Fulana, licença CC BY 4\.0/);
  assert.ok(!fs.readdirSync(path.join(pasta, 'assets')).some((x) => /\.(webm|ogv)$/.test(x)), 'original fica no cache, fora de assets/');
  await assert.rejects(buscarBroll({ projeto: 'foguete', termo: 'water rocket', fonte: 'commons', fetch: f, raiz, env: {} }), /já estão em fontes\.md/, 'não repete sem pedir');
  const de_novo = await buscarBroll({ projeto: 'foguete', termo: 'water rocket', fonte: 'commons', escolha: 1, trecho: [1, 3], nome: 'foguete-2', fetch: f, raiz, env: {} });
  assert.ok(de_novo.avisos.some((a) => /mesmo vídeo e trecho/.test(a)), 'avisa quando o mesmo trecho já existe');
  assert.ok(pedidos.every((h) => ['commons.wikimedia.org', 'upload.wikimedia.org'].includes(h)), `só Commons: ${[...new Set(pedidos)]}`);
});

/* ------------------------------ motor ------------------------------ */

const MARCA = { fundo: '#0E0E13', frente: '#FFFFFF', sombra: '#3C3B4A', destaque: '#FF7A2F', apoio: '#FFC9A3', serie: '@x' };

test('motor: validador aceita o elemento video, recusa o que falta e avisa fundo com peça', () => {
  const cena = (els) => ({ perfil: 'curiosidades', tema: 'X', beats: [{ id: 'a', palavras: [0, 3], elementos: els }] });
  const ok = validarCena(cena([{ tipo: 'video', arquivo: 'assets/broll-x.mp4', modo: 'fundo', credito: 'Vídeo: NASA' }, { tipo: 'contador', valor: 3 }]), 10);
  assert.deepEqual(ok.erros, []);
  const ruim = validarCena(cena([{ tipo: 'video', arquivo: 'https://youtube.com/x.mp4', modo: 'tela', escurece: 2 }]), 10);
  assert.ok(ruim.erros.some((x) => /assets/.test(x)), 'arquivo fora de assets/');
  assert.ok(ruim.erros.some((x) => /modo "tela"/.test(x)));
  assert.ok(ruim.erros.some((x) => /escurece/.test(x)));
  assert.ok(ruim.avisos.some((x) => /credito/.test(x)) && !ruim.erros.some((x) => /credito/.test(x)), 'crédito faltando é aviso, não erro (0.6.44)');
  const dois = validarCena(cena([{ tipo: 'video', arquivo: 'assets/a.mp4', credito: 'c' }, { tipo: 'video', arquivo: 'assets/b.mp4', credito: 'c' }]), 10);
  assert.ok(dois.erros.some((x) => /mais de um vídeo de fundo/.test(x)));
  const comPeca = validarCena(cena([{ tipo: 'video', arquivo: 'assets/a.mp4', credito: 'c' }, { tipo: 'peca', forma: 'cubo' }]), 10);
  assert.ok(comPeca.avisos.some((x) => /cobre as peças/.test(x)));
});

test('motor: embutirVideos extrai os quadros uma vez, fora do JSON da spec, e recusa arquivo fora do projeto', () => {
  const pasta = path.join(tmp, 'proj-motor');
  videoTeste(path.join(pasta, 'assets', 'v.mp4'), { d: 3 });
  const spec = { beats: [{ id: 'a', de: 0, ate: 2, elementos: [{ tipo: 'video', arquivo: 'assets/v.mp4', modo: 'fundo' }] }, { id: 'b', de: 2, ate: 4, elementos: [{ tipo: 'video', arquivo: 'assets/v.mp4', modo: 'card', inicio: 1 }] }] };
  assert.equal(embutirVideos(spec, pasta) > 0, true);
  const [f, c] = [spec.beats[0].elementos[0], spec.beats[1].elementos[0]];
  assert.equal(f.fpsQuadros, FPS_QUADROS);
  assert.ok(f.quadros.length >= 60 && f.quadros.length <= 73, `2 s + folga a 30 q/s (${f.quadros.length})`);
  assert.equal(f.entra, 0, 'fundo entra com o beat');
  assert.equal(c.largura, 900); assert.equal(c.altura, 506, 'cartão na proporção do vídeo (16:9)');
  assert.ok(!JSON.stringify(spec).includes(pasta), 'caminho de disco não vai para a spec');
  assert.ok(fs.existsSync(spec[EXTRAS][f.quadros[0]]), 'o servidor sabe onde está cada quadro');
  const antes = fs.statSync(spec[EXTRAS][f.quadros[0]]).mtimeMs;
  const spec2 = JSON.parse(JSON.stringify({ beats: [{ id: 'a', de: 0, ate: 2, elementos: [{ tipo: 'video', arquivo: 'assets/v.mp4' }] }] }));
  embutirVideos(spec2, pasta);
  assert.equal(fs.statSync(spec2[EXTRAS][spec2.beats[0].elementos[0].quadros[0]]).mtimeMs, antes, 'cache: não extrai de novo');
  assert.throws(() => embutirVideos({ beats: [{ id: 'z', de: 0, ate: 1, elementos: [{ tipo: 'video', arquivo: '../fora.mp4' }] }] }, pasta), /não existe na pasta do projeto/);
});

test('navegador: vídeo de fundo e em cartão, quadro determinístico, troca com t e segura o último quadro', { timeout: 180000 }, async () => {
  const pasta = path.join(tmp, 'proj-nav');
  videoTeste(path.join(pasta, 'assets', 'v.mp4'), { d: 2, s: '320x180' });
  const beats = [
    { id: 'a', de: 0, ate: 3, camera: { plano: 'normal', mov: 'deriva' }, transicao: 'corte', elementos: [{ tipo: 'video', arquivo: 'assets/v.mp4', modo: 'fundo', t0: 0 }] },
    { id: 'b', de: 3, ate: 6, camera: { plano: 'normal', mov: 'deriva' }, transicao: 'corte', elementos: [{ tipo: 'video', arquivo: 'assets/v.mp4', modo: 'card', pos: [0.5, 0.3], t0: 3.1 }, { tipo: 'peca', forma: 'cubo', t0: 3.2, pos: [0, -0.5, 0] }] },
  ];
  const spec = { perfil: 'curiosidades', marca: MARCA, duracao: 6, palavras: [], efeitos: { bloom: 0.5, grao: 0.6 }, avisos: [], beats };
  embutirVideos(spec, pasta);
  const { paginas, novaAba, fechar } = await abrir(spec, { escala: 0.25, workers: 1, gpu: false });
  try {
    const hash = async (p, x) => { await p.evaluate((q) => window.ilu.quadro(q), x); return crypto.createHash('sha1').update(await p.screenshot({ type: 'png' })).digest('hex'); };
    const a = await hash(paginas[0], 1.0);
    const b = await hash(paginas[0], 1.5);
    assert.notEqual(a, b, 'o vídeo anda com o tempo');
    await hash(paginas[0], 4.5); await hash(paginas[0], 0.2); // desvia
    assert.equal(await hash(paginas[0], 1.0), a, 'mesmo t, mesmos pixels');
    const outra = await novaAba();
    assert.equal(await hash(outra, 1.0), a, 'outra aba, mesmos pixels');
    const src = (q) => outra.evaluate(async (x) => { await window.ilu.quadro(x); return document.querySelector('#broll .vfundo img').getAttribute('src'); }, q);
    assert.notEqual(await src(0.5), await src(1.5), 'quadros diferentes ao longo do trecho');
    assert.equal(await src(2.6), await src(2.9), 'depois do fim do trecho (2 s), segura o último quadro');
    const visivel = await paginas[0].evaluate((q) => { window.ilu.quadro(q); const d = document.querySelector('#broll .vfundo'); return { op: Number(d.style.opacity), src: d.querySelector('img').getAttribute('src') }; }, 1.0);
    assert.ok(visivel.op > 0.9, 'fundo visível no meio do beat');
    assert.match(visivel.src, /^\/broll\/[0-9a-f]{16}\/\d{5}\.jpg$/);
    const m = await paginas[0].evaluate((q) => window.ilu.medir(q), 4.6);
    assert.equal(m.imagens.length, 1, 'o cartão de vídeo conta como imagem no QA (peça não fica por baixo)');
    assert.equal(m.pecas.length, 1);
    const fora = await paginas[0].evaluate((q) => { window.ilu.quadro(q); return Number(document.querySelector('#broll .vfundo').style.opacity); }, 4.6);
    assert.equal(fora, 0, 'fundo some fora do beat');
  } finally { await fechar(); }
});
