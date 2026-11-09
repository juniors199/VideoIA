

# Estilo tubo: TV de tubo, palavra gigante em contorno

> **Cor (0.6.29):** o vermelho e o rosa do tubo (antes `#EB1628` e `#FF7896`) são a cor da marca da página e um tom mais claro dela; o branco frio e o preto da TV não mudam. Onde este guia diz "vermelho" ou "rosa", leia "cor da marca" e "tom mais claro da marca". Auditoria em `docs/cor-da-marca.md`.

`"estilo": "tubo"` faz o vídeo parecer gravado numa TV de tubo escura: preto de cerca de 6/255 com poeira e um HUD discreto, máscara CRT de 6,6 px que aparece nas partes claras, eco, faixa clara rolando, flicker, tremor de linha e franja vermelha e verde de 1 px. O texto é a fala: frases curtas em MAIÚSCULAS que entram por palavra inteira, uma **palavra gigante só em contorno** que pousa com fantasma, o objeto da metáfora que voa em **rosa holográfico e pousa em metal**, e o fogo final que lava a tela de rosa. Tudo em Easy Ease (u²(3-2u)), sem corte seco. Campos em `docs/cena/estilos-motion.md`.

## Processo
1. **Fala de 30 a 45 s** (modelo `tubo`), em blocos curtos. O padrão do pacote: bloco de frase, bloco com palavra gigante, bloco com objeto, e repetir.
2. Escolha **palavras gigantes de 4 a 6 letras** (PLANO, ÁGUA, MEL): ela sempre cabe inteira na tela, mas palavra longa fica pequena.
3. A metáfora e o objeto vêm da fala. O objeto é uma peça do repertório (ou do `pecas.js`): no estilo, toda peça entra voando de baixo-esquerda em rosa e pousa em metal.
4. Feche com `{ "tipo": "tubo", "forma": "fogo" }` no último beat (a pluma sai do objeto pousado e a tela vira rosa nos últimos 0,6 s).

## Regras da estética (do pacote de origem)
- Easy Ease em tudo; uma cena se desfaz (escala, desfoque e fade) enquanto a próxima entra.
- Palavras inteiras, nunca letra por letra: cada uma entra em 0,30 s (desfoque 6 -> 0, escala 1,12 -> 1).
- Branco frio `#D6D4D7`, vermelho `#EB1628` (a palavra-chave em negrito itálico), rosa `#FF7896` (pulso, holograma, chicote).
- A palavra gigante pulsa em rosa logo depois de pousar, tem um glitch de letras que somem e sai num chicote girando para cima.
- A textura de TV é obrigatória e vai no quadro inteiro (inclusive no 3D).
- Sem assinatura nem @ no final.
- **Som:** tique a cada palavra, whoosh nas transições, hit grave no pouso da gigante, shimmer no pulso rosa, draw no voo do objeto, thud no pouso, pop na palavra vermelha, whoosh e hit no fogo. Sem música.

## Elementos (`{ "tipo": "tubo", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `frase` | bloco de 2 linhas: a de cima branca, a de baixo (o `*destaque*`) vermelha negrito itálico; começa apagado, inclina para itálico e volta, sai com escala e desfoque | `texto` |
| `gigante` | palavra gigante em contorno com texto pequeno em cima e embaixo | `texto`, `acima`, `abaixo` |
| `chave` | palavra branca e, embaixo, a palavra-chave vermelha negrito que brilha | `texto` com `*destaque*` |
| `fogo` | pluma de fogo do objeto pousado e lavagem rosa no fim | `lavagem: false` tira a lavagem |
Peças com `dados.material: "original"` mantêm a cor (pote de mel, escala de pH) em vez do holograma e do metal. O `titulo` do beat vira um bloco `frase` no alto; o `contador` vira número gigante em contorno; a legenda (quando não há texto do estilo na tela) sai em Roboto MAIÚSCULA por palavra inteira.

```json
{ "tema": "MEL", "estilo": "tubo", "beats": [
  { "id": "gancho", "palavras": [0, 9], "titulo": { "texto": "Um pote de mel dura *milhares de anos*" } },
  { "id": "agua", "palavras": [10, 30], "elementos": [ { "tipo": "tubo", "forma": "gigante", "texto": "ÁGUA", "acima": "falta de", "abaixo": "é o segredo", "entra": "água" } ] },
  { "id": "pote", "palavras": [31, 50], "elementos": [ { "tipo": "peca", "forma": "garrafa", "entra": "ácido" }, { "tipo": "tubo", "forma": "chave", "texto": "sem *chance*", "pos": [0.5, 0.92], "entra": "chance" } ] },
  { "id": "fecho", "palavras": [51, 62], "elementos": [ { "tipo": "peca", "forma": "garrafa", "entra": 0.1 }, { "tipo": "tubo", "forma": "fogo", "entra": "apodrece" } ] } ] }
```

## Misturar
`"estilo": "tubo"` num beat de outro estilo põe só aquele momento na TV (por exemplo, a virada). Um `gigante` solto num beat de outro estilo aparece em contorno, com pulso e chicote, sem a textura de TV.

## Erros comuns
| Erro | Correção |
|---|---|
| Palavra gigante longa (fica pequena) | 4 a 6 letras; o resto vai no `acima`/`abaixo` |
| Texto do estilo e legenda repetindo a fala | o estilo já esconde a legenda quando há frase, gigante ou chave na tela |
| Peça encostando no texto de baixo | `pos` da chave mais alto ou peça menor |

Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-tubo`.

Técnica reescrita a partir do pacote motion-expert, versão de 08/10/2026 (SKILL.md, scripts/motion_tv.py e scripts/sfx.py; sem autor nem licença declarados). As linhas citadas no código (`motion_tv.py:NNN`) são desse arquivo e foram conferidas em 29/10/2026; detalhes em `AVISOS-TERCEIROS.md`. As fontes condensada e Roboto são as livres Antonio (OFL) e Roboto (Apache 2.0).

## Kit aberto: o objeto-herói de cada frase (Onda 4)

Cada frase ganha o próprio objeto-herói. Em vez de escolher uma das formas fixas do estilo, o assistente desenha o assunto da frase em `projetos/<nome>/pecas.js`, no export `tubo`:

```js
export const tubo = {
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

`src/video/autoplano-tubo.mjs` (`planejarTubo`) lê a narração com tempo por palavra e as peças declaradas e monta os beats: um objeto-herói por frase (o desenho cujas palavras cobrem a frase; sem cobertura o plano falha e diz o que declarar), o herói em uma cadeia contínua entre os beats (sem reentrada), a regra do verbo (a fase 1 começa na palavra do verbo: gerúndio, infinitivo de ação ou particípio) e a distribuição das outras fases até uma fase final com folga para segurar. O quadro da frase muda o rótulo: "causa e efeito" e "o que acontece quando" pedem os papéis causa e efeito; "o que muda quando" pede antes e depois; "mostre as etapas" e "como funciona" mostram o andamento. No máximo 3 momentos por 3 s de fala (entradas a menos de 0,5 s contam como um) e 1 objeto principal por beat. O herói (`forma: "aberto"`) voa de baixo-esquerda em rosa holográfico e pousa em linha de fósforo branca; a chave (palavra branca e a palavra-chave vermelha) aparece no instante do verbo e depois traz o nome da fase. O `texto` do elemento aberto é só o nome do herói (a validação do tubo exige texto em toda forma que não seja fogo).

## Verificadores e medidor de movimento

`src/video/f2-verificar.mjs` (`verificarCena`) confere, sem render: herói declarado e igual ao de `pecas.js`; cobertura da frase; uma cadeia só; fases em ordem, com 0,9 s ou mais cada uma (morph de 0,6 s mais o segurar de 0,3 s); regra do verbo (tolerância de 0,35 s); 3 momentos por 3 s; no máximo 2 níveis de texto por beat; protagonista em todo beat; nenhum boneco de pessoa; metas de movimento (`METAS_F2`): tela parada, deslocamento por quadro, maior intervalo parado e o segurar depois do pouso. `formasRepetidas` reprova duas frases diferentes com a mesma forma. O QA do motor continua sendo outra camada e não prova que o desenho mostra a frase.

## Foto da pessoa citada

A foto real (`scripts/buscar-imagem.mjs`) entra com o acabamento do estilo (moldura de HUD com cantos, tom de fósforo, varredura rosa e o nome em maiúsculas embaixo); a caixa e o tamanho vêm do motor (regra do estúdio, 29/10) e nunca há texto sobre a foto. O planejador recusa pessoa citada pelo nome sem foto. Com foto, o beat 1 mostra a foto e o herói entra no beat 2.

## Conformidade aberta

30 casos livres em `estilos/tubo/casos.json`, sem ElevenLabs (`node scripts/conformidade-f2.mjs --estilo=tubo`, que usa `--voz=mock --sem-musica`). As fixtures (`test/estilos-autorados/tubo/<caso>/pecas.js`) foram desenhadas à mão para cada frase. O QA sem falhas não conta: o caso só vale com o veredito visual (`veredito.json`, a partir de `scripts/quadros-f2.mjs`).




