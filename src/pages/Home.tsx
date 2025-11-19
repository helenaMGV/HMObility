import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PortalsSection from "@/components/PortalsSection";
import CityStats from "@/components/CityStats";
import FeaturesGrid from "@/components/FeaturesGrid";
import Dashboard from "@/components/Dashboard";
import Statistics from "@/components/Statistics";
import LiveNotifications from "@/components/LiveNotifications";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main>
        <HeroSection />
        
        {/* Portals Section - 3 access points */}
        <div id="portals">
          <PortalsSection />
        </div>
        
        {/* City Statistics */}
        <CityStats />
        
        {/* Features Grid - Platform capabilities */}
        <div id="features">
          <FeaturesGrid />
        </div>
        
        {/* New: Animated Mobility Simulator Section */}
        <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                  Simulador Animado de Movilidad
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Explora escenarios de movilidad urbana con vehículos animados en tiempo real sobre el mapa de Hermosillo
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Escenarios Múltiples</h3>
                        <p className="text-sm text-muted-foreground">
                          Red actual, optimizada y eventos especiales con rutas ajustadas
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Animación en Tiempo Real</h3>
                        <p className="text-sm text-muted-foreground">
                          Vehículos animados con velocidades reales y control de reproducción
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">Optimización con IA</h3>
                        <p className="text-sm text-muted-foreground">
                          Calcula rutas óptimas según tiempo, congestión o sustentabilidad
                        </p>
                      </div>
                    </div>
                  </div>

                  <a 
                    href="/mapa-animado" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    Abrir Simulador
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl overflow-hidden border-2 border-primary/20 shadow-2xl">
                    <img 
                      src="/datajson/screenshot-simulator.png" 
                      alt="Simulador de movilidad" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback: mostrar placeholder con gradiente y texto
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="flex items-center justify-center h-full bg-gradient-to-br from-primary/10 to-secondary/10">
                              <div class="text-center space-y-4 p-8">
                                <div class="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                  <svg class="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                </div>
                                <div class="text-lg font-semibold">Simulador de Rutas</div>
                                <div class="text-sm text-muted-foreground">Vehículos animados en tiempo real</div>
                              </div>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full blur-3xl opacity-50 -z-10" />
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-secondary to-accent rounded-full blur-3xl opacity-50 -z-10" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Datos Abiertos de Infraestructura */}
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full mb-4">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Transparencia y Datos Abiertos</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
                  Infraestructura Vial Pública
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Accede a estadísticas detalladas de la red vial de Hermosillo basadas en datos reales de OpenStreetMap
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Columna izquierda: Estadísticas */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-green-900 dark:text-green-100">
                          Datos Verificados OSM
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                          1,402 puntos de infraestructura mapeados y verificados de la red vial urbana
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/50 dark:bg-black/30 rounded p-2">
                            <p className="font-semibold">112</p>
                            <p className="text-muted-foreground">Semáforos</p>
                          </div>
                          <div className="bg-white/50 dark:bg-black/30 rounded p-2">
                            <p className="font-semibold">233</p>
                            <p className="text-muted-foreground">Cruces</p>
                          </div>
                          <div className="bg-white/50 dark:bg-black/30 rounded p-2">
                            <p className="font-semibold">39</p>
                            <p className="text-muted-foreground">Ciclovías</p>
                          </div>
                          <div className="bg-white/50 dark:bg-black/30 rounded p-2">
                            <p className="font-semibold">1,018</p>
                            <p className="text-muted-foreground">Calles</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-600 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-blue-900 dark:text-blue-100">
                          Análisis por Zonas
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Gráficas interactivas, mapas de calor y análisis de riesgo por sector urbano
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: CTA y beneficios */}
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border-2 border-border">
                    <h3 className="font-bold text-xl mb-4">Acceso Público</h3>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Visualiza estadísticas en tiempo real de la infraestructura vial</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Compara zonas urbanas y niveles de riesgo por sector</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Descarga datasets completos para investigación</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Información verificada y actualizada desde OpenStreetMap</span>
                      </li>
                    </ul>

                    <a 
                      href="/infraestructura" 
                      className="block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Ver Estadísticas Completas
                    </a>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-950 dark:to-pink-900 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-1">
                          Datos Abiertos
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          Toda la información es de dominio público bajo licencia ODbL. 
                          Úsala libremente para análisis, visualizaciones o aplicaciones.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dashboard Overview */}
        <Dashboard />
        
        {/* Statistics & Analytics */}
        <Statistics />
      </main>
      <Footer />
      
      {/* Live Notifications - Real-time alerts */}
      <LiveNotifications />
      
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Home;
