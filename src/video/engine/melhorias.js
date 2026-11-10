/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const r=["padrao","editorial","minimalista","papel"],s=["legendaNumero","legendaCorte","numeroFixo","cauda","fotoTeto","tituloCurto","abertura","cenarioPorTema","fases","entradas","respiros","fecho","veuTopo","ganchoInteiro","tituloSentido","vazaProporcional","centroTela","entradaInteira","escalaPapel","variedadeEntradas","cresceSuave","capaNitida"];function i(e,a,o){return!e?.reels0612||e[a]===!1?!1:o===void 0||r.includes(o||"padrao")}const t=new Set(["a","o","as","os","um","uma","uns","umas","de","do","da","dos","das","em","no","na","nos","nas","e","ou","que","com","por","para","pra","ao","aos","se","mas","\xE9","foi","era","the","of","and","el","la","los","las","y"]),n=e=>String(e).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""),d=e=>e.map(a=>n(a.w??a).replace(/[^a-z0-9%$]/g,"")).filter(a=>a&&!t.has(a));export{r as ESTILOS_0612,t as FRACAS_PT,s as MELHORIAS_0612,d as conteudo,i as melhoria,n as semAcento};
