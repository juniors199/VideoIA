

# Estilo "História e antiguidades" (id `antiguidade`)

Especificação tirada da análise de 3 vídeos de referência, um longo de história antiga e dois sobre cristianismo antigo, com 75 minutos ao todo. Só valeram as partes animadas; as cenas com apresentador ficaram de fora. As referências são horizontais (16:9) e o estúdio faz 9:16 (1080x1920), então tudo abaixo já está adaptado para o vertical.

## Sensação
Documentário de museu: pintura clássica, gravura, busto de mármore, mosaico, manuscrito e mapa antigo, tratados como peças de acervo e iluminados no escuro. O ritmo é calmo e solene, e a câmera nunca fica parada: há sempre um avanço lento. Os nomes próprios são os grandes momentos tipográficos.

## Paletas (o roteiro escolhe uma por vídeo: `tom`)
- `ouro` (padrão, vem do vídeo de Aristóteles e Alexandre):
  - imagem em sépia dessaturada, quente, com vinheta forte;
  - texto em dourado metálico (#D9B44A a #F2D27A, com leve gradiente vertical) sobre quase preto (#120E0A);
  - datas em branco quente (#F3EBDD).
- `vinho` (vem do vídeo da ascensão do cristianismo em Roma):
  - fundos rosados e pergaminho (#E9D9D2, #D8C3B4);
  - texto vinho (#7A1F2B) em serifa grande, mapas marrom-escuros com linhas vermelhas (#C0392B).
- `escuro` (vem do episódio de história da igreja):
  - fundo carvão (#0B0B0C);
  - imagens coloridas apresentadas como cartões;
  - rótulos em barra preta com caixa alta espaçada branca e o destaque em amarelo-papel (#F5EFC0).

## Tipografia (só fontes que já estão em studio/fontes, sem fonte nova de terceiros)
- **Nome e título:** `serif.ttf` em CAIXA ALTA, espaçamento +4%, enorme (cerca de 150 a 190 px no 1080 de largura). Até 2 linhas.
- **Data e número:** `mono.ttf`, como em "327 a.C.", "41 anos" e "60 milhões de habitantes".
- **Citação:** `serif-italico.ttf` entre aspas, de 54 a 64 px.
- **Rótulo:** sans semibold (`semibold.woff2`) em caixa alta com espaçamento +18%, dentro de uma barra sólida.

## Vocabulário de cenas (tipos de elemento do estilo)
1. **`quadro`**: a imagem ocupa a tela.
   - Pode ser pintura, gravura, busto, mosaico, ruína ou manuscrito, sempre de domínio público ou licença livre, buscada com scripts/buscar-imagem.mjs.
   - Tratamento conforme o tom: sépia ou dessaturado, contraste suave, vinheta, grão de filme fino e poeira leve.
   - Movimento: avanço lento contínuo de 4 a 7% na cena inteira, ou panorâmica lateral lenta quando a imagem é larga. Pinturas horizontais viram vertical por recorte com ponto de interesse (rosto ou ação), sem esticar.
2. **`nome`**: o nome próprio em serifa gigante sobre a imagem, no terço inferior ou no centro.
   - Entrada letra por letra, da esquerda para a direita: cada letra entra com desfoque de cerca de 12 px até 0 e opacidade de 0 a 1, com 0,05 s entre letras. Enquanto entra, a letra passa do branco para o dourado (no tom `ouro`).
   - Saída: as letras somem do mesmo jeito, da esquerda para a direita, ou a frase inteira some com dissolução.
   - Variante **`nome-atras`** (Hércules, Constantino e Teodósio no vídeo do vinho): o busto recortado fica NA FRENTE do nome, e o nome fica atrás, entre o fundo e a escultura. O fundo é liso (rosado no tom vinho, preto no tom ouro) e o busto tem sombra suave.
3. **`data`**: uma data ou um número em `mono.ttf`, grande (de 110 a 140 px), sobre a imagem escurecida.
   - Entrada por "decodificação": os caracteres aparecem um a um com leve desfoque.
   - Saída por corte rápido em fatias (falha de sinal curta, de 0,15 s), como o "343 a.C." da referência.
   - Opção `regua`: uma régua de linha do tempo fina na base, com marcas e o ano em destaque, que desliza até o ano certo.
4. **`dado`**: título curto em mono ("Ano 300") com sublinhado que se desenha e, embaixo, um número com barra de progresso que se enche ("5%") e o texto explicativo em mono pequeno.
5. **`mapa`**: mapa antigo estilizado no tom do vídeo (marrom-escuro e dourado, ou preto e amarelo).
   - Rótulos de regiões em caixa alta pequena; o avanço é lento.
   - Rota ou território: uma linha vermelha ou dourada que se desenha, ou uma área que se preenche.
   - Cidades: pontos com anel que pulsa uma vez.
   - Use os dados de mapa que o estúdio já tiver; se não houver contorno antigo, use o contorno moderno com rótulos de época.
6. **`pilha`** (vem do tom escuro): a imagem principal como cartão centralizado, com cerca de 88% da largura, cantos retos e sombra.
   - Atrás dela, 2 ou 3 cópias ou imagens relacionadas, menores, mais escuras e desfocadas, deslocadas para os lados.
   - Movimento: paralaxe lenta, com as camadas de trás andando menos que a da frente.
   - Na troca de imagem, retângulos de luz amarelo-papel piscam por 2 ou 3 quadros (vazamento de luz digital).
7. **`capitulo`**: "CAPÍTULO 02" pequeno em cima e o título em serifa grande ("O IMPÉRIO E O FILÓSOFO") sobre a imagem bem escurecida.
   - No tom escuro, a variante é: título sans pesado gigante com um subtítulo pequeno dentro de uma faixa ("A PLENITUDE / DOS TEMPOS").
8. **`citacao`**: uma frase histórica sobre papel pergaminho com bordas queimadas e escuras.
   - O texto aparece palavra por palavra em `serif-italico`, como datilografado, e a câmera se aproxima devagar.
9. **`rotulo`**: barra preta sólida com nome em caixa alta espaçada e, opcionalmente, uma segunda linha com as datas ("284 d.C. - 305 d.C."). Fica sobre a imagem, na base do terço central, e entra deslizando curto.

## Transições (variar, nunca a mesma três vezes seguidas)
- Dissolução lenta pelo preto: a principal, de 0,4 a 0,6 s.
- **Papel rasgado**: uma borda de papel rasgado branca e irregular atravessa a tela e revela a cena seguinte. É do tom `vinho`.
- Vazamento de luz digital: retângulos claros por 2 ou 3 quadros, no tom `escuro`.
- Desfoque cruzado: a cena de saída desfoca enquanto a de entrada foca.

## Regras de composição (valem além das regras gerais de revisão a 5 qps)
- O texto nunca fica atrás de imagem, exceto no `nome-atras`, onde isso é intencional e o nome continua legível: o busto cobre no máximo 35% das letras e nunca a primeira.
- A legenda da narração fica sempre por cima e fora da área do nome grande.
- Nenhum quadro vazio entre cenas: as dissoluções cruzam.
- No máximo um efeito de destaque por cena: nome, data ou rótulo.
- Imagem de pessoa histórica: busto, pintura ou gravura de domínio público, com a fonte registrada em fontes.md do projeto.

## Som
- Trilha: clima solene, épico ou suspense grave (escolher entre os climas de trilhas.mjs; se nenhum servir, criar um clima `antigo` com cordas graves e tambor lento).
- Efeitos discretos, ligados aos eventos visuais:
  - whoosh grave e cheio na entrada do nome;
  - tique e chiado de máquina na decodificação da data;
  - papel de verdade no rasgo e no desenrolar do pergaminho;
  - "impacto" suave de tambor grave nos capítulos;
  - pulso e tique nas cidades do mapa;
  - whoosh na varredura de luz e na tinta;
  - riser curto antes das viradas.

---

## Referência de uso (cena.json)

`"estilo": "antiguidade"` na cena (ou num beat, para misturar um momento de museu num vídeo de outro estilo) e `"tom": "ouro" | "vinho" | "escuro"` na cena (o padrão é `ouro`; o tom vale para o vídeo inteiro). Os modelos `antiguidade` e `historia` já usam o estilo. Exemplo pronto: `projetos/exemplo-estilo-antiguidade` (tom ouro). Para os tons vinho e escuro, troque o `tom` na cena.

### Processo
1. Roteiro de 45 a 60 s (modelo `antiguidade`), fatos em 2 fontes em `fontes.md`, citação sempre atribuída ("segundo Plutarco").
2. Uma imagem de acervo por frase: `node scripts/buscar-imagem.mjs <projeto> "<termo>" --listar` e `--escolha=N --largura=2560` (peça a maior largura: imagem pequena vira cartão, nunca tela cheia pixelada). Pessoa histórica: busto, pintura ou gravura.
3. Cada beat tem **uma base** (o que ocupa a tela) e **no máximo um destaque** por cima (nome, data ou rótulo). Dado e capítulo também vão por cima da base.
4. `node src/video/cli.mjs <projeto> --voz=...`, depois a revisão a 5 quadros por segundo (`docs/principios-de-design.md` e as regras abaixo).

### Elementos `{ "tipo": "antiguidade", "forma": ... }`
| forma | papel | campos |
|---|---|---|
| `quadro` | base: a imagem na tela inteira, com sépia do tom, vinheta, grão e avanço lento; pintura horizontal vira vertical pelo `foco`, ou faz panorâmica lateral sem `foco`; imagem pequena (ampliaria mais de 1,45x) ou o tom escuro viram cartão sobre a própria imagem desfocada | `arquivo`, `foco` [fx, fy] da imagem, `escala` (recorte inicial, 1 a 3), `zoom` (avanço, 0 a 0,12; padrão 0,055), `modo` `cheio` ou `cartao`, `pan` `esq` ou `false`, `recorte` (`cor`, `luminancia`, `alfa` ou `circulo` com `raio`: a peça recortada e grande sobre o fundo do tom, como uma moeda ou um busto de acervo; `largura`, `altura`, `y`). Com `capitulo` no beat, o quadro fica sempre em tela cheia, bem escurecido (imagem pequena ganha um desfoque leve para não pixelar). Dois `quadro` no beat: o segundo entra por dissolução na palavra (`entra`) |
| `nome` | destaque: nome próprio em serifa (Instrument Serif) caixa alta +4%, de 190 a 120 px, até 2 linhas (`|` quebra), letra por letra com desfoque de 12 px, do branco ao dourado no ouro | `texto`, `entra`, `sub` (linha de apoio de 54 px), `lugar` `centro` ou `baixo`, `saida: "letras"` (some da esquerda para a direita) |
| `nome-atras` | base: fundo liso do tom, o nome atrás e o busto recortado na frente, com sombra. O busto cobre no máximo 35% das letras e nunca a primeira (o motor mede e ajusta; o QA reprova) | `texto`, `arquivo` (o busto), `recorte` `auto` (transparência do PNG, senão a cor do fundo), `alfa`, `cor` ou `luminancia`, `tolerancia` (40), `y` (linha de base do nome, 800), `altura` do busto (1500), `desloca` (px para a direita), `sub` (fica acima do nome, para o busto não cobrir). Também vale `"forma": "nome", "atras": true` |
| `data` | destaque: data ou número em mono de 140 a 110 px sobre a base escurecida; entra decodificando caractere por caractere e sai em fatias (0,15 s) antes da transição | `texto` ("343 a.C."), `entra`, `sub`, `regua: true` com `ano` (negativo antes de Cristo) e `reguaDe` (de onde a régua desliza) |
| `dado` | título em mono que se sublinha, número que conta com barra que enche e o texto em mono de 54 px | `titulo`, `valor`, `prefixo`, `sufixo` (vai para o singular quando o número é 1: "1 ano", "2 anos"; `singular` força outra forma), `casas`, `barra` (0 a 1; com `%` vale valor/100), `texto` (até ~60 caracteres) |
| `mapa` | base: mapa antigo de domínio público tingido no tom (marrom e dourado, rosado ou cinza), com rota que se desenha, cidades com anel que pulsa uma vez, regiões e território | `arquivo`, `zoom` (0,5 a 2,5), `foco` e `panDe` (a câmera anda de `panDe` até `foco`), `rota` [[fx, fy], ...] com `rotaEm` e `rotaDur`, `pontos` [{ `nome`, `pos`, `em`, `lado` }], `regioes` [{ `texto`, `pos`, `em` }], `area` (polígono) com `areaEm`, `cor` `ouro` ou `vermelho`. Coordenadas em frações da imagem do mapa. Os pontos ficam a pelo menos 90 px das bordas (rótulo que sairia da tela vai para o outro lado; ponto que sai na panorâmica some). Com rota, a panorâmica de `panDe` a `foco` anda junto com a rota; se a rota inteira precisa caber, use `zoom` menor e sem `panDe` |
| `pilha` | base: cartão com 88% da largura, cantos retos e sombra; atrás, 2 ou 3 imagens menores, escuras e desfocadas (dos lados se a da frente for em pé, em cima e embaixo se for deitada), com paralaxe | `arquivo`, `atras` [até 3 imagens], `trocas` [{ `arquivo`, `em` }] (troca a da frente com vazamento de luz) |
| `capitulo` | "CAPÍTULO 02" e o título em serifa sobre a base bem escurecida; no tom escuro, título sans pesado gigante e o `sub` numa faixa amarelo-papel | `titulo` (`|` quebra), `numero`, `sub` |
| `citacao` | base: pergaminho com bordas queimadas; a frase aparece palavra por palavra na fala (serifa itálica de 64 a 54 px) e a câmera se aproxima; a atribuição fica na tela desde o começo; a legenda some (a frase já está na tela) | `texto` (até ~140 caracteres, igual ao que é falado; de 80 a 60 px, com aspas de abertura e de fechamento), `autor` ("Alexandre, segundo Plutarco"), `arquivo` (opcional: o fundo desfocado) |
| `rotulo` | destaque: barra preta com o nome em caixa alta espaçada e, se quiser, as datas em mono, centrada no eixo da tela (também o CTA final, como "Segue a página"); a linha fina dourada e a barra crescem do centro para os lados | `texto` (até 24 caracteres), `datas`, `entra`, `y` (centro da barra, 1170), `alinhar: "esquerda"` (volta à coluna da esquerda) |

Campos novos do acabamento (motor, valem em todo vídeo do estilo):
- `quadro.figura`: o contorno da figura principal da pintura, uma lista de pontos `[fx, fy]` da imagem (máscara manual por polígono; não há remoção de fundo automática). A figura vira uma camada à frente, nítida e com sombra, que anda mais que o fundo levemente desfocado (paralaxe 2.5D), e o `nome` do beat passa ENTRE o fundo e a figura: o motor escolhe a altura do nome em que a figura cobre perto de 22% das letras (nunca mais de 32%) sem tocar a primeira. `"figura": false` no nome deixa o nome na frente.
- `quadro.detalhe`: o puxão de foco, `{ "foco": [fx, fy], "escala": 1.7, "em": "palavra", "dur": 0.7 }`; a câmera vai ao detalhe da mesma imagem com desfoque de movimento. Sem o campo, cena com mais de 2,4 s sem acontecimento ganha um automático no meio do maior intervalo (`"detalhe": false` desliga). No `nome-atras`, o mesmo intervalo vira uma aproximação curta do busto.
- `nome.cores`: uma cor por linha (`ouro`, `branco` ou `tom`), como "ALEXANDRE" dourado e "O GRANDE" branco.
- `mapa.tratamento: "vetor"`: o mapa vetorial do Natural Earth (1:50m, domínio público; terra, costa, lagos e os rios Nilo, Tigre, Eufrates e Indo, recortados de lon 8 a 82 e lat 3 a 60 em `assets-antiguidade/mapa-mediterraneo-india.geojson`). Coordenadas em `[longitude, latitude]` (`foco`, `rota`, `pontos`, `regioes`, `area`), norte para cima, projeção equirretangular a 32° N. Terra em pergaminho, mar escuro texturizado, costa e rios finos; o território (`area`, ou o polígono aproximado do império de Alexandre, `IMPERIO_ALEXANDRE`) em amarelo semitransparente com borda fina, revelado por máscara macia ao longo da rota; rota fina pontilhada com ponta luminosa; rótulos em mono sem colisão dentro da área útil, sobre uma placa de pergaminho difusa e sem trocar de lado durante a panorâmica; o mapa ocupa a tela inteira (y 0 a 1920), com degradês longos só no topo (0 a 320) e atrás da legenda (1330 a 1920), e a câmera nunca deixa aparecer a beira do plano; a câmera segue um trajeto só, uma Catmull-Rom centrípeta pelas cidades na ordem da fala, com velocidade quase constante (Hermite monótona por marcos, piso de 40% da média) e ease só no começo e no fim do beat, em subpixel, sem parar em cada cidade e sem degraus; a cabeça da rota anda no mesmo relógio e chega a cada cidade na palavra dela; câmera com leve inclinação que segue a rota em ease e nunca corta uma cidade no instante em que ela é dita.
- `mapa.tratamento: "relevo"`: para mapa colorido com mar azul (ex.: o de Generic Mapping Tools). Ele é recolorido no tom (mar escuro, terra clara, território em amarelo forte que só aparece onde a rota já passou; `alcance` é o raio, em fração da imagem), vira um plano inclinado em perspectiva na tela inteira e a câmera segue a cabeça luminosa da rota, girando devagar. `direcao: "leste"` deita o mapa com o leste para cima (a rota oeste-leste entra na tela, no quadro vertical). Rótulos em mono, um a um; os que sairiam da área útil somem.

Acabamento calmo (revisão do estúdio): a cintilação de projetor é de no máximo 1% de exposição, só em ondas lentas (0,13 e 0,31 Hz); a poeira é pouca, lenta e não pisca; os raios de luz andam devagar; os escurecimentos de data, dado, capítulo e fim entram em 1,2 a 1,6 s. Toda camada tem sangria (a base é desenhada 3,5% maior sobre o fundo opaco do tom, o desfoque das transições amostra a cena ampliada 4%, a imagem nunca mostra os 1,5% da própria beira) e a vinheta fecha nos 16 px da borda: o QA do arquivo reprova a "borda clara" (as 2 colunas ou linhas da beira mais de 6 níveis acima da faixa logo dentro em mais de 1% dos quadros). Cada cena tem um movimento intencional em ease in-out longo (`movimento`: `dolly`, `pan`, `recuo` ou `sobe`; sem o campo, alterna por cena); com `figura`, a paralaxe é em 3 camadas (fundo desfocado a 60%, plano do meio a 100%, figura a 125%); o puxão de foco tem profundidade de campo (o resto do quadro desfoca em volta do detalhe) e o desfoque de movimento só aparece no trecho mais rápido. Na pilha, as cópias de trás ficam em profundidade, giradas no eixo Y com perspectiva. Texto sobre cartão tem margem interna de 6% da largura do cartão (o corpo desce até 96 px e depois quebra). A régua tem uma escala só (números pequenos a cada 50 anos). O estilo exporta com crf 18, teto de 12 Mb/s e o ajuste de grão do x264, com captura dos quadros em JPEG 96.

Texturas reais (CC0, `src/video/engine/assets-antiguidade/`, licenças em `LICENCAS.md`): o pergaminho da citação usa a foto de pergaminho real, nítida, com curvatura só como sombra sutil nas bordas (sem faixa de dobra) e borda queimada em faixas sem desfoque, e tinta marrom com leve variação; uma textura de papel fica por cima do quadro inteiro em 6%, com deslocamento lento. Recortes (bustos, moeda, figura) não têm brilho nem contorno claro: a borda do alfa é encolhida para tirar a franja do fundo antigo e fica só uma sombra suave e difusa para baixo. Use `figura` só quando o contorno ficar imperceptível em resolução cheia (sem pegar fundo, sem halo) e com nada acima de y 260; no demo ela foi retirada. No mapa `relevo`, a costa é redesenhada em 2x com borda nítida e uma linha fina mais escura, a terra em pergaminho, o mar escuro texturizado, o território em amarelo semitransparente com borda fina revelado por uma máscara macia ao longo da rota, e a rota é uma linha fina pontilhada com ponta luminosa pequena.

O que o motor faz sozinho em todo quadro: contraste alto com sépia e preto profundo, retícula de impressão fina, aberração cromática leve nas bordas claras, grão de filme por quadro, vinheta forte, cintilação de projetor lenta (até 1%), poeira com profundidade, neblina que passa, raios de luz nas cenas escuras e um micro tremor de câmera de mão (somas de senos, no máximo ~2,5 px). O nome entra letra por letra desfocado, branco e 4% maior, assenta dourado e recebe um brilho metálico que atravessa as letras. A data decodifica com glifos trocando a cada quadro, tremido e brilho; a régua tem marcas finas, números pequenos e o ano grande e apagado embaixo. O rótulo desenha uma linha fina dourada antes da barra. A pilha chega em fatias horizontais desencontradas que se alinham, com blocos de luz amarelos de falha.

Também valem no beat: `imagem` (vira `quadro`), `contador` (vira `data`), `titulo` (serifa no alto; a legenda some) e peças 3D (objeto de acervo sob luz quente: é o que o plano automático usa quando não há imagens).

### Transições (`"transicao"` no beat, a de entrada)
`tinta` (a cena nova surge por uma borda irregular de tinta queimada que cresce de um canto, com franja clara, 0,6 s), `rasgo` (borda de papel rasgado com sombra e fibras que atravessa a tela, 0,6 s), `luz` (luz quente e baixa que varre a tela e troca a cena no pico, no máximo ~15 níveis acima da cena mais clara; no tom escuro, também os retângulos amarelo-papel, suaves), `corte` (seco, na palavra), `dissolve` (0,5 s, cruza as duas cenas) e `desfoque` (a cena que sai desfoca enquanto a que entra foca). Sem o campo, o motor alterna pelo tom, com cortes secos entre as passagens orgânicas: ouro `tinta`, `corte`, `luz`, `desfoque`, `corte`, `dissolve`; vinho `rasgo`, `corte`, `dissolve`, `rasgo`, `corte`, `luz`; escuro `luz`, `corte`, `desfoque`, `luz`, `corte`, `tinta`. O validador avisa a mesma transição três vezes seguidas.

### O que o motor garante e o QA confere
- Nenhum quadro vazio entre cenas (as duas cenas se cruzam) e o fim nunca fica vazio (a última cena só escurece 30% nos 0,4 s finais).
- A legenda fica numa faixa escurecida embaixo (centro em y 1550) e nunca em cima do texto do estilo (`legenda-texto` reprova).
- Texto dentro das margens e acima de y 1650; nome-atras com cobertura medida (`nome-coberto` reprova acima de 35% ou na primeira letra).
- Uma base e um destaque por beat (o validador avisa o segundo destaque); cena sem imagem avisa.
- Protagonista centrado: busto, moeda, cartão e pergaminho ficam no eixo horizontal (até 2% da largura), medido pela caixa do alfa e não pela imagem; nome e linha de apoio no mesmo eixo; a base do busto esmaece em degradê (nunca um corte reto).
- Câmera fluida (`camera-fluida`): o QA do arquivo mede o deslocamento quadro a quadro por correlação de fase (256x512) e, fora das transições e nos trechos em que a câmera anda, reprova aceleração acima de 3 px por quadro² (escala 1080) e quadro parado no meio do movimento. O grão de filme muda no ritmo do vídeo (30 qps), nunca a 24 qps.
- Transições: corte seco só em fim de frase ou virada; as orgânicas duram de 0,45 a 0,6 s; nenhum flash (a luz fica ~15 níveis acima da cena mais clara) nem quadro escuro demais (data, dado e capítulo que nascem com a cena já entram escuros; o pergaminho da citação já entra 30% aberto).
- Toda camada de escurecimento e sobreposição cobre a tela inteira com sangria em todos os beats, inclusive na panorâmica e na inclinação do mapa: o QA do arquivo reprova a "faixa sem overlay" (`faixa-overlay`: um degrau vertical reto de mais de 8 níveis entre colunas vizinhas, em pelo menos 90% das linhas, por mais de 10 quadros seguidos).

### Som e trilha
Um som por evento visual, com corpo para se ouvir no celular (biblioteca `LA` de `sfx-estilos.mjs`: a L2 mais sons próprios, sintetizados pelo estúdio, numa sala de museu com reverb curta): `whooshGrave` (ar varrido com cama de 60 a 480 Hz) na entrada do nome e do nome-atras; `chiado` de máquina (engrenagem a 28 Hz) com um `tick` de tecla por caractere na data e no dado; `rasgo` (estalos de fibra que aceleram e um puxão agudo) na transição rasgo; `papel` no desenrolar do pergaminho e nas cartas da pilha; `tambor` grave abafado (58 Hz com batida de feltro) no capítulo e no corte seco; `pulso` grave com tique em cada cidade do mapa; whoosh na varredura de luz e `whooshGrave` na tinta; `riserCurto` que sobe e para seco antes de cada virada; tique por palavra na citação e sopro no puxão de foco. O que nasce no quadro 0 soa no 0 (nenhum evento fica mudo nos trechos curtos).

Nível: a mixagem do estilo é normalizada por loudness depois do ducking (`lufsFinal` em `MIX.antiguidade`), não pelo pico, então todo vídeo do estilo cai no mesmo patamar dos outros estilos com o modo `suave`: efeitos entre -40 e -42 LUFS no vídeo e pico de 12 a 15 dB abaixo da voz, com ducking de 8 dB sob a fala e nenhum efeito retirado. Os sons de batida (tambor, pulso, tique) têm um ataque curto de ruído, que dá presença sem subir o nível médio. Com voz `mock` (muda), os efeitos usam o ganho típico de uma narração real (+3 dB) para a prévia medir como o vídeo final. Trilha automática no clima `antigo` (novo: cordas graves, tambor lento e drone, sintetizados pelo estúdio) ou `epico`.

### Exemplo
```json
{ "tema": "ARISTÓTELES E ALEXANDRE", "estilo": "antiguidade", "tom": "ouro", "beats": [
  { "id": "gancho", "palavras": [0, 10], "elementos": [
    { "tipo": "antiguidade", "forma": "quadro", "arquivo": "assets/mosaico.jpg", "foco": [0.41, 0.3] },
    { "tipo": "antiguidade", "forma": "rotulo", "texto": "Alexandre, o Grande", "datas": "356 a.C. - 323 a.C.", "entra": "poderoso" } ] },
  { "id": "professor", "palavras": [11, 15], "elementos": [
    { "tipo": "antiguidade", "forma": "nome-atras", "texto": "Aristóteles", "arquivo": "assets/aristoteles-busto.png", "entra": "professor" } ] },
  { "id": "ano", "palavras": [16, 24], "elementos": [
    { "tipo": "antiguidade", "forma": "quadro", "arquivo": "assets/escola-atenas.jpg" },
    { "tipo": "antiguidade", "forma": "data", "texto": "343 a.C.", "regua": true, "ano": -343, "entra": "trezentos" } ] },
  { "id": "citacao", "palavras": [87, 97], "elementos": [
    { "tipo": "antiguidade", "forma": "citacao", "texto": "Ao meu pai devo a vida; ao meu mestre, viver bem.", "autor": "Alexandre, segundo Plutarco" } ] } ] }
```

### Escolhas desta versão
- **Recorte do busto:** o repositório não tem remoção de fundo por IA (o estilo `colagem` só usa PNG que já vem recortado). O estilo usa, nesta ordem, a transparência do PNG (o Commons tem bustos recortados, como `Aristotle Altemps Inv8575 (png).png`) e, para JPG em fundo liso, uma máscara pela cor do fundo preenchida a partir das bordas (o branco do mármore no meio da imagem não some), com borda suavizada; `"recorte": "luminancia"` serve para busto claro em fundo preto. Os lados e o pé da foto do busto esmaecem no fundo.
- **Mapa:** do Mediterrâneo à Índia, use `tratamento: "vetor"` (Natural Earth, licença em `LICENCAS.md` e `AVISOS-TERCEIROS.md`). Fora dessa região, o `mapa` anima por cima de um mapa antigo de domínio público (o tom tinge a imagem); sem `arquivo`, sai uma grade de meridianos sobre o fundo do tom.




