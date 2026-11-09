

# Estilo fino: um objeto, um gesto, uma leitura

## Método

Escreva duas ou três ideias de objeto numa linha cada. Para cada peça, defina dois ou três traços que bastam para reconhecê-la. Construa só a figura e deixe a página fixa. Use a silhueta e um vinco; mantenha o traço como único destaque, com no máximo um traço aceso por vez. Não coloque palavras dentro da figura. O nome e a leitura ficam fora, na interface do estilo.

A geometria segue a câmera axonométrica 2:1, os anéis, prismas, filetes e reflexos descritos pela origem hairline. Os estados dos beats atuam sobre o mesmo objeto declarado. Não converta cada frase em uma placa ou camada independente. A licença MIT e a autoria estão em `AVISOS-TERCEIROS.md`; o kernel original não foi copiado.

## Objeto do projeto

Em `projetos/<nome>/pecas.js`, exporte `fino` como mapa de descritores com peças, silhueta, vinco e estado. As peças usam os mesmos campos geométricos do guia de anatomia. A cena seleciona o objeto em `sujeito.dados.objeto`; cada beat pode escolher um nome de estado em `beat.sujeito.estado`. O descritor limita `estados[estado].destaque` a uma peça ou conjunto. Se faltar descrição válida, o render falha com orientação para declarar o objeto.

## Verificação sem render

`verificadores/estilo-fino-verificar.mjs` exporta `verificarFino(spec)` e checa a presença de objeto próprio, a proibição de texto na figura, a silhueta e o limite de um destaque por estado. A checagem estrutural não responde se a silhueta lê a 240 px; isso requer crítica visual e revisão a 5 quadros por segundo.

## Autoria completa antes do render

Crie os três arquivos de cada exemplo na mesma pasta de projeto. Os exemplos são esquemas didáticos, com dimensões relativas; adapte a geometria à referência do objeto real. Cada identificador selecionado pelo sujeito deve existir no mapa exportado. No plano automático, `sujeito.json` distribui os estados pelos números dos beats; depois de gerar `cena.json`, confira se a divisão da fala preservou esses três momentos. Em cena escrita à mão, copie `sujeito` para a raiz da cena e cada entrada de `beats` para `beat.sujeito`. Não deixe um `cena.json` antigo esconder a nova autoria.

### Objeto mecânico: bomba manual

`projetos/exemplo-bomba-fino/roteiro.md`:

```text
STATUS: Estilo: fino. Objetivo: curiosidade.

A bomba está montada.

O pistão sobe.

O pistão desce.
```

`sujeito.json`:

```json
{
  "sujeito": {
    "conceito": "bomba manual de pistão",
    "tipo": "objeto",
    "partes": [
      "pé",
      "cilindro",
      "pistão",
      "saída"
    ],
    "estado": [
      "montada",
      "aspirando",
      "comprimindo"
    ],
    "acao": "o pistão aspira e comprime água",
    "angulo": "isometrico",
    "fio": "bomba manual de pistão",
    "dados": {
      "objeto": "bomba"
    }
  },
  "beats": {
    "1": {
      "estado": "montada",
      "chave": "bomba",
      "proposito": "Reconhecer a bomba inteira"
    },
    "2": {
      "estado": "aspirando",
      "chave": "sobe",
      "proposito": "Mostrar a abertura do volume"
    },
    "3": {
      "estado": "comprimindo",
      "chave": "desce",
      "proposito": "Relacionar a descida à compressão"
    }
  }
}
```

`pecas.js`:

```js
export const fino = {
  "bomba": {
    "nome": "Bomba manual de pistão",
    "az": 45,
    "el": 30,
    "conjuntos": [
      {
        "id": "base",
        "move": [
          0,
          0,
          0
        ]
      },
      {
        "id": "pistao",
        "move": [
          0,
          0,
          12
        ]
      }
    ],
    "ordemProfundidade": [
      "base",
      "pistao"
    ],
    "estados": {
      "montada": {
        "destaque": "corpo"
      },
      "aspirando": {
        "deslocamentos": {
          "pistao": [
            0,
            0,
            9
          ]
        },
        "destaque": "haste"
      },
      "comprimindo": {
        "deslocamentos": {
          "pistao": [
            0,
            0,
            0
          ]
        },
        "destaque": "saida"
      }
    },
    "pecas": [
      {
        "id": "pe",
        "conj": "base",
        "forma": "caixa",
        "em": [
          0,
          0,
          0
        ],
        "tam": [
          34,
          26,
          4
        ]
      },
      {
        "id": "corpo",
        "conj": "base",
        "forma": "cilindro",
        "em": [
          0,
          0,
          4
        ],
        "tam": [
          18,
          18,
          28
        ],
        "raio": 9
      },
      {
        "id": "haste",
        "conj": "pistao",
        "forma": "lathe",
        "em": [
          0,
          0,
          18
        ],
        "tam": [
          4,
          4,
          28
        ],
        "perfil": [
          [
            0,
            2
          ],
          [
            25,
            2
          ],
          [
            25,
            5
          ],
          [
            28,
            5
          ]
        ]
      },
      {
        "id": "saida",
        "conj": "base",
        "forma": "tube",
        "em": [
          0,
          0,
          8
        ],
        "tam": [
          20,
          4,
          10
        ],
        "raio": 2,
        "rota": [
          [
            0,
            0,
            8
          ],
          [
            13,
            0,
            8
          ],
          [
            13,
            0,
            2
          ]
        ]
      }
    ]
  }
};
```

### Objeto orgânico: cogumelo sobre madeira

`projetos/exemplo-cogumelo-fino/roteiro.md`:

```text
STATUS: Estilo: fino. Objetivo: curiosidade.

O cogumelo cresce na madeira.

O chapéu revela as lamelas.

A figura volta ao conjunto.
```

`sujeito.json`:

```json
{
  "sujeito": {
    "conceito": "cogumelo com haste, chapéu e lamelas",
    "tipo": "processo",
    "partes": [
      "madeira",
      "micélio",
      "haste",
      "chapéu",
      "lamelas"
    ],
    "estado": [
      "inteiro",
      "lamelas",
      "fechado"
    ],
    "acao": "o chapéu se afasta para revelar as lamelas",
    "angulo": "isometrico",
    "fio": "cogumelo com haste, chapéu e lamelas",
    "dados": {
      "objeto": "cogumelo"
    }
  },
  "beats": {
    "1": {
      "estado": "inteiro",
      "chave": "cogumelo",
      "proposito": "Reconhecer o organismo no substrato"
    },
    "2": {
      "estado": "lamelas",
      "chave": "lamelas",
      "proposito": "Revelar a face inferior do chapéu"
    },
    "3": {
      "estado": "fechado",
      "chave": "conjunto",
      "proposito": "Recompor a relação entre as partes"
    }
  }
}
```

`pecas.js`:

```js
export const fino = {
  "cogumelo": {
    "nome": "Cogumelo com chapéu e lamelas",
    "az": 45,
    "el": 25,
    "conjuntos": [
      {
        "id": "substrato",
        "move": [
          0,
          0,
          0
        ]
      },
      {
        "id": "haste",
        "move": [
          0,
          0,
          0
        ]
      },
      {
        "id": "chapeu",
        "move": [
          0,
          0,
          10
        ]
      }
    ],
    "ordemProfundidade": [
      "substrato",
      "haste",
      "chapeu"
    ],
    "estados": {
      "inteiro": {
        "destaque": "chapeu"
      },
      "lamelas": {
        "deslocamentos": {
          "chapeu": [
            0,
            0,
            10
          ]
        },
        "destaque": "lamelas"
      },
      "fechado": {
        "deslocamentos": {
          "chapeu": [
            0,
            0,
            0
          ]
        },
        "destaque": "haste"
      }
    },
    "pecas": [
      {
        "id": "madeira",
        "conj": "substrato",
        "forma": "caixa",
        "em": [
          0,
          0,
          0
        ],
        "tam": [
          44,
          26,
          5
        ],
        "raio": 3
      },
      {
        "id": "haste",
        "conj": "haste",
        "forma": "lathe",
        "em": [
          0,
          0,
          5
        ],
        "tam": [
          10,
          10,
          28
        ],
        "perfil": [
          [
            0,
            5
          ],
          [
            8,
            4
          ],
          [
            22,
            3
          ],
          [
            28,
            5
          ]
        ]
      },
      {
        "id": "chapeu",
        "conj": "chapeu",
        "forma": "lathe",
        "em": [
          0,
          0,
          30
        ],
        "tam": [
          36,
          36,
          12
        ],
        "perfil": [
          [
            0,
            18
          ],
          [
            2,
            17
          ],
          [
            7,
            13
          ],
          [
            11,
            5
          ],
          [
            12,
            0.4
          ]
        ]
      },
      {
        "id": "lamelas",
        "conj": "chapeu",
        "forma": "tube",
        "em": [
          0,
          0,
          30
        ],
        "tam": [
          30,
          2,
          1
        ],
        "raio": 0.6,
        "rota": [
          [
            -15,
            0,
            30
          ],
          [
            0,
            0,
            30
          ],
          [
            15,
            0,
            30
          ]
        ]
      },
      {
        "id": "micelio",
        "conj": "substrato",
        "forma": "tube",
        "em": [
          0,
          0,
          4
        ],
        "tam": [
          32,
          15,
          1
        ],
        "raio": 0.6,
        "rota": [
          [
            -16,
            -6,
            4
          ],
          [
            -8,
            2,
            4
          ],
          [
            0,
            0,
            4
          ],
          [
            9,
            6,
            4
          ],
          [
            16,
            1,
            4
          ]
        ]
      }
    ]
  }
};
```

Antes do render, carregue `pecas.js` com `lerLocais`, embuta os mapas com `embutirLocais` e rode `verificarFino` sobre a spec com os beats compilados. `node scripts/autorar-objeto.mjs <projeto>` aponta a autoria ausente e fornece o esqueleto. Corrija os erros, gere uma prévia com `--voz=mock --sem-musica` e revise a figura a 5 quadros por segundo. Nenhum desses exemplos autoriza tratar dimensões ilustrativas como medidas biológicas ou de engenharia.




