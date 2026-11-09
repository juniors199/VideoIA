

# Estilo ribalta: palco claro, um objeto por frase

`"estilo": "ribalta"` abre já no **palco claro**, com o elemento do primeiro beat de conteúdo inteiro na placa desde o quadro 0 e a pergunta do gancho como legenda; o palco claro tem fundo claro quente derivado da marca, duas luzes enormes que derivam devagar nas cores da página e grão leve. Daí em diante, **cada frase tem um elemento só, grande e no centro, que desenha literalmente a palavra-chave da fala** e age no instante dela; a palavra-chave da legenda acende na cor do sentido junto com o elemento. Um elemento vira o próximo (a placa muda de forma: cartão, círculo, cúpula); só os heróis de passo entram em corte seco. Serve a "por que", "como funciona", ciência do dia a dia, passo a passo, aula curta e tutorial.

## Processo
1. **Fala de 28 a 46 s** (modelo `ribalta`), uma ideia por frase; um beat por frase.
2. **Gancho de até 2 a 3 s** (`palavra`): a pergunta, com o elemento do próximo beat já na placa desde o quadro 0.
3. **Cada beat seguinte é um elemento** (tabela abaixo) com a `chave` (a palavra dita que acende) e as `acoes` presas às palavras da fala. O elemento já entra no corte; a ação principal acontece na palavra-chave.
4. **Heróis de passo** (`heroi`) marcam os blocos: objeto grande, selo do número, "Passo n de N" e o nome do passo. Dois a quatro por vídeo.
5. Use `"camera": { "plano": "normal", "mov": "nenhum" }` em todos os beats (a câmera do estilo é 2D; o 3D fica parado e a camada do 3D é ajustada à placa).
6. QA (`--sem-render`), folha a 5 quadros por segundo, medição do tremor nos cortes a 30 qps, render.

## Regras (da auditoria do pacote "processo-motion-100-ia", técnica reescrita)
- **Sem tela de título (revisão a 5 qps).** O gancho (`palavra`) não tem mais fundo escuro nem tela só de texto: o quadro 0 já é o palco claro com o protagonista (o elemento do próximo beat de conteúdo, no estado de antes das ações) inteiro na placa; a pergunta entra como legenda e a primeira palavra marcada (`*a*`, `_b_`, `~c~`) acende na cor do sentido. No corte o objeto continua na placa (sem sair e nascer de novo) e as ações acontecem nas palavras do beat dele. Sem flash branco.
- **Palco claro.** Fundo `#F4F3EF` misturado 3,5% com o destaque; luz A (raio 650) no destaque a 11% em volta de (230, 270), luz B (raio 700) no apoio a 34% em volta de (960, 1600), derivando com períodos de 27 a 37 s; grão em multiply a 7%, que ferve a 12 qps.
- **Cor com sentido fixo**: `*a*` = destaque da página (tema A), `_b_` = apoio (tema B; no texto, o apoio escurecido para ler no claro), `~c~` = cinza `#A19E96` (genérico, ruim, passado). Na cena, `"cor": "a" | "b" | "c"` no elemento. Nunca cor decorativa. As cores físicas da luz (azul, vermelho, espectro) são material dos objetos, não destaque.
- **O elemento domina e fica no centro**: placa de 800 px de largura (nunca mais larga: a coluna de botões do Reels fica à direita) e 800 a 840 px de altura, centro em (540, 770), 66 a 70% da faixa y 250 a 1450; o desenho cresce junto com a placa (escala `k` por forma), nunca conteúdo pequeno numa moldura grande. Os heróis: objeto de 700 a 800 px de altura com centro em (540, 780). O grupo elemento + legenda (ou objeto + "Passo n de N" + nome do passo) fica centrado em y ~850 (±110).
- **Medir o que está desenhado**: a placa só conta como protagonista com o elemento dentro (placa vazia no morph não conta); nos heróis conta a caixa da tinta do objeto; no gancho, só as palavras que já nasceram.
- **Legenda curta**: até 6 palavras em até 2 linhas, Ilu 600 80 px (a chave em 700 92 px), tracking -0,035 em, logo abaixo da placa (54 px de vão; nunca abaixo de y 1580). Cada palavra nasce do desfoque na fala (janela [ts - 0,06, ts + 0,30]: opacidade u·2,4, sobe 30 px, escala 0,93 -> 1, desfoque (1 - k)²·16 px; a chave: 0,42 s, sobe 10, 1,16 -> 1, 30 px). O grupo sai (ILLIN em 0,16 s) quando o próximo entra; sem histórico. Nos heróis não há legenda: o nome do passo (IluD 800, 88 a 104 px, 56 px abaixo do objeto) entra palavra a palavra.
- **Quatro curvas só**: ILL `bezier(0.16, 1, 0.3, 1)` (entra e assenta), IO `bezier(0.55, 0, 0.2, 1)` (morph), ILLIN `bezier(0.7, 0, 0.84, 0)` (saídas), POP `bezier(0.2, 1.25, 0.3, 1)` só no selo do número. Nenhum quique em objeto.
- **A peça vira a próxima**: entre dois elementos a placa muda posição, tamanho, raios e material de 0,15 s antes a 0,40 s depois do corte (IO, monotônico); o conteúdo antigo sai em 0,28 s (ILLIN: sobe 40, desfoque 24, +4%) e o novo nasce do desfoque em 0,5 s (0,94 -> 1, sobe 24). **Corte seco só nos heróis**; depois de um herói a placa entra em 0,5 s (0,94 -> 1, sobe 24, ILL).
- **Nada parado**: câmera do estúdio (`camera.js`, personalidade ribalta) desacoplada no corte (uma curva única entre a câmera de 0,37 s antes e a de 0,63 s depois, sem vai e volta); palco que respira (translate 5·sen 0,41t e 4·cos 0,33t, escala 1,01 + 0,012·sen 0,23t); cada objeto tem o próprio movimento lento (giro de ±1,2°, ondas que correm, raios que andam, olhar que passeia).
- **Objetos de verdade**: vidro com face de trás, laterais e brilho; esferas com luz, borda que escurece, luz de recorte e brilho especular; tubos de vidro com líquido; sombra de contato em tudo. Nada de ícone chapado.
- **Áreas**: nome do perfil no topo (y 280, ARROBA_Y), "Passo n de N" em y 322, textos e legenda dentro da área segura (x 72 a 928, y 262 a 1418; `engine/area-segura.js`); o protagonista dentro das margens (x 72 a 1008) mesmo com o zoom da câmera.

## Formas (`{ "tipo": "ribalta", "forma": ... }`)
| forma | o que desenha | ações (`acoes`: palavra ou segundos) |
|---|---|---|
| `palavra` | gancho no palco claro: o elemento do próximo beat já na placa e a pergunta como legenda (`telas`: 1 a 3 textos com `*a*`, `_b_`, `~c~`; a primeira palavra marcada acende) | as do elemento, no beat dele |
| `prisma` | o Sol, a luz branca entrando num prisma de vidro e o leque de cores | `luz` (a luz chega), `divide` (abre em cores), `cores` (o leque se abre inteiro) |
| `atmosfera` | a placa vira a Terra; a luz entra na camada de ar e uma lupa mostra as moléculas | `entra`, `atmosfera` (o ar acende), `moleculas` (a lupa) |
| `molecula` | molécula do ar (duas esferas); a luz bate, o azul se espalha em ondas para todos os lados, o vermelho passa reto | `entra`, `espalha`, `vermelha` |
| `ondas` | onda curta azul e longa vermelha em tubos de vidro, com a cota do λ | `entra`, `longa`, `menor` (a azul acende e as cotas aparecem), `espalha` (pontos de luz saem da azul) |
| `ceu` | cúpula de céu sobre o chão (com espessura), uma pessoa; a cúpula fica azul e os raios chegam de todos os lados | `azul`, `todos` |
| `espectro` | o Sol sobre sete tubos de vidro com a luz de cada cor; o violeta fica baixo | `entra`, `menos` (o violeta cai e fica cinza) |
| `olho` | a placa vira o globo ocular (íris com fibras, pupila, córnea); raio violeta fraco e azul forte | `entra`, `sensivel` (a íris acende em azul) |
| `caminho` | arco da Terra com a camada de ar, o Sol baixo e o feixe longo até a pessoa (o caminho do meio-dia tracejado em cinza); o azul sai do feixe e a ponta fica laranja e vermelha | `entra`, `perde`, `laranja`, `vermelho` |
| `objeto` | peça 3D do repertório (`{ "tipo": "peca" }` no mesmo beat) ajustada à placa, com o anel da ação | `acao` |
| `heroi` | corte seco: objeto grande + selo do número (POP) + "Passo n de N" + `titulo` (com `*a*`) | `objeto`: `molecula`, `leque` (amostras de cor que abrem; `acoes.violeta` levanta a violeta), `poente` (janela redonda com o pôr do sol), `peca` (a peça 3D do beat); `n` e `total` opcionais |
Campos comuns: `chave` (a palavra dita que acende na legenda junto com o elemento), `cor` (`a`, `b` ou `c`), `placa` (`{ w, h, r }` para trocar o tamanho da placa).

```json
{ "tema": "CÉU AZUL", "estilo": "ribalta", "beats": [
  { "id": "gancho", "palavras": [0, 12], "camera": { "plano": "normal", "mov": "nenhum" }, "elementos": [ { "tipo": "ribalta", "forma": "palavra", "telas": ["Por que o céu é *azul*,", "se a luz do Sol é _branca_?"] } ] },
  { "id": "prisma", "palavras": [13, 22], "camera": { "plano": "normal", "mov": "nenhum" }, "elementos": [ { "tipo": "ribalta", "forma": "prisma", "chave": "mistura", "acoes": { "luz": "luz", "divide": "mistura", "cores": "todas" } } ] },
  { "id": "rayleigh", "palavras": [46, 51], "camera": { "plano": "normal", "mov": "nenhum" }, "elementos": [ { "tipo": "ribalta", "forma": "heroi", "objeto": "molecula", "titulo": "Espalhamento de *Rayleigh*" } ] },
  { "id": "segue", "palavras": [117, 123], "camera": { "plano": "normal", "mov": "nenhum" }, "elementos": [ { "tipo": "peca", "forma": "botaoseguir", "papel": "destaque", "gira": 0, "entra": 0 }, { "tipo": "ribalta", "forma": "objeto", "chave": "Segue", "acoes": { "acao": "Segue" } } ] } ] }
```
Exemplo completo: `projetos/teste-estilo-ribalta` ("Por que o céu é azul").

## Som (um por ação, biblioteca L2 de `sfx-estilos.mjs`, sob a voz)
Gancho: sem soco nem flash (o elemento já está na placa; a palavra marcada leva o `pop`); troca de elemento = `whoosh` com o pico no corte (começa 0,2 s antes); ação na palavra-chave = `pop` (-13); ações de apoio = `tick` (tecla, -18); herói = `slap` (carimbo, -10) no selo e `ding` (tonal, só nos heróis) na palavra do nome do passo; `objeto` = `click` (-9) na ação. Nada de música.

## Câmera
O estilo usa a personalidade `ribalta` de `camera.js` (sem atenuação no estilo), desacoplada nos cortes.

Técnica reescrita (sem código, fonte, marca, imagem ou áudio de terceiros) a partir da auditoria do pacote do Clube do Motion. Ver `AVISOS-TERCEIROS.md`.


## Kit aberto e planejador por intenção (Onda 4)
O assunto de cada vídeo é uma **ilustração que o assistente escreve em `projetos/<nome>/pecas.js`** (`export const ribalta = { "cena-01": { ... } }`), em JSON, sem funções. O motor desenha, nunca troca por peça genérica nem por outro estilo: sem a cena declarada ele recusa e explica o que escrever.

Processo, por vídeo:
1. No `sujeito.json` (ou `cena.sujeito`), aponte o desenho em `dados.objeto` (ex.: `"cena-01"`). Se a fala cita pessoa pelo nome: `tipo: "pessoa"`, `dados.pessoa` e `dados.retrato.arquivo` (foto real de licença livre, `scripts/buscar-imagem.mjs`); sem arquivo, o plano usa a busca livre. Nunca boneco.
2. Escreva o descritor: `nome`, `ordem` (os estados da cena, um por ideia: o desenho acumula e muda de estado a cada beat), `partes` (conceito -> ids: liga o desenho ao pedido), `itens` (`ret`, `elipse`, `poli`, `linha`, `arco`, `caminho`, `texto`; coordenadas de 0 a 100; `papel` de cor; `de` = estado em que nasce) e `estados` (`mover: { id: [dx, dy, giro, escala] }`, `alfa`, `destaque: [ids]`). Texto dentro do desenho: 5,4 unidades ou mais. Três itens ou mais (um item só é peça genérica).
3. Rode `node scripts/verificar-casos-palco.mjs ribalta` como modelo de checagem estática (kit válido, plano pela intenção, verificador) e depois o vídeo; revise a 5 quadros por segundo (`bash scripts/folha-5qps.sh <video.mp4> <pasta>`).

O planejador (`src/video/autoplano-ribalta.mjs`) decide a representação pela **intenção da frase** (`autoplano-intencao.mjs`: etapas, causa-efeito, mudança, por quê, consequência, mecanismo, comparação, escala, escolha, busca), nunca pelo índice do beat. Se a intenção pede um dado que o kit não declara, devolve erro em vez de trocar de forma.
Conformidade aberta (30 casos, sem ElevenLabs): `node scripts/conformidade-palco.mjs --estilo=ribalta [--casos=1,2]`. O caso só conta como aprovado com a revisão visual registrada em `test/estilos-palco/ribalta/revisao.json`.

### Ribalta: a cena no palco claro
`export const ribalta = { "cena-01": { nome, ordem, partes, itens, estados, passos, etapas } }`. A cena entra no palco como a forma `cena` (`{ "tipo": "ribalta", "forma": "cena", "mundo": "cena-01", "estado": "acao", "chave": "capivara", "cor": "a" }`), com volume de vidro e papel (degradê, brilho no alto, sombra de contato) e respiro lento; a mesma cena em beats vizinhos não sai nem nasce de novo, só muda de estado. O herói de passo aceita `"objeto": "cena"` (mais `mundo`, `estado`, `n`, `total`, `titulo`). Pessoa citada: a forma `foto` (placa com a foto real) mais o elemento `imagem` do beat. `passos`: o nome do passo de cada estado (com `*a*`).
Tabela: tese e mecanismo = a cena com a palavra-chave acesa em "a"; causa-efeito = causa em "b" e efeito em "a"; mudança = o antes em cinza "c" (passado) e o depois em "a"; porquê = motivo em "b" e fecho em "a"; consequência = a premissa em "b" e o resultado (dois últimos beats) em "a"; etapas = heróis de passo (Passo n de N, até 4); pessoa = foto no palco.
Verificador: `src/video/verificadores/estilo-ribalta-verificar.mjs` (cena existe e é válida, estado na ordem, relação com o pedido, cena parada em 3 beats, palavra-chave na fala, nome do passo que cabe, no máximo 4 heróis, foto com imagem).




