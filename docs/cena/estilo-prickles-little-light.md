

# Cena: estilos prickles e little-light

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `prickles` | `forma`: `cena`, `abraco`, `susto`, `bola`, `numero` (`texto` até 6), `cta`; `personagens` (ids: `ourico`, `ourico-filhote`, `coelho`, `texugo`, `esquilo` ou do pecas.js `personagensEstilo.prickles`; ou `{ id, x, escala, gesto, gestoAntes, expressao, expressaoDepois, vira }`), `gesto` (`parado`, `aceno`, `abraco`, `bracos-abertos`, `carrega`, `aponta`, `comemora`, `pula`, `encolhe`), `gestoAntes`, `expressao` (`feliz`, `aberto`, `surpreso`, `triste`, `dormindo`), `chave`, `acao`, `transicao` (`fusao`, `folhas`, `corte`), `continua`. No BEAT: `cenario` (`clareira-dourada`, `toca-raiz`, `ninho-folhas`, `trilha-folhas`, `entardecer` ou do pecas.js `cenariosEstilo.prickles`) e `camera: { mov }` (`push`, `deriva`, `paralaxe`, `recua`, `sobe`, `tremor`, `fixa`). Guia: `docs/estilo-prickles.md`; rodada 3: `plano` (`aberto`, `medio`, `close`, `detalhe`), `props` e `estado` no personagem; `transicao` da família do estilo (docs/estilo-prickles.md) |
| `little-light` | `forma`: `cena`, `pisca`, `acende`, `numero` (`texto` até 5), `cta`; `personagens` (ids: `baleia`, `baleia-grande`, `agua-viva-rosa`, `agua-viva-azul`, `agua-viva-violeta`, `peixe-lanterna`, `peixinho` ou do pecas.js; ou `{ id, x, y, escala, vira, expressao, ate, piscaIsca }`), `aceso` (0 a 1), `familia`, `chave`, `acao`, `transicao` (`fusao`, `escuro`, `bolhas`, `corte`). No BEAT: `cenario` (`superficie-lua`, `mar-noturno`, `abismo`, `jardim-coral`, `floresta-algas` ou do pecas.js) e `camera: { mov }` (`desce`, `sobe`, `push`, `deriva`, `paralaxe`, `recua`, `fixa`). Guia: `docs/estilo-little-light.md`; rodada 3: `plano` (`aberto`, `medio`, `close`, `detalhe`), `props` e `estado` no personagem; `transicao` da família do estilo (docs/estilo-prickles.md) |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `prickles` | Livro de outono: prancha de livro infantil em lápis colorido e aquarela sobre papel creme. Bichos de livro (ouriço, filhote, coelho, texugo, esquilo) com olhos de arco, bochechas rosadas, respiração, piscar e gesto na palavra; floresta dourada em camadas com profundidade de campo, raios, folhas que caem e vaga-lumes no entardecer; as palavras da narração pipocam numa linha no alto, em Fraunces. Guia: `docs/estilo-prickles.md` |
| `little-light` | Mar que brilha: noite no fundo do mar com bioluminescência. Baleia pequena de barriga creme, águas-vivas que pulsam e brilham em rosa, azul e violeta, peixe-lanterna, plâncton em nuvens, coral que acende uma a uma na revelação, brilho com teto (nunca estoura), câmera que desce da superfície; as palavras pipocam numa linha no alto, em Fraunces. Guia: `docs/estilo-little-light.md` |

## Estilos prickles e little-light (desenho animado ilustrado, narrado)
Leia `docs/estilo-prickles.md` (livro de outono em lápis e aquarela) ou `docs/estilo-little-light.md` (fundo do mar que brilha). `"estilo": "prickles"` ou `"little-light"` na cena; cada beat é UMA cena da história, com **um** elemento `{ "tipo": "prickles", "forma": ..., "personagens": [...], "chave": "<palavra dita>" }` (ou `"tipo": "little-light"`). Regras dos estilos (valem acima das regras gerais de layout):
- **Uma frase, uma cena, uma ação na palavra dela:** o bicho que a frase cita age na `chave` (gesto e expressão que muda uma vez e fica). prickles: `cena`, `abraco`, `susto` (a palavra pintada no estouro), `bola` (o ouriço se enrola), `numero` (placa de madeira, `texto`), `cta`. little-light: `cena`, `pisca` (a luz no escuro), `acende` (a revelação: uma a uma), `numero` (o plâncton forma o número), `cta`.
- **As palavras pipocam numa linha no alto** (o texto da tela é a própria narração): não escreva título nem rótulo; o número dito vai na `forma: "numero"` com `texto`.
- **Cenário e câmera no beat:** `"cenario"` pelo lugar da frase (prickles: clareira-dourada, toca-raiz, ninho-folhas, trilha-folhas, entardecer; little-light: superficie-lua, mar-noturno, abismo, jardim-coral, floresta-algas) e `"camera": { "mov": ... }` (push, deriva, paralaxe, recua, desce, sobe, tremor, fixa), variando entre cenas; `transicao` `folhas` (prickles), `escuro` e `bolhas` (little-light) na troca de lugar.
- Bicho, criatura ou cenário que falta nasce em `pecas.js` (`personagensEstilo` e `cenariosEstilo`), só com dados. O plano automático (`src/video/autoplano-cartoon-ilustracao.mjs`) já faz tudo pela fala: escreva à mão para dar nome, gesto e expressão a cada bicho.




