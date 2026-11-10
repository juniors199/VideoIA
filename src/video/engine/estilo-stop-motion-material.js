/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{texturaMassa as x}from"./estilo-stop-motion-massa.js";let g=null;function w(o){if(g)return g;const r=x(512,7),n=document.createElement("canvas");n.width=n.height=512;const e=n.getContext("2d");e.drawImage(r,0,0);let l=4711;const t=()=>(l=Math.imul(l,1664525)+1013904223>>>0,l/4294967296),u=i=>{for(const s of[-512,0,512])for(const m of[-512,0,512])e.save(),e.translate(s,m),i(),e.restore()};for(let i=0;i<16;i++){const s=t()*512,m=t()*512,f=60+t()*150,c=t()*Math.PI,p=5+t()*9;u(()=>{e.save(),e.translate(s,m),e.rotate(c);const d=e.createLinearGradient(0,-p,0,p);d.addColorStop(0,"rgba(255,255,255,.0)"),d.addColorStop(.35,"rgba(255,255,255,.25)"),d.addColorStop(.5,"rgba(0,0,0,.35)"),d.addColorStop(.65,"rgba(255,255,255,.25)"),d.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=d,e.fillRect(-f/2,-p,f,2*p),e.restore()})}for(let i=0;i<18;i++){const s=t()*512,m=t()*512,f=20+t()*40;u(()=>{const c=e.createRadialGradient(s,m,0,s,m,f);c.addColorStop(0,"rgba(0,0,0,.28)"),c.addColorStop(.8,"rgba(0,0,0,.08)"),c.addColorStop(1,"rgba(255,255,255,.16)"),e.fillStyle=c,e.beginPath(),e.arc(s,m,f,0,7),e.fill()})}const a=new o.CanvasTexture(n);return a.wrapS=a.wrapT=o.RepeatWrapping,a.anisotropy=8,a.colorSpace=o.NoColorSpace,a.minFilter=o.LinearMipmapLinearFilter,a.generateMipmaps=!0,g=a}const v={boil:null,dedoP:null,dedoD:null},S=o=>(v.boil||(v.boil={value:new o.Vector3},v.dedoP={value:[new o.Vector4(0,-99,0,.001),new o.Vector4(0,-99,0,.001)]},v.dedoD={value:[new o.Vector4(0,-1,0,0),new o.Vector4(0,-1,0,0)]}),v);function D(o,r,n={}){if(!r||r.userData.massa)return r;r.userData.massa=!0;const e=w(o),l=S(o),t={tAltura:{value:e},uRelevo:{value:n.relevo??.011},uFreq:{value:n.freq??1.15},uManchas:{value:n.manchas??.5},uBoil:l.boil,uDedoP:l.dedoP,uDedoD:l.dedoD},u=r.onBeforeCompile;return r.onBeforeCompile=(a,i)=>{u&&u(a,i),Object.assign(a.uniforms,t),a.vertexShader=a.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vSmP; varying vec3 vSmN;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vSmP = position; vSmN = normal;`).replace("#include <common>",`#include <common>
uniform vec4 uDedoP[2]; uniform vec4 uDedoD[2];`).replace("#include <project_vertex>",`
vec4 smL = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
smL = instanceMatrix * smL;
#endif
vec4 smWp = modelMatrix * smL;
vec3 smRad = vec3(0.0); float smG = 0.0;
for (int i = 0; i < 2; i++) {
  vec3 c = uDedoP[i].xyz; float r = uDedoP[i].w; vec3 dv = smWp.xyz - c; float dd = length(dv);
  if (dd < r && uDedoD[i].w > 0.0) {
    float f = 1.0 - dd / r; f = f * f * (3.0 - 2.0 * f);
    smWp.xyz += uDedoD[i].xyz * uDedoD[i].w * f;
    smRad += dv / max(dd, 1e-4) * f; smG += f * uDedoD[i].w / r;
  }
}
vec4 mvPosition = viewMatrix * smWp;
gl_Position = projectionMatrix * mvPosition;
#ifdef FLAT_SHADED
#else
if (smG > 0.0001) vNormal = normalize(vNormal - normalize((viewMatrix * vec4(smRad, 0.0)).xyz) * min(smG * 2.2, 0.9));
#endif
`),a.fragmentShader=a.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vSmP; varying vec3 vSmN; uniform sampler2D tAltura; uniform float uRelevo; uniform float uFreq; uniform float uManchas; uniform vec3 uBoil;
float smAltura(vec3 p, vec3 n, float f) {
  vec3 w = pow(abs(n), vec3(5.0)); w /= (w.x + w.y + w.z + 1e-4);
  return texture2D(tAltura, p.yz * f).r * w.x + texture2D(tAltura, p.xz * f).r * w.y + texture2D(tAltura, p.xy * f).r * w.z;
}`).replace("#include <color_fragment>",`#include <color_fragment>
vec3 smN = normalize(vSmN);
float smFino = smAltura(vSmP + uBoil, smN, uFreq);
float smLargo = smAltura(vSmP + vec3(3.1, 1.7, 5.3) + uBoil * 0.3, smN, uFreq * 0.21);
float smH = smFino * 0.65 + smLargo * 0.55;
diffuseColor.rgb *= mix(0.80, 1.10, clamp((smLargo - 0.5) * uManchas * 2.0 + 0.5, 0.0, 1.0)) * mix(0.84, 1.05, smoothstep(0.30, 0.62, smFino));`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = clamp(roughnessFactor + (smFino - 0.5) * 0.55 + (smLargo - 0.5) * 0.35, 0.34, 1.0);`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
  vec2 dH = vec2(dFdx(smH), dFdy(smH)) * uRelevo;
  vec3 q0 = dFdx(-vViewPosition.xyz); vec3 q1 = dFdy(-vViewPosition.xyz);
  vec3 R1 = cross(q1, normal); vec3 R2 = cross(normal, q0);
  float fDet = dot(q0, R1);
  vec3 vGrad = sign(fDet) * (dH.x * R1 + dH.y * R2);
  normal = normalize(abs(fDet) * normal - vGrad);
}`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
{
  float smRim = pow(1.0 - clamp(dot(normalize(normal), normalize(vViewPosition)), 0.0, 1.0), 2.2);
  totalEmissiveRadiance += diffuseColor.rgb * vec3(1.15, 0.92, 0.72) * smRim * 0.30;
}`)},r.customProgramCacheKey=()=>"stop-motion-massa-v2",r.needsUpdate=!0,r}function h(o,r,{rug:n=.72,brilho:e=0,opc:l={}}={}){const t=new o.MeshPhysicalMaterial({color:new o.Color(r),roughness:n,metalness:0,sheen:.6,sheenColor:new o.Color(r).lerp(new o.Color("#fff0d0"),.5),sheenRoughness:.6,clearcoat:e,clearcoatRoughness:.5});return D(o,t,l)}export{v as ESTADO_MASSA,D as aplicarMassa,h as materialMassa,w as texturaAltura};
