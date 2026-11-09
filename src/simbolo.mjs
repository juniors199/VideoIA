/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const f=(e,{tamanho:s=512,haste:l="#FFFFFF"}={})=>`
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">
  <rect x="196" y="226" width="120" height="260" rx="60" fill="${l}"/>
  <circle cx="256" cy="116" r="62" fill="${e}"/>
</svg>`,g=(e,{tamanho:s=512,haste:l="#FFFFFF",fonte:o=null}={})=>{const t=e&&e.simbolo;if(!t||t.tipo!=="monograma")return f(e.destaque,{tamanho:s,haste:l});const i=c=>String(c).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),r=o?`<style>@font-face{font-family:'IluD';font-weight:200 800;src:url(data:font/woff2;base64,${o}) format('woff2')}</style>`:"";return`
<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 512 512">${r}
  <text x="${t.x}" y="${t.y}" font-family="IluD, 'Bricolage Grotesque', sans-serif" font-weight="800" font-size="${t.fs}" style="font-variation-settings:'opsz' 96" fill="${l}">${i(t.letra)}</text>
  <circle cx="${t.cx}" cy="${t.cy}" r="${t.r}" fill="${e.destaque}"/>
</svg>`};export{f as simbolo,g as simboloDa};
