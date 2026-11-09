/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as s,lerAbertos as m}from"./f2-plano-base.mjs";import{conteudoOriginal as l,normalizar as p}from"./f2-intencao.mjs";function u(o){if(o.primeiro&&o.verboTexto){let t=l(o.frase).filter(e=>e.toLowerCase()!==o.verboTexto&&o.cobertura.cobre.includes(p(e))).slice(0,2);for(;t.length>1&&`${t.join(" ")} ${o.verboTexto}`.length>22;)t=t.slice(0,-1);return`${t.join(" ")} *${o.verboTexto}*`.trim()}const r=String(o.desenho.fases[o.faseFim]).split(/\s+/),a=r.pop();return`${r.join(" ")} *${a}*`.trim()}function x({palavras:o,abertos:r,sujeito:a,base:t}){return s({estilo:"tubo",palavras:o,abertos:r,sujeito:a,base:t,grupos:{maxP:3,maxC:18},montar:e=>{const i=e.primeiro&&e.tVerbo!=null?Math.max(.2,+(e.tVerbo-e.tr.t).toFixed(2)):.35,n=e.primeiro||e.mudou?[{tipo:"tubo",forma:"chave",texto:u(e),entra:i,pos:[.5,1.03]}]:[];return[{tipo:"tubo",forma:"aberto",ref:e.id,texto:e.id.replace(/-/g," "),entra:e.primeiro?e.k===0?-.7:.05:0,pos:[.5,.36],tamanho:1,dados:{desenho:e.desenho,linha:e.linha,cadeia:e.cadeia,tam:660}},...n]}})}export{m as lerAbertos,x as planejarTubo,u as textoDaChave};
