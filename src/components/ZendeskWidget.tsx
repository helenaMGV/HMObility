import { useEffect } from "react";

// The user provided this standalone URL (may contain fragment params):
const PROVIDED_URL =
  "https://static.zdassets.com/agent/assets/react/js/standalone.87dc5ffb..html#key=0fe323dd-48d1-484a-9aac-a3092565b73e&instructionsHeader=Utilice+este+widget+de+chat+para+probar+su+agente+IA&instructionsDescription=Su+agente+IA+responde+en+funci%C3%B3n+del+conocimiento+proporcionado+por+usted+o+su+equipo.+Agregue+m%C3%A1s+conocimiento+en+su+cuenta+de+Zendesk+para+seguir+mejorando+las+respuestas+del+agente+IA.&dir=ltr&locale=es-419&hasCustomLauncher=none&title=Vista+previa+agente+IA";

function waitForZendesk(cb: () => void, attempts = 0) {
  if ((window as any).zE) return cb();
  if (attempts > 50) return; // ~5s max
  setTimeout(() => waitForZendesk(cb, attempts + 1), 100);
}

function parseFragmentParams(url: string) {
  try {
    const hash = new URL(url).hash || ""; // includes leading '#'
    if (!hash) return new URLSearchParams();
    const fragment = hash.startsWith("#") ? hash.slice(1) : hash;
    return new URLSearchParams(fragment);
  } catch (e) {
    // Fallback: try to split on '#'
    const idx = url.indexOf("#");
    if (idx === -1) return new URLSearchParams();
    return new URLSearchParams(url.slice(idx + 1));
  }
}

export default function ZendeskWidget() {
  useEffect(() => {
    if (document.getElementById("zendesk-widget-script")) return;

    const params = parseFragmentParams(PROVIDED_URL);
    const key = params.get("key");
    const locale = params.get("locale");
    const instructionsHeader = params.get("instructionsHeader");
    const instructionsDescription = params.get("instructionsDescription");

    // If locale or instruction texts are present, predefine zESettings so the
    // snippet picks them up during initialization.
    if (locale || instructionsHeader || instructionsDescription) {
      (window as any).zESettings = (window as any).zESettings || {};
      (window as any).zESettings.webWidget = (window as any).zESettings.webWidget || {};
      if (locale) (window as any).zESettings.webWidget.locale = locale;
      // Put instructions into launcher or offset config if present
      if (instructionsHeader || instructionsDescription) {
        (window as any).zESettings.webWidget.contactForm =
          (window as any).zESettings.webWidget.contactForm || {};
        // These are not official zESettings keys, but setting them can help
        // if Zendesk expects these fields in the environment used to build the standalone.
        (window as any).zESettings.webWidget.instructionsHeader = instructionsHeader;
        (window as any).zESettings.webWidget.instructionsDescription = instructionsDescription;
      }
    }

    // Prefer loading the standard ekr snippet if we have a key
    const ekrUrl = key
      ? `https://static.zdassets.com/ekr/snippet.js?key=${encodeURIComponent(key)}`
      : null;

    const script = document.createElement("script");
    script.id = "zendesk-widget-script";
    script.async = true;

    script.onload = () => {
      waitForZendesk(() => {
        console.info("Zendesk script loaded and zE available");
      });
    };
    script.onerror = (ev) => console.error("Failed to load Zendesk script", ev);

    // If we could extract a key, load the ekr snippet (recommended). Otherwise
    // fall back to loading the provided standalone URL directly.
    script.src = ekrUrl || PROVIDED_URL;

    document.body.appendChild(script);

    return () => {
      // Not removing the script by default to avoid interfering with dev HMR
    };
  }, []);

  return null;
}
