/*
 * 
 * 
 */
import '../src/programas.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { compilar } from '../src/video/plano.mjs';
import { embutirPontos } from '../src/video/pontos.mjs';
import { lerLocais, embutirLocais } from '../src/video/locais.mjs';
import { embutirModelos } from '../src/video/modelos3d.mjs';
import { abrir, foto } from '../src/video/render.mjs';
import { modeloDoProjeto, planoDoModelo } from '../src/modelos/carregar.mjs';

/**
 * Folha de contato dos pontos: um quadro por forma (no meio da frase, depois do morph), para conferir se cada forma
 * se lê, se algo sai da tela e se a legenda disputa espaço com o desenho.
 *   node scripts/folha-pontos.mjs <projeto> [segundos...] [--mp4] [--colunas=6]
 * Sem segundos, usa os instantes das formas da cena. Com --mp4, tira os quadros do vídeo final já renderizado
 * (saida/<projeto>.mp4) em vez de abrir a cena. Saída: projetos/<projeto>/saida/qa/pontos-folha.jpg (ou
 * pontos-mp4.jpg) e a lista de instantes em .txt. Ideia da revisão por folha de contato: pacote
 * brabo-minimalista-pontilhismo, de Fernando Araújo (MIT; ver AVISOS-TERCEIROS.md).
 */
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const nome = args.find((a) => !a.startsWith('--') && !/^\d+(\.\d+)?$/.test(a));
const mp4 = args.includes('--mp4');
const colunas = Number((args.find((a) => a.startsWith('--colunas=')) || '=6').split('=')[1]) || 6;
let tempos = args.filter((a) => /^\d+(\.\d+)?$/.test(a)).map(Number);
if (!nome) { console.error('Uso: node scripts/folha-pontos.mjs <projeto> [segundos...] [--mp4] [--colunas=6]'); process.exit(1); }
const pasta = path.join(RAIZ, 'projetos', nome);
for (const f of ['cena.json', 'palavras.json']) if (!fs.existsSync(path.join(pasta, f))) { console.error(`falta projetos/${nome}/${f}: rode o vídeo uma vez (pode ser com --sem-render).`); process.exit(1); }

const config = fs.existsSync(path.join(RAIZ, 'ilustrando.config.json')) ? JSON.parse(fs.readFileSync(path.join(RAIZ, 'ilustrando.config.json'), 'utf8')) : {};
const plano = planoDoModelo(modeloDoProjeto(pasta, { config }));
const spec = compilar(JSON.parse(fs.readFileSync(path.join(pasta, 'cena.json'), 'utf8')), JSON.parse(fs.readFileSync(path.join(pasta, 'palavras.json'), 'utf8')), { plano });
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
for (const b of spec.beats) for (const e of b.elementos || []) if (e.tipo === 'imagem' && e.arquivo) { const arq = path.join(pasta, e.arquivo); if (fs.existsSync(arq)) e.src = `data:${MIME[path.extname(arq).toLowerCase()] || 'image/jpeg'};base64,${fs.readFileSync(arq).toString('base64')}`; }
embutirPontos(spec, pasta);
embutirLocais(spec, await lerLocais(pasta));
embutirModelos(spec, pasta);

const dir = path.join(pasta, 'saida', 'qa', mp4 ? 'pontos-mp4' : 'pontos');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const precisaNavegador = !mp4 || !tempos.length;
const sessao = precisaNavegador ? await abrir(spec, { escala: 0.5, workers: 1 }) : null;
if (!tempos.length) tempos = await sessao.paginas[0].evaluate(() => window.ilu.pontos?.chaves?.() || []);
if (!tempos.length) { console.error('a cena não tem pontos (nem estilo pontilhismo nem elementos "pontos").'); await sessao?.fechar(); process.exit(1); }
tempos = tempos.filter((t) => t >= 0 && t < spec.duracao);
const arq = (i) => path.join(dir, `s${String(i).padStart(3, '0')}.jpg`);
if (mp4) {
  const video = path.join(pasta, 'saida', `${nome}.mp4`);
  if (!fs.existsSync(video)) { console.error(`não achei ${path.relative(RAIZ, video)}`); await sessao?.fechar(); process.exit(1); }
  tempos.forEach((t, i) => spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(t), '-i', video, '-frames:v', '1', '-vf', 'scale=540:-1', arq(i)]));
} else {
  for (const [i, t] of tempos.entries()) await foto(sessao.paginas[0], t, arq(i), 85);
}
await sessao?.fechar();
const saida = path.join(pasta, 'saida', 'qa', mp4 ? 'pontos-mp4.jpg' : 'pontos-folha.jpg');
const cols = Math.min(colunas, tempos.length);
const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(dir, 's%03d.jpg'), '-vf', `scale=270:-1,tile=${cols}x${Math.ceil(tempos.length / cols)}:padding=4`, '-frames:v', '1', saida], { encoding: 'utf8' });
if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
fs.writeFileSync(saida.replace(/\.jpg$/, '.txt'), tempos.map((t, i) => `${i + 1}. ${t.toFixed(2)} s`).join('\n') + '\n');
console.log(`${tempos.length} quadros -> ${path.relative(RAIZ, saida)} (da esquerda para a direita: ${tempos.map((t) => t.toFixed(1)).join(', ')} s)`);
