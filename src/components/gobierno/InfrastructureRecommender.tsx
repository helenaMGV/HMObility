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
  Lightbulb,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  AlertTriangle,
  School,
  Activity,
  Zap,
} from 'lucide-react';

interface Recomendacion {
  id: string;
  tipo: 'tope' | 'paso_peatonal' | 'semaforo' | 'reduccion_velocidad' | 'rediseño';
  coordenadas: { lat: number; lon: number };
  segmento: string;
  segmento_coords: { lat: number; lon: number }[];
  score_prioridad: number; // 0-100
  razonamiento: {
    accidentes_historicos: number;
    velocidad_promedio: number;
    proximidad_puntos_sensibles: string[];
    densidad_peatonal: 'alta' | 'media' | 'baja';
    volumen_trafico: number;
  };
  costo_estimado: number;
  tiempo_implementacion: string;
  impacto_esperado: string;
  beneficios: string[];
}

export default function InfrastructureRecommender() {
  const [tipoFiltro, setTipoFiltro] = useState<string>('todos');
  const [recomendacionSeleccionada, setRecomendacionSeleccionada] = useState<string>('REC-001');

  const recomendaciones: Recomendacion[] = [
    {
      id: 'REC-001',
      tipo: 'tope',
      coordenadas: { lat: 29.0729, lon: -110.9559 },
      segmento: 'Blvd. Rosales (Centro)',
      segmento_coords: [
        { lat: 29.0720, lon: -110.9570 },
        { lat: 29.0738, lon: -110.9548 },
      ],
      score_prioridad: 92,
      razonamiento: {
        accidentes_historicos: 12,
        velocidad_promedio: 65,
        proximidad_puntos_sensibles: ['Escuela Primaria (150m)', 'Hospital Regional (280m)'],
        densidad_peatonal: 'alta',
        volumen_trafico: 8500,
      },
      costo_estimado: 45000,
      tiempo_implementacion: '2-3 semanas',
      impacto_esperado: 'Reducción estimada del 40% en accidentes y 35% en velocidad promedio',
      beneficios: [
        'Mayor seguridad para estudiantes',
        'Reducción de velocidad vehicular',
        'Menor riesgo de atropellos',
        'Cumplimiento de normativa Vision Zero',
      ],
    },
    {
      id: 'REC-002',
      tipo: 'paso_peatonal',
      coordenadas: { lat: 29.0890, lon: -110.9550 },
      segmento: 'Blvd. Colosio km 8.5',
      segmento_coords: [
        { lat: 29.0880, lon: -110.9560 },
        { lat: 29.0900, lon: -110.9540 },
      ],
      score_prioridad: 88,
      razonamiento: {
        accidentes_historicos: 8,
        velocidad_promedio: 70,
        proximidad_puntos_sensibles: ['Centro Comercial (200m)', 'Parada de camión (50m)'],
        densidad_peatonal: 'alta',
        volumen_trafico: 12000,
      },
      costo_estimado: 65000,
      tiempo_implementacion: '3-4 semanas',
      impacto_esperado: 'Reducción de 50% en incidentes peatonales y mejor conectividad',
      beneficios: [
        'Paso peatonal elevado con señalización LED',
        'Conectividad para usuarios de transporte público',
        'Reducción de tiempo de cruce',
        'Mayor visibilidad nocturna',
      ],
    },
    {
      id: 'REC-003',
      tipo: 'semaforo',
      coordenadas: { lat: 29.0800, lon: -110.9600 },
      segmento: 'Av. Solidaridad y Morelos',
      segmento_coords: [
        { lat: 29.0790, lon: -110.9610 },
        { lat: 29.0810, lon: -110.9590 },
      ],
      score_prioridad: 85,
      razonamiento: {
        accidentes_historicos: 15,
        velocidad_promedio: 55,
        proximidad_puntos_sensibles: ['Mercado Municipal (100m)', 'Clínica (180m)'],
        densidad_peatonal: 'alta',
        volumen_trafico: 9500,
      },
      costo_estimado: 180000,
      tiempo_implementacion: '6-8 semanas',
      impacto_esperado: 'Reducción del 60% en colisiones en intersección y mejor flujo peatonal',
      beneficios: [
        'Control inteligente con sensores',
        'Fase peatonal dedicada',
        'Reducción de conflictos vehiculares',
        'Monitoreo en tiempo real',
      ],
    },
    {
      id: 'REC-004',
      tipo: 'reduccion_velocidad',
      coordenadas: { lat: 29.0650, lon: -110.9800 },
      segmento: 'Zona Escolar San Benito',
      segmento_coords: [
        { lat: 29.0640, lon: -110.9815 },
        { lat: 29.0660, lon: -110.9785 },
      ],
      score_prioridad: 90,
      razonamiento: {
        accidentes_historicos: 6,
        velocidad_promedio: 60,
        proximidad_puntos_sensibles: ['Escuela Secundaria (50m)', 'Jardín de Niños (120m)'],
        densidad_peatonal: 'alta',
        volumen_trafico: 6500,
      },
      costo_estimado: 95000,
      tiempo_implementacion: '4-5 semanas',
      impacto_esperado: 'Zona escolar segura con velocidad reducida a 20 km/h',
      beneficios: [
        'Señalización vertical y horizontal',
        'Radar de velocidad con display',
        'Protección en horarios escolares',
        'Campaña educativa integrada',
      ],
    },
    {
      id: 'REC-005',
      tipo: 'rediseño',
      coordenadas: { lat: 29.0950, lon: -111.0200 },
      segmento: 'Acceso UNISON',
      segmento_coords: [
        { lat: 29.0940, lon: -111.0220 },
        { lat: 29.0960, lon: -111.0180 },
      ],
      score_prioridad: 78,
      razonamiento: {
        accidentes_historicos: 10,
        velocidad_promedio: 58,
        proximidad_puntos_sensibles: ['Universidad (0m)', 'Biblioteca (150m)'],
        densidad_peatonal: 'alta',
        volumen_trafico: 11000,
      },
      costo_estimado: 350000,
      tiempo_implementacion: '8-12 semanas',
      impacto_esperado: 'Rediseño completo con ciclovía, banquetas amplias y cruces seguros',
      beneficios: [
        'Infraestructura para ciclistas',
        'Banquetas accesibles',
        'Iluminación mejorada',
        'Espacios verdes integrados',
      ],
    },
    {
      id: 'REC-006',
      tipo: 'paso_peatonal',
      coordenadas: { lat: 29.0700, lon: -110.9700 },
      segmento: 'Blvd. Encinas (Zona Comercial)',
      segmento_coords: [
        { lat: 29.0690, lon: -110.9710 },
        { lat: 29.0710, lon: -110.9690 },
      ],
      score_prioridad: 82,
      razonamiento: {
        accidentes_historicos: 7,
        velocidad_promedio: 62,
        proximidad_puntos_sensibles: ['Centro Comercial (80m)', 'Oficinas (150m)'],
        densidad_peatonal: 'media',
        volumen_trafico: 10500,
      },
      costo_estimado: 55000,
      tiempo_implementacion: '3 semanas',
      impacto_esperado: 'Mayor seguridad para peatones en zona de alto comercio',
      beneficios: [
        'Paso elevado con señalización',
        'Iluminación LED',
        'Botón de activación',
        'Conectividad comercial',
      ],
    },
  ];

  const recomendacionesFiltradas = tipoFiltro === 'todos'
    ? recomendaciones
    : recomendaciones.filter(r => r.tipo === tipoFiltro);

  const recomendacionActual = recomendaciones.find(r => r.id === recomendacionSeleccionada) || recomendaciones[0];

  const promedioPrioridad = Math.round(
    recomendaciones.reduce((acc, r) => acc + r.score_prioridad, 0) / recomendaciones.length
  );
  const costoTotal = recomendaciones.reduce((acc, r) => acc + r.costo_estimado, 0);
  const altaPrioridad = recomendaciones.filter(r => r.score_prioridad >= 85).length;

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'tope': return 'Tope/Reductor';
      case 'paso_peatonal': return 'Paso Peatonal';
      case 'semaforo': return 'Semáforo';
      case 'reduccion_velocidad': return 'Zona 30';
      case 'rediseño': return 'Rediseño Vial';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'tope': return 'bg-destructive/10 text-destructive';
      case 'paso_peatonal': return 'bg-primary/10 text-primary';
      case 'semaforo': return 'bg-accent/10 text-accent-foreground';
      case 'reduccion_velocidad': return 'bg-secondary/10 text-secondary-foreground';
      case 'rediseño': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPrioridadColor = (score: number) => {
    if (score >= 90) return 'bg-destructive text-destructive-foreground';
    if (score >= 80) return 'bg-accent text-accent-foreground';
    if (score >= 70) return 'bg-secondary text-secondary-foreground';
    return 'bg-muted text-muted-foreground';
  };

  const getSegmentColor = (score: number) => {
    if (score >= 90) return '#ef4444'; // red
    if (score >= 80) return '#f97316'; // orange
    if (score >= 70) return '#eab308'; // yellow
    return '#84cc16'; // green
  };

  const getMarkerIcon = (tipo: string, score: number) => {
    let color = 'blue';
    if (score >= 90) color = 'red';
    else if (score >= 80) color = 'orange';
    else if (score >= 70) color = 'yellow';

    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recomendaciones Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recomendaciones.length}</div>
            <p className="text-xs text-muted-foreground">Identificadas por IA</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alta Prioridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{altaPrioridad}</div>
            <p className="text-xs text-muted-foreground">Score ≥ 85</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Score Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{promedioPrioridad}</div>
            <p className="text-xs text-primary">Prioridad general</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Inversión Estimada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${(costoTotal / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Para todas las obras</p>
          </CardContent>
        </Card>
      </div>

      {/* Mapa */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Mapa de Recomendaciones
              </CardTitle>
              <CardDescription>Segmentos prioritarios para intervención</CardDescription>
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de intervención" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="tope">Topes/Reductores</SelectItem>
                <SelectItem value="paso_peatonal">Pasos Peatonales</SelectItem>
                <SelectItem value="semaforo">Semáforos</SelectItem>
                <SelectItem value="reduccion_velocidad">Zonas 30</SelectItem>
                <SelectItem value="rediseño">Rediseños</SelectItem>
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

              {/* Segmentos */}
              {recomendacionesFiltradas.map((rec) => (
                <div key={rec.id}>
                  <Polyline
                    positions={rec.segmento_coords.map(c => [c.lat, c.lon])}
                    color={getSegmentColor(rec.score_prioridad)}
                    weight={6}
                    opacity={0.8}
                  />
                  <Marker
                    position={[rec.coordenadas.lat, rec.coordenadas.lon]}
                    icon={getMarkerIcon(rec.tipo, rec.score_prioridad)}
                    eventHandlers={{
                      click: () => setRecomendacionSeleccionada(rec.id),
                    }}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[280px]">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className={getTipoColor(rec.tipo)}>
                            {getTipoLabel(rec.tipo)}
                          </Badge>
                          <Badge className={getPrioridadColor(rec.score_prioridad)}>
                            Score: {rec.score_prioridad}
                          </Badge>
                        </div>
                        <p className="font-semibold text-sm">{rec.segmento}</p>
                        <div className="text-xs space-y-1">
                          <p><strong>Accidentes:</strong> {rec.razonamiento.accidentes_historicos} históricos</p>
                          <p><strong>Velocidad:</strong> {rec.razonamiento.velocidad_promedio} km/h promedio</p>
                          <p><strong>Costo:</strong> ${(rec.costo_estimado / 1000).toFixed(0)}K</p>
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
              <div className="w-4 h-1 rounded bg-red-500" />
              <span>Crítica (90+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-orange-500" />
              <span>Alta (80-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-yellow-500" />
              <span>Media (70-79)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-green-500" />
              <span>Baja (&lt;70)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de Recomendación */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {recomendacionActual.segmento}
              </CardTitle>
              <CardDescription>{recomendacionActual.id}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getTipoColor(recomendacionActual.tipo)}>
                {getTipoLabel(recomendacionActual.tipo)}
              </Badge>
              <Badge className={getPrioridadColor(recomendacionActual.score_prioridad)}>
                Prioridad: {recomendacionActual.score_prioridad}/100
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Razonamiento IA */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Análisis de Datos
                </h4>
                <div className="space-y-3 border rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Accidentes Históricos</p>
                      <p className="text-sm text-muted-foreground">
                        {recomendacionActual.razonamiento.accidentes_historicos} incidentes en últimos 12 meses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 mt-0.5 text-accent-foreground" />
                    <div>
                      <p className="text-sm font-medium">Velocidad Promedio</p>
                      <p className="text-sm text-muted-foreground">
                        {recomendacionActual.razonamiento.velocidad_promedio} km/h (excede límite)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <School className="w-4 h-4 mt-0.5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Puntos Sensibles</p>
                      <ul className="text-sm text-muted-foreground">
                        {recomendacionActual.razonamiento.proximidad_puntos_sensibles.map((punto, i) => (
                          <li key={i}>• {punto}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-secondary-foreground" />
                    <div>
                      <p className="text-sm font-medium">Densidad Peatonal</p>
                      <p className="text-sm text-muted-foreground">
                        {recomendacionActual.razonamiento.densidad_peatonal.toUpperCase()} - 
                        {recomendacionActual.razonamiento.volumen_trafico.toLocaleString()} vehículos/día
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Costos y Tiempos
                </h4>
                <div className="space-y-2 border rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inversión estimada:</span>
                    <span className="text-sm font-semibold">
                      ${(recomendacionActual.costo_estimado / 1000).toFixed(0)}K MXN
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Tiempo implementación:</span>
                    <span className="text-sm font-semibold">{recomendacionActual.tiempo_implementacion}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Impacto y Beneficios */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Impacto Esperado
                </h4>
                <div className="border rounded-lg p-4 bg-primary/5">
                  <p className="text-sm">{recomendacionActual.impacto_esperado}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Beneficios Clave
                </h4>
                <ul className="space-y-2">
                  {recomendacionActual.beneficios.map((beneficio, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{i + 1}</span>
                      </div>
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Recomendaciones</CardTitle>
          <CardDescription>
            Ordenadas por prioridad - Mostrando {recomendacionesFiltradas.length} de {recomendaciones.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {recomendacionesFiltradas
              .sort((a, b) => b.score_prioridad - a.score_prioridad)
              .map((rec) => (
                <button
                  key={rec.id}
                  onClick={() => setRecomendacionSeleccionada(rec.id)}
                  className={`border rounded-lg p-4 text-left transition-all hover:bg-muted/50 ${
                    recomendacionSeleccionada === rec.id ? 'bg-primary/10 border-primary' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rec.segmento}</h4>
                        <Badge className={getTipoColor(rec.tipo)} variant="outline">
                          {getTipoLabel(rec.tipo)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>🚗 {rec.razonamiento.volumen_trafico.toLocaleString()} veh/día</span>
                        <span>⚠️ {rec.razonamiento.accidentes_historicos} accidentes</span>
                        <span>💰 ${(rec.costo_estimado / 1000).toFixed(0)}K</span>
                        <span>⏱️ {rec.tiempo_implementacion}</span>
                      </div>
                    </div>
                    <Badge className={getPrioridadColor(rec.score_prioridad)}>
                      {rec.score_prioridad}
                    </Badge>
                  </div>
                </button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
