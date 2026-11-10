/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{mensagemFfmpeg as f}from"../ffmpeg-falha.mjs";import{spawnSync as l}from"node:child_process";import{palavrasDoTexto as i}from"./texto.mjs";async function w({texto:p,saida:c}){const m=i(p),e=[];let o=.35;for(const r of m){const s=Math.max(.16,r.replace(/[^\p{L}\p{N}]/gu,"").length*.062+.05);e.push({w:r,t:+o.toFixed(3),f:+(o+s).toFixed(3)}),o+=s+.045+(/[.!?:]$/.test(r)?.42:/[,;]$/.test(r)?.2:0)}const a=o+.6,n=c.replace(/\.[^.]+$/,"")+".mp3",t=l("ffmpeg",["-y","-loglevel","error","-f","lavfi","-i","anullsrc=r=44100:cl=mono","-t",String(a),"-c:a","libmp3lame","-b:a","128k",n],{encoding:"utf8"});if(t.status!==0)throw new Error(t.error?.code==="ENOENT"?"FFmpeg n\xE3o encontrado: spawn ffmpeg ENOENT":f(t));return{arquivo:n,palavras:e,duracao:a,tempos:"estimados"}}export{w as narrar};
