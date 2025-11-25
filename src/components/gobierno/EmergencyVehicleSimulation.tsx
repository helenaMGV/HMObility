import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { useOSMRoutes } from '@/hooks/useOSMRoutes';

interface EmergencyEvent {
  id: string;
  type: 'accident' | 'fire' | 'medical' | 'crime';
  location: [number, number];
  time: number;
  status: 'pending' | 'responding' | 'resolved';
  assignedVehicle?: string;
}

interface Vehicle {
  id: string;
  type: 'patrol' | 'ambulance' | 'fire';
  position: [number, number];
  status: 'idle' | 'responding' | 'busy';
  speed: number;
  target?: [number, number];
  route?: [number, number][];
  progress: number;
}

export default function EmergencyVehicleSimulation() {
  const { routes, loading } = useOSMRoutes({ numRoutes: 3, maxLength: 4 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [events, setEvents] = useState<EmergencyEvent[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimestamp = useRef<number>(0);

  // Inicializar vehículos
  useEffect(() => {
    if (routes.length >= 3) {
      const initialVehicles: Vehicle[] = [
        {
          id: 'patrol_1',
          type: 'patrol',
          position: routes[0].coordenadas[0],
          status: 'idle',
          speed: 50,
          progress: 0,
        },
        {
          id: 'ambulance_1',
          type: 'ambulance',
          position: routes[1].coordenadas[0],
          status: 'idle',
          speed: 70,
          progress: 0,
        },
        {
          id: 'fire_1',
          type: 'fire',
          position: routes[2].coordenadas[0],
          status: 'idle',
          speed: 60,
          progress: 0,
        },
      ];
      setVehicles(initialVehicles);
    }
  }, [routes]);

  // Generar eventos aleatorios
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && routes.length > 0) {
        const randomRoute = routes[Math.floor(Math.random() * routes.length)];
        const randomPoint = randomRoute.coordenadas[
          Math.floor(Math.random() * randomRoute.coordenadas.length)
        ];

        const eventTypes: EmergencyEvent['type'][] = ['accident', 'fire', 'medical', 'crime'];
        const newEvent: EmergencyEvent = {
          id: `event_${Date.now()}`,
          type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          location: randomPoint,
          time: elapsedTime,
          status: 'pending',
        };

        setEvents((prev) => [...prev, newEvent]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, elapsedTime, routes]);

  // Asignar vehículos a eventos
  useEffect(() => {
    const pendingEvents = events.filter((e) => e.status === 'pending');
    const idleVehicles = vehicles.filter((v) => v.status === 'idle');

    if (pendingEvents.length > 0 && idleVehicles.length > 0) {
      const event = pendingEvents[0];
      const vehicle = idleVehicles[0];

      // Encontrar ruta más cercana
      const targetRoute = routes.find((r) => 
        r.coordenadas.some((c) => 
          Math.abs(c[0] - event.location[0]) < 0.01 && 
          Math.abs(c[1] - event.location[1]) < 0.01
        )
      );

      if (targetRoute) {
        setVehicles((prev) =>
          prev.map((v) =>
            v.id === vehicle.id
              ? {
                  ...v,
                  status: 'responding',
                  target: event.location,
                  route: targetRoute.coordenadas,
                  progress: 0,
                }
              : v
          )
        );

        setEvents((prev) =>
          prev.map((e) =>
            e.id === event.id
              ? { ...e, status: 'responding', assignedVehicle: vehicle.id }
              : e
          )
        );
      }
    }
  }, [events, vehicles, routes]);

  // Animación principal
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (timestamp: number) => {
      if (!lastTimestamp.current) lastTimestamp.current = timestamp;
      const deltaTime = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      setElapsedTime((prev) => prev + deltaTime);

      // Actualizar posiciones de vehículos
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => {
          if (vehicle.status === 'responding' && vehicle.route && vehicle.target) {
            const routeLength = calculateRouteLength(vehicle.route);
            const distancePerSecond = (vehicle.speed * 1000) / 3600;
            const progressIncrement = (distancePerSecond * deltaTime) / routeLength;

            let newProgress = vehicle.progress + progressIncrement;

            if (newProgress >= 1) {
              // Vehículo llegó al destino
              setEvents((prevEvents) =>
                prevEvents.map((e) =>
                  e.assignedVehicle === vehicle.id
                    ? { ...e, status: 'resolved' }
                    : e
                )
              );

              return {
                ...vehicle,
                status: 'idle',
                progress: 0,
                target: undefined,
                route: undefined,
              };
            }

            const newPosition = interpolatePosition(vehicle.route, newProgress);

            return {
              ...vehicle,
              progress: newProgress,
              position: newPosition,
            };
          }
          return vehicle;
        })
      );

      drawCanvas();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, vehicles, events]);

  const calculateRouteLength = (route: [number, number][]): number => {
    let length = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const R = 6371e3;
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

  const interpolatePosition = (route: [number, number][], progress: number): [number, number] => {
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

  const latLngToCanvas = (coord: [number, number], canvas: HTMLCanvasElement): [number, number] => {
    const bounds = {
      minLat: 29.04,
      maxLat: 29.12,
      minLng: -111.0,
      maxLng: -110.9,
    };

    const x = ((coord[1] - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * canvas.width;
    const y = ((bounds.maxLat - coord[0]) / (bounds.maxLat - bounds.minLat)) * canvas.height;

    return [x, y];
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar rutas
    routes.forEach((route) => {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();

      route.coordenadas.forEach((coord, i) => {
        const [x, y] = latLngToCanvas(coord, canvas);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Dibujar eventos
    events.forEach((event) => {
      const [x, y] = latLngToCanvas(event.location, canvas);

      if (event.status === 'pending') {
        // Efecto de pulso
        const pulseRadius = 15 + Math.sin(Date.now() / 200) * 5;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (event.status === 'resolved') {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Dibujar vehículos
    vehicles.forEach((vehicle) => {
      const [x, y] = latLngToCanvas(vehicle.position, canvas);

      // Color según tipo
      let color = '#3b82f6';
      if (vehicle.type === 'ambulance') color = '#ef4444';
      if (vehicle.type === 'fire') color = '#f59e0b';

      // Sirena animada si está respondiendo
      if (vehicle.status === 'responding') {
        const sirenPhase = Math.floor((Date.now() / 300) % 2);
        const sirenColor = sirenPhase === 0 ? color : '#ffffff';
        
        ctx.fillStyle = sirenColor;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Vehículo
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Dirección (flecha)
      if (vehicle.route && vehicle.progress < 1) {
        const nextIndex = Math.min(
          Math.floor((vehicle.route.length - 1) * vehicle.progress) + 1,
          vehicle.route.length - 1
        );
        const nextPoint = vehicle.route[nextIndex];
        const [nx, ny] = latLngToCanvas(nextPoint, canvas);
        
        const angle = Math.atan2(ny - y, nx - x);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(3, -3);
        ctx.lineTo(3, 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    });
  };

  const handleReset = () => {
    setElapsedTime(0);
    setEvents([]);
    setVehicles((prev) =>
      prev.map((v, i) => ({
        ...v,
        position: routes[i]?.coordenadas[0] || v.position,
        status: 'idle',
        progress: 0,
        target: undefined,
        route: undefined,
      }))
    );
    lastTimestamp.current = 0;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'accident': return '🚗💥';
      case 'fire': return '🔥';
      case 'medical': return '🚑';
      case 'crime': return '🚨';
      default: return '⚠️';
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-500';
      case 'responding': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Simulación de Emergencias</CardTitle>
          <CardDescription>Cargando rutas...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Simulación de Respuesta a Emergencias</span>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(elapsedTime)}s</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Sistema inteligente de despacho con vehículos reales en rutas OSM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Canvas principal */}
        <div className="border rounded-lg overflow-hidden bg-slate-50">
          <canvas
            ref={canvasRef}
            width={800}
            height={500}
            className="w-full h-auto"
          />
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {vehicles.filter((v) => v.status === 'idle').length}
              </div>
              <div className="text-xs text-gray-600">Disponibles</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {vehicles.filter((v) => v.status === 'responding').length}
              </div>
              <div className="text-xs text-gray-600">En Camino</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {events.filter((e) => e.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === 'resolved').length}
              </div>
              <div className="text-xs text-gray-600">Resueltos</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de eventos recientes */}
        <div>
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Eventos Recientes
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events.slice(-5).reverse().map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{getEventIcon(event.type)}</span>
                  <span className="capitalize">{event.type}</span>
                </div>
                <Badge className={`text-xs ${getEventColor(event.status)} text-white`}>
                  {event.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
