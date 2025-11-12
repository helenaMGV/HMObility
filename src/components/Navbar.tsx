import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoSrc from "@/assets/logo_hmobility.png";

interface NavbarProps {
  onChatbotToggle?: () => void;
}

const Navbar = ({ onChatbotToggle }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Inicio", path: "/" },
    { label: "Mapa", path: "/mapa" },
    { label: "Juego Educativo", path: "/juego" },
    { label: "Acerca de", path: "/acerca-de" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 transition-smooth hover:opacity-80">
            <img src={logoSrc} alt="HMObility" className="h-10 w-auto" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-smooth relative group ${
                  isActive(item.path) ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-smooth ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Chatbot Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              onClick={onChatbotToggle}
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-elegant"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chatbot
            </Button>
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
