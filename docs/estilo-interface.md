

# Estilo interface: a tela executa o verbo da fala

`"estilo": "interface"` desenha interfaces genéricas (sem logo nem nome de produto) que **fazem o que a narração diz, no instante em que diz**: o texto é digitado, o cursor chega ao botão e clica, o botão muda, a resposta nasce do clique; itens são marcados, uma opção é escolhida, notificações chegam, etapas preenchem, mensagens aparecem. Tudo na marca da página, em tema escuro (fundo da marca) ou claro. Serve a tecnologia, aula de passo a passo digital, finanças (simulação, alerta de golpe), negócio local (pedido, agendamento), notícia (alerta), saúde (lembrete) e curiosidades sobre apps e internet.

## Processo
1. **Fala de 32 a 46 s** (modelo `interface`), uma ação por frase (digitar, buscar, clicar, escolher, receber).
2. **Estados antes das transições**: escreva a sequência (BUSCA -> RESULTADO -> ALERTA -> ESCOLHA) e use a mesma interface atravessando os beats.
3. **A interface só aparece quando o assunto é uma interface.** Nos outros beats do mesmo vídeo, o objeto real (peça 3D, foto): no teste, o notebook, o roteador, o prédio e o servidor entram entre os painéis.
4. Cada ação presa a uma palavra (`clique`, `em`). O título do beat entra com a fala; com título, a legenda some (o título já é o texto).
5. Cena, QA, folha a 5 quadros por segundo e `node scripts/checklist-fidelidade.mjs <projeto>`, render.

## Regras (das auditorias)
- Digitação até 0,3 s antes do clique; cursor viaja em arco nos 0,6 s finais, prensa (escala 1 -> 0,86) e solta um anel na cor da marca; o botão muda no quadro do clique; a resposta nasce do clique palavra a palavra (BRABO, ChatGPT).
- Texto mínimo de 54 px em tudo (as referências usavam 13 a 24 px); painel de 936 px de largura; a barra da janela tem só os três pontos.
- **Composição (todas as formas, inclusive as telas e as vivas)**: o protagonista ocupa a faixa inteira. Sem título, a faixa vai de y 380 a 1260 (880 px, centro em 820) e a legenda fica logo abaixo, com o topo fixo em y 1300 (vão de 40 px): o grupo fica centrado em ~850. Com título, a faixa começa 60 px abaixo do título e vai até no máximo y 1450. Revisão a 5 qps: o painel nunca fica baixo; ele tem no mínimo 720 px na tela (60% da altura útil) e, se o conteúdo for mais baixo, a moldura ganha folga em cima e embaixo com o conteúdo centrado. Texto do painel com 44 px ou mais na tela. O painel é desenhado no tamanho natural e ampliado até encher a faixa: as formas de texto curto (lista, escolha, etapas, alerta, busca sem resposta) usam painel natural mais estreito e ampliam mais, e as linhas, opções, etapas e avisos se espaçam para ocupar a altura (nada de moldura grande com o conteúdo no alto). A conversa tem campo de mensagem no pé, e a primeira mensagem já está a caminho quando o painel entra ("digitando" do outro, ou o texto sendo digitado no campo). O alerta centra ícone e texto na altura. A câmera faz o push-in com pivô em y 850.
- Sem saída em cascata antes do corte (deixava quadro vazio nas referências): o painel já está quase inteiro no quadro do corte.
- Escolha: a certa ganha borda e check, as outras apagam e encolhem 3%. Notificações: a nova entra de cima desfocada em 0,3 s e as antigas descem um lugar, 3% menores.
- Gráfico só com `valores` reais (fonte em `fontes.md`); o validador recusa sem dados.
- Som: digitação a cada 44 ms, clique + ding na ação, pop nas notificações e bolhas, bloop no "digitando", ding subindo nas etapas.
- Bolhas do chat entram pelo desfoque: deslocadas (dx ±35, dy 50), 90% do tamanho, desfoque 19 -> 0 com cubic-bezier(.10,0,.20,1) em 0,18 s, opacidade em 60% desse tempo; a que chega empurra as de cima num movimento só.
- `"digitacao": "palavra"` (no chat ou em cada mensagem): a bolha chega vazia já no tamanho final e cada palavra é digitada no instante em que é dita, a ~19 letras/s (a última letra com alfa fracionário); um tique suave por palavra (-24 dB). Nada reflui.
- `"pulsos": true`: o conteúdo da conversa dá um pulso de zoom por mensagem (subida 0,6 s até ~1,38 a 1,45, soltura 0,8 s até 1,08) com giro de sinal alternado (~0,1° por % de zoom, até 4°), caminho contínuo, foco que desliza de uma bolha para a outra e que mantém a bolha ampliada dentro do painel. Fica dentro do painel (título, legenda e perfil não mexem) e volta a 1 antes do corte; pulso sem 1 s livre antes do fim do beat fica de fora.

## Passagens entre beats (`"passagem"` no beat que entra)
`"transicao"` continua sendo o campo do motor; o estilo lê `"passagem"`:
- `"desfoque"`: o primeiro painel do beat nasce borrado (20 px), 90% do tamanho e 40 px abaixo, e fica nítido numa chegada longa (5/90, 0,36 s). Também por elemento: `"entrada": "desfoque"`.
- `"respiro"`: respiro de cor. Uma tinta clara da marca cobre o FUNDO (por baixo dos painéis) mudando só a opacidade: entra em 4 quadros (linear), segura 2 e sai em 10 (desacelerando). Um véu da mesma tinta cobre tudo nos 3 quadros antes do corte (esconde o painel que sai) e corta a 0 no corte, onde o painel novo nasce pelo desfoque sobre a tinta. Whoosh suave no pico da cor.
- `"rapida"`: saída rápida e chegada longa (1 : 2,5). Nos 5 quadros antes do corte o painel que sai é empurrado (escala 1 -> 1,4 em partida) e borra até 24 px; o novo chega pelo desfoque em 0,36 s.
As três são monotônicas (a janela nunca passa do tamanho e volta) e a câmera continua desacoplada no corte (uma curva só entre a câmera de 0,36 s antes e a de 0,62 s depois).

## Formas (`{ "tipo": "interface", "forma": ... }`)
| forma | o que faz | campos |
|---|---|---|
| `busca` | campo que digita, cursor clica, resposta nasce do clique | `texto`, `clique` (palavra), `resposta` (com `*destaque*`) |
| `lista` | o cursor marca cada item na palavra | `itens: [{ "texto", "em" }]`, `riscar: true` |
| `escolha` | o cursor escolhe a opção certa | `opcoes` (2 a 4, texto ou `{ texto, sub }`), `certa`, `em` |
| `notificacao` | notificações empilhando | `itens: [{ "titulo", "texto", "icone" (letra), "em" }]` |
| `etapas` | trilha que preenche etapa a etapa | `itens: [{ "texto", "sub", "em" }]` |
| `chat` | bolhas com "digitando" antes da resposta, entrando pelo desfoque | `mensagens: [{ "de": "eu" \| "outro", "texto", "em", "digitacao" }]`, `digitacao: "palavra"`, `pulsos: true` |
| `alerta` | janela de aviso que salta | `texto`, `sub`, `nivel`: `perigo` ou `aviso` |
| `grafico` | linha desenhada com dados reais | `valores`, `rotulos`, `prefixo`, `sufixo`, `em` |
| `navegador` | janela de navegador com abas, botões e barra de endereço: o endereço é digitado com cursor piscando, a página carrega (esqueleto com brilho e barra de progresso) e a ação acontece na palavra | `url` (digitado), `abas`, `pagina`: `anonima` (`titulo`, `linhas`; com `novaAba` a aba anônima abre na palavra), `site` (`site`, `titulo`, `olho` ou `rastreadores: [{ "texto", "em" }]` com o contador de rastreio), `historico` (`itens: [{ "texto", "hora", "em" }]`), `noticia` (`secao`, `titulo`, `data`, `trecho` marcado em `em`, com rolagem), `busca` (`consulta`, `itens: [{ "site", "texto", "em" }]`) |
| `janelas` | duas janelas: a normal guarda o histórico, a anônima não | `normal: { aba, titulo, itens }`, `anonima: { aba, titulo, texto }`, `em` (a anônima aparece) |
| `configuracoes` | lista de ajustes com chaves que deslizam no clique (hover antes) | `titulo`, `itens: [{ "texto", "sub", "ligado", "em" }]` |
| `limpar` | modal "limpar dados": caixas marcam na palavra, botão com hover e clique, barra de progresso e confirmação | `titulo`, `periodo`, `itens: [{ "texto", "em" }]`, `botao`, `feito`, `em` |
| `roteador` | painel do roteador ou da rede da empresa: dispositivos ligados e os sites que cada um acessa, o mais novo em destaque | `titulo`, `dispositivos: [{ "texto", "ip", "tipo": "notebook" \| "celular" \| "tv", "em" }]`, `sites: [{ "texto", "de", "em" }]` |
| `celular` | celular com app de mensagens | `titulo`, `mensagens: [{ "de", "texto", "em" }]` |
| `planilha` | tabela que preenche linha a linha e o total destacado | `titulo`, `colunas`, `linhas: [{ "celulas": [...], "em" }]`, `total: { rotulo, texto, em }` |
| `email` | e-mail: o corpo é digitado e o botão envia | `para`, `assunto`, `corpo`, `em` (envio) |
| `terminal` | terminal: comandos digitados caractere a caractere e a saída de cada um | `linhas: [{ "cmd", "saida": [texto ou { texto, ok }], "em" }]` |
| `metamorfose` | UM objeto que se transforma em estados presos à fala: emblema (quadrado arredondado na cor da marca com glifo próprio) que gira e, no pico da velocidade, vira pílula; a pílula vira barra de abas (ícones pelo desfoque, o glifo vira um ponto que viaja até a aba ativa); a barra estica com rastro e a lista entra pelo desfoque (prévias digitando); a linha escolhida sobe, vira o cabeçalho, e a prévia vira a primeira bolha no mesmo lugar (match cut) | `glifo`: `computador`, `celular` ou `balao`; `cadeia`: em ordem, `{ "estado": "emblema" }`, `{ "estado": "pilula", "em" }`, `{ "estado": "abas", "em", "abas": [3 rótulos], "ativa" }`, `{ "estado": "lista", "em", "rotulo", "itens": [{ "titulo", "texto" (prévia), "hora" }], "escolhe" }`, `{ "estado": "chat", "em", "campo", "digitacao": "palavra", "pulsos", "mensagens": [{ "texto", "em", "de", "nota" }] }`. A cadeia pode parar antes (só até `abas`, por exemplo) |
| `ilha` | pílula viva (raio = altura/2) numa tela de celular genérica: nasce, três pontos piscam e caem para dentro dela, antecipa (-6%), estica com um rebote só (+4,4%) e assenta; avatar e título nascem borrados dentro dela; subtítulo em letreiro a 60 px/s; o botão entra e, em `arrasta`, é arrastado com rastro e troca de cor (responder -> recusar) no quadro de maior velocidade. Vida: deriva em x, respiração 100 -> 101,7%, inclinação de 2° nos gestos | `titulo`, `texto` (rola se não cabe), `chega` (palavra do estica), `arrasta` (palavra da troca), `depois: { "titulo", "texto" }`, `data`, `hora` (texto grande da tela de bloqueio), `continua: true` (no beat seguinte: começa assentada, mesmo relógio, troca de beat sem movimento) |
Todas aceitam `pos [fx, fy]` e `tamanho`. As telas são genéricas (domínios `.exemplo`, nenhum logo ou nome de produto desenhado), com tipografia de interface, raios, sombras e estados de hover e foco iguais em todas; o texto interno fica com 40 px ou mais na tela e a janela ocupa a largura útil (936 px) e a faixa do protagonista inteira (ver Composição). `pos` não muda mais a posição do painel (ele fica sempre na faixa). **Cada beat mostra o verbo da fala numa tela**: peça 3D só como apoio raro (o convite final, por exemplo), nunca a maioria. Tema: `"tom": "claro"` no beat (ou `"tom"` na cena).

Câmera (`camera.js`, personalidade `interface`): o cursor e o campo ativo guiam a câmera. Cada ação (digitar, clicar, marcar, chegar um item) tem um alvo no painel; a câmera segue o alvo com atraso (`seguir`) e dá um push-in curto no elemento clicado. O título anda só 12% (`camadaTexto`).

```json
{ "tema": "ABA ANÔNIMA", "estilo": "interface", "beats": [
  { "id": "gancho", "palavras": [0, 13], "titulo": { "texto": "Aba anônima *esconde* tudo?" }, "elementos": [ { "tipo": "interface", "forma": "busca", "texto": "a aba anônima esconde tudo?", "clique": "faz?" } ] },
  { "id": "fecha", "palavras": [23, 39], "titulo": { "texto": "Fecha a janela: o navegador *apaga*" }, "elementos": [ { "tipo": "interface", "forma": "lista", "riscar": true, "itens": [ { "texto": "Histórico", "em": "histórico," }, { "texto": "Cookies", "em": "cookies" } ] } ] },
  { "id": "fecho", "palavras": [88, 94], "titulo": { "texto": "Discreta, *não invisível*" }, "elementos": [ { "tipo": "interface", "forma": "escolha", "opcoes": ["Invisível", "Discreta"], "certa": 1, "em": "discreta," } ] } ] }
```
Exemplo completo (roteiro, fontes e cena): `projetos/exemplo-estilo-interface`. Metamorfose, ilha, digitação por palavra, pulsos e passagens: `projetos/demo-interface-clube`.

### Metamorfose e ilha: números (das auditorias)
- Giro 0 -> 720° com cubic-bezier(.60,0,.33,1); a troca (4 quadros a 60 qps) cai no pico da velocidade angular (~47% do giro), com borrão de giro em cópias; o emblema fica parado 0,4 s depois do corte antes de girar. Emblema de ~690 px (82% da faixa); pílula do tamanho do emblema até 936 x ~700 (80% da faixa: um dock de abas grande, ícones 1,9x e rótulos de 50 px; raio = altura/2) com (.18,0,.03,1) em 0,95 s; cor da marca -> quase preto (20/80) em 0,6 s; contorno 0 -> 3 px.
- Ponto: nasce em 0,2 s, viaja até a aba ativa em 0,45 s (.40,0,.15,1), sobe 18 px e vira o selo. Abas: ícones de traço de x +330 até o lugar, 0,33 s cada, escalonados 0,05 s, escala 60 -> 100%, desfoque 12 -> 0, (.001,0,.10,1); rótulos com 40 px sobem 5 px; seleção a 32%; respiração (escala +2%, y -6 px).
- Barra: scaleX 1 -> 1,65 em 0,27 s (.10,0,.15,1), rastro horizontal de 90 px, some nos últimos 0,21 s; a lista entra 5 quadros antes do fim (escala 1,05 -> 1, desfoque 40 -> 0 em 0,38 s). As outras linhas somem escalonadas (0,22 s cada, 0,06 s entre elas); a escolhida sobe e cresce 8% em 0,4 s (smootherstep); o campo de mensagem entra com zoom 72 -> 100% em 0,22 s.
- Tela de bloqueio da ilha: o corpo do celular (com a moldura) ocupa a faixa inteira (736 x 840 sem título); data em 54 px, hora em 230 px, a pílula entre a hora e os controles, lanterna e câmera em vidro e a barra de início no pé. A lista e a conversa da metamorfose usam a altura inteira da faixa (linhas de até 220 px, bolhas de 62 px centradas na área da conversa).
- Ilha: nasce em 0,16 s (chegada 5/90); pontos escalonados 0,04 s; estica com cubic-bezier(.05,0,.15,1) e assenta (40/60) em 0,5 s, com desfoque 0 -> 15 -> 0 no gesto; avatar nasce com desfoque 30 -> 0, sobe 60 px, 70 -> 100% em 0,22 s; botão 70 -> 100%; arrasto em partida (0,24 s) até o pico, troca de cor ali e chegada 5/90 (0,45 s); rastro = min(|v|·1,5 quadro, 120 px).
- Som: whoosh longo com pico na troca do giro e um ding uma oitava acima 0,85 s depois; pop por ícone; whoosh curto no estica da barra; tique suave por palavra digitada; na ilha, pop no nascimento, tiques dos pontos, whoosh -14 dB no estica, pop -13 dB do avatar e clique -9 dB na troca do botão.

Técnica reescrita (sem código nem imagem de terceiros) a partir das auditorias do pacote BRABO (ChatGPT, Automatizar-Processo, Empresa-Light, Bom-Gosto) e das regras de motion da PRODUÇÃO DE VÍDEOS. Ver `AVISOS-TERCEIROS.md`.


## Kit aberto (Onda 4): o assistente escreve a peça de cada ideia

O motor não traz mais "a peça pronta" para o assunto: quem desenha é você, em `projetos/<nome>/pecas.js`, e o motor só executa e **recusa com explicação** quando falta a peça (nenhum recuo para outro estilo, outra forma ou peça 3D genérica).

Processo, por vídeo:
1. No `sujeito.json` (ou `cena.sujeito`), aponte o desenho em `dados.objeto` (ex.: `"cena-01"`) e, se a fala cita pessoa pelo nome, `tipo: "pessoa"` e `dados.pessoa`.
2. Escreva o descritor em `pecas.js` (só JSON, sem funções). Coordenadas de 0 a 100; `ordem` lista os estados (um por beat: o mundo acumula); cada item nasce em `de`. Texto dentro do desenho: 5,4 unidades ou mais (34 px).
3. Rode `node scripts/verificar-casos-abertos.mjs interface` como modelo de checagem estática (kit válido, plano pela intenção, verificador do estilo) e depois o vídeo; revise a 5 quadros por segundo.

O planejador (`src/video/autoplano-interface.mjs`) decide a representação pela **intenção da frase** (`autoplano-intencao.mjs`): etapas, causa-efeito, mudança, por quê, consequência, mecanismo, comparação, escala, escolha, busca. Se a intenção pede um dado que o kit não declara (risco, etapas, causa e efeito, verbo da interface), o plano devolve erro em vez de trocar de forma.

Galeria de revisão das cenas sem renderizar vídeo: `node test/estilos-abertos/galeria.mjs <pasta> letreiro|colagem 1 10`.
Conformidade aberta (30 casos, sem ElevenLabs): `node scripts/conformidade-aberta.mjs --estilo=<id> [--casos=1,2]`. O caso só conta como aprovado com a revisão visual registrada em `test/estilos-abertos/<id>/revisao.json`.

### Interface inventada por ideia (além das 19 formas)
`export const interfaces = { "cena-01": { nome, titulo, ordem, partes, itens, estados } }` (o nome do export é `interfaces`, porque `interface` é palavra reservada).
- `itens`: `campo`, `botao`, `item`, `selo`, `chip`, `fita`, `contador`, `barra`, `slider`, `grafico`, `papel`, `quadro` (um desenho vetorial vivo do assunto dentro da janela). Posição e tamanho em % da janela; texto de item com 34 px no mínimo (o verificador confere se cabe).
- `estados.<nome>`: obrigatório `verbo`, e a interação que o verbo exige: `digita-busca` (`digita`), `escolhe` (`clica` e `apaga`), `preenche` (`valor`), `conta` (`valor`), `liga-encadeia` (`liga: [[a, b]]`), `arrasta-separa` (`leva`). Também `marca`, `cursor`, `destaque`, `quadro: { id: estado do desenho }`.
- Elemento do beat: `{ "tipo": "interface", "forma": "app", "objeto": "cena-01", "estado": "s2" }`.
Tabela verbo -> interação (planejador `autoplano-interface.mjs`): etapas = preenche; causa e mecanismo = liga-encadeia; mudança e escala = conta ou escolhe; comparar e escolher = escolhe; buscar e anotar = digita-busca; separar = arrasta-separa. O verificador reprova quando a interação esperada pela fala não aparece em nenhum beat (fala x verbo), quando dois beats repetem o estado e quando o texto não cabe.
Pessoa nomeada: foto no painel da interface (0.6.13), com o app como reserva.




