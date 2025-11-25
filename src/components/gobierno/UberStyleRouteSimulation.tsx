import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, MapPin, Clock, Zap, AlertTriangle, Navigation, Activity } from 'lucide-react';
import { useOSMRoutes } from '@/hooks/useOSMRoutes';
import { useRouteWorker } from '@/hooks/useRouteWorker';
import { designSystem } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

interface RouteScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  speedMultiplier: number;
  color: string;
  incidents: {
    position: number; // 0-1
    type: 'traffic' | 'accident' | 'construction';
    delay: number; // segundos
  }[];
}

const scenarios: RouteScenario[] = [
  {
    id: 'normal',
    name: 'Tráfico Normal',
    description: 'Flujo vehicular óptimo - Velocidad promedio 45 km/h',
    icon: '🚗',
    speedMultiplier: 1.2,
    color: '#22c55e',
    incidents: [],
  },
  {
    id: 'traffic',
    name: 'Hora Pico',
    description: 'Congestión moderada - Reduce velocidad 50%',
    icon: '🚦',
    speedMultiplier: 0.6,
    color: '#f59e0b',
    incidents: [
      { position: 0.25, type: 'traffic', delay: 15 },
      { position: 0.65, type: 'traffic', delay: 20 },
    ],
  },
  {
    id: 'accident',
    name: 'Accidente Mayor',
    description: 'Colisión vehicular - Carril bloqueado',
    icon: '🚨',
    speedMultiplier: 0.4,
    color: '#ef4444',
    incidents: [
      { position: 0.45, type: 'accident', delay: 60 },
    ],
  },
  {
    id: 'construction',
    name: 'Construcción',
    description: 'Mantenimiento vial - Carril reducido',
    icon: '🚧',
    speedMultiplier: 0.7,
    color: '#f97316',
    incidents: [
      { position: 0.35, type: 'construction', delay: 30 },
    ],
  },
  {
    id: 'emergency',
    name: 'Ambulancia',
    description: 'Prioridad máxima - Vía libre',
    icon: '🚑',
    speedMultiplier: 1.8,
    color: '#dc2626',
    incidents: [],
  },
  {
    id: 'police',
    name: 'Patrulla',
    description: 'Respuesta rápida - Alta velocidad',
    icon: '👮',
    speedMultiplier: 1.6,
    color: '#3b82f6',
    incidents: [],
  },
  {
    id: 'fire',
    name: 'Bomberos',
    description: 'Emergencia crítica - Vía despejada',
    icon: '🚒',
    speedMultiplier: 1.7,
    color: '#dc2626',
    incidents: [],
  },
  {
    id: 'rain',
    name: 'Lluvia Intensa',
    description: 'Clima adverso - Visibilidad reducida',
    icon: '🌧️',
    speedMultiplier: 0.5,
    color: '#64748b',
    incidents: [
      { position: 0.2, type: 'traffic', delay: 10 },
      { position: 0.5, type: 'traffic', delay: 15 },
      { position: 0.8, type: 'traffic', delay: 10 },
    ],
  },
];

// Componente para centrar el mapa en el vehículo
function MapFollower({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [center, zoom, map]);
  
  return null;
}

// Puntos de interés de Hermosillo
const landmarks = [
  { name: 'Plaza Bicentenario', coords: [29.0729, -110.9559] as [number, number] },
  { name: 'UNISON', coords: [29.0969, -110.9544] as [number, number] },
  { name: 'Centro Histórico', coords: [29.0892, -110.9614] as [number, number] },
  { name: 'Hospital General', coords: [29.0829, -110.9705] as [number, number] },
  { name: 'Estadio Sonora', coords: [29.0656, -110.9834] as [number, number] },
  { name: 'Galerías Mall', coords: [29.0989, -110.9877] as [number, number] },
  { name: 'Parque La Ruina', coords: [29.0943, -110.9727] as [number, number] },
  { name: 'Aeropuerto', coords: [29.0959, -111.0478] as [number, number] },
];

export default function UberStyleRouteSimulation() {
  const { routes, loading } = useOSMRoutes({ numRoutes: 5, maxLength: 15 });
  const { calculateRoute, updatePosition, isReady: workerReady, isProcessing } = useRouteWorker();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('normal');
  const [originIndex, setOriginIndex] = useState<number>(0);
  const [destinationIndex, setDestinationIndex] = useState<number>(1);
  const [customRoute, setCustomRoute] = useState<[number, number][]>([]);
  const [progress, setProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [eta, setEta] = useState(0);
  const [isAtIncident, setIsAtIncident] = useState(false);
  const [incidentDelay, setIncidentDelay] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [traveledDistance, setTraveledDistance] = useState(0);
  const [simulationTime, setSimulationTime] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Calculando ruta...');
  
  const animationRef = useRef<number>();
  const lastTimestamp = useRef<number>(0);
  const startTime = useRef<number>(Date.now());

  const scenario = scenarios.find((s) => s.id === selectedScenario) || scenarios[0];
  const baseSpeed = 50; // km/h base en vida real
  const TIME_SCALE = 60; // 1 segundo simulación = 60 segundos vida real

  // Inicializar analytics
  useEffect(() => {
    analytics.init();
    analytics.trackPageView('Simulación de Rutas');
  }, []);
  
  // Generar ruta usando múltiples segmentos de calles reales de OSM
  useEffect(() => {
    if (routes.length > 0 && originIndex !== destinationIndex) {
      const origin = landmarks[originIndex].coords;
      const destination = landmarks[destinationIndex].coords;
      
      // Combinar segmentos de varias rutas para crear trayecto realista
      const allStreetPoints: [number, number][] = [];
      
      // 1. Punto de origen
      allStreetPoints.push(origin);
      
      // 2. Usar puntos de diferentes calles para simular navegación urbana
      routes.slice(0, 3).forEach((route, idx) => {
        const coords = route.coordenadas;
        // Tomar solo algunos puntos de cada calle (cada 3 puntos)
        for (let i = idx * 2; i < coords.length && allStreetPoints.length < 18; i += 3) {
          allStreetPoints.push(coords[i]);
        }
      });
      
      // 3. Punto de destino
      allStreetPoints.push(destination);
      
      // Ordenar puntos para que haya progresión lógica de origen a destino
      const sortedRoute = [origin];
      const remainingPoints = allStreetPoints.slice(1, -1);
      
      // Algoritmo greedy: siempre ir al punto más cercano no visitado
      let current = origin;
      while (remainingPoints.length > 0 && sortedRoute.length < 15) {
        let closestIdx = 0;
        let closestDist = Infinity;
        
        remainingPoints.forEach((point, idx) => {
          const dist = Math.sqrt(
            Math.pow(current[0] - point[0], 2) + 
            Math.pow(current[1] - point[1], 2)
          );
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx;
          }
        });
        
        current = remainingPoints[closestIdx];
        sortedRoute.push(current);
        remainingPoints.splice(closestIdx, 1);
      }
      
      sortedRoute.push(destination);
      
      setCustomRoute(sortedRoute);
      const distance = calculateRouteLength(sortedRoute);
      setTotalDistance(distance);
      handleReset();
    }
  }, [routes, originIndex, destinationIndex]);

  // Calcular longitud total de la ruta
  const calculateRouteLength = (coords: [number, number][]): number => {
    let length = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const R = 6371e3;
      const φ1 = (coords[i][0] * Math.PI) / 180;
      const φ2 = (coords[i + 1][0] * Math.PI) / 180;
      const Δφ = ((coords[i + 1][0] - coords[i][0]) * Math.PI) / 180;
      const Δλ = ((coords[i + 1][1] - coords[i][1]) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      length += R * c;
    }
    return length;
  };

  // Obtener posición del vehículo
  const getVehiclePosition = (prog: number): { 
    position: [number, number]; 
    angle: number;
    segmentIndex: number;
  } => {
    if (customRoute.length === 0) return { position: [29.0729, -110.9559], angle: 0, segmentIndex: 0 };

    const coords = customRoute;
    const totalDistance = calculateRouteLength(coords);
    let targetDistance = prog * totalDistance;
    let accumulatedDistance = 0;

    for (let i = 0; i < coords.length - 1; i++) {
      const segmentStart = coords[i];
      const segmentEnd = coords[i + 1];
      
      const R = 6371e3;
      const φ1 = (segmentStart[0] * Math.PI) / 180;
      const φ2 = (segmentEnd[0] * Math.PI) / 180;
      const Δφ = ((segmentEnd[0] - segmentStart[0]) * Math.PI) / 180;
      const Δλ = ((segmentEnd[1] - segmentStart[1]) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const segmentDistance = R * c;

      if (accumulatedDistance + segmentDistance >= targetDistance) {
        const ratio = (targetDistance - accumulatedDistance) / segmentDistance;
        const lat = segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * ratio;
        const lon = segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * ratio;
        
        // Calcular ángulo de rotación
        const angle = Math.atan2(
          segmentEnd[1] - segmentStart[1],
          segmentEnd[0] - segmentStart[0]
        ) * (180 / Math.PI);
        
        return { position: [lat, lon], angle, segmentIndex: i };
      }

      accumulatedDistance += segmentDistance;
    }

    return { 
      position: coords[coords.length - 1], 
      angle: 0,
      segmentIndex: coords.length - 1 
    };
  };

  // Detectar si estamos en un incidente
  const checkIncident = (prog: number) => {
    for (const incident of scenario.incidents) {
      const diff = Math.abs(prog - incident.position);
      if (diff < 0.05) { // 5% de tolerancia
        return { isAt: true, delay: incident.delay, type: incident.type };
      }
    }
    return { isAt: false, delay: 0, type: null };
  };

  // Loop de animación
  useEffect(() => {
    if (!isPlaying || customRoute.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const deltaTime = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      setProgress((prevProgress) => {
        if (prevProgress >= 1) {
          setIsPlaying(false);
          return 1;
        }

        // Verificar incidente
        const incidentCheck = checkIncident(prevProgress);
        setIsAtIncident(incidentCheck.isAt);
        
        // Actualizar ubicación actual (simple y rápido)
        if (prevProgress < 0.1) {
          setCurrentLocation(`Saliendo de ${landmarks[originIndex].name}`);
        } else if (prevProgress > 0.9) {
          setCurrentLocation(`Llegando a ${landmarks[destinationIndex].name}`);
        } else {
          const remaining = Math.ceil((1 - prevProgress) * totalDistance);
          setCurrentLocation(`En ruta - ${(remaining / 1000).toFixed(1)}km restantes`);
        }
        
        let effectiveSpeed = baseSpeed * scenario.speedMultiplier;
        
        if (incidentCheck.isAt && incidentDelay > 0) {
          effectiveSpeed = 0; // Parado en incidente
          setIncidentDelay((prev) => Math.max(0, prev - (deltaTime * TIME_SCALE)));
        } else if (incidentCheck.isAt && incidentDelay === 0) {
          setIncidentDelay(incidentCheck.delay);
          effectiveSpeed = 0;
        }

        setCurrentSpeed(effectiveSpeed);

        const routeLength = calculateRouteLength(customRoute);
        // Aplicar escala de tiempo: 1s simulación = 60s vida real
        const distancePerSecond = (effectiveSpeed * 1000) / 3600;
        const progressIncrement = (distancePerSecond * deltaTime * TIME_SCALE) / routeLength;

        // Calcular ETA y distancia recorrida
        const remainingDistance = routeLength * (1 - prevProgress);
        const timeRemaining = (remainingDistance / (effectiveSpeed * 1000)) * 3600;
        setEta(timeRemaining);
        setTraveledDistance(routeLength * prevProgress);
        
        // Tiempo de simulación
        const elapsed = (Date.now() - startTime.current) / 1000;
        setSimulationTime(elapsed);

        return prevProgress + progressIncrement;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, customRoute, scenario, incidentDelay]);

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    setIncidentDelay(0);
    setIsAtIncident(false);
    setCurrentSpeed(0);
    setTraveledDistance(0);
    setSimulationTime(0);
    startTime.current = Date.now();
    lastTimestamp.current = 0;
  };

  // Crear ícono de carro realista rotado
  const createCarIcon = (angle: number, color: string) => {
    const svg = `
      <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <g transform="rotate(${angle + 90} 25 25)" filter="url(#shadow)">
          <!-- Sombra del carro -->
          <ellipse cx="25" cy="28" rx="11" ry="20" fill="#000" opacity="0.2"/>
          
          <!-- Cuerpo principal del carro -->
          <rect x="15" y="10" width="20" height="30" rx="4" fill="${color}" stroke="#1a1a1a" stroke-width="1.5"/>
          
          <!-- Techo/Cabina -->
          <rect x="17" y="15" width="16" height="12" rx="3" fill="${color}" opacity="0.9"/>
          <rect x="18" y="16" width="14" height="10" rx="2" fill="#2d3748" opacity="0.6"/>
          
          <!-- Ventanas -->
          <rect x="19" y="17" width="6" height="8" rx="1" fill="#4a5568" opacity="0.8"/>
          <rect x="27" y="17" width="4" height="8" rx="1" fill="#4a5568" opacity="0.8"/>
          
          <!-- Capó -->
          <rect x="17" y="10" width="16" height="5" rx="2" fill="${color}"/>
          <line x1="19" y1="12" x2="31" y2="12" stroke="#fff" stroke-width="0.5" opacity="0.3"/>
          
          <!-- Faros delanteros -->
          <circle cx="20" cy="8" r="2" fill="#fff" opacity="0.95"/>
          <circle cx="30" cy="8" r="2" fill="#fff" opacity="0.95"/>
          <circle cx="20" cy="8" r="1.2" fill="#ffeb3b"/>
          <circle cx="30" cy="8" r="1.2" fill="#ffeb3b"/>
          
          <!-- Luces traseras -->
          <rect x="19" y="38" width="3" height="2" rx="0.5" fill="#ef4444" opacity="0.9"/>
          <rect x="28" y="38" width="3" height="2" rx="0.5" fill="#ef4444" opacity="0.9"/>
          
          <!-- Llantas -->
          <ellipse cx="19" cy="16" rx="2.5" ry="3" fill="#1a1a1a" stroke="#4a5568" stroke-width="0.5"/>
          <ellipse cx="31" cy="16" rx="2.5" ry="3" fill="#1a1a1a" stroke="#4a5568" stroke-width="0.5"/>
          <ellipse cx="19" cy="32" rx="2.5" ry="3" fill="#1a1a1a" stroke="#4a5568" stroke-width="0.5"/>
          <ellipse cx="31" cy="32" rx="2.5" ry="3" fill="#1a1a1a" stroke="#4a5568" stroke-width="0.5"/>
          
          <!-- Rines -->
          <circle cx="19" cy="16" r="1" fill="#718096"/>
          <circle cx="31" cy="16" r="1" fill="#718096"/>
          <circle cx="19" cy="32" r="1" fill="#718096"/>
          <circle cx="31" cy="32" r="1" fill="#718096"/>
          
          <!-- Detalles laterales -->
          <line x1="16" y1="20" x2="16" y2="28" stroke="#1a1a1a" stroke-width="0.5" opacity="0.5"/>
          <line x1="34" y1="20" x2="34" y2="28" stroke="#1a1a1a" stroke-width="0.5" opacity="0.5"/>
          
          <!-- Espejos laterales -->
          <rect x="14" y="18" width="1.5" height="3" fill="#2d3748" stroke="#1a1a1a" stroke-width="0.3"/>
          <rect x="34.5" y="18" width="1.5" height="3" fill="#2d3748" stroke="#1a1a1a" stroke-width="0.3"/>
          
          <!-- Indicador de dirección -->
          <polygon points="25,5 23,8 27,8" fill="#22c55e" opacity="0.9">
            <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1s" repeatCount="indefinite"/>
          </polygon>
        </g>
      </svg>
    `;
    
    return L.divIcon({
      html: svg,
      className: 'car-icon-realistic',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });
  };

  if (loading || customRoute.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulación Animada Dinámica</CardTitle>
          <CardDescription>Cargando calles reales de Hermosillo desde OSM...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const vehicleData = getVehiclePosition(progress);
  const carIcon = createCarIcon(vehicleData.angle, scenario.color);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Navigation className="w-6 h-6 text-orange-500" />
              Simulación de Movilidad
            </CardTitle>
            <CardDescription className="mt-1">
              Calles reales de Hermosillo · Análisis en tiempo real
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="lg"
              variant={isPlaying ? "secondary" : "default"}
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={progress >= 1}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {progress > 0 ? 'Continuar' : 'Iniciar'}
                </>
              )}
            </Button>
            {progress > 0 && (
              <Button size="lg" variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles en una sola fila limpia */}
        <div className="grid grid-cols-3 gap-3">
          {/* Origen */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-2 text-xs font-semibold text-green-700 z-10">
              Origen
            </label>
            <select
              value={originIndex}
              onChange={(e) => {
                setOriginIndex(Number(e.target.value));
                handleReset();
              }}
              disabled={isPlaying}
              className="w-full p-3 pl-10 border-2 border-green-400 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {landmarks.map((landmark, idx) => (
                <option key={idx} value={idx} disabled={idx === destinationIndex}>
                  {landmark.name}
                </option>
              ))}
            </select>
            <MapPin className="w-5 h-5 text-green-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Destino */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-2 text-xs font-semibold text-red-700 z-10">
              Destino
            </label>
            <select
              value={destinationIndex}
              onChange={(e) => {
                setDestinationIndex(Number(e.target.value));
                handleReset();
              }}
              disabled={isPlaying}
              className="w-full p-3 pl-10 border-2 border-red-400 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {landmarks.map((landmark, idx) => (
                <option key={idx} value={idx} disabled={idx === originIndex}>
                  {landmark.name}
                </option>
              ))}
            </select>
            <MapPin className="w-5 h-5 text-red-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Escenario */}
          <div className="relative">
            <label className="absolute -top-2 left-3 bg-white px-2 text-xs font-semibold text-indigo-700 z-10">
              Escenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => {
                setSelectedScenario(e.target.value);
                handleReset();
              }}
              disabled={isPlaying}
              className="w-full p-3 pl-10 border-2 border-indigo-400 rounded-xl bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
            <Zap className="w-5 h-5 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Mapa */}
        <div className="h-[500px] rounded-lg overflow-hidden border-2 shadow-lg">
          <MapContainer
            center={vehicleData.position}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapFollower center={vehicleData.position} zoom={15} />

            {/* Ruta completa */}
            <Polyline
              positions={customRoute}
              color="#cbd5e1"
              weight={8}
              opacity={0.6}
            />

            {/* Ruta completada */}
            <Polyline
              positions={customRoute.slice(0, vehicleData.segmentIndex + 1)}
              color={scenario.color}
              weight={8}
              opacity={1}
            />

            {/* Incidentes en la ruta */}
            {scenario.incidents.map((incident, idx) => {
              const incidentPos = getVehiclePosition(incident.position).position;
              let incidentColor = '#ef4444';
              let incidentIcon = '⚠️';
              
              if (incident.type === 'traffic') {
                incidentColor = '#f59e0b';
                incidentIcon = '🚦';
              } else if (incident.type === 'construction') {
                incidentColor = '#f97316';
                incidentIcon = '🚧';
              } else if (incident.type === 'accident') {
                incidentColor = '#dc2626';
                incidentIcon = '🚨';
              }
              
              return (
                <div key={idx}>
                  <Circle
                    center={incidentPos}
                    radius={80}
                    pathOptions={{
                      color: incidentColor,
                      fillColor: incidentColor,
                      fillOpacity: 0.15,
                      weight: 2,
                      dashArray: '5, 5',
                    }}
                  />
                  <Marker
                    position={incidentPos}
                    icon={L.divIcon({
                      html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${incidentIcon}</div>`,
                      className: 'incident-marker',
                      iconSize: [30, 30],
                      iconAnchor: [15, 15],
                    })}
                  />
                </div>
              );
            })}

            {/* Vehículo */}
            <Marker position={vehicleData.position} icon={carIcon} />

            {/* Marcador de Origen */}
            <Marker
              position={customRoute[0]}
              icon={L.divIcon({
                html: `<div style="background: #22c55e; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">📍</div>`,
                className: 'origin-marker',
                iconSize: [32, 32],
                iconAnchor: [16, 16],
              })}
            />

            {/* Marcador de Destino */}
            <Marker
              position={customRoute[customRoute.length - 1]}
              icon={L.divIcon({
                html: `<div style="background: #ef4444; width: 36px; height: 36px; border-radius: 50%; border: 4px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 20px;">🎯</div>`,
                className: 'destination-marker',
                iconSize: [36, 36],
                iconAnchor: [18, 18],
              })}
            />
          </MapContainer>
        </div>

        {/* Panel de Métricas Dinámicas en Tiempo Real */}
        <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Métricas de Simulación en Tiempo Real
            </h3>
            <div className="grid grid-cols-5 gap-3">
              <div className="bg-white rounded-lg p-3 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Zap className="w-3 h-3 text-blue-500" />
                  <span className="font-semibold">Velocidad Actual</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{currentSpeed.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">km/h instantánea</div>
              </div>

              <div className="bg-white rounded-lg p-3 border-2 border-green-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Clock className="w-3 h-3 text-green-500" />
                  <span className="font-semibold">ETA</span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {eta >= 60 ? `${Math.floor(eta / 60)}m` : `${Math.floor(eta)}s`}
                </div>
                <div className="text-xs text-gray-500 mt-1">tiempo estimado</div>
              </div>

              <div className="bg-white rounded-lg p-3 border-2 border-purple-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <MapPin className="w-3 h-3 text-purple-500" />
                  <span className="font-semibold">Progreso</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">{(progress * 100).toFixed(0)}%</div>
                <div className="text-xs text-gray-500 mt-1">
                  {(traveledDistance / 1000).toFixed(2)} / {(totalDistance / 1000).toFixed(2)} km
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border-2 border-orange-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Clock className="w-3 h-3 text-orange-500" />
                  <span className="font-semibold">Tiempo Real</span>
                </div>
                <div className="text-3xl font-bold text-orange-600">
                  {(() => {
                    const realTime = simulationTime * TIME_SCALE;
                    if (realTime >= 3600) return `${(realTime / 3600).toFixed(1)}h`;
                    if (realTime >= 60) return `${Math.floor(realTime / 60)}m`;
                    return `${Math.floor(realTime)}s`;
                  })()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  (sim: {Math.floor(simulationTime)}s)
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border-2 border-red-200 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <AlertTriangle className="w-3 h-3 text-red-500" />
                  <span className="font-semibold">Estado Actual</span>
                </div>
                <div className="text-lg font-bold mt-1">
                  {isAtIncident ? (
                    <Badge variant="destructive" className="text-xs">
                      ⚠️ {incidentDelay > 0 ? `Delay ${Math.floor(incidentDelay)}s` : 'En Incidente'}
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs bg-green-500">
                      ✓ En Circulación
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {scenario.incidents.length} incidentes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Ruta */}
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 mb-1 font-semibold">Ruta Actual</div>
                <div className="text-sm font-bold text-gray-900">
                  {currentLocation}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1 font-semibold">Escenario</div>
                <div className="text-sm font-bold flex items-center gap-1">
                  {scenario.icon} {scenario.name}
                </div>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border-2 border-indigo-300 shadow-sm">
                <div className="text-xs text-gray-600 font-semibold">Escala Temporal</div>
                <div className="text-base font-bold text-indigo-600">1s = 1min real</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Origen</span>
            <span>Destino</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress * 100}%`,
                backgroundColor: scenario.color,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
