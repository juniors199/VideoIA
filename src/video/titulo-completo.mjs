/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{FRACAS_IDIOMA as g}from"../idioma.mjs";const c=n=>String(n).replace(/[.,:;!?…]+$/g,""),f=Object.fromEntries(Object.entries(g).map(([n,s])=>[n,new Set(s)])),$=(n,s="pt")=>(f[s]||f.pt).has(c(n).toLowerCase());function A(n,s="pt",r=40,l=8){const m=e=>/[.!?]$/.test(e);let t=[];for(const e of n)if(t.push(e),m(e))break;const p=e=>e.map(o=>o.replace(/[.,:;!?]$/,"")).join(" ").length,h=e=>$(e.replace(/[.,:;!?]$/,""),s)||["ser","pode","n\xE3o","nao","\xE9","foi","vai","est\xE1","tem","faz","precisa"].includes(c(e).toLowerCase());if(t.length>l||p(t)>r){let e=Math.min(t.length,l);for(;e>3&&p(t.slice(0,e))>r;)e--;const o=t.slice(0,e).map(i=>/[,;:]$/.test(i)).lastIndexOf(!0);o>=2&&(e=o+1),t=t.slice(0,e)}for(;t.length>2&&h(t.at(-1))&&!/[,;:.!?]$/.test(t.at(-1));)t.pop();t.length>4&&/^(que|quem|onde|e|ou|mas)$/i.test(c(t.at(-2)))&&!/[,;:.!?]$/.test(t.at(-1))&&t.splice(-2);const a=t.map(e=>e.replace(/[.,:;!?]$/,"")),u=a.reduce((e,o,i)=>o.length>a[e].length?i:e,0);return a.map((e,o)=>o===u?`*${e}*`:e).join(" ")}export{A as tituloCompleto};
