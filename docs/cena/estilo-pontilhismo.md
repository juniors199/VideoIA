

# Cena: pontilhismo e elemento pontos

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `pontos` | `forma`, `arquivo` (retrato/imagem), `texto`, `icone`, `dados`, `papel`, `morph`, `espalha`, `tamanho`, `pos [fx, fy]`, `gira` (veja "Pontos" abaixo) |

## Pontos (estilo `pontilhismo` e elemento `pontos`)
Um único sistema de cerca de 5.600 partículas que morfa de uma forma para a outra (`src/video/engine/pontos.js`). Como escolher as formas: `docs/pontilhismo.md`.

**Elemento `pontos`** (em qualquer estilo):
```json
{ "tipo": "pontos", "forma": "retrato", "arquivo": "assets/tesla.jpg", "dados": { "corte": [0.1, 0.1, 0.84, 0.78] }, "entra": "Tesla", "morph": 0.6 }
{ "tipo": "pontos", "forma": "texto", "texto": "1888", "entra": "1888" }
{ "tipo": "pontos", "forma": "lampada3d", "papel": "destaque", "entra": "ideia" }
{ "tipo": "pontos", "forma": "icone", "icone": "bateria", "entra": "força" }
```
- `forma`: `retrato` ou `imagem` (foto em meio-tom de grade; `arquivo` é a foto em `assets/` ou o `.json` de `scripts/imagem-para-pontos.mjs`; `dados` aceita `corte [x,y,larg,alt]` (corte só no busto), `colunas`, `modo` (`grade`, o padrão, ou `pontilhado` com `pontos` de 15 a 40 mil), `fundo` auto|nenhum|transparente, `recorte` auto|cor, `mascara` (PNG da pasta, branco = sujeito), `protege [cx,cy,rx,ry]`, `vinheta` 0..1, `gama`, `realce`, `inverter`), `texto` (`texto`, até ~12 caracteres; `\n` quebra linha; um glifo sozinho balança em 3 camadas), `icone` (`icone`, os mesmos do `traco`), `caminho` (`dados: { "d": [...], "viewBox": [w, h] }`), `svg` (`svg` com o texto ou `arquivo` .svg), as geométricas `esfera`, `anel`, `toro`, `cubo`, `galaxia`, `onda`, `tunel`, `grade`, `espiral`, `olho`, `aneis`, `nuvem`, `cabeca` (perfil com a mente dentro), as técnicas por partes `motor`, `engrenagem` (`dados.dentes`, `dados.par`) e `bobina` (`dados.voltas`), **o nome de qualquer peça do repertório** (procedural, `glb-*` ou do `pecas.js`: a superfície vira pontos, com arestas, luz e silhueta) ou uma forma de pontos do projeto (`export const pontos` no `pecas.js`, veja `docs/pontilhismo.md`).
- `estado` e `estados`: objetos por partes têm estados contínuos (`motor`: `repouso`, `explode`, `explodido`, `monta`, `liga`, `gira`, `altera`, `cresce`, `pequeno`; `engrenagem`: `gira`; `bobina`: `liga`). `"estados": [{ "em": "movido", "estado": "explode" }, { "em": "alternada.", "estado": "liga" }]` troca o estado na palavra (ou em segundos depois do início do beat), sem morph.
- Mais formas: `ampulheta` (areia caindo), `margens` (IMAGINAR × EXECUTAR; estados `distante`, `ideia`, `cai`, `aproxima`), `prompt` (cartão digitando `texto`, com `titulo` opcional), `terra` (camada densa: 26 mil pontos com os continentes de `arquivo`, um mapa equirretangular de licença livre como o Blue Marble da NASA) e `galaxia-densa` (60 mil pontos). A camada densa usa sprite macio e mistura aditiva e entra e sai em fade cruzado com o sistema principal (só no pontilhismo).
- `rotulos` (no elemento ou em cada item de `estados`, só no pontilhismo): `[{ "texto": "ESTATOR", "ancora": [0, -345, -120], "dx": -150, "dy": -90 }]`. Rótulo 3D com ponto, linha-guia e texto em mono (espaçamento 3), ancorado num ponto da forma (o mesmo espaço dos pontos dela), aparece depois do morph e sai antes da próxima forma; se não couber do lado pedido, vira para o outro.
- Astros e elementos com volume (`sol`, `globo`, `sistema`, `barras`, `floco`, `ampulheta`, `termometro`, `diferente`, `seguir`): campos em `docs/pontilhismo.md` ("Astros e elementos com volume"). Exemplo: `{ "tipo": "pontos", "forma": "globo", "entra": 0, "dados": { "R": 300, "tilt": 23.4, "inclinaDe": 0, "inclinaEm": [0.9, 1.3], "eixo": true }, "rotulos": [{ "texto": "23,4°", "ancora": "arco", "dx": 80, "tam": 56, "serif": true }] }`. `rotulos[].ancora` aceita o nome de uma âncora da forma; `tam`, `serif`, `semLinha` e `dx: 0` (centrado) ajustam o rótulo. Estados novos: `orbita`, `jan`, `jul`, `volta`, `base`, `diferenca`, `pct`.
- `compor`: `[{ "forma": "cabeca", "opac": 0.45 }, { "forma": "motor", "estado": "pequeno", "esc": 1, "pos": [0, 0] }]` (no lugar de `forma`): várias formas no mesmo espaço de partículas.
- `camera` (só no pontilhismo, no elemento ou em cada item de `estados`): `{ "yaw": -0.55, "pitch": 0.35, "dist": 1500, "alvo": [x, y], "roll": 0, "d": 0.9 }`. Vale dentro do beat do elemento, com transição de `d` segundos; fora dele, a câmera do beat. O mergulho final vai no `alvo` da última pose.
- `entra` (palavra ou segundos): quando a forma começa a se formar. Cada `pontos` de um beat é uma forma nova na sequência (vários por beat valem: retrato na palavra "Tesla", cérebro na palavra "cabeça").
- `morph` (s): duração da transformação (padrão: 0,6 na primeira forma, 0,7 em frase longa, 0,4 quando a próxima vem em menos de 1,5 s; o motor nunca deixa passar de ~1/3 do tempo até a próxima). `espalha` (0 a 1): atraso aleatório por ponto (padrão 0,12 a 0,25).
- `tamanho` (0,2 a 2), `pos [fx, fy]` (frações da área da cena, 0,5 é o meio), `gira` (rad/s; `0` deixa parada).
- `papel` dá a cor no modo misto (`destaque` = cor da página); no pontilhismo tudo é `#EDEBE6`.
- **No vídeo normal**, os pontos entram vindos de uma nuvem e se espalham no fim do beat; se o beat seguinte começa com `pontos`, morfam direto. O QA mede a forma (lateral e faixa da legenda) e a folha de contato ganha um quadro por forma. Não misture com `peca` no mesmo beat.

**Estilo `pontilhismo`** (`"estilo": "pontilhismo"` na cena): preto `#050505` e pontos `#EDEBE6`, câmera viva num mundo 3D (o `camera` do beat vira órbita, aproximação, vista de cima, respiração sutil), legenda palavra por palavra com a falada em bold, sem efeitos sonoros nem cama musical (peça com `"efeitos": { "sfx": true, "musica": true }`) e final mergulhando no centro da última forma até o preto. Os outros elementos se adaptam:
- `peca` e `traco` viram formas em pontos (a peça amostrada, o ícone em traço de pontos);
- `imagem` vira obra com momento próprio: abre do centro, em preto e branco, a moldura de pontos corre em volta e o crédito aparece embaixo (`obra`: título em itálico; `credito`: autor · ano · acervo). É a exceção à regra do crédito fora da tela;
- `contador` aparece em serifada grande (Instrument Serif) dentro de círculos concêntricos de pontos, com a `legenda` em mono acima; `de` (valor inicial, ex.: 1856) e `dur` (segundos da contagem) controlam a contagem, e `aneis: false` tira os círculos; `rotulo` e `titulo` não aparecem no vídeo (o título ainda serve para a capa; prefira `capa.texto`);
- a forma anterior continua na tela até a próxima, então a entrada não é antecipada para o começo do beat.

```json
{ "tema": "NIKOLA TESLA", "estilo": "pontilhismo", "capa": { "texto": "Tesla via a máquina *inteira* antes de construir" },
  "beats": [
    { "id": "gancho", "palavras": [0, 12], "camera": { "plano": "normal", "mov": "avanca" }, "elementos": [
      { "tipo": "pontos", "forma": "retrato", "arquivo": "assets/tesla.jpg", "entra": 0, "morph": 0.6 },
      { "tipo": "pontos", "forma": "cerebro", "entra": "cabeça" } ] },
    { "id": "edison", "palavras": [36, 46], "elementos": [
      { "tipo": "imagem", "arquivo": "assets/edison.jpg", "obra": "Thomas Edison", "credito": "Levin C. Handy · c. 1878 · domínio público", "entra": "Thomas" } ] },
    { "id": "fecho", "palavras": [133, 148], "elementos": [ { "tipo": "pontos", "forma": "esfera", "entra": "ideia" } ] }
  ] }
```
Ferramentas: `node scripts/imagem-para-pontos.mjs <foto> <saida.json> [--corte ...] [--limiar ...]` (grava também a prévia `.jpg`) e `node scripts/folha-pontos.mjs <projeto> [--mp4]` (um quadro por forma). Exemplos completos: `projetos/teste-pontilhismo-a` (pontilhismo) e `projetos/teste-pontilhismo-b` (padrão com 3 beats em pontos).

## Pontos: estilo pontilhismo e beats em pontos
Leia `docs/pontilhismo.md` (campos na seção "Pontos" acima, neste arquivo).
- **Vídeo inteiro em pontos** (`"estilo": "pontilhismo"`): para cada frase, pergunte "o que a pessoa precisa VER?" e escreva uma forma por ideia (`{"tipo": "pontos", "forma": ..., "entra": "<palavra>"}`, vários por beat). Abra com o protagonista: `retrato` da foto de licença livre (`scripts/buscar-imagem.mjs`, conferida com `scripts/imagem-para-pontos.mjs`) com `entra: 0`. Foto ou obra histórica vira `imagem` com `obra` e `credito` (momento próprio com moldura de pontos). Dirija a câmera em todos os beats. Termine numa forma com centro forte (`esfera`, `olho`, `retrato`): o vídeo mergulha nela até o preto. Use `capa.texto` para a capa (o título não aparece no vídeo).
- **Beats em pontos num vídeo normal** (elemento `pontos`): 2 ou 3 momentos (o retrato de quem é citado, o número, a metáfora da virada), sem peças 3D no mesmo beat, com `papel` para a cor.
- **Elemento antes de número** (regra do estúdio, 31/10/2026): número ou texto em pontos só quando o número é o protagonista da frase e nenhum elemento o representa. Passe cada beat pela tabela de `docs/pontilhismo.md` ("Elemento antes de número"): eixo e inclinação são a Terra que inclina com o arco do ângulo (`globo`); distância entre astros é a linha entre Sol e Terra 3D (`sistema`); órbita é a elipse com a Terra percorrendo (`sistema` modo `orbita`); diferença e porcentagem são barras (`barras`); o Sol é `sol` (esfera de pontos com volume, nunca disco). O número vira `rotulo` pequeno preso à âncora do elemento. Sol e Terra sempre com volume.
- **Checklist do estilo** (`docs/pontilhismo.md`): capa nítida, foto com crédito legível e 1,5 s de foto plena, cauda de 1,2 s, respiros naturais (`scripts/respiros.mjs --naturais`), nada além de 86% da largura, revisão a 5 qps.
- **Antes de escrever, mostre a tabela** fala, pergunta (o que a pessoa precisa VER?), ilustração e câmera.
- **Formas:** as próprias (`retrato`, `texto`, `icone`, `caminho`, `svg`, `cabeca`, `motor`, `engrenagem`, `bobina`, `onda`, `olho`...) ou o nome de qualquer peça do repertório (vira pontos com arestas e luz). Objeto técnico tem estados (`"estados": [{ "em": "palavra", "estado": "explode" }]`) e câmera por estado; `compor` junta formas (cabeça com o motor dentro). Morph de 0,3 a 0,5 s em frase curta (o motor encurta sozinho).
- **Nunca troque o assunto por uma forma genérica** (toro não é motor). Se a forma não existe, crie: peça no `pecas.js`, GLB CC0, `caminho`/`svg` desenhado em código, foto de referência de licença livre (`imagem`) ou forma de pontos por partes com estados (`export const pontos` no `pecas.js`). Receita em `docs/pontilhismo.md` ("Como criar qualquer objeto").
- Confira cada forma em `saida/qa/folha.jpg` ou com `node scripts/folha-pontos.mjs <projeto>` (e `--mp4` depois do render): o que vira "nuvem" ou bloco, refaça.




