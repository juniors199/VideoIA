/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as i,lerAbertos as p}from"./f4-plano-base.mjs";import{conteudoOriginal as s}from"./f4-intencao.mjs";function d({palavras:e,abertos:t,sujeito:a,base:n}){return i({estilo:"preto-branco",palavras:e,abertos:t,sujeito:a,base:n,montar:o=>[{tipo:"preto-branco",forma:"aberto",ref:o.id,entra:o.primeiro?-.08:0,dados:{desenho:o.desenho,linha:o.linha,cadeia:o.cadeia}}],beatExtra:o=>{const r=s(o.frase).slice(0,2);return{tom:o.faseFim%2?"claro":"escuro",...r.length?{titulo:{texto:r.join(" ").toUpperCase()}}:{}}}})}export{p as lerAbertos,d as planejarPretoBranco};
