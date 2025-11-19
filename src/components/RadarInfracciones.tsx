import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, TrendingUp, Shield, Filter, Search, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ArticuloClave {
  id: string;
  articulo: string;
  tema: string;
  descripcion_corta: string;
  severidad: string;
  infracciones_registradas: number;
  accidentes_asociados: number;
  multa_base: number;
  puntos_licencia: number;
}

const COLORS = {
  alta: "#ef4444",
  media: "#f59e0b",
  baja: "#10b981"
};

const TEMA_ICONS: Record<string, string> = {
  alcohol: "🍺",
  velocidad: "⚡",
  celular: "📱",
  cinturon: "🔒",
  peaton: "🚶",
  ciclovia: "🚴",
  semaforo: "🚦",
  estacionamiento: "🅿️",
  distancia: "↔️",
  menores: "👶"
};

export function RadarInfracciones() {
  const [articulos, setArticulos] = useState<ArticuloClave[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroSeveridad, setFiltroSeveridad] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArticulo, setSelectedArticulo] = useState<ArticuloClave | null>(null);

  useEffect(() => {
    fetch("/src/data/reglamento_articulos_clave.json")
      .then(res => res.json())
      .then(data => {
        setArticulos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando artículos clave:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <div className="text-muted-foreground">Cargando radar de infracciones...</div>
      </div>
    );
  }

  // Filtrar artículos
  const articulosFiltrados = articulos.filter(art => {
    const matchSeveridad = filtroSeveridad === "all" || art.severidad === filtroSeveridad;
    const matchSearch = searchTerm === "" || 
      art.descripcion_corta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.articulo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSeveridad && matchSearch;
  });

  // Top 10 artículos por infracciones
  const top10Infracciones = [...articulos]
    .sort((a, b) => b.infracciones_registradas - a.infracciones_registradas)
    .slice(0, 10)
    .map(art => ({
      articulo: art.articulo.replace("Artículo ", "Art. "),
      infracciones: art.infracciones_registradas,
      tema: art.tema,
      icon: TEMA_ICONS[art.tema] || "⚠️"
    }));

  // Top 10 por accidentes asociados
  const top10Accidentes = [...articulos]
    .sort((a, b) => b.accidentes_asociados - a.accidentes_asociados)
    .slice(0, 10)
    .map(art => ({
      articulo: art.articulo.replace("Artículo ", "Art. "),
      accidentes: art.accidentes_asociados,
      tema: art.tema
    }));

  // Distribución por severidad
  const porSeveridad = articulos.reduce((acc, art) => {
    acc[art.severidad] = (acc[art.severidad] || 0) + art.infracciones_registradas;
    return acc;
  }, {} as Record<string, number>);

  const dataSeveridad = Object.entries(porSeveridad).map(([sev, count]) => ({
    name: sev.charAt(0).toUpperCase() + sev.slice(1),
    value: count,
    color: COLORS[sev as keyof typeof COLORS] || COLORS.media
  }));

  // Distribución por tema
  const porTema = articulos.reduce((acc, art) => {
    acc[art.tema] = (acc[art.tema] || 0) + art.infracciones_registradas;
    return acc;
  }, {} as Record<string, number>);

  const dataTema = Object.entries(porTema)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([tema, count]) => ({
      tema: tema.charAt(0).toUpperCase() + tema.slice(1),
      infracciones: count,
      icon: TEMA_ICONS[tema] || "⚠️"
    }));

  // Stats totales
  const totalInfracciones = articulos.reduce((sum, art) => sum + art.infracciones_registradas, 0);
  const totalAccidentes = articulos.reduce((sum, art) => sum + art.accidentes_asociados, 0);
  const multaPromedio = articulos.reduce((sum, art) => sum + art.multa_base, 0) / articulos.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header con buscador */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
            Radar de Infracciones
          </h2>
          <p className="text-muted-foreground mt-1">
            Análisis interactivo de artículos más violados del Reglamento
          </p>
        </div>
        
        {/* Buscador y filtros */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar infracción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>
          <Button
            variant={filtroSeveridad === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroSeveridad("all")}
          >
            Todas
          </Button>
          <Button
            variant={filtroSeveridad === "alta" ? "destructive" : "outline"}
            size="sm"
            onClick={() => setFiltroSeveridad("alta")}
          >
            Alta
          </Button>
          <Button
            variant={filtroSeveridad === "media" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroSeveridad("media")}
            className={filtroSeveridad === "media" ? "bg-orange-500 hover:bg-orange-600" : ""}
          >
            Media
          </Button>
          <Button
            variant={filtroSeveridad === "baja" ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltroSeveridad("baja")}
            className={filtroSeveridad === "baja" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            Baja
          </Button>
        </div>
      </div>

      {/* Stats Cards con animación hover */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infracciones Totales</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInfracciones.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Últimos 12 meses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accidentes Asociados</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAccidentes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Por violación del reglamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Multa Promedio</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${multaPromedio.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              MXN por infracción
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para organizar mejor la información */}
      <Tabs defaultValue="graficas" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="graficas">📊 Gráficas</TabsTrigger>
          <TabsTrigger value="tabla">📋 Tabla Detallada</TabsTrigger>
          <TabsTrigger value="analisis">🔍 Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="graficas" className="space-y-6 mt-6">
      {/* Gráficas principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top 10 Infracciones */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Artículos Más Violados</CardTitle>
            <CardDescription>Por número de infracciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={top10Infracciones} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="articulo" type="category" width={60} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{data.icon}</span>
                            <div>
                              <div className="font-bold">{data.articulo}</div>
                              <div className="text-sm text-muted-foreground">
                                {data.infracciones} infracciones
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="infracciones" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 Accidentes */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Artículos con Más Accidentes</CardTitle>
            <CardDescription>Accidentes asociados a cada violación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={top10Accidentes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="articulo" type="category" width={60} />
                <Tooltip />
                <Bar dataKey="accidentes" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Distribuciones */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Por Tema */}
        <Card>
          <CardHeader>
            <CardTitle>Infracciones por Tema</CardTitle>
            <CardDescription>Distribución por tipo de violación</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataTema}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tema" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{data.icon}</span>
                            <div>
                              <div className="font-bold">{data.tema}</div>
                              <div className="text-sm text-muted-foreground">
                                {data.infracciones} infracciones
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="infracciones" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Por Severidad */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Severidad</CardTitle>
            <CardDescription>Clasificación según gravedad</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dataSeveridad}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dataSeveridad.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Tab de Tabla Detallada */}
        <TabsContent value="tabla" className="space-y-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Artículos Clave</CardTitle>
          <CardDescription>Información completa de artículos más relevantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Artículo</th>
                  <th className="text-left p-2">Descripción</th>
                  <th className="text-center p-2">Infracciones</th>
                  <th className="text-center p-2">Accidentes</th>
                  <th className="text-center p-2">Multa</th>
                  <th className="text-center p-2">Puntos</th>
                  <th className="text-center p-2">Severidad</th>
                </tr>
              </thead>
              <tbody>
                {articulos
                  .sort((a, b) => b.infracciones_registradas - a.infracciones_registradas)
                  .map((art, idx) => (
                    <tr key={art.id} className={idx % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <span>{TEMA_ICONS[art.tema]}</span>
                          <span className="font-mono text-sm">{art.articulo}</span>
                        </div>
                      </td>
                      <td className="p-2 text-sm">{art.descripcion_corta}</td>
                      <td className="text-center p-2 font-semibold">{art.infracciones_registradas}</td>
                      <td className="text-center p-2 text-red-600 font-semibold">{art.accidentes_asociados}</td>
                      <td className="text-center p-2">${art.multa_base}</td>
                      <td className="text-center p-2 font-bold">{art.puntos_licencia}</td>
                      <td className="text-center p-2">
                        <span 
                          className="px-2 py-1 rounded text-xs font-semibold"
                          style={{ 
                            backgroundColor: COLORS[art.severidad as keyof typeof COLORS] + "20",
                            color: COLORS[art.severidad as keyof typeof COLORS]
                          }}
                        >
                          {art.severidad}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Tab de Análisis */}
        <TabsContent value="analisis" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>📊 Insights y Análisis</CardTitle>
              <CardDescription>Resumen ejecutivo del radar de infracciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-2">🚨 Zona Crítica</h4>
                  <p className="text-sm text-red-700">
                    Los artículos de severidad <strong>Alta</strong> representan los mayores riesgos viales. 
                    Se recomienda campañas enfocadas en {articulosFiltrados.filter(a => a.severidad === 'alta').length} artículos críticos.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">⚠️ Artículo Más Violado</h4>
                  <p className="text-sm text-orange-700">
                    El artículo <strong>{top10Infracciones[0]?.articulo}</strong> registra el mayor número 
                    de infracciones con <strong>{top10Infracciones[0]?.infracciones}</strong> casos.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💰 Impacto Económico</h4>
                  <p className="text-sm text-blue-700">
                    La multa promedio es de <strong>${multaPromedio.toFixed(0)} MXN</strong>. 
                    El total acumulado en multas supera los <strong>${(multaPromedio * totalInfracciones).toLocaleString('es-MX')} MXN</strong>.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">🎯 Recomendaciones</h4>
                  <p className="text-sm text-purple-700">
                    Reforzar vigilancia en artículos con <strong>{articulosFiltrados.filter(a => a.puntos_licencia >= 4).length} infracciones</strong> 
                    que generan 4+ puntos en la licencia.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
