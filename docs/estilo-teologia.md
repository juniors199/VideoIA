

# Estilo teologia: arte sacra em papel e ouro, com a explicação escrita na tela

Ensino de fé, Bíblia e história das religiões no jeito dos Reels de explicação cristã ilustrados com arte antiga: a pergunta ou a objeção no alto, a obra de época recortada em papel rasgado (às vezes numa auréola de ouro), a frase-chave em ouro, azul ou vinho, e um diagrama simples por ideia (ficha com carimbo, mapa antigo, linha do tempo, balança, citação). Reescrito do zero a partir de 11 Reels de terceiros (estrutura, proporção, ritmo e materiais medidos); nenhuma frase, imagem, vídeo, fonte ou marca de ninguém.

**Quando usar:** doutrina, texto bíblico, concílios, personagens e lugares da história sagrada, "por que a Igreja faz X?", respostas a objeções. Sempre em tom respeitoso, com cada dado em duas fontes e o que as fontes divergem dito em `fontes.md`. Estilo: `teologia` (`npm run estilos -- --ver teologia`). Exemplo: `projetos/exemplo-estilo-teologia/` (36 s, 12 beats, 12 formas, com acabamento, câmera, molduras, auréola, sinal e viradas novas).

## Como funciona
- Cena inteira (`"estilo": "teologia"`) ou um beat numa cena de outro estilo. Cada beat tem 1 a 3 elementos `{ "tipo": "teologia", "forma": ... }`; o primeiro é o protagonista e já está na tela no corte.
- **Tom** do beat (`"tom"`; o da cena é o padrão, `noite` se faltar): `noite`, `creme`, `pergaminho`, `bordo`, `marrom`, `carvao`, `floresta`, `dossie` (preto com tinta neon, mono e grotesca, para "processo" e acusação).
- **Virar** (`"virar"` no beat que entra): `corte` (padrão), `folha` (o papel novo entra pelo canto de baixo à direita, 0,5 s, com sombra na borda), `fusao` (0,36 s), `iris` (0,55 s, círculo com fio de ouro e borda macia), `luz` (0,55 s: dissolve debaixo de um clarão quente somado, que aparece até sobre papel claro), `zoom` (0,55 s: a cena que sai cresce 30% e a nova assenta de 110% a 100%) e `rasgo` (0,5 s: o papel novo rasga o antigo em diagonal, com sombra e borda de fibra). O plano automático gira todas.
- **Acabamento** (`"acabamento"` na cena e, para trocar só nele, no beat): o overlay de textura, ligado por padrão no pré-ajuste `leve`. Veja a seção "Acabamento".
- **Movimento** (`"movimento"` na cena e no beat): a câmera do beat (`auto`, `recuo`, `avanco`, `deriva`, `respira`, `parado`). Veja a seção "Câmera".
- **Moldura** (`"moldura"` em qualquer obra, ou em `a`, `b` e nos itens): `rasgado` (padrão), `ouro`, `passe`, `arco`, `gotico`, `nenhuma`. **Sinal** (`"sinal"`, com `"sinalEm"` e `"sinalTam"`): `?`, `!`, `cruz`, `certo`, `errado`, `diferente`, um sinal grande de ouro (ou verde e vermelho) que pula no canto da obra quando a palavra é dita. `"brilho": false` desliga o brilho que varre a obra e a luz atrás dela.
- Todo texto do estilo é desenhado por ele (o título e a legenda do motor ficam escondidos). Cada linha entra no instante em que a primeira palavra dela é dita e fica até o fim do beat; a posição é a final desde o primeiro quadro.
- Campos de texto de qualquer elemento: `kicker` (caixa alta espaçada), `titulo` (texto ou lista), `linhas` (`[{ "texto", "tam": "p|m|g|gg", "cor": "ouro|azul|vinho|verde|cinza", "em": palavra }]`) e `credito` (obra, autor e data, em itálico no pé).
- Marcação no texto: `*palavra*` (cor de destaque do tom), `~palavra~` (risco vermelho à mão), `==frase==` (marca-texto), `|` (quebra).
- Obras: `"arquivo": "assets/obra.jpg"` (baixe com `node scripts/buscar-imagem.mjs <projeto> "<termo>"`; licença livre registrada em `fontes.md`; o crédito também vai na tela, no pé). `"tratamento"`: `natural` (aquece e assenta no papel), `sepia`, `ouro`, `verde`, `azul`, `vinho`, `cinza`, `original`. Foco e zoom do recorte: `"foco": [x, y]`, `"zoom"`.
- **Figura sem imagem real** (papa, personagem sem retrato livre): `"manto": "azul|vermelho|verde|ocre"` (+ `barba`, `coroa`) desenha um ícone dourado de reserva (folha de ouro craquelada, auréola, rosto de meio-tom). É uma representação artística assumida; o `credito` deve dizer isso. Nunca uma foto falsa. Pessoa citada pelo nome e viva continua com foto real, recente e de licença livre.

## Regras medidas nas referências (valem acima das regras gerais de layout)
Quadro 1080 x 1920; porcentagens da altura salvo indicação. Medidas em 11 Reels de 93 a 176 s (30 fps, 720 x 1280), com 2 a 3 amostras por tipo de beat.

| O quê | Referência | No estilo (px) |
|---|---|---|
| Kicker (caixa alta, 4 a 6 palavras) | centro em 14%; largura 43% da tela; cor suave do tom | y 262, 30 px, espaçamento 6 px |
| Título (1 ou 2 linhas) | 15,6 a 18,4%, centrado; ~88% da largura no máximo | y 300, 62 px (`m`) |
| Obra (um recorte) | 27,7 a 57,2% (29,5% de altura), 7 a 96% de largura | 520 a 1330, largura até 880, altura até 810 |
| Abertura (obra na auréola) | 22,7 a 65,1% (42% de altura), auréola quase da largura toda | auréola R 440 em y 800, obra 600 x 760 |
| Frases abaixo da obra | 61 a 77%: apoio em itálico pequeno e a chave grande, centradas | apoio 46 px (`p`), chave 84 px (`g`) ou 112 px (`gg`) |
| Fichas empilhadas | 21 a 62,6%, cada uma com 8,8 a 10% de altura, 1% de vão, 73 a 83% de largura, aba azul à esquerda, carimbo à direita | 150 a 172 px, vão 20, largura 880, logo abaixo do título |
| Crédito da obra | ~82%, itálico minúsculo | y 1590, 31 px |
| Vazio de baixo | os 20% de baixo ficam livres (interface do app) | texto nunca abaixo de 1650 |

- **Composição "alta":** o conjunto título + obra + frases ocupa 14 a 77%, com o centro de massa em ~44% (y ~850). Não há legenda separada.
- **Texto:** serifa pesada (Lora, pesos reais de 600 e 700), minúscula, só a primeira linha de um bloco em caixa alta pequena (Cinzel). A frase-chave é uma linha curta, em negrito, na cor de destaque (ouro nos tons escuros, azul no creme, vinho no pergaminho); o apoio vai em itálico claro. Risco vermelho, marca-texto e carimbo vermelho de borda dupla são os únicos "gestos".
- **Ritmo:** ~2,5 palavras por segundo (147 wpm); beats de 3 a 6 s (média ~4,5 s); um item novo (linha, ficha, ponto, nó) a cada 1 a 1,5 s; quase tudo em corte seco, com a troca de tom marcando a ideia nova (escuro para a pergunta e a objeção, claro para a explicação).
- **Estrutura de roteiro:** objeção ("se Maria não é...?") ou pergunta; "parece X, mas"; definição; "agora pense"; o que isso não significa; conclusão. Sem CTA nas referências (o estúdio acrescenta o fecho padrão).
- **Paletas medidas:** noite #29344e a #3c4e6f (nuvens e estrelas de quatro pontas), bordô #462424, marrom #482d26, carvão #2a2726, floresta #2b3124, pergaminho #d9c19d (envelhecido #bca07e), creme #e6ded2, dossiê #171717 a #202020 com tinta neon #e8f23c. Ouro de texto ~#c9a85a; azul ~#5c88ba; vermelho do carimbo ~#b03a3a.
- **Variação "dossiê":** preto, textos em mono (kicker neon), título em grotesca pesada, ficha de caso em papel claro levemente torta, recortes de palavras em papel rasgado com a última em marca-texto neon, anotações com ponto e linha neon sobre a obra em cinza.

## Formas (`"forma"`)
| Forma | O que faz | Campos principais |
|---|---|---|
| `frase` | só texto, centrado na altura (o gancho tipográfico, a conclusão) | `kicker`, `titulo`, `linhas`, `regua`, `ancora` |
| `abertura` | obra grande na auréola de ouro (ou vitral) e a frase-chave embaixo | `arquivo` ou `manto`, `halo`: disco (com anel de pontos batidos), raios, `cruz` (auréola cruciforme), `mandorla` (amêndoa de ouro), vitral, nenhum |
| `arte` | um recorte de obra com título em cima e frases embaixo | `arquivo`, `tratamento`, `proporcao`, `angulo` |
| `arte-dupla` | duas obras lado a lado; a primeira entra centrada e desliza | `a`, `b`, `entra2`, `rotulos`, `entre` (ex. `≠`) |
| `arte-cheia` | a obra sangra pela largura, esmaece nas bordas (ou `borda: "rasgada"`: faixa de papel rasgado com sombra); texto sempre em fundo limpo | `arquivo`, `foco`, `borda` |
| `medalhao` / `medalhoes` | obra redonda com aro de ouro (1 a 3), nomes, fio de ouro entre dois | `itens` (`nome`, `arquivo`/`manto`, `zoom`, `foco`, `em`), `liga` |
| `fichas` | cartões de índice com aba, carimbo ("NÃO"), risco e carimbo final | `itens`, `colunas: 2`, `fim` |
| `lista` | linhas numeradas, com visto ou seta, miniatura redonda opcional | `marcador`: numero, check, seta; `selo` |
| `citacao` | cartão de papel com aspas de ouro, referência, e capitular iluminada ou obra por cima | `texto` (com `==marca==`), `referencia`, `capitular`, `arquivo` |
| `inscricao` | a palavra antiga gravada em ouro, vitral ou pedra, letra a letra; em grego (EB Garamond) e hebraico (Frank Ruhl Libre, da direita para a esquerda) a fonte troca sozinha | `palavra`, `traducao`, `pronuncia`, `material` |
| `comparacao` | tela dividida em dois tons, com X ou visto | `lados` (`texto`, `sub`, `marca`, `tom`, `arquivo`/`manto`) |
| `numero` | o ano ou o dado grande, que conta | `valor`, `formato: ano`, `de`, `prefixo`, `sufixo` |
| `carimbo` | a palavra batida em vermelho por cima do beat | `texto`, `y`, `angulo`, `tamanho` |
| `fecho` | auréola com o @ da página, o pedido e o carimbo da palavra-chave | `palavra`, `linhas` |
| `linha-do-tempo` | fio de ouro que corre para a esquerda a cada marco | `itens` (`data`, `nome`, `arquivo`/`manto`) |
| `causa` | caixas ligadas por setas com rótulo; as que faltam aparecem como encaixes tracejados | `itens` (o último pode ser `?`), `ligacao` |
| `mapa` | mapa antigo do Mediterrâneo à Índia (Natural Earth), pontos, rota tracejada, região, anos, zoom | `pontos` (`lugar` da tabela ou `lon`/`lat`), `rota`, `regiao`, `anos`, `centro`, `largura`, `para` |
| `circulos` | metades, lado a lado ou sobrepostos; X de corte; união num medalhão | `modo`, `itens`, `corta`, `uniao` |
| `balanca` | dois pratos; o de maior peso desce, com visto ou X | `lados` (`texto`, `sub`, `peso`, `marca`) |
| `relogio` | relógio do ano com arco e ponteiro | `arco`, `mes` |
| `caminho` | curva da história com recortes, bifurcação (verde e vermelha) ou árvore | `modo`, `marcos`/`ramos`/`folhas`, `tronco` |
| `simbolo` | objeto de ouro, vidro, cera, madeira ou pedra: infinito, ampulheta, vela, porta, onda, chave, trigo, livro, rolo, tábuas, coroa, cruz, ovelha | `simbolo`, `tamanho` |
| `dossie` | ficha de caso sobre o preto (cabeçalho mono, título, realce neon, selo) | `cabecalho`, `titulo`, `linhas`, `selo` |
| `recortes` | palavras recortadas e coladas, a última em marca-texto | `itens`, `destaque` |
| `anotacoes` | a obra com chamadas apontando detalhes | `arquivo`, `notas` (`x`, `y`, `texto`) |

## Refino de 28/10 (feedback da revisão: textura, fontes, acabamento, câmera)
Revisão do estilo depois de rever as 11 referências a 5 quadros por segundo (folhas de contato e movimento entre quadros).

### Fontes (todas livres, OFL, sem modificação)
| Família no estilo | Fonte | Uso | Arquivo em `fontes/` |
|---|---|---|---|
| `TeoLora` e `TeoLoraI` | Lora (variável 400 a 700) e Lora Itálico | frase, frase-chave (700), apoio em itálico, números, citações | `lora.ttf`, `lora-italico.ttf` |
| `TeoCinzel` | Cinzel | kicker, carimbos, inscrições, numeração da lista | `cinzel.ttf` |
| `TeoCinzelD` | Cinzel Decorative Bold | capitular iluminada | `cinzel-decorativo.ttf` |
| `TeoGrego` | EB Garamond | inscrições e citações em grego (inclusive politônico) | `ebgaramond.ttf` |
| `TeoHebraico` | Frank Ruhl Libre | inscrições e citações em hebraico, com pontos vocálicos | `frankruhl.ttf` |
Licença e avisos: `fontes/OFL-teologia.txt` e `AVISOS-TERCEIROS.md`. As fontes são declaradas pelo próprio estilo (`estilo-teologia-fontes.js`) e carregadas antes do primeiro quadro; os testes conferem que os arquivos existem, que têm os glifos de português, grego e hebraico (lendo a tabela `cmap`) e que as seis famílias aparecem como carregadas no navegador do render. A Instrument Serif deixou de ser usada no estilo (a engrossada por traço era o ponto fraco); o dossiê continua em JetBrains Mono e Bricolage.

### Acabamento (overlay de textura)
Camada desenhada por cima do beat inteiro (também nas viradas), leve, determinística e opcional:
- `"acabamento": "leve"` (padrão), `"pergaminho"`, `"vitral"`, `"filme"`, `"antigo"`, `false` ou `"nenhum"`, na cena e, para trocar só um beat, no beat.
- Objeto: `{ "preset": "leve", "textura": "auto|papel|pergaminho|craquele|vitral|nenhuma", "luz": "nenhuma|raio|vela|vitral", "grao": 0 a 1, "poeira": 0 a 1, "riscos": 0 a 1, "vinheta": 0 a 1, "forca": 0 a 2 }` (`forca` multiplica tudo).
- Camadas: textura (fibra de papel real CC0, manchas de envelhecimento e craquelê gerados por código, vitral com chumbo), luz (feixes diagonais, brilho de vela que oscila, luz de vitral projetada), poeira e fibras, riscos de filme finos e raros a 12 quadros por segundo, grão que ferve a cada 0,1 s e vinheta queimada irregular (marrom no claro, azul-noite no escuro). Com o acabamento ligado ele substitui o grão, a poeira e a vinheta simples do fundo.
- Leitura: contraste baixo; nada pisca o quadro inteiro; no escuro o texto de frase ganha uma sombra macia. O teste mede que o quadro com `antigo` não lava nem apaga a leitura em relação ao quadro sem acabamento.

### Câmera
Medido nas referências: a obra não fica parada. Ela chega maior e recua enquanto o texto entra (perde 12 a 18% em ~3 s, ease-out), ou chega pequena e cresce (de 70 a 80% a 100% em ~1,5 s) e segue em deriva; nos diagramas o conjunto recua uns 5% em 3,5 s e o fundo anda menos que o conteúdo (paralaxe). O estilo tem três camadas com movimento próprio (`estilo-teologia-camera.js`, funções puras de t):
- **obra**: zoom entre 0,84 e 1 sempre dentro da caixa do layout (nunca passa por cima do texto), com deslocamento de até 26 px;
- **conjunto** (o que não é obra: fichas, mapa, linha do tempo): zoom de 0,975 a 1,02, com o texto estável nas margens;
- **fundo**: zoom de 1 a 1,035 em sentido oposto (o fundo tem 30 px de sobra por lado).
Movimentos: `recuo`, `avanco`, `deriva`, `respira`, `parado`; `auto` alterna recuo, avanço e deriva nos beats com obra e recuo e respira nos demais. O QA mede a caixa da obra já com o movimento.

### Molduras, auréolas, luz e sinais
- `ouro`: moldura dourada em meia-esquadria, fio perolado, florões de gema nos cantos, forro escuro e vidro com reflexo que passa devagar. `passe`: passe-partout de papel com bisel branco, fio de ouro e moldura fina de madeira. `arco` e `gotico`: nicho de arco pleno ou ogival com a moldura de ouro e pedra-chave de gema (obra de paisagem volta para o `ouro`). `nenhuma`: a obra solta com sombra de contato.
- Auréola: o disco ganhou anel de pontos batidos e filetes; `cruz` é a auréola cruciforme com braços pateados em vermelho esmaltado; `mandorla` é a amêndoa de ouro com brilho que varre; o brilho respira.
- Luz: atrás da obra, nos tons escuros, um brilho quente que a separa do fundo; um brilho diagonal varre a obra uma vez logo depois de ela assentar.
- Texto: sombra macia nos tons escuros; as fichas usam tinta escura em qualquer tom (o papel é claro).

## O que melhoramos em relação às referências
- **Texto preso à fala, com posição final desde o primeiro quadro**, e o protagonista de cada beat já na tela no corte (nunca página só com o título). Palavra de entrada tardia do primeiro item vira 0,3 s depois do corte.
- **Materiais com profundidade:** recortes com aro de fibra, sombra de contato e longa, fibra de papel real (CC0) multiplicada na obra; ouro de folha com granulado, friso e brilho que varre; vitral com chumbo e luz; cera com chama que oscila; pedra com poros; vidro da ampulheta com areia que cai. Grão de filme que ferve a cada 0,1 s e poeira de luz nos tons escuros.
- **Robustez:** tudo em função de t (determinístico), obras que faltam caem num ícone dourado em vez de quebrar, mapa com a vista presa à cobertura dos dados, textos que cabem (reduzem e quebram em até 3 linhas), margens e áreas seguras conferidas no teste.
- **Variedade:** 26 formas e 8 tons contra os poucos modelos fixos de cada vídeo de referência; a variação "dossiê" no mesmo motor.
- **Plano automático** (tema livre, sem obras): abertura, depois frase, fichas, lista e cadeia em rodízio, número e fecho, com o tom alternando e a virada a cada 3 beats.

## Câmera, som e QA
- Câmera: veja a seção "Câmera" (três camadas com movimento próprio) e o movimento interno de cada obra (Ken Burns).
- Som (biblioteca da antiguidade): papel (entrada de recorte e virada), sino de ouro, estalo de carimbo, tique do texto, pulso do mapa; efeitos secos e baixos (no exemplo, -52 LUFS contra a voz em -16). Trilha do clima `antigo` e `ambiente`.
- QA: o estilo entra em `MARCA` e `LEITURA` (área segura, leitura, tela vazia). Decisões do estilo, registradas no QA: (1) o aviso de "título do estilo fora da faixa de cima" não vale (o texto mora em 260 a 1560 por desenho); (2) o aviso de composição (altura útil e protagonista de 55%) não vale (o estilo mede a própria composição: 30 a 50% da altura, centro ~850), mas o aviso de "protagonista pequeno" continua valendo para as peças: por isso o medalhão começa em 296 px de raio e o carimbo cabe em 560 px (a batida é em 1,7x); (3) sem aviso de cenário 3D (o estilo não usa peças nem cenários 3D). Os quadros da virada também passam pelo QA do arquivo (borda clara, quadro vazio): o `rasgo` só traça a fibra na borda rasgada e o `zoom` entra de 110% (a 94% sobrava uma faixa clara de 1 a 2 px na borda). Texto que está dentro de uma peça (ficha, círculo, cartão) é medido como parte dela; arte que sangra pela borda é medida só até as margens.

## Limites (ditos com franqueza)
- **Realismo das obras:** o look das referências vem de pinturas e gravuras reais. O estúdio não tem gerador de imagem: com obra real de domínio público (Wikimedia Commons via `buscar-imagem.mjs`) o resultado fica muito perto; sem ela, vale o ícone dourado procedural, que é bom como símbolo, mas não chega perto de uma pintura. A arquitetura aceita qualquer imagem nova (`arquivo`) em todas as formas.
- **Tipografia:** agora são fontes de texto de verdade (Lora, Cinzel, EB Garamond, Frank Ruhl Libre), mas não são as fontes dos vídeos de referência (que não temos nem queremos copiar): o resultado é parecido em peso e em tom, não igual. Grego e hebraico só em `inscricao`; árabe, copta e siríaco não (nenhuma fonte livre do estilo tem os glifos): escreva a transliteração em latim. O carimbo e a lista usam o Cinzel, que é só em caixa alta.
- **Textura:** a fibra do papel é uma imagem real CC0, mas as manchas, o craquelê e o vitral são gerados por código (parecem pergaminho e vitral, não uma foto de um). O craquelê é uma rede de Voronoi cortada por ruído: de perto aparece o desenho regular das células. A luz de vitral e os feixes são estilizados, sem profundidade real.
- **Câmera:** é 2D (zoom e deslocamento de três camadas); não há profundidade de campo nem câmera 3D, e o texto nunca acompanha a câmera da obra (de propósito, para ficar legível). Com `recuo` a obra termina em 87% da caixa do layout; se quiser maior, aumente a caixa (`largura`) em vez do movimento.
- **Viradas:** a `luz` é um clarão somado de 0,5 s, não um fade para branco; a `zoom` mostra uma faixa de transição com a cena nova mais ampliada no começo. O arquivo de QA ainda pode avisar "pouco objeto na virada" se alguém acentuar o clarão.
- **Custo:** medido no desenho de um quadro em 1080 x 1920, por software: 18 ms sem acabamento, 24 ms com `leve` e 28 ms com `antigo`. O exemplo de 36 s renderiza em ~20 a 40 s neste Mac (encoder por hardware).
- **Mapa:** só do Mediterrâneo à Índia (longitude 8 a 82, latitude 3 a 60) e sem fronteiras; regiões são manchas suaves, não polígonos. Tabela de lugares em `estilo-teologia-diagramas.js`.
- **Sem estilo de música própria:** a trilha vem do clima; nada de canto, sino real ou órgão.

## 0.6.19 (31/10/2026): feedback da revisão sobre o Jó v3
Estudo das 29 referências feito fora do kit. Tudo foi para o motor do estilo, não para o projeto.

- **Apresentação da arte por beat** (`apresentacao` na forma `arte`): `moldura` (o recorte de papel; `moldura` rasgado, passe, ouro, arco ou nenhuma), `tela` (a obra cobre o quadro com Ken Burns suave, vinheta no alto e scrim embaixo, onde o texto fica; o texto usa o tom carvão, claro sobre escuro) e `dividida` (a obra sangra pelo topo e pelas laterais e termina em borda de papel rasgado; o texto fica no fundo limpo do tom). Sem `apresentacao` (e sem `moldura`), o estilo gira tela, moldura, dividida, moldura pela posição da arte no vídeo. A obra nunca é ampliada mais de 1,8x para cobrir o quadro: se não aguenta, cai para `moldura` e o aviso aparece em `avisoRes`.
- **Obra pelo assunto no plano automático (0.6.22):** cada foto do roteiro vira a obra que o assunto do beat pede (`src/video/autoplano-teologia-obra.mjs`): pessoa (profeta, apóstolo, santo, papa, rei, filósofo) em `medalhao`; sofrimento, morte, juízo ou cruz em `tela` (obra escurecida cobrindo o quadro); igreja, templo ou catedral na moldura `gotico`; céu, anjo, glória ou milagre no `arco` com tratamento `ouro`; pintura citada na moldura `ouro`; carta, livro ou evangelho no recorte `rasgado` em `sepia`; deserto, monte, mar ou cidade em `dividida`; sem assunto reconhecido, rodízio. Nunca a mesma obra (forma, apresentação e moldura) em dois beats de obra seguidos. Antes era sempre o passe-partout. Na cena escrita à mão, faça igual: escolha `apresentacao` e `moldura` pelo que a frase diz, não uma moldura para o vídeo todo.
- **Medalhão:** nunca amplia a imagem além de 1,8x; imagem pequena ganha um medalhão menor (raio mínimo 150 px) e o beat registra o aviso `a imagem do medalhão é pequena`.
- **Texto em um bloco só:** nas formas com arte (`abertura`, `arte`, `arte-dupla`, `arte-cheia`, `medalhao`, `medalhoes`), quando há `linhas`, o `kicker`, o `titulo` e as `linhas` viram uma pilha única embaixo da arte, com o kicker colado em cima da primeira linha (64 px de espaço). Só com título e sem linhas, o bloco fica no alto, kicker colado ao título. A arte e o texto são centrados juntos na faixa livre. O kicker (34 px, antes 27) entra na primeira palavra dele que a voz diz, ou, se não for falado, um pouco antes do texto que rotula (em beat só de texto fica no corte).
- **Quebra de linha equilibrada:** programação dinâmica sobre as palavras (`quebrar` em `estilo-teologia-texto.js`): linhas de largura parecida, sem terminar em "de", "a", "que"..., sem palavra curta sozinha na última linha. Tamanhos: apoio 48 px, frase 60 px, chave 80 px, chave grande 108 px.
- **Contraste >= 5:1** (mínimo exigido 4,5:1) em todas as cores de texto contra o pior ponto do fundo de cada tom (kicker, ouro, azul, vinho, verde e cinza nos tons claros e escuros; o pergaminho ficou mais claro). Teste em `test/teologia-0620.test.mjs`.
- **Crédito** em y 1536 (fora dos 340 px do rodapé, que começam em 1580), 32 px; o texto termina em 1490.
- **Fecho com celular 3D** (`forma: "fecho"`, módulo `estilo-teologia-celular.js`): corpo de latão com espessura e perspectiva, tela com o botão **Seguir** tocado (vira **Seguindo**) e o comentário digitado letra por letra, enviado e listado; o celular entra girando, assenta e balança. O toque espera o celular assentar (0,9 s) e o comentário, o "Seguindo" ser lido (0,8 s). Sem número inventado de seguidores. O sol com o @ e o carimbo só saem com `visual: "sol"`.
- **Capa:** o título fica no alto, em fundo limpo, e a cena encolhe (70%) para baixo dele, nunca cruzando a arte.
- **QA:** teologia não avisa "protagonista só na metade de cima" (a arte sobe porque o texto vem embaixo), e arte de fundo (tela e dividida) não conta como "atrás dos botões". O `citacao` só mostra o cartão quando a primeira palavra dele é dita.
- **Respiros:** `node scripts/respiros.mjs <projeto> --trilha` (3 a 5 respiros de 0,4 a 0,6 s, só no silêncio real) e `--em=quê.,pecou.` para escolher as frases finais.

### Checklist do estilo (cena e revisão)
1. A arte muda de apresentação entre beats? 2. Kicker colado ao texto que rotula? 3. Nada de frase pequena perdida no alto? 4. Texto sobre arte só com scrim? 5. Contraste >= 4,5:1 e crédito acima de y 1580? 6. Medalhão sem ampliação visível? 7. Tons sem salto escuro-claro em mais de 30% das trocas? 8. Fecho com o celular tocando Seguir e digitando? 9. Capa com título em fundo limpo? 10. Respiros na voz (3 a 5)?

## Fila de misticismo (05/11/2026): correções na raiz
- Kicker e título descem para logo abaixo do @ (`Z.kicker = ARROBA_Y + 42`, `Z.titulo = ARROBA_Y + 98`): com o @ na área segura (y 280) o kicker em 262 caía em cima dele.
- Círculos de um diagrama (`circulos`) são uma peça só para o QA (sobrepostos, metades, união); com dois círculos o primeiro entra no centro e desliza quando o segundo chega.
- Carimbo medido com o espaçamento entre letras (a palavra não passa da moldura).
- Moldura em arco e gótica: o reflexo do vidro e o brilho que varre ficam presos ao vão do arco (antes vazavam como retângulo claro nos cantos de cima).
- Crédito da obra nunca termina em reticências: quebra em até 2 linhas e reduz de 32 a 24 px se precisar.
- Capa: no quadro da capa o beat desenha só a cena (`MODO_CAPA`); o título grande é o único texto.




