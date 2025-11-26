import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/LoginButton";
import logoSrc from "@/assets/logo_hmobility.png";

interface NavbarProps {
  onChatbotToggle?: () => void;
}

const Navbar = ({ onChatbotToggle }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: "Inicio", path: "/" },
    { label: "Mapa", path: "/mapa" },
    { label: "Juego Educativo", path: "/juego" },
    { label: "Acerca de", path: "/acerca-de" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/98 backdrop-blur-2xl border-b border-primary/30 shadow-[0_8px_30px_rgb(0,0,0,0.12)]' 
        : 'bg-background/90 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_20px_rgb(0,0,0,0.08)]'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo con efecto glow premium */}
          <Link to="/" className="flex items-center gap-3 transition-all duration-500 hover:scale-105 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              <img src={logoSrc} alt="HMObility" className="h-12 w-auto relative z-10 drop-shadow-lg" />
            </div>
          </Link>

          {/* Desktop Menu con efectos glassmorphism */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-semibold transition-all duration-300 relative group px-3 py-2 rounded-lg ${
                  isActive(item.path) 
                    ? "text-primary bg-primary/5 backdrop-blur-sm" 
                    : "text-foreground hover:text-primary hover:bg-primary/5 hover:backdrop-blur-sm"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300 ${
                    isActive(item.path) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Actions: Chatbot + Login con glassmorphism */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={onChatbotToggle}
              variant="outline"
              className="gap-2 backdrop-blur-sm bg-white/50 dark:bg-black/50 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group"
            >
              <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span>Asistente</span>
            </Button>
            <LoginButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-smooth px-2 py-2 rounded-md ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  onChatbotToggle?.();
                }}
                className="bg-accent hover:bg-accent/90 text-accent-foreground w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chatbot
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
