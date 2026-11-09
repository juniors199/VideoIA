/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{criarVerificadores as r}from"./verificar-aberto.mjs";import{hashDesenho as c,formasRepetidas as d}from"./verificar-aberto.mjs";const o={pontilhismo:"pontos"},e={parado:[0,.4],px:[.4,17],segurar:.3,paradoMax:2.8},p={linhas:{parado:[0,.4],px:[.3,17],segurar:.3,paradoMax:2.8},pontilhismo:{parado:[0,.4],px:[.3,17],segurar:.3,paradoMax:2.8}},{verificarCena:s,verificarSpecAberto:i}=r({metaDe:a=>p[a]||e,tipoDe:a=>o[a]||a,protagonistas:["retrato","medalhao"]});export{p as METAS_F4,e as META_PADRAO,o as TIPO_ELEMENTO,d as formasRepetidas,c as hashDesenho,s as verificarCena,i as verificarSpecAberto};
