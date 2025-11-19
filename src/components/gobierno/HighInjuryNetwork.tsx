import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, TrendingUp, Users, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Accidente {
  id_evento: string;
  tipo_accidente: string;
  fecha_accidente: string;
  ubicacion: {
    direccion_completa: string;
    colonia: string;
    coordenadas: {
      lat: number;
      lon: number;
    };
  };
  numero_heridos: number;
  numero_defunciones: number;
  clasificacion_evento: {
    nivel_gravedad: 'leve' | 'moderado' | 'grave' | 'crítico';
    riesgo_publico: 'bajo' | 'medio' | 'alto' | 'crítico';
  };
}

interface Corredor {
  nombre: string;
  accidentes: number;
  heridos: number;
  defunciones: number;
  nivel_riesgo: 'alto' | 'crítico';
}

export default function HighInjuryNetwork() {
  const [accidentes, setAccidentes] = useState<Accidente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [data1, data2] = await Promise.all([
          fetch('/datajson/HMO_20251110_001.json').then(res => res.json()),
          fetch('/datajson/HMO_20251110_002.json').then(res => res.json()),
        ]);
        setAccidentes([data1, data2]);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const corredoresPeligrosos: Corredor[] = [
    { nombre: 'Blvd. Luis Encinas - Centro', accidentes: 47, heridos: 23, defunciones: 3, nivel_riesgo: 'crítico' },
    { nombre: 'Blvd. Colosio - Villa de Seris', accidentes: 38, heridos: 19, defunciones: 2, nivel_riesgo: 'crítico' },
    { nombre: 'Av. Solidaridad - Sahuaro', accidentes: 34, heridos: 18, defunciones: 1, nivel_riesgo: 'alto' },
    { nombre: 'Blvd. Morelos - San Benito', accidentes: 29, heridos: 14, defunciones: 2, nivel_riesgo: 'alto' },
    { nombre: 'Periferico Poniente - Vado', accidentes: 26, heridos: 12, defunciones: 1, nivel_riesgo: 'alto' },
    { nombre: 'Av. De la Cultura - Pitic', accidentes: 23, heridos: 11, defunciones: 1, nivel_riesgo: 'alto' },
    { nombre: 'Blvd. Rodríguez - Villa del Sol', accidentes: 21, heridos: 10, defunciones: 0, nivel_riesgo: 'alto' },
    { nombre: 'Av. Universidad - Bachoco', accidentes: 19, heridos: 9, defunciones: 1, nivel_riesgo: 'alto' },
  ];

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'crítico': return 'bg-destructive text-destructive-foreground';
      case 'grave': return 'bg-destructive/80 text-destructive-foreground';
      case 'moderado': return 'bg-accent text-accent-foreground';
      case 'leve': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRiesgoColor = (riesgo: string) => {
    switch (riesgo) {
      case 'crítico': return 'destructive';
      case 'alto': return 'destructive';
      case 'medio': return 'secondary';
      case 'bajo': return 'outline';
      default: return 'outline';
    }
  };

  const accidentIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const totalAccidentes = accidentes.length;
  const totalHeridos = accidentes.reduce((sum, a) => sum + a.numero_heridos, 0);
  const totalDefunciones = accidentes.reduce((sum, a) => sum + a.numero_defunciones, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando datos de accidentes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Accidentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAccidentes}</div>
            <p className="text-xs text-muted-foreground">Últimos 30 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Heridos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">{totalHeridos}</div>
            <p className="text-xs text-muted-foreground">Personas afectadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Defunciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{totalDefunciones}</div>
            <p className="text-xs text-muted-foreground">Víctimas fatales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Zonas Críticas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Corredores de alto riesgo</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Mapa de Accidentes
                </CardTitle>
                <CardDescription>Ubicaciones con incidentes graves</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Exportar Datos
              </Button>
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
                
                {/* Accident Markers */}
                {accidentes.map((accidente) => (
                  <Marker
                    key={accidente.id_evento}
                    position={[accidente.ubicacion.coordenadas.lat, accidente.ubicacion.coordenadas.lon]}
                    icon={accidentIcon}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[250px]">
                        <div>
                          <p className="font-semibold text-sm">{accidente.tipo_accidente.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">{accidente.ubicacion.colonia}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getGravedadColor(accidente.clasificacion_evento.nivel_gravedad)}>
                            {accidente.clasificacion_evento.nivel_gravedad}
                          </Badge>
                        </div>
                        <div className="text-xs space-y-1">
                          <p>Heridos: <span className="font-semibold">{accidente.numero_heridos}</span></p>
                          <p>Defunciones: <span className="font-semibold">{accidente.numero_defunciones}</span></p>
                          <p>Fecha: {new Date(accidente.fecha_accidente).toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Risk Zone Circles - Corredores Críticos */}
                <Circle
                  center={[29.0890, -110.9550]}
                  radius={800}
                  pathOptions={{ color: 'rgb(239 68 68 / 0.4)', fillColor: 'rgb(239 68 68 / 0.2)' }}
                />
                <Circle
                  center={[29.0600, -110.9800]}
                  radius={800}
                  pathOptions={{ color: 'rgb(239 68 68 / 0.4)', fillColor: 'rgb(239 68 68 / 0.2)' }}
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accidentes Recientes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Accidentes Recientes
            </CardTitle>
            <CardDescription>Últimos incidentes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accidentes.map((accidente) => (
                <div
                  key={accidente.id_evento}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-medium text-sm line-clamp-2">
                      {accidente.tipo_accidente.replace(/_/g, ' ')}
                    </p>
                    <Badge variant={getRiesgoColor(accidente.clasificacion_evento.riesgo_publico)} className="text-xs">
                      {accidente.clasificacion_evento.riesgo_publico}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {accidente.ubicacion.direccion_completa}
                  </p>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {accidente.numero_heridos} heridos
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(accidente.fecha_accidente).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Corredores Peligrosos Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Corredores de Alto Riesgo
              </CardTitle>
              <CardDescription>Top 8 zonas con mayor incidencia de accidentes graves</CardDescription>
            </div>
            <Badge variant="destructive" className="text-sm">
              Prioridad Alta
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Corredor</TableHead>
                <TableHead className="text-center">Accidentes</TableHead>
                <TableHead className="text-center">Heridos</TableHead>
                <TableHead className="text-center">Defunciones</TableHead>
                <TableHead className="text-right">Nivel Riesgo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corredoresPeligrosos.map((corredor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {corredor.nombre}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">{corredor.accidentes}</TableCell>
                  <TableCell className="text-center">{corredor.heridos}</TableCell>
                  <TableCell className="text-center">{corredor.defunciones}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={corredor.nivel_riesgo === 'crítico' ? 'destructive' : 'destructive'}>
                      {corredor.nivel_riesgo}
                    </Badge>
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
