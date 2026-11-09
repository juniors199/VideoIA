

# Cena: estilo mindset3

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `mindset3` | `forma`: `figura` (`figura`: id da biblioteca, de `figurasMindset3` no pecas.js ou `"caminho"` com `d`; `rotulos`, `altura`), `dupla` (`figuras: [a, b]`, `segunda`, `rotulos`), `pessoa` (pessoa citada ilustrada: `figura` `busto`, `perfil` ou `corpo`, `rotulo` = nome), `foto` (só se pedirem foto real; com o elemento `imagem` no mesmo beat; `rotulo` = nome), `numero` (`texto` até 9, `rotulo`, `unidade`, `anel`, `conta`, `aneis` 2 a 6, `vezes`), `titulo` (`texto` até 40, `figura` opcional), `diagrama` (`diagrama`: `venn`, `orbita`, `onda`, `escada`, `barras`, `rede`, `escala`, `espiral`, `grade`, `helice`, `fechadura`, com `rotulos`, `valores`, `itens`, `grupos`, `centro`, `pinos`, `falta`), `cartao` (`titulo`, `itens` até 4, `carimbo`, `risca`, `variante`: `celular` com `texto`, `duplo` com `rodape`, `ficha` com `campos` "RÓTULO|valor" e `destaque`), `cta` (`figura`, `chave`). Comuns: `chave`, `transicao` (`desenha`, `morfa`, `desliza`, `recua`, `apaga`, `corte`), `desenho`. No beat: `"cenario"` (`breu`, `painel-pontos`, `ceu-estrelado`, `horizonte`, `quarto`, `anel-astral`, `portal`, `grade-chao`) e `"camera": { "mov": "deriva" \| "aproxima" \| "recua" \| "panoramica" \| "desce" \| "inclina" \| "orbita" }`. Guia: `docs/estilo-mindset3.md` |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `mindset3` | Mindset 3: ilustração em giz luminoso e retícula sobre o breu #111113. Traço fino lavanda que se desenha com a ponta acesa, retícula de meio-tom no cheio e no halo, etiqueta mono digitada, número creme que conta, diagramas (Venn, órbita, onda, escada, barras, rede, escala, espiral, grade em perspectiva), ficha mono com carimbo, pessoa citada ilustrada (foto em retícula só se pedirem); um plano contínuo (desenha, morfa, desliza, recua, apaga, sem clarão), 8 cenários, câmera 2D e 3D quase parada e legenda de uma linha que acende palavra por palavra. Acento na cor da marca. Guia: `docs/estilo-mindset3.md` |

## Estilo mindset3 (ilustração em giz luminoso e retícula)
Leia `docs/estilo-mindset3.md`. `"estilo": "mindset3"` na cena; cada beat tem **um** elemento `{ "tipo": "mindset3", "forma": ..., "chave": "<palavra dita>" }` (mais o `imagem` da foto, quando houver). Não é o `mindset` nem o `mindset2`. Regras do estilo (valem acima das regras gerais de layout):
- **Um desenho por frase, do que a frase diz:** `figura` (biblioteca de 43 desenhos em linha, com as figuras de ação: `soneca`, `dormindo`, `acordando`, `susto`, `hormonio`, `dormitorio`, `cabeca-relogio`, `enviar` ou `"caminho"` com `d`; `figurasMindset3` no pecas.js), `dupla` (comparação: o primeiro entra no centro e desliza quando o segundo chega), `pessoa` (pessoa citada pelo nome: ILUSTRAÇÃO em linha, `busto`, `perfil` ou `corpo`, com o nome na etiqueta; regra do estúdio, a mesma exceção da Novela), `foto` (só se o usuário pedir foto real: em retícula numa ficha), `numero` (conta até o valor; ano e hora inteiros; o tamanho cabe sozinho no anel, nunca com o cenário `anel-astral` atrás), `titulo`, `diagrama` (`venn`, `orbita`, `onda`, `escada`, `barras`, `rede`, `escala`, `espiral`, `grade`, `helice` 3D com nós e ano, `fechadura` 3D com pinos que alinham), `cartao` (ficha com até 4 itens mono, `carimbo`; `variante`: `celular`, `duplo` (dois painéis, lista à direita) ou `ficha` (perfil com foto em linha e `campos` "RÓTULO|valor")), `numero` com `aneis` e `vezes` ("×3") para multiplicação, `cta` no último beat (a figura do começo volta e as pílulas do CTA ficam a ~85% da altura, como na referência).
- **Etiquetas mono curtas** (`rotulos`, até 22 letras) com palavras da fala; elas ficam fora do desenho, sozinhas.
- **Um plano contínuo:** `transicao` = `desenha` (padrão), `morfa` (na virada "Mas"), `desliza`, `recua`, `apaga`; nunca clarão branco; `corte` só se pedido.
- **Cenário e câmera no beat:** `"cenario"` (`breu`, `painel-pontos`, `ceu-estrelado`, `horizonte`, `quarto`, `anel-astral`, `portal`, `grade-chao`) e `"camera": { "mov": ... }` (2D `deriva`, `aproxima`, `recua`, `panoramica`, `desce`; 3D `inclina`, `orbita`), sem repetir a do vizinho.
- **Beat de 1,8 a 4,2 s** (o QA conta a etiqueta, a segunda figura, o item do cartão e a pílula como algo novo). O plano automático (`src/video/autoplano-mindset3.mjs`) faz tudo isso pela fala; escreva à mão para escolher o desenho certo.




