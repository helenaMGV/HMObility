import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
}

export default function TransitView() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState<string>('R1');

  const rutas: Ruta[] = [
    {
      id: 'R1',
      numero: '1',
      nombre: 'Centro - Villa de Seris',
      coordenadas: [
        { lat: 29.0729, lon: -110.9559 },
        { lat: 29.0800, lon: -110.9600 },
        { lat: 29.0890, lon: -110.9550 },
        { lat: 29.0950, lon: -110.9480 },
        { lat: 29.1020, lon: -110.9420 },
      ],
      paradas: [
        { id: 'P1', nombre: 'Centro', coordenadas: { lat: 29.0729, lon: -110.9559 }, pasajeros_promedio: 850 },
        { id: 'P2', nombre: 'Prol. Colosio', coordenadas: { lat: 29.0890, lon: -110.9550 }, pasajeros_promedio: 620 },
        { id: 'P3', nombre: 'Villa de Seris', coordenadas: { lat: 29.1020, lon: -110.9420 }, pasajeros_promedio: 480 },
      ],
      frecuencia_minutos: 15,
      capacidad_buses: 45,
      pasajeros_promedio_dia: 8500,
      puntualidad: 87,
      estado: 'operativa',
      horario: '05:00 - 23:00',
      tarifa: 9.50,
    },
    {
      id: 'R2',
      numero: '2',
      nombre: 'San Benito - Zona Industrial',
      coordenadas: [
        { lat: 29.0650, lon: -110.9800 },
        { lat: 29.0700, lon: -110.9700 },
        { lat: 29.0750, lon: -110.9600 },
        { lat: 29.0800, lon: -110.9500 },
        { lat: 29.0850, lon: -110.9400 },
      ],
      paradas: [
        { id: 'P4', nombre: 'San Benito', coordenadas: { lat: 29.0650, lon: -110.9800 }, pasajeros_promedio: 720 },
        { id: 'P5', nombre: 'Blvd. Solidaridad', coordenadas: { lat: 29.0750, lon: -110.9600 }, pasajeros_promedio: 560 },
        { id: 'P6', nombre: 'Zona Industrial', coordenadas: { lat: 29.0850, lon: -110.9400 }, pasajeros_promedio: 910 },
      ],
      frecuencia_minutos: 12,
      capacidad_buses: 50,
      pasajeros_promedio_dia: 9200,
      puntualidad: 92,
      estado: 'operativa',
      horario: '05:30 - 22:30',
      tarifa: 9.50,
    },
    {
      id: 'R3',
      numero: '3',
      nombre: 'Peri Norte - Peri Sur',
      coordenadas: [
        { lat: 29.1200, lon: -110.9600 },
        { lat: 29.1000, lon: -110.9550 },
        { lat: 29.0800, lon: -110.9500 },
        { lat: 29.0600, lon: -110.9450 },
        { lat: 29.0400, lon: -110.9400 },
      ],
      paradas: [
        { id: 'P7', nombre: 'Peri Norte', coordenadas: { lat: 29.1200, lon: -110.9600 }, pasajeros_promedio: 530 },
        { id: 'P8', nombre: 'Centro Norte', coordenadas: { lat: 29.0800, lon: -110.9500 }, pasajeros_promedio: 670 },
        { id: 'P9', nombre: 'Peri Sur', coordenadas: { lat: 29.0400, lon: -110.9400 }, pasajeros_promedio: 490 },
      ],
      frecuencia_minutos: 20,
      capacidad_buses: 40,
      pasajeros_promedio_dia: 6800,
      puntualidad: 78,
      estado: 'retraso',
      horario: '06:00 - 22:00',
      tarifa: 9.50,
    },
    {
      id: 'R4',
      numero: '4',
      nombre: 'Universitario - Vado del Río',
      coordenadas: [
        { lat: 29.0950, lon: -111.0200 },
        { lat: 29.0850, lon: -111.0000 },
        { lat: 29.0750, lon: -110.9800 },
        { lat: 29.0650, lon: -110.9600 },
      ],
      paradas: [
        { id: 'P10', nombre: 'UNISON', coordenadas: { lat: 29.0950, lon: -111.0200 }, pasajeros_promedio: 1200 },
        { id: 'P11', nombre: 'Blvd. Encinas', coordenadas: { lat: 29.0750, lon: -110.9800 }, pasajeros_promedio: 780 },
        { id: 'P12', nombre: 'Vado del Río', coordenadas: { lat: 29.0650, lon: -110.9600 }, pasajeros_promedio: 640 },
      ],
      frecuencia_minutos: 10,
      capacidad_buses: 55,
      pasajeros_promedio_dia: 11500,
      puntualidad: 94,
      estado: 'operativa',
      horario: '05:00 - 23:30',
      tarifa: 9.50,
    },
  ];

  const ruta = rutas.find(r => r.id === rutaSeleccionada) || rutas[0];

  const totalPasajeros = rutas.reduce((acc, r) => acc + r.pasajeros_promedio_dia, 0);
  const puntualidadPromedio = Math.round(rutas.reduce((acc, r) => acc + r.puntualidad, 0) / rutas.length);
  const rutasOperativas = rutas.filter(r => r.estado === 'operativa').length;

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
