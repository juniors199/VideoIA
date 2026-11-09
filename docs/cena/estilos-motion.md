

# Cena: estilos de motion (impresso, cartoes, tubo, linhas, anatomia, fino)

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `impresso`, `cartoes`, `tubo`, `linhas`, `anatomia`, `fino` | `forma` e os campos de cada estilo de motion (veja "Estilos de motion" abaixo) |

## Estilos de motion (`impresso`, `cartoes`, `tubo`, `linhas`, `anatomia`, `fino`)
Quatro estilos que redesenham o quadro inteiro com o fundo, a tipografia, a legenda, as transições, o acabamento das peças e o som do pacote de origem de cada um. Valem na cena (`"estilo": "tubo"`), **num beat só** (`"estilo": "tubo"` no beat, para misturar um momento de outro estilo num vídeo padrão) e como **elementos próprios** em qualquer beat (`{ "tipo": "tubo", "forma": "gigante", ... }`, desenhado por cima, sem o acabamento de tela cheia). Guias: `docs/estilo-impresso.md`, `docs/estilo-cartoes.md`, `docs/estilo-tubo.md`, `docs/estilo-linhas.md`. Modelos de vídeo prontos com o mesmo nome (`Modelo: tubo` no STATUS). Sem cama musical (efeitos por evento, como pedem os pacotes; o impresso traz a própria cama grave nos efeitos); `"efeitos": { "musica": true }` liga a cama.

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `impresso` | papel envelhecido, tudo em retícula de tinta (7,2 px, 45°), geométrica minúscula com entrada cinza -> tinta, cursiva, cartão preto, objetos de metal, pans e chicote medidos | `palavra` (`texto` com `*destaque*`), `cursiva` (`texto`), `cartao` (`lateral`, `texto`), `objeto` (`objeto`: rolo, cronometro, losango, play, tecla, livro), `manuscrita` (`texto`), `pagina` (folha que se desfaz em pontos: `desfaz` = palavra ou segundos, `dur`) |
| `cartoes` | creme `#E8E4DE` com grade de 96 px, cartões e janelas grafite, tiles 3D, lettering em degraus com destaque serifado na cor da marca, zoom-through e morph | `cartao` (`dados.tipo`: barras, orbita, avisos, codigo, tipografia, celular), `grade`, `janela` (`texto`, `chips`, `tecla`), `token` (`icones`), `tile` (`icone`, `papel`), `etapas` (`itens`), `chip` (`valor`, `sufixo`, `legenda`), `celular` (`texto`, `marca`, `qr: true` para o celular lendo um QR), `qr` (QR code de 25 módulos; `dados`: `rasgo`, `dano`, `recupera`, `rotuloDano`, `leitura`, `guias`, `gira`, `modulos`, `logo`, `etiqueta`, `niveis` e os tempos `emDano`, `emRecupera`, `emLeitura`, `emGuias`, `emNiveis`, `emModulos`), `cursor` |
| `tubo` | TV de tubo (máscara CRT, poeira, HUD), Roboto MAIÚSCULA por palavra inteira, palavra gigante em contorno, branco/vermelho/rosa, objeto holográfico que pousa em metal, fogo final | `frase` (`texto`), `gigante` (`texto`, `acima`, `abaixo`), `chave` (`texto` com `*destaque*`), `fogo` |
| `anatomia` | desenho técnico do objeto real em axonometria, papel claro, 4 tons por face, vista explodida pelos conjuntos reais (molas k 64 / c 14,2, 35 ms), pinos numerados, cartão com Fig, título, estado e leitura técnica (vale para a cena inteira) | `montado`, `explodido` (`passeio`), `peca` (`peca`: conjunto), `acao` (`acao`: `apertar` com `curso`, `soltar`, `toques` com `n`, `sinal`), `fechar`, `numero` (`valor`, `unidade`, `rotulo`); objeto em `objeto` (`interruptor`) ou declarado em `dados.pecas` e `dados.conjuntos` |
| `fino` | figura isométrica em traço fino (silhueta e um vinco) sobre o escuro, um único traço aceso que migra, nenhuma palavra dentro da figura, leitura curta no canto (vale para a cena inteira) | `repouso`, `parada` (`alvo`), `explode` (`alvo`), `junta`, `acao` (`chave-entra`, `chave-sai`, `chave-errada`, `gira`, `volta`, `trava`); objeto `fechadura` |
| `linhas` | preto puro, traço branco de 2 px, ponto protagonista que viaja e vira cada forma, legenda Poppins 38 px | `ponto`, `trajeto` (`dados.de`, `para`, `arco`, `tracejado`), `quadro`, `cabo` (corte de um cabo em camadas), `anel`, `grade` (`dados.cols`, `total`, `acesos`), `ondas`, `grafo`, `escada` (`dados.degraus`), `explosao`, `numero` |

Todos os elementos aceitam `entra`, `pos [fx, fy]` (frações da área da cena) e `tamanho`. Os elementos do motor se adaptam: o `titulo` vira a composição do estilo (bloco de frase no tubo, pequena + GRANDE + cursiva no impresso, lettering no cartoes; no linhas não aparece), o `contador` vira o número do estilo (gigante em contorno, número em tinta, chip, número com anel), a legenda ganha a tipografia do estilo (e some quando o texto do estilo já está na tela), `peca` ganha o material do estilo (contorno branco no linhas, holograma e metal no tubo, metal impresso no impresso, barro branco e roxo no cartoes), e `traco`, `rotulo` e `imagem` ganham o acabamento do estilo. Na `peca`, `dados.material: "original"` mantém a cor da peça no tubo e no impresso (no impresso, cor saturada vira tinta chapada de outra cor), para objetos cuja cor conta a história (mel, escala de pH, borda amarelada de livro). O QA mede as formas e os textos desenhados pelo estilo (margens, área segura, sobreposição com peça). **Regras de leitura e composição (impresso, cartoes, tubo, linhas), conferidas pelo QA a cada 0,1 s, inclusive durante as transições:** cada frase do lettering ou da legenda fica na tela do começo ao fim da fala dela (no mínimo 1,2 s ou a duração da frase) e só sai quando a próxima entra; nenhum texto acima de y 230 (nome do perfil), abaixo de y 1650 (faixa de baixo do Instagram) ou fora das margens; nunca mais de 0,5 s sem texto e sem objeto; o quadro 0 do MP4 é a própria cena (a capa fica só no `capa.jpg`). O protagonista (objeto, cartão, QR, livro) fica no centro com 55 a 70% da área útil (y 250 a 1450); o QA avisa quando ele fica pequeno ou só na metade de cima. O último beat vai até o fim do vídeo, sem tela vazia depois da fala.

```json
{ "tema": "MEL", "estilo": "tubo", "beats": [
  { "id": "gancho", "palavras": [0, 10], "titulo": { "texto": "Um pote de mel pode durar *milhares de anos*" } },
  { "id": "agua", "palavras": [30, 53], "elementos": [ { "tipo": "tubo", "forma": "gigante", "texto": "ÁGUA", "acima": "falta de", "abaixo": "bactérias secam", "entra": "água" } ] },
  { "id": "virada", "palavras": [54, 65], "estilo": "linhas", "elementos": [ { "tipo": "linhas", "forma": "escada", "entra": "ácido" } ] } ] }
```
Exemplos completos (roteiro, fontes e cena prontos para copiar): `projetos/exemplo-estilo-impresso`, `exemplo-estilo-cartoes`, `exemplo-estilo-tubo`, `exemplo-estilo-linhas`, `exemplo-estilo-anatomia` e `exemplo-estilo-fino`; o guia de cada um é `docs/estilo-<nome>.md`. Guias da anatomia e do fino: `docs/estilo-anatomia.md`, `docs/estilo-fino.md`.

## Anatomia e fino: autoria obrigatória antes do render

Antes de renderizar, leia `docs/estilo-anatomia.md` ou `docs/estilo-fino.md` e execute `node scripts/autorar-objeto.mjs <projeto>`. Escreva o objeto específico do pedido, inclusive sua ação e contexto. Não basta dar ao bloco genérico o nome do assunto.

1. Grave `sujeito.json`: `{ "sujeito": { "conceito": "objeto e ação", "tipo": "objeto", "partes": ["base", "mecanismo"], "estado": ["montado", "acao"], "dados": { "objeto": "id-local" } }, "beats": { "1": { "estado": "montado" }, "2": { "estado": "acao" } } }`. Em cena manual, copie o sujeito para `cena.sujeito` e os estados para `beat.sujeito.estado`.
2. Grave `pecas.js` com `export const anatomia = { "id-local": descritor }` ou `export const fino = { "id-local": descritor }`. Descritor JSON: `nome`, `conjuntos` com `id` e `move`, `ordemProfundidade`, `estados` e `pecas`. Cada peça tem `id`, `conj`, `forma`, `em: [x,y,z]`, `tam: [largura,profundidade,altura]`; formas: `caixa`, `cilindro`, `lathe` com `perfil: [[z,raio],...]`, `tube` com `rota: [[x,y,z],...]` e `raio`.
3. Anatomia exige pelo menos três peças, dois conjuntos, apoio em z=0 e cada conjunto listado uma vez na ordem de profundidade. Fino proíbe texto na figura e permite só um `destaque` por estado ou beat. Declare os nomes de estados usados nos beats em `estados`; movimento usa `deslocamentos: { conjunto: [dx,dy,dz] }`.
4. Execute novamente o comando até não haver pendências. Confira a silhueta e a correspondência entre partes, ação e fala. Só então renderize com o estilo solicitado. Falha de autoria exige completar o objeto, nunca trocar o estilo ou usar uma peça decorativa. Os exemplos completos dos guias cobrem um mecanismo e um organismo.

## Estilos de motion: impresso, cartoes, tubo e linhas
Leia o guia do estilo (`docs/estilo-<nome>.md`; campos na seção "Estilos de motion" acima, neste arquivo) antes de escrever.
- **Uma forma ou objeto do estilo por frase**, entrando na palavra que ela ilustra: `linhas` (ponto, trajeto, quadro, cabo, ondas, grafo, escada, grade, anel, explosão; o ponto viaja entre elas, então deixe 0,8 s entre entradas), `tubo` (frase, gigante de 4 a 6 letras, chave, fogo no fecho; peças voam em holograma e pousam em metal), `impresso` (título ou `palavra` com a palavra grande em `*destaque*`, cursiva, cartão, objeto de metal, manuscrita ou página que se desfaz no fecho), `cartoes` (grade, janela digitando com tecla, token, cartão, tile, etapas, chip, celular, qr; ponha a caixa principal primeiro para o morph de continuidade e use `"som": "virada"` para o zoom-through). Em todo quadro tem de haver um protagonista ligado ao que a fala diz (o objeto real, não um ícone genérico; se ele não existe, crie em `pecas.js`), e nenhuma tela fica vazia por mais de 1 s.
- **Leitura e composição:** no `impresso`, escreva o `titulo` com a frase inteira do beat (o resto vira a cursiva); no `cartoes`, o lettering sai da fala. Texto nenhum fica menos que o tempo de ler a frase, sai antes da fala acabar, encosta no topo ou passa de y 1650; o protagonista fica no centro com 55 a 70% da área útil (y 250 a 1450); nunca 0,5 s de tela vazia. O QA confere a cada 0,1 s; revise o MP4 a 5 quadros por segundo.
- Num vídeo de outro estilo, `"estilo": "<nome>"` no beat põe só aquele momento no estilo; o elemento solto (`"tipo": "tubo"`) aparece por cima.
- Texto do estilo e peça não podem se cruzar (o QA reprova): deixe o texto no alto (título) e a peça na faixa da cena, ou use `pos`.
- Confira a folha de contato: a forma se lê sem a narração? algo sai da tela? a legenda some quando o texto do estilo está na tela?




