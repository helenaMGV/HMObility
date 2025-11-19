import { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Wrench,
  Clock,
  MapPin,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface CostoDano {
  id: string;
  incidente_id: string;
  tipo_dano: 'poste' | 'señal' | 'semaforo' | 'barrera' | 'mobiliario' | 'luminaria';
  costo_estimado: number;
  costo_real?: number;
  fecha: string;
  coordenadas: { lat: number; lon: number };
  descripcion: string;
  estado: 'estimado' | 'en_reparacion' | 'completado';
  zona: string;
  responsable?: string;
}

export default function CostsDamagesView() {
  const [estadoFiltro, setEstadoFiltro] = useState<string>('todos');
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');

  const costos: CostoDano[] = [
    {
      id: 'CD-001',
      incidente_id: 'ACC-2025-0015',
      tipo_dano: 'poste',
      costo_estimado: 45000,
      costo_real: 47500,
      fecha: '2025-01-15',
      coordenadas: { lat: 29.0729, lon: -110.9559 },
      descripcion: 'Poste de alumbrado público derribado por colisión',
      estado: 'completado',
      zona: 'Centro',
      responsable: 'Obras Públicas',
    },
    {
      id: 'CD-002',
      incidente_id: 'ACC-2025-0018',
      tipo_dano: 'semaforo',
      costo_estimado: 85000,
      costo_real: 82000,
      fecha: '2025-01-16',
      coordenadas: { lat: 29.0800, lon: -110.9600 },
      descripcion: 'Semáforo vehicular dañado en intersección',
      estado: 'completado',
      zona: 'Solidaridad',
      responsable: 'Tránsito Municipal',
    },
    {
      id: 'CD-003',
      incidente_id: 'ACC-2025-0022',
      tipo_dano: 'barrera',
      costo_estimado: 12000,
      fecha: '2025-01-17',
      coordenadas: { lat: 29.0890, lon: -110.9550 },
      descripcion: 'Barrera de contención metálica dañada',
      estado: 'en_reparacion',
      zona: 'Colosio',
      responsable: 'SCT',
    },
    {
      id: 'CD-004',
      incidente_id: 'ACC-2025-0025',
      tipo_dano: 'señal',
      costo_estimado: 8500,
      fecha: '2025-01-17',
      coordenadas: { lat: 29.0650, lon: -110.9800 },
      descripcion: 'Señalamiento vertical de alto destruido',
      estado: 'estimado',
      zona: 'San Benito',
    },
    {
      id: 'CD-005',
      incidente_id: 'ACC-2025-0028',
      tipo_dano: 'mobiliario',
      costo_estimado: 15000,
      costo_real: 14200,
      fecha: '2025-01-14',
      coordenadas: { lat: 29.0950, lon: -111.0200 },
      descripcion: 'Banca y parada de autobús dañadas',
      estado: 'completado',
      zona: 'UNISON',
      responsable: 'Servicios Públicos',
    },
    {
      id: 'CD-006',
      incidente_id: 'ACC-2025-0030',
      tipo_dano: 'luminaria',
      costo_estimado: 6800,
      fecha: '2025-01-18',
      coordenadas: { lat: 29.0780, lon: -110.9600 },
      descripcion: 'Luminaria LED dañada por impacto',
      estado: 'estimado',
      zona: 'Centro Norte',
    },
    {
      id: 'CD-007',
      incidente_id: 'ACC-2025-0012',
      tipo_dano: 'poste',
      costo_estimado: 52000,
      costo_real: 49800,
      fecha: '2025-01-10',
      coordenadas: { lat: 29.0700, lon: -110.9700 },
      descripcion: 'Poste de CFE derribado con cables expuestos',
      estado: 'completado',
      zona: 'Modelo',
      responsable: 'CFE',
    },
    {
      id: 'CD-008',
      incidente_id: 'ACC-2025-0035',
      tipo_dano: 'semaforo',
      costo_estimado: 95000,
      fecha: '2025-01-18',
      coordenadas: { lat: 29.0850, lon: -110.9400 },
      descripcion: 'Sistema semafórico completo fuera de servicio',
      estado: 'en_reparacion',
      zona: 'Industrial',
      responsable: 'Tránsito Municipal',
    },
    {
      id: 'CD-009',
      incidente_id: 'ACC-2025-0020',
      tipo_dano: 'señal',
      costo_estimado: 7200,
      costo_real: 7500,
      fecha: '2025-01-13',
      coordenadas: { lat: 29.0680, lon: -110.9620 },
      descripcion: 'Señales informativas dañadas (2 unidades)',
      estado: 'completado',
      zona: 'Mercado',
      responsable: 'Obras Públicas',
    },
  ];

  const costosFiltrados = costos.filter(c => {
    const estadoMatch = estadoFiltro === 'todos' || c.estado === estadoFiltro;
    const tipoMatch = tipoFiltro === 'todos' || c.tipo_dano === tipoFiltro;
    return estadoMatch && tipoMatch;
  });

  const costoTotal = costos.reduce((acc, c) => acc + (c.costo_real || c.costo_estimado), 0);
  const costoPromedio = Math.round(costoTotal / costos.length);
  const completados = costos.filter(c => c.estado === 'completado').length;
  const enReparacion = costos.filter(c => c.estado === 'en_reparacion').length;

  // Top 5 zonas más costosas
  const costoPorZona = costos.reduce((acc, c) => {
    const zona = c.zona;
    const costo = c.costo_real || c.costo_estimado;
    acc[zona] = (acc[zona] || 0) + costo;
    return acc;
  }, {} as Record<string, number>);

  const top5Zonas = Object.entries(costoPorZona)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([zona, costo]) => ({ zona, costo }));

  // Costos por tipo
  const costoPorTipo = costos.reduce((acc, c) => {
    const tipo = c.tipo_dano;
    const costo = c.costo_real || c.costo_estimado;
    acc[tipo] = (acc[tipo] || 0) + costo;
    return acc;
  }, {} as Record<string, number>);

  const dataCostosPorTipo = Object.entries(costoPorTipo).map(([tipo, costo]) => ({
    tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
    costo: Math.round(costo / 1000),
  }));

  // Timeline mensual (mock últimos 6 meses)
  const dataTendencia = [
    { mes: 'Ago', costo: 145 },
    { mes: 'Sep', costo: 178 },
    { mes: 'Oct', costo: 210 },
    { mes: 'Nov', costo: 165 },
    { mes: 'Dic', costo: 192 },
    { mes: 'Ene', costo: Math.round(costoTotal / 1000) },
  ];

  // Pie chart estados
  const dataEstados = [
    { estado: 'Completado', cantidad: completados },
    { estado: 'En Reparación', cantidad: enReparacion },
    { estado: 'Estimado', cantidad: costos.filter(c => c.estado === 'estimado').length },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--muted))'];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'poste': return AlertCircle;
      case 'semaforo': return AlertCircle;
      case 'señal': return MapPin;
      case 'barrera': return Wrench;
      case 'mobiliario': return MapPin;
      case 'luminaria': return AlertCircle;
      default: return Wrench;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'poste': return 'bg-destructive/10 text-destructive';
      case 'semaforo': return 'bg-accent/10 text-accent-foreground';
      case 'señal': return 'bg-secondary/10 text-secondary-foreground';
      case 'barrera': return 'bg-primary/10 text-primary';
      case 'mobiliario': return 'bg-muted text-muted-foreground';
      case 'luminaria': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'estimado': return { variant: 'outline' as const, label: 'Estimado' };
      case 'en_reparacion': return { variant: 'secondary' as const, label: 'En Reparación' };
      case 'completado': return { variant: 'default' as const, label: 'Completado' };
      default: return { variant: 'outline' as const, label: estado };
    }
  };

  const getCircleColor = (costo: number) => {
    if (costo >= 80000) return '#ef4444'; // red
    if (costo >= 40000) return '#f97316'; // orange
    if (costo >= 20000) return '#eab308'; // yellow
    return '#84cc16'; // green
  };

  const getCircleRadius = (costo: number) => {
    if (costo >= 80000) return 15;
    if (costo >= 40000) return 12;
    if (costo >= 20000) return 9;
    return 6;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Costo Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(costoTotal / 1000).toFixed(0)}K</div>
            <p className="text-xs text-destructive">En daños registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Costo Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(costoPromedio / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Por incidente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Reparaciones Completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{completados}</div>
            <p className="text-xs text-muted-foreground">{enReparacion} en proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Zona Más Costosa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{top5Zonas[0]?.zona}</div>
            <p className="text-xs text-destructive">${(top5Zonas[0]?.costo / 1000).toFixed(0)}K en daños</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa y Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Mapa de Costos de Daños
              </CardTitle>
              <CardDescription>Infraestructura dañada por zona</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="estimado">Estimado</SelectItem>
                  <SelectItem value="en_reparacion">En Reparación</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="poste">Postes</SelectItem>
                  <SelectItem value="semaforo">Semáforos</SelectItem>
                  <SelectItem value="señal">Señales</SelectItem>
                  <SelectItem value="barrera">Barreras</SelectItem>
                  <SelectItem value="mobiliario">Mobiliario</SelectItem>
                  <SelectItem value="luminaria">Luminarias</SelectItem>
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

              {costosFiltrados.map((costo) => {
                const costoFinal = costo.costo_real || costo.costo_estimado;
                return (
                  <CircleMarker
                    key={costo.id}
                    center={[costo.coordenadas.lat, costo.coordenadas.lon]}
                    radius={getCircleRadius(costoFinal)}
                    pathOptions={{
                      color: getCircleColor(costoFinal),
                      fillColor: getCircleColor(costoFinal),
                      fillOpacity: 0.6,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[280px]">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={getTipoColor(costo.tipo_dano)}>
                            {costo.tipo_dano}
                          </Badge>
                          <Badge variant={getEstadoBadge(costo.estado).variant}>
                            {getEstadoBadge(costo.estado).label}
                          </Badge>
                        </div>
                        <p className="text-sm font-semibold">{costo.descripcion}</p>
                        <div className="text-xs space-y-1">
                          <p><strong>ID:</strong> {costo.id}</p>
                          <p><strong>Incidente:</strong> {costo.incidente_id}</p>
                          <p><strong>Zona:</strong> {costo.zona}</p>
                          <p><strong>Fecha:</strong> {new Date(costo.fecha).toLocaleDateString('es-MX')}</p>
                          <p className="text-destructive font-semibold">
                            <strong>Costo:</strong> ${(costoFinal / 1000).toFixed(1)}K
                          </p>
                          {costo.responsable && <p><strong>Responsable:</strong> {costo.responsable}</p>}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Leyenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span>Alto (&gt;$80K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span>Medio ($40-80K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span>Bajo ($20-40K)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Mínimo (&lt;$20K)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Daños */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Registro de Daños
          </CardTitle>
          <CardDescription>
            Mostrando {costosFiltrados.length} de {costos.length} registros
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
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Costo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {costosFiltrados.map((costo) => {
                const TipoIcon = getTipoIcon(costo.tipo_dano);
                const costoFinal = costo.costo_real || costo.costo_estimado;
                return (
                  <TableRow key={costo.id}>
                    <TableCell className="font-medium">{costo.id}</TableCell>
                    <TableCell>
                      <Badge className={getTipoColor(costo.tipo_dano)}>
                        <TipoIcon className="w-3 h-3 mr-1" />
                        {costo.tipo_dano}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{costo.descripcion}</TableCell>
                    <TableCell>{costo.zona}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(costo.fecha).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getEstadoBadge(costo.estado).variant}>
                        {getEstadoBadge(costo.estado).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      ${(costoFinal / 1000).toFixed(1)}K
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
              <BarChart3 className="w-5 h-5" />
              Costos por Tipo de Daño
            </CardTitle>
            <CardDescription>Distribución del gasto (miles de pesos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataCostosPorTipo}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="costo" fill="hsl(var(--destructive))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Tendencia Mensual
            </CardTitle>
            <CardDescription>Costos en miles de pesos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dataTendencia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="costo"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Costo (K)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Top 5 Zonas Más Costosas
            </CardTitle>
            <CardDescription>Daños acumulados por zona</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {top5Zonas.map((item, idx) => (
                <div key={item.zona} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-semibold">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{item.zona}</span>
                  </div>
                  <span className="font-semibold text-destructive">${(item.costo / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Estado de Reparaciones
            </CardTitle>
            <CardDescription>Distribución por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataEstados}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.estado}: ${entry.cantidad}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {dataEstados.map((entry, index) => (
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
    </div>
  );
}
