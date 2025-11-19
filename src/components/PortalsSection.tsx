import { Link } from 'react-router-dom';
import { Users, Building2, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PortalsSection() {
  const portals = [
    {
      id: 'ciudadano',
      title: 'Portal Ciudadano',
      description: 'Conviértete en sensor urbano: reporta incidentes, consulta datos abiertos, aprende con IA y accede al reglamento de tránsito interactivo.',
      icon: Users,
      gradient: 'from-primary to-primary/80',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      link: '/reportes',
      features: [
        'Mapa interactivo de accidentes',
        'Reportar incidentes',
        'Chatbot del reglamento',
        'Calculadora de multas',
        'Juego educativo',
      ],
    },
    {
      id: 'gobierno',
      title: 'Dashboard Gobierno',
      description: '16 módulos profesionales: High-Injury Network, análisis predictivo, simulación de escenarios, inventario digital y recomendaciones automatizadas basadas en Vision Zero.',
      icon: Building2,
      gradient: 'from-secondary to-secondary/80',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary-foreground',
      link: '/gobierno',
      features: [
        'High-Injury Network',
        'Análisis de flujos',
        'Inventario de activos',
        'Campañas de prevención',
        'Operaciones en tiempo real',
      ],
    },
    {
      id: 'admin',
      title: 'Panel Administrador',
      description: 'Control total del sistema operativo: gestión de activos, permisos granulares, auditoría completa y exportación de datasets para transparencia radical.',
      icon: Shield,
      gradient: 'from-accent to-accent/80',
      bgColor: 'bg-accent/10',
      textColor: 'text-accent-foreground',
      link: '/admin',
      features: [
        'Gestión de inventario',
        'Configuración del sistema',
        'Administración de campañas',
        'Control de accesos',
        'Reportes y exportación',
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Tres Portales, Un Ecosistema
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde reportes ciudadanos hasta decisiones estratégicas de gobierno: 
            <span className="font-semibold text-foreground"> datos unificados, roles específicos, impacto sistémico</span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {portals.map((portal) => {
            const Icon = portal.icon;
            return (
              <Card
                key={portal.id}
                className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 group"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${portal.gradient}`} />

                <CardHeader className="pt-8">
                  <div className={`w-16 h-16 rounded-2xl ${portal.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}>
                    <Icon className={`w-8 h-8 ${portal.textColor}`} />
                  </div>
                  <CardTitle className="text-2xl mb-2">{portal.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {portal.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features list */}
                  <div className="space-y-2">
                    {portal.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className={`w-1.5 h-1.5 rounded-full ${portal.bgColor}`} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${portal.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group/btn`}
                  >
                    <Link to={portal.link}>
                      Acceder al Portal
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
