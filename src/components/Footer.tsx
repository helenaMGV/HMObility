import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Send, ExternalLink, Mail } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logoSrc from "@/assets/logo_hmobility.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Gracias! Te mantendremos informado sobre novedades de HMObility");
  };

  const externalLinks = [
    { 
      name: "Gobierno de Hermosillo", 
      url: "https://www.hermosillo.gob.mx",
      description: "Portal oficial del Municipio"
    },
    { 
      name: "Congreso del Estado de Sonora", 
      url: "https://www.congresoson.gob.mx",
      description: "Leyes y reglamentos de tránsito"
    },
  ];

  const socialLinks = [
    { icon: Github, url: "https://github.com/helenaMGV/hmobility-safe-streets", label: "GitHub" },
    { icon: Twitter, url: "#", label: "Twitter" },
    { icon: Linkedin, url: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-card border-t-2 border-primary/10 mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand + Newsletter */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img src={logoSrc} alt="HMObility" className="h-12 w-auto group-hover:scale-110 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              El primer Sistema Operativo de Movilidad Urbana de México. GovTech + Open Data + Vision Zero = Ciudades más seguras.
            </p>
            
            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Mantente informado</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="tu@email.com" 
                  required
                  className="flex-1 bg-background"
                />
                <Button type="submit" size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  Suscribir
                </Button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Explorar</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/mapa" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Mapa de Accidentes
                </Link>
              </li>
              <li>
                <Link 
                  to="/juego" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Juego Educativo
                </Link>
              </li>
              <li>
                <Link 
                  to="/acerca-de" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h3 className="font-bold mb-4">Recursos Oficiales</h3>
            <ul className="space-y-3">
              {externalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-smooth group flex items-start gap-2"
                  >
                    <ExternalLink className="w-3 h-3 mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} HMObility • Hecho en Hermosillo, Sonora
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-muted-foreground hover:text-primary transition-smooth transform hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="mailto:info@hmobility.edu.mx"
                className="hover:text-primary transition-smooth flex items-center gap-1"
              >
                <Mail className="w-3 h-3" />
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
