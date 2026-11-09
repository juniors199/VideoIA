

# Cena: kit aberto (letreiro, interface, colagem, cartões, tubo, impresso, ribalta, mundos)

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Estilos de kit aberto (Onda 4): letreiro, interface, colagem, cartões, tubo, impresso, ribalta e mundos
Nesses nove estilos o motor não tem peça pronta: **você desenha a ideia de cada frase em `projetos/<nome>/pecas.js`** antes de planejar. Sem a peça declarada o estúdio **mantém o estilo escolhido e monta na hora a versão simplificada** (a frase de cada trecho em cartão do estilo, sem ilustração; aviso `kit-simplificado` no relatório); ele nunca recua para uma peça 3D genérica nem para outro estilo. A ilustração do assunto continua sendo sua.
1. Leia o guia do estilo (`docs/estilo-<id>.md`, seção "Kit aberto"): ele traz o formato do descritor, os exemplos e o que o verificador reprova.
2. Exports do `pecas.js` por estilo: `letreiro`, `interfaces` (o nome é plural porque `interface` é palavra reservada), `colagem`, `cartoes`, `tubo`, `impresso`, `ribalta` e `mundos`. Um objeto por ideia, com o desenho que mostra **o que a frase diz** (processo, causa, escala, escolha, comparação), nunca um ícone decorativo.
3. Pessoa citada pelo nome: foto real e recente de licença livre (`scripts/buscar-imagem.mjs`), nunca boneco; o planejador recusa pessoa nomeada sem foto. `sujeito.json` aceita `dados.pessoa`, `dados.objeto` e `dados.foto`.
4. Rode `node src/video/cli.mjs <projeto> --voz=mock --sem-musica --sem-render` e corrija até o QA da cena não ter falhas; o verificador do estilo roda antes do navegador (forma repetida para frases diferentes, texto que não cabe, peça sem relação com a fala).
5. Falha de autoria pede completar o desenho, nunca trocar o estilo.




