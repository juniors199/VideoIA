

# Cena: estilo fatos

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `fatos` | no beat: `"cenario"` (`satelite`, `satelite-alerta`, `globo`, `palco` (só luz, sem personagem), `palco-curioso` (com o personagem, só por pedido), `papel`, `painel` ou um do projeto em pecas.js, `cenariosEstilo`) e `"camera": { "mov": ... }` (`fixa`, `empurrao`, `recuo`, `deriva`, `orbita`, `mergulho`, `tremor`), pelo mecanismo comum de cenários dos estilos; no elemento, `forma`: `frase` (só o texto; depois de um mapa, o mapa apagado continua atrás), `numero` (`valor`, `casas`, `prefixo` "R$ ", `sufixo` "%", `ano: true` sem milhar, `de` onde começa a contar; `foco` põe o mapa atrás; `globo: true` põe o globo), `mapa` (`foco`; `fluxo: true` linhas que convergem; `alvo: false` desliga o alvo, `[lon, lat]` muda o ponto; `rotuloAlvo`; `zoom`), `globo` (`foco`), `lista` (`itens`: 1 a 5 `{ texto, valor, chave }`; `titulo`), `barras` (`itens`: 2 a 6 `{ rotulo, valor, sufixo, cor: menta/coral }`), `grafico` (`pontos`: números em ordem; `rotulo` na cabeça), `busca` (`texto` até 34 letras; `sugestoes`), `pessoas` (`total` 2 a 60, `destaque`, `cor`, `legenda`), `linhatempo` (`marcos`: 2 a 5 `{ data, rotulo, chave }`), `foto` (com o elemento `imagem` da pessoa citada no mesmo beat), `documento` (`titulo`, `destaque`, `carimbo`: cartão de documento com o carimbo mono), `cta` (`opcoes`: as pílulas, padrão SEGUIR A PÁGINA e COMENTAR ILUSTRANDO). Contexto visual (frase e número sem mapa): `objeto` (peça 3D do repertório, string ou `{ peca, dados }`) e `icone` (pictograma de linha: agua, comida, remedio, lanterna, dinheiro, pilha, radio, celular, luz, sinal, casa, familia, cadeado, tempestade, escudo, alerta, documento, calendario, relogio, qr, mapa); cada item de `lista` aceita `icone`. Em todas: `chave` (palavra no acento), `italico` (palavra dita onde começa a virada na serifa itálica; `false` desliga), `riscar` (palavra riscada em vermelho), `etiqueta` (mono acima do texto), `selo` (mono embaixo do visual), `alinhar: "esquerda"`, `tom` (`amarelo`, `ouro`, `marca`). `foco`: país (ISO2, ISO3 ou nome em português), estado (`BR-SP`) ou região (`BR-SUL`) |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `fatos` | Fatos: dado de satélite sobre carvão. Texto no alto que se monta palavra a palavra (Inter Tight, virada em Playfair Display itálica no acento), número grande que conta, mapa de satélite escuro com o lugar aceso em cor natural, linhas de fluxo e alvo, globo, infográficos escuros (lista, barras, gráfico, busca, pessoas, linha do tempo), foto com mira, barra de progresso no topo e fecho com pílulas de rádio. Guia: `docs/estilo-fatos.md` |

## Estilo fatos (dado de satélite sobre carvão)
Leia `docs/estilo-fatos.md`. `"estilo": "fatos"` na cena; cada beat tem **um** elemento `{ "tipo": "fatos", "forma": ... }` (a foto da pessoa citada vai junto, como elemento `imagem`). Regras do estilo (valem acima das regras gerais de layout):
- **O texto é a fala, no alto, palavra a palavra.** Não há legenda embaixo nem título: o texto do beat se monta no alto (até 3 linhas por página). A virada da frase vai na serifa itálica no acento (`italico`: a palavra dita onde ela começa, de 2 a 6 palavras); sem virada, uma `chave` no acento.
- **Uma frase por beat.** Não corte a frase na vírgula (o plano automático junta o pedaço cortado); frase longa vira páginas do mesmo beat.
- **Número primeiro.** O contador só sai com o número entre as 3 primeiras palavras ("41 meses. Foi o tempo..."); número no meio da frase fica no acento do texto. Ano com `ano: true` (sem ponto de milhar) e `de` uns 20 a 30 anos antes.
- **Lugar é mapa, pessoa é foto.** País, estado ou região citado vira `mapa` (o primeiro país pode ser `globo`), com `fluxo` quando a frase fala de gente indo ou chegando; foto automática de lugar sai. Pessoa citada pelo nome: `foto` com o elemento `imagem` dela.
- **Infográfico só com dado conferido.** `lista`, `barras`, `grafico`, `pessoas` e `linhatempo` mostram números e itens de `fontes.md`; nada inventado para encher o quadro.
- O último beat é `cta` (as pílulas acendem quando a opção é dita). Sem `camera`, peças 3D, cenário ou título: o estilo desenha tudo.
- **Cenário e câmera no BEAT** (mecanismo comum dos estilos): `"cenario"` (`satelite`, `satelite-alerta`, `globo`, `palco` com o personagem 3D, `papel`, `painel`, ou um do projeto em pecas.js, `export const cenariosEstilo`) e `"camera": { "mov": ... }` (`empurrao`, `recuo`, `deriva`, `orbita`, `mergulho`, `fixa`). Varie: no vídeo, pelo menos 3 cenários e 3 movimentos. Cenário novo em 4 passos: `docs/estilo-fatos.md`.
- O plano automático já faz isso pela fala (`src/video/autoplano-fatos.mjs`); escreva à mão para lista, barras, gráfico, pessoas e para trocar a virada.




