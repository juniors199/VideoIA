

# Cena: estilo colagem3d

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `colagem3d` | `forma`: `foto` (com o elemento `imagem` no mesmo beat; 2 fotos lado a lado do mesmo tamanho), `retratos` (3 a 6 fotos em grade com a etiqueta do nome), `pilha` (fotos que caem uma sobre a outra), `objeto` (`peca`: peça 3D do repertório ou do pecas.js; `objetos` para uma segunda), `titulo` (`texto` até 22 letras, impresso no papel), `numero` (`texto` até 12), `jornal` (`texto`: a manchete da própria fala, até 60; a foto do beat entra em retícula), `documento` (`texto`: a linha datilografada da fala), `cta` (fecho, cartão pautado; `texto` padrão ILUSTRANDO), `tela` (foto de tela cheia, texto por cima: exceção do estilo), `personagem` (`personagem`: inventor, cavalheiro, operario, dama, reporter ou do pecas.js `personagensEstilo`; `pose`). Em todas: `pinta` (cor seletiva do objeto na foto: `{ cor, forma: poligono | elipse | retangulo, pontos | area }` em fração da foto), `borda: "circulo"` (íris), `chave` (palavra dita do realce e do marca-texto), `marca` (`circulo`, `sublinha`, `seta`, `risco`, `halo`, `nenhuma`), `chegada` (`cai`, `desliza`, `surge`, `vira`, `corte`), `transicao` (`corte`, `flash`, `desfoque`, `iris`, `fusao`, `slide`, `luz`, `chicote`), `peca` (objeto 3D junto da foto ou do título), `tratamento` (`cor`, `pb`, `sepia`, `reticula`, `gravura`, `ambar`), `borda` (`sem`, `branca`, `polaroide`, `rasgada`, `selo`), `rotulos` (nomes das etiquetas). Na `imagem`: `rotulo` (a etiqueta). No BEAT: `cenario` (`papel-creme`, `papel-cinza`, `jornal`, `mural-escuro`, `mesa-madeira`, `toalha-xadrez`, `ceu-sepia`, `tapete-corte`, `gravura`, `estudio-branco`, `arquivo-ambar`, `oficina-madeira`, `marca-pagina` (fundo e acentos da marca da página) ou um do projeto em `pecas.js`, `cenariosEstilo.colagem3d`) e `camera: { mov }` (`empurra`, `recua`, `paralaxe`, `orbita`, `desce`, `mergulho`, `corte-close`, `chicote`, `fixa`, `dolly`, `rack`, `zoom-rapido`, `whip`). Guia: `docs/estilo-colagem3d.md` |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `colagem3d` | Colagem 3D: documentário em recortes de papel. Fotos reais recortadas (borda branca, polaroide, rasgada, picotada; cor, P&B, sépia, retícula, gravura) e objetos 3D de verdade sobre 12 papéis com textura, em profundidade (sombra macia, paralaxe, órbita e mergulho da câmera), fita, etiqueta amarela do nome, jornal e documento da própria fala, marca-texto à mão na palavra-chave, corte seco a cada plano (e planos internos no beat longo), legenda Instrument Serif de uma linha com a chave em itálico ou na caixa de realce, grão de filme, fibra, riscos e aberração cromática na gravura. Guia: `docs/estilo-colagem3d.md` |

## Estilo colagem3d (documentário em recortes de papel)
Leia `docs/estilo-colagem3d.md`. `"estilo": "colagem3d"` na cena; cada beat é um PLANO com **um** elemento `{ "tipo": "colagem3d", "forma": ..., "chave": "<palavra dita>" }` (mais o elemento `imagem` da foto, quando houver). Regras do estilo (valem acima das regras gerais de layout):
- **Uma imagem por frase, do que a frase diz:** pessoa ou lugar citado = `foto` com a foto real (`imagem` com `rotulo`: a etiqueta amarela; nunca boneco); 3 a 6 pessoas = `retratos`; objeto = `objeto` com a `peca` 3D (do repertório ou do pecas.js; nunca chapada); ano ou número dito = `numero`; jornal ou notícia = `jornal` (manchete da própria fala); lei, carta, contrato = `documento`; palavra de virada sem imagem = `titulo`; fecho = `cta`.
- **Cenário (o papel) e câmera no beat:** `"cenario"` pelo assunto (papel-creme, papel-cinza, jornal, mural-escuro, mesa-madeira, toalha-xadrez, ceu-sepia, tapete-corte, gravura, estudio-branco, arquivo-ambar) e `"camera": { "mov": ... }` (empurra, recua, paralaxe, orbita, desce, mergulho, corte-close, chicote, fixa), variando entre planos. `marca` desenha o marca-texto amarelo na `chave`; `transicao: "flash"` na virada.
- Exceção do estúdio neste estilo: a imagem pode encher o quadro (`tela`) e a legenda de uma linha fica no meio, SOBRE a foto, como nas referências. Pessoa sem nome pode virar `personagem` 3D posado; objeto da foto pode ser pintado na palavra-chave (`pinta`). O plano automático (`src/video/autoplano-colagem3d.mjs`) já faz tudo isso pela fala: escreva à mão para trocar o papel, a câmera ou a peça.




