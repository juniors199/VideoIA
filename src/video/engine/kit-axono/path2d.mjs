/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
function a(e,n,{fill:i=null,stroke:t="#222",width:o=2,preencher:r=!1}={}){const s=Array.isArray(n)?n:[n];for(const f of s){if(!f)continue;const l=new Path2D(f);r&&i&&(e.fillStyle=i,e.fill(l)),t&&(e.strokeStyle=t,e.lineWidth=o,e.stroke(l))}}export{a as desenharCaminhos};
