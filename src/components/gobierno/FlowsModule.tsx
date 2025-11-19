import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
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
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Users,
  Clock,
  Activity
} from 'lucide-react';

interface Flujo {
  origen: string;
  destino: string;
  volumen: number;
  hora_pico: string;
  modo_principal: string;
  coordenadas_origen: { lat: number; lon: number };
  coordenadas_destino: { lat: number; lon: number };
}

export default function FlowsModule() {
  const [horario, setHorario] = useState<string>('matutino');
  const [modo, setModo] = useState<string>('todos');

  const flujos: Flujo[] = [
    {
      origen: 'Villa de Seris',
      destino: 'Centro',
      volumen: 12500,
      hora_pico: '07:00-09:00',
      modo_principal: 'auto_particular',
      coordenadas_origen: { lat: 29.0890, lon: -110.9550 },
      coordenadas_destino: { lat: 29.0729, lon: -110.9559 },
    },
    {
      origen: 'San Benito',
      destino: 'Zona Industrial',
      volumen: 8300,
      hora_pico: '07:30-09:30',
      modo_principal: 'transporte_publico',
      coordenadas_origen: { lat: 29.0931, lon: -110.9714 },
      coordenadas_destino: { lat: 29.0450, lon: -111.0200 },
    },
    {
      origen: 'Pitic',
      destino: 'Centro',
      volumen: 6800,
      hora_pico: '08:00-10:00',
      modo_principal: 'auto_particular',
      coordenadas_origen: { lat: 29.0650, lon: -110.9700 },
      coordenadas_destino: { lat: 29.0729, lon: -110.9559 },
    },
    {
      origen: 'Bachoco',
      destino: 'Universidad',
      volumen: 5200,
      hora_pico: '07:00-08:30',
      modo_principal: 'transporte_publico',
      coordenadas_origen: { lat: 29.0950, lon: -110.9650 },
      coordenadas_destino: { lat: 29.0800, lon: -110.9400 },
    },
    {
      origen: 'Sahuaro',
      destino: 'Centro',
      volumen: 4900,
      hora_pico: '17:00-19:00',
      modo_principal: 'auto_particular',
      coordenadas_origen: { lat: 29.0800, lon: -110.9600 },
      coordenadas_destino: { lat: 29.0729, lon: -110.9559 },
    },
  ];

  const getModoLabel = (modo: string) => {
    const labels: Record<string, string> = {
      auto_particular: 'Auto Particular',
      transporte_publico: 'Transporte Público',
      bicicleta: 'Bicicleta',
      caminata: 'Caminata',
    };
    return labels[modo] || modo;
  };

  const getModoColor = (modo: string) => {
    switch (modo) {
      case 'auto_particular': return 'text-accent-foreground';
      case 'transporte_publico': return 'text-secondary-foreground';
      case 'bicicleta': return 'text-primary';
      case 'caminata': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getVolumenColor = (volumen: number) => {
    if (volumen > 10000) return '#ef4444'; // destructive red
    if (volumen > 7000) return '#f97316'; // orange
    if (volumen > 5000) return '#eab308'; // yellow
    return '#22c55e'; // green
  };

  const defaultIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const totalVolumen = flujos.reduce((sum, f) => sum + f.volumen, 0);
  const promedioPorFlujo = Math.round(totalVolumen / flujos.length);

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Volumen Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(totalVolumen / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Viajes/día (estimado)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Corredores Principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{flujos.length}</div>
            <p className="text-xs text-muted-foreground">Pares O-D analizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Promedio por Corredor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(promedioPorFlujo / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Viajes/día</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hora Pico Principal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">07:00-09:00</div>
            <p className="text-xs text-muted-foreground">Matutino</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Análisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Horario</label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matutino">Matutino (06:00-10:00)</SelectItem>
                  <SelectItem value="mediodia">Mediodía (11:00-14:00)</SelectItem>
                  <SelectItem value="vespertino">Vespertino (15:00-19:00)</SelectItem>
                  <SelectItem value="nocturno">Nocturno (20:00-05:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Modo de Transporte</label>
              <Select value={modo} onValueChange={setModo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los modos</SelectItem>
                  <SelectItem value="auto_particular">Auto Particular</SelectItem>
                  <SelectItem value="transporte_publico">Transporte Público</SelectItem>
                  <SelectItem value="bicicleta">Bicicleta</SelectItem>
                  <SelectItem value="caminata">Caminata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">Aplicar Filtros</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Mapa de Flujos Origen-Destino
            </CardTitle>
            <CardDescription>Principales corredores de movilidad en Hermosillo</CardDescription>
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
                
                {/* Origenes */}
                {flujos.map((flujo, index) => (
                  <Marker
                    key={`origen-${index}`}
                    position={[flujo.coordenadas_origen.lat, flujo.coordenadas_origen.lon]}
                    icon={defaultIcon}
                  >
                    <Popup>
                      <div className="space-y-2 min-w-[200px]">
                        <p className="font-semibold text-sm">Origen: {flujo.origen}</p>
                        <p className="text-xs text-muted-foreground">
                          Destino: {flujo.destino}
                        </p>
                        <div className="text-xs space-y-1">
                          <p>Volumen: <span className="font-semibold">{flujo.volumen.toLocaleString()}</span> viajes/día</p>
                          <p>Hora pico: {flujo.hora_pico}</p>
                          <p>Modo principal: {getModoLabel(flujo.modo_principal)}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Flow Lines */}
                {flujos.map((flujo, index) => (
                  <Polyline
                    key={`flow-${index}`}
                    positions={[
                      [flujo.coordenadas_origen.lat, flujo.coordenadas_origen.lon],
                      [flujo.coordenadas_destino.lat, flujo.coordenadas_destino.lon],
                    ]}
                    pathOptions={{
                      color: getVolumenColor(flujo.volumen),
                      weight: Math.max(3, Math.min(8, flujo.volumen / 2000)),
                      opacity: 0.7,
                    }}
                  />
                ))}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-destructive" />
                <span>&gt;10K viajes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-orange-500" />
                <span>7K-10K</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-yellow-500" />
                <span>5K-7K</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-green-500" />
                <span>&lt;5K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Análisis de Demanda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {flujos.map((flujo, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {flujo.volumen > 10000 ? (
                        <ArrowUpRight className="w-4 h-4 text-destructive" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-primary" />
                      )}
                      <p className="font-semibold text-sm">
                        {flujo.origen} → {flujo.destino}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {flujo.volumen.toLocaleString()} viajes/día
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {flujo.hora_pico}
                  </span>
                  <span className={`flex items-center gap-1 ${getModoColor(flujo.modo_principal)}`}>
                    <Users className="w-3 h-3" />
                    {getModoLabel(flujo.modo_principal)}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Recomendaciones</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Considerar BRT en corredores &gt;10K viajes/día</p>
                <p>• Optimizar sincronización semafórica en hora pico</p>
                <p>• Analizar infraestructura ciclista en corredores intermedios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
