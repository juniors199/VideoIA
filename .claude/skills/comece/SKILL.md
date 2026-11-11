---
name: comece
description: Primeira vez no estúdio, para quem nunca usou nada parecido. Confere a instalação e, se faltar algo (inclusive o Node, quando a pessoa abriu a pasta direto no assistente sem os dois cliques em Instalar), roda você mesmo o instalador da pasta, sem pedir para a pessoa digitar comando; leva a pessoa ao estúdio web (voz, marca, estilo, objetivo e Configurar IA, sem chave no chat), conecta a IA e diz o próximo passo. Use quando a pessoa escrever "comece", "comece pelos primeiros passos", "primeiros passos", "primeira vez", "acabei de baixar", "por onde começo", "instala pra mim", "não sei usar", ou quando a marca do estúdio ainda for a neutra "Sua Página". MODO ASSISTENTE (sem o estúdio web aberto, ou se a pessoa preferir a conversa): voz pelo arquivo .env, marca e prova opcional. Também quando o estúdio devolver um erro com código (o do botão "Copiar diagnóstico"): só corrige pela lista segura. Este estúdio é open-source: não há licença de ativação nem marca d'água.
---



# Comece: a primeira execução

Quem está do outro lado descompactou a pasta do Estudio de videos (open-source) e abriu a pasta no assistente (app do Claude, aba Code, ou Codex). Pode ter dado dois cliques em **Instalar (Mac)** ou **Instalar (Windows)** antes, ou não: abrir a pasta direto aqui também é um jeito certo de começar, e aí quem instala tudo, inclusive o Node, é você (Passo 0). Pode nunca ter usado um Terminal e **não vai digitar comando nenhum**: quem roda os comandos é você. O seu trabalho é levar essa pessoa até a marca aplicada, a IA conectada (ou o pedido pronto no chat) e um caminho claro para o primeiro vídeo, em uns 15 minutos.

## Como falar durante toda a skill
- **Um passo por vez.** Diga em uma frase o que vai fazer, faça, e diga em uma frase o que aconteceu. Nada de parede de texto.
- **Sem jargão.** Se precisar de uma palavra técnica, explique na mesma frase: "o FFmpeg, o programa grátis que junta imagem e som".
- **Nunca peça para a pessoa digitar um comando** no Terminal, no PowerShell ou na conversa. Instalar é com você (Passo 0); o que fica com ela é sempre um clique: aprovar o comando que você pediu, o botão de um site, uma tela do estúdio web.
- **Avise antes de cada pedido de aprovação.** Ex.: "Vou conferir a instalação. Vai aparecer um pedido de aprovação: pode aprovar."
- **Mostre progresso** no formato `Passo 2 de 6: ...`.
- **Chave nunca na conversa.** Você não pede, não lê, não mostra e não copia o conteúdo do `.env`. A chave entra pelo estúdio web (Começar > Voz), que grava no `.env` sem mostrar de novo. Se a pessoa colar uma chave no chat, diga com calma: "Não cole a chave aqui: ela fica salva na conversa. Entre no site da voz, apague essa chave, crie outra e cole só no estúdio, em Começar > Voz." Não repita a chave na resposta.
- **Sem travessão longo com espaços** em nenhum texto.

Se a pessoa trouxe um código de erro, siga [Recuperação do estúdio](recuperacao.md). Se ela colou o pedido de primeiro vídeo do estúdio, siga o trecho correspondente do Passo 4.

## Dois caminhos: estúdio web ou modo assistente
Logo no começo, rode `npm run comece -- --situacao --json` (com `ferramentas/rodar` na frente se `node` não existir; se não existir de jeito nenhum, faça o Passo 0 primeiro). O campo `modo` diz onde você está:
- `assistente` (você roda dentro do Claude Code ou do Codex e o estúdio web não está aberto), ou a pessoa pediu para fazer tudo pela conversa: **leia `modo-assistente.md`, nesta pasta da skill, e siga-o do início ao fim.** A voz acontece aqui, sem o estúdio web: a chave da voz nunca vai no chat (só no arquivo `.env`, aberto por `npm run voz -- --preparar`). Não existe mais ativação de licença.
- `estudio-web-ou-terminal` (ele já está aberto ou você não é o assistente): siga os passos abaixo, que levam a pessoa ao estúdio web.
Em dúvida, pergunte uma vez: "Você prefere configurar clicando no estúdio, no navegador, ou aqui comigo, pela conversa?"

## Passo 0. Node e instalação
Teste `node -v`. Se o Node estiver ausente ou abaixo da versão 20, se o doctor pedir reinstalação ou se houver problema de permissão, siga [Instalação](instalacao.md).

## Passo 1 de 6. Conferir a instalação
1. Rode `npm run doctor` (com `ferramentas/rodar` na frente se precisar). Cada linha começa com `ok`, `aviso` ou `ERRO`. Só `ERRO` impede o vídeo.
2. Se aparecer qualquer `ERRO` de programa (Node, FFmpeg, ffprobe, libx264, loudnorm, Chromium, WebGL ou three.js), a correção é a mesma, e é você quem faz: diga "Falta <o que, em uma frase simples>. Vou instalar aqui na pasta, sem apagar nada seu; vai aparecer um pedido de aprovação: pode aprovar." e rode o instalador da sua plataforma (Passo 0). Ele instala só o que falta.

| Linha com ERRO | O que dizer |
|---|---|
| Node | "Falta o Node, o motor que roda o estúdio." |
| FFmpeg, ffprobe, libx264 ou loudnorm | "Falta o FFmpeg, o programa grátis que junta imagem e som (ou a versão do computador é incompleta)." |
| Chromium ou WebGL | "Falta o navegador interno que desenha os quadros do vídeo." |
| three.js | "Faltam as peças do estúdio." |
| fontes | "Faltam as fontes da marca: a pasta foi descompactada pela metade. Descompacte o zip de novo (Windows: botão direito, Extrair tudo, Procurar, Disco Local (C:), Extrair)." |
| disco | "O computador está quase sem espaço. Libere uns 5 GB (lixeira, downloads antigos)." |

3. Rode o doctor de novo. Repita até não sobrar `ERRO`, no máximo 3 rodadas. Se sobrar, pare, diga exatamente qual linha ficou e aponte o Guia 06, seção "Linhas ERRO e aviso do diagnóstico".
4. Linhas `aviso` não impedem nada. Explique só as que importam agora: "alinhador de voz não instalado" quer dizer que a legenda com Fish Audio vai sincronizar pelas pausas; o instalador da pasta resolve (rode de novo, Passo 0).

## Passo 2 de 6. Voz, marca, estilo e objetivo: no estúdio web
Tudo que envolve chave ou escolha de marca acontece no **estúdio web**, uma página do navegador que roda só no computador da pessoa. Ela clica e preenche; você não vê nenhuma chave. Não há passo de licença: o estúdio é open-source.
1. Abra o estúdio para ela: rode `npm run estudio -- --abrir` em segundo plano (com `ferramentas/rodar` na frente se precisar). Ele abre o navegador sozinho em `http://127.0.0.1:4173`. Se a pessoa já estiver com o estúdio aberto (os dois cliques em Instalar abrem no fim), não abra outro: peça para ela voltar à aba do navegador. Se o navegador não abrir, diga o endereço para ela clicar.
2. Diga: "Abri o estúdio no seu navegador. Ele começa com um vídeo de demonstração pronto, que não gasta nada. Depois, na aba **Começar**: **Voz** (ElevenLabs com conta grátis, guia de 5 passos e o botão **Testar minha chave**, que diz se ela está ativa; a chave vai lá, nunca aqui), **Sua marca** e **Tipo de página**. Me avise quando terminar."
3. Para ajudar a escolher a voz, uma linha de cada:
   - **ElevenLabs (a padrão):** a voz do estúdio, com conta grátis (cerca de 10.000 créditos por mês, uns 10 minutos de fala). Guia de 5 passos na tela Começar > Voz > ElevenLabs: criar a conta, gerar a chave (API Keys, com **Text to Speech** e a leitura das vozes liberadas), colar no estúdio, ouvir e escolher uma das 10 vozes padrão e salvar. Quando a cota acabar: assinar um plano ou criar outra conta grátis com outro e-mail e trocar a chave. Nunca peça a chave no chat.
   - **Fish Audio:** paga por uso, centavos por vídeo.
   - **Voz de teste:** sem som, só para conferir; dá para decidir depois.
   - **Trilha (música de fundo), opcional:** o estúdio já tem uma trilha própria que nunca falha. Quem quiser música profissional liga em **Começar > Voz e trilha** uma ou mais fontes (ElevenLabs Music com a mesma chave da voz, Stability ou Google Lyria, cada uma com a própria chave); se uma falhar, o vídeo segue na próxima, sem parar. Não empurre: só explique se ela perguntar da música. Detalhes e custos em `docs/trilhas.md`; a chave nunca vem para a conversa, só no estúdio web ou no `.env`.
4. Quando ela avisar, confira sem ver nada secreto: `npm run doctor -- --voz=<voz escolhida>` (diz só `definida` ou `ausente`; a linha `trilha` mostra as fontes de música com chave), `npm run marca -- --ver`, `npm run objetivos -- --padrao` e `npm run linha -- --ver`.
5. Se ela preferir fazer a marca conversando com você, siga a skill `marca` (nome, @ e cor; ela roda o comando). Neste roteiro (estúdio web), a chave de voz não passa pela conversa. No modo assistente (`modo-assistente.md`), a chave da voz também nunca.

Sem estúdio web (o navegador não abriu, ou a pessoa prefere a conversa): siga `modo-assistente.md`. Para a voz, `npm run voz -- --preparar` cria o `.env` e abre no editor de texto dela; `npm run voz -- --conferir` testa a chave e responde só `ok` ou o motivo (`bloqueada` é a trava da conta grátis da própria ElevenLabs, não chave errada: explique, peça para desligar a VPN e tentar mais tarde ou em outra internet, e ofereça seguir com a voz de teste até liberar; nunca sugira criar outra conta grátis, que é o que provoca a trava).

## Passo 3 de 6. Tipo de página (se ainda não escolheu no estúdio web)
1. Rode `npm run objetivos -- --padrao`. Se o estúdio ainda não tiver a escolha (o painel mostra o passo "Estilo e objetivo" pendente), pergunte uma vez: "Qual é o objetivo dos seus vídeos? Curiosidades (o padrão), aula e explicador, notícia e política, finanças, Bíblia e fé, negócio local, receitas, esporte, saúde, tecnologia, história, ciência, venda ou tutorial." Use o nicho da marca como sugestão (Dinheiro vira `financas`, Política e atualidades vira `noticia`, Bíblia e fé vira `fe`, Esportes vira `esporte`, Ciência e espaço vira `ciencia`, História vira `historia`, Curiosidades e Cotidiano e casa viram `curiosidade`). Grave com `npm run objetivos -- --padrao <id>` (sem resposta, `curiosidade`). O estilo (aparência) é opcional: `npm run estilos -- --padrao <id>`; sem ele, cada objetivo usa o estilo que combina.
2. Rode `npm run linha -- --ver`. Se disser "ainda não foi escolhida", pergunte uma vez: "Se um dia a sua página falar de política, ela tende a algum lado? Neutra (o padrão), esquerda, centro ou direita? E com que força: leve ou moderada?". A linha só muda o ângulo e o tom, nunca os fatos. Grave com `npm run linha -- <linha> <intensidade>` (sem resposta, `neutra leve`).

## Passo 4 de 6. Configurar IA (e o primeiro vídeo)
1. No estúdio web, peça para ela ir em **Configurações > Configurar IA**: ao abrir, o estúdio **procura sozinho** Claude Code, Codex ou Cursor Agent já no PC (não em extensão do editor). Ela clica em **Usar esta** no que aparecer; se faltar, **Instalar** baixa no computador (aviso: o estúdio não oferece IA grátis). No Cursor: **Entrar com o Cursor** ou a API Key do painel no campo da tela (nunca peça a chave no chat).
2. Com a IA conectada, a aba **Chat** aparece no estúdio: o pedido do primeiro vídeo pode ir direto para lá (botão **Enviar no Chat**). Se a IA ainda não estiver conectada, mantenha o fluxo de **Copiar o pedido** para colar nesta conversa.
3. Se ela preferir provar o motor pela conversa (sem o chat), diga "Vou fazer um vídeo de exemplo, sem voz, só para provar que tudo funciona." e rode `npm run prova`. Se passar, o vídeo aparece em **Meus vídeos**.
4. Se falhar, siga a seção "Quando o estúdio devolver um erro" (mais abaixo): só a lista segura, no máximo 2 tentativas.
5. Se a voz já estiver configurada e a pessoa quiser ouvir o exemplo, ofereça (não rode sem perguntar, porque gasta crédito): `npm run video -- exemplo --voz=<voz>`.
6. Para o primeiro vídeo de verdade, o caminho mais curto é a aba **Novo** do estúdio web: ela digita o tema e, com a IA conectada, envia no Chat; sem IA conectada, copia o pedido para colar aqui. Se ela quiser uma vitória ainda mais rápida, a opção de carrossel faz um carrossel em segundos, sem voz.
7. Se algo falhar no estúdio web, a tela mostra a causa, o que fazer e os botões **Copiar diagnóstico** e **Abrir o direct** (direct do Instagram @kaueajure, https://ig.me/m/kaueajure). O estúdio também manda sozinho um aviso anônimo (só o código da falha, a versão e o sistema; desliga em Configurações).

### Quando a pessoa colar o pedido do botão "Fazer meu primeiro vídeo" (ou enviar no Chat)
O pedido começa com "Quero o meu primeiro vídeo sobre..." e diz a pasta (`projetos/<nome>/`, com o arquivo `PEDIDO-DO-ESTUDIO.md`). Faça só a parte do texto: skill `pauta` (ângulo e fatos conferidos), skill `roteiro` (grava `projetos/<nome>/roteiro.md` e `fontes.md`) skill `pesquisa-visual` (grava `direcao-visual.json` antes do `roteiro.md` definitivo) e skill `youtube` (grava `projetos/<nome>/youtube.json`). **Não rode o vídeo** (nem `npm run video`, nem a skill `video`): o estúdio web está esperando o roteiro, começa sozinho uns 15 segundos depois de você gravar e mostra o progresso e o vídeo na tela dela. Termine dizendo: "O roteiro está pronto. Volte ao estúdio no navegador: o vídeo já começou." Se o estúdio depois mostrar "O roteiro não passou no corretor automático", reescreva o roteiro na mesma pasta e peça para ela clicar em **Tentar de novo**.

## Quando a foto não vem
O estúdio busca sozinho a foto de quem ou do que a fala cita pelo nome. Se o relatório trouxer o aviso `foto-nao-encontrada`, explique com as palavras do aviso (sem internet, antivírus ou rede da empresa bloqueando, ou nenhuma foto de licença livre) e ofereça: tentar de novo com internet, ou a pessoa pôr uma foto dela (ou com autorização) em `projetos/<nome>/assets/` e você usar no beat (`"arquivo": "assets/<arquivo>"`). Nunca use foto sem licença.

## Quando o estúdio devolver um erro
Abra [Recuperação do estúdio](recuperacao.md). Comece pelo código e pelo resumo do relatório. Siga a lista de correções do guia e respeite o limite de duas tentativas.

## Passo 5 de 6. O que ela precisa fazer fora do computador
Em três linhas, sem detalhar: criar as contas da página (Guia 02: Instagram, TikTok, Página do Facebook e YouTube Shorts), usar a mesma foto e o mesmo @ nas quatro (as imagens estão no estúdio web, em Começar > Sua marca, botão "Abrir a pasta com as imagens") e ler a rotina de postagem (Guia 04).

## Passo 6 de 6. O próximo passo
Termine com um resumo curto e um convite concreto:

```
Pronto:
- instalação: ok
- licença: open-source (sem ativação)
- voz: <ElevenLabs | Fish Audio | voz de teste>
- marca: <Nome> <@handle> | ainda a neutra
- IA conectada: Configurações > Configurar IA; Chat do estúdio quando `assistente` estiver no config

Agora escreva, do seu jeito:
"Quero um vídeo sobre <tema>."   ou   "Quero um carrossel sobre <tema>."
```

Se faltar algo (voz ou marca), o convite é para resolver isso primeiro, no estúdio web, numa frase.

## Como pedir mudanças
Diga à pessoa que ela pode pedir alterações em português comum. Para orientar ou executar um ajuste específico, consulte [Ajustes em vídeos](ajustes.md).

## Atalhos (para quem quiser)
| | Claude Code | Codex |
|---|---|---|
| Esta skill | `/comece` | `$comece` |
| Lista de skills | `/` | `$` ou `/skills` |
| Escrever normalmente | funciona | funciona |

Pedir em português sempre funciona nos dois. Os atalhos são opcionais.

## Não faça
- Não peça para a pessoa abrir o Terminal, o PowerShell ou digitar comandos. Instalar é com você (o instalador da pasta, Passo 0) ou com os dois cliques em "Instalar"; configurar é no estúdio web.
- Não instale nada fora do instalador do estúdio sem a pessoa entender e aprovar (nada de Homebrew, winget, pip ou instaladores do sistema).
- Não peça nem mostre chave. Não abra o `.env` para ler.
- Não use "Full access" no Codex nem sugira desligar proteções do sistema (Gatekeeper, SmartScreen, antivírus). Os avisos da primeira vez se resolvem como o Guia 01 ensina, só para os arquivos do estúdio.
- Não pule a conferência de fatos nos vídeos de verdade só porque o teste foi rápido.

## Aviso de versão nova
Se a saída do estúdio trouxer uma linha que começa com `Aviso do estúdio: a versão`, repita para a pessoa na sua primeira resposta, em uma frase, com o passo de atualizar que a própria linha traz, e siga o trabalho normalmente. Não pare e não atualize sozinho: a atualização é sempre com o arquivo da compra, a pedido dela. Versões antigas ainda têm falhas já corrigidas nas novas.

## Navegador: nunca
Você NUNCA abre, controla nem tira print do navegador da pessoa (nem o Chrome, nem o Safari, nem o Edge, nem o controle de navegador do aplicativo), para "mostrar o roteiro no estúdio" ou para qualquer outra coisa. O estúdio web se atualiza sozinho: ele vigia a pasta e começa o vídeo quando o roteiro chega. Já aconteceu de o assistente tentar controlar o Chrome, a janela da frente ser outro site e as tentativas só se repetirem. Para saber o estado, rode comando, nunca olhe a tela: `npm run status` (projetos e o próximo passo) ou `npm run comece -- --situacao --json` (que também diz a pasta exata do estúdio em uso, para conferir que é a mesma aberta no aplicativo). Se o estúdio parecer parado, confira se o `roteiro.md` está em `<pasta do estúdio>/projetos/<nome>/` e peça à pessoa o botão "Não está andando? Copiar diagnóstico do primeiro vídeo". Pediu "tenta de novo" e nada mudou: não repita; rode o comando de estado.




