import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface ZonaStats {
  nombre: string;
  semaforos: number;
  cruces: number;
  riesgo: 'bajo' | 'medio' | 'alto';
}

interface InfrastructureStatsProps {
  stats: {
    semaforos: number;
    cruces: number;
    ciclovias: number;
    calles: number;
    zonas: ZonaStats[];
  };
}

const COLORS = {
  bajo: '#10b981',
  medio: '#f59e0b',
  alto: '#ef4444',
};

const InfrastructureStats = ({ stats }: InfrastructureStatsProps) => {
  // Datos para gráfica de barras por zona
  const zonaChartData = stats.zonas.map(zona => ({
    zona: zona.nombre,
    semaforos: zona.semaforos,
    cruces: zona.cruces,
    total: zona.semaforos + zona.cruces,
  }));

  // Datos para gráfica de pie de distribución de riesgo
  const riesgoDistribution = stats.zonas.reduce((acc, zona) => {
    acc[zona.riesgo] = (acc[zona.riesgo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riesgoPieData = Object.entries(riesgoDistribution).map(([nivel, count]) => ({
    name: nivel.charAt(0).toUpperCase() + nivel.slice(1),
    value: count,
    color: COLORS[nivel as keyof typeof COLORS],
  }));

  // Datos para radar de cobertura
  const radarData = stats.zonas.map(zona => ({
    zona: zona.nombre,
    infraestructura: ((zona.semaforos + zona.cruces) / 50) * 100, // Normalizado a 100
    seguridad: zona.riesgo === 'bajo' ? 100 : zona.riesgo === 'medio' ? 60 : 30,
  }));

  // Estadísticas generales
  const totalInfraestructura = stats.semaforos + stats.cruces;
  const zonaMayorCobertura = stats.zonas.reduce((prev, current) => 
    (prev.semaforos + prev.cruces) > (current.semaforos + current.cruces) ? prev : current
  );
  const zonasRiesgoAlto = stats.zonas.filter(z => z.riesgo === 'alto').length;

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Total Semáforos</CardDescription>
            <CardTitle className="text-2xl">{stats.semaforos}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              Puntos
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Cruces Peatonales</CardDescription>
            <CardTitle className="text-2xl">{stats.cruces}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Seguros
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Red de Ciclovías</CardDescription>
            <CardTitle className="text-2xl">{stats.ciclovias}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Segmentos
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs">Calles Principales</CardDescription>
            <CardTitle className="text-2xl">{stats.calles}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Vías
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Insights clave */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análisis de Infraestructura</CardTitle>
          <CardDescription>Indicadores clave de la red vial urbana</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                Zona con Mayor Cobertura
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                {zonaMayorCobertura.nombre} tiene {zonaMayorCobertura.semaforos + zonaMayorCobertura.cruces} puntos de infraestructura
              </p>
            </div>
          </div>

          {zonasRiesgoAlto > 0 && (
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                  Zonas de Atención Prioritaria
                </p>
                <p className="text-xs text-red-700 dark:text-red-300">
                  {zonasRiesgoAlto} {zonasRiesgoAlto === 1 ? 'zona requiere' : 'zonas requieren'} mejora en infraestructura de seguridad
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Densidad Promedio
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {Math.round(totalInfraestructura / stats.zonas.length)} puntos de infraestructura por zona
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficas */}
      <Tabs defaultValue="zonas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zonas">Por Zona</TabsTrigger>
          <TabsTrigger value="riesgo">Nivel de Riesgo</TabsTrigger>
          <TabsTrigger value="cobertura">Cobertura</TabsTrigger>
        </TabsList>

        <TabsContent value="zonas">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Infraestructura por Zona</CardTitle>
              <CardDescription>Distribución de semáforos y cruces peatonales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={zonaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="zona" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="semaforos" fill="#f59e0b" name="Semáforos" />
                  <Bar dataKey="cruces" fill="#10b981" name="Cruces" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="riesgo">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Distribución de Nivel de Riesgo</CardTitle>
              <CardDescription>Clasificación de zonas según infraestructura disponible</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riesgoPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riesgoPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {/* Lista de zonas por riesgo */}
              <div className="mt-4 space-y-2">
                {stats.zonas.map((zona) => (
                  <div key={zona.nombre} className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm font-medium">{zona.nombre}</span>
                    <Badge 
                      variant={zona.riesgo === 'bajo' ? 'default' : zona.riesgo === 'medio' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {zona.riesgo.charAt(0).toUpperCase() + zona.riesgo.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cobertura">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Radar de Cobertura</CardTitle>
              <CardDescription>Análisis multidimensional por zona</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="zona" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Infraestructura" dataKey="infraestructura" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Seguridad" dataKey="seguridad" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>

              <div className="mt-4 text-xs text-muted-foreground">
                <p><strong>Infraestructura:</strong> Densidad de semáforos y cruces peatonales</p>
                <p><strong>Seguridad:</strong> Nivel de riesgo basado en cobertura (bajo=100, medio=60, alto=30)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InfrastructureStats;
