

# Cena: briefing do sujeito e storyboard

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Briefing do sujeito e storyboard (opcional, desde a Onda 2)
`sujeito` na cena (o do vídeo) e em cada beat (o do trecho) é a ficha que o plano entrega ao gerador do estilo. Tudo opcional: cena sem `sujeito` renderiza idêntica à de antes.
- Campos: `conceito` (obrigatório, frase curta: "fechadura de pinos em corte"), `tipo` (objeto, pessoa, lugar, animal, numero, comparacao, linha-do-tempo, documento, mapa, lista, marca, processo, abstrato, cta), `partes` (lista de peças; objeto e processo pedem 2 ou mais), `acao`, `angulo` (frente, lateral, topo, corte, tres-quartos, isometrico, detalhe, interior), `chave` (uma palavra dita no beat que o dispara), `proposito` (para que o trecho existe; sem resposta, sai), `estado` (lista: o que muda no trecho), `dados`, `foto` (busca ou arquivo), `nasceDe` (id do beat de que este continua), `fio` (o objeto ou ideia que atravessa o vídeo).
- Pode vir também de `projetos/<nome>/sujeito.json` (`{ "sujeito": {...}, "beats": { "<id do beat ou número>": {...} } }`), lido pelo plano automático ao criar o `cena.json`. Em cena que já existe, escreva direto no `cena.json`.
- Formato errado (tipo que não existe, chave com duas palavras) é erro; o resto é aviso. O lint de storyboard só avisa: `chave` ausente ou fora da fala do beat, `proposito` ausente, curto ou igual ao conceito, mais de 3 unidades de leitura num beat e densidade acima de 5 eventos por 10 s. Confira antes de animar: `node scripts/storyboard-lint.mjs <projeto> [--tudo]`.




