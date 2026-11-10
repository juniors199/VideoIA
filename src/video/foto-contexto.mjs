/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const a=o=>String(o??"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim();function i(o){const t=String(o??"").trim();return/^(revista|jornal|livro|obra|artigo|site|portal|canal|programa|filme|serie|série)\s+\S/i.test(t)?"publicacao":/^[A-ZÇÃÕ]{3,8}$/.test(t)?"sigla":t.split(/\s+/).length===1?"solto":"nome"}const c=/\b(banda|band|cantor|cantora|singer|m[uú]sic|music|rapper|[aá]lbum|album|nação zumbi|futebolista|footballer|pol[ií]tic|ator|atriz|actor|actress|jogador|born)\b/i;function u(o,t={},{contexto:e=""}={}){const r=i(o),s=`${t.titulo||""} ${t.descricao||""} ${t.tags||""}`;if(r==="publicacao"&&c.test(s)||r==="sigla"&&!e)return!1;if(r==="solto"&&t.tituloArtigo!=null){const n=a(String(t.tituloArtigo).replace(/\(.*?\)/g,"")),l=a(o);if(n.startsWith(`${l} `))return!1}return!0}const g=(o,{contexto:t=""}={})=>!(i(o)==="sigla"&&!t),f=o=>!["solto","sigla"].includes(i(o));export{g as buscaPermitida,f as fonteLivreServe,u as fotoCombina,a as slugFoto,i as tipoDoTermo};
