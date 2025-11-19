import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import InfrastructureStats from '@/components/InfrastructureStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, Database } from 'lucide-react';

interface InfraStats {
  semaforos: number;
  cruces: number;
  ciclovias: number;
  calles: number;
  zonas: Array<{
    nombre: string;
    semaforos: number;
    cruces: number;
    riesgo: 'bajo' | 'medio' | 'alto';
  }>;
}

const InfrastructurePage = () => {
  const [stats, setStats] = useState<InfraStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [semaforosRes, crucesRes, cicloviasRes, callesRes] = await Promise.all([
          fetch('/datajson/osm/hermosillo_semaforos_overpass.geojson'),
          fetch('/datajson/osm/hermosillo_cruces_peatonales.geojson'),
          fetch('/datajson/osm/hermosillo_ciclovias.geojson'),
          fetch('/datajson/osm/hermosillo_calles_principales.geojson'),
        ]);

        const [semaforosData, crucesData, cicloviasData, callesData] = await Promise.all([
          semaforosRes.json(),
          crucesRes.json(),
          cicloviasRes.json(),
          callesRes.json(),
        ]);

        // Calcular estadísticas por zona
        const zonas = [
          { nombre: 'Centro', bounds: { minLat: 29.06, maxLat: 29.09, minLon: -110.98, maxLon: -110.94 } },
          { nombre: 'Norte', bounds: { minLat: 29.09, maxLat: 29.14, minLon: -111.00, maxLon: -110.92 } },
          { nombre: 'Sur', bounds: { minLat: 29.02, maxLat: 29.06, minLon: -111.00, maxLon: -110.92 } },
          { nombre: 'Este', bounds: { minLat: 29.06, maxLat: 29.10, minLon: -110.92, maxLon: -110.88 } },
          { nombre: 'Oeste', bounds: { minLat: 29.06, maxLat: 29.10, minLon: -111.04, maxLon: -110.98 } },
        ];

        const zonasStats = zonas.map(zona => {
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

          const densidadInfraestructura = semaforosEnZona + crucesEnZona;
          let riesgo: 'bajo' | 'medio' | 'alto' = 'medio';
          
          if (densidadInfraestructura > 30) riesgo = 'bajo';
          else if (densidadInfraestructura < 10) riesgo = 'alto';

          return {
            nombre: zona.nombre,
            semaforos: semaforosEnZona,
            cruces: crucesEnZona,
            riesgo,
          };
        });

        setStats({
          semaforos: semaforosData.features?.length || 0,
          cruces: crucesData.features?.length || 0,
          ciclovias: cicloviasData.features?.length || 0,
          calles: callesData.features?.length || 0,
          zonas: zonasStats,
        });
      } catch (error) {
        console.error('Error loading infrastructure data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <Database className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Datos Abiertos</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Infraestructura Vial de Hermosillo
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Análisis completo de la infraestructura vial urbana basado en datos de OpenStreetMap. 
            Información pública y transparente para el beneficio de la ciudadanía.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Fuente: OpenStreetMap
            </Badge>
            <Badge variant="outline">
              Actualizado: Noviembre 2025
            </Badge>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <a href="/mapa" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver en Mapa Interactivo
            </a>
          </Button>
          <Button variant="default" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Datos
          </Button>
        </div>

        {/* Información de transparencia */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Datos Abiertos y Transparencia
            </CardTitle>
            <CardDescription>
              Compromiso con la transparencia y el acceso público a la información
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold mb-1">Fuente de Datos</p>
                <p className="text-muted-foreground">
                  OpenStreetMap (OSM) - Base de datos colaborativa mundial
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Última Actualización</p>
                <p className="text-muted-foreground">
                  19 de Noviembre de 2025
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1">Licencia</p>
                <p className="text-muted-foreground">
                  ODbL - Open Database License
                </p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <p className="text-xs text-muted-foreground">
                Los datos presentados son de dominio público y pueden ser utilizados libremente por ciudadanos, 
                investigadores y organizaciones para análisis, visualizaciones y toma de decisiones. 
                La información se actualiza periódicamente desde OpenStreetMap.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <p className="text-center text-muted-foreground mt-4">Cargando estadísticas...</p>
            </CardContent>
          </Card>
        ) : stats ? (
          <InfrastructureStats stats={stats} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No se pudieron cargar los datos</p>
            </CardContent>
          </Card>
        )}

        {/* Metodología */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Metodología de Análisis</CardTitle>
            <CardDescription>Cómo se calculan las estadísticas y niveles de riesgo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Clasificación de Zonas</h4>
              <p className="text-muted-foreground">
                La ciudad se divide en 5 zonas geográficas (Centro, Norte, Sur, Este, Oeste) 
                basadas en coordenadas y límites urbanos naturales.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Nivel de Riesgo</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Riesgo Bajo:</strong> Zonas con más de 30 puntos de infraestructura (semáforos + cruces)</li>
                <li><strong>Riesgo Medio:</strong> Zonas con 10-30 puntos de infraestructura</li>
                <li><strong>Riesgo Alto:</strong> Zonas con menos de 10 puntos de infraestructura</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Fuentes de Datos</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Semáforos: highway=traffic_signals en OSM</li>
                <li>Cruces Peatonales: highway=crossing, crossing=zebra/marked en OSM</li>
                <li>Ciclovías: highway=cycleway, bicycle=designated en OSM</li>
                <li>Calles Principales: highway=primary/secondary/tertiary/trunk en OSM</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default InfrastructurePage;
