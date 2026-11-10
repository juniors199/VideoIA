/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const v=(t,e=0,o=1)=>Math.min(o,Math.max(e,t)),d=(t,e,o)=>v((t-e)/o),n=(t,e,o,a)=>{const i=3*t,u=3*(o-t)-i,f=1-i-u,s=3*e,l=3*(a-e)-s,m=1-s-l,M=r=>((f*r+u)*r+i)*r,b=r=>((m*r+l)*r+s)*r;return r=>{if(r<=0)return 0;if(r>=1)return 1;let h=0,p=1,c=r;for(let x=0;x<24;x++)c=(h+p)/2,M(c)<r?h=c:p=c;return b(c)}},y={entrada:n(.16,1,.3,1),saida:n(.5,0,.9,.4),suave:n(.42,0,.58,1),facil:n(.33,0,.2,1),pouso:n(.2,.9,.3,1),parte:n(.55,0,.8,.2),viagem:n(.42,0,.18,1)},z=(t,e=.06)=>{if(t<=0)return 0;if(t>=1)return 1;const o=9,a=.55+(.3-e);return 1-Math.exp(-a*o*t*1.4)*Math.cos(o*t*Math.sqrt(1-Math.min(.95,a*a))*.55)},g=(t,e,o)=>t+(e-t)*o;export{n as bezier,y as curva,d as janela,g as lerp,v as limita,z as mola};
