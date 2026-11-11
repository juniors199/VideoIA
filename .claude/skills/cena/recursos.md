# Recursos da cena

## Quando a peça, o cenário ou o mundo não existe: crie
O método nunca fica preso ao que existe. Se a peça, o cenário ou o mundo que a cena pede não existir no repertório (`--galeria`, `docs/cena/repertorio.md`), **crie em `projetos/<nome>/pecas.js`** seguindo o checklist de qualidade de `docs/repertorio-3d.md` (`export const pecas = { nome: (kit, d) => Object3D }` e `export const cenarios = { nome: (kit, d) => Group }`, tudo com os helpers do kit, sem import). Se precisar de foto ou logo real, use `node scripts/buscar-imagem.mjs <projeto> "<termo>" [--logo]` (licença livre, registra em `fontes.md`). **Nunca troque o assunto por uma peça genérica só porque é o que existe.**
1. Procure antes: `node src/video/cli.mjs --galeria <tema|nomes> --por=4`. Se existe uma peça que é o objeto, use.
2. Não existe: escreva a fábrica (silhueta reconhecível, 1 a 1,6 unidade, cor principal em `P`, no máximo 2 detalhes em destaque, sem texto). Nome em minúsculas com hífen, diferente de qualquer nome do motor (o validador recusa colisão).
3. Confira: `node src/video/cli.mjs --galeria --projeto=<nome> --por=4` (abra a folha com Read), corrija o que não lê de longe, e use o nome em `forma` ou em `cenario` como qualquer outro.
4. Peça que ficou boa e serve para outros temas: anote no relatório final para o mantenedor promover ao repertório (`npm run promover`, só no repositório; no kit do comprador ela fica no projeto e funciona igual).

## Objeto complexo: modelo GLB
Animal, veículo, comida, móvel, prédio ou pessoa: use um modelo GLB (`"forma": "glb-vaca"`), nunca uma montagem de primitivas que sai mal gerada. Símbolo e diagrama (moeda, cadeado, gráfico) seguem procedurais.
1. Biblioteca do estúdio (80, CC0): `node src/video/cli.mjs --galeria glb --por=4`; nomes e `dados` (`material` suave|clay|original, `anim`, `giro`, `inclina`) em `docs/cena/pecas.md`. `material: "clay"` com `papel: "destaque"` deixa o objeto na cor da marca.
2. Não tem: ache um CC0 (Kenney, Quaternius, Poly Pizza filtrando CC0, OpenGameArt filtrando CC0; confira a licença na página do modelo), salve em `projetos/<nome>/assets/<objeto>.glb` (vira `glb-<objeto>`) e registre nome, autor, fonte, URL e licença em `fontes.md`. Passo a passo e checklist em `docs/repertorio-3d.md` (Modelos GLB).
3. Confira na galeria do projeto (`--galeria --projeto=<nome> --por=4`, abra com Read). Não combinou com a casa: descarte e procure outro, ou crie no `pecas.js`.

## Direção de câmera e mundo
- Cada beat tem câmera: `camera: {plano, mov}` (veja `docs/cena/estilo-padrao.md`). O padrão varia sozinho, mas dirija os beats que importam: `avanca` para revelar, `recua` para o todo, `topo` para mapa, `baixo` para imponência, `nenhum` para número.
- Prefira as **peças de mundo** (`grade`, `hemiciclo`, `domino`, `chuva`, `documento`, `mapa`, `templo`, `cela`, `manequim`) quando o assunto for institucional, dinheiro, lei ou processo: elas contam o dado se animando.
- Não use `capitulos` (trilha removida). Título animado substitui a legenda no beat; use poucos e curtos, só com palavras que a voz diz nesse trecho.
- Ritmo: troque o que aparece a cada 2 a 4 segundos. Em beat longo, some um elemento a cada ~2 s (`entra` em palavra).
- Entrada: `entra` perto de 0,1 s no primeiro elemento evita quadro vazio entre beats.
