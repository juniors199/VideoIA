

# Templates de carrossel

O carrossel tem três grupos de slide e onze visuais (os 3 de base e as 8 famílias de estilo, abaixo). Os **clássicos** (`capa`, `texto`, `dado`, `lista`, `comparacao`, `ranking`, `passos`, `mitofato`, `antesdepois`, `fecho`) contam a história com tipografia. Os **virais** imitam formatos que o público já reconhece no feed (post de rede de texto curto, jornal, conversa, nota do celular, gráfico, meme) e trazem foto, ícone, selo e marcação à mão. Os dois se misturam no mesmo carrossel.

Para ver a lista na hora: `node src/carrossel.mjs --tipos`. O código fica em `src/carrossel/` (`virais.mjs` com os tipos, `familias.mjs` com as famílias e os tipos delas, `elementos.mjs` com ícones, rostos e marcações, `visuais.mjs` com os visuais, `imagens.mjs` com as fotos e `qa.mjs` com a conferência medida). Há um carrossel de exemplo de cada tipo em `carrosseis/` (tabela no fim).

## Marca por tokens
Nome, @, avatar, cor de destaque, apoio e tinta vêm de `marca/tokens.json`. Nada da marca de fábrica é cravado nos tipos: quem troca a marca com `npm run marca` troca o carrossel inteiro.
- **Avatar do post:** o símbolo da página num círculo. Para usar a foto da pessoa, ponha o arquivo em `marca/` e o caminho em `paginas.curiosidades.avatar` (ex.: `"avatar": "marca/avatar-foto.jpg"`).
- **Selo ao lado do nome:** círculo na cor da página com um visto. Não reproduz o selo de nenhuma rede. Para tirar: `"selo": false` no slide ou na página.

## Visuais
`"visual"` no carrossel.json escolhe o papel de todos os slides; `"modo"` num slide troca só aquele.

| Visual | Quando |
|---|---|
| `escuro` (padrão) | o da marca; capa com foto, plantão, dados |
| `claro` | post claro, nota do celular, receita, saúde |
| `papel` | jornal, revista, colagem, história, cultura |

Alguns tipos pedem um visual sozinhos (`manchete`, `revista` e `colagem` usam `papel`; `nota` usa `claro`; `plantao`, `vocesabia` e `capafoto` usam `escuro`). Em fundo claro, o destaque usado como texto escurece até passar de 3:1; botões e barras ficam com a cor pura.

## Famílias de estilo
Oito visuais completos, tirados de carrosséis de mercado que performam (só o estilo: nenhum texto, foto, logo ou nome deles entra aqui). Use `"visual": "<família>"` no carrossel.json. Cada família restiliza todos os tipos de slide (clássicos e virais), põe rótulos de canto com o @ da página e alterna a cor dos slides num ritmo próprio; um slide troca a cor com `"cor": "escuro" | "claro" | "destaque" | "apoio"` (destaque é a cor da página; apoio é a cor clara dela).

| Família | Como é | Tipos que brilham nela | Fontes |
|---|---|---|---|
| `editorial` | blocos de cor alternados (escuro, creme, destaque, apoio), grotesca média apertada, linha de dados no topo (nome, @, contador), foto sangrando em bloco, número grande largo | `capafoto`, `fotobloco`, `numeros`, `marcados`, `texto` | Inter Tight, Poppins (números) |
| `condensado` | manchete condensada em caixa alta com a palavra-chave na cor, rótulos em caixa alta espaçada, linha fina de progresso embaixo | `capafoto`, `marcados`, `texto`, `veredito` | Antonio, Inter Tight |
| `interface` | o celular como cenário, creme e preto: notificação na tela de bloqueio, painel de cartões, diálogo de sistema, nota; palavra-chave em caixa da cor | `notificacao`, `painel`, `dialogo`, `nota`, `chat` | Inter Tight |
| `recorte` | papel creme com grão, título em tarjas pretas, foto rasgada com fita, texto corrido com destaque em negrito | `recorte`, `texto`, `numeros`, `veredito` | Inter Tight |
| `serifado` | revista: serifada estreita com itálico na cor, texto corrido serifado, foto escura | `capafoto`, `citacao`, `texto`, `dado` | Instrument Serif |
| `marcatexto` | reportagem escura: foto no topo que some no fundo, texto corrido com marca-texto na cor, logo no topo e botão de seta vazado | `fototopo` (com `capa: true` na capa) | Inter Tight |
| `limpo` | branco total, grotesca preta apertada, errado x certo com selos em relevo, capa "isto VS aquilo" | `versus`, `errocerto`, `marcados` | Inter Tight |
| `grao` | papel cinza granulado, quatro cantos com rótulos, título centralizado e texto fino, celular com a foto do assunto | `capa`, `celular`, `texto` | Inter Tight, Bricolage Grotesque fina |

Como escolher: notícia e esporte, `editorial` ou `marcatexto`; lista de mitos e "o que é", `condensado`; dados e saúde, `interface`; história e cultura, `recorte` ou `serifado`; aula e negócio ("faça assim, não assado"), `limpo`; tecnologia e produto, `grao`.

### Tipos novos das famílias

| Tipo | Para quê | Campos (limites) |
|---|---|---|
| `notificacao` | tela de bloqueio com hora e 1 ou 2 notificações da própria página | `imagem`, `notificacoes[{titulo (70), texto (90), app, quando}]`, `hora`, `dia` |
| `painel` | 2 a 4 cartões de número, sem gráfico inventado | `titulo`, `cards[{rotulo, numero (7), texto (50)}]`, `rotulo`, `sub`, `nota` |
| `dialogo` | caixa de diálogo com duas respostas, para provocar quem lê | `pergunta` (80), `sim`, `nao`, `titulo`, `texto`, `imagem` |
| `fototopo` | foto no topo que some no fundo e texto corrido embaixo | `imagem`, `texto` (lista de parágrafos, 260 no total), `titulo`, `capa` |
| `fotobloco` | número grande e texto num bloco de cor, com a foto sangrando até a borda | `imagem`, `titulo` (60), `texto`, `numero`, `ordem: texto-foto | foto-texto`, `legendaFoto` |
| `errocerto` | errado em cima, certo embaixo, selos em relevo | `errado{texto (80), nota}`, `certo{texto, nota}` |
| `versus` | capa "isto VS aquilo" com a seta longa | `a` (36), `b` (36), `sub` |
| `celular` | celular genérico (sem marca de fabricante) com a foto na tela e o texto ao lado | `imagem`, `titulo` (40), `texto` (130), `marca`, `lado: esq | dir` |
| `marcados` | lista com selo em relevo em cada item: visto, xis ou seta | `titulo`, `itens[texto | {texto, marca: sim | nao | seta}]` (2 a 6), `marca`, `nota` |
| `recorte` | título em tarjas e foto rasgada com fita | `imagem`, `titulo` (60), `texto` (180) |

**Quadro cheio.** Nenhum slide pode ficar com mais de 35% da altura vazia numa faixa só (nem mais da metade somando as faixas). Slide de texto curto ganha apoio: foto (`"fotoFundo": "assets/x.jpg"` põe a foto do tema atrás de qualquer slide, sob um véu da cor do slide, com `"focoFundo"`), número grande (`dado`), lista `marcados` ou citação; ou sobe e aumenta o texto. O CTA final pode levar a foto do tema atrás. O gerador avisa "área vazia" e `--estrito` reprova.

**Foto que some no fundo.** `fototopo`, `fotoFundo`, `capafoto`, `vocesabia` e `plantao` usam o mesmo degradê: começa por volta de 35% da foto e chega à cor do fundo numa curva ease (várias paradas, nunca linear), com escurecimento leve nas laterais e ruído fino contra faixas de cor (`degradeSuave`, `vinhetaLateral` e `ruidoFino` em `src/carrossel/visuais.mjs`). No `fototopo` a foto ocupa 63% do slide em cover e o texto sobe para cima da parte que some; com `capa: true` a foto é inteira. Foto escaneada com moldura de álbum: recorte só a foto antes.

Selos e elementos novos nunca são chapados: o selo de visto, xis e seta tem luz em cima, borda mais escura, brilho de vidro e sombra (regra do estúdio). O celular tem moldura com reflexo e ilha, sem logo de fabricante.

## Os tipos virais

| Tipo | Para quê | Campos (limites) |
|---|---|---|
| `tweet` | post da própria página no estilo rede de texto curto; carrossel inteiro em posts | `texto` (280; 150 com foto), `imagem`, `data`, `selo` |
| `thread` | 2 ou 3 posts encadeados por slide, com a linha entre os avatares | `posts[{texto, imagem}]` (150 cada, 300 no slide) |
| `manchete` | capa de jornal com o nome da página no cabeçalho | `titulo` (90; 70 com foto), `chapeu`, `linhafina`, `imagem`, `legendaFoto`, `fonte`, `editoria`, `data`, `jornal` |
| `plantao` | notícia urgente com selo AGORA e foto no fundo | `titulo` (80), `texto`, `rotulo`, `hora`, `fonte`, `imagem` |
| `chat` | conversa entre quem lê (`eu`, à direita) e a página (`pagina`, à esquerda) | `mensagens[{de, texto, hora}]` (2 a 6, 90 cada), `digitando`, `contato`, `status` |
| `nota` | bloco de notas do celular: lista, checklist, lembrete | `titulo` (40), `texto`, `itens[texto ou {texto, feito}]` (até 7) |
| `podio` | os 3 primeiros, com foto | `titulo`, `itens[{nome, valor, imagem}]` (3) |
| `veredito` | uma afirmação e o carimbo MITO, VERDADE ou EM PARTE | `afirmacao` (90), `veredito`, `explicacao` (150) |
| `grafico` | barras, colunas, linha ou pizza | `forma`, `dados[{rotulo, valor, texto}]`, `unidade`, `destaque`, `zero`, `fonte` (obrigatória na prática) |
| `reacao` | quadro de reação com rostos desenhados aqui: 1 grande ou 2 em sequência | `topo`, `rosto`, `legenda` ou `quadros[{rosto ou imagem, texto}]` |
| `citacao` | citação real, com foto livre da pessoa em faixa preto e branco | `frase` (150; 110 com foto), `autor`, `cargo`, `imagem`, `cor: true` para foto colorida |
| `passo` | um passo por slide, numeral grande, ícone ou foto | `titulo`, `texto`, `icone`, `imagem`, `numero` (letra também vale: `"S"`) |
| `tabela` | comparativo com visto e xis | `colunas` (2 a 3), `linhas[{rotulo, valores}]` (até 6), `destaque`, `fonte` |
| `vocesabia` | foto grande de ponta a ponta com o adesivo "Você sabia?" | `imagem`, `titulo` (70), `texto`, `rotulo`, `foco` |
| `capafoto` | capa forte com foto de ponta a ponta | `imagem`, `titulo` (60), `sub`, `rotulo`, `foco` |
| `revista` | editorial: foto, manchete serifada e capitular | `titulo`, `texto` (240; 160 com foto), `imagem`, `secao`, `numero` |
| `colagem` | scrapbook: polaroides com fita, nota à mão, adesivo | `fotos[{imagem, legenda}]` (1 a 3), `titulo`, `nota`, `adesivo` |
| `tipografico` | uma frase gigante e mais nada | `texto` (40), `apoio`, `fundo: "destaque"` |
| `definicao` | verbete de dicionário | `palavra` (14), `fonetica`, `classe`, `definicao`, `exemplo`, `origem` |
| `linhatempo` | 3 a 5 marcos com anos grandes | `titulo`, `marcos[{ano, texto}]`, `destaque` |
| `quiz` | pergunta com opções; repita com `revelar: true` para a resposta | `pergunta`, `opcoes` (2 a 4), `resposta`, `revelar`, `explicacao`, `dica` |
| `receita` | ficha: foto, tempo, porções, ingredientes | `titulo`, `ingredientes` (até 10; 6 com foto), `tempo`, `porcoes`, `dificuldade`, `imagem` |
| `placar` | placar com siglas em círculo, gols e lances | `casa{nome, sigla, gols}`, `fora`, `competicao`, `info`, `lances[{minuto, texto}]` |
| `codigo` | janela de código com cor nas palavras-chave | `codigo` (12 linhas de 32), `linguagem`, `arquivo`, `titulo`, `legenda` |
| `versiculo` | versículo com referência e versão | `texto` (170), `referencia`, `versao` |
| `informativo` | linhas com ícone: prazos, horário, endereço, direitos | `titulo`, `linhas[{icone, rotulo, texto}]` (2 a 5), `nota` |
| `numeros` | painel com 2 a 4 números | `titulo`, `itens[{numero, legenda}]`, `destaque`, `fonte` |
| `anotada` | foto inteira com círculos e etiquetas à mão | `imagem`, `marcas[{x, y, texto, tipo: circulo ou ponto, lado, tamanho}]`, `titulo`, `altura` |
| `divisao` | antes e depois na mesma moldura, cortados na alça | `antes{imagem, rotulo}`, `depois{imagem, rotulo}`, `titulo`, `texto`, `corte` |

Em `anotada`, `x` e `y` são a porcentagem da foto (0 a 100) e a foto aparece inteira, sem corte. Em `divisao`, as duas fotos precisam ter o mesmo enquadramento (duas metades de uma comparação de satélite, por exemplo).

## Elementos
- **Foto atrás:** `fotoFundo` e `focoFundo` em qualquer slide (veja Quadro cheio).
- **Destaque:** `*palavra*` pinta na cor da página; `~palavra~` sublinha à mão. Um por slide.
- **Ícones** (campo `icone` em `passo` e `informativo`): relogio, local, telefone, calendario, alerta, check, xis, dinheiro, documento, pessoas, chapeu, fogo, lampada, coracao, livro, grafico, escudo, estrela, bola, codigo, wifi, planeta, lupa, cruz, folha, saude, seta, info.
- **Rostos** (campo `rosto` em `reacao`): sim, nao, choque, pensando, rindo, olhos, cabeca, neutro, amor. Desenhados aqui; nada de meme ou emoji de terceiros.
- **Marcações à mão:** círculo e seta (`anotada`, `colagem`), carimbo com xis ou visto (`veredito`), fita e adesivo (`colagem`).

## Fotos
1. `node scripts/buscar-imagem.mjs <carrossel> "<termo>" --carrossel --listar` mostra as fotos de licença livre do Wikimedia Commons; `--escolha=N --nome=arquivo` baixa para `carrosseis/<carrossel>/assets/` e escreve a licença em `fontes.md`. O `--carrossel` evita que um vídeo com o mesmo nome receba a foto.
2. No slide: `"imagem": "assets/arquivo.jpg"` e, se precisar, `"foco": "50% 30%"` (que parte da foto fica no quadro).
3. O crédito vai na legenda do post, nunca na tela. O validador recusa foto que não existe e avisa foto sem licença em `fontes.md`.
4. Pessoa citada pelo nome: foto real de licença livre. Em política, o mesmo tratamento visual para todos os lados (mesmo tipo de slide, mesmo tamanho, mesmo filtro).

## O que nunca fazer
- Imitar o perfil de outra pessoa ou empresa no `tweet`, no `thread` ou no `chat`. O post é sempre da própria página; a conversa é entre a página e quem lê (ou papéis genéricos como "cliente"), nunca um print de alguém real.
- Usar logo, ícone ou nome de rede social (o post não leva o pássaro, o X nem o selo azul).
- Escudo de clube no `placar` (é marca do clube): use a sigla.
- Citação sem fonte conferida. Versículo sem a versão.
- Número sem fonte no `grafico`, no `numeros` e no `dado`. Fato em 2 fontes, listadas em `fontes`.

## Conferência
`node src/carrossel.mjs <nome>` valida os campos antes e mede cada slide depois: texto sobreposto, texto perto da borda, texto cortado, letra menor que 26 px, foto que não carregou e área vazia (mais de 35% da altura sem nada). `--estrito` faz o gerador falhar quando a medição acha problema. Depois, `node scripts/folha-carrossel.mjs <nome>` monta a folha de contato (`carrosseis/<nome>/folha.png`) com cada slide a 360 px, o tamanho de um slide no celular: se lê ali, lê no feed.

## Exemplos prontos

| Carrossel | Tipos em destaque | Página |
|---|---|---|
| `polvo-tres-coracoes` | tweet (escuro, com foto) | curiosidades |
| `qwerty-fio` | thread, tweet (claro) | tecnologia, história |
| `cometa-3i-atlas` | manchete, linhatempo, numeros, veredito (papel) | notícia, ciência |
| `nobel-fisica-2026` | plantao, numeros, quiz | notícia |
| `regra-dos-72` | chat | finanças |
| `agua-8-copos` | nota, veredito (claro) | saúde |
| `artilheiros-copas` | capafoto, podio, numeros, placar | esporte |
| `mitos-do-cerebro` | veredito | ciência, saúde |
| `co2-mauna-loa` | grafico (linha e pizza), numeros | ciência |
| `tomate-e-fruta` | reacao (1 e 2 quadros), capafoto | curiosidades |
| `armstrong-pequeno-passo` | citacao, capafoto | história |
| `avc-samu` | passo (com letras) | saúde, aula |
| `geracoes-wifi` | tabela, grafico (barras), linhatempo | tecnologia |
| `flamingos-rosa` | vocesabia, capafoto | curiosidades, ciência |
| `semana-de-22` | revista (papel) | história, cultura |
| `cristo-redentor` | colagem, capafoto (papel) | história |
| `luz-do-sol` | tipografico (também com fundo da marca) | ciência |
| `serendipidade` | definicao | aula, curiosidades |
| `historia-do-celular` | linhatempo, capafoto | tecnologia, história |
| `quiz-corpo-humano` | quiz | saúde, aula |
| `brigadeiro` | receita, passo, capafoto (claro) | receita |
| `final-copa-1970` | placar, quiz, capafoto | esporte |
| `hello-world` | codigo | tecnologia, aula |
| `salmos-curiosidades` | versiculo, numeros, quiz | fé |
| `direitos-do-consumidor` | informativo, veredito | negócio local |
| `plano-real` | numeros, linhatempo, quiz | finanças, história |
| `torre-de-pisa` | anotada, linhatempo, numeros | história, curiosidades |
| `mar-de-aral` | divisao, veredito | ciência |
| `ref-editorial-mbappe` | família editorial: capafoto, fotobloco, numeros, marcados | esporte |
| `ref-condensado-tomate` | família condensado: capafoto, marcados, veredito | curiosidades |
| `ref-interface-agua` | família interface: notificacao, nota, painel, dialogo | saúde |
| `ref-recorte-semana22` | família recorte: recorte, numeros, veredito | história, cultura |
| `ref-serifado-armstrong` | família serifado: capafoto, citacao, dado | história |
| `ref-marcatexto-cristo` | família marcatexto: fototopo | história, curiosidades |
| `ref-limpo-cerebro` | família limpo: versus, errocerto | saúde, aula |
| `ref-grao-celular` | família grao: capa, celular | tecnologia |

## Logos e bandeiras (todos os tipos de slide)
Qualquer campo de foto aceita `"logo:<id>"` ou `"bandeira:<id>"` da biblioteca `marcas/` (o selo com acabamento entra no lugar da foto), e qualquer slide aceita `"logo"` e `"bandeira"` (um id, uma lista ou `{ "marca", "acabamento", "modo" }`) como uma fileira de selos no alto do corpo (`"logoPos": "baixo"`, `"logoAlinha": "esquerda"`, `"logoTamanho"`). Uso editorial, sem sugerir parceria; o crédito vai sozinho para o `fontes.md`. Lista e regra de uso: `docs/marcas.md`.




