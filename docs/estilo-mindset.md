

# Estilo mindset (Mindset: bonecos no palco)

> **Cor (0.6.29):** o "dourado" do boneco que age, o brilho, a esfera, a palavra-chave e as peças em ouro (antes `#FFC800`) são a cor da marca da página, legível sobre o grafite. O cinza do outro boneco e o cenário não mudam. Onde este guia diz "dourado" ou "ouro", leia "cor da marca". Auditoria em `docs/cor-da-marca.md`.

Porte de 31/10/2026 a partir de 18 vídeos de referência analisados quadro a quadro (análise completa fora do kit). Daqui vem só o padrão transferível: nenhum desenho, frase, marca, logo, música ou fonte de terceiros. Os bonecos, os adereços e as cenas foram desenhados no estúdio (`src/video/engine/estilo-mindset-bonecos.js`).

**Não confundir com o `mindset2`.** Os dois falam de mentalidade, mas são estilos diferentes: o `mindset2` é traço fino luminoso em retícula sobre carvão, um glifo por ideia e HUD em mono; o `mindset` é **teatro de bonecos**: um palco grafite com chão que reflete, o boneco dourado (quem age) contra o boneco cinza (o outro), etiquetas da comparação em Montserrat e uma cena-metáfora por ideia (escada, alvo, muro, multidão, sol que nasce, barra do ano).

Para quem: hábitos, disciplina e comportamento contados como comparação (procrastinar ou fazer, pensar demais ou agir, perfeição ou ação), com um número de impacto quando houver (quanto do ano passou) e uma frase curta de virada.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout dos Reels)

| Regra | Medida na referência (720 px; no estúdio x 1,5) | No estúdio |
|---|---|---|
| Sem corte seco | 0 cortes nos 18 vídeos (detecção de cena 0,30) | a cena nova surge enquanto a anterior apaga (0,65 s); com a frase de impacto a troca é em sequência, para o texto nunca passar sobre o boneco |
| Palco | parede `#363636` no alto a `#1A1A1A` no pé, faixa de contato `#0F0F0F`, chão `#313131` (mais claro que o pé da parede) a 58% da altura (y 745 de 1280) | horizonte em y 1120, mesmas cores; luz macia do alto |
| Sem chão (vídeos 01, 02 e 18) | foco radial `#333333` no miolo a `#101010` na borda | `zonas`, `circulos` e `frase` usam o foco radial |
| Reflexo | 85 de luminância logo abaixo do pé, 59 a +150 px, some a +250 px | espelho no horizonte a 34%, apagando em 380 px, desfoque de 1,5 px |
| Grão | quase nenhum (desvio de 0,8 a 1,3 tons em área lisa; o gradiente tem degraus de 8 bits) | grão de 1,2 tons que ferve devagar (2,4 s), só para tirar o degrau e dar textura |
| Vinheta | o pé do quadro cai para `#0E0E0E` (luminância 12 a 14 contra 47 a 50 no alto) | vinheta radial de 0,55 |
| Protagonista | boneco de cápsulas (cabeça redonda, tronco e membros arredondados), 12 a 25% da altura nas cenas de comparação e até 45% no close (vídeo 18) | boneco de ~300 px na escala 1 (1,1 a 1,6 nas cenas); a CENA inteira (bonecos e adereços) é o protagonista medido pelo QA, 470 a 700 px de altura |
| Cores do boneco | dourado `#FFC800` (2% mais claros `#F8CE19`), o outro cinza-bege `#978E75` a cinza `#9A9A9A` | ouro `#FFC800` com luz `#FFE58A` e sombra `#B58300`; cinza `#A6A297` com luz e sombra; sombra de contato e luz de recorte (nunca chapado) |
| Etiquetas | duas palavras acima dos bonecos, em Montserrat: a da esquerda branca, a da direita dourada (`#CDC092` a `#FFD21F`); a dourada ACENDE com halo quando a ação acontece (vídeo 03) | Montserrat Regular 46 px, A `#E6E6E6` em x 300, B `#E2C46A` em x 760, as duas em y 560 em todas as comparações (não pulam na troca); a B acende em `#FFD21F` com halo |
| Legenda | Montserrat Regular branca ~30 px (45 px a 1080) em y ~66%; cada palavra entra quando dita, de cinza para branco, subindo e saindo do desfoque; a linha se recentra conforme cresce; 2a linha dourada | Montserrat Regular 56 px em **uma** linha (regra da casa), centro em y 1300 (sobre o chão), até 26 caracteres; palavra entra cinza `#8A8A8A` para branco em 0,2 s, sobe 7 px e sai de 3 px de desfoque; a chave em Montserrat SemiBold `#E2C46A` com brilho; sombra escura (2, 3, 4, 75%) |
| Frase de impacto | Poppins ExtraBold Italic grande, branca, com uma palavra dourada, o "o" trocado pela esfera dourada e um sublinhado dourado (vídeo 01) | `frase`: Poppins ExtraBold Italic 92 px (até 72 px), quebra em 2 linhas equilibradas acima de 760 px, primeiro "o" vira a esfera, sublinhado que cresce; a legenda some nesse beat |
| Número | "2026 is 74.8% complete" sobre a barra do ano, com o boneco correndo (vídeo 06) | `barra` (porcentagem dita, 0 a 100) e `numero` (até 4 caracteres), Montserrat SemiBold dourado que conta junto |
| Câmera | quase parada; quem anda é o boneco | empurrão de 5% por cena; poses em ciclo (andar, respirar, acenar, subir, construir) |
| Áudio | -14,0 a -14,8 LUFS integrados; LRA de 0,2 a 7,9 LU; cama musical contínua, quase sem efeitos | trilha `inspirador`/`leve`; efeitos discretos de -17 a -24 dB |

## Formas (`{ "tipo": "mindset", "forma": ... }`)

| Forma | Cena | A ação (na `chave`) |
|---|---|---|
| `figura` | um boneco dourado no centro | ergue os braços e acende |
| `dupla` | cinza à esquerda, dourado à direita, com as etiquetas | o dourado anda e comemora; o cinza se curva |
| `escada` | o cinza ajoelhado na escada sem degraus; o dourado ao pé da escada completa | o dourado sobe 300 px e acena |
| `alvo` | arqueiro cinza na prateleira (nunca solta) e arqueiro dourado no chão | a flecha voa e o centro do alvo acende |
| `muro` | o cinza sentado no muro baixo; o dourado ao lado do muro dele | o muro sobe tijolo por tijolo |
| `multidao` | fileiras de cinzas andando para o mesmo lado; o dourado parado no meio | o dourado anda na direção contrária e os cinzas apagam |
| `sol` | o dourado curvado | o sol nasce atrás e ele se ergue |
| `jardim` | linha dourada no chão com sementes brancas | as flores douradas brotam uma a uma |
| `zonas` | 4 anéis tangentes embaixo (o de dentro vermelho), com `rotulos` (padrão Conforto, Medo, Aprendizado, Crescimento) | o triângulo sobe de zona em zona e a etiqueta acende |
| `circulos` | dois círculos com os `rotulos` (Poppins ExtraBold Italic) e a esfera no meio | os círculos se cruzam |
| `barra` | a barra no chão e o numeral (`texto`: porcentagem) | a barra enche e o número conta, com o boneco correndo |
| `numero` | numeral grande (`texto`) e o boneco que aponta | o número conta |
| `frase` | a frase de impacto (as palavras do beat) | as palavras entram na fala |
| `foto` | pessoa citada pelo nome: a foto real num quadro em pé no palco, com reflexo (duas fotos do mesmo tamanho) | |
| `cta` | o dourado acena com o botão "COMENTE ILUSTRANDO"; um cinza chega andando e vira dourado | |

Campos: `chave` (palavra dita em que o dourado age e que acende na legenda), `rotulos` (`["Pensar", "Fazer"]`: etiquetas A e B; nas zonas e nos círculos, os nomes), `rotulo` (só a etiqueta dourada), `acao` (segundos depois do início do beat, no lugar da `chave`; 99 = o dourado não age neste beat), `continua: true` (o beat continua a cena do anterior, sem troca, e o dourado age na palavra dele), `texto` (número da barra ou do numeral; texto do botão do fecho).

## Plano automático

`src/video/autoplano-mindset.mjs`: escolhe a cena pelo sentido da fala (subir, mirar, construir, seguir a maioria, crescer, luz, zona de conforto, crítica e elogio, comparação); o primeiro "X ou Y" dito vira as etiquetas de todas as comparações do vídeo; **frases paralelas** ("Quem pensa demais... / Quem faz...") dividem a mesma cena (o dourado espera no primeiro beat e age na palavra do segundo); número com % vira a `barra`, outro número vira o `numero`; frase curta de virada (até 5 palavras) vira a `frase`; pedido de compartilhar vira a `figura`; o último beat é o `cta`. Cenas vizinhas nunca se repetem.

## QA e revisão

- O QA trata o estilo como estilo de leitura (`qa.mjs`, lista MARCA): a cena é o protagonista medido; as etiquetas ficam fora da caixa da cena (acima dela); a legenda abaixo do chão; nenhuma caixa passa de x 960 (botões do Reels).
- Avisos esperados: "protagonista pequeno" (o boneco das referências ocupa 12 a 25% da altura: regra do estilo) e "trechos sem movimento" (medido como o QA, a 48 px: as referências narradas 01 e 18 têm 14 e 7 trechos parados, o maior de 7,7 s; a prova tem mediana de diferença entre quadros maior que a delas).
- Revisão a 5 qps: a cena mostra o que a frase diz e o dourado age na palavra-chave? As etiquetas ficam no mesmo lugar entre comparações? A frase de impacto nunca passa por cima de boneco? Legenda em uma linha, nada abaixo de y 1650, reflexo sem linha clara na borda, nenhum boneco chapado?

## O que não copiar

Logo, marca d'água, nome e @ do perfil, frases e roteiros (inclusive os exemplos em inglês), cenas específicas de 3D (pista de carro, cidade, quarto, chuva com guarda-chuva), música e qualquer arquivo de fonte deles. As fontes do estúdio são de licença livre: Montserrat Regular e SemiBold (`fontes/montserrat-*.ttf`, OFL, Copyright 2011 The Montserrat Project Authors) e Poppins ExtraBold Italic (`fontes/poppins-extrabold-italico.ttf`, OFL, Copyright 2014-2017 Indian Type Foundry), registradas em `AVISOS-TERCEIROS.md` e `fontes/OFL-montserrat.txt`.

## Rodada 2: palco 3D, cenários e câmera (31/10)

O estilo agora desenha o palco em **3D de verdade** (three.js, `src/video/engine/estilo-mindset-3d.js`): bonecos de cápsulas com material físico (dourado com verniz e brilho, cinza fosco), olhos, sombra de contato, luz de recorte, reflexo planar no chão, névoa e partículas. O texto (legenda, etiquetas, numeral, botão e frase de impacto) continua no 2D, por cima. Sem WebGL, o estilo volta sozinho ao palco 2D da rodada 1.

### Cenários (`"cenario": "<id>"` no beat)

`palco` (padrão), `vazio` (sem chão: gráficos e frase de impacto), `cidade`, `quarto`, `escritorio`, `chuva`, `deserto`, `cais`, `agua`, `penhasco`, `estadio` e `fogo` (medidas e vídeos de origem na análise interna, fora do kit). O planejador escolhe pelo assunto da frase (dinheiro e trabalho: cidade; sono e noite: quarto; prazo e estudo: escritório; chuva e crise: chuva; coragem e salto: cais; plateia e tentativas: estádio; briga e raiva: fogo); o palco é o padrão, a não ser que metade do vídeo fale do mesmo lugar. Frases paralelas ficam no mesmo cenário.

### Movimentos de câmera (`"camera": { "mov": "<nome>" }` no beat)

| Nome | O que faz (referência) | O planejador usa em |
|---|---|---|
| `fixa` | quase parada, deriva de 6 cm (16, 17) | gráfico |
| `push-in` | aproxima 14% no beat (15, 18) | gancho, foto |
| `pull-out` | começa 14% mais perto e abre subindo (12, 18) | multidão |
| `orbita` | gira de -14 a +14 graus (12) | boneco sozinho, fecho |
| `travelling` | 1,4 m de lado a lado, fundo em parallax (09, 13) | comparação |
| `parallax` | deslize curto em camadas (14) | comparação |
| `grua` | sobe 1,8 m olhando o mesmo ponto (12) | subir, nascer do sol, barra, número, fecho |
| `tilt` | sobe pela encosta enquanto recua, e volta (07) | penhasco |
| `segue` | o alvo acompanha o dourado (09) | só no `cena.json` à mão, com um boneco |
| `close` | aproxima 30% e sobe o olhar ao rosto (18) | só no `cena.json` à mão |
| `tremor` | sacode 6 cm e acalma em 0,6 s na ação (11, 12) | só no `cena.json` à mão |

Movimentos vizinhos nunca se repetem (a não ser no beat que continua a cena). O QA refaz a câmera de cada beat sem render (`src/video/verificadores/estilo-mindset-verificar.mjs`) e reprova quando o boneco sai da área segura, entra na faixa da legenda ou quando a câmera sai do chão (faixa preta).

### Como criar um cenário novo (4 passos)

1. Copie `src/video/engine/mindset-cenarios/palco.js` para `src/video/engine/mindset-cenarios/<id>.js` (ou, só para um projeto, declare em `projetos/<nome>/pecas.js`: `export const cenariosEstilo = { mindset: { '<id>': { ... } } }`).
2. Troque os dados: `nome`, `temas` (pedaços de palavra que a fala usa), `ambiente` (`fundo`: 3 cores de cima para baixo; `tipo`: `parede`, `ceu` ou `foco`; `brilho` opcional), `chao` (`liso`, `molhado`, `rachado`, `agua` ou `nenhum`, cor, rugosidade, `reflexo` de 0 a 0,8), `luz` (`tipo` e as luzes `chave`, `contra` e `ambiente` com cor e intensidade), `nevoa`, `particulas` (`chuva`, `poeira`, `fagulhas`, `fogo`, `fumaca`, `bolhas`, `ondas`), `props` (adereços: `skyline`, `janela`, `cama`, `mesa`, `luminaria`, `pier`, `agua`, `penhasco`, `arquibancada`, `holofote`, `sol`, `lua`, `nuvem`, `pocas`), `clima` (`calmo`, `vivo` ou `solene`) e `camera` (o movimento padrão).
3. Registre (só no estúdio): uma linha de import e o nome na lista `LISTA` de `src/video/engine/mindset-cenarios/index.js`. O do projeto já vale sem registro.
4. Rode `node --test test/estilo-mindset-cenarios.test.mjs`: o teste valida **todo** cenário registrado (contrato comum e campos 3D) e o QA confere o do projeto. Use no beat com `"cenario": "<id>"`.

Adereço que não existe nasce em `src/video/engine/estilo-mindset-props.js` (uma função em `PROPS`, com material de verdade e bisel; nunca primitiva lisa) e entra em `TIPOS_PROP`.




