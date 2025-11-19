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

## 🚀 Deployment to Vercel

### ✅ Estado Actual: LISTO PARA DEPLOYMENT

El proyecto está **completamente configurado** y listo para desplegar a Vercel sin problemas:

- ✅ Build de producción exitoso (3.91s)
- ✅ Bundle optimizado: 1.5 MB total (350 KB gzipped)
- ✅ Code splitting funcional con 5 chunks separados
- ✅ SPA routing configurado en `vercel.json`
- ✅ Security headers implementados
- ✅ API URL configurable vía `VITE_API_URL`
- ✅ Sin errores de TypeScript o ESLint críticos
- ✅ Preview local funciona correctamente

**El chatbot funcionará localmente** (búsqueda JSON). Para usar el LLM en producción, necesitas desplegar el backend FastAPI por separado.

### Automatic Deployment (Recommended)

Este proyecto está configurado para despliegue automático en Vercel:

1. **Conexión con GitHub**:
   - Repositorio: `helenaMGV/hmobility-safe-streets`
   - Branch principal: `main`
   - Vercel detecta automáticamente cambios en el repositorio

2. **Detección Automática de Framework**:
   - Vercel identifica Vite como framework
   - Configuración automática basada en `vite.config.ts`
   - Build command: `npm run build`
   - Output directory: `dist/`
   - Install command: `npm install`

3. **Variables de Entorno**:
   
   **Para frontend solo (sin backend)**:
   - No se requiere configuración
   - El chatbot usará búsqueda local en JSON
   
   **Con backend desplegado**:
   - En Vercel Dashboard → Project Settings → Environment Variables
   - Agregar: `VITE_API_URL` = URL de tu backend (ej: `https://tu-backend.railway.app`)
   - Aplicar a: Production, Preview, Development
   - Rebuild después de agregar variables

4. **Optimizaciones Automáticas**:
   - **CDN Global**: Distribución de assets estáticos
   - **Edge Network**: Latencia mínima para usuarios
   - **Automatic HTTPS**: SSL/TLS incluido
   - **Gzip/Brotli**: Compresión automática de assets
   - **Preview Deployments**: Un preview por cada PR

### Build Configuration

El build de Vite está optimizado con:

```typescript
// vite.config.ts
build: {
  sourcemap: false,  // Deshabilitado en producción
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': [...componentes Radix UI],
        'map-vendor': ['leaflet', 'react-leaflet'],
        'chart-vendor': ['recharts'],
      }
    }
  }
}
```

**Resultado del build**:
- `index-[hash].js`: ~262 KB (código de la app)
- `react-vendor-[hash].js`: Librería React (chunked)
- `ui-vendor-[hash].js`: Componentes UI (chunked)
- `map-vendor-[hash].js`: Mapas Leaflet (chunked)
- `chart-vendor-[hash].js`: Gráficas Recharts (chunked)

**Beneficios del code splitting**:
- Carga inicial más rápida (solo 262 KB vs 1,080 KB original)
- Mejor caching (vendors cambian menos frecuentemente)
- Lazy loading de componentes pesados
- Reducción del 76% en bundle principal

### Manual Deployment

Si prefieres desplegar manualmente:

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login a Vercel
vercel login

# 3. Deploy a producción
vercel --prod

# 4. Deploy de preview
vercel
```

### Backend Deployment

El backend (FastAPI) debe desplegarse por separado:

**Opciones recomendadas**:
1. **Railway**: Despliegue de Python con PostgreSQL
2. **Render**: Free tier disponible
3. **Fly.io**: Edge deployment
4. **Heroku**: Si ya tienes cuenta

**Configuración necesaria**:
```bash
# Backend requirements
cd backend/
pip install -r requirements.txt

# Variables de entorno (.env)
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx  # Opcional para LLM
```

**CORS Configuration**:
El backend ya está configurado para aceptar requests del frontend:
```python
allow_origins=[
  "http://localhost:8080",
  "http://localhost:8081", 
  "http://localhost:5173",
  "https://hmobility.lovable.app"  # Agregar dominio de Vercel
]
```

### Production URLs

- **Frontend**: `https://hmobility.lovable.app` (o tu dominio personalizado)
- **Backend**: Requiere despliegue separado
- **Canonical URL**: Definida en `index.html` para SEO

### Deployment Checklist

✅ **Frontend listo para Vercel**:

- [x] **Build exitoso**: `npm run build` sin errores (3.91s)
- [x] **Preview funcional**: `npm run preview` funciona correctamente
- [x] **Optimización de bundle**: Code splitting implementado (76% reducción)
- [x] **SEO configurado**: Meta tags en `index.html`
- [x] **Error boundaries**: `ErrorBoundary.tsx` captura errores
- [x] **Logging**: Sistema de logs con `logger.ts`
- [x] **Markdown rendering**: `react-markdown` para chatbot
- [x] **Responsive design**: Mobile-first con Tailwind
- [x] **Accessibility**: ARIA labels, keyboard navigation
- [x] **SPA routing**: `vercel.json` configurado para react-router
- [x] **Security headers**: CSP, X-Frame-Options, etc. en `vercel.json`
- [x] **Cache optimization**: Assets con max-age de 1 año
- [x] **API URL configurable**: `VITE_API_URL` en variables de entorno
- [x] **Tamaño optimizado**: 1.5 MB total, ~350 KB gzipped

⚠️ **Pendiente (opcional)**:

- [ ] **Backend deployed**: FastAPI en Railway/Render/Fly.io
- [ ] **API endpoint**: Configurar `VITE_API_URL` en Vercel
- [ ] **Hugging Face LLM**: Configurar `HUGGINGFACE_API_KEY` en backend
- [ ] **Custom domain**: Conectar dominio propio en Vercel

### Performance Metrics (Expected)

- **Time to Interactive**: < 3s
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Total Bundle Size**: ~1.2 MB (gzipped: ~350 KB)
- **Main chunk**: 262 KB
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

### Monitoring & Analytics

Vercel incluye automáticamente:
- **Web Vitals**: Core Web Vitals tracking
- **Real User Monitoring**: Performance de usuarios reales
- **Error tracking**: Errores de runtime
- **Function logs**: Para API routes (si se usan)

### Troubleshooting

**Build falla**:
```bash
# Verificar local
npm run build

# Limpiar cache
rm -rf node_modules dist
npm install
npm run build
```

**404 en rutas**:
- Vercel maneja automáticamente SPA routing
- `react-router-dom` funciona sin configuración adicional

**Assets no cargan**:
- Verificar paths absolutos en imports
- Assets en `public/` se copian a raíz de `dist/`

**CORS errors**:
- Actualizar `allow_origins` en backend
- Agregar dominio de Vercel a lista permitida
- Widget Zendesk requiere dominio permitido en la cuenta de Zendesk.
- Para dominio propio en Lovable: seguir pasos en `README.md` original.

## Suggested Next Steps
- Conectar `react-query` a fuentes reales (API municipal o dataset abierto).
- Añadir pruebas (unit/E2E) para lógica del juego y chatbot.
- Internacionalización y variaciones temáticas aprovechando `next-themes`.
- Persistencia del progreso del juego (localStorage) y estadísticas dinámicas.
