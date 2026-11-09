

# Cor da marca nos estilos (auditoria e regra)

Regra do estúdio (02/11/2026, reforçada em 03/11/2026): nos estilos de vídeo a cor de destaque (marca-texto, halo, etiqueta, fita, sublinhado, número, ícone ativo, barra, botão) é a da identidade da página, nunca cor fixa. No caso do Ilustrando é o laranja; quem compra personaliza em `marca/tokens.json` (`npm run marca`). Tons mais claros, mais escuros ou translúcidos são derivados dessa cor.

## Como o motor lê a cor
- A fonte única é `spec.marca.destaque`, que o planejador monta de `marca/tokens.json` (`marcaDe` em `src/video/plano.mjs`). `ILU_TOKENS=<arquivo>` aponta outro arquivo de tokens só para teste e prévia (vídeo e carrossel).
- Os tons saem de **um** ponto, `src/video/engine/marca-tons.js` (`tonsDaMarca`): `forte` (a própria cor), `claro`, `maisClaro`, `escuro`, `profundo`, translúcidos (`a`, `aClaro`, `aEscuro`), `sobre` (texto branco ou escuro, o de maior contraste sobre o destaque) e `sobreFundo(fundo, min)` (a cor da marca como texto legível sobre um fundo, escurecendo ou clareando até o contraste pedido).
- O estilo **não pode** gravar `destaque` em `ESTILOS[...].marca`: isso sobrescrevia a cor da página em todo o vídeo (era a causa de o `"marca"` do 3D Alternativo não funcionar: a paleta `marca` lia o próprio lime, já gravado em `spec.marca.destaque`). Só os estilos monocromáticos (lista `NEUTROS` do teste) têm destaque próprio, e ele é cinza, branco ou preto.

## Como a regra é cobrada
- `test/cor-da-marca.test.mjs` (estático, sem navegador): varre `src/video/engine/**` e `src/carrossel/*.mjs` atrás de cor cromática fixa (hex, `0x`, `rgb()`, `hsl()`) e reprova a que não estiver em `test/fixtures/cor-da-marca-excecoes.json`; reprova exceção que já saiu do código (a linha de base só aperta); trava os arquivos corrigidos com listas próprias; proíbe voltar as cores antigas (roxo, vermelho e rosa do tubo, ouro do Mindset, lime); confere que `ESTILOS` não sobrescreve o destaque.
- `test/cor-da-marca-quadros.test.mjs`: monta cada estilo corrigido com uma marca azul (`#2F6BFF`), captura 2 quadros e mede que a cor da marca aparece e a antiga some.
- Cor nova num estilo: derive de `tonsDaMarca(spec.marca.destaque)`. Se for de verdade material, cenário ou estado, acrescente em `cor-da-marca-excecoes.json` (categoria e cor) e uma linha na tabela abaixo, com o motivo.

## Categorias de exceção (o que pode ficar com cor fixa)
| Categoria | O que é |
|---|---|
| `semantico` | cor de estado ou de ícone de sistema: REC e alerta, sinal verde e vermelho, semáforo de janela, certo e errado |
| `paleta-nomeada` | paleta ou tom que a pessoa escolhe pelo nome no roteiro (`paleta: lime`, `tom: amarelo`); nunca é o padrão |
| `identidade-do-estilo` | fundo, papel, tinta, sombra e as cores secundárias que definem o estilo (franja turquesa e cobre do Mindset 2) |
| `material` | objeto, pele, madeira, metal, tecido, massinha, fruta |
| `cenario` | cenário, luz e clima de um mundo; o destaque de texto sobre ele segue a marca |
| `arte-de-acervo` | ouro de folha, vitral, pintura, mapa e papel de acervo (Teologia, Antiguidade, Quadro antigo); o acento segue a marca |
| `repertorio` | peça do repertório 3D (bandeira, fruta, comida, carnaval) |
| `valor-inicial` | fallback quando a marca vem vazia (`#FF7A2F` em `marca-tons.js`) |
| `guia` | guias de zona segura (`--guias`) |
| `carrossel-semantico` | visto verde e xis vermelho do carrossel |

## Reels (34 estilos)
"Antes" é o que a 0.6.28 fazia com uma marca azul; "Depois" é a 0.6.29.

| Estilo | Onde estava a cor fixa | Decisão | Antes | Depois |
|---|---|---|---|---|
| padrao, editorial, minimalista, papel | nada: `marca: {}` (editorial: luz quente de acabamento, papel: papel claro) | já seguia a marca | marca | marca |
| pontilhismo, linhas, anatomia, fino, preto-branco | `ESTILOS`: destaque `#FFFFFF`, `#000000`, `#D0D6E0` | identidade monocromática por desenho (trava no teste: o destaque tem que ser neutro). Cor de marca neles é decisão ainda em aberto | neutro | neutro |
| impresso | tinta cinza e papel (`rgb(120,95,60)` do papel) | identidade monocromática | neutro | neutro |
| **cartoes** | `estilo-cartoes.js` (`ROXO`, `ROXO_L`, gradientes `#9270ff`/`#6a3ef0`, rgba roxo), `f2-peles.js` (`CART`, etiqueta da foto), `ESTILOS.cartoes` (`#7B4DFF`, `#A98BFF`) | destaque, etiqueta, tile, chip, check, cursor, QR e brilhos derivam da marca; texto sobre o destaque usa `sobre`; texto da marca sobre branco ou creme usa `sobreFundo`. Coral de REC e alerta fica (semântico) | roxo | marca |
| **tubo** | `estilo-tubo.js` (`RED #EB1628`, `PINK #FF7896`, rgba rosa, emissivo `0xff7896`), `f2-peles.js` (`TR`, `TP`, brilho), `ESTILOS.tubo` (`#EB1628`) | vermelho vira a marca, rosa vira um tom mais claro dela, linha do chassi um tom escuro; branco frio e preto da TV ficam | vermelho e rosa | marca |
| **mindset** | `estilo-mindset-bonecos.js` (`COR_MS.ouro`, brilho `255,200,0`, esfera, gradiente da meta), `estilo-mindset.js` (halo, brilho da palavra-chave), `estilo-mindset-3d.js` (`OURO`, emissivo), `estilo-mindset-mundo3d.js` (peças em ouro), `ESTILOS.mindset` (`#FFC800`) | `aplicarMarcaMs(destaque)` troca o ouro e o que deriva dele; cinza do outro boneco, grafite e cenários ficam (cenário) | ouro `#FFC800` | marca |
| **mindset2** | `estilo-mindset2-glifos.js` (`COR_M2.linha`, `acento`, `botao`, núcleo, gradiente), `estilo-mindset2.js` (halos), `estilo-mindset2-cenarios.js` (luz `ouro`, disco, lua), `ESTILOS.mindset2` (`#F7D21A`) | `aplicarMarcaM2(destaque)`; franja turquesa e cobre, hachura e carvão são a identidade do estilo e ficam | ouro `#D9C46E`/`#F7D21A` | marca |
| **alternativo** | `ESTILOS.alternativo` (`#F4FA7C`), `PALETAS_ALT.lime` usada como padrão | padrão passa a ser a marca (com ou sem `paleta`/`tema: "marca"`); `lime`, `ciano` e `laranja` só por nome (`paleta-nomeada`); texto sobre o destaque usa `sobre` | lime | marca |
| letreiro, interface, colagem, ribalta | já liam `spec.marca.destaque`. Ficam: alerta vermelho e semáforo de janela (interface, `semantico`), objetos 3D reais (ribalta, `material`), fallback `#FF7A2F` | já seguia a marca | marca | marca |
| **mundos** | `estilo-mundos-linha.js`: destaque fixo dos mundos nomeados (`#F3C25B`, `#FFC98F`, `#FFD9A0`, `#FFE08A`) e do mundo local (`#FFD9A0`) | o fundo e o padrão de cada mundo são a identidade (cenário); o destaque é a marca, clareada o quanto o fundo do mundo pedir (`sobreFundo`). O verde do carimbo fica (`semantico`) | amarelo e creme | marca |
| **moderno** | `estilo-moderno.js`: confete multicolor com laranja fixo, `SELECAO #3D8BFF`; `estilo-moderno-janelas.js`: marca-texto, pílula de resposta e microfone em amarelo, miolo roxo do orbe | confete, seleção, marca-texto, pílula, microfone e orbe derivam da marca. Ficam: verde, amarelo e vermelho de ESTADO da interface mostrada, semáforo da janela e a pasta azul de sistema | azul, amarelo, roxo | marca |
| **stop-motion** | `ESTILOS.stop-motion` (`#E0892B`), fita padrão `#4FB9C0` | destaque e fita padrão leem a marca; massa, cenários e luz de estúdio são material | laranja barro e turquesa | marca |
| **teologia** | `estilo-teologia-arte.js` (`ouro` e `kicker` de cada tom), `estilo-teologia-texto.js` (marca-texto e neon do dossiê), `estilo-teologia-diagramas.js`, `ACENTO` (`azul`, `vinho` por tom), `ESTILOS.teologia` (`#E4BE5F`, `#C9A85A`) | `aplicarMarcaTeologia(destaque)`: o acento padrão de todo tom é a marca, com o contraste que o fundo do tom pede; marca-texto e neon também. Ouro de folha, vitral, molduras e tratamentos de imagem pelo nome ficam (`arte-de-acervo`) | ouro, azul, vinho, neon | marca |
| **quadro-antigo** | `estilo-quadro-antigo-formas.js` (`vermelho` de cada tom), `ESTILOS.quadro-antigo` (`#B3262B`) | `aplicarMarcaQA`: o "vermelho de anotação" (palavra em destaque, círculo, chave, numeral, risco) é a marca com contraste sobre o papel; papel, couro e madeira ficam. `cor: "vermelho"` do carimbo é nome escolhido à mão | vermelho | marca |
| **antiguidade** | `estilo-antiguidade-desenho.js` (`PALETAS.destaque`, `rota`, `ponto`, `ouro`, barra, legenda, `mapaCores`), `estilo-antiguidade.js` (brilhos e gradientes dourados), `ESTILOS.antiguidade` (`#D9B44A`) | `aplicarMarcaAntiguidade`: destaque, rota, ponto, ouro do título, barra e legenda leem a marca em cada tom; vinho (tinta e papel) e vermelho nomeado ficam | ouro, vinho | marca |
| **fatos** | `estilo-fatos.js` (`TONS_FATOS.marca = '#FF7A2F'`, padrão `amarelo`), `estilo-fatos-mapa.js`, `estilo-fatos-cenarios.js` (padrão `#FBD90A`), `estilo-fatos-personagem.js` (o Curioso em `#FF7A2F`), `ESTILOS.fatos` (`#FBD90A`) | sem `tom` (ou `"marca"`) o acento é a marca; `amarelo` e `ouro` só por nome; o Curioso (óculos, cachecol, lupa, antena) usa `"marca"`. Menta, coral e risco dos gráficos ficam (`semantico`) | amarelo e laranja fixo | marca |
| prickles e little-light (04/11) | nasceram lendo a marca: palavra-chave da legenda, número da placa e do plâncton, fita e pílula do fecho e a estrela do susto usam `tonsDaMarca` | a paleta dos cenários (folhas, céu, água) e o brilho das criaturas (rosa, azul, violeta) são do estilo e estão em `test/fixtures/cor-da-marca-excecoes.json` | marca | marca |
| colagem3d | cenários tinham `corRealce: '#FF7A2F'` (campo sem uso) e `REGRAS_C3` com a mesma cor | já desenhava com `tonsMarca`; os valores mortos viraram `"marca"` para não parecerem laranja fixo | marca | marca |
| novela (04/11) | nasceu na marca: palavra-chave, fio, placa do retrato, auréola, número, rota, pino, carimbo, selo, painel, pétalas e medalhão saem de `tonsDaMarca(spec.marca.destaque)`; o fundo do fecho é o da página | ficam fixos só material e cenário (pele, tecido, madeira, pedra, céu, luz de vela e de noite, ouro da moldura, papel), registrados na lista de exceções; 05/11: cenário vila-galileia (adobe, terra, oliveira, céu de tarde) e tecidos dos personagens bíblicos | marca | marca |
| paper-rocket, lighthouse-mouse, moon-path | estilos novos (04/11/2026) | palavra-chave da legenda, número da contagem (fundo), letras do fecho e capa leem `tonsDaMarca(destaque)`; as cores fixas são de cenário (céu, mar, lua, lâmpada, planeta) e de material (o feltro dos bichos), registradas em `test/fixtures/cor-da-marca-excecoes.json` | marca | marca |
| mindset3 | (estilo novo, 04/11/2026) | o ponto aceso, o anel, a ponta do lápis, a chave do título, a pílula do visto e o grupo da grade leem a marca; o frio é a complementar e o alerta o vizinho quente dela (`paletaM3`); fixos só o fundo, a lavanda do traço, o creme do número e a sombra da legenda | marca | marca |
| smooth (6 irmãos) | nasceu no porte de 04/11/2026 já lendo a marca | `paletaSmooth(spec.marca.destaque)` com `tonsDaMarca`: destaque, destaque legível no gelo e no papel, texto sobre o destaque, tiles e o miolo do breu misturados da marca; gelo, breu, tinta, papel e chapas são neutros (nenhuma cor cromática fixa nos arquivos do estilo) |

## Carrosséis (11 visuais)
| Visual | Cor fixa | Decisão |
|---|---|---|
| escuro, claro, papel, editorial, condensado, interface, recorte, serifado, marcatexto, limpo, grao | fundos e papéis (`#16162A`, `#EEE7DA`, `#EAE3D5`...) em `familias.mjs` e `visuais.mjs`; visto verde `#2FB552`/`#1E9A40` e xis vermelho `#E8362E`/`#E3241B` em `elementos.mjs` e `familias.mjs` | o destaque de todos vem de `pagina.destaque` (`paletaDestaque`, `destaqueTexto`); fundo é identidade e verde e vermelho são certo e errado (`carrossel-semantico`). Sem correção necessária |

## Prova (quadros a 1/4 da resolução, pixels no matiz)
Marca azul `#2F6BFF` (verde `#00B36B` em moderno, teologia e mundos, onde o fundo ou a cor de sistema já é azul). Antes (0.6.28), 3D Alternativo com marca azul: 11.195 pixels lime e 0 na marca; depois: 11.935 na marca e 0 lime.
| Estilo | Pixels na marca | Pixels na cor antiga |
|---|---|---|
| cartoes | 4.667 | 0 (roxo) |
| tubo | 3.546 | 450 (franja vermelha da máscara CRT, 13%) |
| alternativo | 4.138 | 0 (lime) |
| mindset | 7.050 | 0 (ouro) |
| mindset2 | 8.504 | 9 (ouro) |
| fatos | 2.663 | 0 (amarelo e laranja) |
| moderno | 2.231 | 66 (barras de estado) |
| stop-motion | 15.704 | não medido (mesa e parede quentes; só a placa mudou) |
| teologia | 4.632 | 98 |
| quadro-antigo | 470 | 0 (vermelho) |
| antiguidade, mundos | 680 e 1.699 | não medido (foto sépia e mundos de outras cores) |
Também revisados a olho, 3 a 6 quadros de cada estilo alterado, em laranja e em azul (amarelo `#FFD400` nos cinco principais e no stop-motion), sem texto cortado e sem contraste quebrado.

## Não confirmado
- O estúdio pode passar a usar cor de marca também nos estilos monocromáticos (pontilhismo, linhas, anatomia, fino, preto-branco, impresso). Hoje ficam neutros por desenho.
- Os projetos de exemplo e as prévias do catálogo de cada estilo foram renderizados com a marca laranja do Ilustrando.

## Bible (08/11/2026)
`estilo-bible-cenas2.js` (#16263F, azul-noite do mar, misturado com a marca antes de usar; #8FAE5B, verde da folha de oliveira) e `estilo-bible-bichos.js` (#8FAE5B e #3C4F22, folha e nervura) têm cor fixa só de cenário e de material do objeto; destaque de texto, número, halo, fogo, luz e corpos leem a marca (`tonsBible`). Registrado em `test/fixtures/cor-da-marca-excecoes.json`.

## 0.6.44: a marca chega ao vídeo (relato de comprador de 09/11/2026)
Quadros a 1/4 da resolução com uma marca verde (`#1FA35B`) em 40 estilos: todos os coloridos mostram o verde no destaque; o laranja que aparece em alguns é cenário ou material (madeira, sol, folhas de outono, massinha). Os preto e branco por desenho (pontilhismo, linhas, anatomia, fino, preto-branco, impresso) não mostram cor nenhuma. As falhas estavam fora da paleta:
- **Estilo trocado e cena velha:** a cena automática guardada em `cena.json` era reaproveitada depois da troca de estilo e o vídeo saía com as peças do estilo anterior. Agora ela guarda `estiloPlano` e é refeita quando o pedido muda (aviso `cena-refeita-estilo`); a escrita à mão nunca é apagada e ganha o aviso `cena-de-outro-estilo`. Precedência: pedido do usuário (`--estilo`, STATUS) > `estiloPadrao` do estúdio > o sugerido pelo objetivo.
- **Cor fora do lugar:** a cor escrita em `ilustrando.config.json` ou num bloco renomeado do `tokens.json` não valia, sem aviso. Agora o bloco renomeado vale, o hex sem `#` ou com espaço é aceito (`src/video/marca-pagina.mjs`) e a cor fora do lugar vira o aviso `marca-fora-do-lugar`, com a cor que vale e o passo exato (trocar a marca continua sendo decisão da pessoa, pela skill `marca`).
- **Preto e branco calado:** os estilos monocromáticos agora avisam (`estilo-sem-cor-da-marca`).
- **Cor só para um vídeo:** `"destaque": "#RRGGBB"` no `cena.json` vence a marca e o estilo (pedido do usuário > marca > padrão).
- Teste: `test/raiz-0644-marca-estilo.test.mjs` (inclui a varredura dos planejadores e das fichas de estilo, objetivo e modelo atrás de cor fixa).




