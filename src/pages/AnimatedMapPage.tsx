import { useState } from 'react';
import { AnimationProvider } from '@/contexts/AnimationContext';
import AnimatedMobilityMap from '@/components/AnimatedMobilityMap';
import ScenarioSelector from '@/components/ScenarioSelector';
import RouteOptimizerPanel from '@/components/RouteOptimizerPanel';
import TimelineController from '@/components/TimelineController';
import DataSourceSelector from '@/components/DataSourceSelector';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AnimatedMapPage = () => {
  const [useRealData, setUseRealData] = useState(false);

  return (
    <AnimationProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Simulador de Movilidad Urbana
            </h1>
            <p className="text-muted-foreground">
              Visualiza rutas animadas en tiempo real y explora diferentes escenarios de movilidad
            </p>
          </div>

          {/* Layout 3 columnas en desktop, stack en móvil */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Columna izquierda: Selector de escenario */}
            <div className="lg:col-span-3 space-y-4">
              <DataSourceSelector useRealData={useRealData} onToggle={setUseRealData} />
              <ScenarioSelector />
            </div>

            {/* Columna central: Mapa animado */}
            <div className="lg:col-span-6">
              <div className="bg-card rounded-lg border shadow-lg overflow-hidden h-[600px] lg:h-[700px]">
                <AnimatedMobilityMap useRealData={useRealData} />
              </div>
            </div>

            {/* Columna derecha: Optimizador y controles */}
            <div className="lg:col-span-3 space-y-4">
              <RouteOptimizerPanel />
              <TimelineController />
            </div>
          </div>

          {/* Info adicional */}
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 text-blue-900 dark:text-blue-100">
                🚌 Transporte Público
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Simula rutas de camiones con velocidades reales y patrones de tráfico
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 text-green-900 dark:text-green-100">
                🤖 Optimización IA
              </h3>
              <p className="text-xs text-green-800 dark:text-green-200">
                Calcula escenarios óptimos basados en datos históricos y algoritmos avanzados
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 text-orange-900 dark:text-orange-100">
                📅 Eventos Especiales
              </h3>
              <p className="text-xs text-orange-800 dark:text-orange-200">
                Visualiza ajustes de rutas para eventos masivos como conciertos y partidos
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AnimationProvider>
  );
};

export default AnimatedMapPage;
