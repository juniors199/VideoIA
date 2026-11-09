

# Relevância fala x imagem: antes x depois (0.6.12, 29/10/2026)

Bancada: `node test/relevancia/bancada.mjs [--antes]` sobre `roteiros.json` (8 roteiros: dinossauro, política com pessoa nomeada, Bíblia, padaria, banco, Torre Eiffel, iPhone, sono), modelos curiosidades, colagem e noticia, plano automático real com tempos sintéticos, fotos resolvidas pela rede de verdade. Nota por beat de 0 a 3 (`relatorioRelevancia`): 0 = sem relação verificável, 1 = apoio do assunto, 2 = casa com a fala, 3 = foto, logo, número da fala ou peça citada com força. Tabelas completas: `antes.json` e `depois.json`.

| | antes (`--antes`, casamento antigo) | depois |
|---|---|---|
| beats sem relação | 55 de 154 (35,7%) | 0 de 154 (0%)* |
| nota média | 1,49 | 2,18 |
| fotos de nome próprio | 0 (nunca buscadas) | 9 de 9 pedidas (Lula, Noé, Torre Eiffel nos 3 modelos) |
| logo de marca | 0 | iPhone e Apple viram o logo da Apple (biblioteca, sem rede) |

\* os 4 que a primeira rodada contava como 0 eram o fecho `seguirperfil` (o botão de seguir refeito), que o avaliador ainda não reconhecia; corrigido no avaliador.

Exemplos do antes (o que o comprador via): "Isso passou de qualquer leão" -> escada; "a conta não fecha" -> escada; "conta corrente" -> corrente; "a fila já está na porta" -> urna de votação; "Era o sinal" -> linha das eras + wi-fi; "a torre" -> Torre de Babel; "celular na tomada" -> célula; "mil oitocentos e oitenta e nove" -> 889.

Observação: o "antes" roda o código novo com `ILU_RELEVANCIA=0`, então já tem o conserto do ano por extenso e do cenário de reserva; o número de beats sem relação do código publicado é igual ou maior. Contagem manual (curiosidades, 48 beats) no código antes da mudança: 13 beats com objeto sem relação (27%), 4 roteiros sem a foto que pediam.

Revisão a 5 qps (folhas em scratchpad da sessão): `_relev-lula-reforma` (curiosidades), `_relev-torre-eiffel` (colagem), `_relev-tiranossauro` (noticia), `_relev-padaria-pao` (curiosidades), voz mock, sem música, QA tolerante. Relação fala x imagem certa em todos os beats; defeitos vistos que NÃO são de relevância (ficam para a fase 2): tiranossauro GLB pequeno (cerca de 15% da altura) logo abaixo do título; peças `filapessoas` e `porta3d` pequenas no beat da fila; número que começa a contar mostrando "8." e "5.0".




