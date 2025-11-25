import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Bus,
  Clock,
  Users,
  TrendingUp,
  MapPin,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Loader2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useOSMRoutes, type OSMRoute } from '@/hooks/useOSMRoutes';

interface Parada {
  id: string;
  nombre: string;
  coordenadas: { lat: number; lon: number };
  pasajeros_promedio: number;
}

interface Ruta {
  id: string;
  numero: string;
  nombre: string;
  coordenadas: { lat: number; lon: number }[];
  paradas: Parada[];
  frecuencia_minutos: number;
  capacidad_buses: number;
  pasajeros_promedio_dia: number;
  puntualidad: number; // 0-100
  estado: 'operativa' | 'retraso' | 'incidencia';
  horario: string;
  tarifa: number;
  longitud_km?: number; // Opcional para rutas OSM
}

// Componente para ajustar bounds del mapa cuando cambia la ruta
function MapBoundsUpdater({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = coords.map(c => [c[0], c[1]] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  
  return null;
}

export default function TransitView() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>('');
  const { routes: osmRoutes, loading: loadingOSM } = useOSMRoutes({ numRoutes: 4 });
  const [rutas, setRutas] = useState<Ruta[]>([]);

  // Convertir rutas OSM a formato Ruta
  useEffect(() => {
    if (osmRoutes.length > 0) {
      const rutasConvertidas: Ruta[] = osmRoutes.map((osmRoute, idx) => {
        // Generar paradas espaciadas a lo largo de la ruta
        const numParadas = Math.min(Math.floor(osmRoute.coordenadas.length / 10), 5);
        const paradas: Parada[] = [];
        
        for (let i = 0; i < numParadas; i++) {
          const index = Math.floor((osmRoute.coordenadas.length / (numParadas + 1)) * (i + 1));
          const coord = osmRoute.coordenadas[index];
          
          paradas.push({
            id: `P${idx}_${i}`,
            nombre: `Parada ${i + 1}`,
            coordenadas: { lat: coord[0], lon: coord[1] },
            pasajeros_promedio: Math.floor(Math.random() * 600) + 400,
          });
        }

        return {
          id: osmRoute.id,
          numero: `${idx + 1}`,
          nombre: osmRoute.nombre,
          coordenadas: osmRoute.coordenadas.map(c => ({ lat: c[0], lon: c[1] })),
          paradas,
          frecuencia_minutos: [10, 15, 20, 25][idx % 4],
          capacidad_buses: 45,
          pasajeros_promedio_dia: Math.floor(Math.random() * 5000) + 5000,
          puntualidad: Math.floor(Math.random() * 15) + 80,
          estado: ['operativa', 'operativa', 'retraso', 'operativa'][idx % 4] as 'operativa' | 'retraso' | 'incidencia',
          horario: '05:00 - 23:00',
          tarifa: 9.50,
          longitud_km: osmRoute.longitud_km,
        };
      });

      setRutas(rutasConvertidas);
      
      // Seleccionar primera ruta por defecto
      if (!rutaSeleccionada && rutasConvertidas.length > 0) {
        setRutaSeleccionada(rutasConvertidas[0].id);
      }
    }
  }, [osmRoutes, rutaSeleccionada]);

  // Mostrar skeleton mientras carga
  if (loadingOSM) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (rutas.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-2">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">No se pudieron cargar las rutas OSM</p>
        </div>
      </div>
    );
  }

  const rutaActual = rutas.find(r => r.id === rutaSeleccionada) || rutas[0];

  const totalPasajeros = rutas.reduce((acc, r) => acc + r.pasajeros_promedio_dia, 0);
  const puntualidadPromedio = rutas.length > 0 ? Math.round(rutas.reduce((acc, r) => acc + r.puntualidad, 0) / rutas.length) : 0;
  const rutasOperativas = rutas.filter(r => r.estado === 'operativa').length;
  
  const ruta = rutaActual; // Alias para compatibilidad

  const dataEspera = [
    { hora: '06:00', minutos: 18 },
    { hora: '08:00', minutos: 25 },
    { hora: '10:00', minutos: 15 },
    { hora: '12:00', minutos: 20 },
    { hora: '14:00', minutos: 17 },
    { hora: '16:00', minutos: 22 },
    { hora: '18:00', minutos: 28 },
    { hora: '20:00', minutos: 16 },
  ];

  const dataPasajerosPorRuta = rutas.map(r => ({
    nombre: `Ruta ${r.numero}`,
    pasajeros: r.pasajeros_promedio_dia,
    puntualidad: r.puntualidad,
  }));

  const busIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operativa': return 'default';
      case 'retraso': return 'secondary';
      case 'incidencia': return 'destructive';
      default: return 'outline';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'operativa': return 'Operativa';
      case 'retraso': return 'Con Retraso';
      case 'incidencia': return 'Incidencia';
      default: return estado;
    }
  };

  const getPuntualidadColor = (puntualidad: number) => {
    if (puntualidad >= 90) return 'text-primary';
    if (puntualidad >= 75) return 'text-secondary';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pasajeros Totales/Día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPasajeros.toLocaleString()}</div>
            <p className="text-xs text-primary">+8% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rutas Operativas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rutasOperativas} / {rutas.length}</div>
            <p className="text-xs text-muted-foreground">Sistema activo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Puntualidad Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{puntualidadPromedio}%</div>
            <p className="text-xs text-primary">+3% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo de Espera</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18 min</div>
            <p className="text-xs text-muted-foreground">Promedio actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Selector y Mapa */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="w-5 h-5" />
                  Mapa de Rutas
                </CardTitle>
                <CardDescription>Red de transporte público de Hermosillo</CardDescription>
              </div>
              <Select value={rutaSeleccionada} onValueChange={setRutaSeleccionada}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Seleccionar ruta" />
                </SelectTrigger>
                <SelectContent>
                  {rutas.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      Ruta {r.numero} - {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[29.0729, -110.9559]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Ajustar mapa a ruta OSM */}
                <MapBoundsUpdater coords={ruta.coordenadas.map(c => [c.lat, c.lon] as [number, number])} />
                
                {/* Ruta seleccionada */}
                <Polyline
                  positions={ruta.coordenadas.map(c => [c.lat, c.lon])}
                  color="#2563eb"
                  weight={4}
                  opacity={0.8}
                />

                {/* Paradas */}
                {ruta.paradas.map((parada) => (
                  <Marker
                    key={parada.id}
                    position={[parada.coordenadas.lat, parada.coordenadas.lon]}
                    icon={busIcon}
                  >
                    <Popup>
                      <div className="space-y-2">
                        <p className="font-semibold">{parada.nombre}</p>
                        <div className="text-xs space-y-1">
                          <p className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <strong>Pasajeros promedio:</strong> {parada.pasajeros_promedio}/día
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Info de Ruta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Ruta {ruta.numero}</span>
              <Badge variant={getEstadoColor(ruta.estado)}>
                {getEstadoLabel(ruta.estado)}
              </Badge>
            </CardTitle>
            <CardDescription>{ruta.nombre}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-3">Métricas</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Pasajeros/día</p>
                    <p className="font-semibold">{ruta.pasajeros_promedio_dia.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Frecuencia</p>
                    <p className="font-semibold">Cada {ruta.frecuencia_minutos} min</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Bus className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Capacidad</p>
                    <p className="font-semibold">{ruta.capacidad_buses} pasajeros</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {ruta.puntualidad >= 85 ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mt-0.5 text-destructive" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">Puntualidad</p>
                    <p className={`font-semibold ${getPuntualidadColor(ruta.puntualidad)}`}>
                      {ruta.puntualidad}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm mb-3">Información</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Horario:</span>
                  <span className="font-medium">{ruta.horario}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa:</span>
                  <span className="font-medium">${ruta.tarifa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paradas:</span>
                  <span className="font-medium">{ruta.paradas.length}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-semibold text-sm mb-2">Paradas</h4>
              <div className="space-y-2">
                {ruta.paradas.map((parada, idx) => (
                  <div key={parada.id} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{parada.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {parada.pasajeros_promedio} pasajeros/día
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Pasajeros por Ruta
            </CardTitle>
            <CardDescription>Promedio diario por ruta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataPasajerosPorRuta}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pasajeros" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tiempo de Espera por Hora
            </CardTitle>
            <CardDescription>Promedio de espera en paradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataEspera}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="minutos" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Minutos de espera"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Recomendaciones de Optimización
          </CardTitle>
          <CardDescription>Sugerencias basadas en análisis de datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                </div>
                <h4 className="font-semibold">Ruta 3 - Bajo rendimiento</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Puntualidad del 78%. Se recomienda aumentar frecuencia de buses en hora pico y optimizar tiempo de paradas.
              </p>
              <Badge variant="secondary">Prioridad Alta</Badge>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold">Ruta 4 - Excelente desempeño</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Puntualidad del 94% y alta demanda (11,500 pasajeros/día). Modelo a replicar en otras rutas.
              </p>
              <Badge variant="default">Buenas Prácticas</Badge>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent-foreground" />
                </div>
                <h4 className="font-semibold">Tiempos de espera en hora pico</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Espera promedio de 25-28 minutos entre 08:00-18:00. Agregar unidades adicionales en estos horarios.
              </p>
              <Badge variant="outline">Prioridad Media</Badge>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-secondary-foreground" />
                </div>
                <h4 className="font-semibold">Parada UNISON - Alta demanda</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                1,200 pasajeros diarios. Considerar infraestructura adicional (bancas, sombra) y más frecuencia.
              </p>
              <Badge variant="outline">Infraestructura</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
