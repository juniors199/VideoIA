

# Cena: estilo pleno

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Estilo pleno (escala em quadradinhos 3D)
Leia `docs/estilo-pleno.md`. `"estilo": "pleno"` na cena; cada beat tem **um** elemento `{ "tipo": "pleno", "forma": ... }`: `quadrado` (o "você" sozinho, rótulo em cima e frase embaixo), `contador` (número do herói; `pontos` faz o quadrado virar a matriz de pessoas), `grade` (a grade cresce em volta do "você" e a câmera recua), `frase` (texto do topo), `escala` (bilhões com ondas), `grupo` (porcentagem colorida: `grupo.forma` canto, resto, mancha, `tiles` ou `faixas`), `numero` e `fecho` (o quadrado de volta, a pergunta e o `botao`). Regras do estilo:
- **Um mundo só:** a grade (50 x 50 por padrão, `lado`) continua de um beat para o outro; os grupos se acumulam; a câmera é uma órbita (`camera`: preset `heroi`, `geral`, `canto`, `perto` ou quadros-chave) que nunca salta.
- **A fala está na tela:** rótulo em caixa alta com marcador colorido, número que conta (`valores` medidos ou `valor`), sub cinza, título em pedaços que entram na palavra dita (`em`), chips que entram um a um; texto de uma ou duas linhas, sem diminuir a fonte para caber (encurte).
- **Cores:** verde, amarelo e vermelho dos grupos são do estilo (categorias); o destaque da página entra no `*título*` marcado e no grupo `"cor": "marca"`.
- **Número é fato:** porcentagem e população só com 2 fontes em `fontes.md`. O plano automático (`src/video/autoplano-pleno.mjs`) monta tudo pela fala; escreva à mão para escolher os grupos e a câmera.




