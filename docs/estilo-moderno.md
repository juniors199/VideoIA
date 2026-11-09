

# Estilo moderno: janelas de vidro em perspectiva que mostram o processo

`"estilo": "moderno"` faz o vídeo com cara de interface atual: fundo quase preto com uma grade em perspectiva (chão e teto), pontos tênues e vinheta discreta; **janelas de vidro escuras** (barra com os três pontos, borda fina clara, vidro fosco que desfoca o fundo, reflexo diagonal e uma varredura de luz) **inclinadas em perspectiva 3D de verdade**, que entram com mola, deslizam entre os passos e ganham profundidade quando são duas; um cursor que viaja e clica, confete curto no clique, crachá de passo (`PASSO 1/5` com o círculo no acento) e uma legenda própria em 1 linha em que a **palavra-chave entra em serifa itálica dentro de uma caixa de seleção azul** de editor (borda fina, quatro alças nos cantos), com as palavras ainda por dizer em cinza. Serve a tutorial, "como fazer", demonstração de ferramenta ou processo, antes e depois e qualquer assunto que caiba em telas. Campos em `docs/cena/estilo-moderno.md`; modelo `moderno`.

## Processo
1. **Fala de 25 a 45 s** (modelo `moderno`), um passo por frase, cada passo com a janela que o mostra.
2. **Tabela antes da cena:** que janela, que ação (digitar, abrir, clicar, contar, ficar pronto), em que palavra; qual é a palavra-chave da frase (`chave`).
3. **Cena**, QA, folha a 5 quadros por segundo (`docs/QA-VIDEO.md`) e render. Número no painel só com dado real em `fontes.md`.

## Formas (`{ "tipo": "moderno", "forma": ... }`)
| forma | o que mostra | campos |
|---|---|---|
| `terminal` | terminal: comando digitado letra a letra, Enter na palavra, saída linha a linha (ok com check verde, erro com ×), cursor de bloco | `linhas: [{ "cmd" (até 28 letras), "saida": [texto ou { "texto", "ok" \| "erro" }], "em" }]`, `banner` (caixa no acento com o asterisco), `prompt` (padrão `❯`) |
| `pastas` | explorador de arquivos: barra lateral, pastas e arquivos com volume que chegam, o cursor abre um | `itens` (até 6: nome, ou `{ "nome", "tipo": "pasta" \| "arquivo", "em" }`), `abre`, `clique` (palavra), `lateral`, `pasta` (a ativa), `caminho` |
| `metricas` | painel com número grande que conta até o valor e barras verdes que crescem junto | `valor` (real), `de`, `prefixo` (padrão `+`), `sufixo`, `rotulo`, `em` (o valor chega), `barras` (reais), `rotulos`, `legendaBarras`, `nome`, `sub`, `periodo` (ou `false`) |
| `perfil` | cartão de identidade genérico: monograma com anel, nome, botões, etiquetas e atalhos; o clique vira "Seguindo" com confete | `nome`, `sub`, `descricao`, `verificado`, `clique`, `botao`, `depois`, `botao2`, `chips` (até 3), `atalhos` (`false` tira) |
| `linhatempo` | editor: prévia, trilhas (vídeo em blocos, legenda em chips, efeitos em losangos), cabeça de leitura que corre até a palavra, estado no pé | `em`, `trilhas: [{ "rotulo", "blocos": número ou textos, "marcos": número }]` (até 3), `status: [antes, depois]`, `relogio` (texto grande em vermelho), `relogioRotulo` |
| `pipeline` | cartões de etapa com estado: na fila, gerando (roda, borda âmbar, esqueleto com brilho), pronto (check e o resultado) | `etapas: [{ "titulo", "texto" (o resultado), "icone", "em" (fica pronta) }]` (até 5), `estados: { fila, gerando, pronto }`, `rodape` |
| `celular` | aparelho genérico gravando: tempo, microfone e forma de onda que segue a voz | `texto`, `em` (começa a gravar), `cor` |
| `checklist` | lista com contador `2/4`, barra de progresso e check que enche na palavra | `itens` (até 6: texto ou `{ "texto", "em" }`), `cabecalho`, `cursor: true` (o cursor marca) |
| `prompt` | assistente: pergunta em serifa itálica, campo que digita, trecho marcado em amarelo, enviar e a resposta em pílula | `texto`, `pergunta`, `placeholder`, `marca` (trecho do texto), `marcaEm`, `clique`, `etiqueta`, `resposta` |
| `codigo` | arquivo de texto com aba: linhas numeradas que entram em ordem (`#` em destaque, `-` em lista) e a linha destacada na palavra | `linhas` (até 11), `arquivo`, `destaca` (índice ou trecho), `em` |

Campos de toda janela: `titulo` (barra; genérico, nunca o nome ou logo de um produto), `passo` (`"1/5"`: crachá), `inclina` (-25 a 25 graus no eixo vertical, ou `"nenhuma"`; o padrão alterna ±9° por beat), `entrada` (`mola`, padrão; `desfoque`; `lado`), `acento` (cor da janela), `confete` (`true`, a palavra, ou `false`; o perfil solta confete no clique por padrão), `entra` (a palavra em que a janela chega).

Campos do beat: `chave` (texto da fala, ou lista de textos, que vai para a caixa de seleção; sem `chave` o estilo escolhe a palavra de conteúdo mais longa da linha; `false` desliga), `passagem` (`mola`, padrão: corte seco e a janela nova entra com mola; `desliza`: a câmera corre para a direita e a janela nova chega deslizando enquanto a anterior sai; `corte`), `inclina`, `acento`. Campos da cena: `acento` (padrão: o destaque da página), `selecao` (azul da caixa, padrão `#3D8BFF`), `fundo: { "grade", "pontos", "vinheta" }` (0 desliga, 1 é o padrão).

Até **2 janelas por beat**: a primeira entra centrada e, quando a segunda chega (na palavra dela), sobe e recua em profundidade enquanto a segunda entra na frente, embaixo. Em dupla, cada janela precisa ser curta (2 ou 3 linhas), senão as duas encolhem.

## Regras do estilo de referência (valem acima das regras gerais de layout dos Reels)
O Moderno porta a gramática de vídeos públicos de demonstração de processo. Para continuar sendo aquele estilo, as regras abaixo, medidas nos quadros das referências (folhas a 1 qps e quadros nativos de 720 x 1280 de seis vídeos), **têm prioridade sobre as regras gerais de layout do estúdio** (por exemplo, "protagonista com 55 a 70% da altura útil" e "título e número grande sobre fundo limpo"). As regras de fato, segurança, legenda em 1 linha, nada vazando da tela e revisão a 5 qps continuam valendo.

| medida | nas referências | aqui |
|---|---|---|
| largura da janela | 82 a 85% da largura do quadro | 820 px naturais × 1,04 = ~853 px (79%); com a inclinação a janela lê como ~81%. Não passa disso porque a inclinação e o empurrão da câmera a levariam além da margem lateral (x 64 a 1016) |
| altura da janela (ou do grupo de janelas) | 45 a 51% da altura do quadro (33 a 37% quando há duas empilhadas, cada uma) | janela sozinha com no mínimo 860 px naturais, ~894 px na tela (46,5%); teto de 900 px (47%) |
| topo da janela | 12 a 14% da altura (~240 px) | ~325 px (o topo do quadro fica livre para o nome da página, regra da casa) |
| centro vertical da janela | 37 a 41% | ~40% (y ~773) |
| legenda | 1 linha, centro em 69 a 70% da altura, ~120 a 160 px abaixo da janela | centro em y 1352 (70%), ~120 px abaixo da janela |
| texto da legenda | sans branca com altura de maiúscula de ~3% do quadro; palavra-chave em serifa itálica um pouco maior | Inter Tight 600 62 px e Instrument Serif itálica 76 px |
| texto dentro da janela | ~1,5% da altura (cerca de 26 px num quadro de 1080) e número grande com ~5% | 36 a 58 px naturais (37 a 60 px na tela) e número de 140 px: **mais legível que a referência**, de propósito |
| inclinação | janelas quase de frente, inclinação leve e perspectiva discreta | X de -7°, Y de ±9° alternando por beat, respiração de 1° a 1,5° |
| ritmo | uma janela ou estado novo por frase (a cada 2 a 4 s) e algo mudando dentro dela a cada 1 a 2 s (digitação, check, contador, cursor) | uma janela por beat (frase) e cada ação presa a uma palavra; sem título no alto |
| legenda | palavras por dizer em cinza, a dita em branco; a palavra-chave entra numa caixa de seleção azul com 4 alças, que abre quando ela é dita; troca de linha seca | igual |
| cursor | seta branca com contorno escuro, viaja em curva, clica, confete curto no clique de seguir | igual (anel azul no clique) |
| crachá | pílula escura na quina de cima à esquerda, sobrepondo a borda, círculo laranja com o número e "PASSO n/t" em mono caixa alta | igual, com o acento da página |

Manter a identidade (proporção, layout, ritmo, paleta) não impede melhorar por cima: aqui o vidro é fosco de verdade (desfoca o fundo), a perspectiva é real, há reflexo e varredura de luz, os ícones têm volume e sombra de contato, o texto é bem maior que o das referências e há 10 tipos de janela configuráveis.

Por isso o QA pode avisar "protagonista pequeno ou só na metade de cima" em alguns beats: é a proporção do estilo (janela em ~40% da altura e legenda em ~70%), não um erro.

## Câmera e composição
- Palco three.js próprio (como o `projetor`): cada janela é um plano com a textura desenhada no 2D (mipmaps e anisotropia), inclinada de verdade (X de -7°, Y de ±9°, com respiração lenta de ±1° a 1,5°), em câmera de 38° de abertura. A profundidade entre duas janelas é real (z diferente).
- Faixa do protagonista de y 312 a 1234 (centro ~773), escala máxima de 1,04 e altura máxima de 900 px na tela. Conteúdo curto fica centrado na moldura; terminal e arquivo de texto ficam no alto, como na vida real. Em dupla, as duas janelas dividem a faixa (escala mínima 0,8).
- Câmera dirigida pela fala: segue o ponto de cada ação (o alvo desliza 0,45 s antes dela; o seguimento lateral é contido para a janela larga nunca encostar na margem), empurrão lento de 1,5% por beat, empurrão curto de 2,5% no clique e de ~1,5% na palavra-chave, rolagem de ±0,25°. Na troca de beat a câmera recomeça no corte (nada atravessa o corte).
- Legenda com centro em y 1352, sempre em 1 linha: as linhas são montadas por largura estimada (no máximo 5 palavras, fecham em pontuação e pausa) e, se a serifa não couber, a caixa sai.

## Regras da estética
- Fundo `#06070A`; grade com 9,5% de branco no chão e metade no teto; brilho do acento a 7% atrás do protagonista; 90 pontos com 5 a 25% de opacidade que sobem devagar; vinheta a 55%.
- Vidro: corpo `rgba(16,18,23,.80)` sobre o fundo desfocado a 16 px, degradê de 7,5% no alto, borda de 2 px a 14% e filete de 1,5 px a 22% no topo, reflexo diagonal fixo de 3,5% e a varredura de luz (faixa inclinada de 260 px a 8,5%) na entrada e a cada 4,5 s; sombra longa (80 px, 72%).
- Entrada por mola (amortecimento 0,74, 10,5 rad/s): sobe 150 px, endireita 24° em X, vem de 260 px atrás; opacidade em 0,16 s. No quadro do corte a mola já vai a meio (a janela nunca aparece fantasma).
- Cursor: seta desenhada (branca, contorno escuro, sombra), viaja numa curva com arco de até 90 px (smootherstep), prensa a 86% no clique e solta um anel azul de 0,45 s; some 0,9 s depois do último clique. Confete: 46 papéis em 6 cores, 1,15 s, com arrasto e gravidade.
- Crachá: pílula escura com o círculo no acento (número em branco) e `PASSO n/t` em mono 32 px com espaçamento 3; entra com rebote.
- Legenda: Inter Tight 600 62 px branca; por dizer em branco a 40%; palavra-chave em Instrument Serif itálica 76 px. A caixa abre da esquerda para a direita em 0,26 s (saída de quarta potência), fundo azul a 17%, borda de 2,5 px, e as quatro alças (13 px, brancas com borda azul) entram com rebote escalonado de 0,04 s.
- Texto das janelas com 36 a 58 px naturais (37 a 60 px na tela na janela sozinha). Telas genéricas: nenhum logo, nome de produto ou tela de terceiros; o perfil mostra iniciais, nunca foto ou marca de alguém (pessoa citada pelo nome entra como `imagem`, foto real).

## Som
Discreto e seco, bem abaixo da voz (faixa de efeitos em torno de -46 LUFS, como os outros estilos da marca): whoosh curto na entrada de cada janela, pop no crachá, tique a cada letra digitada, clique no Enter e nos cliques do cursor, tique que sobe de tom no contador e ding no valor final, ding nas etapas prontas e nos checks, brilho no confete, tique agudo na palavra-chave, whoosh longo na passagem `desliza`. Sem música por padrão (`efeitos.musica: true` liga a trilha no clima pulso ou ambiente).

## O que muda em relação ao `interface`
| | `interface` | `moderno` |
|---|---|---|
| tela | painel chapado de frente, na cor da página | janela de vidro fosco inclinada em 3D real, com reflexo e varredura de luz |
| composição | um painel por beat, ampliado até encher a faixa | até 2 janelas com profundidade (a primeira recua quando a segunda chega) |
| texto do beat | título no alto (a legenda some) | sem título: legenda própria com a palavra-chave na caixa de seleção azul |
| passagem | respiro de cor, desfoque, saída rápida | mola no corte ou deslize lateral da câmera |
| peças próprias | busca, chat, navegador, notificações... | terminal, explorador, painel com contador, perfil, linha do tempo, pipeline, celular gravando, checklist, assistente, arquivo de texto; crachá de passo e confete |
O `interface` continua igual; os dois podem dividir o mesmo vídeo (`"estilo"` no beat).

```json
{ "tema": "DE UMA FRASE AO REELS", "estilo": "moderno", "beats": [
  { "id": "gancho", "palavras": [0, 11], "chave": "uma frase", "elementos": [ { "tipo": "moderno", "forma": "prompt", "pergunta": "O que vamos criar hoje?", "texto": "Um Reels sobre café, em uma frase", "marca": "uma frase", "clique": "só?", "resposta": "1 frase = 1 Reels" } ] },
  { "id": "passo1", "palavras": [12, 21], "passagem": "desliza", "chave": "o roteiro", "elementos": [ { "tipo": "moderno", "forma": "pastas", "passo": "1/5", "itens": ["roteiro.md", "fontes.md", "saida"], "abre": "roteiro.md", "clique": "roteiro" } ] },
  { "id": "passo2", "palavras": [22, 30], "chave": "um comando", "elementos": [ { "tipo": "moderno", "forma": "terminal", "passo": "2/5", "linhas": [ { "cmd": "node src/video/cli.mjs cafe", "em": "terminal", "saida": [ { "texto": "roteiro lido", "ok": true } ] } ] } ] } ] }
```
Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-moderno`.

Gramática estudada em vídeos públicos de demonstração de processo e reescrita do zero (sem tela, texto, nome, avatar, logo, som ou código de terceiros); ver `AVISOS-TERCEIROS.md`.




