#!/usr/bin/env python3
"""
Descarga solo ciclovías de Hermosillo desde OpenStreetMap usando Overpass API.
"""

import overpy
import json
from pathlib import Path
import time

def descargar_ciclovias():
    """Descarga ciclovías de Hermosillo"""
    print("[INFO] Descargando ciclovías de Hermosillo...")
    
    api = overpy.Overpass()
    
    # Bounding box de Hermosillo (sur, oeste, norte, este)
    bbox = "29.00,-111.05,29.15,-110.90"
    
    # Query para ciclovías con timeout mayor
    query = f"""
    [out:json][timeout:120];
    (
      way["highway"="cycleway"]({bbox});
      way["cycleway"="lane"]({bbox});
      way["cycleway"="track"]({bbox});
      way["bicycle"="designated"]({bbox});
    );
    (._;>;);
    out geom;
    """
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if attempt > 0:
                wait_time = 10 * attempt
                print(f"[INFO] Esperando {wait_time} segundos antes de reintentar...")
                time.sleep(wait_time)
            
            print(f"[INFO] Intento {attempt + 1}/{max_retries}...")
            result = api.query(query)
            
            # Convertir ciclovías a GeoJSON
            features = []
            for way in result.ways:
                coordinates = [[float(node.lon), float(node.lat)] for node in way.nodes]
                
                feature = {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coordinates
                    },
                    "properties": {
                        "id": way.id,
                        "name": way.tags.get("name", "Sin nombre"),
                        "highway": way.tags.get("highway", ""),
                        "cycleway": way.tags.get("cycleway", ""),
                        "bicycle": way.tags.get("bicycle", ""),
                        "surface": way.tags.get("surface", ""),
                        "width": way.tags.get("width", ""),
                        "lit": way.tags.get("lit", "")
                    }
                }
                features.append(feature)
            
            geojson = {
                "type": "FeatureCollection",
                "features": features,
                "metadata": {
                    "source": "OpenStreetMap",
                    "date": "2025-11-18",
                    "count": len(features),
                    "area": "Hermosillo, Sonora, México",
                    "type": "ciclovias"
                }
            }
            
            # Guardar archivo
            output_dir = Path("public/datajson/osm")
            output_dir.mkdir(parents=True, exist_ok=True)
            output_file = output_dir / "hermosillo_ciclovias.geojson"
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(geojson, f, ensure_ascii=False, indent=2)
            
            print(f"[OK] Guardado: {output_file}")
            print(f"[INFO] Total ciclovías: {len(features)}")
            return
            
        except Exception as e:
            print(f"[ERROR] Intento {attempt + 1} falló: {e}")
            if attempt == max_retries - 1:
                print("[ERROR] Todos los intentos fallaron")

if __name__ == "__main__":
    descargar_ciclovias()
