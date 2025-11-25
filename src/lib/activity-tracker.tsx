/**
 * Recent Activity Tracker
 * Historial de acciones del usuario
 */

import { useState, useEffect } from 'react';
import { Clock, MapPin, FileText, Download, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/design-system';

interface Activity {
  id: string;
  type: 'navigation' | 'report' | 'download' | 'view' | 'action';
  title: string;
  description?: string;
  timestamp: Date;
  icon?: React.ReactNode;
  link?: string;
}

const STORAGE_KEY = 'hmobility_recent_activity';
const MAX_ACTIVITIES = 50;

class ActivityTracker {
  private listeners: Set<(activities: Activity[]) => void> = new Set();
  private activities: Activity[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.activities = JSON.parse(stored).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.activities));
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }

  subscribe(listener: (activities: Activity[]) => void) {
    this.listeners.add(listener);
    listener(this.activities);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.activities));
    this.saveToStorage();
  }

  track(activity: Omit<Activity, 'id' | 'timestamp'>) {
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
    };

    this.activities = [newActivity, ...this.activities].slice(0, MAX_ACTIVITIES);
    this.notify();
  }

  getRecent(limit: number = 10): Activity[] {
    return this.activities.slice(0, limit);
  }

  clear() {
    this.activities = [];
    this.notify();
  }
}

export const activityTracker = new ActivityTracker();

// Hook para usar el activity tracker
export function useRecentActivity(limit: number = 10) {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const unsubscribe = activityTracker.subscribe((newActivities) => {
      setActivities(newActivities.slice(0, limit));
    });
    return unsubscribe;
  }, [limit]);

  return activities;
}

// Componente de actividad reciente
export function RecentActivityPanel() {
  const activities = useRecentActivity(15);

  const getIconComponent = (type: Activity['type']) => {
    switch (type) {
      case 'navigation':
        return MapPin;
      case 'report':
        return AlertTriangle;
      case 'download':
        return Download;
      case 'view':
        return FileText;
      default:
        return Clock;
    }
  };

  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'report':
        return 'text-red-500';
      case 'download':
        return 'text-blue-500';
      case 'navigation':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Sin actividad aún</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Actividad Reciente
          </CardTitle>
          <Badge variant="secondary">{activities.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {activities.map((activity) => {
            const IconComponent = getIconComponent(activity.type);
            return (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-3 p-2 rounded-lg',
                  'hover:bg-muted/50 transition-colors',
                  activity.link && 'cursor-pointer'
                )}
                onClick={() => activity.link && (window.location.href = activity.link)}
              >
                <div className={cn('mt-0.5', getTypeColor(activity.type))}>
                  {activity.icon || <IconComponent className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  {activity.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// Helper para trackear automáticamente navegación
export function trackPageView(title: string, path: string) {
  activityTracker.track({
    type: 'navigation',
    title: `Visitó: ${title}`,
    link: path,
  });
}
