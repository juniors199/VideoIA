/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import a from"node:fs";const c=/\[[^\]\n]{1,40}\]/g;function i(e){return a.readFileSync(e,"utf8").replace(/^\uFEFF/,"").replace(/<!--[\s\S]*?-->/g,"").split(`
`).filter(t=>!/^\s*(STATUS:|GANCHOS:|#|<!--)/i.test(t)).join(`
`)}function f(e){return i(e).replace(c,"").replace(/[ \t]+\n/g,`
`).replace(/^[ \t]+/gm,"").replace(/\n{2,}/g,`

`).trim()}function u(e){return i(e).replace(/\n{2,}/g,`

`).trim()}const g=e=>e.replace(/\*/g,"").split(/\s+/).filter(Boolean);function m(e){const t=a.readFileSync(e,"utf8").replace(/^\uFEFF/,"").split(/\n\s*\n/).map(r=>r.split(`
`).filter(n=>!/^\s*(STATUS:|GANCHOS:|#)/i.test(n)).join(`
`)).filter(r=>r.replace(/<!--[\s\S]*?-->/g,"").trim()),o=[];return t.forEach((r,n)=>{const s=r.match(/<!--\s*ref:\s*([^>]+?)\s*-->/i);s&&o.push({paragrafo:n,ref:s[1].trim().toUpperCase()})}),o}export{m as lerReferencias,f as lerRoteiro,u as lerRoteiroComTags,g as palavrasDoTexto};
