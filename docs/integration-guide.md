# Guía de integración: Zendesk Widget y Hero Section

Esta guía explica, paso a paso, los cambios que realicé en este repositorio para integrar el snippet de Zendesk (widget) en `index.html` y cómo está implementada la `Hero` section (archivo `src/components/Hero.tsx`). Está escrita para que otro Copilot o desarrollador pueda replicarla en otro repo.

---

## Resumen rápido

- Añadí el snippet de Zendesk en `index.html` (antes de `</body>`).
- La `Hero` section se encuentra en `src/components/Hero.tsx` e incluye imagen de fondo, logo, botones y estadísticas.
- Incluyo recomendaciones de CSP, carga dinámica, pruebas locales y uso de la API `zE` de Zendesk.

---

## Archivos involucrados

- `index.html` — inserté el snippet del widget de Zendesk.
- `src/components/Hero.tsx` — componente React que muestra la sección hero.
- `src/assets/hero-hermosillo.jpg` — imagen de fondo (referencia en `Hero.tsx`).
- `src/assets/hermobot-logo.png` — logo utilizado por `Hero.tsx`.

> Nota: asegúrate de copiar también las imágenes a `src/assets/` si estás replicando esto en otro repo.

---

## 1) Cambios en `index.html`

1. Abre `index.html` en la raíz del proyecto.
2. Inserta el siguiente snippet justo antes del cierre de `</body>` (la razón: cargar el widget en todas las rutas de la SPA):

```html
<!-- Start of Zendesk Widget script -->
<script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=ee3ea3de-d612-4581-9d3c-d95aa907868e"></script>
<!-- End of Zendesk Widget script -->
```

3. Guardar y reconstruir / reiniciar servidor de desarrollo.

### Alternativa (carga dinámica)
Si prefieres no inyectar el script directamente en HTML (útil para SPA o para usar distintas keys por entorno), carga el script desde JS cuando el usuario abra el chat o en el montaje de un componente:

```js
function loadZendesk(key) {
  if (document.getElementById('ze-snippet')) return;
  const s = document.createElement('script');
  s.id = 'ze-snippet';
  s.src = `https://static.zdassets.com/ekr/snippet.js?key=${key}`;
  document.body.appendChild(s);
}

// ejemplo: loadZendesk(import.meta.env.VITE_ZENDESK_KEY)
```

### Seguridad (CSP)
Si tu sitio aplica Content Security Policy, añade las siguientes reglas para permitir la carga del widget:

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self' https://static.zdassets.com;
  connect-src 'self' https://*.zdassets.com https://*.zendesk.com;
  img-src 'self' https://*.zdassets.com https://*.zendesk.com data:;
  frame-src https://*.zendesk.com;
```

Ajusta según tus necesidades.

---

## 2) Hero section — `src/components/Hero.tsx`

A continuación el contenido del componente `Hero.tsx` tal como está en este repo (copia lista para pegar en otro proyecto con Vite + React + TypeScript):

```tsx
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-hermosillo.jpg";
import hermobotLogo from "@/assets/hermobot-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
      
      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        <div className="mb-8 animate-fade-in">
          <img 
            src={hermobotLogo} 
            alt="Hermobot - Tu asistente digital de Hermosillo" 
            className="h-32 md:h-40 mx-auto"
          />
        </div>
        
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-secondary/10 backdrop-blur-sm animate-fade-in border border-secondary/20">
          <span className="text-sm font-medium text-foreground">Tu asistente digital oficial</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight">
          La información de tu ciudad,{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            al alcance de un mensaje
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
          Tu asistente digital para entender Hermosillo. Información clara, rápida y accesible sobre tu ciudad.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.5)] hover:shadow-[0_15px_50px_-10px_hsl(var(--primary)/0.6)] transition-all duration-300"
          >
            Prueba Hermobot
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 border-2 hover:bg-secondary/50 transition-all duration-300"
          >
            Conoce más
          </Button>
        </div>
        
        <div className="mt-16 flex justify-center gap-12 text-center animate-fade-in">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Disponible siempre</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">+100</div>
            <div className="text-sm text-muted-foreground">Servicios disponibles</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Gratis</div>
            <div className="text-sm text-muted-foreground">Para todos</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

### Dependencias / requisitos

- Tailwind CSS para las clases utilitarias (el proyecto usa Tailwind).
- Un componente `Button` reutilizable en `@/components/ui/button` (si no existe, reemplazar por un `button` estándar).
- `lucide-react` para los íconos (o cambiar por el paquete de íconos que uses).
- Las imágenes deben estar en `src/assets/` o ajustar las rutas de import.

---

## 3) Comprobaciones locales (cómo verificar)

1. Instala dependencias e inicia dev server (en este repo usamos `pnpm`, pero puedes usar `npm`/`yarn`):

```bash
pnpm install
pnpm dev
```

2. Abre `http://localhost:8080/` (o la dirección que tu Vite muestre).
3. Verifica que:
   - La `Hero` se ve con el fondo y el logo.
   - En la pestaña Network la URL `https://static.zdassets.com/ekr/snippet.js?key=...` se ha solicitado.
   - En la consola no aparecen errores relacionados con CSP o carga del script.

---

## 4) Uso de la API `zE` (control desde app)

Cuando el snippet carga, la API global `zE` está disponible. Ejemplos:

```js
// abrir el widget
window.zE && window.zE('webWidget', 'open');

// cerrar
window.zE && window.zE('webWidget', 'close');

// setear sugerencias del help center
window.zE && window.zE('webWidget', 'helpCenter:setSuggestions', { ids: [12345] });
```

Recomendación: agrégale un `waitForZendesk` para asegurarte que `zE` esté definida antes de llamar:

```js
function waitForZendesk(cb) {
  if (window.zE) return cb();
  setTimeout(() => waitForZendesk(cb), 100);
}

waitForZendesk(() => window.zE('webWidget', 'open'));
```

---

## 5) Multi-entorno y mejores prácticas

- No embebas keys públicas en repositorios públicos. Usa variables de entorno al build time y escribe el script dinámicamente si necesitas cambiar la key por entorno.
- Considera cargar el widget bajo demanda para mejorar la performance inicial.
- Revisa cómo Zendesk maneja datos de usuarios si tu aplicación envía datos (privacidad y cumplimiento).

---

## 6) Checklist rápido para otro Copilot

- [ ] Copiar `Hero.tsx` a `src/components/`.
- [ ] Copiar `hero-hermosillo.jpg` y `hermobot-logo.png` a `src/assets/` o actualizar imports.
- [ ] Insertar snippet Zendesk en `index.html` o implementar `loadZendesk(KEY)`.
- [ ] Añadir/ajustar CSP si aplica.
- [ ] Levantar servidor y verificar en `http://localhost:8080/`.

---

## 7) Preguntas frecuentes / debugging

- "El widget no aparece": comprueba adblockers, CSP y que el script se descargue (Network). Revisa la consola por errores.
- "window.zE es undefined": el script no ha cargado completamente; usa `waitForZendesk` o maneja la carga dinámica.
- "Key inválida": revisa la key en la cuenta de Zendesk o el Admin > Canales > Web Widget.

---

Si quieres, puedo:

- Añadir un componente React `src/components/ZendeskWidget.tsx` que cargue el script dinámicamente y exporte helpers para abrir/close.
- Hacer un commit automático con el archivo `docs/integration-guide.md` (ya creado).

Dime si quieres que implemente el componente React también.
