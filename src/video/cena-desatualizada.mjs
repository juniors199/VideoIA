/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
function i(a,e){return!a||!Array.isArray(a.beats)||!a.beats.length||!(e>0)?!1:Number.isInteger(a.nPalavras)?a.nPalavras===e&&n(a.beats,e):n(a.beats,e)}function n(a,e){let s=-1;for(const o of a){const r=o?.palavras;if(!Array.isArray(r)||r.length!==2||!r.every(Number.isInteger)||r[0]<0||r[1]<r[0]||r[1]>=e||r[0]<=s)return!1;s=r[1]}return s===e-1}function t(a,{nPal:e,automatica:s,guardada:o=null}={}){return!s&&i(a,e)?{acao:"manter",aviso:"A narra\xE7\xE3o mudou um pouco desde que as cenas foram escritas (mesmo n\xFAmero de palavras). As cenas continuam batendo com a fala e foram mantidas."}:s?{acao:"refazer",aviso:"O roteiro mudou depois das cenas autom\xE1ticas: refiz as cenas sozinho para acompanhar a fala nova."}:{acao:"refazer",aviso:`O roteiro mudou depois que as cenas foram escritas, e elas n\xE3o batiam mais com a fala. Para o v\xEDdeo n\xE3o parar, refiz as cenas sozinho pelo plano autom\xE1tico${o?`; as cenas antigas ficaram guardadas em ${o}`:""}. Se quiser cenas sob medida de novo, pe\xE7a ao assistente: "refa\xE7a as cenas do v\xEDdeo".`}}export{i as cenaAindaServe,t as decidirCenaDesatualizada};
