

# Cena: logos e bandeiras

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `logo` (3D) | `marca` (id da biblioteca `marcas/`, ex. `"telegram"`; aceita apelido), `acabamento` (`app`, `placa`, `selo` ou `inicio`), `fundo` (`auto`, `claro`, `escuro`, `marca` ou `#rrggbb`), `usar: "oficial"` (logo oficial no ícone de app), `apps` e o próprio `marca` em destaque (`inicio`), mais os campos de `peca` (`pos`, `escala`, `rot`, `gira`, `papel`, `id`) (veja "Logos e bandeiras") |
| `bandeira` (3D) | `marca` (id: `br`, `us`, `br-sp`, `cidade-sao-paulo`...), `modo` (`tecido`, o padrão, `placa` ou `selo`), `mastro: false`, mais os campos de `peca` |

## Logos e bandeiras (`logo`, `bandeira`)
A biblioteca `marcas/` traz logos prontos de tecnologia, IA, redes e apps, mídia, política e instituições do Brasil, instituições internacionais, bancos e finanças, varejo e consumo, esporte, e as bandeiras de todos os países, dos 27 estados e das capitais (lista e regra de uso em `docs/marcas.md`; busca: `node scripts/marcas.mjs <termo>`). O elemento recebe o id e vira uma peça 3D com acabamento, nunca chapada: ícone de app em esmalte com bisel, placa de esmalte com moldura de metal ou medalhão com aro, sempre com verniz de vidro (só o reflexo: a cor do logo não muda), filete de luz na borda e sombra de contato. A bandeira é tecido no mastro com ondulação suave (função do tempo), placa esmaltada ou botão redondo. Proporção e cores são as do arquivo; o motor nunca estica nem recolore o logo oficial (o glifo monocromático do Simple Icons fica branco sobre a cor da marca no ícone de app, como no celular).

```json
{ "tipo": "logo", "marca": "telegram", "acabamento": "app", "entra": "Telegram" }
{ "tipo": "logo", "marca": "stf", "acabamento": "placa", "pos": [-1.4, 0, 0] }
{ "tipo": "logo", "marca": "whatsapp", "acabamento": "inicio", "apps": ["instagram", "youtube", "tiktok", "telegram", "x", "nubank"], "entra": "WhatsApp" }
{ "tipo": "bandeira", "marca": "br", "entra": "Brasil" }
{ "tipo": "bandeira", "marca": "br-sp", "modo": "placa" }
```

- Cor fiel: com logo ou bandeira 3D na cena, o `efeitos.bloom` cai sozinho para 0,2 (o brilho clareia cores saturadas); escrito no `cena.json`, vale o seu. O logo fica de frente e parado (`gira: 0`) salvo se a cena pedir outro giro.
- Padrão do `acabamento`: `app` para marcas de app com glifo (redes, IA, tecnologia), `placa` para as outras. `inicio` é o celular com a tela de início real (ícones da biblioteca, sem texto) e o app do `marca` saltando da tela.
- Vale em todos os estilos: nos 3D é peça normal (encaixe, câmera, sombra); nos de motion e da marca a camada 3D é desenhada pelo estilo (no `impresso`, `linhas`, `fino` e `colagem` o estilo pode mudar a cor de tudo, inclusive do logo: para cor fiel, use um estilo que mostra a cor, como o padrão, `interface`, `letreiro` ou `ribalta`).
- No `interface`, cada aviso da `notificacao` aceita `"app": "<id>"` e mostra o ícone real do app: `{ "texto": "Nova mensagem", "titulo": "WhatsApp", "app": "whatsapp", "em": "mensagem" }`.
- O crédito e a licença de cada marca usada entram sozinhos no `fontes.md` do projeto (seção "Marcas"), para a legenda do post. Id que não existe é erro na validação, com sugestão do id mais parecido.
- Regra de uso: só para identificar o assunto (uso editorial), sem sugerir parceria; nunca alterar o logo; em anúncio pago, evite marca de terceiros (`docs/marcas.md`).




