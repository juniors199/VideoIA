/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{GEO as x}from"./zona.js";import{LARGURA_TEXTO as a,TEXTO_X0 as c,TEXTO_X1 as l}from"./area-segura.js";const o=!!x.horizontal,t=o?.6:1,e=o?x.W/2-540*t:0,n=o?x.H/2-960*t:0,X=o?3240:1080,y=o?-1080:0,O=1920,s=o?1500:a,u=o?540-s/2:c,E=o?540+s/2:l,H=(r,p)=>[(r-e)/t,(p-n)/t],_=(r,p)=>[r*t+e,p*t+n],m=o?{x0:(x.util.x0-e)/t,x1:(x.util.x1-e)/t,y0:(x.util.y0-n)/t,y1:(x.util.y1-n)/t}:null,A=o&&!!x.handle,L=o?x.handle?140:60:0,V=r=>o?{x0:r.x0*t+e,x1:r.x1*t+e,y0:r.y0*t+n,y1:r.y1*t+n}:r;export{L as DY_FECHO,A as HANDLE,o as HZ,t as KH,s as LARG,e as OX,n as OY,u as TX0,E as TX1,m as UTIL_V,O as VH,X as VW,y as X0,V as caixaParaTela,_ as paraTela,H as paraVirtual};
