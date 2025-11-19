// Real-time Notifications Component - Simulated live updates
import { useEffect, useState } from "react";
import { Bell, AlertCircle, TrendingUp, MapPin, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "alert" | "info" | "warning";
  title: string;
  message: string;
  location?: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Omit<Notification, "id" | "timestamp" | "read">[] = [
  {
    type: "alert",
    title: "Nueva zona de riesgo detectada",
    message: "Incremento del 30% en accidentes en Blvd. Solidaridad",
    location: "Blvd. Solidaridad - Norte",
  },
  {
    type: "warning",
    title: "Operativo de tránsito activo",
    message: "Incremento en revisiones de velocidad en zonas escolares",
    location: "Zonas escolares - Todo Hermosillo",
  },
  {
    type: "info",
    title: "Reporte estadístico actualizado",
    message: "Las infracciones por exceso de velocidad aumentaron 15% este mes",
  },
  {
    type: "alert",
    title: "Accidente reportado",
    message: "Tráfico lento en Blvd. Luis Encinas altura de Cultura",
    location: "Blvd. Luis Encinas - Centro",
  },
];

const LiveNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      // Random chance to show a notification
      if (Math.random() > 0.7) {
        const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        const newNotification: Notification = {
          ...randomNotif,
          id: `notif-${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 10)); // Keep last 10
        setUnreadCount(prev => prev + 1);

        // Show toast for important alerts
        if (randomNotif.type === "alert") {
          toast.error(randomNotif.title, {
            description: randomNotif.message,
            duration: 5000,
          });
        }
      }
    }, 30000); // Check every 30 seconds

    // Initial notifications
    const initial: Notification[] = mockNotifications.slice(0, 3).map((notif, i) => ({
      ...notif,
      id: `initial-${i}`,
      timestamp: new Date(Date.now() - (i + 1) * 3600000), // Hours ago
      read: i === 0 ? false : true,
    }));
    setNotifications(initial);
    setUnreadCount(1);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    const wasUnread = notifications.find(n => n.id === id && !n.read);
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      case "warning":
        return <TrendingUp className="w-5 h-5 text-yellow-500" />;
      case "info":
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Hace un momento";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Notification Bell Button */}
      <Button
        variant="default"
        size="icon"
        className="relative w-12 h-12 rounded-full shadow-elegant animate-pulse-slow"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 text-xs rounded-full"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-96 max-h-[500px] shadow-elegant animate-slide-in-right overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-gradient-card flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold">Notificaciones en Vivo</h3>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-orange-600 text-white font-semibold">{unreadCount} nuevas</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mb-2 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border transition-all cursor-pointer group hover:shadow-md ${
                      !notif.read ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getIcon(notif.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm leading-tight">{notif.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notif.id);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                        {notif.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {notif.location}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {getTimeSince(notif.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default LiveNotifications;
