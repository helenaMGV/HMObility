import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAnimation } from '@/contexts/AnimationContext';
import { Bus, Car, Bike, Ambulance } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface Route {
  id: string;
  nombre: string;
  tipo: string;
  color: string;
  coordenadas: [number, number][];
}

interface Vehicle {
  id: string;
  tipo: string;
  ruta_id: string;
  velocidad_kmh: number;
  offset_inicial: number;
  nombre: string;
}

interface RouteSegment {
  segments: { start: [number, number]; end: [number, number]; length: number }[];
  totalLength: number;
  cumulativeLengths: number[];
}

interface AnimatedMobilityMapProps {
  useRealData?: boolean;
}

const AnimatedMobilityMap = ({ useRealData = false }: AnimatedMobilityMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { scenario, isPlaying, speedMultiplier } = useAnimation();
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const vehicleMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routeSegmentsRef = useRef<Map<string, RouteSegment>>(new Map());
  const vehicleProgressRef = useRef<Map<string, number>>(new Map());
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const routeLayersRef = useRef<L.Polyline[]>([]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([29.0729, -110.9559], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Cargar rutas según escenario y fuente de datos
  useEffect(() => {
    const loadScenario = async () => {
      try {
        let routesUrl = '';
        
        // Si se usan datos reales, cargar rutas de OSM
        if (useRealData) {
          routesUrl = '/datajson/rutas_escenario_base_real.json';
        } else {
          // Datos simulados según escenario
          switch (scenario) {
            case 'actual':
              routesUrl = '/datajson/rutas_escenario_base.json';
              break;
            case 'optimo':
              routesUrl = '/datajson/rutas_escenario_optimo.json';
              break;
            case 'eventos':
              routesUrl = '/datajson/rutas_eventos_especiales.json';
              break;
          }
        }

        const [routesRes, vehiclesRes] = await Promise.all([
          fetch(routesUrl),
          fetch('/datajson/vehiculos_simulados.json'),
        ]);

        const routesData = await routesRes.json();
        const vehiclesData = await vehiclesRes.json();

        // Si los datos son reales de OSM, las rutas están en el campo 'rutas'
        const loadedRoutes = useRealData && routesData.rutas ? routesData.rutas : routesData;
        
        setRoutes(loadedRoutes);
        setVehicles(vehiclesData);
      } catch (error) {
        console.error('Error loading scenario:', error);
      }
    };

    loadScenario();
  }, [scenario, useRealData]);

  // Calcular segmentos de rutas
  useEffect(() => {
    if (!routes.length) return;

    routeSegmentsRef.current.clear();

    routes.forEach((route) => {
      const segments: { start: [number, number]; end: [number, number]; length: number }[] = [];
      const cumulativeLengths: number[] = [0];
      let totalLength = 0;

      for (let i = 0; i < route.coordenadas.length - 1; i++) {
        const start = route.coordenadas[i];
        const end = route.coordenadas[i + 1];
        
        // Calcular distancia en metros usando fórmula de Haversine
        const length = calculateDistance(start, end);
        
        segments.push({ start, end, length });
        totalLength += length;
        cumulativeLengths.push(totalLength);
      }

      routeSegmentsRef.current.set(route.id, {
        segments,
        totalLength,
        cumulativeLengths,
      });
    });
  }, [routes]);

  // Dibujar rutas en el mapa
  useEffect(() => {
    if (!mapRef.current || !routes.length) return;

    // Limpiar rutas anteriores
    routeLayersRef.current.forEach((layer) => layer.remove());
    routeLayersRef.current = [];

    routes.forEach((route) => {
      const polyline = L.polyline(route.coordenadas, {
        color: route.color,
        weight: 4,
        opacity: 0.7,
      }).addTo(mapRef.current!);

      // Popup con información de la ruta
      polyline.bindPopup(`
        <div class="text-sm">
          <strong>${route.nombre}</strong><br/>
          Tipo: ${route.tipo}<br/>
          Puntos: ${route.coordenadas.length}
        </div>
      `);

      routeLayersRef.current.push(polyline);
    });
  }, [routes]);

  // Crear/actualizar markers de vehículos
  useEffect(() => {
    if (!mapRef.current || !vehicles.length || !routes.length) return;

    // Limpiar markers anteriores
    vehicleMarkersRef.current.forEach((marker) => marker.remove());
    vehicleMarkersRef.current.clear();
    vehicleProgressRef.current.clear();

    vehicles.forEach((vehicle) => {
      const route = routes.find((r) => r.id === vehicle.ruta_id);
      if (!route || route.coordenadas.length < 2) return;

      // Inicializar progreso con offset
      vehicleProgressRef.current.set(vehicle.id, vehicle.offset_inicial);

      // Crear ícono personalizado según tipo
      const iconHtml = getVehicleIcon(vehicle.tipo);
      const icon = L.divIcon({
        html: iconHtml,
        className: 'vehicle-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      // Posición inicial
      const initialPos = interpolatePosition(route, vehicle.offset_inicial);
      
      const marker = L.marker(initialPos, { icon }).addTo(mapRef.current!);
      marker.bindPopup(`
        <div class="text-sm">
          <strong>${vehicle.nombre}</strong><br/>
          Tipo: ${vehicle.tipo}<br/>
          Velocidad: ${vehicle.velocidad_kmh} km/h
        </div>
      `);

      vehicleMarkersRef.current.set(vehicle.id, marker);
    });
  }, [vehicles, routes]);

  // Loop de animación
  useEffect(() => {
    if (!isPlaying || !vehicles.length || !routes.length) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000; // segundos
      lastTimestampRef.current = timestamp;

      vehicles.forEach((vehicle) => {
        const route = routes.find((r) => r.id === vehicle.ruta_id);
        if (!route) return;

        const routeSegment = routeSegmentsRef.current.get(route.id);
        if (!routeSegment) return;

        const marker = vehicleMarkersRef.current.get(vehicle.id);
        if (!marker) return;

        let progress = vehicleProgressRef.current.get(vehicle.id) || 0;

        // Actualizar progreso
        const velocidad_m_s = (vehicle.velocidad_kmh * 1000) / 3600;
        const progressIncrement = (velocidad_m_s * deltaTime * speedMultiplier) / routeSegment.totalLength;
        progress += progressIncrement;

        // Loop cuando completa la ruta
        if (progress > 1) {
          progress = progress - Math.floor(progress);
        }

        vehicleProgressRef.current.set(vehicle.id, progress);

        // Interpolar posición
        const newPos = interpolatePosition(route, progress);
        marker.setLatLng(newPos);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, vehicles, routes, speedMultiplier]);

  // Calcular distancia entre dos coordenadas (Haversine)
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371000; // Radio de la Tierra en metros
    const lat1 = (coord1[0] * Math.PI) / 180;
    const lat2 = (coord2[0] * Math.PI) / 180;
    const deltaLat = ((coord2[0] - coord1[0]) * Math.PI) / 180;
    const deltaLon = ((coord2[1] - coord1[1]) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Interpolar posición en la ruta según progreso [0, 1]
  const interpolatePosition = (route: Route, progress: number): [number, number] => {
    const routeSegment = routeSegmentsRef.current.get(route.id);
    if (!routeSegment) return route.coordenadas[0];

    const targetDistance = progress * routeSegment.totalLength;
    
    // Encontrar en qué segmento está
    let segmentIndex = 0;
    for (let i = 0; i < routeSegment.cumulativeLengths.length - 1; i++) {
      if (targetDistance >= routeSegment.cumulativeLengths[i] && 
          targetDistance < routeSegment.cumulativeLengths[i + 1]) {
        segmentIndex = i;
        break;
      }
    }

    const segment = routeSegment.segments[segmentIndex];
    if (!segment) return route.coordenadas[0];

    const segmentStart = routeSegment.cumulativeLengths[segmentIndex];
    const distanceInSegment = targetDistance - segmentStart;
    const segmentProgress = distanceInSegment / segment.length;

    // Interpolación lineal
    const lat = segment.start[0] + (segment.end[0] - segment.start[0]) * segmentProgress;
    const lng = segment.start[1] + (segment.end[1] - segment.start[1]) * segmentProgress;

    return [lat, lng];
  };

  // Obtener ícono según tipo de vehículo
  const getVehicleIcon = (tipo: string): string => {
    let IconComponent;
    let color = '#000000';

    switch (tipo) {
      case 'camion':
        IconComponent = Bus;
        color = '#0077ff';
        break;
      case 'auto':
        IconComponent = Car;
        color = '#dd0033';
        break;
      case 'bicicleta':
        IconComponent = Bike;
        color = '#8e44ad';
        break;
      case 'ambulancia':
        IconComponent = Ambulance;
        color = '#e74c3c';
        break;
      default:
        IconComponent = Car;
    }

    return `
      <div style="
        background: ${color};
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        ${renderToString(<IconComponent size={18} color="white" />)}
      </div>
    `;
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Leyenda */}
      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[1000] max-w-xs">
        <h3 className="font-bold text-sm mb-2">Leyenda</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#0077ff]" />
            <span>Camión</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#dd0033]" />
            <span>Auto</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#8e44ad]" />
            <span>Bicicleta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#e74c3c]" />
            <span>Ambulancia</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            {useRealData && (
              <>
                <span className="inline-flex items-center gap-1 text-green-600 font-semibold mb-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Datos OSM Reales
                </span>
                <br/>
              </>
            )}
            Escenario: <span className="font-semibold capitalize">{scenario}</span><br/>
            Vehículos: {vehicles.length}<br/>
            Rutas: {routes.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedMobilityMap;
