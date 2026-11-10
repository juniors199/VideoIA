/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{criarDesenharCena as l}from"./cena-base.mjs";import{FORMAS_CENA as f,PAPEIS_CENA as c,coresDaCena as m,indiceDoEstado as k,itemVisivel as p,validarCenaVetor as F,poseDe as S,caixaDaCena as w}from"./cena-base.mjs";function n(e,a,{it:o,cor:t,solido:s,E:r}){e.shadowColor="rgba(0,0,0,.45)",e.shadowBlur=14*(r/8),e.shadowOffsetY=6*(r/8),e.strokeStyle="#FFFFFF",e.lineWidth=(s?0:(o.larg||1.2)*r)+9*(r/6),s?(e.stroke(a),e.shadowColor="transparent",e.fillStyle=t,e.fill(a),e.strokeStyle="rgba(0,0,0,.28)",e.lineWidth=1.5,e.stroke(a)):(e.stroke(a),e.shadowColor="transparent",e.strokeStyle=t,e.lineWidth=Math.max(4,(o.larg||1.2)*r),e.stroke(a))}const d=l({padrao:"letreiro",tratamentos:{colagem:n},fatorTraco:{colagem:.6}});export{f as FORMAS_CENA,c as PAPEIS_CENA,w as caixaDaCena,m as coresDaCena,d as desenharCena,k as indiceDoEstado,p as itemVisivel,S as poseDe,F as validarCenaVetor};
