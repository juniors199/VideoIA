/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import s from"node:fs";import o from"node:path";import{fileURLToPath as n}from"node:url";import{servir as c}from"./servidor.mjs";import{compilar as m}from"./plano.mjs";import{lerLocais as f,embutirLocais as l}from"./locais.mjs";import{embutirModelos as u}from"./modelos3d.mjs";import{embutirMarcas as d}from"../marcas.mjs";const v=o.resolve(o.dirname(n(import.meta.url)),"..","..");async function j(e){const r=o.join(v,"projetos",e),t=o.join(r,"cena.json"),i=o.join(r,"palavras.json");if(!s.existsSync(t)||!s.existsSync(i))throw new Error(`Este v\xEDdeo ainda n\xE3o tem as cenas prontas. No est\xFAdio web, marque "pr\xE9via r\xE1pida" e clique em Produzir v\xEDdeo, ou pe\xE7a ao assistente para preparar as cenas (ele roda npm run video -- ${e} --voz=mock --sem-render).`);const a=m(JSON.parse(s.readFileSync(t,"utf8")),JSON.parse(s.readFileSync(i,"utf8")));l(a,await f(r)),u(a,r),d(a);const p=await c(a,{"/audio.mp3":o.join(r,"narracao.mp3")});return{url:`http://127.0.0.1:${p.porta}/previa`,fechar:p.fechar}}if(process.argv[1]===n(import.meta.url)){const e=process.argv[2];e||(console.error("Uso: node src/video/previa.mjs <projeto>"),process.exit(1));try{const r=await j(e);console.log(`Pr\xE9via em ${r.url}
Ctrl+C para fechar.`)}catch(r){console.error(r.message),process.exit(1)}}export{j as previa};
