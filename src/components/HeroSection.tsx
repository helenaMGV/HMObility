import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import backgroundImage from "@/assets/foto_hermosillo.jpg";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

const HeroSection = ({
  title = "HMObility",
  subtitle = "Infórmate, aprende y conduce con responsabilidad",
  ctaText = "Consultar multas",
  ctaLink = "#tabla-multas",
}: HeroSectionProps) => {
  const handleClick = () => {
    const element = document.querySelector(ctaLink);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay mejorado */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hermosillo ciudad"
          className="w-full h-full object-cover scale-105 animate-subtle-zoom"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/60 to-secondary/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
      </div>

      {/* Content con animaciones mejoradas */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90 animate-pulse-slow">
              {title}
            </span>
          </h1>
          <p className="text-xl md:text-3xl text-white font-medium mb-10 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-white text-primary hover:bg-white/95 shadow-2xl text-lg px-10 py-7 group rounded-xl transform hover:scale-110 transition-all duration-300 font-bold"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-all duration-300" />
          </Button>
        </div>
      </div>

      {/* Decorative Elements mejorados */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/50 to-transparent" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl top-1/4 -left-20 animate-float"></div>
        <div className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl bottom-1/4 -right-20 animate-float-delayed"></div>
      </div>
    </section>
  );
};

export default HeroSection;
