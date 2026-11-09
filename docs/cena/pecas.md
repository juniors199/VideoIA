

# Cena: peças do dia a dia, peças de mundo e modelos GLB

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

Posição e giro de qualquer peça: `"pos": [x, y, z]` e `"rot": [x, y, z]` (radianos), sempre 3 números. Outro formato (número solto, `{x, y, z}`) é tirado pelo reparo, com aviso, e vale o padrão.

## Peças novas (objetos do dia a dia)
`pessoa`, `grupo`, `casa`, `predio`, `celular`, `gota`, `engrenagem`, `cadeado`, `pino`, `relogio3d`, `carro`, `arvore`, `nuvem`, `livro`, `bateria3d` (`dados: {nivel: 0..1}`), `lampada3d`, `termometro`, `balanca`, `escada`, `pontos` (`dados: {n, destaque}`). A `mao` aceita `dados: {gesto}`: `aberta` (padrão), `aponta`, `joinha`, `L`, `paz`, `punho`, e `espelho: true|false` (o `L` já sai espelhado para ser lido como L por quem assiste). Para "fazer o L", dê um beat próprio à mão, grande e no centro.
- **Figuras humanas (`pessoa`, `grupo`, `boneco*` e os personagens):** ilustração 3D premium (`engine/repertorio/gente.js`). Dados opcionais, todos determinísticos: `cabelo` (`curto`, `lateral`, `careca`, `longo`, `coque`, `crespo`), `cabeloCor` (`preto`, `castanhoescuro`, `castanho`, `ruivo`, `loiro`, `grisalho`, `branco`), `roupa` (`camisa`, `terno`, `blazer`, `polo`, `camiseta`, `jaleco`, `scrub`, `uniforme`), `pele` (`clara`, `morena-clara`, `morena`, `parda`, `negra`, `retinta`, 1 a 6 ou `#hex`), `idade` (`jovem`, `adulto`, `idoso`), `barba` (`nenhuma`, `curta`, `cheia`, `bigode`, `cavanhaque`), `corpo` (`masculino`, `feminino`; o padrão segue o cabelo), `oculos` e `semente` (sorteia o que não veio escrito). No `grupo`, `semente` troca o trio e `pessoas: [{...}, {...}, {...}]` escolhe cada um. A roupa principal continua no material do `papel`.
Cada beat com peças ganha automaticamente um piso com sombra, para os objetos "pousarem". O piso e a sombra nascem com a primeira peça, esmaecem com a saída delas e nunca ficam na tela sem peça (o QA reprova `sombra-sozinha` na cena e `sombra-corte` no arquivo: faixa escura nas laterais do chão que aparece e some logo depois do corte).

## Peças de mundo (animadas pelos dados)
Todas aceitam `dados.atraso` e `dados.dur` (segundos). A animação corre sozinha depois da entrada.
| forma | dados | para quê |
|---|---|---|
| `grade` | `{cols, total, n}` | unidades que acendem em ordem (79 fases, 27 estados) |
| `hemiciclo` | `{total, ativos, filas}` | parlamento, votação, parcela de um grupo |
| `domino` | `{n, passo}` | efeito em cadeia |
| `chuva` | `{n}` | moedas que caem e formam um monte (dinheiro) |
| `documento` | `{linhas, marcada}` | lei, contrato, nota: uma linha é marcada |
| `mapa` | `{pinos: [[x,z],...]}` | rota entre lugares (x e z de -1 a 1; incline com `rot: [-0.45,0,0]` ou use câmera `topo`) |
| `templo` | `{colunas, acesas}` | instituição, constituição, tribunal; as colunas acendem |
| `cela` | `{presos, abre}` | prisão; as grades descem (e sobem em `abre`) |
| `manequim` | `{pose}` | pessoa: `neutro`, `aponta`, `ergue`, `duvida` |

## Modelos GLB (peças `glb-*`)
Para objeto complexo (animal, veículo, comida, móvel, prédio, pessoa), um modelo 3D bem feito ganha de qualquer montagem de primitivas. Eles entram como peça comum: `{ "tipo": "peca", "forma": "glb-vaca", "papel": "frente", "entra": "vaca" }`, com a mesma entrada em mola, sombra, encaixe, rótulo e QA das outras.
- **Biblioteca do estúdio (168, todos CC0):** `src/video/engine/assets3d/` (lista e licenças em `LICENCAS.md`; a ampliação de outubro de 2026 está em `biblioteca-ampliada.js`). Veja com `node src/video/cli.mjs --galeria glb --por=4`.
- **Do projeto:** `projetos/<nome>/assets/<arquivo>.glb` vira a peça `glb-<arquivo>` (nome em minúsculas com hífen; nome que já existe na biblioteca é erro). Licença e autor em `fontes.md`. Ver: `--galeria --projeto=<nome>`.
- O arquivo vai embutido na spec (sem rede, sem disco na hora do quadro) e o hash dele entra no cache de quadros.

`dados` (todos opcionais; o padrão de cada modelo da biblioteca já foi escolhido na galeria):
- `material`: `"suave"` (a cor original, menos saturada e fosca; padrão), `"clay"` (paleta da marca: a parte principal no `papel` da peça, as outras em frente, sombra, apoio e grafite; com `"papel": "destaque"` o objeto fica laranja) ou `"original"`.
- `partes`: troca o papel de uma parte pelo nome do material do modelo (`{ "Windows": "escuro", "Top": "destaque" }`; papéis: frente, sombra, apoio, destaque, escuro, principal, original).
- `anim`: clipe embutido, tocado em função do tempo (`"Walk"`, `"Idle"`, `"emote-yes"`...; `false` desliga); `vel` multiplica a velocidade. Animais da Quaternius: `Idle`, alguns `Walk`; peixes e baleia: `Swim`; águia: `Flying`; pessoas (`glb-homem`, `glb-mulher`...): `idle`, `walk`, `sit`, `emote-yes`, `emote-no`, `pick-up`, `interact-right`; bichos fofos (abelha, leão, panda, pinguim): `idle`, `walk`, `dance`.
- `giro` (graus em Y, para o modelo olhar para a câmera), `inclina` (graus em X, deita para a câmera: pizza, ave em voo), `escala` (o modelo já vem normalizado com a presença de uma peça comum).

Regra: modelo da biblioteca primeiro quando o objeto existe nela; peça procedural quando o assunto é símbolo ou diagrama (moeda, cadeado, gráfico); `pecas.js` quando nada serve. Nunca um modelo que não seja CC0 (ou de licença livre comprovada e registrada em `fontes.md`, no projeto).




