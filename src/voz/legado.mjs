/* Ilustrando Studio 0.6.45. Pacote C-000000000000.  */
/*
 * 
 * 
 */
const n=["elevenlabs","fishaudio","arquivo","mock"];function t(e,o=process.env){const a=String(e??"").trim().toLowerCase();if(!a||n.includes(a))return{voz:a||e,migrada:!1,de:null};const r=i=>!!String(o[i]||"").trim();return{voz:r("ELEVENLABS_API_KEY")?"elevenlabs":r("FISH_API_KEY")?"fishaudio":"mock",migrada:!0,de:a}}function u(e){return e?.migrada?`a voz antiga que estava configurada n\xE3o existe mais; usei ${{elevenlabs:"a voz da ElevenLabs que voc\xEA configurou",fishaudio:"a voz do Fish Audio que voc\xEA configurou",mock:"a voz de teste, sem som (para ter som, v\xE1 em Come\xE7ar > Voz e cole a chave da ElevenLabs)"}[e.voz]}`:""}export{n as VOZES_ATUAIS,u as fraseMigracao,t as migrarVoz};
