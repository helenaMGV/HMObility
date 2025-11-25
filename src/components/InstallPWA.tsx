import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { toast } from "sonner";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show prompt immediately - wait for user interaction
      const hasSeenPrompt = localStorage.getItem("pwa-prompt-seen");
      if (!hasSeenPrompt) {
        // Show after 30 seconds of page load
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 30000);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("✅ PWA ya está instalada");
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.error("La instalación no está disponible en este momento");
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        toast.success("¡Gracias por instalar HMObility! 🚦");
        localStorage.setItem("pwa-prompt-seen", "true");
      } else {
        toast.info("Puedes instalar la app en cualquier momento desde el menú");
      }

      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error("Error al instalar PWA:", error);
      toast.error("Error al intentar instalar la aplicación");
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem("pwa-prompt-seen", "true");
    toast.info("Puedes instalar HMObility más tarde desde tu navegador");
  };

  if (!showInstallPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slideUp">
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 rounded-lg shadow-2xl p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-white rounded-lg p-2 shrink-0">
            <Download className="w-6 h-6 text-orange-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-1">
              Instalar HMObility
            </h3>
            <p className="text-white/90 text-sm mb-3">
              Accede más rápido a mapas, juegos y datos de movilidad. Sin usar espacio del navegador.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
                size="sm"
              >
                Instalar App
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/20"
                size="sm"
              >
                Ahora no
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20">
          <ul className="text-white/80 text-xs space-y-1">
            <li>✓ Funciona sin conexión</li>
            <li>✓ Acceso rápido desde tu pantalla de inicio</li>
            <li>✓ Recibe notificaciones de alertas viales</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
