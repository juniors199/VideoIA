

# Render mais rápido, sem perda de qualidade

Máquina: 4 núcleos (nproc), 15 GB, com outros renders rodando ao mesmo tempo (load 11 a 29). Tempos são da etapa 5 do video.mjs (quadros + capa nos 3 primeiros + x264 com áudio), sem cache, reproduzida por um script de bancada idêntico para as duas versões.

| Teste | Original | Novo | Ganho |
|---|---|---|---|
| cep, 6 s (180 quadros), load ~18 | 246 s | 109 s | 2,3x |
| tampa-de-bueiro, 12 s (360 quadros), load ~22 a 29 | 629 s | 263 s | 2,4x |

## O que mudou (patch: RENDER-RAPIDO.patch, só src/video/render.mjs e src/video/video.mjs)
1. Um navegador por worker em vez de várias abas no mesmo navegador. Todas as abas dividiam um único processo de GPU (swiftshader); só isso dá cerca de 1,5x a 1,9x (medido: 995/753 ms por quadro com abas contra 528/514 ms com navegadores separados).
2. Captura direta pelo CDP (Page.captureScreenshot, JPEG q90) no lugar de page.screenshot: mesmos bytes, sem as voltas extras do Playwright.
3. JPEG fica na memória: grava uma vez no cache (async) e vai direto ao ffmpeg por pipe (image2pipe), em ordem, enquanto os quadros seguintes ainda renderizam. Acabou o grava, copia para o cache, relê do disco. A pasta quadros/ não existe mais.
4. A capa é feita antes e entra nos quadros 0 a 2 pelo pipe.
5. Workers = os.availableParallelism() - 1, limitado pela memória livre (1,2 GB por navegador em escala 1). Nesta máquina continua 3.
6. Parâmetros do x264 numa função só (argsVideo), usada pelo codificar antigo e pelo novo renderizar.

## Prova
- JPEGs capturados (os que entram no encode): idênticos byte a byte, 180 de 180 (cep) e 360 de 360 (tampa-de-bueiro, duas rodadas novas). Arquivos do cache também idênticos.
- Entrada do encoder: framemd5 dos quadros decodificados igual (pasta + image2 no original, pipe + image2pipe no novo).
- O mp4 em si não fecha framemd5 nem no ORIGINAL contra ele mesmo: o x264 multi-thread com maxrate/bufsize desta máquina não é determinístico (duas codificações da mesma pasta, mesmo comando, deram md5 diferentes). Com -threads 1, pasta e pipe dão o mesmo md5 de vídeo decodificado. Stream final igual: h264 High, 1080x1920, yuv420p, bt709, 30 fps, mesmo número de quadros, áudio AAC igual (md5 do áudio decodificado igual).

## Achado importante (latente no original)
O quadro NÃO é função pura de t. Os títulos usam will-change: transform, e o compositor do Chromium reaproveita o raster dessas camadas entre quadros; a imagem depende do quadro anterior feito na mesma aba. Uma versão com fila dinâmica deu 44 de 177 quadros diferentes (PSNR ~48 dB, só na faixa do título). Por isso o novo código mantém exatamente a divisão do original (worker w faz falta[w], falta[w+W], ...) e ainda renderiza os 3 quadros que viram capa. Consequência no original: um render com cache parcial, ou com outro número de workers, já sai levemente diferente de um render limpo. Para corrigir de vez seria preciso mexer no runtime (tirar will-change dos spans do título ou forçar re-raster), o que muda pixels; ficou fora deste patch.

## Não testado
Rodada ponta a ponta pela CLI (`npm run video`) e o modo --rapido (escala 0.5, capa reduzida pelo mesmo comando ffmpeg de antes). A lógica é a mesma da bancada. O patch aplica limpo no diretório real atual (patch --dry-run), não foi aplicado.

## GPU no Mac e memória certa (19/10/2026)
- **GPU (Metal) por padrão no Mac.** O swiftshader desenhava o WebGL na CPU. Com `--use-angle=metal`, o mesmo quadro sai em 90 ms contra 336 ms (M3 Pro, máquina carregada), com a mesma imagem a olho (PSNR 51 dB). Render completo da tampa-de-bueiro (2.148 quadros, 72 s): 140 s, 15 quadros por segundo, com load acima de 100 por causa de outros renders. Se a GPU não der WebGL, o motor volta sozinho para o swiftshader. `ILU_GPU=0` força o modo antigo; `ILU_GPU=1` tenta a GPU fora do Mac.
- **Memória no Mac.** `os.freemem()` só conta as páginas "free", quase zero com o sistema em uso, e o render caía para 1 navegador. Agora soma free, inactive, speculative e purgeable (vm_stat). Com GPU, cada navegador conta 0,6 GB em vez de 1,2 GB. `ILU_WORKERS` fixa o número de navegadores.
- **Determinismo.** Na GPU, o grão do fundo pode variar até 9 tons de 255 entre duas passadas do mesmo t na mesma aba (invisível). Navegadores novos dão o mesmo quadro byte a byte. Os testes que comparam hash exato abrem com `gpu: false`.




