/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as a,lerAbertos as s}from"./f2-plano-base.mjs";import{conteudoOriginal as n,normalizar as m}from"./f2-intencao.mjs";function p(r){if(r.primeiro&&r.verboTexto)return`${n(r.frase).filter(o=>o.toLowerCase()!==r.verboTexto&&r.cobertura.cobre.includes(m(o))).slice(0,2).join(" ")} *${r.verboTexto}*`.trim();const e=String(r.desenho.fases[r.faseFim]).split(/\s+/).slice(0,4),i=e.pop();return`${e.join(" ")} *${i}*`.trim()}function u({palavras:r,abertos:e,sujeito:i,base:t}){return a({estilo:"impresso",palavras:r,abertos:e,sujeito:i,base:t,grupos:{maxP:3,maxC:20},montar:o=>[{tipo:"impresso",forma:"aberto",ref:o.id,entra:o.primeiro?o.k===0?-.7:.05:0,pos:[.5,.6],tamanho:1,dados:{desenho:o.desenho,linha:o.linha,cadeia:o.cadeia,tam:640}},...o.primeiro||o.mudou?[{tipo:"impresso",forma:"palavra",texto:p(o),entra:.1,pos:[.08,-.16]}]:[]]})}export{p as formaTipografica,s as lerAbertos,u as planejarImpresso};
