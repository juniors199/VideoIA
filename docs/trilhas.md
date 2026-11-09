

# Trilha de fundo: fontes e queda automática (0.6.42)

A música de cada vídeo vem de uma **cadeia de fontes**. O estúdio tenta uma por uma, na ordem, e usa a primeira que responder. Se todas falharem, ou se você não ligou nenhuma, toca a **trilha sintetizada** do estúdio, que não precisa de chave nem de internet e **nunca falha**. O vídeo nunca para por causa da música.

## As fontes

| Fonte | Chave no `.env` | Custo | Duração por geração | Licença de uso |
|---|---|---|---|---|
| ElevenLabs Music | `ELEVENLABS_API_KEY` (a mesma da voz, com **Music** liberado) | minutos do plano pago da ElevenLabs (preço por música: não confirmado) | até 5 min (blocos acima disso) | uso comercial conforme o plano; no plano Free não há download e há atribuição (https://elevenlabs.io/music-terms) |
| Stability (Stable Audio 3.0) | `STABILITY_API_KEY` | cerca de US$ 0,08 por trilha; conta nova ganha 25 créditos (uns 3 testes) | 1 a 380 s | Community License: comercial até US$ 1 milhão de receita anual (https://stability.ai/license) |
| Google Lyria 3.5 (Gemini API) | `GEMINI_API_KEY` | cerca de US$ 0,08 por música; sem plano grátis | cerca de 2 min | a Google não reivindica o conteúdo; termo específico de áudio: não confirmado (https://aistudio.google.com/docs/terms) |
| Biblioteca livre curada (CC0 e domínio público) | nenhuma | grátis | 1 a 4 min por faixa, repetida em laço se o vídeo for maior | **ligada por padrão** (regra do estúdio, 08/11/2026): licença conferida na página de cada faixa |
| Sintetizada do estúdio | nenhuma | grátis | qualquer | própria, gerada em código |

A pesquisa completa (fontes oficiais, o que ficou "não confirmado" e as fontes descartadas, como Suno, Udio, Mubert e MusicGen por licença não comercial) fica no repositório do mantenedor, fora do kit. Quem compra o kit usa a **própria chave** e responde pelo uso: confira o termo de cada serviço e a regra de conteúdo gerado por IA de cada rede.

## Como ligar (uma vez)

- **Estúdio web:** Começar > Voz e trilha. Em cada fonte, "Como ligar" mostra o passo a passo e um campo para a chave (ela vai direto para o `.env` deste computador). Marque "Usar as fontes profissionais".
- **Sem o estúdio web:** cole a linha da chave no arquivo `.env` da pasta (o modelo está em `.env.exemplo`) e rode `npm run trilhas-fontes -- --ligar`. Nunca cole a chave na conversa com o assistente.
- `npm run trilhas-fontes` mostra a situação (só "pronta" ou "sem chave"), `-- --testar` confere cada chave sem gastar crédito e `-- --desligar` volta à sintetizada. O `npm run doctor` tem a linha `trilha`.

## Configuração (`ilustrando.config.json`)

```json
"trilha": {
  "clima": "auto",
  "ordem": ["elevenlabs", "stability", "lyria", "sintetizada"],
  "bibliotecaLivre": false,
  "provedores": { "stability": { "ativo": true, "modelo": null, "tentativas": 3, "tempoMs": 120000 } }
}
```

- `clima`: `auto` (pelo conteúdo), um clima fixo ou `nenhuma`. O formato antigo `"trilha": "auto"` e `"trilhaFonte": "elevenlabs" | "sintetizada"` continuam valendo quando não há `trilha.ordem`.
- `ordem`: a sintetizada sempre fica por último, mesmo que não esteja na lista. Fonte sem chave é pulada em silêncio.
- `provedores.<fonte>`: `ativo`, `modelo` (a ElevenLabs aposenta o `music_v1` em 31/01/2027), `tentativas`, `tempoMs`, `esperaMs`, `urlBase` (testes), `revisao` (Lyria). A fábrica do kit vendido sai só com a sintetizada, porque as outras gastam crédito da pessoa ou baixam arquivos.

## O que acontece em cada vídeo

1. Para cada fonte da `ordem`: sem chave, pula; circuito aberto, pula; cache da mesma assinatura (fonte, clima, faixa de 10 s da duração, semente, pedido extra), usa sem pagar de novo.
2. Pede a trilha com **tempo limite**, até 3 tentativas com recuo (só em 429, 5xx, rede e tempo esgotado; 401 e 402 não repetem, só gastam tempo).
3. Confere o áudio: arquivo corrompido, silêncio, saturação (mais de 3% das amostras no teto) e pico alto demais (atenuado para -1 dBFS) viram falha ou correção.
4. Ajusta à duração do vídeo: mais longa corta com fade; quase do tamanho estende por compassos inteiros; **mais curta repete em laço com crossfade** e fecha com fade no último quadro.
5. O estúdio mede o nível (BS.1770, -20 LUFS sem fala), aplica fade e ducking sob a voz, igual para qualquer fonte.
6. **Circuito:** chave recusada ou sem crédito abre na hora; falhas comuns abrem na 2ª seguida; aberto, a fonte é pulada pelos próximos vídeos da mesma execução por 10 minutos.
7. O `relatorio.json` guarda em `audio.trilha`: `fonte`, `modelo`, `licenca`, `caiu`, `cache`, `ajuste` e `tentativas` (cada fonte: usada, pulada ou falhou, com o código: `auth`, `credito`, `limite`, `servidor`, `rede`, `timeout`, `moderacao`, `resposta-invalida`, `silencio`, `saturacao`, `curta`). Quando caiu para outra fonte, também entra um aviso.

## Biblioteca livre curada (ligada por padrão no repositório)

Regra do estúdio (08/11/2026): a regra "músicas de terceiros são proibidas" tem uma exceção, e só esta: a biblioteca curada de trilhas **CC0 ou domínio público**. Cada faixa só entra com a licença conferida na página oficial dela (Internet Archive, Free Music Archive ou OpenGameArt); CC-BY, NC, ND, SA, Pixabay e Incompetech ficam de fora. São 85 faixas (suspense 6, terror 10, drama 8, romance 9, comédia 10, ação 10, inspirador 8, ambiente 8, notícia/pulso 6, lofi 10), normalizadas a -18 LUFS. A curadoria, o que foi descartado e os limites (inclusive: ninguém ouviu as faixas ainda) estão em `musicas/RELATORIO-CURADORIA.md`; cada faixa tem id, título, autor, origem, licença, data da conferência, categoria, clima, bpm, duração e sha256 em `musicas/licencas.json`.

- **Onde ficam:** no bucket público `ilustrando-criativos`, em `musica/livre/<id>.mp3` (https://midia.ilustrandocuriosidades.com/musica/livre/). **Nada vai no zip** (limite de 120 MB). O manifesto também está lá (`musica/livre/licencas.json`).
- **Como funciona:** o estúdio baixa só a faixa do clima do vídeo, confere o sha256 contra o manifesto e guarda em `.estudio/musicas` (outros vídeos não baixam de novo; o manifesto fica em cache por 24 h e, sem internet, vale o cache). Hash diferente, arquivo corrompido, falta de rede ou faixa sem licença cc0/pdm, data de conferência, autor, origem ou hash: a fonte falha e a cadeia segue; a sintetizada nunca falha.
- **Ordem (decidida pelo custo):** `elevenlabs`, `stability`, `lyria`, `biblioteca-livre`, `sintetizada`. Quem não tem chave de música cai direto na biblioteca (fonte paga sem chave é pulada), então o vídeo já sai com música profissional gratuita. Quem tem chave recebe primeiro a trilha feita sob medida (a biblioteca tem uma faixa fixa por clima e semente, que se repete entre vídeos) e a biblioteca entra de reserva, sem custo. Para gastar menos crédito, ponha `"biblioteca-livre"` no começo da `ordem`.
- **O zip de fábrica continua só com a sintetizada** (`trilha.ordem: ["sintetizada"]`, `bibliotecaLivre: false`). Quem quiser a biblioteca no kit liga com `"bibliotecaLivre": true` e a ordem.
- **Crédito:** CC0 e domínio público não exigem crédito. O relatório do vídeo guarda autor, origem e data da conferência da faixa usada (`audio.trilha.licenca`).
- **Risco que sobra:** reivindicação por engano (Content ID) em faixa CC0 é possível (já houve com faixas do Komiku no YouTube). Guarde o relatório do vídeo; se houver reivindicação, troque a faixa (outra `semente`) e avise.
- **Adicionar faixa:** só com licença CC0 ou domínio público conferida na página da faixa, mais todos os campos do manifesto. Nunca acrescente faixa por memória ou por "parece livre".

## Não entram no kit

Modelos grandes locais (MusicGen, Stable Audio Open): licença não comercial ou aceite no Hugging Face, e o pacote tem teto de 120 MB. Se um dia entrarem, baixam sob demanda.

## Testes

`npm test` roda `test/trilha-provedores-*.test.mjs` com servidores HTTP simulados (sucesso, 401, 402, 429, 5xx, tempo esgotado, resposta corrompida, duração menor, silêncio e saturação). Nenhum teste chama a rede nem gasta crédito.




