import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ZendeskWidget from "./components/ZendeskWidget";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker for PWA
if ("serviceWorker" in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      if (confirm("Nueva versión disponible. ¿Actualizar ahora?")) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.log("✅ App lista para funcionar sin conexión");
    },
    onRegisteredSW(swUrl, registration) {
      console.log(`✅ Service Worker registrado: ${swUrl}`);
      
      // Check for updates every hour
      if (registration) {
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error("❌ Error registrando Service Worker:", error);
    },
  });
}

createRoot(document.getElementById("root")!).render(
	<>
		<ZendeskWidget />
		<App />
	</>
);
