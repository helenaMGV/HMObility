import { Link } from "react-router-dom";
import { ExternalLink, Mail, Phone } from "lucide-react";
import logoSrc from "@/assets/logo_hmobility.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

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

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src={logoSrc} alt="HMObility" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Fomentando la cultura vial y la conducción responsable en Hermosillo y Sonora.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/juego" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Juego Educativo
                </Link>
              </li>
              <li>
                <Link 
                  to="/acerca-de" 
                  className="text-sm text-muted-foreground hover:text-primary transition-smooth"
                >
                  Acerca de
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h3 className="font-bold mb-4">Enlaces Oficiales</h3>
            <ul className="space-y-3">
              {externalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-smooth group"
                  >
                    <ExternalLink className="w-4 h-4 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-smooth" />
                    <div>
                      <p className="font-medium">{link.name}</p>
                      <p className="text-xs">{link.description}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} HMObility. Proyecto educativo sin fines de lucro.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:info@hmobility.edu.mx"
                className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                info@hmobility.edu.mx
              </a>
              <a
                href="tel:+526621234567"
                className="text-sm text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                (662) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
