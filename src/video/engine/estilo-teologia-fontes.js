/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const e=[{familia:"TeoLora",arquivo:"lora.ttf",peso:"400 700",estilo:"normal"},{familia:"TeoLoraI",arquivo:"lora-italico.ttf",peso:"400 700",estilo:"italic"},{familia:"TeoCinzel",arquivo:"cinzel.ttf",peso:"400 900",estilo:"normal"},{familia:"TeoCinzelD",arquivo:"cinzel-decorativo.ttf",peso:"700",estilo:"normal"},{familia:"TeoGrego",arquivo:"ebgaramond.ttf",peso:"400 800",estilo:"normal"},{familia:"TeoHebraico",arquivo:"frankruhl.ttf",peso:"300 900",estilo:"normal"}],i=e.map(o=>`@font-face{font-family:'${o.familia}';font-weight:${o.peso};font-style:${o.estilo};src:url(/fonts/${o.arquivo}) format('truetype')}`).join(""),a=["400 40px TeoLora","600 40px TeoLora","700 40px TeoLora","italic 400 40px TeoLoraI","italic 600 40px TeoLoraI","500 40px TeoCinzel","600 40px TeoCinzel","700 40px TeoCinzel","700 40px TeoCinzelD","400 40px TeoGrego","400 40px TeoHebraico","700 40px TeoHebraico"],t=o=>/[Ͱ-Ͽἀ-῿]/.test(o)?"grego":/[֐-׿]/.test(o)?"hebraico":"latim";export{a as CARREGAR_FONTES_TEOLOGIA,i as CSS_FONTES_TEOLOGIA,e as FONTES_TEOLOGIA,t as escritaDe};
