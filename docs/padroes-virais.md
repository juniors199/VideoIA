

# Padrões virais medidos

Base: 36 transcrições de vídeos virais em português. Guardamos apenas métricas, nenhum texto. O linter do pipeline (`src/video/lint-roteiro.mjs`) usa estes números e o JSON `benchmark-roteiros.json`.

## Medidas

| Métrica | p10 | mediana | p90 |
|---|---|---|---|
| Palavras por roteiro | 155 | 187 | 283 |
| Palavras por frase | 7,5 | 9,1 | 10,7 |
| Frases por roteiro | 15 | 22 | 34 |
| Números citados | 1,5 | 6,5 | 14,5 |
| Viradas internas por 100 palavras | 0,5 | 1,3 | 2,2 |

Metade abre com pergunta. O resto abre com afirmação que quebra uma crença ou com um número.

## O que isso manda escrever

1. **Alvo de 185 palavras** (cerca de 65 s). Abaixo de 120 o vídeo fica raso, acima de 290 a retenção cai.
2. **Frase de 9 palavras**, uma ideia cada, pontuada para a voz respirar.
3. **Seis números por vídeo**, sempre com fonte em `fontes.md`. Número concreto segura mais que adjetivo.
4. **Uma virada a cada 80 palavras**: "Mas", "Agora", "Aqui está o detalhe", "Repara". É o re-hook que sustenta o meio.
5. **Abertura**: pergunta específica ou afirmação que contradiz o senso comum, nos primeiros 3 s. Nunca "você sabia que". Desde 19/10/2026 o linter também dá nota ao gancho (primeira frase de até 12 palavras, tensão nas 8 primeiras, dois ingredientes, nada morno) e cobra as 3 opções na linha `GANCHOS:`: veja `ganchos.md`, "O que a aula ensina".
6. **Nuance**: toda afirmação forte ganha uma frase de justificativa. Onde há controvérsia, diga.
7. **Fecho**: devolve ao ponto do início e termina com pergunta de opinião (nunca sim ou não).

## Como o pipeline usa

- Antes de gastar voz e render, o lint dá nota de 0 a 100. Menos de 60 bloqueia com as causas.
- O plano automático de cena usa as mesmas viradas para cortar beats: cada virada abre uma cena nova.
- Os temas de série seguem este perfil.

## A abertura em 3 tempos (medida em 7 roteiros de referência, out/2026)
Transcrevi 7 vídeos de um perfil de referência de política e cotidiano (77 a 106 s). Todos abrem igual, nos primeiros 6 a 10 s:
1. **Gancho com o nome quente** (0 a 3 s): pergunta direta ou afirmação forte. "Quem manda mais no Brasil? O presidente ou o ministro do Supremo?", "A escala 6 por 1 acabou."
2. **Promessa com a marca e o tempo** (3 a 6 s): uma frase que faz alusão ao nome da página e diz quanto dura. No deles: "Vou te explicar de forma lúdica em 1 minuto e meio." No nosso: **"Eu te ilustro isso em um minuto e meio."** (ou "em um minuto", conforme a duração).
3. **Sem loop "E no final..."** (regra do estúdio, 24/10/2026): a lacuna do gancho já segura a atenção.

Depois disso, o corpo segue um padrão também medido:
- **Blocos sinalizados** que dão mapa ao ouvinte: "Passo 1", "Primeiro round", "Primeiro... Segundo... Terceiro".
- **Perguntas de transição** curtas no lugar de conectivos: "Como descobriram?", "E o domingo?", "E quando?".
- **Os dois lados** quando há disputa: "Quem defende fala em... Quem critica fala em...".
- **Frases curtas** (média de 7 a 9 palavras) e muitos números concretos com fonte.
- **O loop fecha no fim** com a virada prometida ("Ou seja, eles não foram absolvidos.").
- **Lição prática** em uma frase ("Fica de olho no holerite.", "Na próxima vez que pegar um santinho, lembra.").
- **Pergunta de opinião** antes do convite ("Então, quem manda mais? Me responde aqui embaixo.").
- **Convite curto**: no deles, 6 palavras (pergunta curta e a palavra-chave para comentar). O nosso convite padrão é o `cta` de `ilustrando.config.json`; quando ele pede comentário, a versão curta é "Quer criar vídeos como esse? Comenta <palavra>."


## Revisão de 23/10/2026 (dados reais da página)
Com 20 Reels publicados em 22/10, a abertura em 3 tempos virou fórmula (116 de 199 roteiros) e o CTA longo fechava 106. O estúdio aprovou: promessa da marca em no máximo 1 de cada 3 vídeos, CTA em 3 variantes (A/B), teto de 60 s nos políticos e gancho sem repetir o boato. A medição dos 7 vídeos de referência acima continua valendo como origem do padrão, mas a repetição em toda a página passa a ser variada de propósito.

## Tiques medidos (29/10/2026)
Em 223 roteiros reais (45 mil palavras): "o detalhe" aparece em 26% dos roteiros, "Ou seja" em 21%, "O outro lado" em 13%; nos 10 mais novos, "Traduzindo" ou "Resumindo" em 20%. As marcas clássicas de IA (contraste "não é X, é Y", "E o melhor", "descubra", "segredo", "finalmente") somam menos de 3%. O linter avisa cada molde e o que se repetiu em 3 dos últimos 5 roteiros.




