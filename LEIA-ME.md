

# Estudio de videos

Estúdio de carrosséis e vídeos de curiosidades que roda no Claude Code ou no Codex. Do tema ao arquivo pronto, sem aprovar etapa por etapa. Roda em computador ou notebook (Mac ou Windows), não em celular nem tablet.

## Começar em 3 passos
O Método é uma pasta que o seu assistente (Claude Code ou Codex) usa. Você escreve o que quer e ele faz o vídeo ou o carrossel.

1. **Baixe e descompacte** o zip numa pasta fixa da sua pasta pessoal.
2. **Abra a pasta** no Claude Code (aba **Code**, modo **Local**) ou no Codex.
3. **Escreva:** `Comece pelos primeiros passos.` Ele instala o que faltar (Node, FFmpeg, navegador interno e alinhador de voz, dentro de `.programas/`, conferindo o SHA-256 de cada arquivo), liga a voz e faz o vídeo de teste. Não há licença para ativar. Depois: `Quero um vídeo sobre <tema>.`

O **estúdio visual é opcional**: escreva **abrir estúdio** para ver seus vídeos, estilos, voz e marca em telas. Quem ainda não tem o assistente pode dar dois cliques em **Instalar (Mac)** ou **Instalar (Windows)**, que abre o estúdio; sem assistente dá para ver a demonstração e fazer o vídeo de teste, mas o vídeo do seu tema precisa dele. Avisos do macOS e do Windows na primeira vez: Guia 01, Seções 05 e 06.

No estúdio:
1. No estúdio (**Abrir Estúdio**), aba **Começar**: voz (a ElevenLabs é a padrão, com conta grátis e o passo a passo completo na própria tela: criar a conta, gerar a chave, colar e ouvir as 10 vozes; a chave vai direto para o `.env`, sem aparecer de novo), marca e tipo de página.
2. No topo da aba **Começar**, digite um tema e clique em **Fazer meu primeiro vídeo**: o estúdio confere a instalação e a voz, instala o que faltar e mostra o vídeo tocando. Se algo parar, a tela diz a causa, o que fazer e tem **Copiar diagnóstico** para mandar no direct do Instagram @kaueajure (sem chaves nem dados pessoais).
3. Os vídeos prontos ficam em **Meus vídeos**, com Baixar e Copiar legenda.

## O que vem pronto
- **Mais de 20 estilos de vídeo** (a aparência): `padrao`, `editorial`, `minimalista`, `papel`, `pontilhismo`, `impresso`, `cartoes`, `tubo`, `linhas`, `anatomia`, `fino`, `letreiro`, `interface`, `colagem`, `ribalta`, `mundos`, `antiguidade`, `moderno`, `alternativo`, `preto-branco`, `stop-motion`, `teologia`, `quadro-antigo`, `mindset2`, `mindset`, `fatos`, `colagem3d`, `novela`, `paper-rocket`, `lighthouse-mouse`, `moon-path`, `prickles`, `little-light`, `smooth`, `smooth-produto`, `smooth-estrategia`, `smooth-historia`, `smooth-vinheta` e `smooth-tipografia`. Um exemplo de cada estilo de motion em `projetos/exemplo-estilo-<nome>`; guias em `docs/estilo-<nome>.md`.
- **14 objetivos** (o que o vídeo quer ser: ritmo, voz, abertura, convite final): curiosidade, aula, notícia, finanças, fé, negócio, receita, esporte, saúde, tecnologia, história, ciência, venda e tutorial. Qualquer estilo combina com qualquer objetivo (`npm run estilos`, `npm run objetivos`). O antigo "modelo de vídeo" virou Estilo + Objetivo; o que você já tinha continua funcionando.
- **39 tipos de slide de carrossel** (10 clássicos e 29 novos), com 28 carrosséis de exemplo em `carrosseis/`. Catálogo em `docs/carrossel-templates.md`.
- **797 peças 3D** (629 desenhadas no estúdio e 168 modelos GLB de licença CC0), 16 cenários, efeitos sonoros por evento, discretos sob a narração, e 10 climas de trilha de fundo próprios que mudam a cada vídeo e abaixam sozinhos sob a voz.
- **Fotos e trechos de vídeo (b-roll) de licença livre**, buscados e registrados em `fontes.md` pelo próprio estúdio.

## Vozes
| Provedor | Variáveis | Tempo por palavra |
|---|---|---|
| ElevenLabs (a padrão) | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`. A conta grátis dá cerca de 10.000 créditos por mês (uns 10 minutos de fala) e só as 10 vozes padrão funcionam nela; as da biblioteca pedem plano pago. Quando a cota acabar: assinar um plano ou criar outra conta grátis com outro e-mail e trocar a chave. Passo a passo no estúdio (Começar > Voz) e no Guia 01 | exato |
| Fish Audio | `FISH_API_KEY`, `FISH_VOICE_ID`, `FISH_MODEL` (padrão `s2.1-pro`) | por reconhecimento de fala (Whisper) se instalado, senão pelas pausas do áudio |
| arquivo | nenhuma (sua gravação em `projetos/<nome>/narracao.mp3`) | por Whisper (precisa de faster-whisper) |
| mock | nenhuma | estimado, sem som de voz |

Grátis x pagas, com preços conferidos: Guia 01 (`guias/src/01-instalacao.md`, seção "A voz").

Escolha a padrão em `ILU_VOZ` no `.env` ou com `--voz=` no comando. **Use uma voz só por página.**

## Comandos
```bash
npm run estudio -- --abrir     # estúdio web local (o mesmo que Abrir Estúdio): primeira vez, meus vídeos, projetos, atualizar
npm run status                 # tabela com o estado e o próximo passo de cada projeto
npm run doctor                 # confere Node, FFmpeg, Chromium, WebGL, fontes e chaves
npm run prova                  # vídeo de exemplo com voz de teste (1 a 3 minutos)
npm run video -- <projeto> --voz=elevenlabs   # vídeo completo
npm run video -- <projeto> --foto=12.5   # só um quadro em tela cheia
npm run video -- <projeto> --voz=mock --sem-render --guias   # só o controle de qualidade, com guias de zona segura
npm run previa -- <projeto>    # prévia interativa no navegador: barra de tempo, áudio, guias e caixas do QA
npm run carrossel -- <nome>    # carrossel em PNG (39 tipos de slide, ver docs/carrossel-templates.md)
npm run marca -- --ver         # marca atual (troca com a skill marca ou npm run marca -- --listar)
npm run sincronizar            # depois de mexer numa skill ou no CLAUDE.md: atualiza a cópia do Codex
npm test                       # testes do motor
```
**Sincronia exata com Fish Audio ou gravação própria:** o instalador põe o alinhador de voz sem Python (Whisper em Node, `ferramentas/alinhar-voz.mjs`, em `.programas/alinhador`). Quem já tem `faster-whisper` no Python também serve. Sem nenhum, o estúdio cai no alinhamento por pausas.

Quadros já renderizados ficam em `projetos/<nome>/cache`. Se o render for interrompido, rodar de novo continua de onde parou.

## Claude Code ou Codex
O estúdio é o mesmo nos dois: mesmos comandos, mesmas skills, mesmas regras. Use o assistente que você já paga.

| | Claude Code (Anthropic) | Codex (OpenAI) |
|---|---|---|
| Plano | Claude Pro ou superior | plano do ChatGPT com Codex; recomendamos Plus ou superior (Free e Go têm limites baixos para uma sessão de vídeo) |
| Regras que ele lê | `CLAUDE.md` | `AGENTS.md` (o mesmo texto, mais uma seção só do Codex) |
| Skills | `.claude/skills/` | `.agents/skills/` (cópia gerada; a fonte é `.claude/skills/`) |
| Chamar uma skill | pedir em português, ou `/comece`, `/video` | pedir em português, ou `$comece`, `$video` (`$` mostra a lista) |
| Primeira abertura | aprove os comandos do estúdio quando ele pedir | **confie na pasta** quando ele perguntar: sem Git, a pasta abre só para leitura e as configurações de `.codex/` não carregam |
| Internet (voz, Chromium) | pede permissão por comando | `.codex/config.toml` liga a internet só nesta pasta, e `.codex/rules/ilustrando.rules` libera só os comandos do estúdio (`node src/...`, `npm run ...`, `npm test`, `npm ci`, `npx playwright install chromium`, `ffmpeg`) |
| Modo de permissão | o padrão | **Ask for approval**. Nunca use Full access: o estúdio não precisa |
| Mudou uma regra ou skill | vale na próxima mensagem | feche e abra o Codex (ele lê tudo só no começo da sessão) |

Como as duas versões ficam iguais: o `CLAUDE.md` e `.claude/skills/` são a fonte. `npm run sincronizar` copia as skills para `.agents/skills/` e o texto do `CLAUDE.md` para dentro do `AGENTS.md` (entre as marcas `CLAUDE.md:inicio` e `CLAUDE.md:fim`); `npm test` falha se as duas versões divergirem, e `npm run empacotar` sincroniza antes de montar o zip. O `npm run doctor` diz em qual dos dois você está e se os arquivos estão em dia, sem exigir nenhum.

Limites conhecidos do Codex (checados em 18/10/2026): ainda não testamos em máquina real o Chromium dentro do sandbox do Mac e do Windows, nem se o app de desktop lê `AGENTS.md` e skills igual ao Terminal; se a skill `critico` não conseguir abrir a imagem da folha de contato, ela julga pelo relatório numérico do QA. Fontes: learn.chatgpt.com/docs/agent-configuration/agents-md, learn.chatgpt.com/docs/build-skills, learn.chatgpt.com/docs/config-file/config-reference, learn.chatgpt.com/docs/agent-configuration/rules e code.claude.com/docs/en/memory.

## Pastas
```
src/video/      motor de vídeo (3D + traço + tipografia, QA, narração, som)
src/carrossel   gerador de carrossel
marca/          cores por página (tokens.json) e símbolo
fontes/         Inter Tight e as fontes dos estilos (OFL e Apache 2.0)
docs/           formato da cena
.claude/skills  o método: comece, marca, pauta, roteiro, video, cena, critico, carrossel, publicar, referencia
CLAUDE.md       regras do estúdio para o Claude Code
AGENTS.md       as mesmas regras para o Codex (gerado em parte pelo npm run sincronizar)
.agents/skills  cópia das skills para o Codex (não edite; rode npm run sincronizar)
.codex/         configuração e regras do Codex para esta pasta (só valem com a pasta confiável)
scripts/        marca.mjs (sua marca), sincronizar-skills.mjs, verificar.mjs, atualizar.mjs, buscar-imagem.mjs e buscar-broll.mjs (fotos e b-roll de licença livre), folha-carrossel.mjs
src/licenca     stubs open-source (sem ativação comercial)
src/pacote      manifesto assinado, verificação e atualização segura
MAPA.md         o que é cada pasta e arquivo (o que é seu e o que é do kit)
VERSAO          versão instalada; CHANGELOG.md diz o que mudou
guias/          os 6 guias em PDF (fontes em guias/src)
templates/      identidades prontas, calendário de postagem e modelos de legenda
ferramentas/    scripts opcionais em Python (Whisper)
test/           testes automáticos
projetos/       um vídeo por pasta (roteiro.md e o que o motor gerar); exemplo/ é o vídeo de teste e exemplo-estilo-*/ os exemplos de estilo
carrosseis/     um carrossel por pasta (28 exemplos prontos para copiar)
```


