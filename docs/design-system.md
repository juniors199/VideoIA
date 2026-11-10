

# Design system do Estudio de videos

Fonte única: `marca/tokens.json`. Tudo (carrossel, vídeo, estúdio web, avatar) lê daqui. Para gerar os arquivos de marca: `npm run identidade` (saem em `marca/saida`).

## Identidade
- **Página única:** o @ de `marca/tokens.json` (na página de demonstração, @exemplo). Bio de exemplo: "Uma página exclusiva para pessoas inteligentes e curiosas 😌".
- **Símbolo:** um "i" branco com o pingo laranja. Chapado, minimalista, sem volume, sem anéis e sem sombra. Arquivos em `marca/logo`: `simbolo.svg` e `simbolo-para-fundo-claro.svg`.
- **Logotipo:** "ilustrando" em Bricolage Grotesque 800, com o pingo do "i" em laranja chapado (`marca/saida/logotipo.png`, fundo transparente).
- **Avatar da foto de perfil:** `marca/saida/avatar.png` (1080x1080, vale para Instagram, TikTok, YouTube e Facebook). O símbolo fica longe da borda para sobreviver ao corte em círculo (`avatar-previa-circulo.png` mostra o resultado). Também: `icone-app.png`, `destaque-instagram.png` (capa de destaque 1080x1920), `banner-youtube.png` (área segura 1546x423 no centro), `banner-facebook.png`.
- **Folha completa:** `marca/saida/design-system.png`.

Uso do símbolo: área livre de meia largura da haste em todos os lados; mínimo de 16 px. Nunca girar, esticar, trocar a cor do ponto, nem aplicar brilho, gradiente, sombra ou anéis.

## Cor
| Token | Valor | Uso |
|---|---|---|
| fundo / neutro 900 | `#0E0E13` | fundo de tudo (preto azulado, nunca `#000`) |
| neutros 800, 700, 600 | `#14141B`, `#17171F`, `#20202B` | superfícies e linhas |
| texto | `#FFFFFF` (suave 74%, fraco 45%) | contraste mínimo 4,5:1 (testado) |
| destaque | `#FF7A2F` | uma palavra, um número, um elemento por cena |
| apoio | `#FFC9A3` | versão clara do destaque |
| tinta | `#1A0D05` | texto sobre o destaque |

A regra de ouro: **a cor que aparece é a que importa.** Um destaque por cena e por slide.

## Tipografia
- **Display: Bricolage Grotesque** (variável 200 a 800, OFL). Títulos, capas, números, logotipo. Peso 800, espaçamento -0,035em, entrelinha 0,98.
- **Texto: Inter Tight** (OFL). Legenda, rótulos, corpo, interface. Espaçamento -0,01em, entrelinha 1,42.
- Escala (px, vídeo e carrossel): capa 116, título 80 a 96, número 250 a 270, legenda do vídeo 64, corpo 40, rótulo 26.
- Nunca diminuir a fonte para caber: encurtar o texto. Medida de leitura de 34 a 66 caracteres. Algarismos tabulares em números.

## Espaço e forma
Múltiplos de 4 (4, 8, 12, 16, 24, 32, 48, 64, 96). Margem do carrossel 104 px; margens do vídeo 72 px. Raios: painel 34, item 20, chip 999, avatar em círculo. Listas e rankings usam linhas com fio, não cartões.

## Movimento
Entrada com curva exponencial (`cubic-bezier(.16,1,.3,1)`), sem quicar. Durações: micro 160 ms, entrada 600 ms, transição 380 ms. Uma coisa se move por vez em cada cena. A câmera nunca salta. Veja `docs/principios-de-design.md`.

## Vídeo e carrossel
- **Topo do vídeo:** o handle da página (`marca/tokens.json`). **Rodapé do carrossel:** o handle; no último slide, mais a frase da página.
- **Capa do vídeo:** gancho em letras grandes dentro do recorte 3:4 do grid (`capa-grid.jpg`).
- Zonas seguras do vídeo em `src/video/engine/zona.js` (o QA mede em pixels).
- **Carrossel viral** (`docs/carrossel-templates.md`): 29 tipos de slide (post, fio, jornal, plantão, conversa, nota, gráfico, quiz, revista, colagem e outros) que leem a marca daqui. Três visuais (`escuro`, `claro`, `papel`); em fundo claro o destaque usado como texto escurece até 3:1. Fontes extras dos tipos virais: Instrument Serif (jornal, revista, citação, versículo), JetBrains Mono (código) e Euphoria Script (nota à mão da colagem). Letra mínima de 26 px na área do conteúdo; nada a menos de 56 px das laterais.




