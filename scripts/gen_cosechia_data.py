"""
Extrae del seeder real de CosechIA (database/seeders/CatalogoSeeder.php) las variedades
y plagas que usa el demo del portfolio.

Uso:  python3 scripts/gen_cosechia_data.py ../CosechIA/cosechia1
Salida: src/demos/cosechia-data.json
"""
import json
import os
import re
import sys

raiz = sys.argv[1] if len(sys.argv) > 1 else "../CosechIA/cosechia1"
php = open(os.path.join(raiz, "database/seeders/CatalogoSeeder.php"), encoding="utf-8").read()


def arreglo(fila):
    """Convierte una fila PHP ['k' => v, ...] en dict."""
    d = {}
    for k, v in re.findall(r"'(\w+)' => ('(?:[^'\\]|\\.)*'|\[[^\]]*\]|[\d.]+|null)", fila):
        if v.startswith("'"):
            d[k] = v[1:-1].replace("\\'", "'")
        elif v.startswith("["):
            d[k] = re.findall(r"'([^']*)'", v)
        elif v == "null":
            d[k] = None
        else:
            d[k] = float(v)
    return d


filas = [arreglo(f) for f in re.findall(r"\[('nombre' => [^\n]*)\],?\n", php)]
variedades = [f for f in filas if "brix_optimo_cosecha_min" in f]
plagas = [f for f in filas if "nombre_cientifico" in f]
valles = [f for f in filas if "clima_winkler" in f]

destino = os.path.join(os.path.dirname(__file__), "..", "src", "demos", "cosechia-data.json")
with open(destino, "w", encoding="utf-8") as f:
    json.dump({"variedades": variedades, "plagas": plagas, "valles": valles}, f, ensure_ascii=False, indent=1)
print(len(variedades), "variedades,", len(plagas), "plagas,", len(valles), "valles")
