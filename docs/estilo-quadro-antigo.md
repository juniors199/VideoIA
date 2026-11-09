

# Estilo quadro antigo: gravuras e pinturas em sépia com a fala batida à máquina

`"estilo": "quadro-antigo"` faz o vídeo como uma **mesa de arquivo**: uma gravura ou pintura de domínio público cobre o quadro em sépia (contraste de gravura, vinheta forte, poeira e grão), e a narração aparece **datilografada, letra a letra, no ritmo da fala**, em tiras e cartões de **papel rasgado** pousados por cima. As palavras importantes ganham **sublinhado, círculo vermelho ou risco à mão**; uma ideia forte vira **título grosso, numeral vermelho em itálico ou carimbo de caixa dupla**. Entre um beat e outro, a imagem desfoca, desliza ou o papel é rasgado.

Vale na cena inteira (`"estilo": "quadro-antigo"`) ou num beat. Os elementos são `{ "tipo": "quadro-antigo", "forma": ... }`. Código: `src/video/engine/estilo-quadro-antigo*.js` (a parte pura, sem DOM, está em `-formas.js`). Modelo de vídeo: `quadro-antigo`. Exemplo completo: `projetos/exemplo-estilo-quadro-antigo`; vitrine com todas as formas: `projetos/teste-estilo-quadro-antigo`.

## Processo
1. **Escolha as obras antes do roteiro.** Cada beat precisa de uma imagem real que mostre o que a frase diz: gravura, pintura, mapa antigo, retrato (`node scripts/buscar-imagem.mjs <projeto> "<termo>"`; Wikimedia Commons, só domínio público ou licença livre; registrada em `fontes.md`). Pessoa histórica: obra ou retrato de domínio público, nunca foto fabricada. Pessoa viva citada pelo nome: foto real, recente e de licença livre (`medalhao`).
2. **Roteiro** (modelo `quadro-antigo`, 85 a 140 palavras, 30 a 48 s): gancho que desmonta uma ideia, um dado por frase, virada, CTA. Fato em 2 fontes (`fontes.md`); caso em andamento atribuído; o que é lenda ou tradição vai como "a tradição atribui".
3. **Cena** (`cena.json`): um beat por ideia (3 a 6 s), uma BASE por beat e as sobras na ordem da fala.
4. **QA do motor, render, revisão a 5 quadros por segundo** (`docs/QA-VIDEO.md`).

## Tipos de beat (formas)
Uma **base** por beat (a primeira; as outras são ignoradas) e quantas **sobras** a fala pedir.

### Bases
| forma | o que faz | campos principais |
|---|---|---|
| `pintura` | a obra cobrindo o quadro (gravura sépia, recorte, empurra devagar) | `arquivo`, `foco` [fx, fy] e `zoom` (detalhe), `para` [fx, fy] (destino do foco), `movimento` (`empurra`, `recua`, `esquerda`, `direita`, `sobe`, `desce`, `parado`), `tratamento` (`gravura`, `sepia`, `cor`), `desfoque` (true ou 0 a 1) e `desfocaEm` (palavra em que a imagem desfoca para dar lugar ao texto), `escurece`, `craquele` |
| `pintura` + `moldura: "pagina"` | a obra numa faixa de papel com o topo e a base rasgados, sobre a mesa de madeira (zoom automático para a faixa ocupar ~55% do quadro) | `y`, `alturaPagina` |
| `pintura` + `moldura: "dourada"` | a obra na moldura dourada, parede de museu com luz de galeria, craquelê no verniz e placa de latão | `placa`, `larguraMoldura`, `y`, `proporcao` |
| `painel` | capa de livro em couro com o **numeral gigante** em itálico creme e o rótulo batido embaixo | `numero` (`1ª`, `3`, `7,6`), `rotulo` (batido na fala), `emNumero`, `arquivo`/`fundo` (obra desfocada atrás) |
| `folha` | uma folha grande de papel com o texto batido (parágrafo, citação longa, CTA) | `texto`, `corpo`, `cabecalho`, `altura`, `y` |
| `mapa` | mapa à mão: terra hachurada em sépia, meridianos finos, rota tracejada em vermelho, pinos e etiquetas, rosa dos ventos | `lugares: [{ nome, lon, lat, em }]`, `rota`, `minimo` (graus de folga), `altura` |
| `linha` | linha do tempo vertical no papel: eixo de tinta que desce, ano em serifa grossa, texto batido, chave vermelha com o intervalo | `eventos: [{ rotulo, texto, em, destaque }]` (2 a 5), `ponte` ("66 anos"), `emPonte`, `escala: "proporcional"` |
| `medalhao` | pessoa: retrato de domínio público em oval com anel dourado, plaquinha com o nome e a função | `arquivo`, `nome`, `funcao`, `foco`, `zoom`, `fundo` (obra desfocada atrás) |
| `comparacao` | dois cartões empilhados (A × B); um é riscado, o outro circulado em vermelho | `esq`/`dir`: `{ titulo, texto }`, `risca` e `riscaEm`, `circula` e `circulaEm`, `entre` |

### Sobras (por cima da base)
| forma | o que faz | campos principais |
|---|---|---|
| `texto` | a fala datilografada: **tiras** (uma por linha, em degraus, cada uma entra quando a linha começa) ou **bloco** | `texto` (com marcação), `zona` (`topo`, `meio`, `baixo`), `lado` (`esq`, `dir`, `centro`), `layout` (`fitas`, `bloco`), `corpo`, `pos` [fx, fy], `entra`, `sai`, `fica` |
| `titulo` | palavra ou frase curta em **serifa grossa** num cartão | `texto`, `cor: "vermelho"` |
| `numero` | **numeral vermelho em itálico** (cartão do número + cartão do rótulo, em uma linha ou grande); conta até o valor | `valor`, `rotulo`, `layout` (`lado`, `inline`, `grande`), `contagem`, `de` |
| `carimbo` | carimbo de **caixa dupla** em versal que bate com tranco (PARTE 2, RECADO, FECHADA) | `texto`, `giro`, `cor` (`tinta`, `vermelho`) |
| `etiqueta` | tira curta com **seta fina** que se desenha até o alvo; `ordem` põe o numeral (2 · o rei) | `texto`, `alvo` [fx, fy] na imagem (acompanha o movimento) ou `aponta` [fx, fy] na tela, `ordem`, `dx`, `dy` |
| `fonte` | referência curta embaixo e à direita do cartão anterior (Marcos 16:7) | `texto` |
| `citacao` | cartão de citação, com círculo na frase | `texto` com `[ ]` |
| `lista` | pilha de tiras curtas (1 · o irmão, 2 · o rei), cada uma batida na fala | `itens` (2 a 5) |
| `marca` | marca à mão sobre a imagem: círculo vermelho, seta ou **lupa** que amplia | `marca` (`circulo`, `seta`, `lupa`), `pos` [fx, fy] na imagem, `raio`, `de`, `distancia` |

### Marcação no texto
`*palavra*` sublinha à mão · `[palavras]` circunda em vermelho · `~palavra~` risca · `{PALAVRA}` título grosso na linha (sozinho vira linha grande) · `{!PALAVRA}` o mesmo em vermelho · `|` quebra a linha. As palavras casam com a fala (o motor acha cada uma na narração do beat, na ordem) e a letra bate quando a palavra é dita; palavra que não está na fala segue a anterior.

### Passagem entre beats (`"passagem"` no beat que entra)
`desfoque` (padrão: a imagem que sai desfoca e some, a que entra chega com um respiro de escala), `desliza` (as duas deslizam para a esquerda), `rasgo` (o papel velho é arrancado para cima, com a franja clara e a sombra) e `corte`.

### Textura (`"textura"` na cena, opcional)
Camada de **papel envelhecido, grão, poeira, riscos finos e vinheta de papel** sobre todo o quadro, leve para não prejudicar a leitura. `"textura": "leve"` (padrão quando o campo some), `"media"`, `"forte"`, um número de 0 a 1,5, ou `false` (desliga e deixa só a poeira, o grão e a vinheta do estilo). Desenhada por código (manchas de umidade, fibras, pintas de oxidação, dois vincos suaves; poeira e pelinhos que mudam a cada 1/8 s; no máximo 2 riscos verticais curtos por vez, sempre longe da borda). Não pisca a exposição. Código: `estilo-quadro-antigo-textura.js`. No `forte` já pesa na leitura de cartão pequeno; prefira `leve` ou `media`.

### Tom da cena (`"tom"`)
`sepia` (padrão), `ouro` (mais quente, ouro vivo) e `escuro` (papel e tintas mais fechados).

## Medidas do estilo (medidas nos vídeos de referência: regra do estilo, valem acima das regras gerais de layout)
Convertidas para o quadro de 1080 x 1920. Não se aplicam aqui: "protagonista de 55 a 70% da altura" e "legenda em 1 linha"; o protagonista é a obra (cobre 100% do quadro) e a fala vira cartões de máquina de escrever. Segurança, fato conferido, quadro 0 com a cena, nada vazando e QA a 5 qps continuam valendo.

| item | referência | aqui |
|---|---|---|
| imagem | cobre o quadro inteiro (sangria), detalhe ampliado de gravura; vinheta forte; empurra 4 a 10% | cobre 100%; `empurra` 1 a 1,10; vinheta e borda sempre mais escuras que o miolo |
| página rasgada | imagem de y 31% a 100%, topo rasgado, madeira escura em cima | faixa centrada com os dois lados rasgados, madeira por cima e por baixo |
| margens do texto | esquerda de 5 a 9% (~80 px) | 78 px (7,2%); nada a menos de 72 px da borda |
| tira de texto | altura 5 a 6,5% (110 a 125 px), uma linha, 20 a 24 letras, passo de 37 a 42 px por letra (corpo ~56 a 66 px), degraus de 0 a 6% à direita, giro de ±1° | altura 120 px, corpo 60, ~22 letras, degraus de 0 a 58 px, giro de ±0,5 a 1° |
| zona do texto | 1ª tira a ~12% (y 230 a 260), pé das tiras até ~78% (y ~1500) | topo em y 262; pé em y 1496 |
| bloco com título (GOLPE) | cartão de 8 a 92% da largura, 27% da altura (y 50 a 77%); maiúscula de 5,6% (108 px), palavra com 52% da largura | cartão até 924 px; palavra grande se ajusta à largura |
| numeral vermelho | cartão de 35% da largura x 24% da altura (y 31 a 55%); numeral de 18% da altura; rótulo em serifa grossa no cartão ao lado | numeral de 300 a 520 px, cartão do rótulo ao lado ou na mesma linha |
| carimbo | caixa de 50% da largura x 11% da altura, moldura dupla de tinta, serifa pesada em versal | moldura de 7 px e 2,6 px, versal com espaço de 8% |
| etiqueta com seta | tira de 5% de altura, seta fina curva de ponta aberta | tira de 100 a 140 px, seta que se desenha em 0,5 s |
| painel de couro | x 13 a 87,5% (74,5%), y 12,7 a 72,7% (60%); numeral itálico creme de 27% da altura | 805 x 1152 px, numeral de até 640 px |
| tempos | fala de 2,6 a 2,9 palavras/s; cartão entra 0,15 a 0,2 s antes da 1ª palavra; letras no ritmo da fala; sublinhado em ~0,4 s, círculo em ~0,5 s; imagem a cada 4 a 9 s com 3 a 6 cartões | cartão 0,22 s antes; letra por palavra, a palavra inteira até o fim da fala; sublinhado 0,42 s, círculo 0,5 s |
| paleta | sombras #140d07, médios ~#7a6246, claros ~#d9c79b; papel ~#d9c49a a #e8d5a8; tinta #2a1d12; vermelho ~#b3262b; madeira #2b1d12 | `tomDe` em `-formas.js` (sépia, ouro, escuro) |
| tipografia | máquina de escrever (serifa de placa) no texto; serifa preta pesada (tipo Playfair Black) nos títulos; itálico nos numerais | Special Elite (Apache 2.0, máquina de escrever autêntica, peso único) com tinta que escorre; Playfair Display 900 (OFL) nos títulos, carimbos e rótulos; Playfair Display Black Italic nos numerais. Arquivos em `fontes/`, licenças em `AVISOS-TERCEIROS.md` |
| áudio | voz masculina grave a -14 LUFS (faixa de 2,2 LU), trilha suave sob a voz, sem efeito marcante | voz da página a -16 LUFS; tique de máquina, papel e carimbo secos e baixos (~-48 LUFS, bem abaixo da voz); trilha pelo clima `antigo` ou `misterio` |

## Acabamento (o que o estilo faz por conta própria)
- **Papel desenhado por código** (sem textura de terceiros): fibras, manchas de umidade, borda envelhecida, franja clara do rasgo e sombra de contato; cada cartão tem o seu rasgo (semente própria).
- **Gravura:** a imagem vai a cinza, ganha contraste local (o cinza menos o seu borrão), retícula de linhas finas e a rampa sépia do tom; obra a cores também vira gravura (`tratamento: "cor"` mantém um fio de cor).
- **Textura sobre o quadro** (opcional, `"textura"`): papel envelhecido, pintas, vincos, poeira fina e riscos de película, por cima de tudo.
- **Madeira de mesa**, **couro** de capa, **moldura dourada** com bisel e craquelê, **parede de museu** com luz de galeria.
- **Câmera:** o empurrão da imagem é quase linear (70% linear, 30% suave) e a obra respira de leve, para não parar e arrancar a cada beat como na referência.
- **Poeira** que sobe devagar, **grão** que muda a cada 1/12 s, **fecho escuro** nos últimos 0,45 s. Nenhuma cintilação de exposição (fundo que pisca reprova).
- **Máquina de escrever:** avanço fixo, altura e tinta de cada letra com variação mínima; cada palavra aparece inteira até o fim da fala dela.

## Regras do estilo
- A obra **mostra o que a frase diz** (nunca ilustração decorativa). Mesma obra em até 2 beats seguidos, nunca 3.
- **Uma ideia por beat**; cartão de texto com no máximo 6 linhas; no máximo 4 cartões de texto por beat.
- O texto do cartão é a fala (palavra por palavra); título e numeral só para o que a fala destaca (um por beat).
- Cartões de texto ficam entre y 262 e y 1496 e a 72 px ou mais das bordas; o @ da página fica acima (y 192).
- Fonte curta (`fonte`) para referência (livro, capítulo, ano, "segundo a tradição").
- Pessoa de domínio público: retrato de época ou obra; pessoa viva citada pelo nome: foto real, recente, de licença livre.

## Como usar
```bash
node src/video/cli.mjs <projeto> --voz=mock --sem-musica --estilo=quadro-antigo   # teste, sem gastar ElevenLabs
```
`cena.json` mínimo:
```json
{ "tema": "O QUADRO DO GRITO", "estilo": "quadro-antigo", "tom": "sepia", "beats": [
  { "id": "gancho", "palavras": [0, 9], "elementos": [
    { "tipo": "quadro-antigo", "forma": "pintura", "arquivo": "assets/obra.jpg", "foco": [0.34, 0.47], "movimento": "empurra" },
    { "tipo": "quadro-antigo", "forma": "texto", "texto": "Por que não existe|nenhuma *foto* do|Grito do Ipiranga?", "zona": "topo" } ] } ] }
```
O plano automático (`autoplano-quadro-antigo.mjs`) monta uma folha ou uma pintura por beat quando o projeto tem imagens (elemento `imagem`) e o número do roteiro vira o cartão de numeral; as obras certas só a skill `cena` escolhe.

## Adaptado da referência (e o que fizemos melhor)
| item | na referência | aqui |
|---|---|---|
| imagens | gravuras e pinturas geradas ou recortadas à mão, uma por assunto | qualquer obra de domínio público que o assunto peça, tratada por código (gravura, desfoque, moldura, craquelê), com a fonte registrada |
| texto | cartões de papel e máquina de escrever, sempre iguais | tiras em degraus e bloco; título grosso, numeral vermelho, carimbo, etiqueta com seta, fonte, citação, lista; tudo preso à palavra dita |
| anotações | sublinhado e círculo | sublinhado, círculo, risco, seta, lupa que amplia e marca sobre a imagem que acompanha o movimento da câmera |
| fundo | madeira e couro | madeira, couro, moldura dourada com parede de museu, mapa de país a partir do Natural Earth, linha do tempo proporcional |
| passagens | corte com desfoque e deslize | desfoque, deslize, rasgo do papel e corte, escolhidos por beat |
| bordas | vinheta | vinheta e queda de borda que impedem a linha clara de 1 a 2 px |
| robustez | texto de cada quadro desenhado à mão | tudo função de t; mede cada cartão (QA: área segura, leitura, vazamento) |

Técnica escrita do zero para o motor do estúdio a partir da leitura do comportamento visual de Reels públicos de terceiros; nenhuma imagem, texto, fonte, música ou marca desses vídeos acompanha o estúdio. Obras do exemplo: domínio público (Wikimedia Commons, ver `fontes.md` do exemplo). Mapas: Natural Earth (domínio público, `AVISOS-TERCEIROS.md`).




