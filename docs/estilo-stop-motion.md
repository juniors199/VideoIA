

# Estilo stop-motion (claymation de miniatura, com personagem, câmera e corte interno)

Miniaturas de massinha em macro: personagens de massa que atuam (andam, correm, falam, apontam, bebem, sentam), cortes internos no corpo (coração, pulmão, estômago, cérebro, engrenagens), cenários variados (parque, campo, pista, ringue, quarto, cozinha, estúdio, interior do corpo), câmera de cinema (dolly, mergulho, órbita, trilho, mão livre, rack focus), dissolução entre cenas e overlay de textura leve. Título numa placa de massa, uma palavra de legenda por vez, luz quente de estúdio, fundo desfocado de lente macro e a massa se movendo "de dois em dois quadros". Inspirado nos Reels de massinha de @foraquadro (9 vídeos medidos em 28/10/2026, duas rodadas) e refeito do zero: nenhuma imagem, fonte, frase ou marca de terceiros entra no estúdio. As regras do próprio estilo (placa no alto, legenda de uma palavra, macro, cadência) valem acima das regras gerais de layout dos Reels.

## Duas frentes (as duas funcionam sozinhas)
- **Frente A: 3D fotográfico, sem gerador de imagem** (o padrão, e o que os dois exemplos usam). Maquete 3D com profundidade de verdade, material de massa PBR, lente macro com bokeh e oclusão de ambiente, personagem articulado, peças modeladas à mão, câmera 3D.
- **Frente B: cenas a partir de imagens fotográficas de massinha** (geradas por IA ou fotografadas), animadas com a mesma cadência. Pronta e testada com uma imagem de teste, mas **depende de um gerador de imagem** que não está configurado. O realismo fotográfico total das referências vem de gerador de imagem e de vídeo, e só a frente B chega nele.

## Como usar
- Cena inteira: `"estilo": "stop-motion"`. Num beat só: `"estilo": "stop-motion"` no beat. Ficha do estilo: `modelos/stop-motion.json` (`npm run estilos -- --ver stop-motion`). Exemplos: `projetos/exemplo-stop-motion-coracao/` (31 s, "Por que o coração dispara quando você corre?", usa tudo o que é novo) e `projetos/exemplo-stop-motion/` (24 s, o pão, só peças de objeto).
- **Peças do estilo no projeto:** a biblioteca vem no `kit.sm`. No `pecas.js` do projeto, uma linha por peça (copie o do exemplo do coração):
  ```js
  export const pecas = {
    'pessoa-massa': (kit, d) => kit.sm.pessoa(kit, d),
    'orgao-massa': (kit, d) => kit.sm.orgao(kit, d),
    'coracao-amassado': (kit, d) => kit.sm.amassa(kit, d),
    'mao-massa': (kit, d) => kit.sm.mao(kit, d),
  };
  ```
- Título do beat (`titulo.texto`): placa de massa. **Uma palavra** (até 2 linhas curtas). `titulo.estilo`: `fios` (padrão, pendurada por dois fios), `balao` (rabicho de fala, sem fios) ou `solto`. `titulo.sobe: true` faz a placa sair pelo alto no fim do beat (como quando a câmera empurra). Beats seguidos com o mesmo título não repetem o pulo.
- `tom` (cena ou beat): `oficina` (padrão), `campo`, `noite`, `laboratorio`, `estudio`. Muda cores, luzes e adereços.
- **Cenário** (beat): `"cenario": { "tipo": "maquete", "lugar": "parque", "tom": "campo", "densidade": 1.2 }`. Lugares: `parque` (caminho de tijolinhos, árvores, multidão desfocada), `campo` (gramado, trave com rede, arquibancada), `pista` (asfalto, zebras, placas chevron), `ringue` (lona, cordas, plateia), `quarto` (sofá, abajur, janela), `cozinha` (azulejo, bancada, panelas), `estudio` (fundo infinito liso, o de macro e corte interno), `corpo` (túnel de massa com tendões, engrenagens e lâmpadas). Sem `lugar` vale a bancada de maquete.
- **Plano e câmera** (beat). `plano`: `aberto` (0,8), `medio` (1), `figura` (1,4), `close` (1,7), `macro` (2,4); `focoPlano: [x, y]` escolhe o ponto nítido. `cine` é a câmera de cinema do beat:

| campo | valores | efeito |
|---|---|---|
| `mov` | `parada`, `empurra` (padrão), `recua`, `mergulha`, `orbita`, `sobe`, `desce`, `trilho`, `respira` | tipo do movimento ao longo do beat |
| `de`, `ate` | 0,5 a 6 | fator de aproximação no começo e no fim (1 = plano do beat) |
| `graus` | -90 a 90 | órbita em torno da peça (`orbita`) |
| `x`, `y` | fração da peça | deslize lateral (`trilho`) e pedestal (`sobe`, `desce`) |
| `dx`, `dy` | fração da peça | deslocamento fixo do enquadramento (`dy` positivo desce a peça no quadro, para a cabeça não encostar na placa) |
| `mao` | 0 a 3 (padrão 1) | tremida lenta de câmera na mão; 0 desliga |
| `foco` | `{ de: [x, y], ate: [x, y] }` | rack focus e para onde o mergulho entra |
| `curva` | `suave`, `linear`, `entra`, `sai` | aceleração |
  Sem `cine` vale um empurrão lento de 8% com a mão leve. O personagem inteiro na tela pede `figura` ou `cine` com `de` perto de 1,5; o corte no peito pede `mergulha` com `foco` descendo para o peito.
- **Transição:** `"fusao": 0.4` no beat dissolve a cena anterior (congelada no último passo) por cima da nova em 0,4 s. Sem `fusao` o corte é seco, como no estilo original.
- Cadência, lente e textura (`efeitos.stopMotion`, tudo opcional):

| campo | valores | padrão | efeito |
|---|---|---|---|
| `passo` | 8, 10, 12, 15, 24, 30 | 12 | quadros de massinha por segundo: peças, placas, setas, números, palavras e overlay mudam a cada 1/passo s |
| `tremida` | 0 a 3 | 1 | "boil": deslocamento de ~1,5 px e giro de ~0,4° de cada peça, e o relevo da massa "ferve" a cada passo |
| `cintilacao` | 0 a 2 | 1 | variação de exposição de ±2% e grão que muda a cada passo |
| `camera` | `suave`, `passo` | `suave` | a câmera 3D desliza todo quadro; `passo` a deixa também de dois em dois |
| `abertura` | 0 a 2000 | 1500 | abertura da lente macro; a peça inteira fica nítida (o desfoque protege a profundidade do protagonista) |
| `textura` | 0 a 2 | 0,8 | **overlay de textura leve**: película de fibras e poeira de massa que ferve a cada passo, grão fino, motas de poeira em suspensão à deriva, pelinhos na lente e quina de película suja; 0 desliga |
| `oclusao` | 0 a 1 | 0,55 | oclusão de ambiente em espaço de tela (cantos, vãos e a base das peças escurecem); 0 desliga |

## A pessoa de massa (`kit.sm.pessoa`)
Boneco articulado modelado por SDF e primitivas: cabeça com nariz, orelhas, sobrancelhas, pálpebras e olhos com brilho, boca que abre e sorri, cabelo (`crespo`, `ondulado`, `curto`, `coque`, `rabo`, `bagunca`, `careca`), barba, tronco com gola, braços com cotovelo, mãos de cinco dedos que fecham, pernas, sapatos. Dados: `pele` (clara, morena, parda, negra, retinta, rosada ou hex), `cabelo`, `tipoCabelo`, `barba` (0 a 1), `camisa`, `calca`, `calcado`, `meia`, `avental`, `idade` (altura relativa), `assento` (`banco`, `caixa`), `objeto` (`garrafa`), `olhaPara`, `vento`.
- **Atuação:** `acao` (uma pose) ou `acoes: [{ "t": 0, "a": "parado" }, { "t": 1.3, "a": "aponta", "mistura": 0.5 }]` (linha do tempo, em segundos desde a entrada da peça). Poses: `parado`, `atento`, `anda`, `corre`, `fala`, `explica`, `aponta`, `espanta`, `cansado`, `quadril`, `cruzado`, `bebe`, `senta`, `sentaFala`, `olhaCima`, `encolhe`, `mostra`, `segura`, `dorme`. `anda` e `corre` têm ciclo de passada (pernas, braços, quadril e tronco); todas as poses têm respiração, piscada e olhar que passeia; as de fala abrem a boca em rajadas. `caminho: { de: [x, z], ate: [x, z], dur }` desloca o personagem dentro da peça.
- **Corte interno** (`janela`): `{ "onde": "peito" | "barriga" | "cabeca", "conteudo": "coracao" | "pulmao" | "estomago" | "cerebro" | "mecanismo" | "lampada" }` abre um buraco de verdade no tronco (ou na lateral da cabeça), com borda rosada, e põe o órgão de massa dentro, animado: o coração bate no ritmo `bpm0` e `bpm1` em `rampa` segundos (acelera), o pulmão infla (`freq`), o estômago enche (`nivel`), engrenagens e mola giram (`velocidade`).
- **Peças soltas:** `kit.sm.orgao` (o órgão grande, `tipo`, `escala`), `kit.sm.amassa` (a mão do animador amassa o coração no ritmo das batidas: a dedada deforma a malha de verdade e o coração achata sob a mão), `kit.sm.mao`.
- **Massa viva:** todo material de massa recebe o relevo triplanar que "ferve" a cada passo (o desenho das digitais anda como no stop motion real) e aceita até 2 amassados por quadro (`userData.dedo` da peça).

## Sons
Estalo da placa que pula, tap da etiqueta, setas, número em tique e, no coração de massa, um tum surdo a cada batida do ritmo da peça (sempre baixo, abaixo da voz).

## O que foi medido na referência (9 Reels, 720x1280, duas rodadas)
Primeira rodada (28/10 manhã): formato, cadência, título, rótulo, legenda e imagem (resumidos abaixo). Segunda rodada (28/10, câmera, movimento e dinâmica, a 5 qps e por diferença entre quadros):
- **Formato e duração:** 24 qps (um deles 30), 40 s ou 64 s. Fala de 2,8 a 2,9 palavras por segundo, gancho em pergunta ou afirmação absurda nos 3 primeiros segundos, depois blocos "problema, solução, novo problema" e fecho em pergunta.
- **Cortes:** nos vídeos de IA o corte cai sempre em múltiplos de 8,0 s (cada trecho é um clipe de 8 s). Em 4 dos 9 há dissolução curta (0,4 a 0,7 s) no emenda do clipe. Dentro do clipe, câmera contínua.
- **Câmera (o que o estilo antigo não fazia):** (1) dolly lento e constante, de 5 a 10% por segundo na maior parte do tempo; (2) "mergulho": acelera para 25 a 40% por segundo por 2 a 4 s para entrar no corpo (do personagem inteiro ao órgão, da cabeça à lâmpada de alarme) e dissolve no próximo plano; (3) pull-back de revelação; (4) trilho lateral acompanhando quem anda; (5) leve tremida de câmera na mão; (6) plongée e contra-plongée; (7) rack focus entre personagem e objeto; a placa de título é do mundo: sobe e sai do quadro quando a câmera empurra.
- **Movimento:** em 2 dos 9 vídeos a massa anda em quadros repetidos (8 e 12 passos por segundo); nos outros 7 o movimento é fluido a 24 qps (vídeo de IA), com squash e stretch suave, respiração, piscada, passada completa, mãos que seguram, apontam e apertam. Quadros repetidos medidos: de 4% a 60%.
- **Personagens:** gente de massa com rosto que atua (olhos grandes, sobrancelhas, boca), camisa de tricô, braços e pernas finos, cabelo de massa em fios ou cachos; coadjuvantes e multidão desfocados ao fundo. Mãos do animador e ferramentas aparecem esculpindo.
- **Cortes internos:** o corpo vira uma maquete aberta: janela no peito ou na cabeça com órgão de massa (estômago com água, coração, pele em corte com glândulas, veias com hemácias) e mecanismo (engrenagens, molas, chaves, lâmpada âmbar de alarme, alavancas, válvulas). Cores quentes e saturadas, o interior mais vermelho que o corpo.
- **Cenários:** parque cheio de gente, campo com trave, pista de miniatura com zebras e placas chevron, ringue com plateia, quarto com abajur, ônibus, cozinha, estúdio de fundo liso colorido, interior do corpo com engrenagens. Sempre com 3 a 4 planos de profundidade e bokeh.
- **Título:** UMA palavra-chave por cena, em placa de massa amarela-mostarda, centrada, a 14,5% do topo; 4 variações: pendurada por fios, balão de fala (com rabicho), solta e inclinada; a palavra troca com a cena e "pula".
- **Rótulo:** placa dourada pequena logo abaixo, 2 linhas curtas em caixa-alta, entra 1 a 2 s depois da placa.
- **Legenda:** uma palavra por vez, centrada, ~80% da altura, branca com contorno preto.
- **Imagem:** macro com profundidade de campo rasa, luz dourada de cima à esquerda, massa com digitais e marcas de ferramenta, protagonista de 45 a 75% da altura.

## O que a referência faz e o estilo antigo não fazia (lacunas) e o que foi implementado
| Lacuna | Status |
|---|---|
| Câmera só empurrava de leve | **Feito**: 9 movimentos (`cine`), mergulho, órbita, trilho, pedestal, rack focus, mão livre |
| Corte seco sempre | **Feito**: dissolução (`fusao`) |
| Só objetos parados, sem personagem | **Feito**: pessoa de massa articulada com 19 poses, passada, fala, piscada, respiração |
| Sem mãos | **Feito**: mãos de 5 dedos nas pessoas e mão do animador que amassa a massa |
| Massa rígida | **Feito**: dedada deforma a malha, squash e stretch, relevo que "ferve" por passo |
| Sem corte interno | **Feito**: janela no peito e na cabeça com coração, pulmão, estômago, cérebro, mecanismo, lâmpada |
| Um cenário só (bancada) | **Feito**: 8 lugares (parque, campo, pista, ringue, quarto, cozinha, estúdio, corpo) |
| Sem textura de lente e película | **Feito**: overlay (`textura`) e oclusão de ambiente |
| Placa de título única | **Feito**: `fios`, `balao`, `solto` e `sobe` |
| Realismo de foto | **Parcial** (veja abaixo) |

## O que ainda fica abaixo da referência (franco)
- **Não é fotografia.** Tudo é computação gráfica em tempo real: a luz, a profundidade de campo, a massa, a textura e a câmera seguem as referências, mas as referências são imagens e vídeos de gerador de IA com milhões de detalhes que o 3D procedural não tem (pele de massinha com poros e digitais em cada centímetro, cabelo e roupa de tricô fio a fio, translucidez real, reflexos). Perto da tela cheia o olho vê CG de curta de animação, não foto de miniatura. Só a frente B, com gerador de imagem, chega ao realismo fotográfico.
- Os rostos têm poucas expressões (olhar, sobrancelhas, boca aberta ou sorrindo); sem dentes e língua articulados, sem rugas. As mãos têm dedos, mas só fecham e abrem; não seguram objetos pequenos de verdade, nem entrelaçam.
- Multidões e plateias são bonecos de cápsula sem rosto, vistos desfocados; a grama e os tijolinhos ainda têm cara de instância repetida de perto.
- O movimento do personagem é de poses e ciclos, não de animação livre: não há quedas, saltos, luta de boxe com contato, nem dois personagens interagindo com o corpo (o exemplo usa um por cena). As cenas de ação das referências (ringue, carro de corrida com ventos, ônibus lotado) não têm peça pronta de veículo ou lutador.
- Líquidos (água no estômago) são uma malha translúcida simples; não há splash nem fluxo.
- A fusão congela a cena anterior no último passo (não continua em movimento durante a dissolução).
- O corte interno cobre peito, barriga e lateral da cabeça; não há "pele em corte" com glândulas e vasos, nem câmera que atravesse o corpo por dentro de um órgão ao outro.

## Frente B: gerar as imagens (opcional)
`node scripts/gerar-imagem-massinha.mjs <projeto> "<assunto>" [--plano=macro-objeto] [--paleta=quente] [--nome=arquivo] [--provedor=openai|gemini] [--seco] [--listar]` salva `projetos/<projeto>/imagens/<nome>.png`, registra a origem em `fontes.md` e imprime a linha de `cena.json` para usar.
- Biblioteca de prompts em `src/video/prompts-massinha.mjs`: prompt-base do look e 8 planos (`personagem-close`, `personagem-medio`, `aberto`, `macro-objeto`, `maos`, `corte-interno`, `cenario`, `bancada`) e 4 paletas. Sempre com restrições: sem texto, logotipo, marca nem pessoa real.
- Provedores: OpenAI (`gpt-image-1`) e Google Gemini (`gemini-2.5-flash-image`). A chave é lida só do `.env`, vai em cabeçalho e nunca é impressa. Sem chave o script sai com código 2 e o estilo continua com a frente A. `--seco` mostra o prompt sem chamar a rede.
- Elemento `{ "tipo": "stop-motion", "forma": "cena", "arquivo": "imagens/x.png", "profundidade", "zoom", "paralaxe", "foco" }`.
- Não use pessoa real citada no assunto; para pessoa citada pelo nome vale a regra da foto real de licença livre. Estado: testada só com respostas simuladas; nenhuma imagem real foi gerada.

## Elementos `"tipo": "stop-motion"`
| forma | campos | o que é |
|---|---|---|
| `etiqueta` | `texto` (até 34 caracteres), `entra`, `dx`, `dy` | rótulo dourado de massa logo abaixo da placa |
| `seta` | `dir`, `n`, `pos`, `espaco`, `tamanho`, `cor` | setas de massa laranja que balançam |
| `fita` | `n`, `pos`, `amp`, `largura`, `cor`, `velocidade` | fitas de massa ondulando (fluxo, sangue, vento) |
| `placa` | `texto`, `pos`, `tamanho`, `cor`, `inclina` | segunda placa de massa |
| `cena` | `arquivo`, `profundidade`, `zoom`, `paralaxe`, `foco` | frente B |

Também funcionam `imagem` (foto real em moldura de massa, para pessoa citada pelo nome) e `contador`.

## QA
Vale `docs/QA-VIDEO.md`. Estilo da marca (legenda abaixo do protagonista, sem aviso de pouco cenário). O encaixe do protagonista fica em y 640 a 1460, 24 px mais estreito que nos outros estilos. Conferir a 5 qps: placa legível e centrada, palavra da legenda em 1 linha, cabeça do personagem sem cair sob a placa (use `cine.dy`), pés sem tocar a legenda, peça apoiada no chão, quadro 0 igual à cena, nenhum quadro vazio no corte, dissolução sem fantasma duplicado parado.




