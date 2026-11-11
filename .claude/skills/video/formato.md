# Formato e conversão

## Formato: vertical ou horizontal
Todo vídeo é **vertical** (1080 x 1920, Reels, TikTok, Shorts) por padrão. Se a pessoa pedir "na horizontal", "para o YouTube", "em 16:9" ou "paisagem", produza **horizontal** (1920 x 1080, 30 qps): `--formato=horizontal` (ou `--horizontal`), ou `Orientação: horizontal.` na linha STATUS do roteiro, ou `formatoPadrao` no config. Leia `docs/formato-horizontal.md`. No horizontal:
- **não tem @** por padrão (opcional: `--handle`, `@: sim.` no STATUS ou a caixa "Mostrar @" no estúdio web; no vertical o @ sempre aparece);
- a **legenda** vem ligada e é opcional (`--sem-legenda`, `Legenda: não.` ou a caixa "Legenda"); vale nos dois formatos;
- as margens são as do YouTube: texto, título, número, rótulo e legenda na área útil (x 217 a 1702, y 190 a 885); fundo e cenário vão até a sangria e cobrem o quadro inteiro;
- a entrega traz `saida/capa.jpg` (1920 x 1080) e `saida/miniatura.jpg` (1280 x 720), sem `capa-grid.jpg`.
- Nem todo estilo já foi migrado para o horizontal (`node scripts/horizontal-plano.mjs`): os migrados são os de `ESTILOS_HORIZONTAL` em `src/video/engine/geo.js` (hoje padrao, editorial, minimalista, papel, letreiro e smooth). Em outro estilo, avise a pessoa e use um dos migrados; nunca prometa o que o motor não cumpre.
**Converter** um vídeo já feito: "converte esse vídeo para vertical/horizontal" = `node src/video/cli.mjs <projeto> --converter=horizontal` (ou `vertical`; `--para=<nome>`, `--produzir`). Cria o projeto irmão sem tocar no original, reaproveita narração e trilha (nenhum crédito de voz ou música) e refaz o layout para o formato novo; leia a lista de mudanças e de avisos que ele imprime e conte à pessoa (o @ desliga ao ir para o horizontal e liga ao voltar). Se só existe o MP4 e não o projeto, explique que a conversão é pelo roteiro e ofereça refazer a partir dele.
