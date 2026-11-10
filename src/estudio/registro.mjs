/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import c from"node:fs";import l from"node:path";import{fileURLToPath as u}from"node:url";const p=l.resolve(l.dirname(u(import.meta.url)),"..",".."),a={instalacao:"instalacao.log",estudio:"estudio.log"},m=200*1024,f=600,d=(r,e)=>l.join(r,".estudio",e);function g(r=p,e=a.estudio,t=""){try{const n=d(r,e);c.mkdirSync(l.dirname(n),{recursive:!0});const s=new Date().toISOString(),o=String(t).replace(/\u001b\[[0-9;]*[A-Za-z]/g,"").split(/\r?\n/).map(i=>i.replace(/\r/g,`
`).split(`
`).pop()).filter(i=>i&&i.trim());if(!o.length)return!1;try{if(c.statSync(n).size>m){const i=c.readFileSync(n,"utf8");c.writeFileSync(n,i.slice(Math.floor(i.length/2)).replace(/^[^\n]*\n/,""))}}catch{}return c.appendFileSync(n,o.map(i=>`${s} ${i.slice(0,f)}`).join(`
`)+`
`),!0}catch{return!1}}function h(r=p,e=a.estudio){try{const t=d(r,e);c.existsSync(t)&&c.renameSync(t,t+".antigo")}catch{}}function j(r=p,e=a.estudio,t=20){const n=o=>{try{return c.readFileSync(o,"utf8").split(/\r?\n/).filter(i=>i.trim())}catch{return[]}};let s=n(d(r,e));return s.length<3&&(s=[...n(d(r,e)+".antigo").slice(-t),...s]),s.slice(-t).map(o=>o.replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z\s/,""))}function v(r=p){h(r,a.estudio);const e=t=>g(r,a.estudio,t);e(`iniciando; Node ${process.version}; ${process.platform} ${process.arch}`);for(const t of["log","warn","error"]){const n=console[t].bind(console);console[t]=(...s)=>{try{e(s.map(o=>o instanceof Error?`${o.message}
${String(o.stack||"").split(`
`).slice(1,4).join(`
`)}`:typeof o=="string"?o:JSON.stringify(o)).join(" "))}catch{}n(...s)}}return process.on("uncaughtExceptionMonitor",(t,n)=>e(`erro n\xE3o tratado (${n}): ${t?.message||t}
${String(t?.stack||"").split(`
`).slice(1,5).join(`
`)}`)),process.on("unhandledRejection",t=>e(`promessa rejeitada: ${t?.message||t}`)),process.on("warning",t=>e(`aviso do Node: ${t?.name}: ${t?.message}`)),process.on("exit",t=>e(`encerrado (c\xF3digo ${t})`)),e}export{a as ARQUIVOS,g as anotar,j as lerFim,v as ligarRegistroDoEstudio,h as recomecar};
