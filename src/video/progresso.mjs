/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const n=()=>process.env.ILU_PROGRESSO==="1";function s(o){n()&&console.log(`  [progresso] ${o}`)}function t(o){const r=Date.now();return(e="")=>s(`${o}: ${((Date.now()-r)/1e3).toFixed(1)} s${e?` (${e})`:""}`)}export{t as cronometro,s as progresso,n as progressoLigado};
