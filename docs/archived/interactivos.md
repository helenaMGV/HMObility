# HMObility – Implementación real de:
- Mapa animado de movilidad (estilo Uber Eats) sobre Leaflet
- Juegos viales interactivos
- Ingesta offline de datos de OpenStreetMap (OSM) vía Python
- Integración de todo en el sistema actual (según `README.md`)

Este documento está pensado para **copiar y pegar tal cual** al repo, como por ejemplo:

- `docs/HMobility_animaciones_y_OSM.md`  
o  
- `mockup_animaciones.md`

y servir como **guía de implementación real para Copilot** y para el equipo.

---

## 0. Contexto: stack actual (según README)

**Frontend**

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui (Radix UI)
- React Router
- Leaflet (con OpenStreetMap)
- Recharts
- TanStack Query
- Sonner (toasts)
- Lucide React (iconos)

**Páginas principales actuales**

- `src/pages/Home.tsx`
- `src/pages/MapPage.tsx`
- `src/pages/GamePage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/Index.tsx` (router)
- `src/pages/NotFound.tsx`

**Componentes clave existentes**

- `src/components/AccidentsMap.tsx`
- `src/components/SpeedMap.tsx`
- `src/components/Dashboard.tsx`
- `src/components/QuickStats.tsx`
- `src/components/Statistics.tsx`
- `src/components/ChatbotReglamento.tsx`
- `src/components/FineCalculator.tsx`
- `src/components/Game.tsx`
- `src/components/HeroSection.tsx`, `Navbar.tsx`, `Footer.tsx`, etc.

**Datos**

- `public/datajson/*.json` – accidentes, etc.
- `src/data/reglamento.json`
- `src/data/HMObility_chatbot_data.json`

**Backend opcional**

- `/api` (Python serverless) para el chatbot.

**Restricciones**

- **No Mapbox** (solo Leaflet + OSM).
- **No login real** (si se simula, que sea solo frontend).
- Despliegue en **Vercel** (solo frontend + funciones ligeras).

---

## 1. Mapa animado de movilidad estilo Uber Eats (Leaflet + animaciones reales)

### 1.1 Rutas nuevas y componentes

**Nueva ruta pública**

- `/mapa-animado`  
  - Nuevo archivo: `src/pages/AnimatedMapPage.tsx`

**Estructura de `AnimatedMapPage.tsx`**

- Importar:
  - `AnimatedMobilityMap`  
  - `ScenarioSelector`  
  - `RouteOptimizerPanel`  
  - `TimelineController`
- Layout tipo 3 columnas (en desktop):
  - Izquierda: `ScenarioSelector`
  - Centro: `AnimatedMobilityMap`
  - Derecha: `RouteOptimizerPanel` + `TimelineController`
- En móvil, usar layout de columnas apiladas.

**Nuevos componentes**

- `src/components/AnimatedMobilityMap.tsx`
- `src/components/ScenarioSelector.tsx`
- `src/components/RouteOptimizerPanel.tsx`
- `src/components/TimelineController.tsx`

**Contexto de animación (opcional)**

- `src/context/AnimationContext.tsx`:
  - `scenario: "actual" | "optimo" | "eventos"`
  - `isPlaying: boolean`
  - `speedMultiplier: number` (0.5, 1, 2, 4)
  - setters para estos valores.

---

### 1.2 Estructura de datos (JSON) para rutas y vehículos

Crear en `public/datajson/`:

1. `rutas_escenario_base.json`

```json
[
  {
    "id": "ruta_1",
    "nombre": "Ruta Centro–Norte",
    "tipo": "camion",
    "color": "#0077ff",
    "coordenadas": [
      [29.083, -110.993],
      [29.089, -110.987],
      [29.095, -110.981]
    ]
  },
  {
    "id": "ruta_2",
    "nombre": "Ruta Centro–Sur",
    "tipo": "camion",
    "color": "#00aa55",
    "coordenadas": [
      [29.083, -110.993],
      [29.077, -110.995],
      [29.070, -110.998]
    ]
  }
]

	2.	rutas_escenario_optimo.json
(misma estructura, pero rutas modificadas simulando optimización).
	3.	rutas_eventos_especiales.json
(rutas con desvíos para conciertos, ferias, estadio, etc.).
	4.	vehiculos_simulados.json

[
  {
    "id": "veh_1",
    "tipo": "camion",
    "ruta_id": "ruta_1",
    "velocidad_kmh": 25,
    "offset_inicial": 0.0
  },
  {
    "id": "veh_2",
    "tipo": "camion",
    "ruta_id": "ruta_2",
    "velocidad_kmh": 22,
    "offset_inicial": 0.3
  }
]


⸻

1.3 Lógica de animación real en AnimatedMobilityMap.tsx

Responsabilidades de AnimatedMobilityMap
	•	Inicializar el mapa Leaflet.
	•	Cargar los JSON según el scenario actual.
	•	Crear:
	•	Polylines para las rutas.
	•	Markers para los vehículos.
	•	Ejecutar un loop con requestAnimationFrame para mover los vehículos.

Estado interno (en el componente o en hooks)
	•	routes: Route[]
	•	vehicles: Vehicle[]
	•	vehicleMarkers: Map<string, L.Marker>
	•	routeSegments: Map<string, { segments; totalLength; cumulativeLengths }>
	•	lastTimestamp: number | null

Algoritmo de animación
	1.	Cuando se cargan las rutas:
	•	Para cada ruta:
	•	Calcular distancias entre pares consecutivos de coordenadas.
	•	Guardar:
	•	totalLength (metros).
	•	cumulativeLengths[] (longitud acumulada hasta cada vértice).
	2.	Para cada vehículo:
	•	Estado:
	•	progress ∈ [0, 1].
	•	velocidad_m_s = velocidad_kmh * 1000 / 3600.
	•	Loop:
	•	En cada frame:
	•	deltaTime = (timestampActual - lastTimestamp) / 1000.
	•	progress += (velocidad_m_s * deltaTime * speedMultiplier) / totalLength.
	•	Si progress > 1, progress -= 1 (loop).
	•	Longitud recorrida d = progress * totalLength.
	•	Encontrar en qué segmento cae d usando cumulativeLengths.
	•	Interpolar lat/lng entre puntos de ese segmento.
	•	marker.setLatLng([latInterpolado, lngInterpolado]).
	3.	El loop se ejecuta con requestAnimationFrame mientras isPlaying sea true.

⸻

1.4 Comportamiento de ScenarioSelector y RouteOptimizerPanel

ScenarioSelector
	•	Muestra 3 tarjetas:
	•	“Red actual”
	•	“Escenario optimizado”
	•	“Eventos especiales”
	•	Al seleccionar:
	•	Llama a setScenario("actual" | "optimo" | "eventos").
	•	AnimatedMobilityMap escucha scenario y carga el JSON correspondiente.

RouteOptimizerPanel
	•	Inputs:
	•	Origen (select de colonias).
	•	Destino.
	•	Modo (camión, auto, bici).
	•	Objetivo:
	•	“Menor tiempo”
	•	“Menor congestión”
	•	“Mayor uso transporte público”
	•	Botón: “Calcular escenario”.
	•	Lógica simulada:
	•	Al dar clic:
	•	setIsPlaying(false) (opcional).
	•	Mostrar spinner 2–3 s.
	•	setScenario("optimo").
	•	Mostrar KPIs de resultado (basados en datos predefinidos en un JSON, ej. public/datajson/rutas_escenarios_kpis.json).

⸻

1.5 Integración con el resto del sistema

En Home.tsx
	•	Agregar una tarjeta tipo:
	•	Título: “Simulador animado de rutas”
	•	Texto corto: “Explora escenarios de movilidad con vehículos animados sobre el mapa de Hermosillo.”
	•	Botón: Navega a /mapa-animado.

En Dashboard.tsx
	•	Agregar en el menú lateral una entrada:
	•	“Simulador de rutas”
	•	Esa entrada redirige a /mapa-animado o a una versión embebida del mismo componente.

⸻

2. Juegos viales interactivos (en la página pública)

Actualmente existe:
	•	Game.tsx + GamePage.tsx con un quiz.

Objetivo: convertir GamePage en un hub de minijuegos viales.

⸻

2.1 Estructura nueva de GamePage.tsx
	•	Mantener el juego actual pero renombrarlo como “Quiz de reglamento”.
	•	Crear un grid de tarjetas (shadcn/ui):
	1.	“🟢 Juego del semáforo”
	2.	“🚶 Juego del cruce peatonal / bici”
	3.	“🚗 Juego: ¿Qué hacer en un choque?”
	4.	“🍺 Juego del alcoholímetro responsable” (opcional)
	5.	“📚 Quiz de reglamento” (usa Game.tsx actual)
	•	Dos formas posibles:
	•	a) Manejar modoJuego en un estado dentro de GamePage y renderizar el componente correspondiente abajo.
	•	b) Crear subrutas:
	•	/juego/semaforo → JuegoSemaforo.tsx
	•	/juego/cruce → JuegoCruce.tsx
	•	/juego/choque → JuegoChoque.tsx
	•	/juego/alcoholimetro → JuegoAlcoholimetro.tsx
	•	/juego/quiz → Game.tsx

⸻

2.2 Juego del semáforo – JuegoSemaforo.tsx

Objetivo
	•	Enseñar qué debe hacer:
	•	Peatón
	•	Ciclista
	•	Conductor

en función del color del semáforo.

Implementación
	•	Estado:
	•	faseSemaforo: "rojo" | "amarillo" | "verde"
	•	escenarioActual con:
	•	descripción
	•	opciones para peatón
	•	opciones para conductor
	•	UI:
	•	Semáforo (componentes divs con Tailwind, transición entre colores).
	•	Botones de acción para usuario.
	•	Flujo:
	1.	Se muestra un escenario y la fase actual (ej. amarillo).
	2.	El usuario elige acciones.
	3.	El juego evalúa:
	•	Correctas → animación suave de peatón cruzando/auto frenando.
	•	Incorrectas → se muestra advertencia y texto educativo.
	4.	Debajo, mostrar artículo del reglamento y explicación corta.

⸻

2.3 Juego del cruce peatonal / ciclista – JuegoCruce.tsx

Objetivo
	•	Comprender:
	•	Prioridad peatonal.
	•	Correcto uso de ciclovía.
	•	Maniobras de vuelta.

Implementación
	•	Vista top-down de un crucero (divs con CSS, íconos representando vehículos/peatones/bicis).
	•	Estado:
	•	escenarioCruce (quién entra al cruce y desde dónde).
	•	ordenDecidido por el usuario (selecciones).
	•	Interacción:
	1.	Mostrar la situación.
	2.	El usuario ordena quién pasa primero (por botones o drag & drop simple).
	3.	Animación de la secuencia:
	•	flechas moviéndose, íconos desplazándose.
	4.	Feedback:
	•	Texto “Correcto/Incorrecto” + artículo del reglamento.

⸻

2.4 Juego “¿Qué hacer en un choque?” – JuegoChoque.tsx

Objetivo
	•	Enseñar protocolo correcto tras un siniestro.

Implementación
	•	UI tipo “wizard” / árbol de decisiones:
	•	Lista de acciones que se pueden tomar.
	•	Usuario va seleccionando.
	•	Estado:
	•	pasoActual
	•	accionesElegidas
	•	Flujo:
	1.	Presentar situación: “Te chocan por alcance en un semáforo”.
	2.	Mostrar lista de posibles acciones:
	•	Asegurar integridad de personas.
	•	Señalizar.
	•	Llamar emergencias.
	•	Mover el vehículo sin revisar.
	•	Discutir, etc.
	3.	El usuario elige la acción que haría primero.
	4.	El sistema:
	•	Marca si es adecuada.
	•	Avanza a siguiente paso, corrigiendo y explicando.
	5.	Al final:
	•	Resumen con la secuencia correcta.
	•	Consejos finales.

⸻

2.5 Juego del alcoholímetro responsable – JuegoAlcoholimetro.tsx (opcional)

Objetivo
	•	Mostrar impacto de beber y manejar.

Implementación
	•	Estado:
	•	bebidasConsumo (lista/contador).
	•	decideConducir: boolean.
	•	Flujo:
	1.	Usuario “elige” cuántas bebidas tomó y en cuánto tiempo.
	2.	Decide si manejar o no.
	3.	El sistema:
	•	Simula riesgo (texto/indicador).
	•	Muestra consecuencias (multas, sanciones, siniestro).
	•	Sugiere alternativas: taxi, app, conductor designado.

⸻

2.6 Conexión con reglamento y dashboard
	•	Cada juego debe:
	•	Mostrar el artículo(s) relevante(s) del reglamento.
	•	Resaltar mensajes clave de seguridad.
	•	Dashboard:
	•	Se puede crear un panel que lea un JSON con estadísticas simuladas de uso de juegos:
	•	% aciertos semáforo.
	•	% aciertos choque.
	•	Esto funciona como un indicador de “cultura vial” (mock).

⸻

3. Scripts de Python para descargar datos de OSM y generar GeoJSON

Estos scripts se corren offline, en tu máquina, usan Python 3.10+ y NO corren en Vercel.

3.1 Estructura de carpetas

En la raíz del repo:
	•	scripts/osm/
	•	descargar_osm_hermosillo.py
	•	descargar_osm_overpass.py (opcional)
	•	public/datajson/osm/
	•	Salidas GeoJSON.

⸻

3.2 Script con osmnx – descargar_osm_hermosillo.py

Instalación

pip install osmnx geopandas

Archivo completo

#!/usr/bin/env python3
"""
descargar_osm_hermosillo.py

Descarga datos de OpenStreetMap para Hermosillo, Sonora usando osmnx
y genera GeoJSON de semáforos, cruces peatonales, ciclovías y calles.
Requiere Python 3.10+ y conexión a internet.
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


⸻

3.3 Script opcional con Overpass – descargar_osm_overpass.py

Instalación

pip install overpy

Archivo completo

#!/usr/bin/env python3
"""
descargar_osm_overpass.py

Ejemplo: descarga semáforos de Hermosillo usando Overpass
y guarda en GeoJSON.
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


⸻

3.4 Flujo de uso de los scripts
	1.	En tu máquina local (no Vercel), con Python 3.10+:
	•	python scripts/osm/descargar_osm_hermosillo.py
	•	(Opcional) python scripts/osm/descargar_osm_overpass.py
	2.	Revisar que en public/datajson/osm/ se generaron GeoJSON:
	•	hermosillo_semaforos.geojson
	•	hermosillo_cruces_peatonales.geojson
	•	hermosillo_ciclovias.geojson
	•	hermosillo_calles_principales.geojson
	•	(Opc) hermosillo_semaforos_overpass.geojson

⸻

4. Integración de GeoJSON OSM en el frontend

4.1 Capas OSM en el mapa público (MapPage.tsx / AccidentsMap.tsx)

Objetivo
	•	Añadir capas togglables:
	•	Semáforos
	•	Cruces peatonales
	•	Ciclovías
	•	Calles principales

Pasos
	1.	Crear un pequeño servicio o hook:
	•	src/lib/useGeoJsonLayer.ts (opcional) que reciba:
	•	URL de GeoJSON.
	•	Mapa Leaflet.
	•	Estilo (para puntos/lineas).
	2.	En AccidentsMap.tsx:
	•	Añadir botones (shadcn/ui Switch o Checkbox) para activar/desactivar cada capa.
	•	Cuando se activa una capa:
	•	fetch('/datajson/osm/hermosillo_semaforos.geojson').
	•	Crear capa L.geoJSON(...) y añadirla al mapa.
	•	Guardar referencia a cada capa para poder quitarla cuando se desactive.

⸻

4.2 Uso de OSM en el mapa animado (AnimatedMobilityMap.tsx)

Opciones
	•	Usar hermosillo_calles_principales.geojson como contexto:
	•	Cargarlo y dibujarlo como polylines suaves (fondo).
	•	Sobre ese fondo:
	•	Dibujar rutas de escenarios (rutas_escenario_base / optimo / eventos).
	•	Mover vehículos animados.

⸻

4.3 Uso de OSM en dashboard

Panel de infraestructura
	•	Crear un nuevo componente:
	•	src/components/InfraestructuraVialPanel.tsx
	•	Cargar los GeoJSON:
	•	Contar:
	•	semáforos
	•	cruces peatonales
	•	km de ciclovía (aproximando por longitud de polylines).
	•	Mostrar KPIs con QuickStats + una gráfica simple con Statistics:
	•	Ejemplo: ciclovías por zona, densidad de semáforos por colonia, etc.

⸻

5. Orden recomendado de implementación (para el equipo + Copilot)
	1.	Scripts OSM (offline)
	•	Crear carpeta scripts/osm/.
	•	Implementar y probar descargar_osm_hermosillo.py.
	•	Confirmar salida de GeoJSON en public/datajson/osm/.
	2.	Capas OSM en el mapa público
	•	Extender AccidentsMap.tsx con toggles para:
	•	Semáforos
	•	Cruces
	•	Ciclovías
	•	Validar visualmente en /mapa.
	3.	Mapa animado /simulador de rutas/
	•	Crear AnimatedMapPage.tsx.
	•	Crear AnimatedMobilityMap.tsx con una ruta y un vehículo de prueba.
	•	Implementar la lógica de animación con requestAnimationFrame.
	•	Agregar ScenarioSelector, RouteOptimizerPanel y TimelineController.
	4.	Juegos viales
	•	Convertir GamePage.tsx en hub de juegos.
	•	Implementar JuegoSemaforo.tsx primero.
	•	Luego JuegoCruce.tsx y JuegoChoque.tsx.
	•	Conectar todos con el reglamento.
	5.	Integración en dashboard
	•	Añadir tarjeta/entrada para “Simulador de rutas”.
	•	Añadir panel de “Infraestructura vial” con KPIs de OSM.
	•	(Opcional) Panel de uso de juegos como indicador de cultura vial.

⸻

Con este único archivo .md tienes:
	•	Especificación detallada y concreta del mapa animado, con animaciones reales sobre Leaflet.
	•	Diseño funcional de juegos viales interactivos.
	•	Scripts completos de Python para descargar datos de OSM de Hermosillo.
	•	Guía clara para integrar todo en el sistema actual y para que Copilot implemente módulo por módulo.

