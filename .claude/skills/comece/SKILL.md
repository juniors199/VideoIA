---
name: comece
description: Primeira vez no estúdio, para quem nunca usou nada parecido. Confere a instalação e, se faltar algo (inclusive o Node, quando a pessoa abriu a pasta direto no assistente sem os dois cliques em Instalar), roda você mesmo o instalador da pasta, sem pedir para a pessoa digitar comando; leva a pessoa ao estúdio web (voz, marca, estilo e objetivo, sem chave no chat), faz um vídeo de teste e diz o próximo passo. Use quando a pessoa escrever "comece", "comece pelos primeiros passos", "primeiros passos", "primeira vez", "acabei de baixar", "por onde começo", "instala pra mim", "não sei usar", ou quando a marca do estúdio ainda for a neutra "Sua Página". MODO ASSISTENTE (sem o estúdio web aberto, ou se a pessoa preferir a conversa): voz pelo arquivo .env, marca e vídeo de teste. Também quando o estúdio devolver um erro com código (o do botão "Copiar diagnóstico"): só corrige pela lista segura. Este estúdio é open-source: não há licença de ativação nem marca d'água.
---



# Comece: a primeira execução

Quem está do outro lado descompactou a pasta do Estudio de videos (open-source) e abriu a pasta no assistente (app do Claude, aba Code, ou Codex). Pode ter dado dois cliques em **Instalar (Mac)** ou **Instalar (Windows)** antes, ou não: abrir a pasta direto aqui também é um jeito certo de começar, e aí quem instala tudo, inclusive o Node, é você (Passo 0). Pode nunca ter usado um Terminal e **não vai digitar comando nenhum**: quem roda os comandos é você. O seu trabalho é levar essa pessoa até um vídeo de teste pronto e a marca dela aplicada, em uns 15 minutos.

## Como falar durante toda a skill
- **Um passo por vez.** Diga em uma frase o que vai fazer, faça, e diga em uma frase o que aconteceu. Nada de parede de texto.
- **Sem jargão.** Se precisar de uma palavra técnica, explique na mesma frase: "o FFmpeg, o programa grátis que junta imagem e som".
- **Nunca peça para a pessoa digitar um comando** no Terminal, no PowerShell ou na conversa. Instalar é com você (Passo 0); o que fica com ela é sempre um clique: aprovar o comando que você pediu, o botão de um site, uma tela do estúdio web.
- **Avise antes de cada pedido de aprovação.** Ex.: "Vou conferir a instalação. Vai aparecer um pedido de aprovação: pode aprovar."
- **Mostre progresso** no formato `Passo 2 de 6: ...`.
- **Chave nunca na conversa.** Você não pede, não lê, não mostra e não copia o conteúdo do `.env`. A chave entra pelo estúdio web (Começar > Voz), que grava no `.env` sem mostrar de novo. Se a pessoa colar uma chave no chat, diga com calma: "Não cole a chave aqui: ela fica salva na conversa. Entre no site da voz, apague essa chave, crie outra e cole só no estúdio, em Começar > Voz." Não repita a chave na resposta.
- **Sem travessão longo com espaços** em nenhum texto.

## Dois caminhos: estúdio web ou modo assistente
Logo no começo, rode `npm run comece -- --situacao --json` (com `ferramentas/rodar` na frente se `node` não existir; se não existir de jeito nenhum, faça o Passo 0 primeiro). O campo `modo` diz onde você está:
- `assistente` (você roda dentro do Claude Code ou do Codex e o estúdio web não está aberto), ou a pessoa pediu para fazer tudo pela conversa: **leia `modo-assistente.md`, nesta pasta da skill, e siga-o do início ao fim.** A voz acontece aqui, sem o estúdio web: a chave da voz nunca vai no chat (só no arquivo `.env`, aberto por `npm run voz -- --preparar`). Não existe mais ativação de licença.
- `estudio-web-ou-terminal` (ele já está aberto ou você não é o assistente): siga os passos abaixo, que levam a pessoa ao estúdio web.
Em dúvida, pergunte uma vez: "Você prefere configurar clicando no estúdio, no navegador, ou aqui comigo, pela conversa?"

## Passo 0. Node e instalação: você mesmo resolve
O estúdio precisa do Node 20 ou mais, do FFmpeg, do navegador interno e das peças. Quem deu dois cliques em Instalar já tem tudo dentro da pasta (`.programas/`). Quem abriu a pasta direto aqui pode não ter nada, nem o Node: tudo bem, o instalador da pasta resolve, e quem roda é você.

**Qual instalador (o mesmo dos dois cliques, sem janela e sem abrir o navegador no fim):**
- Mac e Linux: `bash ferramentas/instalador/instalar.sh --assistente`
- Windows (Git Bash do Claude Code, PowerShell ou Prompt do Codex): `powershell.exe -NoProfile -ExecutionPolicy Bypass -File ferramentas/instalador/instalar.ps1 -Assistente` (o `ExecutionPolicy Bypass` vale só para esse processo; não mude nada do sistema)
- Como saber que é Windows: `uname -s` responde `MINGW`, `MSYS` ou `CYGWIN`, ou o seu terminal é o PowerShell.

Ele baixa o Node portátil (só se o computador não tiver o Node 20 ou mais), o FFmpeg, as peças, o navegador interno e o alinhador de voz, confere a impressão digital (SHA-256) de cada arquivo e não instala nada fora da pasta nem pede senha. Baixa uns 500 MB na primeira vez (é rapidinho; em internet lenta, um passo pode passar de 10 minutos). Rode com o maior tempo limite que o seu terminal permitir (no Claude Code, em segundo plano); se o comando for interrompido pelo tempo ou pela internet, rode de novo: ele continua do que falta. No fim aparece "Pronto! Tudo instalado"; se parar, ele imprime "O que houve" e "O que fazer": siga e rode de novo (no máximo 3 vezes).

**A ordem:**
1. Rode `node -v`. Se responder `v20` ou mais, use os comandos normalmente (`node ...`, `npm run ...`) e siga para o Passo 1.
2. Se não existir (ou for menor que 20), rode `ferramentas/rodar node -v` (Mac, Linux e Git Bash) ou `ferramentas\rodar.cmd node -v` (PowerShell). Ele acha o Node portátil da pasta e o Node do computador fora do caminho do terminal (`/opt/homebrew/bin`, `/usr/local/bin`). Se responder `v20` ou mais, ponha `ferramentas/rodar` (ou `ferramentas\rodar.cmd`) na frente de todo comando `node`, `npm` ou `npx` desta e das outras skills, e siga para o Passo 1.
3. Se nem isso funcionar, não há Node: avise ("Vou instalar o estúdio aqui na pasta, inclusive o Node, o motor que roda tudo. É rapidinho. Vai aparecer um pedido de aprovação: pode aprovar.") e rode o instalador da sua plataforma (acima). Depois use `ferramentas/rodar` (ou `ferramentas\rodar.cmd`) na frente dos comandos, como no item 2.

Se a pessoa preferir, ela pode dar dois cliques em **Instalar (Mac)** ou **Instalar (Windows)**: é o mesmo instalador, numa janela, e no fim abre o estúdio. Avisos do sistema nesse caso: Guia 01, Seções 05 e 06.

Sobre o assistente:
- **Codex:** se um comando falhar com "read-only", "permission denied" ou "sandbox", a pasta ainda não foi marcada como confiável. Explique: "O Codex abriu a pasta só para leitura. No app, confirme que confia na pasta quando ele perguntar e escolha o modo **Ask for approval**. Depois feche e abra o Codex na mesma pasta." Nunca sugira **Full access**. Os comandos do estúdio (`node src/...`, `npm run ...`, `npm test`, `npm ci`, o instalador da pasta e os mesmos com `ferramentas/rodar` na frente) já estão liberados pelas regras do estúdio quando a pasta é confiável. Se o download do instalador falhar por rede, peça para a pessoa aprovar o comando quando o Codex perguntar.
- **Claude Code:** o Claude pede permissão para rodar comandos. Diga à pessoa que pode aprovar os comandos do estúdio.

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

## Passo 4 de 6. O vídeo de teste
1. O caminho preferido é o estúdio web: peça para ela clicar em **Começar > Vídeo de teste > Fazer o vídeo de teste**. É o mesmo tema da demonstração ("Sua hora vai valer 10% a mais"), feito no computador dela com a voz salva. Leva de 1 a 3 minutos num computador comum (mais em computador lento); o estúdio mostra o tempo estimado e o vídeo tocando no fim.
2. Se ela preferir pela conversa, diga "Vou fazer um vídeo de exemplo, sem voz, só para provar que tudo funciona." e rode `npm run prova`.
3. Se passar, o vídeo aparece em **Meus vídeos** no estúdio web. Se foi o `npm run prova`, explique: "É um vídeo sem voz de propósito. Com a voz configurada, os próximos saem narrados."
4. Se falhar, siga a seção "Quando o estúdio devolver um erro" (mais abaixo): só a lista segura, no máximo 2 tentativas.
5. Se a voz já estiver configurada e a pessoa quiser ouvir, ofereça (não rode sem perguntar, porque gasta crédito): `npm run video -- exemplo --voz=<voz>`.
6. Para o primeiro vídeo de verdade, o caminho mais curto é o botão **Fazer meu primeiro vídeo**, no topo da aba Começar do estúdio web: ela digita o tema ou escolhe um do banco de temas prontos, e o estúdio confere tudo, instala o que faltar e mostra o vídeo tocando. Com o tema dela, o estúdio copia um pedido para colar aqui (veja abaixo). Se ela quiser uma vitória ainda mais rápida, a opção **Prefere começar por um carrossel?** faz um carrossel em segundos, sem voz.
7. Se algo falhar no estúdio web, a tela mostra a causa, o que fazer e os botões **Copiar diagnóstico** e **Abrir o direct** (direct do Instagram @kaueajure, https://ig.me/m/kaueajure). O estúdio também manda sozinho um aviso anônimo (só o código da falha, a versão e o sistema; desliga em Configurações, na aba Começar).

### Quando a pessoa colar o pedido do botão "Fazer meu primeiro vídeo"
O pedido começa com "Quero o meu primeiro vídeo sobre..." e diz a pasta (`projetos/<nome>/`, com o arquivo `PEDIDO-DO-ESTUDIO.md`). Faça só a parte do texto: skill `pauta` (ângulo e fatos conferidos) e skill `roteiro`, gravando `projetos/<nome>/roteiro.md` e `projetos/<nome>/fontes.md`. **Não rode o vídeo** (nem `npm run video`, nem a skill `video`): o estúdio web está esperando o roteiro, começa sozinho uns 15 segundos depois de você gravar e mostra o progresso e o vídeo na tela dela. Termine dizendo: "O roteiro está pronto. Volte ao estúdio no navegador: o vídeo já começou." Se o estúdio depois mostrar "O roteiro não passou no corretor automático", reescreva o roteiro na mesma pasta e peça para ela clicar em **Tentar de novo**.

## Quando a foto não vem
O estúdio busca sozinho a foto de quem ou do que a fala cita pelo nome. Se o relatório trouxer o aviso `foto-nao-encontrada`, explique com as palavras do aviso (sem internet, antivírus ou rede da empresa bloqueando, ou nenhuma foto de licença livre) e ofereça: tentar de novo com internet, ou a pessoa pôr uma foto dela (ou com autorização) em `projetos/<nome>/assets/` e você usar no beat (`"arquivo": "assets/<arquivo>"`). Nunca use foto sem licença.

## Quando o estúdio devolver um erro
Vale em qualquer momento, não só na primeira vez. O estúdio mostra a causa, "O que fazer", um código curto da falha (`ffmpeg-falhou`, `ffmpeg-quadros`, `voz-eleven-cota`, `navegador-nao-abre`...) e o botão **Copiar diagnóstico**. Ele já se corrige sozinho nas falhas de ambiente (FFmpeg, navegador, alinhador de voz, pasta curta, arquivo travado, porta, pouco 3D) e avisa numa linha "ajustei ... e continuei": isso não é erro e você não refaz.

**1. Leia antes de mexer.** A mensagem do estúdio (ou o texto que a pessoa colou), `npm run doctor`, `npm run verificar` e `projetos/<nome>/saida/relatorio.json`.

**2. Lista segura: só estas correções.**
1. Repetir o passo. O estúdio reaproveita narração, trilha e quadros já feitos, sem gastar crédito.
2. Reinstalar um componente do kit com o comando oficial: `bash ferramentas/instalador/instalar.sh --assistente` (Mac e Linux) ou o do Windows no Passo 0. Ele também troca um FFmpeg problemático pelo do kit.
3. Trocar uma configuração do estúdio pelo estúdio web ou pelos comandos oficiais. Ex.: `"encoder": "x264"` no `ilustrando.config.json`; a voz em Começar > Voz.
4. Erro de caminho: usar uma pasta curta. Mover a pasta do estúdio para a pasta pessoal, com nome curto, fora de Downloads e do OneDrive.
5. Rodar `npm run verificar` e `npm run doctor`.
6. Voz da ElevenLabs bloqueada (`voz-eleven-bloqueio`, "unusual activity"): não é chave errada nem defeito do estúdio. Confira com `npm run voz -- --conferir` (ou o botão Testar minha chave, em Começar > Voz), explique a trava em uma frase e siga o vídeo com `--voz=mock` se a pessoa quiser ver o resultado já; a narração entra depois, quando a conta liberar.

**3. Nunca:**
- editar `src/`, `ferramentas/` ou qualquer código do kit sem necessidade (prefira os comandos oficiais);
- baixar outro FFmpeg ou Node por conta própria, nem mexer no PATH do sistema;
- gastar crédito pago (ElevenLabs, Fish Audio) sem perguntar antes: nada de `--refazer-voz` nem de apagar `narracao.mp3` ou `palavras.json` para "tentar de novo";
- pedir chave no chat.

**4. Duas tentativas, no máximo.** Se não resolver, pare e diga, em uma frase, o que tentou. Peça à pessoa para clicar em **Copiar diagnóstico** e depois em **Abrir o direct** (direct do Instagram @kaueajure, https://ig.me/m/kaueajure) e colar lá. Não invente texto de suporte com hipótese técnica: repita o que o estúdio disse.

O aviso do doctor "nenhum assistente encontrado no Terminal" não é erro: só quer dizer que o comando `claude` ou `codex` não está no Terminal. Quem usa o app do Claude ou do Codex não precisa fazer nada.

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
- vídeo de teste: em Meus vídeos, no estúdio web

Agora escreva, do seu jeito:
"Quero um vídeo sobre <tema>."   ou   "Quero um carrossel sobre <tema>."
```

Se faltar algo (voz ou marca), o convite é para resolver isso primeiro, no estúdio web, numa frase.

## Como pedir mudanças
Diga à pessoa, no fim, que ela pode pedir mudanças em português comum, sem editar arquivo. Exemplos e o que você faz:

| Ela diz | Você faz |
|---|---|
| "deixa o título maior" | aumenta o título; se não couber, encurta o texto (nunca diminui a fonte) e refaz o vídeo |
| "troca a cor do fundo para azul" | muda o fundo daquele vídeo; se for a cor da página inteira, confirma antes (decisão de marca) |
| "tira a música" | refaz com `--sem-musica` |
| "muda o final para chamar para comentar" | troca o CTA final por pedido de comentário; pergunta se é só neste vídeo ou em todos |
| "deixa a voz mais devagar" | refaz a narração mais calma (`--refazer-voz`); a legenda acompanha |
| "troca o objeto do começo" | troca a peça do gancho por uma ligada à primeira frase |
| "faz na horizontal", "para o YouTube" | refaz no formato horizontal (`--formato=horizontal`), sem @ (pergunta se quer o @) e com legenda; diz que a capa é a `miniatura.jpg` |
| "converte esse vídeo para vertical/horizontal" | `--converter=horizontal` (ou `vertical`): cria o projeto irmão com a mesma narração e trilha, sem gastar crédito; conta o que mudou |
| "tira a legenda" / "põe o @" | `--sem-legenda` / `--handle` (o @ só existe no horizontal como opção; no vertical sempre aparece) |
| "faz uma versão de 30 segundos" | encurta o roteiro mantendo o fato principal, num projeto novo, sem apagar o original |

Cada ajuste refaz o vídeo; mexer só no visual reaproveita a narração. Pergunte antes só se o pedido mudar a marca ou tirar um fato conferido.

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




