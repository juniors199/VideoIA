

# Repertório 3D: como o motor gera os objetos

Dois tipos de peça. As **procedurais** são código: formas simples do three.js (caixa arredondada, cilindro, esfera, cápsula, toro, cone, revolução, extrusão de silhueta, tubo) montadas em um `Group`, com **seis materiais fixos** da marca; servem para símbolo, diagrama e objeto simples. Os **modelos GLB** (`glb-*`, seção no fim) são arquivos 3D CC0 bem feitos, harmonizados pelo motor com o material da casa; servem para objeto complexo (animal, veículo, comida, móvel, prédio, pessoa), onde primitiva vira peça mal gerada. Os dois têm render determinístico e a mesma entrada, luz, sombra e encaixe.

## As camadas
1. `engine/pecas.js`: formas primitivas e objetos do dia a dia (casa, prédio, carro, cadeado...).
2. `engine/mundo.js`: peças de mundo **animadas pelos dados** (grade que acende, hemiciclo, dominós, chuva de moedas).
3. `engine/sdf.js` (exportado pelo kit): modelagem **orgânica** por função de distância (SDF), veja a seção abaixo. Peças feitas assim ficam em `engine/repertorio/organicos.js`.
4. `engine/kit.js`: helpers para montar objetos novos (`torno`, `extruda`, `tubo`, `placa`, `lugar`...) e, para acabamento, `placaBisel` (placa de cantos redondos com bisel macio), `retArred` (silhueta de cantos redondos), `fuso` (cápsula que afina: dedo, cabo, perna), `tuboVar` (tubo de raio variável: banana, cenoura, lava) e `centra` (recentra o grupo na origem).
5. `engine/repertorio/*.js`: o repertório ampliado, por tema (cidade, trabalho, tecnologia, vida, diagramas, figuras, política, bíblia, finanças, geral, cenas, mídia, Brasil e, desde outubro de 2026, `corpo.js`, `escola.js` e `cotidiano.js`).
6. `engine/runtime.js`: pega o nome da forma da cena, chama a fábrica `(Ms, dados, P)`, dá luz, sombra, entrada em mola, câmera e brilho.

## Materiais (primeiro argumento `Ms`)
`frente` branco fosco, `sombra` cinza, `destaque` laranja, `apoio` bege, `ativo` laranja aceso (o bloom vira luz), `apagado` cinza claro. `P` é o material do papel que a cena escolheu para a peça (`papel: "destaque"` pinta a parte principal de laranja).

## Regras de qualidade das peças
- Reconhecível de longe pela silhueta; no máximo uns 40 meshes; 1 a 1,6 unidade de tamanho, centrada na origem.
- Cor: a parte principal usa `P`, o resto `frente`/`sombra`/`apoio`; no máximo 2 detalhes em `destaque`.
- Sem texto narrativo (o texto entra como rótulo, título ou contador). Textura procedural leve é obrigatória quando o objeto tem superfície (tecido, couro, madeira, metal, papel impresso, nuvens de planeta, tela de interface): nunca foto, nunca arquivo de imagem. Transparência só em vidro, com reflexo.
- Vista de qualquer lado (a peça gira devagar). Se só funciona de frente, marque `g.userData.plana = true`.
- Se anima, `g.userData.anima = (ent) => {}` é função pura de `ent` (segundos desde a entrada).

## Nunca chapada (regra do produto)
Peça com cara de ícone chapado reprova, mesmo que a silhueta esteja certa. O estúdio decidiu, em outubro de 2026, que isto valha para todos os elementos que existem e para todos os que forem criados. "Chapada" é a peça que tem dois ou mais destes sinais:
- material liso, sem nenhuma variação (sem textura, gradiente, relevo, brilho de borda nem segunda cor de material);
- só primitivas lisas (caixa, esfera, cilindro) no lugar das partes reais do objeto;
- detalhe representado por bolinha ou bloco (calabresa em disco preto, texto em barra, números em quadradinhos iguais);
- sem espessura (folha, tela ou placa sem borda nem bisel) ou sem a sombra de contato no chão;
- proporção inventada (raio em pílula, anel grosso como tubo, ponteiro em retângulo).

Como resolver, sem pesar o render: `engine/repertorio/acabamento.js` (no `pecas.js` do projeto: `kit.acab`). Texturas em canvas geradas uma vez e guardadas em cache (`texCanvas`, `texTecido`, `texManchas`, `texGradiente`, `texMoeda`, `texGrelha`, `texMostrador`, `texPlaneta`, `texSol`, `texAnel`), planeta com faixas e brilho de borda (`planeta`, `bordaLuz`), halo em sprite (`halo`), estrias e serrilha no raio (`deslocaRaio`), material derivado que acompanha a cor viva do estilo (`comMapa` + `segueCor`) e mistura de cores em sRGB (`mistura`, `hexDe`). **A cor vem sempre do material da peça** (`P`, `Ms.*`), clareada ou escurecida: assim a peça continua na identidade de cada estilo (marca, papel, minimalista). Peça do projeto que pareça chapada gera aviso no relatório do vídeo e na `--galeria --projeto=<nome>`.

Referência do padrão: as folhas antes e depois em `marca/saida/refino/` (planeta, Sol, pizza, calendário, monitor, documento, figuras humanas e os lotes de refino).

## Padrão de qualidade (checklist para peça nova ou revisada)
Passe por todos os itens antes de dar a peça por pronta. Foi o padrão usado no refino de 2026 (folhas em `marca/saida/galeria/refino/`).

**Silhueta e proporção**
- [ ] Lê de longe pela silhueta, em miniatura e girando (a peça gira 0,3 rad/s; peça de frente, como tela, painel ou móvel de parede, marca `plana`).
- [ ] Proporções do objeto real, estilizadas e não inventadas (na mão: médio maior, mínimo menor, palma mais alta que larga, polegar saindo da base).
- [ ] Partes ligadas por junção visível (virola, punho, dobradiça, pé). Nada flutuando, nada atravessando outra parte de um jeito feio, nenhuma "base solta" que não pertence ao objeto.
- [ ] Forma orgânica é **massa única** por SDF (`engine/sdf.js`, seção abaixo): partes fundidas com união suave, afinando, sem emenda; perfil simples de revolução pode ficar no `torno`.

**Acabamento**
- [ ] Nenhuma aresta viva: `placaBisel`/`extrudaForma` com bisel, `caixa` com raio, perfil de `torno` com canto arredondado.
- [ ] Espessuras coerentes entre si (aro, cabo e tampa com a mesma "família" de espessura; nada de haste de 0,01 ao lado de bloco de 0,5).
- [ ] Detalhes reais do objeto que dão leitura (furo da chave, rosca e filamento da lâmpada, 60 marcas do relógio, serrilha da moeda, costura da camiseta, argolas do calendário), nunca bolinha ou bloco no lugar deles. Número só quando é parte do objeto (dias do calendário, mostrador); nunca dado inventado.

**Cor e material**
- [ ] Parte principal em `P`; o resto em `frente`/`sombra`/`apoio`; no máximo 2 detalhes em `destaque` (use `acento(Ms, P)`: se `P` já é laranja, o acento vira branco).
- [ ] Teste com `papel: frente` e `papel: destaque`: as duas versões precisam ler.
- [ ] Material com variação: textura procedural leve (canvas, em cache), gradiente de volume, relevo (`bumpMap`) ou brilho de borda; nunca o material liso sozinho em objeto que tem superfície. Cores derivadas de `P`/`Ms`.
- [ ] Espessura e bisel em tudo que é folha, tela ou placa; a peça apoia no chão com sombra de contato (o motor faz a sombra; não esconda com `semSombra` o que é sólido).
- [ ] Transparência só onde o objeto é vidro e com reflexo (lente da lupa, bulbo, vidro do relógio): material físico leve, nunca para esconder geometria.

**Tamanho, centro e custo**
- [ ] Lado maior entre 1 e 1,6 unidade, centrada na origem (`centra(g)` resolve), mesma "presença" das peças vizinhas na galeria.
- [ ] Até ~30 meshes (`funde` ou um perfil só quando passar disso). Animação, se houver, é função pura de `ent`.
- [ ] Variações do mesmo objeto por `dados` com a mesma construção (ex.: `mao` com `dados.gesto`: `aberta`, `aponta`, `joinha`, `L`, `paz`, `punho`), nunca peça nova com nome novo.
- [ ] Nome e API mantidos ao revisar: peças já estão em `cena.json` de projetos.

**Prova**
- [ ] `node src/video/cli.mjs --galeria <nomes> --por=4` antes e depois, e conferir a imagem (não só o código).
- [ ] `npm run catalogo` e `npm test` passando.

## Peça orgânica: SDF (massa única, sem emenda)
Juntar esfera, cápsula e elipsoide dá cara de bonequinho de primitivas: emendas visíveis e silhueta dura. Para tudo que é **orgânico** (mão, bicho, fruta, nuvem, coração, gota de massa, cérebro, pessoa, pão, osso, dente) use `engine/sdf.js`: a forma é descrita por uma função de distância e vira **uma malha só**, com as partes fundidas por união suave.

```js
const { SDF: S, malhaSDF } = kit;               // no repertório: import { SDF as S, malhaSDF } from '../sdf.js'
const forma = S.uniao(0.06,                     // k = raio da "massa" na junção (0 = união seca)
  S.elipsoide([0, -0.3, 0], [0.38, 0.4, 0.33]), // corpo
  S.esfera([0, 0.3, 0], 0.32),                  // cabeça, fundida no corpo
  S.tubo([[0.25, -0.6, 0], [0.55, -0.4, 0], [0.5, -0.1, 0]], 0.07, 0.05)); // rabo liso que afina
g.add(malhaSDF(forma, P, { passo: 0.014 }));
```
- **Primitivas:** `esfera`, `elipsoide(c, raios, rot)`, `capsula(a, b, r, r2)` (com `r2` vira cone arredondado), `caixa(c, meias, raio, rot)`, `cilindro(c, r, h, raio, rot)`, `toro(c, R, r, rot)`, `cadeia(pts, raios, k)` e `tubo(pts, r0, r1 | raio(t), n)` (curva lisa: dedo, rabo, cabo, sulco).
- **Operações:** `uniao(k, ...)`, `subtrai(k, a, b)` (cava: covinha da maçã, corte do pão, sulco do cérebro), `intersecta(k, a, b)` (achata a base da nuvem), `infla(d, f)`, `casca(e, f)`, `transforma({ pos, rot, escala }, f)`.
- **Malha:** surface nets + relaxamento + projeção exata na superfície; normais pelo gradiente (sem degrau, sem facetado). `passo` é o lado da célula: 0,011 para detalhe fino (dedos), 0,012 padrão, 0,014 a 0,016 para peça grande e lisa. Detalhe precisa de ~3 células de raio; vão entre partes de ~2 células.
- **Cache:** a malha sai de um cache pela assinatura da forma; pose e gesto entram como parâmetros (`formaMao(gesto)`), nunca recalcule por quadro. Peça que anima move **malhas inteiras** (rotação, posição, escala), não refaz a forma.
- **Custo:** até ~300 ms por peça na primeira vez (o teste mede); 0 depois. Se passar, aumente o `passo` ou troque cadeias longas por `tubo`.
- **Cores:** uma malha por material. Olho, nariz e botão vão rentes com `naPele(forma, de, dir)` (em `organicos.js`).
- **Quando NÃO usar:** objeto industrial (celular, prédio, cadeado, carro) fica com `placaBisel`/`torno`/`extruda`, que dão arestas limpas; SDF é para o que é mole, carnudo ou de massa. Corpo articulado que muda de pose a cada quadro (os `boneco*`) continua com partes separadas.
- **Prova:** galeria em close (`--galeria <nome> --por=1`) de frente, 3/4, lado e costas; folhas de referência em `marca/saida/galeria/refino2/`.

## Ampliação de outubro de 2026
- **80 peças procedurais novas** em três arquivos: `corpo.js` (órgãos por SDF, células, remédio, curativo, máscara, balança, mosquito, coluna), `escola.js` (lousa que escreve, régua, compasso, caderno, capelo, béquer, placa de Petri, bico de Bunsen, cristal, amonite, telefone de disco, máquina de escrever, gramofone, pena e tinteiro, esfera armilar, elmo romano, corrente partida, chapéu de cangaceiro, saca de café, cana, bateia, oca) e `cotidiano.js` (casa, rua, negócio local, esporte, documentos, tecnologia de bolso e fé). Lista e dados em `docs/cena/repertorio.md`; palavras do plano automático em `src/video/lexico/ampliado.json`.
- **88 modelos GLB novos** (Kenney Food Kit, Furniture Kit e Cube Pets; Quaternius pelo Poly Pizza): cozinha e comida, casa, bichos (inclusive mula, touro, cobra, sapo, morcego, aranha), dinossauros e esqueleto humano. Licença de cada um em `assets3d/LICENCAS.md`.
- **Tamanho garantido:** cada fábrica dos três arquivos novos passa por `noTamanho` (lado maior em 1,5, a mediana das peças antigas, num envelope escalado: o motor mexe no envelope de fora, a animação continua nos filhos).
- **Refino de peças fracas muito usadas:** `salarioenvelope` (a pessoa virou o ícone de massa única da casa, de frente), `maquininha` e `haltere` (de frente/de perfil, `plana`), sem mudar nome nem dados.
- **Prova:** `test/elementos.test.mjs` mede cada peça nova (até 40 malhas, lado de 1 a 1,6, centrada, papel principal em P, animação pura de `ent`), os GLB novos (tamanho, licença, léxico, catálogo), os sons v4 e as trilhas. A galeria (`--galeria`) agora monta a grade de verdade (as peças da folha vão com `sobre: true`; antes o encaixe juntava tudo numa fila).

## Social media refeito (0.6.12, 29/10/2026)
Pedido da revisão depois do Reel do FGC: "a maioria [das peças de seguir, comentar e compartilhar] não está legal". Mesmos ids e dados antigos (cenas antigas funcionam); helpers novos no topo de `engine/repertorio/midia.js` (`celularApp`, `vidroTela`, `avatarStory`, `iconeSeguir`, `pilulaSeguir`, `maoQueAperta`, `balaoComentario`, `seloContador`, `contornoFora`).
- `seguirperfil`: celular de verdade (metal com verniz, botões laterais, moldura preta, tela de vidro levemente emissiva com a interface em canvas: barra de status, nome, números, abas e grade de posts), avatar com anel de story em relevo e o botão Seguir em plástico laranja com o ícone de pessoa com +. Aos 0,95 s a mão SDF (`maoSDF` "aponta", de costas, manga bege) aperta: o botão afunda, o + vira o sinal de feito, o anel acende e saem faíscas. `dados.comentar`: balão de comentário digitando aos 1,4 s no canto de cima.
- `botaoseguir`: chip de perfil em pé (avatar redondo com anel em cima, pílula com pessoa e + embaixo), que vira sinal de feito aos 0,9 s. Deitado (`dados.lado: true`) ele tem 2 de largura para 1 de altura e não chega a 55% da altura útil sem vazar pela lateral (mundos e projetor recuavam para o curiosidades por isso).
- `compartilhar`: avião de papel dobrado (asas em V com fibra, quilha mais escura, vincos), visto de cima em 3/4, com rastro curvo tracejado que afina. `dados.envio`: celular com post na tela, o avião voa (ciclo de 2,2 s) até o avatar do amigo, que acende.
- `comentario`: balão e cauda numa silhueta só, face clara rebaixada, pontos em disco que digitam.
- `marcadorsalvar`: contorno da fita com recorte em V (curvo, com bisel) e o miolo de cetim que se preenche aos 0,5 s, com brilhos (antes saía de um bloco de livro e lia como "T").
- `sino` e `notificacao`: selo redondo com o contador "1" (parte do objeto); a notificação é um celular de verdade com o feed na tela e o aviso com o ícone do app.
- `cursorclique`: contorno escuro por offset real (antes, a barra só do lado esquerdo lia como bandeirinha). `curtida`: coraçõezinhos para fora do coração.
- Mantidas: `mensagemdm`, `feedcelular`, `contadorseguidores` e as demais do grupo (conferidas na galeria, sem defeito grave).
- **Prova:** `test/social-media.test.mjs` (ids, não vaza em todo o gesto, 3+ materiais com algum derivado, sombra de contato, animação pura, mão SDF, avião com volume); galerias antes e depois em `projetos/teste-social-media/galeria/`; vídeo de teste com os três CTAs em `projetos/teste-social-media/` e folha a 5 qps em `revisao/`.

## Frutas e flor com o detalhe real (outubro de 2026)
`engine/repertorio/frutas.js` (no grupo `vida`): `morango` (aquênios amarelos em covinhas, sépalas recortadas, cabinho, brilho úmido, vermelho mais escuro na ponta), `uvas` (bagas brilhantes de tamanhos um pouco diferentes, talo, pedicelos e gavinha), `banana` (faces suaves, pontas escuras, pintinhas de madura) e `flor` (margarida de pétalas finas e miolo de florzinhas), com estados em `dados.estado` para a parte de que a fala trata: `morango` `aquenio`, `close`, `corte`, `flor`; `banana` `aberta`; `flor` `ovario`. Exceção consciente às regras de cor: a fruta usa a cor real (o assunto pede), e o laranja da marca fica só no destaque didático (o anel do aquênio, o ovário). Malhas instanciadas (sementes, bagas, florzinhas) ficam fora da medida (`userData.semMedida`); o cacho tem um casco invisível do tamanho dele. Para conferir um estado, ponha a peça num beat e use `node src/video/cli.mjs <projeto> --foto=<segundo>`.

## Conferir
`npm run galeria -- tudo` gera folhas em `marca/saida/galeria`. `node src/video/cli.mjs --galeria casa,predio --por=4` mostra só as peças pedidas, grandes. `npm run catalogo` atualiza `src/video/formas.json` (lista oficial, conferida por teste contra o navegador).

## O método nunca fica preso ao que existe
Se a peça, o cenário ou o mundo que a cena pede não existe, **crie** no próprio projeto. Nunca troque o assunto por uma peça genérica só porque é o que existe (urna vira urna, não `cubo`; plenário vira plenário, não `palco`). Foto ou logo real: `node scripts/buscar-imagem.mjs` (abaixo).

### Peças e cenários do projeto: `projetos/<nome>/pecas.js`
Arquivo opcional, um ES module que exporta as fábricas. Não importa nada: tudo vem do `kit` recebido.
```js
export const pecas = {
  'urna-eletronica': (kit, d) => {
    const { THREE, Ms, P, placaBisel, caixa, cil, lugar, centra } = kit;
    const g = new THREE.Group();
    g.add(placaBisel(1.3, 0.9, 0.5, P, 0.1));                       // corpo no material do papel
    g.add(caixa(0.45, 0.3, 0.04, Ms.sombra, -0.3, 0.12, 0.26));       // tela
    centra(g);
    g.userData.anima = (ent) => { g.rotation.z = 0.05 * Math.sin(ent * 2); }; // só função de ent
    return g;
  },
};
export const cenarios = {
  'plenario': (kit, d) => {
    const { THREE, fosco, mix, marca } = kit;
    const g = new THREE.Group();
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), fosco(mix(marca.sombra, marca.fundo, 0.35)));
    piso.rotation.x = -Math.PI / 2; g.add(piso);
    g.userData.atm = { fundo: '#1a1a24' }; g.userData.piso = 'proprio';
    return g;
  },
};
```
- **O `kit`:** todos os helpers de `engine/kit.js` (`THREE`, `caixa`, `cil`, `esf`, `torno`, `extruda`, `extrudaForma`, `tubo`, `cone`, `toro`, `capsula`, `fuso`, `placa`, `placaBisel`, `retArred`, `arco`, `elipse`, `prismaN`, `grupo`, `lugar`, `prox`, `centra`...), as curvas de `engine/tempo.js` (`curva`, `janela`, `limita`, `lerp`, `mola`), `Ms` (os seis materiais da marca), `P` (material do papel da peça), `marca` (cores em hex), `rng(semente)` e, para cenário, `fosco(cor)`, `cor(hex)`, `mix(a, b, k)`. `d` são os `dados` do elemento ou do cenário.
- **Peça:** devolve um `Object3D` (de preferência `Group`), no contrato de sempre: `userData.plana`, `userData.estatica`, `userData.anima(ent)`.
- **Cenário:** devolve um `Group` com o piso em y = 0, no contrato de `engine/cenarios.js` (`userData.atm`, `piso`, `anima(t)`, `itens`). No beat: `"cenario": "plenario"` ou `{ "tipo": "plenario", "cor": "#8a6a4a" }` (dados livres).
- **Nomes:** minúsculas, números e hífen. **Nome igual ao de uma peça ou cenário do motor é erro** (a local nunca substitui a do repertório): escolha outro nome ou use a do motor.
- **Autocontida:** helper que a peça usa fica dentro da função (assim ela pode ser promovida depois).
- **Como entra no vídeo:** o pipeline embute o arquivo na cena (como as imagens), o motor carrega junto do repertório, o validador e o QA aceitam os nomes, e o conteúdo do `pecas.js` entra no hash do cache de quadros (editar a peça refaz só o que mudou).
- **Conferir:** `node src/video/cli.mjs --galeria --projeto=<nome>` (peças do projeto, folhas em `projetos/<nome>/saida/galeria`), `node src/video/cli.mjs --galeria-cenarios --projeto=<nome>` e um quadro com `--foto=12.5`.
- **Mesmo checklist de qualidade** das peças do motor (acima): silhueta reconhecível, nunca chapada (acabamento com `kit.acab`), até ~40 meshes, 1 a 1,6 unidade, cor principal em `P`, no máximo 2 detalhes em destaque, sem texto narrativo, bonita de qualquer lado.

### Promover uma peça boa para o repertório (só no repositório do mantenedor)
`npm run promover -- <projeto> <peca> [--grupo=geral] [--manter] [--simular]` move a fábrica para `engine/repertorio/<grupo>.js` (adaptada pelo `dePeca` de `engine/locais.js`), tira do `pecas.js` do projeto e roda `npm run catalogo`. Confira na galeria depois. **No kit do comprador o motor é protegido** (minificado e conferido pelo manifesto): lá não há promoção, e as peças novas ficam por projeto, funcionando do mesmo jeito.

### Fotos e logos reais: `scripts/buscar-imagem.mjs`
```bash
node scripts/buscar-imagem.mjs <projeto> "urna eletrônica" --listar        # candidatos com licença livre
node scripts/buscar-imagem.mjs <projeto> "urna eletrônica" --escolha=3     # baixa o 3º
node scripts/buscar-imagem.mjs <projeto> "Senado Federal" --fonte=senado   # só fotos da Agência Senado no Commons
node scripts/buscar-imagem.mjs <projeto> "Petrobras" --logo                # logo pelo Wikidata (P154)
```
Busca no Wikimedia Commons (só domínio público, CC0, CC BY e CC BY-SA; `--fonte=agenciabrasil|senado|camara|planalto` restringe às agências públicas publicadas lá) e logos pelo Wikidata. Baixa para `projetos/<nome>/assets/`, registra autor, licença e endereço em `fontes.md` (seção "Imagens") e imprime o elemento `imagem` pronto para a cena. Um pedido por vez, com espera crescente quando o servidor pede (429). Logo é marca registrada: só para identificar o assunto.

## Modelos GLB (`glb-*`)
**Quando usar:** o objeto é complexo e reconhecível pela forma (vaca, cachorro, ônibus, avião, pizza, hambúrguer, geladeira, arranha-céu, pessoa). **Quando não usar:** símbolo, diagrama ou objeto que o repertório procedural já desenha bem (moeda, cadeado, gráfico, documento): lá a peça procedural fala a língua da marca.

**Biblioteca do estúdio:** `src/video/engine/assets3d/` (168 modelos CC0 de Kenney, Quaternius e autores do OpenGameArt, ~7,4 MB), listados em `assets3d/biblioteca.js` (a ampliação de outubro de 2026 em `assets3d/biblioteca-ampliada.js`, somada no fim) (padrões de cada um: material, giro, inclinação, animação) com autor, pacote, URL e licença de cada um em `assets3d/LICENCAS.md`. Vai no kit do comprador. `node src/video/cli.mjs --galeria glb --por=4` mostra todos; `--material=clay` mostra na paleta da marca.

**Como o motor harmoniza** (`engine/modelos.js`):
- **Material:** `suave` (padrão): a cor original menos saturada, um pouco mais clara, puxada para o branco quente e fosca (sem metal, rugosidade alta). `clay`: a parte principal (área grande e cor viva) no material do `papel` da peça e as outras em `frente`, `sombra`, `apoio` ou grafite pelo tom: o modelo vira uma escultura da casa, e com `papel: destaque` fica laranja. `original`: como veio, só sem brilho de metal. `dados.partes` troca uma parte pelo nome do material.
- **Escala e centro:** a média dos dois lados maiores vira 1,3 unidade e o centro da caixa vai para a origem: a mesma presença de uma peça procedural vizinha (ônibus comprido e arraia achatada não somem).
- **Sombra, entrada e movimento:** iguais às outras peças (mola, sobe do chão, balanço de frente em 3/4; `giro` e `inclina` acertam a pose).
- **Animação embutida:** `AnimationMixer.setTime(ent * vel)`, função pura do tempo (dois renders do mesmo quadro saem idênticos; teste em `test/glb.test.mjs`). Modelo com esqueleto é medido por uma caixa invisível do tamanho real.
- **Sem rede:** o Node embute o .glb na spec (base64) e o motor lê com o GLTFLoader do three (servido de `node_modules`, como o resto do three); cache por hash na aba e no cache de quadros.

**Checklist para aceitar um modelo** (na biblioteca ou no projeto):
- [ ] Licença **CC0** comprovada na página da fonte (biblioteca: só CC0; projeto: CC0 de preferência, ou licença livre registrada em `fontes.md` com crédito).
- [ ] Low-poly limpo, estilizado, sem textura fotográfica, sem texto ou logo visível, proporções corretas, sem buracos ou faces invertidas.
- [ ] Na galeria, harmonizado, combina com as peças vizinhas (cor fosca, presença parecida) e lê de longe em miniatura.
- [ ] Até ~1 MB (a biblioteca inteira fica abaixo de 40 MB; hoje ~7,4 MB). Na biblioteca, prefira menos de 300 KB: um clipe só (`--anims=`), e confira o tamanho depois do preparo.
- [ ] Comida chata (carne, frigideira, tábua, chocolate) leva `inclina` (35 a 60 graus) para ler de frente; bicho de perfil leva `giro: 90`.

**Achar um modelo CC0 novo para um tema** (no projeto, sem mexer no motor):
1. Procure em fontes CC0: Kenney (kenney.nl/assets, tudo CC0; os kits têm pasta `Models/GLB format`), Quaternius (quaternius.com, CC0; também publicado no OpenGameArt), Poly Pizza (poly.pizza, filtre a licença CC0; cada modelo diz a sua), OpenGameArt (opengameart.org, filtre "CC0" na busca avançada). Confira a licença na página do modelo, não na do site.
2. Baixe o `.glb` (se vier `.gltf`, converta: `npx @gltf-transform/cli copy modelo.gltf modelo.glb`) para `projetos/<nome>/assets/<nome-do-objeto>.glb` (minúsculas e hífen). Ele vira a peça `glb-<nome-do-objeto>`.
3. Registre em `projetos/<nome>/fontes.md`, seção "Modelos 3D": nome, autor, fonte, URL e licença.
4. Confira: `node src/video/cli.mjs --galeria --projeto=<nome> --por=4` (e `--material=clay`). Ajuste `dados` (`material`, `giro`, `inclina`, `anim`) na cena. Se não combinar com a casa, descarte e procure outro, ou crie a peça no `pecas.js`.

**Para o mantenedor (biblioteca):** `scripts/preparar-glb.mjs` (fora do kit) converte a textura de paleta em uma cor por parte (o `clay` precisa disso), deixa só as animações usadas, simplifica se pedido e compacta (quantização que o GLTFLoader lê sem decodificador). Depois: entrada em `biblioteca.js`, linha em `LICENCAS.md`, palavras em `src/video/lexico/glb.json`, `npm run catalogo`, galeria conferida com Read e `npm test`.

## As peças também viram pontos
Qualquer peça (procedural, `glb-*` ou do `pecas.js` do projeto) pode aparecer em pontos com o elemento `pontos` (`"forma": "<peça>"`) e no estilo `pontilhismo`: o motor amostra a superfície das malhas por área, com a luz assada no brilho de cada ponto, e descarta a base larga e fina (em pontos ela vira um bloco). Peça com silhueta clara lê melhor em pontos; detalhe fino e peça achatada com furos (engrenagem, multidão pequena) tendem a virar nuvem. Confira com `node scripts/folha-pontos.mjs <projeto>` e veja `docs/pontilhismo.md`.




