

# Cena: cenários 3D por beat

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Cenários (no beat: `"cenario"`)
Cada beat pode trazer o ambiente atrás das peças: piso, fundo e adereços, mais a atmosfera daquele beat (cor do fundo, névoa, luz, brilho). Sem o campo, vale o **palco** de sempre (disco suave sob as peças). Escreva o nome (`"cenario": "rua"`) ou o objeto com dados (`"cenario": { "tipo": "rua", "faixas": 4 }`).

| cenário | o que é | dados além de `cor`, `densidade`, `fundo` |
|---|---|---|
| `palco` | o atual, padrão | |
| `vazio` | fundo quase preto, só a sombra das peças | |
| `mesa` | tampo largo com tapete (câmera `topo` ou normal) | `cor` = madeira |
| `rua` | asfalto com faixas laranja que correm para a câmera (use `topo`) | `faixas` (2 a 4), `velocidade` |
| `espaco` | estrelas em volume, nebulosa leve, planeta com anel | `cor` = tom da nebulosa |
| `sala` | piso de madeira, parede, janela, quadro, tapete e luminária | `cor` = parede |
| `agua` | mar de ondas suaves, sol baixo no horizonte | `cor` = água |
| `campo` | relva, colinas, árvores e estrada de terra | `cor` = relva |
| `cidade` | horizonte de prédios com janelas acesas | `cor` = prédios, `densidade` = janelas |
| `templo` | piso de pedra, degraus, colunas e viga (só arquitetura) | `cor` = pedra, `densidade` = nº de colunas |
| `tribunal` | estrado, bancada, grade e parede de madeira com brasão liso | `cor` = madeira |
| `palanque` | tablado com cortina e círculo de luz | `cor` = cortina |
| `escritorio` | carpete, janelão, duas mesas e planta | `cor` = parede |
| `fabrica` | piso industrial, faixa de alerta, esteira com caixas, tanques | `cor` = piso, `velocidade` |
| `deserto` | areia, dunas, pirâmides distantes, sol grande | `cor` = areia |
| `papel` | papel claro com pauta; peças e textos viram tinta escura | `cor` = papel, `densidade` 0 tira a pauta |
| `plenario` | hemiciclo de bancadas curvas em degraus, cadeiras de couro, microfones, mesa diretora ao lado e painéis de votação apagados | `cor` = carpete, `densidade` < 0,4 tira os microfones |
| `estudio-tv` | bancada curva de telejornal, telão de monitores apagados, ilha no piso, refletores e câmera de estúdio nas laterais | `cor` = tom do estúdio |
| `debate` | palco escuro, dois púlpitos iguais, telão bipartido apagado e plateia em silhueta nas laterais | `cor` = palco |
| `sala-imprensa` | praticável, painel liso sem logo, púlpito de madeira com cacho de microfones, cadeiras e tripés nas laterais | `cor` = painel |
| `secao-eleitoral` | sala de escola: lousa, cabine com a urna, mesa dos mesários com mesário e fila de eleitores | `cor` = barrado |
| `gabinete` | piso de tacos, tapete, lambri, mesa com tampo de couro, poltrona, bandeira genérica e estante | `cor` = madeira |
| `delegacia` | balcão de atendimento, arquivos de aço com caixas de pastas e quadro de investigação com fios | `cor` = parede |
| `presidio` | corredor de concreto com celas dos dois lados, grades, beliches, luz fria em poças e porta de aço no fim | `cor` = concreto |
| `hospital` | leito com grades, régua de gases, suporte de soro, monitor com traçado do eletro que corre e cortina | `cor` = parede |
| `sala-aula` | quadro verde com giz apagado, mesa do professor com globo, carteiras nas laterais e janelas de basculante | `cor` = barrado |
| `agencia-banco` | guichês de caixa com vidro e atendentes, porta de cofre redonda e fila com pedestais | `cor` = pedra |
| `aeroporto` | pátio com linha de táxi, jato executivo com escada e cones, hangar e torre, céu de fim de tarde | `cor` = concreto |
| `supermercado` | corredor entre gôndolas cheias em perspectiva, freezers ao fundo e um caixa com esteira na lateral | `cor` = piso |
| `rua-dia` | rua de dia: meio-fio, calçada, sobrados com janelas e toldos, postes, árvores e céu azul | `cor` = asfalto, `densidade` < 0,3 tira as árvores |
| `stf` | plenário de corte suprema: bancada de madeira em semicírculo sobre estrado, onze cadeiras de espaldar alto, tribuna, bancos da plateia, cortinas e medalhão liso apagado (sem brasão) | `cor` = carpete |
| `maquete` | bancada de madeira com veio e riscos, parede de papelão, prateleiras com potes e livros, janela com luz quente e lâmpadas penduradas; o cenário do estilo stop-motion (padrão nele) | `tom` (`oficina`, `campo`, `noite`, `laboratorio`, `estudio`), `densidade` |
| `planalto` | palácio modernista genérico ao entardecer: laje sobre colunas esculpidas, pano de vidro escuro, rampa, espelho d'água e esplanada de pedra (sem marca) | `cor` = pedra |
| `congresso-exterior` | esplanada com gramado, caminho de pedra e espelho d'água; ao fundo, torres gêmeas, cúpula e cuia estilizadas sobre a laje | `cor` = gramado |
| `favela` | morro de casas empilhadas em cores fortes e tijolo aparente, lajes, caixas d'água, escadaria, postes e fios, à noite | `cor` = rua, `densidade` = casas |
| `praia` | calçadão em ondas, faixa de areia com guarda-sóis, mar com espuma que vai e volta, palmeiras, quiosque e morros ao entardecer | `cor` = mar |
| `estadio` | gramado listrado com linhas discretas, gol, placas lisas apagadas, arquibancada com torcida miúda, cobertura e torres de refletor | `cor` = gramado, `densidade` = torcida |
| `igreja` | nave com passadeira, bancos de madeira com genuflexório, colunas, altar em degraus com toalha e velas e vitrais escuros em arco | `cor` = madeira |
| `agro` | terreiro e lavoura em fileiras até o horizonte, trator com pneus de garra, silos de chapa ondulada, galpão e pôr do sol | `cor` = terra, `densidade` = plantas |
| `porto` | cais com cabeços e trilhos, pilhas de contêineres de chapa ondulada, guindaste de pórtico, navio atracado e mar escuro que ondula | `cor` = concreto |
| `posto-gasolina` | posto à noite: cobertura sobre colunas, ilha com duas bombas e mangueiras, totem com placas de preço lisas e loja de conveniência | `cor` = piso |
| `sala-reuniao` | mesa longa atravessada com cadeiras, telão apagado, divisória de vidro com persiana, aparador e planta | `cor` = parede |
| `laboratorio` | bancadas de tampo preto com armários, prateleiras de frascos, microscópio, vidrarias, capela de exaustão e banquetas | `cor` = parede |
| `data-center` | corredor entre racks de porta perfurada com LEDs que piscam, piso elevado perfurado, eletrocalhas e forro | `cor` = piso |
| `cozinha` | armários de baixo e de cima, bancada de granito, azulejo, fogão com grelhas e forno, pia, geladeira e utensílios | `cor` = armários |
| `quarto` | cama de cabeceira estofada com edredom e travesseiros, criados-mudos, abajur aceso baixo, guarda-roupa, quadro e janela com cortina | `cor` = parede |
| `onibus-interior` | ônibus urbano por dentro, à noite: bancos em pares, balaústres amarelos, alças, catraca e as luzes da rua passando nas janelas | `cor` = bancos |
| `rua-noite-chuva` | rua à noite com chuva caindo, asfalto molhado com reflexo das vitrines, poças com respingos, sobrados e postes | `cor` = asfalto, `densidade` = chuva |
| `mercado-financeiro` | pregão com mesas de operação cheias de monitores apagados, painel de cotações apagado e letreiro corrido baixo | `cor` = carpete |

- **Transição:** ao trocar de beat, cor de fundo, névoa, luzes e tinta do texto deslizam em 0,6 s. O cenário novo sobe do chão; beats seguidos com o mesmo cenário (mesmos dados) compartilham o mesmo ambiente e o chão só se ajusta à altura das peças. Troca de cenário com transição `corte` é seca.
- **Por tema:** política `plenario`, `palanque`, `debate`, `sala-imprensa`, `secao-eleitoral`, `gabinete`, `estudio-tv`, `planalto`, `congresso-exterior`; justiça `tribunal`, `stf`, `delegacia`, `presidio`; economia `agencia-banco`, `mercado-financeiro`, `escritorio`, `sala-reuniao`, `fabrica`, `agro`, `porto`, `posto-gasolina`, `supermercado`, `aeroporto`; tecnologia e ciência `data-center`, `laboratorio`; Brasil e cotidiano `favela`, `praia`, `estadio`, `igreja`, `rua-dia`, `rua`, `rua-noite-chuva`, `onibus-interior`, `cidade`, `sala`, `cozinha`, `quarto`, `sala-aula`, `hospital`, `mesa`, `campo`. Escolha o lugar que a voz descreve naquele beat; se nenhum serve, crie no `pecas.js` do projeto.
- **Faixas do texto:** nenhum cenário põe coisa clara ou acesa atrás do título (parede em y ≈ 2,3 a 4,4 no plano normal; chão entre z = -4 e -6 no topo) nem da legenda, e o chão cobre a parte de baixo do quadro em todos os planos.
- **Câmera:** o cenário foi desenhado para `normal`, `aberto`, `fechado`, `topo` e `lateral`. Evite `baixo` (a câmera fica abaixo do chão); o validador avisa.
- **QA:** o cenário nunca conta como peça nem entra no encaixe. Adereços altos (janela, brasão, viga) são medidos à parte e o QA avisa se algum invadir a faixa da legenda.
- **Dados:** `cor` e `fundo` são hexadecimais (`"#2a2a33"`); `densidade` vai de 0 a 3 (padrão 1). O validador recusa nome inexistente e dado inválido, com sugestão.
- **Desempenho:** o sombreado do cenário é assado nos vértices (sem luz por pixel), então um beat com cenário custa o mesmo que um beat de palco. Evite trocar de cenário a cada beat sem motivo: uma ideia, um lugar.
- **Conferir:** `node src/video/cli.mjs --galeria-cenarios [nome|lista|tudo] [--plano=topo]` gera `marca/saida/galeria/cenario-<nome>.jpg` (com outro plano, `cenario-<nome>-<plano>.jpg`), uma folha por cenário com 2 ou 3 peças de exemplo.
- **Novo cenário:** `engine/cenarios.js`, `CENARIOS = { nome: (Ms, dados, marca) => Group }` com o piso em y = 0; `userData` aceita `atm`, `piso`, `anima(t)` (função pura do tempo), `itens` e `sombraY`.
- **Cenário que não existe:** crie no projeto, em `projetos/<nome>/pecas.js` (`export const cenarios = { nome: (kit, d) => Group }`), seguindo `docs/repertorio-3d.md`. O validador e o QA aceitam o nome; os dados do cenário local são livres.




