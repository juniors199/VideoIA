/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import w from"node:fs";const a=new Set(["EBUSY","EPERM","EACCES","UNKNOWN"]),h=r=>{try{Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,r)}catch{}};function E(r,n,{tentativas:o=6,esperaMs:i=200,escrever:S=w.writeFileSync,dormir:f=h}={}){let c;for(let t=1;t<=o;t++)try{return S(r,n),r}catch(e){if(c=e,!a.has(e?.code)||t===o)throw e;f(i*2**(t-1))}throw c}export{E as gravarSeguro};
