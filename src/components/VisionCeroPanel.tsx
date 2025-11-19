import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, Cell } from "recharts";
import { TrendingDown, Target, AlertCircle, Users, Download, Filter } from "lucide-react";
import { useEffect, useState } from "react";

interface VisionCeroData {
  year: number;
  muertes_totales: number;
  lesiones_graves: number;
  meta_muertes: number;
  meta_lesiones: number;
  muertes_peaton: number;
  muertes_ciclista: number;
  muertes_motociclista: number;
  muertes_auto: number;
  progreso_meta: number;
}

export function VisionCeroPanel() {
  const [data, setData] = useState<VisionCeroData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<string>("todos");

  useEffect(() => {
    fetch("/datajson/vision_cero_indicadores.json")
      .then(res => res.json())
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando Vision Cero:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Cargando indicadores Visión Cero...</div>
      </div>
    );
  }

  const latestYear = data[data.length - 1];
  const firstYear = data[0];
  
  // Cálculos
  const reduccionMuertes = firstYear && latestYear 
    ? Math.round(((firstYear.muertes_totales - latestYear.muertes_totales) / firstYear.muertes_totales) * 100)
    : 0;
  
  const reduccionLesiones = firstYear && latestYear
    ? Math.round(((firstYear.lesiones_graves - latestYear.lesiones_graves) / firstYear.lesiones_graves) * 100)
    : 0;

  const progresoMeta = latestYear?.progreso_meta || 0;

  // Datos por modo
  const dataPorModo = latestYear ? [
    { modo: "Peatón", muertes: latestYear.muertes_peaton, fill: "#3b82f6" },
    { modo: "Ciclista", muertes: latestYear.muertes_ciclista, fill: "#10b981" },
    { modo: "Motociclista", muertes: latestYear.muertes_motociclista, fill: "#ef4444" },
    { modo: "Auto", muertes: latestYear.muertes_auto, fill: "#8b5cf6" }
  ] : [];

  const downloadData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Año,Muertes Totales,Lesiones Graves,Meta Muertes,Meta Lesiones,Progreso %\n" +
      data.map(d => `${d.year},${d.muertes_totales},${d.lesiones_graves},${d.meta_muertes},${d.meta_lesiones},${d.progreso_meta}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vision_cero_datos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Target className="h-8 w-8 text-blue-600" />
            Visión Cero Hermosillo
          </h2>
          <p className="text-muted-foreground">
            Compromiso hacia cero muertes y lesiones graves en el tránsito
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadData}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards con tooltips */}
      <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-4">
        <TooltipUI>
          <TooltipTrigger asChild>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-l-4 border-l-red-500 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🚨 Muertes {latestYear?.year}</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{latestYear?.muertes_totales || 0}</div>
            <p className="text-xs text-green-600 font-semibold">
              ↓ {reduccionMuertes}% vs {firstYear?.year}
            </p>
          </CardContent>
        </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total de muertes por siniestros viales en el año actual</p>
          </TooltipContent>
        </TooltipUI>

        <TooltipUI>
          <TooltipTrigger asChild>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-l-4 border-l-orange-500 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🏥 Lesiones Graves</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{latestYear?.lesiones_graves || 0}</div>
            <p className="text-xs text-green-600 font-semibold">
              ↓ {reduccionLesiones}% vs {firstYear?.year}
            </p>
          </CardContent>
        </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Personas con lesiones graves hospitalizadas</p>
          </TooltipContent>
        </TooltipUI>

        <TooltipUI>
          <TooltipTrigger asChild>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-l-4 border-l-blue-500 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">🎯 Meta {latestYear?.year}</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{latestYear?.meta_muertes || 0}</div>
            <p className="text-xs text-muted-foreground">
              Muertes objetivo
            </p>
          </CardContent>
        </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Objetivo de reducción establecido para el año</p>
          </TooltipContent>
        </TooltipUI>

        <TooltipUI>
          <TooltipTrigger asChild>
        <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-l-4 border-l-green-500 cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">📈 Progreso</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{progresoMeta}%</div>
            <p className="text-xs text-muted-foreground">
              Hacia meta 2030
            </p>
          </CardContent>
        </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Avance acumulado hacia el objetivo Visión Cero 2030</p>
          </TooltipContent>
        </TooltipUI>
      </div>
      </TooltipProvider>

      {/* Tabs para organizar la información */}
      <Tabs defaultValue="tendencias" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tendencias">📈 Tendencias</TabsTrigger>
          <TabsTrigger value="modos">🚶 Por Modo</TabsTrigger>
          <TabsTrigger value="analisis">📊 Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="tendencias" className="space-y-6 mt-6">
      {/* Gráfica principal: Evolución temporal */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Muertes y Lesiones Graves</CardTitle>
          <CardDescription>Tendencia histórica vs metas anuales (2020-2025)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMuertes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLesiones" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="muertes_totales" 
                stroke="#ef4444" 
                fillOpacity={1} 
                fill="url(#colorMuertes)" 
                name="Muertes totales"
              />
              <Area 
                type="monotone" 
                dataKey="lesiones_graves" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorLesiones)" 
                name="Lesiones graves"
              />
              <Line 
                type="monotone" 
                dataKey="meta_muertes" 
                stroke="#10b981" 
                strokeDasharray="5 5" 
                name="Meta muertes"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Tab Por Modo */}
        <TabsContent value="modos" className="space-y-6 mt-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Muertes por modo - año actual */}
        <Card>
          <CardHeader>
            <CardTitle>Muertes por Modo de Transporte</CardTitle>
            <CardDescription>Distribución {latestYear?.year}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dataPorModo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="modo" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="muertes" radius={[8, 8, 0, 0]}>
                  {dataPorModo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tendencia por modo */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia por Modo de Transporte</CardTitle>
            <CardDescription>Evolución temporal 2020-2025</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="muertes_peaton" stroke="#3b82f6" name="Peatón" strokeWidth={2} />
                <Line type="monotone" dataKey="muertes_ciclista" stroke="#10b981" name="Ciclista" strokeWidth={2} />
                <Line type="monotone" dataKey="muertes_motociclista" stroke="#ef4444" name="Moto" strokeWidth={2} />
                <Line type="monotone" dataKey="muertes_auto" stroke="#8b5cf6" name="Auto" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        {/* Tab Análisis */}
        <TabsContent value="analisis" className="space-y-6 mt-6">
      {/* Tabla detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Datos Históricos Detallados</CardTitle>
          <CardDescription>Indicadores anuales y progreso hacia metas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Año</th>
                  <th className="text-center p-2">Muertes</th>
                  <th className="text-center p-2">Lesiones Graves</th>
                  <th className="text-center p-2">Meta Muertes</th>
                  <th className="text-center p-2">Meta Lesiones</th>
                  <th className="text-center p-2">Peatón</th>
                  <th className="text-center p-2">Ciclista</th>
                  <th className="text-center p-2">Moto</th>
                  <th className="text-center p-2">Auto</th>
                  <th className="text-center p-2">Progreso</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => {
                  const cumpleMeta = row.muertes_totales <= row.meta_muertes;
                  return (
                    <tr key={row.year} className={idx % 2 === 0 ? "bg-muted/50" : ""}>
                      <td className="p-2 font-semibold">{row.year}</td>
                      <td className={`text-center p-2 font-bold ${cumpleMeta ? 'text-green-600' : 'text-red-600'}`}>
                        {row.muertes_totales}
                      </td>
                      <td className="text-center p-2">{row.lesiones_graves}</td>
                      <td className="text-center p-2 text-muted-foreground">{row.meta_muertes}</td>
                      <td className="text-center p-2 text-muted-foreground">{row.meta_lesiones}</td>
                      <td className="text-center p-2">{row.muertes_peaton}</td>
                      <td className="text-center p-2">{row.muertes_ciclista}</td>
                      <td className="text-center p-2">{row.muertes_motociclista}</td>
                      <td className="text-center p-2">{row.muertes_auto}</td>
                      <td className="text-center p-2">
                        <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                          {row.progreso_meta}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info box */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Sobre Visión Cero
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Visión Cero</strong> es una estrategia de seguridad vial que parte del principio de que ninguna 
            pérdida de vida es aceptable en el sistema de transporte.
          </p>
          <p>
            En Hermosillo, trabajamos hacia la meta de <strong>cero muertes y lesiones graves para 2030</strong>, 
            implementando un enfoque de sistema seguro que incluye:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Diseño de calles más seguras</li>
            <li>Reducción de velocidades en zonas críticas</li>
            <li>Protección de usuarios vulnerables (peatones, ciclistas)</li>
            <li>Educación vial continua</li>
            <li>Aplicación estricta del reglamento</li>
          </ul>
        </CardContent>
      </Card>

      {/* Resumen Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 text-base">✅ Logros Principales</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-green-700 space-y-2">
            <p>• Reducción de <strong>{reduccionMuertes}%</strong> en muertes desde {firstYear?.year}</p>
            <p>• Reducción de <strong>{reduccionLesiones}%</strong> en lesiones graves</p>
            <p>• Progreso del <strong>{progresoMeta}%</strong> hacia la meta 2030</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 text-base">⚠️ Áreas de Atención</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-700 space-y-2">
            <p>• Usuarios vulnerables: peatones y ciclistas representan {latestYear ? Math.round(((latestYear.muertes_peaton + latestYear.muertes_ciclista) / latestYear.muertes_totales) * 100) : 0}% de muertes</p>
            <p>• Motociclistas: grupo de alto riesgo que requiere intervención prioritaria</p>
            <p>• Se requieren {latestYear ? (latestYear.muertes_totales - latestYear.meta_muertes) : 0} muertes menos para cumplir meta {latestYear?.year}</p>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
