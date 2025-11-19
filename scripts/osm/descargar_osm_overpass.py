#!/usr/bin/env python3
"""
descargar_osm_overpass.py

Ejemplo: descarga semáforos de Hermosillo usando Overpass
y guarda en GeoJSON.

Instalación:
pip install overpy

Uso:
python scripts/osm/descargar_osm_overpass.py
"""

import os
import json
import overpy

OUTPUT_DIR = os.path.join("public", "datajson", "osm")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Bounding box aproximado para Hermosillo (lat_min, lon_min, lat_max, lon_max)
BBOX = (28.90, -111.10, 29.20, -110.80)

def main():
    api = overpy.Overpass()
    lat_min, lon_min, lat_max, lon_max = BBOX

    query = f"""
    [out:json];
    node
      ["highway"="traffic_signals"]
      ({lat_min},{lon_min},{lat_max},{lon_max});
    out body;
    """
    print("[INFO] Enviando consulta a Overpass...")
    result = api.query(query)

    features = []
    for node in result.nodes:
        feat = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [float(node.lon), float(node.lat)]
            },
            "properties": dict(node.tags)
        }
        features.append(feat)

    geojson = {
        "type": "FeatureCollection",
        "features": features
    }
    path = os.path.join(OUTPUT_DIR, "hermosillo_semaforos_overpass.geojson")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(geojson, f, ensure_ascii=False)
    print(f"[OK] Guardado: {path}")

if __name__ == "__main__":
    main()
