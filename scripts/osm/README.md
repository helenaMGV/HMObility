# Scripts OSM - Descarga de Datos Reales de OpenStreetMap

Este directorio contiene scripts de Python para descargar datos reales de OpenStreetMap (OSM) para Hermosillo, Sonora y generar rutas de transporte basadas en calles reales.

## Importante

Estos scripts se ejecutan **offline en tu máquina local**, NO en Vercel. Requieren Python 3.10+ y conexión a internet para descargar datos de OSM.

## Instalación

```bash
# Instalar dependencias
pip install overpy requests
```

## Uso - Descarga Completa

### 1. Descargar infraestructura vial

```bash
# Semáforos
python scripts/osm/descargar_osm_overpass.py

# Calles principales
python scripts/osm/descargar_calles_principales.py

# Cruces peatonales y ciclovías
python scripts/osm/descargar_cruces_ciclovias.py

# Solo ciclovías (con reintentos)
python scripts/osm/descargar_ciclovias_solo.py
```

### 2. Generar rutas reales de transporte

```bash
# Genera rutas basadas en calles reales de OSM
python scripts/osm/generar_rutas_reales.py
```

## Archivos Generados

Todos los GeoJSON se guardan en `public/datajson/osm/`:

**Infraestructura:**
- `hermosillo_semaforos_overpass.geojson` - Semáforos de la ciudad
- `hermosillo_cruces_peatonales.geojson` - Cruces peatonales (233 puntos)
- `hermosillo_ciclovias.geojson` - Ciclovías (39 segmentos)
- `hermosillo_calles_principales.geojson` - Red de calles principales (1,018 calles)

**Rutas de Transporte:**
- `rutas_escenario_base_real.json` - Rutas generadas desde calles reales de OSM

## 📁 Salida

Todos los GeoJSON se guardan en:
```
public/datajson/osm/
```

## Datos Descargados

Estado actual de archivos GeoJSON:

```
Total Features: 1,402
- Semáforos: 112 puntos
- Cruces Peatonales: 233 puntos  
- Ciclovías: 39 segmentos
- Calles Principales: 1,018 calles
```

**Rutas de Transporte Generadas:**
```
6 rutas basadas en calles reales:
- Ruta Centro - Boulevard Progreso (6.42 km, 159 puntos)
- Ruta Este-Oeste - Luis Encinas (0.01 km, 2 puntos)
- Ruta Periférico - Paseo Rio Sonora Sur (5.09 km, 112 puntos)
- Ruta Secundaria (4.05 km, 99 puntos)
- Ruta Terciaria - Avenida Xolotl (0.28 km, 9 puntos)
- Ciclovía - Luis Donaldo Colosio (0.63 km, 16 puntos)
```

## Uso en Frontend

El componente `AnimatedMobilityMap` ahora soporta toggle entre datos simulados y datos reales:

```tsx
import AnimatedMobilityMap from '@/components/AnimatedMobilityMap';
import DataSourceSelector from '@/components/DataSourceSelector';

// En AnimatedMapPage
const [useRealData, setUseRealData] = useState(false);

<DataSourceSelector useRealData={useRealData} onToggle={setUseRealData} />
<AnimatedMobilityMap useRealData={useRealData} />
```

Cuando `useRealData={true}`, el mapa carga rutas desde:
- `/datajson/rutas_escenario_base_real.json` (generado desde OSM)

## Resumen de Datos

Para ver estadísticas actualizadas:

```bash
python scripts/osm/resumen_datos.py
```

## Frecuencia de actualización

Recomendado: ejecutar estos scripts cada 3-6 meses para mantener datos actualizados de OSM.

## 📝 Notas

- Los scripts requieren conexión a internet para consultar OSM
- El proceso puede tardar varios minutos dependiendo de la conexión
- Los GeoJSON generados se usan en el frontend para capas del mapa
