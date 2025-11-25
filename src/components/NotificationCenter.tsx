/**
 * Sistema de Notificaciones Push
 * Notificaciones en tiempo real para eventos críticos
 */

import { useState, useEffect, useCallback } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, designSystem } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

// Store de notificaciones (en producción usar Zustand o Redux)
class NotificationStore {
  private listeners: Set<(notifications: Notification[]) => void> = new Set();
  private notifications: Notification[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  add(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      read: false,
    };

    this.notifications = [newNotification, ...this.notifications];
    this.notify();

    // Analytics
    analytics.trackEvent('notification_received', {
      type: notification.type,
      title: notification.title,
    });

    // Notificación del navegador si está permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
      });
    }

    return newNotification.id;
  }

  markAsRead(id: string) {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notify();
  }

  markAllAsRead() {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  clear() {
    this.notifications = [];
    this.notify();
  }

  getAll(): Notification[] {
    return this.notifications;
  }

  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.notifications));
  }
}

export const notificationStore = new NotificationStore();

// Hook para usar notificaciones
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(
    notificationStore.getAll()
  );

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(setNotifications);
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) =>
      notificationStore.add(notification),
    markAsRead: (id: string) => notificationStore.markAsRead(id),
    markAllAsRead: () => notificationStore.markAllAsRead(),
    removeNotification: (id: string) => notificationStore.remove(id),
    clearAll: () => notificationStore.clear(),
  };
}

// Componente UI de notificaciones
export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } =
    useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    
    analytics.trackEvent('notification_clicked', {
      notification_id: notification.id,
      type: notification.type,
      title: notification.title,
    });

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* Botón de campana */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            analytics.trackEvent('notification_center_opened', {
              unread_count: unreadCount,
            });
          }
        }}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      {isOpen && (
        <Card
          className={cn(
            'absolute top-full right-0 mt-2',
            'w-96 max-h-[600px] shadow-2xl border-2 z-50',
            designSystem.animations.entrance.slideDown
          )}
        >
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Notificaciones</h3>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                </p>
              </div>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      markAllAsRead();
                      analytics.trackEvent('notifications_marked_all_read');
                    }}
                  >
                    Marcar todo
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Sin notificaciones</p>
                <p className="text-sm">Te avisaremos cuando haya novedades</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'p-4 hover:bg-muted/50 transition-colors cursor-pointer',
                      'border-l-4',
                      getColor(notification.type),
                      !notification.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionLabel && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              {notification.actionLabel} →
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 w-6 h-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper para formatear timestamps
function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes}m`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

// Solicitar permiso para notificaciones del navegador
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    analytics.trackEvent('notification_permission_requested', {
      result: permission,
    });
    return permission === 'granted';
  }

  return false;
}
