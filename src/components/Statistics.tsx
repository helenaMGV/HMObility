import { useState } from "react";
import { TrendingUp, Users, AlertTriangle, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Line, LineChart } from "recharts";

interface StatisticsProps {
  chartType?: "bar" | "doughnut";
}

const barData = [
  { name: "Exceso velocidad", value: 450 },
  { name: "Celular", value: 320 },
  { name: "Semáforo", value: 280 },
  { name: "Cinturón", value: 210 },
  { name: "Estacionamiento", value: 180 },
];

const pieData = [
  { name: "Exceso de velocidad", short: "Exceso velocidad", value: 35, color: "hsl(32 94% 50%)" },
  { name: "Uso de celular", short: "Uso celular", value: 25, color: "hsl(43 93% 49%)" },
  { name: "Semáforo", short: "Semáforo", value: 20, color: "hsl(183 48% 53%)" },
  { name: "Cinturón", short: "Cinturón", value: 12, color: "hsl(32 70% 60%)" },
  { name: "Otros", short: "Otros", value: 8, color: "hsl(24 25% 60%)" },
];

const trendData = [
  { mes: "Ago", infracciones: 1200, multas: 890 },
  { mes: "Sep", infracciones: 1350, multas: 920 },
  { mes: "Oct", infracciones: 1440, multas: 892 },
  { mes: "Nov", infracciones: 1380, multas: 850 },
];

const Statistics = ({ chartType = "bar" }: StatisticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  
  // Calculate trend
  const currentMonth = 1440;
  const previousMonth = 1350;
  const percentChange = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
  const isIncreasing = parseFloat(percentChange) > 0;
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Estadísticas de Infracciones
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Datos actualizados sobre las infracciones más frecuentes en Hermosillo
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-up">
            <Card className="shadow-card hover:shadow-elegant transition-smooth border-l-4 border-l-primary group cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardDescription>Infracciones Mensuales</CardDescription>
                    {isIncreasing ? (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        +{percentChange}%
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs flex items-center gap-1 bg-green-500">
                        <ArrowDownRight className="w-3 h-3" />
                        {percentChange}%
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors">1,440</CardTitle>
                </div>
                {isIncreasing ? (
                  <TrendingUp className="h-8 w-8 text-primary" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-green-500" />
                )}
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-smooth border-l-4 border-l-secondary">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardDescription>Conductores Multados</CardDescription>
                  <CardTitle className="text-3xl font-bold text-secondary">892</CardTitle>
                </div>
                <Users className="h-8 w-8 text-secondary" />
              </CardHeader>
            </Card>

            <Card className="shadow-card hover:shadow-elegant transition-smooth border-l-4 border-l-accent">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardDescription>Zonas Conflictivas</CardDescription>
                  <CardTitle className="text-3xl font-bold text-accent">15</CardTitle>
                </div>
                <AlertTriangle className="h-8 w-8 text-accent" />
              </CardHeader>
            </Card>
          </div>

          {/* Time Period Selector */}
          <Tabs defaultValue="mes" className="mb-8" onValueChange={setSelectedPeriod}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="semana">Semanal</TabsTrigger>
              <TabsTrigger value="mes">Mensual</TabsTrigger>
              <TabsTrigger value="ano">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Trend Chart */}
          <Card className="shadow-elegant mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>Tendencia de Infracciones</CardTitle>
              <CardDescription>Comparación de los últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="infracciones" 
                    stroke="hsl(32 94% 50%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(32 94% 50%)', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Infracciones"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="multas" 
                    stroke="hsl(43 93% 49%)" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(43 93% 49%)', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Multas aplicadas"
                  />
                  <Legend />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-8 animate-scale-in">
            {/* Bar Chart */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Infracciones por Tipo</CardTitle>
                <CardDescription>Número de multas registradas por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(32 94% 50%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle>Distribución Porcentual</CardTitle>
                <CardDescription>Proporción de infracciones por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="40%"
                      cy="50%"
                      labelLine={false}
                      label={({ index, percent }) => {
                        const entry: any = pieData[index];
                        const short = entry.short || entry.name;
                        return `${short}: ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" verticalAlign="middle" align="right" formatter={(value: any) => {
                      // Show short names in legend
                      const entry = pieData.find((p) => p.name === value || p.short === value);
                      return entry ? entry.short : value;
                    }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
