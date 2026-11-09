

# Estilo moon-path (Moon Path: papel recortado em camadas, de ninar)

Porte de 04/11/2026 a partir de um quadro do filme e do roteiro com o plano de cena (análise fora do kit). Daqui vem só a técnica e a aparência: nenhum nome, frase, roteiro ou música do material de origem.

Faz parte da família **feltro e papel** e usa a base comum do motor, descrita em `docs/estilo-paper-rocket.md`. Aqui ficam as regras próprias deste estilo.

Para quem: histórias de ninar e curiosidades de natureza contadas como fábula, de noite: praia, mar e lua, um bicho pequeno que precisa achar o caminho e amigos que mostram a direção.

## Regras do estilo (medidas no quadro e no roteiro de referência)

| Regra | Observação na referência | No estúdio |
|---|---|---|
| Papel recortado em camadas | céu azul-marinho, mar em fileiras de ondas recortadas, dunas de papel, tudo em planos com sombra entre eles | material `papel` (grão, fibras longas, sombra dura e mais longa, sem volume redondo); fileiras de ondas com sombra para cima, dunas com a borda costurada |
| Costura | a crista de cada onda e a borda das dunas com linha clara tracejada | tracejado azul-claro `#D6E2FF` 7/6 em 2,4 a 2,6 px |
| Lua | lua cheia baixa, creme, com halo grande | adereço `lua` com halo somado de 3 vezes o raio |
| Estrelas penduradas | estrelas de feltro dourado com brilho, presas por fio, e pontinhos | `estrelas-fio` (balançam como um móbile) e `estrelas` (piscam devagar) |
| Caminho de luz | tracinhos claros que cintilam sobre as ondas, alargando para perto | `caminho-lua` (90 tracinhos somados, cada um com o próprio cintilar) |
| Cais ao longe | cais com corrimão e dois postes de luz | `cais` e, para a "luz errada", `lampioes` âmbar que acendem um a um na palavra |
| Paralaxe | o diorama em planos | câmera `deriva` e `paralaxe`: o fundo anda menos que a frente; energia 0,7 |
| Ritmo | 3 a 6 s por cena | ficha pede beats de 2,5 a 5 s |
| Transição | (de ninar) | rodízio `fusao`, `dobra` (a página de papel dobra), `acompanha` (a câmera corre de lado até o próximo lugar), `match` (de dentro da lua) e `scallop` (o painel de papel em azul-noite), sem repetir em trocas seguidas; corte quando a cena continua no lugar |
| Palavras | as palavras da narração na tela | numa linha no alto, Fraunces SemiBold 72 px, creme com sombra; a palavra-chave na cor da marca |
| Som | caixinha de música que vai para o menor nos lampiões, ondas, casca que racha, cliques de lampião, uma nota por vaga-lume | trilha `ninar`; efeitos tique e pop na casca que racha, caixinha por vaga-lume, swell nas fusões. Brilhos com medida e teto momentâneo dos efeitos: ver `docs/estilo-paper-rocket.md` |

## Cenários da família

`praia-lua` (principal, como o quadro da referência: a lua grande no eixo, no alto; oito fileiras de ondas costuradas cobrindo a metade de baixo desde y 1010; o caminho de luz da lua no eixo; o cais ao longe; dunas, capim e pedrinhas), `cais-noite` (o cais e os lampiões âmbar), `mar-aberto` (dez fileiras de ondas, o caminho da lua, um barco de papel; sem chão: o bicho nada), `floresta-noite`. Os outros 10 cenários da base também valem. A composição centrada, a câmera viva, a legenda no eixo e o fecho do varal (revisão de 04/11) estão em `docs/estilo-paper-rocket.md`.

## Formas, campos, bichos, câmeras e como criar cenário ou bicho

Iguais aos da base: veja `docs/estilo-paper-rocket.md`. Use `{ "tipo": "moon-path", ... }`. O herói padrão é a `tartaruga` (casco com hexágonos costurados; nada com as nadadeiras).

## Plano automático

O mesmo da base, com a família deste estilo primeiro: "praia", "lua", "ovo", "nasceu" levam à praia de lua (o ovo que racha); "lampiões", "cais", "perdida" ao cais; "mar", "nadar", "ondas" ao mar aberto; "vaga-lumes" traz os vaga-lumes voando acima do herói.

## QA e revisão

O verificador da base vale aqui. Na revisão a 5 qps: as dunas ficam atrás do bicho (nunca cobrem o herói)? O caminho de luz cintila sem piscar o quadro inteiro? Os fios das estrelas não cortam o @ do topo de forma feia? A legenda creme fica legível sobre o céu e acima do bicho?




