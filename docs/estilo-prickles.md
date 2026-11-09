

# Estilo prickles (livro de outono: lápis e aquarela)

> **Cor:** a palavra-chave da legenda, o número da placa, a fita do fecho e a estrela do susto leem a cor de destaque da página (`marca/tokens.json`, personalizável), em tons derivados (`tonsDaMarca`). A paleta dos cenários (ferrugem, mostarda, sálvia, creme, a luz dourada) é do estilo. Auditoria em `docs/cor-da-marca.md`.

Porte de 04/11/2026 a partir de uma prancha de referência (quadro de um filme infantil feito em código) e de um kit de desenho animado em código com 5 roteiros de exemplo. Análise detalhe por detalhe feita fora do kit. Daqui vem só a técnica e a aparência: nenhum desenho, frase, personagem, música ou código de terceiros. Os bichos, as folhas, as árvores e o papel são desenhados por código no estúdio (`src/video/engine/estilo-prickles*.js`, base comum `cartoon-ilustracao.js`).

Não confundir com o `little-light` (o fundo do mar que brilha, mesma família e mesma legenda): aqui é dia de outono, em lápis colorido e aquarela sobre papel creme.

Para quem: curiosidades de bichos e da natureza contadas como fábula gentil, histórias de amizade, de cuidado e de coragem; uma verdade dentro de uma história curta.

## Regras do estilo (medidas na referência; valem acima das regras gerais de layout dos Reels)

| Regra | Observação na referência | No estúdio |
|---|---|---|
| Técnica | lápis colorido e aquarela sobre papel creme: contorno de lápis marrom, pelos riscados, manchas de pigmento com borda mais escura e granulação | `lapis` (duas passadas com tremor semeado), `pelos` (traços curtos para fora do contorno), `aquarela` (volume, segunda demão deslocada, borda de pigmento e granulação só dentro da mancha) |
| Personagens | bichos de livro: coelho de lenço verde, ouriço de cachecol vermelho, texugo de suéter mostarda, esquilo de cauda grande; olhos de arco fechados, bochechas rosadas, focinho claro | construtor por dados (`estilo-prickles-bichos.js`): `ourico`, `ourico-filhote` (espinhos brancos e moles), `coelho`, `texugo`, `esquilo`; contraluz dourado na borda de cima |
| Expressão | cada rosto muda uma vez e fica (o kit) | `expressao` antes da palavra-chave e `expressaoDepois` (`feliz`, `aberto`, `surpreso`, `triste`, `dormindo`); olho aberto pisca a cada 2,8 a 4,6 s |
| Vida | só quem age mexe; toda cena tem uma ação na palavra dela | respiração (1,2% em 3,2 s), cabeça que balança, gesto que muda em 0,35 s na `chave` (`aceno`, `abraco`, `bracos-abertos`, `carrega`, `aponta`, `comemora`, `pula`, `encolhe`); no abraço o grupo se inclina para o meio |
| Luz | dourada atrás das árvores, raios entre os troncos, entardecer com vaga-lumes no fim | sol no fundo, raios em "screen" que respiram, bokeh dourado, manchas de sol no chão; `entardecer` em roxo e laranja com vaga-lumes |
| Profundidade | troncos de trás desfocados, folhas na frente desfocadas | 4 camadas pintadas uma vez: fundo (desfoque de 7 px, paralaxe 0,28), meio (1,6 px, 0,6), chão (0,85), bichos (1) e frente (3,2 px, 1,35) |
| Partículas | folhas de bordo no ar | folhas que caem girando (7 a 11 s por travessia), poeira dourada e vaga-lumes no brilho com teto |
| Papel | creme com fibra | overlay de papel de aquarela (fibras, manchas, relevo) em multiply a 0,6 e vinheta quente de 0,3 |
| Palavras na tela | as palavras da narração pipocam quando ditas, no alto da cena, sobre o céu | uma linha (até 22 caracteres) em Fraunces 600 72 px, centro em y 420; cada palavra entra 0,05 s antes de ser dita em 0,32 s: escala 0,7 até 1 com sobra, sobe 26 px, gira até 6 graus; a chave em Fraunces 900 na cor da marca; sem caixa nem mancha atrás (contraste com o céu de 4,5:1 conferido, contorno claro e sombra leve) |
| Câmera | push lento em toda cena, tremor no susto | câmeras nomeadas (abaixo); trava da área segura por plano |
| Ritmo | história calma: 3 a 6 s por cena | um beat por frase; o QA avisa plano de mais de 7,5 s |
| Transições | painéis de papel e cortes suaves | `fusao` (0,55 s) e `folhas` (fusão com uma revoada de folhas cruzando o corte) |
| Áudio | piano de feltro, glockenspiel e pizzicato; um "boing" no susto, farfalhar de folhas, sininho | trilha ElevenLabs Music no clima `leve`/`inspirador`; efeitos do banco a -20 a -28 dB: farfalhar (`papel`), `pop` do susto, `shimmer` no abraço, `ding` do número, `click` do fecho |

## Formas (`{ "tipo": "prickles", "forma": ... }`)

| Forma | Cena | A ação (na `chave`) |
|---|---|---|
| `cena` | 1 a 4 bichos na prancha (`personagens`) | o gesto do herói (`gesto`, padrão `aceno`) e a expressão que muda |
| `abraco` | os bichos juntos, inclinados para o meio, corações que sobem | os braços abrem e abraçam |
| `susto` | o herói e um amigo | a estrela de estouro com a palavra-chave pintada ("AI!") e o tremor de câmera; o herói se encolhe, o amigo recua |
| `bola` | o ouriço (ou o filhote) | se enrola em bola e as folhas caem por cima até sobrar o focinho |
| `numero` | placa de madeira fincada no chão com o número (`texto`, até 6 caracteres) na cor da marca; o herói aponta | a placa sobe com sobra |
| `cta` | placa pendurada com "comente" e a palavra numa fita da cor da marca; os amigos acenam | |

Campos: `personagens` (lista de ids ou `{ id, x, escala, gesto, gestoAntes, expressao, expressaoDepois, vira }`), `gesto`, `gestoAntes`, `expressao`, `chave` (a palavra dita em que a ação acontece), `acao` (segundos depois do começo do beat, no lugar da chave), `texto` (número da placa; palavra do fecho), `transicao` (`fusao`, `folhas`, `corte`), `continua: true` (o beat segue o mesmo cenário sem troca).

## Cenários e câmeras

No beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`. Sem pedido, o plano automático escolhe o cenário pelo assunto da frase (com memória: só troca quando a frase pede outro lugar) e a câmera pela forma, sem repetir a vizinha.

| Cenário | O que tem | Texto | Câmera padrão |
|---|---|---|---|
| `clareira-dourada` | a prancha de referência: luz dourada atrás das árvores, troncos desfocados, raios, arbustos, chão e pilha de folhas | escuro | `push` |
| `toca-raiz` | a portinha redonda nas raízes com janela acesa, o tronco com musgo, cogumelos | escuro | `deriva` |
| `ninho-folhas` | o ninho de folhas secas de perto (nascer, dormir, aconchego) | escuro | `push` |
| `trilha-folhas` | trilha da manhã entre montes de folhas | escuro | `paralaxe` |
| `entardecer` | céu roxo e laranja, vaga-lumes | claro | `recua` |

Câmeras: `push` (1,00 a 1,09 no plano), `deriva` (arco de 90 px de lado e 16 px de altura, devagar), `paralaxe` (arco de 150 px para cada lado; os personagens ficam no eixo, o fundo (0,18) e a frente (1,6) andam em sentidos opostos), `recua` (de 1,12 a 1,00 em 3 s, entrada e saída suaves), `sobe`, `tremor` (push com um balanço macio de 4,5 px a 2,2 Hz que acalma em 0,9 s na palavra-chave) e `fixa`. **Trava da área segura:** se a câmera leva o grupo para fora da área (x 64 a 1016, y até 1610) ou para a faixa da legenda, o plano inteiro anda menos (`travaCI`), nunca freia no meio.

### Como criar um cenário novo (4 passos)
1. **Só dados**, em `projetos/<nome>/pecas.js`:
   ```js
   export const cenariosEstilo = { prickles: {
     lago: { nome: 'Lago de outono', temas: ['lago', 'pato', 'agua'], ambiente: { fundo: ['#F6D79A', '#E8A867', '#B9773F'], ceuLegenda: '#F4D296' },
       luz: { tipo: 'manha', x: 0.5, y: 0.18 }, nevoa: { cor: '#FFF0C8', alfa: 0.2, altura: 0.5 }, particulas: { folhas: 0.8, poeira: 1 },
       props: [{ tipo: 'sol' }, { tipo: 'troncos-longe', n: 8 }, { tipo: 'raios', n: 4 }, { tipo: 'arbustos' }, { tipo: 'chao-folhas' }, { tipo: 'pilha-folhas' }],
       clima: 'calmo', camera: 'deriva', texto: 'escuro' },
   } };
   ```
   Para valer em todo projeto, acrescente o objeto em `CENARIOS_PR` de `src/video/engine/estilo-prickles-cenarios.js` (repositório do mantenedor).
2. **Vocabulário:** luz `dourada`, `manha`, `entardecer`, `noite`; props `troncos-longe`, `arvores`, `arbustos`, `raios`, `sol`, `chao-folhas`, `pilha-folhas`, `tronco-musgo`, `porta-raiz`, `cogumelos`, `ninho`, `lua`, `estrelas`, `trilha`; partículas `folhas`, `poeira`, `vagalumes`; `texto` `escuro` (céu claro) ou `claro` (céu escuro); `ceuLegenda` é a cor do céu atrás da legenda (o QA confere o contraste).
3. **Use** no beat (`"cenario": "lago"`) ou deixe os `temas` levarem o plano automático até ele.
4. **Teste:** `node --test test/estilo-cartoon-ilustracao.test.mjs` valida todo cenário registrado (contrato e contraste); o validador da cena recusa id ou prop que não existe.

### Como criar um bicho novo (3 passos)
1. Em `projetos/<nome>/pecas.js`: `export const personagensEstilo = { prickles: { raposa: { nome: 'Raposa', temas: ['raposa'], pelo: { base: '#D9682A', luz: '#F29A5E', sombra: '#9E4416' }, rosto: '#E58D4B', barriga: '#F6E2C6', focinho: { tipo: 'curto', cor: '#F7E6CF' }, nariz: '#2E1E17', orelhas: { tipo: 'pontuda', tam: 1.1, interior: '#F0B08C' }, cauda: { tipo: 'esquilo' }, espinhos: null, marcas: { tipo: 'nenhuma' }, roupa: { tipo: 'cachecol', cor: '#6E8B4E', listra: '#8FAA6A' }, bochechas: '#F08A7C', corpo: { larg: 170, alt: 190 }, cabeca: { r: 96 }, escala: 0.95 } } };`
2. Vocabulário: `orelhas.tipo` `longa`, `redonda`, `pontuda` (com `tufo`); `cauda.tipo` `nenhuma`, `pompom`, `esquilo`, `curta`; `marcas.tipo` `nenhuma`, `texugo`; `roupa.tipo` `nenhuma`, `cachecol`, `sueter`, `lenco`; `espinhos` `{ cor, ponta, comp, macios }` ou `null`.
3. Use no beat (`"personagens": ["raposa"]`) ou deixe os `temas` levarem o plano automático; `validarBicho` confere o contrato.

## Plano automático

`src/video/autoplano-cartoon-ilustracao.mjs` (`planejarPrickles`): susto ("ai", "espetou", "machucou"; nunca negado: "nenhum deles machuca" não é susto), bola ("enrola", "esconde"), abraço ("abraço", "juntos"), número do roteiro vira a placa, o último beat é o fecho; quem aparece são os bichos que a fala cita (pelos `temas`), senão o herói do vídeo; o gesto sai do verbo (carregar, pular, apontar, chegar); cenário pelo assunto com memória; câmera pela forma sem repetir a vizinha; `folhas` na troca de cenário e `fusao` dentro dele.

## QA e revisão

- `src/video/verificadores/estilo-cartoon-ilustracao-verificar.mjs` (sem render): cenário e câmera registrados; o grupo dos bichos dentro da área e abaixo da legenda em todos os quadros da câmera; sem tranco (28 px num quadro) e sem câmera acima de 260 px/s; contraste da legenda contra o céu do cenário (4,5:1); plano sem bicho; aviso de plano de mais de 7,5 s. Sobre o MP4: reprova brilho estourado (mais de 0,4% de pixels brancos num quadro).
- O QA geral mede o grupo dos bichos (com a placa) como UM protagonista (`prickles:<forma>`), e a legenda numa linha.
- Aviso esperado: "sem nada novo na tela" em planos de 4 a 6 s. É a regra do estilo (história calma com 3 a 6 s por cena); a cena não fica parada (respiração, folhas, raios, câmera).
- Revisão a 5 qps: a cena mostra o que a frase diz e o bicho age na palavra? A legenda fica numa linha no céu, sem cobrir orelha nem cabeça? Nenhum bicho sai da tela ou entra na faixa de baixo? O traço tem lápis e aquarela (nunca chapado)? As folhas da frente não tapam o rosto? O brilho dos vaga-lumes não estoura?

## Regras do estúdio de 04/11/2026 (revisão da Novela) que valem neste estilo
- **Pessoa citada pelo nome** aparece como personagem do estilo (um bicho ou uma criatura do elenco, com o nome na fala), nunca foto; foto real só se o usuário pedir. O plano automático já descarta a busca de foto.
- **Transição sem clarão branco:** só `fusao`, `folhas`, `escuro`, `bolhas` e `corte`; o brilho fica dentro da cena (aditivo, com teto), nunca como flash de troca. O teste trava a lista.
- **Câmera sem pico brusco:** aceleração do grupo dos personagens com teto de 1600 px/s² (`REGRAS_CI.camera.acelMax`), velocidade de 260 px/s e tranco de 28 px por quadro, medidos a 30 qps pelo verificador (`camera-pico`, `camera-rapida`, `camera-tranco`); o tremor do susto é um balanço amortecido, não saltos; o recuo e a descida usam curva de entrada e saída suaves.
- **Legenda** em 1 linha, sem elipse ou mancha escura atrás (contraste do céu ou da água, contorno e sombra leves).

## O que não copiar

Personagens, nomes, roteiros, frases, músicas e qualquer imagem ou código da referência. A fonte é a Fraunces (OFL), registrada em `AVISOS-TERCEIROS.md` e `fontes/OFL-fraunces.txt`.


## Rodada 2 da revisão (04/11/2026, revisão a 5 qps das prévias)

| Pedido | No motor (raiz) |
|---|---|
| Bichos pequenos, cena vazia | o grupo cresce até o topo perto de y 680 (45 a 60% da altura útil), largura até 920 px, sempre centrado (`elencoPR`, `elencoLL`); no little-light a metade de baixo leva rochas, touceiras de alga e nuvem de plâncton em todo cenário, e as águas-vivas brilham desde o começo (`escuro` 0,42) |
| Mascote vetorial liso | volume pintado: sombra própria em aquarela, brilho do lado da luz, hachura de lápis colorido e pelos claros riscados em corpo, cabeça, braços e orelhas; lápis mais macio; folhas com metade sombreada e nervuras; na baleia luz interna e halo; no sino da água-viva brilho de borda translúcido |
| Câmera parada | paralaxe em arco (o plano dos personagens não anda de lado; fundo e frente em sentidos opostos), push e deriva maiores, respiração do zoom (0,8% a cada 5,2 s), balanço vertical de 7 px e um punch-in de 3% na palavra-chave; tudo com entrada e saída suaves dentro dos tetos do verificador (velocidade 260 px/s, aceleração 1600 px/s², tranco 28 px) |
| Legenda torta | a linha visível fica sempre centrada no eixo e recentra em 0,3 s quando entra uma palavra; a palavra nova só aparece quando cabe na área; texto escuro com contorno creme e o @ com contorno |
| Centralização | **verificador de centralização** (`verificarCameraCI` com `descentrado` e `verificarLegendaCentradaCI`): centro do grupo protagonista e da linha da legenda a no máximo 24 px do eixo em todos os quadros; `numero` e `cta` são composições declaradas |
| Fecho | placa centrada na área segura, hierarquia "comente" pequeno e ILUSTRANDO grande, pedido de compartilhar antes, entrada em sequência e respiro final (cauda 1,6 s; 2,0 s na prévia do prickles) |
| Trilha | timbre próprio por estilo (`TRILHA_EXTRA_ESTILO`: caixinha de música e sintetizador suave no little-light); `efeitos.trilha.semExtra` mantém uma trilha já paga |


## Rodada 3 da revisão (05/11/2026): transições e o que aparece reflete o que é dito

Tudo no motor, para os dois estilos (`cartoon-ilustracao.js`, `cartoon-ilustracao-storyboard.js`).

| Pedido | No motor (raiz) |
|---|---|
| Transições "quase só fusões iguais" | família por estilo em `TRANSICOES_CI`, de 0,3 a 0,8 s, todas com entrada e saída suaves e sem clarão (`comporTransicaoCI`): prickles `folhas` (revoada que cobre e revela), `cortina` (folhas que caem de cima), `iris` (círculo com anel de folhas), `desfoque`, `pan` (câmera de lado com paralaxe por camada), `match` (aproxima e a próxima nasce da mesma forma), `whip` (chicote com rastro); little-light `bolhas`, `mergulho` (sobe e borra, a próxima chega de baixo), `cardume` (nuvem de plâncton), `desce` (troca de profundidade), `iris` (anel de luz), `whip`, `escuro`, `desfoque`. O storyboard escolhe pela frase (susto: chicote; o tempo passou: cortina; nascer: íris; amigos: revoada; medo: escuro; descer: mergulho; animais: plâncton; troca de lugar: pan ou bolhas) e nunca repete a do beat anterior. O desfoque leva a mesma imagem nítida por baixo (sem borda clara) |
| A baleia "quase todo tempo da mesma forma"; o ouriço "sem graça" | **mini-storyboard da fala** (`storyboardCI`): cada palavra mapeada vira ação do personagem no instante em que é dita, um prop que entra na hora e o enquadramento do beat. Ações com troca suave de 0,4 s (`acoesNoTempo`); entre duas ações, um gesto miúdo (olhar, passo, inclinar) para ninguém ficar mais de 1,3 s parado (`completarAcoesCI`) |
| Repertório | prickles: gesto, expressão, olhar (cabeça e rosto viram), passo, salto de susto, inclinar, espinhos que crescem, somem sob a pele cheia de líquido e deitam; props `coracao`, `estrelas`, `ninho`, `folhas-caem`, `sol` (o tempo passa), `raposa` (perigo), `carta` (manda pra um amigo). little-light: a baleia sobe, desce, inclina para olhar a luz ou o fundo, vira, encolhe de medo (com tremor), abre a boca, canta (anéis de luz), bate a cauda, nada de costas; as águas-vivas brilham mais e chegam perto dela; props `raios` (a luz do sol que some antes do fundo), `prumo` (a profundidade), `escurece`, `luzinhas`, `submarino` (os cientistas) |
| Enquadramento | `plano`: `aberto`, `medio`, `close`, `detalhe`, nunca o mesmo em dois beats seguidos; lugar pede aberto, emoção pede close. Regra declarada do close: no prickles o corpo sai por baixo e o rosto fica na área (um bicho só); no little-light a cabeça da baleia fica no eixo e o corpo sai pela borda, as águas-vivas vão para os cantos |
| Verificador de variedade | `verificarVariedadeCI` (no QA da cena): reprova o beat que começa igual ao fim do anterior (elenco, pose, expressão, enquadramento) e qualquer trecho de mais de 1,5 s com a mesma pose e composição; o respiro final do fecho não conta |

Na cena: `plano`, `props` (lista de ids ou { id, em }), `transicao` (da família do estilo) e, por personagem, `estado` (o estado inicial do plano, por exemplo { "pele": 1 } para continuar a história do beat anterior).


## Som (revisão do estúdio, 05/11/2026: "um brilho muito alto e repetido")

- No máximo 1 brilho (sparkle, shimmer, ping, ding) a cada 6 s; fica o da ação da forma (a revelação das luzes do little-light vem primeiro), depois o do prop, depois o da transição (`rarearBrilhos` em `src/video/sfx-estilos.mjs`).
- Dois brilhos seguidos nunca usam o mesmo som: o timbre roda entre brilho e sino (dois grupos do banco). Ganho de no máximo -30 dB no evento.
- Mixagem (todos os estilos): nenhum efeito passa de 10,5 LU abaixo da voz numa janela de 0,4 s (`tetoEfeitosJanela` em `mixagem.mjs`); o QA de áudio reprova a menos de 10 LU (o integrado escondia o brilho alto e raro).
- Prévias: prickles de 23 brilhos para 5 (efeito mais alto de 7,9 para 15,2 LU abaixo da voz); little-light de 21 para 4 (de 11,7 para 12,4 LU).


## Legenda sem palavra escondida (regra do estúdio, 05/11/2026)

A linha "o primeiro abraço da Pipa." passava da largura útil e escondia "Pipa.". Na raiz da família (`cartoon-ilustracao.js`): o planejador da legenda estima a largura de cada linha (`larguraLinhaCI`, a palavra-chave em 900 mais larga) e divide a que passa de 900 px em duas linhas lógicas (`dividirLinhaCI`); a tela continua com 1 linha por vez e a linha que cabe não muda. O verificador da legenda (todos os quadros a 30 qps) reprova palavra dita escondida (`legenda-cortada`) e o QA do vídeo reprova o quadro em que a caixa da legenda informa palavra escondida (`escondidas`).




