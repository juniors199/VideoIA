 
 """Transcreve um áudio com tempo por palavra (faster-whisper). Uso: python3 transcrever.py audio.mp3 [modelo] > palavras.json
Opcional: se faltar, o estúdio usa o alinhamento por pausas. Instalação: pip install faster-whisper"""
import json
import subprocess
import sys

import numpy as np

try:
    from faster_whisper import WhisperModel
except ImportError:
    print(json.dumps({"erro": "faster-whisper nao instalado"}))
    sys.exit(3)

audio = sys.argv[1]
modelo = sys.argv[2] if len(sys.argv) > 2 else "small"
m = WhisperModel(modelo, device="cpu", compute_type="int8")
# decodifica com o ffmpeg (já exigido pelo estúdio): evita depender da versão do PyAV
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
amostras = np.frombuffer(raw, dtype=np.float32)
segs, _ = m.transcribe(amostras, language=(sys.argv[3] if len(sys.argv) > 3 else "pt"), word_timestamps=True, vad_filter=True)
out = []
for s in segs:
    for w in s.words or []:
        out.append({"w": w.word.strip(), "t": round(w.start, 3), "f": round(w.end, 3), "p": round(w.probability, 3)})
print(json.dumps({"palavras": out}, ensure_ascii=False))
