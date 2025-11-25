import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import ErrorBoundary from "@/lib/errorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";
import { InstallPWA } from "@/components/InstallPWA";

// Log app initialization
logger.info('HMObility Safe Streets v3.6.0 initialized', {
  environment: import.meta.env.MODE,
  timestamp: new Date().toISOString(),
});

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const GobiernoDashboard = lazy(() => import("./pages/GobiernoDashboard"));
const CitizenReportsPage = lazy(() => import("./pages/CitizenReportsPage"));
const CitizenPanel = lazy(() => import("./pages/CitizenPanel"));
const GamePage = lazy(() => import("./pages/GamePage"));
const JuegoSemaforo = lazy(() => import("./pages/JuegoSemaforo"));
const JuegoCruce = lazy(() => import("./pages/JuegoCruce"));
const JuegoChoque = lazy(() => import("./pages/JuegoChoque"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const MapPage = lazy(() => import("./pages/MapPage"));
const AnimatedMapPage = lazy(() => import("./pages/AnimatedMapPage"));
const InfrastructurePage = lazy(() => import("./pages/InfrastructurePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
      <p className="text-muted-foreground">Cargando...</p>
    </div>
  </div>
);

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPWA />
          <BrowserRouter>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/gobierno" element={<GobiernoDashboard />} />
                <Route path="/reportes" element={<CitizenReportsPage />} />
                <Route path="/mi-panel" element={<CitizenPanel />} />
                <Route path="/juego" element={<GamePage />} />
                <Route path="/juego/semaforo" element={<JuegoSemaforo />} />
                <Route path="/juego/cruce" element={<JuegoCruce />} />
                <Route path="/juego/choque" element={<JuegoChoque />} />
                <Route path="/mapa" element={<MapPage />} />
                <Route path="/mapa-animado" element={<AnimatedMapPage />} />
                <Route path="/infraestructura" element={<InfrastructurePage />} />
                <Route path="/acerca-de" element={<AboutPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
      </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
