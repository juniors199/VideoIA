

# Estilo mindset2 (Mindset 2: traço de luz sobre carvão)

> **Cor (0.6.29):** o traço, o núcleo de luz, o botão e os brilhos (antes dourado `#D9C46E` e amarelo `#F7D21A`) são a cor da marca da página. A franja turquesa e cobre do traço e o carvão do fundo são a identidade do estilo e não mudam. Onde este guia diz "dourado" ou "amarelo", leia "cor da marca". Auditoria em `docs/cor-da-marca.md`.

Porte de 31/10/2026 a partir de 17 vídeos de referência analisados quadro a quadro (análise completa fora do kit). Daqui vem só o padrão transferível: nenhum desenho, frase, marca, música ou fonte de terceiros. Os glifos foram desenhados no estúdio (`src/video/engine/estilo-mindset2-glifos.js`).

Para quem: mentalidade, hábitos, emoções, relações e autoconhecimento, em lista ("três sinais de...") ou explicação do que acontece por dentro. Funciona em qualquer tema com uma ideia que dá para desenhar em traço por frase.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout dos Reels)

| Regra | Medida na referência | No estúdio |
|---|---|---|
| Sem corte seco | 0 cortes em 17 vídeos (detecção de cena 0,30) | o glifo novo entra 120 px da direita e se desenha em 0,9 s; o anterior desliza 220 px para a esquerda e apaga em curva quadrática, com o rótulo dele sumindo no primeiro terço (janela de -0,25 a +0,45 s em volta do início do beat, curva IO) |
| Câmera | empurrão lento contínuo e flutuação, nunca chicote | 1,00 a 1,08 de escala ao longo do beat, flutuação de 6 px, mira e pensamento que giram devagar; `camera` da cena não vale |
| Fundo | carvão `#0E1012` (mediana dos quadros 01, 04 e 07), grão de 2 a 3 tons de desvio; família "palco" com `#211D2E` e cone de luz do alto | carvão, grão animado a 12 qps, poeira que sobe, vinheta 0,62 e cone de luz do alto nas formas de pessoa (`luz`) |
| Traço | dourado claro `#D9C46E` (pico de cor `#C8C46A` a `#D0D080`), 2 a 3,4 px, brilho em pontos de retícula, franja turquesa/cobre | traço nítido com franja cromática de 1,6 px, halo suave e brilho mascarado por retícula de 7 px |
| Acento | amarelo `#F7D21A` (pico `#F0D000` na palavra acesa) | núcleo de luz que pulsa na palavra-chave e a palavra-chave da legenda |
| Cores de apoio | turquesa `#5FD0C0`, cobre `#C98A4B` | segunda pessoa, anel interno, hachura do sentir |
| Protagonista | um glifo centrado, 35 a 60% da altura útil, com o ar escuro em volta | caixa de ~700 px de altura centrada em y 830 (55 a 60% da altura útil), nunca mais de um glifo por ideia |
| HUD | rótulo em mono espaçado e sublinhado ("01 UPLIFT"), pontos de progresso no alto | "02 · TEMPO" em **Space Mono Bold** (`IluSpaceMono`, OFL) 54 px com sublinhado de 3 px e halo de retícula nas letras, 70 px acima do glifo, digitado letra a letra; pontos de progresso em y 268 |
| Legenda | Poppins Regular branco frio (`#EEF3F2`), chave em Poppins Bold amarela, sombra escura deslocada (1,5 px), 2 linhas, centro em ~75% da altura; palavras futuras apagadas, ditas em branco | MotPoppins **400** (chave **700**) 62 px em **uma** linha, sombra (2, 3, desfoque 2, 70%), entrada com desfoque de 5 px e subida de 8 px em 0,16 s (regra da casa), centro em y 1420, até 24 caracteres, frase longa dividida em partes equilibradas (nunca uma palavra sozinha no fim), troca de frase sem quadro vazio; mesma lógica de apagada, dita e chave |
| Gancho | o primeiro glifo já inteiro no quadro 0, a frase do gancho na legenda | igual: o quadro 0 é a cena |
| Item da lista | número dito ("one", "two") vira o rótulo e o ponto de progresso | "Um:", "Dois:" no roteiro viram `n` e o rótulo "01 · ..." |
| Fecho | botão em pílula de contorno com o pedido de comentário, e o vídeo volta ao começo | constelação dos glifos ligada à pessoa no centro e pílula dourada "COMENTE ILUSTRANDO" |
| Áudio | voz + cama musical contínua a -14 LUFS integrados, LRA 0,9 a 4,2 LU (música calma, sem efeitos marcados) | trilha `inspirador`/`ambiente`; efeitos discretos (brilho, sopro, tique, clique) de -16 a -24 dB, numa sala grande |

## Rodada 2: detalhes finos (31/10)

Medidos pixel a pixel nas referências e aplicados como parâmetros (`REGRAS_MINDSET2`, `COR_M2`, `FINO_M2`): retícula de 6,5 px (ponto de 0,26 do passo) no halo dos traços, dentro das formas fechadas e atrás das letras do HUD; halo de 9 vezes o traço; hachura do sentir alternando cobre `#A57E55` e azul-petróleo `#3E8090` a cada 9 px; franja cromática de 1,6 px; núcleo que pulsa a 0,8 Hz e halo que respira junto; grão em manchas de 4,5 px que ferve devagar (ciclo de 2,2 s, nunca pisca); vinheta leve (0,26); poeira com deriva diagonal e partículas fora de foco; cone que balança 1,5 grau; cometa (ponto de luz com cauda) que traz cada desenho novo; pontos de progresso brancos com halo a cada 25 px; botão escuro com contorno dourado de 3 px, halo e texto branco em Poppins 700; respiração do desenho, deriva lenta e fagulhas a cada 1,3 s (nada parado).

## Rodada 3: cenários (ambientes) e câmeras

O estilo é 2D de traço de luz: o "cenário" é o AMBIENTE de fundo. No cena.json, por beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`. Sem pedido, o plano automático escolhe pelo assunto (temas de cada cenário), mantém o ambiente do vídeo e troca só quando a frase pede.

| Cenário | Ambiente | Câmera padrão |
|---|---|---|
| `carvao` | diagrama sobre carvão, sem chão | `empurra` |
| `palco` | cone de luz do alto, fundo azul-arroxeado, brilho no chão, névoa | `empurra` |
| `palco-disco` | disco dourado com órbitas que giram, cone | `orbita` |
| `cosmos` | céu marinho, faixa da via láctea, estrelas, riscos de luz | `recua` |
| `horizonte` | lua, árvores em traço, ondas, grade de perspectiva | `desce` |
| `interior` | parede com janela, luminária, mesa | `travelling` |

Câmeras: `empurra` (1,00 a 1,08), `recua` (de 1,14 a 1,00 em 1,6 s), `desce` (pedestal do céu ao chão em 1,2 s, fundo em paralaxe 2,2x), `travelling` (lateral, 3,2 s, fundo 1,2x), `orbita` (a elipse do chão abre e fecha, 9 s por volta), `aproxima` (punch-in de 11% na palavra-chave, 0,5 s), `fixa` (só deriva). O desenho nunca sai da área segura: quem anda mais é o fundo.

### Como criar um cenário novo (4 passos)

1. **Escreva o módulo, só com dados.** No projeto, em `projetos/<nome>/pecas.js`:
   ```js
   export const cenariosEstilo = { mindset2: {
     oceano: { nome: 'Oceano', temas: ['mar', 'onda', 'praia'], ambiente: { fundo: ['#0B1A24', '#0E1012'] },
       luz: { tipo: 'halo', cor: '#4FB3A2', alfa: 0.1 }, nevoa: { cor: '#2C3B3F', alfa: 0.15, altura: 0.25 },
       particulas: { poeira: 1, estrelas: 0.5 }, props: [{ tipo: 'ondas', y: 1200 }, { tipo: 'lua', x: 300, y: 420, r: 60 }],
       clima: 'calmo', camera: 'travelling' },
   } };
   ```
   Para ele valer em todo projeto, ponha o mesmo objeto em `CENARIOS_M2` de `src/video/engine/estilo-mindset2-cenarios.js` (repositório do mantenedor).
2. **Use só o vocabulário do estilo:** luz `nenhuma`, `cone`, `faixa`, `halo`; props `chao-brilho`, `disco`, `estrelas`, `faixa-luz`, `lua`, `arvores`, `ondas`, `grade-chao`, `parede`, `mesa`, `luminaria`, `telao`; câmera um dos nomes acima; fundo de 1 a 3 cores `#rrggbb`. Prop novo é uma função nova em `desenharProps` (traço fino, 30 a 55% de opacidade, nada abaixo de y 1330).
3. **Peça no cena.json** (`"cenario": "oceano"`) ou deixe os `temas` levarem o plano automático até ele.
4. **Rode o teste e o QA:** `node --test test/cenarios-estilo.test.mjs` valida TODO cenário registrado contra o contrato; o validador da cena recusa id ou prop que não existe; o QA reprova câmera que leva o desenho para fora da área ou dá tranco.

Outro estilo com cenários (mindset, fatos): registre os seus com `registrarCenarios('<estilo>', {...}, { luzes, props })` e `registrarCameras(...)` de `src/video/engine/cenarios-estilo.js` e acrescente uma linha de import em `cenarios-estilo-todos.js`; o resto (cena.json, plano, validação, pecas.js, teste) já funciona.

## Formas (`{ "tipo": "mindset2", "forma": ... }`)

`figura` (pessoa em contorno com o ponto de luz no peito; a hachura acende na chave), `dupla` (duas pessoas ligadas por um laço com a fagulha que viaja), `onda` (corpo com a linha do sentir atravessando o peito), `orbita` (círculo de marcações com o ponto que orbita), `constelacao` (pessoa de estrelas que se liga ponto a ponto), `escada` (a pessoa sobe na chave), `porta` (abre e a luz sai pela fresta), `coracao` (pulsa), `cerebro` (cabeça de perfil com o pensamento enrolado), `sol` (raios que giram), `lua` (crateras e maré), `semente` (brota na chave), `relogio` (os ponteiros correm até a chave e depois andam devagar), `alvo` (a flecha chega na chave), `numero` (numeral serifado com raios; `texto` até 3 algarismos), `foto` (pessoa citada pelo nome: a foto real num medalhão com anel de marcações; duas fotos ficam do mesmo tamanho e tratamento; o plano automático usa sempre que o beat tem foto) e `cta` (fecho).

Campos: `chave` (palavra dita em que o glifo age e que acende na legenda), `rotulo` (até 16 letras, palavra da fala), `n` (número do item dito), `continua: true` (o beat é o resto da frase do item anterior: o glifo fica, sem troca, e age de novo na palavra dele), `luz` (cone do alto; padrão nas formas de pessoa), `acao` (segundos depois do início do beat, no lugar da `chave`), `texto` (numeral ou texto do botão do fecho).

## Plano automático

`src/video/autoplano-mindset2.mjs` escolhe a forma pelo sentido da fala (coração, mente, tempo, crescer, subir, porta, foco, luz, noite, sentir, relação, ciclo), nunca repete a forma do beat anterior, numera os itens ditos ("Um:", "Dois:") e põe o fecho no último beat. O resto de uma frase de item cortada na vírgula vira `continua`.

## QA e revisão

- O QA trata o estilo como estilo de leitura (`qa.mjs`, lista MARCA): texto na área segura, protagonista medido (a caixa do glifo, só quando ele está com 50% ou mais de presença e 35% desenhado), legenda abaixo do glifo, nunca mais de 0,5 s sem protagonista.
- Metas do estilo em `qa-verificadores.mjs`: tela assentada até 70% e parado até 92% (traço fino com empurrão lento muda pouca área por quadro).
- Revisão a 5 qps: o glifo se desenha sem quadro vazio na troca? A palavra-chave acende junto com a ação do glifo? A legenda nunca quebra em 2 linhas? O rótulo nunca encosta no glifo? Nada abaixo de y 1650, nenhuma linha clara na borda, o fundo não pisca (o grão é fino e a poeira é lenta)?

## O que não copiar

Marca, nome do perfil, frases e roteiros, ilustrações específicas, vídeo, música e fonte dos vídeos de referência. A legenda de 2 linhas da referência não entra (a casa usa 1 linha). A legenda e o botão são a Poppins do estúdio (a mesma família da referência, OFL), o HUD é a Space Mono Bold (`fontes/space-mono-bold.ttf`, OFL, Copyright 2016 Google Inc., registrada em `AVISOS-TERCEIROS.md` e `fontes/OFL-space-mono.txt`) e o numeral é a Playfair Display 900 (OFL).




