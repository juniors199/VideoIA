

# Estilo cartoes: editorial 3D sobre grade creme

> **Cor (0.6.29):** o destaque (antes roxo `#7B4DFF` e `#A98BFF`) é a cor da marca da página, com tons derivados dela (`src/video/engine/marca-tons.js`). Onde este guia diz "roxo", leia "cor da marca". O coral de alerta e REC continua coral. Auditoria em `docs/cor-da-marca.md`.

`"estilo": "cartoes"` monta cada frase como uma peça de interface em cima de um papel creme quadriculado: **fundo `#E8E4DE` com grade de 96 px** que se move com paralaxe, cartões e janelas grafite com sombra longa neutra, tiles 3D brancos, roxos e pretos com bisel, token preto com anéis e órbita, e o **lettering no alto em degraus**, em bold escuro com uma palavra serifada itálica roxa duas a três vezes maior. A câmera dá zoom sobre um ponto focal e o último elemento de uma cena vira o primeiro da próxima. Campos em `docs/cena/estilos-motion.md`.

## Processo
1. **Fala de 30 a 45 s** (modelo `cartoes`).
2. Um **objeto-herói literal por frase** (comando -> `janela` digitando com `tecla`; vários recursos -> `grade` de cartões; dentro de um sistema -> `token`; resultado -> `etapas` ou `chip`).
3. Encadeie: a caixa de um beat (cartão, janela, token, celular) vira a caixa do beat seguinte por morph de largura, altura, raio e cor. Ponha a caixa principal como primeiro elemento do beat.
4. Use `"som": "virada"` (ou `"transicao": "varredura"`) no beat da virada: a câmera mergulha no elemento até 8,5x e volta de 3x (zoom-through).

## Regras da estética (do pacote de origem)
- Acento roxo `#7B4DFF` / `#A98BFF` só nos destaques; coral `#E2574C` só para alerta ou REC.
- **Leitura e coluna fixa:** o lettering monta frases de leitura da fala (até ~34 caracteres; frase curta se junta à vizinha), sempre na mesma coluna (margem esquerda 84 px, topo em y 290, degraus de 56 px por linha, até 4 linhas). Cada frase fica do começo ao fim da fala dela e só sai quando a próxima entra. Linha de apoio de 60 a 86 px; o destaque serifado roxo até 170 px. Os elementos ficam no centro da área útil: use `pos` perto de [0.5, 0.7] e `tamanho` de 1,2 a 1,4 no `qr` (o `chip` aceita `tamanho`; o `celular` entra inteiro, sem morph, com o QR já na tela).
- Lettering palavra a palavra travado na fala: desfoque 20 -> 0, sobe 44 px, escala 0,8 -> 1, cinza -> preto; o destaque com overshoot. Conectivos 54 px, apoio 64 a 86 px, destaque até 200 px. O bloco sobe 9 px/s e sai para cima com desfoque. O título do beat vira o bloco; sem título, a fala vira blocos de até 5 palavras (o destaque é a palavra mais longa).
- Curva principal cubic-bezier(.42,0,.18,1); entradas (.12,.9,.2,1); sucção (.62,0,.9,.4); overshoot leve.
- Abertura em zoom-out 2,15 -> 1 em 1,65 s; deriva mínima da câmera (5 e 7 px); empurrão lento dentro do beat.
- Desfoque de movimento só por supersampling temporal (6 subquadros, obturador de 180°), nunca desfoque fixo.
- Cada cartão tem micro-animação interna (barras crescendo, linha desenhando, órbita, digitação, progresso).
- Logos oficiais nunca são desenhados (estrela genérica de 8 raios). Sem assinatura: termina em dissolve.
- **Som:** pop em cada entrada, tique por palavra-chave, whoosh nos slides e zooms, slap nos cartões empilhando, click, thunk e ding na tecla, bloop nos anéis, impact e reverse swell no zoom-through, digitação. Sem música.

## Elementos (`{ "tipo": "cartoes", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `cartao` | cartão 372x326 com micro-animação | `dados.tipo`: `barras` (`dados.valores`, `destaque`), `orbita`, `avisos` (`dados.itens`), `codigo`, `tipografia`, `celular`; `pos`, `tamanho` |
| `grade` | seis cartões em cascata que no fim colapsam em pilha | `dados.tipos` (seis), `pos`, `tamanho` |
| `janela` | janela de prompt com chips, digitação em mono e botão de enviar | `texto`, `chips`, `rodape`, `tecla: true` (tecla Enter 3D pressionada), `dados.altura` |
| `token` | token preto com estrela, anéis desenhados, halo e órbita de tiles | `icones` (até 10) |
| `tile` | tile 3D com ícone de linha | `icone` (chart, play, chat, spark, bolt, code, music, img, layers, eye, check, folder, pen, doc, wave, up, star), `papel` (frente branco, destaque roxo, sombra preto) |
| `etapas` | até 4 cartões escuros numerados com check roxo | `itens: [{ "titulo", "sub", "icone" }]` |
| `chip` | pílula branca com número roxo subindo | `valor`, `prefixo`, `sufixo`, `legenda` |
| `celular` | celular com REC, token, legenda digitada e barra de progresso; com `qr: true`, a tela mostra um QR com mira, linha de leitura e check | `texto`, `marca`, `qr` |
| `qr` | QR code real de 25 módulos (localizadores, sincronia, alinhamento) em cartão branco; pode rasgar, perder módulos e se recuperar, ser lido, mostrar as guias, girar, ganhar logo, etiqueta de peça ou os níveis L, M, Q, H | `dados`: `rasgo`, `dano` (0 a 0,3), `recupera`, `rotuloDano`, `leitura`, `guias`, `gira`, `modulos`, `logo`, `etiqueta`, `niveis`, e os tempos (palavra ou segundos) `emDano`, `emRecupera`, `emLeitura`, `emGuias`, `emNiveis`, `emModulos` |
| `cursor` | seta em arco até o alvo e clique com anel roxo | `pos` (o alvo) |
Peças 3D viram barro branco, grafite ou roxo com sombra longa no creme; o `contador` vira um chip grande.

```json
{ "tema": "QR CODE", "estilo": "cartoes", "beats": [
  { "id": "gancho", "palavras": [0, 9], "titulo": { "texto": "Um QR code funciona *rasgado*" }, "elementos": [ { "tipo": "cartoes", "forma": "grade", "entra": 0, "pos": [0.5, 0.62], "tamanho": 0.75 } ] },
  { "id": "origem", "palavras": [10, 24], "elementos": [ { "tipo": "cartoes", "forma": "janela", "texto": "rastrear peças de carro", "chips": ["/1994", "/japão"], "entra": "criado", "tecla": true } ] },
  { "id": "matematica", "palavras": [25, 45], "som": "virada", "elementos": [ { "tipo": "cartoes", "forma": "token", "entra": "matemática", "icones": ["code", "layers", "check", "eye"] } ] },
  { "id": "trinta", "palavras": [46, 62], "elementos": [ { "tipo": "cartoes", "forma": "chip", "valor": 30, "sufixo": "%", "legenda": "pode sumir", "entra": "trinta" } ] } ] }
```

## Misturar
`"estilo": "cartoes"` num beat põe aquele momento na grade creme. Um `cartao`, `tile` ou `chip` solto em outro estilo aparece por cima, com sombra própria.

Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-cartoes`.

Técnica reescrita a partir do pacote motion-editorial-3d (o engine.html, o render.py e o sfx.py embutidos; sem licença declarada; o criador citado e as marcas do exemplo não aparecem no estúdio; ver `AVISOS-TERCEIROS.md`). Fontes do estúdio no lugar das do pacote: Inter Tight Bold (como a Helvetica) e Instrument Serif Italic (como a serifada do destaque).

## Kit aberto: o objeto-herói de cada frase (Onda 4)

Cada frase ganha o próprio objeto-herói. Em vez de escolher uma das formas fixas do estilo, o assistente desenha o assunto da frase em `projetos/<nome>/pecas.js`, no export `cartoes`:

```js
export const cartoes = {
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

`src/video/autoplano-cartoes.mjs` (`planejarCartoes`) lê a narração com tempo por palavra e as peças declaradas e monta os beats: um objeto-herói por frase (o desenho cujas palavras cobrem a frase; sem cobertura o plano falha e diz o que declarar), o herói em uma cadeia contínua entre os beats (sem reentrada), a regra do verbo (a fase 1 começa na palavra do verbo: gerúndio, infinitivo de ação ou particípio) e a distribuição das outras fases até uma fase final com folga para segurar. O quadro da frase muda o rótulo: "causa e efeito" e "o que acontece quando" pedem os papéis causa e efeito; "o que muda quando" pede antes e depois; "mostre as etapas" e "como funciona" mostram o andamento. No máximo 3 momentos por 3 s de fala (entradas a menos de 0,5 s contam como um) e 1 objeto principal por beat. O herói vai num cartão (`forma: "aberto"`, `dados.cartao`: largura e altura) com o nome da fase no rodapé, um ponto por etapa e o papel (causa, efeito, antes, depois) no canto; o cartão flutua e o desenho respira, como nas origens (metas de origem: parado 11 a 26%, 8 a 17 px por quadro).

## Verificadores e medidor de movimento

`src/video/f2-verificar.mjs` (`verificarCena`) confere, sem render: herói declarado e igual ao de `pecas.js`; cobertura da frase; uma cadeia só; fases em ordem, com 0,9 s ou mais cada uma (morph de 0,6 s mais o segurar de 0,3 s); regra do verbo (tolerância de 0,35 s); 3 momentos por 3 s; no máximo 2 níveis de texto por beat; protagonista em todo beat; nenhum boneco de pessoa; metas de movimento (`METAS_F2`): tela parada, deslocamento por quadro, maior intervalo parado e o segurar depois do pouso. `formasRepetidas` reprova duas frases diferentes com a mesma forma. O QA do motor continua sendo outra camada e não prova que o desenho mostra a frase.

## Foto da pessoa citada

A foto real (`scripts/buscar-imagem.mjs`) entra com o acabamento do estilo (cartão branco com bisel e sombra longa, etiqueta roxa com o nome embaixo); a caixa e o tamanho vêm do motor (regra do estúdio, 29/10) e nunca há texto sobre a foto. O planejador recusa pessoa citada pelo nome sem foto. Com foto, o beat 1 mostra a foto e o herói entra no beat 2.

## Conformidade aberta

30 casos livres em `estilos/cartoes/casos.json`, sem ElevenLabs (`node scripts/conformidade-f2.mjs --estilo=cartoes`, que usa `--voz=mock --sem-musica`). As fixtures (`test/estilos-autorados/cartoes/<caso>/pecas.js`) foram desenhadas à mão para cada frase. O QA sem falhas não conta: o caso só vale com o veredito visual (`veredito.json`, a partir de `scripts/quadros-f2.mjs`).




