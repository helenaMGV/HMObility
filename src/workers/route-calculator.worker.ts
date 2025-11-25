/**
 * Web Worker para cálculos pesados de rutas
 * Evita bloquear el hilo principal durante simulaciones
 */

// Tipos de mensajes
type MessageType = 
  | 'CALCULATE_ROUTE'
  | 'SIMPLIFY_ROUTE'
  | 'UPDATE_POSITION'
  | 'CALCULATE_DISTANCE'
  | 'FIND_NEAREST_POINT';

interface WorkerMessage {
  type: MessageType;
  payload: any;
  id?: string;
}

interface WorkerResponse {
  type: string;
  payload: any;
  id?: string;
  error?: string;
}

// Fórmula de Haversine para cálculo de distancias
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Radio de la Tierra en metros
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Simplificar ruta usando algoritmo Douglas-Peucker simplificado
const simplifyRoute = (
  points: [number, number][],
  tolerance: number
): [number, number][] => {
  if (points.length <= 2) return points;

  const simplified: [number, number][] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = haversineDistance(
      lastPoint[0],
      lastPoint[1],
      points[i][0],
      points[i][1]
    );

    if (distance > tolerance) {
      simplified.push(points[i]);
      lastPoint = points[i];
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
};

// Calcular longitud total de ruta
const calculateRouteLength = (coords: [number, number][]): number => {
  let length = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    length += haversineDistance(
      coords[i][0],
      coords[i][1],
      coords[i + 1][0],
      coords[i + 1][1]
    );
  }
  return length;
};

// Encontrar punto más cercano en ruta
const findNearestPoint = (
  target: [number, number],
  route: [number, number][]
): { point: [number, number]; index: number; distance: number } => {
  let minDistance = Infinity;
  let nearestPoint = route[0];
  let nearestIndex = 0;

  route.forEach((point, index) => {
    const distance = haversineDistance(
      target[0],
      target[1],
      point[0],
      point[1]
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestPoint = point;
      nearestIndex = index;
    }
  });

  return { point: nearestPoint, index: nearestIndex, distance: minDistance };
};

// Interpolación de posición en ruta
const interpolatePosition = (
  route: [number, number][],
  progress: number // 0 a 1
): { position: [number, number]; angle: number; segmentIndex: number } => {
  if (progress >= 1) {
    const lastIdx = route.length - 1;
    return {
      position: route[lastIdx],
      angle: 0,
      segmentIndex: lastIdx,
    };
  }

  const totalLength = calculateRouteLength(route);
  const targetDistance = progress * totalLength;
  
  let accumulated = 0;
  let segmentIndex = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const segmentLength = haversineDistance(
      route[i][0],
      route[i][1],
      route[i + 1][0],
      route[i + 1][1]
    );

    if (accumulated + segmentLength >= targetDistance) {
      const segmentProgress = (targetDistance - accumulated) / segmentLength;
      
      const lat = route[i][0] + (route[i + 1][0] - route[i][0]) * segmentProgress;
      const lon = route[i][1] + (route[i + 1][1] - route[i][1]) * segmentProgress;
      
      // Calcular ángulo de dirección
      const angle = Math.atan2(
        route[i + 1][1] - route[i][1],
        route[i + 1][0] - route[i][0]
      ) * (180 / Math.PI);

      return {
        position: [lat, lon],
        angle,
        segmentIndex: i,
      };
    }

    accumulated += segmentLength;
    segmentIndex = i;
  }

  return {
    position: route[route.length - 1],
    angle: 0,
    segmentIndex: route.length - 1,
  };
};

// Generar ruta optimizada entre dos puntos usando waypoints
const calculateOptimalRoute = (
  origin: [number, number],
  destination: [number, number],
  osmRoutes: [number, number][][],
  maxPoints: number = 20
): [number, number][] => {
  // Encontrar segmentos de calles cercanas al origen y destino
  const nearestToOrigin = findNearestPoint(origin, osmRoutes.flat());
  const nearestToDestination = findNearestPoint(destination, osmRoutes.flat());

  // Construir ruta combinando puntos
  const route: [number, number][] = [origin];

  // Agregar puntos intermedios de las calles OSM
  const intermediatePoints: [number, number][] = [];
  
  osmRoutes.forEach((osmRoute) => {
    const startIdx = Math.floor(Math.random() * osmRoute.length * 0.3);
    const endIdx = startIdx + Math.floor(osmRoute.length * 0.4);
    intermediatePoints.push(...osmRoute.slice(startIdx, endIdx));
  });

  // Simplificar puntos intermedios
  const tolerance = 50; // metros
  const simplified = simplifyRoute(intermediatePoints, tolerance);

  // Limitar a maxPoints
  const step = Math.max(1, Math.floor(simplified.length / maxPoints));
  const sampled = simplified.filter((_, i) => i % step === 0);

  route.push(...sampled.slice(0, maxPoints - 2));
  route.push(destination);

  return route;
};

// Manejador de mensajes del worker
self.addEventListener('message', (event: MessageEvent<WorkerMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let response: WorkerResponse;

    switch (type) {
      case 'CALCULATE_ROUTE':
        const optimalRoute = calculateOptimalRoute(
          payload.origin,
          payload.destination,
          payload.osmRoutes,
          payload.maxPoints
        );
        response = {
          type: 'ROUTE_CALCULATED',
          payload: {
            route: optimalRoute,
            length: calculateRouteLength(optimalRoute),
          },
          id,
        };
        break;

      case 'SIMPLIFY_ROUTE':
        const simplifiedRoute = simplifyRoute(payload.route, payload.tolerance);
        response = {
          type: 'ROUTE_SIMPLIFIED',
          payload: {
            route: simplifiedRoute,
            originalLength: payload.route.length,
            simplifiedLength: simplifiedRoute.length,
          },
          id,
        };
        break;

      case 'UPDATE_POSITION':
        const positionData = interpolatePosition(payload.route, payload.progress);
        response = {
          type: 'POSITION_UPDATED',
          payload: positionData,
          id,
        };
        break;

      case 'CALCULATE_DISTANCE':
        const distance = calculateRouteLength(payload.route);
        response = {
          type: 'DISTANCE_CALCULATED',
          payload: { distance },
          id,
        };
        break;

      case 'FIND_NEAREST_POINT':
        const nearest = findNearestPoint(payload.target, payload.route);
        response = {
          type: 'NEAREST_POINT_FOUND',
          payload: nearest,
          id,
        };
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    self.postMessage(response);
  } catch (error) {
    const errorResponse: WorkerResponse = {
      type: 'ERROR',
      payload: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      id,
    };
    self.postMessage(errorResponse);
  }
});

// Confirmar que el worker está listo
self.postMessage({ type: 'WORKER_READY', payload: null });
