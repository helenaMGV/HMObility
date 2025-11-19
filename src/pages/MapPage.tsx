import { useState } from "react";
import Navbar from "@/components/Navbar";
import AccidentsMap from "@/components/AccidentsMap";
import InfrastructureStats from "@/components/InfrastructureStats";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";

interface InfraStats {
  semaforos: number;
  cruces: number;
  ciclovias: number;
  calles: number;
  zonas: Array<{
    nombre: string;
    semaforos: number;
    cruces: number;
    riesgo: 'bajo' | 'medio' | 'alto';
  }>;
}

const MapPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [infraStats, setInfraStats] = useState<InfraStats | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main className="container mx-auto px-4 py-16 space-y-8">
        {/* Sección de mapa */}
        <div>
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">Mapa de Accidentes e Infraestructura</h1>
            <p className="text-muted-foreground">
              Visualiza accidentes reportados y datos reales de infraestructura vial de OpenStreetMap
            </p>
          </div>
          <AccidentsMap onStatsUpdate={setInfraStats} />
        </div>

        {/* Sección de estadísticas */}
        {infraStats && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-2">Análisis de Infraestructura Vial</h2>
              <p className="text-muted-foreground">
                Estadísticas detalladas basadas en datos de OpenStreetMap
              </p>
            </div>
            <InfrastructureStats stats={infraStats} />
          </div>
        )}
      </main>
      <Footer />
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default MapPage;
