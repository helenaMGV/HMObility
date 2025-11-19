#!/usr/bin/env python3
"""
Muestra resumen de datos OSM descargados para Hermosillo.
"""

import json
from pathlib import Path

def mostrar_resumen():
    """Muestra resumen de todos los archivos GeoJSON"""
    
    print("\n" + "="*60)
    print("RESUMEN DE DATOS OSM - HERMOSILLO")
    print("="*60 + "\n")
    
    osm_dir = Path("public/datajson/osm")
    
    archivos = {
        "hermosillo_semaforos_overpass.geojson": "Semáforos",
        "hermosillo_cruces_peatonales.geojson": "Cruces Peatonales",
        "hermosillo_ciclovias.geojson": "Ciclovías",
        "hermosillo_calles_principales.geojson": "Calles Principales"
    }
    
    total_features = 0
    
    for archivo, descripcion in archivos.items():
        ruta = osm_dir / archivo
        
        if ruta.exists():
            with open(ruta, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            count = len(data['features'])
            total_features += count
            size_mb = ruta.stat().st_size / 1024 / 1024
            
            print(f"[OK] {descripcion}")
            print(f"     Archivo: {archivo}")
            print(f"     Features: {count:,}")
            print(f"     Tamaño: {size_mb:.2f} MB")
            
            # Mostrar sample de propiedades
            if count > 0:
                sample = data['features'][0]['properties']
                props = list(sample.keys())[:5]
                print(f"     Propiedades: {', '.join(props)}")
            print()
        else:
            print(f"[X] {descripcion}")
            print(f"     Archivo no encontrado: {archivo}\n")
    
    print("-"*60)
    print(f"TOTAL FEATURES: {total_features:,}")
    print("-"*60 + "\n")
    
    # Verificar rutas generadas
    print("RUTAS DE TRANSPORTE GENERADAS:")
    print("-"*60)
    
    ruta_real = Path("public/datajson/rutas_escenario_base_real.json")
    if ruta_real.exists():
        with open(ruta_real, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"[OK] Rutas Reales Basadas en OSM")
        print(f"     Archivo: rutas_escenario_base_real.json")
        print(f"     Total rutas: {len(data['rutas'])}\n")
        
        for ruta in data['rutas']:
            puntos = len(ruta['coordenadas'])
            km = ruta['metadata']['longitud_km']
            print(f"     - {ruta['nombre']}")
            print(f"       Tipo: {ruta['tipo']}, Puntos: {puntos}, Longitud: {km} km")
    else:
        print(f"[X] Archivo no encontrado: rutas_escenario_base_real.json")
    
    print("\n" + "="*60)
    print("Datos listos para usar en frontend")
    print("="*60 + "\n")

if __name__ == "__main__":
    mostrar_resumen()
