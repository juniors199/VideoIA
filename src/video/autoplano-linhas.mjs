/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as i,lerAbertos as t}from"./f4-plano-base.mjs";function h({palavras:e,abertos:o,sujeito:r,base:n}){return i({estilo:"linhas",palavras:e,abertos:o,sujeito:r,base:n,montar:a=>[{tipo:"linhas",forma:"aberto",ref:a.id,entra:a.primeiro?.05:0,pos:[.5,.5],tamanho:1,dados:{desenho:a.desenho,linha:a.linha,cadeia:a.cadeia}}]})}export{t as lerAbertos,h as planejarLinhas};
