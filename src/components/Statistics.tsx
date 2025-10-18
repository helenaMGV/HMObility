import { TrendingUp, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

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

const Statistics = ({ chartType = "bar" }: StatisticsProps) => {
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
            <Card className="shadow-card hover:shadow-elegant transition-smooth border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardDescription>Infracciones Mensuales</CardDescription>
                  <CardTitle className="text-3xl font-bold text-primary">1,440</CardTitle>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
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
