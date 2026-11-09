/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const n=/Target (page, context or browser|closed)|has been closed|Page crashed|Target crashed|browser has disconnected|Browser closed/i,i=e=>/Unable to capture screenshot|captureScreenshot/i.test(String(e?.message||e))&&!n.test(String(e?.message||e));async function l(e,{obrigatoria:s=!1,esperaMs:a=400,pausa:c=t=>new Promise(r=>setTimeout(r,t))}={}){let t;for(let r=0;r<2;r++)try{return await e()}catch(o){if(t=o,!i(o))throw o;await c(a)}if(s)throw t;return null}export{l as capturaTolerante,i as foiSoUmaFoto};
