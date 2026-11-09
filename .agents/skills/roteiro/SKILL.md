---
name: roteiro
description: Escolhe o formato e o gatilho de gancho e escreve o roteiro narrado de um vídeo curto do Ilustrando, na faixa de palavras do objetivo do vídeo (padrão 150 a 230). Use depois da pauta.
---



# Roteiro

Leia `docs/formatos.md`, `docs/ganchos.md` e o **objetivo** do vídeo antes de escrever (seção 0). No objetivo padrão (`curiosidade`), de 55 a 80 segundos de fala: **150 a 230 palavras, alvo cerca de 185** (2,6 a 2,9 palavras por segundo). É o perfil dos 36 vídeos virais medidos em `docs/padroes-virais.md`. Roteiro mais longo é permitido (a faixa é uma sugestão; acima dela o linter só avisa, e a pessoa pode pedir 2, 5 ou 10 minutos). O pipeline roda um linter (nota mínima 70) e bloqueia roteiro fraco: escreva já para passar.

## 0. O objetivo manda nos números
O vídeo tem um estilo (a aparência) e um objetivo (o que ele quer ser). Valem nesta ordem: `Estilo: <id>. Objetivo: <id>.` na linha STATUS do roteiro (a `pauta` decide), senão `estiloPadrao` e `objetivoPadrao` de `ilustrando.config.json`, senão objetivo `curiosidade` com o estilo que ele sugere. Só o estilo, sem objetivo: vale o jeito de roteiro próprio do estilo. Roteiro antigo com `Modelo: <id>` continua valendo. Leia com `npm run objetivos -- --ver <id>` (ou `npm run estilos -- --ver <id>`) e siga o que diz, no lugar dos números padrão desta skill:
- `roteiro.palavras` e `alvoSegundos`: a faixa do texto (o linter mede contra ela).
- `formato.preferidos`, `padrao` e `proibidos`: entram na escolha do passo 1.
- `roteiro.estrutura`: os blocos, em ordem; os `obrigatorio` não podem faltar. `gatilhos`: escolha 1 ou 2 desta lista.
- `abertura3Tempos`, `promessaMarca` e `loopAberto`: se a abertura em 3 tempos vale, qual promessa dizer e se há loop aberto (aula e receita não têm; negócio local não tem abertura em 3 tempos nem promessa).
- `tom`, `pessoa`, `vocabulario` e `alfinetadas`: o jeito de falar. `proibir`: expressões que o linter reprova.
- `voz.direcao`: a marcação da primeira linha (ex.: `[calm, clear]`, `[warm, calm]`).
- `cta`: o convite final. `comentar` usa o `cta.texto` do config (seção 3, passo 7); os outros tipos usam o `cta.texto` do objetivo (salvar, compartilhar, visitar, link) e a `perguntaFinal`. `CTA: simples` no STATUS continua dispensando.
- `cuidados.avisoFalado`: frase obrigatória no roteiro (o linter cobra).
Escreva na linha STATUS o estilo e o objetivo quando não forem os padrões da página: `STATUS: ... Estilo: papel. Objetivo: aula. Formato: passo a passo.` Se a pessoa pediu vídeo **horizontal** ("na horizontal", "para o YouTube", "16:9"), acrescente `Orientação: horizontal.` (o `Formato:` continua sendo o formato do roteiro); no horizontal o vídeo sai sem @ (para ligar: `@: sim.`) e a legenda é opcional (`Legenda: não.`). O roteiro para YouTube pode passar de 60 s e ter o gancho nos primeiros 15 s; veja `docs/formato-horizontal.md`.

Na direção visual dos vídeos novos, mantenha o mesmo objeto enquanto a fala explica a mesma coisa. Oriente a cena a repetir a peça com o mesmo `id` entre beats, usando `efeitos.continuidade: true`; uma mudança de frase não exige fazer o objeto sair e entrar.

## 1. Escolha o formato
Use a árvore de `docs/formatos.md` (revelação, mito x fato, comparativo, antes e depois, ranking, número impossível, passo a passo, causa e efeito). Registre em `projetos/<nome>/formato.md` o nome do formato e por que.

## 2. Escolha o gatilho do gancho, de forma explícita (3 opções, obrigatório)
Um ou dois dos 9 (PD, PT, EE, CI, EN, UO, HE, EM, CC). Antes, responda em uma linha: **por que isso é curioso?** Se não houver um ponto de diferença, volte à `pauta`. Depois:
1. **Escreva 3 ganchos diferentes de verdade**, de gatilhos ou ângulos diferentes (ex.: um número que não bate, uma pergunta de mito, um nome conhecido com contraste). Use as técnicas de `docs/ganchos.md`, seção "O que a aula ensina": palavras do povo, nome conhecido, escada de surpresa, nome gigante + coisa banal + "por quê?", história com virada prometida.
2. **Teste cada um**: primeira frase de até 12 palavras; tensão nas 8 primeiras palavras (número, pergunta curta, contraste ou conflito); dois ingredientes; nada morno ("Você sabia", "Hoje vamos falar", "Neste vídeo", "Vou te contar"); fato antes da fonte; nenhum adjetivo vazio ("incrível", "interessante").
3. **Escolha o mais provocativo que continue verdadeiro**: todo número e fato do gancho está no `fontes.md`, o vídeo entrega o que ele promete, sem promessa de renda, sem adjetivo sobre pessoa ("desesperado", "ladrão"), sem ataque pessoal, sem desinformação e dentro das regras da Justiça Eleitoral. Em política, linha direita leve: o ângulo provoca, o fato não muda. Entre dois igualmente fortes, fique com o mais específico.
4. **Registre os 3 no `roteiro.md`**, na segunda linha (depois do STATUS), numa linha só:
   `GANCHOS: A) <opção 1> | B) <opção 2> | C) <opção 3> | escolhido: B (por quê, em poucas palavras)`
   O motor não narra essa linha. O linter avisa se ela faltar, se tiver menos de 3 opções ou se a primeira frase do roteiro não for uma delas, e dá nota ao gancho escolhido.
Anote também o gatilho no `formato.md`. O gancho cabe em uma respiração (3 a 5 s) e começa pelo fato.

## 2a. Padrões de gancho para curiosidade (24/10/2026)

Em todo roteiro novo, acrescente `Gancho: curiosidade-v2.` à linha STATUS. Roteiros antigos não são remarcados. O linter versionado cobra assunto concreto e nota de atenção de pelo menos 6/10, além das regras editoriais existentes.

Varie entre lacuna aberta, número que não bate, detalhe que quase ninguém percebe, observação cotidiana ("Você já reparou que..." com objeto nomeado), provocação sobre o objeto e identificação com uma consequência. Escolha um mecanismo, não uma senha para o linter. "Você já reparou nisso?" e "O segredo que ninguém te conta" reprovam por falta de assunto. Use os exemplos e a rubrica de `docs/ganchos.md`; a nota não verifica fatos nem prevê alcance.

Quando houver referência de desempenho observável, leia a skill `referencia` e registre estrutura, ritmo e gancho antes de adaptar. Reescreva no nosso tema com três opções autorais; não copie falas, imagens, voz ou música. Sem referência assistida ou números disponíveis, declare essa limitação. Sem promessa para o final e sem adjetivo vazio.

## 3-0. Regras novas de 23/10/2026 (aprovadas pelo estúdio)
- **Sem "Eu te ilustro..." (regra do estúdio, 23/10/2026).** A frase saiu de todos os roteiros e o linter reprova. Depois do gancho, vá direto ao mecanismo. Nada de "E no final..." (regra do estúdio, 24/10/2026): a curiosidade vem do próprio gancho e do mecanismo, sem promessa para o fim.
- **Política: sem teto de duração** (0.6.42). O alvo de ~60 s (até ~170 palavras) é só recomendação de retenção; acima disso o linter dá uma nota, nunca reprova. Corte atribuição repetida e número que não sustenta o argumento. Máximo de 9 números; o espectador guarda 1 ou 2.
- **Gancho nunca entrega a resposta (o linter reprova).** Nada de "é mito", "não é", "nunca disse", nem pergunta seguida de "Não." ou "Sim.". Abra a lacuna (número que não bate, promessa que acabou em outra coisa) e só responda no meio ou no fim. O estúdio decidiu que o nosso Reel de melhor alcance não serve de parâmetro, porque também não viralizou.
- **Pergunta final específica**: de uma palavra, divisão clara ("Time A ou time B?") ou envio ("Manda pra quem ainda acredita nisso"). O linter avisa perguntas genéricas ("Qual outro mito você já ouviu?", "O que você acha?") e fecho sem pergunta nem envio.
- **Gancho sem repetir a mentira** nos vídeos de boato e checagem: abra pelo fato ("É montagem feita por IA", "O vídeo não mostra isso") e traga a alegação falsa só depois, atribuída. Quem vê só o primeiro segundo não pode sair com o boato na cabeça.
- **Gancho sem alvo cedo em política**: prefira o fato, o número ou a pergunta ao nome do político na primeira frase, quando o fato sustenta o gancho sem ele.
- **Gatilho de bolso (PD ou EN pessoal) em economia e dinheiro**: a conta que o espectador faz sobre a própria vida (modelo: cesta-basica-horas, salario-minimo-horas-eua).
- **Notícia com validade de 48 h**: se a checagem em duas fontes não fecha em 24 h, mude o ângulo para a explicação que dura (o que acontece depois, como funciona), nunca publique atrasado como se fosse novidade.
- **Sem tiques**: no máximo um "O outro lado", um "Ou seja" e um "o detalhe" por roteiro. Nada de "A lição:" nem "Não é X. É Y.". O linter avisa.
- **Conteúdo técnico (cep, cpf, código de barras...) também fecha com pergunta ou envio**, nunca em frase solta.
- **Uma tela, uma ideia**: antes de escrever, diga qual formato de `docs/formatos.md` cabe. Comparativo, ranking e tela dividida cabem em muito tema que hoje vira narração corrida.

## 3a. Abertura em 3 tempos (primeiros 6 a 10 s; sem o passo da promessa desde 23/10/2026, ver regra no início)
1. **Gancho com o nome quente**: pergunta direta ou afirmação forte ("Quem manda mais no Brasil?", "Daniel Vorcaro ia embarcar num jato particular quando foi preso.").
2. **(Removido em 23/10/2026: não dizer "Eu te ilustro...".)** Antes era a promessa da marca com o tempo (ou a `promessaMarca` do objetivo, ex.: "Em um minuto você entende."): "Eu te ilustro isso em um minuto e meio." (até cerca de 75 s de fala: "em um minuto"). Varie sem perder o verbo ilustrar: "Deixa eu te ilustrar em um minuto.".
3. **Sem loop "E no final..."** (regra do estúdio, 24/10/2026): não prometa o fim; mantenha a lacuna do gancho aberta até a resposta.
Depois: blocos sinalizados ("Primeiro...", "Passo 1"), perguntas de transição curtas ("E o domingo?"), os dois lados quando houver disputa, lição prática em uma frase e pergunta de opinião antes do convite. Medição completa em `docs/padroes-virais.md`.

## 3-1. Exposição curta (opcional, 29/10/2026; base: curso Copy Balaclava)
Em tema de dor ou de cotidiano ("fecha os apps", "estala os dedos"), ponha 1 ou 2 frases logo depois do gancho que descrevam o que o espectador já faz ou sente ("Todo mundo faz esse ritual: desliza tudo pra cima e sente que arrumou."). Só o hábito reconhecível, sem inventar fato nem pôr a culpa em ninguém. Em política e notícia, pule: o fato abre direto. Máximo 15 palavras, dentro do limite de tamanho do modelo.

## 3. Estrutura (anatomia: hook, envolvimento, chamada)
1. **Gancho** (atenção).
2. **Promessa (5 s)**, dita: "o motivo é mais simples do que parece".
3. **Mecanismo (20 a 35 s)** em causa e efeito: contexto, ruptura, explicação, resultado. Um passo por frase curta.
4. **Gap de informação**: abra uma pergunta num ponto e só a feche no seguinte.
5. **Re-hook por volta de 55%**: um número novo, uma virada, uma mudança de objeto.
6. **Virada (5 a 10 s)**: o detalhe que recontextualiza. Sem virada, o tema é fraco: volte à `pauta`.
7. **Fecho com chamada (3 a 5 s)**: responde "o quê" e "por que agora". Pergunta de opinião, nunca sim ou não. **CTA em 3 variantes (teste A/B, aprovado em 23/10/2026):** `cta.variantes` e `cta.rodizio` em `ilustrando.config.json`. Escreva `CTA: pergunta`, `CTA: padrao` ou `CTA: metodo` na linha STATUS, seguindo o rodízio a partir do último projeto. `pergunta` = uma pergunta curta ou divisão clara + envio específico ("manda pra quem ainda acredita nisso"), sem pedir para seguir nem vender (padrão em política). `padrao` = o `cta.texto` fixo. `metodo` = só em tema de criar vídeo ou página, sem prometer número de seguidores. **Um pedido só por fim.** Só dispense com `CTA: simples` no STATUS.

## 3b. Tom: acidez leve e nome quente
- Notícia em alta: o nome que bombou abre o roteiro (primeiros 3 s) e vai para a capa.
- Uma ou duas alfinetadas no roteiro, em frase curta, apontando incoerência ou contraste dos fatos (nunca insulto, nunca adjetivo sobre pessoa). Política: mesmo rigor de fato para todos os lados, tudo atribuído; a linha editorial da página (seção 3c) escolhe o ângulo e onde vai a alfinetada, nunca o fato.

## 3c. Linha editorial (só em política)
Leia a linha da página: `npm run linha -- --ver` (campo `linhaEditorial` de `ilustrando.config.json`; regras em `docs/identidade-e-voz.md`, seção "Linha editorial em política"). Se ainda não foi escolhida, a skill `pauta` pergunta antes. Aplique **de leve**:
- **Ângulo e ordem:** abra pelo fato verdadeiro que conversa com a linha; o outro lado vem depois, mas vem, numa frase, atribuído.
- **Alfinetada:** as uma ou duas alfinetadas miram a incoerência que a linha quer apontar (promessa x entrega, discurso x voto, gasto x resultado), em fato, decisão ou instituição, nunca na pessoa.
- **Pergunta final:** pode puxar o debate para o lado da página, sem induzir com meia verdade.
- **Neutra:** mesmo espaço e mesma força para os dois lados.
**Não muda com a linha:** nenhum fato ou número inventado, distorcido ou fora de contexto; tudo atribuído ("segundo o TSE", "a defesa nega"); o fato central do outro lado não é omitido; sem ataque pessoal nem desinformação; regras das plataformas e da Justiça Eleitoral em período eleitoral (sem pedir voto, sem propaganda de candidato, sem conteúdo fabricado com IA). O linter avisa se um roteiro político não tem atribuição.

## 3d. Pense na tela enquanto escreve
Se o roteiro pede um objeto, um lugar ou um mundo que o repertório não tem, ele vai existir: a skill `cena` cria em `projetos/<nome>/pecas.js` (checklist de `docs/repertorio-3d.md`), e foto ou logo real vem de `scripts/buscar-imagem.mjs`. Nunca troque o assunto por uma peça genérica só porque é o que existe.

**Foto pelo nome (0.6.12).** Escreva pelo nome o que precisa aparecer em foto: pessoa ("o presidente Lula"), lugar ("a Torre Eiffel"), obra, evento, marca ou produto ("o iPhone"). O estúdio acha sozinho a foto de licença livre (Wikipédia, Wikimedia Commons, Openverse) e o logo das marcas da biblioteca, e registra o crédito em `fontes.md`. Personagem de exemplo leva só o primeiro nome ("a Ana ganha R$ 3.000") e nunca vira foto de alguém real. Para o objeto 3D, nomeie a coisa concreta ("o cofre do banco", "o pão"), não só a ideia.

## 4. Como escrever
- Média de 8 a 10 palavras por frase, nenhuma acima de 22.
- Pelo menos 3 números concretos (mediana dos virais: 6 a 7) e uma virada interna a cada 80 palavras ("Mas", "Agora", "Aqui está o detalhe").
- Frases curtas, uma ideia cada. Conversa, não aula ("primeiro faça isso, segundo aquilo" cansa).
- Justifique toda afirmação em uma frase. Nuance onde houver controvérsia.
- Números: pode escrever como se lê na tela ("R$ 100", "40h", "71%", "6x1", "17/10/2026", "2 GB"); o estúdio converte para a fala ("cem reais", "quarenta horas", "setenta e um por cento") antes de ir para a voz, em ElevenLabs e Fish, e a legenda mostra o que você escreveu. Sigla que a voz leia errado: crie `pronuncia.json` na pasta do projeto ({ "CNI": "cê ene i" }). O linter avisa o que a voz não sabe ler.
- Sem gíria de internet, sem travessão longo com espaços, sem "você sabia que".
- Pontue para a voz: ponto entre ideias, vírgula onde respira.

## 4b. Marcações de voz (ElevenLabs v3 e v4)
- Tags de tom ficam **entre colchetes, em inglês**, e não aparecem na legenda nem contam no linter. No máximo **2 por roteiro**: uma na primeira linha que define o jeito do texto todo, `[confident, calm]` ou `[calm, clear]`, e, se quiser, `[warm]` antes do convite final.
- Proibidas (a voz exagera): `[serious]`, `[tense]`, `[dramatic]`, `[excited]`, `[urgent]`, `[whispers]`, `[sad]`, `[angry]`, `[nervous]`, `[pause]`. Notícia e caso em andamento: só `[calm, clear]`.
- Só valem com `--voz=elevenlabs` e modelo `eleven_v3` ou `eleven_v4` (padrão em `ilustrando.config.json`). Com Fish, mock ou modelos antigos elas são ignoradas.
- Estabilidade perto de 0,4 (já no config). Ouça o primeiro vídeo antes de aumentar o uso de tags.

## 5. Confira e salve
**Leia em voz alta antes de salvar (29/10/2026).** Marque 3 frases que ninguém diria numa conversa e reescreva com a palavra do dia a dia. O linter avisa os moldes mais repetidos ("o detalhe", "Ou seja", "Traduzindo", "Resumindo", "Confira agora", "muda tudo", contraste "não foi X, foi Y") e, olhando os 5 últimos roteiros, o molde que virou marca da página. É aviso, não reprova: reescreva só o que soar falso.
Contagem de palavras, fatos contra `fontes.md`, checklist de `docs/formatos.md`. Salve `projetos/<nome>/roteiro.md` (pode ter uma primeira linha `STATUS:` e a linha `GANCHOS:`, que o motor ignora). Se o linter apontar "gancho morno" ou avisos de gancho (primeira frase longa, sem tensão nos 3 primeiros segundos, um ingrediente só), troque pela próxima opção da linha `GANCHOS` ou reescreva seguindo a mensagem. **Não peça aprovação** e siga para a skill `video`. Exceção: se a pasta do projeto tiver o arquivo `PEDIDO-DO-ESTUDIO.md` (pedido do botão "Fazer meu primeiro vídeo" do estúdio web), pare aqui: o estúdio web produz o vídeo sozinho e mostra na tela da pessoa. Diga a ela para voltar ao estúdio no navegador.

## Navegador: nunca
Você NUNCA abre, controla nem tira print do navegador da pessoa (nem o Chrome, nem o Safari, nem o Edge, nem o controle de navegador do aplicativo), para "mostrar o roteiro no estúdio" ou para qualquer outra coisa. O estúdio web se atualiza sozinho: ele vigia a pasta e começa o vídeo quando o roteiro chega. Já aconteceu de o assistente tentar controlar o Chrome, a janela da frente ser outro site e as tentativas só se repetirem. Para saber o estado, rode comando, nunca olhe a tela: `npm run status` (projetos e o próximo passo) ou `npm run comece -- --situacao --json` (que também diz a pasta exata do estúdio em uso, para conferir que é a mesma aberta no aplicativo). Se o estúdio parecer parado, confira se o `roteiro.md` está em `<pasta do estúdio>/projetos/<nome>/` e peça à pessoa o botão "Não está andando? Copiar diagnóstico do primeiro vídeo". Pediu "tenta de novo" e nada mudou: não repita; rode o comando de estado.




