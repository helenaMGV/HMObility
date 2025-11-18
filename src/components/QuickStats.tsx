// Quick Stats Panel Component for Maps and Dashboards
import { TrendingUp, AlertTriangle, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuickStatsProps {
  stats: {
    total: number;
    critical: number;
    zones: number;
    trend?: number;
  };
  title?: string;
  description?: string;
}

const QuickStats = ({
  stats,
  title = "Resumen de Datos",
  description = "Estadísticas actualizadas",
}: QuickStatsProps) => {
  const trendPositive = stats.trend && stats.trend > 0;

  return (
    <Card className="shadow-card hover:shadow-elegant transition-smooth">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Total
            </p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Críticos
            </p>
            <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="w-4 h-4" />
              Zonas
            </p>
            <p className="text-2xl font-bold text-accent">{stats.zones}</p>
          </div>
          {stats.trend !== undefined && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Tendencia
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{Math.abs(stats.trend)}%</p>
                <Badge variant={trendPositive ? "destructive" : "default"} className="text-xs">
                  {trendPositive ? "↑" : "↓"}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStats;
