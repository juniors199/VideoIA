/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const I=`
uniform vec3 uTinta; uniform vec3 uPapel; uniform float uEscala; uniform float uModo; uniform float uSolido; uniform float uSuave; uniform float uPasso; uniform float uNiveis;
float pbLinha(float v, float w) { float f = fract(v); float d = min(f, 1.0 - f); float aa = fwidth(v) * 0.85 + 1e-4; return 1.0 - smoothstep(w - aa, w + aa, d); }
`,k=`
{
  float L = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
  float T = uModo > 0.5 ? L : 1.0 - L;
  T = clamp((T - 0.10) / 0.80, 0.0, 1.0);
  if (uSuave > 0.5) T = clamp((T - 0.50) / 0.50, 0.0, 1.0) * 0.5;
  T = floor(T * uNiveis + 0.5) / uNiveis;
  vec2 pp = gl_FragCoord.xy / uEscala;
  float v1 = (pp.x + pp.y) / uPasso;
  float v2 = (pp.x - pp.y) / uPasso;
  float w1 = clamp(T * 0.62, 0.0, 0.5);
  float w2 = clamp((T - 0.5) * 0.9, 0.0, 0.5);
  float cov = max(w1 > 0.001 ? pbLinha(v1, w1) : 0.0, w2 > 0.001 ? pbLinha(v2, w2) : 0.0);
  if (T > 0.96 || uSolido > 0.5) cov = 1.0;
  gl_FragColor = vec4(mix(uPapel, uTinta, cov), gl_FragColor.a);
}
`,q=`
{
  float a = gl_FragColor.a;
  vec2 pp = gl_FragCoord.xy / uEscala;
  float v1 = (pp.x + pp.y) / (uPasso * 0.8);
  float k = smoothstep(0.08, 0.42, a);
  float cov = pbLinha(v1, 0.10 + 0.22 * k) * step(0.05, a);
  gl_FragColor = vec4(uTinta, cov * 0.9);
}
`;function R(p,c){const s=c.attributes.position;if(!s||s.count<3)return null;const f=c.index,A=(f?f.count:s.count)/3|0,B=e=>`${Math.round(s.getX(e)*4e3)},${Math.round(s.getY(e)*4e3)},${Math.round(s.getZ(e)*4e3)}`,S=new Map,i=new p.Vector3,x=new p.Vector3,y=new p.Vector3,g=new p.Vector3,w=(e,u)=>f?f.getX(e*3+u):e*3+u,M=new Array(s.count);for(let e=0;e<s.count;e++)M[e]=B(e);for(let e=0;e<A;e++){const u=w(e,0),h=w(e,1),_=w(e,2);i.fromBufferAttribute(s,u),x.fromBufferAttribute(s,h),y.fromBufferAttribute(s,_),g.subVectors(y,x).cross(i.sub(x));for(const F of[u,h,_]){const P=S.get(M[F])||[0,0,0];P[0]+=g.x,P[1]+=g.y,P[2]+=g.z,S.set(M[F],P)}}const C=new Float32Array(s.count*3);for(let e=0;e<s.count;e++){const u=S.get(M[e])||[0,1,0],h=Math.hypot(u[0],u[1],u[2])||1;C[e*3]=u[0]/h,C[e*3+1]=u[1]/h,C[e*3+2]=u[2]/h}const b=new p.BufferGeometry;return b.setAttribute("position",s),f&&b.setIndex(f),b.setAttribute("normal",new p.BufferAttribute(C,3)),b}function X(p){const{THREE:c,S:s,esc:f}=p,{LineSegments2:A,LineSegmentsGeometry:B,LineMaterial:S}=p.linhas3d,i={uTinta:{value:new c.Color("#ffffff")},uPapel:{value:new c.Color("#000000")},uEscala:{value:f},uModo:{value:1},uPasso:{value:15},uNiveis:{value:5}},x={uTinta:i.uTinta,uPapel:i.uPapel,uEscala:i.uEscala,uModo:i.uModo,uPasso:i.uPasso,uNiveis:i.uNiveis},y=new Map,g=new Map,w=new Map,M=[],C=5.2,b=3.2,e=new c.Vector2(Math.round(p.W*f),Math.round(p.H*f)),u=o=>{const l=new c.ShaderMaterial({side:c.BackSide,depthWrite:!0,uniforms:{uTinta:i.uTinta,uPx:{value:o*f},uRes:{value:e}},vertexShader:`uniform float uPx; uniform vec2 uRes;
        void main() { vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec3 n = normalize(normalMatrix * normal); vec2 d = (projectionMatrix * vec4(n, 0.0)).xy; float l = length(d * uRes);
          vec2 dir = l > 1e-5 ? (d * uRes) / l : vec2(0.0);
          c.xy += dir * (2.0 * uPx / uRes) * c.w; gl_Position = c; }`,fragmentShader:"uniform vec3 uTinta; void main() { gl_FragColor = vec4(uTinta, 1.0); }"});return l.polygonOffset=!0,l.polygonOffsetFactor=1,l.polygonOffsetUnits=1,l},h=u(C),_=u(2.4);function F(o,{solido:l=!1,cor:d=null,sombra:m=!1,suave:t=!1}={}){const v=`${m?"s":"m"}${l?1:0}${t?"f":""}`;y.has(o)||y.set(o,{});const T=y.get(o);if(T[v])return T[v];const O=o.onBeforeCompile!==c.Material.prototype.onBeforeCompile,n=O?o:o.clone(),$=O?o.onBeforeCompile:null;return d&&n.color&&n.color.set(d),m||(n.polygonOffset=!0,n.polygonOffsetFactor=2,n.polygonOffsetUnits=2),n.onBeforeCompile=function(a,r){$?.call(this,a,r),Object.assign(a.uniforms,x),a.uniforms.uSolido={value:l?1:0},a.uniforms.uSuave={value:t?1:0},a.fragmentShader=a.fragmentShader.replace("void main() {",`${I}
void main() {`).replace(m?"#include <fog_fragment>":"#include <dithering_fragment>",`${m?"#include <fog_fragment>":"#include <dithering_fragment>"}
${m?q:k}`)},n.customProgramCacheKey=()=>`pb-${m?"s":"m"}${l?1:0}${t?"f":""}`,n.needsUpdate=!0,T[v]=n,n}const P=o=>o.isMesh&&o.geometry&&o.material&&!o.material.isShaderMaterial&&!o.userData.pbFeito,D=o=>o===s.M.destaque?"destaque":o===s.M.sombra?"sombra":o===s.M.apoio?"apoio":o===s.M.frente?"frente":null,V={frente:"#F2F2F2",apoio:"#B4B4B4",sombra:"#4B4B4B",destaque:"#FFFFFF"};function U(o,{chao:l=!1,suave:d=!1}={}){const m=[];o.traverse(t=>{t.isMesh&&m.push(t)});for(const t of m){if(t.userData.pbFeito||t.userData.pbCasco||t.userData.pbIgnora)continue;const v=Array.isArray(t.material)?t.material:[t.material];if(v.some(a=>!a||a.isShaderMaterial||a.visible===!1)){t.userData.pbFeito=!0;continue}if(v[0].isShadowMaterial){t.material=F(v[0],{sombra:!0}),t.userData.pbFeito=!0;continue}t.userData.pbFeito=!0;const T=v.every(a=>!a.transparent||a.opacity>.85),O=v.map(a=>{const r=D(a);return F(a,{solido:r==="destaque"&&!d,cor:r&&!d?V[r]:null,suave:d})});if(t.material=Array.isArray(t.material)?O:O[0],t.isInstancedMesh||t.isSkinnedMesh||!T)continue;const n=t.geometry;if(n.attributes.position.count<=12e4){w.has(n)||w.set(n,R(c,n));const a=w.get(n);if(a){const r=new c.Mesh(a,d?_:h);r.userData.pbCasco=!0,r.userData.semMedida=!0,r.frustumCulled=!1,r.castShadow=!1,r.receiveShadow=!1,r.renderOrder=t.renderOrder,t.add(r)}}if(n.attributes.position.count<=6e4&&!l){if(!g.has(n)){const L=new c.EdgesGeometry(n,38),N=new B;N.fromEdgesGeometry(L),L.dispose(),g.set(n,N)}const a=new S({linewidth:(d?2:b)*f,worldUnits:!1,depthTest:!0,transparent:!1});a.resolution.copy(e),a.color.copy(i.uTinta.value);const r=new A(g.get(n),a);r.userData.pbCasco=!0,r.userData.semMedida=!0,r.frustumCulled=!1,r.castShadow=!1,r.renderOrder=t.renderOrder,t.add(r),M.push(a)}}}function G(o){const l=o!=="claro";i.uTinta.value.set(l?"#ffffff":"#000000"),i.uPapel.value.set(l?"#000000":"#ffffff"),i.uModo.value=l?1:0;for(const d of M)d.color.copy(i.uTinta.value)}return{aplicar:U,modo:G,U:i,remendar:F,papelDe:D,res:e}}export{X as criarTraco3D};
