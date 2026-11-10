---
name: publicar
description: Escreve a legenda, os marcadores e a descrição por plataforma para um vídeo ou carrossel do Estudio de videos já gerado.
---



# Legenda e publicação

**Antes de tudo:** rode `npm run status` (ou leia `projetos/<nome>/saida/entrega.json`). Só publique quando `publicavel` for `true`: voz real, QA aprovado e nenhuma linha `PENDENTE` em `fontes.md`. Se houver pendência, feche-a (confirme a fonte ou reduza a afirmação no roteiro) e renderize de novo.

**Objetivo do vídeo** (`objetivo` em `entrega.json`; em vídeo antigo, `modelo`; detalhes em `npm run objetivos -- --ver <id>`, ou `npm run estilos -- --ver <id>` quando só houver estilo): siga `publicar.legenda` (o jeito da legenda), use `publicar.hashtags` como base, ponha as fontes na legenda quando `fontesNaLegenda` for true e inclua o `cuidados.avisoLegenda` (ou `publicar.aviso`) quando houver. Com `cuidados.revisaoHumana`, o `entrega.json` sai com `publicavel: false` até a pessoa revisar: diga isso e não publique.

## Antes de escrever: palavra-chave (SEO da busca do Instagram)
A busca do Instagram cruza o que a pessoa digita com legenda, nome, bio, hashtags, texto na tela e áudio falado. Guia completo em `docs/seo-legendas.md`. Para cada post, defina e anote no topo do `post.md`:
- **1 palavra-chave principal**: como uma pessoa curiosa pesquisaria o assunto, de preferência uma frase de cauda longa ("por que a tampa de bueiro é redonda", "o que muda se o Lula perder"). Prefira o termo que já aparece no roteiro falado e no título da capa.
- **3 a 4 secundárias**: sinônimos e termos próximos (nomes próprios, instituição, número central do vídeo).

## Legenda (Instagram e Facebook), estrutura de 4 partes
- **1. Gancho com a palavra-chave principal**, nos primeiros 125 caracteres (a única parte visível antes do "mais"). Repete a promessa com outras palavras, nunca o texto da capa. Escreva essa linha por último.
- **2. Contexto, 1 a 3 frases curtas** com as secundárias espalhadas de forma natural: o que não coube no vídeo (a fonte, o número que sobrou, a nuance).
- **3. Valor ou prova**: o dado ou a fonte, atribuído.
- **4. Fecho**: pergunta de opinião (nunca sim ou não), a mesma do último slide ou da cena final, seguida dos marcadores.
- A principal aparece **1 ou 2 vezes**, nunca mais (repetir é keyword stuffing e derruba alcance). Linguagem natural; parágrafos curtos, uma ideia por parágrafo.
- Palavra-chave e marcadores **sempre na legenda**, nunca só no primeiro comentário. Esqueceu algo: edite a legenda.
- Sem pedir curtir ou seguir. Sem "link na bio" se não houver link. Sem emoji no lugar de palavra nem no meio da frase. Sem travessão longo com espaços.
- **Texto alternativo** (Configurações avançadas > Escrever texto alternativo): uma frase simples descrevendo a capa, com a principal só se for honesto. Entregue no `post.md`.
- **Conferência cruzada**: a principal precisa estar também dita no áudio e escrita na tela (título ou capa). Se não estiver, avise para o próximo roteiro.

## Chamada para ação
Responda **o quê** e **por que agora** e use um destes, nesta ordem de preferência: comentário com opinião, compartilhar com alguém específico, salvar (se for conteúdo de consulta). Veja `docs/ganchos.md`.

## Marcadores
3 a 5 (o limite do Instagram é 5), no fim da legenda, específicos do assunto: um do tema, um do nicho (curiosidades) e, quando fizer sentido, um da página. Nada de genéricos como #reels, #explore ou #viral.

## Por plataforma
- **Instagram Reels / Facebook Reels**: legenda completa + marcadores no fim.
- **TikTok**: legenda curta (até ~100 caracteres úteis) + 3 marcadores. Pode usar o carrossel no modo foto.
- **YouTube Shorts**: título de até 60 caracteres que complete "todo mundo acha X, mas é Y" + descrição de 1 a 2 linhas + `#Shorts`.

## Vídeo horizontal (YouTube)
Vídeo feito com `--formato=horizontal` (veja `saida/relatorio.json`, campo `formato`): é para o **YouTube** (não é Reels nem Shorts). Título de até 70 caracteres com a promessa no começo, descrição com 2 a 3 linhas e capítulos se passar de 2 min, 3 a 5 marcadores. A imagem do post é `saida/miniatura.jpg` (1280 x 720, até 2 MB), não `capa.jpg`. Não há `capa-grid.jpg`. Não escreva "@" nem peça de seguir "no topo" da tela: o horizontal sai sem @ por padrão.

## Entregue
Salve em `projetos/<nome>/post.md` (ou `carrosseis/<nome>/legenda.txt`): palavra-chave principal e secundárias, legenda, marcadores, texto alternativo, título do Shorts e o caminho do arquivo. Antes de salvar, passe o checklist da seção 7 de `docs/seo-legendas.md`. Confira que a legenda não afirma nada que `fontes.md` não sustente.

O pacote YouTube (3 títulos, 3 descrições, tags do Studio e hashtags) é da skill `youtube` (`projetos/<nome>/youtube.json`), não deste arquivo. Depois de gravar o `post.md`, rode a skill `youtube`.

## Crédito de fotos
Se o vídeo ou carrossel usa elemento `imagem` com foto de terceiro, a legenda termina com uma linha "Fotos: <autor/agência> (<licença>)", tirada de `fontes.md`. Se usa elemento `video` (b-roll), acrescente "Vídeos: <crédito>" com o texto de "Crédito para a legenda do post" da seção Vídeos de `fontes.md` (Pexels e Pixabay pedem o nome do autor e da plataforma; NASA, "NASA"). O crédito não aparece na tela.




