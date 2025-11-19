import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Search,
  Download,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Activo {
  id: string;
  tipo: 'semaforo' | 'señal' | 'tope' | 'barda' | 'luminaria' | 'reductores';
  nombre: string;
  ubicacion: string;
  colonia: string;
  coordenadas: {
    lat: number;
    lon: number;
  };
  estado: 'operativo' | 'mantenimiento' | 'dañado';
  costo_instalacion: number;
  fecha_instalacion: string;
  ultimo_mantenimiento: string;
}

export default function AssetInventory() {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');

  const activos: Activo[] = [
    {
      id: 'SEM-001',
      tipo: 'semaforo',
      nombre: 'Semáforo Blvd. Colosio y Morelos',
      ubicacion: 'Blvd. Luis Donaldo Colosio y Calle Morelos',
      colonia: 'Villa de Seris',
      coordenadas: { lat: 29.0890, lon: -110.9550 },
      estado: 'operativo',
      costo_instalacion: 85000,
      fecha_instalacion: '2024-03-15',
      ultimo_mantenimiento: '2025-10-20',
    },
    {
      id: 'SEM-002',
      tipo: 'semaforo',
      nombre: 'Semáforo Av. Nayarit y 12 de Octubre',
      ubicacion: 'Av. Nayarit y Calle 12 de Octubre',
      colonia: 'San Benito',
      coordenadas: { lat: 29.0931, lon: -110.9714 },
      estado: 'mantenimiento',
      costo_instalacion: 85000,
      fecha_instalacion: '2023-11-10',
      ultimo_mantenimiento: '2025-11-15',
    },
    {
      id: 'SEÑ-001',
      tipo: 'señal',
      nombre: 'Señal Alto - Altares',
      ubicacion: 'Calle Ing. Mario Yeomans Martínez',
      colonia: 'Altares',
      coordenadas: { lat: 29.0164, lon: -110.9429 },
      estado: 'operativo',
      costo_instalacion: 3500,
      fecha_instalacion: '2024-08-05',
      ultimo_mantenimiento: '2025-10-01',
    },
    {
      id: 'TOP-001',
      tipo: 'tope',
      nombre: 'Reductor de velocidad - Pitic',
      ubicacion: 'Calle Rosales entre Guerrero y Sufragio',
      colonia: 'Pitic',
      coordenadas: { lat: 29.0650, lon: -110.9700 },
      estado: 'operativo',
      costo_instalacion: 12000,
      fecha_instalacion: '2024-05-20',
      ultimo_mantenimiento: '2025-09-10',
    },
    {
      id: 'BAR-001',
      tipo: 'barda',
      nombre: 'Muro de contención - Periferico',
      ubicacion: 'Periferico Poniente km 12',
      colonia: 'Vado del Rio',
      coordenadas: { lat: 29.0500, lon: -111.0000 },
      estado: 'dañado',
      costo_instalacion: 450000,
      fecha_instalacion: '2023-01-15',
      ultimo_mantenimiento: '2024-12-05',
    },
    {
      id: 'LUM-001',
      tipo: 'luminaria',
      nombre: 'Poste de alumbrado - Luis Encinas',
      ubicacion: 'Blvd. Luis Encinas entre Rosales y Sonora',
      colonia: 'Centro',
      coordenadas: { lat: 29.0729, lon: -110.9559 },
      estado: 'operativo',
      costo_instalacion: 18000,
      fecha_instalacion: '2024-07-12',
      ultimo_mantenimiento: '2025-10-25',
    },
    {
      id: 'RED-001',
      tipo: 'reductores',
      nombre: 'Confinamiento ciclista - Solidaridad',
      ubicacion: 'Av. Solidaridad entre Blvd. Colosio y Morelos',
      colonia: 'Sahuaro',
      coordenadas: { lat: 29.0800, lon: -110.9600 },
      estado: 'operativo',
      costo_instalacion: 95000,
      fecha_instalacion: '2024-09-01',
      ultimo_mantenimiento: '2025-11-05',
    },
    {
      id: 'SEÑ-002',
      tipo: 'señal',
      nombre: 'Señal Velocidad Máxima 40 km/h',
      ubicacion: 'Calle Universidad esquina con Reforma',
      colonia: 'Bachoco',
      coordenadas: { lat: 29.0950, lon: -110.9650 },
      estado: 'dañado',
      costo_instalacion: 3500,
      fecha_instalacion: '2023-06-18',
      ultimo_mantenimiento: '2025-08-12',
    },
  ];

  const activosFiltrados = activos.filter((activo) => {
    const cumpleTipo = filtroTipo === 'todos' || activo.tipo === filtroTipo;
    const cumpleEstado = filtroEstado === 'todos' || activo.estado === filtroEstado;
    const cumpleBusqueda = 
      activo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      activo.ubicacion.toLowerCase().includes(busqueda.toLowerCase()) ||
      activo.colonia.toLowerCase().includes(busqueda.toLowerCase());
    return cumpleTipo && cumpleEstado && cumpleBusqueda;
  });

  const getTipoIcon = (tipo: string) => {
    const iconMap: Record<string, string> = {
      semaforo: '🚦',
      señal: '🛑',
      tope: '⚠️',
      barda: '🧱',
      luminaria: '💡',
      reductores: '🚧',
    };
    return iconMap[tipo] || '📍';
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'bg-primary/10 text-primary';
      case 'mantenimiento': return 'bg-accent/10 text-accent-foreground';
      case 'dañado': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'operativo': return 'default';
      case 'mantenimiento': return 'secondary';
      case 'dañado': return 'destructive';
      default: return 'outline';
    }
  };

  const totalActivos = activos.length;
  const operativos = activos.filter(a => a.estado === 'operativo').length;
  const enMantenimiento = activos.filter(a => a.estado === 'mantenimiento').length;
  const dañados = activos.filter(a => a.estado === 'dañado').length;
  const costoTotal = activos.reduce((sum, a) => sum + a.costo_instalacion, 0);

  const defaultIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const damagedIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalActivos}</div>
            <p className="text-xs text-muted-foreground">Elementos viales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Operativos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{operativos}</div>
            <p className="text-xs text-primary">{Math.round((operativos / totalActivos) * 100)}% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mantenimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">{enMantenimiento}</div>
            <p className="text-xs text-muted-foreground">En servicio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dañados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{dañados}</div>
            <p className="text-xs text-destructive">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inversión Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(costoTotal / 1000000).toFixed(2)}M</div>
            <p className="text-xs text-muted-foreground">Pesos mexicanos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, ubicación..."
                className="pl-10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de activo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="semaforo">Semáforos</SelectItem>
                <SelectItem value="señal">Señalizaciones</SelectItem>
                <SelectItem value="tope">Topes</SelectItem>
                <SelectItem value="barda">Bardas</SelectItem>
                <SelectItem value="luminaria">Luminarias</SelectItem>
                <SelectItem value="reductores">Reductores</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="operativo">Operativo</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="dañado">Dañado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mapa de Activos
                </CardTitle>
                <CardDescription>Ubicaciones geográficas de infraestructura vial</CardDescription>
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
                
                {activosFiltrados.map((activo) => (
                  <Marker
                    key={activo.id}
                    position={[activo.coordenadas.lat, activo.coordenadas.lon]}
                    icon={activo.estado === 'dañado' ? damagedIcon : defaultIcon}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[250px]">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getTipoIcon(activo.tipo)}</span>
                          <p className="font-semibold text-sm">{activo.nombre}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getEstadoBadge(activo.estado)}>
                            {activo.estado}
                          </Badge>
                          <Badge variant="outline">{activo.tipo}</Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <p><strong>ID:</strong> {activo.id}</p>
                          <p><strong>Ubicación:</strong> {activo.ubicacion}</p>
                          <p><strong>Colonia:</strong> {activo.colonia}</p>
                          <p><strong>Costo:</strong> ${activo.costo_instalacion.toLocaleString('es-MX')}</p>
                          <p><strong>Instalado:</strong> {new Date(activo.fecha_instalacion).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumen
            </CardTitle>
            <CardDescription>Distribución por tipo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {['semaforo', 'señal', 'tope', 'barda', 'luminaria', 'reductores'].map((tipo) => {
              const count = activos.filter(a => a.tipo === tipo).length;
              return (
                <div key={tipo} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTipoIcon(tipo)}</span>
                    <span className="text-sm capitalize">{tipo}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              );
            })}
            
            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Operativos</span>
                </div>
                <span className="font-semibold">{Math.round((operativos / totalActivos) * 100)}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span>Requieren atención</span>
                </div>
                <span className="font-semibold">{Math.round(((enMantenimiento + dañados) / totalActivos) * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Inventario Detallado
              </CardTitle>
              <CardDescription>
                Mostrando {activosFiltrados.length} de {totalActivos} activos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Costo</TableHead>
                <TableHead>Último Mant.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activosFiltrados.map((activo) => (
                <TableRow key={activo.id}>
                  <TableCell className="font-mono text-xs">{activo.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getTipoIcon(activo.tipo)}</span>
                      <span className="text-sm capitalize">{activo.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-sm font-medium line-clamp-1">{activo.nombre}</p>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <p className="text-sm text-muted-foreground line-clamp-2">{activo.ubicacion}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEstadoBadge(activo.estado)} className={getEstadoColor(activo.estado)}>
                      {activo.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${activo.costo_instalacion.toLocaleString('es-MX')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(activo.ultimo_mantenimiento).toLocaleDateString('es-MX', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
