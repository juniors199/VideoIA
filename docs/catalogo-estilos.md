

# Catálogo de estilos (guia do mantenedor)

A seção **Estilos** do estúdio mostra todos os estilos de Reels e de carrossel do kit, cada um com o nome, para que serve, quando usar, um loop curto e a frase pronta para colar no Claude ou no Codex. A página não escreve nada disso: ela lê dois lugares.

| O quê | Onde |
|---|---|
| Lista e textos | `src/estudio/catalogo/catalogo.json` (`{ reels: [...], carrosseis: [...] }`, cada item com `id`, `nome`, `resumo`, `quandoUsar`, `pedido`, `previa`) |
| Loops de prévia | `src/estudio/catalogo/previas/` (`<id>.mp4` nos Reels, `carrossel-<id>.mp4` nos carrosséis) |

Hoje são 41 estilos de Reels (os de `npm run estilos`, de fábrica) e 11 visuais de carrossel (`escuro`, `claro`, `papel` e as 8 famílias de `docs/carrossel-templates.md`). Os 15 "jeitos de conteúdo" da skill `carrossel` (post, jornal, conversa, nota...) não são um id que o aluno escolhe: são tipos de slide dentro de um visual e ficam fora do catálogo.

## De onde vem cada coisa
- **Quem entra:** os estilos de fábrica que `lerEstilos` devolve (`src/estilo-objetivo/carregar.mjs`) e os ids de `VISUAIS_TODOS` (`src/validar-carrossel.mjs`). Estilo que a pessoa criou em `estilos/meus/` nunca entra.
- **Nome:** o da ficha, sem o parêntese explicativo (`Impresso (retícula de papel)` vira `Impresso`). É o que o seletor de estilo do estúdio mostra.
- **Textos:** `scripts/catalogo-estilos/textos.json`. Para cada Reel: `resumo`, `quandoUsar`, `tema` e `objetivo`. Para cada visual de carrossel: `nome`, `resumo`, `quandoUsar` e `tema`.
- **Pedido:** montado pelo script, sempre na sintaxe que o estúdio lê na linha `STATUS` do roteiro (`escolhaDoStatus`):
  - Reel: `Faça um vídeo sobre <tema>. Estilo: <id>. Objetivo: <objetivo>.`
  - Carrossel: `Faça um carrossel sobre <tema>. Visual: <id>.`
- **Loops:** `scripts/catalogo-estilos/fontes.json` diz de qual vídeo pronto (e a partir de qual segundo) ou de quais 3 slides sai cada loop.

## Regerar
```bash
node scripts/gerar-catalogo-estilos.mjs                 # catalogo.json e os loops que faltam
node scripts/gerar-catalogo-estilos.mjs --json          # só o catalogo.json (não usa FFmpeg)
node scripts/gerar-catalogo-estilos.mjs --previas       # refaz todos os loops
node scripts/gerar-catalogo-estilos.mjs --so=pontilhismo,carrossel-limpo   # só esses
node scripts/gerar-catalogo-estilos.mjs --verificar     # confere o que existe e o total, sem escrever
node --test test/catalogo.test.mjs                      # o contrato
```
(O `npm run catalogo` antigo gera `src/video/formas.json`, a lista de peças 3D: é outra coisa.)

O Reel é recortado com 3,6 s, 400 px de largura, H.264 sem áudio e `+faststart`. O carrossel vira 3 slides em fade que voltam ao primeiro (4 s, 432 x 540), para o loop não dar salto. O script sobe o `crf` (e, se precisar, baixa os quadros por segundo) até o arquivo caber em 150 KB. O conjunto inteiro tem teto de 6 MB, porque o pacote do kit tem teto.

## Como o loop é escolhido
1. Tire uma folha de contato do vídeo de origem (12 quadros) e ache 3,6 s dentro de um mesmo assunto, com a peça central do estilo e a legenda.
2. Evite: foto de pessoa real fora de obra de domínio público, logo de outra marca, trecho com texto cortado, faixa preta, quadro vazio no começo, CTA com o endereço antigo.
3. Depois de gerar, confira 3 quadros do loop (começo, meio, fim). Se algo falhar, troque `inicio` em `fontes.json`. No máximo 3 tentativas por estilo; passou disso, escolha outro vídeo de origem.
4. A cor de destaque tem que ser a da marca (laranja do Estudio de videos), em todos os estilos coloridos (ver "Cores" abaixo).

Os vídeos de origem são `projetos/_dv2-*` (um por estilo), `projetos/exemplo-*`, `projetos/_t18-panela-*`, as prévias internas de cada estilo e `projetos/_catalogo-colagem3d`, `projetos/_catalogo-fatos`, `projetos/novela-previa`, `projetos/pleno-teste` (estilo pleno), `projetos/mindset3-previa` e as prévias dos cartoons (`projetos/<id>-previa` de paper-rocket, lighthouse-mouse, moon-path, prickles e little-light) (Colagem 3D e Fatos renderizados de novo na 0.6.28 para sair com o laranja da marca; o de Fatos sem a foto de pessoa; o loop da Novela sai da prévia de 04/11/2026, sem foto de pessoa no trecho; Mindset 3 e cartoons desde 04 e 05/11/2026). Eles e os slides dos carrosseis ficam fora do git (`.gitignore`); só os loops entram (`!studio/src/estudio/catalogo/previas/*.mp4`).

### Renderizar de novo um exemplo (marca laranja, sem gastar crédito)
Num estúdio com a marca do Estudio de videos ou outra de destaque laranja (`npm run marca -- --nome "Padaria da Ana" --handle "@padariadaana" --cor "#FF7A2F"`), com voz de teste e sem música:
```bash
node src/video/cli.mjs <projeto> --voz=mock --sem-musica --rapido
```
Um projeto com `narracao.mp3` e `palavras.json` guardados reaproveita a voz. Nunca use ElevenLabs para prévia. Um por vez: o render usa o computador inteiro.

## Cores
Todos os estilos coloridos seguem a cor da marca (desde a 0.6.29): letreiro, interface, colagem, ribalta, mundos, colagem3d, fatos, novela, paper-rocket, lighthouse-mouse, moon-path, prickles, little-light, smooth, cartões, tubo, mindset, mindset 2, mindset 3, 3D alternativo, moderno, stop motion, teologia, quadro antigo e antiguidade. Os neutros (impresso, anatomia, fino, linhas, preto e branco, pontilhismo) são monocromáticos por desenho. A auditoria completa, a regra e o teste que trava cor fixa estão em `docs/cor-da-marca.md`.
Para o loop, renderize o exemplo com a marca do Estudio de videos (laranja `#FF7A2F`). Sem mexer em `marca/tokens.json`: `ILU_TOKENS=<arquivo de tokens> node src/video/cli.mjs ...` usa outra marca só naquele comando.

## Adicionar um estilo novo
1. Crie o estilo como de costume (ficha em `modelos/<id>.json` ou id novo em `src/video/plano.mjs`; `npm run estilos` tem que listar).
2. Ponha um vídeo pronto dele em `projetos/` (ou use um exemplo existente) e anote em `fontes.json`, em `reels.<id>`, a `origem` e o `inicio`.
3. Escreva `reels.<id>` em `textos.json`: `resumo` (1 frase concreta, falada, sem as marcas d'água de texto de IA), `quandoUsar` (1 frase), `tema` (um assunto que o estilo conta bem) e `objetivo` (um id de `npm run objetivos`).
4. `node scripts/gerar-catalogo-estilos.mjs --so=<id>` e olhe 3 quadros.
5. `node --test test/catalogo.test.mjs`. O teste falha enquanto o estilo novo não estiver no catálogo, com o texto e a prévia dentro dos limites.

Carrossel novo (uma família em `src/carrossel/familias.mjs`): o mesmo, em `carrosseis.<id>` (com `nome`) e `fontes.json`, `carrosseis.<id>` (`pasta` dos slides e os 3 `slides`). `--so=carrossel-<id>`.

## O que o teste garante (`test/catalogo.test.mjs`)
Todo estilo de fábrica e todo visual de carrossel está no catálogo, e nada além deles; ids em kebab-case, sem repetição; nenhum campo vazio nem a mais; nome igual ao da ficha; `pedido` lido pelo próprio estúdio (a linha `STATUS` resolve o estilo e um objetivo que existe); toda prévia existe e nenhuma sobra; até 150 KB cada e 6 MB no total; MP4 com `faststart`, sem áudio, H.264, 9:16 (Reels) ou 4:5 (carrossel), 360 a 480 px de largura, 3 a 4,2 s (quando há `ffprobe`); sem travessão com espaços nem as palavras proibidas; `catalogo.json` igual ao que o script geraria hoje.




