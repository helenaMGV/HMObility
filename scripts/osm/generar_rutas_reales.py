#!/usr/bin/env python3
"""
Genera rutas de transporte realistas usando calles reales de OSM.
Crea rutas basadas en las calles principales descargadas.
"""

import json
from pathlib import Path
import random

def cargar_calles():
    """Carga las calles principales desde GeoJSON"""
    geojson_path = Path("public/datajson/osm/hermosillo_calles_principales.geojson")
    with open(geojson_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data['features']

def filtrar_calles_por_nombre(calles, nombres_parciales):
    """Filtra calles que contienen alguno de los nombres"""
    resultado = []
    for calle in calles:
        nombre = calle['properties']['name'].lower()
        for nombre_parcial in nombres_parciales:
            if nombre_parcial.lower() in nombre:
                resultado.append(calle)
                break
    return resultado

def generar_ruta_desde_calle(calle, tipo, nombre_ruta, color):
    """Genera una ruta a partir de una calle"""
    return {
        "id": f"ruta_{len(nombre_ruta.replace(' ', '_').lower())}",
        "nombre": nombre_ruta,
        "tipo": tipo,
        "color": color,
        "coordenadas": calle['geometry']['coordinates'],
        "metadata": {
            "osm_id": calle['properties']['id'],
            "highway": calle['properties']['highway'],
            "maxspeed": calle['properties'].get('maxspeed', ''),
            "lanes": calle['properties'].get('lanes', ''),
            "longitud_km": calcular_longitud(calle['geometry']['coordinates'])
        }
    }

def calcular_longitud(coords):
    """Calcula longitud aproximada en km usando distancia euclidiana"""
    if len(coords) < 2:
        return 0
    
    total = 0
    for i in range(len(coords) - 1):
        lon1, lat1 = coords[i]
        lon2, lat2 = coords[i + 1]
        # Aproximación simple (111 km por grado de latitud/longitud)
        dx = (lon2 - lon1) * 111 * 0.8  # Factor de corrección para longitud
        dy = (lat2 - lat1) * 111
        total += (dx**2 + dy**2)**0.5
    
    return round(total, 2)

def generar_rutas_reales():
    """Genera rutas reales basadas en calles de OSM"""
    print("[INFO] Cargando calles de Hermosillo...")
    calles = cargar_calles()
    print(f"[INFO] Total calles cargadas: {len(calles)}")
    
    # Filtrar calles principales conocidas de Hermosillo
    calles_boulevard = filtrar_calles_por_nombre(calles, ['boulevard', 'blvd', 'solidaridad'])
    calles_transversal = filtrar_calles_por_nombre(calles, ['transversal', 'luis', 'rosales'])
    calles_perimetral = filtrar_calles_por_nombre(calles, ['perifér', 'perime', 'norte', 'sur'])
    
    print(f"[INFO] Boulevares encontrados: {len(calles_boulevard)}")
    print(f"[INFO] Transversales encontrados: {len(calles_transversal)}")
    print(f"[INFO] Perimetrales encontrados: {len(calles_perimetral)}")
    
    # Generar rutas para escenario base
    rutas_base = []
    
    # Ruta 1: Boulevard principal (camión)
    if calles_boulevard:
        calle = max(calles_boulevard, key=lambda c: len(c['geometry']['coordinates']))
        ruta = generar_ruta_desde_calle(
            calle, "camion", 
            f"Ruta Centro - {calle['properties']['name']}", 
            "#3b82f6"
        )
        rutas_base.append(ruta)
    
    # Ruta 2: Transversal (auto)
    if calles_transversal:
        calle = calles_transversal[0]
        ruta = generar_ruta_desde_calle(
            calle, "auto",
            f"Ruta Este-Oeste - {calle['properties']['name']}", 
            "#ef4444"
        )
        rutas_base.append(ruta)
    
    # Ruta 3: Periférico (camión)
    if calles_perimetral:
        calle = max(calles_perimetral, key=lambda c: len(c['geometry']['coordinates']))
        ruta = generar_ruta_desde_calle(
            calle, "camion",
            f"Ruta Periférico - {calle['properties']['name']}", 
            "#8b5cf6"
        )
        rutas_base.append(ruta)
    
    # Agregar algunas rutas aleatorias de calles principales
    calles_restantes = [c for c in calles if c not in calles_boulevard + calles_transversal + calles_perimetral]
    if len(calles_restantes) >= 2:
        # Ruta 4: Calle secundaria (auto)
        calle = random.choice(calles_restantes[:50])
        ruta = generar_ruta_desde_calle(
            calle, "auto",
            f"Ruta Secundaria - {calle['properties']['name']}", 
            "#10b981"
        )
        rutas_base.append(ruta)
        
        # Ruta 5: Otra calle (auto)
        calle = random.choice(calles_restantes[50:100] if len(calles_restantes) > 100 else calles_restantes)
        ruta = generar_ruta_desde_calle(
            calle, "auto",
            f"Ruta Terciaria - {calle['properties']['name']}", 
            "#f59e0b"
        )
        rutas_base.append(ruta)
    
    # Agregar ciclovías si existen
    ciclovias_path = Path("public/datajson/osm/hermosillo_ciclovias.geojson")
    if ciclovias_path.exists():
        with open(ciclovias_path, 'r', encoding='utf-8') as f:
            ciclovias_data = json.load(f)
        
        if ciclovias_data['features']:
            ciclovia = ciclovias_data['features'][0]
            ruta = generar_ruta_desde_calle(
                ciclovia, "bicicleta",
                f"Ciclovía - {ciclovia['properties']['name']}", 
                "#ec4899"
            )
            rutas_base.append(ruta)
    
    # Guardar rutas base
    output = {
        "escenario": "actual",
        "rutas": rutas_base,
        "metadata": {
            "source": "OpenStreetMap",
            "date": "2025-11-18",
            "total_rutas": len(rutas_base),
            "area": "Hermosillo, Sonora, México"
        }
    }
    
    output_path = Path("public/datajson/rutas_escenario_base_real.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"[OK] Guardado: {output_path}")
    print(f"[INFO] Total rutas generadas: {len(rutas_base)}")
    
    for ruta in rutas_base:
        print(f"  - {ruta['nombre']}: {len(ruta['coordenadas'])} puntos, {ruta['metadata']['longitud_km']} km")
    
    return rutas_base

if __name__ == "__main__":
    generar_rutas_reales()
