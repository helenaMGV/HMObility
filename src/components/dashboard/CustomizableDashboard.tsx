/**
 * Customizable Dashboard V2
 * Dashboard con widgets draggables y personalizables
 */

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Layout } from 'lucide-react';
import { DraggableWidget, WidgetConfig } from './DraggableWidget';
import { WidgetLibrary } from './WidgetLibrary';
import {
  KPIWidget,
  ChartWidget,
  ListWidget,
  GaugeWidget,
  MapWidget,
} from './WidgetContent';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

const STORAGE_KEY = 'dashboard_v2_layout';

// Datos mock para los widgets
const mockData = {
  accidents: { value: 142, trend: 'down' as const, trendValue: '-8.2% vs mes anterior' },
  speed: { value: '45 km/h', trend: 'up' as const, trendValue: '+3.5% más rápido' },
  users: { value: 2847, trend: 'up' as const, trendValue: '+15.3% nuevos usuarios' },
  efficiency: { value: '87%', trend: 'up' as const, trendValue: '+4.1% optimización' },
  chartData: [
    { label: 'Colisiones', value: 45, percentage: 75 },
    { label: 'Atropellos', value: 28, percentage: 46 },
    { label: 'Volcaduras', value: 15, percentage: 25 },
  ],
  recentReports: [
    { time: '10:45 AM', text: 'Colisión en Blvd. Luis Encinas', status: 'pending' },
    { time: '09:30 AM', text: 'Semáforo dañado en Rosales', status: 'resolved' },
    { time: '08:15 AM', text: 'Congestión en Periférico', status: 'pending' },
  ],
  traffic: { value: 68, max: 100, label: 'Vehículos/hora' },
};

function getWidgetComponent(type: string, id: string) {
  switch (id) {
    case 'kpi-accidents':
      return <KPIWidget {...mockData.accidents} label="Accidentes" />;
    case 'kpi-speed':
      return <KPIWidget {...mockData.speed} label="Velocidad Media" />;
    case 'kpi-users':
      return <KPIWidget {...mockData.users} label="Usuarios Activos" />;
    case 'kpi-efficiency':
      return <KPIWidget {...mockData.efficiency} label="Eficiencia" />;
    case 'chart-timeline':
      return <ChartWidget title="Incidentes por categoría" data={mockData.chartData} />;
    case 'chart-distribution':
      return <ChartWidget title="Distribución horaria" data={mockData.chartData} />;
    case 'map-hotspots':
      return <MapWidget />;
    case 'list-recent':
      return <ListWidget items={mockData.recentReports} />;
    case 'activity-feed':
      return <ListWidget items={mockData.recentReports} />;
    case 'traffic-flow':
      return <GaugeWidget {...mockData.traffic} />;
    default:
      return <div className="text-muted-foreground">Widget sin contenido</div>;
  }
}

const defaultWidgets: WidgetConfig[] = [
  {
    id: 'kpi-accidents',
    title: 'Accidentes del Mes',
    type: 'kpi',
    size: 'small',
    component: null,
    icon: <span className="text-red-500">⚠️</span>,
  },
  {
    id: 'kpi-speed',
    title: 'Velocidad Promedio',
    type: 'kpi',
    size: 'small',
    component: null,
    icon: <span className="text-yellow-500">⚡</span>,
  },
  {
    id: 'chart-timeline',
    title: 'Línea de Tiempo',
    type: 'chart',
    size: 'medium',
    component: null,
    icon: <span className="text-primary">📊</span>,
  },
  {
    id: 'list-recent',
    title: 'Reportes Recientes',
    type: 'list',
    size: 'medium',
    component: null,
    icon: <span className="text-orange-500">🕐</span>,
  },
];

export function CustomizableDashboard() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Cargar layout guardado
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWidgets(
          parsed.map((w: WidgetConfig) => ({
            ...w,
            component: getWidgetComponent(w.type, w.id),
          }))
        );
      } catch (error) {
        console.error('Error loading dashboard:', error);
        setWidgets(
          defaultWidgets.map((w) => ({
            ...w,
            component: getWidgetComponent(w.type, w.id),
          }))
        );
      }
    } else {
      setWidgets(
        defaultWidgets.map((w) => ({
          ...w,
          component: getWidgetComponent(w.type, w.id),
        }))
      );
    }
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    setHasChanges(true);
    
    toast({
      title: 'Widget eliminado',
      description: 'El widget fue removido del dashboard',
    });

    analytics.trackEvent('dashboard_widget_removed', { widgetId: id });
  };

  const handleResizeWidget = (id: string, size: WidgetConfig['size']) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
    setHasChanges(true);
  };

  const handleAddWidget = (widgetDef: any) => {
    const newWidget: WidgetConfig = {
      id: widgetDef.id,
      title: widgetDef.title,
      type: widgetDef.type,
      size: widgetDef.defaultSize,
      icon: widgetDef.icon,
      component: getWidgetComponent(widgetDef.type, widgetDef.id),
    };

    setWidgets((prev) => [...prev, newWidget]);
    setHasChanges(true);

    toast({
      title: 'Widget agregado',
      description: `"${widgetDef.title}" fue agregado al dashboard`,
    });

    analytics.trackEvent('dashboard_widget_added', { widgetId: widgetDef.id });
  };

  const handleSaveLayout = () => {
    const toSave = widgets.map(({ component, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setHasChanges(false);

    toast({
      title: 'Layout guardado',
      description: 'Tu configuración de dashboard fue guardada exitosamente',
    });

    analytics.trackEvent('dashboard_layout_saved', {
      widgetCount: widgets.length,
    });
  };

  const handleResetLayout = () => {
    if (confirm('¿Restaurar el layout por defecto? Se perderán los cambios actuales.')) {
      setWidgets(
        defaultWidgets.map((w) => ({
          ...w,
          component: getWidgetComponent(w.type, w.id),
        }))
      );
      localStorage.removeItem(STORAGE_KEY);
      setHasChanges(false);

      toast({
        title: 'Layout restaurado',
        description: 'Se restauró la configuración predeterminada',
      });

      analytics.trackEvent('dashboard_layout_reset');
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layout className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-bold">Dashboard Personalizable</h2>
        </div>
        <div className="flex gap-2">
          <WidgetLibrary
            onAddWidget={handleAddWidget}
            existingWidgets={widgets.map((w) => w.id)}
          />
          <Button
            variant="outline"
            onClick={handleResetLayout}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Restaurar
          </Button>
          <Button
            onClick={handleSaveLayout}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Layout
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      {hasChanges && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            💡 Tienes cambios sin guardar. Haz clic en "Guardar Layout" para preservar tu configuración.
          </p>
        </div>
      )}

      {/* Widgets Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
                onResize={handleResizeWidget}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {widgets.length === 0 && (
        <div className="text-center py-24 bg-gradient-to-br from-muted/30 via-muted/20 to-transparent rounded-2xl border-2 border-dashed border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-500">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            {/* Icon con animación */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
              <Layout className="w-20 h-20 mx-auto text-primary/70 relative z-10 animate-float" />
            </div>
            
            {/* Heading premium */}
            <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Crea tu Dashboard Personalizado
            </h3>
            
            {/* Description */}
            <p className="text-base text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
              Arrastra, organiza y personaliza widgets para monitorear los KPIs más importantes de tu ciudad
            </p>
            
            {/* Features list */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-lg mx-auto">
              {['📊 10 Widgets', '🎨 4 Tamaños', '💾 Auto-guardado', '⌨️ Shortcuts'].map((feature, i) => (
                <span 
                  key={i}
                  className="px-4 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-primary/10 rounded-full text-sm font-medium hover:border-primary/30 hover:scale-105 transition-all duration-300"
                >
                  {feature}
                </span>
              ))}
            </div>
            
            {/* CTA Button */}
            <WidgetLibrary
              onAddWidget={handleAddWidget}
              existingWidgets={[]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
