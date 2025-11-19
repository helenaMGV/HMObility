import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { AlertCircle, CheckCircle, Clock, Filter, MapPin, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Reporte {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  ubicacion: {
    direccion: string;
    colonia: string;
    lat: number;
    lon: number;
  };
  estatus: 'pendiente' | 'en_revision' | 'resuelto';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  fecha_reporte: string;
  fecha_resolucion?: string;
  reportado_por: string;
  votos: number;
}

export default function CitizenReportsPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroEstatus, setFiltroEstatus] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/datajson/reportes_ciudadanos.json')
      .then((res) => res.json())
      .then((data) => {
        setReportes(data.reportes);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error cargando reportes:', error);
        setIsLoading(false);
      });
  }, []);

  const reportesFiltrados = reportes.filter((reporte) => {
    const cumpleTipo = filtroTipo === 'todos' || reporte.tipo === filtroTipo;
    const cumpleEstatus = filtroEstatus === 'todos' || reporte.estatus === filtroEstatus;
    return cumpleTipo && cumpleEstatus;
  });

  const getEstatusConfig = (estatus: string) => {
    switch (estatus) {
      case 'pendiente':
        return { label: 'Pendiente', icon: Clock, color: 'bg-muted text-muted-foreground' };
      case 'en_revision':
        return { label: 'En Revisión', icon: AlertCircle, color: 'bg-secondary/10 text-secondary-foreground' };
      case 'resuelto':
        return { label: 'Resuelto', icon: CheckCircle, color: 'bg-primary/10 text-primary' };
      default:
        return { label: estatus, icon: Clock, color: 'bg-muted text-muted-foreground' };
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'critica': return 'bg-destructive';
      case 'alta': return 'bg-accent';
      case 'media': return 'bg-secondary';
      case 'baja': return 'bg-primary';
      default: return 'bg-muted';
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      'bache': 'Bache',
      'semaforo_dañado': 'Semáforo Dañado',
      'señal_oculta': 'Señal Oculta',
      'falta_paso_peatonal': 'Falta Paso Peatonal',
      'iluminacion': 'Iluminación',
      'banqueta_dañada': 'Banqueta Dañada',
    };
    return tipos[tipo] || tipo;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Reportes Ciudadanos</h1>
          <p className="text-muted-foreground">
            Visualiza y da seguimiento a los reportes de la comunidad
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{reportes.length}</div>
              <div className="text-sm text-muted-foreground">Total Reportes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-muted-foreground">
                {reportes.filter(r => r.estatus === 'pendiente').length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-secondary-foreground">
                {reportes.filter(r => r.estatus === 'en_revision').length}
              </div>
              <div className="text-sm text-muted-foreground">En Revisión</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">
                {reportes.filter(r => r.estatus === 'resuelto').length}
              </div>
              <div className="text-sm text-muted-foreground">Resueltos</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Filters & List */}
          <div className="md:col-span-2 space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <CardTitle>Filtros</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="bache">Bache</SelectItem>
                    <SelectItem value="semaforo_dañado">Semáforo Dañado</SelectItem>
                    <SelectItem value="señal_oculta">Señal Oculta</SelectItem>
                    <SelectItem value="falta_paso_peatonal">Falta Paso Peatonal</SelectItem>
                    <SelectItem value="iluminacion">Iluminación</SelectItem>
                    <SelectItem value="banqueta_dañada">Banqueta Dañada</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroEstatus} onValueChange={setFiltroEstatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_revision">En Revisión</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="space-y-4">
              {reportesFiltrados.map((reporte) => {
                const estatusConfig = getEstatusConfig(reporte.estatus);
                const EstatusIcon = estatusConfig.icon;

                return (
                  <Card key={reporte.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${getPrioridadColor(reporte.prioridad)}`} />
                            <Badge variant="outline">{getTipoLabel(reporte.tipo)}</Badge>
                            <Badge className={estatusConfig.color}>
                              <EstatusIcon className="w-3 h-3 mr-1" />
                              {estatusConfig.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{reporte.titulo}</CardTitle>
                          <CardDescription className="mt-2">{reporte.descripcion}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{reporte.ubicacion.colonia}</span>
                          </div>
                          <div>
                            {new Date(reporte.fecha_reporte).toLocaleDateString('es-MX')}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {reporte.votos}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Mapa de Reportes</CardTitle>
                <CardDescription>
                  {reportesFiltrados.length} reporte(s) en el mapa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[29.0892, -110.9617]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap contributors'
                    />
                    {reportesFiltrados.map((reporte) => (
                      <Marker
                        key={reporte.id}
                        position={[reporte.ubicacion.lat, reporte.ubicacion.lon]}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{reporte.titulo}</h3>
                            <p className="text-sm text-gray-600">{reporte.ubicacion.direccion}</p>
                            <Badge className="mt-2" variant="outline">
                              {getTipoLabel(reporte.tipo)}
                            </Badge>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
