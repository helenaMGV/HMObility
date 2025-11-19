#!/usr/bin/env python3
"""
Descarga calles principales de Hermosillo desde OpenStreetMap usando Overpass API
y genera GeoJSON para uso en frontend.

Calles principales: primary, secondary, tertiary
"""

import overpy
import json
from pathlib import Path

def descargar_calles_principales():
    """Descarga calles principales de Hermosillo"""
    print("[INFO] Descargando calles principales de Hermosillo...")
    
    api = overpy.Overpass()
    
    # Bounding box de Hermosillo (sur, oeste, norte, este)
    # Hermosillo centro: ~29.0729° N, -110.9559° W
    bbox = "29.00,-111.05,29.15,-110.90"
    
    # Query para calles principales (primary, secondary, tertiary)
    query = f"""
    [out:json][timeout:90];
    (
      way["highway"="primary"]({bbox});
      way["highway"="secondary"]({bbox});
      way["highway"="tertiary"]({bbox});
      way["highway"="trunk"]({bbox});
    );
    (._;>;);
    out geom;
    """
    
    try:
        print("[INFO] Enviando consulta a Overpass...")
        result = api.query(query)
        
        # Convertir a GeoJSON
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
                    "highway": way.tags.get("highway", "unknown"),
                    "maxspeed": way.tags.get("maxspeed", ""),
                    "lanes": way.tags.get("lanes", ""),
                    "surface": way.tags.get("surface", ""),
                    "lit": way.tags.get("lit", ""),
                    "oneway": way.tags.get("oneway", "no")
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
                "area": "Hermosillo, Sonora, México"
            }
        }
        
        # Guardar archivo
        output_dir = Path("public/datajson/osm")
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / "hermosillo_calles_principales.geojson"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, ensure_ascii=False, indent=2)
        
        print(f"[OK] Guardado: {output_file}")
        print(f"[INFO] Total calles: {len(features)}")
        
    except Exception as e:
        print(f"[ERROR] {e}")

if __name__ == "__main__":
    descargar_calles_principales()
