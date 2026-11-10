/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{criarVerificadores as e}from"./verificar-aberto.mjs";import{hashDesenho as c,formasRepetidas as x}from"./verificar-aberto.mjs";const r={cartoes:{parado:[0,.35],px:[.6,17],segurar:.3,paradoMax:2.6},tubo:{parado:[0,.35],px:[.6,17],segurar:.3,paradoMax:2.6},impresso:{parado:[0,.4],px:[.5,17],segurar:.3,paradoMax:2.8}},{verificarCena:p,verificarSpecAberto:s}=e({metaDe:a=>r[a]||r.cartoes});export{r as METAS_F2,x as formasRepetidas,c as hashDesenho,p as verificarCena,s as verificarSpecAberto};
