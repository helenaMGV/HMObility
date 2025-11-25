import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Zap, Activity } from 'lucide-react';
import { useOSMRoutes } from '@/hooks/useOSMRoutes';

interface AnimatedVehicle {
  id: string;
  type: 'patrol' | 'ambulance' | 'fire';
  route: [number, number][];
  speed: number; // km/h
  progress: number; // 0-1
  name: string;
  status: 'active' | 'responding' | 'idle';
  trail: [number, number][]; // Historial de posiciones
}

export default function RealTimeAnimationMiniMap() {
  const { routes, loading } = useOSMRoutes({ numRoutes: 2, maxLength: 5 });
  const [isPlaying, setIsPlaying] = useState(true);
  const [vehicles, setVehicles] = useState<AnimatedVehicle[]>([]);
  const animationRef = useRef<number>();
  const lastTimestampRef = useRef<number>(0);

  // Función para calcular longitud de ruta
  const calculateRouteLength = (route: [number, number][]): number => {
    let length = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const R = 6371e3; // Radio de la Tierra en metros
      const φ1 = (route[i][0] * Math.PI) / 180;
      const φ2 = (route[i + 1][0] * Math.PI) / 180;
      const Δφ = ((route[i + 1][0] - route[i][0]) * Math.PI) / 180;
      const Δλ = ((route[i + 1][1] - route[i][1]) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      length += R * c;
    }
    return length;
  };

  // Función estática para calcular posición (sin usar state)
  const getVehiclePositionStatic = (route: [number, number][], progress: number): [number, number] => {
    const totalDistance = calculateRouteLength(route);
    let targetDistance = progress * totalDistance;
    let accumulatedDistance = 0;

    for (let i = 0; i < route.length - 1; i++) {
      const segmentStart = route[i];
      const segmentEnd = route[i + 1];
      
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
        return [lat, lon];
      }

      accumulatedDistance += segmentDistance;
    }

    return route[route.length - 1];
  };

  // Inicializar vehículos cuando las rutas carguen
  useEffect(() => {
    if (routes.length >= 2) {
      const newVehicles: AnimatedVehicle[] = [
        {
          id: 'patrol_1',
          type: 'patrol',
          route: routes[0].coordenadas,
          speed: 45,
          progress: 0,
          name: 'Patrulla 1',
          status: 'active',
          trail: [],
        },
        {
          id: 'ambulance_1',
          type: 'ambulance',
          route: routes[1].coordenadas,
          speed: 65,
          progress: 0.3,
          name: 'Ambulancia 1',
          status: 'responding',
          trail: [],
        },
        {
          id: 'fire_1',
          type: 'fire',
          route: routes[0].coordenadas,
          speed: 55,
          progress: 0.6,
          name: 'Bomberos 1',
          status: 'active',
          trail: [],
        },
      ];
      
      setVehicles(newVehicles);
    }
  }, [routes]);

  // Animación de vehículos
  useEffect(() => {
    if (!isPlaying || vehicles.length === 0) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000; // segundos
      lastTimestampRef.current = timestamp;

      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          const routeLength = calculateRouteLength(vehicle.route);
          const distancePerSecond = (vehicle.speed * 1000) / 3600; // m/s
          const progressIncrement = (distancePerSecond * deltaTime) / routeLength;

          let newProgress = vehicle.progress + progressIncrement;
          if (newProgress > 1) {
            newProgress = 0; // Loop - reiniciar trail
            return { ...vehicle, progress: newProgress, trail: [] };
          }

          // Actualizar trail (mantener últimas 15 posiciones)
          const currentPosition = getVehiclePositionStatic(vehicle.route, vehicle.progress);
          const newTrail = [...vehicle.trail, currentPosition].slice(-15);

          return { ...vehicle, progress: newProgress, trail: newTrail };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, vehicles.length]);

  const handleReset = () => {
    setVehicles((prev) =>
      prev.map((v) => ({ ...v, progress: 0, trail: [] }))
    );
    lastTimestampRef.current = 0;
  };

  const getVehiclePosition = (vehicle: AnimatedVehicle): [number, number] => {
    const totalDistance = calculateRouteLength(vehicle.route);
    let targetDistance = vehicle.progress * totalDistance;
    let accumulatedDistance = 0;

    for (let i = 0; i < vehicle.route.length - 1; i++) {
      const segmentStart = vehicle.route[i];
      const segmentEnd = vehicle.route[i + 1];
      
      // Calcular distancia del segmento
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
        // Interpolar posición en este segmento
        const ratio = (targetDistance - accumulatedDistance) / segmentDistance;
        const lat = segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * ratio;
        const lon = segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * ratio;
        return [lat, lon];
      }

      accumulatedDistance += segmentDistance;
    }

    // Fallback a última posición
    return vehicle.route[vehicle.route.length - 1];
  };

  const getVehicleColor = (type: string, opacity = 1) => {
    switch (type) {
      case 'patrol': return opacity < 1 ? `rgba(59, 130, 246, ${opacity})` : '#3b82f6';
      case 'ambulance': return opacity < 1 ? `rgba(239, 68, 68, ${opacity})` : '#ef4444';
      case 'fire': return opacity < 1 ? `rgba(245, 158, 11, ${opacity})` : '#f59e0b';
      default: return `rgba(107, 116, 128, ${opacity})`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responding': return '🚨';
      case 'active': return '✅';
      case 'idle': return '⏸️';
      default: return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responding': return 'bg-red-500';
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Centro de Comando en Tiempo Real</CardTitle>
          <CardDescription>Cargando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🚨 Centro de Comando en Tiempo Real</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Vehículos de emergencia moviéndose por rutas reales de OSM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] rounded-lg overflow-hidden border mb-4">
          <MapContainer
            center={[29.0729, -110.9559]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Rutas base */}
            {vehicles.map((vehicle) => (
              <Polyline
                key={`route-${vehicle.id}`}
                positions={vehicle.route}
                color={getVehicleColor(vehicle.type)}
                weight={3}
                opacity={0.3}
                dashArray="8, 12"
              />
            ))}

            {/* Trails de movimiento (estelas) */}
            {vehicles.map((vehicle) => {
              if (vehicle.trail.length < 2) return null;
              
              return (
                <Polyline
                  key={`trail-${vehicle.id}`}
                  positions={vehicle.trail}
                  color={getVehicleColor(vehicle.type)}
                  weight={4}
                  opacity={0.6}
                  dashArray="0"
                  className="animate-pulse"
                />
              );
            })}

            {/* Área de influencia (radar) */}
            {vehicles.map((vehicle) => {
              const position = getVehiclePosition(vehicle);
              return (
                <Circle
                  key={`radar-${vehicle.id}`}
                  center={position}
                  radius={150}
                  fillColor={getVehicleColor(vehicle.type)}
                  fillOpacity={0.1}
                  stroke={true}
                  color={getVehicleColor(vehicle.type)}
                  weight={1}
                  opacity={0.3}
                />
              );
            })}

            {/* Vehículos animados con glow effect */}
            {vehicles.map((vehicle) => {
              const position = getVehiclePosition(vehicle);
              return (
                <div key={vehicle.id}>
                  {/* Glow exterior */}
                  <CircleMarker
                    center={position}
                    radius={12}
                    fillColor={getVehicleColor(vehicle.type)}
                    fillOpacity={0.2}
                    stroke={false}
                    className="animate-ping"
                  />
                  {/* Vehículo principal */}
                  <CircleMarker
                    center={position}
                    radius={10}
                    fillColor={getVehicleColor(vehicle.type)}
                    fillOpacity={0.95}
                    stroke={true}
                    color="white"
                    weight={3}
                    className="transition-all duration-300 ease-in-out"
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[180px]">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-base">{vehicle.name}</p>
                          <span className="text-lg">{getStatusIcon(vehicle.status)}</span>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            <span>Velocidad: {vehicle.speed} km/h</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            <span>Progreso: {(vehicle.progress * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`text-xs ${getStatusColor(vehicle.status)} text-white`}>
                              {vehicle.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                </div>
              );
            })}
          </MapContainer>
        </div>

        {/* Panel de estado en tiempo real */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Unidades Activas</h4>
          <div className="grid grid-cols-3 gap-3">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-2 transition-all hover:shadow-lg">
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: getVehicleColor(vehicle.type) }}
                      />
                      <span className="text-xs font-medium">{vehicle.name}</span>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-[10px] ${getStatusColor(vehicle.status)} text-white`}
                    >
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>Velocidad</span>
                      <span className="font-semibold">{vehicle.speed} km/h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${vehicle.progress * 100}%`,
                          backgroundColor: getVehicleColor(vehicle.type),
                        }}
                      />
                    </div>
                    <div className="text-right text-[10px] text-gray-500">
                      {(vehicle.progress * 100).toFixed(0)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Leyenda mejorada */}
          <div className="flex gap-4 justify-center pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs">Patrulla</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs">Ambulancia</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs">Bomberos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
