/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import t from"node:fs";import a from"node:path";const s=new Set(["elevenlabs","fishaudio","arquivo"]);function i(r){const e=a.join(r,"palavras.json");if(!t.existsSync(e)||!t.existsSync(a.join(r,"narracao.mp3")))return null;try{return JSON.parse(t.readFileSync(e,"utf8").replace(/^﻿/,"")).voz||null}catch{return null}}function f(r,e,{trocar:n=!1}={}){const o=i(r);return n||!o||o===e||!s.has(o)?{ok:!0,existente:o,pedida:e}:{ok:!1,existente:o,pedida:e,msg:`Este projeto j\xE1 tem narra\xE7\xE3o da voz "${o}" e o pedido veio com "${e}". Trocar sobrescreveria narracao.mp3 e palavras.json. Para seguir com a voz "${o}", rode de novo sem --voz (ou com --voz=${o}). Para trocar de prop\xF3sito, acrescente --trocar-voz.`}}function m({tv:r,voz:e,guardada:n,selo:o,refazerVoz:c=!1}={}){return!r||r.ok||e!=="mock"||c||!s.has(r.existente)||!n||!o?null:n.hash&&(n.hash===o.novo||n.hash===o.antigo)?r.existente:null}export{s as VOZES_REAIS,f as conferirTrocaDeVoz,i as vozExistente,m as vozGuardadaParaMock};
