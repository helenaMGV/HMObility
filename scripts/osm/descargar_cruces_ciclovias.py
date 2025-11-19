#!/usr/bin/env python3
"""
Descarga cruces peatonales y ciclovías de Hermosillo desde OpenStreetMap
usando Overpass API y genera GeoJSON.
"""

import overpy
import json
from pathlib import Path

def descargar_cruces_y_ciclovias():
    """Descarga cruces peatonales y ciclovías de Hermosillo"""
    print("[INFO] Descargando cruces peatonales y ciclovías de Hermosillo...")
    
    api = overpy.Overpass()
    
    # Bounding box de Hermosillo (sur, oeste, norte, este)
    bbox = "29.00,-111.05,29.15,-110.90"
    
    # Query para cruces peatonales
    print("[INFO] Descargando cruces peatonales...")
    query_cruces = f"""
    [out:json][timeout:60];
    (
      node["highway"="crossing"]({bbox});
      node["crossing"="zebra"]({bbox});
      node["crossing"="marked"]({bbox});
    );
    out;
    """
    
    try:
        result_cruces = api.query(query_cruces)
        
        # Convertir cruces a GeoJSON
        features_cruces = []
        for node in result_cruces.nodes:
            feature = {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(node.lon), float(node.lat)]
                },
                "properties": {
                    "id": node.id,
                    "type": "cruce_peatonal",
                    "crossing": node.tags.get("crossing", "unknown"),
                    "crossing_ref": node.tags.get("crossing_ref", ""),
                    "tactile_paving": node.tags.get("tactile_paving", ""),
                    "supervised": node.tags.get("supervised", ""),
                    "highway": node.tags.get("highway", "crossing")
                }
            }
            features_cruces.append(feature)
        
        geojson_cruces = {
            "type": "FeatureCollection",
            "features": features_cruces,
            "metadata": {
                "source": "OpenStreetMap",
                "date": "2025-11-18",
                "count": len(features_cruces),
                "area": "Hermosillo, Sonora, México",
                "type": "cruces_peatonales"
            }
        }
        
        # Guardar cruces
        output_dir = Path("public/datajson/osm")
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file_cruces = output_dir / "hermosillo_cruces_peatonales.geojson"
        
        with open(output_file_cruces, 'w', encoding='utf-8') as f:
            json.dump(geojson_cruces, f, ensure_ascii=False, indent=2)
        
        print(f"[OK] Guardado: {output_file_cruces}")
        print(f"[INFO] Total cruces: {len(features_cruces)}")
        
    except Exception as e:
        print(f"[ERROR] Cruces: {e}")
    
    # Query para ciclovías
    print("[INFO] Descargando ciclovías...")
    query_ciclovias = f"""
    [out:json][timeout:60];
    (
      way["highway"="cycleway"]({bbox});
      way["cycleway"="lane"]({bbox});
      way["cycleway"="track"]({bbox});
      way["bicycle"="designated"]({bbox});
    );
    out geom;
    """
    
    try:
        result_ciclovias = api.query(query_ciclovias)
        
        # Convertir ciclovías a GeoJSON
        features_ciclovias = []
        for way in result_ciclovias.ways:
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
            features_ciclovias.append(feature)
        
        geojson_ciclovias = {
            "type": "FeatureCollection",
            "features": features_ciclovias,
            "metadata": {
                "source": "OpenStreetMap",
                "date": "2025-11-18",
                "count": len(features_ciclovias),
                "area": "Hermosillo, Sonora, México",
                "type": "ciclovias"
            }
        }
        
        # Guardar ciclovías
        output_file_ciclovias = output_dir / "hermosillo_ciclovias.geojson"
        
        with open(output_file_ciclovias, 'w', encoding='utf-8') as f:
            json.dump(geojson_ciclovias, f, ensure_ascii=False, indent=2)
        
        print(f"[OK] Guardado: {output_file_ciclovias}")
        print(f"[INFO] Total ciclovías: {len(features_ciclovias)}")
        
    except Exception as e:
        print(f"[ERROR] Ciclovías: {e}")

if __name__ == "__main__":
    descargar_cruces_y_ciclovias()
