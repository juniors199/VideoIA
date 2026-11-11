# Tifo Football

Use `Estilo: tifo-football.` no STATUS do roteiro. O estilo explica histórias, regras e jogadas de futebol em um quadro editorial ilustrado. O planejador escolhe o painel de cada trecho a partir da fala. Ele aceita vídeo vertical e horizontal.

- **História e contexto.** Use foto pesquisada quando a identificação da pessoa, do lugar ou do acontecimento fizer diferença. Registre a imagem e a classe `registro` ou `contexto` em `direcao-visual.json`. Com o arquivo validado, o painel cede o quadro para a foto selecionada.
- **Lance ou regra.** Separe a regra do que ocorreu depois. Campo, setas e marcadores explicam o mecanismo. Descreva o lance como esquema quando a posição ou trajetória real não estiver documentada.
- **Placar.** Só mostre números que a fala e as fontes confirmam. Para leitura automática, diga o placar como `2 a 1` na mesma frase que identifica o resultado.

## Ajuste manual da cena

Cada beat pode declarar `tifo` com `forma` igual a `cobranca`, `impedimento`, `jogada`, `resposta`, `regra`, `placar` ou `contexto`. Em `cobranca`, `resultado` aceita `defesa` ou `gol` quando confirmado. Em `placar`, informe `placar: [2, 1]` com os dois valores conferidos. `gatilho` é o índice da palavra que inicia a animação. Use `desfecho` para revelar o resultado na palavra em que ele é dito.

```json
{
  "id": "cobranca",
  "palavras": [18, 27],
  "tifo": { "forma": "cobranca", "resultado": "defesa", "gatilho": 21, "desfecho": 25 },
  "camera": { "plano": "normal", "mov": "avanca", "forca": 0.45 },
  "transicao": "corte"
}
```

Para fotos, use o elemento `imagem` com o `arquivo` exato e registre o crédito conforme `pesquisa-visual`. O painel de campo usa `avanca`, `recua`, `panEsq`, `panDir` ou câmera parada. Reveja o quadro junto com a fala para checar legibilidade, a classe da foto e o instante da animação.
