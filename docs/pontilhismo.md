

# Como ilustrar em pontos

Vale para o estilo `pontilhismo` (o vídeo inteiro em pontos, preto e branco) e para o elemento `pontos` misturado num vídeo normal. Campos e exemplos em `docs/cena/estilo-pontilhismo.md`.

## Processo (nesta ordem)
1. **Fala de 35 a 50 s**, mais 1 a 3 s de saída visual. Pontue para a voz: ponto, reticências, dois-pontos e vírgula viram respiro.
2. **Tabela antes da cena.** Para cada frase, pergunte: **o que a pessoa precisa VER para entender isso?** Depois: **como os mesmos pontos chegam lá a partir da forma anterior?** Escreva a tabela fala, pergunta, ilustração e câmera, e só então o `cena.json`.

| Fala | Pergunta | Ilustração | Câmera |
|---|---|---|---|
| "Nikola Tesla montava a máquina na cabeça" | quem? onde fica a máquina? | `retrato` da foto, depois `compor` cabeça + motor pequeno dentro | de frente, aproximando |
| "patenteou um motor" | que motor? | `motor` (o de indução, por partes) | 3/4 de cima (yaw −0,55, pitch 0,35) |
| "movido por corrente alternada" | como ele funciona? | `estados`: `explode` na palavra "movido", `liga` em "alternada" | órbita larga no explode (yaw 1,0, dist 1850), perto no liga (dist 1150) |
| "corria num sentido só" | um sentido? | peça `seta` | lateral |
| "vai e volta" | como é ir e voltar? | `onda` | de frente |
| "a ideia acende o mundo" | como terminar? | o motor `cresce` (callback) e a câmera mergulha nele até o preto | órbita, depois mergulho |

3. **Respiros na voz** (opcional, recomendado com voz sintética rápida): `node scripts/respiros.mjs <projeto>` insere pausas depois da pontuação (0,45 s em . ! ?, 0,55 s em reticências, 0,35 s em dois-pontos, 0,2 s em vírgula), só cortando em silêncio real, e desloca os tempos das palavras. `--simular` mostra os cortes; `--refazer` volta ao original. Cada pausa soma ao tempo do vídeo: confira se a fala continua entre 35 e 50 s. Ouça as emendas.
4. **Fotos de licença livre** com `scripts/buscar-imagem.mjs` (confira o arquivo baixado: `file assets/foto.jpg`). Uma obra por frase, de 1,5 a 3 s.
5. **Protagonista** convertido e conferido: `node scripts/imagem-para-pontos.mjs assets/foto.jpg assets/foto-pontos.json --corte ...` e abra a prévia `.jpg`.
6. **Cena**, **QA** (`--sem-render`), **folha de contato** (`node scripts/folha-pontos.mjs <projeto>`), correções, render, e `--mp4` para conferir os quadros do vídeo final.
7. **Na entrega**, diga o que foi verificado (quais quadros, medição do áudio) e o que não foi (assistir inteiro, ouvir as emendas).

## Elemento antes de número (regra do estúdio, 31/10/2026)
**Número ou texto em pontos só quando o número é o protagonista da frase E nenhum elemento o representa.** Se existe uma forma que mostra a ideia, o elemento é o protagonista e o número vira rótulo pequeno preso a ele (`rotulos` com `ancora` pelo nome). As referências do estilo fazem assim: o átomo com o elétron orbitando, a cabeça com a lâmpada, os seis troféus com um contador mono pequeno ("TÍTULOS DA NBA 06"), a quadra com a bola subindo enquanto a barra "padrão" sobe. O número grande em pontos aparece quando não há o que desenhar (um ano, uma contagem solta). Antes de escrever `forma: "texto"`, passe pela tabela:

| A fala diz | Em vez de texto em pontos | Forma |
|---|---|---|
| eixo, inclinação, "23 graus" | a Terra que INCLINA, com a linha do eixo e o arco do ângulo | `globo` (`tilt`, `inclinaDe`, `inclinaEm`, `eixo`, `arco`) + rótulo `23,4°` na âncora `arco` |
| distância entre Sol e Terra, "147 milhões de km" | Sol 3D, Terra 3D e a linha tracejada entre os dois | `sistema` modo `linha` (`dist`), rótulo na âncora `linha` |
| órbita, "de 147 a 152 milhões" | elipse com o Sol no foco e a Terra que percorre do periélio ao afélio | `sistema` modo `orbita`, estados `orbita`, `jan`, `jul`, `volta` |
| hemisfério virado para o Sol, estações | a Terra com a metade iluminada pelo Sol, o eixo e os raios | `sistema` modo `linha` com `luz`, `raios` e `paralelos` |
| "5 milhões de diferença", "3%" | duas barras com a ponta da maior destacada e a chave | `barras` (estados `diferenca`, `pct`) |
| o Sol | esfera de pontos com granulação, manchas, halo e raios 3D | `sol` |
| frio, inverno | floco de seis braços; termômetro com mercúrio | `floco`, `termometro` |
| "diferente", "a conta não fecha" | o sinal ≠ | `diferente` |
| tempo passando | ampulheta de frente com areia caindo | `ampulheta` |
| seguir a página | avatar com o selo "+" | `seguir` |

O plano automático (`autoplano-estilos.mjs`, `astrosAntesDeNumeros`) já aplica as 4 primeiras linhas quando a fala bate; o que está escrito no `cena.json` vence.

## Astros e elementos com volume
Todos desenham pontos com volume (esfera de Fibonacci que gira, lado de trás apagado, luz do Sol quando há) e leem a direção da câmera em `c.vista`. O mapa de continentes é o do projeto (`arquivo`) ou o padrão do estúdio (`biblioteca/astros/terra-mapa.jpg`, NASA, domínio público).
- **`sol`**: corpo com granulação e manchas que giram, halo e 44 raios em 3D que pulsam. `dados`: `R` (190), `raios`, `giro`.
- **`globo`** (Terra): continentes, `lon` (centro, graus), `giro`, `tilt` (graus, positivo inclina o norte para a direita), `inclinaDe` e `inclinaEm: [início, duração]` (anima a inclinação), `luz: [x, y, z]` (direção do Sol), `eixo`, `arco` (vertical de referência e arco do ângulo), `paralelos: [lat]` (anel de latitude: o trecho iluminado forte mostra o dia mais longo), `raios`. Âncoras: `arco`, `polo-norte`, `polo-sul`, `equador`.
- **`sistema`**: `modo: "linha"` (Sol à esquerda, Terra à direita, linha com marcas; `dist`, `solR`, `terraR`, `tilt`, `lon`, `raios`, `paralelos`, `luz: false` desliga a luz) ou `modo: "orbita"` (use `camera.pitch` 0,85; `A`, `exc`; estados `orbita`, `jan`, `jul`, `volta`). A Terra usa a mesma luz do Sol. Âncoras da linha: `linha`, `sol`, `terra`, `terra-baixo`; da órbita: `jan`, `jul`, `sol`, `jan-terra`, `jul-terra`.
- **`barras`**: duas barras (`dados.a`, `dados.b`, `larg`; a razão é a real), `cresce: false` para não recomeçar a animação num segundo beat; estados `base`, `diferenca`, `pct`. Âncoras: `a`, `b`, `centro`, `cima`, `baixo`.
- **Rótulos** (`rotulos`): `ancora` pode ser o nome da âncora; `tam` (px; 19 é o padrão mono), `serif: true`, `semLinha: true` (só o texto) e `dx: 0` centraliza.
- Estados de uma forma que se repete em beats seguidos ficam na mesma pose: dois elementos iguais em beats seguidos não recomeçam do zero se a animação depender do tempo absoluto (a Terra gira pelo relógio do vídeo, não pelo do beat).

## Checklist do estilo (conferir antes de entregar)
1. Cada número em pontos tem a pergunta "existe um elemento que o representa?" respondida; sem elemento, o número fica.
2. Sol e Terra sempre com volume (nunca disco 2D); Terra com continentes (o motor mostra os continentes mesmo com pouco tempo livre).
3. Nenhuma forma passa de ~86% da largura (o motor limita sozinho; `tamanho` maior que isso é cortado).
4. Capa nítida com a forma protagonista grande e o título em fundo limpo; nunca esfera lisa.
5. Foto (obra) com crédito legível e pelo menos 1,5 s de foto plena (moldura 0,5 s, abre em 0,4 s, fecha em 0,3 s): beat de 2,2 s ou mais.
6. Cauda de 1,2 s no fim (padrão do estilo) e trilha entre 5 e 12 LU abaixo da voz (padrão do motor).
7. Respiros: `node scripts/respiros.mjs <projeto> --naturais` mantém 3 a 5 pausas que a própria voz fez (sem gastar voz).
8. Revisão a 5 qps (e a 15 qps nas viradas): forma legível, poeira cobrindo o @ ou a legenda, texto cortado, quadro 0, vazamentos.

## Regras da estética
- **Uma forma por ideia.** Repetir só quando é a mesma coisa voltando (o retrato do protagonista no fim, o motor que volta crescendo).
- **Nunca trocar o assunto por uma forma genérica.** Toro não é motor, esfera não é cérebro. Se a forma do assunto não existe, crie (veja "Como criar qualquer objeto").
- **O protagonista em pontos no primeiro segundo** (`retrato` com `entra: 0`): os pontos nascem do escuro, cada um com o seu atraso, vindos de 80 px para fora.
- **Morph curto em frase curta:** 0,3 a 0,5 s quando a próxima forma vem em menos de 1,5 s. O motor encurta sozinho; `morph` no elemento manda. Morph longo vira "nuvem".
- **Nada nas bordas.** Conteúdo entre y ≈ 250 e y ≈ 1450.
- **Se o desenho explica, não rotule.** Rótulo 3D (`rotulos`) só onde o desenho não diz sozinho: as peças de um objeto técnico (ESTATOR, BOBINAS · 6 POLOS), as duas margens. Ano entra como `contador` (serifada grande dentro de anéis de pontos), número curto como `texto` em pontos.
- **Obra ou foto tem momento próprio:** a moldura de partículas chega, a foto abre do centro 0,25 s depois, por baixo dos pontos, em preto e branco, com recuo de zoom; crédito embaixo (`obra` em itálico, `credito` = autor · ano · acervo). Ao fechar, os pontos passam por um anel no centro (ou morfam em 0,35 s direto para a próxima forma). Nunca em corte seco.
- **Câmera viva:** dirija a câmera por beat (`camera.plano` e `mov`) ou, para o objeto que importa, por elemento e por estado (`camera: { yaw, pitch, dist, alvo, d }`): amplitude real, yaw até ±1,2, dist de 520 a 2300, vista de cima com pitch 0,95. Ela nunca para (respiração sutil).
- **Final em loop:** o último segundo e meio mergulha no alvo da última pose e fecha no preto.
- **Som:** só a narração (`"efeitos": { "sfx": true, "musica": true }` liga).
- **Legenda:** palavra por palavra, a falada em bold; o bloco só some quando o silêncio passa de 1,2 s.

## Retrato
- Padrão: **meio-tom em grade regular** (como as prévias da referência): uma célula por ponto, sem tremor, com o TAMANHO e o BRILHO do ponto pelo tom. Grade de ~74 colunas; tom esticado até o percentil 99,5 e curva ^1,4 a ^1,8 até a mediana ficar entre 0,30 e 0,45; contraste local leve; contorno só onde o sujeito é escuro; base esmaecida. Cabe nas mesmas ~6 mil partículas, então morfa com as outras formas.
- **Corte só no busto** (cabeça e ombros, `corte: [x, y, largura, altura]`): o rosto precisa de muitas células para ter olhos, nariz e boca.
- **Fundo:** sai sozinho. No Mac (macOS 14 ou mais novo) o recorte é o do próprio sistema (Vision, offline); em qualquer sistema há o recorte por cor (modelo de cor + difusão que respeita as bordas, com `protege` para a elipse do rosto). Se nada servir, faça a máscara em qualquer ferramenta e passe `dados.mascara: "assets/foto-mascara.png"` (branco = sujeito). `fundo: "nenhum"` mantém a foto inteira (com `vinheta`).
- Opcional: `modo: "pontilhado"` (Voronoi ponderado, 15 a 40 mil pontos com raio pelo tom), para um retrato de "gravura". Mais pontos que o resto do vídeo: as outras formas dividem o mesmo sistema, e as sobras viram poeira.

## Como criar qualquer objeto
O estúdio não depende das peças que existem. Para o objeto que o assunto pede:
1. **Pesquise o objeto real** (como ele é, de que partes é feito, como funciona).
2. **Decomponha em peças nomeadas**, cada uma numa faixa de índices com o seu orçamento de pontos (o motor de indução: estator 0–1500, bobinas 1500–2500, barras 2500–3700, anéis, eixo, tampas, campo).
3. **Primitivas paramétricas** por peça (casca, anel, laço, barra, disco), cada uma com raio e opacidade próprios (estrutura mais fraca, peça principal forte) e a normal para a luz.
4. **Estados contínuos a partir do tempo** (explodir, montar, ligar, girar), calculados de `lt` (o tempo desde o início do estado), sem morph entre eles.
5. **Câmera escolhida para cada estado** (o explodido pede órbita larga; o ligado, aproximação).
6. **Contorno por amostragem de caminho** (`caminho`) e **glifo pelo canvas** (`texto`, em 3 camadas).
7. **Confira na folha de contato, no meio da frase.** O que vira nuvem ou bloco, refaça.

Os caminhos, do mais pronto ao mais livre:
- **(a) Peça do repertório** (629 procedurais e 168 GLB CC0): `{ "tipo": "pontos", "forma": "lampada3d" }`. A superfície é amostrada com ~35% dos pontos nas arestas marcantes, luz pela normal e silhueta realçada.
- **(b) Peça nova do projeto** em `projetos/<nome>/pecas.js` (`export const pecas`): vira pontos do mesmo jeito.
- **(c) GLB CC0** em `projetos/<nome>/assets/` (`glb-<nome>`): idem.
- **(d) Desenho vetorial:** `forma: "caminho"` com `dados: { "d": ["M..."], "viewBox": [w, h] }` (contorno), ou `forma: "svg"` com `svg` (o texto) ou `arquivo: "assets/desenho.svg"` (preenchimento pelo tom e contorno, em meio-tom). Desenhe o ícone ou a ilustração em código.
- **(e) Foto de referência de licença livre** de um objeto: `forma: "imagem"` (o mesmo meio-tom do retrato, com o recorte do objeto).
- **(f) Objeto técnico por partes, com estados:** as formas `motor` (estados `repouso`, `explode`, `explodido`, `monta`, `liga`, `gira`, `altera`, `cresce`, `pequeno`), `engrenagem` (`dados.dentes`, `dados.par`; estado `gira`) e `bobina` (`dados.voltas`; estado `liga` acende o campo). Para um objeto técnico que não existe, escreva a forma no `pecas.js` do projeto:
```js
export const pontos = {
  'turbina': (kit, d) => ({ n: 5000, normais: true, rot0: -0.5, inclina: 0.3, fn: (i, t, lt, o, c) => {
    if (i >= 5000) return false;
    const pas = 7, k = i % pas, u = kit.R.a[i], giro = c.e?.estado === 'gira' ? t * 6 : t * 0.5;
    const a = (k / pas) * kit.TAU + giro + u * 0.4, r = 60 + kit.R.b[i] * 280;
    o[0] = Math.cos(a) * r; o[1] = Math.sin(a) * r; o[2] = (kit.R.c[i] - 0.5) * 40; o[3] = 1.4; o[4] = 0.9;
    o[5] = 0; o[6] = 0; o[7] = -1; // normal (opcional): luz e silhueta
    return true;
  } }),
};
```
  Use como qualquer forma: `{ "tipo": "pontos", "forma": "turbina", "estados": [{ "em": "gira", "estado": "gira" }] }`.
- **Repertório pronto de metáforas:** `cabeca` (perfil com a ideia dentro, ótimo com `compor`), `olho` (pisca, olha, a pupila dilata; o mergulho final entra na pupila), `ampulheta` (tempo passando), `margens` (IMAGINAR × EXECUTAR, com pontos caindo no abismo e a ponte que fecha), `tunel`, `onda`, `galaxia`, `prompt` (cartão digitando, para IA e hoje), `terra` e `galaxia-densa` (camada densa de 26 e 60 mil pontos).
- **Composição:** `compor: [{ "forma": "cabeca", "opac": 0.45 }, { "forma": "motor", "estado": "pequeno" }]` põe várias formas no mesmo espaço de partículas (a cabeça com o motor dentro), e morfa de forma coerente para a forma sozinha.

## Kit aberto: o desenho do assunto em pontos (Onda 4, F4)
Para o objeto que a frase cita, o assistente **desenha** o assunto em `projetos/<nome>/pecas.js`, no export `pontilhismo` (mesmo contrato de desenho do `linhas`: `k.desenho({ palavras, fases, partes })`, caixa 400 x 400, papéis de cor `i p s h l m d`, fases, `ph`, `pose`, `ent`, `an`; veja `docs/estilo-linhas.md`, seção "Kit aberto"). O motor amostra o contorno e o preenchimento em pontos (o papel dá a opacidade, o raio e a densidade: `h` mais forte, `m` e `d` mais ralos) e a pose de cada nó em cada fase move os pontos dele. **A forma nova nasce dos mesmos pontos da anterior**: o mesmo desenho muda de fase, sem trocar a nuvem. Forma `aberto` do elemento `pontos`; sem a peça declarada o motor recusa e explica.
- Planejador: `src/video/autoplano-pontilhismo.mjs` (`planejarPontilhismo`), a tabela "fala, pergunta, ilustração" como ferramenta: 1 desenho por frase (o que cobre as palavras de conteúdo), fase 1 na palavra do verbo, no máximo 3 momentos por 3 s, o protagonista em pontos desde o primeiro segundo. Pessoa citada pelo nome vira `retrato` em meio-tom da foto real (nunca boneco) e o desenho entra na frase seguinte.
- Verificadores: os mesmos de `src/video/f4-verificar.mjs`; o que o QA do motor mede (borda, legenda em 1 linha) continua valendo. Conformidade: `node scripts/conformidade-f4.mjs --estilo=pontilhismo` (fixtures em `test/estilos-autorados/pontilhismo/`).
- Legenda: a F4 limitou o bloco a 24 caracteres (uma palavra que passaria disso abre bloco novo) para a legenda de 70 px caber em 1 linha.

## Misturado num vídeo normal (elemento `pontos`)
- Um beat de pontos é uma mudança de linguagem: use em 2 ou 3 momentos (o retrato de quem é citado, o número que importa, a metáfora da virada).
- Cor pelo `papel` (destaque é a cor da página). Os pontos se juntam vindos de uma nuvem e se espalham no fim do beat; dois beats de pontos seguidos morfam direto.
- Não misture pontos e peças 3D no mesmo beat (o validador avisa).

## Revisão (perguntas da folha de contato)
- A forma se lê sem a narração? Se parece nuvem, o morph está longo ou a forma é abstrata demais.
- Algo sai da tela ou encosta nas bordas?
- A legenda disputa espaço com o desenho?
- Sobrou texto que não acrescenta?
- A câmera se move entre as cenas?
- O protagonista aparece formado no primeiro segundo?

## Erros que já cometemos
| Erro | Correção |
|---|---|
| A mesma forma ilustrando frases diferentes | uma forma por ideia; repetir só quando é a mesma coisa voltando |
| Peça genérica no lugar do assunto (toro para "motor") | crie a forma por um dos caminhos acima |
| Objeto 3D largo demais no vertical | confira a folha, reduza `tamanho` ou afaste a câmera |
| Morph longo em frase curta (só se vê nuvem) | 0,3 a 0,5 s em frase de menos de 1,5 s |
| Retrato com o fundo junto (bloco retangular de pontos) | recorte (automático, `mascara` ou `protege`) e corte só no busto |
| Rosto estourado, olhos viram buracos | o meio-tom padrão já controla a mediana; não force `gama` baixo |
| Imagem em corte seco no meio da ilustração | momento próprio: moldura, foto por baixo, crédito, anel na saída |
| Textos soltos que não acrescentam | se o desenho explica, não rotule |

Técnica inspirada no pacote brabo-minimalista-pontilhismo, de Fernando Araújo (licença MIT; ver `AVISOS-TERCEIROS.md`).




