import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Circle } from 'react-leaflet';
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
  LayoutGrid,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Zap,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface Escenario {
  id: string;
  nombre: string;
  descripcion: string;
  parametros: {
    velocidad_maxima?: number; // km/h
    topes?: number;
    semaforos?: number;
    cambio_sentido?: boolean;
    ciclovias?: number; // km
    carriles_reducidos?: number;
  };
  resultados: {
    accidentes_proyectados: number;
    tiempo_promedio_viaje: number; // minutos
    velocidad_promedio: number; // km/h
    congestion_nivel: number; // 0-10
    satisfaccion_ciudadana: number; // 0-10
    costo_implementacion: number; // MXN
  };
}

export default function DigitalTwin() {
  const [escenarioActual, setEscenarioActual] = useState<string>('actual');
  const [escenarioComparacion, setEscenarioComparacion] = useState<string>('reducir_velocidad');
  const [vistaComparativa, setVistaComparativa] = useState(false);

  const escenarios: Escenario[] = [
    {
      id: 'actual',
      nombre: 'Estado Actual',
      descripcion: 'Situación actual de la red vial sin modificaciones',
      parametros: {
        velocidad_maxima: 60,
        topes: 12,
        semaforos: 45,
        cambio_sentido: false,
        ciclovias: 5.2,
        carriles_reducidos: 0,
      },
      resultados: {
        accidentes_proyectados: 847,
        tiempo_promedio_viaje: 22,
        velocidad_promedio: 45,
        congestion_nivel: 6,
        satisfaccion_ciudadana: 5.5,
        costo_implementacion: 0,
      },
    },
    {
      id: 'reducir_velocidad',
      nombre: 'Reducción de Velocidad',
      descripcion: 'Límite a 40 km/h en zonas de alto riesgo',
      parametros: {
        velocidad_maxima: 40,
        topes: 12,
        semaforos: 45,
        cambio_sentido: false,
        ciclovias: 5.2,
        carriles_reducidos: 0,
      },
      resultados: {
        accidentes_proyectados: 610,
        tiempo_promedio_viaje: 24,
        velocidad_promedio: 38,
        congestion_nivel: 6.5,
        satisfaccion_ciudadana: 6.2,
        costo_implementacion: 280000,
      },
    },
    {
      id: 'topes_adicionales',
      nombre: 'Topes Adicionales',
      descripcion: 'Instalar 8 topes más en zonas escolares y residenciales',
      parametros: {
        velocidad_maxima: 60,
        topes: 20,
        semaforos: 45,
        cambio_sentido: false,
        ciclovias: 5.2,
        carriles_reducidos: 0,
      },
      resultados: {
        accidentes_proyectados: 670,
        tiempo_promedio_viaje: 23,
        velocidad_promedio: 42,
        congestion_nivel: 6.2,
        satisfaccion_ciudadana: 6.8,
        costo_implementacion: 360000,
      },
    },
    {
      id: 'semaforos_inteligentes',
      nombre: 'Semáforos Inteligentes',
      descripcion: 'Actualizar 15 intersecciones con semáforos adaptativos',
      parametros: {
        velocidad_maxima: 60,
        topes: 12,
        semaforos: 60,
        cambio_sentido: false,
        ciclovias: 5.2,
        carriles_reducidos: 0,
      },
      resultados: {
        accidentes_proyectados: 720,
        tiempo_promedio_viaje: 19,
        velocidad_promedio: 48,
        congestion_nivel: 4.5,
        satisfaccion_ciudadana: 7.5,
        costo_implementacion: 2700000,
      },
    },
    {
      id: 'ciclovias_expansion',
      nombre: 'Expansión de Ciclovías',
      descripcion: 'Agregar 8 km de ciclovías protegidas',
      parametros: {
        velocidad_maxima: 60,
        topes: 12,
        semaforos: 45,
        cambio_sentido: false,
        ciclovias: 13.2,
        carriles_reducidos: 2,
      },
      resultados: {
        accidentes_proyectados: 780,
        tiempo_promedio_viaje: 24,
        velocidad_promedio: 43,
        congestion_nivel: 6.8,
        satisfaccion_ciudadana: 7.8,
        costo_implementacion: 6400000,
      },
    },
    {
      id: 'vision_zero',
      nombre: 'Paquete Vision Zero',
      descripcion: 'Combinación: velocidad reducida + topes + semáforos inteligentes',
      parametros: {
        velocidad_maxima: 40,
        topes: 20,
        semaforos: 60,
        cambio_sentido: false,
        ciclovias: 13.2,
        carriles_reducidos: 2,
      },
      resultados: {
        accidentes_proyectados: 380,
        tiempo_promedio_viaje: 23,
        velocidad_promedio: 38,
        congestion_nivel: 5.8,
        satisfaccion_ciudadana: 8.5,
        costo_implementacion: 9740000,
      },
    },
  ];

  const escenarioA = escenarios.find(e => e.id === escenarioActual) || escenarios[0];
  const escenarioB = escenarios.find(e => e.id === escenarioComparacion) || escenarios[1];

  const calcularCambio = (actual: number, nuevo: number): { porcentaje: number; positivo: boolean } => {
    const cambio = ((nuevo - actual) / actual) * 100;
    return {
      porcentaje: Math.abs(cambio),
      positivo: nuevo < actual, // Para accidentes, menos es mejor
    };
  };

  const cambioAccidentes = calcularCambio(escenarioA.resultados.accidentes_proyectados, escenarioB.resultados.accidentes_proyectados);
  const cambioTiempo = calcularCambio(escenarioA.resultados.tiempo_promedio_viaje, escenarioB.resultados.tiempo_promedio_viaje);

  // Datos para radar chart
  const dataRadar = [
    {
      metric: 'Seguridad',
      actual: Math.max(0, 10 - (escenarioA.resultados.accidentes_proyectados / 100)),
      nuevo: Math.max(0, 10 - (escenarioB.resultados.accidentes_proyectados / 100)),
    },
    {
      metric: 'Fluidez',
      actual: 10 - escenarioA.resultados.congestion_nivel,
      nuevo: 10 - escenarioB.resultados.congestion_nivel,
    },
    {
      metric: 'Satisfacción',
      actual: escenarioA.resultados.satisfaccion_ciudadana,
      nuevo: escenarioB.resultados.satisfaccion_ciudadana,
    },
    {
      metric: 'Velocidad',
      actual: escenarioA.resultados.velocidad_promedio / 10,
      nuevo: escenarioB.resultados.velocidad_promedio / 10,
    },
    {
      metric: 'Eficiencia',
      actual: Math.max(0, 10 - (escenarioA.resultados.tiempo_promedio_viaje / 3)),
      nuevo: Math.max(0, 10 - (escenarioB.resultados.tiempo_promedio_viaje / 3)),
    },
  ];

  // Datos comparativos
  const dataComparativa = [
    {
      metrica: 'Accidentes/año',
      actual: escenarioA.resultados.accidentes_proyectados,
      nuevo: escenarioB.resultados.accidentes_proyectados,
    },
    {
      metrica: 'Tiempo Viaje (min)',
      actual: escenarioA.resultados.tiempo_promedio_viaje,
      nuevo: escenarioB.resultados.tiempo_promedio_viaje,
    },
    {
      metrica: 'Velocidad (km/h)',
      actual: escenarioA.resultados.velocidad_promedio,
      nuevo: escenarioB.resultados.velocidad_promedio,
    },
    {
      metrica: 'Congestión (0-10)',
      actual: escenarioA.resultados.congestion_nivel,
      nuevo: escenarioB.resultados.congestion_nivel,
    },
  ];

  const segmentoEjemplo = [
    { lat: 29.0720, lon: -110.9570 },
    { lat: 29.0890, lon: -110.9550 },
  ];

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LayoutGrid className="w-5 h-5" />
                Gemelo Digital de Movilidad
              </CardTitle>
              <CardDescription>Simulación de escenarios y análisis de impacto</CardDescription>
            </div>
            <Button
              variant={vistaComparativa ? 'default' : 'outline'}
              onClick={() => setVistaComparativa(!vistaComparativa)}
            >
              {vistaComparativa ? 'Vista Simple' : 'Vista Comparativa'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {vistaComparativa ? 'Escenario A (Actual)' : 'Escenario a Simular'}
              </label>
              <Select value={escenarioActual} onValueChange={setEscenarioActual}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar escenario" />
                </SelectTrigger>
                <SelectContent>
                  {escenarios.map(e => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {vistaComparativa && (
              <div>
                <label className="text-sm font-medium mb-2 block">Escenario B (Comparación)</label>
                <Select value={escenarioComparacion} onValueChange={setEscenarioComparacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar escenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {escenarios.filter(e => e.id !== escenarioActual).map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* KPIs Comparativos */}
      {vistaComparativa && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Reducción de Accidentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${cambioAccidentes.positivo ? 'text-primary' : 'text-destructive'}`}>
                {cambioAccidentes.positivo ? '-' : '+'}{cambioAccidentes.porcentaje.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {escenarioB.resultados.accidentes_proyectados} vs {escenarioA.resultados.accidentes_proyectados}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Impacto en Tiempo de Viaje</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${!cambioTiempo.positivo ? 'text-primary' : 'text-secondary'}`}>
                {cambioTiempo.positivo ? '-' : '+'}{cambioTiempo.porcentaje.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {escenarioB.resultados.tiempo_promedio_viaje} vs {escenarioA.resultados.tiempo_promedio_viaje} min
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Satisfacción Ciudadana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{escenarioB.resultados.satisfaccion_ciudadana}/10</div>
              <p className="text-xs text-primary">
                +{(escenarioB.resultados.satisfaccion_ciudadana - escenarioA.resultados.satisfaccion_ciudadana).toFixed(1)} puntos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Costo de Implementación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${(escenarioB.resultados.costo_implementacion / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">Inversión estimada</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mapas */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {vistaComparativa ? 'Escenario A: ' : 'Simulación: '}
              {escenarioA.nombre}
            </CardTitle>
            <CardDescription>{escenarioA.descripcion}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[29.0729, -110.9559]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Polyline
                  positions={segmentoEjemplo.map(c => [c.lat, c.lon])}
                  color="#2563eb"
                  weight={4}
                  opacity={0.8}
                />
                <Circle
                  center={[29.0805, -110.9560]}
                  radius={300}
                  pathOptions={{
                    color: escenarioA.resultados.accidentes_proyectados > 700 ? '#ef4444' : '#22c55e',
                    fillColor: escenarioA.resultados.accidentes_proyectados > 700 ? '#ef4444' : '#22c55e',
                    fillOpacity: 0.2,
                  }}
                />
              </MapContainer>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Accidentes proyectados:</span>
                <span className="font-semibold">{escenarioA.resultados.accidentes_proyectados}/año</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Velocidad promedio:</span>
                <span className="font-semibold">{escenarioA.resultados.velocidad_promedio} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tiempo de viaje:</span>
                <span className="font-semibold">{escenarioA.resultados.tiempo_promedio_viaje} min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {vistaComparativa && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Escenario B: {escenarioB.nombre}
              </CardTitle>
              <CardDescription>{escenarioB.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <MapContainer
                  center={[29.0729, -110.9559]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Polyline
                    positions={segmentoEjemplo.map(c => [c.lat, c.lon])}
                    color="#10b981"
                    weight={4}
                    opacity={0.8}
                  />
                  <Circle
                    center={[29.0805, -110.9560]}
                    radius={300}
                    pathOptions={{
                      color: escenarioB.resultados.accidentes_proyectados > 700 ? '#ef4444' : '#22c55e',
                      fillColor: escenarioB.resultados.accidentes_proyectados > 700 ? '#ef4444' : '#22c55e',
                      fillOpacity: 0.2,
                    }}
                  />
                </MapContainer>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accidentes proyectados:</span>
                  <span className="font-semibold text-primary">{escenarioB.resultados.accidentes_proyectados}/año</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Velocidad promedio:</span>
                  <span className="font-semibold">{escenarioB.resultados.velocidad_promedio} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tiempo de viaje:</span>
                  <span className="font-semibold">{escenarioB.resultados.tiempo_promedio_viaje} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Gráficas Comparativas */}
      {vistaComparativa && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Comparativa de Métricas
              </CardTitle>
              <CardDescription>Impacto en indicadores clave</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataComparativa}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metrica" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="hsl(var(--muted))" name="Escenario A" />
                    <Bar dataKey="nuevo" fill="hsl(var(--primary))" name="Escenario B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Análisis Multidimensional
              </CardTitle>
              <CardDescription>Impacto global del escenario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={dataRadar}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} />
                    <Radar name="Actual" dataKey="actual" stroke="hsl(var(--muted))" fill="hsl(var(--muted))" fillOpacity={0.3} />
                    <Radar name="Nuevo" dataKey="nuevo" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.5} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Parámetros del Escenario */}
      <Card>
        <CardHeader>
          <CardTitle>Parámetros de Configuración</CardTitle>
          <CardDescription>
            {vistaComparativa ? `Comparando: ${escenarioB.nombre}` : escenarioA.nombre}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Infraestructura</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Velocidad Máxima</span>
                    <span className="font-semibold">{escenarioB.parametros.velocidad_maxima} km/h</span>
                  </div>
                  <Slider
                    value={[escenarioB.parametros.velocidad_maxima || 60]}
                    max={80}
                    min={20}
                    step={10}
                    disabled
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Topes Instalados</span>
                    <span className="font-semibold">{escenarioB.parametros.topes}</span>
                  </div>
                  <Slider
                    value={[escenarioB.parametros.topes || 0]}
                    max={30}
                    step={1}
                    disabled
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Semáforos</span>
                    <span className="font-semibold">{escenarioB.parametros.semaforos}</span>
                  </div>
                  <Slider
                    value={[escenarioB.parametros.semaforos || 0]}
                    max={100}
                    step={5}
                    disabled
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Ciclovías (km)</span>
                    <span className="font-semibold">{escenarioB.parametros.ciclovias}</span>
                  </div>
                  <Slider
                    value={[escenarioB.parametros.ciclovias || 0]}
                    max={20}
                    step={0.5}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Resultados Esperados</h4>
              <div className="space-y-3 border rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 text-destructive" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Seguridad Vial</p>
                    <p className="text-sm text-muted-foreground">
                      {escenarioB.resultados.accidentes_proyectados} accidentes/año proyectados
                    </p>
                  </div>
                  {vistaComparativa && cambioAccidentes.positivo && (
                    <Badge variant="default">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      -{cambioAccidentes.porcentaje.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tiempo de Viaje</p>
                    <p className="text-sm text-muted-foreground">
                      {escenarioB.resultados.tiempo_promedio_viaje} minutos promedio
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Satisfacción</p>
                    <p className="text-sm text-muted-foreground">
                      {escenarioB.resultados.satisfaccion_ciudadana}/10 puntos
                    </p>
                  </div>
                  {vistaComparativa && (
                    <Badge variant="outline">
                      +{(escenarioB.resultados.satisfaccion_ciudadana - escenarioA.resultados.satisfaccion_ciudadana).toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Todos los Escenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Escenarios</CardTitle>
          <CardDescription>Explora diferentes opciones de intervención</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {escenarios.slice(1).map(escenario => (
              <button
                key={escenario.id}
                onClick={() => {
                  setEscenarioActual('actual');
                  setEscenarioComparacion(escenario.id);
                  setVistaComparativa(true);
                }}
                className="border rounded-lg p-4 text-left hover:bg-muted/50 transition-all"
              >
                <h4 className="font-semibold mb-2">{escenario.nombre}</h4>
                <p className="text-sm text-muted-foreground mb-3">{escenario.descripcion}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Reducción accidentes:</span>
                    <span className="font-semibold text-primary">
                      {Math.round(((847 - escenario.resultados.accidentes_proyectados) / 847) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo:</span>
                    <span className="font-semibold">
                      ${(escenario.resultados.costo_implementacion / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
