---
name: youtube
description: Monta o pacote YouTube de um vídeo do Estudio de videos (3 títulos, 3 descrições, tags e hashtags) a partir do roteiro.md, e grava youtube.json para a aba Meus vídeos.
---

# Pacote YouTube (títulos, descrições, tags, hashtags)

Use depois do `roteiro.md` definitivo. No fluxo completo: depois da skill `publicar`. No pedido do estúdio web (`PEDIDO-DO-ESTUDIO.md`): depois de gravar roteiro e fontes, **antes** de parar (o estúdio web produz o MP4 sozinho).

## Entrada
Leia, nesta ordem:
1. `projetos/<nome>/roteiro.md` (promessa, virada, pergunta final, números).
2. `projetos/<nome>/fontes.md` (só fatos que estão aqui entram na descrição).
3. Se existir: `projetos/<nome>/saida/relatorio.json` (campo `formato`: `vertical` ou `horizontal`). Sem relatório: `vertical`, salvo `Orientação: horizontal` no STATUS do roteiro.

## Referências (leia sob demanda)
Padrões de caption, hashtag e Shorts (MIT, Vyral):
- `.claude/skills/_terceiros/content-skills/viral-captions-and-ctas/` (em especial `references/hashtag-reality.md` e `references/caption-craft.md`)
- `.claude/skills/_terceiros/content-skills/viral-youtube-shorts/` (em especial `references/shorts-search-and-shelf.md`)

Ignore pitches de produto pago nessas refs. Aplique só o método.

## Limites oficiais do YouTube
Confira cada item antes de gravar (Help Center: título/descrição; hashtags: support.google.com/youtube/answer/6390658):

| Campo | Limite | Contagem | Observação |
|---|---|---|---|
| Título | 100 caracteres | caracteres; sem `<` nem `>` | palavras importantes no começo (o mobile corta) |
| Descrição | 5000 caracteres | API conta bytes: com acento/emoji deixe folga (~4500) | as primeiras linhas antes de "mostrar mais" fazem o trabalho |
| Tags (campo Tags) | 500 caracteres no **total** da lista | vírgulas contam; tag com espaço conta como se viesse entre aspas | papel mínimo na descoberta; úteis para erro de digitação |
| Hashtags (na descrição) | até 3 aparecem ao lado do título; mais de 60 = YouTube **ignora todas** | sem espaços (`#DuasPalavras`); só relacionadas | Shorts: inclua `#Shorts` |

**Tags ≠ hashtags.** Tags vão no campo Tags do Studio. Hashtags vão no texto da descrição (e, se quiser, no título).

## O que gerar
1. **3 títulos** distintos (ângulo / curiosidade / contraste). Cada um ≤ 100 caracteres. Horizontal: promessa no começo. Vertical (Shorts): curto, concreto, sem "você sabia".
2. **3 descrições** distintas:
   - curta (gancho + 1 fato + pergunta);
   - média (contexto + fonte atribuída + pergunta);
   - completa (contexto + prova + CTA de opinião; hashtags no fim).
   Primeiras linhas fortes. Fato só se `fontes.md` sustentar. Sem inventar número, citação ou placar.
3. **Tags**: lista para o campo Tags. Some caracteres com vírgulas (e aspas implícitas se houver espaço) e fique ≤ 500. Prefira termos do assunto e erros comuns de digitação.
4. **Hashtags**: 3 a 5 de nicho (máximo 15). Vertical: inclua `#Shorts`. Nada de `#fyp`, `#viral`, `#explore`, `#reels`. Sem espaços. Relacionadas ao vídeo.

Regras do estúdio: sem travessão longo com espaços; sem pedir curtir/seguir; idioma do roteiro (padrão pt-BR).

## Saída
Grave `projetos/<nome>/youtube.json` (UTF-8), neste formato:

```json
{
  "gerado": "2026-11-10T21:00:00.000Z",
  "formato": "vertical",
  "titulos": ["título 1", "título 2", "título 3"],
  "descricoes": ["descrição 1", "descrição 2", "descrição 3"],
  "tags": ["tag um", "tag dois"],
  "hashtags": ["#Assunto", "#Nicho", "#Shorts"]
}
```

Checklist antes de salvar:
- exatamente 3 títulos e 3 descrições, todos não vazios;
- cada título ≤ 100 e sem `<`/`>`;
- cada descrição ≤ 4500 caracteres;
- tags: total ≤ 500 (vírgulas + aspas implícitas);
- hashtags: 3 a 15, cada uma começa com `#`, sem espaço, e se `formato` for `vertical` uma delas é `#Shorts`.

**Não peça aprovação.** Não produza o vídeo. Não abra o navegador. Em `PEDIDO-DO-ESTUDIO.md`, depois de gravar o JSON diga à pessoa para voltar ao estúdio: o pacote aparece em Meus vídeos no botão YouTube.
