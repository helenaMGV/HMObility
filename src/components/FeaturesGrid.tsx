// Features Grid Component - Premium feature showcase
import { Brain, Map, TrendingUp, Users, Shield, Zap, BookOpen, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Feature {
  icon: typeof Brain;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Brain,
    title: "Chatbot con IA",
    description: "Consulta el reglamento con inteligencia artificial en español",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Map,
    title: "Gemelo Digital",
    description: "842 accidentes georeferenciados + High-Injury Network con predicción de riesgo",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Vision Zero Analytics",
    description: "Predicción de accidentes con ML + recomendaciones automatizadas de infraestructura",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: BookOpen,
    title: "Educación Gamificada",
    description: "Aprende las leyes de tránsito jugando y gana recompensas",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Shield,
    title: "Alertas Preventivas",
    description: "Notificaciones en tiempo real de zonas de riesgo y operativos",
    gradient: "from-yellow-500 to-amber-500",
  },
  {
    icon: Zap,
    title: "Calculadora Inteligente",
    description: "Calcula multas múltiples con descuentos automáticos",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Users,
    title: "Comunidad Activa",
    description: "Únete a conductores responsables y comparte experiencias",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Award,
    title: "Certificaciones",
    description: "Obtén reconocimientos por conducción segura y responsable",
    gradient: "from-teal-500 to-cyan-500",
  },
];

const FeaturesGrid = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            8 Herramientas, Una Misión: Cero Muertes
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            No es solo tecnología, es un ecosistema completo: desde <span className="font-semibold text-foreground">IA conversacional</span> hasta 
            <span className="font-semibold text-foreground"> analytics predictivos</span>, pasando por 
            <span className="font-semibold text-foreground"> gamificación educativa</span> y 
            <span className="font-semibold text-foreground"> mapas de riesgo en tiempo real</span>.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Animated icon container */}
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className={`relative p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl transform group-hover:rotate-6 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
