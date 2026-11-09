/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{AREA_SEGURA as u,foraDaArea as c}from"./area-segura.mjs";function f(t){const n=[],a=new Set,e=(r,s)=>{for(const o of r||[]){if(!o||!Number.isFinite(o.x0)||!(o.x1>o.x0)||o.decor||o.livreArea)continue;const i=[o.x0,o.y0,o.x1,o.y1].map(Math.round).join(",");a.has(i)||(a.add(i),n.push({oque:o.forma||s,x0:o.x0,y0:o.y0,x1:o.x1,y1:o.y1}))}};return e(t?.areaSegura,"texto"),e((t?.titulos||[]).filter(r=>r.vis!==null),"t\xEDtulo"),e(t?.textos,"texto"),e(t?.rotulos,"r\xF3tulo"),e(t?.contadores,"n\xFAmero"),e(t?.pilulasM3,"bot\xE3o do fecho"),e(t?.botoes,"bot\xE3o"),t?.legenda&&e([t.legenda],"legenda"),t?.arroba&&e([t.arroba],"@ do perfil"),n}function l(t,n=u){const a=[];for(const e of f(t)){const r=c(e,n);r&&a.push({oque:e.oque,msg:`${e.oque}: ${r}`,caixa:e})}return a}export{f as caixasDeInformacao,l as foraDaAreaSegura};
