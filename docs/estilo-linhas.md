

# Estilo linhas: um ponto e traço branco sobre o preto

`"estilo": "linhas"` faz o vídeo inteiro em motion minimalista: fundo preto puro, traço branco fino de 2 px e **um ponto branco protagonista que atravessa o vídeo inteiro**. Cada frase vira uma forma que nasce do ponto (ele desenha o quadro, vira a crista da onda, vira o centro do grafo, sobe a escada) e, no fim do beat, a forma se recolhe de volta nele. Nunca há corte seco. Campos e exemplos em `docs/cena/estilos-motion.md`.

## Processo
1. **Fala de 30 a 45 s** (modelo `linhas`: 90 a 130 palavras). Uma metáfora só do começo ao fim.
2. **Tabela antes da cena:** para cada frase, que forma o ponto vira? (`quadro` = algo construído, `ondas` = fluxo, `grafo` = conexão, `escada` = progresso, `grade` = multidão ou proporção, `anel` = ciclo ou foco, `explosao` = fecho). Uma forma por frase, no máximo duas por beat.
3. Entre duas formas, o ponto viaja sozinho (0,28 a 0,5 s, com antecipação e rastro): deixe pelo menos 0,8 s entre as palavras de entrada.
4. **Cena**, QA (`--sem-render`), folha de contato, render. Confira o rastro do ponto nos quadros do MP4.

## Regras da estética (do pacote de origem)
- Só preto, branco e cinza. Foco a 100%, apoio de 40 a 70%, guias de 10 a 30%.
- Nunca uma forma sozinha: camadas (guias, rastro, glow, partículas, cascata).
- Easing em tudo: ease-in-out cúbico nos deslocamentos, ease-out nas entradas, overshoot no pop. Antecipação antes de cada viagem.
- Glow só no ponto e nos clímax (o scan do quadro, a ignição dos nós, a explosão).
- Cascata por distância (0,0017 s por pixel) e por índice (0,025 a 0,07 s).
- Legenda Poppins 38 px em y = 1376 (1390 no pacote; desce até a área segura de 05/11/2026), palavra por palavra (0,07 s entre palavras, sobe 18 px, some em 0,22 s). Sem título na tela.
- Peças 3D viram contorno branco (só as arestas), sem chão nem sombra. Traço branco de 2 px, foto em cinza com moldura fina.
- Fade final de 0,45 s para o preto.
- **Som:** só efeitos por evento (pop no nascimento, whoosh na viagem, draw no traço, tick nos cantos e na cascata, ping na ignição, riser antes do clímax, hit no clímax, suck e thud no colapso, pings subindo na escada). Sem música.

## Formas (`{ "tipo": "linhas", "forma": ... }`)
| forma | o que faz | dados |
|---|---|---|
| `ponto` | o ponto nasce (ou chega) e respira, com um anel de ping | |
| `trajeto` | o ponto viaja em arco entre dois nós deixando o traço (mensagem, viagem, rota) | `dados.de`, `para` ([fx, fy]), `arco`, `tracejado` |
| `cabo` | corte de um cabo: camadas concêntricas que se desenham e fios de armadura em cascata | `tamanho` |
| `quadro` | o ponto desenha um frame arredondado, grade de pontos em cascata, anel que se fecha, régua girando, scan que acende a grade; no fim o frame colapsa numa linha e no ponto | `tamanho` |
| `anel` | arco que se fecha, régua de 40 marcas girando, órbita de pontos | `dados.raio`, `dados.n` |
| `grade` | multidão de pontos em cascata a partir do ponto; os `acesos` ganham destaque | `dados.cols`, `linhas`, `total`, `acesos` |
| `ondas` | o ponto desliza na crista de três ondas que viram reta | |
| `grafo` | o ponto vira o centro; nós e arestas brotam; duas partículas percorrem e acendem os nós | |
| `escada` | o ponto cai no primeiro degrau e sobe pulando (cada pouso, uma nota mais aguda) | `dados.degraus` (3 a 6) |
| `explosao` | fecho: ponto, anel, quatro ondas, régua e duas órbitas de pontos | |
| `numero` | (o `contador` num beat do estilo) número em Poppins com o anel que se fecha em volta | os do contador |
Todas aceitam `entra`, `pos [fx, fy]` e `tamanho`.

```json
{ "tema": "INTERNET", "estilo": "linhas", "beats": [
  { "id": "gancho", "palavras": [0, 15], "elementos": [ { "tipo": "linhas", "forma": "ponto", "entra": 0 } ] },
  { "id": "cabo", "palavras": [16, 30], "elementos": [ { "tipo": "linhas", "forma": "ondas", "entra": "luz" } ] },
  { "id": "rede", "palavras": [31, 45], "elementos": [ { "tipo": "linhas", "forma": "grafo", "entra": "ligando" } ] },
  { "id": "fecho", "palavras": [46, 60], "elementos": [ { "tipo": "linhas", "forma": "explosao", "entra": "segundo" } ] } ] }
```

## Kit aberto: o desenho do objeto da frase (Onda 4, F4)
A tabela "forma por ideia" não basta: para o objeto que a frase cita (uma capivara, um farol, um contrato) o assistente **desenha** o objeto em `projetos/<nome>/pecas.js`, com as primitivas do kit (círculo, elipse, retângulo, caminho SVG, linha, polilinha, onda, estrela, rótulo, grupo). Nada de forma genérica no lugar: sem o desenho declarado o motor recusa e explica.
```js
export const linhas = {
  'farol-neblina': (k, d) => k.desenho({
    palavras: ['farol', 'barcos', 'neblina'],            // os substantivos que o desenho mostra (o planejador confere com a frase)
    fases: ['farol apagado', 'o feixe gira', 'o barco acha o caminho'],  // estados do desenho, o verbo da frase dispara a fase 1
    partes: [ k.r(168, 120, 64, 190, 6, { f: 'l' }), k.pl([[160, 120], [240, 120], [200, 80]], { fecha: true, f: 'h' }), /* ... */ ],
  }),
};
```
- Caixa de 400 x 400. Papéis de cor (`f` preenchimento, `st` traço): `i` tinta, `p` principal, `s` secundária, `h` destaque, `l` clara, `m` neutra, `d` escura. No linhas eles viram níveis de branco (h 100%, p 92%, i 85%, s 62%, l 50%, d 55%, m 30%: foco, apoio e guias). O preenchimento é preto (esconde o que está atrás), nunca cinza.
- `ph: [a, b]` limita o nó às fases a até b; `pose: { fase: { dx, dy, rot, sc, a } }` move o nó naquela fase; `ent` (`pop`, `draw`, `fade`, `slide`, `cresce`) e `an` (`bob`, `spin`, `pulse`, `flow`, `wave`, `shake`, `blink`, `orbita`) dão a entrada e o movimento contínuo. Mínimo: 3 formas, 2 fases, cada fase diferente da anterior, fase 0 com pelo menos 2 formas, o desenho ocupando ao menos 160 x 140 da caixa.
- O **ponto protagonista vira o nó de destaque** (papel `h`) do desenho em cada fase; ele continua atravessando o vídeo.
- Planejador: `src/video/autoplano-linhas.mjs` (`planejarLinhas`). Regras: 1 desenho por frase (o que cobre as palavras de conteúdo da frase), a fase 1 começa na palavra do verbo (tolerância 0,35 s), no máximo 3 momentos por 3 s, o desenho segue como um ato só entre os beats da mesma cadeia (não se recolhe e renasce), pessoa citada pelo nome entra como foto real em cinza com moldura fina (nunca boneco) e o desenho vem na frase seguinte.
- Verificadores (`src/video/f4-verificar.mjs`): herói igual ao declarado, cobertura da frase, cadeia única, fases em ordem e com 0,9 s ou mais, regra do verbo, momentos, protagonista em todo beat, forma repetida entre frases, medidor de movimento (tela parada, px por quadro, maior intervalo parado, segurar depois do pouso).
- Conformidade: `node scripts/conformidade-f4.mjs --estilo=linhas` (30 casos de `estilos/linhas/casos.json`, `--voz=mock --sem-musica`), fixtures em `test/estilos-autorados/linhas/`.
- Elemento na cena: `{ "tipo": "linhas", "forma": "aberto", "ref": "<id>", "dados": { "desenho": {...}, "linha": [[t, fase], ...], "cadeia": "h1" } }` (o planejador monta; o desenho vai embutido na cena).
- **Plano real (desde a 0.6.22)**: vale para os seis estilos da F4 (`linhas`, `pontilhismo`, `preto-branco`, `moderno`, `quadro-antigo`, `antiguidade`; o mesmo contrato de desenho, cada um com a sua pele). O kit é **opcional**: com o export do estilo em `pecas.js` (os nomes com hífen vão no `export default { 'preto-branco': {...} }`) e o id apontado em `sujeito.json` (`sujeito.dados.objeto`), o plano automático usa o planejador da F4, a validação confere `ref` e desenho, o QA da cena roda os verificadores (falha `kit-aberto`, sem correção automática) e o vídeo não recua para o estilo padrão. Sem o export, o estilo segue o plano de sempre, igual a antes. Elemento: `linhas`, `pontos` (pontilhismo), `preto-branco`, `moderno`, `quadro-antigo` e `antiguidade`, todos na forma `aberto`.

## Misturar
- Um beat só em linhas num vídeo de outro estilo: `"estilo": "linhas"` no beat (o quadro inteiro vira preto e branco nesse beat).
- Uma forma solta num beat de outro estilo: o elemento `linhas` é desenhado por cima, em branco com transparência, com o próprio ponto.

## Erros comuns
| Erro | Correção |
|---|---|
| Duas formas a menos de 0,8 s uma da outra (o ponto não chega) | afaste as palavras de entrada ou junte numa forma só |
| Forma genérica para tudo | uma forma por ideia; repita só quando é a mesma coisa voltando |
| Título no beat | o estilo não mostra título: use a legenda e a forma |

Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-linhas`.

Técnica reescrita a partir do pacote motion-minimalista (engine.py, exemplo e guias; sem autor nem licença declarados; ver `AVISOS-TERCEIROS.md`).




