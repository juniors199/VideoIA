/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const z="varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",w=`
#include <packing>
varying vec2 vUv;
uniform sampler2D tColor; uniform sampler2D tDepth;
uniform float uNear; uniform float uFar; uniform float uFoco; uniform float uAbertura; uniform float uMax;
uniform vec2 uRes; uniform float uSeed; uniform float uGrao; uniform float uVinheta; uniform float uAberracao; uniform float uAO;
float zDe(vec2 uv){ float d = texture2D(tDepth, uv).x; return -perspectiveDepthToViewZ(d, uNear, uFar); }
float cocDe(float z){ return min(uMax, uAbertura * abs(1.0 / uFoco - 1.0 / max(z, 0.01))); }
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
void main(){
  float zc = zDe(vUv); float cc = cocDe(zc);
  vec3 acc = vec3(0.0); float wsum = 0.0;
  const int N = 56; const float GA = 2.39996323;
  float rot = hash(gl_FragCoord.xy + uSeed) * 6.2831;
  // sempre inclui o pr\xF3prio pixel (nunca perde nitidez onde o foco est\xE1)
  vec3 c0 = texture2D(tColor, vUv).rgb; acc += c0; wsum += 1.0;
  for (int i = 0; i < N; i++) {
    float fi = float(i) + 0.5; float r = sqrt(fi / float(N)); float a = fi * GA + rot;
    vec2 off = vec2(cos(a), sin(a)) * r;
    vec2 uv = vUv + off * cc / uRes;
    float zs = zDe(uv); float cs = cocDe(zs);
    if (zs > zc) cs = min(cs, cc);          // o que est\xE1 atr\xE1s n\xE3o borra por cima do que est\xE1 na frente
    float dist = r * cc;
    float w = smoothstep(dist - 1.0, dist + 1.0, cs);
    vec3 col = texture2D(tColor, uv).rgb;
    float luz = max(col.r, max(col.g, col.b));
    w *= 1.0 + 3.0 * max(0.0, luz - 1.0);   // real\xE7a as luzes: o bokeh de l\xE2mpada e janela
    acc += col * w; wsum += w;
  }
  vec3 cor = acc / max(wsum, 1e-4);
  // oclus\xE3o de ambiente em espa\xE7o de tela: cantos, v\xE3os e a base das pe\xE7as escurecem (sombra de contato suave e barata)
  if (uAO > 0.0) {
    float occ = 0.0; float rpx = clamp(26.0 / max(zc, 1.0) * 12.0, 4.0, 40.0);
    for (int j = 0; j < 12; j++) {
      float fj = float(j) + 0.5; float a2 = fj * 2.39996 + rot; float rr = sqrt(fj / 12.0) * rpx;
      float zs = zDe(vUv + vec2(cos(a2), sin(a2)) * rr / uRes);
      float dz = zc - zs; occ += smoothstep(0.02, 0.12, dz) * (1.0 - smoothstep(0.12, 0.9, dz));
    }
    cor *= 1.0 - uAO * (occ / 12.0) * 0.9;
  }
  // aberra\xE7\xE3o crom\xE1tica nas bordas (lente simples)
  vec2 q = vUv - 0.5;
  gl_FragColor = vec4(cor, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  float lm = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114)); gl_FragColor.rgb = mix(vec3(lm), gl_FragColor.rgb, 1.14);
  gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * 1.06 + 0.5;
  // vinheta e gr\xE3o depois do tom (o gr\xE3o de filme \xE9 perceptual)
  float v = smoothstep(0.95, 0.25, length(q) * 1.25); gl_FragColor.rgb *= mix(1.0 - uVinheta, 1.0, v);
  float n = hash(gl_FragCoord.xy * 0.73 + uSeed * 1.7) - 0.5; float n2 = hash(gl_FragCoord.yx * 0.41 + uSeed * 3.1) - 0.5;
  float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
  gl_FragColor.rgb += (n + n2 * 0.5) * uGrao * (0.55 + 0.9 * (1.0 - lum));
}`;function D(e,o,r=1){const s=o.getSize(new e.Vector2),l=Math.round(s.x),u=Math.round(s.y),t=new e.DepthTexture(l,u);t.minFilter=t.magFilter=e.NearestFilter;const c=new e.WebGLRenderTarget(l,u,{type:e.HalfFloatType,samples:4,depthTexture:t,minFilter:e.LinearFilter,magFilter:e.LinearFilter}),a=new e.ShaderMaterial({vertexShader:z,fragmentShader:w,depthTest:!1,depthWrite:!1,toneMapped:!0,uniforms:{tColor:{value:c.texture},tDepth:{value:t},uNear:{value:.1},uFar:{value:80},uFoco:{value:13},uAbertura:{value:700*r},uMax:{value:64*r},uRes:{value:new e.Vector2(l,u)},uSeed:{value:0},uGrao:{value:.035},uVinheta:{value:.32},uAberracao:{value:0},uAO:{value:.55}}}),f=new e.Mesh(new e.PlaneGeometry(2,2),a),i=new e.Scene;i.add(f);const v=new e.OrthographicCamera(-1,1,1,-1,0,1);return{mat:a,render(m,n,{foco:p=13,abertura:g=700,grao:d=.035,passo:h=0,exposicao:x=1.5}={}){const F=o.toneMappingExposure;o.toneMappingExposure=x,a.uniforms.uNear.value=n.near,a.uniforms.uFar.value=n.far,a.uniforms.uFoco.value=p,a.uniforms.uAbertura.value=g*r,a.uniforms.uSeed.value=h%997+1,a.uniforms.uGrao.value=d;const b=o.getRenderTarget();o.setRenderTarget(c),o.clear(),o.render(m,n),o.setRenderTarget(null),o.render(i,v),o.setRenderTarget(b),o.toneMappingExposure=F},dispose(){c.dispose(),a.dispose()}}}export{D as criarDOF};
