import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
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
  ParkingCircle,
  Truck,
  Clock,
  MapPin,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface ZonaCurb {
  id: string;
  nombre: string;
  tipo: 'estacionamiento' | 'carga_descarga' | 'mixto' | 'taxi';
  coordenadas: { lat: number; lon: number };
  area?: [[number, number], [number, number]]; // bounds for rectangle
  capacidad: number;
  ocupacion_actual: number;
  horario: string;
  tarifa?: number;
  restricciones: string;
  estado: 'disponible' | 'ocupado' | 'lleno';
}

export default function CurbsView() {
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string | null>('Z1');

  const zonas: ZonaCurb[] = [
    {
      id: 'Z1',
      nombre: 'Centro Histórico - Blvd. Rosales',
      tipo: 'estacionamiento',
      coordenadas: { lat: 29.0729, lon: -110.9559 },
      area: [[29.0720, -110.9570], [29.0738, -110.9548]],
      capacidad: 45,
      ocupacion_actual: 38,
      horario: '08:00 - 22:00',
      tarifa: 15,
      restricciones: 'Máx. 2 horas. No vehículos pesados',
      estado: 'ocupado',
    },
    {
      id: 'Z2',
      nombre: 'Mercado Municipal - Carga',
      tipo: 'carga_descarga',
      coordenadas: { lat: 29.0680, lon: -110.9620 },
      area: [[29.0675, -110.9630], [29.0685, -110.9610]],
      capacidad: 12,
      ocupacion_actual: 12,
      horario: '06:00 - 14:00',
      restricciones: 'Solo vehículos de carga. Máx. 30 min',
      estado: 'lleno',
    },
    {
      id: 'Z3',
      nombre: 'Plaza Zaragoza - Estacionamiento',
      tipo: 'estacionamiento',
      coordenadas: { lat: 29.0780, lon: -110.9600 },
      area: [[29.0770, -110.9615], [29.0790, -110.9585]],
      capacidad: 80,
      ocupacion_actual: 45,
      horario: '24 horas',
      tarifa: 10,
      restricciones: 'Tarifa por hora. Vigilancia 24/7',
      estado: 'disponible',
    },
    {
      id: 'Z4',
      nombre: 'Hospital CIMA - Mixto',
      tipo: 'mixto',
      coordenadas: { lat: 29.0950, lon: -111.0100 },
      area: [[29.0940, -111.0115], [29.0960, -111.0085]],
      capacidad: 60,
      ocupacion_actual: 52,
      horario: '24 horas',
      tarifa: 12,
      restricciones: 'Zona mixta: estacionamiento y ambulancias',
      estado: 'ocupado',
    },
    {
      id: 'Z5',
      nombre: 'Terminal de Autobuses - Taxis',
      tipo: 'taxi',
      coordenadas: { lat: 29.0650, lon: -110.9800 },
      area: [[29.0645, -110.9810], [29.0655, -110.9790]],
      capacidad: 25,
      ocupacion_actual: 18,
      horario: '24 horas',
      restricciones: 'Solo taxis autorizados',
      estado: 'disponible',
    },
    {
      id: 'Z6',
      nombre: 'Walmart Colosio - Carga',
      tipo: 'carga_descarga',
      coordenadas: { lat: 29.0890, lon: -110.9550 },
      area: [[29.0885, -110.9560], [29.0895, -110.9540]],
      capacidad: 15,
      ocupacion_actual: 8,
      horario: '22:00 - 10:00',
      restricciones: 'Vehículos pesados únicamente',
      estado: 'disponible',
    },
    {
      id: 'Z7',
      nombre: 'UNISON - Estacionamiento',
      tipo: 'estacionamiento',
      coordenadas: { lat: 29.0950, lon: -111.0200 },
      area: [[29.0940, -111.0215], [29.0960, -111.0185]],
      capacidad: 120,
      ocupacion_actual: 95,
      horario: '06:00 - 22:00',
      restricciones: 'Credencial universitaria requerida',
      estado: 'ocupado',
    },
  ];

  const zonasFiltradas = tipoFiltro === 'todos' 
    ? zonas 
    : zonas.filter(z => z.tipo === tipoFiltro);

  const zona = zonas.find(z => z.id === zonaSeleccionada) || zonas[0];

  const capacidadTotal = zonas.reduce((acc, z) => acc + z.capacidad, 0);
  const ocupacionTotal = zonas.reduce((acc, z) => acc + z.ocupacion_actual, 0);
  const porcentajeOcupacion = Math.round((ocupacionTotal / capacidadTotal) * 100);
  const zonasDisponibles = zonas.filter(z => z.estado === 'disponible').length;

  const dataOcupacionPorZona = zonas.map(z => ({
    nombre: z.nombre.split(' - ')[0],
    ocupacion: Math.round((z.ocupacion_actual / z.capacidad) * 100),
    disponibles: z.capacidad - z.ocupacion_actual,
  }));

  const dataPorTipo = [
    { tipo: 'Estacionamiento', cantidad: zonas.filter(z => z.tipo === 'estacionamiento').length },
    { tipo: 'Carga/Descarga', cantidad: zonas.filter(z => z.tipo === 'carga_descarga').length },
    { tipo: 'Mixto', cantidad: zonas.filter(z => z.tipo === 'mixto').length },
    { tipo: 'Taxis', cantidad: zonas.filter(z => z.tipo === 'taxi').length },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'estacionamiento': return ParkingCircle;
      case 'carga_descarga': return Truck;
      case 'taxi': return MapPin;
      default: return ParkingCircle;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'estacionamiento': return 'bg-primary/10 text-primary';
      case 'carga_descarga': return 'bg-secondary/10 text-secondary-foreground';
      case 'mixto': return 'bg-accent/10 text-accent-foreground';
      case 'taxi': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'default';
      case 'ocupado': return 'secondary';
      case 'lleno': return 'destructive';
      default: return 'outline';
    }
  };

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'ocupado': return 'Ocupado';
      case 'lleno': return 'Lleno';
      default: return estado;
    }
  };

  const getMarkerIcon = (tipo: string, estado: string) => {
    let color = 'blue';
    if (estado === 'lleno') color = 'red';
    else if (estado === 'ocupado') color = 'orange';
    else if (tipo === 'carga_descarga') color = 'violet';
    else if (tipo === 'taxi') color = 'yellow';

    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const getRectangleColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return { color: '#22c55e', fillColor: '#22c55e' };
      case 'ocupado': return { color: '#f59e0b', fillColor: '#f59e0b' };
      case 'lleno': return { color: '#ef4444', fillColor: '#ef4444' };
      default: return { color: '#94a3b8', fillColor: '#94a3b8' };
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Capacidad Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{capacidadTotal}</div>
            <p className="text-xs text-muted-foreground">Espacios disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ocupación Actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{porcentajeOcupacion}%</div>
            <p className="text-xs text-muted-foreground">{ocupacionTotal} espacios ocupados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Zonas Disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{zonasDisponibles}</div>
            <p className="text-xs text-muted-foreground">De {zonas.length} totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos Estimados/Día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$12,450</div>
            <p className="text-xs text-primary">+15% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Mapa */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ParkingCircle className="w-5 h-5" />
                  Mapa de Zonas de Estacionamiento
                </CardTitle>
                <CardDescription>Gestión de curbs y zonas de carga</CardDescription>
              </div>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las zonas</SelectItem>
                  <SelectItem value="estacionamiento">Estacionamiento</SelectItem>
                  <SelectItem value="carga_descarga">Carga/Descarga</SelectItem>
                  <SelectItem value="mixto">Mixto</SelectItem>
                  <SelectItem value="taxi">Taxis</SelectItem>
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
                
                {zonasFiltradas.map((zona) => (
                  <div key={zona.id}>
                    {/* Rectangle for area */}
                    {zona.area && (
                      <Rectangle
                        bounds={zona.area}
                        pathOptions={{
                          ...getRectangleColor(zona.estado),
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                    )}
                    
                    {/* Marker */}
                    <Marker
                      position={[zona.coordenadas.lat, zona.coordenadas.lon]}
                      icon={getMarkerIcon(zona.tipo, zona.estado)}
                      eventHandlers={{
                        click: () => setZonaSeleccionada(zona.id),
                      }}
                    >
                      <Popup>
                        <div className="space-y-2 min-w-[250px]">
                          <p className="font-semibold text-sm">{zona.nombre}</p>
                          <div className="flex gap-2">
                            <Badge variant={getEstadoColor(zona.estado)}>
                              {getEstadoLabel(zona.estado)}
                            </Badge>
                            <Badge className={getTipoColor(zona.tipo)}>
                              {zona.tipo.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="text-xs space-y-1">
                            <p><strong>Capacidad:</strong> {zona.capacidad} espacios</p>
                            <p><strong>Ocupación:</strong> {zona.ocupacion_actual} ({Math.round((zona.ocupacion_actual / zona.capacidad) * 100)}%)</p>
                            <p><strong>Horario:</strong> {zona.horario}</p>
                            {zona.tarifa && <p><strong>Tarifa:</strong> ${zona.tarifa}/hora</p>}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </div>
                ))}
              </MapContainer>
            </div>

            {/* Leyenda */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-500/20" />
                <span>Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-500/20" />
                <span>Ocupado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border-2 border-red-500 bg-red-500/20" />
                <span>Lleno</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info de Zona */}
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Zona</CardTitle>
            <CardDescription>{zona.nombre}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={getEstadoColor(zona.estado)}>
                {getEstadoLabel(zona.estado)}
              </Badge>
              <Badge className={getTipoColor(zona.tipo)}>
                {zona.tipo.replace('_', ' ')}
              </Badge>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ocupación</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{zona.ocupacion_actual} / {zona.capacidad}</span>
                  <span className={`text-sm font-semibold ${
                    zona.estado === 'disponible' ? 'text-primary' : 
                    zona.estado === 'lleno' ? 'text-destructive' : 'text-secondary'
                  }`}>
                    {Math.round((zona.ocupacion_actual / zona.capacidad) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      zona.estado === 'disponible' ? 'bg-primary' :
                      zona.estado === 'lleno' ? 'bg-destructive' : 'bg-secondary'
                    }`}
                    style={{ width: `${(zona.ocupacion_actual / zona.capacidad) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t space-y-2">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Horario</p>
                    <p className="text-sm text-muted-foreground">{zona.horario}</p>
                  </div>
                </div>
                
                {zona.tarifa && (
                  <div className="flex items-start gap-2">
                    <BarChart3 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tarifa</p>
                      <p className="text-sm text-muted-foreground">${zona.tarifa}/hora</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Restricciones</p>
                    <p className="text-sm text-muted-foreground">{zona.restricciones}</p>
                  </div>
                </div>
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
              Ocupación por Zona
            </CardTitle>
            <CardDescription>Porcentaje de ocupación actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataOcupacionPorZona} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="nombre" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="ocupacion" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Distribución por Tipo
            </CardTitle>
            <CardDescription>Cantidad de zonas por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPorTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.tipo}: ${entry.cantidad}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {dataPorTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Recomendaciones de Gestión
          </CardTitle>
          <CardDescription>Sugerencias para optimizar el uso de curbs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                </div>
                <h4 className="font-semibold text-sm">Zona Llena</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Mercado Municipal - Carga está al 100%. Considerar ampliar horarios o capacidad.
              </p>
              <Badge variant="destructive">Alta Prioridad</Badge>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm">Disponibilidad Alta</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Plaza Zaragoza tiene 44% de disponibilidad. Excelente opción para redirigir tráfico.
              </p>
              <Badge variant="default">Optimización</Badge>
            </div>

            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent-foreground" />
                </div>
                <h4 className="font-semibold text-sm">Potencial de Ingresos</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Aumentar tarifa en Centro Histórico de $15 a $18 en hora pico podría incrementar ingresos 20%.
              </p>
              <Badge variant="outline">Análisis</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
