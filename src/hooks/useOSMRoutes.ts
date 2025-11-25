import { useState, useEffect } from 'react';

interface OSMRoute {
  id: string;
  nombre: string;
  tipo: 'primary' | 'secondary' | 'tertiary';
  coordenadas: [number, number][];
  longitud_km: number;
}

interface OSMRouteGenerationOptions {
  numRoutes?: number;
  maxLength?: number;
  minLength?: number;
}

/**
 * Hook para cargar y generar rutas de transporte público basadas en calles reales de OSM
 */
export const useOSMRoutes = (options: OSMRouteGenerationOptions = {}) => {
  const { numRoutes = 4, maxLength = 10, minLength = 3 } = options;
  
  const [routes, setRoutes] = useState<OSMRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAndGenerateRoutes = async () => {
      try {
        setLoading(true);
        
        // Cargar calles principales de OSM
        const response = await fetch('/datajson/osm/hermosillo_calles_principales.geojson');
        
        if (!response.ok) {
          throw new Error('No se pudieron cargar las calles OSM');
        }
        
        const geojson = await response.json();
        const features = geojson.features;

        if (!features || features.length === 0) {
          throw new Error('No hay calles disponibles en el GeoJSON');
        }

        // Filtrar solo LineStrings con coordenadas válidas
        const callesPrincipales = features
          .filter((f: any) => 
            f.geometry.type === 'LineString' && 
            f.geometry.coordinates.length >= 2 &&
            f.properties.highway // Debe tener clasificación de vía
          )
          .map((f: any) => ({
            geometry: f.geometry.coordinates,
            properties: f.properties,
            tipo: clasificarVia(f.properties.highway),
          }));

        // Generar rutas de transporte público
        const generatedRoutes: OSMRoute[] = [];
        const nombreRutas = [
          'Ruta Centro-Norte',
          'Ruta Centro-Sur',
          'Ruta Este-Oeste',
          'Ruta Periférico',
        ];

        for (let i = 0; i < Math.min(numRoutes, nombreRutas.length); i++) {
          const ruta = generarRutaTransporte(
            callesPrincipales,
            nombreRutas[i],
            i + 1,
            { minLength, maxLength }
          );
          
          if (ruta) {
            generatedRoutes.push(ruta);
          }
        }

        setRoutes(generatedRoutes);
        setError(null);
      } catch (err) {
        console.error('Error cargando rutas OSM:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        
        // Fallback a rutas simuladas si OSM falla
        setRoutes(getFallbackRoutes());
      } finally {
        setLoading(false);
      }
    };

    loadAndGenerateRoutes();
  }, [numRoutes, maxLength, minLength]);

  return { routes, loading, error };
};

/**
 * Clasificar tipo de vía según OSM highway tag
 */
function clasificarVia(highway: string): 'primary' | 'secondary' | 'tertiary' {
  if (highway.includes('primary') || highway.includes('trunk')) {
    return 'primary';
  } else if (highway.includes('secondary')) {
    return 'secondary';
  }
  return 'tertiary';
}

/**
 * Generar una ruta de transporte público uniendo calles OSM
 */
function generarRutaTransporte(
  calles: any[],
  nombre: string,
  id: number,
  options: { minLength: number; maxLength: number }
): OSMRoute | null {
  if (calles.length === 0) return null;

  // Seleccionar un punto de inicio aleatorio en las calles principales
  const calleInicio = calles[Math.floor(Math.random() * Math.min(calles.length, 20))];
  
  let coordenadas: [number, number][] = [];
  let longitudActual = 0;
  let callActual = calleInicio;
  const callesUsadas = new Set<number>();
  
  // Construir ruta conectando calles
  while (longitudActual < options.maxLength && callesUsadas.size < 15) {
    const coords = callActual.geometry.map((c: number[]) => [c[1], c[0]] as [number, number]);
    coordenadas.push(...coords);
    
    callesUsadas.add(calles.indexOf(callActual));
    longitudActual += calcularLongitudSegmento(coords);
    
    // Buscar siguiente calle conectada
    const ultimoPunto = coords[coords.length - 1];
    const siguienteCalle = encontrarCalleProxima(calles, ultimoPunto, callesUsadas);
    
    if (!siguienteCalle || longitudActual >= options.maxLength) {
      break;
    }
    
    callActual = siguienteCalle;
  }

  // Filtrar si la ruta es muy corta
  if (longitudActual < options.minLength || coordenadas.length < 5) {
    return null;
  }

  // Simplificar ruta (tomar 1 de cada 3 puntos para optimizar)
  const coordenadasSimplificadas = coordenadas.filter((_, i) => i % 3 === 0);
  coordenadasSimplificadas.push(coordenadas[coordenadas.length - 1]); // Siempre incluir último punto

  return {
    id: `ruta_osm_${id}`,
    nombre,
    tipo: callActual.tipo,
    coordenadas: coordenadasSimplificadas,
    longitud_km: parseFloat(longitudActual.toFixed(2)),
  };
}

/**
 * Encontrar calle próxima que conecte con el punto actual
 */
function encontrarCalleProxima(
  calles: any[],
  punto: [number, number],
  yaUsadas: Set<number>
): any | null {
  const umbralDistancia = 0.002; // ~200 metros en grados

  for (let i = 0; i < calles.length; i++) {
    if (yaUsadas.has(i)) continue;

    const calle = calles[i];
    const primeraCoord: [number, number] = [calle.geometry[0][1], calle.geometry[0][0]];
    const ultimaCoord: [number, number] = [
      calle.geometry[calle.geometry.length - 1][1],
      calle.geometry[calle.geometry.length - 1][0],
    ];

    const distInicio = calcularDistancia(punto, primeraCoord);
    const distFin = calcularDistancia(punto, ultimaCoord);

    if (distInicio < umbralDistancia || distFin < umbralDistancia) {
      return calle;
    }
  }

  return null;
}

/**
 * Calcular longitud aproximada de un segmento de coordenadas
 */
function calcularLongitudSegmento(coords: [number, number][]): number {
  let longitud = 0;
  
  for (let i = 0; i < coords.length - 1; i++) {
    longitud += calcularDistancia(coords[i], coords[i + 1]);
  }
  
  // Convertir de grados a km (aproximación)
  return longitud * 111; // 1 grado ≈ 111 km
}

/**
 * Calcular distancia euclidiana entre dos puntos
 */
function calcularDistancia(p1: [number, number], p2: [number, number]): number {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Rutas de fallback si OSM no está disponible
 */
function getFallbackRoutes(): OSMRoute[] {
  return [
    {
      id: 'ruta_fallback_1',
      nombre: 'Ruta Centro-Norte (Simulada)',
      tipo: 'primary',
      coordenadas: [
        [29.0729, -110.9559],
        [29.0800, -110.9600],
        [29.0890, -110.9550],
        [29.0950, -110.9480],
      ],
      longitud_km: 4.2,
    },
    {
      id: 'ruta_fallback_2',
      nombre: 'Ruta Centro-Sur (Simulada)',
      tipo: 'secondary',
      coordenadas: [
        [29.0729, -110.9559],
        [29.0650, -110.9700],
        [29.0580, -110.9800],
        [29.0500, -110.9850],
      ],
      longitud_km: 5.1,
    },
  ];
}

export type { OSMRoute };
