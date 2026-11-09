

# Estilo mindset3 (Mindset 3: ilustração em giz luminoso e retícula)

Porte de 04/11/2026 a partir de 20 vídeos de referência analisados quadro a quadro (análise completa fora do kit). Daqui vem só a técnica: nenhuma imagem, frase, marca, música ou fonte de terceiros. Desenhos, cenários, retícula e sons são feitos por código (`src/video/engine/estilo-mindset3*.js`).

É um estilo novo e independente: não tem relação com `mindset` (bonecos no palco) nem com `mindset2` (traço de luz sobre carvão).

Para quem: mente, hábitos, comportamento, sono, corpo, dinheiro e tecnologia explicados com calma. Funciona em qualquer assunto em que cada frase tem uma coisa que dá para desenhar: um órgão, um objeto, um número, uma comparação, uma lista.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout)

| Regra | Medida na referência | No estúdio |
|---|---|---|
| Fundo | preto azulado liso #111113, retícula fina de 6 px nos painéis | #111113 com a retícula de 9 px a 2 a 5% (por cenário) e vinheta |
| Traço | 1,5 a 2 px, lavanda #D6D0DD, giz pontilhado, franja rosa e ciano de 1 a 2 px, brilho (bloom 1,8 a 4,0) | 2,6 px #D8D2E2, pontilhado por cima, franja de 1,6 px no frio e no alerta da marca, brilho de 14 px; o traço SE DESENHA com a ponta acesa do lápis |
| Retícula | preenchimento, reflexo e halo em pontos de meio-tom | `preenche: 'pontos'` (passo 8 px, pontos maiores no centro de luz) e `'linhas'` (hachura de 7 px); halo do ponto aceso em pontos que diminuem para fora |
| Acento | ouro #F0E1AE a #D9B660; ciano para o contraponto; rosa para alerta | a cor da marca (`tonsDaMarca`); o frio é a complementar dela e o alerta é o vizinho quente (`paletaM3`): quem troca a marca troca tudo junto |
| Etiqueta | mono maiúscula de 9 a 12 px (14 a 18 a 1080), espaçada, com linha-guia, digitada | JetBrains Mono 24 px, espaçamento 0,14 em, digitada a 40 caracteres/s, sempre FORA do desenho (à direita, à esquerda ou acima) e dentro das margens |
| Plano | 0 cortes em 13 de 20; 0,7 a 3,7 cortes por minuto nas outras 7 | sem corte: as ideias entram por `desenha`, `morfa`, `desliza`, `recua` e `apaga`; `corte` só se pedido (o verificador avisa com mais de 2) |
| Transição | nunca clarão | nenhuma transição clareia o quadro (o `apaga` passa pelo escuro); o verificador reprova transição de fora do estilo |
| Câmera | 2 a 29 px/s (0,1 a 1,5 %L/s), picos de até 71 px/s, empurrão ~1%/s, recuo que revela, descida, perspectiva 3D em 2 referências | 7 câmeras nomeadas (abaixo), misturadas com velocidade contínua entre os beats (1,2 s, smootherstep); nunca paradas (deriva de base com respiro de escala, para o QA de trecho parado acima de 1,5 s); teto de 16 %L/s, 60 %L/s² e 420 %L/s³ |
| Protagonista | centrado; 25 a 65% da altura; centro entre y 570 e 960 | centro em x 540 (verificador: até 24 px) e y 800; altura de 520 a 760 px; o par da `dupla` centrado como conjunto |
| Legenda | Poppins 42 a 45 px, 1 a 2 linhas, centro a 73 a 77% | Poppins 45 px (regra do estúdio, 05/11, como a referência), UMA linha (regra da casa), centro em y 1394 com a base em 1417, dentro da área segura (antes y 1440, base em 1463); no beat do fecho a legenda sobe para y 1279, acima da pílula; a frase entra cinza #6A6468 e cada palavra acende para #F5F0F4 quando dita; a palavra-chave em negrito com brilho; sombra deslocada avermelhada; sem placa nem elipse |
| Número | ref07 "72": anel de 450 px a 720 (62,5% da largura) centrado em y 620 (48%); número sans fina creme com 40% do diâmetro de largura e altura de maiúscula de 21% do diâmetro; "HOURS" creme logo abaixo (vão de 10 px); marcas fora do anel; ponto de acento no anel; halo de retícula com a forma dos algarismos (ref04 "26" e ref07 "72" a 3x) | anel de 675 px centrado em (540, 930); Poppins Light (300) creme #ECE6DA, encolhida até caber em 62% do diâmetro; o grupo número + rótulo fica centrado no eixo do anel; rótulo mono creme a 3,5% do diâmetro abaixo da base; 60 marcas finas fora do anel e o ponto da marca no anel; halo de retícula com a forma dos algarismos (`haloGlifo`); conta até o valor (ano e hora entram inteiros); `anel: false` faz o número solto da ref04 |
| Fecho | pílula clara #EDEDE9 com ícone que vira a pílula do visto, centro a 85,4% da altura (y 1093 de 1280), 60 px de altura; entra com mola (largura 419, 285, 333, 320 px em ~0,5 s, ref07); volta à imagem do começo | a figura do primeiro beat de volta (loop, sempre), a pílula "COMENTA <PALAVRA>" que vira "✓ SEGUE A PÁGINA" (CTA padrão do config) centrada em y 1372 (base em 1417, encostada na base da área segura; antes y 1640), 90 px de altura, Poppins Bold 34 px, fundo #EDEDE9 e tinta #1C1C1E, com a mola medida; o verificador mede a folga de 24 px contra a legenda do fecho e os textos, a base da área (y 1418) e as margens x 72 a 928 |
| Áudio | -14 LUFS, trilha 6 a 9 LU abaixo da voz, sem silêncio | regra da casa: trilha 8 LU abaixo (clima `ambiente`/`inspirador`), efeitos discretos (traço de lápis, tiques de máquina, ping, pop da pílula) |
| Overlay | grão de 0,45 a 3 (limpo a médio), vinheta sutil a forte | retícula fina + grão leve em overlay (3 campos a 12 qps) + vinheta por cenário |

## Formas (`{ "tipo": "mindset3", "forma": ... }`)

- `figura`: um desenho da biblioteca (`figura`: id) ou `"caminho"` com `d` (SVG numa caixa de 200 x 200). `rotulos`: até 3 etiquetas (`"TEXTO"` ou `{ "texto", "em": [fx, fy] }`, a âncora em fração do desenho). `altura` (520 a 760).
- `dupla`: `figuras: [a, b]`; o primeiro entra no centro e desliza encolhendo quando o segundo se desenha (referência 05 e regra da casa do par). `segunda` (s desde o começo do beat), `rotulos: [a, b]` embaixo de cada um.
- `pessoa`: a pessoa citada pelo nome vira ILUSTRAÇÃO em linha no padrão do estilo (`figura`: `busto`, `perfil` ou `corpo`; padrão `busto`), com o nome na etiqueta mono centrada embaixo (`rotulo`). Sem foto.
- `foto`: só quando o usuário pede foto real (lugar, objeto ou pessoa): a foto (elemento `imagem` no mesmo beat) em retícula de meio-tom numa ficha de traço, com o nome na etiqueta (`rotulo`).
- `numero`: `texto` (até 9: "72", "8,3", "1999", "06:00"), `rotulo`, `unidade` (linha embaixo), `anel: false` tira o anel, `conta: false` não conta. O tamanho sai da geometria medida (`geometriaNumero`): o número encolhe até caber no anel, nunca vaza. `aneis` (2 a 6) troca o anel único pelos anéis concêntricos da ref04 (o anel interno abraça o número; os outros a cada 42 px, até 340 de raio) e `vezes` ("×7", até 4 caracteres) põe o multiplicador à direita, fora do anel interno.
- `titulo`: `texto` (até 40, 2 linhas) em Poppins Bold 92 px; com `figura` o título sobe e o desenho entra embaixo. A linha quebra pela largura estimada (`linhasTituloM3`, até 740 px dentro dos 776 da área segura); texto que pediria 3 linhas é recusado na validação (encurte). O desenho prende cada linha e cada etiqueta dentro de x 72 a 928 mesmo com a câmera (fila de misticismo, 05/11).
- `diagrama`: `diagrama` = `venn` (`rotulos` [a, b], `meio`), `orbita` (`centro`, `rotulos` dos satélites), `onda` (`calma`, `pico`, `rotulos` [antes, depois]), `escada` (`rotulos` dos níveis; o ponto sobe), `barras` (`valores`, `rotulos`), `rede` (`nos`), `escala` (`itens` em lista mono, `destaque`), `espiral`, `grade` (`colunas`, `linhas`, `grupos: [{ n, tom }]`, `voce`), `helice` (ref17: hélice 3D de 2,5 voltas, a frente forte na cor fria e o fundo apagado; `itens` são os nós em sequência na última volta, `destaque`, `centro` em Poppins Light embaixo e `rotulos[0]` mono; câmera `orbita`), `fechadura` (ref17: caixa com `pinos` de 3 a 6, molas na cor fria, os pinos de baixo na cor da marca alinhando na linha de corte um a um, `falta` deixa um fora, `titulo` em cima; câmera `inclina`).
- `cartao`: ficha com `titulo` mono e até 4 `itens` digitados (o último na cor da marca), `carimbo` (até 12 letras, cai torto), `risca` (índice riscado); `variante: "celular"` com `titulo` (rótulo do campo) e `texto` digitado no campo; `variante: "duplo"` (ref08: dois painéis em 776 px no eixo 540, x 152 a 928 (área segura; antes x 60 a 1020), os itens a 28 px do painel em 28 px, que descem o mínimo para o item mais longo caber, `titulo` em Poppins Bold no da esquerda com `rodape` mono, até 4 `itens` de até 18 caracteres no da direita com o sublinhado de alerta); `variante: "ficha"` (ref18: folha com duas atrás, `titulo` mono na cor da marca, quadro com a `figura` em linha, até 5 `campos` "RÓTULO|valor", 2 ao lado da foto e o resto embaixo, `destaque` em alerta sublinhado). O verificador reprova texto que passa do painel (`cartao-vaza`).
- `cta`: o fecho; `figura` (padrão: a do primeiro beat), `chave` (a palavra do comentário).

Campos comuns: `chave` (palavra ou lista de palavras ditas que ficam em negrito na legenda; sem `chave`, a maior palavra de cada frase), `transicao`, `desenho` (multiplica o tempo de desenho).

Tons dos traços: `linha`, `quente` (marca), `frio`, `alerta`, `apagado`.

### Biblioteca de figuras (35 + 8 de ação + 14 da fila de misticismo, em `estilo-mindset3-figuras.js`)
Fila de misticismo (05/11): documento, fones (frequência de som), holograma, alvo, submarino, mapa-coordenadas, carro, multidao, linha-tempo (passado, presente, futuro), espelho (a outra versão), bussola, concha (espiral de Fibonacci), girassol (folhas e sementes) e coelho, com pistas da fala. Etiqueta com `em` fica logo acima do ponto pedido. No fecho, câmera de lado (panorâmica, órbita) vira aproximação. No `cartao` celular, o texto digitado tem até 16 letras.

corpo, busto, perfil, cerebro, coracao, olho, lua, sol, planeta, estrela, relogio, despertador, celular, notebook, porta, janela, cama, casa, predio, chave, cadeado, balanca, degraus, envelope, lampada, vela, arvore (fractal que cresce por geração), montanha, caneca, livro, moeda, lupa, ampulheta, nuvem, raio. Cada uma tem `temas` (o plano escolhe pela fala).

Figura nova do projeto, em `projetos/<nome>/pecas.js`:
```js
export const figurasMindset3 = {
  'bicicleta': { nome: 'Bicicleta', temas: ['bicicleta', 'pedalar'], brilho: [100, 150], rotulo: 'PEDAL',
    tracos: [{ d: 'M40 150 A30 30 0 1 1 40.1 150 Z', tom: 'linha' }, { d: 'M160 150 A30 30 0 1 1 160.1 150 Z' }, { d: 'M40 150 L90 90 L160 150 M90 90 L120 90', tom: 'quente' }] },
};
```

## Cenários e câmeras

No cena.json, por beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`. Sem pedido, o fundo é liso (`breu`, como na maioria das referências) e o cenário só entra quando a FRASE do beat diz o lugar (os `temas` de cada cenário são lugares: quarto/cama, floresta/lago, portal, céu/estrelas, signo/zodíaco, wifi/sinal, chão/piso); o verificador reprova cenário sem esse gatilho (`cenario-sem-gatilho`). Nenhum cenário desenha janela no canto nem linha de chão solta perto da legenda (regra do estúdio, 05/11); chão e janela, quando a frase pede, vêm da própria figura. A câmera sai da forma, sem repetir a do vizinho.

| Cenário | O que tem | Câmera padrão |
|---|---|---|
| `breu` | o fundo liso com a retícula fina (padrão) | `aproxima` |
| `painel-pontos` | painel de retícula mais acesa e fio vertical, sem linha de chão (02); só com wifi, internet, roteador, sinal, frequência, rádio | `deriva` |
| `ceu-estrelado` | estrelas que piscam e um meteoro a cada ~6 s (04, 15) | `desce` |
| `horizonte` | horizonte, floresta em traço e reflexo em hachura (06) | `desce` |
| `quarto` | fundo liso: sem janela no canto e sem linha de chão (regra do estúdio, 05/11); a cama e a janela entram como figura; só com quarto, cama, travesseiro | `aproxima` |
| `anel-astral` | anel apagado com 72 marcas, graus mono e o ponto da marca (04, 07); nunca atrás de um `numero` (o número tem o anel dele; o verificador reprova e o plano troca por `breu`) | `orbita` |
| `portal` | colunas com hachura, viga, degraus em retícula e estrelas (15) | `aproxima` |
| `grade-chao` | chão de quadradinhos em perspectiva; só com chão, piso, tabuleiro (a forma `grade` não precisa dele: a ref01 inclina a própria grade) | `inclina` |

Câmeras (`mindset3-cenarios/index.js`): 2D `deriva` (boia até 1 %L/s com respiro de escala de 1%), `aproxima` (2,2%/s com rampa), `recua` (de 1,12 em 2,4 s), `panoramica` (36 px de lado em 3 s, sem tirar o protagonista do eixo), `desce` (110 px em 1,8 s); 3D com perspectiva de verdade nos pontos do desenho: `inclina` (de 19 graus para 3 em 2,2 s) e `orbita` (-9 a +9 graus em 4 s). O cenário anda a 0,4 da câmera (paralaxe).

### Como criar um cenário novo (4 passos)
1. Copie `src/video/engine/mindset3-cenarios/breu.js` (ou ponha o objeto no `pecas.js`: `export const cenariosEstilo = { mindset3: { 'meu-id': { ... } } }`).
2. Use o vocabulário: luz `nenhuma`, `painel`, `lua`, `janela`, `portal`; props `painel`, `fio`, `chao`, `rodape`, `estrelas`, `meteoro`, `horizonte`, `floresta`, `reflexo`, `janela`, `anel`, `graus`, `colunas`, `degraus`, `grade-chao`; câmera um dos nomes acima; `acabamento` { pontos, grao, vinheta, brilho } de 0 a 1.
3. Registre em `mindset3-cenarios/index.js` (fábrica) ou peça no cena.json (`"cenario": "meu-id"`), ou deixe os `temas` levarem o plano até ele.
4. Rode `node --test test/estilo-mindset3.test.mjs`: valida todo cenário registrado.

## Plano automático (`src/video/autoplano-mindset3.mjs`)
Beat de mais de 4,2 s vira dois (na vírgula mais perto do meio). Pessoa citada vira `pessoa` (ilustração, sem buscar foto); foto de lugar ou objeto vira `foto`; porcentagem vira a `grade`; número vira `numero`; "contra", "enquanto", "em vez" com duas coisas desenháveis viram `dupla`; etapas e níveis, `escada`; ritmo e estresse, `onda`; ciclo, `orbita`; o resto, a figura que combina com a fala, sem repetir as 3 últimas; o último beat é o fecho com a figura do começo. Transições em rodízio (nenhuma clareia), "Mas" e "Só que" pedem `morfa`.

## QA e revisão
- `estilo-mindset3-verificar.mjs` (chamado pelo QA do estúdio): câmera (velocidade, aceleração e jerk a 30 qps), centralização (24 px), legenda em uma linha, transição sem clarão, fecho (figura acima da legenda do fecho, pílula encostada na base da área segura sem encostar na legenda; margens e base das constantes de `engine/area-segura.js`), movimento do protagonista nas transições (aviso acima de 80 %L/s) e o número no anel (`conferirNumeroAnel`): o QA mede a caixa REAL do número em cada quadro (measureText) e reprova se algum canto passar de r - 8 px, se o centro do número ou do rótulo sair 8 px ou mais do eixo do anel, ou se a largura passar de 70% do diâmetro interno; reprova também um cenário com anel ou graus atrás do número (tipo `numero-anel`).
- O QA conta como "algo novo na tela" a etiqueta digitada, a segunda figura da dupla, o item do cartão, o grupo da grade e a pílula (`eventosVisuaisM3`).
- Revisão a 5 qps: cada desenho mostra o que a frase diz? Etiqueta fora do traço e inteira? Legenda numa linha, sem nada atrás? Nenhum quadro clareia na troca? O par centrado? O número inteiro dentro do anel, no eixo, com o rótulo colado embaixo (folha com zoom em toda forma com número)? O fecho limpo, com a pílula na base da área segura e a legenda acima dela, sem encostar? A pessoa citada aparece ilustrada, com o nome?

## Pessoa citada (regra do estúdio, 05/11/2026: a mesma exceção da Novela)
A pessoa citada pelo nome vira ilustração em linha no padrão do estilo (forma `pessoa`), com o nome na etiqueta; o plano automático faz isso sozinho e não busca a foto. Foto real só se o usuário pedir (forma `foto` no cena.json). Lugar e objeto com foto seguem em retícula na ficha.

## Área segura (regra do estúdio, 05/11/2026): posições do layout
Toda informação fica dentro de x 72 a 928 e y 262 a 1418 (`engine/area-segura.js`); a área vence a referência, e o que estava fora foi para o ponto mais perto possível:
- @ do perfil: centro em y 280 (`ARROBA_Y`, raiz).
- Legenda (45 px, uma linha de até 28 letras, no máximo 776 px no eixo 540): centro y 1394, base 1417 (antes 1440 e 1463). No beat do fecho, centro y 1279.
- Pílula do fecho: nas referências fica a 85,4% da altura (y 1640 no quadro de 1920, na faixa dos botões do Instagram); agora centro y 1372, base 1417, encostada embaixo da área, com a legenda do fecho 24 px acima. O QA confere a cada instante que ela não encosta na legenda nem cobre texto (`colisaoPilulaM3`, tipo `pilula-legenda`) e o verificador confere a geometria (`caixaPilulaM3`).
- Cartão de dois painéis: x 152 a 928 (antes 60 a 1020); ficha PROFILE: 626 px no eixo (x 227 a 853); cartão comum: x 170 a 910.
- Etiquetas das figuras: de x 72 a 928 (antes até 1008).
- Número no anel: a caixa medida do número e do rótulo vai para a área segura; o anel e as marcas são desenho e podem passar de 928 com a câmera (na prévia, até x 935).
- O medir do estilo manda para a rede da área segura (`areaSegura`) o número, as etiquetas, os textos de cartão e ficha e os títulos legíveis (opacidade 0,5 ou mais).

## O que não copiar
Desenhos, frases, temas de astrologia e afirmações, as palavras de comentário e as pílulas da conta, vozes e músicas das referências. Fontes: Poppins e JetBrains Mono (OFL, já registradas em `AVISOS-TERCEIROS.md`).


## Reanálise de 05/11/2026
Depois da revisão ("números dentro do círculo desalinhados e desorganizados"), as 20 referências foram medidas de novo, uma a uma. A tabela completa, medida contra o estúdio, e a lista de divergências corrigidas ficam na reanálise interna, fora do kit.

## Tamanho e fala (regra do estúdio, 05/11)
- A referência manda no tamanho: a figura fica entre 25% e 66% da largura e até 46% da altura (padrão 620 de altura, até 640 de largura); diagrama, cartão e número até 90% da largura e 57% da altura. O verificador reprova fora da faixa (`tamanho-ref`).
- O desenho mostra a AÇÃO da frase: figuras de ação `soneca`, `dormindo`, `acordando`, `susto`, `hormonio`, `dormitorio` (voluntários dormindo), `cabeca-relogio` (relógio interno), `enviar`. O plano dá prioridade à ação e ao objeto dito pelo nome; o verificador reprova quando a fala pede um desenho e mostra outro (`fala-desenho`).
- A escolha e a conferência fala -> desenho ficam na camada comum `src/video/engine/fala-forma.js` (qualquer estilo liga o seu repertório com `registrarRepertorio`); o mindset3 liga a biblioteca de figuras e as pistas da fala (`PISTAS_FALA_M3`). Frase sem objeto nem ação desenhável vira título em fundo liso, nunca uma figura sorteada.




