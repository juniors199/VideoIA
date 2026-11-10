/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{planejarAberto as n,lerAbertos as i}from"./f2-plano-base.mjs";const s={causa:["causa","efeito"],muda:["antes","depois"],acontece:["causa","efeito"]};function p(r,o){const a=s[r];return a?Array.from({length:o},(t,e)=>e===0?a[0]:e===o-1?a[1]:""):null}function u({palavras:r,abertos:o,sujeito:a,base:t}){return n({estilo:"cartoes",palavras:r,abertos:o,sujeito:a,base:t,montar:e=>[{tipo:"cartoes",forma:"aberto",ref:e.id,entra:e.primeiro?e.k===0?-.7:.05:0,pos:[.5,.6],tamanho:.94,dados:{desenho:e.desenho,linha:e.linha,cadeia:e.cadeia,cartao:[720,690],papeis:p(e.quadro.tipo,e.desenho.fases.length)}}]})}export{i as lerAbertos,p as papeisDoQuadro,u as planejarCartoes};
