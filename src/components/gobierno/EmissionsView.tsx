import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
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
import { Cloud, TrendingUp, TrendingDown, AlertCircle, Leaf, Factory, Car } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface EstacionMonitoreo {
  id: string;
  nombre: string;
  ubicacion: { lat: number; lon: number };
  tipo: 'fija' | 'movil';
  mediciones: {
    co2: number; // toneladas/día
    nox: number; // kg/día
    pm25: number; // µg/m³
    pm10: number; // µg/m³
    co: number; // ppm
  };
  calidad_aire: 'buena' | 'moderada' | 'mala' | 'muy_mala';
}

export default function EmissionsView() {
  const [contaminanteSeleccionado, setContaminanteSeleccionado] = useState<string>('co2');
  const [periodoTemporal, setPeriodoTemporal] = useState<string>('mensual');

  const estaciones: EstacionMonitoreo[] = [
    {
      id: 'est_001',
      nombre: 'Centro Histórico',
      ubicacion: { lat: 29.0729, lon: -110.9559 },
      tipo: 'fija',
      mediciones: {
        co2: 45.8,
        nox: 125.4,
        pm25: 38.2,
        pm10: 52.8,
        co: 2.8,
      },
      calidad_aire: 'moderada',
    },
    {
      id: 'est_002',
      nombre: 'Blvd. Rodríguez',
      ubicacion: { lat: 29.0890, lon: -110.9550 },
      tipo: 'fija',
      mediciones: {
        co2: 67.3,
        nox: 185.9,
        pm25: 48.5,
        pm10: 68.3,
        co: 3.9,
      },
      calidad_aire: 'mala',
    },
    {
      id: 'est_003',
      nombre: 'Parque Villa de Seris',
      ubicacion: { lat: 29.0650, lon: -110.9480 },
      tipo: 'fija',
      mediciones: {
        co2: 28.4,
        nox: 72.5,
        pm25: 22.8,
        pm10: 35.2,
        co: 1.5,
      },
      calidad_aire: 'buena',
    },
    {
      id: 'est_004',
      nombre: 'ITSON (Campus Centro)',
      ubicacion: { lat: 29.0588, lon: -110.9639 },
      tipo: 'fija',
      mediciones: {
        co2: 35.2,
        nox: 92.3,
        pm25: 28.9,
        pm10: 42.5,
        co: 2.1,
      },
      calidad_aire: 'moderada',
    },
    {
      id: 'est_005',
      nombre: 'Plaza Bicentenario',
      ubicacion: { lat: 29.0805, lon: -110.9610 },
      tipo: 'movil',
      mediciones: {
        co2: 52.6,
        nox: 142.8,
        pm25: 35.4,
        pm10: 55.7,
        co: 3.2,
      },
      calidad_aire: 'moderada',
    },
  ];

  const getCalidadColor = (calidad: string): string => {
    switch (calidad) {
      case 'buena': return '#22c55e';
      case 'moderada': return '#eab308';
      case 'mala': return '#f97316';
      case 'muy_mala': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getContaminanteInfo = (tipo: string) => {
    switch (tipo) {
      case 'co2':
        return { nombre: 'CO₂', unidad: 'ton/día', limite: 50, icono: Cloud };
      case 'nox':
        return { nombre: 'NOₓ', unidad: 'kg/día', limite: 150, icono: Factory };
      case 'pm25':
        return { nombre: 'PM2.5', unidad: 'µg/m³', limite: 35, icono: AlertCircle };
      case 'pm10':
        return { nombre: 'PM10', unidad: 'µg/m³', limite: 50, icono: AlertCircle };
      case 'co':
        return { nombre: 'CO', unidad: 'ppm', limite: 3, icono: Car };
      default:
        return { nombre: 'CO₂', unidad: 'ton/día', limite: 50, icono: Cloud };
    }
  };

  const contaminanteInfo = getContaminanteInfo(contaminanteSeleccionado);
  const IconoContaminante = contaminanteInfo.icono;

  // Datos históricos mensuales
  const datosHistoricos = [
    { mes: 'Ene', co2: 1420, nox: 3850, pm25: 32.5, beneficio_verde: 280 },
    { mes: 'Feb', co2: 1385, nox: 3720, pm25: 31.2, beneficio_verde: 265 },
    { mes: 'Mar', co2: 1445, nox: 3920, pm25: 34.8, beneficio_verde: 290 },
    { mes: 'Abr', co2: 1520, nox: 4150, pm25: 38.2, beneficio_verde: 310 },
    { mes: 'May', co2: 1605, nox: 4380, pm25: 42.5, beneficio_verde: 335 },
    { mes: 'Jun', co2: 1680, nox: 4620, pm25: 45.8, beneficio_verde: 360 },
  ];

  // Distribución por fuente
  const fuentesEmision = [
    { fuente: 'Vehículos ligeros', porcentaje: 52, valor: 780, color: '#3b82f6' },
    { fuente: 'Transporte pesado', porcentaje: 28, valor: 420, color: '#f59e0b' },
    { fuente: 'Transporte público', porcentaje: 12, valor: 180, color: '#8b5cf6' },
    { fuente: 'Motocicletas', porcentaje: 8, valor: 120, color: '#06b6d4' },
  ];

  // Comparativa por zona
  const emisionesPorZona = [
    { zona: 'Centro', co2: 285, nox: 780, pm25: 36.5, trafico: 'alto' },
    { zona: 'Norte', co2: 198, nox: 540, pm25: 28.2, trafico: 'medio' },
    { zona: 'Sur', co2: 165, nox: 450, pm25: 24.8, trafico: 'medio' },
    { zona: 'Este', co2: 142, nox: 385, pm25: 21.5, trafico: 'bajo' },
    { zona: 'Oeste', co2: 125, nox: 340, pm25: 19.8, trafico: 'bajo' },
  ];

  // Calcular totales
  const totalCO2 = estaciones.reduce((sum, e) => sum + e.mediciones.co2, 0);
  const totalNOx = estaciones.reduce((sum, e) => sum + e.mediciones.nox, 0);
  const promedioPM25 = estaciones.reduce((sum, e) => sum + e.mediciones.pm25, 0) / estaciones.length;

  // Proyección de reducción con medidas
  const proyeccionReduccion = [
    { año: '2024', actual: 1680, con_medidas: 1680, meta: 1500 },
    { año: '2025', actual: 1750, con_medidas: 1580, meta: 1400 },
    { año: '2026', actual: 1820, con_medidas: 1450, meta: 1300 },
    { año: '2027', actual: 1890, con_medidas: 1320, meta: 1200 },
    { año: '2028', actual: 1960, con_medidas: 1180, meta: 1100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                Monitoreo de Emisiones y Calidad del Aire
              </CardTitle>
              <CardDescription>Análisis de contaminantes vehiculares en tiempo real</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={contaminanteSeleccionado} onValueChange={setContaminanteSeleccionado}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Contaminante" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co2">CO₂ (Dióxido de Carbono)</SelectItem>
                  <SelectItem value="nox">NOₓ (Óxidos de Nitrógeno)</SelectItem>
                  <SelectItem value="pm25">PM2.5 (Partículas)</SelectItem>
                  <SelectItem value="pm10">PM10 (Partículas)</SelectItem>
                  <SelectItem value="co">CO (Monóxido de Carbono)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>CO₂ Total Diario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCO2.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">toneladas/día</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-destructive" />
              <span className="text-xs text-destructive">+8.2% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>NOₓ Total Diario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalNOx.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">kg/día</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-destructive" />
              <span className="text-xs text-destructive">+6.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>PM2.5 Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{promedioPM25.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">µg/m³</p>
            <Badge variant={promedioPM25 > 35 ? 'destructive' : 'default'} className="mt-2">
              {promedioPM25 > 35 ? 'Por encima del límite' : 'Dentro de norma'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Calidad del Aire</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Moderada</div>
            <p className="text-xs text-muted-foreground">Calificación general</p>
            <div className="flex items-center gap-1 mt-2">
              <Badge variant="outline" style={{ backgroundColor: '#eab308', color: 'white' }}>
                ICA: 65
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa y Estaciones */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estaciones de Monitoreo</CardTitle>
            <CardDescription>
              Distribución espacial de {contaminanteInfo.nombre} - Límite: {contaminanteInfo.limite} {contaminanteInfo.unidad}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[29.0729, -110.9559]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {estaciones.map(estacion => {
                  const valor = estacion.mediciones[contaminanteSeleccionado as keyof typeof estacion.mediciones];
                  const excedeLimite = valor > contaminanteInfo.limite;
                  
                  return (
                    <div key={estacion.id}>
                      <Circle
                        center={[estacion.ubicacion.lat, estacion.ubicacion.lon]}
                        radius={valor * 8}
                        pathOptions={{
                          color: getCalidadColor(estacion.calidad_aire),
                          fillColor: getCalidadColor(estacion.calidad_aire),
                          fillOpacity: 0.4,
                          weight: 2,
                        }}
                      />
                      <Marker
                        position={[estacion.ubicacion.lat, estacion.ubicacion.lon]}
                        icon={new Icon({
                          iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${excedeLimite ? 'red' : 'green'}.png`,
                          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                        })}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold mb-2">{estacion.nombre}</h3>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between gap-4">
                                <span>CO₂:</span>
                                <span className="font-semibold">{estacion.mediciones.co2} ton/día</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>NOₓ:</span>
                                <span className="font-semibold">{estacion.mediciones.nox} kg/día</span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span>PM2.5:</span>
                                <span className="font-semibold">{estacion.mediciones.pm25} µg/m³</span>
                              </div>
                              <Badge
                                variant="outline"
                                style={{ backgroundColor: getCalidadColor(estacion.calidad_aire), color: 'white' }}
                                className="mt-2"
                              >
                                {estacion.calidad_aire.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </div>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribución por Fuente</CardTitle>
              <CardDescription>Contribución al total de emisiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fuentesEmision}
                      dataKey="porcentaje"
                      nameKey="fuente"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      label={(entry) => `${entry.porcentaje}%`}
                    >
                      {fuentesEmision.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {fuentesEmision.map(fuente => (
                  <div key={fuente.fuente} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: fuente.color }} />
                      <span>{fuente.fuente}</span>
                    </div>
                    <span className="font-semibold">{fuente.valor} ton</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Aumentar áreas verdes</p>
                    <p className="text-xs text-muted-foreground">-15% CO₂ estimado</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Car className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Promover transporte eléctrico</p>
                    <p className="text-xs text-muted-foreground">-40% emisiones locales</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Optimizar flujos vehiculares</p>
                    <p className="text-xs text-muted-foreground">-12% tiempo en ralentí</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráficas de Tendencias */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Histórica de Emisiones</CardTitle>
            <CardDescription>Evolución de CO₂ y NOₓ en los últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={datosHistoricos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis yAxisId="left" label={{ value: 'CO₂ (ton)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'NOₓ (kg)', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="co2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="CO₂" />
                  <Area yAxisId="right" type="monotone" dataKey="nox" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} name="NOₓ" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emisiones por Zona</CardTitle>
            <CardDescription>CO₂ diario por sector de la ciudad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emisionesPorZona} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'Toneladas CO₂/día', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="zona" type="category" />
                  <Tooltip />
                  <Bar dataKey="co2" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proyección de Reducción */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Proyección de Reducción de Emisiones
          </CardTitle>
          <CardDescription>Escenario con medidas de movilidad sostenible vs tendencia actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={proyeccionReduccion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="año" />
                <YAxis label={{ value: 'Toneladas CO₂/día', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="actual" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} name="Tendencia Actual" strokeDasharray="5 5" />
                <Area type="monotone" dataKey="con_medidas" stroke="#22c55e" fill="#22c55e" fillOpacity={0.4} name="Con Medidas" />
                <Area type="monotone" dataKey="meta" stroke="#3b82f6" fill="none" strokeWidth={2} strokeDasharray="3 3" name="Meta" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Reducción Proyectada (2028)</p>
                <p className="text-2xl font-bold text-primary">-40%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ahorro Anual Estimado</p>
                <p className="text-2xl font-bold text-primary">780 ton CO₂</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equivalente a</p>
                <p className="text-2xl font-bold text-primary">165 autos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
