import { useState } from "react";
import Navbar from "@/components/Navbar";
import Game from "@/components/Game";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import { Gamepad2, Brain, Trophy } from "lucide-react";

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
              Juego Educativo Vial
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Pon a prueba tus conocimientos sobre leyes de tránsito y conducción responsable
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Brain className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Aprende Jugando</h3>
              <p className="text-sm text-muted-foreground">
                Escenarios reales de conducción con explicaciones detalladas
              </p>
            </div>
            
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Trophy className="w-8 h-8 text-secondary mx-auto mb-3" />
              <h3 className="font-bold mb-2">Sistema de Puntos</h3>
              <p className="text-sm text-muted-foreground">
                Acumula puntos por respuestas correctas y gana medallas
              </p>
            </div>
            
            <div className="p-6 bg-gradient-card rounded-lg shadow-card border border-border">
              <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">5 Escenarios</h3>
              <p className="text-sm text-muted-foreground">
                Situaciones comunes que enfrentas al conducir
              </p>
            </div>
          </div>
        </div>

        {/* Game Component */}
        <Game />
      </main>

      <Footer />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default GamePage;
