

# Cena: estilo novela

Parte do formato da cena. O índice (beat, elementos comuns, modelos de cena e a tabela de arquivos) está em `docs/cena-schema.md`.

## Campos

| tipo | campos |
|---|---|
| `novela` | `forma`: `cena` (`elenco`: personagens registrados com `pose`, `acao` na palavra-chave, `segura`, `caminha`, `fala`, `espelha`, `fila`; `plano`: aberto, medio, close; `foco`; `brilho`, `raios`), `grupo`, `close`, `retrato` (foto real SÓ a pedido: `fotoReal: true` com o elemento `imagem`; `rotulo` na placa; por padrão a pessoa citada vira personagem do `elenco` com `rotulo`), `objeto` (`objeto`), `livro` e `bilhete` (`texto` da fala, até 90), `mapa` (`rota`: 2 a 5 lugares ditos), `numero` (`texto` até 14, `rotulo`), `cartao` (`texto` até 24, `rotulo`, `numero`), `fecho` (`titulo`, `subtitulo`, `cta`). Em qualquer forma: `tom` (classico ou serie), `transicao` (corte, zoom-rapido, viagem, luz, fusao, chicote), `hud`, `painel`, `carimbo`. No beat: `cenario` (31 lugares e o `marca-pagina`) e `camera.mov` (11 câmeras). Guia: `docs/estilo-novela.md` |

| estilo | visual | elementos (`forma`) |
|---|---|---|
| `novela` | Novela: a história encenada por personagens vetoriais pintados (piscam, gesticulam na palavra-chave, andam) em cenários ilustrados em camadas (claustro, refeitório, gruta, rua antiga, trincheira, sala, estrada, cidade à noite e outros), com a cena que continua entre as frases, câmera multiplano que nunca para (empurrão, órbita, travelling, golpe de zoom, viagem), legenda palavra a palavra numa linha na altura do peito (serifada no tom clássico, condensada no tom série), pessoa citada pelo nome ilustrada no estilo com o nome (foto só a pedido), número que conta, livro e bilhete escritos à mão, mapa com a rota e o fecho em arco na cor da página. `docs/estilo-novela.md` |

## Estilo novela (história encenada por personagens ilustrados)
Leia `docs/estilo-novela.md`. `"estilo": "novela"` na cena; cada beat tem **um** elemento `{ "tipo": "novela", "forma": ..., "chave": "<palavra dita>" }` (mais o elemento `imagem`, só no `retrato` pedido). Regras do estilo (valem acima das regras gerais de layout):
- **A história é encenada:** `cena` com o `elenco` (personagens registrados: monge, freira, padre, camponesa, campones, soldado-britanico, soldado-alemao, oficial, rapaz, moca...; o pecas.js traz outros) num cenário pintado; quem age muda de pose na palavra-chave (`acao`: rezando, apontando, acenando, abencoando, falando, segurando com `segura`, caminhando com `caminha`). No mesmo cenário o elenco continua (só escreva `elenco` quando mudar).
- **Pessoa citada pelo nome = personagem ILUSTRADO no estilo** com `rotulo` (o nome aparece em versal), exceção do estúdio só no novela: `papa`, `imperador`, `inventor`, `rei`, `rainha`, `oficial`...; figura que falta nasce como dado em `personagensEstilo` do pecas.js. Foto real só se o usuário pedir: `retrato` com `fotoReal: true` e o elemento `imagem` (sem o campo, o QA reprova). Número dito = `numero`; carta ou livro = `livro`; bilhete = `bilhete`; rota = `mapa`; objeto de perto = `objeto`; título ou regra = `cartao`; último beat = `fecho` (`titulo`, `subtitulo`, `cta`; `moldura`: `arco` ou `oval`; o busto sai sozinho do último beat com elenco). O protagonista fica no eixo: `composicao: "lateral"` só quando o lado for intencional.
- **Plano e câmera:** `plano` aberto no primeiro beat de cada lugar, depois medio e close; `"camera": { "mov": ... }` (empurra, recua, pan, travelling, pedestal, tilt, orbita, close, deriva, segue, zoom-rapido), sem repetir a vizinha; `transicao`: corte limpo, zoom-rapido na troca de plano (só zoom), fusao curta na troca de lugar, chicote (série); nunca clarão branco por padrão (`luz` só com `clarao: true`, a pedido) e sem viagem.
- `tom`: classico (legenda serifada na altura do peito, y 1325) ou serie (condensada a 70%, com `hud` "LUGAR · DIA · HORA", `painel` e `carimbo`). O plano automático (`src/video/autoplano-novela.mjs`) já faz tudo isso pela fala; escreva à mão para dirigir o elenco, as poses e os planos.




