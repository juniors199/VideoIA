/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{limita as F,lerp as k}from"./estilos-comum.js";const z=`
uniform sampler2D uImg; uniform sampler2D uProf;
uniform vec2 uImgRes; uniform vec4 uCam; uniform vec2 uDrift; uniform vec3 uFoco; uniform float uSeed; uniform float uGrao; uniform float uBoil; uniform float uFlick; uniform float uVinheta;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1,0)), f.x), mix(h21(i + vec2(0,1)), h21(i + vec2(1,1)), f.x), f.y); }
void main(){
  vec2 p = gl_FragCoord.xy / uRes;
  float telaAr = uRes.x / uRes.y, imgAr = uImgRes.x / uImgRes.y;
  vec2 cobre = imgAr > telaAr ? vec2(telaAr / imgAr, 1.0) : vec2(1.0, imgAr / telaAr);
  // zoom em torno do ponto de foco (push-in de macro), deriva e paralaxe pela profundidade
  vec2 q = (p - uFoco.xy) / uCam.x + uFoco.xy;
  float prof = texture(uProf, clamp(q, 0.0, 1.0)).r;
  q += (prof - 0.5) * uCam.w * uDrift;
  // boil: ondula\xE7\xE3o suave que troca a cada passo
  vec2 ruido = vec2(vn(q * 26.0 + uSeed * 1.7), vn(q * 26.0 + 17.3 + uSeed * 2.3)) - 0.5;
  q += ruido * uBoil;
  vec2 uv = (q - 0.5) * cobre + 0.5 + uCam.yz * 0.0;
  vec3 c = texture(uImg, clamp(uv, 0.0, 1.0)).rgb;
  c *= uFlick;
  vec2 d = p - 0.5; float v = smoothstep(0.95, 0.28, length(d * vec2(1.0, 0.78)) * 1.25); c *= mix(1.0 - uVinheta, 1.0, v);
  float n1 = h21(gl_FragCoord.xy * 0.73 + uSeed * 1.9) - 0.5, n2 = h21(gl_FragCoord.yx * 0.41 + uSeed * 3.3) - 0.5;
  float lum = dot(c, vec3(0.299, 0.587, 0.114)); c += (n1 + 0.5 * n2) * uGrao * (0.55 + 0.9 * (1.0 - lum));
  o = vec4(c, 1.0);
}`;function _(g){const d=document.createElement("canvas");d.width=96,d.height=170;const h=d.getContext("2d",{willReadFrequently:!0});h.drawImage(g,0,0,96,170);const w=h.getImageData(0,0,96,170).data,n=new Float32Array(16320);for(let o=0;o<16320;o++)n[o]=.299*w[o*4]+.587*w[o*4+1]+.114*w[o*4+2];let r=new Float32Array(16320);for(let o=1;o<169;o++)for(let e=1;e<95;e++){const a=n[o*96+e+1]-n[o*96+e-1],c=n[(o+1)*96+e]-n[(o-1)*96+e];r[o*96+e]=Math.hypot(a,c)}const x=(o,e)=>{const a=new Float32Array(16320),c=new Float32Array(16320);for(let t=0;t<170;t++)for(let u=0;u<96;u++){let m=0,f=0;for(let i=-e;i<=e;i++){const s=u+i;s>=0&&s<96&&(m+=o[t*96+s],f++)}c[t*96+u]=m/f}for(let t=0;t<170;t++)for(let u=0;u<96;u++){let m=0,f=0;for(let i=-e;i<=e;i++){const s=t+i;s>=0&&s<170&&(m+=c[s*96+u],f++)}a[t*96+u]=m/f}return a};for(let o=0;o<3;o++)r=x(r,5);const l=Array.from(r).sort((o,e)=>o-e),v=l[Math.floor(l.length*.05)],y=l[Math.floor(l.length*.95)]||1,p=h.createImageData(96,170);for(let o=0;o<170;o++)for(let e=0;e<96;e++){const a=o*96+e,c=F((r[a]-v)/(y-v||1)),t=e/96,u=o/170,m=Math.exp(-((t-.5)**2/.12+(u-.55)**2/.16)),f=u,i=Math.round(255*F(.5*c+.32*m+.18*f));p.data[a*4]=p.data[a*4+1]=p.data[a*4+2]=i,p.data[a*4+3]=255}return h.putImageData(p,0,0),d}function P(g,A,I){const d=new Set,h=new Map,w=n=>n*n*(3-2*n);return{desenhar(n,r,x,l,v,y,p){const o=r.e,e=o._img;if(!e)return!1;const a=g.fx;if(!a)return!1;const c=`sm-img-${r.bi}-${r.n||0}`,t=`sm-prof-${r.bi}-${r.n||0}`;if(!d.has(c)){a.subir(c,e,!0);let S=o._prof?o._prof:null;h.has(t)||h.set(t,S||_(e)),a.subir(t,h.get(t),!0),d.add(c)}const u=Math.max(.5,(y.ate??x+3)-r.t0),m=F((l-r.t0)/u),f=1.05,i=f+(o.zoom??.14),s=k(f,i,w(m)),b=Math.floor(l*v.passo+1e-6),C=(r.bi*3+(r.n||0))*.37,q=[Math.sin((l*.11+C)*6.2832)*1,Math.cos((l*.083+C)*6.2832)*.6],D=o.paralaxe??.03,M=o.foco||[.5,.45],R=1+(p(b,77)-.5)*.045*v.cintilacao;return a.rodar("sm-cena",z,{texturas:{uImg:c,uProf:t},unis:{uImgRes:[e.naturalWidth||e.width,e.naturalHeight||e.height],uCam:[s,0,0,D],uDrift:q,uFoco:[M[0],1-M[1],0],uSeed:b%997+1,uGrao:.035,uBoil:.0016*v.tremida,uFlick:R,uVinheta:.28}}),n.drawImage(g.fxc,0,0,A,I),!0}}}export{P as criarCena,_ as profundidadeAuto};
