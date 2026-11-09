

# Estilo pleno (escala em quadradinhos 3D)

Porte de 05/11/2026 a partir de um vídeo do próprio estúdio (48,8 s, 720 x 1280, sem áudio; o projeto original foi perdido). Medição quadro a quadro feita fora do kit. A réplica exata da referência é o projeto `projetos/pleno-replica` (tempo fixo, muda) e a prova de que o estilo é genérico é `projetos/pleno-teste`.

Para quem: número grande e porcentagem que ninguém consegue imaginar. População, dinheiro, uso de uma tecnologia, quem faz o quê. Cada quadradinho é um pedaço do todo: a grade cresce em volta do "você", a câmera recua até o planeta inteiro, os grupos se pintam e a frase do topo é a fala na tela.

## Regras do estilo (medidas na referência; valem acima das regras gerais de layout)

| Regra | Medido na referência (720 x 1280) | No estúdio (1080 x 1920) |
|---|---|---|
| Mundo | grade de 50 x 50 quadradinhos arredondados com espessura, o "você" na coluna 25, linha 24 | `InstancedMesh` num WebGLRenderer próprio (`estilo-pleno.js`), lado 0,78 do passo, raio 0,2, espessura 0,16; grupos sobem a 0,55 |
| Câmera | perspectiva de ~30 graus (homografia do plano: f = 2.388 px a 720); plano geral a ~210 passos, inclinado 31 a 35 graus, giro -5 a -11; 1 plano contínuo | órbita (`alvo`, `dist`, `tilt`, `giro`, `roll`, `dof`) com quadros-chave e Catmull-Rom (`curva: "spline"`); presets `heroi`, `afasta`, `geral`, `canto`, `perto`, `rente`, `mergulho` |
| Herói | quadrado branco com degradê para azulado (#F6F8FA a #B2BEC8), brilho largo, entra girado (28, -24, -9 graus) e assenta em 1,5 s; faixa de reflexo aos 1,75 s | `heroi.rot`, `heroi.brilho`, `heroi.cores` (troca de cor no fecho) e `heroi.zk` |
| Pontos | o quadrado escurece e vira uma matriz de ~30 x 30 pontos brancos que nasce do centro em ~0,6 s e some de fora para dentro | `pontos` na forma `contador` (shader do herói) |
| Grade crescendo | disco de quadradinhos que cresce acelerando em volta do "você" (raio ~10 aos 1,5 s, cantos no fim) | `grade.em`, `grade.dur`, `grade.curva` (`acelera`) |
| Anel e "você" | anel claro em volta do quadrado (5,5 s) e a etiqueta branca "você" com bico (106 x 55 px, tamanho fixo na tela) | `anelEm`, `voceEm`; a etiqueta some perto da borda da área segura |
| Ondas | anel de brilho que sai do "você" e atravessa a grade em ~1,5 s | forma `escala` (`ondasEm`, `ondasDur`) |
| Grupos | cinza 71% (a parte do canto apaga), verde 28% sobe do canto para fora, amarelo 1% em mancha com foco (o verde escurece), vermelho no canto; o resto apaga quando o vídeo foca nos coloridos | `grupo`/`grupos` com `forma` (`canto`, `resto`, `mancha`, `tiles`, `faixas` + `buracos`), `foco`, `focoAte`, `brilho`; evento `escurece` |
| Texto do topo | rótulo em caixa alta espaçada (Inter 600, 33 px, cinza #8E8D92) com marcador colorido; número grande Inter Tight 700 (140 a 148 px); sub cinza (36 a 41 px); título grande (94 a 137 px) | rótulo, número que conta (valores medidos interpolados sem estouro), sub, título em pedaços que entram na palavra dita; `px`, `base` e `largura` por texto (a largura medida vira o espaçamento) |
| Entrada e saída de texto | a palavra sai do desfoque em ~0,2 s; o bloco some desfocando em ~0,2 s | `REGRAS_PLENO.entrada` e `.saida` (`entra`, `saiDur` por texto) |
| Chips | pílulas escuras translúcidas que entram uma a uma (2 linhas no fim) | `chips` com `linha` e `estiloChip` |
| Fecho | o "você" vira o herói de novo, troca de cor (verde, lima, amarelo, vermelho, branco), a grade sai, "AGORA ME FALA", a pergunta e o botão claro; volta ao primeiro quadro (loop) | forma `fecho` (`botao`, `saiGradeEm`) |
| Cor | monocromático + as cores semânticas dos grupos | verde, amarelo e vermelho dos grupos ficam como na referência (são categorias de dado); o destaque da página entra no `*título*` marcado e no grupo `marca` (teste em `test/estilo-pleno.test.mjs`) |
| Acabamento | vinheta forte (cantos a ~13% do centro), brilho nas coisas acesas, desfoque de faixa nos planos próximos, lente macia | fundo radial #1C1C1E a #070708, bloom em duas larguras só na passada do que acende, tilt-shift por `dof`, desfoque de lente de 0,9 px, desfoque de movimento no recuo rápido (`rapido: true`) |

## Formas (`{ "tipo": "pleno", "forma": ... }`, uma por beat)

| Forma | O que faz | Campos |
|---|---|---|
| `quadrado` | o herói sozinho, rótulo em cima e a frase embaixo | `rotulo`, `frase` (pedaços), `heroi` |
| `contador` | número do herói embaixo do quadrado; o quadrado pode virar pontos | `numero` (`valor` ou `valores`, `prefixo`, `sufixo`, `casas`, `passo`), `sub`, `pontos` |
| `grade` | a grade cresce em volta do "você" e a câmera recua | `numero`, `sub`, `grade`, `anelEm`, `voceEm` |
| `frase` | o texto do topo sobre o mundo (uma ou duas linhas) | `frase` (pedaços com `em`, `linha`, `risca`) |
| `escala` | o número grande de bilhões e as ondas | `titulo` (pode `encolhe` do título grande), `numero`, `sub`, `ondasEm` |
| `grupo` | um grupo colorido por porcentagem e forma | `rotulo` (com `marcador`), `numero`, `sub`, `chips`, `dez`, `grupo`/`grupos` |
| `numero` | um número solto no topo sobre o mundo | `numero`, `sub` |
| `fecho` | o herói de volta, a pergunta e o botão | `rotulo`, `frase`, `botao`, `heroi`, `saiGradeEm` |

Campos comuns: `camera` (preset, objeto ou lista de quadros-chave; `t` absoluto ou `em` relativo), `eventos` (`voceSai`, `escurece`, `revela`, `anel`, `voce`, `ondas`, `pontos`, `sai`), `layout` (`heroi` ou `topo`), `mantem` (não fecha o bloco de texto anterior). Instantes: número = segundos desde o começo do beat; `"@12.3"` = instante absoluto (cenas de tempo fixo); palavra = o instante em que ela é dita.

**Tempo fixo (`"tempo": "fixo"`, raiz):** cada beat traz `"em": [de, ate]` e a cena traz `"duracao"`; o vídeo segue o relógio da cena (a réplica da referência). `"quadroZero": 0` faz o primeiro quadro ser o instante 0. `"efeitos": { "mudo": true }` desliga os efeitos e a conferência da fala.

## Plano automático (`src/video/autoplano-pleno.mjs`)
O gancho é o quadrado; o primeiro número depois dele (ou "quadradinhos") faz a grade crescer; bilhões e "planeta" viram a escala; porcentagem vira grupo (o primeiro pinta do canto ou apaga o resto, os seguintes são manchas com foco, nas cores verde, amarelo, vermelho e marca); frase sem número vira o texto do topo; o último beat é o fecho. A cena vem da fala pela camada comum (`engine/estilo-pleno-repertorio.js`, `registrarRepertorio('pleno', ...)`): sem nada desenhável, a `frase` (nunca uma cena por rodízio).

## Acabamento por vídeo (`aparencia`) e véu de contraste
Todo valor das regras do estilo pode vir trocado no vídeo: `"aparencia": {...}` em qualquer elemento pleno (mescla profunda; lista troca inteira). O que mais se usa: `material.heroi` (degradê `grad`, `espessura`, `bisel`, `lateral`, `brilho`), `material.brilhoGrade` e `material.brilhoHeroi` (bloom `[desfoque px, alfa]` da grade e do quadrado, separados), `material.brilhoDist` (o bloom da grade com tamanho de mundo: largura certa a essa distância, mais fino de longe), `material.brilhoAtras` (fração do bloom por baixo do mundo nítido: o topo não lava), `material.topoGrad`, `material.lateral`, `material.ruido`, `material.anel`, `material.vinheta`, `material.dof`, `cores`, `fundo`, `lado`, `raio`, `suave`, `alturaGrupo` e `texto.fonte`. Na réplica esses números saíram da busca por máquina contra a referência (nota SSIM por cena). Entrada e saída dos textos (medidas quadro a quadro na referência, 05/11): o texto começa a aparecer `entrada.antes` (0,15 s) antes do instante dele e leva `entrada.dur` (0,2 s): alfa em linha, desfoque de 12 px que cai mais no fim, sobe 7 px até o lugar; os pedaços de frase entram em cinza e clareiam para o branco no próprio instante (`entrada.clareia`); botão e chip crescem de 0,94 até 1. Assim o "em" é o instante em que o texto já se lê (a fala presa ao texto continua certa). Saída: 0,17 s desfocando e subindo 8 px (`saida`); `saiDur` no texto só quando a referência corta. Folha das entradas, referência em cima e réplica embaixo: `scripts/pleno-replica/folha_entradas.py`. Rodada 3 (05/11): `material.heroi.ganho` multiplica a cor do quadrado na passada nítida (acima de 1 o topo estoura no branco, como no fecho e no recuo da referência; padrão 1); `material.mapa` (brilho medido por quadradinho) fica preso entre 0,75 e 1,3, e a ferramenta que mede (`scripts/pleno-replica/mapa_tiles.py`) ignora os vizinhos do "você" (a etiqueta e o anel por cima viravam a mancha escura em volta dele no fecho); o anel do "você" é desenhado sempre por cima (os vizinhos mais altos cortavam o traço no recuo); `texto.risca` (`risca` num pedaço da frase): o traço passa `ext` x px de cada lado da palavra, com espessura `esp` x px e brilho, e a palavra apaga para o cinza (ref 43,2 s, "atrasado."). Ferramentas de medida e busca da réplica (diagnóstico por faixa, perfis, busca de câmera por trecho, das chaves, de tempos, do botão e do quadrado do fim): `scripts/pleno-replica/LEIA-ME.md`.

Grupo com `tom` (cor exata, a semântica fica em `cor`) e `clareia: true` acende os próprios quadradinhos enquanto o resto apaga; `espalha: 0` faz tudo de uma vez (sem ordem do canto); `ate` encerra o destaque (o resto continua apagado). Evento `ondas` aceita `larg`, `forca` e `apaga`.

**Véu de contraste (regra do estúdio, 05/11/2026):** nos closes com texto (câmera mais perto que `material.veu.dist`), um degradê do tom do fundo escurece o topo (opacidade `alfa` 0,45, que sobe até `alfaMax` só quando o que está atrás do texto é claro demais) e some até `ate` (2/3 da altura); entra e sai com a câmera e com o texto. Com o véu o rótulo e o sub clareiam (`veu.texto`) e o @ ganha reforço (`veu.arroba`). `"veu": false` ou um número de 0 a 1 no elemento força. O QA mede a razão de contraste WCAG de cada texto contra o fundo atrás dele (4,5:1 no texto principal, 3:1 no rótulo, no sub e no @): tipo `contraste`.

## QA
`verificadores/estilo-pleno-verificar.mjs` (sem render, chamado pelo QA do estúdio): câmera sem salto (mais de 120 px num quadro reprova; o recuo rápido declarado com `rapido: true` vira aviso, com desfoque de movimento), câmera dentro de 0 a 80 graus, cada linha cabe em 776 px no eixo, deslocamento medido (`dx`) avisado e dentro da área segura, linha de base dentro da área segura, grupos válidos e fala -> forma (`fala-desenho`). No navegador o estilo mede a caixa real de cada texto (área segura, `x 60 a 940`, `y 250 a 1430`) e devolve o mundo como protagonista.

Revisão a 5 qps: o quadrado entra girado e assenta? A grade cresce em disco em volta do "você"? A câmera recua sem tranco? Cada texto entra no instante da fala, inteiro, numa ou duas linhas? Os grupos têm a cor certa e pintam do canto? A etiqueta "você" some antes de sair da área segura? O fecho volta ao primeiro quadro?

## Som (fora da réplica muda)
Mixagem própria do estilo (`MIX_POR_ESTILO.pleno` em `src/video/video.mjs`, 05/11): nenhum efeito passa do pico da voz no próprio trecho (janelas de 50 ms, `tetoPorVoz`) e a trilha sobe 8 dB depois do fim real da voz, com fade curto no fim (`subirCauda`); para refazer só a mixagem de um vídeo pronto pelos stems de `saida/`, sem gastar voz nem trilha: `node scripts/remixar.mjs <projeto>`. Voz ElevenLabs do `.env`; trilha no clima `curiosidade`/`pulso`, 8 LU abaixo da voz; efeitos do banco (biblioteca LS do estúdio): `tique` a cada degrau do contador, `whoosh` na câmera que recua ou mergulha e na onda, `pop` nos chips e no botão, `subida` quando um grupo se pinta e `brilho` no quadrado (no máximo 1 a cada 6 s), todos bem abaixo da voz (`eventosPleno`). Teto momentâneo de 12 LU (`TETO_SFX_MOMENTANEO` em `src/video/video.mjs`): nenhuma janela de 0,4 s de efeitos chega a menos de 12 LU da voz. Narração presa ao texto (revisão do estúdio, 05/11/2026: "cortes errados e fora de sincronia"): `node scripts/fala-tempo-fixo.mjs <projeto> --estica=<cena-de-origem.json>` deixa cada frase da voz inteira (recorte no meio do silêncio, 10 ms de esmaecimento, sem pausa encurtada nem aceleração) e estica a cena só onde a frase é mais longa que o espaço até o próximo texto (`falas.json`: primeira palavra de cada frase e o instante do texto). Depois, `node scripts/conferir-sincronia.mjs <projeto>` mede o início de cada frase no áudio final (energia e transcrição com tempo por palavra, guardada por hash), compara com o texto (meta 0,15 s), confere que nenhuma frase passa do próximo texto e que as 2 pontas de cada emenda caem no silêncio. O modo antigo (sem `--estica`) continua para quem não pode mudar a duração.

## Fonte
Inter 700 (títulos e números; escolhida por nota contra a referência entre as famílias livres do kit: Inter 0,803, Inter Tight 0,802, Roboto 0,794, Space Grotesk 0,792, Montserrat 0,778, Poppins 0,775, na região dos textos) e Inter 600 (rótulos), OFL, já no kit (`fontes/OFL-smooth.txt`); padrão do estilo segue Inter Tight, a réplica troca por `aparencia.texto.fonte`. A referência usa uma grotesca de sistema mais larga no "%" e nos zeros; a largura medida de cada texto vira o espaçamento para a caixa ficar igual (ver `AVISOS-TERCEIROS.md`).

## O que não copiar
Nada de terceiros: o vídeo é do próprio estúdio. Os números do roteiro da réplica são os do vídeo original e precisam de 2 fontes antes de qualquer post (`projetos/pleno-replica/fontes.md`).




