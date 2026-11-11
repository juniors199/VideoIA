# Marcações de voz no roteiro

## Marcações de voz (ElevenLabs v3 e v4)
- Tags de tom ficam **entre colchetes, em inglês**, e não aparecem na legenda nem contam no linter. No máximo **2 por roteiro**: uma na primeira linha que define o jeito do texto todo, `[confident, calm]` ou `[calm, clear]`, e, se quiser, `[warm]` antes do convite final.
- Proibidas (a voz exagera): `[serious]`, `[tense]`, `[dramatic]`, `[excited]`, `[urgent]`, `[whispers]`, `[sad]`, `[angry]`, `[nervous]`, `[pause]`. Notícia e caso em andamento: só `[calm, clear]`.
- Só valem com `--voz=elevenlabs` e modelo `eleven_v3` ou `eleven_v4` (padrão em `ilustrando.config.json`). Com Fish, mock ou modelos antigos elas são ignoradas.
- Estabilidade perto de 0,4 (já no config). Ouça o primeiro vídeo antes de aumentar o uso de tags.
