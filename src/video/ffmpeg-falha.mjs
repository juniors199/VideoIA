/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
function i(s,e="ffmpeg falhou"){const n=s?.status??"desconhecido",t=s?.signal?`, sinal ${s.signal}`:"",a=String(s?.stderr||s?.error?.message||"").trim().slice(0,400)||"sem mensagem";return`${e} (c\xF3digo de sa\xEDda ${n}${t}): ${a}`}export{i as mensagemFfmpeg};
