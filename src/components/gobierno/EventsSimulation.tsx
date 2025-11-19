import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, Circle, Popup } from 'react-leaflet';
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
import { Slider } from '@/components/ui/slider';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Music,
  Trophy,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

interface Evento {
  id: string;
  nombre: string;
  tipo: 'concierto' | 'maraton' | 'desfile' | 'festival' | 'protesta';
  ubicacion: { lat: number; lon: number };
  area_impacto: { lat: number; lon: number }[];
  asistentes_esperados: number;
  duracion_horas: number;
  fecha: string;
  simulacion: {
    congestion_maxima: number; // 0-10
    tiempo_viaje_incremento: number; // %
    estacionamientos_ocupados: number; // %
    transporte_publico_demanda: number; // %
    calles_cerradas: number;
    personal_seguridad_requerido: number;
    ambulancias_sugeridas: number;
  };
  rutas_alternativas: { lat: number; lon: number }[][];
  medidas_mitigacion: string[];
}

export default function EventsSimulation() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('evento_001');
  const [asistentesSimulados, setAsistentesSimulados] = useState<number[]>([15000]);
  const [mostrarRutasAlternativas, setMostrarRutasAlternativas] = useState(true);

  const eventos: Evento[] = [
    {
      id: 'evento_001',
      nombre: 'Concierto Plaza Bicentenario',
      tipo: 'concierto',
      ubicacion: { lat: 29.0805, lon: -110.9610 },
      area_impacto: [
        { lat: 29.0825, lon: -110.9640 },
        { lat: 29.0825, lon: -110.9580 },
        { lat: 29.0785, lon: -110.9580 },
        { lat: 29.0785, lon: -110.9640 },
      ],
      asistentes_esperados: 15000,
      duracion_horas: 5,
      fecha: '2024-12-15',
      simulacion: {
        congestion_maxima: 8.5,
        tiempo_viaje_incremento: 45,
        estacionamientos_ocupados: 95,
        transporte_publico_demanda: 180,
        calles_cerradas: 6,
        personal_seguridad_requerido: 85,
        ambulancias_sugeridas: 4,
      },
      rutas_alternativas: [
        [
          { lat: 29.0850, lon: -110.9650 },
          { lat: 29.0870, lon: -110.9680 },
          { lat: 29.0820, lon: -110.9700 },
        ],
        [
          { lat: 29.0780, lon: -110.9650 },
          { lat: 29.0750, lon: -110.9600 },
          { lat: 29.0780, lon: -110.9550 },
        ],
      ],
      medidas_mitigacion: [
        'Cerrar 6 calles perimetrales 2 horas antes del evento',
        'Habilitar 4 estacionamientos satélite con shuttles',
        'Aumentar frecuencia de transporte público en 80%',
        'Instalar 12 puntos de control de acceso',
        'Desplegar 85 elementos de seguridad',
        'Posicionar 4 ambulancias en puntos estratégicos',
      ],
    },
    {
      id: 'evento_002',
      nombre: 'Maratón Ciudad Obregón',
      tipo: 'maraton',
      ubicacion: { lat: 29.0729, lon: -110.9559 },
      area_impacto: [
        { lat: 29.0950, lon: -110.9700 },
        { lat: 29.0950, lon: -110.9400 },
        { lat: 29.0500, lon: -110.9400 },
        { lat: 29.0500, lon: -110.9700 },
      ],
      asistentes_esperados: 8000,
      duracion_horas: 6,
      fecha: '2024-11-20',
      simulacion: {
        congestion_maxima: 9.2,
        tiempo_viaje_incremento: 65,
        estacionamientos_ocupados: 70,
        transporte_publico_demanda: 140,
        calles_cerradas: 18,
        personal_seguridad_requerido: 120,
        ambulancias_sugeridas: 8,
      },
      rutas_alternativas: [
        [
          { lat: 29.0950, lon: -110.9750 },
          { lat: 29.0700, lon: -110.9750 },
          { lat: 29.0500, lon: -110.9750 },
        ],
        [
          { lat: 29.0950, lon: -110.9350 },
          { lat: 29.0700, lon: -110.9350 },
          { lat: 29.0500, lon: -110.9350 },
        ],
      ],
      medidas_mitigacion: [
        'Cerrar ruta completa de 6:00 AM a 12:00 PM',
        'Habilitar 8 puntos de hidratación',
        'Desplegar 120 elementos de seguridad en ruta',
        'Posicionar 8 ambulancias cada 2 km',
        'Señalizar 4 rutas alternativas principales',
        'Coordinar con transporte público para rutas alternas',
      ],
    },
    {
      id: 'evento_003',
      nombre: 'Festival Gastronómico Centro',
      tipo: 'festival',
      ubicacion: { lat: 29.0729, lon: -110.9559 },
      area_impacto: [
        { lat: 29.0750, lon: -110.9590 },
        { lat: 29.0750, lon: -110.9530 },
        { lat: 29.0710, lon: -110.9530 },
        { lat: 29.0710, lon: -110.9590 },
      ],
      asistentes_esperados: 25000,
      duracion_horas: 48,
      fecha: '2024-12-01',
      simulacion: {
        congestion_maxima: 7.8,
        tiempo_viaje_incremento: 38,
        estacionamientos_ocupados: 88,
        transporte_publico_demanda: 160,
        calles_cerradas: 8,
        personal_seguridad_requerido: 95,
        ambulancias_sugeridas: 3,
      },
      rutas_alternativas: [
        [
          { lat: 29.0770, lon: -110.9600 },
          { lat: 29.0790, lon: -110.9620 },
          { lat: 29.0760, lon: -110.9640 },
        ],
      ],
      medidas_mitigacion: [
        'Cerrar 8 calles en horario 10:00 AM - 10:00 PM',
        'Habilitar 6 zonas de estacionamiento temporal',
        'Aumentar frecuencia de transporte en 60%',
        'Instalar 20 stands de información',
        'Desplegar 95 elementos de seguridad',
        'Habilitar 3 puntos de atención médica',
      ],
    },
    {
      id: 'evento_004',
      nombre: 'Desfile 5 de Febrero',
      tipo: 'desfile',
      ubicacion: { lat: 29.0750, lon: -110.9559 },
      area_impacto: [
        { lat: 29.0850, lon: -110.9580 },
        { lat: 29.0850, lon: -110.9540 },
        { lat: 29.0650, lon: -110.9540 },
        { lat: 29.0650, lon: -110.9580 },
      ],
      asistentes_esperados: 30000,
      duracion_horas: 4,
      fecha: '2025-02-05',
      simulacion: {
        congestion_maxima: 9.5,
        tiempo_viaje_incremento: 75,
        estacionamientos_ocupados: 92,
        transporte_publico_demanda: 200,
        calles_cerradas: 12,
        personal_seguridad_requerido: 150,
        ambulancias_sugeridas: 6,
      },
      rutas_alternativas: [
        [
          { lat: 29.0850, lon: -110.9620 },
          { lat: 29.0700, lon: -110.9620 },
          { lat: 29.0650, lon: -110.9620 },
        ],
        [
          { lat: 29.0850, lon: -110.9500 },
          { lat: 29.0700, lon: -110.9500 },
          { lat: 29.0650, lon: -110.9500 },
        ],
      ],
      medidas_mitigacion: [
        'Cerrar ruta de desfile de 8:00 AM a 2:00 PM',
        'Habilitar 10 zonas de observación segura',
        'Desplegar 150 elementos de seguridad',
        'Posicionar 6 ambulancias en puntos clave',
        'Coordinar 8 rutas de desvío vehicular',
        'Aumentar vigilancia en cruces principales',
      ],
    },
  ];

  const evento = eventos.find(e => e.id === eventoSeleccionado) || eventos[0];

  // Ajustar simulación según número de asistentes
  const factorAsistentes = asistentesSimulados[0] / evento.asistentes_esperados;
  const simulacionAjustada = {
    ...evento.simulacion,
    congestion_maxima: Math.min(10, evento.simulacion.congestion_maxima * factorAsistentes),
    tiempo_viaje_incremento: evento.simulacion.tiempo_viaje_incremento * factorAsistentes,
    estacionamientos_ocupados: Math.min(100, evento.simulacion.estacionamientos_ocupados * factorAsistentes),
    transporte_publico_demanda: evento.simulacion.transporte_publico_demanda * factorAsistentes,
    personal_seguridad_requerido: Math.ceil(evento.simulacion.personal_seguridad_requerido * factorAsistentes),
    ambulancias_sugeridas: Math.ceil(evento.simulacion.ambulancias_sugeridas * factorAsistentes),
  };

  // Datos de flujo vehicular hora por hora
  const flujoPorHora = [
    { hora: '6:00', sin_evento: 45, con_evento: 45, capacidad: 100 },
    { hora: '7:00', sin_evento: 65, con_evento: 70, capacidad: 100 },
    { hora: '8:00', sin_evento: 85, con_evento: 92, capacidad: 100 },
    { hora: '9:00', sin_evento: 75, con_evento: 95, capacidad: 100 },
    { hora: '10:00', sin_evento: 60, con_evento: 88, capacidad: 100 },
    { hora: '11:00', sin_evento: 55, con_evento: 85, capacidad: 100 },
    { hora: '12:00', sin_evento: 50, con_evento: 80, capacidad: 100 },
  ];

  // Distribución de llegadas
  const distribucionLlegadas = [
    { momento: '2h antes', porcentaje: 15, cantidad: Math.round(asistentesSimulados[0] * 0.15) },
    { momento: '1h antes', porcentaje: 35, cantidad: Math.round(asistentesSimulados[0] * 0.35) },
    { momento: 'Inicio', porcentaje: 30, cantidad: Math.round(asistentesSimulados[0] * 0.30) },
    { momento: '1h después', porcentaje: 15, cantidad: Math.round(asistentesSimulados[0] * 0.15) },
    { momento: '2h después', porcentaje: 5, cantidad: Math.round(asistentesSimulados[0] * 0.05) },
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'concierto': return Music;
      case 'maraton': return Trophy;
      case 'festival': return Users;
      case 'desfile': return Calendar;
      default: return Calendar;
    }
  };

  const TipoIcon = getTipoIcon(evento.tipo);

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Simulación de Eventos Masivos
              </CardTitle>
              <CardDescription>Modelado de impacto en movilidad y planificación logística</CardDescription>
            </div>
            <Button
              variant={mostrarRutasAlternativas ? 'default' : 'outline'}
              onClick={() => setMostrarRutasAlternativas(!mostrarRutasAlternativas)}
            >
              {mostrarRutasAlternativas ? 'Ocultar Rutas' : 'Mostrar Rutas'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Evento a Simular</label>
              <Select value={eventoSeleccionado} onValueChange={setEventoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar evento" />
                </SelectTrigger>
                <SelectContent>
                  {eventos.map(e => (
                    <SelectItem key={e.id} value={e.id}>
                      <div className="flex items-center gap-2">
                        {e.nombre} - {e.asistentes_esperados.toLocaleString()} asistentes
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Asistentes Esperados: {asistentesSimulados[0].toLocaleString()}
              </label>
              <Slider
                value={asistentesSimulados}
                onValueChange={setAsistentesSimulados}
                max={50000}
                min={1000}
                step={1000}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs de Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nivel de Congestión</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">
              {simulacionAjustada.congestion_maxima.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground">Pico máximo esperado</p>
            <Badge variant="destructive" className="mt-2">
              {simulacionAjustada.congestion_maxima >= 8 ? 'Crítico' : 'Alto'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Incremento Tiempo de Viaje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+{simulacionAjustada.tiempo_viaje_incremento.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">vs condiciones normales</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span className="text-xs text-muted-foreground">Duración: {evento.duracion_horas}h</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Calles Cerradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{evento.simulacion.calles_cerradas}</div>
            <p className="text-xs text-muted-foreground">vías afectadas</p>
            <Badge variant="outline" className="mt-2">
              {evento.simulacion.calles_cerradas > 10 ? 'Impacto Mayor' : 'Impacto Moderado'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recursos Requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{simulacionAjustada.personal_seguridad_requerido}</div>
            <p className="text-xs text-muted-foreground">elementos de seguridad</p>
            <p className="text-xs text-primary mt-2">{simulacionAjustada.ambulancias_sugeridas} ambulancias</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de Simulación */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TipoIcon className="w-5 h-5" />
              {evento.nombre}
            </CardTitle>
            <CardDescription>
              {evento.fecha} • {evento.duracion_horas} horas • {asistentesSimulados[0].toLocaleString()} asistentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[evento.ubicacion.lat, evento.ubicacion.lon]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Área de impacto */}
                <Polygon
                  positions={evento.area_impacto.map(c => [c.lat, c.lon])}
                  pathOptions={{
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.2,
                    weight: 2,
                  }}
                />
                {/* Ubicación del evento */}
                <Circle
                  center={[evento.ubicacion.lat, evento.ubicacion.lon]}
                  radius={200}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.4,
                    weight: 3,
                  }}
                />
                <Marker
                  position={[evento.ubicacion.lat, evento.ubicacion.lon]}
                  icon={new Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold mb-2">{evento.nombre}</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Tipo:</strong> {evento.tipo}</p>
                        <p><strong>Asistentes:</strong> {asistentesSimulados[0].toLocaleString()}</p>
                        <p><strong>Duración:</strong> {evento.duracion_horas}h</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
                {/* Rutas alternativas */}
                {mostrarRutasAlternativas && evento.rutas_alternativas.map((ruta, idx) => (
                  <Polyline
                    key={`ruta-${idx}`}
                    positions={ruta.map(c => [c.lat, c.lon])}
                    pathOptions={{
                      color: '#22c55e',
                      weight: 4,
                      opacity: 0.7,
                      dashArray: '10, 10',
                    }}
                  />
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución de Llegadas</CardTitle>
              <CardDescription>Flujo de asistentes esperado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribucionLlegadas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="momento" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Pico máximo: {Math.max(...distribucionLlegadas.map(d => d.cantidad)).toLocaleString()} personas
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Impacto en Servicios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Estacionamientos</span>
                    <span className="font-semibold">{simulacionAjustada.estacionamientos_ocupados.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-destructive"
                      style={{ width: `${simulacionAjustada.estacionamientos_ocupados}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Demanda Transporte Público</span>
                    <span className="font-semibold">+{simulacionAjustada.transporte_publico_demanda.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, simulacionAjustada.transporte_publico_demanda)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráfica de Flujo Vehicular */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativa de Flujo Vehicular</CardTitle>
          <CardDescription>Ocupación de vías principales durante el evento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flujoPorHora}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis label={{ value: '% Capacidad', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="sin_evento" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} name="Sin Evento" />
                <Area type="monotone" dataKey="con_evento" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} name="Con Evento" />
                <Line type="monotone" dataKey="capacidad" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" name="Capacidad Máxima" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Medidas de Mitigación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Plan de Mitigación
          </CardTitle>
          <CardDescription>Medidas recomendadas para minimizar el impacto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-3">Acciones Operativas</h4>
              <ul className="space-y-2">
                {evento.medidas_mitigacion.map((medida, idx) => (
                  <li key={idx} className="flex gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{medida}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Recursos Necesarios</h4>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Personal de Seguridad</span>
                    <Badge>{simulacionAjustada.personal_seguridad_requerido}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    1 elemento cada {Math.round(asistentesSimulados[0] / simulacionAjustada.personal_seguridad_requerido)} asistentes
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Ambulancias</span>
                    <Badge variant="outline">{simulacionAjustada.ambulancias_sugeridas}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cobertura médica según normativa
                  </p>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Rutas Alternativas</span>
                    <Badge variant="secondary">{evento.rutas_alternativas.length}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desvíos señalizados activos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
