/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as n,lerAbertos as d}from"./f4-plano-base.mjs";function p({palavras:a,abertos:r,sujeito:e,base:i}){return n({estilo:"quadro-antigo",palavras:a,abertos:r,sujeito:e,base:i,maxBeat:2.6,grupos:!0,fotoEl:o=>({tipo:"quadro-antigo",forma:"medalhao",arquivo:o.arquivo,nome:o.nome,credito:o.credito}),montar:o=>[{tipo:"quadro-antigo",forma:"aberto",ref:o.id,dados:{desenho:o.desenho,linha:o.linha,cadeia:o.cadeia,primeiro:o.primeiro}},{tipo:"quadro-antigo",forma:"texto",texto:o.palavras.slice(o.tr.i,o.tr.j+1).map(t=>t.w).join(" "),zona:"baixo"}]})}export{d as lerAbertos,p as planejarQuadroAntigo};
