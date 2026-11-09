

# Estilo alternativo (3D Alternativo): dados, mapas e qualquer objeto em nuvem de pontos

> **Cor (0.6.29):** o acento (antes lime `#F4FA7C`) é a cor da marca da página, com ou sem `paleta` ou `tema` no elemento. `"paleta": "lime"`, `"ciano"` e `"laranja"` continuam existindo como escolha explícita, e `"tema": { ... }` mistura cores por cima da marca. Por que o `"marca"` não funcionou na 0.6.28: o estilo gravava o lime em `spec.marca.destaque`, então a paleta "marca" lia o próprio lime. Onde este guia diz "lime", leia "cor da marca". Auditoria em `docs/cor-da-marca.md`.

`"estilo": "alternativo"` faz o vídeo como um painel de dados em 3D: **milhares de discos pequenos** formam o mapa, o objeto ou o gráfico do assunto sobre um preto quente com brilho suave e vinheta; **um acento verde-limão** marca o que importa (estados acesos, cópias que acendem, a coluna principal); **colunas e blocos extrudados** crescem do chão com etiquetas em mono; a **câmera desliza, inclina e se aproxima** do que a fala cita, com desfoque de profundidade nos planos baixos; e uma **interface de dados** fica por cima (cabeçalho mono, pílula de modo, legenda de cores, fontes, chips, cartão de número com contador, tópicos, callouts, carimbo, trilha de etapas). A legenda de fala é do estilo: 1 linha numa pílula translúcida, palavras ditas em lime e as por dizer em cinza.

Vale na cena inteira (`"estilo": "alternativo"`) ou num beat (`"estilo"` do beat). Os elementos `{ "tipo": "alternativo", ... }` também entram soltos num beat de outro estilo (a nuvem aparece num painel escuro no meio do quadro). Código: `src/video/engine/estilo-alternativo.js`. Estilo (com ficha própria): `alternativo`. Exemplo completo: `projetos/exemplo-estilo-alternativo`.

## Processo
1. **Um dado por frase, fatos em 2 fontes** (`fontes.md`). Número redondo e atribuído ("segundo o IBGE").
2. **Roteiro** (modelo `alternativo`, 80 a 150 palavras): gancho com o número, um dado por frase, virada, CTA.
3. **Tabela antes da cena:** para cada frase, que forma está na tela, o que acende (lime) e em que palavra. Algo muda a cada 1 a 3 s (forma nova, realce, coluna, número, câmera).
4. **Cena** (`cena.json`), QA do motor, render, **revisão a 5 quadros por segundo** (`docs/QA-VIDEO.md`).

## O gerador: qualquer assunto em pontos, sem peça pronta
O assunto nunca fica preso ao que existe. Escolha a fonte nesta ordem:

| Quero mostrar | Forma | Como pedir |
|---|---|---|
| Brasil por estado, região, um estado sozinho | `mapa` | `"mapa": "brasil"` (padrão), `"estados": ["SP", "sul"]` para recortar |
| Mundo, continente, um país, alguns países | `mapa` | `"mapa": "mundo"`, `"mapa": "europa"` (america-do-sul, america-do-norte, europa, africa, asia, oceania), `"pais": "Argentina"`, `"paises": ["Chile", "PER"]` |
| Pessoas, cadeiras, votos, casas, carros... contados | `conjunto` | `"objeto": "pessoa"`, `"quantidade": 10`, `"arranjo": "fila"`, `"acesos": 4` |
| Um objeto do assunto que o estúdio já tem | `objeto` | `"objeto": "<peça do repertório>"`, `"objeto": "glb-<modelo>"` ou peça do `pecas.js` do projeto (amostrada em pontos com a luz pela normal) |
| Um objeto simples sem peça pronta | `objeto` | `"objeto": "<receita>"`: `pessoa`, `casa`, `predio`, `moeda`, `documento`, `urna`, `cadeira`, `seta`, `carro`, `arvore`, `saco`, `barra` |
| Um objeto montado na hora | `objeto` | `"primitivas": [...]` (abaixo) |
| Um logo, um ícone, um contorno (país, bandeira, símbolo) | `objeto` | `"silhueta": { "d": "<caminho SVG>", "viewBox": [w, h], "profundidade": 0.16 }` ou `"arquivo": "assets/forma.svg"` (extrudado em 3D) |
| Uma foto ou máscara (rosto, prédio, animal) | `objeto` | `"arquivo": "assets/foto.jpg"` (vira pontos com o tom como relevo; `.json` de `scripts/imagem-para-pontos.mjs` também vale) |
| Uma palavra, um número, uma sigla | `texto` | `"texto": "PIB"` (até 14 caracteres, extrudado) |
| Contagem em grade (urnas, dias, quadrados que acendem) | `blocos` | `"colunas": 12, "linhas": 8, "acesos": 37` |
| Fundo de dados abstrato | `grade`, `onda`, `globo`, `anel`, `espiral`, `cubo` | sem campos |

Toda troca de forma é um **morph**: cada disco voa da forma anterior para a nova em arco (1,5 s, atraso próprio de até 0,5 s). Os blocos sobem do chão por linha enquanto os discos somem neles.

### Primitivas (objetos montados na hora)
`"primitivas"`: lista de 1 a 40 peças `{ "tipo", "pos": [x, y, z], ... }` (y para cima, centro da peça), girando com `"gira"` (graus em y), `"inclina"` (graus em x) e `"rola"` (graus em z). O objeto inteiro é assentado no chão e escalado para caber; a escala absoluta não importa, só a proporção entre as peças.

| tipo | medidas |
|---|---|
| `caixa`, `placa` | `"tam": [largura, altura, profundidade]` |
| `esfera` | `"raio"` |
| `cilindro`, `capsula` | `"raio"`, `"altura"` |
| `cone` | `"raio"`, `"altura"`, `"lados"` (4 = pirâmide, telhado) |
| `toro` | `"raio"`, `"tubo"` |

Exemplo, uma garrafa: `[{ "tipo": "cilindro", "raio": 0.5, "altura": 1.6, "pos": [0, 0.8, 0] }, { "tipo": "cone", "raio": 0.5, "altura": 0.5, "pos": [0, 1.85, 0] }, { "tipo": "cilindro", "raio": 0.16, "altura": 0.5, "pos": [0, 2.3, 0] }]`. Cada primitiva é um grupo: `"realce": [2]` acende só a terceira (o gargalo).

### Arranjos do conjunto
`fila` (até 10 por linha), `grade`, `hemiciclo` (plenário: acende da esquerda para a direita), `circulo`, `pilha` (moedas, caixas empilhadas), `dispersa`. `quantidade` de 1 a 200. `acesos` acende as N primeiras cópias **em sequência** (a contagem dura `duracaoAcesos` s, padrão até 2,2 s), com um tique por cópia.

## Formas (`{ "tipo": "alternativo", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `mapa`, `objeto`, `texto`, `conjunto`, `blocos`, `grade`, `onda`, `globo`, `anel`, `espiral`, `cubo` | a nuvem (veja o gerador) | `realce`, `acesos`, `cinza`, `camera`, `gira` (rad/s), `tamanho` |
| `colunas` | colunas 3D extrudadas (faces com luz, sombra de contato, aresta acesa) que crescem uma a uma com etiqueta mono `RS · 65`; a de destaque em lime | `itens: [{ "rotulo", "valor", "uf" ou "grupo", "destaque" }]` (1 a 8), `unidade`, `casas`, `altura`, `fica` |
| `numero` | cartão com o número contando até o valor (rótulo em caixa alta embaixo); com `valor2`, dois números lado a lado (`79 · 278`) | `valor`, `de`, `casas`, `prefixo`, `sufixo`, `rotulo`, `valor2`, `rotulo2` |
| `topicos` | lista de tópicos (bullet), cada um entra na palavra dita | `itens: ["texto" ou { "texto", "destaque", "em" }]` (1 a 5) |
| `chip` | etiqueta mono em lime; `"tom": "escuro"` para etapas apagadas; `"centro": true` centra a linha | `texto` (até 34) |
| `callout` | ponto, linha e caixa mono apontando um lugar; `"anel": true` desenha um anel lime no chão | `texto`, `uf`/`grupo`, `pos` [x, z] ou `tela` [fx, fy], `destaque` |
| `carimbo` | palavra grande numa etiqueta inclinada que bate com tranco (NEGADO, CASSADA) | `texto` (até 16), `tom` (`destaque`), `y` (0 a 1), `giro` |
| `trilha` | etapas no chão ligadas por uma linha tracejada lime que se desenha até a etapa dita; a câmera anda junto | `etapas: [{ "texto", "em", "destaque" }]` (2 a 6) |
| `modo` | troca o texto da pílula do alto (desliza) | `texto`, `icone` (`sol`, `lua`, `ponto`, `nenhum`) |
| `camera` | movimento de câmera na palavra | `foco` (estado, região, país, parte ou [x, z]), `zoom`, `inclina` (graus: 60 = de cima, 20 = rasante), `gira`, `duracao` |

- **Realce** (`realce` em qualquer elemento): estados/regiões/países pelo nome, índices de grupo (partes, cópias, blocos) ou uma fração de 0 a 1. Uma forma nova sem `realce` apaga o anterior; `"realce": null` apaga. No chão, cada disco aceso sobe numa coluninha lime (como cidades acesas).
- **Interface do vídeo** (no primeiro elemento): `"hud": { "marca", "contagem", "perfil", "modo", "icone", "fontes", "legenda": [{ "texto", "cor": "destaque" | "branco" | "cinza" }] }`. O `perfil` (o @) vem sozinho da marca da página (`marca/tokens.json`); só preencha para trocar.
- **Grade do alto:** duas colunas com as mesmas margens laterais (78 px). Linha 1 (centro em y 301): marca · contagem à esquerda e o @ à direita, no mesmo corpo (mono 22 px, apagado) e na mesma linha de base. Linha 2 (y 344 a 400): pílula de modo (mono 28 px) à esquerda e a legenda de cores (mono 18 px) à direita, numa pílula com o mesmo topo, a mesma altura e a mesma linha de base, os itens lado a lado (sem espaço, empilham e o painel cresce para baixo). Linha 3 (centro em y 421): fontes (mono 17 px, apagado) alinhadas à borda da pílula. Chips em y 466. Se a linha 1 não couber, a contagem sai antes do @.
- **Acabamento:** um vidro só (mesmo fundo, borda de 1,5 px e raio de 12 px) para legenda de cores, cartão de número, etiquetas, callouts e etapas; um corpo por papel (mono 26 px nas etiquetas, callouts e etapas; 22 px nos chips; 20 px nos rótulos do número). `"modo"` em qualquer elemento troca a pílula naquele instante.
- **Paleta** (no primeiro elemento): `"paleta": "lime"` (padrão), `"ciano"`, `"laranja"` ou `"marca"` (o destaque da página), ou `"tema": { "destaque": "#...", "fundo": "#..." }`. `"legendaCor": "branco"` deixa a fala dita em branco.
- **Elementos genéricos** num beat do estilo sem elemento próprio também funcionam (o plano automático usa isso): `contador` vira cartão de número, `titulo` vira chip, `peca` vira a mesma peça em pontos.

## Proporções do estilo (medidas na referência, regra do estilo)
Medidas em quadros de 1080 x 1920 dos Reels de referência; valem acima das regras gerais de layout dos Reels (protagonista de 55 a 70% da altura e centralização não se aplicam: aqui a forma fica menor e a interface ocupa o alto, como na referência). Segurança, fato conferido e QA a 5 qps continuam valendo.

| elemento | referência | aqui |
|---|---|---|
| cabeçalho mono | y 292 a 309, x desde 71 | centro em y 301, 22 px, x 78; o @ do perfil à direita na mesma linha |
| pílula de modo | y 346 a 400 (56 px) | y 344, 56 px, mono 28 px |
| linha de fontes | y ~421 | y 422, 19 px |
| legenda de cores | canto direito, à altura da pílula | mesmo topo e altura da pílula, margem direita igual à esquerda |
| chips | y 470 a 513 | y 466, 42 px |
| cartão de número | y 526 a 701 | logo abaixo dos chips, 176 px |
| tópicos | linhas a cada ~62 px, ~40 px | 42 px, a cada 62 px |
| mapa (enquadramento padrão) | x 230 a 845 (~56% da largura), y ~760 a 1220, centro em y ~990 | ~760 px de largura, centro em y 990 (desce quando a pilha de cima cresce) |
| legenda de fala | centro em y ~1478, ~62 px | centro em y 1364 (área segura: a pílula termina em y 1418), 62 px, 1 linha de até 712 px |

## Câmera e composição
- Perspectiva própria com lente longa (distância focal de 2600 px): pouca distorção, cara de cinema. Cada forma traz o enquadramento dela (o mapa visto de cima a 60°; objetos quase de frente; conjunto em plenário a 40°).
- A câmera é dirigida pela fala: forma nova, realce de estado (aproxima e inclina até 44° sobre o grupo), colunas (desce a 36° para mostrar a altura), etapas da trilha (anda de uma para outra), `camera` (foco, zoom, inclinação, giro). Movimentos de 1,9 s na curva suave de quinta ordem, encadeados (cada um parte de onde o anterior estava) e nunca mais de um a cada 0,7 s. Por cima, uma deriva lenta (giro de ±3°, inclinação de ±1,3°, respiração de 2%).
- Câmera baixa (abaixo de ~45°) liga o **desfoque de profundidade**: o fundo da cena fica macio, a frente nítida.
- Zonas (tabela acima): cabeçalho, pílula, fontes e legenda de cores entre y 288 e 434; chips em y 470; cartão de número e tópicos logo abaixo; a nuvem entre y ~470 e 1292 (some em degradê no alto, embaixo e nas laterais, nunca um corte seco na borda); a legenda de fala centrada em y 1364 (área segura de 05/11/2026; a coluna da direita da interface termina em x 928).

## Regras da estética
- Fundo `#141311` com brilho quente no centro (`#22211d`) e vinheta; poeira parada no ar; brilho suave (cópia desfocada somada) que faz os discos e o lime "acenderem".
- Discos com espessura (aro escuro embaixo), variação de tom por disco, alguns mais brilhantes, névoa pela distância; objetos de volume iluminados pela normal (luz de cima à esquerda) e com sombra de contato no chão. **Nada chapado.**
- **Um destaque por vez:** o lime vai num grupo só (estados, cópias, uma coluna, um número). Branco e cinza para o resto; 30% dos discos do mapa em cinza dão a textura (ou `"cinza": [...]` para a segunda categoria da legenda).
- Colunas e blocos: faces laterais com luz própria e degradê vertical, tampo claro com aresta acesa, sombra de contato; o bloco tem uma fenda no tampo (detalhe real).
- Tipografia: Inter Tight (legenda, tópicos), Bricolage Grotesque (números e texto extrudado), JetBrains Mono (cabeçalho, pílula, chips, etiquetas). Todas já do estúdio, OFL.
- Legenda de fala sempre em 1 linha (frases cortadas na pontuação, na pausa ou na largura de 900 px; palavra fraca não fecha frase).
- O quadro 0 já é a cena (a forma inicial nasce pronta). Fecho escurecendo nos últimos 0,4 s.
- **Som:** sopro curto no morph, tiques suaves quando grupos acendem (um por cópia na contagem), tique por coluna e batida grave no fim, tiques do contador e pop no número final, batida no carimbo, tique nas etapas. Secos, baixos, sem música obrigatória.

## Adaptado da referência (e o que fizemos melhor)
| item | na referência | aqui |
|---|---|---|
| objetos | cada cena programada do zero por vídeo (6 primitivas e código sob medida) | gerador por vocabulário: mapa de qualquer país, conjunto contado, primitivas, silhueta SVG, foto, texto, qualquer peça ou GLB do estúdio, sem programar |
| legenda | até 2 linhas | sempre 1 linha (regra da página), mesma posição e tamanho |
| nitidez | discos de tamanho único | disco proporcional à forma (conjunto pequeno, discos finos), brilho somado, desfoque de profundidade, sombra de contato |
| morph | troca seca de cena | cada disco voa em arco; a câmera só aproxima depois que os discos se juntam; morph mais curto em beat curto |
| interface | fixa no alto | mesmas posições, medidas; chips claros e escuros, número duplo, carimbo, trilha de etapas |
| câmera | giro e aproximação constantes | dirigida pela fala, encadeada, com desfoque de profundidade e deriva |
| contagem | blocos acendendo | `acesos` vale para blocos, conjunto e qualquer forma com grupos, com tique por item |

Técnica escrita do zero para o motor do estúdio a partir da leitura do comportamento visual de Reels de dados em 3D; nenhum código, modelo, textura, fonte ou marca de terceiros. Mapas: Natural Earth (domínio público), ver `AVISOS-TERCEIROS.md`.




