import { TrendingDown, Users, MapPin, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function CityStats() {
  const stats = [
    {
      label: 'Accidentes Registrados',
      value: '800+',
      description: 'Base de datos actualizada',
      icon: MapPin,
      trend: null,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Usuarios Activos',
      value: '1,200+',
      description: 'Ciudadanos usando la plataforma',
      icon: Users,
      trend: '+15%',
      trendUp: true,
      color: 'text-secondary-foreground',
      bgColor: 'bg-secondary/10',
    },
    {
      label: 'Zonas Monitoreadas',
      value: '45',
      description: 'Colonias de Hermosillo',
      icon: Shield,
      trend: null,
      color: 'text-accent-foreground',
      bgColor: 'bg-accent/10',
    },
    {
      label: 'Reducción de Riesgo',
      value: '12%',
      description: 'En zonas con intervención',
      icon: TrendingDown,
      trend: null,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Impacto en Hermosillo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Datos actualizados del sistema de movilidad urbana
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-2"
              >
                <CardContent className="pt-6 pb-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>

                    {/* Value */}
                    <div>
                      <div className="text-3xl md:text-4xl font-bold mb-1">
                        {stat.value}
                      </div>
                      {stat.trend && (
                        <div className={`text-xs font-medium ${stat.trendUp ? 'text-primary' : 'text-destructive'}`}>
                          {stat.trend} este mes
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-foreground">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Datos actualizados en tiempo real desde el Sistema Operativo de Movilidad
          </p>
        </div>
      </div>
    </section>
  );
}
