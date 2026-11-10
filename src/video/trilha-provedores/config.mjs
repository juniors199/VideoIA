/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import e from"node:fs";import n from"node:path";import{gravarAtomico as s}from"../arquivo.mjs";import{ORDEM_PADRAO as c,configTrilha as l}from"./index.mjs";function u(i,{ligar:t}){const o=n.join(i,"ilustrando.config.json"),r=e.existsSync(o)?JSON.parse(e.readFileSync(o,"utf8").replace(/^﻿/,"")):{},a=r.trilha&&typeof r.trilha=="object"?r.trilha:{clima:typeof r.trilha=="string"?r.trilha:"auto"};return r.trilha={...a,clima:a.clima??"auto",ordem:t?c:["sintetizada"],bibliotecaLivre:t,provedores:a.provedores||{}},delete r.trilhaFonte,s(o,JSON.stringify(r,null,2)+`
`),l(r)}function d(i){const t=n.join(i,".env");if(e.existsSync(t))for(const o of e.readFileSync(t,"utf8").replace(/^﻿/,"").split(/\r?\n/)){const r=o.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);r&&!process.env[r[1]]&&(process.env[r[1]]=r[2].replace(/^["']|["']$/g,""))}}export{d as carregarEnvDaPasta,u as gravarOrdemDeTrilha};
