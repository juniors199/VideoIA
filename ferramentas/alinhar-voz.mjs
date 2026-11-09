/*
 * 
 * 
 */
/**
 * Alinhador de voz sem Python: reconhece a narração com o Whisper rodando no próprio Node (transformers.js +
 * onnxruntime) e devolve o tempo de cada palavra. Faz o mesmo que ferramentas/transcrever.py (faster-whisper),
 * para quem não quer instalar Python. O instalador coloca as peças em .programas/alinhador.
 *
 *   node ferramentas/alinhar-voz.mjs <audio>        -> {"palavras":[{"w","t","f"}]} na saída
 *   node ferramentas/alinhar-voz.mjs --baixar       -> baixa o modelo (uma vez, cerca de 80 MB)
 *   node ferramentas/alinhar-voz.mjs --conferir     -> diz se está pronto (código 0) ou não (código 3)
 *
 * Modelo: onnx-community/whisper-base_timestamped (Apache 2.0), revisão fixa abaixo, quantizado em 8 bits.
 * Nos nossos testes com narrações reais (comparadas ao tempo exato da ElevenLabs): 95 a 100% das palavras
 * casadas e erro médio de 0,10 a 0,15 s, o mesmo nível do faster-whisper "small".
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const STUDIO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.ILU_PROGRAMAS || path.join(STUDIO, '.programas');
const PASTA = path.join(BASE, 'alinhador');
export const MODELO = process.env.ILU_ALINHADOR_MODELO || 'onnx-community/whisper-base_timestamped';
export const REVISAO = process.env.ILU_ALINHADOR_REVISAO || '608c49e61301901684bc36cac8f74b95ff6b5a8e';
const DTYPE = { encoder_model: 'q8', decoder_model_merged: 'q8' };

async function carregar() {
  let caminho;
  try { caminho = createRequire(path.join(PASTA, 'package.json')).resolve('@huggingface/transformers'); } catch {
    console.log(JSON.stringify({ erro: 'alinhador não instalado (dê dois cliques em Instalar de novo)' }));
    process.exit(3);
  }
  const T = await import(pathToFileURL(caminho).href);
  const t = T.default && !T.pipeline ? T.default : T;
  t.env.cacheDir = path.join(PASTA, 'modelos');
  t.env.allowLocalModels = false;
  return t;
}

const criar = (t, progresso) => t.pipeline('automatic-speech-recognition', MODELO, { revision: REVISAO, dtype: DTYPE, ...(progresso ? { progress_callback: progresso } : {}) });

const args = process.argv.slice(2);
if (args[0] === '--conferir') {
  const ok = fs.existsSync(path.join(PASTA, 'node_modules', '@huggingface', 'transformers', 'package.json')) && fs.existsSync(path.join(PASTA, 'modelos'));
  process.exit(ok ? 0 : 3);
} else if (args[0] === '--baixar') {
  const t = await carregar();
  const vistos = new Map();
  let ultimo = 0;
  await criar(t, (p) => {
    if (p.status === 'progress' && p.total) vistos.set(p.file, [p.loaded, p.total]);
    const agora = Date.now();
    if (agora - ultimo < 1000 && p.status !== 'done') return;
    ultimo = agora;
    let a = 0, b = 0;
    for (const [x, y] of vistos.values()) { a += x; b += y; }
    if (b) process.stdout.write(`PROGRESSO ${Math.round((a / b) * 100)} ${Math.round(a / 1e6)} ${Math.round(b / 1e6)}\n`);
  });
  process.stdout.write('PRONTO\n');
} else if (args[0]) {
  const audio = args[0];
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', audio, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], { maxBuffer: 1e9 });
  if (raw.status !== 0) { console.log(JSON.stringify({ erro: 'ffmpeg não conseguiu ler o áudio' })); process.exit(2); }
  const buf = raw.stdout;
  const amostras = new Float32Array(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length - (buf.length % 4)));
  const t = await carregar();
  const asr = await criar(t);
  const r = await asr(amostras, { language: ({ pt: 'portuguese', en: 'english', es: 'spanish' })[process.env.ILU_IDIOMA] || 'portuguese', task: 'transcribe', return_timestamps: 'word', chunk_length_s: 30, stride_length_s: 5 });
  const palavras = [];
  for (const c of r.chunks || []) {
    const w = String(c.text || '').trim();
    const [ini, fim] = c.timestamp || [];
    if (!w || ini == null) continue;
    palavras.push({ w, t: +(+ini).toFixed(3), f: +(+(fim ?? ini + 0.2)).toFixed(3) });
  }
  console.log(JSON.stringify({ palavras }));
} else {
  console.error('Uso: node ferramentas/alinhar-voz.mjs <audio> | --baixar | --conferir');
  process.exit(1);
}
