

# Estilo novela (Novela: história encenada por personagens ilustrados)

Porte de 04/11/2026 a partir de 6 vídeos de referência de duas contas (análise completa fora do kit). Daqui vem só o padrão transferível: nenhum personagem, imagem, frase, marca, música ou fonte de terceiros. Personagens, cenários, objetos e cartões são desenhados por código (`src/video/engine/estilo-novela-*.js`, `novela-cenarios/`).

Para quem: histórias reais contadas como novela: vidas de santos e de personagens históricos, episódios de guerra, casos do passado, dramas do cotidiano. Funciona em qualquer tema em que a frase tem alguém fazendo alguma coisa num lugar.

Dois tons, escolhidos pelo plano automático pela fala (ou `"tom"` no elemento):
- **clássico** (referências 01 a 04): ilustração pintada com textura de pergaminho, luz quente, legenda serifada (no estúdio, na altura do peito), palavra-chave em versal na cor da página com fio, fecho em arco.
- **série** (referências 05 e 06): drama moderno em segunda pessoa, vinheta forte, legenda condensada em caixa alta a 70% da altura, selo de lugar e hora, contadores, cartões de regra, ficha, carimbo, mapa e bilhete.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout dos Reels)

| Regra | Medida na referência | No estúdio |
|---|---|---|
| Cena contínua | o mesmo lugar e o mesmo elenco por várias frases; quem troca é o plano e a pose | partes vizinhas no mesmo cenário herdam o elenco (`elenco` só quando muda) |
| Personagem | vetorial pintado, sem contorno, pisca, gesticula, anda | 21 personagens e 17 poses só com dados; piscar a cada 2,6 a 4,2 s; boca de quem canta (`fala: true`); ciclo de andar (`caminha`); variação de quem repete o papel |
| Planos | aberto, médio, close, detalhe | médio: cabeça à cintura em 55% da altura; close: a cabeça em 32%; cortes internos com golpe de zoom no beat de 3,4 s ou mais (série: 2,4 s) |
| Câmera | empurrão de 0,6 a 22 %/s, 0,1 a 25 %L/s, nunca para | 11 câmeras multiplano (camadas em profundidade), trava do rosto na área, teto de 30 %L/s, verificador reprova 1 s parado |
| Transição | corte, golpe de zoom (0,35 s), viagem (0,8 s), clarão (0,6 s), fecho em arco | padrão (rodada 4, pedido da revisão): `corte` limpo, `zoom-rapido` (golpe só de zoom, 0,3 s, sem arrastar a mira), `fusao` curta (0,3 s, sem branco), `chicote` (desfoque de movimento) e `fecho`. Fora do padrão: `luz` (clarão branco) só com `clarao: true` no elemento, senão vira fusão e o verificador reprova; `viagem` existe, sem a faixa clara, e o plano automático não escolhe |
| Legenda | serifada no alto (clássico) ou condensada a 70% (série), palavra a palavra | uma linha (regra da casa), na altura do peito nos dois tons (centro em y 1325 no clássico e 1352 na série, 69 a 70% da altura, fora da faixa de botões do app); SEM elipse nem faixa atrás: o contraste vem só do contorno e de uma sombra leve (tinta escura com contorno claro sobre fundo claro, letra clara com contorno escuro no resto), medido a cada quadro, 4,5:1 no mínimo |
| Acabamento | grão nenhum, vinheta 0,13 a 0,66, bloom leve, mancha de pintura | mancha de pergaminho (overlay de textura leve), bloom, vinheta, profundidade de campo, luz do cenário, partículas |
| Áudio | voz calma, trilha suave contínua, quase sem efeito | trilha `antigo`/`ambiente`, 8 LU abaixo da voz; efeitos raros a 20 dB ou mais abaixo do cheio |

**Exceções da casa que continuam (acima da referência):** pessoa citada pelo NOME aparece ILUSTRADA no estilo, como personagem do elenco com `rotulo` (o nome em versal Cinzel sobre a cabeça, ou logo acima da legenda quando não há espaço abaixo do @), exceção do estúdio só para o novela (04/11/2026). Foto real só se o usuário pedir: forma `retrato` com `fotoReal: true` (o verificador reprova `retrato-sem-pedido` sem esse campo; o plano automático nunca gera retrato). Legenda em uma linha (a referência acumula duas). O selo de lugar e hora desce para y 306 (na referência ficava sobre o @ da página). A cor de destaque (palavra-chave, fio, placa, auréola, rota, pino, número, carimbo, selo, pétalas, medalhão) é a da página (`marca/tokens.json`, personalizável), em tons derivados por `tonsDaMarca`; nunca dourado ou amarelo fixo. O fundo do fecho é o fundo da página.

## Formas (`{ "tipo": "novela", "forma": ... }`)

| Forma | O que mostra | Campos |
|---|---|---|
| `cena` | o elenco no cenário | `elenco`, `plano`, `foco` (índice de quem a câmera segue), `enquadra: "todos"` (o plano médio mira o meio do elenco: aperto de mão, conversa a dois), `semCorteInterno` (segura o plano inteiro na ação), `brilho` (faíscas na chave), `raios` (luz do alto) |
| `grupo` | muitos personagens (fila, multidão) no plano aberto | `elenco` (use `fila: 1` para a fileira de trás) |
| `close` | o rosto de quem fala ou reage | `elenco`, `foco` |
| `retrato` | foto real, SÓ quando o usuário pede (padrão: a pessoa citada vira personagem com `rotulo`) | `fotoReal: true` (obrigatório), elemento `imagem`, `rotulo` (o nome na placa), `campos` (série: `[["CARGO", "PAPA"]]`) |
| `objeto` | um objeto de perto sobre a cena desfocada | `objeto` (taca, livro, vela, cesta, carta, celular, chave, cruz, pao, garrafa, bola, arvore-natal, presente, radio, relogio-bolso, moeda, cajado, lanterna, cigarros, caneca) |
| `livro` | o livro aberto com a linha da fala escrita à mão | `texto` (até 90), `chave` (circulada na cor da página) |
| `bilhete` | o bilhete nas mãos, escrito ao vivo | `texto`, `chave` |
| `mapa` | a rota desenhada entre os lugares ditos | `rota` (2 a 5 nomes da fala) |
| `numero` | o número que conta (ano não conta) | `texto` (até 14), `rotulo` |
| `cartao` | cartela de título (clássico) ou cartão de regra (série) | `texto` (até 24), `rotulo`, `numero` |
| `fecho` | a última cena encolhe no arco sobre o fundo da página, medalhão, título e o CTA | `titulo`, `subtitulo`, `cta` (a palavra em caixa alta sai na cor da página) |

No `fecho`: `moldura` (`arco`, o padrão, ou `oval`), `titulo`, `subtitulo`, `cta`. Em qualquer forma: `composicao: "lateral"` (libera o protagonista fora do eixo, só quando o lado é intencional), `hud` (o selo "LUGAR · DIA · HORA", até 44), `painel` (`[{ "rotulo": "MENSAGENS", "valor": 312 }]`), `carimbo` (até 14 letras, na palavra-chave), `transicao`, `chave`, `tom`.

Ator do elenco: `{ "id": "freira", "x": 300 (px ou 0 a 1), "pose": "de-pe", "acao": "rezando" (pose na palavra-chave), "acaoEm": 0.8, "segura": "vela" | { "tipo": "vela", "escala": 0.8 }, "caminha": { "de": 200, "ate": 500 }, "fala": true, "olhar": "camera", "espelha": true, "fila": 1, "aureola": true, "expr": "sorriso" }`.

## Cenários e câmeras

No cena.json, por beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`. Sem pedido, o plano automático escolhe o cenário pelo assunto, troca só quando a frase pede outro lugar e escolhe a câmera em rodízio sem repetir a vizinha.

Clássico: `montanha-gruta`, `igreja-praca`, `refeitorio`, `claustro-tijolo`, `oficina-estante`, `sala-lareira`, `rua-antiga`, `telhados-cidade`, `sala-simples`, `muro-patio`, `campo-aereo`, `capela-altar`, `arco-pedra`, `gabinete`, `livro-mesa`. Série: `sala-sofa`, `sala-tv`, `espaco-globo`, `rua-cidade`, `estrada`, `banheiro-espelho`, `calcadao`, `cabana-mato`, `interior-madeira`, `onibus`, `trilhos-noite`, `escada-predio`, `cidade-noite`, `porta-corredor`. Guerra de trincheira: `trincheira-noite`, `terra-de-ninguem`. Fecho: `marca-pagina` (fundo e acentos da página).

Câmeras: `empurra` (push-in de ~4%/s, a dominante), `recua` (abre e assenta num empurrão mínimo), `pan`, `travelling` (3D: o fundo corre menos que a frente), `pedestal`, `tilt`, `orbita` (3D: fundo e frente deslizam em sentidos opostos), `close`, `deriva`, `segue` (a mira acompanha quem anda), `zoom-rapido` (golpe de 0,35 s com borrão).

### Como criar um cenário novo (4 passos)

1. **Escreva o módulo, só com dados.** No projeto, em `projetos/<nome>/pecas.js`:
   ```js
   export const cenariosEstilo = { novela: {
     'porto-noite': { nome: 'Porto com neblina', tom: 'serie', temas: ['porto', 'navio', 'cais'],
       ambiente: { fundo: ['#101820', '#05080C'] }, luz: { tipo: 'noite', cor: '#C8D8FF', forca: 0.8 },
       nevoa: { cor: '#8A9AB8', alfa: 0.4, altura: 0.5 }, particulas: { poeira: 0.2 },
       props: [{ tipo: 'ceu', p: 0.05, cores: ['#0C1424', '#26304A'] }, { tipo: 'predios', p: 0.3, y: 1100 }, { tipo: 'neblina', p: 0.6, y: 1250 }],
       palco: { chao: 1700, escala: 0.8, xs: [540] }, clima: 'solene', camera: 'empurra', acabamento: { manchas: 0.2, vinheta: 0.6, bloom: 0.3, dof: 0.6 } },
   } };
   ```
   Para valer em todo projeto, acrescente o objeto em `src/video/engine/novela-cenarios/classico.js` ou `serie.js` (ou num arquivo novo importado em `novela-cenarios/index.js`, repositório do mantenedor).
2. **Use só o vocabulário:** props de `estilo-novela-props.js` (céu, nuvens, sol, lua, estrelas, montanha, colinas, campo, caminho, árvore e árvores, gruta, igreja, casa, casario, telhados, muro, parede, chão, janela, porta, arco, cruz, quadro, estandarte, mesa, estante, lareira, banco, cadeira, altar, raios, sofá, tv, relógio, planta, poste, prédios, estrada, trilhos, ônibus, escada, trincheira, arame, cratera, neblina, fogueira, globo, escrivaninha, mapa-parede, cortina, objeto e objetos); `forma` escolhe o subtipo (parede `reboco`, `tijolo`, `pedra`, `madeira`, `listrado`, `lisa`; chão `ladrilho`, `tijolo`, `pedra`, `tabua`, `terra`, `grama`, `neve`, `lama`, `calcadao`, `asfalto`; árvore `redonda`, `cipreste`, `pinheiro-manso`, `pinheiro`, `oliveira`, `seca`); `p` é a profundidade (0 longe, 1 o plano dos personagens, acima de 1 o primeiro plano com `frente: true`); luz `dia`, `tarde`, `amanhecer`, `interior`, `janela`, `vela`, `noite`; partículas `poeira`, `faiscas`, `neve`, `petalas`, `penas`, `chuva`.
3. **Peça no cena.json** (`"cenario": "porto-noite"`) ou deixe os `temas` levarem o plano automático até ele.
4. **Rode o teste e o QA:** `node --test test/estilo-novela.test.mjs` valida todo cenário registrado; o validador da cena recusa id, prop ou cor fora do contrato; o verificador do QA (`estilo-novela-verificar.mjs`) reprova câmera parada ou rápida demais, rosto fora da área ou sob a legenda, legenda que não cabe numa linha e beat curto demais.

Personagem novo, do mesmo jeito: `export const personagensEstilo = { novela: { pescador: { nome: 'Pescador', temas: ['pescador'], corpo: 'tunica', roupa: '#5A6A7A', roupa2: '#D8C8A8', calca: '#3E4A56', sapato: '#2A221C', pele: '#C68A64', cabelo: '#2E2218', penteado: 'chapeu', barba: 'cheia', olhos: '#2E2218', idade: 'adulto' } } }` (pose nova em `posesEstilo`).

## Plano automático

`src/video/autoplano-novela.mjs`: tom pela fala (segunda pessoa moderna vira série); cenário pelo assunto, trocando só quando a frase pede outro lugar; elenco pelos papéis ditos (plural vira grupo); pessoa citada pelo nome vira personagem ilustrado com `rotulo` (`figuraPara`: papa, freira, monge, imperador, rainha, rei, oficial, senão inventor ou executivo; São/Santa ganha auréola), nunca retrato com foto; número dito vira o número que conta; carta, livro e processo viram o livro escrito; bilhete vira o bilhete; rota e km viram o mapa; pose pelo verbo na palavra-chave (rezar, apontar, acenar, abençoar, cantar, andar, ajoelhar, segurar) e o objeto citado nas mãos; plano aberto no primeiro beat de cada lugar, depois médio e close; fusão curta (ou corte) na troca de lugar, chicote às vezes na série, golpe de zoom na troca de plano (nunca clarão nem viagem); selo "DIA N" e carimbo de alerta na série; o último beat é o fecho.

## QA e revisão

- O QA mede a cena como UM protagonista (o elenco e o cartão juntos); número e cartão contam como título do estilo. A legenda informa o contraste medido e o QA reprova abaixo de 4,5:1.
- Revisão a 5 qps: a cena mostra o que a frase diz e quem age gesticula na palavra? Pessoa citada aparece ilustrada, reconhecível pelo traje, com o nome? A legenda fica numa linha, legível, sem cobrir o rosto? A câmera nunca para, nunca corta o rosto e nunca dá salto nem tranco? Nenhuma transição brilha em branco entre as cenas? O fecho tem o arco inteiro, o medalhão, o título e o CTA na cor da página?

## O que não copiar

Os santos, os personagens e o "último homem" das referências, as frases devocionais, o medalhão e o brasão das contas, a enquete A/B como fecho, músicas e o @. Fontes do estúdio, todas OFL e já no kit: EB Garamond (legenda), Cinzel (palavra-chave, placa, número e fecho), Lora itálica (linha do CTA), Antonio Bold (série), Montserrat (ficha) e Euphoria Script (escrita à mão), registradas em `AVISOS-TERCEIROS.md`.

## Rodada 2 (04/11/2026): energia de câmera, planos, legenda e personagens
A sessão principal rodou o video-sharingan na prévia: pico de câmera de 2,0 %L/s contra 8 a 10 nas referências clássicas (ref 01 9,3; 02 9,7; 04 8,0; 03 27,9) e 5,5 a 6,3 na série; planos de 3 a 4 s quase parados (o objeto, o número, o fecho); legenda pequena; bolsos do uniforme como caixas vazias; personagens frontais demais. Tudo foi para a raiz:
- **Deslize de câmera em todo plano de ação** (`REGRAS_NOVELA.camera.deslize`: 9 %L/s no clássico, 6 na série, 10% a mais no gancho): na tela, power1.out (entra andando e desacelera até 60%, nunca para), no sentido que leva o rosto de quem age para o centro; empurrão de 6%/s; travelling, pan e órbita mais largos. A trava do rosto não age no plano aberto (o geral mostra o lugar inteiro, e o elenco pode ir até a borda, como nas referências).
- **Cartões e fecho andam:** a cena atrás do cartão desliza 48 px/s e empurra 3,5%/s; o cartão anda 30 px/s e cresce 2,5%/s (está mais perto, paralaxe); o fecho empurra 2,5%/s depois de entrar no arco.
- **Mais planos:** cortes internos a partir de 2,6 s de beat (série 2,0 s), 2 ou 3 planos; o terceiro é a REAÇÃO do ator mais perto do foco (contracampo das referências 02 e 05). Em cada plano interno quem a câmera segue gira 3/4 (o corpo estreita, os traços deslizam) e, se estava parado de pé, muda de gesto no corte (mão no peito, a mão que fala).
- **Legenda maior:** clássico 72 px (palavra-chave 66) com até 26 caracteres; série 88 px com até 15; continua em uma linha.
- **Uniforme:** bolso de peito com pala, botão e sombra de tecido, no lugar do retângulo de contorno.
- **Verificador:** avisa `camera-timida` (pico abaixo de 6 %L/s no clássico e 4 na série em plano de ação de 1,2 s ou mais); o rosto conferido é o de quem a câmera segue em cada plano (no plano aberto não confere).

## Rodada 3 (04/11/2026): pedidos da revisão
- **Legenda sem elipse:** a sombra escura ou clara em elipse atrás da legenda saiu de todos os planos. A leitura vem do contorno (6 px no clássico, 9 na série) e de uma sombra leve; sobre fundo claro liso a letra vira tinta escura com contorno claro. O verificador continua medindo 4,5:1.
- **Legenda na altura do peito nos dois tons** (`REGRAS_NOVELA.legenda`: clássico y 1325, 72 px; série y 1352, 88 px), em uma linha, fora da faixa de botões do app. A câmera põe o rosto em y 800 e a trava mantém o rosto entre y 330 e 1205 (menos o raio), então no close o rosto fica acima da legenda.
- **Pessoa citada ilustrada** (exceção do estúdio só no novela): personagem do elenco com `rotulo`. Personagens novos em `novela-cenarios/personagens.js`: `papa` (batina branca, mozeta, solidéu, óculos redondos, crucifixo no peito com corrente), `imperador` (manto e louros), `inventor` (terno, barba cheia, grisalho); penteados `solideu` e `louros`; acessórios `oculos` e `mozeta`; pose `cumprimentando`. Outras figuras históricas nascem como dado: um personagem novo em `personagensEstilo` do `pecas.js` do projeto (corpo, cores, penteado, acessórios), validado por `validarPersonagemNovela`.
- **Foto só a pedido:** `retrato` exige `fotoReal: true`; sem isso o verificador reprova (`retrato-sem-pedido`). O plano automático troca a foto de pessoa por personagem.
- **Decisões da revisão:** legenda em duas linhas, NÃO (fica uma). Selo de lugar e hora em y 306, SIM. Enquete A/B como fecho opcional: aprovada, PENDENTE (não implementada; entra como forma `enquete` no fecho quando houver pedido).

## Rodada 4 (04/11/2026, noite): transições sem branco e câmera sem salto
A revisão reprovou as transições "que brilham em branco" e de uma "movimentada estranha" entre 18 e 19 s; o Sharingan v2 mediu pico de 88,9 %L/s.
- **Causa da movimentada:** no corte interno (plano médio para outro plano médio, aos 18,7 s) o golpe de zoom arrastava a mira do enquadramento anterior até o novo em 0,35 s, com borrão: o quadro inteiro "escorregava". O verificador pulava os quadros do golpe, então o pico passava batido.
- **Golpe novo (raiz, `cameraParte`):** o corte é limpo (a mira já nasce no plano novo); o golpe só acontece quando o plano muda de tamanho (aberto, médio, close) e é só zoom: o quadro entra 7% mais aberto e assenta em 0,3 s (power2.out), sem andar de lado.
- **Trava macia do rosto (`travaMacia`):** a correção cresce em parábola numa faixa de 70 px antes do limite e para exatamente nele. A trava dura invertia o deslize quando o rosto encostava na borda (tranco de 339 %L/s por segundo no b07).
- **Transições:** padrão = corte limpo, golpe de zoom, fusão curta (0,3 s) ou chicote. O clarão (`luz`) só com `clarao: true`; sem isso o motor faz fusão e o verificador reprova (`clarao-sem-pedido`). A viagem perdeu a faixa clara da emenda e não é mais escolhida pelo plano automático.
- **Verificador estático:** mede TODO quadro que não é corte, golpe incluído: salto acima de 30 %L/s reprova (`camera-salto`), mudança de velocidade acima de 260 %L/s por segundo reprova (`camera-tranco`). A velocidade é o quanto o centro do quadro anda na tela; o zoom é medido à parte.
- **QA depois do render (`claroesTransicao`):** em cada troca de beat, o quadro mais claro de -0,1 a +0,7 s não pode passar das duas cenas vizinhas por mais de 25 tons (de 0 a 255); reprova `clarao-transicao`. No vídeo da rodada 3 ele pega os 4 clarões (5,8 s +29; 10,6 s +90; 20,9 s +43; 37,4 s +40); no novo, nenhum.

## Rodada 5 (04/11/2026, noite): câmera viva no eixo, cartão centrado e fecho redesenhado
A revisão achou a v3 melhor, mas pediu câmera mais viva e cinematográfica, apontou o cartão "100 MIL" 70 px para a esquerda e achou o fecho fraco (o @ sobre o arco, soldados cortados, hierarquia e espaçamento fracos, pétalas aleatórias).
- **Causa do cartão torto:** desde a rodada 2 o cartão andava 30 px/s de lado (paralaxe), e a caixa que o verificador conferia era fixa, então ninguém via. Agora o cartão fica no eixo, cresce 2,5%/s e flutua 6 px na vertical (`cartaoXform`, a mesma conta no desenho e no verificador); quem anda é a cena atrás.
- **Câmera (`cameraParte`):** o movimento lateral virou paralaxe de arco: o fundo corre para um lado e o primeiro plano para o outro, e quem está no plano dos personagens fica no eixo. A amplitude cresce com a duração do plano (até 115 px) e muda por câmera (órbita e travelling mais, pedestal e tilt menos), sempre em ease-in-out. A câmera acompanha quem anda (o quadro abre até 2x para o chão não correr), respira (0,4% de zoom e 3 px num ciclo de 3,4 s) e alterna a direção a cada plano (índice global `gi`). Os movimentos verticais são medidos na tela, então o close não dispara. Nos planos internos nenhum movimento repete o vizinho. Tetos mantidos: 30 %L/s e tranco de 260.
- **Enquadramento:** o plano aberto centra o meio do elenco (não o meio do cenário), o médio aceita o foco perto da borda (x de 120 a 960).
- **Verificador de centralização (`descentralizado`):** em TODOS os quadros (30 qps), o centro horizontal do protagonista (cartão, selo, número, retrato e objeto pela caixa desenhada; personagem pelos ombros; o elenco inteiro no plano aberto e no plano a dois; o busto no fecho) fica a até 24 px do meio. Composição lateral intencional: `"composicao": "lateral"` no elemento.
- **Fecho novo (`fecho`, `molduraFecho`, `enquadrarFecho`):** moldura abaixo do @ (topo 300) com a cena recuando para dentro em 0,9 s (ease-in-out); dentro, o busto de quem a câmera seguia no último beat com elenco, sozinho, no eixo, sereno (sem o gesto da palavra-chave) e olhando para a câmera; fio creme, faixa de pergaminho, fio interno na cor da marca, vinheta interna, luz quente atrás e sombra de contato; pedra de fecho no alto do arco e o medalhão com a inicial da página selando a base; título em Cinzel 78 px com margem (encolhe para caber em 880 px), o ano entre dois fios com losangos e o CTA da página ("segue a página e comenta ILUSTRANDO", a palavra na cor da marca), cada um entrando em sequência (0,95 s, 1,2 s e 1,45 s); poeira dourada que sobe na luz da moldura no lugar das pétalas; 3 s de respiro e empurrão de 1%/s no eixo. Tudo acima da faixa do app (base 1560).
- **Duas alternativas, comparadas em quadros ampliados:** `moldura: "arco"` (padrão: fiel às referências 01 a 04, janela mais larga que mostra o lugar, pedra de fecho e selo dão mais presença) e `moldura: "oval"` (camafeu com laço de louros, mais retrato de família). Escolhi o arco; a oval fica como variante.
- **Verificador do fecho:** reprova moldura sob o @ e CTA na faixa do app (`fecho-area`) e rosto do busto fora do terço de cima da moldura (`fecho-busto`); avisa título com mais de 26 letras.
- **Não feito nesta rodada:** rack focus entre dois personagens e plano sobre o ombro (ficam como próximos passos; pedem desfoque por ator e um ator em primeiro plano).

## Rodada 6 (04/11/2026, noite): o quadro inteiro anda
O Sharingan da v4 mostrou o contrário do pedido: mediana de 0,6 %L/s, máxima de 7,3 e 9 de 12 planos quase parados. Motivo: a paralaxe da rodada 5 movia só as camadas, e a parede logo atrás dos personagens (profundidade 0,85) quase não andava; o quadro, no todo, ficava parado.
- **Câmera de quadro inteiro (`cameraParte`, `REGRAS_NOVELA.camera.viva`):** em todo plano, zoom contínuo (empurra ou recua, alternando de um plano para o outro, 3,5 a 6 %/s, em curva meio linear, meio ease-in-out: anda o plano todo e nunca para), vertical de câmera medida na tela (70 a 120 px por plano; pedestal e tilt andam mais) e travelling lateral curto que leva o protagonista de -19 a +19 px (dentro dos 24 do verificador). A paralaxe vai por cima.
- **Paralaxe que chega ao fundo próximo (`ganhoParalaxe`):** cada camada corre a raiz quadrada da distância ao plano dos personagens (a parede em 0,85 corre 39%, o céu 100%, o primeiro plano para o outro lado).
- **Quem anda já move o quadro:** no plano médio de quem caminha o quadro abre até 1,5x e a câmera viva baixa para 40% (o fluxo das pernas e do chão chegava a 29 %L/s).
- **Cartões e fecho:** a cena atrás do cartão corre 75 px/s, sobe 22 px/s e empurra 5,5%/s; o cartão cresce 4%/s, sempre no eixo. O fecho recua para a moldura em 1,2 s (era 0,9 s, pico de fluxo), os elementos entram 0,25 s depois e o conjunto empurra 2,2%/s.
- **Medida por fluxo óptico** (script próprio com OpenCV Farneback a 15 qps, média do módulo do fluxo fora da faixa da legenda e do @, por plano, sem os 0,4 s de corte e sem o recuo do fecho):

| | v4 | v5 | meta |
|---|---|---|---|
| Mediana por plano | 1,51 %L/s | 3,65 %L/s | 3 a 6 |
| Máxima | 27,2 %L/s (quem anda, 22,4 s) | 10,7 %L/s | até 20 |
| Planos abaixo de 0,8 %L/s | 3 de 22 | 1 de 22 (a bola) | no máximo 3 |
| Planos parados por 1 s | 0 | 0 | 0 |

Verificador estático da v5: salto máximo de 23,4 %L/s (teto 30), tranco máximo de 89 (teto 260), desvio máximo do eixo de 21 px (teto 24), 0 falhas.

## Rodada 7 (05/11/2026): sem pulo seco de câmera
Na revisão: "tem algumas cenas ainda que a câmera dá uns pulos secos". Medi o render da v5 quadro a quadro (30 qps, movimento global por pontos rastreados) e achei quatro causas:
- **Jump cut nas trocas de plano:** médio para médio do mesmo ator (7,2 s, 12,0 s, 14,0 s, 39,1 s) saltava 8 a 11% de zoom num quadro, e o corte para quase o mesmo quadro parece pulo. Agora (`continuidadeCamera`) a troca com o mesmo sujeito (`sujeitoPlano`: o elenco no aberto, o par no plano a dois, ou o ator) e zoom a menos de 1,45x vira MOVIMENTO: a câmera sai de onde estava e chega ao enquadramento novo em smootherstep, num tempo que respeita 25 %L/s e 55% de zoom por segundo (0,9 a 2,2 s). Corte só quando muda o tamanho do plano, o ator ou o lugar. Vale também entre beats do mesmo lugar com corte.
- **O boneco que pulava junto:** o giro 3/4 e o gesto do plano interno trocavam de uma vez; agora entram em 0,6 s e 0,5 s a partir do giro e do gesto do plano anterior (`viraSuave`, gesto como ação com início no plano).
- **Chicote rápido:** 0,25 s (342 px num quadro). Agora 0,45 s em smootherstep; na prévia a troca virou fusão.
- **Começo do fecho:** cortava da última cena para o quadro do busto (16% de zoom num quadro). Agora a câmera sai de onde o último beat estava e chega ao busto em 2,4 s, os outros personagens somem em fusão, e o recuo para a moldura leva 2,4 s; título, ano e CTA entram depois (2,2 s, 2,45 s e 2,7 s).
- **Golpe de zoom mais leve:** 4% em 0,4 s (era 7% em 0,3 s).

## Fila de misticismo (05/11/2026): relatos bíblicos, borda e fecho longo
O Reel "A mulher do fluxo" (fila de produção do estúdio) pediu Jesus, a mulher, discípulos e multidão; o plano automático punha camponesa europeia em gabinete e trincheira. Foi para a raiz:
- **Personagens bíblicos** (`novela-cenarios/personagens.js`): `jesus` (túnica creme, manto vermelho no ombro, cabelo longo, barba), `mulher-biblica` (vestido e capuz azul, manto claro), `discipulo` (túnica marrom, manto azul), `povo-biblico` (lenço branco na cabeça, barba) e `povo-biblica` (vestido e capuz terracota). Acessório novo `manto-ombro` (faixa de tecido do ombro ao quadril, com dobras). Use `cena` com plano aberto para a multidão: no `grupo` os rostos da fileira de trás caíam na altura da legenda.
- **Cenário `vila-galileia`** (clássico): rua de terra com muro de adobe, casas de teto plano, oliveiras e colinas, luz de tarde e poeira.
- **Borda clara no desfoque:** o blur do fundo (profundidade de campo) e do primeiro plano puxava o transparente de fora do quadro e a borda clareava num degradê de 10 px sobre o fundo claro do cenário (QA `borda-clara` em 2,7% dos quadros). A camada desfocada agora é desenhada 3 raios maior de cada lado (`sangriaBlur`).
- **Fecho longo:** o empurrão de 2,2%/s não tinha teto; num fecho de 7 s a pedra do arco subia até o @. Agora sai a 2,1%/s e se aproxima de 1,5% sem parar (a pedra fica abaixo do @ em qualquer duração).
- **Verificador (`medirPulos`, falha `pulo-seco`):** o vídeo inteiro a 30 qps, quadro a quadro, com a mesma conta da câmera do render: dentro de um plano (ou de uma troca contínua) o centro do quadro anda no máximo 12 px e o zoom muda no máximo 2% por quadro; corte para quase o mesmo quadro (mesmo sujeito, zoom a menos de 1,45x) reprova. Transições declaradas (fusão, chicote, viagem, clarão a pedido) e o fecho ficam de fora. `corteSeco: true` no elemento pede o corte de propósito (e o verificador reprova se for jump cut).

## Melhorias de 05/11/2026 (noite, pedido da revisão depois do Reel da cura): a fala no corpo, multidão viva, figurantes, legenda
A revisão do Reel "A mulher do fluxo" pediu que o desenho mostre melhor o que se fala, com personagens e detalhes mais polidos. Na revisão a 5 qps, os pontos pobres eram estes: o toque nas vestes aparecia como dois bonecos parados lado a lado; "Jesus parou" não tinha giro nenhum; a multidão "encostando nele" era uma fileira imóvel de clones com a mesma roupa; a mulher curada fazia o mesmo gesto da mulher triste; o rosto sob o capuz parecia careca; as dobras do manto eram três riscos retos; e a legenda clara ficava fraca sobre a túnica branca. Tudo foi para a raiz:
- **Poses de ação** (`novela-cenarios/personagens.js`): `tocando` (o corpo inclina e a mão desce e vai para a frente, na barra do manto de quem está ao lado), `virando` (ombros e cabeça procuram quem tocou) e `curada` (mãos abertas no peito, rosto para o alto, olhos fechados).
- **Virar na palavra** (ator `virar`, de -1 a 1): o giro 3/4 muda de `vira` até `virar` em 0,5 s a partir da ação (`acaoEm`).
- **Close do toque** (objeto `manto-toque`): a barra do manto desce do alto do quadro, com dobras, borda tecida e franja que balança; a mão entra de baixo à esquerda e toca a franja, com uma luz quente que pulsa no ponto do toque.
- **Multidão viva** (`multidao: true` no elemento): quem não é o foco balança, inclina e se acotovela em ondas lentas e defasadas (±8 px e ±4°, dentro dos 24 px do verificador).
- **Figurantes variados** (`variaRoupa` no personagem): quem repete o papel muda também a cor da roupa, além da pele, do cabelo, da barba e da altura; o povo bíblico tem cinco tecidos de época.
- **Rosto sob o capuz**: o cabelo aparece repartido na testa e a borda do capuz cai por cima, com a dobra do pano.
- **Dobras do manto no ombro**: faixas macias de sombra e luz que seguem a diagonal do pano e a orla tecida, no lugar dos riscos retos.
- **Legenda sobre fundo misto** (letra clara com o pior pixel acima de 0,72, como túnica branca ou manto claro atrás de parte da linha): contorno de 8,5 px e sombra mais densa, ainda sem faixa nem elipse (regra do estúdio).
- **Plano automático pela ação** (`autoplano-novela.mjs`): "tocou", "encostou" -> `tocando`; "parou", "virou" -> `virando`; "curada", "sarou" -> `curada`; "sofria", "doente" -> `cansado`; "multidão", "empurrando", "encostando", "todos os lados" -> `multidao`; e "tocou" com "vestes", "manto" ou "roupa" -> o close `manto-toque`.
- **Teste:** `novela (melhorias 05/11)` em `test/estilo-novela.test.mjs`.

## v3 de 05 e 06/11/2026 (revisão: "representar bem o que está sendo falado" e "os sfx podem melhorar muito")
- **Mais ação no corpo:** poses `mao-no-ombro` (a mão sobe e vai ao ombro de quem está ao lado), `olhando-maos` (cabeça baixa, mãos à frente) e `mao-na-boca` (o silêncio, não chamar).
- **Tempo como cena** (objeto `anos-marcas`): os anos riscados na parede um a um, com a lamparina e a luz de dia e noite; o número aparece pequeno no fim. O close de objeto recebe o tempo do beat (`tb`, `dur`), para objetos que contam o tempo.
- **`manto-toque` com `intenso: true`:** a luz do toque mais forte (a intenção).
- **Multidão:** frequência própria por figurante e um segundo harmônico (até 20 px de vaivém, menos de 1 px por quadro, sem tremor).
- **Som pela ação da imagem** (`eventosNovela`, `NIVEL_SFX_NOVELA`):
  - mapa ação -> som: tecido no toque e no giro; passos em quem caminha; murmúrio na multidão viva; respiração no close de quem sofre ou reza; brilho só na cura e na luz do alto; papel e risco no livro e no bilhete; riscos nos anos; baque no carimbo; sino no fecho;
  - nada de whoosh em todo corte de plano no clássico, nada de clique de interface, nada de brilho de enfeite;
  - nível por tipo (dB): murmúrio -34, passos -30, respiração -31, tecido -27, brilho -33, papel -26, risco -31, baque -23, sino -24;
  - `silencio: true` no elemento cala o beat.
  - Os sons `tecido`, `passos`, `murmurio` e `respiracao` são sintetizados (ruído filtrado), na biblioteca do clássico.
- **Disciplina de efeitos de todo estilo** (`disciplinarSfx` em `sfx-estilos.mjs`, menos os smooth e o Pleno): o mesmo som repetido em até 3 s varia semente, tom e ganho; dois iguais no mesmo instante viram um; no máximo 2 efeitos ao mesmo tempo e 1 cama de ambiente.
- **Trilha** (`mixagem.mjs`): a subida nos vales mira 11 LU abaixo da voz (não 12).

## v4 de 06/11/2026 (revisão: "a câmera desce demais, as pessoas ficam no pé do quadro e a legenda tampa o rosto delas")
- **Rosto acima da legenda, em todo quadro** (`cameraParte`, `REGRAS_NOVELA.rostoLegenda`, `faixaLegendaNovela`): o queixo (cabeça + 0,65 r) de TODO ator visível, não só o do foco, fica 50 px acima da faixa da legenda (a faixa começa em y ~1261 no clássico; com 14 px a legenda encostava no queixo da multidão). Vale no plano aberto, no plano a todos e na multidão. Quem está fora do quadro pesa zero (rampa de 150 px além da borda). A câmera sobe só o necessário, com trava macia, sem tranco.
- **QA `legenda-rosto`** (`rostosSobLegenda` em `estilo-novela-verificar.mjs`): a 5 qps, enquanto a legenda está na tela, nenhum rosto (testa ao queixo, ±0,8 r) pode cruzar a caixa da linha (largura pela fonte, até 776 px). Falha, não aviso.
- **Plano a todos de verdade:** o teto de zoom do `enquadra: "todos"` valia só quando o meio do elenco caía fora do foco. Com o foco no meio (o trio simétrico), o quadro fechava 3,9x no rosto do foco e os outros sumiam. Agora vale sempre.
- **v5 (06/11/2026, revisão: "os personagens ainda ficam muito embaixo, pés na borda e céu vazio em cima"):**
  - O plano aberto deixou de ser a câmera parada no meio do cenário (rostos em y ~1100, pés em ~1750). Agora o elenco, da cabeça aos pés, ocupa ~920 px e fica centrado em y 870, no meio da área segura (`REGRAS_NOVELA.enquadramentoGrupo`, `grupoMundo`, `cyGrupo`). O zoom sobe até 1,7x, o grupo largo cabe em 1000 px, e a legenda cai sobre o corpo.
  - O mesmo vale para o plano a todos que mostra o corpo inteiro e para quem anda no plano médio.
  - O topo da cabeça nunca sobe acima de y 360 no enquadramento. Com o zoom e a vertical da câmera viva, uma trava macia segura toda cabeça visível abaixo de y 300 (fora do @). A trava da legenda vence quando as duas disputam.
  - A largura que limita o zoom conta só a fila da frente: a multidão do fundo pode sair pelas bordas, e a legenda cai sobre os corpos, não no chão vazio.
  - A câmera pode mirar até 300 px mais baixo no mundo, porque o chão das camadas vai até y 3000.
  - **QA `grupo-baixo`** (`grupoBaixo`, 5 qps, falha): reprova quando o centro vertical do grupo visível passa de y 1248 (65% da altura), contado do topo da cabeça aos pés, ou até y 1430 no plano que corta o corpo. No plano aberto, reprova também os pés abaixo de y 1700.
- **Refino dos personagens (06/11/2026, em aprovação na revisão do estúdio):**
  - **Rosto:** o olho é amendoado, com a pálpebra cobrindo a borda da íris, os cílios no contorno (a ponta de fora só nas mulheres), o vinco da pálpebra, a linha de baixo clara, a íris com anel e dois brilhos. A sobrancelha é uma pincelada que afina. O nariz tem dorso claro, asas, narinas e a sombra no buço. A boca tem o arco do lábio de cima e o brilho do de baixo. O queixo tem sombra. O volume do rosto vem da sombra no lado oposto à luz e embaixo da mandíbula, da luz de borda e do brilho na testa e na maçã.
  - **Rosto próprio do figurante** (`rostoV` em `variar`, `tracosRosto`): nariz, olhos, sobrancelha, boca, queixo, cor da bochecha, sulco e às vezes uma pinta. Personagem com nome não varia.
  - **Mãos:** o dorso alarga até os nós, os dedos afinam, com junta e unha clara, e o polegar tem base. O punho tem os quatro dedos em rolos.
  - **Roupa:** as dobras são cunhas que abrem da cintura à barra, com miolo escuro e crista clara. A barra escurece. Há sombra da gola e das axilas, trama leve do pano, e a manga enruga em leque, com crista de luz.
  - **Cabelo e barba:** as mechas alternam dois tons e há uma faixa de brilho, tudo dentro do cabelo. O capuz tem crista de luz e faz sombra na testa. O lenço tem dobras. A barba tem fios curtos dentro do contorno.
  - **Sombra de contato:** um miolo escuro junto dos pés e uma sombra alongada para o lado oposto à luz.
  - **Custo:** o render da prova de 108 s levou 71 a 108 s, contra 82 s antes.
- **Refino, rodada 2 (06/11/2026; antes e depois em `refino-personagens/rodada2/`):**
  - **Mãos de longe:** abaixo de 1,1 px por unidade a mão cresce até 1,35x e ganha contorno e separação dos dedos em pixels de tela fixos. Os dedos se leem no plano aberto. Unha e junta só de perto.
  - **Lenço do homem do povo:** pano opaco que cobre a cabeça e cai até a nuca, com a barra enrolada, dobras e sombra na testa. A cor sai de uma lista de panos da época (`LENCOS`), nunca perto do tom de pele.
  - **Peito:** a oval clara do peito saiu. A luz do ombro virou um filete na curva do ombro.
  - **Homem sem barba:** maçã do rosto, sombra de barba rala, sulco e linha da testa pela idade do figurante (`tracosRosto`: `idade`, `rala`).
  - **Sorriso:** `sorriso` (0 a 1) na ficha levanta os cantos da boca no repouso. Jesus tem 0,55. Com barba, o bigode é largo e se funde à barba.
  - **Identidade fixa:** `identidade: true` na ficha (Jesus, a mulher, o discípulo) faz o personagem nunca variar pele, cabelo nem barba pela posição no elenco. Mulher nunca ganha bigode na variação.
  - **Render igual ao de antes:** a cabeça vira bitmap em cache (pela ficha e pelo estado do rosto), os gradientes ficam em cache, os traços saem em lote e o detalhe fino só aparece de perto (`LOD`). O tempo ficou o mesmo do commit a0d844d6, dentro do ruído da máquina (`17-tempos-render.md`).
- **Quem vai na moldura do fecho:** `retrato: "<id>"` no fecho põe na moldura esse personagem, tirado da última cena em que ele aparece. Sem o campo, segue o foco da última cena com gente (no Reel da cura isso era o monge da capela, não a mulher do título).
- **Mais poses da fala:** `afastando` (o corpo recua e as mãos sobem: "não deveria tocar ninguém"), `impedindo` (o braço estendido barra a passagem: "ser impedida") e `sem-entender` (as mãos abertas para os lados: "não entenderam"). O plano automático as escolhe pelos verbos (impedir, barrar, afastar, evitar, impura, rejeitar, "não entend...").
- **Som:**
  - a luz do alto (`raios`) virou swell macio, e o brilho ficou só na cura e no toque (timbres alternados);
  - vários `tocando` no mesmo beat (a multidão que encosta) viram toques em cascata, 0,14 s um do outro e 2 dB mais baixos cada;
  - `impedindo` = pano curto do braço; `afastando` = dois passos para trás;
  - níveis (dB): murmúrio -29 (era -34, inaudível a 30 a 38 LU da voz), passos -27, respiração -30, risco -28, brilho -35 (encostava na voz), swell -30.




