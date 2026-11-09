

# Cena: estilos paper-rocket, lighthouse-mouse e moon-path

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `paper-rocket`, `lighthouse-mouse`, `moon-path` | `forma`: `cena` (cenário, herói e amigos em `personagens`; `acao` na `chave`; `chegam: true` traz os amigos um a um com uma luzinha; `segura`), `objeto` (`objeto` grande com `acaoObjeto`: `decola`, `acende`, `apaga`, `racha`, `empilha`, `pisca`), `numero` (`texto`: "3 2 1" ou até 4 caracteres), `pensamento` (balão com o `objeto` sonhado), `foto` (só com `"fotoReal": true` no elemento `imagem`; sem isso a pessoa citada vira o boneco `pessoa` de feltro), `cta` (letras de feltro da `palavra` penduradas por fios). No beat: `cenario` (14 da base) e `camera.mov` (`empurra`, `recua`, `deriva`, `paralaxe`, `balanco`, `tremor`, `sobe`, `desce`, `fixa`); `transicao`: `corte`, `fusao`, `scallop`, `iris`, `escurece`. Guias: `docs/estilo-paper-rocket.md` (a base), `docs/estilo-lighthouse-mouse.md`, `docs/estilo-moon-path.md`. |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `paper-rocket` | Paper Rocket: desenho animado de feltro com costura, vivo: um bicho que sonha e vai longe (quintal, céu, espaço com planeta de anel, lua), painel de papel recortado entre as cenas, contagem de feltro e palavras que pipocam na hora em que são ditas. |
| `lighthouse-mouse` | Lighthouse Mouse: diorama de feltro quente à noite (sala do farol com a lâmpada em camadas, janela de noite, piso de tábuas, farol no mar, tempestade), bichos a 12 qps, fusão entre as cenas, trilha de caixinha de música. |
| `moon-path` | Moon Path: papel recortado em camadas à noite (ondas costuradas, lua com o caminho de luz, estrelas penduradas por fio, cais com lampiões), paralaxe das camadas, trilha de caixinha de música. |

## Estilos paper-rocket, lighthouse-mouse e moon-path (desenho animado de feltro e papel)
Leia `docs/estilo-paper-rocket.md` (a base) e o guia do estilo. Cada beat tem **um** elemento `{ "tipo": "<estilo>", "forma": ..., "chave": "<palavra dita>" }`: `cena` (o cenário, o herói e os amigos em `personagens`, o gesto `acao` na chave; `chegam: true` traz os amigos um a um com uma luzinha), `objeto` (`objeto` grande com `acaoObjeto`), `numero` (contagem "3 2 1"), `pensamento` (balão com o `objeto` sonhado), `cta` (letras de feltro da palavra do CTA).
- **Uma cena por frase, com a ação na palavra dita**, e o bicho citado como herói (rato, raposa, coelho, tartaruga...). Pessoa citada pelo nome vira o boneco `pessoa` de feltro (regra do estúdio, 04/11); foto real só com `"fotoReal": true` no elemento `imagem`.
- **Cenário e câmera no beat:** `"cenario"` (quintal, oficina, ceu-nuvens, espaco, lua-pouso, colinas-tarde, sala-farol, farol-mar, tempestade, quarto-noite, praia-lua, cais-noite, mar-aberto, floresta-noite) e `"camera": { "mov": ... }` (empurra, recua, deriva, paralaxe, balanco, tremor, sobe, desce, fixa); `transicao` corte, fusao, scallop, iris ou escurece (nunca clarão branco). Mesmo lugar no beat seguinte: corte com a câmera contínua.
- As palavras da narração pipocam no alto, numa linha; não escreva título. O plano automático (`src/video/autoplano-cartoon-feltro.mjs`) já faz tudo pela fala.




