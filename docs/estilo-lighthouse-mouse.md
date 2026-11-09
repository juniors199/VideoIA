

# Estilo lighthouse-mouse (Lighthouse Mouse: diorama de feltro quente, de ninar)

Porte de 04/11/2026 a partir de um quadro do filme e do roteiro com o plano de cena (análise fora do kit). Daqui vem só a técnica e a aparência: nenhum nome, frase, roteiro ou música do material de origem.

Faz parte da família **feltro e papel** e usa a base comum do motor (materiais, bichos, adereços, cenários, câmeras, legenda, plano automático e verificador), descrita em `docs/estilo-paper-rocket.md`. Aqui ficam as regras próprias deste estilo.

Para quem: histórias de ninar e fábulas gentis à noite. Um bicho pequeno com uma tarefa grande (a luz do farol, a vela, a lanterna), um problema pequeno (a tempestade apaga a luz) e amigos que chegam, cada um com uma luzinha.

## Regras do estilo (medidas no quadro e no roteiro de referência)

| Regra | Observação na referência | No estúdio |
|---|---|---|
| Diorama quente e profundo | parede azul-ardósia, rodapé de madeira, piso de tábuas em perspectiva com frestas; luz quente da lâmpada que bate no piso e na parede | cenário `sala-farol` (principal): parede `#2B3352` a `#1F253C` com costura de painel, piso de tábuas com frestas e rodapé, a poça de luz quente da lâmpada com o resto mais escuro e o soft-light quente perto dela |
| A lâmpada em camadas | nove discos que brilham entre hastes de madeira, tampa dourada, base marrom | adereço `lampada`: discos de feltro que vão do marrom ao creme quando acendem, hastes, tampa, base; acende (`acende`), apaga (`apaga`) e pisca (`pisca`), com tremulação leve |
| Janela de noite | moldura de madeira, 4 vidros, estrelas, lua, mar com arcos de onda | adereço `janela` (estrelas que piscam, lua com halo, ondas que andam) |
| O ratinho | cabeça cinza, orelhas grandes com miolo rosa, boné amarelo com aba de lado, capa de chuva amarela com costura e botões, olho de miçanga, cauda fina rosa | bicho `ratinho` (o herói padrão) |
| On twos | personagens a 12 qps; câmera, água e luz suaves | `degraus: 12`: só os bichos andam em degraus |
| Câmera calma | empurrão lento, nada de tremor fora da tempestade | energia 0,62 (empurrão até ~3%/s), tremor só na tempestade |
| Ritmo | 3 a 6 s por cena | ficha pede beats de 2,5 a 5 s |
| Transição | (de ninar) | rodízio `fusao` (0,5 s), `match` (a cena nova abre de dentro da lâmpada, da lua ou do farol), `dobra`, `escurece` (mergulho no azul-noite, nunca preto) e `fios`, sem repetir em trocas seguidas; corte quando a cena continua no lugar |
| Palavras | as palavras da narração na tela | numa linha no alto (y 420), Fraunces SemiBold 72 px, creme com sombra roxa; a palavra-chave na cor da marca |
| Textura | feltro em tudo | fibra de feltro por camada, grão de quadro mais forte (0,6) e vinheta 0,55 |
| Som | caixinha de música, mar, chuva, trovão, "whump" quando a luz volta | trilha `ninar` (caixinha de música); efeitos `caixinha` e baque macio na luz que acende, swell na que apaga, impacto grave no relâmpago, uma nota de caixinha por amigo que chega. Brilhos com medida e teto momentâneo dos efeitos: ver `docs/estilo-paper-rocket.md` |

## Cenários da família

`sala-farol` (principal: o ratinho grande em primeiro plano no eixo, a lâmpada alta que brilha ao lado, a janela da noite no alto e o piso de tábuas em perspectiva desde y 1290), `farol-mar` (o farol na rocha com o facho que varre, mar de papel, barco que segue a luz, estrelas penduradas), `tempestade` (chuva em riscos, ondas altas, relâmpago na palavra, o farol que se apaga), `quarto-noite` (cama de feltro, vela, janela da lua), `floresta-noite` (árvores de feltro, lua, vaga-lumes). Os outros 9 cenários da base também valem. A composição centrada, a câmera viva, a legenda no eixo e o fecho do varal (revisão de 04/11) estão em `docs/estilo-paper-rocket.md`.

## Formas, campos, bichos, câmeras e como criar cenário ou bicho

Iguais aos da base: veja `docs/estilo-paper-rocket.md` (formas `cena`, `objeto`, `numero`, `pensamento`, `foto`, `cta`; 10 bichos; 9 câmeras; cenário e bicho novos em poucos passos, também no `pecas.js` do projeto). Use `{ "tipo": "lighthouse-mouse", ... }`.

## Plano automático

O mesmo da base, com a família deste estilo primeiro: "a luz", "a lâmpada", "o farol" levam à sala do farol; "barco", "porto" ao farol no mar; "tempestade", "chuva", "trovão" à tempestade (com o farol que apaga e o tremor); "dormir", "cama" ao quarto; "os amigos chegaram" traz coruja, caranguejo e gaivota (ou os bichos citados), cada um com uma vela ou lanterna.

## QA e revisão

O verificador da base vale aqui. Na revisão a 5 qps: a luz quente está sempre visível (nada de quadro escuro demais na troca)? O ratinho anda em degraus e a câmera continua suave? A legenda creme fica legível sobre a parede escura e acima do bicho?




