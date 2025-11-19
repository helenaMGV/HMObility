import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Circle, Popup } from 'react-leaflet';
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
import { MapPin, Clock, TrendingUp, Users, Bus, Bike, Footprints } from 'lucide-react';
import {
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

interface Isocrona {
  tiempo_minutos: number;
  modo: string;
  area_km2: number;
  poblacion_alcanzada: number;
  poligono: { lat: number; lon: number }[];
  color: string;
}

interface PuntoInteres {
  id: string;
  nombre: string;
  tipo: 'hospital' | 'escuela' | 'parque' | 'comercio' | 'oficina';
  ubicacion: { lat: number; lon: number };
  accesibilidad: {
    caminando_10min: number; // población alcanzada
    bicicleta_10min: number;
    transporte_publico_10min: number;
    auto_10min: number;
  };
}

export default function IsochronesView() {
  const [modoTransporte, setModoTransporte] = useState<string>('caminando');
  const [tiempoMaximo, setTiempoMaximo] = useState<number[]>([15]);
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<string>('poi_001');

  const puntosInteres: PuntoInteres[] = [
    {
      id: 'poi_001',
      nombre: 'Hospital General',
      tipo: 'hospital',
      ubicacion: { lat: 29.0729, lon: -110.9559 },
      accesibilidad: {
        caminando_10min: 8500,
        bicicleta_10min: 24000,
        transporte_publico_10min: 18000,
        auto_10min: 45000,
      },
    },
    {
      id: 'poi_002',
      nombre: 'ITSON Campus Centro',
      tipo: 'escuela',
      ubicacion: { lat: 29.0588, lon: -110.9639 },
      accesibilidad: {
        caminando_10min: 6200,
        bicicleta_10min: 19500,
        transporte_publico_10min: 15200,
        auto_10min: 38000,
      },
    },
    {
      id: 'poi_003',
      nombre: 'Parque Villa de Seris',
      tipo: 'parque',
      ubicacion: { lat: 29.0650, lon: -110.9480 },
      accesibilidad: {
        caminando_10min: 9800,
        bicicleta_10min: 28500,
        transporte_publico_10min: 21000,
        auto_10min: 52000,
      },
    },
    {
      id: 'poi_004',
      nombre: 'Plaza Bicentenario',
      tipo: 'comercio',
      ubicacion: { lat: 29.0805, lon: -110.9610 },
      accesibilidad: {
        caminando_10min: 11200,
        bicicleta_10min: 31000,
        transporte_publico_10min: 24500,
        auto_10min: 58000,
      },
    },
    {
      id: 'poi_005',
      nombre: 'Oficinas Municipales',
      tipo: 'oficina',
      ubicacion: { lat: 29.0750, lon: -110.9559 },
      accesibilidad: {
        caminando_10min: 10500,
        bicicleta_10min: 29000,
        transporte_publico_10min: 22800,
        auto_10min: 55000,
      },
    },
  ];

  const punto = puntosInteres.find(p => p.id === puntoSeleccionado) || puntosInteres[0];

  // Generar isócronas simuladas para diferentes tiempos
  const generarIsocronas = (centro: { lat: number; lon: number }, modo: string): Isocrona[] => {
    const factores = {
      caminando: { velocidad: 5, color_base: '#3b82f6' },
      bicicleta: { velocidad: 15, color_base: '#22c55e' },
      transporte_publico: { velocidad: 25, color_base: '#8b5cf6' },
      auto: { velocidad: 40, color_base: '#f59e0b' },
    };

    const factor = factores[modo as keyof typeof factores] || factores.caminando;
    const tiempos = [5, 10, 15, 20];

    return tiempos.map((tiempo, idx) => {
      // Radio aproximado en grados (simplificado)
      const radioKm = (factor.velocidad * tiempo) / 60;
      const radioDeg = radioKm / 111; // aproximación

      // Generar polígono octagonal
      const puntos = [];
      for (let i = 0; i < 8; i++) {
        const angulo = (Math.PI * 2 * i) / 8;
        puntos.push({
          lat: centro.lat + radioDeg * Math.cos(angulo) * 0.8, // factor de ajuste
          lon: centro.lon + radioDeg * Math.sin(angulo) * 0.8,
        });
      }

      const opacidad = ['#60', '#50', '#40', '#30'][idx];
      
      return {
        tiempo_minutos: tiempo,
        modo,
        area_km2: Math.PI * radioKm * radioKm,
        poblacion_alcanzada: Math.round(5000 * (idx + 1) * 1.5),
        poligono: puntos,
        color: factor.color_base + opacidad,
      };
    });
  };

  const isocronas = generarIsocronas(punto.ubicacion, modoTransporte);
  const isocrona_actual = isocronas.find(i => i.tiempo_minutos === tiempoMaximo[0]) || isocronas[2];

  // Datos comparativos de accesibilidad
  const datosComparativosModo = [
    {
      modo: 'Caminando',
      poblacion: punto.accesibilidad.caminando_10min,
      icon: Footprints,
      color: '#3b82f6',
    },
    {
      modo: 'Bicicleta',
      poblacion: punto.accesibilidad.bicicleta_10min,
      icon: Bike,
      color: '#22c55e',
    },
    {
      modo: 'Transporte',
      poblacion: punto.accesibilidad.transporte_publico_10min,
      icon: Bus,
      color: '#8b5cf6',
    },
    {
      modo: 'Auto',
      poblacion: punto.accesibilidad.auto_10min,
      icon: MapPin,
      color: '#f59e0b',
    },
  ];

  // Distribución de accesibilidad por zona
  const accesibilidadPorZona = [
    { zona: 'Centro', accesibilidad: 95, poblacion: 28000 },
    { zona: 'Norte', accesibilidad: 78, poblacion: 22000 },
    { zona: 'Sur', accesibilidad: 72, poblacion: 19000 },
    { zona: 'Este', accesibilidad: 65, poblacion: 15000 },
    { zona: 'Oeste', accesibilidad: 68, poblacion: 16000 },
  ];

  // Métricas de equidad
  const metricasEquidad = [
    { categoria: 'Excelente (0-5 min)', porcentaje: 25, poblacion: 15000, color: '#22c55e' },
    { categoria: 'Buena (5-10 min)', porcentaje: 35, poblacion: 21000, color: '#3b82f6' },
    { categoria: 'Aceptable (10-15 min)', porcentaje: 25, poblacion: 15000, color: '#eab308' },
    { categoria: 'Limitada (>15 min)', porcentaje: 15, poblacion: 9000, color: '#ef4444' },
  ];

  const getTipoColor = (tipo: string): string => {
    switch (tipo) {
      case 'hospital': return '#ef4444';
      case 'escuela': return '#3b82f6';
      case 'parque': return '#22c55e';
      case 'comercio': return '#f59e0b';
      case 'oficina': return '#8b5cf6';
      default: return '#94a3b8';
    }
  };

  const getTipoLabel = (tipo: string): string => {
    const labels: Record<string, string> = {
      hospital: 'Hospital',
      escuela: 'Educación',
      parque: 'Espacio Verde',
      comercio: 'Comercio',
      oficina: 'Servicios',
    };
    return labels[tipo] || tipo;
  };

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Análisis de Isócronas y Accesibilidad
              </CardTitle>
              <CardDescription>Mapas de tiempo de viaje y análisis de equidad espacial</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Punto de Interés</label>
              <Select value={puntoSeleccionado} onValueChange={setPuntoSeleccionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar punto" />
                </SelectTrigger>
                <SelectContent>
                  {puntosInteres.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nombre} ({getTipoLabel(p.tipo)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Modo de Transporte</label>
              <Select value={modoTransporte} onValueChange={setModoTransporte}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caminando">🚶 Caminando</SelectItem>
                  <SelectItem value="bicicleta">🚴 Bicicleta</SelectItem>
                  <SelectItem value="transporte_publico">🚌 Transporte Público</SelectItem>
                  <SelectItem value="auto">🚗 Automóvil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tiempo Máximo: {tiempoMaximo[0]} minutos
              </label>
              <Slider
                value={tiempoMaximo}
                onValueChange={setTiempoMaximo}
                max={20}
                min={5}
                step={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs de Accesibilidad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Población Alcanzada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isocrona_actual.poblacion_alcanzada.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">en {tiempoMaximo[0]} minutos</p>
            <div className="flex items-center gap-1 mt-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary">
                {((isocrona_actual.poblacion_alcanzada / 60000) * 100).toFixed(1)}% del total
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Área de Cobertura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{isocrona_actual.area_km2.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">km² cubiertos</p>
            <Badge variant="outline" className="mt-2">
              Modo: {modoTransporte}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Índice de Accesibilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.2/10</div>
            <p className="text-xs text-muted-foreground">para este punto</p>
            <Badge variant="default" className="mt-2">
              Buena accesibilidad
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Equidad Espacial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">población con acceso {'<'}15 min</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary">+5% vs año anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mapa de Isócronas */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mapa de Isócronas - {punto.nombre}</CardTitle>
            <CardDescription>
              Áreas alcanzables en diferentes tiempos usando {modoTransporte}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border">
              <MapContainer
                center={[punto.ubicacion.lat, punto.ubicacion.lon]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Isócronas de mayor a menor para superposición correcta */}
                {[...isocronas].reverse().map((iso, idx) => (
                  <Polygon
                    key={`iso-${idx}`}
                    positions={iso.poligono.map(c => [c.lat, c.lon])}
                    pathOptions={{
                      color: iso.color.substring(0, 7),
                      fillColor: iso.color.substring(0, 7),
                      fillOpacity: 0.3,
                      weight: 2,
                    }}
                  />
                ))}
                {/* Marcador del punto de interés */}
                <Circle
                  center={[punto.ubicacion.lat, punto.ubicacion.lon]}
                  radius={50}
                  pathOptions={{
                    color: getTipoColor(punto.tipo),
                    fillColor: getTipoColor(punto.tipo),
                    fillOpacity: 0.8,
                    weight: 3,
                  }}
                />
                <Marker
                  position={[punto.ubicacion.lat, punto.ubicacion.lon]}
                  icon={new Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                  })}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold mb-2">{punto.nombre}</h3>
                      <Badge
                        variant="outline"
                        style={{ backgroundColor: getTipoColor(punto.tipo), color: 'white' }}
                      >
                        {getTipoLabel(punto.tipo)}
                      </Badge>
                      <div className="mt-2 space-y-1 text-xs">
                        <p><strong>Accesibilidad 10 min:</strong></p>
                        <p>🚶 {punto.accesibilidad.caminando_10min.toLocaleString()} personas</p>
                        <p>🚴 {punto.accesibilidad.bicicleta_10min.toLocaleString()} personas</p>
                        <p>🚌 {punto.accesibilidad.transporte_publico_10min.toLocaleString()} personas</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {isocronas.map(iso => (
                <div
                  key={iso.tiempo_minutos}
                  className="flex items-center gap-2 text-sm p-2 border rounded"
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: iso.color.substring(0, 7) }}
                  />
                  <div>
                    <p className="font-semibold">{iso.tiempo_minutos} min</p>
                    <p className="text-xs text-muted-foreground">{iso.poblacion_alcanzada.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Comparativa por Modo</CardTitle>
              <CardDescription>Población alcanzada en 10 minutos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {datosComparativosModo.map(modo => {
                  const IconoModo = modo.icon;
                  return (
                    <div key={modo.modo} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <IconoModo className="w-4 h-4" style={{ color: modo.color }} />
                          <span>{modo.modo}</span>
                        </div>
                        <span className="font-semibold">{modo.poblacion.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${(modo.poblacion / 60000) * 100}%`,
                            backgroundColor: modo.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Todos los Puntos</CardTitle>
              <CardDescription>Análisis rápido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {puntosInteres.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPuntoSeleccionado(p.id)}
                    className={`w-full text-left p-2 rounded border transition-all ${
                      p.id === puntoSeleccionado ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{p.nombre}</p>
                        <Badge
                          variant="outline"
                          className="text-xs mt-1"
                          style={{ borderColor: getTipoColor(p.tipo), color: getTipoColor(p.tipo) }}
                        >
                          {getTipoLabel(p.tipo)}
                        </Badge>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-semibold">{p.accesibilidad.caminando_10min.toLocaleString()}</p>
                        <p className="text-muted-foreground">10 min 🚶</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gráficas de Análisis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accesibilidad por Zona</CardTitle>
            <CardDescription>Índice de accesibilidad y población servida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accesibilidadPorZona}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zona" />
                  <YAxis yAxisId="left" label={{ value: 'Índice (0-100)', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Población', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="accesibilidad" fill="#3b82f6" name="Accesibilidad" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="poblacion" fill="#22c55e" name="Población" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Equidad</CardTitle>
            <CardDescription>Población por nivel de acceso temporal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metricasEquidad}
                    dataKey="porcentaje"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.porcentaje}%`}
                  >
                    {metricasEquidad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {metricasEquidad.map(metrica => (
                <div key={metrica.categoria} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metrica.color }} />
                    <span>{metrica.categoria}</span>
                  </div>
                  <span className="font-semibold">{metrica.poblacion.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones de Mejora</CardTitle>
          <CardDescription>Acciones para aumentar la equidad espacial</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bus className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Transporte Público</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ampliar cobertura en zona Este y Oeste
              </p>
              <Badge variant="outline">Impacto: +12,000 personas</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Infraestructura Ciclista</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Conectar zonas periféricas con ciclovías
              </p>
              <Badge variant="outline">Impacto: +8,500 personas</Badge>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Footprints className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">Movilidad Peatonal</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Mejorar banquetas y cruces seguros
              </p>
              <Badge variant="outline">Impacto: +6,200 personas</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
