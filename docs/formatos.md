

# Formatos do Ilustrando

Um formato tem três camadas: **mecanismo** (a lógica que faz funcionar), **estrutura** (a sequência de blocos) e **forma** (o que aparece na tela). O Ilustrando já tem a forma fixa (vídeo vertical animado, sem rosto). O que muda de um vídeo para outro é o mecanismo e a estrutura. Escolha o formato **antes** de escrever.

Dê um nome ao formato que repetir e registre em `projetos/<nome>/formato.md`. O décimo vídeo de um formato deve sair melhor que o primeiro.

## Como escolher (árvore)
```
A ideia é um número que impressiona?            -> NÚMERO IMPOSSÍVEL
Todo mundo acredita numa coisa errada?          -> MITO x FATO
Duas coisas que se confundem?                   -> COMPARATIVO
Algo mudou (regra, preço, lei, tecnologia)?     -> ANTES E DEPOIS
Existe uma ordem natural entre coisas (3 a 4)?  -> RANKING
Um processo com etapas?                         -> PASSO A PASSO
Uma coisa provoca outra?                        -> CAUSA E EFEITO
Nenhuma das anteriores, é um "como funciona"?   -> REVELAÇÃO (o padrão do perfil)
O tema é grande (ranking longo, capítulos)? -> um vídeo longo (sem teto de duração) ou SÉRIE EM PARTES, o que a pessoa preferir (cada parte usa um dos formatos)
```
Se mais de um servir, escolha o que mostra a ideia com **menos palavras**.

## Os 8 formatos

### 1. Revelação (o padrão)
**Mecanismo:** quebra de expectativa seguida de explicação. **Estrutura:** gancho (crença), mecanismo em 2 a 3 passos, virada, fecho. **Cena:** uma analogia visual com 1 a 2 peças que mudam de estado na virada. **Duração:** 40 a 55 s.
```
Gancho (gatilho: ___):
Promessa em uma frase:
Mecanismo, passo 1 / 2 / 3:
Virada (o detalhe que recontextualiza):
Fecho (pergunta de opinião):
```

### 2. Mito x Fato
**Mecanismo:** contraste direto entre o que se acredita e o que é. **Estrutura:** mito dito como todos dizem, "mas", fato com a prova, por que o mito existe. **Cena:** modelo `mito-fato` (peça cinza "MITO", peça em destaque "FATO"). **Duração:** 30 a 45 s.
```
Mito (como as pessoas falam):
Fato:
Prova (número ou mecanismo):
Por que o mito pegou:
```

### 3. Comparativo
**Mecanismo:** decisão ou diferença entre dois itens. **Estrutura:** os dois lados, critério, veredito com justificativa de uma frase (nunca opinião sem motivo). **Cena:** modelo `comparativo` com rótulos e vencedor em destaque.
```
Lado A / Lado B:
Critério:
Veredito + justificativa em uma frase:
```

### 4. Antes e Depois
**Mecanismo:** mudança que afeta a vida da pessoa. **Estrutura:** como era, o que mudou, o que isso muda para quem assiste. **Cena:** modelo `antes-depois` (o mesmo objeto em dois estados). Bom para lei, preço, regra, tecnologia.

### 5. Ranking
**Mecanismo:** ordem que a pessoa quer conferir. **Estrutura:** título com a promessa numerada, itens do menor ao maior impacto, justificativa curta por item. **Cena:** modelo `ranking` (até 4 itens; mais que isso, divida em dois vídeos). Itens falados do último ao primeiro mantêm a curiosidade.

### 6. Número Impossível
**Mecanismo:** um dado que parece errado. **Estrutura:** o número em destaque nos primeiros 3 segundos, o que ele mede, a comparação que o torna concreto, a nuance. **Cena:** `contador` sincronizado com a palavra do número, depois peças para a comparação.

### 7. Passo a Passo
**Mecanismo:** processo que parece mágico e é simples. **Estrutura:** problema, 2 a 3 etapas, resultado. **Cena:** modelo `passos` (até 3 etapas com rótulos). **Cuidado:** conversa, não aula ("primeiro faça isso" cansa).

### 8. Causa e Efeito
**Mecanismo:** relação que a pessoa não via. **Estrutura:** a causa cotidiana, a consequência surpreendente, por que acontece. **Cena:** modelo `causa-efeito` (A, seta, B).

## Série em partes (Parte 1, Parte 2...)
Não é um nono formato de mecanismo: é um jeito de **publicar** um tema em vários vídeos. Cada parte continua usando um dos 8 formatos acima (revelação, ranking, mito x fato...). Criado no estúdio em 19/10/2026; a primeira série foi `vicios-explicados-1-bets`.

**Quando usar:** tema grande que não cabe em 80 s, ranking longo (mais de 4 itens) ou caso com capítulos (cronologia, investigação em fases). Se cabe num vídeo só, não divida: série não é desculpa para esticar.

**Regras**
- **De 2 a 5 partes.** Decida o número antes de escrever a parte 1 e anote em `formato.md` (nome da série, N e o assunto de cada parte).
- **Cada parte funciona sozinha:** gancho próprio nos primeiros 3 s e um fato fechado. Quem cai na parte 2 sem ter visto a 1 entende tudo. Nada de "como vimos antes".
- **Abertura:** a primeira frase já diz o nome da série e a parte, junto do gancho (ex.: "Os vícios explicados, parte 1: as bets."). A tela de abertura mostra o nome da série, a parte e o assunto.
- **Capa numerada:** "PARTE 1" escrito na capa, mais o assunto (ex.: `Parte 1: *as bets*`). O título do post também leva o número.
- **Fecho que puxa a próxima, sem prometer o que não vem:** antes do convite padrão, uma frase que diz o assunto real da parte seguinte ("Na parte 2: por que o celular faz o mesmo com você."). Só anuncie a parte seguinte se ela já estiver roteirizada. Na última parte, feche a série ("Esse foi o último da série.").
- **Ordem do fim:** pergunta de opinião, chamada da próxima parte, pedido de compartilhamento (revezando "Compartilha no seu story" e "Manda pra aquele amigo que..."), e o CTA padrão (o `cta` de `ilustrando.config.json`).
- **Legenda:** primeira linha com "Parte 1 de N" e o assunto. Nas partes seguintes, acrescente "Veja a parte anterior no perfil." Hashtag fixa da série (ex.: #viciosexplicados).
- **Intervalo de publicação:** de 3 a 24 h entre as partes. Padrão: 24 h no mesmo horário, para quem gostou voltar no dia seguinte. Em tema quente ou com prazo (eleitoral, notícia), 3 a 6 h.
- **Duração:** cerca de 80 s por parte, como qualquer vídeo da página.
- **Nome do projeto:** `<serie>-<n>-<assunto>` (ex.: `vicios-explicados-2-celular`), para as partes ficarem juntas na pasta.
- **Linha editorial e fatos:** as regras de sempre em cada parte (duas fontes por número, outro lado, foto livre de quem for citado, atribuição).

## Princípios que valem para todos
- Título ou promessa nos primeiros segundos. O primeiro quadro precisa estar composto (é a capa).
- Câmera e cena nunca paradas por mais de 5 segundos: troque de beat ou de estado.
- Conversa, não aula. Frases curtas.
- Justifique toda opinião em uma frase.
- **Gap de informação:** abra uma pergunta num beat e só a responda no seguinte.
- **Re-hook:** no meio (por volta de 55% do vídeo) entre uma virada, um número novo ou uma mudança de objeto para reengajar quem ia sair.
- Um destaque por cena.

## Produção barata primeiro
Quando o formato ainda não foi validado, produza simples e rápido (carrossel antes de vídeo, modelo pronto antes de cena autoral). Só invista em cena elaborada depois que o formato mostrar que funciona.




