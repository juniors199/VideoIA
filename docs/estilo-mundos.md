

# Estilo mundos: um mundo de cor para cada item da lista

`"estilo": "mundos"` serve a listas e rankings (3 a 5 itens). O gancho e o fim ficam no **mundo-mãe**, nas cores da página (`marca/tokens.json`, escuro, pontos discretos nas bordas); cada item tem **o próprio mundo** (paleta nossa e um padrão só nas bordas), e a troca de um mundo para o outro acontece **só por uma íris** que abre da janela do próximo item. Tudo num take contínuo, com câmera de operador, e o objeto real de cada item no centro.

## Processo
1. Roteiro de 28 a 46 s (modelo `mundos`): gancho com a lista em uma frase; cada item abre com "Número N: o <nome>" e traz um fato com data, lugar ou pessoa; fecho com pergunta de opinião; CTA curto.
2. Pessoa citada pelo nome: foto real de licença livre (`node scripts/buscar-imagem.mjs <projeto> "<nome>" --listar`). Sem retrato livre, mostre a obra ou o objeto (nunca um rosto inventado) e registre em `fontes.md`.
3. Objeto real de cada item: peça do repertório (`src/video/formas.json`), GLB CC0 ou peça do projeto (`projetos/<nome>/pecas.js`, `docs/repertorio-3d.md`). Nunca ícone chapado.
4. Cena (abaixo), QA (`--sem-render`), render, folha a 5 qps e medida do tremor nos cortes.

## Regras (da auditoria, ver scratchpad/clube-impl/AUDITORIA-mundos.md)
- **Mundos:** paletas `mae` (a página), `vinho` (traços), `cobalto` (pontos), `terracota` (mosaico), `ambar` (traços), `grafite` (mosaico). O padrão (pontos a cada 46 px, traços, mosaico de 26 px com rejunte) fica só nas bordas, com máscara `clamp(|x - 540| / 540 * 2,2 - 1,15)` (centro de x 258 a 822 limpo) e em paralaxe (profundidade 1,15). Dentro de uma janela o padrão aparece inteiro (é o outro mundo visto pelo vidro).
- **Íris:** parte da janela (emblema) do próximo item, raio de 345 px até o canto mais longe + 8, cubicInOut em 0,9 s, logo que a janela fica inteira (0,5 s depois do corte; na cena, `entra: "Número"`). Nunca uma janela ou íris vazia: o objeto do item entra junto com a janela (peça com `entra: 0`, no corte) e já aparece dentro dela. Legenda, título e cartões trocam de cor na metade. A volta ao mundo-mãe (no fim) abre do centro, com o trio já dentro.
- **Janela (emblema):** vidro para o próximo mundo com aro de metal escovado, oito rebites, sombra projetada e sombra interna, 690 px de diâmetro, centrada no protagonista. Nasce do protagonista anterior: um cartão translúcido (0,6) com o mundo novo cobre o objeto em 0,25 s (até o corte; o objeto continua visível) e vira o círculo em 0,45 s (cubicInOut), já com o objeto novo dentro.
- **Passagem (handoff):** a cada troca de protagonista entre beats (objeto, foto, objeto) o que sai chega parado num retângulo (cartão na superfície do mundo, 0,25 s antes do corte) e o que entra nasce dele: objeto -> foto, a foto aparece por cima do objeto já no retângulo dele e o retângulo vira o cartão da foto, com a imagem inteira desde o primeiro quadro; foto -> objeto, o 3D nasce recortado no retângulo e a foto se dissolve por cima, em 0,45 s. Nunca um cartão vazio. Monotônico: o centro e a largura do protagonista nunca vão e voltam no corte.
- **Motivo recorrente, mesmo gesto:** a etiqueta numerada (papel kraft com os cantos cortados, ilhós, espessura e sombra) cai do pino num barbante em 0,2 s, a 20°, e balança `20° · e^(-2,4u) · cos(8u)`; o número aparece na palavra dele. Quando a próxima chega, a anterior solta do pino e cai para trás com gravidade (v0 260 px/s para cima, g 5200 px/s², 320°/s) e some em 0,3 s (a última cai 0,3 s antes da íris do fim). O carimbo pousa com mola 1,6 -> 1 (zeta 0,55, w 18), a -7°, IluD 72 px e sub de 32 px, fundo verde 7%, borda de 9 px, raio 20, textura de tinta (ruído de 2 oitavas), com um tremor curto na parede (2,4 px, decaimento 12, 17 Hz; fundo, etiqueta e carimbo: o protagonista não treme).
- **Cor reservada:** o verde do carimbo (`#43D67A`) significa "invenção brasileira" (ou o que o carimbo disser) e não aparece em mais nada; nenhuma paleta usa verde.
- **Câmera:** câmera de operador (uma mola por eixo, zeta 0,82 e w 6; zoom em log, zeta 0,95), cada chave 0,2 s antes da palavra que a motiva (janela: 1,05; pausa longa com `foco`; íris: volta a 1; carimbo: sobe 14 px; foto: 1,03; ligação, contorno, ondas e `foco`: +2,5%, até 1,055), respiro de 2,6 px. Por cima, a câmera do estúdio (`camera.js`, `cameraEm` inteira, personalidade mundos); os textos andam com `camadaTexto`. Use `"camera": { "plano": "normal", "mov": "nenhum" }` e `"transicao": "corte"` nos beats (a câmera do estilo faz o movimento).
- **Densidade:** uma ideia por frase, nada aparece antes de ser dito (o gancho diz "três invenções" e mostra as três janelas com o objeto de cada item dentro; o fim volta ao mesmo trio, e o último quadro lembra o primeiro). Nunca mais de 0,5 s sem protagonista.
- **Leitura:** legenda Ilu 700 de 58 px logo abaixo do protagonista (vão de ~50 px da base dele, acompanhando a câmera e a base real da peça; desliza 0,35 s no corte), nas cores do mundo (a palavra dita no destaque dele), com uma sombra suave do mundo atrás; título do gancho e da pergunta em IluD 104 a 88 px, centrado, no alto (y 256); no último beat (o convite) o título é o protagonista: IluD 132 a 108 px, centrado no quadro (centro em y 850), e o trio recua para o fundo (18%). Com título, as palavras dele saem da legenda.
- **Nada parado (revisão a 5 qps):** o 3D tem movimento contínuo e sutil, função só do tempo do vídeo (a peça que continua no corte não pula): respiração de escala de ±2,2%, giro lento de ±1,4° e flutuação de 7 px em volta do centro do enquadramento.
- **Protagonista (enquadramento):** o estilo leva a caixa das peças de cada beat para o palco: ~740 px de altura, centro em y 828 (faixa y 458 a 1198, até 900 px de largura); a mesma peça que continua de um beat para o outro mantém o enquadramento. Foto em cartão de papel com borda de 14 px, centrada em y 828, com o tamanho da cena (`largura` x `altura`, de 660 a 800 px de altura ou larga). Gancho e fim: título no alto e o trio (três janelas em triângulo, cada objeto dentro da sua) entre y 480 e 1390. O zoom da câmera tem o pivô no topo do protagonista (cresce para baixo). Etiqueta (x ~168 a 360) e carimbo (x ~600 a 920) ficam na faixa de cima (y 236 a ~420), nunca por cima do protagonista. O QA mede o que se vê: a peça recortada na janela, na íris, no cartão ou na janela do trio; janela, íris e cartão sozinhos não contam.

## Formas (`{ "tipo": "mundos", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `trio` | três janelas com os mundos dos itens (gancho e fim); com 3 peças no beat (ponha as 3 também no gancho, `pos` em triângulo: [-1,15, 1, 0], [1,15, 1, 0], [0, -1, 0]), cada objeto aparece dentro da sua | `mundos` (3 paletas), `entra` |
| `emblema` | janela para o próximo mundo, nascida do protagonista anterior (no começo do beat do item) | `mundo`, `entra` |
| `mundo` | a íris que abre o mundo, a partir da janela | `paleta`, `entra` (o nome do item) |
| `etiqueta` | etiqueta numerada no barbante; o número entra na palavra dele | `numero` (ou `texto`), `entra`, `digito` |
| `carimbo` | carimbo verde que pousa (a cor reservada) | `texto` (data, lugar), `sub` (padrão `BRASILEIRA`), `entra` |
| `ligacao` | arco pontilhado entre as duas peças do beat, com uma trava na palavra | `entra`, `trava` |
| `contorno` | contorno tracejado em volta da parte de cima do objeto (o "formato de ovo") | `entra` |
| `ondas` | ondas que saem do meio da parte de cima do objeto (som, acústica) | `entra` |
| `foco` | só a câmera: push-in curto do operador na palavra (`zoom` maior que 1 é o zoom alvo) | `entra`, `zoom` |

Peças do motor entram como sempre (`gira: 0` e `entra: -1` para a mesma peça continuar parada de um beat para o outro, sem nova entrada); `imagem` vira o cartão de foto do estilo (o QA mede o cartão). Peça com `"sobre": true` pode ficar atrás da outra (a cobra atrás do frasco).

```json
{ "estilo": "mundos", "beats": [
  { "id": "gancho", "palavras": [0, 10], "titulo": { "texto": "Três invenções *brasileiras*" }, "elementos": [ { "tipo": "mundos", "forma": "trio", "mundos": ["vinho", "cobalto", "terracota"], "entra": -0.7 } ] },
  { "id": "um", "palavras": [11, 23], "elementos": [
    { "tipo": "mundos", "forma": "emblema", "mundo": "vinho", "entra": "Número" },
    { "tipo": "mundos", "forma": "etiqueta", "numero": 1, "entra": "Número", "digito": "um:" },
    { "tipo": "mundos", "forma": "mundo", "paleta": "vinho", "entra": "Número" },
    { "tipo": "peca", "forma": "ampola-soro", "gira": 0, "entra": 0 },
    { "tipo": "mundos", "forma": "carimbo", "texto": "1901", "entra": "1901," } ] },
  { "id": "vital", "palavras": [24, 33], "elementos": [ { "tipo": "imagem", "arquivo": "assets/vital-brazil.jpg", "largura": 600, "altura": 750 } ] } ] }
```
Exemplo completo (roteiro, fontes, peças do projeto e cena): `projetos/teste-estilo-mundos`.

## Som (biblioteca L2, sintetizada)
Íris: pop + swell por baixo + tom de chegada em +0,45 s (uma nota por mundo). Carimbo: golpe e tapa, com o timbre alternado a cada vez (thunk, impact, thunk + clique). Etiqueta: whoosh curto na queda, tique no pouso e tique no número; na pausa longa do "Número...", tique-taque baixo a cada 0,5 s em dois timbres. Janela: zip curto; passagem: whoosh leve; ligação: risco + clique na trava; ondas: sino baixo duas vezes; trio: três pops subindo. Peça com `dados.liga` / `dados.agua`: clique + bloop e swell de água. Eventos iguais a menos de 0,35 s viram um só; sem som na legenda.

## Misturar
`"estilo": "mundos"` vale na cena inteira (a íris e as passagens só existem entre beats do estilo).

Técnica reescrita (sem código, marca, fonte ou som de terceiros) a partir da auditoria do pacote "ferramentas open source" do Clube do Motion (lousa contínua com tema trocável por íris, handoff de retângulo, etiqueta e carimbo). Ver `AVISOS-TERCEIROS.md`.


## Kit aberto e planejador por intenção (Onda 4)
O assunto de cada vídeo é uma **ilustração que o assistente escreve em `projetos/<nome>/pecas.js`** (`export const mundos = { "cena-01": { ... } }`), em JSON, sem funções. O motor desenha, nunca troca por peça genérica nem por outro estilo: sem a cena declarada ele recusa e explica o que escrever.

Processo, por vídeo:
1. No `sujeito.json` (ou `cena.sujeito`), aponte o desenho em `dados.objeto` (ex.: `"cena-01"`). Se a fala cita pessoa pelo nome: `tipo: "pessoa"`, `dados.pessoa` e `dados.retrato.arquivo` (foto real de licença livre, `scripts/buscar-imagem.mjs`); sem arquivo, o plano usa a busca livre. Nunca boneco.
2. Escreva o descritor: `nome`, `ordem` (os estados da cena, um por ideia: o desenho acumula e muda de estado a cada beat), `partes` (conceito -> ids: liga o desenho ao pedido), `itens` (`ret`, `elipse`, `poli`, `linha`, `arco`, `caminho`, `texto`; coordenadas de 0 a 100; `papel` de cor; `de` = estado em que nasce) e `estados` (`mover: { id: [dx, dy, giro, escala] }`, `alfa`, `destaque: [ids]`). Texto dentro do desenho: 5,4 unidades ou mais. Três itens ou mais (um item só é peça genérica).
3. Rode `node scripts/verificar-casos-palco.mjs mundos` como modelo de checagem estática (kit válido, plano pela intenção, verificador) e depois o vídeo; revise a 5 quadros por segundo (`bash scripts/folha-5qps.sh <video.mp4> <pasta>`).

O planejador (`src/video/autoplano-mundos.mjs`) decide a representação pela **intenção da frase** (`autoplano-intencao.mjs`: etapas, causa-efeito, mudança, por quê, consequência, mecanismo, comparação, escala, escolha, busca), nunca pelo índice do beat. Se a intenção pede um dado que o kit não declara, devolve erro em vez de trocar de forma.
Conformidade aberta (30 casos, sem ElevenLabs): `node scripts/conformidade-palco.mjs --estilo=mundos [--casos=1,2]`. O caso só conta como aprovado com a revisão visual registrada em `test/estilos-palco/mundos/revisao.json`.

### Mundos: o mundo que veste a identidade do assunto
`export const mundos = { "cena-01": { nome, ordem, partes, itens, estados, mundo: { identidade, fundo, padrao }, carimbo: { texto, sub }, numero } }`. `mundo` é a paleta que o mundo veste (a cor do lugar, do país ou do material; `fundo` em #RRGGBB, `padrao`: pontos, tracos ou mosaico) e vira o mundo `local:cena-01` da íris. A cena é o protagonista do beat, no cartão do estilo (`{ "tipo": "mundos", "forma": "cena", "mundo": "cena-01", "estado": "acao" }`), e entra na passagem entre beats como a foto entra. O carimbo (texto de até 9 letras e subtítulo de até 12) usa a cor reservada.
Tabela: tese e mecanismo = a íris abre o mundo do assunto no beat 2 (foco de câmera no fecho do mecanismo); causa-efeito = causa no mundo grafite, íris para o mundo do assunto no efeito, com carimbo; mudança e comparação = antes no grafite e depois no mundo do assunto; etapas = etiqueta numerada (Nº 1, 2, 3); porquê e escala = o número sozinho na janela do mundo e o carimbo no fecho; consequência = o carimbo no último beat; pessoa = foto real no cartão do estilo.
Verificador: `src/video/verificadores/estilo-mundos-verificar.mjs` (cena existe e é válida, estado na ordem, mundo com fundo e identidade, íris para o mundo do assunto, relação com o pedido, carimbo curto, etiqueta em ordem, cena parada em 3 beats, foto com imagem).




