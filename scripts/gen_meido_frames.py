"""
Genera los fotogramas del avatar de M.E.I.D.O para el demo del portfolio,
usando el código real del personaje (M.E.I.D.O/python-backend/isla_personaje.py).

Uso:  python3 scripts/gen_meido_frames.py ../M.E.I.D.O/python-backend
Salida: src/demos/meido-frames.json  ({estado: {fps, frames: [svg, ...]}})
"""
import json
import os
import re
import sys

FPS = 12
ESTADOS = ["reposo", "escuchando", "pensando", "hablando", "trabajando", "buscando", "permiso", "hecho"]

ruta = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else "../M.E.I.D.O/python-backend")
sys.path.insert(0, ruta)
import isla_personaje as ip  # noqa: E402

salida = {}
for estado in ESTADOS:
    periodo = ip.ESTADOS[estado][1]
    # un ciclo completo del flote, como mínimo 2 s para que se note el parpadeo/ondas
    duracion = max(periodo, 2.0)
    n = round(duracion * FPS)
    frames = []
    for i in range(n):
        s = ip.svg(estado, i / FPS, 200)
        s = re.sub(r' width="\d+" height="\d+"', "", s, count=1)  # escalable por CSS
        frames.append(s)
    salida[estado] = {"fps": FPS, "color": ip.ESTADOS[estado][0], "frames": frames}

destino = os.path.join(os.path.dirname(__file__), "..", "src", "demos", "meido-frames.json")
with open(destino, "w", encoding="utf-8") as f:
    json.dump(salida, f, ensure_ascii=False, separators=(",", ":"))
print(destino, sum(len(v["frames"]) for v in salida.values()), "fotogramas")
