# Evidência visual

## Antes da busca

Parta da afirmação narrada e de uma fonte verificável. Anote em `fontes.md` qual fonte sustenta a ação central e o que identificaria uma imagem do caso. Use a página da partida, órgão, obra ou instituição quando houver. Em um fato controverso, preserve atribuições e incertezas.

Escolha a função da imagem em cada trecho:

- **Registro.** A página de origem e o conteúdo visível sustentam que a imagem mostra o acontecimento citado. Verifique data ou período, envolvidos e sinais como uniforme, local ou edição.
- **Contexto.** Retrato, objeto ou lugar verificável para identificar o assunto. Coloque no trecho de apresentação. Se a montagem puder sugerir que a foto é do lance, escolha outro trecho ou identifique a foto como ilustrativa.
- **Explicação visual.** Use diagrama, mapa, placar ou peça quando precisar explicar uma regra, ou quando faltar um registro verificável e reutilizável.

## Buscar e fixar o arquivo

1. Priorize a imagem anexada pela pessoa se ela combinar com o trecho. Abra o arquivo para conferir a identidade e o contexto.
2. Monte uma consulta com nome, ação e contexto. Comece pelos trechos mais importantes. Exemplo de busca para um lance: nome do jogador + equipes + competição + data.
3. Rode `node scripts/buscar-imagem.mjs <projeto> "<termo>" --listar`. Abra a página do candidato, compare a descrição com a fonte factual e confira licença e autoria. O título ou o nome do arquivo serve como pista.
4. Baixe pelo ID conferido com `node scripts/buscar-imagem.mjs <projeto> "<mesmo termo>" --id=<id> --nome=<nome-descritivo>`. Para logo, mantenha `--logo`. Abra o arquivo baixado e confirme que é o mesmo candidato e que o recorte lê bem.
5. Use literalmente o `assets/…` devolvido pelo comando. Ele já registra o crédito em `fontes.md`. Preserve a seção `## Imagens` ao complementar as fontes do roteiro. Para arquivo anexado, mantenha o caminho `assets/referencias/…` e o crédito fornecido pela pessoa, quando houver. Quando o arquivo não couber no trecho ou no estilo, use o recurso explicativo e registre a troca.

Se tiver uma ferramenta de busca de imagens disponível, use-a para achar páginas de origem ou confirmar o contexto. A busca da Brave é opcional e exige chave. A licença e o crédito precisam ser verificados na origem.

Métodos de referência. [Grounded Citations](https://github.com/nousresearch/hermes-agent/blob/main/skills/research/grounded-citations/SKILL.md) · [Brave Images Search](https://github.com/brave/brave-search-skills/blob/main/skills/images-search/SKILL.md) · [Reutilização no Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia)
