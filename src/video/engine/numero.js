/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const d=t=>{if(Number.isInteger(t?.casas))return Math.max(0,Math.min(3,t.casas));const e=Number(t?.valor);if(!Number.isFinite(e)||Number.isInteger(e))return 0;const[,n=""]=String(e).split(".");return Math.min(2,n.length)},s=new Map;let x="pt-BR";const F=t=>{x=t||"pt-BR",s.clear()},N=(t,e)=>{const n=d(e);return s.has(n)||s.set(n,new Intl.NumberFormat(x,{minimumFractionDigits:n,maximumFractionDigits:n,useGrouping:!0})),s.get(n).format(n?t:Math.round(t))};function v(t,e=1,n=1){const a=t?.formato==="ano",i=Number(t?.valor),c=t?.de??(a?i-12:0),u=Math.max(0,Math.min(1,Number.isFinite(e)?e:1)),m=u>=1?i:c+(i-c)*u,f=a?String(Math.round(m)):N(m,t),M=t?.prefixo||"",g=t?.sufixo||"",p=[...f].filter(o=>o>="0"&&o<="9").length,h=Math.max(0,Math.min(1,Number.isFinite(n)?n:1)),b=h>=1?p:Math.ceil(h*p-1e-9);let l=0;const r=[...M].map(o=>({c:o,aceso:!0}));for(const o of f)o>="0"&&o<="9"?(r.push(l<b?{c:o,aceso:!0}:{c:"0",aceso:!1}),l++):r.push({c:o,aceso:!0});for(const o of g)r.push({c:o,aceso:!0});return{txt:r.map(o=>o.c).join(""),partes:r}}export{d as casasDe,F as definirLocale,N as numeroBR,v as textoContador};
