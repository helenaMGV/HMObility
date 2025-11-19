#!/usr/bin/env python3
"""
descargar_osm_hermosillo.py

Descarga datos de OpenStreetMap para Hermosillo, Sonora usando osmnx
y genera GeoJSON de semáforos, cruces peatonales, ciclovías y calles.
Requiere Python 3.10+ y conexión a internet.

Instalación:
pip install osmnx geopandas

Uso:
python scripts/osm/descargar_osm_hermosillo.py
"""

import os
import osmnx as ox

# 1. Parámetros generales
PLACE_NAME = "Hermosillo, Sonora, Mexico"
OUTPUT_DIR = os.path.join("public", "datajson", "osm")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def export_gdf(gdf, filename: str):
    """Exporta un GeoDataFrame a GeoJSON dentro de OUTPUT_DIR."""
    if gdf is None or gdf.empty:
        print(f"[WARN] GeoDataFrame vacío para {filename}")
        return
    path = os.path.join(OUTPUT_DIR, filename)
    gdf.to_file(path, driver="GeoJSON")
    print(f"[OK] Guardado: {path}")

def main():
    print(f"[INFO] Descargando límites de {PLACE_NAME}...")
    # Polígono de la ciudad
    hermosillo = ox.geocode_to_gdf(PLACE_NAME)
    polygon = hermosillo.geometry.iloc[0]

    print("[INFO] Descargando geometrías de OSM...")
    tags = {
        "highway": True,
        "traffic_signals": True,
        "crossing": True,
        "cycleway": True
    }

    gdf = ox.geometries_from_polygon(polygon, tags)

    # 2. Semáforos
    print("[INFO] Filtrando semáforos...")
    if "highway" in gdf.columns:
        semaforos = gdf[gdf["highway"] == "traffic_signals"].copy()
    else:
        semaforos = gdf[gdf["traffic_signals"].notna()].copy()
    export_gdf(semaforos, "hermosillo_semaforos.geojson")

    # 3. Cruces peatonales
    print("[INFO] Filtrando cruces peatonales...")
    cruces = gdf[gdf["highway"] == "crossing"].copy()
    export_gdf(cruces, "hermosillo_cruces_peatonales.geojson")

    # 4. Ciclovías
    print("[INFO] Filtrando ciclovías...")
    ciclovias_mask = (
        (gdf["highway"] == "cycleway")
        | (("cycleway" in gdf.columns) & (gdf["cycleway"].notna()))
    )
    ciclovias = gdf[ciclovias_mask].copy()
    export_gdf(ciclovias, "hermosillo_ciclovias.geojson")

    # 5. Red de calles para vehículos
    print("[INFO] Descargando red de calles para vehículos...")
    G = ox.graph_from_polygon(polygon, network_type="drive")
    calles = ox.graph_to_gdfs(G, nodes=False, edges=True)
    export_gdf(calles, "hermosillo_calles_principales.geojson")

    print("[DONE] Descarga y exportación completadas.")

if __name__ == "__main__":
    main()
