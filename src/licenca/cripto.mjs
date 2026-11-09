/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import n from"node:crypto";import p from"node:fs";import{CHAVE_PUBLICA as i}from"./chave-publica.mjs";const d={licenca:"ILU1-LIC.",ativacao:"ILU1-ATV.",manifesto:"ILU1-MAN."},I=t=>Buffer.from(t).toString("base64url"),u=t=>Buffer.from(String(t),"base64url"),f=t=>n.createHash("sha256").update(t).digest("hex"),v=t=>f(p.readFileSync(t)),s=new Map,h=t=>(s.has(t)||s.set(t,n.createPublicKey({key:{kty:"OKP",crv:"Ed25519",x:t},format:"jwk"})),s.get(t));function m(t,r,e=i){try{return n.verify(null,Buffer.from(t),h(e),u(r))}catch{return!1}}function A(t,r,e,l=i){const a=String(t||"").trim().replace(/\s+/g,"");if(!a.startsWith(r))return null;const[o,c]=a.slice(r.length).split(".");if(!o||!c||!m(e+o,c,l))return null;try{return JSON.parse(u(o).toString("utf8"))}catch{return null}}const L=t=>f("ilustrando:"+String(t||"").trim().toLowerCase());export{d as DOMINIOS,I as b64url,m as confere,u as deB64url,L as hashEmail,A as lerAssinado,f as sha256,v as sha256Arquivo};
