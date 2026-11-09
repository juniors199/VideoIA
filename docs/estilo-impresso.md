

# Estilo impresso: retícula de tinta sobre papel

`"estilo": "impresso"` faz cada quadro parecer uma página impressa. Tudo o que entra (3D, texto, cartão, objetos) é convertido em **tinta quase preta (`#1E1C1A`) por uma retícula de meio-tom a 45° com período de 7,2 px**, com ruído fixo, chapado acima de 62% e desgaste, e multiplicado sobre um papel envelhecido (manchas, fibras, vincos, retícula de impressão desbotada no canto). Só a cor da página fica fora da retícula, como um carimbo. Campos em `docs/cena/estilos-motion.md`.

## Processo
1. **Fala de 30 a 45 s** (modelo `impresso`).
2. Para cada beat: qual é a **palavra grande**? Ela vai em `*destaque*` no título (ou num elemento `palavra`); as palavras antes dela ficam pequenas em cima e as de depois viram a **cursiva** fina embaixo.
3. Objetos: `{ "tipo": "impresso", "forma": "objeto", "objeto": "rolo" | "cronometro" | "losango" | "play" | "tecla" | "livro" }` são os objetos de metal do pacote (luz de estúdio, sombra suave, giro no próprio eixo); qualquer peça do repertório também vira metal impresso.
4. O `cartao` preto que se abre segura o momento principal; o fecho é a `manuscrita` (a placa de papel fica mais clara).

## Regras da estética (do pacote de origem)
- Tipografia geométrica bold, **minúscula**, espaçamento -0,075 em. A palavra grande tem cerca de três vezes o corpo da pequena.
- **Leitura e área segura:** os textos (composição, palavra, cursiva, manuscrita, legenda) não entram no pan, no zoom nem no chicote dos cortes: ficam na coluna fixa (x 140, topo em y 296) e só acompanham 12% do movimento, então nunca cortam no topo nem no @. A composição fica até a primeira palavra do beat seguinte; a linha pequena tem no mínimo 62 px e nunca deixa palavra curta sozinha na última linha; a cursiva encolhe para caber na largura. Escreva o `titulo` com a frase inteira do beat (o que vem depois do destaque vira a cursiva), para o texto corresponder à fala do começo ao fim. A legenda (beats sem texto do estilo) vai em frases de leitura de até 2 linhas, em y 1400, e não aparece se não puder ficar o tempo de leitura. No beat com título, o objeto protagonista desce para o centro e ocupa ~60% da área útil (y 700 a 1420).
- Entrada por palavra inteira: desfoque proporcional ao corpo, escala 1,24 -> 1, sobe 0,22 do corpo, **cinza -> tinta**.
- Cursiva fina cinza revelada da esquerda para a direita com máscara macia.
- Transições de câmera medidas, em ciclo: pan para baixo (com desfoque e zoom-out 1,63 -> 1 na cena seguinte), pan para cima, chicote horizontal com esticão. `"transicao": "corte"` no beat tira a do corte.
- Paralaxe por camada dentro do beat (texto 1,8, cartão 0,6, objetos 1,2).
- Grão vivo trocado a 24 quadros por segundo, como no pacote.
- **Som:** cama ambiente grave (ruído e 55 Hz pulsando), whoosh nos pans e chicotes, pop e thump no pouso da palavra grande, scribble na cursiva, chime na manuscrita, tique no ponteiro do cronômetro, thud nos objetos. Sem música por cima.

## Elementos (`{ "tipo": "impresso", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `palavra` | composição pequena + GRANDE + cursiva, como o título | `texto` com `*destaque*`, `pos` |
| `cursiva` | frase em cursiva revelada da esquerda para a direita | `texto`, `pos`, `tamanho` |
| `cartao` | cartão preto que se abre, com textura de desgaste e texto lateral vertical | `lateral`, `texto` (claro, no pé do cartão), `pos`, `tamanho` |
| `objeto` | objeto de metal (rolo, cronômetro, losango, play, tecla, livro) | `objeto`, `pos`, `tamanho` |
| `manuscrita` | fecho manuscrito palavra por palavra, em duas linhas | `texto` |
| `pagina` | folha impressa com linhas de texto que, na palavra de `desfaz`, se quebra em pontos que sobem e somem enquanto a retícula dissolve | `desfaz` (palavra ou segundos), `dur`, `pos`, `tamanho` |
Peças com `dados.material: "original"` guardam a cor (uma cor saturada vira tinta chapada, como uma segunda cor de impressão). O `titulo` do beat vira a composição no alto; o `contador` vira número grande em tinta com a legenda em cursiva; a legenda sai em minúsculas geométricas, cinza -> tinta.

```json
{ "tema": "PAPEL", "estilo": "impresso", "beats": [
  { "id": "gancho", "palavras": [0, 13], "titulo": { "texto": "um livro antigo fica *amarelo* mas não está sujo" },
    "elementos": [ { "tipo": "impresso", "forma": "cartao", "lateral": "papel · lignina · luz", "pos": [0.55, 0.62], "entra": 0.3 },
                   { "tipo": "impresso", "forma": "objeto", "objeto": "livro", "pos": [0.55, 0.62], "entra": "amarelo" } ] },
  { "id": "fecho", "palavras": [80, 95], "elementos": [ { "tipo": "impresso", "forma": "manuscrita", "texto": "é o papel se desfazendo devagar." } ] } ] }
```

## Misturar
`"estilo": "impresso"` num beat põe só aquele momento em retícula (por exemplo, uma "página" no meio de um vídeo padrão). Uma `palavra` ou `cursiva` solta em outro estilo aparece por cima, sem a retícula.

Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-impresso`.

Técnica reescrita a partir do pacote motion_brutalism_engine (anim8.html, dirt7.js, scenes8.js, gl3d.js e os sintetizadores de som; sem autor nem licença declarados; ver `AVISOS-TERCEIROS.md`). Fontes livres no lugar das do pacote: Poppins (OFL) para a geométrica e Euphoria Script (OFL) para a cursiva e a manuscrita. A marca de terceiros do exemplo não foi portada.

## Kit aberto: o objeto-herói de cada frase (Onda 4)

Cada frase ganha o próprio objeto-herói. Em vez de escolher uma das formas fixas do estilo, o assistente desenha o assunto da frase em `projetos/<nome>/pecas.js`, no export `impresso`:

```js
export const impresso = {
  'capivara-melancia': (k, d) => k.desenho({
    palavras: ['capivara', 'melancia', 'empurrando', 'estação', 'vazia'],   // o que o desenho mostra: o verificador cruza com a frase
    fases: ['capivara parada', 'empurra a melancia', 'a melancia rola'],    // os estados do verbo
    partes: [
      k.r(2, 2, 396, 396, 22, { f: 'n', st: 'm', lw: 3 }),                   // painel (caixa de 400 x 400)
      k.r(-20, 322, 440, 40, 0, { f: 'm' }),                                // chão da estação
      k.g([k.e(150, 262, 64, 36, { f: 'm' }), k.c(222, 246, 28, { f: 'm' })], { pose: { 1: { dx: 28 }, 2: { dx: 40 } } }),
      k.c(306, 278, 36, { f: 'h', pose: { 1: { dx: 22, rot: 70 }, 2: { dx: 52, rot: 200 } } }),
    ],
  }),
};
```

**Primitivas** (todas na caixa de 400 x 400): `k.c` círculo, `k.e` elipse, `k.r` retângulo arredondado, `k.p` caminho SVG absoluto (M L H V C S Q T A Z), `k.l` linha, `k.pl` polilinha ou polígono (`fecha`), `k.t` rótulo curto, `k.g` grupo, `k.onda`, `k.est`. Opções: `f` preenchimento e `st` contorno (papéis `i` tinta, `p` principal, `s` secundária, `h` destaque, `l` clara, `m` neutra, `d` escura, ou `n` nenhum), `lw` espessura do traço, `a` opacidade, `ph: [primeira, última]` fases em que a forma existe, `pose: { fase: { dx, dy, rot, sc, a } }` (a forma interpola 0,6 s para a pose da fase nova), `ent` entrada (`pop`, `draw`, `fade`, `slide:dx,dy`, `cresce`), `an` movimento contínuo (`bob`, `spin`, `pulse`, `flow`, `wave`, `shake`, `blink`, `orbita`). O mesmo desenho aparece na pele de cada estilo.

**Regras do kit.** O desenho precisa ter 2 ou mais fases, 3 ou mais formas, cada fase diferente da anterior (o verbo da frase tem de aparecer) e as palavras da frase. Peça genérica (um círculo, um quadrado) é recusada. O motor nunca desenha outra peça no lugar: `exigirDesenho` falha com a instrução de qual peça declarar. Pessoa citada pelo nome entra com foto real (ver abaixo), nunca com boneco.

## Planejador por intenção e verbo

`src/video/autoplano-impresso.mjs` (`planejarImpresso`) lê a narração com tempo por palavra e as peças declaradas e monta os beats: um objeto-herói por frase (o desenho cujas palavras cobrem a frase; sem cobertura o plano falha e diz o que declarar), o herói em uma cadeia contínua entre os beats (sem reentrada), a regra do verbo (a fase 1 começa na palavra do verbo: gerúndio, infinitivo de ação ou particípio) e a distribuição das outras fases até uma fase final com folga para segurar. O quadro da frase muda o rótulo: "causa e efeito" e "o que acontece quando" pedem os papéis causa e efeito; "o que muda quando" pede antes e depois; "mostre as etapas" e "como funciona" mostram o andamento. No máximo 3 momentos por 3 s de fala (entradas a menos de 0,5 s contam como um) e 1 objeto principal por beat. O herói (`forma: "aberto"`) é uma ilustração impressa (cinza e contorno preto; a retícula faz a tinta) que entra desfocada e pousa com sombra no papel; a forma tipográfica (`forma: "palavra"`) é a frase curta em minúsculas bold, com o verbo em destaque, e só reaparece quando a fase muda. Os beats têm corte seco (`transicao: "corte"`): o herói continua, não desliza.

## Verificadores e medidor de movimento

`src/video/f2-verificar.mjs` (`verificarCena`) confere, sem render: herói declarado e igual ao de `pecas.js`; cobertura da frase; uma cadeia só; fases em ordem, com 0,9 s ou mais cada uma (morph de 0,6 s mais o segurar de 0,3 s); regra do verbo (tolerância de 0,35 s); 3 momentos por 3 s; no máximo 2 níveis de texto por beat; protagonista em todo beat; nenhum boneco de pessoa; metas de movimento (`METAS_F2`): tela parada, deslocamento por quadro, maior intervalo parado e o segurar depois do pouso. `formasRepetidas` reprova duas frases diferentes com a mesma forma. O QA do motor continua sendo outra camada e não prova que o desenho mostra a frase.

## Foto da pessoa citada

A foto real (`scripts/buscar-imagem.mjs`) entra com o acabamento do estilo (foto em cinza de jornal, colada com fita nos cantos e levemente inclinada, com a retícula fazendo o meio-tom; o nome fica na legenda do estilo); a caixa e o tamanho vêm do motor (regra do estúdio, 29/10) e nunca há texto sobre a foto. O planejador recusa pessoa citada pelo nome sem foto. Com foto, o beat 1 mostra a foto e o herói entra no beat 2.

## Conformidade aberta

30 casos livres em `estilos/impresso/casos.json`, sem ElevenLabs (`node scripts/conformidade-f2.mjs --estilo=impresso`, que usa `--voz=mock --sem-musica`). As fixtures (`test/estilos-autorados/impresso/<caso>/pecas.js`) foram desenhadas à mão para cada frase. O QA sem falhas não conta: o caso só vale com o veredito visual (`veredito.json`, a partir de `scripts/quadros-f2.mjs`).




