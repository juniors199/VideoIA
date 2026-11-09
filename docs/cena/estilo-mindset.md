

# Cena: estilo mindset

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `mindset` | `forma`: `figura`, `dupla`, `escada`, `alvo`, `muro`, `multidao`, `sol`, `jardim`, `zonas`, `circulos`, `barra` (`texto`: porcentagem de 0 a 100), `numero` (`texto`: até 4 caracteres), `frase` (frase de impacto com as palavras do beat; sem legenda), `foto` (com o elemento `imagem` da pessoa citada no mesmo beat), `cta` (fecho; `texto` do botão, padrão COMENTE ILUSTRANDO); `chave` (palavra dita em que o boneco dourado age e que acende na legenda), `rotulos` (até 4 palavras da fala: etiquetas A e B da comparação, ou os nomes das zonas e dos círculos), `rotulo` (só a etiqueta dourada), `continua: true` (mesma cena do beat anterior, sem troca), `acao` (segundos, no lugar da chave; 99 = não age no beat). No beat: `cenario` (cenário 3D do estilo: palco, vazio, cidade, quarto, escritorio, chuva, deserto, cais, agua, penhasco, estadio, fogo, ou do projeto em `cenariosEstilo.mindset`) e `camera.mov` (fixa, push-in, pull-out, orbita, travelling, parallax, grua, tilt, segue, close, tremor); como criar um cenário: `docs/estilo-mindset.md` |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `mindset` | Mindset: bonecos no palco. Palco grafite neutro com chão que reflete, o boneco dourado (quem age) contra o cinza, uma cena-metáfora por ideia (escada, alvo, muro, multidão, sol, jardim, zonas, barra do ano) que muda sem corte seco, etiquetas da comparação em Montserrat que acendem, legenda Montserrat de uma linha palavra a palavra (chave em dourado), frase de impacto em Poppins ExtraBold Italic e fecho com o boneco que acena. Guia: `docs/estilo-mindset.md` |

## Estilo mindset (bonecos no palco)
Leia `docs/estilo-mindset.md`. `"estilo": "mindset"` na cena; cada beat tem **um** elemento `{ "tipo": "mindset", "forma": ..., "chave": "<palavra dita>" }`. Não é o `mindset2` (traço de luz): aqui é teatro de bonecos num palco com reflexo. Regras do estilo (valem acima das regras gerais de layout):
- **Uma cena-metáfora por ideia:** `dupla` (comparação), `escada` (subir), `alvo` (foco, decisão), `muro` (construir, constância), `multidao` (seguir a maioria, ser diferente), `sol` (luz, recomeço), `jardim` (crescer, hábito), `zonas` (zona de conforto), `circulos` (dois lados), `figura`, `barra` (`texto`: porcentagem dita), `numero` (`texto`: até 4 caracteres), `frase` (virada curta, até 5 palavras: a frase de impacto vira a legenda), `foto` (pessoa citada, junto com o elemento `imagem` dela; nunca boneco) e `cta` no último beat.
- **Etiquetas:** `rotulos: ["Pensar", "Fazer"]` (palavras da fala, até 16 letras): a A branca à esquerda (o cinza), a B dourada à direita (o dourado), que acende na `chave`. Use as mesmas etiquetas em todas as comparações do vídeo.
- **Frases paralelas** ("Quem pensa demais... / Quem faz..."): a mesma cena nos dois beats, `"acao": 99` no primeiro (o dourado espera) e `"continua": true` no segundo (o dourado age na palavra dele).
- **Cenário e câmera 3D (rodada 2):** no beat, `"cenario": "<id>"` (`palco`, `vazio`, `cidade`, `quarto`, `escritorio`, `chuva`, `deserto`, `cais`, `agua`, `penhasco`, `estadio`, `fogo`) e `"camera": { "mov": "<nome>" }` (`fixa`, `push-in`, `pull-out`, `orbita`, `travelling`, `parallax`, `grua`, `tilt`, `segue`, `close`, `tremor`). Escolha o cenário pelo assunto da frase e varie o movimento entre beats. Cenário novo: `docs/estilo-mindset.md`, "Como criar um cenário novo". Sem peças 3D do repertório nem título: o texto é a legenda de uma linha e as etiquetas.
- O plano automático já faz tudo isso pela fala (`src/video/autoplano-mindset.mjs`); escreva à mão só para trocar a cena, as etiquetas ou a palavra-chave.




