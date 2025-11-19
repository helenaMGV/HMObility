import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin,
  AlertCircle,
  Wrench,
  Lightbulb,
  Construction,
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

interface ReporteCiudadano {
  id: string;
  tipo: 'bache' | 'semaforo' | 'señaletica' | 'iluminacion' | 'otro';
  descripcion: string;
  coordenadas: { lat: number; lon: number };
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  fecha_reporte: string;
  fecha_resolucion?: string;
  ciudadano: string;
  prioridad: 'baja' | 'media' | 'alta';
  zona: string;
}

export default function CitizenScienceDashboardView() {
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  const reportes: ReporteCiudadano[] = [
    {
      id: 'R001',
      tipo: 'bache',
      descripcion: 'Bache profundo en carril derecho, riesgo para motociclistas',
      coordenadas: { lat: 29.0729, lon: -110.9559 },
      estado: 'pendiente',
      fecha_reporte: '2025-01-15T10:30:00',
      ciudadano: 'Juan Pérez',
      prioridad: 'alta',
      zona: 'Centro',
    },
    {
      id: 'R002',
      tipo: 'semaforo',
      descripcion: 'Semáforo intermitente, causa confusión en hora pico',
      coordenadas: { lat: 29.0800, lon: -110.9600 },
      estado: 'en_proceso',
      fecha_reporte: '2025-01-14T08:15:00',
      ciudadano: 'María González',
      prioridad: 'alta',
      zona: 'Solidaridad',
    },
    {
      id: 'R003',
      tipo: 'señaletica',
      descripcion: 'Señal de alto derribada por accidente',
      coordenadas: { lat: 29.0890, lon: -110.9550 },
      estado: 'resuelto',
      fecha_reporte: '2025-01-10T14:20:00',
      fecha_resolucion: '2025-01-12T16:45:00',
      ciudadano: 'Carlos Ramírez',
      prioridad: 'media',
      zona: 'Villa de Seris',
    },
    {
      id: 'R004',
      tipo: 'iluminacion',
      descripcion: '5 luminarias apagadas en tramo de 200 metros',
      coordenadas: { lat: 29.0650, lon: -110.9800 },
      estado: 'en_proceso',
      fecha_reporte: '2025-01-13T19:00:00',
      ciudadano: 'Ana López',
      prioridad: 'media',
      zona: 'San Benito',
    },
    {
      id: 'R005',
      tipo: 'bache',
      descripcion: 'Múltiples baches en avenida principal',
      coordenadas: { lat: 29.0950, lon: -111.0200 },
      estado: 'resuelto',
      fecha_reporte: '2025-01-08T11:30:00',
      fecha_resolucion: '2025-01-11T10:00:00',
      ciudadano: 'Roberto Silva',
      prioridad: 'alta',
      zona: 'UNISON',
    },
    {
      id: 'R006',
      tipo: 'otro',
      descripcion: 'Alcantarilla sin tapa, riesgo de accidente',
      coordenadas: { lat: 29.0780, lon: -110.9600 },
      estado: 'pendiente',
      fecha_reporte: '2025-01-16T07:45:00',
      ciudadano: 'Sofía Hernández',
      prioridad: 'alta',
      zona: 'Centro Norte',
    },
    {
      id: 'R007',
      tipo: 'señaletica',
      descripcion: 'Pintura de paso peatonal muy desgastada',
      coordenadas: { lat: 29.0700, lon: -110.9700 },
      estado: 'pendiente',
      fecha_reporte: '2025-01-17T09:00:00',
      ciudadano: 'Luis Martínez',
      prioridad: 'baja',
      zona: 'Modelo',
    },
    {
      id: 'R008',
      tipo: 'semaforo',
      descripcion: 'Tiempo de verde insuficiente para peatones mayores',
      coordenadas: { lat: 29.0850, lon: -110.9400 },
      estado: 'en_proceso',
      fecha_reporte: '2025-01-12T16:30:00',
      ciudadano: 'Elena Torres',
      prioridad: 'media',
      zona: 'Industrial',
    },
  ];

  const reportesFiltrados = reportes.filter(r => {
    const estadoMatch = estadoFiltro === 'todos' || r.estado === estadoFiltro;
    const tipoMatch = tipoFiltro === 'todos' || r.tipo === tipoFiltro;
    return estadoMatch && tipoMatch;
  });

  const totalReportes = reportes.length;
  const resueltos = reportes.filter(r => r.estado === 'resuelto').length;
  const enProceso = reportes.filter(r => r.estado === 'en_proceso').length;
  const pendientes = reportes.filter(r => r.estado === 'pendiente').length;

  // Calcular promedio de resolución (mock: 2.5 días)
  const reportesResueltos = reportes.filter(r => r.estado === 'resuelto' && r.fecha_resolucion);
  const promedioResolucion = reportesResueltos.length > 0 
    ? Math.round(reportesResueltos.reduce((acc, r) => {
        const inicio = new Date(r.fecha_reporte);
        const fin = new Date(r.fecha_resolucion!);
        const dias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24);
        return acc + dias;
      }, 0) / reportesResueltos.length * 10) / 10
    : 0;

  // Datos para gráficas
  const dataTiposIncidentes = [
    { tipo: 'Baches', cantidad: reportes.filter(r => r.tipo === 'bache').length },
    { tipo: 'Semáforos', cantidad: reportes.filter(r => r.tipo === 'semaforo').length },
    { tipo: 'Señalética', cantidad: reportes.filter(r => r.tipo === 'señaletica').length },
    { tipo: 'Iluminación', cantidad: reportes.filter(r => r.tipo === 'iluminacion').length },
    { tipo: 'Otro', cantidad: reportes.filter(r => r.tipo === 'otro').length },
  ];

  const dataTendencias = [
    { semana: 'Sem 1', reportes: 12, resueltos: 8 },
    { semana: 'Sem 2', reportes: 15, resueltos: 10 },
    { semana: 'Sem 3', reportes: 18, resueltos: 14 },
    { semana: 'Sem 4', reportes: 8, resueltos: 2 },
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'bache': return Construction;
      case 'semaforo': return AlertCircle;
      case 'señaletica': return MapPin;
      case 'iluminacion': return Lightbulb;
      default: return Wrench;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'bache': return 'bg-destructive/10 text-destructive';
      case 'semaforo': return 'bg-accent/10 text-accent-foreground';
      case 'señaletica': return 'bg-secondary/10 text-secondary-foreground';
      case 'iluminacion': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente': return { variant: 'destructive' as const, label: 'Pendiente' };
      case 'en_proceso': return { variant: 'secondary' as const, label: 'En Proceso' };
      case 'resuelto': return { variant: 'default' as const, label: 'Resuelto' };
      default: return { variant: 'outline' as const, label: estado };
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baja': return 'outline';
      default: return 'outline';
    }
  };

  const getMarkerIcon = (tipo: string) => {
    const colorMap: { [key: string]: string } = {
      bache: 'red',
      semaforo: 'orange',
      señaletica: 'yellow',
      iluminacion: 'blue',
      otro: 'grey',
    };

    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${colorMap[tipo]}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  const actualizarEstado = (id: string, nuevoEstado: 'pendiente' | 'en_proceso' | 'resuelto') => {
    console.log(`Actualizando reporte ${id} a estado: ${nuevoEstado}`);
    // En producción: actualizar estado en backend
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReportes}</div>
            <p className="text-xs text-primary">+12% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Resueltos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{resueltos}</div>
            <p className="text-xs text-muted-foreground">{Math.round((resueltos / totalReportes) * 100)}% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En Proceso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{enProceso}</div>
            <p className="text-xs text-muted-foreground">{pendientes} pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{promedioResolucion} días</div>
            <p className="text-xs text-primary">-15% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa y Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Mapa de Reportes Ciudadanos
              </CardTitle>
              <CardDescription>Incidentes reportados por la comunidad</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="resuelto">Resuelto</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="bache">Baches</SelectItem>
                  <SelectItem value="semaforo">Semáforos</SelectItem>
                  <SelectItem value="señaletica">Señalética</SelectItem>
                  <SelectItem value="iluminacion">Iluminación</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              
              <MarkerClusterGroup>
                {reportesFiltrados.map((reporte) => (
                  <Marker
                    key={reporte.id}
                    position={[reporte.coordenadas.lat, reporte.coordenadas.lon]}
                    icon={getMarkerIcon(reporte.tipo)}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[280px]">
                        <div className="flex items-center justify-between">
                          <Badge className={getTipoColor(reporte.tipo)}>
                            {reporte.tipo}
                          </Badge>
                          <Badge variant={getEstadoBadge(reporte.estado).variant}>
                            {getEstadoBadge(reporte.estado).label}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold">{reporte.descripcion}</p>
                        <div className="text-xs space-y-1">
                          <p><strong>ID:</strong> {reporte.id}</p>
                          <p><strong>Zona:</strong> {reporte.zona}</p>
                          <p><strong>Reportado por:</strong> {reporte.ciudadano}</p>
                          <p><strong>Fecha:</strong> {new Date(reporte.fecha_reporte).toLocaleDateString('es-MX')}</p>
                          <p>
                            <Badge variant={getPrioridadColor(reporte.prioridad)} className="text-xs">
                              Prioridad: {reporte.prioridad}
                            </Badge>
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Baches</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Semáforos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span>Señalética</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Iluminación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span>Otro</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Gestión de Reportes
          </CardTitle>
          <CardDescription>
            Mostrando {reportesFiltrados.length} de {totalReportes} reportes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Zona</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportesFiltrados.map((reporte) => {
                const TipoIcon = getTipoIcon(reporte.tipo);
                return (
                  <TableRow key={reporte.id}>
                    <TableCell className="font-medium">{reporte.id}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(reporte.tipo)}>
                        <TipoIcon className="w-3 h-3 mr-1" />
                        {reporte.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{reporte.descripcion}</TableCell>
                    <TableCell>{reporte.zona}</TableCell>
                    <TableCell>
                      <Badge variant={getPrioridadColor(reporte.prioridad)}>
                        {reporte.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadge(reporte.estado).variant}>
                        {getEstadoBadge(reporte.estado).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(reporte.fecha_reporte).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell>
                      {reporte.estado !== 'resuelto' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarEstado(
                            reporte.id,
                            reporte.estado === 'pendiente' ? 'en_proceso' : 'resuelto'
                          )}
                        >
                          {reporte.estado === 'pendiente' ? 'Iniciar' : 'Resolver'}
                        </Button>
                      )}
                      {reporte.estado === 'resuelto' && (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Gráficas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tipos de Incidentes Reportados
            </CardTitle>
            <CardDescription>Distribución por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataTiposIncidentes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencias Semanales
            </CardTitle>
            <CardDescription>Reportes vs Resoluciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataTendencias}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semana" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reportes" stroke="hsl(var(--primary))" strokeWidth={2} name="Reportes" />
                  <Line type="monotone" dataKey="resueltos" stroke="hsl(var(--secondary))" strokeWidth={2} name="Resueltos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
