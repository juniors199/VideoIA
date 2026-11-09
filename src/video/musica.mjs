/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const y=44100,P={curiosidades:{raiz:110,prog:[[0,3,7],[8,12,15],[5,8,12],[7,10,14]]},tecnologia:{raiz:73.42,prog:[[0,7,12],[5,12,16],[3,10,14],[7,14,17]]},dinheiro:{raiz:65.41,prog:[[0,4,7],[5,9,12],[7,11,14],[0,4,9]]}},w=(r,s)=>r*2**(s/12);function A(r,s){const t=P[s]||P.curiosidades,c=Math.ceil(r*44100),M=new Float32Array(c),f=new Float32Array(c),m=8;for(let n=0;n<c;n++){const o=n/44100,e=o/m,l=Math.floor(e)%t.prog.length,x=(l+1)%t.prog.length,g=e-Math.floor(e),p=g>.8?(g-.8)/.2:0;let d=0,u=0;for(let a=0;a<3;a++)for(const[R,h]of[[t.prog[l],1-p],[t.prog[x],p]]){if(h<=0)continue;const i=w(t.raiz*2,R[a]),S=Math.sin(2*Math.PI*i*1.0015*o)+.35*Math.sin(2*Math.PI*i*2*o+a),v=Math.sin(2*Math.PI*i*.9985*o+.7)+.35*Math.sin(2*Math.PI*i*2.003*o);d+=S*h*.03,u+=v*h*.03}const z=.82+.18*Math.sin(2*Math.PI*.11*o),I=Math.min(1,o/2.5)*Math.min(1,(r-o)/2.5);M[n]=d*z*I,f[n]=u*z*I}return{L:M,R:f}}export{A as camaBuffers};
