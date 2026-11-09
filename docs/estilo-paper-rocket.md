

# Estilo paper-rocket (Paper Rocket: desenho animado de feltro, vivo)

Porte de 04/11/2026 a partir de um filme feito em código (SVG + linha do tempo) e de um quadro dele (análise fora do kit). Daqui vem só a técnica: nenhum código, nome, frase, roteiro, música ou fecho do material de origem. Tudo é desenhado pelo estúdio, em canvas, como função do tempo.

É um dos três estilos da família **feltro e papel**, que dividem uma base no motor ("cartoon-feltro"): este (feltro vivo de dia, céu, espaço), o `lighthouse-mouse` (diorama de feltro quente de noite) e o `moon-path` (papel recortado em camadas de noite). A base está descrita aqui; os guias dos outros dois apontam para cá.

Para quem: histórias curtas e curiosidades contadas como fábula, com energia. Um bicho de feltro que quer algo, tenta, tem um problema pequeno, recebe ajuda e chega lá (o céu, o espaço, a lua).

## Regras do estilo (medidas no kit; valem acima das regras gerais de layout)

| Regra | Medida no kit | No estúdio |
|---|---|---|
| Feltro | borda irregular, fibra com relevo, sombra curta (0/6/5 a 32%) | contorno cortado à mão (1,8%), volume com luz no alto à esquerda, borda escurecida, fibra gerada por camada, sombra 0/5/7 (`cartoon-feltro-material.js`) |
| Costura | tracejado 11/9, 4 px, creme a 90%, 10% para dentro | tracejado 10/8, 3,4 px, creme `#FFF3DC`, a 5 a 14 px da borda |
| Olho | miçanga escura com brilho | `micanga` |
| Câmera | empurrão de 6 a 10% por cena; tremor de 14 a 22 px (1920) nos momentos grandes | empurrão até 5%/s (energia 1); o tremor do kit (passos aleatórios) virou um solavanco macio de até 9 px que decai em 1,1 s (regra do estúdio: câmera sem pico brusco; velocidade até 640 px/s e aceleração até 1.600 px/s², conferidas pelo verificador); no mesmo cenário depois de um corte a câmera continua de onde estava |
| Ritmo | uma cena a cada 1,5 a 3 s | uma cena por frase; ficha pede beats de 1,5 a 3,5 s |
| Palavras | pipocam na hora dita: 0,32 s, sobem 26 px, escala 0,7 a 1, giro até 6 graus | igual, numa linha só (até 22 caracteres, 900 px), centro em y 420, Fraunces SemiBold 76 px; a linha visível fica sempre centrada no eixo (cada palavra entra no lugar e a linha se recentra em 0,3 s enquanto cresce) |
| Cor das palavras | tinta escura com brilho branco no céu claro; creme com sombra no céu escuro | igual, pelo campo `texto` do cenário; nunca placa atrás |
| Destaque | cor própria por palavra | a cor da marca (palavra-chave, número, letras do fecho, capa) |
| Transição | painel de papel com borda em meias-luas (0,2 s entra, 0,24 s sai), íris | família de papel, 0,3 a 0,8 s, sem clarão: `scallop` (painel recortado), `dobra` (a página dobra e mostra a cena nova), `fios` (a cena sobe puxada por fios, borda recortada), `acompanha` (a câmera corre de lado até o cenário seguinte), `match` (match-cut: a cena nova abre de dentro da lua, do sol ou da lâmpada), `iris`, `fusao`, `escurece`; o rodízio de cada estilo nunca repete a mesma em trocas seguidas; corte quando a cena continua no mesmo lugar |
| Som | marimba a 120 bpm | trilha ElevenLabs Music no clima `brincadeira` (marimba); efeitos boing, papel, pop, baque. Brilhos com medida (revisão do estúdio de 05/11): caixinha e cintilar no máximo 1 a cada 6 s, nunca o mesmo som seguido (o banco reveza notas e o cintilar), 28 dB ou menos; a mixagem põe um teto momentâneo de 12 LU abaixo da voz em toda janela de 0,4 s (`tetoMomentaneo`, `TETO_SFX_MOMENTANEO` em video.mjs) e o QA de áudio reprova efeito a menos de 10 LU da voz |

## Formas (`{ "tipo": "paper-rocket", "forma": ... }`)

| Forma | Cena | A ação (na `chave`) |
|---|---|---|
| `cena` | o cenário, o herói e os amigos (`personagens`), com o que ele `segura` | o gesto (`acao`) do herói; os amigos chegam um a um com `chegam: true` (cada um com uma luzinha, `luzes`) |
| `objeto` | o objeto protagonista grande (`objeto`, escala 1,5; lâmpada, farol e árvore 1,25) e o herói ao lado; o par fica centrado no eixo | `acaoObjeto`: `decola` (foguete), `acende` e `apaga` (lâmpada, vela, lanterna), `racha` (ovo), `empilha` (caixas), `pisca` |
| `numero` | a contagem de feltro sobre a cor da marca, com raios (`texto`: "3 2 1" ou um número de até 4 caracteres) | cada número cai na palavra dita, com tremor |
| `pensamento` | o herói no eixo, embaixo, e o balão de feltro com o `objeto` sonhado dentro, centrado acima da cabeça | o balão infla e o objeto aparece |
| `foto` | só quando a foto real for pedida (`"fotoReal": true` no elemento `imagem`): a foto num porta-retrato de feltro pendurado por fios (duas do mesmo tamanho). Sem o pedido, a pessoa citada pelo nome vira o boneco `pessoa` de feltro ao lado do herói (regra do estúdio, 04/11) | |
| `cta` | um varal de linha atravessa o quadro em y 600 (abaixo do @) e as letras de feltro da palavra do CTA descem dele presas por fios, nos tons da marca; o herói acena embaixo; tudo no eixo; 1,6 s de respiro depois da última palavra | as letras caem uma a uma na palavra dita |

Campos: `enquadramento` (`geral`, `medio`, `close`: o tamanho do plano; no `cena` com o herói sozinho a câmera chega perto ancorada nos pés, num dolly em que o céu quase não cresce; no `objeto`, `close` é o objeto sozinho e maior, e no voo é o close da vigia com o herói pilotando), `personagens` (lista de bichos; o primeiro é o herói), `acao` (gesto: `acena`, `pula`, `comemora`, `anda`, `olha`, `triste`, `dorme`, `segura`, `aponta`, `abraca`, `voa`, `nada`, `acende`, `parado`), `acaoAmigos`, `chegam`, `luzes`, `segura`, `objeto`, `acaoObjeto`, `chave` (palavra dita da ação), `acaoEm` (segundos depois do início, no lugar da chave), `texto`, `palavra` (fecho), `transicao` (`corte`, `fusao`, `scallop`, `iris`, `escurece`). No beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`.

## Bichos (personagens de feltro como dados)

De fábrica (11): `ratinho` (boné e capa amarelos), `raposa` (óculos de aviador), `coelho` (lenço), `urso` (cachecol), `gato`, `tartaruga` (casco com hexágonos costurados), `caranguejo` (olhos na haste), `gaivota`, `coruja`, `vaga-lume` (luz que pisca) e `pessoa` (o boneco de feltro da pessoa citada pelo nome: cabelo, rosto e roupa de feltro). Todos respiram, piscam, balançam a cauda e fazem o gesto da cena; o `lighthouse-mouse` anima os bichos a 12 qps.

### Como criar um bicho (3 passos)

1. No `pecas.js` do projeto: `export const personagensEstilo = { 'cartoon-feltro': { ourico: { nome: 'Ouriço', temas: ['ourico'], plano: 'bipede', cor: '#8A6A4E', barriga: '#F2DEC4', orelhas: { tipo: 'pequena', miolo: '#E89A9A' }, focinho: { tipo: 'curto', nariz: '#2A1D24' }, cauda: { tipo: 'nenhuma' }, acessorios: [{ tipo: 'cachecol', cor: '#C8463C' }] } } }` (`'cartoon-feltro'` vale nos três estilos; use o id do estilo para valer só nele).
2. Vocabulário: `plano` `bipede`, `tartaruga`, `caranguejo`, `passaro`, `coruja`, `vagalume`; orelhas `redonda`, `pontuda`, `longa`, `pequena`, `nenhuma`; focinho `rato`, `raposa`, `coelho`, `curto`, `gato`; cauda `fio`, `fofa`, `pompom`, `nenhuma`; acessórios `bone`, `oculos`, `cachecol`, `capa`, `lenco`, `chapeu`. Cor do feltro em `#rrggbb`.
3. Use no beat (`"personagens": ["ourico"]`) ou deixe os `temas` levarem o plano automático até ele. O validador e o QA recusam o que sair do vocabulário. Para valer em todo projeto: acrescente em `PERSONAGENS_CF` de `src/video/engine/cartoon-feltro-personagens.js` (repositório do mantenedor).

## Cenários e câmeras

14 cenários declarativos, válidos nos três estilos (o material e a luz mudam pelo estilo); a família do paper-rocket vem primeiro no plano automático:

| Cenário | O que tem | Texto | Câmera padrão |
|---|---|---|---|
| `quintal` (principal) | céu azul, sol de feltro, nuvens, cerca, colinas, flores, grama | escuro | `empurra` |
| `oficina` | tarde laranja e piso de tábuas | escuro | `empurra` |
| `ceu-nuvens` | nuvens que passam e um bando de pássaros (sem chão) | claro | `sobe` |
| `espaco` | céu roxo com estrelas, o planeta de feltro com anel e a Terra (sem chão) | claro | `deriva` |
| `lua-pouso` | solo da lua com crateras e a Terra no céu | claro | `tremor` |
| `colinas-tarde` | colinas ao entardecer, sol e árvore | escuro | `paralaxe` |
| outros (dos estilos irmãos) | `sala-farol`, `farol-mar`, `quarto-noite`, `tempestade`, `praia-lua`, `cais-noite`, `mar-aberto`, `floresta-noite` | | |

Câmeras: `empurra` (aproxima devagar: o padrão do kit), `recua`, `deriva` (de lado, em paralaxe), `paralaxe` (travelling curto: o fundo anda menos que a frente), `balanco` (balanço ambiente em seno), `tremor` (empurrão e tremor no momento grande), `sobe`, `desce`, `fixa`. O diorama anda em 4 camadas (fundo 0,3, meio 0,72, bichos 1, primeiro plano 1,42). A câmera acompanha os bichos: eles ficam no eixo e o deslizamento lateral vira paralaxe relativa (o fundo anda para um lado, o primeiro plano para o outro); o bicho que anda fica no lugar e o cenário passa por ele. Toda câmera tem empurrão lento (pelo menos 2,2%/s), deriva e o respiro de câmera na mão (16 px), e chega um pouco mais perto no gesto (até 2,5%).

### Como criar um cenário (4 passos)

1. Copie `src/video/engine/cartoon-feltro-cenarios/quintal.js` (ou declare no `pecas.js` do projeto: `export const cenariosEstilo = { 'paper-rocket': { 'fazenda': { ... } } }`).
2. Troque os dados: `nome`, `temas` (palavras que a fala usa), `ambiente.fundo` (3 cores de cima para baixo) e `ambiente.tipo` (`ceu` ou `sala`), `luz.tipo` (`dia`, `noite`, `lua`, `lampada`, `tarde`), `chao` (`{ y: 1300 a 1600 }` ou `null` para quem flutua ou nada), `texto` (`claro` sobre céu escuro, `escuro` sobre céu claro), `painel` (cor do papel da transição), `clima`, `camera` e `props` (`estrelas`, `estrelas-fio`, `lua`, `sol`, `nuvem`, `colinas`, `ondas`, `caminho-lua`, `cais`, `lampioes`, `farol`, `lampada`, `janela`, `piso-madeira`, `planeta`, `terra`, `solo-lunar`, `foguete`, `arvore`, `flores`, `cerca`, `grama`, `dunas`, `barco`, `pedras`, `caixas`, `vela`, `lanterna`, `ovo`, `coracao`, `estrela-grande`, `chuva`, `cama`, `vagalumes`, `passaros`, com `camada` `fundo`, `meio` ou `frente`).
3. Registre (repositório do mantenedor): uma linha de import e o nome em `CENARIOS_CF` de `cartoon-feltro-cenarios/index.js`; para a família de um estilo, em `FAMILIA_CF`. O do projeto já vale sem registro.
4. Rode `node --test test/estilo-cartoon-feltro.test.mjs` (valida todo cenário registrado contra o contrato) e o QA.

## Plano automático

`src/video/autoplano-cartoon-feltro.mjs`: o herói é o primeiro bicho citado no roteiro (sem bicho, a raposa); o cenário vem dos temas da frase, primeiro na família do estilo, e continua no mesmo lugar enquanto a fala não pede outro; "Três, dois, um" vira a contagem; "sonhava", "pensava", "imaginava" viram o balão; objeto com ação vira o objeto protagonista ("o foguete subiu": decola) ou age no cenário (a lâmpada da sala do farol que apaga); "os amigos chegaram" traz os amigos um a um com uma luzinha; o verbo escolhe o gesto; o último beat é o fecho com as letras de feltro. Câmera vizinha nunca se repete; transição no rodízio da variante e corte quando a cena continua no mesmo lugar.

Mini-storyboard (revisão do estúdio de 05/11, `storyboardCF`): cada beat tem fala, palavra-chave, ação, objeto e o que ele faz, cenário, enquadramento, câmera e transição. Regras: nenhum beat parado (sem verbo, a pergunta olha, a exclamação comemora e um rodízio de gestos nunca repete o anterior); o tamanho do plano vem da ação (emoção no close, gesto no médio, movimento no geral) e não repete no mesmo lugar; o mesmo objeto em beats seguidos alterna o par (objeto e herói), o close do objeto e o close do herói; a emoção (triste, dorme, comemora) vai no close do herói; o voo alterna o foguete inteiro e o close da vigia; troca de enquadramento no mesmo lugar é corte seco de montagem.

## QA e revisão

- O verificador (`src/video/verificadores/cartoon-feltro-verificar.mjs`, chamado pelo QA) refaz a câmera de cada plano sem render e reprova: bicho que sai do quadro, bicho que sobe até a linha da legenda (a legenda nunca cobre o personagem), bicho com o pé na faixa dos botões do app (abaixo de y 1610), câmera fora da energia do kit (empurrão acima de 5%/s, zoom acima de 14%, tremor acima de 9 px) ou com pico brusco (velocidade acima de 640 px/s ou aceleração acima de 1.600 px/s², inclusive na passagem entre beats do mesmo cenário), cenário, câmera, bicho ou objeto que não existe, e legenda que não cabe numa linha.
- O verificador também mede o movimento de tela de cada plano a cada quadro (grade de pontos em todas as camadas) e reprova plano com mediana abaixo de 8 px/s ou com trecho abaixo de 3 px/s por mais de 1,2 s (o relatório traz a mediana de cada plano).
- Variedade (verificador, revisão do estúdio de 05/11): reprova dois beats seguidos com a mesma cena, o mesmo bicho, a mesma pose e o mesmo enquadramento, e o herói parado num plano de cena de mais de 1,5 s; avisa a transição repetida em trocas seguidas.
- O QA mede a cena (bichos, objeto, balão, porta-retrato) como UM protagonista; a contagem e as letras do fecho como texto do estilo.
- Centralização (QA, com render, em TODOS os quadros dos beats do estilo): o centro horizontal do protagonista e o da linha da legenda ficam a até 24 px do eixo. Regras declaradas: o objeto que é do cenário (o farol do mar) e o bicho pequeno do canto (número, foto) não contam; no número conta o número; no fecho, as letras com o herói; o amigo que ainda entra conta pelo lugar final; durante a transição o protagonista não conta.
- Revisão a 5 qps: cada frase tem cena com o bicho e a ação na palavra dita? As palavras pipocam na hora em que são ditas, numa linha, acima dos bichos? O feltro tem fibra, costura e sombra (nada chapado)? O painel de papel cobre a troca sem quadro vazio? O destaque está na cor da marca?

## Regras do estúdio que valem nestes estilos (04/11/2026, revisão da Novela)

- **Transição sem clarão branco:** só corte limpo, fusão curta, escurecimento para o azul-noite (nunca preto), íris ou o painel de papel recortado do próprio estilo. O relâmpago da tempestade é azulado e macio.
- **Câmera sem pico brusco:** solavanco macio no lugar do tremor aleatório do kit; a câmera continua de onde estava quando o beat seguinte fica no mesmo cenário (sem salto de reenquadre); o zoom é ancorado nos pés do chão.
- **Legenda em uma linha**, sem elipse nem mancha escura atrás (contraste pela cor e pela sombra do texto), sempre acima dos bichos.
- **Pessoa citada pelo nome:** o boneco `pessoa` de feltro, no padrão do estilo; foto real só se a pessoa pedir.
- **Pés acima da faixa dos botões:** o chão de todo cenário fica em y 1580.

## Revisão da sessão principal (04/11/2026, 5 qps das 3 prévias)

- **Escala e composição:** o protagonista ocupa 40 a 60% da altura útil nos planos de personagem (escala 2,0 sozinho, 1,7 em dupla, 1,4 em trio, com teto de largura por bicho); grupos espelhados no eixo, e o grupo de bichos de tamanhos diferentes desliza até a caixa dele ficar no eixo. Cenários centrados (lua, sol, planeta e Terra no eixo, ou o lado oposto equilibrado, como a lua à esquerda e o farol à direita) e cheios: ondas costuradas em 6 a 10 fileiras cobrindo a metade de baixo com o caminho de luz da lua, o cais ao longe, colinas, árvores e caixas nas laterais (as caixas da oficina e da sala são `enfeite`: compõem o quadro e não viram o objeto da história).
- **Câmera viva:** ver a nota das câmeras acima; o verificador reprova plano parado.
- **Legenda:** a linha inteira centrada no eixo enquanto cresce, sempre na mesma altura.
- **Fecho:** centrado na área segura, nada sobre o @ (o varal fica abaixo dele, as estrelas penduradas ficam fora da faixa do nome) nem na faixa dos botões; pedido de compartilhar antes do CTA padrão; letras em sequência; 1,6 s de respiro no fim.

## Fonte e o que não copiar

Fraunces (SemiBold, SemiBold Italic e Black; OFL, `fontes/fraunces-*.ttf`, licença em `fontes/OFL-fraunces.txt` e `AVISOS-TERCEIROS.md`). Não entram: o código do kit, os nomes e as frases dos filmes de origem, o fecho com promessa da conta de origem, a música e qualquer logo.




