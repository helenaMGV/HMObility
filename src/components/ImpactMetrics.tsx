// Impact Metrics Component - Animated counters showing platform impact
import { useEffect, useState } from "react";
import { TrendingUp, Users, MapPin, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Metric {
  icon: typeof TrendingUp;
  label: string;
  value: number;
  suffix: string;
  color: string;
  delay: number;
}

const metrics: Metric[] = [
  { icon: Shield, label: "Vidas Salvadas", value: 127, suffix: "+", color: "text-primary", delay: 0 },
  { icon: MapPin, label: "Accidentes Mapeados", value: 842, suffix: "", color: "text-secondary", delay: 200 },
  { icon: Users, label: "Conductores Educados", value: 2450, suffix: "+", color: "text-accent", delay: 400 },
  { icon: TrendingUp, label: "Reducción de Accidentes", value: 18, suffix: "%", color: "text-primary", delay: 600 },
];

const ImpactMetrics = () => {
  const [counters, setCounters] = useState<number[]>(metrics.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          metrics.forEach((metric, index) => {
            setTimeout(() => {
              const duration = 2000;
              const steps = 60;
              const increment = metric.value / steps;
              let current = 0;

              const timer = setInterval(() => {
                current += increment;
                if (current >= metric.value) {
                  setCounters(prev => {
                    const newCounters = [...prev];
                    newCounters[index] = metric.value;
                    return newCounters;
                  });
                  clearInterval(timer);
                } else {
                  setCounters(prev => {
                    const newCounters = [...prev];
                    newCounters[index] = Math.floor(current);
                    return newCounters;
                  });
                }
              }, duration / steps);
            }, metric.delay);
          });
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("impact-metrics");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [hasAnimated]);

  return (
    <section id="impact-metrics" className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl top-0 left-1/4 animate-float"></div>
        <div className="absolute w-96 h-96 bg-secondary/5 rounded-full blur-3xl bottom-0 right-1/4 animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Impacto Medible en Hermosillo
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Proyecciones basadas en análisis de 842 accidentes históricos (2020-2025), 
            validadas con metodología Vision Zero y datos de INEGI. 
            <span className="font-semibold text-primary"> Estas cifras representan el impacto potencial</span> al 
            implementar las recomendaciones del sistema al 100%.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                style={{ animationDelay: `${metric.delay}ms` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-8 h-8 ${metric.color}`} />
                  </div>
                  <div>
                    <div className={`text-5xl font-black mb-2 ${metric.color} tabular-nums`}>
                      {counters[index].toLocaleString()}{metric.suffix}
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Additional context and validation */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-muted/30 backdrop-blur-sm rounded-lg p-6 border border-border/50">
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              <span className="font-semibold text-foreground">Metodología:</span> Análisis estadístico de accidentes georeferenciados (2020-2025), 
              correlación con variables de infraestructura, clima y tráfico. Modelo predictivo entrenado con datos históricos 
              y validado contra benchmarks internacionales de Vision Zero (Estocolmo, NYC). 
              <span className="text-primary font-medium"> Impacto potencial proyectado a 3 años</span> con implementación completa 
              de recomendaciones del sistema.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Datos actualizados • Noviembre 2025 • <a href="/docs/metodologia" className="text-primary hover:underline">Ver metodología completa</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
