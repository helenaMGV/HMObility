/**
 * Widget Library
 * Catálogo de widgets disponibles
 */

import {
  TrendingUp,
  AlertTriangle,
  Users,
  Car,
  MapPin,
  Activity,
  BarChart3,
  Clock,
  Zap,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface WidgetDefinition {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  icon: React.ReactNode;
  defaultSize: 'small' | 'medium' | 'large';
}

const widgetDefinitions: WidgetDefinition[] = [
  {
    id: 'kpi-accidents',
    title: 'Accidentes del Mes',
    description: 'Total de incidentes reportados',
    type: 'kpi',
    category: 'Métricas',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
    defaultSize: 'small',
  },
  {
    id: 'kpi-speed',
    title: 'Velocidad Promedio',
    description: 'Velocidad media en vías principales',
    type: 'kpi',
    category: 'Métricas',
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    defaultSize: 'small',
  },
  {
    id: 'kpi-users',
    title: 'Usuarios Activos',
    description: 'Ciudadanos usando la plataforma',
    type: 'kpi',
    category: 'Métricas',
    icon: <Users className="w-5 h-5 text-blue-500" />,
    defaultSize: 'small',
  },
  {
    id: 'kpi-efficiency',
    title: 'Eficiencia Vial',
    description: 'Score de optimización de rutas',
    type: 'kpi',
    category: 'Métricas',
    icon: <Target className="w-5 h-5 text-green-500" />,
    defaultSize: 'small',
  },
  {
    id: 'chart-timeline',
    title: 'Línea de Tiempo',
    description: 'Evolución mensual de incidentes',
    type: 'chart',
    category: 'Gráficas',
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    defaultSize: 'medium',
  },
  {
    id: 'chart-distribution',
    title: 'Distribución por Tipo',
    description: 'Categorías de incidentes',
    type: 'chart',
    category: 'Gráficas',
    icon: <BarChart3 className="w-5 h-5 text-secondary" />,
    defaultSize: 'medium',
  },
  {
    id: 'map-hotspots',
    title: 'Mapa de Puntos Calientes',
    description: 'Zonas críticas de la ciudad',
    type: 'map',
    category: 'Mapas',
    icon: <MapPin className="w-5 h-5 text-accent" />,
    defaultSize: 'large',
  },
  {
    id: 'list-recent',
    title: 'Reportes Recientes',
    description: 'Últimas 10 incidencias',
    type: 'list',
    category: 'Listas',
    icon: <Clock className="w-5 h-5 text-orange-500" />,
    defaultSize: 'medium',
  },
  {
    id: 'activity-feed',
    title: 'Feed de Actividad',
    description: 'Actividad en tiempo real',
    type: 'feed',
    category: 'Listas',
    icon: <Activity className="w-5 h-5 text-purple-500" />,
    defaultSize: 'medium',
  },
  {
    id: 'traffic-flow',
    title: 'Flujo Vehicular',
    description: 'Tráfico en tiempo real por zona',
    type: 'gauge',
    category: 'Métricas',
    icon: <Car className="w-5 h-5 text-indigo-500" />,
    defaultSize: 'small',
  },
];

interface WidgetLibraryProps {
  onAddWidget: (widget: WidgetDefinition) => void;
  existingWidgets: string[];
}

export function WidgetLibrary({ onAddWidget, existingWidgets }: WidgetLibraryProps) {
  const categories = Array.from(new Set(widgetDefinitions.map((w) => w.category)));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>➕</span>
          Agregar Widget
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Biblioteca de Widgets</SheetTitle>
          <SheetDescription>
            Selecciona widgets para personalizar tu dashboard
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  {category}
                </h3>
                <div className="space-y-2">
                  {widgetDefinitions
                    .filter((w) => w.category === category)
                    .map((widget) => {
                      const isAdded = existingWidgets.includes(widget.id);
                      return (
                        <div
                          key={widget.id}
                          className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          <div className="mt-0.5">{widget.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{widget.title}</h4>
                              {isAdded && (
                                <Badge variant="secondary" className="text-xs">
                                  Agregado
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {widget.description}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isAdded ? 'outline' : 'default'}
                            disabled={isAdded}
                            onClick={() => onAddWidget(widget)}
                          >
                            {isAdded ? '✓' : '+'}
                          </Button>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
