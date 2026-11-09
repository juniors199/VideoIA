

# Estilo fatos (Fatos: dado de satélite sobre carvão)

Porte de 31/10/2026 a partir de 4 vídeos de referência analisados quadro a quadro, a 10 qps (análise completa fora do kit). Daqui vem só o padrão transferível: nenhuma frase, personagem, imagem, mapa, música, marca ou fonte de terceiros. O mapa é desenhado pelo estúdio com dados de domínio público (Natural Earth e a textura da Terra da NASA).

Para quem: curiosidades factuais e casos do noticiário com número, lugar e virada ("Quantos brasileiros moram no Paraguai", "Por que a busca por isso explodiu"). Funciona melhor quando a frase tem um número, um lugar, uma lista ou uma pesquisa para mostrar.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout dos Reels)

| Regra | Medida na referência | No estúdio |
|---|---|---|
| Texto | a fala no alto, palavra a palavra, sem legenda embaixo; topo do bloco em y 405 a 460 (a 1080), quebra em ~70% da largura | bloco no alto em y 430, largura 820, até 3 linhas por página (frase longa vira páginas do mesmo beat; página órfã de 1 ou 2 palavras desce com a linha anterior); cada palavra entra 0,08 s antes de ser dita, apagada, desfocada (8 px) e 12 px abaixo e acende em 0,28 s; o texto sai inteiro 0,3 s antes do beat seguinte |
| Fontes | sans tipo Inter (médio); virada em serifa itálica larga de alto contraste; etiquetas em mono | Inter Tight 600 (`Ilu`, -0,02 em) a 66 px; Playfair Display itálica 400 (`IluTituloI`) a 72 px (104 px na frase curta só em itálico); linha de apoio em Inter Tight 400 a 56 px; JetBrains Mono (`IluMono`) nas etiquetas, 38 a 40 px |
| Cores | sans `#F2F1EE`, apoio `#AFAFAC` a `#BEBEBC`, acento amarelo `#FBD90A` (ou ouro, vídeo 1) | `COR_FATOS` em `estilo-fatos.js`; `tom`: `amarelo` (padrão), `ouro` (`#F0BE66`) ou `marca` (o laranja da página) |
| Virada | a parte depois da vírgula (2 a 6 palavras) na itálica no acento | `italico`: a palavra dita onde começa; o plano automático acha a última pausa; sem virada, a `chave` acende no acento |
| Número | ~218 px a 1080, quase chapado, conta de 0 ao valor em ~2 s | Inter Tight 700, 200 px (encolhe só se passar de 940 px), degradê `#FAFAF7` -> `#DCDCD7`, algarismos de largura fixa (não dança), contagem de 1,6 s desacelerando; o que vem antes do número fica numa linha pequena acima ("Até" / 1960); `ano: true` sem ponto de milhar |
| Mapa | satélite escuro em tela cheia (0.6.31: o mapa cobre os 1080 x 1920 em TODO quadro: mar escuro por baixo, a volta ao mundo repetida nas laterais e, além dos polos, a base estendida em espelho que apaga para o mar; antes, câmeras com lon < -180 ou lat > 90 mostravam a borda da textura), lugar aceso em cor natural, contorno de 2 px no acento com halo, fluxo, alvo | base cinza escura da NASA com relevo de cristas preso ao mapa, fronteiras finas (e dos estados perto do Brasil), lugar em cor natural com véu do acento, contorno de 3,2 px que se desenha em 0,9 s; empurrão de 12% e deriva lenta; a câmera viaja entre lugares de beats seguidos (sem corte); alvo com o nome em mono 1,2 s depois do começo |
| Fundo | carvão com luz no centro (L 37 a 55 contra 13 a 22 nos cantos), grão de ~1,5 tom que muda a cada quadro, grade de pontos apagada | gradiente radial `#2E2E29` -> `#0D0D0C`, grão em 4 campos que trocam a cada quadro (sobreposição), grade de pontos a cada 38 px, vinheta 0,55 |
| Respiro do número (0.6.31) | linha pequena a ~0,3 da altura do dígito do número (47 a 87 px a 1080; análise de 03/11, item 2) | do pé da linha pequena ("A Newsweek juntou") ao topo do número: `respiroNumero(px)` = 45% da altura das maiúsculas (66 px em 200 px de corpo, ~52 px livres depois da descida das letras), proporcional ao corpo se o número encolher; o que vem abaixo (unidade, virada) continua a ~52 px |
| Texto em cartão (0.6.31) | mono de ~29 px a 1080, cabe no cartão (v3, 30 a 38 s) | título, item e valor da `lista`, etiqueta (`selo`), rótulo do mapa e carimbo passam por `ajustarLinhas` (`estilo-fatos-texto.js`): encolhem até 70 a 80% do corpo, quebram em até 2 linhas, **nunca cortam letra** (o `slice(0, 22)` que fazia "CONTÍNU" saiu) e nunca passam da margem de 40 px da tela |
| Progresso | barra no topo, 5 px a 720, linear no tempo, trilho `#1F1F1F` | 7,5 px, no acento |
| Transição | cruzamento de ~0,4 s; 0 a 3 cortes secos por vídeo | visual novo entra 0,05 s antes do beat (escala 1,04 -> 1) e o velho sai (1 -> 0,97) em 0,4 s |
| Fecho | pergunta e opções em pílula com botão de rádio que acende quando dita | `cta`: pílulas de 760 x 104 com contorno no acento; padrão SEGUIR A PÁGINA e COMENTAR ILUSTRANDO |
| Áudio | cama musical contínua a -14 LUFS, LRA 1,4 a 2,5 | trilha `tensao`/`noticia`; sopro na troca, tique no item e na busca, ding no número, clique no fecho, de -18 a -30 dB; vídeo no x264 com `-tune grain` (o relevo e o grão somem no crf 23) |

**Sobre a legenda de 1 linha:** a regra da casa vale para a legenda de baixo. Este estilo não tem legenda: o texto da fala é o próprio texto do estilo, no alto, como na referência (até 3 linhas, 66 px ou mais, nunca abaixo de y 1500).

## Cenários (no beat: `"cenario": "<id>"`; mecanismo comum dos estilos, `src/video/engine/cenarios-estilo.js`; medidos nas referências)

| Cenário | Base | Na referência | No estúdio |
|---|---|---|---|
| `satelite` | mapa | mapa de satélite escuro em tela cheia, lugar aceso (vídeos 1 a 4) | base cinza da NASA com relevo, fronteiras, lugar em cor natural, fluxo e alvo; névoa escura no alto; câmera `empurrao` |
| `satelite-alerta` | mapa | o mesmo mapa tingido de vermelho, contorno vermelho ("Enquanto isso, aqui...", vídeo 1, fundo `#331D21`) | mapa tingido pela `tinta` `#E5484D`, lugar e fluxo em vermelho; câmera `deriva`; o plano escolhe com "enquanto isso", imposto, crise, perda |
| `globo` | globo | Terra cinza no escuro, halo no acento, grade de pontos (aberturas dos vídeos 1, 2 e 4) | globo ortográfico com o país contornado, estrelas que piscam e grade com parallax; câmera `orbita` (ou `mergulho` quando o próximo beat é o mapa do mesmo lugar) |
| `palco` | palco | estúdio escuro, cone de luz do alto com névoa, piso com poça de luz (vídeos 2, 3 e 4) | **só luz, cone e névoa** (0.6.31: sem personagem por padrão, regra do estúdio de 03/11): cone do alto, névoa iluminada, poça de luz no piso e poeira; a pergunta e o fecho (pílulas) ficam no palco, a abertura nunca; câmera `orbita` |
| `palco-curioso` | palco (3D) | o palco com o personagem | **opção explícita** (`"cenario": "palco-curioso"`, nunca escolhida pelo plano): three.js de verdade, piso com sombra, luz de recorte e de borda no acento, o **Curioso** (ver "Personagem do palco"); câmera `orbita` |
| `papel` | papel | papel envelhecido com vinheta forte, mapa a tinta e o lugar hachurado em vermelho (vídeo 1, 1864: centro `#9E9584`, cantos `#545047`, tinta `#A24C44`) | textura de papel feita por código, mapa a tinta (fronteiras marrons), hachura a 45° na tinta; texto em tinta escura e a virada em vermelho; câmera `deriva`; o plano escolhe com ano antes de 1900 |
| `painel` | painel | carvão com luz no centro e grade de pontos atrás dos infográficos (vídeos 1, 3 e 4) | o fundo dos cartões, barras, gráficos, busca e foto; câmera `deriva` (ou `fixa` na lista e na busca) |

A frase logo depois de um mapa herda o mapa apagado (o mundo continua atrás do texto); num cenário sem mapa (palco, painel, globo) não herda. Com `palco-curioso`, dois beats seguidos são o mesmo personagem, com a câmera contínua.

## Movimentos de câmera (no beat: `"camera": { "mov": "<id>" }`; medidos nas referências)

| Movimento | Na referência | No estúdio |
|---|---|---|
| `empurrao` | push-in lento nos mapas, de 6 a 12% por beat | escala 1,00 -> 1,12 no beat, curva suave |
| `recuo` | o mapa abre para o continente (vídeo 1, fim) | 1,12 -> 1,00; o plano usa na conclusão ("hoje", "ou seja") |
| `deriva` | parallax lento atrás dos infográficos | 18 x 14 px (períodos de 5,1 e 6,7 s); a grade do fundo anda a metade |
| `orbita` | o globo gira ~38° (vídeos 2 e 4) | globo: 38° no beat; palco: a câmera 3D dá a volta em torno do personagem |
| `mergulho` | dolly para dentro do globo até o mapa (vídeo 2, 0 a 2,3 s) | o raio cresce 2,4 vezes no fim do beat, acelerando, e o globo some no último quarto sobre o mapa |
| `fixa` | lista e cartões parados (quem anda é o item) | parada |
| `tremor` | não aparece nas referências | câmera na mão discreta (2 px); só à mão, fora do plano automático |

A viagem de um mapa ao outro (travelling) é automática entre beats seguidos com mapa (0,9 s). O plano automático escolhe: gancho e mapa empurram, conclusão recua, lista e busca fixas, gráfico, barras, linha do tempo e foto derivam, palco e globo orbitam, globo antes do mapa do mesmo lugar mergulha.

## Personagem do palco (o Curioso): só por opção (0.6.31)

**Nenhum Reel Fatos traz o personagem por padrão** (a revisão do Reel `kit-emergencia-pix`, em 03/11, pediu para tirar o Curioso). O cenário `palco` é só luz, cone e névoa; o plano automático nunca escolhe `palco-curioso`, e a abertura é número, globo ou o objeto da fala. O código do personagem continua no estúdio para quem quiser: escreva `"cenario": "palco-curioso"` no beat. O palco com o personagem em 3D de verdade (three.js) é **dado**, como o cenário: `src/video/engine/estilo-fatos-personagem.js`. O padrão é o **Curioso**, desenhado para o Ilustrando depois que o estúdio decidiu (31/10) que o primeiro porte estava parecido demais com o mascote do perfil de referência. Ele é diferente em tudo que faz um personagem ser reconhecido:

| | Mascote da referência | Curioso (Ilustrando) |
|---|---|---|
| Silhueta | duas esferas empilhadas, sem braços | um corpo só em sino (casaco), com braços e mãos |
| Cor | preto brilhante inteiro | casaco azul-noite `#1B2338` (o preto azulado da página) e cabeça marfim `#EEE6D8` |
| Cabeça | esfera | oval achatada, mais larga que alta |
| Olhos | cápsulas brancas | óculos redondos de aro laranja `#FF7A2F`, pupilas escuras com brilho |
| Roupa e acessório | nenhum | cachecol de tricô laranja, três botões, a lupa da curiosidade na mão e a antena com a faísca acesa |

Material com variação (relevo de tecido no casaco, tricô no cachecol, cabeça acetinada, aro e lupa metálicos, lente de vidro), luz de recorte do alto, luz de borda no acento e sombra no piso. A vida é a mesma: respira, balança, pisca a cada 3,1 s, olha para o texto, a lupa balança e a faísca pulsa. A câmera (`orbita`, `empurrao`...) e o cenário funcionam igual.

### Como trocar o personagem

- **Só mudar a aparência** (num cenário do projeto, em `pecas.js`): no prop do personagem, `{ "tipo": "personagem", "id": "curioso", "aparencia": { "corpo": { "cor": "#2A1A10" }, "acessorio": { "tipo": "nenhum" }, "antena": null } }`.
- **Campos:** `corpo` { forma: sino ou capsula, cor, brilho }, `cabeca` { forma: oval ou redonda, cor }, `olhos` { tipo: oculos ou pontos, aro, pupila }, `roupa` { cachecol }, `acessorio` { tipo: lupa ou nenhum, cor }, `antena` { cor } ou null. Cores em "#rrggbb".
- **Personagem novo para todo mundo:** acrescente um id em `PERSONAGENS_FATOS` e use `"id"` no prop. `validarPersonagem` confere os campos; o teste `test/estilo-fatos-cenarios.test.mjs` cobre o padrão e a troca.

## Como criar um cenário novo (4 passos)

O fatos usa o mecanismo comum de cenários dos estilos (o mesmo do mindset2; contrato em `src/video/engine/cenarios-estilo.js`).

1. **Escolha a base** que o fatos desenha e ponha em `ambiente.base`: `mapa` (satélite), `globo`, `palco` (3D, com o personagem), `papel` (mapa a tinta) ou `painel`.
2. **Escreva o dado** (sem código): `nome`, `temas` (palavras que fazem o plano escolher o cenário), `ambiente` { `fundo`: [centro, meio, borda], `base`, `tinta` (cor que tinge o mapa ou o papel), `topo` { cor, alfa, altura } (o escurecimento do alto, onde fica o texto) }, `luz` { `tipo`: centro, cone ou nenhuma, x, y, raio, intensidade, cor }, `nevoa` (o brilho do cone no palco; alfa até 0,6), `particulas` { poeira, estrelas ou brasas: quantas }, `props` (`grade`, `personagem`, `cone`, `piso`, `estrelas`), `clima` (calmo, vivo, solene) e `camera` (o movimento padrão).
3. **Registre**: no projeto, em `projetos/<nome>/pecas.js`:
   ```js
   export const cenariosEstilo = { fatos: {
     'deserto-noite': { nome: 'Palco quente', temas: ['deserto'], ambiente: { fundo: ['#3A2A1A', '#20160D', '#0A0704'], base: 'palco' },
       luz: { tipo: 'cone', x: 0.5, y: 0.62, raio: 900, intensidade: 0.7, cor: '#4A3420' }, nevoa: { cor: '#FFB347', alfa: 0.08, altura: 0.9 },
       particulas: { brasas: 40 }, props: [{ tipo: 'personagem' }, { tipo: 'cone' }], clima: 'vivo', camera: 'empurrao' },
   } };
   ```
   No estúdio (para todo mundo): acrescente o dado em `CENARIOS_FATOS` de `src/video/engine/estilo-fatos-cenarios.js` (o arquivo já é carregado por `cenarios-estilo-todos.js`).
4. **Use e confira**: `"cenario": "deserto-noite"` e, se quiser, `"camera": { "mov": "orbita" }` no beat; rode `node --test test/cenarios-estilo.test.mjs test/estilo-fatos-cenarios.test.mjs` (valida todo cenário registrado contra o contrato e desenha um quadro de cada cenário do fatos). Base, prop, luz ou câmera que não existe é recusada com a lista do que vale.

## Formas (`{ "tipo": "fatos", "forma": ... }`)

`frase` (só o texto, com o traço do acento embaixo quando está sozinho; depois de um mapa, o mapa apagado continua atrás), `numero` (`valor`, `casas`, `prefixo`, `sufixo`, `ano`, `de`; `foco` põe o mapa atrás, `globo: true` o globo), `mapa` (`foco`, `fluxo`, `alvo`, `rotuloAlvo`, `zoom`), `globo` (`foco`), `lista` (`itens` `{ texto, valor, chave }`, `titulo`), `barras` (`itens` `{ rotulo, valor, sufixo, cor }`), `grafico` (`pontos`, `rotulo`), `busca` (`texto`, `sugestoes`), `pessoas` (`total`, `destaque`, `cor`, `legenda`), `linhatempo` (`marcos` `{ data, rotulo, chave }`: o marco da vez em número grande acima da linha), `foto` (pessoa citada: a foto real com cor contida, cantos de mira no acento e o nome em etiqueta mono; duas fotos do mesmo tamanho e tratamento), `documento` (0.6.31: cartão de documento com cabeçalho mono, linhas que se escrevem, uma linha em destaque e o carimbo mono inclinado `carimbo`; `titulo`, `destaque`) e `cta`.

**Contexto visual** (0.6.31), em qualquer forma sem mapa (`frase`, `numero`): `objeto` (uma peça 3D de verdade do repertório do estúdio, como "lanterna", "celular", "cofre"; ou `{ "peca", "dados" }`; gira devagar no meio da tela, com halo no acento e sombra de contato; entra na palavra-chave) e `icone` (pictograma de linha do estúdio: `ICONES_FATOS` em `estilo-fatos-icones.js`, 20 ids como agua, comida, remedio, lanterna, dinheiro, pilha, radio, celular, luz, sinal, casa, familia, cadeado, tempestade, escudo, alerta, documento, calendario, relogio, qr, mapa). Cada item de `lista` aceita `icone` (no lugar do quadradinho). O texto vai para o alto quando há contexto embaixo; o número encolhe só se passar da largura.

Em todas: `chave`, `italico`, `riscar`, `etiqueta` (mono acima do texto), `selo` (mono embaixo do visual), `alinhar: "esquerda"`, `tom`. `foco`: país (ISO2, ISO3 ou nome em português), estado (`BR-SP`) ou região (`BR-SUL`); lista completa em `docs/cena/estilo-fatos.md`.

## Plano automático

`src/video/autoplano-fatos.mjs`: junta a frase que o plano genérico cortou na vírgula; duas ou mais horas ou anos viram `linhatempo`; número entre as 3 primeiras palavras vira `numero` (o "mil" entra no valor, R$ e % viram prefixo e sufixo, ano conta dos 24 anos antes); país ou estado citado (com maiúscula: "Pará" nunca casa com "para"; "Brasília" e "Planalto Central" são o DF) vira `globo` na primeira vez que é um país e `mapa` depois, com `fluxo` quando a frase fala de gente indo, vindo ou morando; o número do gancho sem lugar pega o lugar da frase seguinte; a foto automática de lugar sai e a de pessoa fica (`foto`); "pesquisaram como..." vira `busca`; o último beat é o `cta`. **Escreva o número no começo da frase** ("41 meses. Foi o tempo..."): número no meio da frase fica só no acento do texto.

A unidade dita logo depois do número (dias, anos, meses, países, milhões...) entra no número (`sufixo`) e **não se repete** na linha de baixo ("90 dias" e não "90 dias / dias sozinhas"; `mesmaUnidade` aceita a abreviação: out/outubro, bi/bilhões, e o "de" no meio, "22 de outubro").

**Contexto visual no plano (0.6.31, "muito número e pouco visual"):** frase e número sem mapa ganham o objeto 3D que a fala cita (`objetoDe`: léxico de relevância do repertório, nota alta, nunca geométrico, figura genérica ou termo fraco, nunca o mesmo objeto em beats seguidos), senão o ícone de linha; frase que fala de relatório, proposta, campanha, decreto, lei, norma ou documento vira `documento` com o carimbo da própria fala; os itens de lista ganham ícone; do 3º número seguido sem visual em diante entra ícone de calendário, relógio ou documento. Nada é inventado: o visual só mostra o que a fala diz.

## QA e revisão

- O QA trata o estilo como estilo de leitura (`qa.mjs`, lista MARCA): texto na área segura, protagonista medido (a área do mapa abaixo do texto, o cartão, as barras, a foto), nunca mais de 0,5 s sem protagonista; metas em `qa-verificadores.mjs` (parado até 90%: medido como na referência, o movimento delas a 48 px tem mediana de 0,13 a 0,27). **Texto que vaza (0.6.31):** o estilo mede cada texto de cartão, lista, etiqueta, rótulo e carimbo em `textosFatos` e o verificador `textoForaDoCartao` reprova `texto-fora-do-cartao` (fora do cartão com folga de 8 px), `texto-fora-da-tela` (margem de 40 px), `texto-cortado` e `rotulo-ilegivel` (fundo menos opaco que 0,8 sobre o mapa); teste `test/estilo-fatos-0631.test.mjs`.
- Revisão a 5 qps: nunca dois textos na tela ao mesmo tempo (o velho sai antes do número ou da foto que vêm)? A virada em itálico acende quando é dita? O lugar aceso é o da frase? O rótulo do alvo fica fora do contorno do lugar (abaixo ou acima dele, com linha de chamada) e dentro da margem? O mapa cobre a tela inteira em todo quadro (sem faixa clara à esquerda ou em cima, sem borda de painel)? Há folga entre a linha pequena e o número? Há texto saindo do cartão? A foto não encosta no texto? O número chega ao valor de `fontes.md`?

## O que não copiar

O mascote do perfil de referência NÃO é copiado. O personagem Curioso, próprio do Ilustrando, existe só como opção (`palco-curioso`); por padrão o palco é só luz (ver "Personagem do palco").


Nome e @ do perfil, frases e roteiros, avião e passaporte, imagens, mapas e vídeo da referência, música e fonte de terceiros. As fontes são as livres que o estúdio já tem: Inter Tight, Playfair Display itálica e JetBrains Mono (OFL, em `AVISOS-TERCEIROS.md`); a serifa do numeral no papel é a Instrument Serif (OFL).




