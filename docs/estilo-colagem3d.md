

# Estilo colagem3d (Colagem 3D: documentário em recortes de papel)

> **Fila de misticismo (05/11/2026), correções na raiz:** a etiqueta da foto de tela cheia (`forma: 'tela'`, `rotulo`) ficava a 150 px do eixo e em y 520 e, com o empurrão da câmera, saía pela borda ou subia até o @; agora fica mais perto do centro (meia largura mais o desvio até 290 px do eixo) e em y 820, perto do centro do empurrão. A capa (`CAPA_C3`) põe foto, etiqueta, retalho e título dentro de x 72 a 928 e y 262 a 1418, e a conferência da capa reprova título fora. Foto sobre `arquivo-ambar` ou `mesa-madeira` (fundo escuro) mede ruído grosso de 1,7 a 1,9 no QA `grao-alto` (teto 1,1); o QA só mede os primeiros 80 s, então foto nesses cenários no começo do vídeo reprova. Prefira cenário claro para as fotos (pendente na raiz: baixar o ruído desses dois cenários).

Porte de 02/11/2026 a partir de 15 vídeos de referência analisados quadro a quadro (análise completa fora do kit). Daqui vem só o padrão transferível: nenhuma imagem, frase, marca, música ou fonte de terceiros. Papéis, texturas, cartões e props são desenhados por código (`src/video/engine/estilo-colagem3d-papel.js`).

Não é o estilo `colagem` (foto em papel branco que desdobra, cores da página): aqui a colagem tem profundidade de verdade, papel com textura por assunto e corte seco a cada plano.

Para quem: histórias reais, biografias, origem de invenções e marcas, casos do passado e do noticiário. Funciona em qualquer tema em que cada frase tem uma imagem: uma pessoa, um lugar, um objeto, um jornal, um documento, um ano.

## Regras do estilo (medidas nas referências; valem acima das regras gerais de layout dos Reels)

| Regra | Medida na referência | No estúdio |
|---|---|---|
| Corte seco | 15 a 165 planos por vídeo; plano mediano de 0,9 s (25% abaixo de 0,1 s, 75% abaixo de 1,7 s) | cada beat é um plano novo; beat de 2,6 s ou mais corta a cada ~1,9 s para outro enquadramento (mais perto, em ângulo, a foto reenquadrada); `corte-close` corta para o close na palavra-chave |
| Profundidade | recortes a alturas diferentes do papel, sombra macia que cresce com a altura, camadas que se separam quando a câmera anda | palco 3D em three.js: o papel é um plano com textura e relevo que recebe sombra; cada recorte é um cartão curvo com espessura a 14 a 240 px do papel; sombra com a forma do contorno (rasgado e picotado incluídos) |
| Papel de fundo | creme `#EDE6D6`, cinza `#C9C9C7`, jornal `#EEEDEA`, mural `#151515`, madeira `#6B4128`, xadrez `#F2E4E4`/`#E4C1C4`, céu sépia `#DCD3C3`, base de corte `#2E5A45`, gravura `#E4E4E2`, estúdio `#F8F7F4` | 11 cenários com fibra, mosqueado, relevo e os props de cada um (mais o arquivo em âmbar da referência 14) |
| Recorte | foto de época com borda branca, polaroide, borda rasgada, picotada ou recorte direto; P&B, sépia, cor desbotada, retícula de jornal e gravura | `borda`: `sem`, `branca`, `polaroide`, `rasgada`, `selo`; `tratamento`: `cor`, `pb`, `sepia`, `reticula`, `gravura`, `ambar`; vinheta interna, poeira e véu morno na foto |
| Etiqueta | nome da pessoa numa etiqueta amarela embaixo do retrato (05) | etiqueta `#F2E14C` em Instrument Serif 42 px, com fibra, levemente torta |
| Texto | serifada condensada de alto contraste, pequena (28 a 34 px a 720), 1 a 4 palavras por vez, entrando quando ditas; a chave em itálico ou numa caixa (amarela, azul, escura, preta) | Instrument Serif 70 px em UMA linha em y 1400 sobre o papel limpo (regra da casa: nunca sobre a foto), até 26 caracteres, palavras que entram quando ditas (0,1 s, subida de 6 px); a chave em Instrument Serif Itálica, com a caixa de realce do cenário que corre da esquerda para a direita em 0,15 s |
| Marca-texto | círculo amarelo à mão no detalhe (01), raio em zigue-zague (05), halo cheio no rosto (07) | `marca`: `circulo`, `sublinha`, `seta`, `risco`, `halo`, desenhados em 0,35 s na palavra-chave, traço duplo irregular `#F2DC2E` |
| Objetos | objetos 3D fotorrealistas sobre a mesa ou no ar (moeda, lata, envelope, planador, dirigível) | as peças 3D do repertório do estúdio, com ambiente de estúdio, material físico e sombra de contato no papel |
| Acabamento | grão de filme, vinheta, fibra, riscos, aberração cromática de 2 px na gravura (09) | grão em 3 campos a 12 qps, fibra em luz suave, riscos e poeira de filme, vinheta, aberração cromática e feixe de luz diagonal por cenário |
| Áudio | voz + trilha documental contínua a -14 LUFS (LRA 1,4 a 3,5), efeitos de papel e corte bem baixos | trilha `misterio`/`antigo`; papel, baque surdo, rabisco, tiques de máquina e sopro curto no corte, de -16 a -26 dB |

## Formas (`{ "tipo": "colagem3d", "forma": ... }`)

`foto` (com o elemento `imagem`; 2 fotos lado a lado do mesmo tamanho; com `peca`, o objeto sai do papel na frente da foto), `retratos` (3 a 6 fotos em grade com as etiquetas), `pilha` (fotos que caem uma sobre a outra), `objeto` (`peca`), `titulo` (`texto` até 22 letras impresso no papel, com `peca` opcional embaixo), `numero` (`texto` até 12), `jornal` (`texto`: a manchete da própria fala; a foto do beat em retícula), `documento` (`texto`: a linha datilografada da fala, com tarjas e assinatura), `cta` (o cartão pautado com "comente" e a palavra na caixa de marca-texto).

Campos: `chave`, `marca`, `chegada` (`cai`, `desliza`, `surge`, `vira`, `corte`), `transicao` (`corte`, `flash`, `desfoque`, `iris`, `fusao`, `slide`, `luz`, `chicote`; ver Rodada 4), `peca`, `objetos`, `tratamento`, `borda`, `rotulos`, `semRotulo`, `atraso`. Na `imagem`: `rotulo` (o texto da etiqueta; padrão, o nome buscado).

## Cenários e câmeras

No cena.json, por beat: `"cenario": "<id>"` e `"camera": { "mov": "<nome>" }`. Sem pedido, o plano automático escolhe o papel pelo assunto do vídeo, troca quando a frase pede outro e escolhe a câmera pela forma, sem repetir a do vizinho.

| Cenário | Papel e props | Recorte padrão | Realce | Câmera padrão |
|---|---|---|---|---|
| `papel-creme` | creme com gravura de fachada apagada, mancha de café | cor, sem moldura | caixa amarela | `empurra` |
| `papel-cinza` | cinza com coluna apagada e feixe de luz diagonal | P&B, borda branca | caixa escura | `paralaxe` |
| `jornal` | colunas cegas e cabeçalho gigante apagado | retícula, borda rasgada | faixa azul | `empurra` |
| `mural-escuro` | feltro preto, selo, moedas de cobre, clipe, folha solta | P&B, borda branca | itálico | `orbita` |
| `mesa-madeira` | tábuas envernizadas, régua, folha solta | sépia, polaroide | itálico | `mergulho` |
| `toalha-xadrez` | xadrez rosa ondulado, fita | cor, borda branca | caixa preta | `mergulho` |
| `ceu-sepia` | céu com sol estourado e nuvens em 3 camadas (paralaxe) | sépia, sem moldura | itálico | `desce` |
| `tapete-corte` | mesa branca com base de corte verde quadriculada, fita | cor, polaroide | caixa amarela | `mergulho` |
| `gravura` | papel de gravura com hachura, aberração cromática | gravura | caixa amarela | `empurra` |
| `estudio-branco` | branco com vinheta suave | cor, borda branca | caixa amarela | `recua` |
| `arquivo-ambar` | arquivo em duotom âmbar com feixes de luz diagonais e poeira | âmbar, borda branca | itálico | `paralaxe` |

Câmeras: `empurra` (1,00 a 1,09 no beat), `recua` (de 1,16 em 1,6 s), `paralaxe` (140 px de lado com 8 graus de giro), `orbita` (-8 a +8 graus, inclinada 5), `desce` (260 px em 1,4 s), `mergulho` (de 24 graus sobre a mesa a de frente em 1,3 s), `corte-close` (plano geral e corte seco para o close da foto na palavra-chave), `chicote` (chega de lado com rastro em 0,28 s), `fixa` (deriva de 4 px). A trava da área segura encolhe zoom e deslocamento até a colagem caber (x 84 a 996, y 300 a 1270): a câmera nunca empurra o protagonista para fora nem para a legenda.

### Como criar um cenário novo (4 passos)

1. **Escreva o módulo, só com dados.** No projeto, em `projetos/<nome>/pecas.js`:
   ```js
   export const cenariosEstilo = { colagem3d: {
     'mapa-antigo': { nome: 'Mesa com mapa', temas: ['viagem', 'navio', 'descoberta'],
       ambiente: { fundo: ['#E8DCC0', '#CDBB98'], papel: 'creme' }, luz: { tipo: 'topo', cor: '#FFF1D8', forca: 1 },
       nevoa: null, particulas: { poeira: 0.4 }, props: [{ tipo: 'carimbo', x: 0.85, y: 0.15 }, { tipo: 'moeda', x: 0.12, y: 0.8 }],
       clima: 'solene', camera: 'mergulho', foto: { tratamento: 'sepia', borda: 'rasgada' },
       texto: { tinta: '#1A1714', realce: 'caixa', corRealce: '#F3E650' }, acabamento: { grao: 0.5, vinheta: 0.3, fibra: 0.3, cromatica: 0, riscos: 0.2 } },
   } };
   ```
   Para valer em todo projeto, crie `src/video/engine/colagem3d-cenarios/<id>.js` com o mesmo objeto (mais `id`) e acrescente o import em `colagem3d-cenarios/index.js` (repositório do mantenedor).
2. **Use só o vocabulário do estilo:** papel `creme`, `cinza`, `jornal`, `escuro`, `madeira`, `xadrez`, `ceu`, `corte`, `gravura`, `branco`; luz `janela`, `estudio`, `topo`, `lateral`; props pintados `arquitetura`, `coluna`, `texto-jornal`, `manchete`, `grade-corte`, `mancha`, `carimbo`, `luz-diagonal` e props 3D `nuvens`, `fita`, `moeda`, `clipe`, `selo`, `papel-solto`, `regua`; câmera um dos nomes acima.
3. **Peça no cena.json** (`"cenario": "mapa-antigo"`) ou deixe os `temas` levarem o plano automático até ele.
4. **Rode o teste e o QA:** `node --test test/estilo-colagem3d.test.mjs test/cenarios-estilo.test.mjs` valida todo cenário registrado; o validador da cena recusa id ou prop que não existe; o verificador do QA (`estilo-colagem3d-verificar.mjs`) reprova câmera que tira a colagem da área, tranco fora dos cortes, legenda que não cabe numa linha e papel que não cobre o quadro.

## Plano automático

`src/video/autoplano-colagem3d.mjs`: foto da pessoa ou do lugar citado vira o recorte com etiqueta (3 ou mais, a grade de retratos); jornal, notícia e manchete viram a página de jornal com a manchete da fala; lei, carta, contrato e protesto viram o documento; número dito vira o número impresso ("6 milhões", com "+" quando a fala diz "mais de"); peça 3D vira o objeto; gancho sem imagem vira o título; o último beat vira o cartão do fecho. Flash na virada ("Mas", "Só que", "Porém"), chicote a cada 4 planos.

## QA e revisão

- O QA mede a colagem como UM protagonista (fotos, objetos, etiquetas e textos impressos juntos: a colagem se sobrepõe de propósito); título e número impressos sozinhos contam como título do estilo.
- Revisão a 5 qps: cada plano mostra o que a frase diz? A pessoa citada tem foto real e etiqueta? O recorte tem borda, sombra e nunca encosta na legenda? A legenda fica numa linha sobre o papel limpo? O marca-texto abraça o detalhe certo? O papel cobre o quadro (sem faixa vazia) e nenhum quadro fica sem protagonista na troca? O tecido e as grades nunca formam uma faixa reta de cima a baixo?

## Rodada 2 (02/11/2026): exceção da casa, lente, câmera e o que faltava

**Exceção do estúdio, só neste estilo:** a imagem pode encher o quadro e o texto e a legenda ficam SOBRE a foto, como nas referências. A legenda vai no meio (y 1060, Instrument Serif 64 px, uma linha) com a tinta escolhida pela luz medida atrás dela (letra clara com sombra escura sobre a foto, letra escura com brilho claro sobre o papel claro). O QA mede a colagem inteira como imagem (o texto por cima é permitido); as outras travas continuam: nada vazando das margens, sem faixa preta, quadro 0 certo, legenda numa linha sem corte.

- **Formas novas:** `tela` (foto de tela cheia; foto deitada vira a foto nítida na largura do quadro sobre ela mesma desfocada e escurecida, sem ampliar além da resolução) e `personagem` (personagem 3D posado, referência 11: `personagem` = `inventor`, `cavalheiro`, `operario`, `dama`, `reporter`; `pose` = `de-pe`, `apontando`, `pensativo`, `bracos-cruzados`, `acenando`, `caminhando`, `sentado`, `maos-no-bolso`). Personagens e poses são dados registrados no mecanismo comum (`registrarPersonagens` em `cenarios-estilo.js`); o projeto traz os seus em `pecas.js` (`export const personagensEstilo = { colagem3d: {...} }` e `posesEstilo`).
- **Cor seletiva de verdade** (09, 12, 15): `"pinta": { "cor": "#F2D21C", "forma": "poligono", "pontos": [[x, y], ...] }` (ou `elipse`/`retangulo` com `area: [x, y, l, a]`), em fração da FOTO inteira: na palavra-chave a área do objeto troca de cor mantendo a luz e as linhas (modo "color" mais "overlay").
- **Íris** (08): `"borda": "circulo"` (a foto num círculo) e `"transicao": "iris"` (o plano abre num círculo a partir do foco em 0,4 s).
- **Câmeras novas:** `dolly` (entra 20% acelerando), `rack` (foco que muda do fundo para o recorte), `zoom-rapido` (18% em 0,35 s na palavra, com borrão), `whip` (chicoteia para o lado nos últimos 0,25 s, o corte cai no borrão). Toda câmera tem mão sutil (3 px e 0,15 grau) e se combina com os planos internos do beat.
- **Lente:** profundidade de campo em duas camadas (papel e fundo / recortes e objetos), com o foco que muda; halo de brilho nas luzes altas; flare leve que acompanha a câmera; aberração cromática radial em todo quadro (mais forte na gravura); borrão de movimento direcional medido pela velocidade da câmera; grão de filme e vinheta.
- **Cenários novos:** `arquivo-ambar` (duotom âmbar com feixes de luz, 14) e `oficina-madeira` (tábuas e luz morna para o personagem, 11); 12 cenários no total.

## Rodada 3 (02/11/2026): feedback da revisão no Reel

- **Legenda em 70% da altura** (centro em y 1340, centrada; o tamanho ficou), em todas as cenas do estilo, sobre a foto ou o papel.
- **Cor de destaque da marca**, nunca amarelo fixo: marca-texto, sublinhado, etiqueta, caixa de realce, pintura do objeto, cartão do fecho e capa leem `destaque` da página (`marca/tokens.json`, personalizável pelo aluno), em três tons derivados (forte no traço, claro atrás de texto escuro, escuro). O estilo não sobrescreve mais o `destaque` da página.
- **Desfoque só no fundo:** a foto, o recorte e o objeto nunca desfocam; a profundidade de campo e o foco que muda agem só na camada do papel. A foto de tela cheia nunca recebe desfoque.
- **Destaque fora do rosto:** na foto de pessoa o marca-texto vira o sublinhado da etiqueta do nome (nunca círculo ou halo no rosto, nunca solto).
- **Tela cheia de verdade:** a foto cobre o quadro no aspecto dela (sem faixa vazia), com pan suave até o `foco` e um recorte de 7% que tira a margem do escaneamento; o tratamento retícula não vale na tela cheia (vira P&B).
- **Fotos em alta:** buscar com `scripts/buscar-imagem.mjs <projeto> "<termo>" --largura=3000`; foto com original pequeno (abaixo de ~1500 px) fica em cartão, nunca em tela cheia.
- **Transições:** a lista da rodada 3 foi substituída na rodada 4 (abaixo), depois da varredura quadro a quadro.
- **Personagens** com pele de poros e sheen quente, olhos com esclera, íris e pálpebra, boca, queixo, cabelo esculpido, tecido com trama, mãos com polegar e dedos, e braço que gira no ombro (pose de braços cruzados de verdade).

## Rodada 4 (02/11/2026): varredura quadro a quadro e legibilidade
Base: a varredura interna das referências (15 logs e folhas a 5 qps com timecode, fora do kit). Folha com timecode de qualquer vídeo: `node scripts/folha-timecode.mjs <video> <pasta> [qps] [colunas] [linhas] [largura]`.
- **Legenda legível em qualquer fundo:** o motor mede o fundo atrás da legenda em cada quadro, escolhe letra clara ou escura pelo contraste WCAG e, se nenhuma passa de 4,5:1, põe uma placa escura translúcida com a opacidade mínima que garante 4,5:1; contorno e sombra macia sempre. A palavra-chave fica numa caixa no tom claro da cor de destaque da página com letra escura. O QA reprova (`legenda-contraste`) qualquer quadro abaixo de 4,5:1.
- **Só a cor da marca:** realces, etiquetas, fitas, marca-texto e xadrez usam o destaque da página (`marca/tokens.json`); nenhum azul ou turquesa. O fecho (`cta`) usa o cenário `marca-pagina`: fundo e acentos da marca, então quem troca a marca troca o fecho junto.
- **Transições medidas:** `corte` (padrão), `flash`, `fusao` (0,33 s), `slide` (o plano anterior sai voando para cima e para a direita), `luz` (clarão de fogo quente), `iris`, `desfoque` e `chicote`. Saíram `rasgo`, `folha`, `zoom-recorte`, `wipe` e `glitch`: não existem nas referências. O plano automático usa corte na maioria e alterna fusão, slide e luz sem repetir.
- **Câmera medida:** empurrão e recuo constantes de 9%/s (as referências ficam entre 7 e 16%/s), planos internos de 1,1 s alternando os dois; `rack` quando o objeto entra; `mergulho` só na mesa de madeira; o plano automático não usa mais chicote nem whip.

## Rodada 5 (02/11/2026): legenda forte, ritmo medido e transições inteiras
- **Legenda:** sem placa só sobre papel liso com contraste de 7:1; sobre qualquer foto ou fundo com textura entra a placa escura (opacidade de 0,62 a 0,94, a mínima que dá 7:1 contra o pixel mais claro), letra clara e contorno escuro de 5 px. A placa aparece junto com a primeira palavra. Tamanho igual ao aprovado (64 px). Na foto de tela cheia não há névoa do cenário.
- **Ritmo pelas medidas** das referências: planos internos a cada 0,95 s a partir de 1,7 s de beat; o plano automático põe flash no rodízio (as referências têm de 8 a 16 flashes por minuto).
- **slide** (0,42 s): cada recorte do plano anterior voa separado, um depois do outro, girando, com sombra; se o plano anterior era de tela cheia, voa a foto inteira. **luz**: clarão quente com faíscas que sobem, sempre longe da borda.
- **Título ou número com peça:** a peça ocupa o papel (640 x 580) e o título sobe; nada de metade de baixo vazia.
- **Pessoa sem nome:** prefira foto de arquivo real recortada (na referência 11 a figura é uma ilustração pintada); o boneco 3D é só a reserva quando não há foto.

## Rodada 6 (02/11/2026): ritmo e energia pelo video-sharingan
- **Cortes:** planos internos a cada 0,66 s a partir de 1,3 s de beat, inclusive no close; enquadramentos bem diferentes (close de 1,38 com recorte 1,5, aberto deslocado, meio-close de lado). Meta: 45 a 60 cortes por minuto.
- **Golpe de câmera:** no começo de cada plano a câmera entra ou sai 12% em 0,45 s (power3.out) com um pan curto (power2.out), alternando.
- **Flash interno:** um em cada 5 cortes internos (0,1 s, com swell baixo); com os das viradas, 8 a 16 por minuto.
- **Look:** vinheta e grão com piso em todo cenário; o encoder usa x264 crf 18 com ajuste de grão no colagem3d.
- **Desfoque:** continua só no fundo (regra do estúdio), nunca na foto.

## Rodada 7 (02/11/2026): câmera fluida (substitui o golpe e o flash interno da rodada 6)
A revisão achou a câmera da rodada 6 "agitada, pulando". Os perfis foram medidos nas referências (estudo interno, fora do kit).
- **Um deslize contínuo por plano:** empurrão ou recuo de 6%/s, travelling e tilt de ~13% da largura por segundo. A curva é power1.out com rampa: entra andando e desacelera, sem parada seca. O plano seguinte continua a frase, e o lado do travelling só troca a cada 8 beats.
- **Trava por plano:** se o movimento não cabe na área segura, o plano inteiro anda menos. Nunca freia no meio.
- **Reenquadre:** o mesmo recorte só corta para o close depois de 1,4 s (1,2 s no gancho), no máximo 2 vezes. Corte novo de verdade é conteúdo novo: num beat longo de foto, divida o beat e ponha outra foto.
- **Flash:** só na virada da fala. **Ênfase** (`zoom-rapido`): smootherstep em 1 s, sem borrão.
- **Look:** grão e vinheta fortes só nas cenas de foto e de papel escuro; no papel claro, os do cenário. Aberração cromática desligada (nenhuma referência tem). Desfoque do fundo em faixa horizontal no plano aberto e em ponto no close.
- **Verificador:** mede a câmera a 30 qps. Reprova velocidade acima de 60% da largura por segundo, aceleração acima de 150, jerk acima de 600, reenquadre abaixo de 1,2 s e reversão acima de 60%.

## Rodada 8 (02/11/2026): capa, textura de colagem, fecho sem peça chapada, energia e ritmo
A revisão da rodada 7 apontou três defeitos (capa, fundo liso nas cenas de ano, o carro 3D do fecho) e o sharingan mostrou câmera tímida, poucos cortes, rack focus ausente e grão fino. Tudo foi para a raiz do estilo.
- **Capa do estilo** (`estilo-colagem3d-capa.js`, desenhada por `capa()` em `estilo-colagem3d.js`): hierarquia de cima para baixo. A foto INTEIRA e legível (até 760 x 770 px, y 300 a 1070) sobre um retalho kraft, a etiqueta do nome presa na borda de baixo da foto (folga de 22 px), e SÓ DEPOIS, num retalho creme limpo (y 1200 a 1630), o título em Instrument Serif de até 128 px, em no máximo 3 linhas equilibradas, entrelinha de 1,16, sem terminar linha em palavra fraca. O marca-texto da cor da marca é medido pela largura real da palavra e fica alinhado ao corpo dela (de 0,62 do corpo acima da linha de base a 0,14 abaixo), nunca atrás de outra linha. A legenda do vídeo não entra. Sem desfoque de fundo. `conferirCapa` (puro, testado) reprova título sobre a etiqueta (folga menor que 36 px), linhas coladas, marca-texto fora do corpo da palavra, título fora do retalho ou do recorte 3:4 do grid; o verificador do QA chama a mesma conferência (tipo `capa`).
- **Textura de colagem** (referências 01, 02, 04, 05, 14: papel com fibra visível, oxidação, dobras, grão, recortes, fita, carimbo): (1) o papel de todo cenário ganhou `realismoPapel` (pintas de oxidação, fibras longas e fios coloridos, vincos com fio claro, riscos de uso), fibras 2 vezes mais fortes, relevo 2 vezes mais marcado (`bumpScale` 2,6), grão do papel de 15 níveis; (2) a fibra por cima do quadro subiu de 0,22 a 0,8 do cenário; (3) número, título, documento e foto em cartão recebem sozinhos **colagem de fundo** (`decorFundo` no layout): retalhos de papel rasgado (kraft, jornal cego, pautado, quadriculado, creme; o papel claro leva retalho escuro e o escuro leva creme), fitas, carimbo de tinta com a palavra (`carimbo` no elemento: PATENTEADO, EXPIROU), e, se o beat traz uma foto, um recorte dela em sépia com borda rasgada e fita. Retalhos e fitas ficam na camada do papel (`fundo`), então não contam como protagonista nem prendem a câmera; o recorte decorativo (`deco`) fica nítido. Na foto de tela cheia, `rotulo` põe a etiqueta do lugar presa na imagem. O verificador reprova `cena-lisa` (menos de 2 camadas de fundo nessas formas).
- **Fecho sem peça chapada:** o fecho deixou de ser carro cinza com nuvem. O estilo fecha com foto (polaroide da cena) ou com o cartão de CTA sobre retalhos. O verificador avisa `peca-sozinha` quando um beat usa uma peça 3D sozinha (marque `pecaAprovada: true` só depois de conferir material, espessura e sombra de contato a 5 qps).
- **Energia de câmera** (sharingan: máx 7,8 contra 11 a 69 %L/s): push e pull de 10%/s, travelling de ~24% da largura por segundo (travMax 300 px), o gancho (4 primeiros beats) anda 1,3 vez e o fecho 0,4. Aceleração constante (curva `suave`): jerk dentro do limite de 600 do verificador.
- **Ritmo:** beat de 2,4 s ou mais já ganha o segundo plano (passo de 1,2 s, o mínimo do verificador); o corte novo de verdade vem de conteúdo novo: frases longas viram 2 beats com imagens diferentes (foto, número, título, documento, retalho). O verificador avisa `ritmo-baixo` abaixo de 38 cortes por minuto.
- **Rack focus de verdade:** a câmera `rack` agora usa o deslize e move o foco do FUNDO (nítido no corte, desfoque de até 22 px em 0,9 s; a foto e o recorte nunca desfocam). O desfoque base do fundo caiu de 9 para 5,5 px para a textura aparecer.
- **Grão:** o grão de 2 x 2 px no quadro e, no encode, ruído temporal do FFmpeg (`noise=alls=4`, só colagem3d) com teto de 16 Mb/s no x264 (com 12 Mb/s o controle de taxa apagava o grão).
- **Título maior:** a largura média da serifada condensada é 0,44 em (antes 0,5).

## O que não copiar

Imagens, pessoas geradas, marcas, nomes de jornais, frases, roteiros, vídeos e músicas das referências. A legenda no meio da foto da referência não entra (a casa põe a legenda sobre o papel limpo). Fontes: Instrument Serif (OFL), Special Elite (Apache 2.0), Antonio e Playfair Display (OFL), registradas em `AVISOS-TERCEIROS.md`.

## Rodada 9 (02/11/2026): grão sem areia, legenda alinhada e tempo de leitura
A revisão viu na prévia (comprimida): ruído pesado na faixa escura da legenda e na borda do papel, a caixa da legenda desalinhada com o marca-texto estourando a base, e o beat de ~7 s "passando rápido demais". Tudo foi para a raiz do estilo, com medida antes e depois.
- **Grão** (`src/video/grao.mjs`, `encoder.mjs`, `render.mjs`, `estilo-colagem3d.js`): causa em três camadas somadas, o grão de 2 x 2 px desenhado no quadro, o `noise=alls=4` do FFmpeg no quadro inteiro (croma incluído) e o x264 `-tune grain` a 16 Mb/s, que o transforma em manchas grossas ao comprimir. Agora: sem o grão de 2 x 2 px, grão de 1 px a no máximo 0,34 de alfa, ruído do FFmpeg só de luma (`noise=c0s=2:c0f=t`) multiplicado por uma máscara de luz (zero abaixo de 30% de luma, cheio acima de 55%, desfocada), então escuros e a placa da legenda ficam limpos; a legenda é desenhada DEPOIS do grão e da lente; x264 crf 20, teto 10 Mb/s, sem `-tune grain` (de 83 MB para ~50 MB). `ILU_GRAO_C3=0` desliga o grão (render de referência), outro número troca a força.
- **Verificador de grão** (`medirGrao` e `conferirGrao`, chamados pelo `checarVideo` do QA): mede, em quadros a 720 px, blocos planos de 32 x 32 e separa ruído fino (pixel contra média 3 x 3) de ruído grosso (média 3 x 3 contra média 13 x 13), por faixa de luz. Reprova `grao-alto` acima de fino 2,2, grosso 1,2 ou grosso 1,1 em área escura (`TETO_GRAO`).
- **Legenda alinhada** (`placaLegenda` e `conferirLegenda` no layout): a placa, a caixa do marca-texto e o texto saem da mesma geometria, medida pela altura real da letra (`measureText`, com acento e descendente). A placa acompanha as palavras já ditas, com padding igual nos quatro lados (`legenda.pad` 18 px mais a folga do marca-texto quando ele está na ponta), e o marca-texto fica sempre dentro dela. O motor devolve a geometria em `legenda.geo` e o QA reprova `legenda-alinhamento` (margens esquerda e direita ou de cima e de baixo diferentes em mais de 3 px, padding abaixo de 8 px, marca-texto fora da caixa).
- **Atropelo** (`atropeloColagem3d`, `REGRAS_C3.atropelo`): reprova beat de menos de 0,85 s (`atropelo-beat`), dois beats seguidos somando menos de 2,0 s, isto é, 3 cortes em menos de 2 s (`atropelo-janela`), fusão, slide, luz ou íris em beat de menos de 1,2 s (`atropelo-transicao`) e câmera acima de 30 %L/s, ou de 24 em beat de menos de 1,3 s (`atropelo-camera`). A causa do beat de 7 s: "Nova York" durava 0,64 s com foto nova, depois de uma fusão de 0,33 s no beat anterior, e o travelling da paralaxe ia a 38% da largura por segundo (a foto de tela cheia inteira deslizando). O travelling caiu de 260 para 150 px por segundo (pico de 22%L/s).
- **Planejador** (`juntarBeatsCurtos`, `cortarTransicoesLongas`): beat de menos de 0,85 s se junta ao vizinho mais curto e transição longa em beat curto vira corte. `antecipa` (segundos, até 0,4) no beat adianta o corte antes da palavra (padrão 0,12) para repartir uma pausa e dar leitura sem perder o ritmo.




