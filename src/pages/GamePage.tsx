import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gamepad2, 
  Brain, 
  Trophy, 
  TrafficCone, 
  Users, 
  Car, 
  Wine, 
  AlertTriangle,
  Play,
  Lock
} from "lucide-react";

// Game configurations
const games = [
  {
    id: "semaforo",
    title: "Juego del Semáforo",
    description: "Aprende el significado de cada luz y cuándo actuar correctamente",
    icon: TrafficCone,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    difficulty: "Fácil",
    duration: "3-5 min",
    points: "100 pts",
    available: true,
    route: "/juego/semaforo",
  },
  {
    id: "cruce",
    title: "Cruce Peatonal Seguro",
    description: "Practica cómo cruzar la calle de forma segura como peatón o ciclista",
    icon: Users,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    difficulty: "Fácil",
    duration: "4-6 min",
    points: "150 pts",
    available: true,
    route: "/juego/cruce",
  },
  {
    id: "choque",
    title: "Protocolo Post-Choque",
    description: "Aprende qué hacer paso a paso después de un accidente vehicular",
    icon: Car,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    difficulty: "Medio",
    duration: "5-8 min",
    points: "200 pts",
    available: true,
    route: "/juego/choque",
  },
  {
    id: "alcoholimetro",
    title: "Alcoholímetro Responsable",
    description: "Comprende los efectos del alcohol y la importancia de no conducir bajo influencia",
    icon: Wine,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    difficulty: "Medio",
    duration: "6-8 min",
    points: "250 pts",
    available: false,
    route: "/juego/alcoholimetro",
  },
  {
    id: "quiz",
    title: "Quiz del Reglamento",
    description: "Pon a prueba tus conocimientos sobre las leyes de tránsito",
    icon: AlertTriangle,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    difficulty: "Difícil",
    duration: "10-15 min",
    points: "300 pts",
    available: false,
    route: "/juego/quiz",
  },
];

const GamePage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      
      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Juegos Educativos de Seguridad Vial
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Aprende sobre seguridad vial y leyes de tránsito de forma interactiva y divertida
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Aprende Jugando</h3>
              <p className="text-sm text-muted-foreground">
                Escenarios reales con explicaciones detalladas
              </p>
            </div>
            
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Trophy className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Sistema de Puntos</h3>
              <p className="text-sm text-muted-foreground">
                Acumula puntos y compite en el ranking
              </p>
            </div>
            
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">5 Juegos Diferentes</h3>
              <p className="text-sm text-muted-foreground">
                Desde básico hasta avanzado
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {games.map((game) => {
            const IconComponent = game.icon;
            
            return (
              <Card 
                key={game.id} 
                className={`group hover:shadow-lg transition-all duration-300 ${
                  !game.available ? 'opacity-60' : 'hover:scale-[1.02]'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`p-3 rounded-lg ${game.bgColor}`}>
                      <IconComponent className={`w-8 h-8 ${game.color}`} />
                    </div>
                    {!game.available && (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="w-3 h-3" />
                        Próximamente
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl">{game.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {game.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">{game.difficulty}</Badge>
                    <Badge variant="outline">{game.duration}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <Trophy className="w-3 h-3" />
                      {game.points}
                    </Badge>
                  </div>

                  {game.available ? (
                    <Link to={game.route}>
                      <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                        <Play className="w-4 h-4" />
                        Jugar Ahora
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled className="w-full gap-2">
                      <Lock className="w-4 h-4" />
                      Disponible Pronto
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon Badge */}
        <div className="text-center mt-12">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            Más juegos en desarrollo • Próxima actualización: Diciembre 2025
          </Badge>
        </div>
      </main>

      <Footer />
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default GamePage;
