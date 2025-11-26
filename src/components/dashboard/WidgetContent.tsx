/**
 * Widget Content Components
 * Contenido real para cada tipo de widget
 */

import { TrendingUp, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// KPI Widget
export function KPIWidget({ value, label, trend, trendValue }: {
  value: string | number;
  label: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}) {
  return (
    <div className="flex flex-col justify-center h-full">
      <div className="text-4xl font-bold mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}

// Simple Chart Widget (placeholder)
export function ChartWidget({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// List Widget
export function ListWidget({ items }: { items: Array<{ time: string; text: string; status?: string }> }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
          <div className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{item.text}</p>
            {item.status && (
              <span className={`text-xs ${
                item.status === 'resolved' ? 'text-green-600' : 'text-orange-600'
              }`}>
                {item.status === 'resolved' ? '✓ Resuelto' : '⏳ Pendiente'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Gauge Widget
export function GaugeWidget({ value, max, label }: { value: number; max: number; label: string }) {
  const percentage = (value / max) * 100;
  const color = percentage > 75 ? 'text-red-600' : percentage > 50 ? 'text-yellow-600' : 'text-green-600';
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className={`text-5xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
      <Progress value={percentage} className="w-full mt-4 h-2" />
      <div className="text-xs text-muted-foreground mt-1">
        {percentage.toFixed(0)}% de capacidad
      </div>
    </div>
  );
}

// Map Widget (placeholder)
export function MapWidget() {
  return (
    <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-sm text-muted-foreground">Mapa de Calor</p>
        <p className="text-xs text-muted-foreground mt-1">Zona Centro: 12 reportes</p>
      </div>
    </div>
  );
}
