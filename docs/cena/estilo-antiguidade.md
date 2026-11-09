

# Cena: estilo antiguidade

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `antiguidade` | `forma` (`quadro`, `nome`, `nome-atras`, `data`, `dado`, `mapa`, `pilha`, `capitulo`, `citacao`, `rotulo`) e os campos de cada uma (guia e referência em `docs/estilo-antiguidade.md`); `"tom"` na cena: `ouro`, `vinho` ou `escuro` |

## Estilo antiguidade (História e antiguidades)
Leia `docs/estilo-antiguidade.md` (referência de uso no fim). `"estilo": "antiguidade"` e `"tom": "ouro" | "vinho" | "escuro"` na cena. Cada beat tem **uma base** (`quadro`, `nome-atras`, `mapa`, `pilha` ou `citacao`: pintura, busto, mosaico ou mapa antigo de domínio público, por `scripts/buscar-imagem.mjs`) e **no máximo um destaque** por cima (`nome`, `data` com `regua`, ou `rotulo`); `dado` e `capitulo` também vão por cima da base. Pessoa citada pelo nome entra pelo busto, pintura ou gravura dela. Citação só atribuída ("segundo Plutarco"), com o `texto` igual ao falado. Varie `transicao` (`dissolve`, `rasgo`, `luz`, `desfoque`) ou deixe o ciclo do tom.




