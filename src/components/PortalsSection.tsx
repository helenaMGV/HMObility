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
    <section className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl top-20 left-10 animate-float"></div>
        <div className="absolute w-96 h-96 bg-secondary/5 rounded-full blur-3xl bottom-20 right-10 animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent animate-gradient">
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
                className="relative overflow-hidden hover:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 border border-primary/10 hover:border-primary/40 group backdrop-blur-sm bg-gradient-to-br from-card/80 to-card/40 hover:scale-[1.02]"
              >
                {/* Premium gradient top bar con shimmer */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${portal.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>

                <CardHeader className="pt-8 pb-6">
                  <div className={`w-16 h-16 rounded-2xl ${portal.bgColor} flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl relative`}>
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${portal.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>
                    <Icon className={`w-8 h-8 ${portal.textColor} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
                  </div>
                  <CardTitle className="text-2xl mb-3 font-bold group-hover:text-primary transition-colors duration-300">{portal.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground/90">
                    {portal.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pb-6">
                  {/* Features list con animación stagger */}
                  <div className="space-y-2.5">
                    {portal.features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group/feature"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${portal.bgColor} group-hover/feature:w-2 group-hover/feature:h-2 transition-all duration-300`} />
                        <span className="group-hover/feature:translate-x-1 transition-transform duration-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button premium con glassmorphism */}
                  <Button
                    asChild
                    className={`w-full bg-gradient-to-r ${portal.gradient} hover:opacity-95 text-white shadow-xl hover:shadow-2xl transition-all duration-500 group/btn relative overflow-hidden py-6`}
                  >
                    <Link to={portal.link}>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                      <span className="relative z-10 font-semibold">Acceder al Portal</span>
                      <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-2 transition-transform duration-300 relative z-10" />
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
