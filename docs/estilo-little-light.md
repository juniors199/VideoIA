

# Estilo little-light (o fundo do mar que brilha)

> **Cor:** a palavra-chave da legenda, os pontinhos de luz que formam o número e o botão do fecho leem a cor de destaque da página (`marca/tokens.json`, personalizável), em tons derivados (`tonsDaMarca`). A água azul-marinho e o brilho rosa, azul e violeta das criaturas são a paleta do cenário. Auditoria em `docs/cor-da-marca.md`.

Porte de 04/11/2026 a partir de um quadro de referência (filme infantil feito em código: noite submarina com bioluminescência) e de um kit de desenho animado em código com roteiro e plano de cena de exemplo. Análise detalhe por detalhe feita fora do kit. Daqui vem só a técnica e a aparência: nenhum desenho, frase, personagem, música ou código de terceiros. As criaturas, o mar, as luzes e a textura são desenhados por código (`src/video/engine/estilo-little-light*.js`, base comum `cartoon-ilustracao.js`).

Não confundir com o `prickles` (livro de outono, mesma família e mesma legenda): aqui é noite no fundo do mar e tudo brilha.

Para quem: oceano, noite, medo do escuro, ciência que surpreende (bioluminescência, profundidade), histórias de coragem contadas como fábula.

## Regras do estilo (medidas na referência; valem acima das regras gerais de layout dos Reels)

| Regra | Observação na referência | No estúdio |
|---|---|---|
| Água | azul-marinho que escurece para baixo, quase preta no fundo | 5 cenários com degradê de 3 cores, névoa azul, rochas em arco nas bordas |
| Personagem | baleia azul pequena de barriga creme, olho com brilho, bochecha rosada, borda iluminada | `baleia` por dados (cauda que ondula, nadadeira que bate, pregas na barriga, contorno com brilho, piscar, expressão `aberto`, `feliz`, `medo`, `surpreso`) |
| Criaturas | águas-vivas que brilham em rosa e azul, plâncton em nuvens | `agua-viva-rosa`, `agua-viva-azul`, `agua-viva-violeta` (sino que pulsa e sobe, tentáculos que ondulam), `peixe-lanterna` (isca que pisca, fotóforos), `peixinho`, `baleia-grande` (silhueta da família) |
| Luz | brilho suave, nunca estourado | todo brilho soma num canvas próprio e entra em "screen" com teto de 0,82; o QA do MP4 reprova mais de 0,4% de pixels brancos |
| Partículas | pontinhos de luz em nuvens, alguns perto e grandes (desfocados), outros longe | plâncton em 3 profundidades (perto maior e mais apagado), bolhas que sobem, neve marinha |
| Profundidade de campo | o perto e o longe desfocados | camadas pintadas: fundo (8 px), rochas do meio (2 px), rochas da frente (5 px); algas no meio |
| Revelação | do roteiro: "tudo tinha uma luz por dentro, apagada até a revelação" | antes da forma `acende` o mar fica no escuro (0,18); na `chave` as criaturas acendem uma a uma (0,32 s entre elas) e o coral liga de baixo para cima; depois fica aceso |
| Câmera | do roteiro: a câmera desce da superfície; deriva calma | `desce` na primeira cena (290 px em 3,4 s), `deriva`, `paralaxe`, `push`, `recua` no fecho; trava da área segura por plano |
| Palavras na tela | as palavras pipocam quando ditas, no alto, sobre a água | uma linha (até 22 caracteres) em Fraunces 600 72 px creme, centro em y 420, com contorno escuro e sombra leve; a chave em Fraunces 900 na cor da marca |
| Transições | troca calma | `fusao`, `escuro` (mergulha no azul quase preto e volta) e `bolhas` (fusão com uma subida de bolhas) |
| Textura | papel e feltro na origem | overlay de papel em soft-light a 0,32 (dá textura e tira o degrau do degradê) e vinheta azul de 0,5 |
| Áudio | caixinha de música e celesta, "ping" macio em cada luz | trilha ElevenLabs Music no clima `ambiente`/`inspirador`; efeitos do banco a -22 a -30 dB: `ping` por luz que acende, sopro de água na troca, `shimmer` no número, `click` no fecho |

## Formas (`{ "tipo": "little-light", "forma": ... }`)

| Forma | Cena | A ação (na `chave`) |
|---|---|---|
| `cena` | a baleia (e quem a fala citar: águas-vivas, peixes; `familia: true` põe as baleias grandes passando ao longe) | a expressão e o piscar; as luzes no nível de `aceso` |
| `pisca` | o escuro com a baleia em cima | um ponto de luz pisca duas vezes lá embaixo e o peixe-lanterna sobe; cada "outra" dita acende mais uma luz |
| `acende` | a baleia com águas-vivas e o peixe-lanterna no jardim de coral | as criaturas acendem uma a uma, o coral liga, o plâncton se acende |
| `numero` | os pontinhos de luz se juntam e formam o número (`texto`, até 5 caracteres, como `3/4` ou `76%`) na cor da marca | o plâncton voa até o algarismo |
| `cta` | pílula de luz na cor da marca com "comente" e a palavra; a baleia e as águas-vivas | |

Campos: `personagens` (ids ou `{ id, x, y, escala, vira, expressao, ate: [x, y], piscaIsca }`), `aceso` (0 a 1), `familia`, `chave`, `acao`, `texto`, `transicao` (`fusao`, `escuro`, `bolhas`, `corte`), `continua`.

## Cenários e câmeras

| Cenário | O que tem | Câmera padrão |
|---|---|---|
| `superficie-lua` | a superfície vista de baixo com a lua quebrada, raios de lua, algas | `desce` |
| `mar-noturno` | o meio da água: raios fracos, algas, rochas em arco, plâncton | `deriva` |
| `abismo` | quase preto, só luzes muito longe | `push` |
| `jardim-coral` | areia, coral que acende, algas, muito plâncton | `paralaxe` |
| `floresta-algas` | floresta de algas de fio balançando | `paralaxe` |

Câmeras: `desce`, `sobe`, `push`, `deriva`, `paralaxe`, `recua`, `fixa` (as da família, `docs/estilo-prickles.md`).

### Como criar um cenário novo (4 passos)
1. **Só dados**, em `projetos/<nome>/pecas.js`: `export const cenariosEstilo = { 'little-light': { 'naufragio': { nome: 'Naufrágio', temas: ['navio', 'naufragio', 'tesouro'], ambiente: { fundo: ['#163A66', '#0C2246', '#061128'], ceuLegenda: '#143760' }, luz: { tipo: 'lua-superficie', x: 0.4, forca: 0.6 }, nevoa: { cor: '#1F4A7E', alfa: 0.2, altura: 0.6 }, particulas: { plancton: 1, bolhas: 0.8, poeira: 1 }, props: [{ tipo: 'raios-lua', n: 4 }, { tipo: 'rochas-arco' }, { tipo: 'areia' }, { tipo: 'algas', n: 6 }], clima: 'solene', camera: 'deriva' } } };` (para todo projeto: em `CENARIOS_LL` de `src/video/engine/estilo-little-light-cenarios.js`).
2. **Vocabulário:** luz `lua-superficie`, `escuro`, `bioluminescente`; props `lua`, `superficie`, `raios-lua`, `rochas-arco`, `algas`, `coral`, `plancton`, `bolhas`, `abismo-brilho`, `areia`; partículas `plancton`, `bolhas`, `poeira`.
3. **Use** no beat ou deixe os `temas` levarem o plano automático.
4. **Teste:** `node --test test/estilo-cartoon-ilustracao.test.mjs`.

Criatura nova: `export const personagensEstilo = { 'little-light': { 'agua-viva-verde': { nome: 'Água-viva verde', tipo: 'agua-viva', temas: ['verde'], corpo: '#7FF0B8', luz: '#D6FFE9', sombra: '#2E9C6A', brilho: '#8FF5C4', tam: 80 } } };` (`tipo`: `baleia`, `agua-viva`, `peixe-lanterna`, `peixe`, `silhueta`; `validarCriatura` confere).

## Plano automático

`planejarLittleLight`: "piscou", "pisca", "luzinha" = `pisca`; "acendeu", "luzes", "brilham" = `acende` (uma vez; nunca no gancho e nunca negada: "a luz não chega" não acende nada); número do roteiro = `numero`; último beat = `cta`; as criaturas citadas entram com a baleia; cenário pelo assunto com memória; a primeira cena desce da superfície; `escuro` antes do `pisca` e `bolhas` na troca de cenário.

## QA e revisão

O mesmo verificador da família (`estilo-cartoon-ilustracao-verificar.mjs`): cenário e câmera registrados, criaturas na área e abaixo da legenda em todos os quadros, sem tranco nem câmera rápida, contraste da legenda contra a água (4,5:1), aviso sem a cena `acende`; no MP4, brilho estourado. Revisão a 5 qps: a baleia é a protagonista e nunca sai da tela? O número de luz se lê inteiro? O brilho é macio (nenhuma mancha branca)? A legenda fica numa linha sobre a água limpa? O escuro do começo é escuro de verdade e a revelação acende uma a uma?

## Regras do estúdio de 04/11/2026 (revisão da Novela) que valem neste estilo
- **Pessoa citada pelo nome** aparece como personagem do estilo (um bicho ou uma criatura do elenco, com o nome na fala), nunca foto; foto real só se o usuário pedir. O plano automático já descarta a busca de foto.
- **Transição sem clarão branco:** só `fusao`, `folhas`, `escuro`, `bolhas` e `corte`; o brilho fica dentro da cena (aditivo, com teto), nunca como flash de troca. O teste trava a lista.
- **Câmera sem pico brusco:** aceleração do grupo dos personagens com teto de 1600 px/s² (`REGRAS_CI.camera.acelMax`), velocidade de 260 px/s e tranco de 28 px por quadro, medidos a 30 qps pelo verificador (`camera-pico`, `camera-rapida`, `camera-tranco`); o tremor do susto é um balanço amortecido, não saltos; o recuo e a descida usam curva de entrada e saída suaves.
- **Legenda** em 1 linha, sem elipse ou mancha escura atrás (contraste do céu ou da água, contorno e sombra leves).

## O que não copiar

Personagens, nomes, roteiros, frases, músicas e qualquer imagem ou código da referência. Fonte: Fraunces (OFL), em `AVISOS-TERCEIROS.md`.


## Rodada 2 da revisão (04/11/2026)

As correções valem para a família inteira: veja a tabela "Rodada 2 da revisão" em `docs/estilo-prickles.md`. Específico do little-light: `escuro` 0,42 (brilho desde o começo), elenco padrão da cena com a baleia e duas águas-vivas, primeiro plano de rochas e algas em todo cenário, nuvem de plâncton baixo, luz interna da baleia e trilha calma com caixinha de música (gerada uma vez, clima `ambiente`).


## Rodada 3 da revisão (05/11/2026)

Transições da família, mini-storyboard da fala, repertório da baleia e verificador de variedade: tabela "Rodada 3 da revisão" em `docs/estilo-prickles.md` (vale para os dois estilos).


## Som (regra do estúdio, 05/11/2026)

Brilho no máximo 1 a cada 6 s, sem repetir o mesmo som, e teto de 10 LU abaixo da voz por janela de 0,4 s: seção "Som" em `docs/estilo-prickles.md`.


## Legenda sem palavra escondida (regra do estúdio, 05/11/2026)

Mesma regra da família: seção "Legenda sem palavra escondida" em `docs/estilo-prickles.md`. A prévia não tinha linha cortada e não mudou.




