

# Cena: som e trilha

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Som (efeitos sintetizados, `src/video/sfx.mjs`)
**Sons gravados (0.6.24):** por cima de cada evento abaixo entra o banco `sons/` (clique, pop e objeto trocam pela amostra; whoosh, riser e impacto somam amostra e sintetizado), no mesmo nível e com a mesma disciplina; sem o banco, o sintetizado. No beat ou no elemento, `"som": "trovão"` (palavra) ou `"som": "busca:<palavra>"` (banco aberto CC0); no beat, `"ambiente": "<tag>"` (chuva, vento, oceano...) ou `"nenhum"`. Tudo em `docs/sfx.md`.

O som sai sozinho da cena; não precisa escrever nada. **Discreto por padrão (0.4.3):** todos os efeitos do estilo ficam, só mais baixos; mais 8 dB abaixo enquanto alguém fala, salvo 1 impacto de destaque a cada 8 s; agudo acima de 6 kHz 4 dB mais baixo; o barramento inteiro 9,5 dB abaixo da 0.4.1, nunca acima da voz menos 12 LU e nenhum efeito acima do pico da voz no mesmo trecho. Vale em todos os estilos. `"sfx"` no `ilustrando.config.json`: `"suave"` (padrão, todos os efeitos, 9,5 dB abaixo da 0.4.1), `"normal"` (todos, 5 dB abaixo), `"espacado"` (no máximo 1 a cada 1,5 s e 4 a cada 10 s, escolhidos por importância: impacto, corte e número vencem tique, pop e whoosh repetidos) ou `"nenhum"`. Regras de cada som: corte padrão com clique seco; `varredura` pedida no beat leva swoosh médio (a do estilo `editorial`, em todo corte, leva o leve); peça leva um pop tonal no pouso; contador leva tiques, riser e grave; fecho com sino em duas notas.
- **Som pela forma:** quando a peça representa algo que faz barulho, o pop vira o som do objeto: moeda e cofrinho (moeda tilintando), registradora, carimbo e carteira de trabalho (carimbo), martelo e tribunal (martelo de juiz), papel e boleto (papel virando), teclado e notebook (digitação), jornal (máquina de escrever), câmera de foto (clique), notificação e mensagem (notificação), curtida (pop de curtida), coração (batida), copo e taça (vidro), gota e torneira (gota), raio (trovão distante), furacão e moinho (vento), carro e ônibus (carro passando), avião, caminhão, trem e navio (buzina), algemas (sirene curta), bola e campo (apito), multidão e pódio (aplauso leve), chip e servidor (glitch), meteoro e canhão (impacto). Celular, livro e documento só soam quando são o `destaque`.
- **Sem exagero:** no máximo um som por evento; o mesmo som específico só volta depois de 4 s (notificação 10 s, carro e trovão 12 s, aplauso 15 s), e dois sons longos nunca se sobrepõem. Fora disso, volta o pop.
- `som` no elemento (opcional): nome do som para forçar (`"som": "sino"`) ou `"nenhum"` para silenciar. Nomes: moeda, registradora, carimbo, martelo, papel, maquina, camera, notificacao, curtida, coracao, sino, gongo, vidro, gota, aplauso, trovao, vento, carro, aviao, sirene, apito, buzina, digitacao, swoosh-leve, swoosh-medio, swoosh-forte, riserCinema, impacto, glitch. Uma `imagem` só soa com `som`.
- `som` no beat (opcional): `"virada"` (riser cinematográfico que termina no corte e impacto no corte; uma vez por vídeo, na virada principal), `"swoosh-leve"`, `"swoosh-medio"`, `"swoosh-forte"` ou `"nenhum"`.
- Ouvir todos: `npm run sfx-previa` gera `marca/saida/sfx-previa.wav` e o índice em `sfx-previa.txt`.

**Sons v4 por evento** (`src/video/sfx-eventos.mjs`, 34 sons novos, síntese própria): cada um com envelope sem estalo, filtro, estéreo de verdade, pico em -1 dBFS e ganho medido para ficar no loudness do pop (no vídeo, o barramento fica 12 LU ou mais abaixo da voz em -16 LUFS; conferir com `npm run sfx-calibrar`).
- **Pacote inteiro:** `"efeitos": { "sons": "refinado" }` na cena troca os sons por evento: peça entra com `entrada` (pluck na escala da página), título com `entrada-texto`, corte com `clique-ui`, varredura com `whoosh-curto` (estilo) ou `whoosh-longo` (pedida no beat), contador com `contador-tique` subindo e `contador-final` (ou `moeda-unica` se for dinheiro), traço com `caneta-risco` (`check` vira `acerto`, `x` vira `erro`), rótulo com `clique-ui`, `pontos` com `morph`, e um `saida` discreto quando as peças de um beat longo saem no desfoque. Sem o campo, o mix de sempre (vídeos aprovados não mudam). Os sons pela forma continuam valendo nos dois.
- **Um som só:** qualquer nome v4 vale no `som` do elemento e do beat (no beat, os de transição chegam no corte: o riser termina nele, o whoosh passa por ele). Nomes: `entrada`, `entrada-texto`, `saida`, `contador-tique`, `contador-final`, `morph`, `clique-ui`, `clique-mouse`, `teclado-mecanico`, `whoosh-curto`, `whoosh-longo`, `whoosh-grave`, `impacto-seco`, `impacto-grave`, `batida`, `riser-curto`, `riser-tensao`, `ping`, `acerto`, `erro`, `glitch-curto`, `estatica`, `papel-amassar`, `papel-deslizar`, `caneta-risco`, `caneta-clique`, `moeda-unica`, `moedas-cascata`, `notas-contando`, `notificacao-suave`, `mensagem`, `zoom`, `tique-taque`, `pulso-grave`. Nome que não existe vira aviso do validador (com sugestão) e cai no som padrão.
- **Quando usar:** `riser-tensao` (2 s) ou `pulso-grave` antes da revelação; `impacto-grave` na virada (uma vez por vídeo); `acerto`/`erro` em mito x fato; `moedas-cascata`/`notas-contando` em dinheiro; `teclado-mecanico`, `glitch-curto` e `estatica` em tecnologia e golpe; `papel-deslizar`, `caneta-risco` e `caneta-clique` em documento, lei e assinatura; `tique-taque` em prazo; `ping` e `notificacao-suave` em dado novo.

## Trilha de fundo (`efeitos.trilha`)
> Fontes da trilha (0.6.42): a trilha pode vir de ElevenLabs Music, Stability ou Google Lyria, com queda automática para a sintetizada descrita abaixo. A escolha do clima e o acabamento (nível, fade, ducking) são os mesmos em toda fonte. Ver `docs/trilhas.md`.

Toda trilha é sintetizada pelo estúdio (`src/video/trilhas.mjs`; sem amostra, música nem som de terceiros, ficha em `AVISOS-TERCEIROS.md`), determinística (o mesmo projeto renderizado de novo soa igual) e com **ducking automático sob a voz**: abafada em -13 dB nos trechos de fala pelos tempos de `palavras.json` (lookahead de 80 ms, solta em 450 ms). Nível medido: -26 LUFS sem fala (10 LU abaixo da voz em -16) e perto de -39 sob a fala (`npm run trilhas` mede de novo).

**Sem escrever nada, a trilha muda a cada vídeo** (modo `auto`, o padrão de `"trilha"` no `ilustrando.config.json`):
- o clima sai do tema, do modelo, do formato, do estilo e das palavras do roteiro: política e polêmica tendem a `tensao` ou `misterio`; dinheiro e notícia, a `noticia` ou `pulso`; ciência e curiosidade, a `curiosidade`, `ambiente` ou `leve`; história, a `epico` ou `misterio`; fé e saúde, a `leve` ou `inspirador`. Entre os climas perto do topo, a semente decide;
- dentro do clima, a semente do nome do projeto muda o tom (-5 a +6 semitons), o andamento (±8%), a progressão (3 ou mais por clima), os instrumentos e o peso de cada um, o padrão rítmico e o timbre;
- a cada 8 compassos a seção muda (entra ou sai uma camada, o padrão alterna, a inversão dos acordes troca): nada de loop idêntico.

Para escolher à mão (vence o auto; projetos antigos com `efeitos.trilha` continuam iguais no clima):
```json
"efeitos": { "trilha": "curiosidade" }
"efeitos": { "trilha": { "clima": "tensao", "volume": 0.8 } }
"efeitos": { "trilha": { "clima": "leve", "semente": 7 } }
"efeitos": { "trilha": "auto" }
```
| clima | o que é | combina com |
|---|---|---|
| `curiosidade` | pizzicato, pad e sininho, menor, ~96 bpm | curiosidades, tecnologia, ciência |
| `tensao` | drone grave, pulso e tique, menor frígio, ~76 bpm | caso policial, golpe, política, finanças em crise |
| `leve` | violão sintético, palmas suaves e pad, maior, ~104 bpm | receita, negócio local, fé, aula, saúde do dia a dia |
| `epico` | tambores, cordas e metais, menor, ~88 bpm | história, esporte, conquista, grandes números |
| `noticia` | pulso de plantão, baixo, stabs e chimbal, menor, ~120 bpm | notícia, economia do dia |
| `misterio` | drone, textura e sino esparso, menor com cromatismo, ~70 bpm | caso sem resposta, segredo, história obscura |
| `ambiente` | minimalista, quase só textura e acordes abertos lentos, ~64 bpm | ciência, espaço, natureza, explicação calma |
| `inspirador` | piano em arpejo, cordas e bumbo macio, maior, ~92 bpm | fé, superação, conquista, saúde |
| `groove` | lofi: piano elétrico com sétimas, batida arrastada e chiado de vinil (tudo sintetizado), ~84 bpm | cotidiano, tecnologia, receita |
| `pulso` | arpejo eletrônico, baixo pulsante e bumbo, menor, ~112 bpm | dinheiro, mercado, tecnologia, comparativos |
| `antigo` | solene de museu: cordas graves, tambor lento e drone, menor, ~62 bpm | história antiga, impérios, estilo `antiguidade` |
| `pad` | a cama antiga (pad lento por perfil), só por escolha manual | quem quer o som de antes |

`volume` vai de 0 a 2 (1 é o nível medido); `config.volumeTrilha` muda para a página toda. `semente` (inteiro) troca a variação sem trocar o clima, útil quando o QA avisa que a trilha repetiu a de outro projeto. Clima que não existe é erro do validador, com sugestão. `--sem-musica`, `"musica": false` ou `"trilha": "nenhuma"` no config desligam; os estilos de motion e o pontilhismo seguem sem trilha, salvo `efeitos.trilha` ou `"efeitos": { "musica": true }`.

**QA do áudio** (em todo render, com os stems medidos antes da mixagem; tudo em `saida/relatorio.json`, campo `audio`): voz em -16 LUFS; reprova se os efeitos somados ficarem a menos de 10 LU da voz ou a trilha sob a fala a menos de 14 LU; avisa se a trilha (mesmo clima e semente) é idêntica à de outro projeto entre os 10 últimos renderizados; mostra o clima, o motivo da escolha e a semente.




