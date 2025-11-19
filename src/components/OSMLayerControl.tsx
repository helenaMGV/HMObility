import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Navigation, 
  Bike, 
  Map as MapIconLucide,
  TrendingUp,
  AlertCircle 
} from 'lucide-react';
import L from 'leaflet';

interface OSMLayerControlProps {
  onStatsUpdate?: (stats: InfrastructureStats) => void;
}

interface InfrastructureStats {
  semaforos: number;
  cruces: number;
  ciclovias: number;
  calles: number;
  zonas: {
    nombre: string;
    semaforos: number;
    cruces: number;
    riesgo: 'bajo' | 'medio' | 'alto';
  }[];
}

const OSMLayerControl = ({ onStatsUpdate }: OSMLayerControlProps) => {
  const [layers, setLayers] = useState({
    semaforos: false,
    cruces: false,
    ciclovias: false,
    calles: false,
  });
  
  const [geoJsonData, setGeoJsonData] = useState<{
    semaforos: any;
    cruces: any;
    ciclovias: any;
    calles: any;
  }>({
    semaforos: null,
    cruces: null,
    ciclovias: null,
    calles: null,
  });

  const [stats, setStats] = useState<InfrastructureStats>({
    semaforos: 0,
    cruces: 0,
    ciclovias: 0,
    calles: 0,
    zonas: [],
  });

  // Cargar datos GeoJSON
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        console.log('🔍 Iniciando carga de datos OSM...');
        
        // Cargar archivos GeoJSON de OSM
        const [semaforosRes, crucesRes, cicloviasRes, callesRes] = await Promise.all([
          fetch('/datajson/osm/hermosillo_semaforos_overpass.geojson'),
          fetch('/datajson/osm/hermosillo_cruces_peatonales.geojson'),
          fetch('/datajson/osm/hermosillo_ciclovias.geojson'),
          fetch('/datajson/osm/hermosillo_calles_principales.geojson'),
        ]);

        console.log('📥 Respuestas obtenidas:', {
          semaforos: semaforosRes.ok,
          cruces: crucesRes.ok,
          ciclovias: cicloviasRes.ok,
          calles: callesRes.ok,
        });

        const [semaforosData, crucesData, cicloviasData, callesData] = await Promise.all([
          semaforosRes.json(),
          crucesRes.json(),
          cicloviasRes.json(),
          callesRes.json(),
        ]);

        console.log('✅ Datos parseados:', {
          semaforos: semaforosData.features?.length || 0,
          cruces: crucesData.features?.length || 0,
          ciclovias: cicloviasData.features?.length || 0,
          calles: callesData.features?.length || 0,
        });

        setGeoJsonData({
          semaforos: semaforosData,
          cruces: crucesData,
          ciclovias: cicloviasData,
          calles: callesData,
        });

        // Calcular estadísticas
        const newStats: InfrastructureStats = {
          semaforos: semaforosData.features?.length || 0,
          cruces: crucesData.features?.length || 0,
          ciclovias: cicloviasData.features?.length || 0,
          calles: callesData.features?.length || 0,
          zonas: calcularEstadisticasPorZona(semaforosData, crucesData),
        };

        setStats(newStats);
        if (onStatsUpdate) {
          onStatsUpdate(newStats);
        }
      } catch (error) {
        console.error('Error loading OSM data:', error);
      }
    };

    loadGeoJSON();
  }, [onStatsUpdate]);

  // Calcular estadísticas por zona
  const calcularEstadisticasPorZona = (semaforosData: any, crucesData: any) => {
    const zonas = [
      { nombre: 'Centro', bounds: { minLat: 29.06, maxLat: 29.09, minLon: -110.98, maxLon: -110.94 } },
      { nombre: 'Norte', bounds: { minLat: 29.09, maxLat: 29.14, minLon: -111.00, maxLon: -110.92 } },
      { nombre: 'Sur', bounds: { minLat: 29.02, maxLat: 29.06, minLon: -111.00, maxLon: -110.92 } },
      { nombre: 'Este', bounds: { minLat: 29.06, maxLat: 29.10, minLon: -110.92, maxLon: -110.88 } },
      { nombre: 'Oeste', bounds: { minLat: 29.06, maxLat: 29.10, minLon: -111.04, maxLon: -110.98 } },
    ];

    return zonas.map(zona => {
      const semaforosEnZona = semaforosData.features?.filter((f: any) => {
        const [lon, lat] = f.geometry.coordinates;
        return lat >= zona.bounds.minLat && lat <= zona.bounds.maxLat &&
               lon >= zona.bounds.minLon && lon <= zona.bounds.maxLon;
      }).length || 0;

      const crucesEnZona = crucesData.features?.filter((f: any) => {
        const [lon, lat] = f.geometry.coordinates;
        return lat >= zona.bounds.minLat && lat <= zona.bounds.maxLat &&
               lon >= zona.bounds.minLon && lon <= zona.bounds.maxLon;
      }).length || 0;

      // Determinar nivel de riesgo basado en infraestructura
      let riesgo: 'bajo' | 'medio' | 'alto' = 'medio';
      const densidadInfraestructura = semaforosEnZona + crucesEnZona;
      
      if (densidadInfraestructura > 30) riesgo = 'bajo';
      else if (densidadInfraestructura < 10) riesgo = 'alto';

      return {
        nombre: zona.nombre,
        semaforos: semaforosEnZona,
        cruces: crucesEnZona,
        riesgo,
      };
    });
  };

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  // Estilos para cada tipo de feature con tipos correctos de Leaflet
  const createSemaforoMarker = (feature: any, latlng: L.LatLngExpression) => {
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: '#f59e0b',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    });
  };

  const createCruceMarker = (feature: any, latlng: L.LatLngExpression) => {
    return L.circleMarker(latlng, {
      radius: 7,
      fillColor: '#10b981',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.85,
    });
  };

  const cicloviaStyle = (feature: any) => ({
    color: '#ec4899',
    weight: 4,
    opacity: 0.9,
    dashArray: '8, 4',
  });

  const calleStyle = (feature: any) => {
    const highway = feature?.properties?.highway;
    const colors: Record<string, string> = {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      tertiary: '#14b8a6',
      trunk: '#ef4444',
    };
    
    const weights: Record<string, number> = {
      primary: 3,
      secondary: 2.5,
      tertiary: 2,
      trunk: 3.5,
    };
    
    return {
      color: colors[highway] || '#6b7280',
      weight: weights[highway] || 2,
      opacity: 0.7,
    };
  };

  return (
    <>
      {/* Capas GeoJSON */}
      {layers.semaforos && geoJsonData.semaforos && (
        <GeoJSON
          key={`semaforos-${Date.now()}`}
          data={geoJsonData.semaforos}
          pointToLayer={createSemaforoMarker}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div style="min-width: 150px;">
                <strong>🚦 Semáforo</strong><br/>
                <small>Tipo: ${feature.properties.highway || 'traffic_signals'}</small>
              </div>
            `);
          }}
        />
      )}

      {layers.cruces && geoJsonData.cruces && (
        <GeoJSON
          key={`cruces-${Date.now()}`}
          data={geoJsonData.cruces}
          pointToLayer={createCruceMarker}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div style="min-width: 180px;">
                <strong>🚶 Cruce Peatonal</strong><br/>
                <small>Tipo: ${feature.properties.crossing || 'N/A'}</small><br/>
                <small>Pavimento táctil: ${feature.properties.tactile_paving === 'yes' ? 'Sí' : 'No'}</small>
              </div>
            `);
          }}
        />
      )}

      {layers.ciclovias && geoJsonData.ciclovias && (
        <GeoJSON
          key={`ciclovias-${Date.now()}`}
          data={geoJsonData.ciclovias}
          style={cicloviaStyle}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div style="min-width: 180px;">
                <strong>🚴 Ciclovía</strong><br/>
                <small>Nombre: ${feature.properties.name || 'Sin nombre'}</small><br/>
                <small>Superficie: ${feature.properties.surface || 'N/A'}</small><br/>
                <small>Iluminación: ${feature.properties.lit === 'yes' ? 'Sí' : 'No'}</small>
              </div>
            `);
          }}
        />
      )}

      {layers.calles && geoJsonData.calles && (
        <GeoJSON
          key={`calles-${Date.now()}`}
          data={geoJsonData.calles}
          style={calleStyle}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(`
              <div style="min-width: 200px;">
                <strong>🛣️ ${feature.properties.name || 'Sin nombre'}</strong><br/>
                <small>Tipo: ${feature.properties.highway}</small><br/>
                <small>Velocidad máx: ${feature.properties.maxspeed || 'N/A'}</small><br/>
                <small>Carriles: ${feature.properties.lanes || 'N/A'}</small>
              </div>
            `);
          }}
        />
      )}

      {/* Panel de control flotante */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '10px', 
          zIndex: 1000,
          pointerEvents: 'auto'
        }}
      >
        <Card className="w-72 shadow-xl bg-white/95 backdrop-blur-sm border-2">
          <CardHeader className="pb-2 pt-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                <MapIconLucide className="w-3.5 h-3.5" />
                Capas de Infraestructura
              </CardTitle>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                OSM
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 py-3">
            {/* Toggles de capas */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <Label htmlFor="semaforos" className="text-[11px] cursor-pointer font-medium">
                    Semáforos <span className="text-muted-foreground">({stats.semaforos})</span>
                  </Label>
                </div>
                <Switch
                  id="semaforos"
                  checked={layers.semaforos}
                  onCheckedChange={() => toggleLayer('semaforos')}
                  className="scale-[0.7] data-[state=checked]:bg-[#f59e0b]"
                />
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <Label htmlFor="cruces" className="text-[11px] cursor-pointer font-medium">
                    Cruces <span className="text-muted-foreground">({stats.cruces})</span>
                  </Label>
                </div>
                <Switch
                  id="cruces"
                  checked={layers.cruces}
                  onCheckedChange={() => toggleLayer('cruces')}
                  className="scale-[0.7] data-[state=checked]:bg-[#10b981]"
                />
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-0.5 bg-[#ec4899]" />
                  <Label htmlFor="ciclovias" className="text-[11px] cursor-pointer font-medium">
                    Ciclovías <span className="text-muted-foreground">({stats.ciclovias})</span>
                  </Label>
                </div>
                <Switch
                  id="ciclovias"
                  checked={layers.ciclovias}
                  onCheckedChange={() => toggleLayer('ciclovias')}
                  className="scale-[0.7] data-[state=checked]:bg-[#ec4899]"
                />
              </div>

              <div className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-0.5 bg-[#3b82f6]" />
                  <Label htmlFor="calles" className="text-[11px] cursor-pointer font-medium">
                    Calles <span className="text-muted-foreground">({stats.calles})</span>
                  </Label>
                </div>
                <Switch
                  id="calles"
                  checked={layers.calles}
                  onCheckedChange={() => toggleLayer('calles')}
                  className="scale-[0.7] data-[state=checked]:bg-[#3b82f6]"
                />
              </div>
            </div>

            <Separator className="my-2" />

            {/* Estadísticas rápidas */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Cobertura Total</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-muted/50 rounded px-2 py-1">
                  <span className="text-muted-foreground block text-[10px]">Infraestructura</span>
                  <p className="font-bold text-sm">{stats.semaforos + stats.cruces}</p>
                </div>
                <div className="bg-muted/50 rounded px-2 py-1">
                  <span className="text-muted-foreground block text-[10px]">Red vial</span>
                  <p className="font-bold text-sm">{stats.calles}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OSMLayerControl;
