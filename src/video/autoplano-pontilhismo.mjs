/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as n,lerAbertos as i}from"./f4-plano-base.mjs";function m({palavras:a,abertos:r,sujeito:e,base:t}){return n({estilo:"pontilhismo",palavras:a,abertos:r,sujeito:e,base:t,fotoEl:o=>({tipo:"pontos",forma:"retrato",arquivo:o.arquivo,entra:0,pos:[.5,.5],tamanho:1,dados:{nome:o.nome}}),montar:o=>[{tipo:"pontos",forma:"aberto",ref:o.id,entra:o.primeiro?.05:0,pos:[.5,.5],tamanho:1,dados:{desenho:o.desenho,linha:o.linha,cadeia:o.cadeia}}]})}export{i as lerAbertos,m as planejarPontilhismo};
