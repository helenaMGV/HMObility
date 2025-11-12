# HMObility Safe Streets – Technical Handbook

## Overview
- Plataforma educativa enfocada en cultura vial para Hermosillo y Sonora.
- Provee tablero de multas, estadísticas interactivas, mapa de velocidades y juego de aprendizaje.
- Incorpora chatbot informativo y widget de Zendesk para soporte adicional.

## Architecture & Tech Stack
- **Framework**: React 18 + TypeScript, empaquetado con Vite 5 (`@vitejs/plugin-react-swc`).
- **UI**: Tailwind CSS, shadcn/ui (Radix UI) y componentes Lucide para iconografía.
- **Estado**: React local state; `@tanstack/react-query` preparado para futuros fetchers.
- **Visualizaciones**: Recharts para gráficos de barras y pastel en `Statistics`.
- **Notificaciones**: `sonner` Toaster y sistema propio (`components/ui/toaster`).
- **Otras librerías**: `react-router-dom` (SPA routing), `react-hook-form`/`zod` disponibles para formularios, `embla-carousel-react` para carruseles, `next-themes` para toggles de tema.

## Getting Started
1. Requisitos: Node.js 18+ y npm.
2. Instalar dependencias: `npm install`.
3. Servidor de desarrollo: `npm run dev` (abre en `http://localhost:8080`).
4. Build producción: `npm run build` genera `/dist`.
5. Vista previa de build: `npm run preview`.
6. Linter: `npm run lint` ejecuta ESLint con config TypeScript + React Hooks.

## Project Layout
```
src/
  main.tsx           # Punto de entrada, monta Zendesk + App
  App.tsx            # Proveedor de React Query, tooltips y rutas
  pages/             # Vistas de alto nivel (Home, GamePage, AboutPage, NotFound)
  components/        # Secciones reutilizables y widgets principales
  components/ui/     # Primitivas shadcn/ui generadas
  hooks/             # Custom hooks (`useIsMobile`, `useToast`)
  lib/utils.ts       # Helper `cn` para clases condicionales
  assets/            # Imágenes (logo, hero)
public/
  robots.txt
configuration files (tailwind.config.ts, vite.config.ts, tsconfig*.json, eslint.config.js)
```

## Routing Flow (`react-router-dom`)
- `/` → `Home`: Hero, tabla de multas, estadísticas, mapa y chatbot.
- `/juego` → `GamePage`: Juego de escenarios + cards informativas.
- `/acerca-de` → `AboutPage`: Historia, misión y enlaces oficiales.
- `*` → `NotFound`: Vista 404 con regreso a inicio.
- `Navbar` coordina navegación y apertura del chatbot en cualquier página.

## Key Features & Components
- **Navbar** (`components/Navbar.tsx`)
  - Menú responsivo con enlaces destacados y botón para abrir el chatbot.
  - Usa `useLocation` para resaltar ruta activa.
- **HeroSection**
  - Imagen hero con overlay y CTA que hace scroll a la tabla de multas.
- **Dashboard**
  - Tabla de infracciones (`Table` shadcn) con dataset embebido ajustable vía props.
  - KPI cards con promedio de multas y contexto legal.
- **Statistics**
  - KPIs y gráficas (BarChart/PieChart) sobre infracciones frecuentes.
  - Colores personalizados y tooltips compatibles con tema claro/oscuro.
- **SpeedMap**
  - Lista interactiva de vialidades; abre `Dialog` con `StreetTooltip` detallado.
  - Incluye `MapLegend` sticky con semáforo de velocidades.
- **Game**
  - Quiz de 5 escenarios con puntuación acumulativa, feedback inmediato y toasts.
  - Lógica de reinicio y pantalla de resultados con medallas por desempeño.
- **Chatbot**
  - Ventana flotante controlada desde `Navbar`; FAQ por palabras clave.
  - `ScrollArea` para historial, preguntas rápidas y respuestas diferidas.
- **Footer**
  - Enlaces internos/externos, datos de contacto y sello legal.
- **ZendeskWidget**
  - Carga script externo (key incluida en hash URL). Configura `zESettings` al vuelo.
  - Añade soporte live chat sin bloquear renderizado del App.

## Styling & Theming
- Tailwind configurado con modo `class` para temas, `DM Sans` como fuente base.
- Variables CSS (`--primary`, `--background`, etc.) gestionan paleta y tonalidades.
- Animaciones personalizadas (`fade-in`, `slide-up`, `scale-in`) usadas en secciones clave.
- `cn` helper combina clases con `tailwind-merge` para evitar conflictos.

## State & Data Handling
- Estado principal administrado con `useState` dentro de cada componente.
- `QueryClientProvider` listo para futuros endpoints de datos municipales.
- Toasts: `hooks/use-toast` replica patrón de shadcn para controlar pila global.
- Juego y chatbot almacenan progreso/mensajes in-memory; no hay persistencia externa.

## Utilities & Hooks
- `useIsMobile`: escucha `matchMedia` para detectar ancho < 768 px.
- `useToast`: expone API para disparar/dismiss toasts desde cualquier componente.

## Tooling & Quality
- ESLint (`eslint.config.js`) con presets `@eslint/js`, `typescript-eslint`, hooks y React Refresh.
- Tailwind y PostCSS (autoprefixer) configurados vía `postcss.config.js`.
- `tsconfig` separado para app y Node scripts; `paths` permiten alias `@/*`.

## External Resources
- `integration-guide.md`: notas para integrar el proyecto, compatible con Lovable.
- `components.json`: inventario generado por shadcn para gestión de UI primitives.

## Deployment Notes
- Build estático apto para servicios como Vercel, Netlify o GH Pages.
- Widget Zendesk requiere dominio permitido en la cuenta de Zendesk.
- Para dominio propio en Lovable: seguir pasos en `README.md` original.

## Suggested Next Steps
- Conectar `react-query` a fuentes reales (API municipal o dataset abierto).
- Añadir pruebas (unit/E2E) para lógica del juego y chatbot.
- Internacionalización y variaciones temáticas aprovechando `next-themes`.
- Persistencia del progreso del juego (localStorage) y estadísticas dinámicas.
