

# Estilo `bible` (Bíblia em dados e luz)

Curiosidades bíblicas contadas com número, medida e cena: um fato conferido vira um desenho de traço que brilha (bonecos de palito, fogo, luz, portas, poços), um campo de pontos, uma régua ou uma linha do tempo do Antigo ao Novo Testamento, sobre marrom-escuro quente, com o texto em serifa e a palavra-chave na cor da página. Porte de 13 Reels de referência (auditoria interna, fora do kit).

Como usar: `Estilo: bible.` na linha STATUS do `roteiro.md`, ou `--estilo=bible`. Prévia: `projetos/bible-previa-arca`.

## Regras do estilo (medidas nas referências)
| Regra | Valor |
|---|---|
| Fundo | degradê marrom quente (da cor da marca a 3,5 e 7%), brilho que respira, vinheta, poeira de luz, grão 5% |
| Texto | EB Garamond; gancho 80 px (2 a 3 linhas), texto 62 px, mínimo 52 px (nunca menor: quebra em duas linhas); palavra-chave `*assim*` na cor da marca com halo; citação `_assim` em itálico |
| @ | **embaixo** (regra do estúdio, 07/11/2026): y 1406, 24 px, caixa alta espaçada, 62%, dentro da área segura (x 60 a 940, y 250 a 1430; `LAYOUT_BIBLE.arrobaY`); sobe o fio do tempo para y 1330 e não encosta no CTA (botão em y ~1040 a 1100) |
| Kicker | referência bíblica em caixa alta (20 px), y 352; o planejador lê "Gênesis seis, quinze" e põe `GÊNESIS 6:15` |
| Número | 118 px na cor da marca, conta de 0 até o valor, rótulo miúdo embaixo |
| Palco | y 660 a 1400; câmera 2D contínua (empurra, recua, desliza, respira, parada com deriva mínima) |
| Transição | sem corte seco: o palco entra e sai em fade de 0,3 s; o texto entra com desfoque que assenta (0,32 s) e sai em desfoque (0,22 s) |
| Quadro 0 | já completo (texto e palco), como nas referências |
| Fio do tempo | opcional (`fio`): Antigo Testamento a Novo Testamento, y 1330 (acima do @) |
| Área segura | tudo dentro de x 72 a 928, y 262 a 1418 (as constantes de `engine/area-segura.js`) |
| Cor de destaque | lê `marca/tokens.json`; todo tom do estilo deriva dela (`tonsBible`); teste prova com outra cor |
| Áudio | voz do `.env`, trilha no clima (antigo/ambiente), efeitos discretos (tique do número, whoosh baixo, brilho raro) |

## Narração e referências (regra do estúdio, 07/11/2026)
A fala conta o fato; a referência do versículo **não é falada** nem entra na legenda: aparece só escrita na tela (kicker laranja). No `roteiro.md`, ponha no fim do parágrafo `<!-- ref: GÊNESIS 7:24 -->` (o comentário não vai para a voz, a legenda nem o lint). O estúdio guarda a faixa de palavras de cada parágrafo (`falado.palavras.referencias`, em `video.mjs`) e o planejador põe o cartão na primeira frase do parágrafo. O linter do estilo (`lint-roteiro.mjs`) reprova referência falada ("Gênesis sete, vinte e quatro", "Salmo 23, versículo 1").

## Construção das cenas (medida nas referências)
Cada cenário nas referências é construído em sequência: o contorno fino se desenha (arco que varre), o corpo se preenche de baixo para cima, entram os detalhes (anéis, tábuas), os personagens e por último o fogo e a luz; depois a câmera mergulha até ~2x no clímax. No estúdio: `traco(..., { draw })` desenha a linha; `arcaPerto(..., { ent })` constrói casco, casa, detalhes e luz em 0 a 2,2 s; toda cena que entra faz a varredura de baixo para cima com linha de luz (1,25 s, `compor`); câmera `mergulha` (até 1,45x) no dilúvio, na fornalha e no altar.

## Elemento
```json
{ "tipo": "bible", "forma": "arca", "cena": "arca#0", "dados": { "fase": 1 },
  "blocos": [{ "em": 0, "ate": 6.2, "kicker": "GÊNESIS 6:15", "linhas": [{ "texto": "300 *côvados*", "em": 0 }], "numero": { "valor": 300, "rotulo": "CÔVADOS" } }],
  "camera": "empurra", "fio": { "pos": 0.1 } }
```
- `forma`: um palco (abaixo) ou `frase` (só texto) ou `fecho` (CTA com botão).
- `cena`: beats seguidos com a mesma `cena` são UMA cena (o desenho continua). Beats com o mesmo `dados` são um estado só (a câmera e as entradas não reiniciam).
- `blocos`: um por frase, com tempo absoluto (`ate`); sem `blocos`, valem `linhas`/`numero`/`kicker`/`sub` do próprio elemento durante o beat.

## Palcos (`CENAS_BIBLE`)
Cenários: `monte` (altar), `fornalha`, `tumulo`, `cruzes`, `poco` (jorro de partículas), `passaros`, `barco`, `cama` (isométrica, medidas), `talhas`, `fogueira`, `deserto`, `porta`, `rio`, `vale` (corvo), `jardim`, `arca` (escala real, zoom, campo de futebol, prédio, porta).
Dados: `multidao` (grade de palitos, destaques acesos), `pontos` (quadrado, elipse, grade, anéis), `escala` (régua e silhuetas), `tabela`, `arcos`, `original` (hebraico/grego), `relogio`, `barras`.
Bonecos: `boneco()` (pé, anda, sentado, braços, ajoelhado, espada), `mulher`, `chama`, `fagulhas`, `astro`, `brilho`, `traco`, `fioDoTempo` em `engine/estilo-bible-arte.js`. Palco novo: uma função `(g, c)` em `CENAS_BIBLE` (c.t, c.tb, c.etapa, c.p, c.T), uma linha em `estilo-bible-repertorio.js` (temas da fala) e um teste.

## Planejador (`src/video/autoplano-bible.mjs`)
Frases por pontuação (até ~125 letras); o palco vem da AÇÃO e do OBJETO da fala (`estilo-bible-repertorio.js`, camada comum fala -> forma); palco `fixo` (a arca) não troca no meio do assunto; palco sem desenho para a fala cai em `frase` (nunca por rodízio); o último beat com "comenta" vira o fecho com o CTA da casa. Nada de número inventado: o número do topo sai das palavras ditas.

## Entradas monotônicas (sem pisca) e o verificador
Regra do estúdio (07/11/2026): elemento que entra não pode reiniciar, piscar nem reaparecer. **Causa achada:** o palco contava o tempo desde o começo do BEAT (`tb`) e o plano mudava os `dados` (fase) a cada beat, então toda entrada (arco-íris, altar, pomba, calendário, aves) recomeçava a cada troca de beat; nas cenas antigas, os elementos de uma etapa (fornalha, túmulo, cruzes, poço) refaziam o fade ao passar para a etapa seguinte. **Raiz:** o palco recebe `t` (tempo da cena, nunca reinicia) e `te(k)` (tempo desde que o nível `k`, etapa ou fase, apareceu pela PRIMEIRA vez; `run.tE` em `linhaBible`). Toda entrada é `prog(t, ...)` ou `prog(te(k), ...)`; `tb` só vale onde a mudança de estado é intencional (a câmera da arca entre fases). Nova cena: nunca use o tempo do beat para uma entrada.
**Verificador:** `node scripts/verificar-pisca.mjs <projeto>` varre o MP4 a 5 qps (texto, palco e luz do palco), descontando as fronteiras de cena e de bloco de texto onde o fade é desenhado; mergulho de 1 a 16 quadros que volta ao mesmo nível é pisca e reprova (código 1; grava `saida/pisca.json`). Função pura `detectarPisca` testada. Rode antes de entregar qualquer prévia.

## QA do estilo
Área segura (textos registrados), `parado` e `emenda` em `qa-verificadores.mjs`, `tela-vazia` (o texto vai em `medir`), contraste e quadro 0. Ainda sem verificador próprio de câmera/cena (usa os comuns).

## Pendências conhecidas
Mapas geográficos (Brasil, Mediterrâneo) e silhuetas realistas das referências; cova dos leões e casa de Ló sem palco próprio; Sharingan não rodado. Fontes: EB Garamond, Frank Ruhl Libre e Poppins (OFL, `AVISOS-TERCEIROS.md`).




