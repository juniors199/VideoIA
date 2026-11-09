

# Cena: formato, @ e legenda (vertical e horizontal)

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Formato, @ e legenda (0.6.42)
Campos do nível de cima da cena: `"formato": "vertical" | "horizontal"` (padrão vertical: 1080 x 1920; horizontal: 1920 x 1080, 30 qps; também vale 16:9, paisagem, YouTube), `"handle": true | false` (o @ do perfil; no horizontal o padrão é `false`, no vertical sempre aparece) e `"legenda": false` (desliga a legenda palavra por palavra; vem ligada). `pos` dos elementos é fração da faixa da cena e vale nos dois formatos; tamanhos em px (`largura`, `altura`, `tamanho`) são para o formato da cena: no horizontal use cerca de 62% do valor do vertical (a conversão faz isso). Áreas do horizontal e manual de estilo: `docs/formato-horizontal.md`.




