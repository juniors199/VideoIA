/* Estudio de videos 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
import{pathToFileURL as u}from"node:url";const l=/\b(caixa|cil|esf|elipse|capsula|cone|toro|placa|prismaN)\s*\(|new\s+(?:kit\.)?THREE\.(Box|Sphere|Cylinder|Torus|Capsule|Cone|Plane|Circle)Geometry/g,m=/\b(torno|extruda|extrudaForma|tubo|tuboVar|fuso|placaBisel|malhaSDF|geoSDF)\s*\(|new\s+(?:kit\.)?THREE\.(Lathe|Extrude|Tube|Shape)Geometry|GLTF|glb/g,h=/acab\.|\bmap\s*:|vertexColors|ShaderMaterial|onBeforeCompile|bumpMap|roughnessMap|CanvasTexture/;async function f(a){if(!a?.arquivo)return[];let e;try{e=await import(u(a.arquivo).href+`?v=${a.hash}`)}catch{return[]}const n=e.default&&!e.pecas?e.default:e,r=[];for(const[s,c]of Object.entries(n?.pecas||{})){const t=String(c),o=(t.match(l)||[]).length,p=(t.match(m)||[]).length;if(!o||h.test(t))continue;const i=o/(o+p);i>=.8&&r.push({peca:s,msg:`pe\xE7a "${s}" do pecas.js parece chapada (${Math.round(i*100)}% primitivas lisas, sem textura nem varia\xE7\xE3o de material): use kit.acab (textura leve, gradiente, relevo), detalhes reais do objeto, espessura e bisel. Checklist "Nunca chapada" em docs/repertorio-3d.md.`})}return r}export{f as avisosAcabamento};
