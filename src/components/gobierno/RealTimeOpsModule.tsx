import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertCircle,
  Clock,
  MapPin,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  Phone,
  Users,
  Activity
} from 'lucide-react';

interface Incidente {
  id: string;
  tipo: 'accidente' | 'congestion' | 'obra' | 'evento' | 'clima';
  titulo: string;
  descripcion: string;
  ubicacion: {
    direccion: string;
    coordenadas: { lat: number; lon: number };
  };
  gravedad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'activo' | 'en_atencion' | 'resuelto';
  hora_reporte: string;
  servicios_despachados: string[];
  afectacion_trafico: number; // 1-5
  checklist: {
    id: string;
    tarea: string;
    completada: boolean;
    responsable: string;
  }[];
}

export default function RealTimeOpsModule() {
  const [incidentes, setIncidentes] = useState<Incidente[]>([
    {
      id: 'INC-001',
      tipo: 'accidente',
      titulo: 'Colisión múltiple Blvd. Colosio',
      descripcion: 'Choque de 3 vehículos con 2 heridos. Carril izquierdo bloqueado',
      ubicacion: {
        direccion: 'Blvd. Luis Donaldo Colosio km 8.5',
        coordenadas: { lat: 29.0890, lon: -110.9550 },
      },
      gravedad: 'alta',
      estado: 'en_atencion',
      hora_reporte: '2025-11-18T08:45:00',
      servicios_despachados: ['Cruz Roja', 'Tránsito Municipal', 'Bomberos'],
      afectacion_trafico: 4,
      checklist: [
        { id: 'CH-001', tarea: 'Asegurar la escena', completada: true, responsable: 'Tránsito' },
        { id: 'CH-002', tarea: 'Atender heridos', completada: true, responsable: 'Cruz Roja' },
        { id: 'CH-003', tarea: 'Desviar tráfico', completada: true, responsable: 'Tránsito' },
        { id: 'CH-004', tarea: 'Limpiar vía', completada: false, responsable: 'Obras Públicas' },
        { id: 'CH-005', tarea: 'Elaborar reporte', completada: false, responsable: 'Tránsito' },
      ],
    },
    {
      id: 'INC-002',
      tipo: 'congestion',
      titulo: 'Tráfico intenso en Centro',
      descripcion: 'Congestión vehicular por hora pico y semáforo temporizado',
      ubicacion: {
        direccion: 'Blvd. Luis Encinas y Reforma',
        coordenadas: { lat: 29.0729, lon: -110.9559 },
      },
      gravedad: 'media',
      estado: 'activo',
      hora_reporte: '2025-11-18T09:15:00',
      servicios_despachados: ['Tránsito Municipal'],
      afectacion_trafico: 3,
      checklist: [
        { id: 'CH-006', tarea: 'Evaluar situación', completada: true, responsable: 'Tránsito' },
        { id: 'CH-007', tarea: 'Ajustar semáforos', completada: false, responsable: 'Control Centro' },
        { id: 'CH-008', tarea: 'Desplegar agentes', completada: false, responsable: 'Tránsito' },
      ],
    },
    {
      id: 'INC-003',
      tipo: 'obra',
      titulo: 'Mantenimiento vial Av. Solidaridad',
      descripcion: 'Bacheo programado, carril derecho cerrado',
      ubicacion: {
        direccion: 'Av. Solidaridad entre Morelos y Colosio',
        coordenadas: { lat: 29.0800, lon: -110.9600 },
      },
      gravedad: 'baja',
      estado: 'activo',
      hora_reporte: '2025-11-18T07:00:00',
      servicios_despachados: ['Obras Públicas'],
      afectacion_trafico: 2,
      checklist: [
        { id: 'CH-009', tarea: 'Señalización colocada', completada: true, responsable: 'Obras Públicas' },
        { id: 'CH-010', tarea: 'Desvío establecido', completada: true, responsable: 'Tránsito' },
        { id: 'CH-011', tarea: 'Completar bacheo', completada: false, responsable: 'Obras Públicas' },
      ],
    },
  ]);

  const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<string | null>('INC-001');

  const toggleChecklistItem = (incidenteId: string, checklistId: string) => {
    setIncidentes(incidentes.map(inc => {
      if (inc.id === incidenteId) {
        return {
          ...inc,
          checklist: inc.checklist.map(item => 
            item.id === checklistId ? { ...item, completada: !item.completada } : item
          ),
        };
      }
      return inc;
    }));
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'accidente': return AlertCircle;
      case 'congestion': return Activity;
      case 'obra': return MapPin;
      case 'evento': return Users;
      case 'clima': return AlertTriangle;
      default: return Radio;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'accidente': return 'bg-destructive/10 text-destructive';
      case 'congestion': return 'bg-accent/10 text-accent-foreground';
      case 'obra': return 'bg-secondary/10 text-secondary-foreground';
      case 'evento': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getGravedadColor = (gravedad: string) => {
    switch (gravedad) {
      case 'critica': return 'destructive';
      case 'alta': return 'destructive';
      case 'media': return 'secondary';
      case 'baja': return 'outline';
      default: return 'outline';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo': return { variant: 'destructive' as const, label: 'Activo' };
      case 'en_atencion': return { variant: 'secondary' as const, label: 'En Atención' };
      case 'resuelto': return { variant: 'default' as const, label: 'Resuelto' };
      default: return { variant: 'outline' as const, label: estado };
    }
  };

  const incidenteActual = incidentes.find(i => i.id === incidenteSeleccionado);

  const incidentesActivos = incidentes.filter(i => i.estado !== 'resuelto').length;
  const serviciosEnRuta = new Set(incidentes.flatMap(i => i.servicios_despachados)).size;
  const tiempoPromedioRespuesta = '8'; // minutos (mock)

  const accidentIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const obraIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Incidentes Activos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{incidentesActivos}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Servicios en Ruta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{serviciosEnRuta}</div>
            <p className="text-xs text-muted-foreground">Unidades despachadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo de Respuesta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tiempoPromedioRespuesta} min</div>
            <p className="text-xs text-primary">-15% vs promedio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Afectación de Tráfico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Moderada</div>
            <p className="text-xs text-muted-foreground">3 zonas impactadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Centro de Comando - Mapa en Vivo
            </CardTitle>
            <CardDescription>Incidentes activos y servicios de emergencia</CardDescription>
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
                
                {incidentes.map((incidente) => (
                  <Marker
                    key={incidente.id}
                    position={[incidente.ubicacion.coordenadas.lat, incidente.ubicacion.coordenadas.lon]}
                    icon={incidente.tipo === 'accidente' ? accidentIcon : obraIcon}
                    eventHandlers={{
                      click: () => setIncidenteSeleccionado(incidente.id),
                    }}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[250px]">
                        <p className="font-semibold text-sm">{incidente.titulo}</p>
                        <Badge variant={getGravedadColor(incidente.gravedad)}>
                          {incidente.gravedad}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{incidente.descripcion}</p>
                        <div className="text-xs">
                          <p><strong>Estado:</strong> {getEstadoBadge(incidente.estado).label}</p>
                          <p><strong>Hora:</strong> {new Date(incidente.hora_reporte).toLocaleTimeString('es-MX')}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Círculos de afectación */}
                {incidentes.filter(i => i.estado !== 'resuelto').map((incidente) => (
                  <Circle
                    key={`circle-${incidente.id}`}
                    center={[incidente.ubicacion.coordenadas.lat, incidente.ubicacion.coordenadas.lon]}
                    radius={incidente.afectacion_trafico * 200}
                    pathOptions={{
                      color: incidente.gravedad === 'alta' || incidente.gravedad === 'critica' 
                        ? 'rgb(239 68 68 / 0.6)' 
                        : 'rgb(234 179 8 / 0.6)',
                      fillColor: incidente.gravedad === 'alta' || incidente.gravedad === 'critica'
                        ? 'rgb(239 68 68 / 0.2)'
                        : 'rgb(234 179 8 / 0.2)',
                    }}
                  />
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Incident List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Incidentes Activos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidentes.filter(i => i.estado !== 'resuelto').map((incidente) => {
              const TipoIcon = getTipoIcon(incidente.tipo);
              const estadoBadge = getEstadoBadge(incidente.estado);
              const isSelected = incidenteSeleccionado === incidente.id;
              
              return (
                <button
                  key={incidente.id}
                  onClick={() => setIncidenteSeleccionado(incidente.id)}
                  className={`w-full border rounded-lg p-3 text-left transition-all ${
                    isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <TipoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-1 line-clamp-1">{incidente.titulo}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {incidente.descripcion}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={estadoBadge.variant} className="text-xs">
                      {estadoBadge.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(incidente.hora_reporte).toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Incident Detail */}
      {incidenteActual && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Detalle del Incidente: {incidenteActual.id}
                </CardTitle>
                <CardDescription>{incidenteActual.titulo}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getGravedadColor(incidenteActual.gravedad)}>
                  Gravedad: {incidenteActual.gravedad}
                </Badge>
                <Badge className={getTipoColor(incidenteActual.tipo)}>
                  {incidenteActual.tipo}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Información</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Ubicación</p>
                        <p className="text-muted-foreground">{incidenteActual.ubicacion.direccion}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Hora de reporte</p>
                        <p className="text-muted-foreground">
                          {new Date(incidenteActual.hora_reporte).toLocaleString('es-MX')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Activity className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Afectación de tráfico</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-6 rounded ${
                                i < incidenteActual.afectacion_trafico
                                  ? 'bg-destructive'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Servicios Despachados</h4>
                  <div className="flex flex-wrap gap-2">
                    {incidenteActual.servicios_despachados.map((servicio, i) => (
                      <Badge key={i} variant="outline" className="gap-1">
                        <Phone className="w-3 h-3" />
                        {servicio}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Checklist de Atención</h4>
                <div className="space-y-2">
                  {incidenteActual.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={item.completada}
                        onCheckedChange={() => toggleChecklistItem(incidenteActual.id, item.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${item.completada ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                          {item.tarea}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Responsable: {item.responsable}
                        </p>
                      </div>
                      {item.completada && (
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-semibold">
                      {incidenteActual.checklist.filter(i => i.completada).length} / {incidenteActual.checklist.length}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${(incidenteActual.checklist.filter(i => i.completada).length / incidenteActual.checklist.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
