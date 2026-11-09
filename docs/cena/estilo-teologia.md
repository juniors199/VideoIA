

# Cena: estilo teologia

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `teologia` | `forma` (`frase`, `abertura`, `arte`, `arte-dupla`, `arte-cheia`, `medalhao`, `medalhoes`, `fichas`, `lista`, `citacao`, `inscricao`, `comparacao`, `numero`, `carimbo`, `fecho`, `linha-do-tempo`, `causa`, `mapa`, `circulos`, `balanca`, `relogio`, `caminho`, `simbolo`, `dossie`, `recortes`, `anotacoes`) e os campos de cada uma, mais `kicker`, `titulo`, `linhas`, `credito`, `arquivo`, `tratamento`, `manto`; no beat `tom` (`noite`, `creme`, `pergaminho`, `bordo`, `marrom`, `carvao`, `floresta`, `dossie`) e `virar` (`corte`, `folha`, `fusao`, `iris`, `luz`, `zoom`, `rasgo`), `acabamento` (overlay de textura: `leve`, `pergaminho`, `vitral`, `filme`, `antigo` ou `false`; também na cena) e `movimento` (`recuo`, `avanco`, `deriva`, `respira`, `parado`; também na cena); por obra `moldura` (`ouro`, `passe`, `arco`, `gotico`, `nenhuma`) e `sinal`; até 3 elementos por beat (guia em `docs/estilo-teologia.md`) |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `teologia` | Teologia: arte sacra de domínio público em papel rasgado e auréola de ouro, lettering serifado com a frase-chave em ouro, azul ou vinho, fichas com carimbo, mapa antigo, linha do tempo, balança, citação e símbolos de ouro, vidro e cera; 8 tons (noite, creme, pergaminho, bordô, marrom, carvão, floresta, dossiê) e 7 viradas (folha, fusão, íris, luz, zoom, rasgo), molduras, auréolas, overlay de textura e câmera da obra, com fontes livres (Lora, Cinzel, EB Garamond e Frank Ruhl Libre). Guia: `docs/estilo-teologia.md` | `frase`, `abertura`, `arte`, `arte-dupla`, `arte-cheia`, `medalhao`, `medalhoes`, `fichas`, `lista`, `citacao`, `inscricao`, `comparacao`, `numero`, `carimbo`, `fecho`, `linha-do-tempo`, `causa`, `mapa`, `circulos`, `balanca`, `relogio`, `caminho`, `simbolo`, `dossie`, `recortes`, `anotacoes` |

## Estilo teologia (arte sacra, papel e ouro)
Leia `docs/estilo-teologia.md` (seção "0.6.19"). Regras que o estilo já cumpre sozinho e que a cena não deve contrariar:
- **Arte variada:** a forma `arte` tem `apresentacao` `moldura` (recorte, com `moldura` rasgado, passe, ouro ou arco), `tela` (a obra cobre o quadro, com vinheta e scrim) e `dividida` (a obra sangra pelo topo e termina em borda rasgada). Alterne; nunca a mesma moldura dourada em todos os beats. Sem `apresentacao`, o estilo gira por conta própria. A obra de baixa resolução cai sozinha para a moldura; medalhão nunca amplia mais de 1,8x.
- **Um bloco de texto por ideia:** `kicker`, `titulo` e `linhas` de uma forma com arte viram uma pilha só, embaixo da arte, com o kicker colado em cima da primeira linha. Nada de frase minúscula no topo longe do resto. O kicker entra na palavra dele (ou junto com o texto que rotula); a linha entra na primeira palavra dela, sem `em` (use `em` só quando a palavra se repete).
- **Tons sem pulo:** alterne tons da mesma família de luminância (noite, bordô, marrom, carvão) e faça uma corrida de tons claros só para a explicação; no máximo 30% das trocas escuro e claro.
- **Fecho:** forma `fecho` (celular 3D com a ação de seguir e comentar), com `linhas` curtas ("segue a página e comenta *ILUSTRANDO*"). Sem carimbo extra e sem o sol (`visual: "sol"` só se pedirem).
- **Crédito** fora dos 340 px do rodapé e legível; **contraste** de texto >= 4,5:1 (as paletas do estilo já cumprem).
- Voz: 3 a 5 respiros de 0,4 a 0,6 s por vídeo (`node scripts/respiros.mjs <projeto> --trilha`, ou `--em=` com as palavras finais que fecham uma ideia).




