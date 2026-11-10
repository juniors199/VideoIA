

# Princípios de design do Estudio de videos

Resumo prático, em palavras nossas, do que adotamos depois de auditar o projeto com as ideias da metodologia Impeccable (Apache 2.0) e com o nosso próprio olho. Vale para carrosséis, quadros de vídeo, o estúdio web e a landing.

## 1. Cada tela tem um momento
Uma ideia, um elemento em destaque, uma coisa se movendo por vez. O vídeo troca o que aparece a cada 2 a 4 segundos, mas dentro de cada cena só o essencial anima. Entrada igual em tudo é ruído.

## 2. Tipografia
- Escala com passos óbvios de tamanho e peso. Título limitado a 6rem em web; no vídeo e no carrossel, 112 px é o teto da capa.
- Espaçamento entre letras nunca abaixo de -0,04em. Título com `text-wrap: balance`, texto corrido com `text-wrap: pretty` e medida de 34 a 66 caracteres.
- Números em fonte com algarismos tabulares (`tabular-nums`) quando se comparam ou contam.
- Nada de rótulo pequeno em caixa alta acima do título (o "kicker"). O título carrega o próprio peso.

## 3. Cor e contraste
- Neutros com matiz (o fundo é um preto azulado, nunca `#000`). Texto de apoio nasce do branco com opacidade, e passa de 4,5:1 sobre o fundo (testado em `npm test`).
- Uma cor de destaque por página, usada com parcimônia: a cor que aparece é a que importa.
- Brilho só onde há luz de verdade: o bloom realça peças acesas, nunca é halo decorativo em caixas ou texto.
- Sem texto em gradiente, sem borda colorida de 1 lado, sem sombra dura deslocada.

## 4. Layout
- Agrupar perto, separar longe. Mais espaço acima do título que abaixo.
- Sem cartões dentro de cartões e sem cartão como estrutura da página. Listas e rankings usam linhas com fio, numeral grande e espaço; cartão só quando a comparação pede dois painéis.
- Zonas seguras únicas (`src/video/engine/zona.js`): topo, título, cena, legenda, margens. O QA mede em pixels e reprova.
- Todo texto real é testado: título de 40 caracteres, 2 linhas, números longos. Nunca se diminui a fonte para caber: encurta-se o texto.

## 4b. Carrossel viral
- Formato reconhecível (post, jornal, nota, conversa) só funciona se parecer de verdade: mesma moldura em todos os slides do estilo, sem enfeite que o original não tem (o post não ganha linha entre cabeçalho e texto, nem cor além da página).
- Parecer não é imitar: o post, o fio e a conversa são sempre da própria página, sem logo ou selo de rede social, sem perfil de terceiro.
- Foto de ponta a ponta leva véu escuro só onde há texto; o resto da foto respira. Crédito na legenda do post.
- Marcação à mão (círculo, seta, sublinhado, carimbo) aponta uma coisa só por slide.
- O gerador mede sobreposição, borda, corte e letra pequena; a folha de contato a 360 px mostra se lê no celular.

## 5. Movimento
- Curva de saída exponencial para entrar; sem quicar nem elástico (a mola das peças 3D tem estouro mínimo).
- A câmera nunca salta: atravessa os beats com suavização. Cada beat traz um plano e um movimento (avança para revelar, recua para mostrar o todo, de cima para mapas).
- Transição com desfoque curto, não com corte seco. `prefers-reduced-motion` é respeitado no estúdio web.
- Quadro é função do tempo: nada depende de relógio, então o mesmo instante gera os mesmos pixels.

## 6. Estados e superfícies do navegador
Todo controle tem repouso, foco visível, ativo, desabilitado e carregando. Seleção de texto, foco e barras de rolagem usam a paleta da marca. Estados vazios dizem o que fazer. Erros dizem o problema e a saída.

## 7. Texto de interface
Botões nomeiam a ação ("Produzir vídeo", não "Enviar"). Mensagens de erro explicam a causa e o próximo passo, em português claro. Sem travessão longo com espaços em nenhum texto.

## Como checar
- `npm test`: contraste, travessão, determinismo do quadro, limites do carrossel.
- `node src/video/cli.mjs <projeto> --voz=mock --sem-render --guias`: folha de contato com as zonas.
- `npm run previa -- <projeto>`: prévia com guias e caixas medidas.
- Detector de padrões ruins: `npx impeccable detect <arquivo.html>` (CLI independente; não precisa de chave nem de IA).




