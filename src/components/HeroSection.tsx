import { ArrowRight, Play, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backgroundImage from "@/assets/foto_hermosillo.jpg";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection = ({
  title = "Sistema Operativo de Movilidad",
  subtitle = "842 accidentes georeferenciados • 16 módulos de IA • Predicciones en tiempo real • Vision Zero en acción",
  ctaText = "Explorar Portales",
  ctaLink = "#portals",
}: HeroSectionProps) => {
  const handleClick = () => {
    const element = document.querySelector(ctaLink);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-[700px] flex items-center justify-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Background with advanced gradients */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={backgroundImage}
          alt="Vista aérea de la ciudad de Hermosillo, Sonora"
          className="w-full h-full object-cover scale-110 animate-subtle-zoom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-purple-900/70 to-secondary/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content with premium layout */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Main heading with gradient */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight animate-slide-up"
            id="main-title"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              {title}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 font-medium mb-8 drop-shadow-lg max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button
              onClick={handleClick}
              size="lg"
              className="bg-white text-primary hover:bg-white/95 shadow-2xl text-lg px-10 py-7 group rounded-2xl transform hover:scale-105 transition-all duration-300 font-bold"
              aria-label="Explorar los portales de HMObility"
            >
              {ctaText}
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-all duration-300" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl top-1/4 -left-20 animate-float"></div>
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl bottom-1/3 -right-20 animate-float-delayed"></div>
        <div className="absolute w-64 h-64 bg-pink-500/10 rounded-full blur-3xl top-1/2 left-1/2 animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
