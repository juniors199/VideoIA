

# Relevância fala x imagem, fase 2 (0.6.12, 29/10/2026)

Bancada: `node test/relevancia/fase2/bancada.mjs [--saida=arquivo.json]` sobre `roteiros.json` (20 roteiros: negócio local x2, produto x2, serviço, página de criador, curiosidade, história x3, Bíblia, esporte x2, saúde, finanças, tecnologia x2, receita, notícia, política com dupla). Amostragem estratificada: cada roteiro em 4 modelos (`distribuir`), 80 casos; cada um dos 31 modelos em 2 ou 3 roteiros, cada tipo de conteúdo em 4 ou mais modelos. Plano automático real, tempos sintéticos, fotos pela rede (cache em `.estudio/fotos`). Tabelas por beat: `antes.json` (código da fase 1) e `depois.json`.

| | antes (fase 1) | depois (fase 2) |
|---|---|---|
| beats sem relação | 12 de 530 (2,3%) | 0 de 561 |
| nota média | 2,10 | 2,19 |
| fotos obtidas / pedidas | 22 / 27 | 63 / 64 |
| nomes próprios citados sem foto, logo ou bandeira | 77 | 15 |

Os 15 que sobram: Anatomia e Traço fino abrem com o objeto montado (nome do gancho vira o título do objeto: Machu Picchu, Lula e Bolsonaro, Pelé); segundo nome no mesmo trecho que é país com bandeira (Egito, ao lado de Moisés); nome depois do número sem tempo para beat próprio (Porto Alegre); Suécia sem foto livre nos estilos sem bandeira; Paris no alternativo (uma foto em pontos por trecho; o nome vai na etiqueta).

Revisão a 5 qps (prévia, voz mock, sem música, modo comprador `ILU_QA=tolerante`): 12 vídeos em `projetos/_f2-*` (não publicar), folhas em `projetos/_f2-*/revisao/f5qps-*.jpg`. Achados corrigidos na hora: foto de multidão no lugar do Bolsonaro (artigo de manifestação; agora artigo de evento é descartado e o de pessoa vem primeiro), "mar Vermelho" virava foto de morangos (busca "Vermelho"; agora o substantivo de lugar entra no nome), "cerca de 200 mil" virava cerca de arame, "embaixo dos bancos" virava agência, peça larga (bateria) pequena demais no Mundos, peça de reserva colorida e boneco atrás da foto no Preto e branco.




