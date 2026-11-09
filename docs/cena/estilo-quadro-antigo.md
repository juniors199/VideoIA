

# Cena: estilo quadro-antigo

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `quadro-antigo` | `forma`: bases `pintura`, `painel`, `folha`, `mapa`, `linha`, `medalhao`, `comparacao` (uma por beat) e sobras `texto`, `titulo`, `numero`, `carimbo`, `etiqueta`, `fonte`, `citacao`, `lista`, `marca`; texto com marcação (`*sublinha*`, `[circula]`, `~risca~`, `{TÍTULO}`, `\|` quebra); `zona` (`topo`, `meio`, `baixo`), `lado`, `layout` (`fitas`, `bloco`), `corpo`; no beat `passagem` (`desfoque`, `desliza`, `rasgo`, `corte`); na cena `tom` (`sepia`, `ouro`, `escuro`) e `textura` (`leve` padrão, `media`, `forte`, número 0 a 1,5 ou `false`) (guia em `docs/estilo-quadro-antigo.md`) |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `quadro-antigo` | Quadro Antigo: gravuras e pinturas de domínio público em sépia cobrindo o quadro (ou em página rasgada sobre a mesa, ou em moldura dourada), a fala datilografada letra a letra em tiras e cartões de papel rasgado, sublinhado, círculo e risco à mão, título grosso, numeral vermelho, carimbo de caixa dupla, etiqueta com seta, painel de couro, mapa, linha do tempo, medalhão e comparação; passagens por desfoque, deslize e rasgo do papel. Guia: `docs/estilo-quadro-antigo.md` | `pintura`, `painel`, `folha`, `mapa`, `linha`, `medalhao`, `comparacao`, `texto`, `titulo`, `numero`, `carimbo`, `etiqueta`, `fonte`, `citacao`, `lista`, `marca` |




