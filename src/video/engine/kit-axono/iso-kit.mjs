/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const pt=45,ht=30,mt=4,B=Math.PI/180,nt=Math.sqrt(1.6);function H({scale:t,azimuth:o=45,elevation:a=30}){const n=o*B,e=a*B;return{sinA:Math.sin(n),cosA:Math.cos(n),sinE:Math.sin(e),cosE:Math.cos(e),k:t*nt}}function M([t,o,a],n){const{origin:e}=n,{sinA:s,cosA:i,sinE:r,cosE:l,k:c}=H(n);return[e[0]+(t*s-o*i)*c,e[1]+((t*i+o*s)*r-a*l)*c]}function F(t){const{sinA:o,cosA:a}=H(t);return[a,o]}function et([t,o,a],n){const{sinA:e,cosA:s,sinE:i,cosE:r}=H(n);return(t*s+o*e)*r+a*i}const I=t=>{const o=(Math.round(t*10)/10).toFixed(1).replace(/\.0$/,"");return o==="-0"?"0":o};function $(t,o=!1){return t.length?t.map(([a,n],e)=>`${e?"L":"M"}${I(a)} ${I(n)}`).join("")+(o?"Z":""):""}const ut=t=>t.filter(Boolean).join("");function st({x:t,y:o,w:a,d:n,r:e},s=8){const i=Math.max(0,Math.min(e,a/2,n/2)),r=[[t+a-i,o+i,-90],[t+a-i,o+n-i,0],[t+i,o+n-i,90],[t+i,o+i,180]],l=[];for(const[c,p,h]of r){const d=i>0?s:0;for(let x=0;x<=d;x++){const m=(h+(d?90*x/d:45))*B;l.push([c+i*Math.cos(m),p+i*Math.sin(m)])}}return l}function G(t){let o=0;for(let a=0;a<t.length;a++){const[n,e]=t[a],[s,i]=t[(a+1)%t.length];o+=n*i-s*e}return o/2}const D=t=>G(t)<0?[...t].reverse():t;function it(t){const o=[...t].sort((s,i)=>s[0]-i[0]||s[1]-i[1]);if(o.length<3)return o;const a=(s,i,r)=>(i[0]-s[0])*(r[1]-s[1])-(i[1]-s[1])*(r[0]-s[0]),n=[];for(const s of o){for(;n.length>=2&&a(n[n.length-2],n[n.length-1],s)<=0;)n.pop();n.push(s)}const e=[];for(let s=o.length-1;s>=0;s--){const i=o[s];for(;e.length>=2&&a(e[e.length-2],e[e.length-1],i)<=0;)e.pop();e.push(i)}return[...n.slice(0,-1),...e.slice(0,-1)]}function Z(t,o){const a=t.length,n=[],e=t.findIndex((i,r)=>i!==t[(r+a-1)%a]);if(e<0)return t[0]===o?[Array.from({length:a+1},(i,r)=>r%a)]:[];let s=null;for(let i=0;i<a;i++){const r=(e+i)%a;t[r]===o?(s||(s=[r]),s.push((r+1)%a)):s&&(n.push(s),s=null)}return s&&n.push(s),n}function K(t,o,a,n,e={}){const s=e.convex??!0,i=t.length,r=G(t)>0,[l,c]=F(n),{sinA:p,cosA:h}=H(n),d=t.map(([g,v],b)=>{const[A,j]=t[(b+1)%i],E=A-g,O=j-v,S=Math.hypot(E,O)||1;return r?[O/S,-E/S]:[-O/S,E/S]}),x=d.map(([g,v])=>g*l+v*c>1e-9),m=t.map(([g,v])=>M([g,v,o+a],n)),y=t.map(([g,v])=>M([g,v,o],n)),f=[],u=[];for(const g of Z(x,!1))f.push($(g.map(v=>m[v])));for(const g of Z(x,!0))u.push($(g.map(v=>m[v]))),a>0&&f.push($(g.map(v=>y[v])));if(a>0)for(let g=0;g<i;g++)x[(g+i-1)%i]!==x[g]&&f.push($([m[g],y[g]]));let k;if(s)k=$(it([...m,...y]),!0);else{const g=[$(D(m),!0),$(D(y),!0)];for(let v=0;v<i;v++){if(!x[v])continue;const b=(v+1)%i;g.push($(D([m[v],m[b],y[b],y[v]]),!0))}k=g.join("")}const w=Array.from({length:4},()=>[]);if(a>0){const[g,v]=[-p,h];for(let b=0;b<i;b++){if(!x[b])continue;const[A,j]=d[b],E=(A*g+j*v+1)/2,O=Math.min(3,Math.max(0,Math.floor(E*4))),S=(b+1)%i;w[O].push($(D([m[b],m[S],y[S],y[b]]),!0))}}let T;if(e.bevel&&e.bevel>0){const g=e.bevel,b=t.map(([A,j],E)=>{const[O,S]=d[(E+i-1)%i],[V,ot]=d[E],W=O+V,Y=S+ot,J=Math.hypot(W,Y)||1;return[A-W/J*g,j-Y/J*g]}).map(([A,j])=>M([A,j,o+a],n));T=Z(x,!0).map(A=>$([m[A[0]],...A.slice(1,-1).map(j=>b[j]),m[A[A.length-1]]])).join("")}return{fill:k,outline:f.join(""),crease:u.join(""),top:$(D(m),!0),shades:w.map(g=>g.join("")),bevel:T}}const R=(t,o=8)=>st(t,o);function rt(t,o,a,n,e=8,s=0){return K(R(t,e),o,a,n,{convex:!0,bevel:s})}function N(t,o,a,n=40){return Array.from({length:n},(e,s)=>{const i=s/n*Math.PI*2;return[t+a*Math.cos(i),o+a*Math.sin(i)]})}function xt(t,o,a,n,e,s,i=32,r=0){return K(N(t,o,a,i),n,e,s,{convex:!0,bevel:r})}const yt=({x:t,y:o,w:a,d:n,r:e},s)=>({x:t+s,y:o+s,w:a-s*2,d:n-s*2,r:Math.max(0,e-s)});function q(t,o,a,n=!1){return $(t.map(([e,s])=>M([e,s,o],a)),n)}const gt=(t,o,a,n=8)=>q(R(t,n),o,a,!0),Q=(t,o,a,n)=>q([t,o],a,n),z=(t,o,a)=>$([M(t,a),M(o,a)]),vt=(t,o,a,n)=>z([t[0],t[1],o],[t[0],t[1],a],n),$t=(t,o,a,n,e,s=40)=>q(N(t,o,a,s),n,e,!0),kt=(t,o)=>t.map(a=>M(a,o));function bt(t,o,a,n,e,s,i){const r=[];for(let l=0;l<n;l++)for(let c=0;c<a;c++)r.push(M([t+c*e,o+l*e,s],i));return r}function Mt({x:t,y:o,w:a,d:n},e=0){return[[t+e,o+e],[t+a-e,o+e],[t+e,o+n-e],[t+a-e,o+n-e]]}function wt({x:t,y:o,w:a,d:n},e,s){const i=[];for(const r of[t,t+a])for(const l of[o,o+n])for(const c of[e,s])i.push([r,l,c]);return i}function At(t,o,a,n,e,s,i,r=.4){const[l,c]=F(i),p=[];for(let h=0;h<s;h++){const d=h/s*Math.PI*2,x=Math.cos(d),m=Math.sin(d);x*l+m*c<.15||p.push(z([t+a*x,o+a*m,n+r],[t+a*x,o+a*m,e-r],i))}return p.join("")}function St(t,o,a,n,e,s=24){const[i,r]=F(e),l=Math.atan2(r,i),c=[];for(let p=0;p<=s;p++){const h=l-Math.PI/2+p/s*Math.PI;c.push(M([t+a*Math.cos(h),o+a*Math.sin(h),n],e))}return $(c)}function lt(t,o,a){const n=t.length,e=G(t)>0,[s,i]=F(a),r=t.map(([l,c],p)=>{const[h,d]=t[(p+1)%n],x=h-l,m=d-c,[y,f]=e?[m,-x]:[-m,x];return y*s+f*i>1e-9});return Z(r,!0).map(l=>$(l.map(c=>M([t[c][0],t[c][1],o],a)))).join("")}const jt=(t,o,a,n=8)=>lt(R(t,n),o,a);function It(t,o,a,n,e=20){const[s,i,r]=t,l=[];for(let c=0;c<e;c++){const p=c/e*Math.PI*2,h=o*Math.cos(p),d=o*Math.sin(p);l.push(M(a==="x"?[s,i+h,r+d]:[s+h,i,r+d],n))}return $(l,!0)}function Et(t,o,a,n,e,s,i,r=16){const l=Math.max(1,Math.round(e*r)),c=[],p=[];let h=[],d=null;for(let x=0;x<=l;x++){const m=x/l,y=m*e*Math.PI*2,f=n*Math.cos(y),u=n*Math.sin(y),k=t+(o-t)*m,w=s==="x"?[k,a[0]+f,a[1]+u]:[a[0]+f,k,a[1]+u],T=s==="x"?[0,Math.cos(y),Math.sin(y)]:[Math.cos(y),0,Math.sin(y)],g=et(T,i)>0,v=M(w,i);if(d===null&&(d=g),g!==d){h.push(v),(d?p:c).push($(h)),h=[v],d=g;continue}h.push(v)}return h.length>1&&(d?p:c).push($(h)),{back:c.join(""),front:p.join("")}}function Ot(t,o,a,n,e,s,i,r,l="x"){const c=[],p=[],h=Math.ceil(t/a)*a;for(let d=h,x=Math.round(h/a);d<=o+1e-9;d+=a,x++){const m=x%n===0,y=m?i[1]:i[0],f=l==="x"?[d,e]:[e,d],u=l==="x"?[d,e+y]:[e+y,d];(m?p:c).push(Q(f,u,s,r))}return{minor:c.join(""),major:p.join("")}}function Tt(t,o,a,n,e,s,i,r,l="x"){const c=[],p=[],h=Math.ceil(t/a)*a;for(let d=h,x=Math.round(h/a);d<=o+1e-9;d+=a,x++){const m=x%n===0,y=m?i[1]:i[0],f=l==="x"?[d,e,s]:[e,d,s],u=l==="x"?[d,e,s-y]:[e,d,s-y];(m?p:c).push(z(f,u,r))}return{minor:c.join(""),major:p.join("")}}function Pt(t,o,a,n,e,s,i,r,l=0,c=Math.PI*2){const p=[],h=[],x=Math.abs(c-Math.PI*2)<1e-9?n:n+1;for(let m=0;m<x;m++){const y=l+m/n*c,f=m%e===0,u=a-(f?i[1]:i[0]),k=Math.sin(y),w=-Math.cos(y);(f?h:p).push(Q([t+k*u,o+w*u],[t+k*a,o+w*a],s,r))}return{minor:p.join(""),major:h.join("")}}const _t=(t,o,a,n)=>rt(t,o,a,n).fill;function ct(t,[o,a,n]){const e=M([0,0,0],t),s=M([o,a,n],t);return[s[0]-e[0],s[1]-e[1]]}const X=t=>Math.round(t*100)/100;function Ht(t,o){const[a,n]=ct(t,o);return`translate(${X(a)} ${X(n)})`}const P=t=>Math.round(t*1e3)/1e3;function tt(t,o,a){const n=M([t[0],t[1],o],a),e=s=>{const[i,r]=M(s,a);return[i-n[0],r-n[1]]};return{origin:n,x:e([t[0]+1,t[1],o]),y:e([t[0],t[1]+1,o]),z:e([t[0],t[1],o+1])}}const C=(t,o,a)=>`matrix(${P(t[0])} ${P(t[1])} ${P(o[0])} ${P(o[1])} ${P(a[0])} ${P(a[1])})`;function Dt(t,[o,a]){const n=o||a?`translate(${-o} ${-a})`:"";t.querySelectorAll("[data-hold]").forEach(e=>n?e.setAttribute("transform",n):e.removeAttribute("transform"))}function Ut(t,o,a,n="x"){const{origin:e,x:s,y:i}=tt(t,o,a);return n==="x"?C(s,i,e):C([-i[0],-i[1]],s,e)}function Ft(t,o,a,n){const{origin:e,x:s,y:i,z:r}=tt(t,o,a),l=[-r[0],-r[1]];return C(n==="left"?s:[-i[0],-i[1]],l,e)}function Zt(t,o){const{cosE:a,k:n}=H(o);return t*a*n}function Ct(t,o,a,{pad:n=24,headroom:e=0,azimuth:s=45,elevation:i=30}={}){const r={origin:[0,0],scale:1,azimuth:s,elevation:i},l=t.map(f=>M(f,r)),c=l.map(([f])=>f),p=l.map(([,f])=>f),h=Math.min(...c),d=Math.max(...c),x=Math.min(...p),m=Math.max(...p),y=Math.min((o-n*2)/(d-h),(a-n*2-e)/(m-x));return{origin:[o/2-(h+d)/2*y,e+(a-e)/2-(x+m)/2*y],scale:y,azimuth:s,elevation:i}}const _=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),U=t=>Object.entries(t).filter(([,o])=>o!==void 0&&o!==!1).map(([o,a])=>` ${o}="${_(String(a))}"`).join("");function Lt(t,{tone:o="hi",crease:a="faint",halo:n=!1,lit:e=!1,flat:s=!1,className:i,inner:r=""}={}){const l=[];return n&&l.push(`<path class="iso-halo" d="${t.fill}"/>`),l.push(`<path class="iso-fill" d="${t.fill}"/>`),s||(t.shades.forEach((c,p)=>{c&&l.push(`<path class="iso-shade" data-shade="${p}" d="${c}"/>`)}),l.push(`<path class="iso-top" d="${t.top}"/>`)),a!=="none"&&t.crease&&l.push(`<path class="iso-line iso-crease" data-tone="${a}" d="${t.crease}"/>`),a!=="none"&&t.bevel&&l.push(`<path class="iso-line iso-bevel" data-tone="${a}" d="${t.bevel}"/>`),r&&l.push(r),l.push(`<path class="iso-line iso-edge" data-tone="${o}" d="${t.outline}"/>`),`<g${U({class:i?`iso-solid ${i}`:"iso-solid","data-lit":e?"":void 0,"data-seamless":t.seamless?"":void 0})}>${l.join("")}</g>`}function L(t,{tone:o="lo",dotted:a=!1,dashed:n=!1,flow:e=!1,className:s,free:i}={}){return t?`<path${U({class:s?`iso-line ${s}`:"iso-line","data-tone":o,"data-free":i===!0?"":i||void 0,"data-dotted":a?"":void 0,"data-dashed":n?"":void 0,"data-flow":e?"":void 0,d:t})}/>`:""}function Vt(t,{size:o=.5,tone:a="mid",pulse:n=!1}={}){const e=t.map(([s,i,r],l)=>`<circle cx="${I(s)}" cy="${I(i)}" r="${o}"${r!==void 0&&r<1?` fill-opacity="${Math.max(0,r).toFixed(2)}"`:""}${n?` data-pulse="" style="--pulse-at:${l*137%1600}ms"`:""}/>`).join("");return`<g class="iso-dots" data-tone="${a}">${e}</g>`}function Bt(t,o={}){const a=new Map;for(const n of t){const[e,s]=Array.isArray(n)?n:[n.d,n.alpha];if(!e||!(s>.02))continue;const i=Math.min(1,Math.round(s*20)/20);a.set(i,(a.get(i)??"")+e)}return[...a].map(([n,e])=>n>=1?L(e,o):`<g opacity="${n.toFixed(2)}">${L(e,o)}</g>`).join("")}function Gt(t,{fade:o=[0,0],tone:a="lo",className:n,stops:e=6}={}){if(t.length<2)return"";const s=f=>f*f*(3-2*f),i=f=>{let u=2166136261;for(let k=0;k<f.length;k++)u=Math.imul(u^f.charCodeAt(k),16777619);return(u>>>0).toString(36)},r=[0];for(let f=1;f<t.length;f++)r.push(r[f-1]+Math.hypot(t[f][0]-t[f-1][0],t[f][1]-t[f-1][1]));const l=f=>{let u=1;for(;u<t.length-1&&r[u]<f;)u++;const k=r[u]-r[u-1]||1,w=Math.max(0,Math.min(1,(f-r[u-1])/k));return[t[u-1][0]+(t[u][0]-t[u-1][0])*w,t[u-1][1]+(t[u][1]-t[u-1][1])*w]},c=(f,u)=>[l(f),...t.filter((k,w)=>r[w]>f+1e-6&&r[w]<u-1e-6),l(u)],p=r[r.length-1];if(p<1e-6)return"";let[h,d]=Array.isArray(o)?o:[o,o];if(h+d>p){const f=p/(h+d);h*=f,d*=f}const x=`var(--anatomy-${a})`,m=(f,u)=>{const k=$(f),[w,T]=f[0],[g,v]=f[f.length-1],b=`iso-fade-${i(`${k}|${a}|${u}`)}`,A=Array.from({length:e+1},(E,O)=>{const S=O/e,V=s(u?S:1-S);return`<stop offset="${S.toFixed(3)}" stop-opacity="${V.toFixed(3)}" style="stop-color:${x}"/>`}).join("");return`<defs>${`<linearGradient id="${b}" gradientUnits="userSpaceOnUse" x1="${I(w)}" y1="${I(T)}" x2="${I(g)}" y2="${I(v)}">${A}</linearGradient>`}</defs><path${U({class:n?`iso-line ${n}`:"iso-line","data-tone":a,"data-free":u?"start":"end",d:k,style:`stroke:url(#${b})`})}/>`},y=[];return h>.05&&y.push(m(c(0,h),!0)),p-d-h>.05&&y.push(L($(c(h,p-d)),{tone:a,className:n})),d>.05&&y.push(m(c(p-d,p),!1)),`<g class="iso-fade">${y.join("")}</g>`}function Rt(t,o,{via:a=[],tone:n="lo",dotted:e=!1,dashed:s=!1,flow:i=!1,ends:r="both",size:l=1.2}={}){const c=$([t,...a,o]),p=([h,d])=>`<circle class="iso-wire-end" cx="${I(h)}" cy="${I(d)}" r="${l}"/>`;return`<g class="iso-wire" data-tone="${n}">${L(c,{tone:n,dotted:e,dashed:s,flow:i})}${r==="both"||r==="from"?p(t):""}${r==="both"||r==="to"?p(o):""}</g>`}function qt(t,o,{size:a=3,tone:n="mid",anchor:e="start"}={}){return`<text class="iso-face-text" data-tone="${n}" transform="${t}" font-size="${a}" text-anchor="${e}">${_(o)}</text>`}function zt(t,o={}){return`<g${U(o)}>${Array.isArray(t)?t.join(""):t}</g>`}function Wt({width:t,height:o,label:a,body:n,standalone:e=!1,className:s}){const i=e?`<style>${at}</style>`:"";return`<svg${U({xmlns:"http://www.w3.org/2000/svg",class:`iso-svg${e?" iso":""}${s?` ${s}`:""}`,"data-theme":e||void 0,viewBox:`0 0 ${t} ${o}`,role:"img","aria-label":a})}>${i}${Array.isArray(n)?n.join(""):n}</svg>`}function dt(t){return t==="raised"||t==="flat"||t==="lit"?`<svg class="iso-swatch" data-mark="${t}" viewBox="0 0 16 10" aria-hidden="true"><path d="${t==="flat"?"M2 6.5 8 3.5 14 6.5 8 9.5Z":"M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z"}"/>${t==="flat"?"":'<path class="iso-swatch-crease" d="M2 4.5 8 7.5 14 4.5"/>'}</svg>`:`<svg class="iso-swatch" data-mark="${t}" viewBox="0 0 16 10" aria-hidden="true"><path d="M1.5 5h13"/></svg>`}function Yt({fig:t,title:o,hint:a,readout:n="",keys:e=[],caption:s,body:i}){const r=(c,p,h="")=>`<span class="iso-plate-corner" data-corner="${c}"${h}>${_(p)}</span>`,l=e.length||s?`<figcaption class="iso-legend">${e.length?`<span class="iso-keys">${e.map(c=>`<span class="iso-key">${dt(c.mark)}${_(c.label)}</span>`).join("")}</span>`:""}${s?`<span class="iso-caption">${_(s)}</span>`:""}</figcaption>`:"";return`<figure class="iso-figure"><div class="iso-plate"><div class="iso-plate-corners" aria-hidden="true">${r("fig",t)}${o?r("title",o):""}${a?r("hint",a):""}${r("readout",n," data-readout")}</div>${i}</div>${l}</figure>`}function Jt({title:t,theme:o="dark",body:a,script:n="",width:e=650}){return`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${_(t)}</title><style>${at}${ft.replace("__WIDTH__",String(e))}</style></head><body class="iso" data-theme="${o}"><main class="iso-page">${a}</main>${n?`<script type="module">${n.replace(/<\/(script)/gi,"<\\/$1")}</script>`:""}</body></html>`}const ft=`
*{box-sizing:border-box}
html{color-scheme:dark}
body[data-theme="light"]{color-scheme:light}
body{margin:0;background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:min(__WIDTH__px,100% - 32px);margin:64px auto 96px}
`,at=`
.iso{
  --anatomy-page:#0b0b0b;--anatomy-card:#131313;--anatomy-text:#a3a3a3;--anatomy-strong:#e6e6e6;--anatomy-muted:#6e6e6e;
  --anatomy-paper:#131313;--anatomy-face:#1b1b1b;--anatomy-top:#1c1c1c;
  --anatomy-shade-0:#0f0f0f;--anatomy-shade-1:#121212;--anatomy-shade-2:#151515;--anatomy-shade-3:#181818;
  --anatomy-lit-top:#262626;--anatomy-lit-shade:#1d1d1d;
  --anatomy-hi:#d4d4d4;--anatomy-mid:#6a6a6a;--anatomy-lo:#3e3e3e;--anatomy-faint:#2a2a2a;--anatomy-lit:#ffffff;
  --anatomy-halo:#050505;--anatomy-halo-opacity:.9;--anatomy-dot:#e6e6e6;
  --anatomy-red:#ff6b6b;--anatomy-green:#6be0a0;--anatomy-blue:#6b9bff;
  --anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);
  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --anatomy-lift:inset 0 1px 0 0 #ffffff0a,inset 0 0 0 1px #ffffff06,0 0 0 1px #00000026,0 1px 1px -.5px #00000014,0 3px 3px -1.5px #00000014,0 6px 6px -3px #00000014,0 12px 12px -6px #00000014;
}
.iso[data-theme="light"]{
  --anatomy-page:#f2f2ef;--anatomy-card:#fbfbfa;--anatomy-text:#57575a;--anatomy-strong:#18181a;--anatomy-muted:#8c8c90;
  --anatomy-paper:#fbfbfa;--anatomy-face:#ffffff;--anatomy-top:#ffffff;
  --anatomy-shade-0:#dcdcd9;--anatomy-shade-1:#e5e5e2;--anatomy-shade-2:#ededea;--anatomy-shade-3:#f4f4f1;
  --anatomy-lit-top:#ffffff;--anatomy-lit-shade:#eeeeeb;
  --anatomy-hi:#26262a;--anatomy-mid:#8a8a8f;--anatomy-lo:#b4b4b8;--anatomy-faint:#d4d4d6;--anatomy-lit:#000000;
  --anatomy-halo:#8a8a80;--anatomy-halo-opacity:.32;--anatomy-dot:#3a3a3e;
  --anatomy-red:#e5484d;--anatomy-green:#30a46c;--anatomy-blue:#3e63dd;
  --anatomy-lift:inset 0 1px 0 0 #ffffff,0 0 0 1px #0000000f,0 1px 1px -.5px #0000000a,0 3px 3px -1.5px #0000000a,0 6px 6px -3px #0000000a,0 12px 12px -6px #0000000a;
}
.iso-svg{display:block;width:100%;height:auto;overflow:visible}
.iso-svg path,.iso-svg circle{vector-effect:non-scaling-stroke}
.iso-fill{fill:var(--anatomy-paper);stroke:none}
.iso-solid[data-lit]>.iso-fill{fill:var(--anatomy-face)}
.iso-shade,.iso-top{stroke:none}
.iso-shade[data-shade="0"]{fill:var(--anatomy-shade-0)}
.iso-shade[data-shade="1"]{fill:var(--anatomy-shade-1)}
.iso-shade[data-shade="2"]{fill:var(--anatomy-shade-2)}
.iso-shade[data-shade="3"]{fill:var(--anatomy-shade-3)}
.iso-top{fill:var(--anatomy-top)}
.iso-solid[data-lit]>.iso-top{fill:var(--anatomy-lit-top)}
.iso-solid[data-lit]>.iso-shade{fill:var(--anatomy-lit-shade)}
.iso-solid[data-seamless]>.iso-shade,.iso-solid[data-seamless]>.iso-top{stroke-width:.4;stroke-linejoin:round}
.iso-solid[data-seamless]>.iso-shade[data-shade="0"]{stroke:var(--anatomy-shade-0)}
.iso-solid[data-seamless]>.iso-shade[data-shade="1"]{stroke:var(--anatomy-shade-1)}
.iso-solid[data-seamless]>.iso-shade[data-shade="2"]{stroke:var(--anatomy-shade-2)}
.iso-solid[data-seamless]>.iso-shade[data-shade="3"]{stroke:var(--anatomy-shade-3)}
.iso-solid[data-seamless]>.iso-top{stroke:var(--anatomy-top)}
.iso-solid[data-seamless][data-lit]>.iso-top{stroke:var(--anatomy-lit-top)}
.iso-solid[data-seamless][data-lit]>.iso-shade{stroke:var(--anatomy-lit-shade)}
.iso-solid[data-lit]>.iso-edge{stroke:var(--anatomy-lit)}
.iso-halo{fill:var(--anatomy-halo);stroke:none;filter:blur(9px);opacity:var(--anatomy-halo-opacity);transform:translateY(3px)}
.iso-line{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);stroke-linecap:round;stroke-linejoin:round}
.iso-line[data-tone="hi"]{stroke:var(--anatomy-hi)}
.iso-line[data-tone="mid"]{stroke:var(--anatomy-mid)}
.iso-line[data-tone="lo"]{stroke:var(--anatomy-lo)}
.iso-line[data-tone="faint"]{stroke:var(--anatomy-faint)}
.iso-line[data-tone="lit"]{stroke:var(--anatomy-lit)}
.iso-line[data-tone="red"]{stroke:var(--anatomy-red)}
.iso-line[data-tone="green"]{stroke:var(--anatomy-green)}
.iso-line[data-tone="blue"]{stroke:var(--anatomy-blue)}
.iso-line[data-dotted]{stroke-dasharray:.01 3.5;stroke-width:1}
.iso-line[data-dashed]{stroke-dasharray:3 3}
.iso-line[data-flow]{stroke-dasharray:2 6}
.iso-wire-end{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight)}
.iso-wire[data-tone="hi"] .iso-wire-end{stroke:var(--anatomy-hi)}
.iso-wire[data-tone="mid"] .iso-wire-end{stroke:var(--anatomy-mid)}
.iso-wire[data-tone="faint"] .iso-wire-end{stroke:var(--anatomy-faint)}
.iso-wire[data-tone="lit"] .iso-wire-end{stroke:var(--anatomy-lit)}
.iso-dots circle{fill:var(--anatomy-dot);stroke:none;opacity:.32}
.iso-dots[data-tone="hi"] circle{opacity:.85}
.iso-dots[data-tone="mid"] circle{opacity:.45}
.iso-dots[data-tone="lo"] circle{opacity:.22}
.iso-dots[data-tone="faint"] circle{opacity:.12}
.iso-face-text{fill:var(--anatomy-mid);font-family:var(--anatomy-mono);letter-spacing:.04em}
.iso-face-text[data-tone="hi"]{fill:var(--anatomy-hi)}
.iso-face-text[data-tone="lo"]{fill:var(--anatomy-lo)}
.iso-face-text[data-tone="faint"]{fill:var(--anatomy-faint)}
.tb-body{fill:var(--anatomy-shade-2);stroke:none}
.tb-shine{fill:var(--anatomy-top);stroke:none}
.tb-shade{fill:var(--anatomy-shade-0);stroke:none}
.tb-ring{fill:none;stroke:var(--anatomy-lo);stroke-width:.45;stroke-linecap:butt;stroke-linejoin:round}
.tb-ring[data-tone="mid"]{stroke:var(--anatomy-mid)}
.tb-ring[data-tone="faint"]{stroke:var(--anatomy-faint)}
.tb-ring[data-tone="hi"]{stroke:var(--anatomy-hi)}
@keyframes iso-flow{to{stroke-dashoffset:-32}}
@keyframes iso-pulse{0%,100%{opacity:.18}12%{opacity:1}40%{opacity:.18}}
.iso-line[data-flow]{animation:iso-flow 1600ms linear infinite}
.iso-dots circle[data-pulse]{animation:iso-pulse 1600ms steps(1,end) infinite;animation-delay:var(--pulse-at,0ms)}
.iso-figure{margin:32px 0 36px}
.iso-plate{position:relative;padding:52px 24px;border-radius:0;background:var(--anatomy-card);box-shadow:0 0 0 1px var(--anatomy-mid);--anatomy-paper:var(--anatomy-card)}
.iso-plate-corners{position:absolute;inset:18px 20px;pointer-events:none}
.iso-plate-corner{position:absolute;color:var(--anatomy-muted);font-family:var(--anatomy-mono);font-size:10.5px;line-height:1;letter-spacing:.04em;white-space:nowrap}
.iso-plate-corner[data-corner="fig"]{top:0;left:0;color:var(--anatomy-text)}
.iso-plate-corner[data-corner="title"]{top:0;right:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="hint"]{bottom:0;left:0;text-transform:uppercase;letter-spacing:.1em}
.iso-plate-corner[data-corner="readout"]{right:0;bottom:0;color:var(--anatomy-text);font-variant-numeric:tabular-nums}
.iso-plate .iso-svg{margin:0 auto}
.iso-legend{display:grid;gap:8px;margin-top:12px;color:var(--anatomy-muted);font-size:13px;line-height:1.55}
.iso-keys{display:flex;flex-wrap:wrap;gap:6px 18px}
.iso-key{display:inline-flex;align-items:center;gap:7px}
.iso-swatch{width:16px;height:10px;flex:none;overflow:visible}
.iso-swatch path{fill:none;stroke:var(--anatomy-hi);stroke-width:1;vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round}
.iso-swatch[data-mark="raised"] path,.iso-swatch[data-mark="flat"] path{stroke:var(--anatomy-mid)}
.iso-swatch[data-mark="lit"] path{stroke:var(--anatomy-lit)}
.iso-swatch[data-mark="dim"] path{stroke:var(--anatomy-lo)}
.iso-swatch[data-mark="dotted"] path{stroke-dasharray:.01 3;stroke-width:1.4}
.iso-swatch[data-mark="dashed"] path{stroke-dasharray:3 2.5}
.iso-swatch[data-mark="red"] path{stroke:var(--anatomy-red)}
.iso-swatch[data-mark="green"] path{stroke:var(--anatomy-green)}
.iso-swatch[data-mark="blue"] path{stroke:var(--anatomy-blue)}
.iso-swatch-crease{stroke:var(--anatomy-lo)!important}
@media (max-width:560px){.iso-plate{padding:48px 12px 70px}.iso-plate-corner[data-corner="hint"]{bottom:18px}}
@media (prefers-reduced-motion:reduce){.iso-line[data-flow],.iso-dots circle[data-pulse]{animation:none}}
`;export{pt as AZIMUTH,ht as ELEVATION,at as ISO_CSS,mt as SHADES,ct as axisVector,wt as boxCorners,H as cameraOf,N as circleRing,Et as coil,Mt as corners,xt as cylinder,et as depthOf,bt as dotGrid,Vt as dotsSvg,K as extrude,qt as faceTextSvg,Gt as fadeLineSvg,Bt as fadedSvg,Wt as figureSvg,Ct as fitProjection,zt as groupSvg,_t as haloOf,Dt as holdStill,yt as insetPlan,M as iso,ut as joinPaths,At as knurl,Q as lineOnTop,L as lineSvg,q as onTop,Jt as pageHtml,$ as pathOf,gt as planOutline,Yt as plateHtml,kt as pointsAt,Pt as radialTicks,$t as ring,R as ringOf,lt as ringSeam,vt as rise,st as roundedPlan,Zt as screenRise,z as segment,St as sideArc,Ft as sideMatrix,It as sideRing,jt as sideSeam,Tt as sideTicks,rt as slabOf,Lt as solidSvg,Ut as topMatrix,Ot as topTicks,F as towardViewer,Ht as translateAlong,Rt as wireSvg};
