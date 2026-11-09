

# Cena: estilo mindset2

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `mindset2` | `forma`: `figura`, `dupla`, `onda`, `orbita`, `constelacao`, `escada`, `porta`, `coracao`, `cerebro`, `sol`, `lua`, `semente`, `relogio`, `alvo`, `numero` (`texto`: até 3 algarismos), `foto` (com o elemento `imagem` da pessoa citada no mesmo beat), `cta` (fecho: constelação e botão; `texto` do botão, padrão COMENTE ILUSTRANDO); `chave` (palavra dita em que o glifo age e que acende na legenda), `rotulo` (HUD, até 16 letras), `n` (número do item dito), `continua: true` (mesmo glifo do beat anterior, sem troca), `luz` (cone do alto; padrão nas formas de pessoa), `acao` (segundos, no lugar da chave). No BEAT: `cenario` (`carvao`, `palco`, `palco-disco`, `cosmos`, `horizonte`, `interior` ou um do projeto em `pecas.js`, `export const cenariosEstilo`) e `camera: { mov }` (`empurra`, `recua`, `desce`, `travelling`, `orbita`, `aproxima`, `fixa`). Como criar um cenário: `docs/estilo-mindset2.md` |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `mindset2` | Mindset 2: traço fino luminoso (ouro, turquesa, cobre) com brilho em retícula sobre carvão com grão, poeira e cone de luz; um glifo por ideia que se desenha no centro enquanto o anterior desliza e apaga (sem corte seco), HUD em mono com o número do item e pontos de progresso, legenda Poppins de uma linha que acende palavra a palavra (chave em amarelo) e fecho com a constelação e o botão de comentar. Guia: `docs/estilo-mindset2.md` |

## Estilo mindset2 (traço de luz sobre carvão)
Leia `docs/estilo-mindset2.md`. `"estilo": "mindset2"` na cena; cada beat tem **um** elemento `{ "tipo": "mindset2", "forma": ..., "chave": "<palavra dita>" }`. Regras do estilo (valem acima das regras gerais de layout):
- **Uma forma por ideia, do que a frase diz:** `figura` (pessoa), `dupla` (relação), `onda` (corpo com a linha do sentir), `coracao`, `cerebro` (mente), `relogio` (tempo), `semente` (crescer, hábito), `escada` (subir, meta), `porta` (mudança, oportunidade), `alvo` (foco, escolha), `sol`, `lua`, `orbita` (ciclo), `constelacao`, `numero` (`texto`: até 3 algarismos), `foto` (pessoa citada: junto com o elemento `imagem` dela; nunca boneco) e `cta` no último beat. Nunca a mesma forma em beats vizinhos, a não ser com `"continua": true` (o resto da frase do mesmo item: o glifo fica e age de novo).
- **`chave`** é a palavra dita em que o glifo age (a figura acende, a semente brota, a flecha chega) e que acende em amarelo na legenda. **`rotulo`** (até 16 letras, palavra da fala) e **`n`** (o número do item dito: "Um:", "Dois:") fazem o HUD "02 · TEMPO" e os pontos de progresso; o gancho e o fecho ficam sem rótulo.
- Sem corte seco, sem câmera (`camera` não vale): o estilo desliza 120 px e desenha o próximo glifo. Sem peças 3D, cenário ou título: o texto é a legenda de uma linha.
- O plano automático já faz tudo isso pela fala (`src/video/autoplano-mindset2.mjs`); escreva à mão só para trocar a forma ou a palavra-chave.




