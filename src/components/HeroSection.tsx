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
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Hermosillo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 drop-shadow-md max-w-2xl mx-auto">
            {subtitle}
          </p>
          <Button
            onClick={handleClick}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-elegant text-lg px-8 py-6 group"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
          </Button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
