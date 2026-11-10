---
name: carrossel
description: Cria um carrossel do Estudio de videos (6 a 10 slides) e gera os PNGs, sem paradas de aprovação. Escolhe entre os slides clássicos e os virais (post estilo rede de texto curto, fio, jornal, plantão, conversa, nota do celular, gráfico, quiz, meme com rostos próprios, citação com foto, revista, colagem, tipográfico e outros) pelo tema e pelo tipo de página. Use quando a pessoa pedir um carrossel.
---



# Carrossel autônomo

Depois da `pauta`, escreva `carrosseis/<nome>/carrossel.json` e rode `node src/carrossel.mjs <nome>`. Catálogo completo, campos e limites de cada tipo: `docs/carrossel-templates.md` (ou `node src/carrossel.mjs --tipos`). Um exemplo pronto de cada tipo está em `carrosseis/` (tabela no fim do doc): copie o mais parecido e troque o conteúdo.

**Objetivo da página** (`npm run objetivos -- --ver <id>`; o estilo escolhido pode trocar o `carrossel.estilo`): `carrossel.sequencia` é o ponto de partida da ordem, `carrossel.slides` a quantidade, `carrossel.virais` os tipos virais que combinam com a página (do mais indicado ao menos) e `carrossel.visual` o visual, quando houver. O `fecho` leva a `cta.perguntaFinal` e o convite do `cta` do modelo.

## 1. Escolha o estilo do carrossel
Um carrossel tem uma cara só. Escolha pelo jeito do conteúdo, não por enfeite:

| Se o conteúdo é... | Estilo | Tipos |
|---|---|---|
| opinião, dica curta, frase de efeito, explicação em sequência | **post** | `tweet` em todos os slides (ou `thread` no meio); `visual` claro ou escuro |
| notícia, descoberta, anúncio | **jornal** | `manchete` ou `plantao` na capa, `numeros`, `linhatempo`, `texto` |
| dúvida comum, conta, conselho | **conversa** | `chat` (2 a 3 slides), `texto`, `fecho` |
| lista, checklist, lembrete | **nota** | `nota`, `veredito`; `visual: "claro"` |
| ranking, recorde, competição | **pódio** | `capafoto`, `podio`, `numeros`, `placar` |
| crença popular | **mito ou verdade** | `veredito` (um por slide), `capa` |
| números que mudam no tempo ou partes de um todo | **dados** | `grafico`, `numeros`, `tabela` |
| curiosidade com humor | **reação** | `reacao`, `capafoto`, `texto` |
| frase de alguém real, fé | **citação** | `citacao`, `versiculo`, `tipografico` |
| tutorial, saúde, receita | **passo a passo** | `passo` (um por slide), `receita`, `informativo` |
| comparação técnica | **tabela** | `tabela`, `grafico` de barras |
| fato visual (animal, lugar, objeto) | **foto** | `capafoto`, `vocesabia`, `anotada`, `divisao` |
| história, cultura, lugar | **revista ou colagem** | `revista`, `colagem`, `linhatempo`; `visual: "papel"` |
| um número ou frase que basta | **tipográfico** | `tipografico` (um slide pode usar `fundo: "destaque"`) |
| palavra, conceito, aula | **verbete e quiz** | `definicao`, `quiz` (pergunta e depois `revelar: true`), `codigo` |

Por tipo de página, os virais mais indicados: curiosidades `tweet`, `vocesabia`, `reacao`, `anotada`; aula `passo`, `definicao`, `quiz`, `codigo`; notícia `manchete`, `plantao`, `numeros`, `linhatempo`; finanças `chat`, `grafico`, `numeros`, `tabela`; fé `versiculo`, `citacao`, `tipografico`; negócio local `informativo`, `chat`, `passo`, `colagem`; receita `receita`, `capafoto`, `passo`; esporte `placar`, `podio`, `numeros`; saúde `veredito`, `nota`, `passo`, `informativo`; tecnologia `tabela`, `codigo`, `thread`, `linhatempo`; história `revista`, `linhatempo`, `citacao`, `colagem`; ciência `grafico`, `vocesabia`, `divisao`, `anotada`.

**Famílias de estilo** (`"visual"` no carrossel.json; cada slide troca a cor com `"cor"`): `editorial` (notícia, esporte: blocos de cor, `fotobloco`, `numeros`), `condensado` (mitos e listas: caixa alta condensada, `marcados`), `interface` (dados, saúde: `notificacao`, `painel`, `dialogo`, `nota`), `recorte` (história: tarjas e foto rasgada, `recorte`), `serifado` (história, cultura: revista serifada), `marcatexto` (reportagem: `fototopo` com marca-texto), `limpo` (aula, negócio: `versus` e `errocerto`), `grao` (tecnologia: papel granulado e `celular`). Uma família por carrossel; o exemplo de cada uma está em `carrosseis/ref-<família>-*`. Detalhes em `docs/carrossel-templates.md`.

## 2. Ritmo
Capa que prende (contradição, número, foto forte), miolo com uma ideia por slide, `fecho` com pergunta de opinião. Os clássicos (`capa`, `texto`, `dado`, `lista`, `comparacao`, `ranking`, `passos`, `mitofato`, `antesdepois`, `fecho`) e os virais se misturam. No estilo post, até a capa e o fecho são `tweet`. Não invente tipo.

| Formato | Miolo |
|---|---|
| Revelação | `capa` ou `capafoto`, `texto`, `dado`, `texto`, `fecho` |
| Mito x fato | `capa`, `veredito` (um por mito, até 4), `fecho` |
| Comparativo | `capa`, `tabela` ou `comparacao`, `grafico`, `fecho` |
| Antes e depois | `capa`, `divisao` ou `antesdepois`, `texto`, `dado`, `fecho` |
| Ranking | `capafoto`, `podio` ou `ranking`, `texto` sobre o 1º lugar, `fecho` |
| Número impossível | `tipografico` ou `dado`, `texto`, `numeros`, `fecho` |
| Passo a passo | `capa`, `passo` (3 a 5), `fecho` |
| Causa e efeito | `capa`, `texto`, `linhatempo`, `dado`, `fecho` |

## 3. Fotos e marca
- Logo ou bandeira conhecidos: `"imagem": "logo:<id>"` (ou `bandeira:<id>`) em qualquer campo de foto, ou `"logo"`/`"bandeira"` no slide para uma fileira de selos (`docs/marcas.md`); o crédito vai sozinho para o fontes.md.
- Foto: `node scripts/buscar-imagem.mjs <nome> "<nome + contexto do tema>" --carrossel --listar`. Você confere título/descrição (e a imagem) contra o tema do carrossel; descarta homônimo e candidato aleatório; só então `--escolha=N --nome=arquivo` e, nesta página, confirma com a pessoa. No slide, `"imagem": "assets/arquivo.jpg"` e `"foco"` se precisar. Crédito na legenda (a linha "Crédito para a legenda do post" do `fontes.md`), nunca na tela.
- Pessoa citada pelo nome usa foto real de licença livre, da pessoa certa no contexto do tema. Em política, mesmo tipo de slide, tamanho e filtro para todos os lados.
- `tweet`, `thread` e `chat` são sempre da própria página (nome, @ e avatar vêm de `marca/tokens.json`). Nunca simule post ou conversa de alguém real.
- `citacao` só com frase conferida; `versiculo` com a versão; `placar` com sigla, sem escudo; `reacao` só com os rostos próprios ou foto livre.

## 4. Limites (não estourar)
Clássicos: capa 60 caracteres, títulos 50, apoio 180, item de lista 60, lado da comparação 70, nome de ranking 34, valor 14, passo 40 + 70, mito e fato 80, texto de antes e depois 90. Virais: tweet 280 (150 com foto), post do fio 150, manchete 90, mensagem 90, afirmação 90, frase de citação 150, tipográfico 40; os outros estão no doc. Destaque com `*asteriscos*` ou `~til~` (sublinhado à mão), um por slide. O validador (`src/validar-carrossel.mjs`) confere tudo isso, as fotos e as licenças antes de renderizar.

## 5. Checagem automática
O gerador mede cada slide: texto sobreposto, perto da borda, cortado, letra menor que 26 px, foto que não carregou e área vazia (mais de 35% do quadro sem nada: ponha `fotoFundo`, número, `marcados` ou suba e aumente o texto). Corrija tudo o que ele apontar (encurte o texto, nunca a fonte). Depois rode `node scripts/folha-carrossel.mjs <nome>` e **olhe a folha** (`carrosseis/<nome>/folha.png`, slides a 360 px como no celular): a capa chama atenção sozinha? Dá para ler cada slide? A história segue em ordem? O post tem cara de post real da página? Corrija e gere de novo, no máximo 3 rodadas.

## Campos extras
`perfil`, `tema`, `visual` (`escuro`, `claro`, `papel`), `legenda` (com os créditos das fotos), `marcadores`, `fontes` (obrigatório: de onde veio cada número, 2 fontes por fato), `data` (AAAA-MM-DD, para a data da manchete e da nota).

Não peça aprovação. Entregue os PNGs e siga para `publicar`.
- Último slide: CTA do conteúdo mais o convite padrão da página (`cta.texto` de `ilustrando.config.json`), salvo se o roteiro for `CTA: simples`.




