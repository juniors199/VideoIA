/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const t=2.8;function o(a){const e=Math.max(0,Math.round(Number(a)||0));return e<60?`${e} s`:`${Math.floor(e/60)} min ${String(e%60).padStart(2,"0")} s`}function r(a){if(!(a>90))return null;const e=o(a);return a>240?`este v\xEDdeo tem ${e}. Funciona como v\xEDdeo longo; para ele ficar leve de assistir, ponha uma virada visual a cada cap\xEDtulo. Antes de postar, confira o limite de tempo da rede escolhida (Reels, Shorts e TikTok t\xEAm limites diferentes).`:`este v\xEDdeo tem ${e}. No Reels e no TikTok a reten\xE7\xE3o costuma cair depois do primeiro minuto, ent\xE3o vale uma virada a cada ~45 s; confira tamb\xE9m o limite de tempo da rede antes de postar.`}export{t as PALAVRAS_POR_SEGUNDO,o as formatarDuracao,r as notaDuracao};
