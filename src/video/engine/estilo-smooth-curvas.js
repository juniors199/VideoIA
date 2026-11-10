/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const p={fluida:[.65,0,.2,1],easy:[.33,0,.67,1],pousa:[.5,0,.1,1],macia:[.45,0,.3,1],arranca:[.1,.6,.3,1]},h=new Map;function M(t="fluida"){if(h.has(t))return h.get(t);const[o,s,e,u]=p[t]||p.fluida,n=400,c=new Float64Array(n+1),A=r=>3*(1-r)*(1-r)*r*o+3*(1-r)*r*r*e+r*r*r,b=r=>3*(1-r)*(1-r)*r*s+3*(1-r)*r*r*u+r*r*r;for(let r=1;r<n;r++){const i=r/n;let a=0,f=1;for(let y=0;y<40;y++){const l=(a+f)/2;A(l)<i?a=l:f=l}c[r]=b((a+f)/2)}c[n]=1;const d=r=>{if(r<=0)return 0;if(r>=1)return 1;const i=r*n,a=Math.floor(i);return c[a]+(c[a+1]-c[a])*(i-a)};return h.set(t,d),d}const w={linear:t=>t,seco:t=>1-(1-t)**4,sai:t=>t**3,pousoCorte:t=>1-(1-t)**3,elastico:t=>t<=0?0:t>=1?1:2**(-10*t)*Math.sin((t*10-.75)*(2*Math.PI)/3.4)+1,seno:t=>-(Math.cos(Math.PI*t)-1)/2};function C(t){if(typeof t=="function")return t;if(!t)return M("fluida");if(p[t])return M(t);const o=/^passos\((\d+)\)$/.exec(t);if(o){const s=+o[1];return e=>e>=1?1:Math.floor(e*s)/s}return w[t]||M("fluida")}const E=(t,o=0,s=1)=>t<o?o:t>s?s:t;export{p as CURVAS_AE,M as curva,C as ease,E as limita};
