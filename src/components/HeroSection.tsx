import { ArrowRight, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import backgroundImage from "@/assets/foto_hermosillo.jpg";
import { motion } from "framer-motion";

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
      className="relative min-h-[750px] flex items-center justify-center overflow-hidden"
      aria-label="Sección principal"
    >
      {/* Premium gradient background con overlay avanzado */}
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
        {/* Gradient overlay mejorado estilo Stripe */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-purple-900/75 to-secondary/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Glassmorphism blur effect */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      {/* Content con animaciones mejoradas */}
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Heading premium con gradiente animado */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
            id="main-title"
          >
            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-[0_0_40px_rgba(255,255,255,0.5)] animate-gradient">
              {title}
            </span>
          </motion.h1>
          
          {/* Subtitle con blur glass effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xl md:text-2xl text-white/95 font-medium backdrop-blur-sm bg-white/5 px-8 py-4 rounded-2xl border border-white/10 drop-shadow-2xl leading-relaxed">
              {subtitle}
            </p>
          </motion.div>

          {/* CTAs premium con glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button
              onClick={handleClick}
              size="lg"
              className="bg-white text-primary hover:bg-white/95 shadow-[0_20px_70px_-10px_rgba(243,142,11,0.5)] hover:shadow-[0_25px_80px_-10px_rgba(243,142,11,0.7)] text-lg px-12 py-8 group rounded-2xl transform hover:scale-105 transition-all duration-300 font-bold"
              aria-label="Explorar los portales de HMObility"
            >
              {ctaText}
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
            </Button>
            
            <Button
              onClick={() => window.location.href = '/mapa-animado'}
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 shadow-2xl text-lg px-12 py-8 group rounded-2xl transition-all duration-300 font-semibold"
              aria-label="Ver simulador en vivo"
            >
              <Zap className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
              Ver Simulador
            </Button>
          </motion.div>

          {/* Stats cards con glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto pt-8"
          >
            {[
              { label: 'Usuarios Activos', value: '2,847', icon: TrendingUp },
              { label: 'Reportes Procesados', value: '156/mes', icon: Sparkles },
              { label: 'Reducción Accidentes', value: '-12%', icon: Zap },
            ].map((stat, i) => (
              <div 
                key={i}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-6 py-4 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <div className="flex items-center gap-3 justify-center">
                  <stat.icon className="w-5 h-5 text-white/80" />
                  <div className="text-center">
                    <div className="text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient fade premium */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/70 to-transparent" />
      
      {/* Floating orbs con blur mejorado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] top-1/4 -left-32 animate-float"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] bottom-1/3 -right-32 animate-float-delayed"></div>
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] top-1/2 left-1/2 animate-float" style={{ animationDelay: "1s" }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
