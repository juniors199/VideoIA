

# Estilos Smooth (motion design com fluidez de After Effects)

Porte completo do Fluido, projeto do mesmo autor do estúdio, integrado ao Ilustrando com a autorização dele (04/11/2026). Análise detalhe por detalhe feita fora do kit. A técnica (curvas do After, câmera com motivo, palavra que sai do desfoque, vidro, gelo e breu) foi reescrita para o motor do estúdio: o quadro é DOM com perspectiva CSS e cada propriedade é função pura do tempo (trilha e diretor), sem GSAP, sem HyperFrames, sem rede.

## Os seis estilos (escolha por `Estilo: <id>.` no STATUS ou `--estilo=<id>`)

| Estilo | Porta o modelo do Fluido | Para quê | Fundo padrão | Câmera | `M.diretor`: pico de velocidade na palavra, 3 nulls, fusão abaixo de 0,6 x a duração, abertura já andando, respiro; viagens grandes (mediana 3,3 a 4,5 %L/s, p95 17 a 25 %L/s medidos a 5 qps) | toda cena abre com a subida (a câmera começa 260 px acima e desce até o lugar); onda contínua (deriva, zoom e giro leves); duração de cada movimento pelos tetos medidos na ref (pico do pan 170 px/s, total 450 px/s, aceleração 3500 px/s², zoom 0,3/s, pico de cada curva: fluida 3,7x, macia 2,4x, easy 1,5x); sem salto e sem pico brusco (regra do estúdio); a guarda mantém o desenho no eixo e no palco (número e texto até y 1290, peça até 1560) |
|---|---|---|---|---|
| `smooth` | o look padrão (`ESTILO.md`) | dinheiro, tecnologia, números do dia a dia | alterna (gelo e breu) | a do Fluido |
| `smooth-produto` | `modelo-produto` | preço, conta de venda, checkout | alterna | mais ousada (1,15) |
| `smooth-estrategia` | `modelo-estrategia` | explicar em passos, número com fonte | alterna | a do Fluido |
| `smooth-historia` | `modelo-historia` | pessoa, empresa, invenção (foto real) | alterna em breu, breu, gelo | 0,9 |
| `smooth-vinheta` | `modelo-vinheta` | curiosidade calma, palavras, origens | papel claro, selo final no escuro | lenta, sem giro (0,3) |
| `smooth-tipografia` | `modelo-tipografia` | frase de impacto, lista rápida | chapas clara, escura e na cor da marca | nenhuma (corte seco) |

O modo do fundo vem do `tom` da cena: `"tom": "alterna"` (gelo e breu se revezam, pelo menos 3 trocas), `"escuro"` (só breu) ou `"claro"` (só gelo). Um beat força o dele com `"fundo"` (`gelo`, `breu`, `papel`, `tinta`, `chapa-claro`, `chapa-escuro`, `chapa-destaque`).

## Regras do estilo (medidas no Fluido; valem acima das regras gerais de layout)

| Regra | Medida no Fluido (motion.js, motion.css, os 5 modelos, FLUIDEZ.md) | No estúdio |
|---|---|---|
| Curvas | béziers do AE: fluida (0.65, 0, 0.2, 1), easy (0.33, 0, 0.67, 1), pousa (0.5, 0, 0.1, 1), macia (0.45, 0, 0.3, 1), arranca (0.1, 0.6, 0.3, 1); sem power3.out, expo.out, back.out | as mesmas (`estilo-smooth-curvas.js`); a tipografia usa seco, passos(5) e elástico, como o modelo dela |
| Fala na tela | palavra por palavra saindo do desfoque de 18 px em 0,34 s (easy), 0,06 s antes de ser dita; Inter 600 60 px; mora no mundo, logo abaixo do desenho | a fala É a legenda (regra do estúdio, 05/11/2026): grupos de UMA linha centrados no eixo, no mundo, 70 px abaixo do que a cena declarou e dentro do palco (até y 1300), andando com a câmera como no Fluido; nunca diminui a fonte para caber |
| Número | Space Grotesk 700, 110 a 170 px, -0,06 em; conta em português (Intl pt-BR) e chega junto com a fala | igual; ano sem ponto de milhar (`"ano": true`) |
| Peça entrando | de 0,6 de escala, opaca, 0,6 s na fluida (com giro em X ou Y) | igual; na troca de cena a peça já está 30% dentro no corte (regra 10: nada abre vazio) |
| Profundidade | ícone gigante desfocado na frente (320 px, translateZ 420, blur 14, opacidade 0,5 a 0,6), peça nítida no meio, fundo com brilho | igual: `perto` atravessa a borda na cena inteira; brilho da cor da marca passeia atrás |
| Fundo | gelo: radial #FFF > claro > claro-2; breu: radial escuro-3 > escuro-2 > escuro (o miolo tinge com a marca) | gelo #F3F4F6, breu #08090C neutros; o miolo do breu é a cor da marca misturada (derivada) |
| Cor | uma cor de destaque só, a da marca | `tonsDaMarca(spec.marca.destaque)`: destaque, destaque legível no gelo e no papel, texto sobre o destaque |
| Câmera | `M.diretor`: pico de velocidade na palavra, 3 nulls (zoom 12% antes, 1,5x; giro 8% depois, 1,3x), fusão abaixo de 0,6 x a duração, abertura já andando, respiro de +1,2%/s | com a regra do estúdio (04/11 e 05/11): câmera sempre viva e sem tranco. Onda contínua no tempo do vídeo (deriva vertical de 55 px, zoom de 3,5%, giro de 3 a 4 graus) somada aos movimentos; cada `vai` tem a duração calculada pelos tetos (pico de 70 px/s no pan, giro medido num ponto a 400 px, aceleração de 1800 px/s²), fusão e abertura também respeitam os tetos; teto total de 175 px/s na tela; saída a 110 px/s; meta medida no fluxo óptico: mediana de 2,5 a 5% da largura por segundo, máxima até 15%, no máximo 3 planos abaixo de 0,8%; a guarda mantém o desenho no eixo (x 540) e acima da fala |
| Corte | `d.corta`: salto de reenquadre em movimento; `d.sai`/`d.entra` a 1800 px/s | corta vira movimento contínuo (sem salto); sai/entra a 110 px/s, entrada assenta em 0,55 s, desfoque de 6 px |
| Trocas de beat | corte, cortina (painel na cor da marca), zoom, whip, sobe, flash | `troca`: corte, cortina, zoom, whip, sobe; **sem flash** (a troca nunca brilha em branco) |
| Legenda | grupos de até 3 palavras, Inter Tight 800 70 px, caixa escura atrás, y 1330 a 1500 | a legenda é a própria fala (linha acima): UMA linha, centrada no eixo (±24 px), **sem caixa**; não existe segunda legenda repetindo a fala |
| Textura | fundo vivo (grade de pontos, brilho, vinheta) | grade de pontos leve, brilho que passeia e grão em overlay (7%) que ferve a 12 posições por segundo |
| Som | troca de cena toca `shutter`; riser antes da troca de fundo; impacto só na virada (no máximo 2) | igual (`eventosSmooth`), com os nomes do pack do Fluido |
| Quadro 0 | a cena nasce com algo na tela | o que entra no começo da 1ª cena já entrou no quadro 0 |

## Feedback da revisão na prévia (05/11/2026)
- **Área segura universal** (`src/video/area-segura.mjs`, constante `AREA_SEGURA`, x 60 a 940 e y 250 a 1430, margem 12): o @ (topo do texto em y 268), a fala, números, rótulos, chips e o fecho ficam dentro; a guarda de enquadramento conta a onda da câmera; o QA reprova texto fora (tipo `area-segura`). Decorativos (os ícones desfocados das laterais, o fundo) podem sangrar. Linha centrada no eixo: até 776 px.
- **Mostrador** como o "rápido" do Fluido: anel de 400 px, o desenho do assunto no centro EXATO do anel (verificado), o número fora, logo abaixo (até 200 px), rótulo a 24 px dele.
- **Nada entra girando em 3D por cima de cartão de vidro** (o giro atravessava o plano do vidro e cortava o ícone ao meio): o verificador reprova (`giro-atravessa`).
- **Chips** em fila centrada, espaço fixo de 20 px, mesma altura, sem sobrepor (o verificador reprova `chip-sobreposto`).
- **QR que gira**: o cartão e o QR giram juntos, um objeto só.
- **Ícones desfocados nas laterais** de volta: um grande e um menor, dos dois lados, na maioria das cenas (fora do fecho e da tipografia), podendo sangrar.

## Composição e repetição (revisão do estúdio, 05/11/2026)
- A forma `numero` tem 4 composições: `mostrador` (anel com marcas, número com brilho e o ponto que corre), `cartao` (vidro com ícone, número e linha), `barra` (número grande e barra que enche; com %, enche até a fração) e `orbita` (o arco de 3 ícones). Rodízio automático; `layout` no elemento força uma.
- O verificador reprova a mesma composição (forma; no número, o layout; no código, QR ou barras) mais de 2 vezes no vídeo ou em cenas seguidas. O planejador troca por traço, frase, ícone ou notificação quando passaria de 2.
- Nada de texto vaza da tela: a palavra gigante cabe inteira. Os ícones desfocados das laterais são decorativos e podem sangrar.
- Fundo vivo do Fluido: grade de pontos que sobe 108 px no vídeo, brilho que passeia, segundo brilho que atravessa e vinheta radial.

## A figura vem da fala de cada beat (regra do estúdio, 05/11/2026, vale para todos os estilos)
- `src/video/fala-forma.mjs` (neutro, para qualquer estilo) lê as palavras do beat e devolve as figuras pedidas pela AÇÃO e pelo OBJETO: clique, mensagem, tempo, comparação, crescimento, lista, lugar, documento, código, dinheiro, pessoas, desenho. A primeira é a ação principal e `forte` marca as figuras que a fala não se entende sem.
- No Smooth, `FIGURA_SMOOTH` (em `autoplano-smooth.mjs`) traduz figura em forma. O planejador troca a forma genérica pela que a fala pede, e o verificador reprova uma figura forte ignorada (uma fraca vira aviso). Frase, fecho, foto e as formas da vinheta e da tipografia valem para qualquer fala, e o número dito aceita a forma de número.
- Estilo novo: chame `figurasDaFala`, escreva o mapa figura -> formas do estilo e use `combina` no planejador e no verificador.

## Formas (`{ "tipo": "smooth", "forma": ... }`)

| Forma | Modelo de origem | Campos |
|---|---|---|
| `numero` | gancho do produto e do estratégia | `valor`, `prefixo`, `sufixo`, `casas`, `ano`, `em` (palavra em que conta), `rotulo` (mono em cima), `icones` (3 tiles), `icone` (o da frente) |
| `codigo` | (novo no porte) o código como personagem | `codigo`: `qr` ou `barras`; `chave` (cantos acendem / Morse vira barras), `morse`, `le` (linha de leitura e bipe), `gira`, `dano` + `danoEm`, `texto` + `textoEm` |
| `botao` | gancho do estratégia | `botao` (até 22 letras), `rotulo`, `chave` (o clique da mão), `risca` (o risco que nega), `icone` |
| `checkout` | order bump do produto | `item` { texto, valor }, `extra` { texto, valor }, `prefixo`, `aparece`, `chave` (a mão marca), `rotulo`, `rotuloTotal` |
| `lista` | "qualificar" do estratégia | `titulo`, `itens` (até 3; texto até 40 letras, quebra em 2 linhas), `em` de cada item |
| `grade` | "todos" do estratégia | `total`, `acesos`, `colunas`, `texto` (ex.: "3 em 10"), `chave` |
| `relogio` | "rápido" do estratégia | `valor`, `sufixo`, `em`, `fonte` (a fonte na tela) |
| `calendario` | "agendar" do estratégia, "método" do história | `celulas`, `luz` (índice), `marcaTodos`, `titulo`, `chip`, `chipIcone`, `chipEm` |
| `chat` | "fechar" do estratégia | `texto` (digitado), `rotulo`, `chave`, `icone` |
| `barras` | "exemplo" do estratégia | `itens` [{ valor, rotulo, em }], `total`, `totalEm`, `prefixo`, `rotulo` |
| `grafico` | "pico" do história | `valores` (alturas em %), `picos`, `chips`, `chave` |
| `curva` | "parceira" do história | `valores`, `rotulo`, `texto`, `chave` |
| `fluxo` | "prejuízo" do produto | `itens` [{ icone, rotulo, texto, em }], `resultado` { valor, prefixo, rotulo, em }, `titulo` |
| `pessoas` | fim do order bump | `total` (até 10), `acesos`, `texto`, `chave` |
| `notificacao` | (interface) | `itens` [{ titulo, texto, icone, em }] |
| `comparacao` | "bastidores" do história | `a`, `b` { rotulo, valor, texto, icone, em }, `vence` |
| `foto` | gancho e "quem" do história | a imagem do beat (foto real de quem é citado), `nome`, `chave`, `gigante`, `anotacao`, `chips` |
| `frase` | "lição" do estratégia e do história | `quebra` (palavras da 1ª linha), `chave` (marca-texto), `gigante`, `impacto: false` |
| `icone` | peça genérica | `icone`, `chips`, `chave` |
| `cta` | tela final do Fluido | `botao`, `chave` |
| `traco`, `titulo`, `selo` | modelo vinheta | `rotulo` (subtítulo em serifa) |
| `tipo` | modelo tipografia | a fala vira páginas de até 3 linhas que trocam no corte seco |

Campos de todo beat: `fundo`, `troca`, `legenda` (força), `chave`. Ícones: os 70 de traço do Fluido (`estilo-smooth-icones.js`: check, x, seta, sobe, desce, grafico, porcento, dinheiro, carteira, carrinho, relogio, calendario, pessoa, pessoas, casa, predio, globo, foguete, aviao, carro, pino, mapa, celular, chat, megafone, sino, lupa, cadeado, escudo, chave, lampada, alvo, trofeu, coracao, papel, engrenagem, caixa, wifi, bateria, sol, lua, estrela, raio...) e os 36 de interface (Lucide, ISC: bell, send, message-circle, smartphone, qr-code, receipt, users, zap, sparkles...).

## Plano automático (`src/video/autoplano-smooth.mjs`)
Pelo sentido da fala: "X em cada Y" e porcentagem viram a `grade` (ou `pessoas`); número com tempo vira o `relogio`; outro número vira o `numero` ("15 centavos" vira R$ 0,15; ano depois de "de/em" não conta se houver outro número); dois ou três números viram `barras` (no produto, o `fluxo`); clicar, comprar, aplicativo viram o `botao`; mensagem e conversa, o `chat`; aviso, a `notificacao`; crescer e cair, a `curva`; passo dito ("Um:") vira a `lista` com o nome do passo no título; frase curta perto do fim, a `frase`; pessoa citada com foto, a `foto`; o último beat, o `cta` ("Comenta ILUSTRANDO"). Vizinhos nunca repetem. Vinheta: traço, título e número alternados, selo no fim. Tipografia: `tipo` em tudo.

## QA (`estilo-smooth-verificar.mjs`, sem render, e as medidas do navegador)
Reprova: cena só de texto; menos de 3 trocas de fundo no modo alterna; linha de fala ou de texto do estilo em mais de uma linha ou fora do eixo (±24 px, medido no navegador em todo quadro); desenho protagonista fora do eixo (centro da união das peças a mais de 24 px de x 540, fora das janelas de deslize do par e da passagem de cena); câmera com salto (mais de 60 px num quadro), acima de 175 px/s ou de 1800 px/s²; mais de 2 impactos; troca inexistente. Avisa: fala ou número entrando perto da borda; troca sem shutter; troca de fundo sem riser. No navegador, o estilo mede fala, número, peça e foto pela caixa real (o texto pela caixa das letras). Exceção do estilo (documentada): nos 0,4 s de entrada e 0,3 s de saída de cena a câmera atravessa o corte, em movimento e desfocada; ali o que está na tela conta como presença recortada à área segura. Avisos esperados: "protagonista pequeno" (o luxo do estilo é o espaço vazio: texto pequeno central) e "composição" na mesma linha.

Revisão a 5 qps: a mesma composição aparece mais de 2 vezes ou em cenas seguidas? Algo vaza da tela? a fala entra palavra por palavra no tempo da voz? O número chega junto com a fala? Cada cena tem o elemento gráfico além do texto? Nada vaza da área segura (x 72 a 1008)? A fala em UMA linha, centrada (dê zoom na faixa de baixo)? Cada frase com um desenho próprio que a explique (nada de 3 s só com ícone girando)? A troca de beat nunca clareia em branco? A câmera anda sem tranco?

## Som
Nomes do pack do Fluido (`shutter`, `clique`, `botao`, `teclado`, `notificacao`, `caixa`, `moeda`, `contador`, `pop`, `tique`, `vidro`, `whoosh`, `deslize`, `riser`, `subida`, `baque`, `impacto`, `ding`, `sucesso`, `brilho`, `bip`, `chiado` e as variações). Com as amostras no banco `sons/`, elas tocam; sem elas, os sintetizados da biblioteca do estilo (`sfx-estilos.mjs`, LS), sem erro. Trilha pelo clima (`trilhas.mjs`): smooth pulso e curiosidade, produto pulso e groove, estratégia pulso e ambiente, história épico e mistério, vinheta ambiente e leve, tipografia groove e pulso.

## Como criar uma forma nova (3 passos)
1. Escreva a função em `FORMAS` de `src/video/engine/estilo-smooth-formas.js`: monte o HTML no mundo com o kit (`k.add`, `k.fala`, `k.numero`, `k.vic`, `k.perto`, `k.mao`), anime na trilha (`k.entra`, `k.desfoque`, `k.T.tw`), mova a câmera (`k.camera(ini)` e `d.vai(t, pose)`), toque os sons (`k.som`) e declare as caixas (`k.medir`).
2. Ponha o nome em `FORMAS_DA_VARIANTE` e, se ela mostra a fala, em `MOSTRA_FALA`; os campos novos entram em `validarSmooth`.
3. `node --test test/estilo-smooth.test.mjs`: o teste roda o verificador e os tetos de câmera em todos os irmãos.

## O que não veio do Fluido
O carimbo de licença da cópia, número de pedido, nome e e-mail de comprador, os caracteres invisíveis de marca d'água, as ferramentas de HyperFrames e o GSAP. As fontes do Fluido usadas aqui são OFL (Inter, Space Grotesk, Inter Tight, Anton; JetBrains Mono já estava no estúdio), registradas em `AVISOS-TERCEIROS.md` e `fontes/OFL-smooth.txt`. A vinheta usa a Playfair Display do estúdio no lugar da Fraunces (que o Fluido baixava do Google Fonts); a tipografia usa Inter Tight 900 no lugar da Archivo Black.




