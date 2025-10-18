import { Target, Users, BookOpen, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import backgroundImage from "@/assets/foto_hermosillo.jpg";
import logoSrc from "@/assets/logo_hmobility.png";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Nuestra Misión",
      description: "Fomentar la educación y seguridad vial en Hermosillo y Sonora mediante información accesible y herramientas educativas.",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Crear una comunidad de conductores responsables que respeten las leyes de tránsito y promuevan la seguridad.",
      color: "text-secondary"
    },
    {
      icon: BookOpen,
      title: "Educación",
      description: "Proporcionar contenido claro y digestible sobre leyes de tránsito, multas y conducción responsable.",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Seguridad",
      description: "Reducir accidentes viales mediante la concientización y el conocimiento de normativas de tránsito.",
      color: "text-primary"
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden mb-16 shadow-elegant">
            <img
              src={backgroundImage}
              alt="Hermosillo"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 gradient-hero flex items-center justify-center">
              <div className="text-center">
                <img src={logoSrc} alt="HMObility" className="h-20 mx-auto mb-6 drop-shadow-lg" />
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Acerca de HMObility
                </h1>
                <p className="text-xl text-white/95 max-w-2xl mx-auto drop-shadow-md">
                  Cultura y Educación Vial para Hermosillo
                </p>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Qué es HMObility?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              HMObility es un proyecto educativo sin fines de lucro que busca fomentar la educación 
              y seguridad vial en Hermosillo y Sonora. Nuestro objetivo es proporcionar información 
              clara y accesible sobre las leyes de tránsito, multas, velocidades permitidas y 
              conducción responsable, ayudando a crear una comunidad de conductores más conscientes 
              y seguros.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16 animate-slide-up">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-card rounded-lg shadow-sm">
                        <Icon className={`w-6 h-6 ${value.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Official Links */}
          <div className="text-center animate-scale-in">
            <h2 className="text-3xl font-bold mb-6">Información Oficial</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Este proyecto se basa en la normativa vigente de tránsito del Estado de Sonora. 
              Para consultas oficiales, visita:
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.hermosillo.gob.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth shadow-card font-medium"
              >
                Gobierno de Hermosillo
              </a>
              <a
                href="https://www.congresoson.gob.mx"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-smooth shadow-card font-medium"
              >
                Congreso del Estado de Sonora
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
