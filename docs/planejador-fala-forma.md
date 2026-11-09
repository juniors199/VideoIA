

# Planejador fala -> forma (guia do mantenedor)

Regra do estúdio (05/11/2026): em todos os estilos, o que aparece em cada beat vem da **ação** e do **objeto** que a fala daquele beat diz, nunca só do assunto do vídeo nem de um rodízio pelo número do beat. Quando nada na fala tem forma, o beat cai na **figura neutra do estilo + o texto da fala**, nunca numa decoração qualquer.

## As peças
| Arquivo | O que faz |
|---|---|
| `src/video/fala-forma/conceitos.json` | Dicionário comum de ações e objetos (acordar, dormir, compartilhar, medir, comer, viajar, grupo, fila, horário, cidade, praia...). Cada conceito: `tipo`, `forma` (peça 3D do catálogo) e `temas` (termos no formato do léxico: `*` aceita flexão, `~` é fraco, frase com espaço vale mais). |
| `src/video/relevancia.mjs` | Lê o dicionário comum no mesmo índice do léxico: os estilos de peça 3D recebem "acordou" -> despertador sem passar por mais nada. `casarTermos` é o matcher reaproveitado. |
| `src/video/fala-forma/estilos.mjs` | Dicionário de cada estilo: `regras`, `conceitos` (id do conceito -> forma do estilo), `pecas` (a forma é a peça 3D), `intencoes` e `neutro`. |
| `src/video/fala-forma.mjs` | A camada: `conceitosDaFala`, `lerFala`, `formaPelaFala(estilo, fala)`, `marcar(beat, decisao)`, `auditarFalaForma(cena, palavras)`. Registra cada estilo no registro comum. |
| `src/video/engine/fala-forma.js` | Registro comum, o mesmo da frente do Mindset 3 (API idêntica): `registrarRepertorio`, `escolherNoEstilo`, `conferirNoEstilo`. |

## Uma fonte de verdade, duas camadas (integração de 05/11/2026)
- **Camada base: `src/video/engine/fala-forma.js`.** É o único registro (`registrarRepertorio`, `repertorioDe`, `escolherNoEstilo`, `conferirNoEstilo`, `escolherPorFala`, `conferirFala`). Roda no Node e no navegador. Nenhum outro arquivo define o registro (o teste `fala-forma.test.mjs` procura e reprova cópia).
- **Camada de cima: `src/video/fala-forma.mjs`.** Lê o dicionário comum e os mapas de `fala-forma/estilos.mjs`, registra cada estilo do mapa na camada base e oferece `formaPelaFala`, `marcar` e `auditarFalaForma`.
- **Estilo com repertório próprio** registra direto na base, sem passar pelo mapa: hoje o `mindset3` (`engine/estilo-mindset3-figuras.js`, verificado em `estilo-mindset3-verificar.mjs`). Ele não entra em `MAPAS`, então a camada de cima não sobrescreve o repertório dele.
- **Um tipo de erro só:** tudo que é "o desenho não mostra a fala" sai como `fala-desenho`. Estilo com verificador próprio dessa conferência fica em `VERIFICADOR_PROPRIO` (em `fala-forma.mjs`) e o auditor não repete a mesma falha.
- Novela, feltro e papel (`paper-rocket`, `lighthouse-mouse`, `moon-path`) e ilustração (`prickles`, `little-light`) têm a correspondência no próprio planejador (cenário, bicho, ação e objeto pela fala); para ligá-los ao auditor comum, siga "Ligar um estilo novo" abaixo.
- **Figuras da fala (Smooth):** `src/video/fala-forma/figuras.mjs` traz `SINAIS`, `figurasDaFala` e `combina` (a figura que a fala pede: clique, mensagem, tempo, comparação, dinheiro...). O Smooth escolhe o layout por elas (mapa figura -> formas em `autoplano-smooth.mjs`) e o verificador dele reprova figura forte que não combina e layout repetido. A camada de cima reexporta os três nomes (`import { figurasDaFala, combina } from './fala-forma.mjs'`). Era o `fala-forma.mjs` da frente do Smooth; na integração de 05/11 mudou só de lugar.

Ordem de decisão de `formaPelaFala`: regra do estilo (a ação ou o objeto mais concreto) -> conceito do dicionário comum -> intenção da frase (`autoplano-intencao.mjs`) -> neutro. A forma que a fala pede nunca é trocada por variedade; só o neutro alterna (`evitar`).

Cada planejador grava a decisão em `beat._ff` (`{ forma, por, conceito?, motivo }`). O autoplano junta tudo em `cena.falaForma` (sem a decisão, deriva do relatório da relevância). `por` vale `regra`, `conceito`, `intencao`, `fala`, `foto`, `numero`, `marca`, `texto`, `familia`, `cenario` (todos representam a fala) ou `neutro`.

## Verificador
`auditarFalaForma(cena, palavras)` devolve, por beat, `representa`, `neutro` e `generico`, e a lista `falhas` no formato do verificador do Mindset 3 (`{ beat, tipo: 'fala-desenho', msg }`): beat genérico (peça só do assunto do vídeo, rodízio) ou a fala pede uma forma do estilo e o beat mostra outra (`conferirNoEstilo`, pelas pistas). Teste: `node --test test/fala-forma.test.mjs`.

## Ligar um estilo novo
1. Em `fala-forma/estilos.mjs`, acrescente a entrada do estilo: `neutro` (obrigatório), `regras` para as formas que pedem palavra própria, `conceitos` ligando o dicionário comum às formas do estilo (ou `pecas: true` se o protagonista é a peça 3D).
2. No planejador do estilo, troque qualquer `FORMAS[i % N]` por `formaPelaFala('<estilo>', fala)` e grave com `marcar(beat, decisao)`. Gancho e fecho podem ser estruturais (`por: 'texto'`), desde que mostrem a própria fala.
3. Se o planejador tem regras próprias (cenas por assunto, glifos), some-as como pistas: `somarPistas('<estilo>', REGRAS.map((r) => [r.re, [r.forma]]))`.
4. Acrescente o estilo à lista `ESTILOS` de `test/fala-forma.test.mjs` (frase com "dorme" representa; frase sem objeto cai no neutro; `falhas` vazio).
5. Ação ou objeto frequente sem figura: acrescente o conceito em `conceitos.json` com uma peça do catálogo (`npm run galeria`) ou crie a peça (`docs/repertorio-3d.md`) e ligue-a. Nunca ligue uma palavra ambígua sem contexto (ex.: "sozinho" não é tristeza em "conferiu sozinho").




