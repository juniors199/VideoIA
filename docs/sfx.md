

# Efeitos sonoros: o banco de sons gravados (0.6.24)

O som de cada vídeo sai sozinho da cena (`docs/cena/som-e-trilha.md`). Desde a 0.6.24, por cima dos eventos que o motor e os estilos já emitiam, entra o **banco de sons gravados** do estúdio, `sons/`: 278 amostras em MP3 (12,3 MB) curadas pelo estúdio (228 do acervo próprio e 50 do pack de sons do Fluido), as mesmas para o estúdio e para quem comprou. Não há chave de configuração: o banco vale em todo vídeo.

## Como funciona
- **Um evento, uma amostra.** Cada som do motor tem um papel (`src/video/sfx-amostras.mjs`, `PAPEIS`): as categorias do banco que servem, as tags preferidas e como a amostra entra.
  - **Troca** (só a amostra) onde o sintetizado soa pior: clique, tique, pop, entrada, saída, acerto, erro, glitch e objetos (moeda, papel, teclado, câmera...).
  - **Camada** (amostra mais o sintetizado 7 dB abaixo) onde a soma soa melhor: whoosh, riser e impacto.
  - Ficam só sintetizados: o grave do número (`thump`), o riser curto do contador e os sons sem amostra (apito, sirene, gongo...).
- **Paleta do estilo.** A escolha prefere as amostras com o estilo em `estilos_sugeridos` e, nos estilos calmos (teologia, antiguidade, mindset, linhas, fino, quadro-antigo, preto-branco), as de energia suave.
- **Determinística.** A semente vem do nome do projeto, do som e do instante: mesma cena, mesmo arquivo. A mesma amostra não sai duas vezes seguidas na mesma categoria (quando há outra que sirva). Variação leve e fixa por evento: tom até ±3% e ganho até ±1,5 dB.
- **Mesmo nível, mesma disciplina.** A amostra entra com o loudness momentâneo do som sintetizado que ela substitui, e o pico do barramento é o da mixagem sintetizada (um limitador rápido segura os ataques gravados). Nada muda em `sfx-mix.mjs` nem em `mixagem.mjs`: no máximo 1 efeito a cada 1,5 s e 4 a cada 10 s no modo espaçado, mais 8 dB abaixo sob a fala, prateleira acima de 6 kHz, efeitos 10 LU ou mais abaixo da voz, trilha 8 LU abaixo dela.
- **Reserva.** Sem a pasta `sons/`, com índice quebrado, arquivo que falta ou que não decodifica, toca o som sintetizado de sempre, sem erro.

## Categorias do banco
`entrada`, `saida`, `tick`, `clique`, `pop`, `whoosh`, `riser`, `impacto`, `glitch`, `objeto`, `acerto`, `erro` e `ambiente` (loops de 20 a 22 s). O índice `sons/indice.json` traz, por amostra, categoria, duração, loudness, tags em português, energia, estilos sugeridos e se é loop. Licenças em `sons/licencas.json` e em `AVISOS-TERCEIROS.md`.

## Como pedir um som
- No beat ou no elemento, `"som": "<nome>"` continua aceitando os nomes do motor (`npm run sfx-previa`).
- `"som": "trovão"` (uma palavra que não é nome de som) usa a amostra com essa tag no banco embutido; sem amostra, o sintetizado parecido (trovão, vento, sino, relógio, carro, aplauso...).
- `"som": "busca:<palavra>"` pede o som pelo nome ao banco aberto (abaixo), com o embutido e o sintetizado de reserva.

## Cama de ambiente
- `"ambiente": "<tag>"` no beat põe uma cama sonora do banco (chuva, vento, oceano, praia, cidade, floresta, deserto, aeroporto...). Beats seguidos com a mesma cama viram um trecho só, em loop sem emenda, com entrada e saída suaves.
- Automática só quando o cenário do beat é claramente aquele lugar: `agua` (oceano), `praia`, `campo` (natureza), `deserto`, `rua-noite-chuva` (chuva), `aeroporto`, `espaco` (ficção científica) e `data-center` (dados).
- `"ambiente": "nenhum"` no beat, ou `"efeitos": { "ambiente": false }` na cena, desliga a automática.
- A cama vai num stem próprio (`saida/ambiente.wav`), 26 LU abaixo da voz e mais 3 dB abaixo sob a fala: fica muito abaixo da trilha e dos efeitos e não mexe na disciplina deles.

## Banco aberto (sob demanda)
Quando a cena pede `busca:<palavra>`, ou uma palavra que o banco embutido não tem, o estúdio procura na API pública do Openverse (sem chave), **só com licença CC0 ou domínio público**. Escolhe um resultado curto (até 8 s para efeito, até 30 s para ambiente), baixa por HTTPS (15 s de tempo e 3 MB de teto), confere no `ffprobe` e no FFmpeg (áudio legível, duração, sem silêncio), normaliza o loudness da classe e guarda em `.estudio/sons-abertos/`. O projeto registra o som em `projetos/<nome>/sons-abertos.json` (id, título, autor, licença, endereço) e o crédito em `fontes.md`. Depois da primeira busca, o mesmo projeto reusa o cache: o re-render sai igual.

Nunca trava o vídeo: sem internet, tempo esgotado, resposta estranha, arquivo ruim ou API fora do ar, aparece uma linha de aviso no log e vai o som do banco embutido ou o sintetizado. A busca envia só a palavra-chave (em inglês, quando o estúdio conhece a tradução); o arquivo baixado só é lido pelo FFmpeg.

## Pack do Fluido (50 sons)
O pack de sons do Fluido (produto do mesmo autor do estúdio, integração autorizada em 04/11/2026) entrou no banco com 50 amostras: interface (clique, botão, tecla, teclado, notificação, bip), número e dinheiro (contador, caixa, moeda), peça surgindo (pop, tique, vidro), movimento (shutter, whoosh, deslize, flash, glitch, chiado), tensão e virada (riser, subida, baque, boom, impacto, impacto-cinema) e conclusão (ding, sucesso, brilho). Cada som é a ação que aparece na tela; a categoria e as tags de cada um estão em `sons/indice.json`. Licenças: domínio público, CC0 e sintetizados pelo kit do Fluido, cada uma em `sons/licencas.json`.

**Como pedir pelo nome do Fluido.** Em `"som": "<nome>"` (no beat ou no elemento):
- `"som": "fluido-<nome>"` toca exatamente aquele som, sem sorteio e sem rede. Vale para os 50: `fluido-clique`, `fluido-clique-suave`, `fluido-botao`, `fluido-botao-grave`, `fluido-tecla`, `fluido-teclado`, `fluido-teclado-longo`, `fluido-notificacao`, `fluido-notificacao-aguda`, `fluido-bip`, `fluido-contador`, `fluido-contador-rapido`, `fluido-contador-lento`, `fluido-caixa`, `fluido-moeda`, `fluido-moeda-grave`, `fluido-pop`, `fluido-pop-agudo`, `fluido-pop-medio`, `fluido-pop-grave`, `fluido-tique`, `fluido-tique-agudo`, `fluido-tique-grave`, `fluido-vidro`, `fluido-vidro-grave`, `fluido-shutter`, `fluido-shutter-seco`, `fluido-whoosh`, `fluido-whoosh-curto`, `fluido-whoosh-medio`, `fluido-whoosh-longo`, `fluido-deslize`, `fluido-flash`, `fluido-glitch`, `fluido-chiado`, `fluido-riser`, `fluido-riser-curto`, `fluido-riser-medio`, `fluido-riser-longo`, `fluido-subida`, `fluido-baque`, `fluido-baque-grave`, `fluido-boom`, `fluido-impacto`, `fluido-impacto-cinema`, `fluido-ding`, `fluido-ding-agudo`, `fluido-ding-grave`, `fluido-sucesso`, `fluido-brilho`.
- O nome puro (`"som": "vidro"`, `"som": "deslize"`, `"som": "boom"`, `"som": "sucesso"`...) também acha a amostra pela tag, desde que não seja um som do motor, mas sorteia entre todas as do banco com aquela tag (as do Fluido e as de outros acervos). Só `fluido-<nome>` garante o som do Fluido. Os nomes que o motor já usa (`clique`, `pop`, `tique`, `whoosh`, `riser`, `impacto`, `glitch`, `ding`, `moeda`, `notificacao`...) continuam sorteando entre todas as amostras do banco que servem àquele papel, incluindo as do Fluido; para o do Fluido, use `fluido-<nome>`.
- O estilo que fizer o porte do Fluido (Smooth) pede os sons por `fluido-<nome>`. Os estilos sugeridos de cada amostra já trazem `fluido` e `smooth`, então a paleta desses estilos prefere o pack nos pedidos sorteados.
- Volume: o Fluido sugere 0,25 a 0,4 (até 0,5 para impacto e boom). No Ilustrando o nível é o do som sintetizado que a amostra substitui, mais a mixagem de sempre; não precisa pedir volume.
- Regras de uso do Fluido que valem aqui: o mesmo som duas vezes seguidas só se a ação for a mesma; `impacto`, `boom` e `impacto-cinema` no máximo dois por vídeo; `impacto-cinema` uma vez.

## Como pôr sons novos no banco (mantenedor)
1. Ponha os arquivos na pasta de origem da curadoria e ajuste a lista da curadoria (trecho, categoria, tags); as duas ficam no repositório do mantenedor, fora do kit.
2. Reconstrua o banco com o construtor da curadoria, também fora do kit (corta, normaliza por classe, grava os MP3, o `indice.json` e o `licencas.json`).
3. Confira: `node scripts/sons-verificar.mjs` e `node --test test/sons-banco.test.mjs test/sfx-amostras.test.mjs`.
4. Meça o nível contra o sintetizado: `node scripts/sfx-amostras-medir.mjs` (ebur128 do FFmpeg, por categoria e por estilo). Se uma categoria ficar fora, ajuste `AJUSTE_DB` em `src/video/sfx-amostras.mjs`.




