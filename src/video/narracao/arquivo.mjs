/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import e from"node:fs";import o from"node:path";async function p({saida:a}){const t=o.dirname(a),n=["narracao.mp3","narracao.wav","narracao.m4a"].map(r=>o.join(t,r)).find(r=>e.existsSync(r));if(!n)throw new Error(`Para --voz=arquivo, coloque sua grava\xE7\xE3o em ${o.relative(process.cwd(),o.join(t,"narracao.mp3"))}.`);if(n!==a){const{spawnSync:r}=await import("node:child_process");if(r("ffmpeg",["-y","-loglevel","error","-i",n,"-b:a","192k",a]).status!==0)throw new Error("ffmpeg falhou ao converter a grava\xE7\xE3o.")}return{arquivo:a,palavras:null,duracao:null,tempos:"a-alinhar"}}export{p as narrar};
