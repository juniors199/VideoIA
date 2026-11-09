/*
 * 
 * 
 */
/** Bateria de roteiros do teste seco (formato horizontal, 0.6.43): curto, longo, número grande, lista, marca, pessoa sem foto, frase longa, só números. */
export const BATERIA = {
  curto: 'Você sabia que o mel nunca estraga? Isso é fato. Segue a página.',
  longo: 'Uma raposa chamada Pipa sonhava com a lua. Ela juntou caixas, fita e tinta. Três, dois, um! O foguete subiu. Pipa acenou para o planeta. Mas a tempestade apagou a lâmpada. Então os amigos chegaram, cada um com uma luzinha. Juntos acenderam o farol. Na manhã seguinte, o mar estava calmo. Segue a página e comenta ILUSTRANDO.',
  numeroGrande: 'O cérebro gasta vinte por cento da energia do corpo. São 86 bilhões de neurônios. Só dois por cento do peso. Mil e quinhentos gramas.',
  lista: 'Três coisas ajudam o sono. Primeiro, luz fraca à noite. Segundo, o quarto fresco. Terceiro, horário fixo para dormir. Quer mais? Manda pra um amigo.',
  marca: 'O Claude Code e o Codex escrevem programas sozinhos. O Instagram e o YouTube mostram o resultado. A Kiwify vende o curso. Compartilha no story.',
  pessoaSemFoto: 'Dona Maria acordou cedo. Ela abriu a janela e viu o mar. Seu Joaquim já pescava ali. Os dois sorriram e acenaram.',
  fraseLonga: 'Quando a tempestade apagou a lâmpada do farol que o ratinho cuidava toda noite desde a primavera passada, ninguém na vila inteira imaginava que a luz de uma única vela ia ser suficiente para guiar todos os barcos de volta para casa.',
  soNumeros: '1 2 3 4 5 6 7 8 9 10. Dez. 100. 1000. 2026.',
};
/** palavras com tempo (voz de teste): 0,38 s por palavra e 0,3 s de pausa depois da pontuação */
export const falado = (txt) => { let t = 0.2; const palavras = txt.split(/\s+/).map((w) => { const o = { w, t: +t.toFixed(3), f: +(t + 0.3).toFixed(3) }; t += 0.38 + (/[.,!?]$/.test(w) ? 0.3 : 0); return o; }); return { palavras, duracao: +(t + 1.2).toFixed(2) }; };
/** um beat por frase */
export const porFrase = (ws) => { const b = []; let i0 = 0; ws.forEach((w, i) => { if (/[.!?]$/.test(w.w) || i === ws.length - 1) { b.push({ id: `b${b.length + 1}`, palavras: [i0, i] }); i0 = i + 1; } }); return b; };
export const arred = (v) => (typeof v === 'number' ? Math.round(v * 10) / 10 : Array.isArray(v) ? v.map(arred) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, arred(x)])) : v);
