# Plano visual do VideoIA

Antes de gravar o `roteiro.md` definitivo no primeiro vídeo do estúdio, confira a redação final e grave `projetos/<nome>/direcao-visual.json`. Registre só os planos em que a imagem, a câmera ou a transição precisem de direção explícita.

```json
{
  "versao": 1,
  "planos": [
    {
      "trecho": "cobrança do presidente",
      "imagem": {
        "arquivo": "assets/nome-do-arquivo-123456.jpg",
        "entidade": "Nome citado na fala",
        "classe": "registro"
      },
      "camera": { "plano": "fechado", "mov": "avanca", "forca": 0.6 }
    },
    {
      "trecho": "sete a três",
      "camera": { "plano": "normal", "mov": "nenhum" }
    }
  ]
}
```

- Cada `trecho` é uma expressão curta e única da fala, dentro de um único beat. Use as palavras narradas. Combine imagem, câmera e transição no mesmo plano quando se referirem ao mesmo beat.
- `imagem` é opcional. Use o caminho retornado pelo download ou da imagem anexada. `entidade` identifica o que a foto mostra. `classe` é `registro` ou `contexto`. O render exige que o arquivo exista e que o caminho tenha crédito em `fontes.md` ou venha de `assets/referencias/`.
- `camera` é opcional. Use os valores de `docs/cena/estilo-padrao.md`. `transicao`, quando necessária, aceita `desfoque`, `corte` ou `varredura`.
- No plano automático, os estilos padrão, editorial, minimalista e papel podem inserir a imagem no beat. Em outros estilos, confirme se o estilo aceita foto naquele trecho e se o planejador cria um espaço para a entidade escolhida. Se não houver espaço, use o recurso próprio do estilo ou escreva a cena compatível pela skill `cena`. Quando assumir a autoria dos beats, retire `automatica` do `cena.json` e fixe nele o arquivo aprovado.
- Se nenhum plano especial for necessário, grave `{"versao":1,"planos":[]}`. Com o plano visual ativo, o render automático usa os arquivos selecionados ou o recurso visual de reserva para fotos pendentes.
- Depois da produção, confira `node scripts/resumir-relatorio.mjs <nome> --campo=pesquisaVisual` e a folha de contato. `presenteNoPlano` indica que o arquivo chegou ao plano compilado. Use `noBeatPrevisto` e `beatsNoPlano` para localizar a imagem depois dos ajustes do QA. Se um pedido novo chegar sem o plano, o render usa as reservas e avisa no relatório. A folha confirma o que ficou visível e se o enquadramento atende à fala.
