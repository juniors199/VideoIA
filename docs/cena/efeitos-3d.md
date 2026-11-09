

# Cena: efeitos das cenas novas (continuidade, queda, física, luz, virada)

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Continuidade de peças (vídeos novos)
Em cenas novas, use `"efeitos": { "continuidade": true }`. O plano automático já grava esse campo. Sem ele, a cena conserva o comportamento anterior.

Peças em beats vizinhos com o mesmo `id`, `forma`, `dados`, `papel` e `cor` continuam na tela (0.6.19: `rot`, `gira`, `escala`, `pos` e `entrada` podem mudar; a peça não entra de novo, só se transforma), herdando o relógio da animação e a fase do giro. Posição, escala e rotação mudam: o motor interpola a pose no mundo em 0,45 s. O piso não desaparece no corte. Uma cadeia só tem uma instância visível a cada instante.

`"continua": true` na peça força a ligação com a peça de mesmo `id` e `forma` no beat anterior (também permite atualizar `dados`); `false` em qualquer ponta recusa. Sem id, só há ligação automática quando o pareamento é único. Objetos iguais simultâneos devem ter ids diferentes. O mesmo `id` representa o mesmo objeto, não apenas o nome da forma.

## Entrada por queda (vídeos novos)
Use `"efeitos": { "continuidade": true, "entrada": "queda" }` em cenas novas. O autoplano já inclui os campos. Sem `entrada` ou com `"entrada": "legado"`, o motor mantém a entrada anterior. Só existem esses dois valores, e só no `efeitos` da cena: outro valor (como `"cai"`, `"stop-motion"` ou `"desliza"`) o estúdio troca por `queda` (ou `"padrao"` por `legado`) e avisa; o campo escrito dentro de um beat sobe para a cena (0.6.30).

A peça chega de cima em queda acelerada (0,44 s), para no chão e fica, sem quique e sem compressão (regra do estúdio de 26/10/2026). O plano de apoio é respeitado depois da rotação e da animação da peça; ela nunca nasce abaixo dele. Disco e sombra respondem à altura, e o cenário não sobe quando a peça entra. O movimento é função do tempo, inclusive ao buscar quadros fora de ordem. Numa peça contínua, o pouso só acontece na primeira entrada da cadeia. Esse modo mantém o apoio no chão durante o pouso; a física geral, os objetos voadores e os contatos entre peças são escopo posterior.

## Virada limpa e fim (0.6.3)
Nos estilos `padrao`, `editorial`, `minimalista` e `papel` a troca de beat é um corte seco sem quadro vazio: a peça do beat que termina fica inteira até o corte (não encolhe nem sobe mais nos últimos 0,22 s), e o primeiro protagonista do beat seguinte (peça, foto, número, pontos) já está na tela no quadro do corte, mesmo que o `entra` peça uma palavra mais adiante; as outras peças do beat continuam entrando na palavra delas. Foto e número que entram no corte já chegam com 1/3 da opacidade, e as barras já começam a subir. O desfoque de entrada fica em 7 px por 0,26 s. `"efeitos": { "viradaLimpa": false }` volta ao comportamento antigo.

O último beat vai até o fim do vídeo em todo estilo (antes, nos estilos do 3D, a peça saía no fim da narração e sobravam ~0,7 s de fundo). `"cauda": 0.35` (no nível de cima da cena) muda quantos segundos o vídeo dura depois da última palavra (padrão 0,6; de 0,2 a 2). Não remende vídeo depois do render (trocar quadros, segurar o último): isso congela a imagem; o QA do arquivo reprova imagem congelada na virada e no fim. Para conferir qualquer MP4: `node scripts/conferir-viradas.mjs <projeto> [arquivo.mp4]`.

O chão do cenário acompanha a composição do beat (com fases de entrada, a 1ª peça sozinha fica mais baixa e o piso desce junto) e fica na altura real do piso de cada cenário (tapete, estrado). O apoio da peça é a base do desenho, sem a caixa invisível de encaixe: a peça encosta no piso, sem afundar nem flutuar. O QA reprova peça com a base mais de 4 px abaixo do piso (`peca-no-chao`).

## Física para cenas novas
Use `"efeitos": { "continuidade": true, "entrada": "queda", "fisica": true }`. O autoplano grava essas opções apenas ao criar cenas novas. Sem `fisica`, o movimento anterior permanece.

Objetos apoiados não oscilam no piso. `"flutua": true` reserva uma folga aérea e mantém a oscilação de voo. O giro acelera a partir da primeira entrada da cadeia; o pouso tem compressão suave e assentamento amortecido.

Para empilhar, use `"apoio": "id-da-base"` na peça superior. Para contato lateral, `"encosta": { "em": "id-da-base", "lado": "direita" }`, com lado `direita`, `esquerda`, `frente` ou `tras`. Os contatos são medidos após rotação e animação, com uma folga de 0,015 unidade no mundo. O motor resolve dependências antes das peças superiores, inclusive se a ordem declarada for inversa. Uma peça dependente espera o apoio aparecer. Não combine apoio/encosta com flutua; referências inexistentes e ciclos são recusados.

Rótulos acompanham as caixas atuais após os contatos e procuram espaço livre ao redor do alvo. Se não houver posição legível, ficam ocultos em vez de cobrir uma peça. Reorganize a cena nesse caso. Não é uma simulação de colisões livres: objetos independentes não recebem impulso entre si; relações de contato são explícitas.

## Luz de estúdio para cenas novas
`"efeitos": { "luz": "estudio" }` ativa a iluminação nova. O autoplano novo já grava esse campo. Ausente ou `"legado"` conserva a iluminação anterior.

Há luz hemisférica com cores de céu e chão derivadas da atmosfera do cenário (campos `ceu` e `chao` em `userData.atm` dos cenários locais, com cores de reserva misturadas ao fundo), chave quente e recorte frio. O mapa PCF de 2048 se ajusta às peças visíveis e à projeção de suas sombras. Manchas radiais de contato ficam mais escuras junto ao apoio e mais fracas/espalhadas em voo. Uma oclusão suave por vértices escurece junções de malhas estáticas; contatos entre peças recebem mancha no apoio.

O tone mapping é ACES com exposição 1,05. Faces oficiais de logos já usam materiais sem tone mapping, preservados pelo modo novo. A oclusão clona geometria/material por instância e acompanha as cores dos materiais originais, sem alterar a biblioteca compartilhada. Isso é uma aproximação de oclusão, não uma simulação de luz global.

## Figuras humanas adultas para cenas novas
`"efeitos": { "gente": "adulto" }` ativa o refinamento da figura humana. Modo experimental reprovado na revisão do estúdio em 24/10/2026, com melhoria interrompida. Não usar em produção. O autoplano não grava esse campo. Ausente ou `"legado"` conserva a base anterior. `dados.rig: "legado"` recusa a mudança em uma peça; `"adulto"` ativa só nela.

A base existente de rosto, nariz, sobrancelhas, cabelo e roupas é preservada. A cabeça menor leva as figuras de corpo inteiro testadas a cerca de 6,8 a 7 cabeças; as mãos ganham dedos separados, a camisa recebe dobras em relevo e a postura neutra ganha contrapeso. Respiração leve no tronco, sem oscilar a raiz da pessoa. Articulações, poses e acessórios continuam no mesmo esqueleto. Bustos, trios e miniaturas instanciadas também respeitam o campo, mantendo as geometrias antigas em cache separadamente.

Bonecos continuam reservados a pessoas genéricas; pessoas reais citadas pelo nome seguem as regras de foto editorial. Peças humanas próprias de um projeto não são redesenhadas por esse campo.




