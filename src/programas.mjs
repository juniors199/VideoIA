/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import a from"node:fs";import r from"node:path";import{fileURLToPath as m}from"node:url";const f=r.resolve(r.dirname(m(import.meta.url)),"..");function S(){return process.env.ILU_PROJETOS?r.resolve(process.env.ILU_PROJETOS):r.join(f,"projetos")}const t=process.env.ILU_PROGRAMAS||r.join(f,".programas"),g=process.platform==="win32";function d(o=t){return[r.join(o,"node","bin"),r.join(o,"node"),r.join(o,"ffmpeg")].filter(e=>{try{return a.statSync(e).isDirectory()}catch{return!1}})}function P(o=process.env,n=t){const e=d(n),c=Object.keys(o).find(i=>i.toUpperCase()==="PATH")||"PATH",p=(o[c]||"").split(r.delimiter).filter(Boolean),s=e.filter(i=>!p.includes(i));s.length&&(o[c]=[...s,...p].join(r.delimiter));const l=r.join(n,"ms-playwright");return!o.PLAYWRIGHT_BROWSERS_PATH&&a.existsSync(l)&&(o.PLAYWRIGHT_BROWSERS_PATH=l),s}const j=(o=t)=>r.join(o,"alinhador"),h=(o=t)=>a.existsSync(r.join(j(o),"node_modules","@huggingface","transformers","package.json"));P();export{t as PROGRAMAS,f as STUDIO,j as pastaAlinhador,S as pastaProjetos,d as pastasDeProgramas,P as prepararProgramas,h as temAlinhador};
