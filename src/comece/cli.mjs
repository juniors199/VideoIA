/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import"../programas.mjs";import{situacaoComeco as n,textoSituacao as t}from"./situacao.mjs";const o=process.argv.slice(2);(o.includes("--ajuda")||!o.includes("--situacao"))&&(console.log(`Uso: npm run comece -- --situacao [--json] [--sem-navegador]
  Mostra, em uma tela, o que falta para o primeiro v\xEDdeo (Node, FFmpeg, pe\xE7as, navegador, licen\xE7a, voz, marca) e o pr\xF3ximo passo.`),process.exit(o.includes("--ajuda")?0:2));try{const a=await import("node:fs"),c=new URL("../../.env",import.meta.url);if(a.existsSync(c))for(const r of a.readFileSync(c,"utf8").replace(/^\uFEFF/,"").split(/\r?\n/)){const e=r.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);e&&!process.env[e[1]]&&(process.env[e[1]]=e[2].replace(/^["']|["']$/g,""))}}catch{}const s=await n({navegador:!o.includes("--sem-navegador")});console.log(o.includes("--json")?JSON.stringify(s):t(s)),process.exitCode=s.pronto?0:1;
