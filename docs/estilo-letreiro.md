

# Estilo letreiro: a frase em lettering, o objeto real embaixo

`"estilo": "letreiro"` faz cada beat virar uma frase editorial grande, escrita **na marca da página** (fundo, destaque e apoio de `marca/tokens.json`), com o objeto real do assunto embaixo (peça 3D, modelo GLB, foto ou número). As palavras entram no instante em que são ditas, já na posição final (a frase não pula), a palavra de destaque ganha a cor da marca (ou um marca-texto no fundo claro) e um fio cresce sob a frase quando ela termina. Serve a qualquer página: tese de curiosidade, conceito de aula, número de finanças, manchete de notícia, versículo curto, mito x fato de saúde, oferta de negócio local, passo de receita.

## Processo
1. **Fala de 28 a 46 s** (modelo `letreiro`: 80 a 130 palavras), frases curtas.
2. **Um título por beat que sintetiza a fala** (até ~40 caracteres, `*destaque*`): o letreiro nunca repete a legenda; com o letreiro na tela a legenda some (ela só volta quando o beat não tem texto).
3. **Sempre o objeto real embaixo**: peça, `glb-*`, foto (`imagem`) ou `contador`. Beat sem objeto avisa no validador (a tela sem protagonista reprova).
   - **Câmera** (`camera.js`, personalidade `letreiro`): o objeto acompanha a câmera da fala (push-in na palavra de destaque, deriva leve) e, quando o beat mostra a parte citada (`aquenio`, `close`, `corte`, `aberta`, `ovario`), ganha um push-in extra de até 4,5% no objeto; o texto anda só 12% (`camadaTexto`), na coluna fixa.
   - **O objeto com o detalhe de que a fala trata.** Fruta e flor do repertório têm a cor e o detalhe reais e estados por `dados.estado`, para a tela mostrar a parte citada: `morango` (`inteiro`, `aquenio` com um aquênio destacado, `close` com os aquênios de perto numa lente, `corte` mostrando o receptáculo, `flor` com a flor cuja base incha até virar o morango), `banana` (`aberta`, com a polpa e as sementinhas), `uvas` (cacho com talo) e `flor` (margarida; `ovario`, a flor em corte com o ovário destacado). Nada de peça facetada genérica quando o assunto pede detalhe.
4. Beats de 2 a 4 s; se a fala do beat continua depois do título, ponha uma segunda frase (`frase` com `entra`) ou um item de lista.
5. Cena, QA (`--sem-render`), folha de quadros a 5 por segundo (`node scripts/checklist-fidelidade.mjs <projeto>`), render.

## Regras (das auditorias, ver scratchpad/porte-brabo/AUDITORIA-*.md)
- Palavra: entra em 0,32 s (subida de 24 px, escala 0,94 -> 1, desfoque 3 -> 0), presa à palavra da fala. Número dito por extenso aparece ao longo da pronúncia.
- Coluna fixa: texto alinhado à esquerda em x = 92, primeira linha de base em y = 420 no vídeo inteiro; até 2 linhas de 96 a 70 px (nunca diminuir para caber: encurte).
- Tom do fundo: `escuro` (padrão), `claro` (papel `#F4F1E8`, peças em tinta escura) e `destaque` (a cor da marca); o beat com `"som": "virada"` vira `destaque` sozinho; escolha com `"tom"` no beat. Troca em corte seco.
- Troca de frase dentro do beat por velocidade (a que sai acelera para a câmera, a nova continua o movimento): nenhum quadro vazio.
- O protagonista do beat já está entrando no corte; no beat 0 ele já está no quadro 0 (sem flash de capa: a capa sai só em `capa.jpg`).
- Grão que ferve a cada 0,28 s; texto de apoio com no mínimo 54 px; nada abaixo da faixa da legenda.
- Som por evento (abaixo da voz): whoosh na troca, tique no destaque, riser + impacto na virada, pop + ding na lista, risco, tiques do número.

## Formas (`{ "tipo": "letreiro", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `frase` | segunda frase do beat, troca por velocidade na palavra | `texto` (com `*destaque*`), `entra` |
| `lista` | itens que entram e acendem na palavra, com check desenhado | `itens`: `["texto"]` ou `[{ "texto", "em": "palavra" }]` (até 5) |
| `risco` | frase riscada na palavra e a correta entra embaixo com marca-texto (mito x fato) | `texto`, `troca`, `entra`, `em` |
| `desliga` | fecho: a tela vira uma linha e apaga (no fim do último beat) | `entra` |
O `contador` vira número gigante (no claro e no destaque, com marca-texto), com a `legenda` em 54 px acima.

```json
{ "tema": "MORANGO", "estilo": "letreiro", "beats": [
  { "id": "gancho", "palavras": [0, 10], "titulo": { "texto": "Para a botânica, o morango *não é* fruto" }, "elementos": [ { "tipo": "peca", "forma": "morango", "entra": 0 } ] },
  { "id": "banana", "palavras": [11, 16], "tom": "claro", "titulo": { "texto": "E a banana é *baga*" }, "elementos": [ { "tipo": "peca", "forma": "banana", "entra": 0 } ] },
  { "id": "embrapa", "palavras": [46, 54], "elementos": [ { "tipo": "letreiro", "forma": "risco", "texto": "fruto", "troca": "pseudofruto", "entra": "chama", "em": "pseudofruto." }, { "tipo": "peca", "forma": "morango", "dados": { "estado": "corte" }, "entra": 0 } ] },
  { "id": "duzentos", "palavras": [69, 73], "som": "virada", "elementos": [ { "tipo": "contador", "valor": 200, "prefixo": "~", "legenda": "frutos em cada morango", "entra": "São", "dur": 0.6 } ] } ] }
```
Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-letreiro`.

## Misturar
`"estilo": "letreiro"` num beat de outro estilo põe aquele momento no lettering da marca; `frase`, `lista` e `risco` soltos num beat de outro estilo aparecem por cima.

Técnica reescrita (sem código nem imagem de terceiros) a partir das auditorias do pacote BRABO "edição de vídeo dinâmica" (modo tela cheia editorial do ChatGPT, Automatizar-Processo, Internet-Cansada e Empresa-Light) e do método de corte por velocidade da PRODUÇÃO DE VÍDEOS. Ver `AVISOS-TERCEIROS.md`.


## Kit aberto (Onda 4): o assistente escreve a peça de cada ideia

**Desde a 0.6.41 o estilo escolhido nunca é trocado:** sem a peça do assunto em `pecas.js` (ou com ela recusada para o roteiro), o estúdio monta na hora a versão simplificada (a frase de cada trecho num cartão do estilo, aviso `kit-simplificado` no relatório); a ilustração do assunto continua sendo sua. Esta regra vale para todos os estilos de kit aberto (letreiro, colagem, ribalta, mundos, interface, cartoes, tubo, impresso, fino, anatomia).

O motor não traz mais "a peça pronta" para o assunto: quem desenha é você, em `projetos/<nome>/pecas.js`, e o motor só executa e **recusa com explicação** quando falta a peça (nenhum recuo para outro estilo, outra forma ou peça 3D genérica).

Processo, por vídeo:
1. No `sujeito.json` (ou `cena.sujeito`), aponte o desenho em `dados.objeto` (ex.: `"cena-01"`) e, se a fala cita pessoa pelo nome, `tipo: "pessoa"` e `dados.pessoa`.
2. Escreva o descritor em `pecas.js` (só JSON, sem funções). Coordenadas de 0 a 100; `ordem` lista os estados (um por beat: o mundo acumula); cada item nasce em `de`. Texto dentro do desenho: 5,4 unidades ou mais (34 px).
3. Rode `node scripts/verificar-casos-abertos.mjs letreiro` como modelo de checagem estática (kit válido, plano pela intenção, verificador do estilo) e depois o vídeo; revise a 5 quadros por segundo.

O planejador (`src/video/autoplano-letreiro.mjs`) decide a representação pela **intenção da frase** (`autoplano-intencao.mjs`): etapas, causa-efeito, mudança, por quê, consequência, mecanismo, comparação, escala, escolha, busca. Se a intenção pede um dado que o kit não declara (risco, etapas, causa e efeito, verbo da interface), o plano devolve erro em vez de trocar de forma.

Galeria de revisão das cenas sem renderizar vídeo: `node test/estilos-abertos/galeria.mjs <pasta> letreiro|colagem 1 10`.
Conformidade aberta (30 casos, sem ElevenLabs): `node scripts/conformidade-aberta.mjs --estilo=<id> [--casos=1,2]`. O caso só conta como aprovado com a revisão visual registrada em `test/estilos-abertos/<id>/revisao.json`.

### Letreiro: o mundo ilustrado junto do lettering
`export const letreiro = { "cena-01": { nome, ordem, partes, itens, estados, letras, risco, etapas, numero } }`.
- `itens`: `ret`, `elipse`, `poli`, `linha`, `arco`, `caminho`, `texto`, com `papel` (tinta, destaque, claro, apoio, sombra, verde, agua, vermelho, marrom, amarelo, verde2, marrom2, terra, agua2, roxo, rosa), `de` (estado em que nasce) e `ate`.
- `estados.<nome>`: `mover: { id: [dx, dy, rotação, escala] }`, `alfa`, `destaque: [ids]` (o traço de destaque).
- `partes`: conceito -> ids (liga o desenho ao pedido; o verificador exige relação com o assunto).
- `letras`: o lettering de cada estado (até ~18 letras numa linha: no zoom de saída da frase passa da área segura acima disso); `causa` e `efeito` (intenção causa-efeito), `risco: { texto, troca }` (mudança), `etapas: [..]` (etapas), `numero: { valor, legenda }` (por quê).
- Elemento do beat: `{ "tipo": "letreiro", "forma": "mundo", "objeto": "cena-01", "estado": "acao" }`. Foto de pessoa nomeada: elemento `imagem` com `busca` (cartão do letreiro; `reservaBeat` põe o mundo se a foto não vier).
Tabela: tese e mecanismo = frase + mundo; causa-efeito = duas frases + mundo; mudança = risco + mundo; etapas = lista uma vez e o mundo nos outros beats; por quê = frase + mundo + número sozinho em um beat; consequência = mundo + frase e fecho em tom de destaque.
Verificador: `src/video/verificadores/estilo-letreiro-verificar.mjs` (mundo existe e é válido, estado na ordem, relação com o pedido, forma repetida, mundo parado, título que passa da margem, beat sem protagonista).




