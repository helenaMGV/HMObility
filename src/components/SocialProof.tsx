// Social Proof Component - Testimonials and trust indicators
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "María González",
    role: "Conductora en Hermosillo",
    content: "Gracias a HMObility aprendí sobre zonas de riesgo y he mejorado mi conducción. El chatbot es increíblemente útil.",
    rating: 5,
    initials: "MG",
  },
  {
    name: "Carlos Ramírez",
    role: "Instructor de Manejo",
    content: "Una herramienta esencial para la educación vial. Los datos son precisos y el juego educativo es excelente para mis alumnos.",
    rating: 5,
    initials: "CR",
  },
  {
    name: "Ana Torres",
    role: "Estudiante UNISON",
    content: "El mapa interactivo me ayudó a identificar rutas más seguras. Es una plataforma innovadora y necesaria.",
    rating: 5,
    initials: "AT",
  },
];

const partners = [
  "Universidad de Sonora",
  "Cruz Roja Sonora",
  "Gobierno Municipal",
  "Tránsito Municipal",
];

const SocialProof = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Partners Section */}
        <div className="text-center mb-16 animate-fade-in">
          <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
            Confianza y colaboración
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="text-lg font-bold text-foreground/70 hover:text-primary transition-colors cursor-default"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-lg text-muted-foreground">
              Miles de conductores ya confían en HMObility para aprender y conducir de forma segura
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col space-y-4">
                    {/* Quote icon */}
                    <div className="flex justify-between items-start">
                      <Quote className="w-8 h-8 text-primary/30 group-hover:text-primary/50 transition-colors" />
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm leading-relaxed text-muted-foreground italic">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Avatar className="w-10 h-10 bg-gradient-to-br from-primary to-secondary">
                        <AvatarFallback className="bg-transparent text-white font-bold text-xs">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">2,450+ Usuarios Activos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">842 Accidentes Mapeados</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">18% Reducción de Accidentes</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
