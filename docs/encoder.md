

# Encoder do MP4 final (hardware com reserva no x264)

Desde 22/10/2026 o MP4 final sai pelo encoder de vídeo da placa quando a máquina tem um que funciona, com qualidade constante, e volta sozinho para o x264 se algo falhar. Código: `src/video/encoder.mjs` (escolha, detecção, conferência e reserva) e `renderizar()` em `src/video/render.mjs`. Testes: `test/encoder.test.mjs`.

## Decisão
- Aprovada na revisão do estúdio: "Se é 2,5x mais rápido, vale a pena sim usar. Lembrando que também temos usuários que utilizam windows".
- **Mac:** `h264_videotoolbox -q:v 65` em todos os estilos, menos `antiguidade`, que fica no x264.
- **Windows e Linux:** tenta, nesta ordem, `h264_nvenc` (NVIDIA), `h264_qsv` (Intel) e `h264_amf` (AMD); `antiguidade` fica no x264.
- **Só o Mac foi medido** (M3 Pro). Os ajustes de NVENC, QSV e AMF foram escolhidos de forma conservadora para ficar no nível do x264 crf 18 a 20, mas não há máquina Windows com essas placas aqui: nada foi medido neles. A detecção por teste real e a reserva no x264 seguram o caso de não funcionarem.

## Medições (Mac)
A/B do estilo padrão, quadros JPEG do motor como referência (`npm run ab:encoder`):

| Estilo | Encoder | VMAF médio | VMAF mínimo | Tamanho | Tempo de codificação |
|---|---|---|---|---|---|
| padrao (1º A/B, auditoria) | x264 crf 23 | 96,4 | 90,3 | 5,3 MB | 4,1 s |
| padrao (1º A/B, auditoria) | VideoToolbox q65 | 97,0 | 94,7 | 4,7 MB | 1,6 s |
| padrao (cep, 10 s, GOP 250) | x264 crf 23 | 96,95 | 85,17 | 6,12 MB | 6,2 s |
| padrao (cep, 10 s, GOP 250) | VideoToolbox q65 | 97,23 | 85,89 | 3,37 MB | 1,6 s |
| editorial (10 s, medido antes da mudança de escopo) | x264 crf 23 | 96,36 | 82,91 | 3,87 MB | |
| editorial (10 s) | VideoToolbox q65 | 96,77 | 82,91 | 2,18 MB | |

Os outros estilos (minimalista, papel, pontilhismo, impresso, cartões, tubo, linhas, anatomia, fino, letreiro, interface, colagem, ribalta, mundos) **foram aprovados pelo estúdio sem teste** ("os que forem mais eficientes já estão aprovados").

**antiguidade** (grão de filme e mosaico), uma checagem de 5 s (demo-antiguidade):

| Encoder | VMAF médio | VMAF mínimo | Tamanho em 5 s |
|---|---|---|---|
| x264 crf 18, tune grain, teto 12 Mb/s | 93,07 | 87,26 | 8,1 MB |
| VideoToolbox q65 | 96,18 | 92,36 | 25,8 MB (passaria de 100 MB num vídeo de 22 s) |
| VideoToolbox 8 Mb/s, teto 12 Mb/s | 82,92 | 72,86 | 5,0 MB (mosaico borrado a olho em resolução cheia) |

Sem teto o arquivo fica grande demais para o Instagram; com teto o defeito aparece a olho. Por isso antiguidade fica no x264.

**Render completo** (projeto destaque-receita-bolo, estilo papel, 49 s, 1.476 quadros, sem cache, voz de teste, sem trilha):

| | x264 | VideoToolbox |
|---|---|---|
| Até o MP4 pronto | 34 s | 21 s |
| Comando inteiro (com QA do arquivo) | 48 s | 34 s |
| Tamanho | 19,1 MB | 13,3 MB |
| VMAF contra os quadros (médio / mínimo) | 96,15 / 82,72 | 96,63 / 82,72 |

O QA do arquivo passou nos dois (codec h264, 1080x1920, 30 qps, duração); as 2 falhas de conteúdo do relatório (sombra no corte e borda clara) são do projeto e aparecem iguais nos dois.

## Ajustes por encoder
Todos saem com a mesma imagem para o resto do pipeline: H.264 High, nível 4.2 (compatível com o Instagram), yuv420p na faixa de TV, BT.709, 30 qps, GOP 250 (o mesmo do x264) e `+faststart`.

| Encoder | Argumentos de qualidade | Observação |
|---|---|---|
| h264_videotoolbox | `-q:v 65` | medido; GOP 250 (o padrão do FFmpeg era 12, desperdiçava bits) |
| h264_nvenc | `-preset p5 -tune hq -rc vbr -cq 19 -b:v 0 -maxrate 8M -bufsize 16M` | não medido; teto para 90 s ficar abaixo de 100 MB |
| h264_qsv | `-preset medium -global_quality 20`, `-pix_fmt nv12` | não medido; o QSV trabalha em nv12 (mesmo 4:2:0 de 8 bits) |
| h264_amf | `-quality quality -rc cqp -qp_i 18 -qp_p 20 -qp_b 22` | não medido |
| libx264 (reserva) | `-preset medium -crf 23 -maxrate 6M` (antiguidade: crf 18, tune grain, 12M) | o de sempre |

## Detecção
1. Lista `ffmpeg -encoders` e, para cada candidato do sistema, faz uma codificação real de 1 s em 1080x1920 com os argumentos de verdade, conferida com o ffprobe. Estar na lista não basta: sem driver o encoder aparece e falha.
2. O resultado fica num arquivo por máquina, fora do projeto, com a versão e o hash do `ffmpeg -version`: Mac `~/Library/Caches/Ilustrando/encoder.json`, Windows `%LOCALAPPDATA%\Ilustrando\encoder.json`, Linux `~/.cache/ilustrando/encoder.json` (`ILU_ENCODER_CACHE` troca o caminho). Detectar leva ~0,5 s na primeira vez; depois, ~25 ms.
3. FFmpeg novo (outro hash) refaz a detecção. Um render que falhou com o hardware marca o arquivo e os renders seguintes vão para o x264 por 7 dias.

## Reserva e conferência
- Depois de cada render, o ffprobe confere o MP4: faixa de vídeo H.264 High até nível 4.2, yuv420p, número de quadros igual ao que entrou (com áudio mais curto, vale o áudio), arquivo até 100 MB.
- Se o encoder de hardware der erro ou o arquivo reprovar, o MP4 é apagado e refeito com o x264 (os quadros vêm do cache, sem renderizar de novo). O log mostra `encoder: libx264 (reserva: ...)`.
- Se até o x264 sair com defeito, o arquivo é apagado e o render falha: nunca sai vídeo quebrado ou sem imagem.
- Quadro que não renderiza não é culpa do encoder: o erro sobe direto, sem trocar.

## Configuração
`"encoder"` no `ilustrando.config.json` ou `ILU_ENCODER` no ambiente (o ambiente vence). Padrão `auto`.
- `auto`: hardware em todos os estilos menos antiguidade; x264 onde não houver hardware que funcione.
- `x264`: sempre x264 (o comportamento de antes).
- `hardware`: hardware em todos os estilos, inclusive antiguidade (que tende a passar de 100 MB e aí cai na reserva do x264).

Fora do render principal continuam no x264: a marca d'água da versão não ativada (`selarVideo`) e o `codificar()` por pasta.

## Observação
O x264 já gravava `color_transfer` e `color_primaries` como "unknown" no MP4 (só `colorspace=bt709` chega), apesar das opções na linha de comando; o VideoToolbox sai igual. Não mudou nesta troca.




