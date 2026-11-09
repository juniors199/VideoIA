

# Estilo colagem: a foto real em papel, recortada e presa com fita

`"estilo": "colagem"` transforma a foto real do assunto (licença livre, `scripts/buscar-imagem.mjs`) numa colagem editorial: a foto vira recorte em preto e branco num papel que **desdobra a partir do topo**, preso por duas fitas, com o nome da obra num selo; a mesma foto, desfocada e escura, vira o fundo do beat; peças 3D viram recortes de papel com contorno branco e halo; tudo treme como stop motion. Título em cartão de papel, carimbo e nota manuscrita como elementos próprios. Na marca da página. Serve a curiosidades com pessoa, lugar ou objeto real, história, notícia, fé (obra de domínio público), ciência e negócio local (foto do produto).

## Processo
1. **Fala de 32 a 46 s** (modelo `colagem`), com 3 a 6 fotos reais: baixe com `node scripts/buscar-imagem.mjs <projeto> "<termo>" --escolha=N` (licença registrada em `fontes.md`).
2. **Uma foto real por ideia**, a do protagonista no primeiro segundo. Nunca uma foto genérica no lugar do assunto (se não existe foto do assunto, troque o assunto da cena ou use a peça 3D certa).
3. `obra` no elemento `imagem` vira o selo (até ~18 caracteres, 54 px). O crédito vai na legenda do post, não na tela.
4. Carimbos e notas para os números e nomes ditos (na palavra); eles ficam no canto da foto, nunca sobre texto.
5. Cena, QA, folha a 5 quadros por segundo e `node scripts/checklist-fidelidade.mjs <projeto>`, render.

## Regras (das auditorias)
- Papel que desdobra: rotateX -85° -> 0 a partir do topo em 0,64 s (saída cúbica), escala 0,88 -> 1, aproximação 1 -> 1,05 durante o beat, fitas creme translúcidas a -3° e +4°, vinco no meio (BRABO, Bom-Gosto).
- Fundo: a foto do beat desfocada 26 px a 34%; na troca de beat a anterior fica por baixo até a nova cobrir (nunca uma faixa escura no corte).
- Recorte (PNG com transparência, `"forma": "recorte"`, e as peças 3D): silhueta branca em 16 direções (7 px) + halo de 28 px, preto e branco com contraste 1,15 (BRABO, Internet-Cansada).
- Tremor de stop motion a cada 0,28 s (±1,5 px, ±1 px, ±0,4°); grão que ferve.
- Título em cartão de papel na coluna fixa (x = 92, linha de base em 420), sem giro; palavras na fala; número dito aparece ao longo da pronúncia.
- A nota dá lugar à foto ou peça que chega depois dela no mesmo beat (nunca uma por cima da outra); o carimbo fica dentro das margens.
- Textura de papel muito leve por cima da composição inteira: fibras e grão finos sobre cinza neutro, em soft-light a 10%, estática (não treme). Cinza neutro em soft-light não muda a média: as fotos não escurecem e o texto não perde contraste.
- Câmera (`camera.js`, personalidade `colagem`): o fundo desfocado anda 35% (parallax), as fotos e as peças entram com um deslize curto no corte e um dutch leve alternado (até 0,7°); o texto anda só 12%.
- Som de papel: whoosh curto e slap quando abre, scribble na nota, thunk no carimbo.

## Formas (`{ "tipo": "colagem", "forma": ... }`) e campos da `imagem`
| forma | o que faz | campos |
|---|---|---|
| `nota` | papel rasgado com fita e escrita manuscrita aparecendo | `texto` (até ~22 caracteres), `pos`, `inclina` |
| `carimbo` | carimbo circular na cor da marca, batido na palavra | `texto` (1 ou 2 palavras), `pos`, `tamanho`, `inclina` |
| `imagem` (motor) | papel que desdobra; `"forma": "recorte"` para PNG transparente | `arquivo`, `obra`, `largura`, `altura`, `foco [fx, fy]`, `fundo: false`, `de: "baixo"` |
O `contador` vira número num cartão de papel com a legenda na cor da marca.

```json
{ "tema": "PEDRO II", "estilo": "colagem", "beats": [
  { "id": "gancho", "palavras": [0, 8], "titulo": { "texto": "O Brasil teve um imperador de *cinco anos*" }, "elementos": [ { "tipo": "imagem", "arquivo": "assets/pedro-crianca.jpg", "obra": "Pedro e as irmãs", "largura": 600, "altura": 600, "entra": 0 } ] },
  { "id": "abdicacao", "palavras": [9, 20], "titulo": { "texto": "Em 1831, Pedro Primeiro *abdicou*" }, "elementos": [ { "tipo": "imagem", "arquivo": "assets/abdicacao.jpg", "obra": "A abdicação", "largura": 800, "altura": 500, "entra": "Em" }, { "tipo": "colagem", "forma": "carimbo", "texto": "1831", "entra": "1831,", "pos": [0.82, 0.14] } ] } ] }
```
Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-colagem`.

Técnica reescrita (sem código nem imagem de terceiros; as colagens do pacote não acompanham o estúdio) a partir das auditorias do pacote BRABO (Bom-Gosto, Internet-Cansada, Automatizar-Processo). Ver `AVISOS-TERCEIROS.md`.


## Kit aberto (Onda 4): o assistente escreve a peça de cada ideia

O motor não traz mais "a peça pronta" para o assunto: quem desenha é você, em `projetos/<nome>/pecas.js`, e o motor só executa e **recusa com explicação** quando falta a peça (nenhum recuo para outro estilo, outra forma ou peça 3D genérica).

Processo, por vídeo:
1. No `sujeito.json` (ou `cena.sujeito`), aponte o desenho em `dados.objeto` (ex.: `"cena-01"`) e, se a fala cita pessoa pelo nome, `tipo: "pessoa"` e `dados.pessoa`.
2. Escreva o descritor em `pecas.js` (só JSON, sem funções). Coordenadas de 0 a 100; `ordem` lista os estados (um por beat: o mundo acumula); cada item nasce em `de`. Texto dentro do desenho: 5,4 unidades ou mais (34 px).
3. Rode `node scripts/verificar-casos-abertos.mjs colagem` como modelo de checagem estática (kit válido, plano pela intenção, verificador do estilo) e depois o vídeo; revise a 5 quadros por segundo.

O planejador (`src/video/autoplano-colagem.mjs`) decide a representação pela **intenção da frase** (`autoplano-intencao.mjs`): etapas, causa-efeito, mudança, por quê, consequência, mecanismo, comparação, escala, escolha, busca. Se a intenção pede um dado que o kit não declara (risco, etapas, causa e efeito, verbo da interface), o plano devolve erro em vez de trocar de forma.

Galeria de revisão das cenas sem renderizar vídeo: `node test/estilos-abertos/galeria.mjs <pasta> letreiro|colagem 1 10`.
Conformidade aberta (30 casos, sem ElevenLabs): `node scripts/conformidade-aberta.mjs --estilo=<id> [--casos=1,2]`. O caso só conta como aprovado com a revisão visual registrada em `test/estilos-abertos/<id>/revisao.json`.

### Colagem: metáfora por ideia e imagem pela intenção
`export const colagem = { "cena-01": { nome, ordem, partes, itens, estados, nota, carimbo, foto } }`. O desenho é o mesmo formato vetorial do letreiro, desenhado como recortes de papel (contorno branco, sombra de contato, tremor de stop motion).
- Elemento do beat: `{ "tipo": "colagem", "forma": "metafora", "objeto": "cena-01", "estado": "acao" }`.
- Imagem pela intenção: pessoa nomeada = foto real em papel desdobrável (nunca boneco) com nota; coisa real e específica (`foto: { busca, beat: "primeiro" | "ultimo" }`) = foto no gancho ou no fecho e a metáfora explica; processo, causa e ideia = recortes desenhados.
- Carimbo pela intenção: etapas = PASSO n; causa-efeito = CAUSA e EFEITO; mudança = ANTES e DEPOIS; por quê = POR QUÊ?; consequência = E ENTÃO?. Nota e carimbo ficam acima do desenho (nunca sobre a peça nem sobre a foto).
Verificador: `estilo-colagem-verificar.mjs` (metáfora válida, relação com o pedido, pessoa sem foto, estado parado, carimbo da intenção).




