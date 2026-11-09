

# Estilo anatomia: autoria de objeto

## Método

Parta da verdade do assunto e escreva uma frase: qual objeto explica o conceito, o que se move e o que esse movimento significa. Escolha a escala (figura, herói ou épico), liste base, estrutura, mecanismo, controles e sujeito antes de desenhar. Modele as peças em medidas coerentes, agrupe pelo modo real de desmontagem e declare a ordem de profundidade. Os beats são estados desse mesmo objeto: `montado`, `explodido`, `peca`, `acao` e `fechar`.

O kit `engine/kit-axono/` fornece projeção ortográfica, extrusão, revolução e tubos. Seus caminhos SVG são convertidos com `Path2D` no canvas. Desenhe volumes, não arames; termine cada linha numa peça ou superfície; confira apoio, colisões e ordem do pintor. A licença MIT e o crédito estão em `AVISOS-TERCEIROS.md` e no próprio kit.

## Objeto do projeto

`projetos/<nome>/pecas.js` exporta `anatomia`, um mapa de objetos declarados. Cada entrada descreve `nome`, `conjuntos`, `ordemProfundidade`, `estados` e `pecas`. Formas aceitas: `caixa`, `cilindro`, `lathe` (perfil `[z,raio]`) e `tube` (rota de pontos `[x,y,z]`). Exemplo:

```js
export const anatomia = {
  bomba: {
    nome: 'Bomba manual', az: 45, el: 30,
    conjuntos: [{ id: 'base', move: [0,0,0] }, { id: 'pistao', move: [0,0,18] }],
    ordemProfundidade: ['base', 'pistao'],
    estados: { repouso: {}, curso: { deslocamentos: { pistao: [0,0,8] } } },
    pecas: [
      { id: 'pe', conj: 'base', forma: 'caixa', em: [0,0,0], tam: [34,26,5] },
      { id: 'corpo', conj: 'base', forma: 'cilindro', em: [0,0,5], tam: [18,18,24], raio: 9 },
      { id: 'haste', conj: 'pistao', forma: 'lathe', em: [0,0,0], tam: [5,5,30], perfil: [[0,2.5],[30,2.5]] },
    ],
  },
};
```

A cena informa `sujeito: { conceito, partes, acao, angulo, dados: { objeto: 'bomba' } }`. Cada beat usa `beat.sujeito.estado` para escolher um estado do objeto. O desenho usa o kit axonométrico, e não cria formas para substituir uma declaração ausente.

## Verificação sem render

`verificadores/estilo-anatomia-verificar.mjs` exporta `verificarAnatomia(spec)` e confere no mínimo três peças, conjuntos, apoio no plano e ordem de profundidade sem duplicatas. Isto é uma auditoria estrutural, não substitui a revisão visual a 5 quadros por segundo nem uma auditoria de interseção volumétrica completa.

## Autoria completa antes do render

Crie os três arquivos de cada exemplo na mesma pasta de projeto. Os exemplos são esquemas didáticos, com dimensões relativas; adapte a geometria à referência do objeto real. Cada identificador selecionado pelo sujeito deve existir no mapa exportado. No plano automático, `sujeito.json` distribui os estados pelos números dos beats; depois de gerar `cena.json`, confira se a divisão da fala preservou esses três momentos. Em cena escrita à mão, copie `sujeito` para a raiz da cena e cada entrada de `beats` para `beat.sujeito`. Não deixe um `cena.json` antigo esconder a nova autoria.

### Objeto mecânico: bomba manual

`projetos/exemplo-bomba-anatomia/roteiro.md`:

```text
STATUS: Estilo: anatomia. Objetivo: curiosidade.

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
export const anatomia = {
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

`projetos/exemplo-cogumelo-anatomia/roteiro.md`:

```text
STATUS: Estilo: anatomia. Objetivo: curiosidade.

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
export const anatomia = {
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

Antes do render, carregue `pecas.js` com `lerLocais`, embuta os mapas com `embutirLocais` e rode `verificarAnatomia` sobre a spec com os beats compilados. `node scripts/autorar-objeto.mjs <projeto>` aponta a autoria ausente e fornece o esqueleto. Corrija os erros, gere uma prévia com `--voz=mock --sem-musica` e revise a figura a 5 quadros por segundo. Nenhum desses exemplos autoriza tratar dimensões ilustrativas como medidas biológicas ou de engenharia.




